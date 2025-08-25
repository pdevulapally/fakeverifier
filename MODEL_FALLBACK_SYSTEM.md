# AI Model Fallback System

## Overview

The FakeVerifier application now includes a sophisticated model fallback system that automatically switches between different AI models when rate limits are hit, with different behaviors for free and pro users.

## Key Features

### 🆓 Free Users
- **Multiple Free Models**: Access to 4 different OpenRouter free models
- **Automatic Fallback**: When one model hits rate limit, automatically switches to another
- **Upgrade Prompts**: Encourages upgrading to Pro when all free models are exhausted
- **5-minute Cooldown**: Rate-limited models are blocked for 5 minutes

### 💎 Pro Users
- **Premium Models**: Access to OpenAI GPT-4o models
- **Faster Recovery**: 30-second retry intervals
- **Priority Support**: Better error handling and support

## Free Tier Models

### Primary Models (in order of preference)
1. **Qwen3 Coder** (`qwen/qwen3-coder:free`)
   - Best for: Code analysis, technical content
   - Rate limit: 10 requests/minute

2. **Mistral 7B** (`mistralai/mistral-7b-instruct:free`)
   - Best for: General analysis, balanced performance
   - Rate limit: 15 requests/minute

3. **Llama 3.1 8B** (`meta-llama/llama-3.1-8b-instruct:free`)
   - Best for: Creative content, detailed analysis
   - Rate limit: 12 requests/minute

4. **Gemma 2 9B** (`google/gemma-2-9b-it:free`)
   - Best for: Factual content, research
   - Rate limit: 8 requests/minute

## Pro Tier Models

### Premium Models
1. **GPT-4o** (`gpt-4o`)
   - Best for: All use cases
   - Rate limit: 500 requests/minute
   - Features: Real-time search, advanced reasoning

2. **GPT-4o Search** (`gpt-4o-search-preview`)
   - Best for: Real-time news verification
   - Rate limit: 300 requests/minute
   - Features: Web search integration

## How the Fallback System Works

### 1. Model Selection
```typescript
const modelInfo = getModelForUseCase(userTier, useCase, attemptedModels);
```

### 2. Rate Limit Detection
```typescript
if (error.status === 429) {
  markModelRateLimited(userTier, modelToUse);
  attemptedModels.push(modelToUse);
}
```

### 3. Automatic Fallback
- System tracks which models have been attempted
- Automatically tries next available model
- Continues until all models are exhausted

### 4. User Feedback
- **Free Users**: "Free tier rate limit reached. Upgrade to Pro for unlimited access to premium AI models."
- **Pro Users**: "Pro tier rate limit reached. Please wait a moment and try again."

## API Response Examples

### Successful Fallback (Free User)
```json
{
  "analysis": "...",
  "model": "mistralai/mistral-7b-instruct:free",
  "userTier": "FREE",
  "fallbackInfo": {
    "message": "Switched to fallback model: mistralai/mistral-7b-instruct:free"
  }
}
```

### Rate Limit Exceeded (Free User)
```json
{
  "error": "Free tier rate limit reached for qwen/qwen3-coder:free. Upgrade to Pro for unlimited access to premium AI models like GPT-4o.",
  "details": "Too many requests to the AI service",
  "retryAfter": "5 minutes",
  "upgradeSuggestion": "Upgrade to Pro for unlimited access to premium AI models, faster response times, and priority support.",
  "userTier": "FREE"
}
```

### Rate Limit Exceeded (Pro User)
```json
{
  "error": "Pro tier rate limit reached. Please wait a moment and try again.",
  "details": "Too many requests to the AI service",
  "retryAfter": "30 seconds",
  "userTier": "PAID"
}
```

## Model Usage Tracking

### In-Memory Tracking
```typescript
const modelUsageTracker = new Map<string, { 
  lastUsed: number; 
  rateLimitHit: boolean 
}>();
```

