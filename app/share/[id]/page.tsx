import { notFound } from 'next/navigation'

async function fetchShared(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ''
  const res = await fetch(`${baseUrl}/api/share?id=${encodeURIComponent(id)}`, { cache: 'no-store' })
  if (!res.ok) return null
  return res.json()
}

export default async function SharedPage({ params }: { params: { id: string } }) {
  const data = await fetchShared(params.id)
  if (!data) return notFound()

  const { verificationData, messages } = data

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-2">Shared Verification</h1>
        <p className="text-sm text-gray-500 mb-6">Read-only view. Continue the conversation by logging in.</p>

        {verificationData && (
          <div className="rounded-lg border p-4 mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{verificationData.title}</h2>
              <span className="text-sm text-gray-600">{new Date(verificationData.timestamp).toLocaleString()}</span>
            </div>
            <div className="mt-2 text-gray-700 whitespace-pre-wrap">{verificationData.content}</div>
          </div>
        )}

        {messages && Array.isArray(messages) && (
          <div className="space-y-3">
            {messages.map((m: any) => (
              <div key={m.id} className="rounded-lg border p-3">
                <div className="text-xs text-gray-500 mb-1">
                  {m.type === 'user' ? 'User' : 'Assistant'} · {new Date(m.timestamp).toLocaleString()}
                </div>
                <div className="whitespace-pre-wrap text-sm">{m.content}</div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8">
          <a href="/Signup" className="inline-flex items-center rounded-full px-4 py-2 bg-blue-600 text-white text-sm">Continue in FakeVerifier</a>
        </div>
      </main>
    </div>
  )
}


