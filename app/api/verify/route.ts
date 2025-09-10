/**
 * Enhanced Verify API Endpoint
 * Provides robust news verification with streaming, rate limiting, and graceful fallbacks
 */

import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limiter';
import { validateAPIRequest, validateAndSanitizeMessages, extractAndValidateUrls } from '@/lib/validation';
import { createFallbackProvider } from '@/lib/ai-providers';
import { adminAuth } from '@/lib/firebase-admin';
import { getUserTier } from '@/lib/model-selection';
import { performNewsSearch, getSearchStatus } from '@/lib/news-search';
import { getSecurityHeaders, validateOrigin, logSecurityEvent } from '@/lib/security';

// Environment configuration
const NEWS_SEARCH_ENABLED = process.env.NEWS_SEARCH_ENABLED === 'true';
const AUTO_SEND_FIRST = process.env.AUTO_SEND_FIRST === 'true';
const SERPAPI_KEY = process.env.SERPAPI_KEY;

// Rate limiting configuration
const RATE_LIMIT = 60; // requests per hour
const BURST_LIMIT = 10; // requests per minute

// News search is now handled by the imported function

// Generate system prompt based on search results
function generateSystemPrompt(searchResults: {
  searchPerformed: boolean;
  sources: Array<{ title: string; url: string }>;
}): string {
  const basePrompt = `You are an AI assistant specialized in news verification and content credibility assessment.`;

  if (searchResults.searchPerformed && searchResults.sources.length > 0) {
    const sourcesText = searchResults.sources
      .map((source, index) => `${index + 1}. ${source.title} (${source.url})`)
      .join('\n');

    return `${basePrompt}

You have access to web search results for additional context:
${sourcesText}

Use these sources to provide evidence-based verification. Always cite your sources when making claims.

Provide your response in this exact format:
VERDICT: [true|false|questionable|inconclusive]
CONFIDENCE: [0-100]
EXPLANATION: [Detailed analysis with citations]

IMPORTANT: Be accurate and evidence-based. If you cannot determine the truth with confidence, use "questionable" or "inconclusive".`;
  }

  return `${basePrompt}

You are analyzing content without access to real-time web search. Provide your best assessment based on the content provided.

Provide your response in this exact format:
VERDICT: [true|false|questionable|inconclusive]
CONFIDENCE: [0-100]
EXPLANATION: [Detailed analysis]

IMPORTANT: Be accurate and evidence-based. If you cannot determine the truth with confidence, use "questionable" or "inconclusive".`;
}

