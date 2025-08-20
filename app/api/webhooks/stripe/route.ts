import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

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

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      
      case 'invoice.payment_succeeded':
        // Handle invoice payment succeeded if needed
        console.log('Invoice payment succeeded:', event.data.object);
        break;
      
      case 'invoice.payment_failed':
        // Handle invoice payment failed if needed
        console.log('Invoice payment failed:', event.data.object);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    const { userId, tierId, paymentFrequency } = session.metadata || {};
    
    if (!userId || !tierId) {
      console.error('Missing metadata in checkout session:', session.id);
      return;
    }

    console.log(`Processing successful checkout for user ${userId}, tier ${tierId}`);

    // Update user plan in Firebase
    const plan = tierId === 'pro' ? 'pro' : 'enterprise';
    const result = await updateUserPlanServerSide(userId, plan);
    
    if (result.success) {
      console.log(`Successfully upgraded user ${userId} to ${plan} plan`);
    } else {
      console.error(`Failed to upgrade user ${userId}:`, result.error);
    }
  } catch (error) {
    console.error('Error handling checkout session completed:', error);
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  try {
    const { userId, tierId } = subscription.metadata || {};
    
    if (!userId || !tierId) {
      console.error('Missing metadata in subscription:', subscription.id);
      return;
    }

    console.log(`Subscription created for user ${userId}, tier ${tierId}`);
    
    // Update user plan in Firebase
    const plan = tierId === 'pro' ? 'pro' : 'enterprise';
    const result = await updateUserPlanServerSide(userId, plan);
    
    if (result.success) {
      console.log(`Successfully upgraded user ${userId} to ${plan} plan`);
    } else {
      console.error(`Failed to upgrade user ${userId}:`, result.error);
    }
  } catch (error) {
    console.error('Error handling subscription created:', error);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    const { userId, tierId } = subscription.metadata || {};
    
    if (!userId || !tierId) {
      console.error('Missing metadata in subscription update:', subscription.id);
      return;
    }

    console.log(`Subscription updated for user ${userId}, tier ${tierId}`);
    
    // Handle subscription changes (upgrades/downgrades)
    if (subscription.status === 'active') {
      const plan = tierId === 'pro' ? 'pro' : 'enterprise';
      const result = await updateUserPlanServerSide(userId, plan);
      
      if (result.success) {
        console.log(`Successfully updated user ${userId} to ${plan} plan`);
      } else {
        console.error(`Failed to update user ${userId}:`, result.error);
      }
    }
  } catch (error) {
    console.error('Error handling subscription updated:', error);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    const { userId } = subscription.metadata || {};
    
    if (!userId) {
      console.error('Missing userId in subscription deletion:', subscription.id);
      return;
    }

    console.log(`Subscription deleted for user ${userId}`);
    
    // Downgrade user to free plan when subscription is cancelled
    const result = await updateUserPlanServerSide(userId, 'free');
    
    if (result.success) {
      console.log(`Successfully downgraded user ${userId} to free plan after subscription deletion`);
    } else {
      console.error(`Failed to downgrade user ${userId}:`, result.error);
    }
  } catch (error) {
    console.error('Error handling subscription deleted:', error);
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
