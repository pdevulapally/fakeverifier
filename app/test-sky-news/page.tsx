"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, ExternalLink, Calendar, User } from 'lucide-react'

interface SkyNewsArticle {
  id: string
  title: string
  description: string
  url: string
  publishedAt: string
  author: string
  category: string
  tags: string[]
  mediaUrl: string
  mediaType: string
  source: string
  api: string
  relevance: number
}

export default function TestSkyNewsPage() {
  const [articles, setArticles] = useState<SkyNewsArticle[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('home')
  const [limit, setLimit] = useState(10)

  const categories = [
    { value: 'home', label: 'Home' },
    { value: 'world', label: 'World' },
    { value: 'uk', label: 'UK' },
    { value: 'politics', label: 'Politics' },
    { value: 'business', label: 'Business' },
    { value: 'technology', label: 'Technology' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'sports', label: 'Sports' }
  ]

  const fetchSkyNews = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams()
      if (query) params.append('q', query)
      params.append('category', category)
      params.append('limit', limit.toString())
      
      const response = await fetch(`/api/sky-news-rss?${params.toString()}`)
      const data = await response.json()
      
      if (data.success) {
        setArticles(data.data)
      } else {
        setError(data.error || 'Failed to fetch Sky News data')
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Error fetching Sky News:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSkyNews()
  }, [category, limit])

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'Unknown date'
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Sky News RSS Feed Test</h1>
        <p className="text-gray-600">Test the Sky News RSS feed integration for news verification</p>
      </div>

      {/* Controls */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search Query</label>
              <Input
                placeholder="Enter search terms..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && fetchSkyNews()}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Limit</label>
              <Select value={limit.toString()} onValueChange={(value) => setLimit(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 articles</SelectItem>
                  <SelectItem value="10">10 articles</SelectItem>
                  <SelectItem value="20">20 articles</SelectItem>
                  <SelectItem value="50">50 articles</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                onClick={fetchSkyNews} 
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Search'
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-800">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            Results ({articles.length} articles)
          </h2>
          <Badge variant="outline">
            Category: {categories.find(c => c.value === category)?.label}
          </Badge>
        </div>

        {articles.map((article) => (
          <Card key={article.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                    {article.description}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2 ml-4">
                  <Badge variant="secondary" className="text-xs">
                    Relevance: {article.relevance}%
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(article.url, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Read
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(article.publishedAt)}
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {article.author}
                </div>
                <Badge variant="outline" className="text-xs">
                  {article.category}
                </Badge>
                {article.tags.length > 0 && (
                  <div className="flex gap-1">
                    {article.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {article.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{article.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              
              {article.mediaUrl && (
                <div className="mt-3">
                  <img 
                    src={article.mediaUrl} 
                    alt={article.title}
                    className="w-full h-32 object-cover rounded-md"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {articles.length === 0 && !loading && !error && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No articles found. Try adjusting your search criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
