/**
 * News Search Implementation with Graceful Degradation
 * Provides news search functionality with fallbacks when APIs are unavailable
 */

// News search result interface
export interface NewsSearchResult {
  searchPerformed: boolean;
  sources: Array<{
    title: string;
    url: string;
    snippet?: string;
    publishedAt?: string;
    source?: string;
  }>;
  reason?: string;
  error?: string;
}

// Search configuration
interface SearchConfig {
  enabled: boolean;
  apiKey?: string;
  maxResults: number;
  timeout: number;
}

// Get search configuration from environment
function getSearchConfig(): SearchConfig {
  return {
    enabled: process.env.NEWS_SEARCH_ENABLED === 'true',
    apiKey: process.env.SERPAPI_KEY,
    maxResults: 5,
    timeout: 10000, // 10 seconds
  };
}

// Extract keywords from content for search
function extractKeywords(content: string): string[] {
  // Remove common words and extract meaningful keywords
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did',
    'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those',
    'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'
  ]);
  
  const words = content
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.has(word));
  
  // Return unique keywords (up to 5 most relevant)
  return [...new Set(words)].slice(0, 5);
}

// Generate search queries from content
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

// Perform SerpAPI search
async function performSerpAPISearch(query: string, config: SearchConfig): Promise<NewsSearchResult> {
  if (!config.apiKey) {
    return {
      searchPerformed: false,
      sources: [],
      reason: 'serpapi_key_missing'
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);

    const response = await fetch('https://serpapi.com/search', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`SerpAPI error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Extract organic results
    const organicResults = data.organic_results || [];
    const sources = organicResults.slice(0, config.maxResults).map((result: any) => ({
      title: result.title || 'Unknown',
      url: result.link || '#',
      snippet: result.snippet || '',
      publishedAt: result.date || '',
      source: result.source || 'Unknown'
    }));

    return {
      searchPerformed: true,
      sources
    };
  } catch (error: any) {
    console.warn('SerpAPI search failed:', error.message);
    return {
      searchPerformed: false,
      sources: [],
      reason: 'serpapi_error',
      error: error.message
    };
  }
}

// Perform fallback search using multiple sources
async function performFallbackSearch(query: string, config: SearchConfig): Promise<NewsSearchResult> {
  const sources: Array<{
    title: string;
    url: string;
    snippet?: string;
    publishedAt?: string;
    source?: string;
  }> = [];

  try {
    // Try to get results from multiple free sources
    const searchPromises = [
      // You could add other free search APIs here
      // For now, we'll return a basic result
    ];

    await Promise.allSettled(searchPromises);

    // If no external sources work, return a basic result
    if (sources.length === 0) {
      return {
        searchPerformed: false,
        sources: [],
        reason: 'no_search_sources_available'
      };
    }

    return {
      searchPerformed: true,
      sources: sources.slice(0, config.maxResults)
    };
  } catch (error: any) {
    console.warn('Fallback search failed:', error.message);
    return {
      searchPerformed: false,
      sources: [],
      reason: 'fallback_search_error',
      error: error.message
    };
  }
}

// Main news search function
export async function performNewsSearch(content: string): Promise<NewsSearchResult> {
  const config = getSearchConfig();
  
  // If search is disabled, return immediately
  if (!config.enabled) {
    return {
      searchPerformed: false,
      sources: [],
      reason: 'news_search_disabled'
    };
  }

  // Extract keywords and generate queries
  const keywords = extractKeywords(content);
  const queries = generateSearchQueries(content);

  if (keywords.length === 0 || queries.length === 0) {
    return {
      searchPerformed: false,
      sources: [],
      reason: 'no_keywords_found'
    };
  }

  // Try primary search (SerpAPI)
  const primaryQuery = queries[0]; // Use the most relevant query
  const primaryResult = await performSerpAPISearch(primaryQuery, config);

  if (primaryResult.searchPerformed) {
    return primaryResult;
  }

  // If primary search fails, try fallback
  console.log('Primary search failed, trying fallback search');
  const fallbackResult = await performFallbackSearch(primaryQuery, config);

  return fallbackResult;
}

// Check if search should be performed based on content
export function shouldPerformSearch(content: string): boolean {
  const config = getSearchConfig();
  
  if (!config.enabled) {
    return false;
  }

  // Check for search-worthy content
  const keywords = extractKeywords(content);
  const hasEnoughKeywords = keywords.length >= 2;
  
  // Check for news-like content
  const newsIndicators = [
    'breaking', 'news', 'report', 'announcement', 'statement', 'official',
    'government', 'president', 'minister', 'election', 'vote', 'result',
    'crisis', 'emergency', 'disaster', 'accident', 'incident'
  ];
  
  const hasNewsIndicators = newsIndicators.some(indicator => 
    content.toLowerCase().includes(indicator)
  );

  return hasEnoughKeywords || hasNewsIndicators;
}

// Get search status for UI display
export function getSearchStatus(result: NewsSearchResult): {
  mode: 'ai-only' | 'ai-plus-web';
  message: string;
} {
  if (result.searchPerformed) {
    return {
      mode: 'ai-plus-web',
      message: 'AI + Web evidence'
    };
  }

  const reason = result.reason || 'unknown';
  const messages: Record<string, string> = {
    'news_search_disabled': 'Using AI-only mode (search disabled)',
    'serpapi_key_missing': 'Using AI-only mode (search key missing)',
    'no_keywords_found': 'Using AI-only mode (insufficient keywords)',
    'serpapi_error': 'Using AI-only mode (search unavailable)',
    'fallback_search_error': 'Using AI-only mode (search failed)',
    'no_search_sources_available': 'Using AI-only mode (no sources available)',
  };

  return {
    mode: 'ai-only',
    message: messages[reason] || 'Using AI-only mode'
  };
}