// Parse AI response to extract structured data
function parseAIResponse(response: string): {
  verdict: 'true' | 'false' | 'questionable' | 'inconclusive';
  confidence: number;
  explanation: string;
} {
  const lines = response.split('\n');
  let verdict: 'true' | 'false' | 'questionable' | 'inconclusive' = 'questionable';
  let confidence = 50;
  let explanation = response;

  for (const line of lines) {
    const trimmed = line.trim();
    
    if (trimmed.startsWith('VERDICT:')) {
      const verdictMatch = trimmed.match(/VERDICT:\s*(true|false|questionable|inconclusive)/i);
      if (verdictMatch) {
        verdict = verdictMatch[1].toLowerCase() as 'true' | 'false' | 'questionable' | 'inconclusive';
      }
    } else if (trimmed.startsWith('CONFIDENCE:')) {
      const confidenceMatch = trimmed.match(/CONFIDENCE:\s*(\d+)/i);
      if (confidenceMatch) {
        confidence = Math.max(0, Math.min(100, parseInt(confidenceMatch[1])));
      }
    } else if (trimmed.startsWith('EXPLANATION:')) {
      explanation = trimmed.replace(/EXPLANATION:\s*/i, '');
    }
  }

  return { verdict, confidence, explanation };
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let userTier: 'FREE' | 'PAID' = 'FREE';
  let userId: string | null = null;

  try {
    // Security: Validate origin
    if (!validateOrigin(request)) {
      logSecurityEvent('invalid_origin', { origin: request.headers.get('origin') }, request);
      return NextResponse.json(
        { error: 'Invalid origin', details: 'Request origin not allowed' },
        { status: 403 }
      );
    }

    // Rate limiting
    const rateLimitResult = rateLimit(RATE_LIMIT, 60 * 60 * 1000, BURST_LIMIT, 60 * 1000)(request);
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: 'Too many requests',
          details: 'Rate limit exceeded. Please try again later.',
          retryAfter: rateLimitResult.retryAfter,
        },
        { 
          status: 429,
          headers: {
            'Retry-After': rateLimitResult.retryAfter?.toString() || '60',
            'X-RateLimit-Limit': RATE_LIMIT.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
          }
        }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = validateAPIRequest(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error },
        { status: 400 }
      );
    }

    const { messages, source = 'direct', meta } = validation.data!;
    const utmParams = meta?.utm || {};

    // Validate and sanitize messages
    const messageValidation = validateAndSanitizeMessages(messages);
    
    if (!messageValidation.success) {
      return NextResponse.json(
        { error: 'Invalid messages', details: messageValidation.error },
        { status: 400 }
      );
    }

    const sanitizedMessages = messageValidation.messages!;

    // Get user authentication and subscription status
    try {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const idToken = authHeader.split('Bearer ')[1];
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        userId = decodedToken.uid;

        // Get user subscription status
        const subscriptionResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/get-subscription`, {
          headers: { 'Authorization': `Bearer ${idToken}` }
        });

        if (subscriptionResponse.ok) {
          const subscriptionData = await subscriptionResponse.json();
          userTier = getUserTier(subscriptionData.hasSubscription, subscriptionData.subscription);
        }
      }
    } catch (error) {
      console.log('User authentication failed, using free tier:', error);
      userTier = 'FREE';
    }

    // Log UTM parameters for analytics
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    if (Object.keys(utmParams).length > 0) {
      console.log('UTM parameters:', {
        requestId,
        utm_source: utmParams.utm_source,
        utm_medium: utmParams.utm_medium,
        utm_campaign: utmParams.utm_campaign,
        utm_term: utmParams.utm_term,
        utm_content: utmParams.utm_content,
        userTier,
        source
      });
    }

    // Extract content from user messages
    const userMessages = sanitizedMessages.filter(msg => msg.role === 'user');
    const content = userMessages.map(msg => msg.content).join('\n');

    // Perform news search with graceful degradation
    const searchResults = await performNewsSearch(content);
    const searchStatus = getSearchStatus(searchResults);

    // Generate system prompt
    const systemPrompt = generateSystemPrompt(searchResults);

    // Create AI provider
    const provider = createFallbackProvider();

    // Prepare messages for AI
    const aiMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...sanitizedMessages
    ];

    // Create streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let fullResponse = '';
          
          // Stream AI response
          for await (const chunk of provider.streamCompletion({
            messages: aiMessages,
            model: userTier === 'PAID' ? 'gpt-4o' : 'qwen/qwen3-coder:free',
            temperature: 0.3,
            maxTokens: 2000,
          })) {
            fullResponse += chunk;
            
            // Send chunk to client
            const data = JSON.stringify({ type: 'chunk', content: chunk });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }

          // Parse final response
          const parsedResponse = parseAIResponse(fullResponse);

          // Send final metadata
          const metadata = {
            type: 'metadata',
            verdict: parsedResponse.verdict,
            confidence: parsedResponse.confidence,
            searchPerformed: searchResults.searchPerformed,
            sources: searchResults.sources,
            searchStatus: searchStatus,
            provider: userTier === 'PAID' ? 'openai' : 'openrouter',
            duration: Date.now() - startTime,
          };

          const finalData = JSON.stringify(metadata);
          controller.enqueue(encoder.encode(`data: ${finalData}\n\n`));
          controller.close();

        } catch (error: any) {
          console.error('Streaming error:', error);
          
          const errorData = JSON.stringify({
            type: 'error',
            error: 'AI processing failed',
            details: error.message,
          });
          
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-RateLimit-Limit': RATE_LIMIT.toString(),
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
        ...getSecurityHeaders(),
      },
    });

  } catch (error: any) {
    const duration = Date.now() - startTime;
    
    console.error('Verify API Error:', {
      error: error.message,
      stack: error.stack,
      duration: `${duration}ms`,
      userTier: userTier || 'UNKNOWN',
      userId: userId || 'UNKNOWN',
      timestamp: new Date().toISOString()
    });

    // Handle specific error types
    if (error.message?.includes('timeout')) {
      return NextResponse.json(
        {
          error: 'Request timed out',
          details: 'The analysis took too long to complete',
          duration: `${duration}ms`
        },
        { status: 408 }
      );
    }

    if (error.status === 429) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          details: 'Too many requests. Please try again later.',
          retryAfter: 60
        },
        { status: 429 }
      );
    }

    // Generic error response
    return NextResponse.json(
      {
        error: 'Failed to verify content',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
        duration: `${duration}ms`,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}