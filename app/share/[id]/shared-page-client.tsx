"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface SharedPageClientProps {
  shareId: string
  verificationData: any
  messages: any[]
}

export function SharedPageClient({ shareId, verificationData, messages }: SharedPageClientProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleContinueInFakeVerifier = () => {
    setIsLoading(true)
    
    try {
      // Store the shared verification data in localStorage
      const sharedData = {
        shareId,
        verificationData,
        messages,
        timestamp: new Date().toISOString()
      }
      
      localStorage.setItem('sharedVerificationData', JSON.stringify(sharedData))
      
      // Redirect to verify page with a special parameter
      router.push('/verify?shared=true')
    } catch (error) {
      console.error('Error storing shared data:', error)
      // Fallback to signup page
      router.push('/Signup')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Button 
        onClick={handleContinueInFakeVerifier}
        disabled={isLoading}
        className="inline-flex items-center rounded-full px-4 py-2 bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Redirecting...' : 'Continue in FakeVerifier'}
      </Button>
      
      <p className="text-xs text-gray-500">
        This will open the full FakeVerifier interface where you can continue the conversation.
      </p>
    </div>
  )
}
