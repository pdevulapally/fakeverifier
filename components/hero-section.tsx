"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, Shield, Sparkles, CheckCircle, Zap, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"

export function HeroSection() {
  const { user } = useAuth();

  return (
    <div className="bg-background relative w-full overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 z-0">
        <div className="from-blue-600/20 via-background to-background absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]"></div>
        <div className="bg-blue-600/5 absolute top-0 left-1/2 -z-10 h-[600px] w-[600px] sm:h-[800px] sm:w-[800px] lg:h-[1000px] lg:w-[1000px] -translate-x-1/2 rounded-full blur-3xl"></div>
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f620_1px,transparent_1px),linear-gradient(to_bottom,#3b82f620_1px,transparent_1px)] bg-[size:12px_12px] sm:bg-[size:16px_16px] opacity-15"></div>

      <div className="relative z-10 container mx-auto px-4 py-20 sm:py-20 md:py-24 lg:py-28 xl:py-32">
        <div className="mx-auto max-w-4xl lg:max-w-5xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-4 sm:mb-6 flex justify-center"
          >
            <Link href="/features" className="group">
              <div className="border-blue-200/30 bg-background/80 inline-flex items-center rounded-full border px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm backdrop-blur-sm hover:border-blue-300/50 hover:bg-background/90 transition-all duration-300 cursor-pointer group">
                <span className="bg-blue-600 mr-1.5 sm:mr-2 rounded-full px-1.5 py-0.5 sm:px-2 sm:py-0.5 text-xs font-semibold text-white">
                  AI-Powered
                </span>
                <span className="text-muted-foreground hidden sm:inline">
                  Advanced fake news detection & real-time fact verification
                </span>
                <span className="text-muted-foreground sm:hidden">
                  News verification
                </span>
                <ChevronRight className="text-muted-foreground ml-1 h-3 w-3 sm:h-4 sm:w-4" />
              </div>
            </Link>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="from-blue-600/10 via-foreground/85 to-foreground/50 bg-gradient-to-tl bg-clip-text text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-tighter text-balance text-transparent leading-tight px-2 sm:px-0"
          >
            AI-Powered Fake News Detector
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground mx-auto mt-4 sm:mt-6 max-w-2xl text-center text-sm sm:text-base lg:text-lg px-4 sm:px-0 leading-relaxed"
          >
            <strong>FakeVerifier</strong> is the leading AI-powered news verification platform that helps you detect fake news, 
            verify sources, and get instant credibility scores using advanced GPT-4 technology.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 sm:mt-8 lg:mt-10 flex flex-col items-stretch justify-center gap-3 sm:gap-4 w-full max-w-sm sm:max-w-none mx-auto px-4 sm:px-0 sm:flex-row"
          >
            <Link href={user ? "/verify" : "/Signup"} className="block w-full sm:w-auto">
              <Button
                size="lg"
                className="group bg-blue-600 text-white hover:shadow-blue-600/30 relative overflow-hidden rounded-full px-4 sm:px-6 py-3 shadow-lg transition-all duration-300 w-full text-sm sm:text-base"
              >
                <span className="relative z-10 flex items-center justify-center sm:justify-start gap-2">
                  <Shield className="h-4 w-4 flex-shrink-0" />
                  {user ? "Start Verifying News" : "Try Free News Verification"}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 flex-shrink-0" />
                </span>
                <span className="from-blue-600 via-blue-500 to-blue-600 absolute inset-0 z-0 bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
              </Button>
            </Link>

            <Link href="/about" className="block w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="border-blue-200 bg-background/50 flex items-center justify-center gap-2 rounded-full backdrop-blur-sm w-full text-sm sm:text-base px-4 sm:px-6 py-3"
              >
                <Sparkles className="h-4 w-4" />
                Learn More
              </Button>
            </Link>
          </motion.div>

          {/* Feature Image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.5,
              type: 'spring',
              stiffness: 50,
            }}
            className="relative mx-auto mt-8 sm:mt-12 lg:mt-16 max-w-3xl lg:max-w-4xl px-2 sm:px-0"
          >
            <div className="border-blue-200/40 bg-background/50 overflow-hidden rounded-lg sm:rounded-xl border shadow-lg sm:shadow-xl backdrop-blur-sm">
              <div className="border-blue-200/40 bg-muted/50 flex h-8 sm:h-10 items-center border-b px-3 sm:px-4">
                <div className="flex space-x-1.5 sm:space-x-2">
                  <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-red-500"></div>
                  <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-green-500"></div>
                </div>
                <div className="bg-background/50 text-muted-foreground mx-auto flex items-center rounded-md px-2 sm:px-3 py-0.5 sm:py-1 text-xs">
                  fakeverifier.co.uk
                </div>
              </div>
              <div className="relative">
                <img
                  src="/Images/dashboard.png"
                  alt="FakeVerifier AI News Verification Dashboard - Real-time fact checking and credibility analysis interface"
                  className="w-full"
                />
                <div className="from-background absolute inset-0 bg-gradient-to-t to-transparent opacity-0"></div>
              </div>
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8 sm:mt-12 lg:mt-16 text-center px-4 sm:px-0"
          >
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">Trusted by journalists, researchers, and informed citizens worldwide</p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 sm:gap-4 lg:gap-6 xl:gap-8 text-muted-foreground/60">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Shield className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm">Secure & Private</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Brain className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm">AI-Powered</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Zap className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm">Real-Time Results</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
