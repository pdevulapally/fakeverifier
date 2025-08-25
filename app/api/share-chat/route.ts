import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

// Create a public, shareable chat conversation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages, title, createdAt } = body || {}

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages are required and must be a non-empty array' }, { status: 400 })
    }

    // Validate messages structure
    const validMessages = messages.filter(msg => 
      msg && 
      typeof msg === 'object' && 
      msg.id && 
      msg.type && 
      msg.content && 
      msg.timestamp
    )

    if (validMessages.length === 0) {
      return NextResponse.json({ error: 'No valid messages found' }, { status: 400 })
    }

    // Create share data
    const shareData = {
      messages: validMessages,
      title: title || 'Shared Chat Conversation',
      createdAt: createdAt || new Date().toISOString(),
      sharedAt: new Date().toISOString(),
      messageCount: validMessages.length,
      userMessageCount: validMessages.filter(m => m.type === 'user').length,
      assistantMessageCount: validMessages.filter(m => m.type === 'assistant').length,
      // Optional: Add expiration date (30 days from now)
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      // Metadata
      metadata: {
        platform: 'FakeVerifier',
        version: '1.0',
        shareType: 'chat'
      }
    }

    // Store in Firebase
    const doc = await adminDb.collection('sharedChats').add(shareData)

    // Generate share URL
    const proto = request.headers.get('x-forwarded-proto') || 'http'
    const host = request.headers.get('host')
    const url = `${proto}://${host}/shared-chat/${doc.id}`

    console.log(`Chat share created: ${doc.id} with ${validMessages.length} messages`)

    return NextResponse.json({ 
      id: doc.id, 
      url,
      messageCount: validMessages.length,
      title: shareData.title
    })
  } catch (error) {
    console.error('Error creating chat share:', error)
    return NextResponse.json({ error: 'Failed to create chat share' }, { status: 500 })
  }
}

// Fetch a public, shareable chat by id (no auth required)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Share ID is required' }, { status: 400 })
    }

    const snap = await adminDb.collection('sharedChats').doc(id).get()
    
    if (!snap.exists) {
      return NextResponse.json({ error: 'Shared chat not found' }, { status: 404 })
    }

    const data = snap.data()
    
    // Check if share has expired
    if (data?.expiresAt && new Date(data.expiresAt) < new Date()) {
      return NextResponse.json({ error: 'This shared chat has expired' }, { status: 410 })
    }

    return NextResponse.json({ 
      id: snap.id, 
      ...data 
    })
  } catch (error) {
    console.error('Error fetching shared chat:', error)
    return NextResponse.json({ error: 'Failed to fetch shared chat' }, { status: 500 })
  }
}
