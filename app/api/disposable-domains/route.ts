import { NextResponse } from 'next/server';

// This would typically fetch from an external API or database
// For now, we'll return a base list that can be updated dynamically
export async function GET() {
  try {
    // In a real implementation, this would fetch from:
    // - External disposable email API
    // - Database of known disposable domains
    // - Machine learning model predictions
    
    const disposableDomains = [
      '10minutemail.com',
      'tempmail.org',
      'guerrillamail.com',
      'mailinator.com',
      'yopmail.com',
      'throwaway.email',
      'temp-mail.org',
      'fakeinbox.com',
      'sharklasers.com',
      'getairmail.com',
      'mailnesia.com',
      'maildrop.cc',
      'mailcatch.com',
      'dispostable.com',
      'mailmetrash.com',
      'trashmail.com',
      'mailnull.com',
      'spam4.me',
      'bccto.me',
      'chacuo.net'
    ];

    return NextResponse.json(disposableDomains);
  } catch (error) {
    console.error('Error fetching disposable domains:', error);
    return NextResponse.json([], { status: 500 });
  }
}

// Allow adding new disposable domains dynamically
export async function POST(request: Request) {
  try {
    const { domain } = await request.json();
    
    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
    }

    // In a real implementation, this would:
    // - Add to database
    // - Update ML model
    // - Notify other services
    
    console.log(`New disposable domain added: ${domain}`);
    
    return NextResponse.json({ success: true, domain });
  } catch (error) {
    console.error('Error adding disposable domain:', error);
    return NextResponse.json({ error: 'Failed to add domain' }, { status: 500 });
  }
}
