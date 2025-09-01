"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, AlertTriangle, TrendingUp, Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface DailyLimitModalProps {
  isOpen: boolean
  onClose: () => void
  currentPlan: 'free' | 'pro' | 'enterprise'
  dailyUsed: number
  dailyLimit: number
  resetTime: Date
}

export function DailyLimitModal({ 
  isOpen, 
  onClose, 
  currentPlan, 
  dailyUsed, 
  dailyLimit, 
  resetTime 
}: DailyLimitModalProps) {
  const router = useRouter()
  const [isUpgrading, setIsUpgrading] = useState(false)

  const formatTimeUntilReset = () => {
    const now = new Date()
    const timeUntilReset = resetTime.getTime() - now.getTime()
    
    if (timeUntilReset <= 0) {
      return 'Reset now'
    }
    
    const hours = Math.floor(timeUntilReset / (1000 * 60 * 60))
    const minutes = Math.floor((timeUntilReset % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const handleUpgrade = async () => {
    setIsUpgrading(true)
    try {
      router.push('/pricing')
    } catch (error) {
      console.error('Error navigating to pricing:', error)
    } finally {
      setIsUpgrading(false)
    }
  }

  const getPlanInfo = () => {
    switch (currentPlan) {
      case 'free':
        return {
          name: 'Free Plan',
          dailyLimit: 5,
          monthlyLimit: 50,
          upgradeText: 'Upgrade to Pro for unlimited daily verifications',
          features: ['Unlimited daily verifications', 'Premium AI models', 'Priority support']
        }
      case 'pro':
        return {
          name: 'Pro Plan',
          dailyLimit: 50,
          monthlyLimit: 500,
          upgradeText: 'Upgrade to Enterprise for unlimited access',
          features: ['Unlimited verifications', 'Advanced analytics', 'API access']
        }
      default:
        return {
          name: 'Enterprise Plan',
          dailyLimit: 500,
          monthlyLimit: 5000,
          upgradeText: 'Contact support for custom limits',
          features: ['Custom limits', 'Dedicated support', 'Custom integrations']
        }
    }
  }

  const planInfo = getPlanInfo()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-[95vw]">
        <DialogHeader className="pb-3">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Daily Limit Reached
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Usage & Reset Info */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-3 bg-orange-50 border-orange-200">
              <div className="text-center">
                <div className="text-sm font-medium text-orange-800 mb-1">Today's Usage</div>
                <div className="text-lg font-bold text-orange-700">{dailyUsed}/{dailyLimit}</div>
                <div className="w-full bg-orange-200 rounded-full h-1.5 mt-2">
                  <div 
                    className="bg-orange-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((dailyUsed / dailyLimit) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </Card>

            <Card className="p-3 bg-blue-50 border-blue-200">
              <div className="text-center">
                <div className="text-sm font-medium text-blue-800 mb-1">Next Reset</div>
                <div className="text-lg font-bold text-blue-700">{formatTimeUntilReset()}</div>
                <div className="text-xs text-blue-600 mt-1">
                  {resetTime.toLocaleDateString()}
                </div>
              </div>
            </Card>
          </div>

          {/* Upgrade Section */}
          {currentPlan === 'free' && (
            <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                <span className="font-semibold text-purple-800">Upgrade to Pro</span>
              </div>
              <p className="text-sm text-purple-700 mb-3">
                Get unlimited daily verifications and unlock premium features
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-purple-600">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full flex-shrink-0" />
                  Unlimited daily verifications
                </div>
                <div className="flex items-center gap-2 text-xs text-purple-600">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full flex-shrink-0" />
                  Premium AI models for better accuracy
                </div>
                <div className="flex items-center gap-2 text-xs text-purple-600">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full flex-shrink-0" />
                  Priority support & faster response times
                </div>
              </div>
              <Button 
                onClick={handleUpgrade}
                disabled={isUpgrading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isUpgrading ? 'Redirecting...' : 'Upgrade Now'}
              </Button>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
