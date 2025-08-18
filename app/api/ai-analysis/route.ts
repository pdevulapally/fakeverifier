import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWSAPI_AI_KEY = process.env.NEWSAPI_AI_KEY;
const FINLIGHT_API_KEY = process.env.FINLIGHT_API_KEY;
const NYT_API_KEY = process.env.NYT_API_KEY;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// Validate required API keys
if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is required');
}

// Security validation for URLs
function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const allowedProtocols = ['http:', 'https:'];
    const blockedDomains = [
      'malware.com', 'phishing.com', 'scam.com', 'virus.com',
      'localhost', '127.0.0.1', '0.0.0.0', '::1'
    ];
    
    // Check protocol
    if (!allowedProtocols.includes(urlObj.protocol)) {
      return false;
    }
    
    // Check for blocked domains
    const hostname = urlObj.hostname.toLowerCase();
    if (blockedDomains.some(domain => hostname.includes(domain))) {
      return false;
    }
    
    // Check for suspicious patterns
    const suspiciousPatterns = [
      /\.exe$/i, /\.bat$/i, /\.cmd$/i, /\.scr$/i, /\.pif$/i,
      /javascript:/i, /data:/i, /vbscript:/i
    ];
    
    if (suspiciousPatterns.some(pattern => pattern.test(url))) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

// Extract URLs from content
function extractUrls(content: string): string[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const matches = content.match(urlRegex) || [];
  return matches.filter(url => isValidUrl(url));
}

