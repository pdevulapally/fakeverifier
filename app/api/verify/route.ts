import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { adminAuth } from '@/lib/firebase-admin';
import { getUserTier, createAIClient, getModelForUseCase, getModelParams, getModelConfig, markModelRateLimited, markModelUsed, getRateLimitMessage, getUpgradeSuggestion } from '@/lib/model-selection';
import { performGoogleSearch, performNewsSearch, getSearchQuota } from '@/lib/serpapi';

// Utility functions for retry logic and error handling
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function retryWithExponentialBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
  maxDelay: number = 8000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      
      // Don't retry on certain errors
      if (error.status === 400 || error.status === 401 || error.status === 403) {
        throw error;
      }
      
      // If this is the last attempt, throw the error
      if (attempt === maxRetries) {
        console.error(`Operation failed after ${maxRetries + 1} attempts:`, error);
        throw error;
      }
      
      // Calculate delay with exponential backoff
      const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
      
      // Add jitter to prevent thundering herd
      const jitter = Math.random() * 0.1 * delay;
      const totalDelay = delay + jitter;
      
      console.log(`Attempt ${attempt + 1} failed, retrying in ${Math.round(totalDelay)}ms...`);
      await sleep(totalDelay);
    }
  }
  
  throw lastError!;
}

// Enhanced fetch with timeout and retry logic
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout: number = 10000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  }
}

// Get base URL from request or environment
function getBaseUrl(request: NextRequest): string {
  // Try to get from request headers first
  const host = request.headers.get('host');
  const protocol = request.headers.get('x-forwarded-proto') || 'http';
  
  if (host) {
    return `${protocol}://${host}`;
  }
  
  // Fallback to environment variable
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}

// Helper function to extract sources from AI response
function extractSources(response: string): string[] {
  const sources = response.match(/(?:https?:\/\/[^\s]+)/g) || [];
  return sources.map(url => {
    // Clean up the URL by removing trailing parentheses and brackets
    return url.replace(/[\)\]]+$/, '');
  }).filter(url => url.length > 0) || ["AI analysis based on available information"];
}

// Perform intelligent fact-checking searches using SerpAPI
async function performFactCheckingSearches(content: string): Promise<{
  googleResults: any[];
  newsResults: any[];
  searchQueries: string[];
}> {
  try {
    // Check if we have search quota available
    const quota = await getSearchQuota();
    if (quota.searchesUsed >= quota.searchesLimit) {
      console.log('Search quota exceeded, skipping SerpAPI searches');
      return { googleResults: [], newsResults: [], searchQueries: [] };
    }

    // Extract key claims and entities from content for search queries
    const searchQueries = generateSearchQueries(content);
    
    let googleResults: any[] = [];
    let newsResults: any[] = [];

    // Perform Google search for fact-checking
    if (searchQueries.length > 0) {
      try {
        const googleSearchQuery = searchQueries[0]; // Use the most relevant query
        const googleData = await performGoogleSearch(googleSearchQuery, {
          num: 5,
          gl: 'uk',
          hl: 'en',
          safe: 'active'
        });
        
        if (googleData.organic_results) {
          googleResults = googleData.organic_results;
        }
      } catch (error) {
        console.error('Google search failed:', error);
      }
    }

    // Perform news search for recent coverage
    if (searchQueries.length > 0) {
      try {
        const newsSearchQuery = searchQueries[0]; // Use the most relevant query
        const newsData = await performNewsSearch(newsSearchQuery, {
          num: 5,
          gl: 'uk',
          hl: 'en'
        });
        
        if (newsData.news_results) {
          newsResults = newsData.news_results;
        }
      } catch (error) {
        console.error('News search failed:', error);
      }
    }

    return { googleResults, newsResults, searchQueries };
  } catch (error) {
    console.error('Fact-checking searches failed:', error);
    return { googleResults: [], newsResults: [], searchQueries: [] };
  }
}

