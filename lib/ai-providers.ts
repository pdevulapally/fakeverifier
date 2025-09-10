/**
 * AI Provider Interface and Implementation
 * Provides a unified interface for different AI providers with graceful fallbacks
 */

import OpenAI from 'openai';

// Provider interface
export interface AIProvider {
  streamCompletion(params: {
    messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
    model: string;
    temperature?: number;
    topP?: number;
    maxTokens?: number;
    signal?: AbortSignal;
  }): AsyncIterable<string>;
}

// Provider types
export type ProviderType = 'openai' | 'openrouter' | 'qwen' | 'hf';

// Configuration interface
export interface ProviderConfig {
  provider: ProviderType;
  apiKey?: string;
  baseURL?: string;
  defaultModel: string;
  fallbackModels: string[];
}

// OpenAI Provider Implementation
export class OpenAIProvider implements AIProvider {
  private client: OpenAI;

  constructor(config: ProviderConfig) {
    if (!config.apiKey) {
      throw new Error('OpenAI API key is required');
    }

    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseURL,
    });
  }

  async *streamCompletion(params: {
    messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
    model: string;
    temperature?: number;
    topP?: number;
    maxTokens?: number;
    signal?: AbortSignal;
  }): AsyncIterable<string> {
    try {
      const stream = await this.client.chat.completions.create({
        model: params.model,
        messages: params.messages,
        temperature: params.temperature || 0.3,
        top_p: params.topP || 1,
        max_tokens: params.maxTokens || 2000,
        stream: true,
      }, {
        signal: params.signal,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          yield content;
        }
      }
    } catch (error: any) {
      console.error('OpenAI provider error:', error);
      throw new Error(`OpenAI API error: ${error.message}`);
    }
  }
}

// OpenRouter Provider Implementation
export class OpenRouterProvider implements AIProvider {
  private client: OpenAI;

  constructor(config: ProviderConfig) {
    if (!config.apiKey) {
      throw new Error('OpenRouter API key is required');
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: 'https://openrouter.ai/api/v1',
      defaultHeaders: {
        'HTTP-Referer': appUrl,
        'X-Title': 'FakeVerifier'
      }
    });
  }

  async *streamCompletion(params: {
    messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
    model: string;
    temperature?: number;
    topP?: number;
    maxTokens?: number;
    signal?: AbortSignal;
  }): AsyncIterable<string> {
    try {
      const stream = await this.client.chat.completions.create({
        model: params.model,
        messages: params.messages,
        temperature: params.temperature || 0.3,
        top_p: params.topP || 1,
        max_tokens: params.maxTokens || 2000,
        stream: true,
      }, {
        signal: params.signal,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          yield content;
        }
      }
    } catch (error: any) {
      console.error('OpenRouter provider error:', error);
      throw new Error(`OpenRouter API error: ${error.message}`);
    }
  }
}

// Hugging Face Provider Implementation
export class HuggingFaceProvider implements AIProvider {
  private apiKey: string;
  private baseURL: string;

  constructor(config: ProviderConfig) {
    if (!config.apiKey || !config.baseURL) {
      throw new Error('Hugging Face API key and base URL are required');
    }

    this.apiKey = config.apiKey;
    this.baseURL = config.baseURL;
  }

  async *streamCompletion(params: {
    messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
    model: string;
    temperature?: number;
    topP?: number;
    maxTokens?: number;
    signal?: AbortSignal;
  }): AsyncIterable<string> {
    try {
      // Convert messages to prompt format for HF
      const prompt = params.messages
        .map(msg => `${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}`)
        .join('\n\n') + '\n\nAssistant:';

      const response = await fetch(`${this.baseURL}/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            temperature: params.temperature || 0.3,
            top_p: params.topP || 1,
            max_new_tokens: params.maxTokens || 2000,
            return_full_text: false,
          },
        }),
        signal: params.signal,
      });

      if (!response.ok) {
        throw new Error(`Hugging Face API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Yield the generated text
      if (data.generated_text) {
        yield data.generated_text;
      }
    } catch (error: any) {
      console.error('Hugging Face provider error:', error);
      throw new Error(`Hugging Face API error: ${error.message}`);
    }
  }
}

// Provider Factory
export class ProviderFactory {
  static createProvider(config: ProviderConfig): AIProvider {
    switch (config.provider) {
      case 'openai':
        return new OpenAIProvider(config);
      case 'openrouter':
        return new OpenRouterProvider(config);
      case 'hf':
        return new HuggingFaceProvider(config);
      default:
        throw new Error(`Unsupported provider: ${config.provider}`);
    }
  }

