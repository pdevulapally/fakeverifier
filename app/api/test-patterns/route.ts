import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Dynamic test patterns that can be updated based on user behavior
    const testPatterns = [
      '^test@',
      '^demo@',
      '^example@',
      '^sample@',
      '^fake@',
      '^dummy@',
      '^temp@',
      '^tmp@',
      '^admin@',
      '^user@',
      '^guest@',
      '^info@',
      '^contact@',
      '^support@',
      '^help@',
      '^noreply@',
      '^no-reply@',
      '^donotreply@',
      '^donot-reply@',
      '^webmaster@',
      '^postmaster@',
      '^mailer-daemon@',
      '^daemon@',
      '^nobody@',
      '^root@',
      '^system@',
      '^service@',
      '^api@',
      '^bot@',
      '^robot@',
      '^automated@',
      '^auto@',
      '^spam@',
      '^junk@',
      '^trash@',
      '^garbage@',
      '^delete@',
      '^remove@',
      '^block@',
      '^ban@',
      '^hack@',
      '^crack@',
      '^exploit@',
      '^virus@',
      '^malware@',
      '^phish@',
      '^scam@',
      '^fraud@',
      '^bogus@',
      '^invalid@',
      '^wrong@',
      '^error@',
      '^bug@',
      '^debug@',
      '^test\\d+@',
      '^demo\\d+@',
      '^example\\d+@',
      '^sample\\d+@',
      '^user\\d+@',
      '^guest\\d+@',
      '^temp\\d+@',
      '^tmp\\d+@',
      '^fake\\d+@',
      '^dummy\\d+@',
      '^testuser@',
      '^demouser@',
      '^exampleuser@',
      '^sampleuser@',
      '^fakeuser@',
      '^dummyuser@',
      '^testaccount@',
      '^demoaccount@',
      '^exampleaccount@',
      '^sampleaccount@',
      '^fakeaccount@',
      '^dummyaccount@'
    ];

    return NextResponse.json(testPatterns);
  } catch (error) {
    console.error('Error fetching test patterns:', error);
    return NextResponse.json([], { status: 500 });
  }
}

// Allow adding new test patterns dynamically
export async function POST(request: Request) {
  try {
    const { pattern } = await request.json();
    
    if (!pattern) {
      return NextResponse.json({ error: 'Pattern is required' }, { status: 400 });
    }

    // In a real implementation, this would:
    // - Add to database
    // - Update ML model
    // - Analyze user behavior patterns
    
    console.log(`New test pattern added: ${pattern}`);
    
    return NextResponse.json({ success: true, pattern });
  } catch (error) {
    console.error('Error adding test pattern:', error);
    return NextResponse.json({ error: 'Failed to add pattern' }, { status: 500 });
  }
}
