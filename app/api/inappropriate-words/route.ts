import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Dynamic inappropriate words that can be updated based on content analysis
    const inappropriateWords = [
      'penis', 'dick', 'cock', 'pussy', 'vagina', 'fuck', 'shit', 'ass', 'bitch', 'whore',
      'slut', 'cunt', 'bastard', 'motherfucker', 'fucker', 'dumbass', 'idiot', 'stupid',
      'retard', 'nigger', 'nigga', 'faggot', 'dyke', 'queer', 'gay', 'lesbian', 'homo',
      'sex', 'porn', 'nude', 'naked', 'boobs', 'tits', 'asshole', 'butthole', 'anus',
      'cock', 'dickhead', 'prick', 'twat', 'wank', 'jerk', 'wanker', 'tosser', 'bellend',
      'knob', 'knobhead', 'bellend', 'willy', 'dong', 'pecker', 'johnson', 'member',
      'tool', 'rod', 'shaft', 'meat', 'sausage', 'banana', 'cucumber', 'carrot',
      'test', 'demo', 'example', 'sample', 'fake', 'dummy', 'temp', 'tmp', 'admin',
      'user', 'guest', 'info', 'contact', 'support', 'help', 'noreply', 'no-reply',
      'donotreply', 'donot-reply', 'webmaster', 'postmaster', 'mailer-daemon', 'daemon',
      'nobody', 'root', 'system', 'service', 'api', 'bot', 'robot', 'automated', 'auto',
      'spam', 'junk', 'trash', 'garbage', 'delete', 'remove', 'block', 'ban', 'hack',
      'crack', 'exploit', 'virus', 'malware', 'phish', 'scam', 'fraud', 'bogus', 'invalid',
      'wrong', 'error', 'bug', 'debug'
    ];

    return NextResponse.json(inappropriateWords);
  } catch (error) {
    console.error('Error fetching inappropriate words:', error);
    return NextResponse.json([], { status: 500 });
  }
}

// Allow adding new inappropriate words dynamically
export async function POST(request: Request) {
  try {
    const { word } = await request.json();
    
    if (!word) {
      return NextResponse.json({ error: 'Word is required' }, { status: 400 });
    }

    // In a real implementation, this would:
    // - Add to database
    // - Update content filtering model
    // - Analyze user reports and feedback
    
    console.log(`New inappropriate word added: ${word}`);
    
    return NextResponse.json({ success: true, word });
  } catch (error) {
    console.error('Error adding inappropriate word:', error);
    return NextResponse.json({ error: 'Failed to add word' }, { status: 500 });
  }
}
