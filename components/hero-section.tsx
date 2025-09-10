"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, Shield, Sparkles, CheckCircle, Zap, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ShaderBackground } from '@/components/ui/hero-shader';
import { AI_Prompt } from '@/components/ui/animated-ai-input';
import { cn } from '@/lib/utils';
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"

export function HeroSection() {
  const { user } = useAuth();

  return (
    <ShaderBackground>
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
              <div className="border-white/30 bg-white/10 inline-flex items-center rounded-full border px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm backdrop-blur-sm hover:border-white/50 hover:bg-white/20 transition-all duration-300 cursor-pointer group">
                <span className="bg-white/20 mr-1.5 sm:mr-2 rounded-full px-1.5 py-0.5 sm:px-2 sm:py-0.5 text-xs font-semibold text-white">
                  AI-Powered
                </span>
                <span className="text-white/80 hidden sm:inline">
                  Advanced fake news detection & real-time fact verification
                </span>
                <span className="text-white/80 sm:hidden">
                  News verification
                </span>
                <ChevronRight className="text-white/80 ml-1 h-3 w-3 sm:h-4 sm:w-4" />
              </div>
            </Link>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="from-white/90 via-white to-white/70 bg-gradient-to-tl bg-clip-text text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-tighter text-balance text-transparent leading-tight px-2 sm:px-0"
          >
            AI-Powered Fake News Detector
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/80 mx-auto mt-4 sm:mt-6 max-w-2xl text-center text-sm sm:text-base lg:text-lg px-4 sm:px-0 leading-relaxed"
          >
            <strong>FakeVerifier</strong> is the leading AI-powered news verification platform that helps you detect fake news, 
            verify sources, and get instant credibility scores using advanced GPT-4 technology.
          </motion.p>

          {/* AI Input Component */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.3,
              type: 'spring',
              stiffness: 50,
            }}
            className="relative mx-auto mt-8 sm:mt-12 lg:mt-16 max-w-2xl lg:max-w-3xl px-4 sm:px-0"
          >
            <AI_Prompt />
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8 sm:mt-12 lg:mt-16 text-center px-4 sm:px-0"
          >
            <p className="text-xs sm:text-sm text-white/70 mb-3 sm:mb-4">Trusted by journalists, researchers, and informed citizens worldwide</p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 sm:gap-4 lg:gap-6 xl:gap-8 text-white/60">
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
    </ShaderBackground>
  );
}
