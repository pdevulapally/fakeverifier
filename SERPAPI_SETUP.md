# SerpAPI Integration Setup Guide

## Overview
This integration provides real-time Google search and news search capabilities using SerpAPI, with intelligent quota management for the free plan (250 searches/month).

## Features
- ✅ **Google Search** - Real-time web search results
- ✅ **News Search** - Latest news articles from around the web
- ✅ **Quota Management** - Automatic tracking and limits
- ✅ **Real-time Results** - Live search with instant feedback
- ✅ **Responsive UI** - Modern interface with progress indicators

## Setup Instructions

### 1. Get SerpAPI Key
1. Sign up at [SerpAPI](https://serpapi.com/)
2. Get your API key from the dashboard
3. Note: Free plan includes 250 searches per month

### 2. Environment Variables
Add to your `.env.local` file:
```env
SERPAPI_KEY=your_serpapi_api_key_here
```

### 3. Install Dependencies
```bash
npm install serpapi
```

## API Endpoints

### Google Search
- **POST** `/api/serpapi/google-search`
- **GET** `/api/serpapi/google-search` (quota status)

**Request Body:**
```json
{
  "query": "search term",
  "num": 10,
  "gl": "uk",
  "hl": "en",
  "safe": "active"
}
```

### News Search
- **POST** `/api/serpapi/news-search`
- **GET** `/api/serpapi/news-search` (quota status)

**Request Body:**
```json
{
  "query": "news search term",
  "num": 10,
  "gl": "uk",
  "hl": "en"
}
```

## Usage Examples

### Frontend Component
```tsx
import { SerpAPISearch } from '@/components/serpapi-search'

export default function MyPage() {
  return (
    <div>
      <SerpAPISearch />
    </div>
  )
}
```

### API Usage
```javascript
// Google Search
const response = await fetch('/api/serpapi/google-search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: 'fake news detection' })
})

// News Search
const response = await fetch('/api/serpapi/news-search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: 'breaking news' })
})
```

## Quota Management

### Features
- **Automatic Tracking** - Counts searches in real-time
- **Monthly Reset** - Quota resets on the 1st of each month
- **Visual Indicators** - Progress bars and warnings
- **Error Handling** - Graceful handling of quota exceeded

### Quota Status Response
```json
{
  "quota": {
    "used": 45,
    "limit": 250,
    "remaining": 205,
    "resetDate": "2025-09-01"
  }
}
```

## Demo Page
Visit `/serpapi-demo` to see the integration in action.

## Error Handling

### Quota Exceeded
```json
{
  "error": "Search quota exceeded",
  "quota": {
    "used": 250,
    "limit": 250,
    "remaining": 0,
    "resetDate": "2025-09-01"
  }
}
```

### API Key Missing
```json
{
  "error": "SERPAPI_KEY not configured"
}
```

## Configuration Options

### Search Parameters
- `num` - Number of results (default: 10, max: 100)
- `gl` - Geographic location (default: 'uk')
- `hl` - Language (default: 'en')
- `safe` - Safe search (default: 'active')

### Regional Settings
- **UK**: `gl=uk`, `hl=en`
- **US**: `gl=us`, `hl=en`
- **Canada**: `gl=ca`, `hl=en`

## Best Practices

1. **Monitor Usage** - Check quota regularly
2. **Cache Results** - Store frequently searched terms
3. **Error Handling** - Always handle quota exceeded errors
4. **Rate Limiting** - Don't make too many requests quickly
5. **User Feedback** - Show quota status to users

## Troubleshooting

### Common Issues
1. **API Key Not Working** - Check environment variables
2. **Quota Exceeded** - Wait for monthly reset or upgrade plan
3. **No Results** - Check query format and parameters
4. **Slow Response** - SerpAPI can take 1-3 seconds

### Debug Mode
Enable debug logging by checking browser console for detailed error messages.

## Security Notes
- API key is server-side only
- Quota tracking is per-user session
- No sensitive data is logged
- HTTPS required for production

## Support
- SerpAPI Documentation: https://serpapi.com/docs
- Free Plan Limits: 250 searches/month
- Paid Plans: Available for higher limits
