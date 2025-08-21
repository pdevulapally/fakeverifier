import { NextRequest, NextResponse } from 'next/server';
import { XMLParser } from 'fast-xml-parser';

// Sky News RSS feed URLs
const SKY_NEWS_RSS_URLS = {
  home: 'https://feeds.skynews.com/feeds/rss/home.xml',
  world: 'https://feeds.skynews.com/feeds/rss/world.xml',
  uk: 'https://feeds.skynews.com/feeds/rss/uk.xml',
  politics: 'https://feeds.skynews.com/feeds/rss/politics.xml',
  business: 'https://feeds.skynews.com/feeds/rss/business.xml',
  technology: 'https://feeds.skynews.com/feeds/rss/technology.xml',
  entertainment: 'https://feeds.skynews.com/feeds/rss/entertainment.xml',
  sports: 'https://feeds.skynews.com/feeds/rss/sports.xml'
};

// XML Parser configuration
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text",
  parseAttributeValue: true,
  parseTagValue: false,
  trimValues: true,
  parseTrueNumberOnly: false,
  arrayMode: false
});

// Fetch RSS feed with error handling and timeout
async function fetchRSSFeed(url: string): Promise<any> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'FakeVerifier-Bot/1.0 (RSS Feed Parser)',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache'
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const xmlText = await response.text();
    const parsedData = parser.parse(xmlText);
    
    return parsedData;
  } catch (error) {
    console.error(`Error fetching RSS feed from ${url}:`, error);
    return null;
  }
}

// Parse RSS feed data into standardized format
function parseRSSData(rssData: any, category: string): any[] {
  try {
    const articles: any[] = [];
    
    // Handle different RSS feed structures
    const channel = rssData.rss?.channel || rssData.feed || rssData;
    const items = channel?.item || channel?.entry || [];
    
    if (!Array.isArray(items)) {
      console.warn('No items found in RSS feed');
      return [];
    }

    items.forEach((item: any, index: number) => {
      try {
        // Extract article data with fallbacks for different RSS formats
        const title = item.title?.['#text'] || item.title || item.name || 'No Title';
        const description = item.description?.['#text'] || item.description || item.summary?.['#text'] || item.summary || '';
        const link = item.link?.['#text'] || item.link || item.url || '';
        const pubDate = item.pubDate?.['#text'] || item.pubDate || item.published?.['#text'] || item.published || item.updated?.['#text'] || item.updated || '';
        const guid = item.guid?.['#text'] || item.guid || item.id || `sky-news-${category}-${index}`;
        
        // Extract author if available
        const author = item.author?.['#text'] || item.author || item['dc:creator']?.['#text'] || item['dc:creator'] || 'Sky News';
        
        // Extract category/tags
        const categoryTags = item.category?.['#text'] || item.category || item.tags || [];
        const tags = Array.isArray(categoryTags) ? categoryTags : [categoryTags].filter(Boolean);
        
        // Extract media content (images, videos)
        const media = item['media:content'] || item['media:thumbnail'] || item.enclosure;
        const mediaUrl = media?.['@_url'] || media?.['#text'] || '';
        const mediaType = media?.['@_type'] || '';
        
        // Parse publication date
        let publishedAt = new Date().toISOString();
        if (pubDate) {
          try {
            const parsedDate = new Date(pubDate);
            if (!isNaN(parsedDate.getTime())) {
              publishedAt = parsedDate.toISOString();
            }
          } catch (dateError) {
            console.warn('Error parsing date:', pubDate, dateError);
          }
        }

        // Clean and validate data
        if (title && title !== 'No Title' && link) {
          articles.push({
            id: guid,
            title: title.trim(),
            description: description.trim(),
            url: link.trim(),
            publishedAt,
            author: author.trim(),
            category,
            tags: tags.filter((tag: string) => tag && tag.trim()),
            mediaUrl: mediaUrl || '',
            mediaType: mediaType || '',
            source: 'Sky News',
            api: 'Sky News RSS',
            relevance: 0 // Will be calculated later
          });
        }
      } catch (itemError) {
        console.warn('Error parsing RSS item:', itemError);
      }
    });

    return articles;
  } catch (error) {
    console.error('Error parsing RSS data:', error);
    return [];
  }
}

