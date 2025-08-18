"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  Cookie, 
  Settings, 
  X, 
  Check,
  Info,
  Shield,
  BarChart3,
  Users
} from "lucide-react"
import Link from "next/link"

interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  functional: boolean
}

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true, can't be disabled
    analytics: false,
    marketing: false,
    functional: false
  })

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookieConsent')
    if (!cookieConsent) {
      setShowBanner(true)
    }
  }, [])

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true
    }
    saveCookiePreferences(allAccepted)
    setShowBanner(false)
  }

  const handleAcceptNecessary = () => {
    const necessaryOnly: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    }
    saveCookiePreferences(necessaryOnly)
    setShowBanner(false)
  }

  const handleSavePreferences = () => {
    saveCookiePreferences(preferences)
    setShowPreferences(false)
    setShowBanner(false)
  }

  const saveCookiePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookieConsent', JSON.stringify({
      preferences: prefs,
      timestamp: new Date().toISOString()
    }))
    
    // Here you would typically set actual cookies based on preferences
    if (prefs.analytics) {
      // Enable analytics cookies
      console.log('Analytics cookies enabled')
    }
    if (prefs.marketing) {
      // Enable marketing cookies
      console.log('Marketing cookies enabled')
    }
    if (prefs.functional) {
      // Enable functional cookies
      console.log('Functional cookies enabled')
    }
  }

  const updatePreference = (key: keyof CookiePreferences, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }))
  }

  if (!showBanner) return null

  return (
    <>
      {/* Mobile-First Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-gray-200 shadow-lg">
        <Card className="max-w-4xl mx-auto">
          <div className="p-4 sm:p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0">
                <Cookie className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  We use cookies to enhance your experience
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  We use cookies and similar technologies to help personalize content, 
                  provide and improve our services, and analyze our traffic. 
                  By clicking "Accept All", you consent to our use of cookies.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    onClick={handleAcceptAll}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Accept All
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={handleAcceptNecessary}
                    className="w-full sm:w-auto"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Necessary Only
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShowPreferences(true)}
                    className="w-full sm:w-auto"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Customize
                  </Button>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBanner(false)}
                className="flex-shrink-0 -mt-1 -mr-1"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-xs text-gray-500">
              By continuing to use our site, you agree to our{" "}
              <Link href="/cookie-policy" className="text-blue-600 hover:underline">
                Cookie Policy
              </Link>
              {" "}and{" "}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
            </div>
          </div>
        </Card>
      </div>

      {/* Cookie Preferences Dialog */}
      <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Cookie Preferences
            </DialogTitle>
            <DialogDescription>
              Choose which types of cookies you want to allow. You can change these 
              settings at any time by visiting our Cookie Policy.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Necessary Cookies */}
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 mt-1">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Necessary Cookies</Label>
                  <Switch checked={true} disabled />
                </div>
                <p className="text-xs text-gray-600">
                  These cookies are essential for the website to function properly. 
                  They cannot be disabled.
                </p>
              </div>
            </div>

            {/* Analytics Cookies */}
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <div className="flex-shrink-0 mt-1">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Analytics Cookies</Label>
                  <Switch 
                    checked={preferences.analytics}
                    onCheckedChange={(checked) => updatePreference('analytics', checked)}
                  />
                </div>
                <p className="text-xs text-gray-600">
                  Help us understand how visitors interact with our website by 
                  collecting and reporting information anonymously.
                </p>
              </div>
            </div>

            {/* Functional Cookies */}
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <div className="flex-shrink-0 mt-1">
                <Settings className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Functional Cookies</Label>
                  <Switch 
                    checked={preferences.functional}
                    onCheckedChange={(checked) => updatePreference('functional', checked)}
                  />
                </div>
                <p className="text-xs text-gray-600">
                  Enable enhanced functionality and personalization, such as 
                  remembering your preferences and settings.
                </p>
              </div>
            </div>

            {/* Marketing Cookies */}
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <div className="flex-shrink-0 mt-1">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Marketing Cookies</Label>
                  <Switch 
                    checked={preferences.marketing}
                    onCheckedChange={(checked) => updatePreference('marketing', checked)}
                  />
                </div>
                <p className="text-xs text-gray-600">
                  Used to track visitors across websites to display relevant 
                  advertisements and measure campaign effectiveness.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowPreferences(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSavePreferences}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
            >
              Save Preferences
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
