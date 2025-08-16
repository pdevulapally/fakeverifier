"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Send, LinkIcon, Video } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface EnhancedChatInputProps {
  onSendMessage: (message: string, files: File[], detectedContent: DetectedContent) => void
  disabled?: boolean
  placeholder?: string
}

interface DetectedContent {
  links: string[]
  videoLinks: string[]
  images: File[]
  documents: File[]
}

export function EnhancedChatInput({ onSendMessage, disabled, placeholder }: EnhancedChatInputProps) {
  const [message, setMessage] = useState("")
  const [detectedContent, setDetectedContent] = useState<DetectedContent>({
    links: [],
    videoLinks: [],
    images: [],
    documents: [],
  })

  // Detect content types in message
  const detectContent = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const videoRegex = /(youtube\.com|youtu\.be|vimeo\.com|tiktok\.com)/i

    const urls = text.match(urlRegex) || []
    const videoLinks = urls.filter((url) => videoRegex.test(url))
    const regularLinks = urls.filter((url) => !videoRegex.test(url))

    setDetectedContent((prev) => ({
      ...prev,
      links: regularLinks,
      videoLinks: videoLinks,
    }))
  }

  const handleMessageChange = (value: string) => {
    setMessage(value)
    detectContent(value)
  }

  const handleSend = () => {
    if (!message.trim() || disabled) return

    onSendMessage(message, [], detectedContent)
    setMessage("")
    setDetectedContent({
      links: [],
      videoLinks: [],
      images: [],
      documents: [],
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const getContentTypeIcon = (type: keyof DetectedContent) => {
    switch (type) {
      case "links":
        return <LinkIcon className="w-3 h-3 sm:w-4 sm:h-4" />
      case "videoLinks":
        return <Video className="w-3 h-3 sm:w-4 sm:h-4" />
      default:
        return <LinkIcon className="w-3 h-3 sm:w-4 sm:h-4" />
    }
  }

  const getContentCount = (type: keyof DetectedContent) => {
    const content = detectedContent[type]
    return Array.isArray(content) ? content.length : 0
  }

  return (
    <div className="space-y-2 sm:space-y-3">
      {/* Content Detection Indicators */}
      <AnimatePresence>
        {(detectedContent.links.length > 0 || detectedContent.videoLinks.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-wrap gap-1 sm:gap-2"
          >
            {(["links", "videoLinks"] as const).map((type) => {
              const count = getContentCount(type)
              if (count === 0) return null

              return (
                <motion.div
                  key={type}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-1"
                >
                  <Badge variant="secondary" className="flex items-center gap-1 text-xs sm:text-sm px-2 py-1">
                    <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 0.5, repeat: 2 }}>
                      {getContentTypeIcon(type)}
                    </motion.div>
                    {count} {type === "videoLinks" ? "videos" : "links"}
                  </Badge>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="relative border-2 border-dashed border-gray-200 rounded-xl bg-white shadow-sm hover:border-gray-300 transition-colors">
        <div className="flex items-end gap-2 p-3 sm:p-4">
          <div className="flex-1 min-w-0">
            <Textarea
              value={message}
              onChange={(e) => handleMessageChange(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder || "Paste content or share URLs to verify..."}
              className="min-h-[60px] sm:min-h-[80px] resize-none border-0 focus-visible:ring-0 bg-transparent text-sm sm:text-base max-h-[200px] placeholder:text-gray-400"
              disabled={disabled}
            />
          </div>

          <Button
            onClick={handleSend}
            disabled={disabled || !message.trim()}
            size="sm"
            className="h-10 w-10 sm:h-12 sm:w-12 p-0 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex-shrink-0"
          >
            <motion.div 
              whileHover={{ scale: 1.1 }} 
              whileTap={{ scale: 0.9 }}
              className="flex items-center justify-center"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </motion.div>
          </Button>
        </div>
      </div>


    </div>
  )
}
