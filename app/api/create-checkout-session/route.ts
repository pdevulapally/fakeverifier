import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminAuth } from '@/lib/firebase-admin';

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Anti-bot measures
const BOT_DETECTION_PATTERNS = [
  /bot|crawler|spider|scraper/i,
  /curl|wget|python|java|php/i,
  /headless|puppeteer|selenium/i,
];

// Suspicious patterns
const SUSPICIOUS_PATTERNS = [
  /test.*card|fake.*card|dummy.*card/i,
  /4111111111111111|4242424242424242/i, // Common test card numbers
  /test@test\.com|fake@fake\.com/i,
];

// Rate limiting configuration
const RATE_LIMIT = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 requests per window
};

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';

    // Rate limiting check
    const now = Date.now();
    const userRateLimit = rateLimitStore.get(clientIP);
    
    if (userRateLimit && now < userRateLimit.resetTime) {
      if (userRateLimit.count >= RATE_LIMIT.maxRequests) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
      userRateLimit.count++;
    } else {
      rateLimitStore.set(clientIP, {
        count: 1,
        resetTime: now + RATE_LIMIT.windowMs,
      });
    }

    // Clean up old rate limit entries
    for (const [ip, data] of rateLimitStore.entries()) {
      if (now > data.resetTime) {
        rateLimitStore.delete(ip);
      }
    }

    // Bot detection
    const userAgent = request.headers.get('user-agent') || '';
    const isBot = BOT_DETECTION_PATTERNS.some(pattern => pattern.test(userAgent));
    
    if (isBot) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Check for required headers
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { tierId, paymentFrequency, userId, userEmail } = body;

    // Input validation
    if (!tierId || !paymentFrequency || !userId || !userEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check for suspicious patterns
    const isSuspicious = SUSPICIOUS_PATTERNS.some(pattern => 
      pattern.test(userEmail) || pattern.test(JSON.stringify(body))
    );

    if (isSuspicious) {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      );
    }

    // Validate tier ID
    const validTiers = ['pro', 'enterprise'];
    if (!validTiers.includes(tierId)) {
      return NextResponse.json(
        { error: 'Invalid tier selected' },
        { status: 400 }
      );
    }

    // Validate payment frequency
    if (!['monthly', 'yearly'].includes(paymentFrequency)) {
      return NextResponse.json(
        { error: 'Invalid payment frequency' },
        { status: 400 }
      );
    }

    // Verify user from Firebase (server-side)
    try {
      // Verify the user ID token (you'll need to pass this from the client)
      const authHeader = request.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          { error: 'Missing or invalid authorization header' },
          { status: 401 }
        );
      }
      
      const idToken = authHeader.split('Bearer ')[1];
      const decodedToken = await adminAuth.verifyIdToken(idToken);
      
      // Verify the userId matches the authenticated user
      if (decodedToken.uid !== userId) {
        return NextResponse.json(
          { error: 'User ID mismatch' },
          { status: 403 }
        );
      }
      
      // Verify the email matches
      if (decodedToken.email !== userEmail) {
        return NextResponse.json(
          { error: 'Email mismatch' },
          { status: 403 }
        );
      }
      
      console.log(`Verified user ${userId} for checkout session`);
    } catch (error: any) {
      console.error('Firebase verification error:', error);
      return NextResponse.json(
        { error: 'User verification failed' },
        { status: 401 }
      );
    }

    // Define pricing based on tier and frequency
    const pricing = {
      pro: {
        monthly: 999, // $9.99 in cents
        yearly: 799,  // $7.99 in cents
      },
      enterprise: {
        monthly: 4999, // $49.99 in cents
        yearly: 3999,  // $39.99 in cents
      },
    };

    const amount = pricing[tierId as keyof typeof pricing][paymentFrequency as keyof typeof pricing.pro];
    const interval = paymentFrequency === 'yearly' ? 'year' : 'month';

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `FakeVerifier ${tierId.charAt(0).toUpperCase() + tierId.slice(1)} Plan`,
              description: `${tierId === 'pro' ? '500' : '5000'} verification tokens per month`,
              images: ['https://your-domain.com/fakeverifier-logo.png'], // Add your logo
            },
            unit_amount: amount,
            recurring: {
              interval: interval as 'month' | 'year',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/verify?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing?canceled=true`,
      customer_email: userEmail,
      metadata: {
        userId,
        tierId,
        paymentFrequency,
        clientIP,
        userAgent: userAgent.substring(0, 200), // Limit length
      },
      billing_address_collection: 'required',
      allow_promotion_codes: true,
      subscription_data: {
        metadata: {
          userId,
          tierId,
          paymentFrequency,
        },
      },
      // Additional security measures
      payment_intent_data: {
        metadata: {
          userId,
          tierId,
          paymentFrequency,
        },
      },
    });

    // Log the session creation (in production, use proper logging)
    console.log(`Checkout session created for user ${userId}, tier ${tierId}, frequency ${paymentFrequency}`);

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });

  } catch (error: any) {
    console.error('Stripe checkout error:', error);

    // Don't expose internal errors to client
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

// Additional security: Block non-POST requests
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
