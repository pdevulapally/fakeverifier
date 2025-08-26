'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Bot, Zap, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Link from 'next/link';

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [sessionData, setSessionData] = useState<any>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (sessionId) {
      // Verify the session with your backend
      verifySession(sessionId);
    } else {
      setIsLoading(false);
    }
  }, [searchParams]);

  const verifySession = async (sessionId: string) => {
    try {
      // Get current user for authentication
      const { getCurrentUser } = await import('@/lib/firebase');
      const user = getCurrentUser();
      
      if (!user) {
        toast.error('User not authenticated');
        setIsLoading(false);
        return;
      }

      // Get the current user's ID token for server-side verification
      const idToken = await user.getIdToken();
      
      const response = await fetch('/api/verify-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ sessionId }),
      });

      const data = await response.json();
      
      if (data.success) {
        setSessionData(data.session);
        toast.success('Payment successful! Your plan has been upgraded.');
      } else {
        toast.error('Failed to verify payment. Please contact support.');
      }
    } catch (error) {
      console.error('Error verifying session:', error);
      toast.error('Failed to verify payment. Please contact support.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-lg font-medium">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="flex flex-col">
                                                                         <img 
                src="/Images/Logo de FakeVerifier.png" 
                alt="FakeVerifier Logo" 
                className="h-32 w-auto object-contain"
              />
              <div className="text-xs text-muted-foreground">AI News Verification</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center space-y-8"
        >
          {/* Success Icon */}
          <div className="flex justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center"
            >
              <CheckCircle className="w-12 h-12 text-green-600" />
            </motion.div>
          </div>

          {/* Success Message */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Payment Successful!
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Thank you for upgrading to FakeVerifier Pro. Your account has been successfully upgraded.
            </p>
          </div>

          {/* Plan Details */}
          {sessionData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6 bg-white dark:bg-gray-800 shadow-lg">
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <Crown className="w-6 h-6 text-yellow-500" />
                    <h2 className="text-2xl font-bold">
                      {sessionData.tierId === 'pro' ? 'Pro Plan' : 'Enterprise Plan'}
                    </h2>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2">
                    <Zap className="w-5 h-5 text-blue-500" />
                    <span className="text-lg font-medium">
                      {sessionData.tierId === 'pro' ? '500' : '5000'} tokens per month
                    </span>
                  </div>

                  <div className="flex items-center justify-center">
                    <Badge variant="outline" className="text-sm">
                      {sessionData.paymentFrequency === 'yearly' ? 'Yearly Billing' : 'Monthly Billing'}
                    </Badge>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* What's Next */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-semibold">What's Next?</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 text-center space-y-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Zap className="w-4 h-4 text-blue-600" />
                </div>
                <h4 className="font-medium">Start Verifying</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Use your new tokens to verify news articles
                </p>
              </Card>

              <Card className="p-4 text-center space-y-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Bot className="w-4 h-4 text-green-600" />
                </div>
                <h4 className="font-medium">Advanced AI</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Access GPT-4o powered analysis
                </p>
              </Card>

              <Card className="p-4 text-center space-y-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <Crown className="w-4 h-4 text-purple-600" />
                </div>
                <h4 className="font-medium">Priority Support</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get faster response times
                </p>
              </Card>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/verify">
                Start Verifying News
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg">
              <Link href="/dashboard">
                View Dashboard
              </Link>
            </Button>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-sm text-gray-500 dark:text-gray-400 space-y-2"
          >
            <p>
              You'll receive a confirmation email shortly with your receipt and account details.
            </p>
            <p>
              Need help? Contact our support team at{' '}
              <a href="mailto:PreethamDevulapally@gmail.com" className="text-blue-600 hover:underline">
                PreethamDevulapally@gmail.com
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-lg font-medium">Loading...</p>
        </div>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}
