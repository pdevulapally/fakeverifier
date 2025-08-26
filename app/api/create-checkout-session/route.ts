import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminAuth } from '@/lib/firebase-admin';

// Initialize Stripe with secret key
let stripe: Stripe | null = null;
try {
  if (process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  } else {
    console.error('STRIPE_SECRET_KEY environment variable is not set');
  }
} catch (error) {
  console.error('Failed to initialize Stripe:', error);
}

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
    console.log('API route called: /api/create-checkout-session');
    
    // Simple test to see if we can reach this point
    console.log('Environment check:', {
      hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
      hasBaseUrl: !!process.env.NEXT_PUBLIC_APP_URL,
      hasFirebaseProjectId: !!process.env.FIREBASE_PROJECT_ID,
    });

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

    console.log('Request body:', { tierId, paymentFrequency, userId, userEmail });

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
      console.log('Starting Firebase verification...');
      
      // Verify the user ID token (you'll need to pass this from the client)
      const authHeader = request.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('Missing authorization header');
        return NextResponse.json(
          { error: 'Missing or invalid authorization header' },
          { status: 401 }
        );
      }
      
      const idToken = authHeader.split('Bearer ')[1];
      console.log('Got ID token, length:', idToken.length);
      
      const decodedToken = await adminAuth.verifyIdToken(idToken);
      console.log('Token verified, user ID:', decodedToken.uid);
      
      // Verify the userId matches the authenticated user
      if (decodedToken.uid !== userId) {
        console.log('User ID mismatch:', decodedToken.uid, 'vs', userId);
        return NextResponse.json(
          { error: 'User ID mismatch' },
          { status: 403 }
        );
      }
      
      // Verify the email matches
      if (decodedToken.email !== userEmail) {
        console.log('Email mismatch:', decodedToken.email, 'vs', userEmail);
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
    } as const;

    const amount = pricing[tierId as keyof typeof pricing][paymentFrequency as keyof typeof pricing.pro];
    const interval = paymentFrequency === 'yearly' ? 'year' : 'month';

    // Check if Stripe is properly initialized
    if (!stripe) {
      console.error('Stripe is not initialized - missing environment variables');
      return NextResponse.json(
        { error: 'Payment system is not configured. Please contact support.' },
        { status: 500 }
      );
    }

    // Validate and build success/cancel URLs
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!baseUrl) {
      console.error('NEXT_PUBLIC_APP_URL is not set');
      return NextResponse.json(
        { error: 'App base URL is not configured (NEXT_PUBLIC_APP_URL).' },
        { status: 500 }
      );
    }

    let successUrl: string;
    let cancelUrl: string;
    try {
      const base = new URL(baseUrl);
      const success = new URL('/verify', base);
      success.search = 'success=true&session_id={CHECKOUT_SESSION_ID}';
      const cancel = new URL('/pricing', base);
      cancel.search = 'canceled=true';
      successUrl = success.toString();
      cancelUrl = cancel.toString();
    } catch (e) {
      console.error('Invalid NEXT_PUBLIC_APP_URL value:', baseUrl);
      return NextResponse.json(
        { error: 'App base URL is invalid. Please set NEXT_PUBLIC_APP_URL to a valid URL.' },
        { status: 500 }
      );
    }

    // Create Stripe checkout session
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `FakeVerifier ${tierId.charAt(0).toUpperCase() + tierId.slice(1)} Plan`,
                description: `${tierId === 'pro' ? '500' : '5000'} verification tokens per month`,
                images: ['https://fakeverifier.co.uk/Logo%20de%20FakeVerifier.png'], // FakeVerifier logo
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
        success_url: successUrl,
        cancel_url: cancelUrl,
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
        // Removed payment_intent_data: not allowed with mode=subscription
      });

      // Log the session creation (in production, use proper logging)
      console.log(`Checkout session created for user ${userId}, tier ${tierId}, frequency ${paymentFrequency}`);

      return NextResponse.json({
        sessionId: session.id,
        url: session.url,
      });
    } catch (err: any) {
      console.error('Stripe checkout error (session.create):', {
        message: err?.message,
        type: err?.type,
        code: err?.code,
        raw: err?.raw,
      });
      const safeMsg = process.env.NODE_ENV !== 'production' && err?.message
        ? err.message
        : 'Failed to create checkout session';
      return NextResponse.json(
        { error: safeMsg },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('Stripe checkout error:', error);

    // Don't expose internal errors to client
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

// Test endpoint to verify route is accessible
export async function GET() {
  return NextResponse.json({ 
    message: 'API route is working',
    timestamp: new Date().toISOString(),
    env: {
      hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
      hasBaseUrl: !!process.env.NEXT_PUBLIC_APP_URL,
    }
  });
}

export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
