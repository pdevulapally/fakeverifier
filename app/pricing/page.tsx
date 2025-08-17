'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BadgeCheck, Shield, Zap, Crown, Bot, Globe, Clock, Sparkles, Mail, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { getCurrentUser } from '@/lib/firebase';

const PAYMENT_FREQUENCIES: ('monthly' | 'yearly')[] = ['monthly', 'yearly'];

const TIERS = [
  {
    id: 'free',
    name: 'Free',
    price: {
      monthly: 'Free',
      yearly: 'Free',
    },
    description: 'Perfect for getting started',
    features: [
      '50 verification tokens per month',
      'Basic AI analysis',
      'Standard response time',
      'Community support',
      'Basic source verification',
      'Email support',
    ],
    cta: 'Get Started',
    tokens: 50,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: {
      monthly: 9.99,
      yearly: 7.99,
    },
    description: 'Great for power users',
    features: [
      '500 verification tokens per month',
      'Advanced AI analysis with GPT-4o',
      'Faster response time',
      'Priority support',
      'Custom source verification',
      'Real-time news integration',
      'Advanced bias detection',
      'Email & chat support',
    ],
    cta: 'Upgrade to Pro',
    tokens: 500,
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: {
      monthly: 49.99,
      yearly: 39.99,
    },
    description: 'For teams and organizations',
    features: [
      '5000 verification tokens per month',
      'Unlimited AI analysis',
      'Instant response time',
      'Dedicated support',
      'API access',
      'Custom integrations',
      'Team management',
      'Advanced analytics',
      'White-label options',
      'Phone & priority support',
    ],
    cta: 'Contact Sales',
    tokens: 5000,
    highlighted: true,
  },
];

const HighlightedBackground = () => (
  <>
    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-indigo-600/20 to-purple-600/20" />
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] bg-[size:45px_45px] opacity-100 dark:opacity-30" />
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-gradient-to-br from-blue-400/30 to-indigo-400/30 rounded-full blur-3xl" />
    <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-purple-400/30 to-pink-400/30 rounded-full blur-2xl" />
  </>
);

const PopularBackground = () => (
  <>
    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-red-500/10 to-pink-500/10" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.1),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.3),rgba(255,255,255,0))]" />
    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-orange-400/40 to-red-400/40 rounded-full blur-2xl" />
    <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-pink-400/40 to-purple-400/40 rounded-full blur-xl" />
  </>
);

const FloatingOrbs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-10 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
    <div className="absolute top-20 right-20 w-1 h-1 bg-indigo-400 rounded-full animate-pulse delay-1000" />
    <div className="absolute bottom-10 left-20 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse delay-500" />
    <div className="absolute bottom-20 right-10 w-1 h-1 bg-pink-400 rounded-full animate-pulse delay-1500" />
  </div>
);

const Tab = ({
  text,
  selected,
  setSelected,
  discount = false,
}: {
  text: string;
  selected: boolean;
  setSelected: (text: string) => void;
  discount?: boolean;
}) => {
  return (
    <button
      onClick={() => setSelected(text)}
      className={cn(
        'text-foreground relative w-fit px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold capitalize transition-colors',
        discount && 'flex items-center justify-center gap-1.5 sm:gap-2.5',
      )}
    >
      <span className="relative z-10">{text}</span>
      {selected && (
        <motion.span
          layoutId="tab"
          transition={{ type: 'spring', duration: 0.4 }}
          className="bg-background absolute inset-0 z-0 rounded-full shadow-sm"
        ></motion.span>
      )}
      {discount && (
        <Badge
          className={cn(
            'relative z-10 bg-green-100 text-xs whitespace-nowrap text-green-800 shadow-none hover:bg-green-100',
            selected
              ? 'bg-green-200 hover:bg-green-200'
              : 'bg-green-100 hover:bg-green-100',
          )}
        >
          Save 20%
        </Badge>
      )}
    </button>
  );
};

