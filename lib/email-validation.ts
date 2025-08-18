// Dynamic disposable domain detection
let DISPOSABLE_DOMAINS_CACHE = new Set<string>();
let DISPOSABLE_DOMAINS_LAST_UPDATE = 0;
const DISPOSABLE_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Dynamic test pattern detection
let TEST_PATTERNS_CACHE = new Set<string>();
let TEST_PATTERNS_LAST_UPDATE = 0;
const TEST_PATTERNS_CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours

// Dynamic inappropriate words detection
let INAPPROPRIATE_WORDS_CACHE = new Set<string>();
let INAPPROPRIATE_WORDS_LAST_UPDATE = 0;
const INAPPROPRIATE_CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours

// Test email patterns to block
const TEST_EMAIL_PATTERNS = [
  /^test@/i,
  /^demo@/i,
  /^example@/i,
  /^sample@/i,
  /^fake@/i,
  /^dummy@/i,
  /^temp@/i,
  /^tmp@/i,
  /^admin@/i,
  /^user@/i,
  /^guest@/i,
  /^info@/i,
  /^contact@/i,
  /^support@/i,
  /^help@/i,
  /^noreply@/i,
  /^no-reply@/i,
  /^donotreply@/i,
  /^donot-reply@/i,
  /^webmaster@/i,
  /^postmaster@/i,
  /^mailer-daemon@/i,
  /^daemon@/i,
  /^nobody@/i,
  /^root@/i,
  /^system@/i,
  /^service@/i,
  /^api@/i,
  /^bot@/i,
  /^robot@/i,
  /^automated@/i,
  /^auto@/i,
  /^spam@/i,
  /^junk@/i,
  /^trash@/i,
  /^garbage@/i,
  /^delete@/i,
  /^remove@/i,
  /^block@/i,
  /^ban@/i,
  /^hack@/i,
  /^crack@/i,
  /^exploit@/i,
  /^virus@/i,
  /^malware@/i,
  /^phish@/i,
  /^scam@/i,
  /^fraud@/i,
  /^fake@/i,
  /^bogus@/i,
  /^invalid@/i,
  /^wrong@/i,
  /^error@/i,
  /^bug@/i,
  /^debug@/i,
  /^test\d+@/i,
  /^demo\d+@/i,
  /^example\d+@/i,
  /^sample\d+@/i,
  /^user\d+@/i,
  /^guest\d+@/i,
  /^temp\d+@/i,
  /^tmp\d+@/i,
  /^fake\d+@/i,
  /^dummy\d+@/i,
  /^testuser@/i,
  /^demouser@/i,
  /^exampleuser@/i,
  /^sampleuser@/i,
  /^fakeuser@/i,
  /^dummyuser@/i,
  /^testaccount@/i,
  /^demoaccount@/i,
  /^exampleaccount@/i,
  /^sampleaccount@/i,
  /^fakeaccount@/i,
  /^dummyaccount@/i
];

