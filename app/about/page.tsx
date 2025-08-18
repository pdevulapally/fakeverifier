"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Brain, Globe, Search, Cloud, AlertTriangle, Users, Zap, CheckCircle, ArrowRight, Star, Award, Target } from 'lucide-react';
import { Header } from '@/components/header';

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen">
      <Header />
      {/* Premium Hero Section */}
      <section className="relative py-32 lg:py-40 overflow-hidden">
        {/* Advanced Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-purple-600/20 to-background"></div>
          <div className="absolute top-0 left-1/2 -z-10 h-[1200px] w-[1200px] -translate-x-1/2 rounded-full bg-gradient-radial from-blue-500/20 via-blue-400/10 to-transparent blur-3xl"></div>
          <div className="absolute bottom-0 right-0 -z-10 h-[800px] w-[800px] rounded-full bg-gradient-radial from-purple-500/15 via-purple-400/5 to-transparent blur-3xl"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f620_1px,transparent_1px),linear-gradient(to_bottom,#3b82f620_1px,transparent_1px)] bg-[size:24px_24px] opacity-20"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            {/* Premium Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-200/30 rounded-full px-6 py-3 backdrop-blur-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-blue-600">AI-Powered Verification Technology</span>
                <Award className="h-4 w-4 text-blue-600" />
              </div>
            </motion.div>

            {/* Premium Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mb-12"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                  <Brain className="h-12 w-12 text-white" />
                </div>
              </div>
            </motion.div>

            {/* Premium Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8"
            >
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                Combating Fake News
              </span>
              <br />
              <span className="text-foreground">with Advanced AI</span>
            </motion.h1>

            {/* Premium Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-xl lg:text-2xl text-muted-foreground mb-16 max-w-4xl mx-auto leading-relaxed"
            >
              An innovative final year project leveraging cutting-edge artificial intelligence to detect and prevent the spread of misinformation in digital media with unprecedented accuracy.
            </motion.p>

            {/* Premium Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-gradient-to-br from-blue-600/10 to-purple-600/10 backdrop-blur-sm rounded-2xl p-8 border border-blue-200/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                  <div className="flex items-center justify-between mb-4">
                    <Target className="h-8 w-8 text-blue-600" />
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                      ))}
                    </div>
                  </div>
                  <h3 className="text-4xl font-bold text-blue-600 mb-2">95%</h3>
                  <p className="text-muted-foreground font-medium">Detection Accuracy</p>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-gradient-to-br from-purple-600/10 to-pink-600/10 backdrop-blur-sm rounded-2xl p-8 border border-purple-200/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                  <div className="flex items-center justify-between mb-4">
                    <Zap className="h-8 w-8 text-purple-600" />
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  <h3 className="text-4xl font-bold text-purple-600 mb-2">0.5s</h3>
                  <p className="text-muted-foreground font-medium">Processing Time</p>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-gradient-to-br from-green-600/10 to-blue-600/10 backdrop-blur-sm rounded-2xl p-8 border border-green-200/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                  <div className="flex items-center justify-between mb-4">
                    <Globe className="h-8 w-8 text-green-600" />
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-600 font-medium">LIVE</span>
                    </div>
                  </div>
                  <h3 className="text-4xl font-bold text-green-600 mb-2">24/7</h3>
                  <p className="text-muted-foreground font-medium">Real-time Analysis</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Premium Problem Section */}
      <section className="py-24 lg:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-background"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-200/30 rounded-full px-4 py-2 mb-6">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium text-red-600">Critical Challenge</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
                  Understanding the
                  <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent"> Fake News Crisis</span>
                </h2>
              </div>
              
              <p className="text-lg lg:text-xl text-muted-foreground mb-10 leading-relaxed">
                Fake news has become a critical challenge in today's digital age, particularly following events like the Southport attack. This project addresses the urgent need for automated verification systems that can keep pace with the rapid spread of misinformation.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 bg-red-500/5 border border-red-200/20 rounded-xl">
                  <AlertTriangle className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Manipulated Content & Deep Fakes</h4>
                    <p className="text-muted-foreground text-sm">Advanced AI-generated content that's increasingly difficult to detect</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-yellow-500/5 border border-yellow-200/20 rounded-xl">
                  <Zap className="h-6 w-6 text-yellow-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Rapid Viral Spread</h4>
                    <p className="text-muted-foreground text-sm">Misinformation spreads faster than fact-checking can keep up</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-blue-500/5 border border-blue-200/20 rounded-xl">
                  <Users className="h-6 w-6 text-blue-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Social & Political Impact</h4>
                    <p className="text-muted-foreground text-sm">Real-world consequences affecting communities and democracy</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-green-500/5 border border-green-200/20 rounded-xl">
                  <Globe className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Global Scale Challenge</h4>
                    <p className="text-muted-foreground text-sm">Cross-border misinformation affecting billions worldwide</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl blur-2xl"></div>
                <div className="relative bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10 backdrop-blur-sm rounded-3xl p-8 border border-blue-200/30 shadow-2xl">
                  <div className="aspect-square bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] animate-pulse"></div>
                    <Brain className="h-24 w-24 text-blue-600 relative z-10" />
                  </div>
                  
                  {/* Floating Elements */}
                  <div className="absolute -top-4 -right-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full p-3 shadow-lg">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full p-3 shadow-lg">
                    <Search className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Premium Technology Section */}
      <section className="py-24 lg:py-32 bg-gradient-to-b from-background to-muted/30 relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f620_1px,transparent_1px),linear-gradient(to_bottom,#3b82f620_1px,transparent_1px)] bg-[size:24px_24px] opacity-10"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-200/30 rounded-full px-6 py-3 mb-8">
              <Brain className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Advanced Technology Stack</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              My <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI Solution</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Leveraging cutting-edge AI technologies to create a comprehensive news verification system
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-br from-blue-600/10 to-purple-600/10 backdrop-blur-sm rounded-2xl p-8 border border-blue-200/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Advanced AI Model</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Powered by GPT-4o-search-preview with search preview capabilities for real-time fact-checking and comprehensive news analysis with unprecedented accuracy.
                </p>
                <div className="mt-6 flex items-center gap-2 text-blue-600 font-medium">
                  <span>Learn More</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-br from-purple-600/10 to-pink-600/10 backdrop-blur-sm rounded-2xl p-8 border border-purple-200/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Search className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">GPT-4 Search Preview</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Utilizing GPT-4's advanced search preview capabilities to verify news against reliable sources in real-time with comprehensive fact-checking.
                </p>
                <div className="mt-6 flex items-center gap-2 text-purple-600 font-medium">
                  <span>Learn More</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-br from-green-600/10 to-blue-600/10 backdrop-blur-sm rounded-2xl p-8 border border-green-200/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <div className="bg-gradient-to-br from-green-600 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Cloud className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Firebase Integration</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Real-time data storage, user authentication, and secure chat history management using Firebase's cloud infrastructure for seamless performance.
                </p>
                <div className="mt-6 flex items-center gap-2 text-green-600 font-medium">
                  <span>Learn More</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Premium Impact Section */}
      <section className="py-24 lg:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-background"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600/10 to-blue-600/10 border border-green-200/30 rounded-full px-6 py-3 mb-8">
              <Target className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-600">Real-World Impact</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Making a <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Difference</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our AI-powered solution is creating positive change across multiple dimensions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="group relative text-center"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-br from-blue-600/10 to-purple-600/10 backdrop-blur-sm rounded-2xl p-8 border border-blue-200/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Protection</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Safeguarding users from misleading information and propaganda with advanced AI detection capabilities.
                </p>
                <div className="mt-6 flex items-center justify-center gap-2 text-blue-600 font-medium">
                  <CheckCircle className="h-5 w-5" />
                  <span>Active Protection</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="group relative text-center"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-br from-purple-600/10 to-pink-600/10 backdrop-blur-sm rounded-2xl p-8 border border-purple-200/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Brain className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Education</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Promoting critical thinking and digital literacy through interactive AI-powered learning experiences.
                </p>
                <div className="mt-6 flex items-center justify-center gap-2 text-purple-600 font-medium">
                  <CheckCircle className="h-5 w-5" />
                  <span>Smart Learning</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="group relative text-center"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-br from-green-600/10 to-blue-600/10 backdrop-blur-sm rounded-2xl p-8 border border-green-200/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <div className="bg-gradient-to-br from-green-600 to-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Globe className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Global Reach</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Fighting misinformation across borders and platforms with scalable AI technology.
                </p>
                <div className="mt-6 flex items-center justify-center gap-2 text-green-600 font-medium">
                  <CheckCircle className="h-5 w-5" />
                  <span>Worldwide Impact</span>
                </div>
              </div>
            </motion.div>
                     </div>
         </div>
       </section>

       {/* About Creator Section */}
       <section className="py-24 lg:py-32 bg-gradient-to-b from-background to-muted/30 relative">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f620_1px,transparent_1px),linear-gradient(to_bottom,#3b82f620_1px,transparent_1px)] bg-[size:24px_24px] opacity-10"></div>
         <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
             viewport={{ once: true }}
             className="text-center mb-20"
           >
             <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-200/30 rounded-full px-6 py-3 mb-8">
               <Users className="h-5 w-5 text-blue-600" />
               <span className="text-sm font-medium text-blue-600">Meet the Creator</span>
             </div>
             <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
               About <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Preetham Devulapally</span>
             </h2>
             <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
               The innovative mind behind FakeVerifier, dedicated to combating misinformation through AI technology
             </p>
           </motion.div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
             <motion.div
               initial={{ opacity: 0, x: -30 }}
               whileInView={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8 }}
               viewport={{ once: true }}
               className="relative"
             >
               <div className="relative">
                 <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl blur-2xl"></div>
                 <div className="relative bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10 backdrop-blur-sm rounded-3xl p-8 border border-blue-200/30 shadow-2xl">
                   <div className="aspect-square bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center relative overflow-hidden">
                     <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] animate-pulse"></div>
                                           <div className="relative z-10 text-center">
                        <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg overflow-hidden border-4 border-white">
                          <img 
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/407336793_6833926710054844_1424313180351365942_n.jpg-rQyDcOudtZtxVEZqeJi8Mc7L8a1owU.jpeg"
                            alt="Preetham Devulapally" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="text-2xl font-bold text-foreground mb-2">Preetham Devulapally</h3>
                        <p className="text-muted-foreground">Final Year Student</p>
                        <p className="text-blue-600 font-medium">University of Westminster</p>
                      </div>
                   </div>
                   
                   {/* Floating Elements */}
                   <div className="absolute -top-4 -right-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full p-3 shadow-lg">
                     <Brain className="h-6 w-6 text-white" />
                   </div>
                   <div className="absolute -bottom-4 -left-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full p-3 shadow-lg">
                     <Award className="h-6 w-6 text-white" />
                   </div>
                 </div>
               </div>
             </motion.div>

             <motion.div
               initial={{ opacity: 0, x: 30 }}
               whileInView={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8 }}
               viewport={{ once: true }}
             >
               <div className="space-y-8">
                 <div>
                   <h3 className="text-2xl font-bold text-foreground mb-4">The Vision</h3>
                   <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                     As a final year student at the University of Westminster, I recognized the growing threat of misinformation in our digital age. The Southport attack and similar events highlighted the urgent need for automated verification systems that could keep pace with the rapid spread of fake news.
                   </p>
                   <p className="text-lg text-muted-foreground leading-relaxed">
                     This project represents my commitment to leveraging cutting-edge AI technology to create a solution that not only detects misinformation but also educates users about digital literacy and critical thinking.
                   </p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-xl p-6 border border-blue-200/30">
                     <div className="flex items-center gap-3 mb-3">
                       <div className="bg-blue-600/20 w-10 h-10 rounded-lg flex items-center justify-center">
                         <Brain className="h-5 w-5 text-blue-600" />
                       </div>
                       <h4 className="font-semibold text-foreground">AI & Machine Learning</h4>
                     </div>
                     <p className="text-muted-foreground text-sm">
                       Specialized in artificial intelligence and machine learning technologies
                     </p>
                   </div>

                   <div className="bg-gradient-to-br from-purple-600/10 to-pink-600/10 rounded-xl p-6 border border-purple-200/30">
                     <div className="flex items-center gap-3 mb-3">
                       <div className="bg-purple-600/20 w-10 h-10 rounded-lg flex items-center justify-center">
                         <Shield className="h-5 w-5 text-purple-600" />
                       </div>
                       <h4 className="font-semibold text-foreground">Cybersecurity</h4>
                     </div>
                     <p className="text-muted-foreground text-sm">
                       Focused on digital security and information verification systems
                     </p>
                   </div>

                   <div className="bg-gradient-to-br from-green-600/10 to-blue-600/10 rounded-xl p-6 border border-green-200/30">
                     <div className="flex items-center gap-3 mb-3">
                       <div className="bg-green-600/20 w-10 h-10 rounded-lg flex items-center justify-center">
                         <Globe className="h-5 w-5 text-green-600" />
                       </div>
                       <h4 className="font-semibold text-foreground">Social Impact</h4>
                     </div>
                     <p className="text-muted-foreground text-sm">
                       Committed to creating technology that benefits society
                     </p>
                   </div>

                   <div className="bg-gradient-to-br from-yellow-600/10 to-orange-600/10 rounded-xl p-6 border border-yellow-200/30">
                     <div className="flex items-center gap-3 mb-3">
                       <div className="bg-yellow-600/20 w-10 h-10 rounded-lg flex items-center justify-center">
                         <Award className="h-5 w-5 text-yellow-600" />
                       </div>
                       <h4 className="font-semibold text-foreground">Innovation</h4>
                     </div>
                     <p className="text-muted-foreground text-sm">
                       Passionate about developing innovative solutions to real-world problems
                     </p>
                   </div>
                 </div>

                 <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-xl p-6 border border-blue-200/30">
                   <div className="flex items-center gap-3 mb-4">
                     <Target className="h-6 w-6 text-blue-600" />
                     <h4 className="font-semibold text-foreground">Contact Information</h4>
                   </div>
                   <div className="space-y-2 text-muted-foreground">
                                           <p><span className="font-medium text-foreground">Email:</span> PreethamDevulapally@gmail.com</p>
                     <p><span className="font-medium text-foreground">Institution:</span> University of Westminster</p>
                     <p><span className="font-medium text-foreground">Project:</span> Final Year Dissertation</p>
                   </div>
                 </div>
               </div>
             </motion.div>
           </div>
         </div>
       </section>
     </div>
   );
 }