const PricingCard = ({
  tier,
  paymentFrequency,
  onSelectPlan,
  isLoading,
}: {
  tier: (typeof TIERS)[0];
  paymentFrequency: keyof typeof tier.price;
  onSelectPlan: (tierId: string) => void;
  isLoading: boolean;
}) => {
  const price = tier.price[paymentFrequency];
  const isHighlighted = tier.highlighted;
  const isPopular = tier.popular;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
      className={cn(
        'relative flex flex-col h-full overflow-hidden rounded-2xl sm:rounded-3xl border-2 p-6 sm:p-8 shadow-xl transition-all duration-300 hover:shadow-2xl group',
        isHighlighted
          ? 'bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white border-blue-400/50 shadow-blue-500/25'
          : 'bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50 text-foreground border-gray-200/50 dark:border-gray-700/50 shadow-gray-500/10',
        isPopular && 'outline outline-2 outline-orange-500/50 shadow-orange-500/25 scale-105',
      )}
    >
      {isHighlighted && <HighlightedBackground />}
      {isPopular && <PopularBackground />}
      <FloatingOrbs />

      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10 flex flex-col h-full">
        {/* Header Section */}
        <div className="flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl sm:text-2xl font-bold capitalize bg-gradient-to-r from-current to-current bg-clip-text">
              {tier.name}
            </h2>
            <div className="flex flex-wrap gap-2">
              {isPopular && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1 text-white text-xs font-bold shadow-lg">
                    🔥 Most Popular
                  </Badge>
                </motion.div>
              )}
              {tier.id === 'free' && (
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 px-3 py-1 text-white text-xs font-bold shadow-lg">
                  Free
                </Badge>
              )}
            </div>
          </div>

          <div className="relative mb-6">
            {typeof price === 'number' ? (
              <div className="space-y-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-current to-current bg-clip-text">
                    ${price}
                  </span>
                  <span className="text-lg sm:text-xl font-medium opacity-80">/month</span>
                </div>
                <p className="text-sm opacity-80 font-medium">
                  {tier.tokens.toLocaleString()} tokens per month
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-current to-current bg-clip-text">
                  {price}
                </h1>
                <p className="text-sm opacity-80 font-medium">
                  {tier.tokens.toLocaleString()} tokens per month
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <h3 className="text-sm font-semibold opacity-90 mb-4 leading-relaxed">{tier.description}</h3>
            <ul className="space-y-3">
              {tier.features.map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    'flex items-start gap-3 text-sm font-medium group/item',
                    isHighlighted ? 'text-white/90' : 'text-foreground/80',
                  )}
                >
                  <div className={cn(
                    'flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200',
                    isHighlighted 
                      ? 'bg-green-400/20 text-green-300 group-hover/item:bg-green-400/30' 
                      : 'bg-green-100 text-green-600 group-hover/item:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                  )}>
                    <BadgeCheck strokeWidth={3} size={12} />
                  </div>
                  <span className="leading-relaxed group-hover/item:text-foreground transition-colors">
                    {feature}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Button Section */}
          <div className="flex-shrink-0 mt-8">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={() => onSelectPlan(tier.id)}
                disabled={isLoading || tier.id === 'free'}
                className={cn(
                  'h-12 w-full rounded-xl font-bold text-base transition-all duration-200 shadow-lg',
                  isHighlighted 
                    ? 'bg-white text-blue-600 hover:bg-gray-50 hover:shadow-white/25' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-500/25',
                  tier.id === 'free' && 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-400 cursor-not-allowed hover:from-gray-100 hover:to-gray-200'
                )}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <span className="flex items-center gap-2">
                    {tier.cta}
                    {tier.id !== 'free' && (
                      <motion.div
                        initial={{ x: 0 }}
                        whileHover={{ x: 3 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        →
                      </motion.div>
                    )}
                  </span>
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function PricingPage() {
  const [selectedPaymentFreq, setSelectedPaymentFreq] = useState<'monthly' | 'yearly'>(PAYMENT_FREQUENCIES[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = getCurrentUser();
      setUser(currentUser);
    };
    loadUser();
  }, []);

  const handleSelectPlan = async (tierId: string) => {
    if (tierId === 'free') {
      toast.info('Free plan is already active!');
      return;
    }

    // Handle Enterprise plan - redirect to contact form
    if (tierId === 'enterprise') {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = '/#contact';
      }
      return;
    }

    // Handle Pro plan - redirect to contact for now (can be updated to Stripe later)
    if (tierId === 'pro') {
      toast.success('Pro plan upgrade request received! Our team will contact you shortly.');
      
      // For now, redirect to contact section or send email
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Send email to sales team
        const subject = encodeURIComponent('Pro Plan Upgrade Request');
        const body = encodeURIComponent(`User ${user?.email || 'Not logged in'} requested Pro plan upgrade.\nPayment Frequency: ${selectedPaymentFreq}\n\nPlease contact them to complete the upgrade.`);
        window.location.href = `mailto:sales@fakeverifier.com?subject=${subject}&body=${body}`;
      }
      return;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-blue-600">
              <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="text-base sm:text-lg font-semibold">FakeVerifier</div>
              <div className="text-xs text-muted-foreground">AI News Verification</div>
            </div>
          </div>
          <Button variant="outline" size="sm" className="text-xs sm:text-sm" onClick={() => window.history.back()}>
            Back to App
          </Button>
        </div>
      </div>

      <section className="container mx-auto flex flex-col items-center gap-8 sm:gap-12 py-8 sm:py-16 px-4 sm:px-6">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 sm:space-y-8 text-center max-w-4xl w-full"
        >
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
              Choose Your Plan
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              Unlock the full power of AI-powered news verification. Get more tokens, faster analysis, and advanced features.
            </p>
          </div>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Secure payments powered by Stripe</span>
          </div>

          {/* Payment Frequency Toggle */}
          <div className="mx-auto flex w-fit rounded-full bg-muted p-1">
            {PAYMENT_FREQUENCIES.map((freq) => (
              <Tab
                key={freq}
                text={freq}
                selected={selectedPaymentFreq === freq}
                setSelected={(text) =>
                  setSelectedPaymentFreq(text as 'monthly' | 'yearly')
                }
                discount={freq === 'yearly'}
              />
            ))}
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid w-full max-w-7xl grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3 lg:items-stretch">
          {TIERS.map((tier, i) => (
            <PricingCard
              key={i}
              tier={tier}
              paymentFrequency={selectedPaymentFreq}
              onSelectPlan={handleSelectPlan}
              isLoading={isLoading}
            />
          ))}
        </div>

        {/* Features Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-4xl space-y-6 sm:space-y-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-center">Why Choose FakeVerifier?</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Card className="p-4 sm:p-6 text-center space-y-3 sm:space-y-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-sm sm:text-base">AI-Powered Analysis</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Advanced GPT-4o technology for comprehensive news verification
              </p>
            </Card>

            <Card className="p-4 sm:p-6 text-center space-y-3 sm:space-y-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-sm sm:text-base">Multi-API Integration</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Real-time verification across multiple news sources and APIs
              </p>
            </Card>

            <Card className="p-4 sm:p-6 text-center space-y-3 sm:space-y-4 sm:col-span-2 lg:col-span-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-sm sm:text-base">Secure & Private</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Enterprise-grade security with end-to-end encryption
              </p>
            </Card>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-4xl space-y-4 sm:space-y-6"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-3 sm:space-y-4">
            <Card className="p-4 sm:p-6">
              <h3 className="font-semibold mb-2 text-sm sm:text-base">What are tokens?</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Tokens are used for each news verification request. One verification = one token. Tokens reset monthly.
              </p>
            </Card>

            <Card className="p-4 sm:p-6">
              <h3 className="font-semibold mb-2 text-sm sm:text-base">Can I change my plan?</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </Card>

            <Card className="p-4 sm:p-6">
              <h3 className="font-semibold mb-2 text-sm sm:text-base">Is my data secure?</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Absolutely. We use enterprise-grade encryption and never store sensitive payment information.
              </p>
            </Card>
          </div>
        </motion.div>

        {/* Contact Section for Enterprise Sales */}
        <motion.div 
          id="contact"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="w-full max-w-4xl space-y-6 sm:space-y-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-center">Contact Sales</h2>
          <p className="text-center text-muted-foreground">
            Ready to get started with our Enterprise plan? Our sales team is here to help you implement FakeVerifier at scale.
          </p>
          
          <Card className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Get in Touch</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Mail className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">Email</div>
                      <div className="text-sm text-muted-foreground">sales@fakeverifier.com</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Phone className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">Phone</div>
                      <div className="text-sm text-muted-foreground">+1 (555) 123-4567</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Enterprise Features</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Custom integrations & API access</li>
                  <li>• Dedicated account manager</li>
                  <li>• White-label solutions</li>
                  <li>• Priority support & SLAs</li>
                  <li>• Volume discounts</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                size="lg"
                onClick={() => {
                  // Open email client or redirect to contact form
                  window.location.href = 'mailto:sales@fakeverifier.com?subject=Enterprise%20Plan%20Inquiry';
                }}
              >
                Contact Sales Team
              </Button>
            </div>
          </Card>
        </motion.div>
      </section>
    </div>
  );
}


