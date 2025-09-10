/**
 * Security utilities for API endpoints
 * Provides input sanitization, XSS prevention, and security headers
 */

// Sanitize HTML content to prevent XSS
export function sanitizeHtml(html: string): string {
  return html
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Sanitize text content
export function sanitizeText(text: string): string {
  return text
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/data:/gi, '') // Remove data: protocol
    .replace(/vbscript:/gi, '') // Remove vbscript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
}

// Validate and sanitize URLs
export function sanitizeUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return null;
    }
    
    // Block suspicious domains
    const blockedDomains = [
      'malware.com', 'phishing.com', 'scam.com', 'virus.com',
      'localhost', '127.0.0.1', '0.0.0.0', '::1'
    ];
    
    const hostname = urlObj.hostname.toLowerCase();
    if (blockedDomains.some(domain => hostname.includes(domain))) {
      return null;
    }
    
    // Block suspicious file extensions
    const suspiciousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.com'];
    if (suspiciousExtensions.some(ext => urlObj.pathname.toLowerCase().endsWith(ext))) {
      return null;
    }
    
    return urlObj.toString();
  } catch {
    return null;
  }
}

// Escape special characters for JSON
export function escapeJsonString(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

// Validate content length and structure
export function validateContent(content: string): {
  isValid: boolean;
  error?: string;
  sanitized?: string;
} {
  // Check length
  if (content.length === 0) {
    return { isValid: false, error: 'Content cannot be empty' };
  }
  
  if (content.length > 2000) {
    return { isValid: false, error: 'Content exceeds 2000 character limit' };
  }
  
  // Check for suspicious patterns
  const suspiciousPatterns = [
    /<script[^>]*>/gi,
    /javascript:/gi,
    /data:text\/html/gi,
    /vbscript:/gi,
    /on\w+\s*=/gi,
  ];
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(content)) {
      return { isValid: false, error: 'Content contains potentially malicious code' };
    }
  }
  
  // Sanitize and return
  const sanitized = sanitizeText(content);
  return { isValid: true, sanitized };
}

// Generate secure headers for API responses
export function getSecurityHeaders(): Record<string, string> {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
  };
}

// Validate request origin
export function validateOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  
  // Allow same-origin requests
  if (!origin && !referer) {
    return true;
  }
  
  // Get allowed origins from environment
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  
  if (appUrl) {
    allowedOrigins.push(appUrl);
  }
  
  // Check if origin is allowed
  if (origin && allowedOrigins.some(allowed => origin.startsWith(allowed))) {
    return true;
  }
  
  // Check referer as fallback
  if (referer && allowedOrigins.some(allowed => referer.startsWith(allowed))) {
    return true;
  }
  
  return false;
}

// Rate limiting key generation
export function generateRateLimitKey(request: Request): string {
  // Get client IP
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const clientIp = forwarded?.split(',')[0] || realIp || 'unknown';
  
  // Get user agent for additional uniqueness
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  // Create a hash of IP + User Agent for rate limiting
  return `${clientIp}:${userAgent}`;
}

// Log security events
export function logSecurityEvent(
  event: string,
  details: Record<string, any>,
  request?: Request
): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    details,
    ip: request ? generateRateLimitKey(request) : 'unknown',
    userAgent: request?.headers.get('user-agent') || 'unknown',
  };
  
  // In production, you might want to send this to a security monitoring service
  console.warn('Security Event:', JSON.stringify(logEntry));
}

// Validate file uploads
export function validateFileUpload(file: File): {
  isValid: boolean;
  error?: string;
} {
  // Check file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    return { isValid: false, error: 'File size exceeds 10MB limit' };
  }
  
  // Check file type
  const allowedTypes = [
    'text/plain',
    'text/csv',
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
  ];
  
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'File type not allowed' };
  }
  
  // Check file name
  const suspiciousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.com', '.js', '.html'];
  const fileName = file.name.toLowerCase();
  
  if (suspiciousExtensions.some(ext => fileName.endsWith(ext))) {
    return { isValid: false, error: 'File extension not allowed' };
  }
  
  return { isValid: true };
}

// Sanitize file name
export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special characters with underscores
    .replace(/_{2,}/g, '_') // Replace multiple underscores with single
    .replace(/^_|_$/g, '') // Remove leading/trailing underscores
    .substring(0, 100); // Limit length
}