  static getDefaultConfig(): ProviderConfig {
    const provider = (process.env.MODEL_PROVIDER as ProviderType) || 'openrouter';
    const defaultModel = process.env.MODEL_NAME || 'qwen/qwen3-coder:free';

    switch (provider) {
      case 'openai':
        return {
          provider: 'openai',
          apiKey: process.env.OPENAI_API_KEY,
          defaultModel: defaultModel,
          fallbackModels: ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'],
        };
      case 'openrouter':
        return {
          provider: 'openrouter',
          apiKey: process.env.OPENROUTER_API_KEY,
          defaultModel: defaultModel,
          fallbackModels: [
            'qwen/qwen3-coder:free',
            'mistralai/mistral-7b-instruct:free',
            'meta-llama/llama-3.1-8b-instruct:free',
            'google/gemma-2-9b-it:free'
          ],
        };
      case 'hf':
        return {
          provider: 'hf',
          apiKey: process.env.HF_API_TOKEN,
          baseURL: process.env.HF_API_URL,
          defaultModel: defaultModel,
          fallbackModels: ['microsoft/DialoGPT-medium', 'facebook/blenderbot-400M-distill'],
        };
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }
}

// Provider with Fallback Logic
export class FallbackProvider implements AIProvider {
  private providers: AIProvider[];
  private configs: ProviderConfig[];

  constructor(configs: ProviderConfig[]) {
    this.configs = configs;
    this.providers = configs
      .filter(config => {
        // Only include providers with valid API keys
        switch (config.provider) {
          case 'openai':
            return !!config.apiKey;
          case 'openrouter':
            return !!config.apiKey;
          case 'hf':
            return !!config.apiKey && !!config.baseURL;
          default:
            return false;
        }
      })
      .map(config => ProviderFactory.createProvider(config));
  }

  async *streamCompletion(params: {
    messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
    model: string;
    temperature?: number;
    topP?: number;
    maxTokens?: number;
    signal?: AbortSignal;
  }): AsyncIterable<string> {
    let lastError: Error | null = null;

    // Try each provider in order
    for (let i = 0; i < this.providers.length; i++) {
      const provider = this.providers[i];
      const config = this.configs[i];

      try {
        // Try the requested model first, then fallback models
        const modelsToTry = [params.model, ...config.fallbackModels];
        
        for (const model of modelsToTry) {
          try {
            console.log(`Trying provider ${config.provider} with model ${model}`);
            
            const stream = provider.streamCompletion({
              ...params,
              model,
            });

            // Yield from the stream
            for await (const chunk of stream) {
              yield chunk;
            }

            // If we get here, the request was successful
            console.log(`Successfully used provider ${config.provider} with model ${model}`);
            return;
          } catch (error: any) {
            console.warn(`Provider ${config.provider} with model ${model} failed:`, error.message);
            lastError = error;
            continue;
          }
        }
      } catch (error: any) {
        console.warn(`Provider ${config.provider} failed completely:`, error.message);
        lastError = error;
        continue;
      }
    }

    // If all providers failed, throw the last error
    throw lastError || new Error('All AI providers failed');
  }
}

// Utility function to create a fallback provider
export function createFallbackProvider(): FallbackProvider {
  const configs: ProviderConfig[] = [];

  // Add OpenRouter config if available
  if (process.env.OPENROUTER_API_KEY) {
    configs.push({
      provider: 'openrouter',
      apiKey: process.env.OPENROUTER_API_KEY,
      defaultModel: process.env.MODEL_NAME || 'qwen/qwen3-coder:free',
      fallbackModels: [
        'qwen/qwen3-coder:free',
        'mistralai/mistral-7b-instruct:free',
        'meta-llama/llama-3.1-8b-instruct:free',
        'google/gemma-2-9b-it:free'
      ],
    });
  }

  // Add OpenAI config if available
  if (process.env.OPENAI_API_KEY) {
    configs.push({
      provider: 'openai',
      apiKey: process.env.OPENAI_API_KEY,
      defaultModel: 'gpt-4o',
      fallbackModels: ['gpt-4o-mini', 'gpt-3.5-turbo'],
    });
  }

  // Add Hugging Face config if available
  if (process.env.HF_API_TOKEN && process.env.HF_API_URL) {
    configs.push({
      provider: 'hf',
      apiKey: process.env.HF_API_TOKEN,
      baseURL: process.env.HF_API_URL,
      defaultModel: 'microsoft/DialoGPT-medium',
      fallbackModels: ['facebook/blenderbot-400M-distill'],
    });
  }

  if (configs.length === 0) {
    throw new Error('No AI providers configured. Please set at least one API key.');
  }

  return new FallbackProvider(configs);
}