// Fetch content from URL safely
async function fetchUrlContent(url: string): Promise<string | null> {
  try {
    if (!isValidUrl(url)) {
      return null;
    }
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'FakeVerifier-Bot/1.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      return null;
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('text/html')) {
      return null;
    }
    
    const text = await response.text();
    
    // Basic content extraction (remove scripts, styles, etc.)
    const cleanText = text
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    return cleanText.substring(0, 5000); // Limit content length
  } catch (error) {
    console.log('Error fetching URL content:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { content, type = 'news' } = await request.json();

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required and must be a string' },
        { status: 400 }
      );
    }

    // Extract and validate URLs from content
    const urls = extractUrls(content);
    let urlContent = '';
    let urlAnalysis = '';
    
    if (urls.length > 0) {
      urlAnalysis = `\n\nURLs found in content:\n${urls.map((url, index) => `${index + 1}. ${url}`).join('\n')}`;
      
      // Fetch content from the first valid URL
      const firstUrlContent = await fetchUrlContent(urls[0]);
      if (firstUrlContent) {
        urlContent = `\n\nContent extracted from ${urls[0]}:\n${firstUrlContent}`;
      }
    }

    // Extract keywords from content for news search
    const keywords = extractKeywords(content);
    
    // Fetch real-time news data from all four APIs
    let newsData = [];
    let newsApiAiData = [];
    let finlightData = [];
    let nytData = [];
    
    // Search for relevant news videos
    let videoData = [];
    try {
      videoData = await searchNewsVideos(keywords, content);
    } catch (error) {
      console.log('Video search error:', error);
    }
    
    try {
      // Fetch from News API
      const newsResponse = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(keywords.join(' '))}&sortBy=publishedAt&language=en&pageSize=10&apiKey=${NEWS_API_KEY}`
      );
      
      if (newsResponse.ok) {
        const newsResult = await newsResponse.json();
        newsData = newsResult.articles || [];
      }
    } catch (error) {
      console.log('News API error:', error);
    }

    try {
      // Fetch from NewsAPI.ai
      const newsApiAiResponse = await fetch('https://eventregistry.org/api/v1/article/getArticles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${NEWSAPI_AI_KEY}`
        },
        body: JSON.stringify({
          query: keywords.join(' '),
          articlesSortBy: "date",
          articlesCount: 10,
          articlesArticleBodyLen: -1,
          articlesIncludeArticleImage: true,
          articlesIncludeArticleLocation: true,
          articlesIncludeArticleSource: true,
          articlesIncludeArticleUrl: true,
          articlesIncludeArticleDate: true,
          articlesIncludeArticleTitle: true,
          articlesIncludeArticleDescription: true
        })
      });
      
      if (newsApiAiResponse.ok) {
        const newsApiAiResult = await newsApiAiResponse.json();
        newsApiAiData = newsApiAiResult.articles?.results || [];
      }
    } catch (error) {
      console.log('NewsAPI.ai error:', error);
    }

    try {
      // Fetch from Finlight API
      if (!FINLIGHT_API_KEY) {
        console.log('Finlight API key not configured');
      } else {
        const finlightResponse = await fetch('https://api.finlight.me/v2/articles', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'X-API-KEY': FINLIGHT_API_KEY
          },
          body: JSON.stringify({
            query: keywords.join(' '),
            limit: 10,
            sortBy: 'date'
          })
        });
        
        if (finlightResponse.ok) {
          const finlightResult = await finlightResponse.json();
          finlightData = finlightResult.articles || finlightResult.data || [];
        }
      }
    } catch (error) {
      console.log('Finlight API error:', error);
    }

    try {
      // Fetch from New York Times Top Stories API
      const nytResponse = await fetch(
        `https://api.nytimes.com/svc/topstories/v2/home.json?api-key=${NYT_API_KEY}`
      );
      
      if (nytResponse.ok) {
        const nytResult = await nytResponse.json();
        nytData = nytResult.results || [];
        
        // Filter NYT articles based on keywords
        nytData = nytData.filter((article: any) => {
          const articleText = `${article.title} ${article.abstract}`.toLowerCase();
          return keywords.some(keyword => articleText.includes(keyword.toLowerCase()));
        });
      }
    } catch (error) {
      console.log('NYT API error:', error);
    }

    // Determine if this is real-time news or older content
    const isRealTimeNews = checkIfRealTimeNews(content, newsData, newsApiAiData, finlightData, nytData);
    
    // Choose the appropriate model based on content type
    const modelToUse = isRealTimeNews ? "gpt-4o-search-preview" : "gpt-4o";
    
    console.log(`Using model: ${modelToUse} for ${isRealTimeNews ? 'real-time' : 'older'} news content`);

    // Enhanced system prompt for comprehensive verification
    const systemPrompt = `You are an AI assistant specialized in comprehensive news verification and content credibility assessment. ${isRealTimeNews ? 'You have access to real-time search capabilities and can search for current information to verify claims.' : 'You will analyze content using provided news data from multiple sources including NewsAPI, NewsAPI.ai, Finlight, and New York Times.'}

IMPORTANT: You must be accurate and evidence-based in your verification. Classify content as "Real" if there is clear, verifiable evidence from reliable sources. For factual claims (like current political office holders, basic facts, etc.), be more direct. Only classify as "Questionable" when there is genuine uncertainty or controversy. Be fair and balanced - do not assume content is fake without clear evidence. When in doubt, err on the side of "Real" if there are credible sources supporting the claim.

For each analysis, you must provide:

1. A clear verdict using ONLY these categories:
   - "Real" - Clear, verifiable evidence from reliable sources (use for factual claims like current office holders, basic facts)
   - "Likely Real" - Strong evidence but some uncertainty remains
   - "Likely Fake" - Strong evidence suggesting the claim is false or misleading
   - "Fake" - Clear evidence that the claim is false
   - "Questionable" - Genuinely controversial claims, insufficient evidence, or mixed signals
   - "AI-Generated" - Content appears to be artificially generated (use this for synthetic content)

   IMPORTANT: When stating the verdict, write it as "VERDICT: [category]" without any ** symbols around it.

2. A confidence percentage (always include a number between 0-100)
3. Detailed explanation with specific reasoning
4. Real-time news sources and verification methods used
5. Red flags or suspicious elements identified
6. Recommendations for further verification
7. Current news context and related recent events
8. AI-generated content detection analysis (if applicable)

Analysis Guidelines:
- Be accurate and evidence-based - classify based on clear evidence, not excessive caution
- For factual claims (current office holders, basic facts, etc.), be direct and confident
- Search for real-time news related to the claims being made
- Check for recent developments or updates on the topic
- Verify claims against current news from multiple sources
- Check for sensationalist language, clickbait headlines, and emotional manipulation
- Identify potential bias, misinformation patterns, or AI-generated content
- Consider the source credibility and cross-reference information
- Look for logical inconsistencies or factual errors
- Assess the overall credibility based on multiple factors including real-time data
- For personal claims about public figures, require multiple independent sources
- Be especially careful with claims about personal characteristics, relationships, or private matters
- Analyze URL content if provided for additional verification
- Detect AI-generated content patterns (repetitive language, lack of natural flow, generic responses)
- Cross-reference content with all available news APIs for comprehensive verification
- DYNAMIC SOURCE SELECTION: Choose the most relevant and credible sources from the provided real-time news data
- Prioritize sources that directly relate to the content being analyzed
- Consider source reputation, recency, and relevance when selecting sources
- Avoid generic or static source lists - use only sources that are directly applicable
- FACTUAL CLAIMS: For basic factual information (current office holders, dates, locations, etc.), be confident and direct
- Do not mark factual claims as "Questionable" unless there is genuine controversy or uncertainty
- EXPLANATION FORMAT: Write clear, structured explanations that are easy to read. Use **bold** formatting for key terms but avoid excessive formatting. Make the explanation flow naturally and be informative.
- NEWSAPI DATA: When NewsAPI provides relevant articles that support the claim being verified, use this as strong evidence for "Real" classification. Do not dismiss NewsAPI data without clear reason.
- BALANCED ASSESSMENT: If multiple credible sources (including NewsAPI) support a claim, classify it as "Real" even if there are some minor uncertainties.

AI-Generated Content Detection:
- Look for repetitive language patterns
- Check for lack of natural conversational flow
- Identify generic or template-like responses
- Analyze for unusual sentence structures
- Check for inconsistent factual details
- Look for patterns typical of language models

Always provide a structured response that includes:
- VERDICT: [Real/Likely Real/Likely Fake/Fake/Questionable/AI-Generated]
- CONFIDENCE: [0-100]%
- EXPLANATION: [Detailed reasoning with real-time context. Use **bold** formatting for key terms like "Real", "Fake", "Questionable", "AI-Generated", "Likely Real", "Likely Fake". Do NOT use ** around the entire verdict word - only bold the key terms within the explanation.]
- REAL-TIME SOURCES: [Current news sources and verification methods]
- RED FLAGS: [Any suspicious elements found]
- RECOMMENDATIONS: [Suggestions for further verification]
- CURRENT CONTEXT: [Recent news developments related to the topic]
- AI-DETECTION: [Analysis of whether content appears AI-generated]

IMPORTANT: In the EXPLANATION section, make key terms bold using **term** format, but do NOT wrap the entire verdict in ** symbols. For example:
- "This content is **Fake** because..." (correct)
- "**FAKE**" (incorrect - don't wrap the entire verdict)`;

    // Include news data from all four APIs in the user prompt
    const newsContext = newsData.length > 0 
      ? `\n\nCurrent news context from News API:\n${newsData.map((article: any, index: number) => 
          `${index + 1}. ${article.title} (${article.source.name}) - ${article.publishedAt}`
        ).join('\n')}`
      : '';

    const newsApiAiContext = newsApiAiData.length > 0
      ? `\n\nAdditional news context from NewsAPI.ai:\n${newsApiAiData.map((article: any, index: number) => 
          `${index + 1}. ${article.title} (${article.source?.title || 'Unknown'}) - ${article.dateTime}`
        ).join('\n')}`
      : '';

    const finlightContext = finlightData.length > 0
      ? `\n\nAdditional news context from Finlight API:\n${finlightData.map((article: any, index: number) => 
          `${index + 1}. ${article.title || article.headline} (${article.source || 'Unknown'}) - ${article.publishedAt || article.date}`
        ).join('\n')}`
      : '';

    const nytContext = nytData.length > 0
      ? `\n\nNew York Times Top Stories context:\n${nytData.map((article: any, index: number) => 
          `${index + 1}. ${article.title} (New York Times) - ${article.published_date}`
        ).join('\n')}`
      : '';

    const videoContext = videoData.length > 0
      ? `\n\nRelevant news videos found:\n${videoData.map((video: any, index: number) => {
          const title = video.title || 'Unknown Title';
          const channelTitle = video.channelTitle || 'Unknown Channel';
          const publishedAt = video.publishedAt || 'Unknown Date';
          return `${index + 1}. ${title} (${channelTitle}) - ${publishedAt}`;
        }).join('\n')}`
      : '';

    const userPrompt = `Analyze and verify this ${type} content for credibility and authenticity using ${isRealTimeNews ? 'real-time search capabilities and current news data' : 'provided news data from multiple sources including NewsAPI, NewsAPI.ai, Finlight, and New York Times'}. Also detect if the content appears to be AI-generated:

"${content}"${urlAnalysis}${urlContent}

Please ${isRealTimeNews ? 'search for current news related to this content and' : 'analyze the provided news data to'} provide a comprehensive verification analysis following the structured format. 

IMPORTANT: ${isRealTimeNews ? 'Use your search capabilities to find the most relevant and credible sources.' : 'Select only the most relevant and credible sources from the provided news data.'} Do not use generic source lists - choose sources that directly relate to the content being analyzed. Consider source reputation, recency, and relevance when selecting sources.

FORMATTING: Write clear, well-structured explanations. Use **bold** formatting for key terms like "Real", "Fake", "Questionable", etc., but do NOT wrap entire verdicts in ** symbols. Make the explanation easy to read and understand.

Include ${isRealTimeNews ? 'real-time search results and' : 'provided'} news sources and current context in your analysis. Cross-reference with all available ${isRealTimeNews ? 'search results' : 'news APIs'} and analyze for AI-generated content patterns.${isRealTimeNews ? '' : `${newsContext}${newsApiAiContext}${finlightContext}${nytContext}${videoContext}`}`;
    
    const completion = await openai.chat.completions.create({
      model: modelToUse,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 3000,
    });

    const aiResponse = completion.choices[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error('No response from AI model');
    }

    // Parse the AI response to extract structured data
    const parsedData = parseAIResponse(aiResponse);
    
    // Extract confidence percentage
    const confidenceMatch = aiResponse.match(/confidence:?\s*(\d+)/i) || aiResponse.match(/(\d+)%/);
    const confidence = confidenceMatch ? parseInt(confidenceMatch[1]) : 75;

    // Determine verdict based on AI response
    let verdict: "real" | "likely-real" | "likely-fake" | "fake" | "questionable" | "ai-generated" = "questionable";
    const responseLower = aiResponse.toLowerCase();
    
    // Debug logging
    console.log('AI Response for verdict analysis:', aiResponse.substring(0, 500) + '...');
    console.log('Response lower case:', responseLower.substring(0, 500) + '...');
    
    // Check for explicit verdict statements first
    if (responseLower.includes("verdict: real")) {
      verdict = "real";
    } else if (responseLower.includes("verdict: likely real")) {
      verdict = "likely-real";
    } else if (responseLower.includes("verdict: likely fake")) {
      verdict = "likely-fake";
    } else if (responseLower.includes("verdict: fake")) {
      verdict = "fake";
    } else if (responseLower.includes("verdict: ai-generated")) {
      verdict = "ai-generated";
    } else if (responseLower.includes("verdict: questionable")) {
      verdict = "questionable";
    } else {
      // If no explicit verdict found, look for keywords in the explanation
      // Prioritize positive classifications for real news
      if (responseLower.includes("real") && !responseLower.includes("fake") && !responseLower.includes("questionable")) {
        verdict = "real";
      } else if (responseLower.includes("likely real")) {
        verdict = "likely-real";
      } else if (responseLower.includes("likely fake")) {
        verdict = "likely-fake";
      } else if (responseLower.includes("fake") && !responseLower.includes("real")) {
        verdict = "fake";
      } else if (responseLower.includes("ai-generated")) {
        verdict = "ai-generated";
      } else if (responseLower.includes("questionable")) {
        verdict = "questionable";
      } else {
        // If still no clear verdict, check for positive indicators
        const positiveIndicators = ["verified", "confirmed", "accurate", "true", "legitimate", "credible"];
        const negativeIndicators = ["false", "misleading", "inaccurate", "unverified", "suspicious"];
        
        const positiveCount = positiveIndicators.filter(indicator => responseLower.includes(indicator)).length;
        const negativeCount = negativeIndicators.filter(indicator => responseLower.includes(indicator)).length;
        
        if (positiveCount > negativeCount) {
          verdict = "real";
        } else if (negativeCount > positiveCount) {
          verdict = "fake";
                 } else {
           verdict = "questionable";
         }
       }
     }
     
     // Debug logging for final verdict
     console.log('Final verdict determined:', verdict);
     console.log('Confidence:', confidence);

    // Extract sources from the response and combine with real-time news sources
    const extractedSources = extractSources(aiResponse);
    
    // Prepare real-time news sources from all four APIs
    const realTimeSources = [
      ...newsData.map((article: any) => ({
        title: article.title,
        source: article.source.name,
        url: article.url,
        publishedAt: article.publishedAt,
        description: article.description,
        api: 'News API',
        relevance: calculateRelevance(article, content, keywords)
      })),
      ...newsApiAiData.map((article: any) => ({
        title: article.title,
        source: article.source?.title || 'Unknown',
        url: article.url,
        publishedAt: article.dateTime,
        description: article.body,
        api: 'NewsAPI.ai',
        relevance: calculateRelevance(article, content, keywords)
      })),
      ...finlightData.map((article: any) => ({
        title: article.title || article.headline,
        source: article.source || article.publisher || 'Unknown',
        url: article.url || article.link,
        publishedAt: article.publishedAt || article.date || article.published_date,
        description: article.description || article.summary || article.content,
        api: 'Finlight',
        relevance: calculateRelevance(article, content, keywords)
      })),
      ...nytData.map((article: any) => ({
        title: article.title,
        source: 'New York Times',
        url: article.url,
        publishedAt: article.published_date,
        description: article.abstract,
        api: 'NYT Top Stories',
        relevance: calculateRelevance(article, content, keywords)
      }))
    ];

    // Sort sources by relevance and select the most relevant ones
    const sortedSources = realTimeSources
      .sort((a, b) => (b.relevance || 0) - (a.relevance || 0))
      .slice(0, 10); // Keep top 10 most relevant sources

    // Combine extracted sources with most relevant real-time sources
    const sources = [
      ...extractedSources,
      ...sortedSources.map(article => `${article.source}: ${article.title}`)
    ];

    return NextResponse.json({
      analysis: aiResponse,
      model: modelToUse,
      isRealTimeNews,
      timestamp: new Date().toISOString(),
      newsData: sortedSources, // Return only the most relevant sources
      videoData: videoData.sort((a, b) => (b.relevance || 0) - (a.relevance || 0)).slice(0, 3), // Return top 3 most relevant videos
      urlsAnalyzed: urls,
      structuredData: {
        verdict,
        confidence,
        sources,
        explanation: parsedData.explanation || aiResponse,
        redFlags: parsedData.redFlags || [],
        recommendations: parsedData.recommendations || [],
        currentContext: parsedData.currentContext || [],
        realTimeSources: parsedData.realTimeSources || [],
        aiDetection: parsedData.aiDetection || []
      }
    });

  } catch (error) {
    console.error('AI Analysis Error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze content. Please try again.' },
      { status: 500 }
    );
  }
}

