# OpenRouter Integration Setup

This guide explains how to set up OpenRouter for free users in FakeVerifier.

## Overview

FakeVerifier now uses different AI models based on user subscription status:
- **Free users**: OpenRouter with Qwen models (free tier)
- **Paid users**: OpenAI GPT-4 models (premium tier)

## Environment Variables Required

Add these environment variables to your `.env.local` file:

```bash
# OpenAI API Key (for paid users)
OPENAI_API_KEY=sk-your-openai-api-key-here

# OpenRouter API Key (for free users)
OPENROUTER_API_KEY=sk-or-your-openrouter-api-key-here

# App URL (for OpenRouter headers)
NEXT_PUBLIC_APP_URL=https://your-app-domain.com
```

## Getting OpenRouter API Key

1. Go to [OpenRouter.ai](https://openrouter.ai/)
2. Sign up for a free account
3. Navigate to your API keys section
4. Create a new API key
5. Copy the key and add it to your environment variables

## Model Configuration

### Free Users (OpenRouter)
- **Default Model**: `qwen/qwen3-coder:free`
- **Search Model**: `qwen/qwen3-coder:free`
- **Analysis Model**: `qwen/qwen3-coder:free`
- **Max Tokens**: 2000
- **Temperature**: 0.3

### Paid Users (OpenAI)
- **Default Model**: `gpt-4o`
- **Search Model**: `gpt-4o-search-preview`
- **Analysis Model**: `gpt-4o`
- **Max Tokens**: 3000
- **Temperature**: 0.3

## How It Works

1. When a user makes a verification request, the system checks their authentication
2. If authenticated, it fetches their subscription status from Stripe
3. Based on subscription status, it determines the user tier (FREE or PAID)
4. The appropriate AI client and model are selected:
   - Free users get OpenRouter with Qwen models
   - Paid users get OpenAI with GPT-4 models
5. The analysis is performed using the selected model
6. The response includes the user tier and model used

## Benefits

- **Cost Savings**: Free users use OpenRouter's free tier instead of expensive OpenAI models
- **Scalability**: Can handle more free users without high costs
- **Quality**: Paid users still get premium GPT-4 models
- **Flexibility**: Easy to switch models or add new providers

## Troubleshooting

### OpenRouter API Errors
- Ensure your OpenRouter API key is valid
- Check that you have sufficient credits in your OpenRouter account
- Verify the `NEXT_PUBLIC_APP_URL` is set correctly

### Model Selection Issues
- Check that the user authentication is working properly
- Verify that the subscription status is being fetched correctly
- Ensure all environment variables are set

### Performance Issues
- Free models may be slower than GPT-4
- Consider adjusting token limits for better performance
- Monitor OpenRouter usage and rate limits
