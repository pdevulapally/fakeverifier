"use client"

import React, { useState, useEffect } from 'react'
import { Search, Newspaper, Globe, AlertTriangle, Info, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'

interface SearchResult {
  title: string
  link: string
  snippet: string
  source?: string
  date?: string
}

interface QuotaInfo {
  used: number
  limit: number
  remaining: number
  resetDate: string
}

interface SearchResponse {
  success: boolean
  results: {
    organic_results?: SearchResult[]
    news_results?: SearchResult[]
  }
  quota: QuotaInfo
  error?: string
}

export function SerpAPISearch() {
  const [query, setQuery] = useState('')
  const [searchType, setSearchType] = useState<'google' | 'news'>('google')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [quota, setQuota] = useState<QuotaInfo | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchQuota()
  }, [])

  const fetchQuota = async () => {
    try {
      const endpoint = searchType === 'google' 
        ? '/api/serpapi/google-search'
        : '/api/serpapi/news-search'
      
      const response = await fetch(endpoint)
      const data = await response.json()
      
      if (data.quota) {
        setQuota(data.quota)
      }
    } catch (error) {
      console.error('Failed to fetch quota:', error)
    }
  }

  const performSearch = async () => {
    if (!query.trim()) {
      setError('Please enter a search query')
      return
    }

    if (quota && quota.remaining <= 0) {
      setError('Search quota exceeded. Please wait until next month.')
      return
    }

    setLoading(true)
    setError(null)
    setResults([])

    try {
      const endpoint = searchType === 'google' 
        ? '/api/serpapi/google-search'
        : '/api/serpapi/news-search'
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          num: 10,
          gl: 'uk',
          hl: 'en'
        }),
      })

      const data: SearchResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Search failed')
      }

      if (data.success) {
        const searchResults = searchType === 'google' 
          ? data.results.organic_results || []
          : data.results.news_results || []
        
        setResults(searchResults)
        setQuota(data.quota)
      }
    } catch (error: any) {
      setError(error.message || 'Search failed')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      performSearch()
    }
  }

  const quotaPercentage = quota ? (quota.used / quota.limit) * 100 : 0
  const isQuotaLow = quota && quota.remaining <= 25

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Quota Status */}
      {quota && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Search Quota Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Searches used: {quota.used} / {quota.limit}
                </span>
                <Badge variant={isQuotaLow ? "destructive" : "secondary"}>
                  {quota.remaining} remaining
                </Badge>
              </div>
              <Progress value={quotaPercentage} className="w-full" />
              <p className="text-xs text-muted-foreground">
                Resets on: {new Date(quota.resetDate).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Interface */}
      <Card>
        <CardHeader>
          <CardTitle>SerpAPI Search</CardTitle>
          <CardDescription>
            Search Google and news with real-time results. Limited to 250 searches per month.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={searchType} onValueChange={(value) => setSearchType(value as 'google' | 'news')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="google" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Google Search
              </TabsTrigger>
              <TabsTrigger value="news" className="flex items-center gap-2">
                <Newspaper className="h-4 w-4" />
                News Search
              </TabsTrigger>
            </TabsList>

            <TabsContent value="google" className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter your search query..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                />
                <Button onClick={performSearch} disabled={loading || !query.trim()}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="news" className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Search for news..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                />
                <Button onClick={performSearch} disabled={loading || !query.trim()}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Newspaper className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Search Results ({results.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((result, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-2">
                  <h3 className="font-semibold">
                    <a 
                      href={result.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {result.title}
                    </a>
                  </h3>
                  <p className="text-sm text-muted-foreground">{result.snippet}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {result.source && <span>{result.source}</span>}
                    {result.date && <span>• {result.date}</span>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