// Generate intelligent search queries from content
function generateSearchQueries(content: string): string[] {
  const queries: string[] = [];
  
  // Extract potential claims, names, and key phrases
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
  
  for (const sentence of sentences.slice(0, 3)) { // Limit to first 3 sentences
    const cleanSentence = sentence.trim();
    if (cleanSentence.length > 20 && cleanSentence.length < 200) {
      // Add "fact check" to make it more specific
      queries.push(`"${cleanSentence}" fact check`);
    }
  }
  
  // Extract potential names (capitalized words that might be people/organizations)
  const nameMatches = content.match(/\b[A-Z][a-z]+ [A-Z][a-z]+\b/g) || [];
  for (const name of nameMatches.slice(0, 2)) {
    queries.push(`${name} news fact check`);
  }
  
  // If no good queries found, use a general fact-checking query
  if (queries.length === 0) {
    const keyWords = content.split(/\s+/).filter(word => word.length > 4).slice(0, 3);
    if (keyWords.length > 0) {
      queries.push(`${keyWords.join(' ')} fact check news`);
    }
  }
  
  return queries.slice(0, 3); // Limit to 3 queries
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  // Declare variables in function scope so they're accessible in catch block
  let userTier: 'FREE' | 'PAID' = 'FREE';
  let userId: string | null = null;
  
  try {
    const { input } = await request.json();

    if (!input) {
      return NextResponse.json(
        { error: "News input is required" },
        { status: 400 }
      );
    }

    // Get base URL for internal API calls
    const baseUrl = getBaseUrl(request);
    console.log('Using base URL:', baseUrl);

    // Get user authentication and subscription status
    try {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const idToken = authHeader.split('Bearer ')[1];
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        userId = decodedToken.uid;

        // Get user subscription status with retry logic
        const subscriptionResponse = await retryWithExponentialBackoff(async () => {
          return fetchWithTimeout(`${baseUrl}/api/get-subscription`, {
            headers: {
              'Authorization': `Bearer ${idToken}`
            }
          }, 5000);
        }, 2, 1000, 4000);

        if (subscriptionResponse.ok) {
          const subscriptionData = await subscriptionResponse.json();
          userTier = getUserTier(subscriptionData.hasSubscription, subscriptionData.subscription);
        }
      }
    } catch (error) {
      console.log('User authentication/subscription check failed, using free tier:', error);
      userTier = 'FREE';
    }

    console.log(`User tier: ${userTier}, User ID: ${userId}`);

    // Perform SerpAPI fact-checking searches
    const { googleResults, newsResults, searchQueries } = await performFactCheckingSearches(input);

    // Create AI client based on user tier
    const aiClient = createAIClient(userTier);
    const modelParams = getModelParams(userTier);
    
    // AI completion with comprehensive retry logic, rate limiting, and model fallback
    let attemptedModels: string[] = [];
    let finalModel = '';
    let fallbackMessage = '';
    
    const completion = await retryWithExponentialBackoff(async () => {
      // Get the next available model
      const modelInfo = getModelForUseCase(userTier, 'default', attemptedModels);
      const modelToUse = modelInfo.model;
      finalModel = modelToUse;
      
      if (modelInfo.message) {
        fallbackMessage = modelInfo.message;
        console.log(`Model fallback: ${modelInfo.message}`);
      }
      
      console.log(`Attempting AI completion with model: ${modelToUse} (${userTier} tier)`);
      
      try {
        // Prepare SerpAPI context for the AI
        const serpApiContext = (googleResults.length > 0 || newsResults.length > 0)
          ? `\n\nReal-time fact-checking search results:\n${searchQueries.length > 0 ? `Search queries used: ${searchQueries.join(', ')}\n` : ''}${googleResults.length > 0 ? `\nGoogle search results:\n${googleResults.map((result: any, index: number) => 
              `${index + 1}. ${result.title} (${result.link}) - ${result.snippet}`
            ).join('\n')}` : ''}${newsResults.length > 0 ? `\nNews search results:\n${newsResults.map((result: any, index: number) => 
              `${index + 1}. ${result.title} (${result.source || 'Unknown'}) - ${result.snippet}`
            ).join('\n')}` : ''}`
          : '';

        const result = await aiClient.chat.completions.create({
          model: modelToUse,
      messages: [
        { 
          role: "system", 
          content: `You are an AI assistant specialized in news verification with access to real-time search results. For each analysis, you must provide:
          1. A clear verdict (Likely Real/Likely Fake)
          2. A confidence percentage (always include a number between 0-100)
          3. Detailed explanation using the provided search results
          4. Sources checked including real-time search findings` 
        },
        { role: "user", content: `Verify this news: ${input}${serpApiContext}` },
      ],
          ...modelParams,
        });
        
        // Mark model as successfully used
        markModelUsed(userTier, modelToUse);
        console.log('AI completion successful');
        return result;
      } catch (error: any) {
        // If rate limit error, mark this model as rate limited and try next
        if (error.status === 429) {
          markModelRateLimited(userTier, modelToUse);
          attemptedModels.push(modelToUse);
          
          // If we've tried all available models, throw the error
          const config = getModelConfig(userTier);
          const modelList = config.models.default;
          if (Array.isArray(modelList) && attemptedModels.length >= modelList.length) {
            throw new Error(getRateLimitMessage(userTier, modelToUse));
          }
          
          // Otherwise, retry with next model
          throw error;
        }
        
        throw error;
      }
    }, 5, 2000, 16000); // More retries for AI calls, longer delays

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
        userTier,
        model: finalModel,
        fallbackInfo: fallbackMessage ? { message: fallbackMessage } : undefined,
        serpApiData: {
          googleResults: googleResults.slice(0, 3), // Return top 3 Google results
          newsResults: newsResults.slice(0, 3), // Return top 3 news results
          searchQueries: searchQueries,
          searchesUsed: googleResults.length > 0 || newsResults.length > 0 ? 2 : 0 // Count searches used
        }
      }
    });

  } catch (error: any) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
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
          error: 'Request timed out. Please try again with a shorter content or try later.',
          details: 'The verification took too long to complete',
          duration: `${duration}ms`
        },
        { status: 408 }
      );
    }

    if (error.status === 429) {
      const rateLimitMessage = getRateLimitMessage(userTier || 'FREE', 'AI Model');
      const upgradeSuggestion = userTier === 'FREE' ? getUpgradeSuggestion() : undefined;
      
      return NextResponse.json(
        { 
          error: rateLimitMessage,
          details: 'Too many requests to the AI service',
          retryAfter: userTier === 'FREE' ? '5 minutes' : '30 seconds',
          upgradeSuggestion,
          userTier: userTier || 'FREE'
        },
        { status: 429 }
      );
    }

    if (error.status === 401 || error.status === 403) {
      return NextResponse.json(
        { 
          error: 'Authentication failed. Please check your API configuration.',
          details: 'Invalid or missing API keys'
        },
        { status: error.status }
      );
    }

    // Generic error response with more details for debugging
    return NextResponse.json(
      { 
        error: 'Something went wrong while verifying news.',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
        duration: `${duration}ms`,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
