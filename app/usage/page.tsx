"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  ArrowLeft,
  Zap, 
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award,
  Globe,
  FileText,
  Link as LinkIcon,
  Video,
  Image as ImageIcon,
  Download,
  Filter,
  RefreshCw,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  CreditCard
} from "lucide-react"
import { getCurrentUser, getUserTokenUsage, getVerificationHistory, TokenUsage, VerificationData, onAuthStateChange } from "@/lib/firebase"
import { formatTimeAgo } from "@/lib/utils"
import Link from "next/link"
// import { motion } from "framer-motion"

interface UsageAnalytics {
  totalVerifications: number
  totalTokensUsed: number
  averageTokensPerVerification: number
  verificationTrends: {
    date: string
    count: number
    tokens: number
  }[]
  verdictDistribution: {
    verdict: string
    count: number
    percentage: number
  }[]
  contentTypeAnalysis: {
    type: string
    count: number
    percentage: number
  }[]
  hourlyUsage: {
    hour: number
    count: number
  }[]
  weeklyUsage: {
    day: string
    count: number
  }[]
  topSources: {
    source: string
    count: number
  }[]
  accuracyMetrics: {
    averageScore: number
    highConfidenceCount: number
    lowConfidenceCount: number
  }
}

export default function UsagePage() {
  const [tokenUsage, setTokenUsage] = useState<TokenUsage & { id: string } | null>(null)
  const [verificationHistory, setVerificationHistory] = useState<VerificationData[]>([])
  const [analytics, setAnalytics] = useState<UsageAnalytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">("30d")
  const [showDetailedMetrics, setShowDetailedMetrics] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setCurrentUser(user)
      if (user) {
        loadData()
      } else {
        setIsLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (verificationHistory.length > 0) {
      calculateAnalytics()
    }
  }, [verificationHistory, timeRange])

  const loadData = async () => {
    try {
      setIsLoading(true)
      
      // Load token usage
      const tokenResult = await getUserTokenUsage()
      if (tokenResult.success) {
        setTokenUsage(tokenResult.data as TokenUsage & { id: string })
      }

      // Load verification history
      const historyResult = await getVerificationHistory(1000) // Get more data for analytics
      if (historyResult.success) {
        setVerificationHistory(historyResult.data)
      }
    } catch (error) {
      console.error('Error loading usage data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateAnalytics = () => {
    const now = new Date()
    const timeRangeMs = {
      "7d": 7 * 24 * 60 * 60 * 1000,
      "30d": 30 * 24 * 60 * 60 * 1000,
      "90d": 90 * 24 * 60 * 60 * 1000,
      "1y": 365 * 24 * 60 * 60 * 1000
    }

    const filteredHistory = verificationHistory.filter(item => {
      const itemDate = new Date(item.timestamp)
      return now.getTime() - itemDate.getTime() <= timeRangeMs[timeRange]
    })

    // Calculate basic metrics
    const totalVerifications = filteredHistory.length
    const totalTokensUsed = filteredHistory.reduce((sum, item) => sum + (item.aiAnalysis ? 2 : 1), 0)
    const averageTokensPerVerification = totalVerifications > 0 ? totalTokensUsed / totalVerifications : 0

    // Calculate verification trends (last 7 days)
    const trends = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      const dayVerifications = filteredHistory.filter(item => {
        const itemDate = new Date(item.timestamp)
        return itemDate.toISOString().split('T')[0] === dateStr
      })
      
      const dayTokens = dayVerifications.reduce((sum, item) => sum + (item.aiAnalysis ? 2 : 1), 0)
      
      trends.push({
        date: dateStr,
        count: dayVerifications.length,
        tokens: dayTokens
      })
    }

    // Calculate verdict distribution
    const verdictCounts: { [key: string]: number } = {}
    filteredHistory.forEach(item => {
      verdictCounts[item.verdict] = (verdictCounts[item.verdict] || 0) + 1
    })

    const verdictDistribution = Object.entries(verdictCounts).map(([verdict, count]) => ({
      verdict,
      count,
      percentage: (count / totalVerifications) * 100
    })).sort((a, b) => b.count - a.count)

    // Calculate content type analysis
    const contentTypeCounts: { [key: string]: number } = {}
    filteredHistory.forEach(item => {
      if (item.detectedContent) {
        if (item.detectedContent.links?.length > 0) contentTypeCounts.links = (contentTypeCounts.links || 0) + 1
        if (item.detectedContent.videoLinks?.length > 0) contentTypeCounts.videos = (contentTypeCounts.videos || 0) + 1
        if (item.detectedContent.images?.length > 0) contentTypeCounts.images = (contentTypeCounts.images || 0) + 1
        if (item.detectedContent.documents?.length > 0) contentTypeCounts.documents = (contentTypeCounts.documents || 0) + 1
      }
    })

    const contentTypeAnalysis = Object.entries(contentTypeCounts).map(([type, count]) => ({
      type,
      count,
      percentage: (count / totalVerifications) * 100
    })).sort((a, b) => b.count - a.count)

    // Calculate hourly usage
    const hourlyCounts: { [key: number]: number } = {}
    filteredHistory.forEach(item => {
      const hour = new Date(item.timestamp).getHours()
      hourlyCounts[hour] = (hourlyCounts[hour] || 0) + 1
    })

    const hourlyUsage = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      count: hourlyCounts[i] || 0
    }))

    // Calculate weekly usage
    const weeklyCounts: { [key: string]: number } = {}
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    filteredHistory.forEach(item => {
      const day = days[new Date(item.timestamp).getDay()]
      weeklyCounts[day] = (weeklyCounts[day] || 0) + 1
    })

    const weeklyUsage = days.map(day => ({
      day,
      count: weeklyCounts[day] || 0
    }))

    // Calculate top sources
    const sourceCounts: { [key: string]: number } = {}
    filteredHistory.forEach(item => {
      if (item.aiAnalysis?.newsData) {
        item.aiAnalysis.newsData.forEach((news: any) => {
          const source = news.source || 'Unknown'
          sourceCounts[source] = (sourceCounts[source] || 0) + 1
        })
      }
    })

    const topSources = Object.entries(sourceCounts)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Calculate accuracy metrics
    const scores = filteredHistory.map(item => item.score)
    const averageScore = scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0
    const highConfidenceCount = filteredHistory.filter(item => item.score >= 80).length
    const lowConfidenceCount = filteredHistory.filter(item => item.score < 50).length

    setAnalytics({
      totalVerifications,
      totalTokensUsed,
      averageTokensPerVerification,
      verificationTrends: trends,
      verdictDistribution,
      contentTypeAnalysis,
      hourlyUsage,
      weeklyUsage,
      topSources,
      accuracyMetrics: {
        averageScore,
        highConfidenceCount,
        lowConfidenceCount
      }
    })
  }

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "real": return "bg-green-100 text-green-800"
      case "likely-real": return "bg-green-50 text-green-700"
      case "likely-fake": return "bg-red-50 text-red-700"
      case "fake": return "bg-red-100 text-red-800"
      case "questionable": return "bg-yellow-100 text-yellow-800"
      case "ai-generated": return "bg-purple-100 text-purple-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "links": return <LinkIcon className="w-4 h-4" />
      case "videos": return <Video className="w-4 h-4" />
      case "images": return <ImageIcon className="w-4 h-4" />
      case "documents": return <FileText className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" />
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please sign in to view your usage analytics.</p>
          <Link href="/Login">
            <Button>Sign In</Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/verify">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Verify
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Usage Analytics</h1>
                <p className="text-sm text-gray-500">Detailed insights into your verification activity</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/billing">
                <Button variant="outline" size="sm">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Billing
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={loadData}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowDetailedMetrics(!showDetailedMetrics)}>
                {showDetailedMetrics ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {showDetailedMetrics ? 'Hide Details' : 'Show Details'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Time Range:</span>
            {(["7d", "30d", "90d", "1y"] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(range)}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {analytics ? (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Verifications</p>
                      <p className="text-2xl font-bold text-gray-900">{formatNumber(analytics.totalVerifications)}</p>
                    </div>
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BarChart3 className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </Card>
              </div>

              <div>
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Tokens Used</p>
                      <p className="text-2xl font-bold text-gray-900">{formatNumber(analytics.totalTokensUsed)}</p>
                    </div>
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Zap className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </Card>
              </div>

              <div>
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg. Tokens/Verification</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.averageTokensPerVerification.toFixed(1)}</p>
                    </div>
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Target className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </Card>
              </div>

              <div>
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Average Score</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.accuracyMetrics.averageScore.toFixed(1)}%</p>
                    </div>
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Award className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Token Usage Progress */}
            {tokenUsage && (
              <div>
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Token Usage</h3>
                    <Badge variant="outline">
                      {tokenUsage.plan === "free" ? "Free Plan" : `${tokenUsage.plan.toUpperCase()} Plan`}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Used this month</span>
                      <span className="font-medium">
                        {tokenUsage.used} / {tokenUsage.total} tokens
                      </span>
                    </div>
                    <Progress 
                      value={(tokenUsage.used / tokenUsage.total) * 100} 
                      className="h-3"
                    />
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{tokenUsage.total - tokenUsage.used} tokens remaining</span>
                      <span>Resets in {Math.ceil((new Date(tokenUsage.resetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days</span>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Verification Trends */}
              <div>
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Trends (Last 7 Days)</h3>
                  <div className="space-y-3">
                    {analytics.verificationTrends.map((trend, index) => (
                      <div key={trend.date} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {new Date(trend.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </span>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-medium">{trend.count} verifications</span>
                          <span className="text-sm text-gray-500">{trend.tokens} tokens</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

                              {/* Verdict Distribution */}
                <div>
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Verdict Distribution</h3>
                  <div className="space-y-3">
                    {analytics.verdictDistribution.map((item) => (
                      <div key={item.verdict} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className={`text-xs ${getVerdictColor(item.verdict)}`}>
                            {item.verdict}
                          </Badge>
                          <span className="text-sm text-gray-600">{item.count}</span>
                        </div>
                        <span className="text-sm font-medium">{item.percentage.toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

                              {/* Content Type Analysis */}
                <div>
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Type Analysis</h3>
                  <div className="space-y-3">
                    {analytics.contentTypeAnalysis.map((item) => (
                      <div key={item.type} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getContentTypeIcon(item.type)}
                          <span className="text-sm font-medium capitalize">{item.type}</span>
                          <span className="text-sm text-gray-600">{item.count}</span>
                        </div>
                        <span className="text-sm font-medium">{item.percentage.toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

                              {/* Weekly Usage Pattern */}
                <div>
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Usage Pattern</h3>
                  <div className="space-y-3">
                    {analytics.weeklyUsage.map((item) => (
                      <div key={item.day} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{item.day}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(item.count / Math.max(...analytics.weeklyUsage.map(w => w.count))) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{item.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>

            {/* Detailed Metrics */}
            {showDetailedMetrics && (
              <div className="space-y-6">
                {/* Top Sources */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Sources Referenced</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analytics.topSources.map((source, index) => (
                      <div key={source.source} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">{index + 1}.</span>
                          <span className="text-sm text-gray-700 truncate">{source.source}</span>
                        </div>
                        <Badge variant="outline">{source.count} references</Badge>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Accuracy Metrics */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Accuracy Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{analytics.accuracyMetrics.highConfidenceCount}</p>
                      <p className="text-sm text-green-700">High Confidence (≥80%)</p>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <p className="text-2xl font-bold text-yellow-600">
                        {analytics.totalVerifications - analytics.accuracyMetrics.highConfidenceCount - analytics.accuracyMetrics.lowConfidenceCount}
                      </p>
                      <p className="text-sm text-yellow-700">Medium Confidence</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <p className="text-2xl font-bold text-red-600">{analytics.accuracyMetrics.lowConfidenceCount}</p>
                      <p className="text-sm text-red-700">Low Confidence (&lt;50%)</p>
                    </div>
                  </div>
                </Card>

                {/* Hourly Usage Heatmap */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Hourly Usage Pattern</h3>
                  <div className="grid grid-cols-12 gap-1">
                    {analytics.hourlyUsage.map((item) => (
                      <div key={item.hour} className="text-center">
                        <div 
                          className={`h-8 rounded text-xs flex items-center justify-center ${
                            item.count === 0 ? 'bg-gray-100' :
                            item.count <= 2 ? 'bg-blue-200' :
                            item.count <= 5 ? 'bg-blue-400' :
                            'bg-blue-600 text-white'
                          }`}
                          title={`${item.hour}:00 - ${item.count} verifications`}
                        >
                          {item.count > 0 ? item.count : ''}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{item.hour}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No analytics data available</h3>
            <p className="text-gray-500 mb-4">Start verifying content to see your usage analytics.</p>
            <Link href="/verify">
              <Button>Start Verifying</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
