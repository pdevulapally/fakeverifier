"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  Filter, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Bot, 
  Trash2, 
  ArrowLeft,
  Clock,
  TrendingUp,
  TrendingDown,
  FileText,
  Link as LinkIcon,
  Video,
  Image as ImageIcon
} from "lucide-react"
import { getVerificationHistory, deleteVerificationData, VerificationData, onAuthStateChange, getCurrentUser } from "@/lib/firebase"
import { formatTimeAgo } from "@/lib/utils"
import Link from "next/link"

interface VerificationHistory {
  id: string
  title: string
  verdict: "real" | "likely-real" | "likely-fake" | "fake" | "questionable" | "ai-generated"
  score: number
  timestamp: Date
  content: string
  aiAnalysis?: any
  analysis?: any
  urlsAnalyzed?: string[]
  detectedContent?: any
}

export default function RecentsPage() {
  const [verificationHistory, setVerificationHistory] = useState<VerificationHistory[]>([])
  const [filteredHistory, setFilteredHistory] = useState<VerificationHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedVerdict, setSelectedVerdict] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"date" | "score" | "title">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    // Check if user is already authenticated
    const currentUser = getCurrentUser()
    if (currentUser) {
      console.log('User already authenticated, loading history...')
      loadVerificationHistory()
    }

    // Listen for auth state changes and load history when user is authenticated
    const unsubscribe = onAuthStateChange((user) => {
      if (user) {
        console.log('User authenticated, loading history...')
        loadVerificationHistory()
      } else {
        console.log('User not authenticated')
        setVerificationHistory([])
        setIsLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    filterAndSortHistory()
  }, [verificationHistory, searchQuery, selectedVerdict, sortBy, sortOrder])

  const loadVerificationHistory = async () => {
    try {
      setIsLoading(true)
      console.log('Loading verification history...')
      
      const result = await getVerificationHistory(100) // Get more history items
      console.log('Verification history result:', result)
      
      if (result.success) {
        const history = result.data.map((item: VerificationData) => ({
          id: item.id,
          title: item.title,
          verdict: item.verdict,
          score: item.score,
          timestamp: item.timestamp,
          content: item.content,
          aiAnalysis: item.aiAnalysis,
          analysis: item.analysis,
          urlsAnalyzed: item.urlsAnalyzed,
          detectedContent: item.detectedContent,
        }))
        console.log('Processed history:', history)
        setVerificationHistory(history)
      } else {
        console.error('Failed to load verification history:', result.error)
      }
    } catch (error) {
      console.error('Error loading verification history:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterAndSortHistory = () => {
    console.log('Filtering and sorting history...')
    console.log('Original history:', verificationHistory)
    console.log('Search query:', searchQuery)
    console.log('Selected verdict:', selectedVerdict)
    
    let filtered = verificationHistory

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by verdict
    if (selectedVerdict !== "all") {
      filtered = filtered.filter(item => item.verdict === selectedVerdict)
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case "date":
          comparison = new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          break
        case "score":
          comparison = b.score - a.score
          break
        case "title":
          comparison = a.title.localeCompare(b.title)
          break
      }

      return sortOrder === "asc" ? -comparison : comparison
    })

    console.log('Filtered history:', filtered)
    setFilteredHistory(filtered)
  }

  const handleDeleteItem = async (id: string) => {
    try {
      await deleteVerificationData(id)
      setVerificationHistory(prev => prev.filter(item => item.id !== id))
    } catch (error) {
      console.error('Error deleting verification:', error)
    }
  }

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case "real":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "likely-real":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "likely-fake":
        return <XCircle className="w-4 h-4 text-red-500" />
      case "fake":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "questionable":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      case "ai-generated":
        return <Bot className="w-4 h-4 text-purple-600" />
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />
    }
  }

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "real":
        return "bg-green-100 text-green-800"
      case "likely-real":
        return "bg-green-50 text-green-700"
      case "likely-fake":
        return "bg-red-50 text-red-700"
      case "fake":
        return "bg-red-100 text-red-800"
      case "questionable":
        return "bg-yellow-100 text-yellow-800"
      case "ai-generated":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getContentTypeIcons = (detectedContent?: any) => {
    const icons = []
    if (detectedContent?.links?.length > 0) {
      icons.push(<LinkIcon key="links" className="w-3 h-3 text-blue-500" />)
    }
    if (detectedContent?.videoLinks?.length > 0) {
      icons.push(<Video key="videos" className="w-3 h-3 text-red-500" />)
    }
    if (detectedContent?.images?.length > 0) {
      icons.push(<ImageIcon key="images" className="w-3 h-3 text-green-500" />)
    }
    if (detectedContent?.documents?.length > 0) {
      icons.push(<FileText key="documents" className="w-3 h-3 text-purple-500" />)
    }
    return icons
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
                <h1 className="text-xl font-semibold text-gray-900">Verification History</h1>
                <p className="text-sm text-gray-500">Your complete verification history</p>
              </div>
            </div>
                         <div className="flex items-center gap-2">
               <Badge variant="outline" className="text-sm">
                 {filteredHistory.length} verifications
               </Badge>
               <Badge variant="outline" className="text-sm">
                 Total: {verificationHistory.length}
               </Badge>
             </div>
          </div>
        </div>
      </div>

             {/* Filters and Search */}
       <div className="bg-white border-b">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
           <div className="flex flex-col gap-4">
             {/* Search */}
             <div className="w-full">
               <div className="relative">
                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                 <Input
                   placeholder="Search verifications..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="pl-10"
                 />
               </div>
             </div>

             {/* Filters */}
             <div className="flex flex-wrap gap-2">
              <select
                value={selectedVerdict}
                onChange={(e) => setSelectedVerdict(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Verdicts</option>
                <option value="real">Real</option>
                <option value="likely-real">Likely Real</option>
                <option value="questionable">Questionable</option>
                <option value="likely-fake">Likely Fake</option>
                <option value="fake">Fake</option>
                <option value="ai-generated">AI Generated</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "date" | "score" | "title")}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Sort by Date</option>
                <option value="score">Sort by Score</option>
                <option value="title">Sort by Title</option>
              </select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              >
                {sortOrder === "asc" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" />
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="text-center py-12">
            <Bot className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No verifications found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || selectedVerdict !== "all" 
                ? "Try adjusting your search or filters"
                : "Start by verifying your first news article"
              }
            </p>
            <Link href="/verify">
              <Button>
                Start Verifying
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHistory.map((item) => (
              <Card key={item.id} className="p-6 hover:shadow-md transition-shadow">
                                 <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                   <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      {getVerdictIcon(item.verdict)}
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {item.title}
                      </h3>
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {item.content}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatTimeAgo(item.timestamp)}
                      </div>
                      {item.detectedContent && (
                        <div className="flex items-center gap-1">
                          {getContentTypeIcons(item.detectedContent)}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${getVerdictColor(item.verdict)}`}>
                        {item.score}% • {item.verdict}
                      </Badge>
                      {item.aiAnalysis?.newsData && (
                        <Badge variant="outline" className="text-xs">
                          {item.aiAnalysis.newsData.length} sources
                        </Badge>
                      )}
                    </div>
                  </div>

                                     <div className="flex items-center gap-2 sm:ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Navigate back to verify page with this item loaded
                        window.location.href = `/verify?load=${item.id}`
                      }}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
