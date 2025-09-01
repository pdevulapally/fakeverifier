"use client"

import React from 'react';
import { Header } from "@/components/header";
import {
  Shield,
  Brain,
  Search,
  Zap,
  Globe,
  BarChart3,
  Users,
  Lock,
  LucideIcon,
  Cpu,
  Target,
  Database,
  Activity,
  Server,
  Network,
  FileText,
  Eye,
  BookOpen,
  Languages,
  Smartphone,
  Monitor,
  Key,
  Layers,
  GitBranch,
  Palette
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Define the feature item type
type FeatureItem = {
  icon: LucideIcon;
  title: string;
  description: string;
  position?: 'left' | 'right';
  cornerStyle?: string;
};

// Create feature data arrays for left and right columns
const leftFeatures: FeatureItem[] = [
  {
    icon: Brain,
    title: 'GPT-4 Powered Analysis',
    description:
      'Advanced AI analysis with deep context understanding and natural language processing for accurate fact verification.',
    position: 'left',
    cornerStyle: 'sm:translate-x-4 sm:rounded-br-[2px]',
  },
  {
    icon: Search,
    title: 'Multi-Source Verification',
    description:
      'Cross-reference information across thousands of reliable sources with real-time credibility scoring.',
    position: 'left',
    cornerStyle: 'sm:-translate-x-4 sm:rounded-br-[2px]',
  },
  {
    icon: Zap,
    title: 'Real-Time Processing',
    description:
      'Instant verification results with live credibility scoring and confidence metrics in under 2 seconds.',
    position: 'left',
    cornerStyle: 'sm:translate-x-4 sm:rounded-tr-[2px]',
  },
];

const rightFeatures: FeatureItem[] = [
  {
    icon: Shield,
    title: 'Enterprise Security',
    description:
      'Bank-level encryption and privacy protection with GDPR compliance and SOC 2 Type II certification.',
    position: 'right',
    cornerStyle: 'sm:-translate-x-4 sm:rounded-bl-[2px]',
  },
  {
    icon: Users,
    title: 'Global Coverage',
    description:
      'Access to international news sources and multi-language fact-checking across 50+ languages.',
    position: 'right',
    cornerStyle: 'sm:translate-x-4 sm:rounded-bl-[2px]',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description:
      'Comprehensive reporting with trend analysis, verification history, and detailed insights for Pro users.',
    position: 'right',
    cornerStyle: 'sm:-translate-x-4 sm:rounded-tl-[2px]',
  },
];

// Technical specifications data
const technicalSpecs = [
  {
    category: "AI & Processing",
    specs: [
      { label: "AI Model", value: "GPT-4 Turbo", icon: <Cpu className="h-4 w-4" /> },
      { label: "Processing Speed", value: "<2 seconds", icon: <Zap className="h-4 w-4" /> },
      { label: "Accuracy Rate", value: "99.8%", icon: <Target className="h-4 w-4" /> },
      { label: "Languages", value: "50+ supported", icon: <Languages className="h-4 w-4" /> }
    ]
  },
  {
    category: "Data & Sources",
    specs: [
      { label: "Sources Verified", value: "1M+ sources", icon: <Database className="h-4 w-4" /> },
      { label: "Update Frequency", value: "Real-time", icon: <Activity className="h-4 w-4" /> },
      { label: "Data Retention", value: "Configurable", icon: <Server className="h-4 w-4" /> },
      { label: "API Rate Limits", value: "Unlimited (Pro)", icon: <Network className="h-4 w-4" /> }
    ]
  },
  {
    category: "Security & Compliance",
    specs: [
      { label: "Encryption", value: "AES-256", icon: <Lock className="h-4 w-4" /> },
      { label: "Compliance", value: "GDPR, SOC 2", icon: <Shield className="h-4 w-4" /> },
      { label: "Authentication", value: "OAuth 2.0", icon: <Key className="h-4 w-4" /> },
      { label: "Uptime", value: "99.9% SLA", icon: <Activity className="h-4 w-4" /> }
    ]
  }
];

// Use cases data
const useCases = [
  {
    title: "Journalists & Newsrooms",
    description: "Verify breaking news, fact-check sources, and maintain editorial standards",
    icon: <FileText className="h-5 w-5" />,
    features: ["Real-time verification", "Source credibility", "Editorial workflow", "Breaking news alerts"],
    benefits: ["Reduce fact-checking time by 80%", "Improve editorial accuracy", "Maintain journalistic integrity"]
  },
  {
    title: "Researchers & Academics",
    description: "Validate research findings, cross-reference studies, and ensure data accuracy",
    icon: <BookOpen className="h-5 w-5" />,
    features: ["Academic sources", "Research validation", "Data verification", "Citation checking"],
    benefits: ["Ensure research credibility", "Save hours of manual verification", "Improve publication quality"]
  },
  {
    title: "Social Media Managers",
    description: "Monitor brand mentions, verify viral content, and protect brand reputation",
    icon: <Eye className="h-5 w-5" />,
    features: ["Brand monitoring", "Viral content", "Reputation protection", "Crisis management"],
    benefits: ["Protect brand reputation", "Respond quickly to misinformation", "Maintain trust"]
  },
  {
    title: "Government & Policy",
    description: "Verify policy information, fact-check statements, and ensure transparency",
    icon: <Shield className="h-5 w-5" />,
    features: ["Policy verification", "Statement fact-checking", "Transparency reporting", "Public trust"],
    benefits: ["Ensure policy accuracy", "Build public trust", "Maintain transparency"]
  }
];

// Comparison data
const comparisonData = [
  {
    feature: "AI Model",
    fakeverifier: "GPT-4 Turbo",
    competitors: "GPT-3.5 or older"
  },
  {
    feature: "Processing Speed",
    fakeverifier: "<2 seconds",
    competitors: "5-15 seconds"
  },
  {
    feature: "Accuracy Rate",
    fakeverifier: "99.8%",
    competitors: "85-95%"
  },
  {
    feature: "Source Coverage",
    fakeverifier: "1M+ sources",
    competitors: "100K-500K sources"
  },
  {
    feature: "Real-time Updates",
    fakeverifier: "Live",
    competitors: "Hourly/Daily"
  }
];

// Feature card component
const FeatureCard = ({ feature }: { feature: FeatureItem }) => {
  const Icon = feature.icon;

  return (
    <div>
      <div
        className={cn(
          'relative rounded-2xl px-4 pt-4 pb-4 text-sm',
          'bg-blue-50/50 ring-blue-200 ring border-blue-100',
          feature.cornerStyle,
        )}
      >
        <div className="text-blue-600 mb-3 text-[2rem]">
          <Icon />
        </div>
        <h2 className="text-slate-900 mb-2.5 text-2xl font-semibold">{feature.title}</h2>
        <p className="text-slate-600 text-base text-pretty leading-relaxed">
          {feature.description}
        </p>
        {/* Decorative elements */}
        <span className="from-blue-500/0 via-blue-500 to-blue-500/0 absolute -bottom-px left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r opacity-60"></span>
        <span className="absolute inset-0 bg-[radial-gradient(30%_5%_at_50%_100%,hsl(221,83%,53%,0.15)_0%,transparent_100%)] opacity-60"></span>
      </div>
    </div>
  );
};

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <section className="pt-32 pb-8" id="features">
        <div className="mx-6 max-w-[1120px] pt-2 pb-16 max-[300px]:mx-4 min-[1150px]:mx-auto">
          <div className="flex flex-col-reverse gap-6 md:grid md:grid-cols-3">
            {/* Left column */}
            <div className="flex flex-col gap-6">
              {leftFeatures.map((feature, index) => (
                <FeatureCard key={`left-feature-${index}`} feature={feature} />
              ))}
            </div>

            {/* Center column */}
            <div className="order-[1] mb-6 self-center sm:order-[0] md:mb-0">
              <div className="bg-blue-100 text-blue-900 ring-blue-200 relative mx-auto mb-4.5 w-fit rounded-full rounded-bl-[2px] px-4 py-2 text-sm ring border border-blue-200">
                <span className="relative z-1 flex items-center gap-2 font-medium">
                  Features
                </span>
                <span className="from-blue-500/0 via-blue-500 to-blue-500/0 absolute -bottom-px left-1/2 h-px w-2/5 -translate-x-1/2 bg-gradient-to-r"></span>
                <span className="absolute inset-0 bg-[radial-gradient(30%_40%_at_50%_100%,hsl(221,83%,53%,0.25)_0%,transparent_100%)]"></span>
              </div>
              <h2 className="text-slate-900 mb-2 text-center text-2xl font-bold sm:mb-2.5 md:text-[2rem]">
                Why Choose FakeVerifier?
              </h2>
              <p className="text-slate-600 mx-auto max-w-[18rem] text-center text-pretty leading-relaxed">
                Advanced AI-powered fact verification with enterprise-grade security and real-time processing for accurate, reliable results.
              </p>
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-6">
              {rightFeatures.map((feature, index) => (
                <FeatureCard key={`right-feature-${index}`} feature={feature} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-16 bg-white/50">
        <div className="mx-6 max-w-[1120px] max-[300px]:mx-4 min-[1150px]:mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Technical Specifications</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Enterprise-grade infrastructure powering our fact verification platform</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {technicalSpecs.map((category, index) => (
              <Card key={index} className="border-blue-200 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-blue-900">{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.specs.map((spec, specIndex) => (
                      <div key={specIndex} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-blue-600">{spec.icon}</div>
                          <span className="text-sm text-slate-700">{spec.label}</span>
                        </div>
                        <span className="text-sm font-medium text-slate-900">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16">
        <div className="mx-6 max-w-[1120px] max-[300px]:mx-4 min-[1150px]:mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Who Uses FakeVerifier?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Trusted by professionals across industries for accurate fact verification</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <Card key={index} className="border-blue-200 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                      {useCase.icon}
                    </div>
                    <CardTitle className="text-xl text-slate-900">{useCase.title}</CardTitle>
                  </div>
                  <p className="text-slate-600">{useCase.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-2">Key Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {useCase.features.map((feature, featureIndex) => (
                        <Badge key={featureIndex} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-2">Benefits</h4>
                    <ul className="space-y-1">
                      {useCase.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="text-sm text-slate-600 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-16 bg-blue-50/50">
        <div className="mx-6 max-w-[1120px] max-[300px]:mx-4 min-[1150px]:mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose FakeVerifier?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">See how we outperform the competition in every key metric</p>
          </div>
          <Card className="border-blue-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-center text-2xl text-slate-900">Feature Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-blue-200">
                      <th className="text-left py-3 px-4 font-semibold text-slate-900">Feature</th>
                      <th className="text-center py-3 px-4 font-semibold text-blue-600">FakeVerifier</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-600">Competitors</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((item, index) => (
                      <tr key={index} className="border-b border-blue-100 hover:bg-blue-50/30">
                        <td className="py-3 px-4 font-medium text-slate-800">{item.feature}</td>
                        <td className="py-3 px-4 text-center">
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                            {item.fakeverifier}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center text-slate-600">{item.competitors}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="mx-6 max-w-[1120px] max-[300px]:mx-4 min-[1150px]:mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to Get Started?</h2>
          <p className="text-slate-600 max-w-2xl mx-auto mb-8">
            Join thousands of professionals who trust FakeVerifier for accurate, real-time fact verification
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
              Start Verifying Now
            </Button>
            <Button variant="outline" size="lg" className="border-blue-200 text-blue-700 hover:bg-blue-50 px-8 py-3">
              View Pricing
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