// Calculate relevance score for articles based on keywords
function calculateRelevance(article: any, keywords: string[]): number {
  let score = 0;
  const articleText = `${article.title} ${article.description}`.toLowerCase();
  
  // Check for keyword matches
  keywords.forEach(keyword => {
    const keywordLower = keyword.toLowerCase();
    if (articleText.includes(keywordLower)) {
      score += 15; // Higher weight for Sky News matches
    }
  });
  
  // Boost score for recent articles (within last 24 hours)
  const articleDate = new Date(article.publishedAt);
  const daysDiff = (Date.now() - articleDate.getTime()) / (1000 * 60 * 60 * 24);
  if (daysDiff <= 1) {
    score += 20;
  } else if (daysDiff <= 7) {
    score += 10;
  }
  
  // Boost score for specific categories
  if (article.category === 'politics') score += 5;
  if (article.category === 'world') score += 5;
  if (article.category === 'uk') score += 5;
  
  return Math.min(score, 100); // Cap at 100
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || 'home';
    const limit = parseInt(searchParams.get('limit') || '20');
    
    // Extract keywords from query
    const keywords = query.toLowerCase().split(/\s+/).filter(word => word.length > 2);
    
    // Get RSS feed URL for the requested category
    const rssUrl = SKY_NEWS_RSS_URLS[category as keyof typeof SKY_NEWS_RSS_URLS] || SKY_NEWS_RSS_URLS.home;
    
    // Fetch RSS feed
    const rssData = await fetchRSSFeed(rssUrl);
    
    if (!rssData) {
      return NextResponse.json(
        { error: 'Failed to fetch Sky News RSS feed' },
        { status: 500 }
      );
    }
    
    // Parse RSS data
    const articles = parseRSSData(rssData, category);
    
    // Calculate relevance scores and filter by query if provided
    let filteredArticles = articles;
    if (query && keywords.length > 0) {
      filteredArticles = articles.filter(article => {
        const articleText = `${article.title} ${article.description}`.toLowerCase();
        return keywords.some(keyword => articleText.includes(keyword));
      });
    }
    
    // Calculate relevance scores
    filteredArticles = filteredArticles.map(article => ({
      ...article,
      relevance: calculateRelevance(article, keywords)
    }));
    
    // Sort by relevance and date, then limit results
    const sortedArticles = filteredArticles
      .sort((a, b) => {
        // First sort by relevance
        if (b.relevance !== a.relevance) {
          return b.relevance - a.relevance;
        }
        // Then by date (newest first)
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      })
      .slice(0, limit);
    
    return NextResponse.json({
      success: true,
      data: sortedArticles,
      total: articles.length,
      filtered: filteredArticles.length,
      returned: sortedArticles.length,
      category,
      query: query || null,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Sky News RSS API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Sky News RSS feed. Please try again.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { query, category = 'home', limit = 20 } = await request.json();
    
    // Extract keywords from query
    const keywords = query ? query.toLowerCase().split(/\s+/).filter((word: string) => word.length > 2) : [];
    
    // Get RSS feed URL for the requested category
    const rssUrl = SKY_NEWS_RSS_URLS[category as keyof typeof SKY_NEWS_RSS_URLS] || SKY_NEWS_RSS_URLS.home;
    
    // Fetch RSS feed
    const rssData = await fetchRSSFeed(rssUrl);
    
    if (!rssData) {
      return NextResponse.json(
        { error: 'Failed to fetch Sky News RSS feed' },
        { status: 500 }
      );
    }
    
    // Parse RSS data
    const articles = parseRSSData(rssData, category);
    
    // Calculate relevance scores and filter by query if provided
    let filteredArticles = articles;
    if (query && keywords.length > 0) {
      filteredArticles = articles.filter(article => {
        const articleText = `${article.title} ${article.description}`.toLowerCase();
        return keywords.some(keyword => articleText.includes(keyword));
      });
    }
    
    // Calculate relevance scores
    filteredArticles = filteredArticles.map(article => ({
      ...article,
      relevance: calculateRelevance(article, keywords)
    }));
    
    // Sort by relevance and date, then limit results
    const sortedArticles = filteredArticles
      .sort((a, b) => {
        // First sort by relevance
        if (b.relevance !== a.relevance) {
          return b.relevance - a.relevance;
        }
        // Then by date (newest first)
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      })
      .slice(0, limit);
    
    return NextResponse.json({
      success: true,
      data: sortedArticles,
      total: articles.length,
      filtered: filteredArticles.length,
      returned: sortedArticles.length,
      category,
      query: query || null,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Sky News RSS API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Sky News RSS feed. Please try again.' },
      { status: 500 }
    );
  }
}