export async function validateEmail(email: string): Promise<{ isValid: boolean; error?: string }> {
  const emailLower = email.toLowerCase().trim();
  
  // Basic email format validation with stricter regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(emailLower)) {
    return { isValid: false, error: 'Please enter a valid email address format' };
  }

  // Extract domain and local part
  const [localPart, domain] = emailLower.split('@');
  
  // Check local part length and characters
  if (localPart.length < 1 || localPart.length > 64) {
    return { isValid: false, error: 'Email username must be between 1 and 64 characters' };
  }

  // Check for invalid characters in local part
  if (!/^[a-zA-Z0-9._%+-]+$/.test(localPart)) {
    return { isValid: false, error: 'Email username contains invalid characters' };
  }

  // Check domain length
  if (domain.length < 3 || domain.length > 253) {
    return { isValid: false, error: 'Email domain is invalid' };
  }

  // Enhanced email verification with UserCheck API
  const emailVerification = await verifyEmailExists(email);
  
  // Check if email is disposable (from UserCheck API)
  if (emailVerification.isDisposable) {
    return { 
      isValid: false, 
      error: 'Disposable email addresses are not allowed. Please use a valid email address.' 
    };
  }

  // Check if email is a role-based email (admin, info, etc.)
  if (emailVerification.isRole) {
    return { 
      isValid: false, 
      error: 'Role-based email addresses (admin, info, etc.) are not allowed. Please use a personal email address.' 
    };
  }

  // Dynamic test pattern check
  const isTestPattern = await checkTestPattern(emailLower);
  if (isTestPattern) {
    return { 
      isValid: false, 
      error: 'Test or generic email addresses are not allowed. Please use a valid personal email address.' 
    };
  }

  // Dynamic inappropriate words check
  const hasInappropriateContent = await checkInappropriateWords(localPart);
  if (hasInappropriateContent) {
    return { 
      isValid: false, 
      error: 'Email contains inappropriate content. Please use a professional email address.' 
    };
  }

  // Check for common free email providers (allow these)
  const allowedDomains = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'live.com',
    'icloud.com', 'protonmail.com', 'tutanota.com', 'zoho.com',
    'aol.com', 'mail.com', 'gmx.com', 'yandex.com', 'mail.ru',
    'fastmail.com', 'hushmail.com', 'runbox.com', 'tutanota.de',
    'gmx.de', 'web.de', 'freenet.de', 'arcor.de', 't-online.de',
    'orange.fr', 'laposte.net', 'free.fr', 'wanadoo.fr', 'sfr.fr',
    'libero.it', 'virgilio.it', 'alice.it', 'tiscali.it', 'aruba.it',
    'terra.com.br', 'uol.com.br', 'bol.com.br', 'ig.com.br', 'globo.com',
    'naver.com', 'daum.net', 'hanmail.net', 'nate.com', 'empal.com',
    'qq.com', '163.com', '126.com', 'sina.com', 'sohu.com', 'yeah.net',
    'live.jp', 'yahoo.co.jp', 'docomo.ne.jp', 'ezweb.ne.jp', 'softbank.ne.jp'
  ];

  // Allow common free email providers and custom domains
  // Custom domains (work, education, business) are allowed if they have at least 5 characters
  if (!allowedDomains.includes(domain) && domain.length < 5) {
    return { 
      isValid: false, 
      error: 'Please use a valid email address from a recognized provider or your work/educational email.' 
    };
  }

  // Additional domain validation
  if (!/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domain)) {
    return { isValid: false, error: 'Email domain format is invalid' };
  }

  // Check for consecutive dots or invalid domain patterns
  if (domain.includes('..') || domain.startsWith('.') || domain.endsWith('.')) {
    return { isValid: false, error: 'Email domain format is invalid' };
  }

  return { isValid: true };
}

// Dynamic disposable domain checking
async function checkDisposableDomain(domain: string): Promise<boolean> {
  const now = Date.now();
  
  // Check if cache needs refresh
  if (now - DISPOSABLE_DOMAINS_LAST_UPDATE > DISPOSABLE_CACHE_DURATION) {
    await refreshDisposableDomains();
  }
  
  return DISPOSABLE_DOMAINS_CACHE.has(domain.toLowerCase());
}

// Refresh disposable domains from external API
async function refreshDisposableDomains(): Promise<void> {
  try {
    const response = await fetch('/api/disposable-domains');
    if (response.ok) {
      const domains = await response.json();
      DISPOSABLE_DOMAINS_CACHE = new Set(domains.map((d: string) => d.toLowerCase()));
      DISPOSABLE_DOMAINS_LAST_UPDATE = Date.now();
    }
  } catch (error) {
    console.error('Failed to refresh disposable domains:', error);
  }
}

// Dynamic test pattern checking
async function checkTestPattern(email: string): Promise<boolean> {
  const now = Date.now();
  
  // Check if cache needs refresh
  if (now - TEST_PATTERNS_LAST_UPDATE > TEST_PATTERNS_CACHE_DURATION) {
    await refreshTestPatterns();
  }
  
  return Array.from(TEST_PATTERNS_CACHE).some(pattern => 
    new RegExp(pattern, 'i').test(email)
  );
}

// Refresh test patterns from external API
async function refreshTestPatterns(): Promise<void> {
  try {
    const response = await fetch('/api/test-patterns');
    if (response.ok) {
      const patterns = await response.json();
      TEST_PATTERNS_CACHE = new Set(patterns);
      TEST_PATTERNS_LAST_UPDATE = Date.now();
    }
  } catch (error) {
    console.error('Failed to refresh test patterns:', error);
  }
}

// Dynamic inappropriate words checking
async function checkInappropriateWords(localPart: string): Promise<boolean> {
  const now = Date.now();
  
  // Check if cache needs refresh
  if (now - INAPPROPRIATE_WORDS_LAST_UPDATE > INAPPROPRIATE_CACHE_DURATION) {
    await refreshInappropriateWords();
  }
  
  return Array.from(INAPPROPRIATE_WORDS_CACHE).some(word => 
    localPart.includes(word.toLowerCase())
  );
}

// Refresh inappropriate words from external API
async function refreshInappropriateWords(): Promise<void> {
  try {
    const response = await fetch('/api/inappropriate-words');
    if (response.ok) {
      const words = await response.json();
      INAPPROPRIATE_WORDS_CACHE = new Set(words.map((w: string) => w.toLowerCase()));
      INAPPROPRIATE_WORDS_LAST_UPDATE = Date.now();
    }
  } catch (error) {
    console.error('Failed to refresh inappropriate words:', error);
  }
}