// Helper function to extract keywords from content
function extractKeywords(content: string): string[] {
  // Remove common words and extract meaningful keywords
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them']);
  
  const words = content.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.has(word));
  
  // Return unique keywords (up to 5 most relevant)
  return [...new Set(words)].slice(0, 5);
}

// Helper function to parse AI response and extract structured data
function parseAIResponse(response: string) {
  const lines = response.split('\n');
  const result: any = {
    explanation: '',
    redFlags: [],
    recommendations: [],
    currentContext: [],
    realTimeSources: [],
    aiDetection: []
  };

  let currentSection = '';
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    if (trimmedLine.toLowerCase().includes('explanation:')) {
      currentSection = 'explanation';
      result.explanation = trimmedLine.replace(/explanation:\s*/i, '');
    } else if (trimmedLine.toLowerCase().includes('red flags:') || trimmedLine.toLowerCase().includes('red flags')) {
      currentSection = 'redFlags';
    } else if (trimmedLine.toLowerCase().includes('recommendations:') || trimmedLine.toLowerCase().includes('recommendations')) {
      currentSection = 'recommendations';
    } else if (trimmedLine.toLowerCase().includes('current context:') || trimmedLine.toLowerCase().includes('current context')) {
      currentSection = 'currentContext';
    } else if (trimmedLine.toLowerCase().includes('real-time sources:') || trimmedLine.toLowerCase().includes('real-time sources')) {
      currentSection = 'realTimeSources';
    } else if (trimmedLine.toLowerCase().includes('ai-detection:') || trimmedLine.toLowerCase().includes('ai detection')) {
      currentSection = 'aiDetection';
    } else if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•')) {
      const item = trimmedLine.replace(/^[-•]\s*/, '');
      if (currentSection === 'redFlags') {
        result.redFlags.push(item);
      } else if (currentSection === 'recommendations') {
        result.recommendations.push(item);
      } else if (currentSection === 'currentContext') {
        result.currentContext.push(item);
      } else if (currentSection === 'realTimeSources') {
        result.realTimeSources.push(item);
      } else if (currentSection === 'aiDetection') {
        result.aiDetection.push(item);
      }
    } else if (currentSection === 'explanation' && trimmedLine) {
      result.explanation += ' ' + trimmedLine;
    }
  }

  return result;
}

