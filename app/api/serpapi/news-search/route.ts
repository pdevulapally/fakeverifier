import { NextRequest, NextResponse } from 'next/server'
import { performNewsSearch, getSearchQuota } from '@/lib/serpapi'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, num = 10, gl = 'uk', hl = 'en' } = body

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      )
    }

    // Check quota before performing search
    const quota = await getSearchQuota()
    if (quota.searchesUsed >= quota.searchesLimit) {
      return NextResponse.json(
        { 
          error: 'Search quota exceeded',
          quota: {
            used: quota.searchesUsed,
            limit: quota.searchesLimit,
            remaining: 0,
            resetDate: quota.resetDate
          }
        },
        { status: 429 }
      )
    }

    // Perform the news search
    const searchResults = await performNewsSearch(query, {
      num,
      gl,
      hl
    })

    // Get updated quota
    const updatedQuota = await getSearchQuota()

    return NextResponse.json({
      success: true,
      results: searchResults,
      quota: {
        used: updatedQuota.searchesUsed,
        limit: updatedQuota.searchesLimit,
        remaining: updatedQuota.searchesLimit - updatedQuota.searchesUsed,
        resetDate: updatedQuota.resetDate
      }
    })

  } catch (error: any) {
    console.error('News Search API Error:', error)
    
    if (error.message.includes('quota exceeded')) {
      return NextResponse.json(
        { 
          error: 'Search quota exceeded',
          message: error.message
        },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { 
        error: 'Failed to perform news search',
        message: error.message 
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const quota = await getSearchQuota()
    
    return NextResponse.json({
      quota: {
        used: quota.searchesUsed,
        limit: quota.searchesLimit,
        remaining: quota.searchesLimit - quota.searchesUsed,
        resetDate: quota.resetDate
      }
    })
  } catch (error: any) {
    console.error('Quota Check Error:', error)
    return NextResponse.json(
      { error: 'Failed to get quota status' },
      { status: 500 }
    )
  }
}
