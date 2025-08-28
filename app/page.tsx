import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "FakeVerifier - AI-Powered News Verification & Fact-Checking Platform",
  description: "Advanced AI-powered platform for real-time news verification, fact-checking, and credibility assessment. Detect fake news, verify sources, and get instant credibility scores using GPT-4 technology.",
  alternates: {
    canonical: 'https://www.fakeverifier.co.uk/',
  },
  openGraph: {
    url: 'https://www.fakeverifier.co.uk/',
    title: 'FakeVerifier - AI-Powered News Verification & Fact-Checking Platform',
    description: 'Advanced AI-powered platform for real-time news verification, fact-checking, and credibility assessment.',
  },
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