// Helper function to calculate relevance score for articles
function calculateRelevance(article: any, content: string, keywords: string[]): number {
  let score = 0;
  const contentLower = content.toLowerCase();
  const articleText = `${article.title || ''} ${article.description || ''} ${article.body || ''}`.toLowerCase();
  
  // Check for keyword matches
  keywords.forEach(keyword => {
    const keywordLower = keyword.toLowerCase();
    if (articleText.includes(keywordLower)) {
      score += 10;
    }
    if (contentLower.includes(keywordLower)) {
      score += 5;
    }
  });
  
  // Check for exact phrase matches
  const contentWords = contentLower.split(/\s+/).filter(word => word.length > 3);
  contentWords.forEach(word => {
    if (articleText.includes(word)) {
      score += 2;
    }
  });
  
  // Boost score for recent articles (within last 7 days)
  const articleDate = new Date(article.publishedAt || article.dateTime || article.published_date || Date.now());
  const daysDiff = (Date.now() - articleDate.getTime()) / (1000 * 60 * 60 * 24);
  if (daysDiff <= 7) {
    score += 5;
  }
  
  // Boost score for sources with longer names (often more established)
  const sourceName = String(article.source || '').toLowerCase();
  if (sourceName.length > 10) {
    score += 2;
  }
  
  return Math.min(score, 100); // Cap at 100
}

