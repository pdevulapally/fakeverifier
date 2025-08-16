"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Zap, 
  Crown, 
  CreditCard, 
  Info,
  Sparkles,
  TrendingUp,
  Shield,
  Globe
} from "lucide-react"
import { getCurrentUser, getUserTokenUsage, TokenUsage } from "@/lib/firebase"
import { cn } from "@/lib/utils"

interface TokenSystemProps {
  onTokenDepleted?: () => void
  onUpgradeClick?: () => void
  refreshTrigger?: number // Add this to trigger refresh
}



export function TokenSystem({ onTokenDepleted, onUpgradeClick, refreshTrigger }: TokenSystemProps) {
  const [tokenUsage, setTokenUsage] = useState<TokenUsage & { id: string }>({
    id: '',
    userId: '',
    used: 0,
    total: 50, // Free tier: 50 tokens per month
    resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    plan: "free",
    lastUpdated: new Date()
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    loadTokenUsage()
  }, [refreshTrigger]) // Add refreshTrigger to dependency array

  const loadTokenUsage = async () => {
    try {
      console.log('Loading token usage...')
      setIsLoading(true)
      const currentUser = getCurrentUser()
      if (!currentUser) {
        // User not authenticated, show default free tier
        setIsAuthenticated(false)
        setTokenUsage({
          id: '',
          userId: '',
          used: 0,
          total: 50,
          resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          plan: "free",
          lastUpdated: new Date()
        })
        return
      }
      
      setIsAuthenticated(true)
      
      const result = await getUserTokenUsage()
      if (result.success) {
        const data = result.data as TokenUsage & { id: string }
        
        // Ensure resetDate is properly converted to Date object
        if (data.resetDate) {
          if (typeof data.resetDate === 'string') {
            const resetDate = new Date(data.resetDate)
            if (!isNaN(resetDate.getTime())) {
              data.resetDate = resetDate
            } else {
              console.warn('Invalid resetDate string:', data.resetDate)
              data.resetDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            }
          } else if (data.resetDate && typeof data.resetDate === 'object' && 'toDate' in data.resetDate) {
            // Handle Firestore Timestamp
            data.resetDate = (data.resetDate as any).toDate()
          } else if (!(data.resetDate instanceof Date)) {
            console.warn('Invalid resetDate object:', data.resetDate)
            data.resetDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          }
        }
        
        // Ensure lastUpdated is properly converted to Date object
        if (data.lastUpdated) {
          if (typeof data.lastUpdated === 'string') {
            const lastUpdated = new Date(data.lastUpdated)
            if (!isNaN(lastUpdated.getTime())) {
              data.lastUpdated = lastUpdated
            } else {
              console.warn('Invalid lastUpdated string:', data.lastUpdated)
              data.lastUpdated = new Date()
            }
          } else if (data.lastUpdated && typeof data.lastUpdated === 'object' && 'toDate' in data.lastUpdated) {
            // Handle Firestore Timestamp
            data.lastUpdated = (data.lastUpdated as any).toDate()
          } else if (!(data.lastUpdated instanceof Date)) {
            console.warn('Invalid lastUpdated object:', data.lastUpdated)
            data.lastUpdated = new Date()
          }
        }
        
        console.log('Token usage loaded:', data.used, '/', data.total)
        setTokenUsage(data)
      } else {
        console.error("Error loading token usage:", result.error)
      }
    } catch (error) {
      console.error("Error loading token usage:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getRemainingTokens = () => tokenUsage.total - tokenUsage.used
  const getUsagePercentage = () => (tokenUsage.used / tokenUsage.total) * 100
  const isLowTokens = () => getRemainingTokens() <= 5
  const isOutOfTokens = () => getRemainingTokens() <= 0

  const formatResetDate = (date: Date | string) => {
    try {
      let dateObj: Date
      
      if (typeof date === 'string') {
        dateObj = new Date(date)
        // Check if the date is valid
        if (isNaN(dateObj.getTime())) {
          console.warn('Invalid date string:', date)
          return "Resets in 30 days"
        }
      } else if (date instanceof Date) {
        dateObj = date
      } else {
        console.warn('Invalid date object:', date)
        return "Resets in 30 days"
      }
      
      const now = new Date()
      const diffTime = dateObj.getTime() - now.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays <= 0) return "Resets today"
      if (diffDays === 1) return "Resets tomorrow"
      return `Resets in ${diffDays} days`
    } catch (error) {
      console.error('Error formatting reset date:', error, 'Date value:', date)
      return "Resets in 30 days"
    }
  }

  const getPlanDetails = () => {
    switch (tokenUsage.plan) {
      case "free":
        return {
          name: "Free",
          tokens: 50,
          price: "$0",
          features: ["Basic verification", "Standard response time", "Community support"]
        }
      case "pro":
        return {
          name: "Pro",
          tokens: 500,
          price: "$9.99/month",
          features: ["Advanced verification", "Faster response time", "Priority support", "Custom sources"]
        }
      case "enterprise":
        return {
          name: "Enterprise",
          tokens: 5000,
          price: "$49.99/month",
          features: ["Unlimited verification", "Instant response", "Dedicated support", "API access", "Custom integrations"]
        }
      default:
        return {
          name: "Free",
          tokens: 50,
          price: "$0",
          features: ["Basic verification", "Standard response time", "Community support"]
        }
    }
  }

  const planDetails = getPlanDetails()

  const handleUpgradeClick = () => {
    // Navigate to pricing page
    window.location.href = '/pricing'
  }

  return (
    <div className="space-y-4">
      {/* Sign-in Prompt for Unauthenticated Users */}
      {!isAuthenticated && (
        <Card className="p-4 border-orange-200 bg-orange-50">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-orange-600" />
            <div className="flex-1">
              <h3 className="font-semibold text-orange-800">Sign in Required</h3>
              <p className="text-sm text-orange-700">
                Please sign in to access your token usage and verification history.
              </p>
            </div>
            <Button 
              size="sm" 
              className="bg-orange-600 hover:bg-orange-700"
              onClick={() => window.location.href = '/Login'}
            >
              Sign In
            </Button>
          </div>
        </Card>
      )}

      {/* Token Usage Card */}
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900">Token Usage</h3>
          </div>
          <Badge 
            variant={isOutOfTokens() ? "destructive" : isLowTokens() ? "secondary" : "default"}
            className="text-xs"
          >
            {tokenUsage.plan === "free" ? "Free Plan" : `${tokenUsage.plan.toUpperCase()} Plan`}
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Used this month</span>
            <span className="font-medium">
              {tokenUsage.used} / {tokenUsage.total} tokens
            </span>
          </div>

          <Progress 
            value={getUsagePercentage()} 
            className={cn(
              "h-2",
              isOutOfTokens() ? "[&>div]:bg-red-500" : 
              isLowTokens() ? "[&>div]:bg-yellow-500" : 
              "[&>div]:bg-blue-500"
            )}
          />

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{getRemainingTokens()} tokens remaining</span>
            <span>{formatResetDate(tokenUsage.resetDate)}</span>
          </div>

          {isLowTokens() && !isOutOfTokens() && (
            <div className="flex items-center gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
              <Info className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-yellow-800">
                Low on tokens! Consider upgrading for more.
              </span>
            </div>
          )}

          {isOutOfTokens() && (
            <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-md">
              <Info className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-800">
                Out of tokens! Upgrade to continue verifying.
              </span>
            </div>
          )}
        </div>
      </Card>



      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" size="sm" className="text-xs">
          <CreditCard className="w-4 h-4 mr-1" />
          Billing
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs"
          onClick={() => window.location.href = '/usage'}
        >
          <TrendingUp className="w-4 h-4 mr-1" />
          Usage History
        </Button>
      </div>
    </div>
  )
}
