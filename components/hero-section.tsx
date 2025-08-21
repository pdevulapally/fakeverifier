"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, ExternalLink, Github, Shield, Sparkles, CheckCircle, Zap, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
 

export function HeroSection() {
  const { user } = useAuth();

  return (
    <section className="bg-background relative w-full overflow-hidden" aria-label="AI News Verification Platform">
      {/* Background gradient */}
      <div className="absolute inset-0 z-0">
        <div className="from-blue-600/20 via-background to-background absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]"></div>
        <div className="bg-blue-600/5 absolute top-0 left-1/2 -z-10 h-[1000px] w-[1000px] -translate-x-1/2 rounded-full blur-3xl"></div>
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f620_1px,transparent_1px),linear-gradient(to_bottom,#3b82f620_1px,transparent_1px)] bg-[size:16px_16px] opacity-15"></div>

      <div className="relative z-10 container mx-auto px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-5xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-6 flex justify-center"
          >
            <div className="border-blue-200/30 bg-background/80 inline-flex items-center rounded-full border px-3 py-1 text-sm backdrop-blur-sm">
              <span className="bg-blue-600 mr-2 rounded-full px-2 py-0.5 text-xs font-semibold text-white flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                AI-Powered
              </span>
              <span className="text-muted-foreground">
                Advanced fake news detection & fact-checking technology
              </span>
              <ChevronRight className="text-muted-foreground ml-1 h-4 w-4" />
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="from-blue-600/10 via-foreground/85 to-foreground/50 bg-gradient-to-tl bg-clip-text text-center text-3xl tracking-tighter text-balance text-transparent sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl px-4 lg:px-0"
          >
            <span className="block">AI-Powered Fake News Detector</span>
            <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mt-2">Real-Time Fact Checking & Verification</span>
          </motion.h1>

          {/* SEO-Optimized Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground mx-auto mt-6 max-w-3xl text-center text-base sm:text-lg px-4 lg:px-0"
          >
            <strong>FakeVerifier</strong> is the leading AI-powered news verification platform that helps you detect fake news, 
            verify sources, and get instant credibility scores. Our advanced fact-checking technology uses GPT-4 to analyze 
            news articles, social media posts, and online content for misinformation detection and truth verification.
          </motion.p>

          {/* Key Features for SEO */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto px-4 lg:px-0"
          >
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Instant Credibility Scoring</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Zap className="h-4 w-4 text-blue-500" />
              <span>Real-Time Fact Checking</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Brain className="h-4 w-4 text-purple-500" />
              <span>AI-Powered Analysis</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col items-stretch justify-center gap-3 lg:flex-row w-full max-w-sm lg:max-w-none mx-auto px-4 lg:px-0"
          >
            <Link href={user ? "/verify" : "/Signup"} className="block w-full lg:w-auto">
              <Button
                size="lg"
                className="group bg-blue-600 text-white hover:shadow-blue-600/30 relative overflow-hidden rounded-full px-6 py-3 shadow-lg transition-all duration-300 w-full text-base"
                aria-label="Start free news verification"
              >
                <span className="relative z-10 flex items-center justify-center lg:justify-start">
                  <Shield className="mr-2 h-4 w-4 flex-shrink-0" />
                  {user ? "Start Verifying News" : "Try Free News Verification"}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 flex-shrink-0" />
                </span>
                <span className="from-blue-600 via-blue-500 to-blue-600 absolute inset-0 z-0 bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
              </Button>
            </Link>

            <Link href="/about" className="block w-full lg:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="border-blue-200 bg-background/50 flex items-center justify-center gap-2 rounded-full backdrop-blur-sm px-6 py-3 w-full text-base"
                aria-label="Learn more about our fact checking technology"
              >
                <Sparkles className="h-4 w-4 flex-shrink-0" />
                How It Works
              </Button>
            </Link>
          </motion.div>

          {/* Feature Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 flex justify-center"
          >
            <div className="relative">
              <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 blur-xl"></div>
              <div className="relative rounded-2xl border border-blue-200/20 bg-background/50 p-2 backdrop-blur-sm">
                <img
                  src="/Images/dashboard.png"
                  alt="FakeVerifier AI News Verification Dashboard - Real-time fact checking and credibility analysis interface"
                  className="rounded-xl w-full max-w-4xl"
                  loading="eager"
                />
              </div>
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-16 text-center"
          >
            <p className="text-sm text-muted-foreground mb-4">Trusted by journalists, researchers, and informed citizens worldwide</p>
            <div className="flex flex-wrap justify-center items-center gap-8 text-muted-foreground/60">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="text-sm">Secure & Private</span>
              </div>
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                <span className="text-sm">AI-Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span className="text-sm">Real-Time Results</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