// Helper function to search for relevant news videos from news sources
async function searchNewsVideos(keywords: string[], content: string): Promise<any[]> {
  const allVideos: any[] = [];
  const searchQuery = keywords.join(' ') + ' news';
  
  try {
    // 1. News API Video Content from major news sources
    const newsApiVideoResponse = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchQuery)}&domains=cnn.com,bbc.com,foxnews.com,msnbc.com,abcnews.go.com,cbsnews.com,nbcnews.com,reuters.com,ap.org,bloomberg.com&sortBy=publishedAt&language=en&pageSize=10&apiKey=${NEWS_API_KEY}`
    );
    
    if (newsApiVideoResponse.ok) {
      const newsApiData = await newsApiVideoResponse.json();
      const newsApiVideos = newsApiData.articles?.filter((article: any) => 
        article.url && (article.url.includes('video') || article.url.includes('watch') || article.url.includes('media'))
      ).map((article: any) => ({
        id: article.url.split('/').pop() || article.url,
        title: article.title,
        description: article.description,
        thumbnail: article.urlToImage,
        channelTitle: article.source.name,
        publishedAt: article.publishedAt,
        url: article.url,
        embedUrl: article.url, // Direct link for news videos
        source: article.source.name,
        platform: 'News Site',
        relevance: calculateVideoRelevance(article, content, keywords)
      })) || [];
      allVideos.push(...newsApiVideos);
    }
  } catch (error) {
    console.log('News API video search error:', error);
  }

  try {
    // 2. NewsAPI.ai Video Content
    const newsApiAiVideoResponse = await fetch('https://eventregistry.org/api/v1/article/getArticles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NEWSAPI_AI_KEY}`
      },
      body: JSON.stringify({
        query: searchQuery,
        articlesSortBy: "date",
        articlesCount: 10,
        articlesArticleBodyLen: -1,
        articlesIncludeArticleImage: true,
        articlesIncludeArticleLocation: true,
        articlesIncludeArticleSource: true,
        articlesIncludeArticleUrl: true,
        articlesIncludeArticleDate: true,
        articlesIncludeArticleTitle: true,
        articlesIncludeArticleDescription: true
      })
    });
    
    if (newsApiAiVideoResponse.ok) {
      const newsApiAiData = await newsApiAiVideoResponse.json();
      const newsApiAiVideos = newsApiAiData.articles?.results?.filter((article: any) => 
        article.url && (article.url.includes('video') || article.url.includes('watch') || article.url.includes('media'))
      ).map((article: any) => ({
        id: article.url.split('/').pop() || article.url,
        title: article.title,
        description: article.body,
        thumbnail: article.image,
        channelTitle: article.source?.title || 'News Source',
        publishedAt: article.dateTime,
        url: article.url,
        embedUrl: article.url,
        source: article.source?.title || 'NewsAPI.ai',
        platform: 'News Site',
        relevance: calculateVideoRelevance(article, content, keywords)
      })) || [];
      allVideos.push(...newsApiAiVideos);
    }
  } catch (error) {
    console.log('NewsAPI.ai video search error:', error);
  }

  try {
    // 3. Finlight API Video Content
    if (!FINLIGHT_API_KEY) {
      console.log('Finlight API key not configured for video search');
    } else {
      const finlightVideoResponse = await fetch('https://api.finlight.me/v2/articles', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'X-API-KEY': FINLIGHT_API_KEY
        },
        body: JSON.stringify({
          query: searchQuery,
          limit: 10,
          sortBy: 'date'
        })
      });
      
      if (finlightVideoResponse.ok) {
        const finlightData = await finlightVideoResponse.json();
        const finlightVideos = (finlightData.articles || finlightData.data || []).filter((article: any) => 
          article.url && (article.url.includes('video') || article.url.includes('watch') || article.url.includes('media'))
        ).map((article: any) => ({
          id: article.url.split('/').pop() || article.url,
          title: article.title || article.headline,
          description: article.description || article.summary || article.content,
          thumbnail: article.image || article.thumbnail,
          channelTitle: article.source || article.publisher || 'News Source',
          publishedAt: article.publishedAt || article.date || article.published_date,
          url: article.url || article.link,
          embedUrl: article.url || article.link,
          source: article.source || article.publisher || 'Finlight',
          platform: 'News Site',
          relevance: calculateVideoRelevance(article, content, keywords)
        })) || [];
        allVideos.push(...finlightVideos);
      }
    }
  } catch (error) {
    console.log('Finlight video search error:', error);
  }

  try {
    // 4. New York Times Video Content
    const nytVideoResponse = await fetch(
      `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${encodeURIComponent(searchQuery)}&fq=news_desk:("Video")&api-key=${NYT_API_KEY}`
    );
    
    if (nytVideoResponse.ok) {
      const nytData = await nytVideoResponse.json();
      const nytVideos = nytData.response?.docs?.map((article: any) => ({
        id: article._id,
        title: article.headline?.main || article.headline?.print_headline || 'NYT Video',
        description: article.abstract || article.lead_paragraph,
        thumbnail: article.multimedia?.[0]?.url ? `https://www.nytimes.com/${article.multimedia[0].url}` : '',
        channelTitle: 'The New York Times',
        publishedAt: article.pub_date,
        url: `https://www.nytimes.com/${article.web_url}`,
        embedUrl: `https://www.nytimes.com/${article.web_url}`,
        source: 'The New York Times',
        platform: 'News Site',
        relevance: calculateVideoRelevance(article, content, keywords)
      })) || [];
      allVideos.push(...nytVideos);
    }
  } catch (error) {
    console.log('NYT video search error:', error);
  }

  // 5. Add curated news video sources from major news outlets
  const curatedVideos = getCuratedNewsVideos(keywords, content);
  allVideos.push(...curatedVideos);

  // Sort by relevance and return top results
  return allVideos
    .sort((a, b) => (b.relevance || 0) - (a.relevance || 0))
    .slice(0, 5);
}

