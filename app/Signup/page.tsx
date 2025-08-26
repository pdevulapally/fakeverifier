"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signUpWithEmail, signInWithGoogle } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, Lock, User, Shield, ArrowLeft, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import GoogleLogo from '@/components/google-logo';
import { validateEmail, validateEmailWithExistence } from '@/lib/email-validation';

interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
  captcha?: string;
}

interface PasswordStrength {
  score: number;
  feedback: string[];
  color: string;
}

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: [],
    color: 'text-red-500'
  });
  const [attempts, setAttempts] = useState(0);
  const [lastAttempt, setLastAttempt] = useState(0);
  const [captchaValue, setCaptchaValue] = useState('');
  const [captchaResult, setCaptchaResult] = useState(0);
  const router = useRouter();

  // Anti-bot measures
  useEffect(() => {
    // Track mouse movements and keyboard activity
    const trackActivity = () => {
      setLastAttempt(Date.now());
    };

    document.addEventListener('mousemove', trackActivity);
    document.addEventListener('keydown', trackActivity);
    document.addEventListener('click', trackActivity);

    return () => {
      document.removeEventListener('mousemove', trackActivity);
      document.removeEventListener('keydown', trackActivity);
      document.removeEventListener('click', trackActivity);
    };
  }, []);

  // Generate simple math captcha
  useEffect(() => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptchaResult(num1 + num2);
  }, []);

  // Password strength checker
  const checkPasswordStrength = (password: string): PasswordStrength => {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('At least 8 characters');
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Include lowercase letters');
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Include uppercase letters');
    }

    if (/[0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Include numbers');
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Include special characters');
    }

    let color = 'text-red-500';
    if (score >= 4) color = 'text-green-500';
    else if (score >= 3) color = 'text-yellow-500';
    else if (score >= 2) color = 'text-orange-500';

    return { score, feedback, color };
  };

  // Real-time password strength update
  useEffect(() => {
    if (password) {
      setPasswordStrength(checkPasswordStrength(password));
    }
  }, [password]);

  // Email existence check with debouncing
  useEffect(() => {
    const checkEmailExistence = async () => {
      if (email) {
        const isValidFormat = await validateEmailFormat(email);
        if (isValidFormat) {
          setEmailChecking(true);
                     try {
             const result = await validateEmailWithExistence(email);
             setEmailExists(result.exists || false);
                           setEmailDetails({
                isDisposable: result.isDisposable,
                isRole: result.isRole,
                isFree: result.isFree,
                isEducational: result.isEducational,
                isBusiness: result.isBusiness,
                confidence: result.confidence,
                source: result.source,
                mxRecord: result.mxRecord,
                smtpCheck: result.smtpCheck,
                catchAll: result.catchAll,
                validSyntax: result.validSyntax,
                validDomain: result.validDomain,
                validMx: result.validMx,
                validSmtp: result.validSmtp,
                status: result.status,
                subStatus: result.subStatus,
                account: result.account,
                domain: result.domain,
                reason: result.reason,
                sendex: result.sendex,
                smtpCode: result.smtpCode,
                smtpInfo: result.smtpInfo,
                smtpHost: result.smtpHost,
                firstname: result.firstname,
                lastname: result.lastname,
                gender: result.gender,
                country: result.country,
                region: result.region,
                city: result.city,
                zipcode: result.zipcode,
                processedAt: result.processedAt
              });
           } catch (error) {
             console.error('Email existence check failed:', error);
             setEmailExists(null);
             setEmailDetails(null);
           } finally {
             setEmailChecking(false);
           }
                 } else {
           setEmailExists(null);
           setEmailDetails(null);
         }
       } else {
         setEmailExists(null);
         setEmailDetails(null);
       }
    };

    const timeoutId = setTimeout(checkEmailExistence, 1000); // 1 second debounce
    return () => clearTimeout(timeoutId);
  }, [email]);

  // Email validation using the utility function
  const validateEmailFormat = async (email: string): Promise<boolean> => {
    const result = await validateEmail(email);
    return result.isValid;
  };

  // Enhanced email validation with existence check
  const [emailExists, setEmailExists] = useState<boolean | null>(null);
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailDetails, setEmailDetails] = useState<{
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
  } | null>(null);

  // Name validation
  const validateName = (name: string): boolean => {
    return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name);
  };

  // Comprehensive validation
  const validateForm = async (): Promise<boolean> => {
    const errors: ValidationErrors = {};

    // Name validation
    if (!name.trim()) {
      errors.name = 'Full name is required';
    } else if (!validateName(name)) {
      errors.name = 'Name must be at least 2 characters and contain only letters';
    }

    // Email validation
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else {
      const emailValidation = await validateEmail(email);
      if (!emailValidation.isValid) {
        errors.email = emailValidation.error || 'Please enter a valid email address';
      } else if (emailExists === false) {
        errors.email = 'This email address does not exist or is not accessible. Please use a valid email address.';
      }
    }

    // Password validation
    if (!password) {
      errors.password = 'Password is required';
    } else if (passwordStrength.score < 3) {
      errors.password = 'Password is too weak';
    }

    // Confirm password validation
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    // Terms validation
    if (!acceptedTerms) {
      errors.terms = 'You must accept the terms and conditions';
    }

    // Captcha validation
    if (!captchaValue.trim()) {
      errors.captcha = 'Please solve the captcha';
    } else if (parseInt(captchaValue) !== captchaResult) {
      errors.captcha = 'Incorrect answer';
    }

    // Anti-bot checks
    if (attempts > 3) {
      const timeSinceLastAttempt = Date.now() - lastAttempt;
      if (timeSinceLastAttempt < 30000) { // 30 seconds cooldown
        errors.captcha = 'Too many attempts. Please wait 30 seconds.';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setAttempts(prev => prev + 1);

    // Anti-bot rate limiting
    if (attempts > 5) {
      setError('Too many signup attempts. Please try again later.');
      setLoading(false);
      return;
    }

    if (!(await validateForm())) {
      setLoading(false);
      return;
    }

    try {
      const result = await signUpWithEmail(email, password);
      
      if (result.error) {
        setError(result.error);
      } else {
        router.push('/verify');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await signInWithGoogle();
      
      if (result.error) {
        setError(result.error);
      } else {
        router.push('/verify');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home Link */}
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
        </div>

        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <img 
              src="/Images/Logo de FakeVerifier.png" 
              alt="FakeVerifier Logo" 
              className="h-32 w-auto object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Create account</h1>
          <p className="text-slate-600">Join FakeVerifier to start verifying news</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleEmailSignup} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                  Full name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`pl-10 h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500 ${
                      validationErrors.name ? 'border-red-500' : ''
                    }`}
                    required
                  />
                  {name && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {validateName(name) ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                {validationErrors.name && (
                  <p className="text-sm text-red-500">{validationErrors.name}</p>
                )}
              </div>
              
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`pl-10 h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500 ${
                      validationErrors.email ? 'border-red-500' : ''
                    }`}
                    required
                  />
                  {email && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {emailChecking ? (
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      ) : emailExists === true ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : emailExists === false ? (
                        <XCircle className="h-4 w-4 text-red-500" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                  )}
                </div>
                                 {validationErrors.email && (
                   <p className="text-sm text-red-500">{validationErrors.email}</p>
                 )}
                                   {emailDetails && emailExists === true && (
                    <div className="text-xs text-green-600 mt-1">
                      <div className="flex items-center gap-2">
                        <span>✓ Verified via {emailDetails.source}</span>
                        {emailDetails.confidence && (
                          <span className="text-blue-600">
                            ({emailDetails.confidence}% confidence)
                          </span>
                        )}
                        {emailDetails.sendex && (
                          <span className="text-purple-600">
                            (Sendex: {emailDetails.sendex})
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {emailDetails.isEducational && (
                          <span className="text-blue-600 bg-blue-50 px-1 rounded">Educational</span>
                        )}
                        {emailDetails.isBusiness && (
                          <span className="text-blue-600 bg-blue-50 px-1 rounded">Business</span>
                        )}
                        {emailDetails.isFree && (
                          <span className="text-gray-600 bg-gray-50 px-1 rounded">Free provider</span>
                        )}
                        {emailDetails.validSyntax && (
                          <span className="text-green-600 bg-green-50 px-1 rounded">Valid syntax</span>
                        )}
                        {emailDetails.validDomain && (
                          <span className="text-green-600 bg-green-50 px-1 rounded">Valid domain</span>
                        )}
                        {emailDetails.validMx && (
                          <span className="text-green-600 bg-green-50 px-1 rounded">MX records</span>
                        )}
                        {emailDetails.validSmtp && (
                          <span className="text-green-600 bg-green-50 px-1 rounded">SMTP verified</span>
                        )}
                        {emailDetails.catchAll && (
                          <span className="text-yellow-600 bg-yellow-50 px-1 rounded">Catch-all</span>
                        )}
                        {emailDetails.status && (
                          <span className={`px-1 rounded ${
                            emailDetails.status === 'valid' ? 'text-green-600 bg-green-50' :
                            emailDetails.status === 'invalid' ? 'text-red-600 bg-red-50' :
                            'text-yellow-600 bg-yellow-50'
                          }`}>
                            {emailDetails.status}
                          </span>
                        )}
                        {emailDetails.country && (
                          <span className="text-purple-600 bg-purple-50 px-1 rounded">{emailDetails.country}</span>
                        )}
                        {emailDetails.firstname && emailDetails.lastname && (
                          <span className="text-indigo-600 bg-indigo-50 px-1 rounded">
                            {emailDetails.firstname} {emailDetails.lastname}
                          </span>
                        )}
                      </div>
                      {emailDetails.reason && (
                        <div className="text-xs text-gray-600 mt-1">
                          <span>Reason: {emailDetails.reason}</span>
                        </div>
                      )}
                    </div>
                  )}
              </div>
              
              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`pl-10 pr-10 h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500 ${
                      validationErrors.password ? 'border-red-500' : ''
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-400" />
                    )}
                  </button>
                </div>
                {password && (
                  <div className="space-y-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded ${
                            passwordStrength.score >= level
                              ? passwordStrength.color.replace('text-', 'bg-')
                              : 'bg-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-xs text-slate-600">
                      {passwordStrength.feedback.length > 0 && (
                        <ul className="list-disc list-inside space-y-1">
                          {passwordStrength.feedback.map((feedback, index) => (
                            <li key={index} className="text-red-500">{feedback}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
                {validationErrors.password && (
                  <p className="text-sm text-red-500">{validationErrors.password}</p>
                )}
              </div>
              
              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
                  Confirm password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`pl-10 pr-10 h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500 ${
                      validationErrors.confirmPassword ? 'border-red-500' : ''
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-400" />
                    )}
                  </button>
                </div>
                {confirmPassword && password && (
                  <div className="flex items-center gap-2 text-sm">
                    {password === confirmPassword ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className={password === confirmPassword ? 'text-green-600' : 'text-red-600'}>
                      {password === confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                    </span>
                  </div>
                )}
                {validationErrors.confirmPassword && (
                  <p className="text-sm text-red-500">{validationErrors.confirmPassword}</p>
                )}
              </div>

              {/* Captcha */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">
                  Security Check
                </Label>
                <div className="p-4 bg-slate-50 rounded-lg border">
                  <p className="text-sm text-slate-700 mb-2">
                    What is {captchaResult - Math.floor(captchaResult / 2)} + {Math.floor(captchaResult / 2)}?
                  </p>
                  <Input
                    type="number"
                    placeholder="Enter your answer"
                    value={captchaValue}
                    onChange={(e) => setCaptchaValue(e.target.value)}
                    className={`h-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500 ${
                      validationErrors.captcha ? 'border-red-500' : ''
                    }`}
                  />
                </div>
                {validationErrors.captcha && (
                  <p className="text-sm text-red-500">{validationErrors.captcha}</p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={acceptedTerms}
                    onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                    className="mt-1"
                  />
                  <Label htmlFor="terms" className="text-sm text-slate-700 leading-relaxed">
                    I agree to the{' '}
                    <Link href="#" className="text-blue-600 hover:underline font-medium">
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link href="#" className="text-blue-600 hover:underline font-medium">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
                {validationErrors.terms && (
                  <p className="text-sm text-red-500">{validationErrors.terms}</p>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200" 
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating account...
                  </div>
                ) : (
                  'Create account'
                )}
              </Button>
            </form>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-slate-500 font-medium">Or continue with</span>
              </div>
            </div>
            
            <Button
              variant="outline"
              onClick={handleGoogleSignup}
              disabled={loading}
              className="w-full h-12 border-slate-200 hover:border-slate-300 hover:bg-slate-50 font-medium"
            >
              <GoogleLogo className="mr-3" size={20} />
              {loading ? 'Creating account...' : 'Sign up with Google'}
            </Button>
            
            <div className="text-center mt-6">
              <p className="text-sm text-slate-600">
                Already have an account?{' '}
                <Link href="/Login" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-slate-500">
            By creating an account, you agree to our{' '}
            <Link href="#" className="text-blue-600 hover:underline">Terms of Service</Link>
            {' '}and{' '}
            <Link href="#" className="text-blue-600 hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
