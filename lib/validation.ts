/**
 * Validation utilities for API endpoints
 * Provides input validation and sanitization
 */

import { z } from 'zod';

// Message schema for API requests
export const MessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().min(1).max(2000),
});

// UTM parameters schema
export const UTMSchema = z.object({
  utm_source: z.string().max(100).optional(),
  utm_medium: z.string().max(100).optional(),
  utm_campaign: z.string().max(100).optional(),
  utm_term: z.string().max(100).optional(),
  utm_content: z.string().max(100).optional(),
});

// API request schema
export const APIRequestSchema = z.object({
  messages: z.array(MessageSchema).min(1).max(32),
  source: z.enum(['hero', 'chip', 'direct']).optional(),
  meta: z.object({
    utm: UTMSchema.optional(),
  }).optional(),
});

// Validation result type
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Validate API request
export function validateAPIRequest(body: unknown): ValidationResult<z.infer<typeof APIRequestSchema>> {
  try {
    const data = APIRequestSchema.parse(body);
    return { success: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors
        .map(err => `${err.path.join('.')}: ${err.message}`)
        .join(', ');
      return { success: false, error: `Validation error: ${errorMessage}` };
    }
    return { success: false, error: 'Invalid request format' };
  }
}

// Sanitize text content
export function sanitizeText(text: string): string {
  return text
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/data:/gi, '') // Remove data: protocol
    .replace(/vbscript:/gi, '') // Remove vbscript: protocol
    .trim();
}

// Validate and sanitize messages
export function validateAndSanitizeMessages(messages: Array<{ role: string; content: string }>): {
  success: boolean;
  messages?: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
  error?: string;
} {
  try {
    const sanitizedMessages = messages.map(msg => ({
      role: msg.role as 'user' | 'assistant' | 'system',
      content: sanitizeText(msg.content),
    }));

    // Validate total payload size
    const totalSize = sanitizedMessages.reduce((acc, msg) => acc + msg.content.length, 0);
    if (totalSize > 16000) {
      return { success: false, error: 'Total payload size exceeds 16KB limit' };
    }

    // Validate individual message sizes
    for (const msg of sanitizedMessages) {
      if (msg.content.length > 2000) {
        return { success: false, error: 'Individual message exceeds 2000 character limit' };
      }
    }

    return { success: true, messages: sanitizedMessages };
  } catch (error) {
    return { success: false, error: 'Failed to validate messages' };
  }
}

// Validate URL
export function isValidUrl(url: string): boolean {
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

// Extract and validate URLs from content
export function extractAndValidateUrls(content: string): string[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const matches = content.match(urlRegex) || [];
  return matches.filter(url => isValidUrl(url));
}
