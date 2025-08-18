"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Share2, 
  Copy, 
  Check, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Mail, 
  MessageCircle,
  Link,
  X
} from "lucide-react"
import { toast } from "sonner"

interface ShareButtonProps {
  verificationData?: {
    title: string
    verdict: string
    score: number
    content: string
    timestamp: Date
  }
  className?: string
}

export function ShareButton({ verificationData, className = "" }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareText = verificationData 
    ? `Check out this verification result: "${verificationData.title}" - ${verificationData.verdict.toUpperCase()} (${verificationData.score}% confidence) via FakeVerifier`
    : "Verify news credibility with AI-powered analysis on FakeVerifier"

  const shareData = {
    title: "FakeVerifier - AI News Verification",
    text: shareText,
    url: shareUrl
  }

  const canNativeShare = typeof window !== 'undefined' && typeof (navigator as any).share === 'function'

  const handleCreateShareLink = async (): Promise<string> => {
    try {
      const res = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verificationData })
      })
      if (!res.ok) throw new Error('Failed to create share link')
      const data = await res.json()
      return data.url as string
    } catch (e) {
      console.error(e)
      toast.error('Could not create share link')
      return shareUrl
    }
  }

  const handleShare = async (platform?: string) => {
    try {
      const urlToShare = await handleCreateShareLink()
      const data = { ...shareData, url: urlToShare }

      if (platform === 'native' && typeof (navigator as any).share === 'function') {
        await (navigator as any).share(data)
        return
      }

      let url = ''
      switch (platform) {
        case 'twitter':
          url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(urlToShare)}`
          break
        case 'facebook':
          url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlToShare)}`
          break
        case 'linkedin':
          url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(urlToShare)}`
          break
        case 'email':
          url = `mailto:?subject=${encodeURIComponent(data.title)}&body=${encodeURIComponent(shareText + '\n\n' + urlToShare)}`
          break
        case 'sms':
          url = `sms:?body=${encodeURIComponent(shareText + ' ' + urlToShare)}`
          break
        default:
          break
      }

      if (url) {
        window.open(url, '_blank', 'width=600,height=400')
      }
    } catch (error) {
      console.error('Error sharing:', error)
      toast.error('Failed to share. Please try again.')
    }
  }

  const handleCopyLink = async () => {
    try {
      const urlToShare = await handleCreateShareLink()
      await navigator.clipboard.writeText(urlToShare)
      setCopied(true)
      toast.success('Link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Error copying link:', error)
      toast.error('Failed to copy link. Please try again.')
    }
  }

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      toast.success('Text copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Error copying text:', error)
      toast.error('Failed to copy text. Please try again.')
    }
  }

  return (
    <div className={`relative ${className}`}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <Share2 className="w-4 h-4" />
        Share
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Share Modal */}
          <Card className="absolute right-0 top-full mt-2 w-80 p-4 z-50 shadow-lg border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Share Verification</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3">
              {/* Native Share */}
              {canNativeShare && (
                <Button
                  onClick={() => handleShare('native')}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share via...
                </Button>
              )}

              {/* Social Platforms */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => handleShare('twitter')}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Twitter className="w-4 h-4" />
                  Twitter
                </Button>
                <Button
                  onClick={() => handleShare('facebook')}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Facebook className="w-4 h-4" />
                  Facebook
                </Button>
                <Button
                  onClick={() => handleShare('linkedin')}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </Button>
                <Button
                  onClick={() => handleShare('email')}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Email
                </Button>
              </div>

              {/* Copy Options */}
              <div className="space-y-2">
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Link className="w-4 h-4 mr-2" />
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2 text-green-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Link
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={handleCopyText}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Copy Text
                </Button>
              </div>

              {/* Verification Preview */}
              {verificationData && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Preview</span>
                    <Badge 
                      variant={
                        verificationData.verdict === "real" || verificationData.verdict === "likely-real" 
                          ? "default" 
                          : verificationData.verdict === "fake" || verificationData.verdict === "likely-fake"
                          ? "destructive"
                          : "secondary"
                      }
                      className="text-xs"
                    >
                      {verificationData.verdict.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {verificationData.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {verificationData.score}% confidence
                  </p>
                </div>
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
