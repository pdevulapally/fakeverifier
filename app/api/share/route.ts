import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

// Create a public, shareable snapshot of a verification/chat
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { verificationData, messages } = body || {}

    if (!verificationData) {
      return NextResponse.json({ error: 'verificationData is required' }, { status: 400 })
    }

    const doc = await adminDb.collection('sharedVerifications').add({
      verificationData,
      messages: messages || null,
      createdAt: new Date(),
    })

    const proto = request.headers.get('x-forwarded-proto') || 'http'
    const host = request.headers.get('host')
    const url = `${proto}://${host}/share/${doc.id}`

    return NextResponse.json({ id: doc.id, url })
  } catch (error) {
    console.error('Error creating share:', error)
    return NextResponse.json({ error: 'Failed to create share' }, { status: 500 })
  }
}

// Fetch a public, shareable snapshot by id (no auth required)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const snap = await adminDb.collection('sharedVerifications').doc(id).get()
    if (!snap.exists) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({ id: snap.id, ...snap.data() })
  } catch (error) {
    console.error('Error fetching share:', error)
    return NextResponse.json({ error: 'Failed to fetch share' }, { status: 500 })
  }
}