// Helper function to calculate video relevance
function calculateVideoRelevance(video: any, content: string, keywords: string[]): number {
  let score = 0;
  const contentLower = content.toLowerCase();
  const videoTitle = video.title || '';
  const videoDescription = video.description || '';
  const videoText = `${videoTitle} ${videoDescription}`.toLowerCase();
  
  // Check for keyword matches
  keywords.forEach(keyword => {
    const keywordLower = keyword.toLowerCase();
    if (videoText.includes(keywordLower)) {
      score += 15; // Higher weight for video matches
    }
    if (contentLower.includes(keywordLower)) {
      score += 8;
    }
  });
  
  // Boost score for recent videos (within last 30 days)
  if (video.publishedAt) {
    try {
      const videoDate = new Date(video.publishedAt);
      if (!isNaN(videoDate.getTime())) {
        const daysDiff = (Date.now() - videoDate.getTime()) / (1000 * 60 * 60 * 24);
        if (daysDiff <= 30) {
          score += 10;
        }
      }
    } catch (error) {
      console.warn('Invalid publishedAt date:', video.publishedAt);
    }
  }
  
  // Boost score for news channels and platforms
  const newsChannels = ['cnn', 'bbc', 'fox news', 'msnbc', 'abc news', 'cbs news', 'nbc news', 'reuters', 'associated press', 'bloomberg'];
  if (video.channelTitle && typeof video.channelTitle === 'string') {
    const channelLower = video.channelTitle.toLowerCase();
    if (newsChannels.some(channel => channelLower.includes(channel))) {
      score += 20;
    }
  }
  
  // Boost score for different platforms
  const platform = video.platform || video.source;
  if (platform === 'News Site') score += 20;
  if (platform === 'NewsAPI.ai') score += 15;
  if (platform === 'Finlight') score += 15;
  if (platform === 'The New York Times') score += 25;
  
  return Math.min(score, 100);
}

