"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Brain,
  ChevronDown,
  ChevronUp,
  Link,
  MapPin,
  TrendingUp,
  Eye,
  Network,
  BarChart3,
  Calendar,
  Shield,
  Languages,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface VerificationResult {
  credibilityScore: number
  sources: string[]
  verdict: "real" | "likely-real" | "likely-fake" | "fake" | "questionable" | "ai-generated"
  reasoning: string[]
  evidenceMap?: {
    sources: Array<{
      name: string
      trustRating: number
      connections: string[]
    }>
  }
  biasAnalysis?: {
    rating: "low" | "moderate" | "high"
    explanation: string
  }
  timeline?: Array<{
    date: string
    event: string
    source: string
  }>
  deepfakeDetection?: {
    suspicious: boolean
    timestamps: number[]
  }
  socialHeatmap?: {
    trending: boolean
    platforms: string[]
    regions: string[]
  }
  multilingualSources?: string[]
  historicalCredibility?: {
    pastAccuracy: number
    totalChecks: number
  }
}

interface VerificationResultCardProps {
  result: VerificationResult
  hasVideo?: boolean
  videoUrl?: string
  videoData?: Array<{
    id: string
    title: string
    description: string
    thumbnail: string
    channelTitle: string
    publishedAt: string
    url: string
    embedUrl: string
    source: string
    platform: string
    relevance: number
  }>
}