### Tracking Logic
- **Successful Use**: Marks model as available after 1 minute
- **Rate Limited**: Blocks model for 5 minutes
- **Key Format**: `${userTier}-${model}`

## Configuration

### Environment Variables
```bash
# Required for free users
OPENROUTER_API_KEY=sk-or-your-openrouter-api-key

# Required for pro users
OPENAI_API_KEY=sk-your-openai-api-key

# Required for both
NEXT_PUBLIC_APP_URL=https://your-app-domain.com
```

### Model Configuration
```typescript
export const MODEL_CONFIG = {
  FREE: {
    provider: 'openrouter',
    models: {
      default: [
        'qwen/qwen3-coder:free',
        'mistralai/mistral-7b-instruct:free',
        'meta-llama/llama-3.1-8b-instruct:free',
        'google/gemma-2-9b-it:free'
      ]
    },
    fallbackMessage: "Free tier rate limit reached. Upgrade to Pro for unlimited access to premium AI models."
  },
  PAID: {
    provider: 'openai',
    models: {
      default: ['gpt-4o']
    },
    fallbackMessage: "Pro tier rate limit reached. Please wait a moment and try again."
  }
};
```

## Error Handling

### Rate Limit Errors (429)
- **Free Users**: 5-minute cooldown, upgrade suggestion
- **Pro Users**: 30-second retry, standard error message

### Authentication Errors (401/403)
- Both tiers: Immediate error, no retry

### Timeout Errors (408)
- Both tiers: Configurable timeout handling

## Benefits

### For Free Users
- ✅ Multiple model options
- ✅ Automatic fallback
- ✅ Clear upgrade path
- ✅ No service interruption

### For Pro Users
- ✅ Premium model access
- ✅ Faster recovery times
- ✅ Better error handling
- ✅ Priority support

### For Developers
- ✅ Easy to extend with new models
- ✅ Configurable rate limits
- ✅ Comprehensive logging
- ✅ User-friendly error messages

## Monitoring and Debugging

### Console Logs
```
Model qwen/qwen3-coder:free marked as rate limited for FREE tier
Model fallback: Switched to fallback model: mistralai/mistral-7b-instruct:free
AI completion successful
```

### Error Tracking
- Model usage patterns
- Rate limit frequency
- Fallback success rates
- User tier distribution

## Future Enhancements

### Planned Features
1. **Model Performance Tracking**: Monitor which models work best for different content types
2. **Dynamic Model Selection**: Choose models based on content analysis
3. **User Preferences**: Allow users to set preferred models
4. **Advanced Rate Limiting**: Implement token-based rate limiting
5. **Model Health Monitoring**: Track model availability and performance

### Potential Models to Add
- **Claude Instant** (when available)
- **Gemini Pro** (when available)
- **Custom fine-tuned models**

## Troubleshooting

### Common Issues

#### All Models Rate Limited
**Problem**: All free models are hitting rate limits
**Solution**: 
- Wait 5 minutes for models to reset
- Consider upgrading to Pro
- Check if multiple users are sharing the same API key

#### Model Not Available
**Problem**: Specific model returns 404 or unavailable
**Solution**:
- System automatically falls back to next available model
- Check OpenRouter status page
- Verify API key permissions

#### Slow Response Times
**Problem**: Models are responding slowly
**Solution**:
- Free users: Normal for free tier models
- Pro users: Check OpenAI status
- Consider model-specific timeouts

## Best Practices

### For Free Users
1. **Space Out Requests**: Don't make rapid successive requests
2. **Use Efficient Prompts**: Shorter, focused prompts work better
3. **Consider Upgrading**: Pro tier offers much better performance

### For Pro Users
1. **Monitor Usage**: Keep track of rate limits
2. **Optimize Prompts**: Use GPT-4o efficiently
3. **Contact Support**: For persistent issues

### For Developers
1. **Monitor Logs**: Track model usage and errors
2. **Update Models**: Keep model list current
3. **Test Fallbacks**: Regularly test fallback scenarios
