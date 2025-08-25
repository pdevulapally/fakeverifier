"use client"

import React from 'react';
import Head from 'next/head';

interface SEOOptimizerProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  structuredData?: any;
  canonical?: string;
}

export function SEOOptimizer({
  title = "FakeVerifier - AI-Powered News Verification & Fact-Checking Platform",
  description = "Advanced AI-powered platform for real-time news verification, fact-checking, and credibility assessment. Detect fake news, verify sources, and get instant credibility scores using GPT-4 technology.",
  keywords = [
    "fake news detector",
    "news verification",
    "fact checking",
    "AI news analysis",
    "credibility checker",
    "news authenticity",
    "misinformation detection",
    "truth verification",
    "news credibility",
    "AI fact checker"
  ],
  image = "/og-image.png",
  url = "https://www.fakeverifier.co.uk",
  type = "website",
  structuredData,
  canonical
}: SEOOptimizerProps) {
  
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "FakeVerifier",
    "description": "AI-powered news verification and fact-checking platform",
    "url": "https://www.fakeverifier.co.uk",
    "applicationCategory": "NewsApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "author": {
      "@type": "Person",
      "name": "Preetham Devulapally"
    },
    "creator": {
      "@type": "Person",
      "name": "Preetham Devulapally"
    },
    "featureList": [
      "AI-powered news verification",
      "Real-time fact checking",
      "Credibility scoring",
      "Source verification",
      "Misinformation detection"
    ]
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <>
      {/* Meta Tags */}
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content="Preetham Devulapally" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="FakeVerifier" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content="@pdevulapally" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#2563eb" />
      <meta name="msapplication-TileColor" content="#2563eb" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="FakeVerifier" />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(finalStructuredData)
        }}
      />
      
      {/* Additional Structured Data for Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "FakeVerifier",
            "url": "https://www.fakeverifier.co.uk",
            "logo": "https://www.fakeverifier.co.uk/Images/Logo de FakeVerifier.png",
            "description": "AI-powered news verification and fact-checking platform",
            "foundingDate": "2024",
            "founder": {
              "@type": "Person",
              "name": "Preetham Devulapally"
            },
            "sameAs": [
              "https://github.com/pdevulapally/fakeverifier"
            ]
          })
        }}
      />
    </>
  );
}

// SEO-optimized semantic wrapper components
export function SEOHeader({ children, level = 1, className = "" }: { children: React.ReactNode; level?: 1 | 2 | 3 | 4 | 5 | 6; className?: string }) {
  const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;
  return <Tag className={className}>{children}</Tag>;
}

export function SEOArticle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <article className={className}>{children}</article>;
}

export function SEOSection({ children, className = "", ariaLabel }: { children: React.ReactNode; className?: string; ariaLabel?: string }) {
  return <section className={className} aria-label={ariaLabel}>{children}</section>;
}

export function SEONav({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <nav className={className}>{children}</nav>;
}

export function SEOFooter({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <footer className={className}>{children}</footer>;
}

export function SEOMain({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <main className={className}>{children}</main>;
}
