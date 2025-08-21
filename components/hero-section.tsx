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

                           <div className="relative z-10 container mx-auto px-4 py-28 sm:py-20 md:py-24 lg:py-28 xl:py-36">
         <div className="mx-auto max-w-5xl">
           {/* Badge */}
                       <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto mb-4 sm:mb-6 flex justify-center"
            >
              <Link href="/features" className="group">
                <div className="border-blue-200/30 bg-background/80 inline-flex items-center rounded-full border px-3 py-1.5 text-xs backdrop-blur-sm sm:px-4 sm:py-2 sm:text-sm hover:border-blue-300/50 hover:bg-background/90 transition-all duration-300 cursor-pointer group">
                  <span className="bg-blue-600 mr-2 sm:mr-3 rounded-full px-2 py-1 text-xs font-semibold text-white flex items-center gap-1.5 flex-shrink-0 group-hover:bg-blue-700 transition-colors">
                    <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="whitespace-nowrap">AI-Powered</span>
                  </span>
                  <span className="text-muted-foreground hidden lg:inline whitespace-nowrap group-hover:text-foreground transition-colors">
                    AI-powered fake news detection & real-time fact verification
                  </span>
                  <span className="text-muted-foreground hidden sm:inline lg:hidden whitespace-nowrap group-hover:text-foreground transition-colors">
                    AI-powered news verification & fact-checking
                  </span>
                  <span className="text-muted-foreground sm:hidden whitespace-nowrap group-hover:text-foreground transition-colors">
                    AI news verification
                  </span>
                  <ChevronRight className="text-muted-foreground ml-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 group-hover:text-foreground group-hover:translate-x-0.5 transition-all duration-300" />
                </div>
              </Link>
            </motion.div>

           {/* Main Heading */}
           <motion.h1
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.1 }}
             className="from-blue-600/10 via-foreground/85 to-foreground/50 bg-gradient-to-tl bg-clip-text text-center text-2xl tracking-tighter text-balance text-transparent sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl px-2 sm:px-0"
           >
             <span className="block leading-tight">AI-Powered Fake News Detector</span>
             <span className="block text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl mt-1 sm:mt-2 leading-tight">Real-Time Fact Checking & Verification</span>
           </motion.h1>

           {/* SEO-Optimized Description */}
           <motion.p
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.2 }}
             className="text-muted-foreground mx-auto mt-4 sm:mt-6 max-w-3xl text-center text-sm sm:text-base md:text-lg px-4 sm:px-0 leading-relaxed"
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
             className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-4xl mx-auto px-4 sm:px-0"
           >
             <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
               <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
               <span className="text-center">
                 <span className="hidden sm:inline">Instant Credibility Scoring</span>
                 <span className="sm:hidden">Credibility Scoring</span>
               </span>
             </div>
             <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
               <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 flex-shrink-0" />
               <span className="text-center">
                 <span className="hidden sm:inline">Real-Time Fact Checking</span>
                 <span className="sm:hidden">Fact Checking</span>
               </span>
             </div>
             <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
               <Brain className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500 flex-shrink-0" />
               <span className="text-center">
                 <span className="hidden sm:inline">AI-Powered Analysis</span>
                 <span className="sm:hidden">AI Analysis</span>
               </span>
             </div>
           </motion.div>

           {/* CTA Buttons */}
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.3 }}
             className="mt-8 sm:mt-10 flex flex-col items-stretch justify-center gap-3 w-full max-w-sm mx-auto px-4 sm:px-0 sm:flex-row sm:max-w-none"
           >
             <Link href={user ? "/verify" : "/Signup"} className="block w-full sm:w-auto">
               <Button
                 size="lg"
                 className="group bg-blue-600 text-white hover:shadow-blue-600/30 relative overflow-hidden rounded-full px-4 sm:px-6 py-3 shadow-lg transition-all duration-300 w-full text-sm sm:text-base"
                 aria-label="Start free news verification"
               >
                                   <span className="relative z-10 flex items-center justify-center gap-2 sm:justify-start">
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
                 className="border-blue-200 bg-background/50 flex items-center justify-center gap-2 rounded-full backdrop-blur-sm px-4 sm:px-6 py-3 w-full text-sm sm:text-base"
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
             className="mt-12 sm:mt-16 flex justify-center px-2 sm:px-0"
           >
             <div className="relative w-full">
               <div className="absolute -inset-2 sm:-inset-4 rounded-2xl bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 blur-xl"></div>
               <div className="relative rounded-2xl border border-blue-200/20 bg-background/50 p-1 sm:p-2 backdrop-blur-sm">
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
             className="mt-12 sm:mt-16 text-center px-4 sm:px-0"
           >
             <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">Trusted by journalists, researchers, and informed citizens worldwide</p>
             <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8 text-muted-foreground/60">
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
    </section>
  );
}
