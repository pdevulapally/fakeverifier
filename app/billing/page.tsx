'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard, 
  Calendar, 
  DollarSign, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  ArrowUpRight, 
  ArrowDownRight,
  Settings,
  RefreshCw,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { getCurrentUser, onAuthStateChange, getUserTokenUsage, changeSubscription, getUserStripeSubscription } from '@/lib/firebase';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface BillingInfo {
  hasSubscription: boolean;
  subscription: {
    id: string;
    status: string;
    current_period_end: number;
    cancel_at_period_end: boolean;
    metadata: any;
    items: Array<{
      id: string;
      price: {
        id: string;
        unit_amount: number;
        currency: string;
        recurring: any;
        product: string;
      };
    }>;
  } | null;
  customer: string | null;
}

interface TokenUsage {
  userId: string;
  used: number;
  total: number;
  resetDate: Date;
  plan: "free" | "pro" | "enterprise";
  lastUpdated: Date;
  dailyUsed?: number;
  dailyResetDate?: Date;
}

export default function BillingPage() {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null);
  const [tokenUsage, setTokenUsage] = useState<TokenUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedAction, setSelectedAction] = useState<'cancel' | 'upgrade' | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      loadBillingData();
    }

    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      if (user) {
        loadBillingData();
      } else {
        setBillingInfo(null);
        setTokenUsage(null);
      }
      setAuthLoading(false);
    });

    const timer = setTimeout(() => {
      setAuthLoading(false);
    }, 1000);

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const loadBillingData = async () => {
    setLoading(true);
    try {
      // Load token usage
      const tokenResult = await getUserTokenUsage();
      if (tokenResult.success) {
        setTokenUsage(tokenResult.data as TokenUsage);
      }

      // Load billing info if user has a paid plan
      if (tokenResult.success && (tokenResult.data as TokenUsage).plan !== 'free') {
        const billingResult = await getUserStripeSubscription();
        if (billingResult.success) {
          setBillingInfo(billingResult.data);
        }
      }
    } catch (error) {
      console.error('Error loading billing data:', error);
      toast.error('Failed to load billing information');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setActionLoading(true);
    try {
      const result = await changeSubscription('free', 'monthly');
      if (result.success) {
        toast.success('Subscription cancelled successfully. You will have access until the end of your billing period.');
        setShowCancelDialog(false);
        await loadBillingData(); // Refresh data
      } else {
        toast.error(result.error || 'Failed to cancel subscription');
      }
    } catch (error: any) {
      toast.error('Failed to cancel subscription: ' + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpgrade = async (targetPlan: 'pro' | 'enterprise') => {
    setActionLoading(true);
    try {
      const result = await changeSubscription(targetPlan, 'monthly');
      if (result.success) {
        toast.success(`Successfully upgraded to ${targetPlan} plan!`);
        setShowUpgradeDialog(false);
        await loadBillingData(); // Refresh data
      } else {
        toast.error(result.error || 'Failed to upgrade plan');
      }
    } catch (error: any) {
      toast.error('Failed to upgrade plan: ' + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number, currency: string = 'usd') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const getPlanDetails = (plan: string) => {
    switch (plan) {
      case 'free':
        return { 
          name: 'Free', 
          tokens: 50, 
          dailyLimit: 5,
          price: 0,
          aiModel: 'OpenRouter free models (Qwen, Mistral, Llama, Gemma)'
        };
      case 'pro':
        return { 
          name: 'Pro', 
          tokens: 500, 
          dailyLimit: 50,
          price: 9.99,
          aiModel: 'OpenAI GPT-4o'
        };
      case 'enterprise':
        return { 
          name: 'Enterprise', 
          tokens: 5000, 
          dailyLimit: 500,
          price: 49.99,
          aiModel: 'OpenAI GPT-4o'
        };
      default:
        return { 
          name: 'Unknown', 
          tokens: 0, 
          dailyLimit: 0,
          price: 0,
          aiModel: 'Unknown'
        };
    }
  };

  const getNextBillingDate = () => {
    if (!billingInfo?.subscription) return null;
    return formatDate(billingInfo.subscription.current_period_end);
  };

  const getCurrentPrice = () => {
    if (!billingInfo?.subscription?.items?.[0]?.price?.unit_amount) return null;
    return formatCurrency(billingInfo.subscription.items[0].price.unit_amount);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-6 h-6 animate-spin" />
              <span>Loading billing information...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
              <p className="text-gray-600 mb-4">Please sign in to view your billing information.</p>
              <Button onClick={() => window.location.href = '/Login'}>
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentPlan = tokenUsage?.plan || 'free';
  const planDetails = getPlanDetails(currentPlan);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <Link href="/">
                <img 
                  src="/Images/Logo de FakeVerifier.png" 
                  alt="FakeVerifier Logo" 
                  className="h-24 w-auto object-contain"
                />
              </Link>
            </div>
          </div>
          <Button variant="outline" size="sm" className="text-xs sm:text-sm" onClick={() => window.history.back()}>
            Back to App
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          {/* Page Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Billing & Subscription
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Manage your subscription, view billing history, and update your plan settings.
            </p>
          </div>

          {/* Current Plan Overview */}
          <Card className="relative overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Current Plan
                  </CardTitle>
                  <CardDescription>
                    Your active subscription and usage details
                  </CardDescription>
                </div>
                <Badge 
                  variant={currentPlan === 'free' ? 'secondary' : 'default'}
                  className={cn(
                    currentPlan === 'pro' && 'bg-gradient-to-r from-blue-500 to-indigo-500',
                    currentPlan === 'enterprise' && 'bg-gradient-to-r from-purple-500 to-pink-500'
                  )}
                >
                  {planDetails.name} Plan
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Plan Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Monthly Cost</p>
                    <p className="text-lg font-bold">
                      {planDetails.price === 0 ? 'Free' : `$${planDetails.price}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">Monthly Tokens</p>
                    <p className="text-lg font-bold">{planDetails.tokens.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium">Daily Limit</p>
                    <p className="text-lg font-bold">{planDetails.dailyLimit} verifications</p>
                  </div>
                </div>
              </div>

              {/* Daily Usage Progress */}
              {tokenUsage && tokenUsage.dailyUsed !== undefined && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Daily Usage</span>
                    <span>{tokenUsage.dailyUsed} / {planDetails.dailyLimit} verifications</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((tokenUsage.dailyUsed / planDetails.dailyLimit) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Resets daily at 12:00 AM midnight
                  </p>
                </div>
              )}

              {/* Token Usage Progress */}
              {tokenUsage && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Monthly Token Usage</span>
                    <span>{tokenUsage.used.toLocaleString()} / {tokenUsage.total.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((tokenUsage.used / tokenUsage.total) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Subscription Status */}
              {billingInfo?.subscription && (
                <div className="space-y-4">
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Subscription Status</p>
                      <div className="flex items-center gap-2 mt-1">
                        {billingInfo.subscription.cancel_at_period_end ? (
                          <>
                            <XCircle className="w-4 h-4 text-orange-500" />
                            <span className="text-orange-600 font-medium">Cancelling</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-green-600 font-medium">Active</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Next Billing Date</p>
                      <p className="font-medium">{getNextBillingDate()}</p>
                    </div>
                    {getCurrentPrice() && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Current Price</p>
                        <p className="font-medium">{getCurrentPrice()}/month</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Subscription ID</p>
                      <p className="font-mono text-sm">{billingInfo.subscription.id}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {currentPlan === 'free' ? (
              <Button 
                onClick={() => window.location.href = '/pricing'}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <ArrowUpRight className="w-4 h-4 mr-2" />
                Upgrade Plan
              </Button>
            ) : (
              <>
                {currentPlan === 'pro' && (
                  <Button 
                    onClick={() => {
                      setSelectedAction('upgrade');
                      setShowUpgradeDialog(true);
                    }}
                    variant="outline"
                    className="border-green-500 text-green-600 hover:bg-green-50"
                  >
                    <ArrowUpRight className="w-4 h-4 mr-2" />
                    Upgrade to Enterprise
                  </Button>
                )}
                {currentPlan === 'enterprise' && (
                  <Button 
                    onClick={() => {
                      setSelectedAction('upgrade');
                      setShowUpgradeDialog(true);
                    }}
                    variant="outline"
                    className="border-blue-500 text-blue-600 hover:bg-blue-50"
                  >
                    <ArrowDownRight className="w-4 h-4 mr-2" />
                    Downgrade to Pro
                  </Button>
                )}
                <Button 
                  onClick={() => {
                    setSelectedAction('cancel');
                    setShowCancelDialog(true);
                  }}
                  variant="destructive"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Cancel Subscription
                </Button>
              </>
            )}
            <Button 
              onClick={loadBillingData}
              variant="outline"
              disabled={loading}
            >
              <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
              Refresh
            </Button>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Plan Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {currentPlan === 'free' && (
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      50 verification tokens per month
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      5 verifications per day
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      OpenRouter free AI models (Qwen, Mistral, Llama, Gemma)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      AI model fallback system
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Standard response time
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Community support
                    </li>
                  </ul>
                )}
                {currentPlan === 'pro' && (
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      500 verification tokens per month
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      50 verifications per day
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      OpenAI GPT-4o AI model
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      No rate limits
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Faster response time
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Priority support
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Real-time news integration
                    </li>
                  </ul>
                )}
                {currentPlan === 'enterprise' && (
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      5000 verification tokens per month
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      500 verifications per day
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      OpenAI GPT-4o AI model
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      No rate limits
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Instant response time
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Dedicated support
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      API access
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Custom integrations
                    </li>
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Important Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm space-y-2">
                  <p className="text-muted-foreground">
                    • Tokens reset monthly on your billing cycle
                  </p>
                  <p className="text-muted-foreground">
                    • Daily limits reset at 12:00 AM midnight
                  </p>
                  <p className="text-muted-foreground">
                    • Plan changes take effect immediately
                  </p>
                  <p className="text-muted-foreground">
                    • Cancelled subscriptions remain active until the end of the billing period
                  </p>
                  <p className="text-muted-foreground">
                    • You can upgrade or downgrade at any time
                  </p>
                  <p className="text-muted-foreground">
                    • Free users get AI model fallback system for better reliability
                  </p>
                  {billingInfo?.subscription?.cancel_at_period_end && (
                    <p className="text-orange-600 font-medium">
                      ⚠️ Your subscription will be cancelled on {getNextBillingDate()}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>

      {/* Cancel Subscription Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel your subscription? You will:
              <ul className="mt-2 space-y-1">
                <li>• Lose access to premium features at the end of your billing period</li>
                <li>• Be downgraded to the Free plan</li>
                <li>• Keep your current tokens until the billing period ends</li>
              </ul>
              <p className="mt-2 font-medium">
                You can reactivate your subscription at any time from the pricing page.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>Keep Subscription</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleCancelSubscription}
              disabled={actionLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {actionLoading ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Cancelling...
                </div>
              ) : (
                'Cancel Subscription'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Upgrade/Downgrade Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedAction === 'upgrade' && currentPlan === 'pro' ? 'Upgrade to Enterprise' : 'Downgrade to Pro'}
            </DialogTitle>
            <DialogDescription>
              {selectedAction === 'upgrade' && currentPlan === 'pro' 
                ? 'Upgrade to our Enterprise plan for unlimited tokens and advanced features.'
                : 'Downgrade to our Pro plan with 500 tokens per month.'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedAction === 'upgrade' && currentPlan === 'pro' ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span>Current Plan</span>
                  <span className="font-medium">Pro - $9.99/month</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <span>New Plan</span>
                  <span className="font-medium text-green-600">Enterprise - $49.99/month</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  You'll be charged the prorated difference for the current billing period.
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span>Current Plan</span>
                  <span className="font-medium">Enterprise - $49.99/month</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <span>New Plan</span>
                  <span className="font-medium text-blue-600">Pro - $9.99/month</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  You'll receive a prorated credit for the remaining billing period.
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUpgradeDialog(false)} disabled={actionLoading}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                if (selectedAction === 'upgrade' && currentPlan === 'pro') {
                  handleUpgrade('enterprise');
                } else {
                  handleUpgrade('pro');
                }
              }}
              disabled={actionLoading}
              className={selectedAction === 'upgrade' && currentPlan === 'pro' 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
              }
            >
              {actionLoading ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Processing...
                </div>
              ) : (
                selectedAction === 'upgrade' && currentPlan === 'pro' ? 'Upgrade to Enterprise' : 'Downgrade to Pro'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

