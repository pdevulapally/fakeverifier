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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Daily Limit Reached
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Current Usage */}
          <Card className="p-4 bg-orange-50 border-orange-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-orange-800">Today's Usage</span>
              <Badge variant="outline" className="text-orange-700 border-orange-300">
                {dailyUsed}/{dailyLimit} verifications
              </Badge>
            </div>
            <div className="w-full bg-orange-200 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((dailyUsed / dailyLimit) * 100, 100)}%` }}
              />
            </div>
          </Card>

          {/* Reset Timer */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Next Reset</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-700">
                {resetTime.toLocaleDateString()} at 12:00 AM
              </span>
            </div>
            <div className="mt-1 text-xs text-blue-600">
              Resets in {formatTimeUntilReset()}
            </div>
          </Card>

          {/* Upgrade Section */}
          {currentPlan === 'free' && (
            <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                <span className="font-semibold text-purple-800">Upgrade to Pro</span>
              </div>
              <p className="text-sm text-purple-700 mb-3">
                {planInfo.upgradeText}
              </p>
              <ul className="space-y-1 mb-4">
                {planInfo.features.map((feature, index) => (
                  <li key={index} className="text-xs text-purple-600 flex items-center gap-2">
                    <div className="w-1 h-1 bg-purple-400 rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button 
                onClick={handleUpgrade}
                disabled={isUpgrading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isUpgrading ? 'Redirecting...' : 'Upgrade Now'}
              </Button>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Close
            </Button>
            {currentPlan === 'free' && (
              <Button 
                onClick={handleUpgrade}
                disabled={isUpgrading}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                {isUpgrading ? 'Redirecting...' : 'View Plans'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
