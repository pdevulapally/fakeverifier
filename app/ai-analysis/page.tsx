"use client";

import { Header } from "@/components/header";
import AISearchPreview from "@/components/ai-search-preview";
import ProtectedRoute from "@/components/protected-route";
import { TokenSystem } from "@/components/token-system";

export default function AIAnalysisPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <main className="container mx-auto px-4 py-8 pt-24">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              AI Content Analysis
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Analyze news articles, social media posts, and other content with advanced AI-powered fact-checking and credibility assessment.
            </p>
          </div>
          {/* Token System */}
          <div className="max-w-3xl mx-auto mb-8">
            <TokenSystem onUpgradeClick={() => (window.location.href = "/pricing")} />
          </div>
          <AISearchPreview />
        </main>
      </div>
    </ProtectedRoute>
  );
}