// Function to add new disposable domains dynamically
export function addDisposableDomain(domain: string) {
  DISPOSABLE_DOMAINS_CACHE.add(domain.toLowerCase());
}

// Function to add new test patterns dynamically
export function addTestPattern(pattern: string) {
  TEST_PATTERNS_CACHE.add(pattern);
}

// Function to add new inappropriate words dynamically
export function addInappropriateWord(word: string) {
  INAPPROPRIATE_WORDS_CACHE.add(word.toLowerCase());
}

// Enhanced email verification using ZeroBounce.net API and DNS MX record check
export async function verifyEmailExists(email: string): Promise<{ 
  exists: boolean; 
  error?: string;
  isDisposable?: boolean;
  isRole?: boolean;
  isFree?: boolean;
  isEducational?: boolean;
  isBusiness?: boolean;
  confidence?: number;
  message?: string;
  source?: string;
  mxRecord?: boolean;
  smtpCheck?: boolean;
  catchAll?: boolean;
  validSyntax?: boolean;
  validDomain?: boolean;
  validMx?: boolean;
  validSmtp?: boolean;
  status?: string;
  subStatus?: string;
  account?: string;
  domain?: string;
  reason?: string;
  sendex?: number;
  smtpCode?: string;
  smtpInfo?: string;
  smtpHost?: string;
  firstname?: string;
  lastname?: string;
  gender?: string;
  country?: string;
  region?: string;
  city?: string;
  zipcode?: string;
  processedAt?: string;
}> {
  try {
    const domain = email.split('@')[1];
    
    // Check if domain has valid MX records and get ZeroBounce.net API results
    const response = await fetch(`/api/verify-email?email=${encodeURIComponent(email)}`);
    
    if (!response.ok) {
      return { exists: false, error: 'Unable to verify email address' };
    }
    
    const result = await response.json();
    return result;
    
  } catch (error) {
    console.error('Email verification error:', error);
    return { exists: false, error: 'Email verification failed' };
  }
}

// Enhanced email validation with existence check
export async function validateEmailWithExistence(email: string): Promise<{ 
  isValid: boolean; 
  error?: string; 
  exists?: boolean;
  isDisposable?: boolean;
  isRole?: boolean;
  isFree?: boolean;
  isEducational?: boolean;
  isBusiness?: boolean;
  confidence?: number;
  source?: string;
  mxRecord?: boolean;
  smtpCheck?: boolean;
  catchAll?: boolean;
  validSyntax?: boolean;
  validDomain?: boolean;
  validMx?: boolean;
  validSmtp?: boolean;
  status?: string;
  subStatus?: string;
  account?: string;
  domain?: string;
  reason?: string;
  sendex?: number;
  smtpCode?: string;
  smtpInfo?: string;
  smtpHost?: string;
  firstname?: string;
  lastname?: string;
  gender?: string;
  country?: string;
  region?: string;
  city?: string;
  zipcode?: string;
  processedAt?: string;
}> {
  // First do basic validation
  const basicValidation = await validateEmail(email);
  if (!basicValidation.isValid) {
    return basicValidation;
  }
  
  // Then check if email exists with enhanced verification
  const existenceCheck = await verifyEmailExists(email);
  if (!existenceCheck.exists) {
    return { 
      isValid: false, 
      error: 'This email address does not exist or is not accessible. Please use a valid email address.',
      exists: false
    };
  }
  
  return { 
    isValid: true, 
    exists: true,
    isDisposable: existenceCheck.isDisposable,
    isRole: existenceCheck.isRole,
    isFree: existenceCheck.isFree,
    isEducational: existenceCheck.isEducational,
    isBusiness: existenceCheck.isBusiness,
    confidence: existenceCheck.confidence,
    source: existenceCheck.source,
    mxRecord: existenceCheck.mxRecord,
    smtpCheck: existenceCheck.smtpCheck,
    catchAll: existenceCheck.catchAll,
    validSyntax: existenceCheck.validSyntax,
    validDomain: existenceCheck.validDomain,
    validMx: existenceCheck.validMx,
    validSmtp: existenceCheck.validSmtp,
    status: existenceCheck.status,
    subStatus: existenceCheck.subStatus,
    account: existenceCheck.account,
    domain: existenceCheck.domain,
    reason: existenceCheck.reason,
    sendex: existenceCheck.sendex,
    smtpCode: existenceCheck.smtpCode,
    smtpInfo: existenceCheck.smtpInfo,
    smtpHost: existenceCheck.smtpHost,
    firstname: existenceCheck.firstname,
    lastname: existenceCheck.lastname,
    gender: existenceCheck.gender,
    country: existenceCheck.country,
    region: existenceCheck.region,
    city: existenceCheck.city,
    zipcode: existenceCheck.zipcode,
    processedAt: existenceCheck.processedAt
  };
}
