import { NextRequest, NextResponse } from 'next/server';
import dns from 'dns';
import { promisify } from 'util';

const resolveMx = promisify(dns.resolveMx);

// ZeroBounce.net API verification function using dedicated endpoint
async function verifyWithZeroBounce(email: string, baseUrl: string): Promise<{
  success: boolean;
  exists?: boolean;
  isDisposable?: boolean;
  isRole?: boolean;
  isFree?: boolean;
  isEducational?: boolean;
  isBusiness?: boolean;
  confidence?: number;
  message?: string;
  error?: string;
  mxRecord?: boolean;
  smtpCheck?: boolean;
  catchAll?: boolean;
  validSyntax?: boolean;
  validDomain?: boolean;
  validMx?: boolean;
  validSmtp?: boolean;
  status?: string;
  subStatus?: string;
  account?: string;
  domain?: string;
  reason?: string;
  sendex?: number;
  smtpCode?: string;
  smtpInfo?: string;
  smtpHost?: string;
  firstname?: string;
  lastname?: string;
  gender?: string;
  country?: string;
  region?: string;
  city?: string;
  zipcode?: string;
  processedAt?: string;
}> {
  try {
    const response = await fetch(`${baseUrl}/api/zerobounce`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    if (!response.ok) {
      console.error('ZeroBounce.net API error:', response.status, response.statusText);
      return { success: false, error: 'ZeroBounce.net API request failed' };
    }

    const data = await response.json();
    
    if (!data.success) {
      return { success: false, error: data.error || 'ZeroBounce.net API request failed' };
    }

    // Parse ZeroBounce.net API response
    const result = {
      success: true,
      exists: data.exists === true,
      isDisposable: data.isDisposable === true,
      isRole: data.isRole === true,
      isFree: data.isFree === true,
      isEducational: data.isEducational === true,
      isBusiness: data.isBusiness === true,
      confidence: data.confidence || 0,
      message: data.message || 'Email verification completed',
      mxRecord: data.mxRecord,
      smtpCheck: data.smtpCheck,
      catchAll: data.catchAll,
      validSyntax: data.validSyntax,
      validDomain: data.validDomain,
      validMx: data.validMx,
      validSmtp: data.validSmtp,
      status: data.status,
      subStatus: data.subStatus,
      account: data.account,
      domain: data.domain,
      reason: data.reason,
      sendex: data.sendex,
      smtpCode: data.smtpCode,
      smtpInfo: data.smtpInfo,
      smtpHost: data.smtpHost,
      firstname: data.firstname,
      lastname: data.lastname,
      gender: data.gender,
      country: data.country,
      region: data.region,
      city: data.city,
      zipcode: data.zipcode,
      processedAt: data.processedAt
    };

    console.log('ZeroBounce.net API result:', result);
    return result;

  } catch (error) {
    console.error('ZeroBounce.net API error:', error);
    return { success: false, error: 'ZeroBounce.net API request failed' };
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { exists: false, error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    // Basic email format validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { exists: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const domain = email.split('@')[1];

    // Derive the base URL from the incoming request to avoid hardcoded origins
    const proto = request.headers.get('x-forwarded-proto') || 'http';
    const host = request.headers.get('host');
    const baseUrl = `${proto}://${host}`;

        try {
      // First, try ZeroBounce.net API for comprehensive email verification
      const zeroBounceResult = await verifyWithZeroBounce(email, baseUrl);
      
      if (zeroBounceResult.success) {
        return NextResponse.json({
          exists: zeroBounceResult.exists,
          domain: domain,
          isDisposable: zeroBounceResult.isDisposable,
          isRole: zeroBounceResult.isRole,
          isFree: zeroBounceResult.isFree,
          isEducational: zeroBounceResult.isEducational,
          isBusiness: zeroBounceResult.isBusiness,
          confidence: zeroBounceResult.confidence,
          message: zeroBounceResult.message,
          source: 'ZeroBounce.net API',
          // Additional ZeroBounce.net specific fields
          mxRecord: zeroBounceResult.mxRecord,
          smtpCheck: zeroBounceResult.smtpCheck,
          catchAll: zeroBounceResult.catchAll,
          validSyntax: zeroBounceResult.validSyntax,
          validDomain: zeroBounceResult.validDomain,
          validMx: zeroBounceResult.validMx,
          validSmtp: zeroBounceResult.validSmtp,
          // ZeroBounce specific fields
          status: zeroBounceResult.status,
          subStatus: zeroBounceResult.subStatus,
          account: zeroBounceResult.account,
          reason: zeroBounceResult.reason,
          sendex: zeroBounceResult.sendex,
          smtpCode: zeroBounceResult.smtpCode,
          smtpInfo: zeroBounceResult.smtpInfo,
          smtpHost: zeroBounceResult.smtpHost,
          firstname: zeroBounceResult.firstname,
          lastname: zeroBounceResult.lastname,
          gender: zeroBounceResult.gender,
          country: zeroBounceResult.country,
          region: zeroBounceResult.region,
          city: zeroBounceResult.city,
          zipcode: zeroBounceResult.zipcode,
          processedAt: zeroBounceResult.processedAt
        });
      }

      // Fallback to DNS MX record check if UserCheck fails
      const mxRecords = await resolveMx(domain);

      if (!mxRecords || mxRecords.length === 0) {
        return NextResponse.json({
          exists: false,
          error: 'Domain does not have valid mail servers',
          source: 'DNS MX Check'
        });
      }

             // Additional checks for common email providers
       const commonProviders = [
         'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'live.com',
         'icloud.com', 'protonmail.com', 'tutanota.com', 'zoho.com',
         'aol.com', 'mail.com', 'gmx.com', 'yandex.com', 'mail.ru'
       ];

       // Common educational and business domain patterns
       const educationalPatterns = ['.edu', '.ac.uk', '.edu.au', '.ac.za', '.ac.in', '.edu.sg'];
       const businessPatterns = ['.com', '.co.uk', '.org', '.net', '.biz', '.co', '.io', '.tech'];

      // For common providers, we can do additional validation
      if (commonProviders.includes(domain)) {
        // For Gmail, check if the username part is reasonable
        if (domain === 'gmail.com') {
          const username = email.split('@')[0];
          
          // Gmail usernames must be 6-30 characters, alphanumeric, dots, underscores
          if (username.length < 6 || username.length > 30) {
            return NextResponse.json({
              exists: false,
              error: 'Gmail username must be between 6 and 30 characters'
            });
          }
          
          if (!/^[a-zA-Z0-9._]+$/.test(username)) {
            return NextResponse.json({
              exists: false,
              error: 'Gmail username contains invalid characters'
            });
          }
        }

        // For Yahoo, check username length
        if (domain === 'yahoo.com') {
          const username = email.split('@')[0];
          if (username.length < 4 || username.length > 32) {
            return NextResponse.json({
              exists: false,
              error: 'Yahoo username must be between 4 and 32 characters'
            });
          }
        }

        // For Outlook/Hotmail, check username length
        if (['outlook.com', 'hotmail.com', 'live.com'].includes(domain)) {
          const username = email.split('@')[0];
          if (username.length < 1 || username.length > 64) {
            return NextResponse.json({
              exists: false,
              error: 'Outlook username must be between 1 and 64 characters'
            });
          }
                 }
       }

       // Check for educational and business domains
       const isEducational = educationalPatterns.some(pattern => domain.endsWith(pattern));
       const isBusiness = businessPatterns.some(pattern => domain.endsWith(pattern));
       
       if (isEducational) {
         console.log(`Educational domain detected: ${domain}`);
       } else if (isBusiness) {
         console.log(`Business domain detected: ${domain}`);
       }

       // For now, we'll assume the email exists if the domain has valid MX records
       // In a production environment, you might want to implement SMTP verification
       // or use a third-party email verification service
      
                          return NextResponse.json({
               exists: true,
               domain: domain,
               mxRecords: mxRecords.length,
               isEducational: isEducational,
               isBusiness: isBusiness,
               message: isEducational ? 'Educational email domain appears to be valid' : 
                       isBusiness ? 'Business email domain appears to be valid' : 
                       'Email domain appears to be valid',
               source: 'DNS MX Check'
             });

    } catch (dnsError) {
      console.error('DNS resolution error:', dnsError);
      return NextResponse.json({
        exists: false,
        error: 'Unable to verify email domain'
      });
    }

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { exists: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