// Helper function to get curated news videos from major news outlets
function getCuratedNewsVideos(keywords: string[], content: string): any[] {
  const curatedVideos: any[] = [];
  const contentLower = content.toLowerCase();
  
  // Check if content is about politics
  const politicalKeywords = ['trump', 'biden', 'election', 'president', 'congress', 'senate', 'democrat', 'republican'];
  const isPolitical = politicalKeywords.some(keyword => contentLower.includes(keyword));
  
  // Check if content is about technology
  const techKeywords = ['ai', 'artificial intelligence', 'technology', 'tech', 'software', 'app', 'digital'];
  const isTech = techKeywords.some(keyword => contentLower.includes(keyword));
  
  // Check if content is about business
  const businessKeywords = ['stock', 'market', 'economy', 'business', 'finance', 'investment', 'company'];
  const isBusiness = businessKeywords.some(keyword => contentLower.includes(keyword));
  
  // Add curated videos from major news outlets based on content type
  if (isPolitical) {
    curatedVideos.push({
      id: 'cnn-political-1',
      title: 'CNN Political Coverage: Breaking News Analysis',
      description: 'Latest political developments and analysis from CNN',
      thumbnail: 'https://via.placeholder.com/320x180/1e40af/ffffff?text=CNN+Political',
      channelTitle: 'CNN',
      publishedAt: new Date().toISOString(),
      url: 'https://www.cnn.com/politics',
      embedUrl: 'https://www.cnn.com/politics',
      source: 'CNN',
      platform: 'News Site',
      relevance: 90
    });
    
    curatedVideos.push({
      id: 'bbc-political-1',
      title: 'BBC Political News: International Coverage',
      description: 'Comprehensive political news from BBC',
      thumbnail: 'https://via.placeholder.com/320x180/1e40af/ffffff?text=BBC+Political',
      channelTitle: 'BBC News',
      publishedAt: new Date().toISOString(),
      url: 'https://www.bbc.com/news/politics',
      embedUrl: 'https://www.bbc.com/news/politics',
      source: 'BBC News',
      platform: 'News Site',
      relevance: 88
    });
  }
  
  if (isTech) {
    curatedVideos.push({
      id: 'reuters-tech-1',
      title: 'Reuters Technology: Innovation and AI News',
      description: 'Latest technology developments from Reuters',
      thumbnail: 'https://via.placeholder.com/320x180/059669/ffffff?text=Reuters+Tech',
      channelTitle: 'Reuters',
      publishedAt: new Date().toISOString(),
      url: 'https://www.reuters.com/technology',
      embedUrl: 'https://www.reuters.com/technology',
      source: 'Reuters',
      platform: 'News Site',
      relevance: 85
    });
    
    curatedVideos.push({
      id: 'bloomberg-tech-1',
      title: 'Bloomberg Technology: Business and Innovation',
      description: 'Technology news and analysis from Bloomberg',
      thumbnail: 'https://via.placeholder.com/320x180/059669/ffffff?text=Bloomberg+Tech',
      channelTitle: 'Bloomberg',
      publishedAt: new Date().toISOString(),
      url: 'https://www.bloomberg.com/technology',
      embedUrl: 'https://www.bloomberg.com/technology',
      source: 'Bloomberg',
      platform: 'News Site',
      relevance: 82
    });
  }
  
  if (isBusiness) {
    curatedVideos.push({
      id: 'cnbc-business-1',
      title: 'CNBC Business: Market Analysis and News',
      description: 'Financial markets and business coverage from CNBC',
      thumbnail: 'https://via.placeholder.com/320x180/7c3aed/ffffff?text=CNBC+Business',
      channelTitle: 'CNBC',
      publishedAt: new Date().toISOString(),
      url: 'https://www.cnbc.com/markets',
      embedUrl: 'https://www.cnbc.com/markets',
      source: 'CNBC',
      platform: 'News Site',
      relevance: 88
    });
    
    curatedVideos.push({
      id: 'wsj-business-1',
      title: 'Wall Street Journal: Business and Finance',
      description: 'In-depth business analysis from WSJ',
      thumbnail: 'https://via.placeholder.com/320x180/7c3aed/ffffff?text=WSJ+Business',
      channelTitle: 'Wall Street Journal',
      publishedAt: new Date().toISOString(),
      url: 'https://www.wsj.com/news/business',
      embedUrl: 'https://www.wsj.com/news/business',
      source: 'Wall Street Journal',
      platform: 'News Site',
      relevance: 85
    });
  }
  
  return curatedVideos;
}

