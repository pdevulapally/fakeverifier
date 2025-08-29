import { getJson } from 'serpapi'

// Search quota management
interface SearchQuota {
  searchesUsed: number
  searchesLimit: number
  resetDate: string
}

class SerpAPIManager {
  private apiKey: string
  private quota: SearchQuota

  constructor() {
    this.apiKey = process.env.SERPAPI_KEY || ''
    this.quota = {
      searchesUsed: 0,
      searchesLimit: 250,
      resetDate: this.getNextMonthResetDate()
    }
  }

  private getNextMonthResetDate(): string {
    const now = new Date()
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    return nextMonth.toISOString().split('T')[0]
  }

  private checkQuota(): boolean {
    // Check if we need to reset the quota (new month)
    const today = new Date().toISOString().split('T')[0]
    if (today >= this.quota.resetDate) {
      this.quota.searchesUsed = 0
      this.quota.resetDate = this.getNextMonthResetDate()
    }

    return this.quota.searchesUsed < this.quota.searchesLimit
  }

  private incrementQuota(): void {
    this.quota.searchesUsed++
  }

  async googleSearch(query: string, options: {
    num?: number
    gl?: string
    hl?: string
    safe?: 'active' | 'off'
  } = {}): Promise<any> {
    if (!this.apiKey) {
      throw new Error('SERPAPI_KEY not configured')
    }

    const canSearch = this.checkQuota()
    if (!canSearch) {
      throw new Error(`Search quota exceeded. Used: ${this.quota.searchesUsed}/${this.quota.searchesLimit}. Resets: ${this.quota.resetDate}`)
    }

    try {
      const result = await getJson({
        engine: 'google',
        q: query,
        api_key: this.apiKey,
        num: options.num || 10,
        gl: options.gl || 'uk',
        hl: options.hl || 'en',
        safe: options.safe || 'active'
      })

      this.incrementQuota()
      return result
    } catch (error) {
      console.error('SerpAPI Google Search Error:', error)
      throw error
    }
  }

  async newsSearch(query: string, options: {
    num?: number
    gl?: string
    hl?: string
    tbm?: 'nws'
  } = {}): Promise<any> {
    if (!this.apiKey) {
      throw new Error('SERPAPI_KEY not configured')
    }

    const canSearch = this.checkQuota()
    if (!canSearch) {
      throw new Error(`Search quota exceeded. Used: ${this.quota.searchesUsed}/${this.quota.searchesLimit}. Resets: ${this.quota.resetDate}`)
    }

    try {
      const result = await getJson({
        engine: 'google',
        q: query,
        api_key: this.apiKey,
        tbm: 'nws', // News search
        num: options.num || 10,
        gl: options.gl || 'uk',
        hl: options.hl || 'en'
      })

      this.incrementQuota()
      return result
    } catch (error) {
      console.error('SerpAPI News Search Error:', error)
      throw error
    }
  }

  getQuotaStatus(): SearchQuota {
    this.checkQuota() // Update quota if needed
    return { ...this.quota }
  }

  getRemainingSearches(): number {
    this.checkQuota() // Update quota if needed
    return Math.max(0, this.quota.searchesLimit - this.quota.searchesUsed)
  }
}

// Export singleton instance
export const serpAPIManager = new SerpAPIManager()

// Helper functions for API routes
export async function performGoogleSearch(query: string, options?: any) {
  return await serpAPIManager.googleSearch(query, options)
}

export async function performNewsSearch(query: string, options?: any) {
  return await serpAPIManager.newsSearch(query, options)
}

export async function getSearchQuota() {
  return serpAPIManager.getQuotaStatus()
}
