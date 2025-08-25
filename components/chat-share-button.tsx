"use client"

import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Share2, 
  Copy, 
  Check, 
  X,
  Link,
  ExternalLink,
  Calendar,
  Eye,
  Lock
} from "lucide-react"
import { toast } from "sonner"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  analysis?: any
  aiAnalysis?: any
}

interface ChatShareButtonProps {
  messages: Message[]
  conversationTitle?: string
  className?: string
  onShareCreated?: (shareUrl: string) => void
}

export function ChatShareButton({ 
  messages, 
  conversationTitle = "Chat Conversation",
  className = "",
  onShareCreated 
}: ChatShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [shareUrl, setShareUrl] = useState("")
  const [copied, setCopied] = useState(false)
  const [shareId, setShareId] = useState("")
  const [isMounted, setIsMounted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Set mounted state
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Auto-focus input when modal opens and handle escape key
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll
      document.body.style.overflow = 'hidden'
      
      if (inputRef.current) {
        setTimeout(() => inputRef.current?.focus(), 100)
      }
      
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleClose()
        }
      }
      
      document.addEventListener('keydown', handleEscape)
      return () => {
        document.removeEventListener('keydown', handleEscape)
        document.body.style.overflow = 'unset'
      }
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleCreateShare = async () => {
    if (messages.length === 0) {
      toast.error("No messages to share")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/share-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          title: conversationTitle,
          createdAt: new Date().toISOString()
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create share')
      }

      const data = await response.json()
      const url = data.url
      
      setShareUrl(url)
      setShareId(data.id)
      
      toast.success("Share link created successfully!")
      
      if (onShareCreated) {
        onShareCreated(url)
      }
    } catch (error) {
      console.error('Error creating share:', error)
      toast.error("Failed to create share link. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyLink = async () => {
    if (!shareUrl) return
    
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success("Link copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Error copying link:', error)
      toast.error("Failed to copy link. Please try again.")
    }
  }

  const handleOpenShare = () => {
    if (shareUrl) {
      window.open(shareUrl, '_blank')
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setShareUrl("")
    setShareId("")
    setCopied(false)
  }

  const messageCount = messages.length
  const hasUserMessages = messages.some(m => m.type === 'user')
  const hasAssistantMessages = messages.some(m => m.type === 'assistant')

  return (
    <div className={`relative ${className}`}>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="flex items-center gap-2 whitespace-nowrap"
        disabled={messageCount === 0}
      >
        <Share2 className="w-4 h-4" />
        <span className="hidden sm:inline">Share</span>
        <span className="sm:hidden">Share</span>
      </Button>

      {isOpen && isMounted && createPortal(
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
            onClick={handleClose}
            style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              zIndex: 999999 
            }}
          />
          
          {/* Share Modal */}
          <div 
            className="fixed inset-0 flex items-center justify-center p-4"
            style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              zIndex: 1000000 
            }}
          >
            <Card className="w-full max-w-md p-6 shadow-2xl border border-gray-200 bg-white">
              <div className="flex items-center justify-between mb-6">
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold text-gray-900">Share public link to chat</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="h-8 w-8 p-0 ml-2 flex-shrink-0 hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Warning Message */}
              <div className="mb-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0">ℹ️</div>
                                     <div className="text-sm text-blue-800">
                     <p className="mb-1">This conversation may include personal information. Take a moment to check the content before sharing the link.</p>
                     <p className="text-xs text-blue-700">Your name, custom instructions, and any messages you add after sharing stay public.</p>
                   </div>
                </div>
              </div>

              {/* Share URL Display */}
              {shareUrl ? (
                <div className="space-y-4">
                  <div>
                    <Input
                      ref={inputRef}
                      value={shareUrl}
                      readOnly
                      className="w-full text-sm bg-gray-50 border-gray-300"
                      placeholder="https://fakeverifier.com/shared-chat/..."
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={handleCopyLink}
                      variant="outline"
                      className="flex-1"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 mr-2 text-green-600" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy link
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleClose}
                      className="flex-1"
                    >
                      Done
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <Share2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600">
                      Create a public link that anyone can use to view this conversation
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={handleCreateShare}
                      className="flex-1"
                      disabled={isLoading || messageCount === 0}
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Link className="w-4 h-4 mr-2" />
                          Create link
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleClose}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </>,
        document.body
      )}
    </div>
  )
}
