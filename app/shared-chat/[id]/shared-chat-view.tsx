"use client"

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Bot, 
  User, 
  Clock, 
  Calendar, 
  MessageSquare, 
  Share2, 
  Copy, 
  Check,
  ExternalLink,
  ArrowLeft
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  analysis?: any
  aiAnalysis?: any
}

interface ChatData {
  id: string
  messages: Message[]
  title: string
  createdAt: string
  sharedAt: string
  messageCount: number
  userMessageCount: number
  assistantMessageCount: number
  expiresAt?: string
  metadata?: any
}

interface SharedChatViewProps {
  chatData: ChatData
}

export function SharedChatView({ chatData }: SharedChatViewProps) {
  const [copied, setCopied] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    // Convert timestamp strings to Date objects
    const processedMessages = chatData.messages.map(msg => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    }))
    setMessages(processedMessages)
  }, [chatData.messages])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      toast.success("Link copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Error copying link:', error)
      toast.error("Failed to copy link. Please try again.")
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: chatData.title,
          text: `Check out this conversation: ${chatData.title}`,
          url: window.location.href
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      handleCopyLink()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const isExpired = chatData.expiresAt && new Date(chatData.expiresAt) < new Date()

  if (isExpired) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md p-8 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h1 className="text-xl font-semibold mb-2">Link Expired</h1>
          <p className="text-gray-600 mb-4">
            This shared conversation has expired and is no longer available.
          </p>
          <Link href="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go to FakeVerifier
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to FakeVerifier
                </Button>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="font-semibold text-gray-900">{chatData.title}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    {chatData.messageCount} messages
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(chatData.sharedAt)}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                Read-only
              </Badge>
              <Button
                onClick={handleShare}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Share2 className="w-4 h-4" />
                )}
                {copied ? 'Copied!' : 'Share'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex gap-4 ${
                message.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.type === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}

              <div className={`max-w-3xl ${
                message.type === 'user' ? 'order-first' : ''
              }`}>
                <Card className={`p-4 ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white'
                }`}>
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-wrap break-words">
                      {message.content}
                    </div>
                  </div>

                  {/* AI Analysis Display */}
                  {message.aiAnalysis && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <h4 className="font-medium text-blue-900 text-sm">AI Analysis</h4>
                      </div>
                      <div className="text-sm text-blue-800">
                        <pre className="whitespace-pre-wrap text-xs">
                          {message.aiAnalysis.analysis}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Analysis Results */}
                  {message.analysis && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                        <h4 className="font-medium text-gray-900 text-sm">Verification Results</h4>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">Verdict:</span>
                          <Badge 
                            variant={
                              message.analysis.verdict === "real" || message.analysis.verdict === "likely-real" 
                                ? "default" 
                                : message.analysis.verdict === "fake" || message.analysis.verdict === "likely-fake"
                                ? "destructive"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {message.analysis.verdict?.toUpperCase() || 'UNKNOWN'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">Confidence:</span>
                          <span className="font-medium">{message.analysis.credibilityScore || 0}%</span>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>

                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  {formatTime(message.timestamp)}
                </div>
              </div>

              {message.type === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t text-center">
          <div className="text-sm text-gray-500 mb-4">
            This is a shared conversation from FakeVerifier
          </div>
          <div className="flex items-center justify-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                Try FakeVerifier
              </Button>
            </Link>
            <Button
              onClick={handleCopyLink}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {copied ? 'Copied!' : 'Copy Link'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
