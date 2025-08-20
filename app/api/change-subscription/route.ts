import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminAuth } from '@/lib/firebase-admin';
import { adminDb } from '@/lib/firebase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Server-side function to update user plan
async function updateUserPlanServerSide(userId: string, plan: "free" | "pro" | "enterprise") {
  try {
    // Query the user's token usage document
    const tokenUsageRef = adminDb.collection('tokenUsage');
    const query = tokenUsageRef.where('userId', '==', userId).limit(1);
    const querySnapshot = await query.get();
    
    if (querySnapshot.empty) {
      // Create new token usage document if it doesn't exist
      const newTotal = plan === "free" ? 50 : plan === "pro" ? 500 : 5000;
      const defaultUsage = {
        userId: userId,
        used: 0,
        total: newTotal,
        resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        plan: plan,
        lastUpdated: new Date()
      };
      
      await tokenUsageRef.add(defaultUsage);
      return { success: true, data: defaultUsage };
    }

    const doc = querySnapshot.docs[0];
    const newTotal = plan === "free" ? 50 : plan === "pro" ? 500 : 5000;
    
    const updatedUsage = {
      plan,
      total: newTotal,
      lastUpdated: new Date()
    };

    await doc.ref.update(updatedUsage);
    return { success: true, data: { id: doc.id, ...doc.data(), ...updatedUsage } };
  } catch (error: any) {
    console.error('Error updating user plan server-side:', error);
    return { success: false, error: error.message };
  }
}

// Price IDs for different plans and frequencies
const PRICE_IDS = {
  pro: {
    monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
    yearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID,
  },
  enterprise: {
    monthly: process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID,
    yearly: process.env.STRIPE_ENTERPRISE_YEARLY_PRICE_ID,
  },
};

export async function POST(request: NextRequest) {
  try {
    // Verify the user's ID token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const { targetPlan, paymentFrequency, userEmail } = await request.json();

    if (!targetPlan || !paymentFrequency) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Find or create customer in Stripe
    let customer;
    const customers = await stripe.customers.list({
      email: userEmail,
      limit: 1,
    });

    if (customers.data.length === 0) {
      customer = await stripe.customers.create({
        email: userEmail,
        metadata: {
          userId: userId,
        },
      });
    } else {
      customer = customers.data[0];
    }

    // Get current subscription
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
      limit: 1,
    });

    const currentSubscription = subscriptions.data[0];

    if (targetPlan === 'free') {
      // Cancel subscription at period end
      if (currentSubscription) {
        await stripe.subscriptions.update(currentSubscription.id, {
          cancel_at_period_end: true,
          metadata: {
            ...currentSubscription.metadata,
            downgradedTo: 'free',
            downgradedAt: new Date().toISOString(),
          },
        });

        // Update Firebase immediately to free plan
        const result = await updateUserPlanServerSide(userId, 'free');
        if (!result.success) {
          console.error('Failed to update Firebase plan:', result.error);
        }

        return NextResponse.json({
          success: true,
          message: 'Subscription will be cancelled at the end of the current billing period',
          subscription: {
            id: currentSubscription.id,
            cancel_at_period_end: true,
            current_period_end: currentSubscription.current_period_end,
          }
        });
      } else {
        // No active subscription, just update Firebase
        const result = await updateUserPlanServerSide(userId, 'free');
        if (!result.success) {
          return NextResponse.json({ error: 'Failed to update plan' }, { status: 500 });
        }

        return NextResponse.json({
          success: true,
          message: 'Plan updated to free',
        });
      }
    } else {
      // Handle upgrade or plan change
      const priceId = PRICE_IDS[targetPlan as keyof typeof PRICE_IDS]?.[paymentFrequency as keyof typeof PRICE_IDS.pro];
      
      if (!priceId) {
        return NextResponse.json({ error: 'Invalid plan or payment frequency' }, { status: 400 });
      }

      if (!currentSubscription) {
        // Create new subscription
        const subscription = await stripe.subscriptions.create({
          customer: customer.id,
          items: [{ price: priceId }],
          metadata: {
            userId: userId,
            tierId: targetPlan,
            paymentFrequency: paymentFrequency,
          },
          payment_behavior: 'default_incomplete',
          payment_settings: { save_default_payment_method: 'on_subscription' },
          expand: ['latest_invoice.payment_intent'],
        });

        // Update Firebase
        const result = await updateUserPlanServerSide(userId, targetPlan as "pro" | "enterprise");
        if (!result.success) {
          console.error('Failed to update Firebase plan:', result.error);
        }

        return NextResponse.json({
          success: true,
          subscription: subscription,
          requiresPayment: true,
        });
      } else {
        // Update existing subscription
        const subscriptionItem = currentSubscription.items.data[0];
        
        if (subscriptionItem) {
          // Update the subscription item with new price
          await stripe.subscriptionItems.update(subscriptionItem.id, {
            price: priceId,
            metadata: {
              tierId: targetPlan,
              paymentFrequency: paymentFrequency,
            },
          });

          // Update subscription metadata
          await stripe.subscriptions.update(currentSubscription.id, {
            metadata: {
              ...currentSubscription.metadata,
              tierId: targetPlan,
              paymentFrequency: paymentFrequency,
              updatedAt: new Date().toISOString(),
            },
          });

          // Update Firebase
          const result = await updateUserPlanServerSide(userId, targetPlan as "pro" | "enterprise");
          if (!result.success) {
            console.error('Failed to update Firebase plan:', result.error);
          }

          return NextResponse.json({
            success: true,
            message: 'Subscription updated successfully',
            subscription: {
              id: currentSubscription.id,
              status: currentSubscription.status,
            }
          });
        } else {
          return NextResponse.json({ error: 'No subscription items found' }, { status: 400 });
        }
      }
    }

  } catch (error: any) {
    console.error('Error changing subscription:', error);
    return NextResponse.json(
      { error: 'Failed to change subscription: ' + error.message },
      { status: 500 }
    );
  }
}

// Block non-POST requests
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