// Helper function to check if content is real-time news
function checkIfRealTimeNews(content: string, newsData: any[], newsApiAiData: any[], finlightData: any[], nytData: any[]): boolean {
  // Check for real-time indicators in the content
  const realTimeKeywords = [
    'breaking', 'just in', 'latest', 'recently', 'today', 'yesterday', 'this week',
    'breaking news', 'live', 'developing', 'update', 'announcement', 'statement'
  ];
  
  const contentLower = content.toLowerCase();
  const hasRealTimeKeywords = realTimeKeywords.some(keyword => contentLower.includes(keyword));
  
  // Check if we have recent news data (within last 24 hours)
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  const hasRecentNewsData = [...newsData, ...newsApiAiData, ...finlightData, ...nytData].some(article => {
    const articleDate = new Date(article.publishedAt || article.dateTime || article.published_date || article.date || now);
    return articleDate >= oneDayAgo;
  });
  
  // Check for time-sensitive content patterns
  const timeSensitivePatterns = [
    /\b(today|yesterday|this week|this month)\b/i,
    /\b(breaking|live|developing|just in)\b/i,
    /\b(announcement|statement|press release)\b/i,
    /\b(election|vote|result|outcome)\b/i,
    /\b(crisis|emergency|disaster)\b/i
  ];
  
  const hasTimeSensitivePatterns = timeSensitivePatterns.some(pattern => pattern.test(content));
  
  // Determine if it's real-time news
  const isRealTime = hasRealTimeKeywords || hasRecentNewsData || hasTimeSensitivePatterns;
  
  console.log(`Real-time news check:`, {
    hasRealTimeKeywords,
    hasRecentNewsData,
    hasTimeSensitivePatterns,
    isRealTime
  });
  
  return isRealTime;
}

// Helper function to extract sources from AI response
function extractSources(response: string): string[] {
  const sources = response.match(/(?:https?:\/\/[^\s]+)/g) || [];
  return sources.map(url => {
    // Clean up the URL by removing trailing parentheses and brackets
    return url.replace(/[\)\]]+$/, '');
  }).filter(url => url.length > 0) || ["AI analysis based on available information"];
}