export function VerificationResultCard({ result, hasVideo, videoUrl, videoData }: VerificationResultCardProps) {
  const [showReasoning, setShowReasoning] = useState(false)
  const [activeTab, setActiveTab] = useState<
    "overview" | "evidence" | "bias" | "timeline" | "deepfake" | "social" | "history"
  >("overview")

  const getVerdictConfig = (verdict: string) => {
    switch (verdict) {
      case "real":
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          color: "text-green-600",
          bgColor: "bg-green-100",
          borderColor: "border-green-200",
          emoji: "✅",
          label: "REAL",
        }
      case "likely-real":
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          color: "text-green-500",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          emoji: "✅",
          label: "LIKELY REAL",
        }
      case "likely-fake":
        return {
          icon: <XCircle className="w-5 h-5" />,
          color: "text-red-500",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          emoji: "❌",
          label: "LIKELY FAKE",
        }
      case "fake":
        return {
          icon: <XCircle className="w-5 h-5" />,
          color: "text-red-600",
          bgColor: "bg-red-100",
          borderColor: "border-red-200",
          emoji: "❌",
          label: "FAKE",
        }
      case "questionable":
        return {
          icon: <AlertTriangle className="w-5 h-5" />,
          color: "text-yellow-600",
          bgColor: "bg-yellow-100",
          borderColor: "border-yellow-200",
          emoji: "⚠️",
          label: "QUESTIONABLE",
        }
      case "ai-generated":
        return {
          icon: <Brain className="w-5 h-5" />,
          color: "text-purple-600",
          bgColor: "bg-purple-100",
          borderColor: "border-purple-200",
          emoji: "🤖",
          label: "AI-GENERATED",
        }
      default:
        return {
          icon: <AlertTriangle className="w-5 h-5" />,
          color: "text-gray-600",
          bgColor: "bg-gray-100",
          borderColor: "border-gray-200",
          emoji: "❓",
          label: "UNKNOWN",
        }
    }
  }

  const verdictConfig = getVerdictConfig(result.verdict)

  const CircularProgress = ({ value, size = 120 }: { value: number; size?: number }) => {
    const radius = (size - 8) / 2
    const circumference = radius * 2 * Math.PI
    const strokeDasharray = circumference
    const strokeDashoffset = circumference - (value / 100) * circumference

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            className="text-gray-200"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={verdictConfig.color}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg sm:text-2xl font-bold text-gray-900">{value}%</div>
            <div className="text-xs text-gray-500">Confidence</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 overflow-hidden">
      {/* Header with Verdict and Score */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="flex items-center gap-3"
        >
          <div className={`p-2 rounded-full ${verdictConfig.bgColor}`}>
            <div className={verdictConfig.color}>{verdictConfig.icon}</div>
          </div>
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 flex-wrap"
            >
              <span className="text-xl sm:text-2xl flex-shrink-0">{verdictConfig.emoji}</span>
              <Badge
                className={`${verdictConfig.bgColor} ${verdictConfig.color} ${verdictConfig.borderColor} font-semibold text-xs sm:text-sm flex-shrink-0`}
              >
                {verdictConfig.label}
              </Badge>
            </motion.div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
          <CircularProgress value={result.credibilityScore} size={100} />
        </motion.div>
      </div>

      {/* Video Embed with Deepfake Detection */}
      {hasVideo && videoUrl && (
        <div className="relative">
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <video controls className="w-full h-full" src={videoUrl} />
          </div>
          {result.deepfakeDetection?.suspicious && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-red-100 text-red-800 border-red-200">
                <Eye className="w-3 h-3 mr-1" />
                Deepfake Detected
              </Badge>
            </div>
          )}
        </div>
      )}

      {/* Multi-Source News Videos as Proof */}
      {videoData && videoData.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Multi-Source News Videos ({videoData.length})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {videoData.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg border shadow-sm overflow-hidden"
              >
                <div className="aspect-video bg-black relative">
                  {video.thumbnail ? (
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                      <div className="text-white text-center">
                        <div className="text-2xl mb-2">
                          {video.platform === 'YouTube' && '▶️'}
                          {video.platform === 'Vimeo' && '🎬'}
                          {video.platform === 'Dailymotion' && '📺'}
                          {video.platform === 'Twitter' && '🐦'}
                          {video.platform === 'News Site' && '📰'}
                          {video.platform === 'Multi-Platform' && '🌐'}
                        </div>
                        <div className="text-xs">{video.platform}</div>
                      </div>
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        video.platform === 'YouTube' ? 'bg-red-100 text-red-700 border-red-200' :
                        video.platform === 'Vimeo' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                        video.platform === 'Dailymotion' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                        video.platform === 'Twitter' ? 'bg-sky-100 text-sky-700 border-sky-200' :
                        video.platform === 'News Site' ? 'bg-green-100 text-green-700 border-green-200' :
                        video.platform === 'Multi-Platform' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                        'bg-gray-100 text-gray-700 border-gray-200'
                      }`}
                    >
                      {video.platform}
                    </Badge>
                  </div>
                  {video.embedUrl && video.embedUrl !== video.url && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={() => window.open(video.url, '_blank')}
                        className="bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all"
                      >
                        Watch on {video.platform}
                      </button>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h5 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">
                    {video.title}
                  </h5>
                  <p className="text-xs text-gray-600 mb-2">
                    {video.channelTitle}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {video.source}
                      </Badge>
                      {video.relevance && (
                        <Badge variant="secondary" className="text-xs">
                          {video.relevance}% relevant
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(video.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                  {video.description && (
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                      {video.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b">
        {[
          { id: "overview", label: "Overview", icon: <BarChart3 className="w-4 h-4" /> },
          { id: "evidence", label: "Evidence Map", icon: <Network className="w-4 h-4" /> },
          { id: "bias", label: "Bias Analysis", icon: <TrendingUp className="w-4 h-4" /> },
          { id: "timeline", label: "Timeline", icon: <Calendar className="w-4 h-4" /> },
          { id: "social", label: "Social Heatmap", icon: <MapPin className="w-4 h-4" /> },
          { id: "history", label: "Source History", icon: <Shield className="w-4 h-4" /> },
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab(tab.id as any)}
            className="flex items-center gap-2"
          >
            {tab.icon}
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Link className="w-4 h-4" />
                  Sources Verified ({result.sources.length})
                </h4>
                <div className="space-y-2">
                  {result.sources.map((source, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
                    >
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">{source}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">AI Reasoning</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowReasoning(!showReasoning)}
                    className="flex items-center gap-1"
                  >
                    Why?
                    {showReasoning ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </Button>
                </div>

                <AnimatePresence>
                  {showReasoning && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2"
                    >
                      {result.reasoning.map((reason, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg"
                        >
                          <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{reason}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}

          {activeTab === "evidence" && result.evidenceMap && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Source Network Analysis</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {result.evidenceMap.sources.map((source, idx) => (
                  <Card key={idx} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-sm">{source.name}</h5>
                      <Badge
                        variant={
                          source.trustRating > 80 ? "default" : source.trustRating > 60 ? "secondary" : "destructive"
                        }
                      >
                        {source.trustRating}%
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500">Connected to: {source.connections.join(", ")}</div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "bias" && result.biasAnalysis && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Bias Detection</h4>
                  <Badge
                    variant={
                      result.biasAnalysis.rating === "low"
                        ? "default"
                        : result.biasAnalysis.rating === "moderate"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {result.biasAnalysis.rating.toUpperCase()} BIAS
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">{result.biasAnalysis.explanation}</p>
            </div>
          )}

          {activeTab === "timeline" && result.timeline && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Event Timeline</h4>
              <div className="space-y-3">
                {result.timeline.map((event, idx) => (
                  <div key={idx} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500 min-w-[80px]">{event.date}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{event.event}</p>
                      <p className="text-xs text-gray-500">Source: {event.source}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "social" && result.socialHeatmap && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Social Media Analysis</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h5 className="font-medium mb-2">Trending Status</h5>
                  <Badge variant={result.socialHeatmap.trending ? "destructive" : "default"}>
                    {result.socialHeatmap.trending ? "TRENDING" : "NOT TRENDING"}
                  </Badge>
                </Card>
                <Card className="p-4">
                  <h5 className="font-medium mb-2">Active Platforms</h5>
                  <div className="flex flex-wrap gap-1">
                    {result.socialHeatmap.platforms.map((platform, idx) => (
                      <Badge key={idx} variant="secondary">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "history" && result.historicalCredibility && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Source Credibility History</h4>
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Historical Accuracy</span>
                  <span className="font-semibold">{result.historicalCredibility.pastAccuracy}%</span>
                </div>
                <Progress value={result.historicalCredibility.pastAccuracy} className="mb-2" />
                <p className="text-xs text-gray-500">
                  Based on {result.historicalCredibility.totalChecks} previous verifications
                </p>
              </Card>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Multilingual Sources */}
      {result.multilingualSources && result.multilingualSources.length > 0 && (
        <div className="border-t pt-4">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Languages className="w-4 h-4" />
            Multilingual Verification
          </h4>
          <div className="flex flex-wrap gap-2">
            {result.multilingualSources.map((lang, idx) => (
              <Badge key={idx} variant="outline">
                {lang}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}
