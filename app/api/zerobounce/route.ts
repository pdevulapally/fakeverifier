import { NextRequest, NextResponse } from 'next/server';

// ZeroBounce.net API configuration via environment variables
const ZEROBOUNCE_API_KEY = process.env.ZEROBOUNCE_API_KEY;
const ZEROBOUNCE_API_URL = process.env.ZEROBOUNCE_API_URL || 'https://api.zerobounce.net/v2/validate';

export async function POST(request: NextRequest) {
  try {
    if (!ZEROBOUNCE_API_KEY) {
      return NextResponse.json(
        { error: 'Server misconfiguration: ZEROBOUNCE_API_KEY is not set' },
        { status: 500 }
      );
    }
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    // Basic email format validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Call ZeroBounce.net API
    const response = await fetch(`${ZEROBOUNCE_API_URL}?api_key=${ZEROBOUNCE_API_KEY}&email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'User-Agent': 'FakeVerifier/1.0'
      }
    });

    if (!response.ok) {
      console.error('ZeroBounce.net API error:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'ZeroBounce.net API request failed' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Parse and enhance ZeroBounce.net API response
    const result = {
      success: true,
      email: email,
      valid: data.status === 'valid',
      exists: data.status === 'valid',
      isDisposable: data.disposable === true,
      isRole: data.role === true,
      isFree: data.free === true,
      isEducational: data.educational === true,
      isBusiness: data.business === true,
      confidence: data.score || 0,
      message: data.message || 'Email verification completed',
      source: 'ZeroBounce.net API',
      timestamp: new Date().toISOString(),
      // Additional ZeroBounce.net specific fields
      mxRecord: data.mx_record,
      smtpServer: data.smtp_server,
      smtpCheck: data.smtp_check,
      catchAll: data.catch_all,
      validSyntax: data.valid_syntax,
      validDomain: data.valid_domain,
      validMx: data.valid_mx,
      validSmtp: data.valid_smtp,
      // ZeroBounce specific fields
      status: data.status,
      subStatus: data.sub_status,
      account: data.account,
      domain: data.domain,
      reason: data.reason,
      sendex: data.sendex,
      smtpCode: data.smtp_code,
      smtpInfo: data.smtp_info,
      smtpHost: data.smtp_host,
      firstname: data.firstname,
      lastname: data.lastname,
      gender: data.gender,
      country: data.country,
      region: data.region,
      city: data.city,
      zipcode: data.zipcode,
      processedAt: data.processed_at
    };

    console.log('ZeroBounce.net API result for', email, ':', result);

    return NextResponse.json(result);

  } catch (error) {
    console.error('ZeroBounce.net API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET method for testing
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json(
      { error: 'Email parameter is required' },
      { status: 400 }
    );
  }

  // Use POST logic for GET requests
  const mockRequest = {
    json: async () => ({ email })
  } as NextRequest;

  return POST(mockRequest);
}
