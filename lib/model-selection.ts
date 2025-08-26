import OpenAI from 'openai';

// Model configuration for different user tiers with fallback options
export const MODEL_CONFIG = {
  FREE: {
    provider: 'openrouter',
    models: {
      default: [
        'qwen/qwen3-coder:free',
        'mistralai/mistral-7b-instruct:free',
        'meta-llama/llama-3.1-8b-instruct:free',
        'google/gemma-2-9b-it:free'
      ],
      search: [
        'qwen/qwen3-coder:free',
        'mistralai/mistral-7b-instruct:free',
        'meta-llama/llama-3.1-8b-instruct:free'
      ],
      analysis: [
        'qwen/qwen3-coder:free',
        'mistralai/mistral-7b-instruct:free',
        'meta-llama/llama-3.1-8b-instruct:free'
      ]
    },
    maxTokens: 2000,
    temperature: 0.3,
    fallbackMessage: "Free tier rate limit reached. Upgrade to Pro for unlimited access to premium AI models."
  },
  PAID: {
    provider: 'openai',
    models: {
      default: ['gpt-4o'],
      search: ['gpt-4o-search-preview'],
      analysis: ['gpt-4o']
    },
    maxTokens: 3000,
    temperature: 0.3,
    fallbackMessage: "Pro tier rate limit reached. Please wait a moment and try again."
  }
};

// Track model usage and rate limit status
const modelUsageTracker = new Map<string, { lastUsed: number; rateLimitHit: boolean }>();

// Function to determine user tier based on subscription status
export function getUserTier(hasSubscription: boolean, subscriptionData?: any): 'FREE' | 'PAID' {
  if (!hasSubscription || !subscriptionData) {
    return 'FREE';
  }
  
  // Check if subscription is active
  if (subscriptionData.status === 'active' && !subscriptionData.cancel_at_period_end) {
    return 'PAID';
  }
  
  return 'FREE';
}

// Function to get the appropriate model configuration
export function getModelConfig(userTier: 'FREE' | 'PAID') {
  return MODEL_CONFIG[userTier];
}

// Function to create AI client based on user tier
export function createAIClient(userTier: 'FREE' | 'PAID') {
  const config = getModelConfig(userTier);
  
  if (userTier === 'FREE') {
    // Use OpenRouter for free users
    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error('OPENROUTER_API_KEY environment variable is required for free tier users');
    }
    
    // Use a fallback for NEXT_PUBLIC_APP_URL if not set
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    return new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: 'https://openrouter.ai/api/v1',
      defaultHeaders: {
        'HTTP-Referer': appUrl,
        'X-Title': 'FakeVerifier'
      }
    });
  } else {
    // Use OpenAI for paid users
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is required for paid tier users');
    }
    
    return new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
}

// Function to get the next available model for a specific use case with fallback
export function getModelForUseCase(userTier: 'FREE' | 'PAID', useCase: 'default' | 'search' | 'analysis', attemptedModels: string[] = []): { model: string; isFallback: boolean; message?: string } {
  const config = getModelConfig(userTier);
  const modelList = config.models[useCase];
  
  // If modelList is an array, use fallback logic
  if (Array.isArray(modelList)) {
    // Find the first model that hasn't been attempted or isn't rate limited
    for (const model of modelList) {
      if (!attemptedModels.includes(model)) {
        const modelKey = `${userTier}-${model}`;
        const usage = modelUsageTracker.get(modelKey);
        
        // If model hasn't been used recently or rate limit was hit more than 5 minutes ago, try it
        if (!usage || 
            (usage.rateLimitHit && Date.now() - usage.lastUsed > 5 * 60 * 1000) ||
            (!usage.rateLimitHit && Date.now() - usage.lastUsed > 60 * 1000)) {
          
          return { 
            model, 
            isFallback: attemptedModels.length > 0,
            message: attemptedModels.length > 0 ? `Switched to fallback model: ${model}` : undefined
          };
        }
      }
    }
    
    // If all models have been attempted or are rate limited
    return {
      model: modelList[0], // Return first model as fallback
      isFallback: true,
      message: config.fallbackMessage
    };
  }
  
  // If modelList is a string (single model), return it
  return { 
    model: modelList as string, 
    isFallback: false 
  };
}

// Function to mark a model as rate limited
export function markModelRateLimited(userTier: 'FREE' | 'PAID', model: string) {
  const modelKey = `${userTier}-${model}`;
  modelUsageTracker.set(modelKey, {
    lastUsed: Date.now(),
    rateLimitHit: true
  });
  console.log(`Model ${model} marked as rate limited for ${userTier} tier`);
}

// Function to mark a model as successfully used
export function markModelUsed(userTier: 'FREE' | 'PAID', model: string) {
  const modelKey = `${userTier}-${model}`;
  modelUsageTracker.set(modelKey, {
    lastUsed: Date.now(),
    rateLimitHit: false
  });
}

// Function to get model parameters
export function getModelParams(userTier: 'FREE' | 'PAID') {
  const config = getModelConfig(userTier);
  return {
    max_tokens: config.maxTokens,
    temperature: config.temperature
  };
}

// Function to get user-friendly error message based on tier and rate limit
export function getRateLimitMessage(userTier: 'FREE' | 'PAID', model: string): string {
  if (userTier === 'FREE') {
    return `Free tier rate limit reached for ${model}. Upgrade to Pro for unlimited access to premium AI models like GPT-4o.`;
  } else {
    return `Pro tier rate limit reached. Please wait a moment and try again.`;
  }
}

// Function to get upgrade suggestion for free users
export function getUpgradeSuggestion(): string {
  return "Upgrade to Pro for unlimited access to premium AI models, faster response times, and priority support.";
}
