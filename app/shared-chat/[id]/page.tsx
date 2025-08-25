import { notFound } from 'next/navigation'
import { SharedChatView } from './shared-chat-view'

async function fetchSharedChat(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const res = await fetch(`${baseUrl}/api/share-chat?id=${encodeURIComponent(id)}`, { 
    cache: 'no-store',
    next: { revalidate: 0 }
  })
  if (!res.ok) return null
  return res.json()
}

export default async function SharedChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await fetchSharedChat(id)
  
  if (!data) {
    notFound()
  }

  return <SharedChatView chatData={data} />
}
