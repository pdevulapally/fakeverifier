import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const { input } = await request.json();

    if (!input) {
      return NextResponse.json(
        { error: "News input is required" },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: `You are an AI assistant specialized in news verification. For each analysis, you must provide:
          1. A clear verdict (Likely Real/Likely Fake)
          2. A confidence percentage (always include a number between 0-100)
          3. Detailed explanation
          4. Sources checked` 
        },
        { role: "user", content: `Verify this news: ${input}` },
      ],
      max_tokens: 2000,
      temperature: 0.3,
    });

    const aiResponse = completion.choices[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error('No response from AI model');
    }
    
    // Extract confidence from AI response
    const confidenceMatch = aiResponse.match(/confidence:?\s*(\d+)/i) || aiResponse.match(/(\d+)%/);
    const confidence = confidenceMatch ? `${confidenceMatch[1]}%` : "75%"; // Default to 75% if no match

    // Extract sources from the response
    const sources = extractSources(aiResponse);

    return NextResponse.json({
      result: {
        verdict: aiResponse.toLowerCase().includes("fake") ? "Likely Fake" : "Likely Real",
        confidence: confidence,
        latestUpdate: new Date().toISOString().split("T")[0],
        sourcesChecked: sources,
        explanation: aiResponse,
      }
    });

  } catch (error) {
    console.error("Error verifying news:", error);
    return NextResponse.json(
      { error: "Something went wrong while verifying news." },
      { status: 500 }
    );
  }
}

// Helper function to extract sources from AI response
function extractSources(response: string): string[] {
  const sources = response.match(/(?:https?:\/\/[^\s]+)/g) || [];
  return sources.map(url => {
    // Clean up the URL by removing trailing parentheses and brackets
    return url.replace(/[\)\]]+$/, '');
  }).filter(url => url.length > 0) || ["AI analysis based on available information"];
}
