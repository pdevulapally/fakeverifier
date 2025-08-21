"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Sparkles, 
  CheckCircle, 
  Zap, 
  Brain, 
  ArrowRight, 
  Users, 
  Globe, 
  Clock,
  Target,
  BarChart3,
  Search,
  FileText,
  Eye,
  Database,
  Lock,
  Cpu,
  Network,
  TrendingUp,
  AlertTriangle,
  BookOpen,
  Languages,
  Smartphone,
  Monitor,
  Server,
  Key,
  Activity,
  Layers,
  GitBranch,
  Palette
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Header } from "@/components/header";

export default function FeaturesPage() {
  const { user } = useAuth();

  const coreFeatures = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "GPT-4 Powered Analysis",
      description: "Advanced AI analysis with deep context understanding and natural language processing",
      details: [
        "Context-aware fact verification",
        "Semantic analysis of content",
        "Intent and bias detection",
        "Multi-language support"
      ]
    },
    {
      icon: <Search className="h-6 w-6" />,
      title: "Multi-Source Verification",
      description: "Cross-reference information across thousands of reliable sources",
      details: [
        "Real-time source checking",
        "Credibility scoring system",
        "Historical data analysis",
        "Source diversity validation"
      ]
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Real-Time Processing",
      description: "Instant verification results with live credibility scoring",
      details: [
        "<2 second response times",
        "Live credibility metrics",
        "Confidence scoring",
        "Real-time updates"
      ]
    }
  ];

  const advancedFeatures = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Enterprise Security",
      description: "Bank-level encryption and privacy protection for sensitive data",
      details: [
        "End-to-end encryption",
        "GDPR compliance",
        "SOC 2 Type II certified",
        "Zero-knowledge architecture"
      ]
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Advanced Analytics",
      description: "Comprehensive reporting with trend analysis and verification history",
      details: [
        "Detailed verification reports",
        "Trend analysis dashboard",
        "Export capabilities",
        "Custom reporting"
      ]
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Global Coverage",
      description: "Access to international news sources and multi-language fact-checking",
      details: [
        "50+ languages supported",
        "International news sources",
        "Cultural context awareness",
        "Regional fact-checking"
      ]
    }
  ];

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
      icon: <Search className="h-5 w-5" />,
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
      feature: "Language Support",
      fakeverifier: "50+ languages",
      competitors: "5-15 languages"
    },
    {
      feature: "Real-time Updates",
      fakeverifier: "Yes",
      competitors: "Limited"
    },
    {
      feature: "API Access",
      fakeverifier: "Unlimited (Pro)",
      competitors: "Rate limited"
    }
  ];

  const stats = [
    { number: "99.8%", label: "Accuracy Rate", icon: <Target className="h-5 w-5" /> },
    { number: "<2s", label: "Average Response", icon: <Clock className="h-5 w-5" /> },
    { number: "1M+", label: "Sources Verified", icon: <Globe className="h-5 w-5" /> },
    { number: "24/7", label: "Support Available", icon: <Users className="h-5 w-5" /> },
    { number: "50+", label: "Languages", icon: <Languages className="h-5 w-5" /> },
    { number: "99.9%", label: "Uptime SLA", icon: <Activity className="h-5 w-5" /> }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Background gradient - matching hero section */}
      <div className="absolute inset-0 z-0">
        <div className="from-blue-600/20 via-background to-background absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]"></div>
        <div className="bg-blue-600/5 absolute top-0 left-1/2 -z-10 h-[1000px] w-[1000px] -translate-x-1/2 rounded-full blur-3xl"></div>
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f620_1px,transparent_1px),linear-gradient(to_bottom,#3b82f620_1px,transparent_1px)] bg-[size:16px_16px] opacity-15"></div>

      <div className="relative z-10 container mx-auto px-4 py-20 sm:py-16 md:py-20 lg:py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 border-blue-200 bg-blue-50/50 text-blue-700">
            <Sparkles className="h-3 w-3 mr-1" />
            Advanced Features
          </Badge>
          <h1 className="from-blue-600/10 via-foreground/85 to-foreground/50 bg-gradient-to-tl bg-clip-text text-center text-3xl tracking-tighter text-balance text-transparent sm:text-4xl md:text-5xl lg:text-6xl px-2 sm:px-0 mb-4">
            <span className="block leading-tight">Advanced AI Verification</span>
            <span className="block text-lg sm:text-xl md:text-2xl lg:text-3xl mt-1 sm:mt-2 leading-tight">Features & Capabilities</span>
          </h1>
          <p className="text-muted-foreground mx-auto mt-4 sm:mt-6 max-w-4xl text-center text-sm sm:text-base md:text-lg px-4 sm:px-0 leading-relaxed">
            Experience the most advanced AI-powered fact-checking platform with cutting-edge features designed for accuracy, 
            speed, and reliability. Our comprehensive verification system leverages the latest in artificial intelligence 
            to provide unparalleled fact-checking capabilities.
          </p>
        </motion.div>

        {/* Enhanced Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-20"
        >
          {stats.map((stat, index) => (
            <Card key={index} className="text-center border-blue-200/50 bg-background/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex justify-center mb-2 text-blue-600">
                  {stat.icon}
                </div>
                <div className="text-xl font-bold text-blue-600 mb-1">{stat.number}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Core Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-20"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
            Core AI Features
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
            Our core features leverage the latest in artificial intelligence to provide accurate, 
            real-time fact-checking capabilities.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {coreFeatures.map((feature, index) => (
              <Card key={index} className="border-blue-200/50 bg-background/50 backdrop-blur-sm hover:border-blue-300/50 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center mb-4 text-blue-600">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center gap-3 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Advanced Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-20"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
            Advanced Capabilities
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
            Enterprise-grade features designed for professional use cases and large-scale operations.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {advancedFeatures.map((feature, index) => (
              <Card key={index} className="border-blue-200/50 bg-background/50 backdrop-blur-sm hover:border-blue-300/50 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center mb-4 text-blue-600">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center gap-3 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Technical Specifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-20"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
            Technical Specifications
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
            Detailed technical specifications and performance metrics of our platform.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {technicalSpecs.map((category, index) => (
              <Card key={index} className="border-blue-200/50 bg-background/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.specs.map((spec, specIndex) => (
                      <div key={specIndex} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-blue-600">{spec.icon}</div>
                          <span className="text-sm text-muted-foreground">{spec.label}</span>
                        </div>
                        <span className="text-sm font-medium">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Use Cases */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
            Professional Use Cases
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
            Designed for professionals across various industries who need reliable fact-checking capabilities.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <Card key={index} className="border-blue-200/50 bg-background/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl text-white">
                      {useCase.icon}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{useCase.title}</CardTitle>
                      <p className="text-muted-foreground text-sm">{useCase.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-sm">Key Features</h4>
                      <ul className="space-y-2">
                        {useCase.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center gap-3 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-sm">Benefits</h4>
                      <ul className="space-y-2">
                        {useCase.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="flex items-center gap-3 text-sm">
                            <TrendingUp className="h-4 w-4 text-blue-500 flex-shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
            Why Choose FakeVerifier?
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
            See how we compare to other fact-checking solutions in the market.
          </p>
          <Card className="border-blue-200/50 bg-background/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-blue-200/50">
                      <th className="text-left py-3 px-4 font-semibold">Feature</th>
                      <th className="text-center py-3 px-4 font-semibold text-blue-600">FakeVerifier</th>
                      <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Competitors</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((row, index) => (
                      <tr key={index} className="border-b border-blue-200/30">
                        <td className="py-3 px-4 font-medium">{row.feature}</td>
                        <td className="py-3 px-4 text-center text-blue-600 font-medium">{row.fakeverifier}</td>
                        <td className="py-3 px-4 text-center text-muted-foreground">{row.competitors}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-center"
        >
          <Card className="border-blue-200/50 bg-gradient-to-r from-blue-50/50 to-background backdrop-blur-sm">
            <CardContent className="p-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Ready to Experience Advanced AI Verification?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join thousands of professionals who trust FakeVerifier for accurate, 
                real-time fact-checking with cutting-edge AI technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={user ? "/verify" : "/Signup"}>
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Start Verifying Now
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
