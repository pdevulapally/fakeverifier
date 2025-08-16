"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  ArrowLeft,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Download,
  Upload,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Mail,
  Key,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  Settings as SettingsIcon,
  CreditCard,
  HelpCircle,
  LogOut,
  AlertTriangle
} from "lucide-react"
import { getCurrentUser, signOutUser, onAuthStateChange, db } from "@/lib/firebase"
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore"
import { deleteUser } from "firebase/auth"
import Link from "next/link"

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [profileData, setProfileData] = useState<{
    displayName: string;
    email: string;
    phoneNumber: string;
    bio: string;
  }>({
    displayName: '',
    email: '',
    phoneNumber: '',
    bio: ''
  })
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      verificationComplete: true,
      lowTokens: true,
      weeklyReport: false
    },
    appearance: {
      theme: 'light',
      compactMode: false,
      showAnimations: true
    },
    privacy: {
      shareAnalytics: true,
      allowCookies: true,
      publicProfile: false
    },
    verification: {
      autoSave: true,
      defaultLanguage: 'en',
      maxFileSize: 10
    }
  })

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChange((currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        // Initialize profile data with user data
        setProfileData({
          displayName: currentUser.displayName || '',
          email: currentUser.email || '',
          phoneNumber: currentUser.phoneNumber || '',
          bio: (currentUser as any).bio || ''
        })
      } else {
        setUser(null)
        // Redirect to login if no user
        window.location.href = '/Login'
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleSignOut = async () => {
    try {
      await signOutUser()
      window.location.href = '/Login'
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleSaveProfile = async () => {
    try {
      // Here you would typically update the user profile in Firebase
      // For now, we'll just update the local state
      setUser(prev => ({
        ...prev,
        displayName: profileData.displayName,
        email: profileData.email,
        phoneNumber: profileData.phoneNumber
      }))
      setIsEditingProfile(false)
      // You could add a toast notification here
      console.log('Profile updated successfully')
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const handleCancelEdit = () => {
    // Reset profile data to current user data
          setProfileData((prev) => ({
        ...prev,
        displayName: user?.displayName || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
        bio: (user as any)?.bio || ''
      }))
    setIsEditingProfile(false)
  }

  const handleDeleteAccount = async () => {
    if (!user) return
    
    setIsDeleting(true)
    try {
      // Delete all user data from Firestore collections
      await deleteUserData(user.uid)
      
      // Delete the user account from Firebase Auth
      await deleteUser(user)
      
      // Redirect to login page
      window.location.href = '/Login'
    } catch (error: any) {
      console.error('Error deleting account:', error)
      alert(`Error deleting account: ${error.message}`)
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const deleteUserData = async (userId: string) => {
    try {
      // Delete all verifications for the user
      const verificationsQuery = query(
        collection(db, 'verifications'),
        where('userId', '==', userId)
      )
      const verificationsSnapshot = await getDocs(verificationsQuery)
      const verificationDeletions = verificationsSnapshot.docs.map(doc => 
        deleteDoc(doc.ref)
      )
      await Promise.all(verificationDeletions)
      console.log(`Deleted ${verificationsSnapshot.size} verification records`)

      // Delete token usage data for the user
      const tokenUsageQuery = query(
        collection(db, 'tokenUsage'),
        where('userId', '==', userId)
      )
      const tokenUsageSnapshot = await getDocs(tokenUsageQuery)
      const tokenUsageDeletions = tokenUsageSnapshot.docs.map(doc => 
        deleteDoc(doc.ref)
      )
      await Promise.all(tokenUsageDeletions)
      console.log(`Deleted ${tokenUsageSnapshot.size} token usage records`)

      // Delete user profile data if it exists
      const userProfileRef = doc(db, 'users', userId)
      try {
        await deleteDoc(userProfileRef)
        console.log('Deleted user profile')
      } catch (error) {
        // User profile might not exist, which is fine
        console.log('User profile not found or already deleted')
      }

      console.log('All user data deleted successfully')
    } catch (error) {
      console.error('Error deleting user data:', error)
      throw error
    }
  }

  const getUserInitials = (user: any) => {
    if (user?.displayName) {
      return user.displayName.split(' ').map((name: string) => name[0]).join('').toUpperCase().slice(0, 2)
    }
    if (user?.email) {
      return user.email[0].toUpperCase()
    }
    return 'U'
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown'
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch (error) {
      return 'Unknown'
    }
  }

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" />
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/verify">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Verify
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
                <p className="text-sm text-gray-500">Manage your preferences and account</p>
              </div>
            </div>
            <Button onClick={handleSignOut} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* Account Information */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold">Account Information</h2>
              </div>
              {!isEditingProfile && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsEditingProfile(true)}
                >
                  <User className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
            
            {!isEditingProfile ? (
              // Display Mode
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    {user?.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt={user.displayName || 'User'} 
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-semibold text-blue-600">
                        {getUserInitials(user)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {user?.displayName || 'User'}
                    </h3>
                    <p className="text-gray-600">{user?.email}</p>
                    {user?.phoneNumber && (
                      <p className="text-sm text-gray-500">{user.phoneNumber}</p>
                    )}
                    <p className="text-sm text-gray-500">
                      Member since {formatDate(user?.metadata?.creationTime)}
                    </p>
                    {user?.emailVerified && (
                      <Badge className="bg-green-100 text-green-800 text-xs mt-1">
                        Email Verified
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Display Name</Label>
                    <p className="text-gray-900">{user?.displayName || 'Not set'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Email</Label>
                    <p className="text-gray-900">{user?.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Phone Number</Label>
                    <p className="text-gray-900">{user?.phoneNumber || 'Not set'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Account Type</Label>
                    <p className="text-gray-900">
                      {user?.providerData?.[0]?.providerId === 'google.com' ? 'Google' : 
                       user?.providerData?.[0]?.providerId === 'facebook.com' ? 'Facebook' : 
                       'Email'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              // Edit Mode
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    {user?.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt={user.displayName || 'User'} 
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-semibold text-blue-600">
                        {getUserInitials(user)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">Edit Profile</h3>
                    <p className="text-sm text-gray-500">Update your account information</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={profileData.displayName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
                      placeholder="Enter your display name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      value={profileData.phoneNumber}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Input
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell us about yourself"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4 border-t">
                  <Button onClick={handleSaveProfile} className="bg-blue-600 hover:bg-blue-700">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Notifications */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-semibold">Notifications</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-gray-500">Receive notifications via email</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.notifications.email}
                  onCheckedChange={(checked) => updateSetting('notifications', 'email', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <p className="text-sm text-gray-500">Receive notifications in browser</p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={settings.notifications.push}
                  onCheckedChange={(checked) => updateSetting('notifications', 'push', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="verification-complete">Verification Complete</Label>
                  <p className="text-sm text-gray-500">Notify when verification is finished</p>
                </div>
                <Switch
                  id="verification-complete"
                  checked={settings.notifications.verificationComplete}
                  onCheckedChange={(checked) => updateSetting('notifications', 'verificationComplete', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="low-tokens">Low Token Alerts</Label>
                  <p className="text-sm text-gray-500">Notify when running low on tokens</p>
                </div>
                <Switch
                  id="low-tokens"
                  checked={settings.notifications.lowTokens}
                  onCheckedChange={(checked) => updateSetting('notifications', 'lowTokens', checked)}
                />
              </div>
            </div>
          </Card>

          {/* Appearance */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Palette className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold">Appearance</h2>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="theme">Theme</Label>
                <select
                  id="theme"
                  value={settings.appearance.theme}
                  onChange={(e) => updateSetting('appearance', 'theme', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="compact-mode">Compact Mode</Label>
                  <p className="text-sm text-gray-500">Reduce spacing for more content</p>
                </div>
                <Switch
                  id="compact-mode"
                  checked={settings.appearance.compactMode}
                  onCheckedChange={(checked) => updateSetting('appearance', 'compactMode', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="animations">Show Animations</Label>
                  <p className="text-sm text-gray-500">Enable smooth transitions and animations</p>
                </div>
                <Switch
                  id="animations"
                  checked={settings.appearance.showAnimations}
                  onCheckedChange={(checked) => updateSetting('appearance', 'showAnimations', checked)}
                />
              </div>
            </div>
          </Card>

          {/* Privacy & Security */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-red-600" />
              <h2 className="text-lg font-semibold">Privacy & Security</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="share-analytics">Share Analytics</Label>
                  <p className="text-sm text-gray-500">Help improve the service with anonymous data</p>
                </div>
                <Switch
                  id="share-analytics"
                  checked={settings.privacy.shareAnalytics}
                  onCheckedChange={(checked) => updateSetting('privacy', 'shareAnalytics', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="allow-cookies">Allow Cookies</Label>
                  <p className="text-sm text-gray-500">Store preferences and session data</p>
                </div>
                <Switch
                  id="allow-cookies"
                  checked={settings.privacy.allowCookies}
                  onCheckedChange={(checked) => updateSetting('privacy', 'allowCookies', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="public-profile">Public Profile</Label>
                  <p className="text-sm text-gray-500">Allow others to see your verification history</p>
                </div>
                <Switch
                  id="public-profile"
                  checked={settings.privacy.publicProfile}
                  onCheckedChange={(checked) => updateSetting('privacy', 'publicProfile', checked)}
                />
              </div>
            </div>
          </Card>

          {/* Verification Settings */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <SettingsIcon className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg font-semibold">Verification Settings</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-save">Auto Save</Label>
                  <p className="text-sm text-gray-500">Automatically save verification results</p>
                </div>
                <Switch
                  id="auto-save"
                  checked={settings.verification.autoSave}
                  onCheckedChange={(checked) => updateSetting('verification', 'autoSave', checked)}
                />
              </div>
              <div>
                <Label htmlFor="language">Default Language</Label>
                <select
                  id="language"
                  value={settings.verification.defaultLanguage}
                  onChange={(e) => updateSetting('verification', 'defaultLanguage', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
              <div>
                <Label htmlFor="max-file-size">Max File Size (MB)</Label>
                <Input
                  id="max-file-size"
                  type="number"
                  value={settings.verification.maxFileSize}
                  onChange={(e) => updateSetting('verification', 'maxFileSize', parseInt(e.target.value))}
                  className="mt-1"
                  min="1"
                  max="50"
                />
              </div>
            </div>
          </Card>

          {/* Data Management */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Download className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold">Data Management</h2>
            </div>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Import Data
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear History
                </Button>
              </div>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="p-6 border-red-200 bg-red-50">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h2 className="text-lg font-semibold text-red-800">Danger Zone</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-red-700 mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button 
                  variant="destructive" 
                  onClick={() => setShowDeleteDialog(true)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Delete Account
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Are you absolutely sure you want to delete your account? This action cannot be undone. 
              This will permanently delete:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
              Your account and authentication data
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
              All your verification history
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
              Your token usage and subscription data
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
              All associated files and documents
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
