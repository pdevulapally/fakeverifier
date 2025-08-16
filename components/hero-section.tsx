"use client"
import { motion } from "framer-motion"
import { ArrowRight, ChevronRight, Play, Sparkles, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useState } from "react"
import { DemoModal } from "./demo-modal"

export function HeroSection() {
  const { user } = useAuth();
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="bg-background relative w-full overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-blue-500/10 to-background"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/5 via-transparent to-blue-600/10"></div>
        <div className="absolute top-0 left-1/2 -z-10 h-[1200px] w-[1200px] -translate-x-1/2 rounded-full bg-gradient-radial from-blue-500/20 via-blue-400/10 to-transparent blur-3xl"></div>
        <div className="absolute bottom-0 right-0 -z-10 h-[800px] w-[800px] rounded-full bg-gradient-radial from-blue-600/15 via-blue-500/5 to-transparent blur-3xl"></div>
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f620_1px,transparent_1px),linear-gradient(to_bottom,#3b82f620_1px,transparent_1px)] bg-[size:16px_16px] opacity-20"></div>

      <div className="relative z-10 container mx-auto px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-6 flex justify-center"
          >
            <div className="border-blue-200/30 bg-background/80 inline-flex items-center rounded-full border px-3 py-1 text-sm backdrop-blur-sm">
              <span className="bg-blue-600 mr-2 rounded-full px-2 py-0.5 text-xs font-semibold text-white flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                New
              </span>
              <span className="text-muted-foreground">Advanced AI-powered news verification technology</span>
              <ChevronRight className="text-muted-foreground ml-1 h-4 w-4" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gradient-to-br from-blue-600 via-foreground to-blue-800 bg-clip-text text-center text-4xl tracking-tighter text-balance text-transparent sm:text-5xl md:text-6xl lg:text-7xl font-sans"
          >
            Stop Misinformation Before It Spreads
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground mx-auto mt-6 max-w-2xl text-center text-lg font-sans"
          >
            Harness cutting-edge AI to verify news credibility in real-time. Get instant credibility scores, source
            verification, and protect yourself from misinformation with our advanced verification technology.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link href={user ? "/verify" : "/Signup"}>
              <Button
                size="lg"
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 text-white shadow-lg shadow-blue-600/25 transition-all duration-300 hover:shadow-xl hover:shadow-blue-600/40 hover:scale-105 font-sans border-0"
              >
                <span className="relative z-10 flex items-center font-semibold text-base">
                  <Shield className="mr-2 h-5 w-5" />
                  {user ? "Start Verifying Now" : "Get Started Free"}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Button>
            </Link>

            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowDemo(true)}
              className="group relative overflow-hidden rounded-full border-2 border-blue-200 bg-white px-8 py-4 shadow-lg shadow-blue-600/10 transition-all duration-300 hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-xl hover:shadow-blue-600/20 hover:scale-105 font-sans"
            >
              <span className="flex items-center gap-2 font-semibold text-blue-700">
                <Play className="h-4 w-4" />
                Watch Demo
              </span>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.5,
              type: "spring",
              stiffness: 50,
            }}
            className="relative mx-auto mt-16 max-w-4xl"
          >
            <div className="border-blue-200/40 bg-background/50 overflow-hidden rounded-xl border shadow-xl backdrop-blur-sm">
              <div className="border-blue-200/40 bg-blue-50/30 flex h-10 items-center border-b px-4">
                <div className="flex space-x-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
                <div className="bg-background/50 text-muted-foreground mx-auto flex items-center rounded-md px-3 py-1 text-xs">
                  https://fakeverifier.com/verify
                </div>
              </div>
              <div className="relative">
                <img src="/news-verification-dashboard.png" alt="FakeVerifier Dashboard Preview" className="w-full" />
                <div className="from-background absolute inset-0 bg-gradient-to-t to-transparent opacity-0"></div>
              </div>
            </div>

            <div className="border-blue-200/40 bg-background/80 absolute -top-6 -right-6 h-12 w-12 rounded-lg border p-3 shadow-lg backdrop-blur-md">
              <div className="bg-blue-500/20 h-full w-full rounded-md"></div>
            </div>
            <div className="border-blue-200/40 bg-background/80 absolute -bottom-4 -left-4 h-8 w-8 rounded-full border shadow-lg backdrop-blur-md"></div>
            <div className="border-blue-200/40 bg-background/80 absolute right-12 -bottom-6 h-10 w-10 rounded-lg border p-2 shadow-lg backdrop-blur-md">
              <div className="h-full w-full rounded-md bg-blue-500/20"></div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Demo Modal */}
      <DemoModal isOpen={showDemo} onClose={() => setShowDemo(false)} />
    </div>
  )
}
