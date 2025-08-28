import type React from "react"
import type { Metadata } from "next"
import { Work_Sans, Open_Sans } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { CookieBanner } from "@/components/cookie-banner"

const workSans = Work_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-work-sans",
})

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
})

export const metadata: Metadata = {
  title: {
    default: "FakeVerifier - AI-Powered News Verification & Fact-Checking Platform",
    template: "%s | FakeVerifier - AI News Verification"
  },
  description: "Advanced AI-powered platform for real-time news verification, fact-checking, and credibility assessment. Detect fake news, verify sources, and get instant credibility scores using GPT-4 technology.",
  keywords: [
    "fake news detector",
    "news verification",
    "fact checking",
    "AI news analysis",
    "credibility checker",
    "news authenticity",
    "misinformation detection",
    "truth verification",
    "news credibility",
    "AI fact checker",
    "real-time news verification",
    "news source verification",
    "disinformation detection",
    "news accuracy checker",
    "AI-powered verification",
    "news reliability",
    "truth detector",
    "news fact verification",
    "AI news credibility",
    "news verification tool",
    "fake news checker",
    "news authenticity verification",
    "credibility analysis",
    "news verification platform",
    "AI news verification",
    "fact checking tool",
    "news verification service",
    "misinformation checker",
    "news truth detector",
    "AI-powered fact checking"
  ],
  authors: [{ name: "Preetham Devulapally" }],
  creator: "Preetham Devulapally",
  publisher: "FakeVerifier",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.fakeverifier.co.uk'),
  alternates: {
    canonical: 'https://www.fakeverifier.co.uk/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.fakeverifier.co.uk',
    title: 'FakeVerifier - AI-Powered News Verification & Fact-Checking Platform',
    description: 'Advanced AI-powered platform for real-time news verification, fact-checking, and credibility assessment. Detect fake news, verify sources, and get instant credibility scores.',
    siteName: 'FakeVerifier',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'FakeVerifier - AI News Verification Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FakeVerifier - AI-Powered News Verification & Fact-Checking Platform',
    description: 'Advanced AI-powered platform for real-time news verification, fact-checking, and credibility assessment.',
    images: ['/og-image.png'],
    creator: '@pdevulapally',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  category: 'Technology',
  classification: 'News Verification Platform',
  generator: "Next.js",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${workSans.variable} ${openSans.variable} antialiased`}>
             <head>
         {/* Favicons */}
         <link rel="icon" href="/favicon.ico" />
         <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
         <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
         <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
         <link rel="manifest" href="/site.webmanifest" />
         
         {/* Theme Colors */}
         <meta name="theme-color" content="#2563eb" />
         <meta name="msapplication-TileColor" content="#2563eb" />
         <meta name="msapplication-config" content="/browserconfig.xml" />
         
         {/* Additional Favicon Formats */}
         <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#2563eb" />
         <link rel="shortcut icon" href="/favicon.ico" />
         
         {/* Additional SEO Meta Tags */}
         <meta name="google-site-verification" content="nwmeBZx5vJ5quPUWRA1j8NvCkrII6Ai6WSjPExeUwsE" />
         <meta name="msvalidate.01" content="66FF881AD1C74DCE9085B91C0D19AB59" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
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
            })
          }}
        />
      </head>
      <body>
        <AuthProvider>
          {children}
          <CookieBanner />
        </AuthProvider>
      </body>
    </html>
  )
}
