"use client"

import { useState, useRef, useEffect } from "react"
import { EnhancedChatInterface } from "@/components/enhanced-chat-interface"
import { TokenSystem } from "@/components/token-system"
import { ShareButton } from "@/components/share-button"
import { ChatShareButton } from "@/components/chat-share-button"
import { SidebarProvider, SidebarInset, SidebarTrigger, Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarSeparator, SidebarFooter, SidebarRail } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ProtectedRoute from "@/components/protected-route"
import { getVerificationHistory, saveVerificationData, deleteVerificationData, VerificationData, onAuthStateChange, getCurrentUser, signOutUser, getUserTokenUsage } from "@/lib/firebase"
import { formatTimeAgo } from "@/lib/utils"
import { Bot, Plus, FileText, Trash2, CheckCircle, XCircle, AlertTriangle, History, Settings, HelpCircle, Clock, Menu, X, User, LogOut, CreditCard, Shield, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

interface VerificationHistory {
  id: string
  title: string
  verdict: "real" | "likely-real" | "likely-fake" | "fake" | "questionable" | "ai-generated"
  score: number
  timestamp: Date
  content: string
  aiAnalysis?: any
  analysis?: any
  urlsAnalyzed?: string[]
  detectedContent?: any
}

export default function VerifyPage() {
  const [verificationHistory, setVerificationHistory] = useState<VerificationHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentVerification, setCurrentVerification] = useState<any>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [tokenRefreshTrigger, setTokenRefreshTrigger] = useState(0)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [currentMessages, setCurrentMessages] = useState<any[]>([])
  const chatInterfaceRef = useRef<any>(null)
  const [userPlan, setUserPlan] = useState('free')

  // Load verification history from Firebase on component mount
  useEffect(() => {
    // Listen for auth state changes and load history when user is authenticated
    const unsubscribe = onAuthStateChange((user) => {
      setCurrentUser(user)
      if (user) {
        loadVerificationHistory()
        loadUserPlan()
      } else {
        setVerificationHistory([])
        setIsLoading(false)
        setUserPlan('free')
      }
    })

    return () => unsubscribe()
  }, [])

  // Handle URL parameters for loading specific verification
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const loadId = urlParams.get('load')
    const isShared = urlParams.get('shared')
    
    if (loadId && verificationHistory.length > 0) {
      const item = verificationHistory.find(h => h.id === loadId)
      if (item && chatInterfaceRef.current) {
        chatInterfaceRef.current.loadVerification(item)
        // Clear the URL parameter
        window.history.replaceState({}, '', '/verify')
      }
    }
    
    // Handle shared verification data
    if (isShared === 'true') {
      try {
        const sharedDataStr = localStorage.getItem('sharedVerificationData')
        if (sharedDataStr) {
          const sharedData = JSON.parse(sharedDataStr)
          
          // Create a verification object from shared data
          const sharedVerification = {
            id: `shared-${sharedData.shareId}`,
            title: sharedData.verificationData?.title || 'Shared Verification',
            verdict: sharedData.verificationData?.verdict || 'unknown',
            score: sharedData.verificationData?.score || 0,
            timestamp: new Date(sharedData.verificationData?.timestamp || Date.now()),
            content: sharedData.verificationData?.content || '',
            aiAnalysis: sharedData.verificationData?.aiAnalysis,
            analysis: sharedData.verificationData?.analysis,
            urlsAnalyzed: sharedData.verificationData?.urlsAnalyzed,
            detectedContent: sharedData.verificationData?.detectedContent,
            messages: sharedData.messages || [],
            isShared: true
          }
          
          // Load the shared verification into the chat interface
          if (chatInterfaceRef.current) {
            chatInterfaceRef.current.loadVerification(sharedVerification)
          }
          
          // Clear the shared data from localStorage
          localStorage.removeItem('sharedVerificationData')
          
          // Clear the URL parameter
          window.history.replaceState({}, '', '/verify')
        }
      } catch (error) {
        console.error('Error loading shared verification:', error)
        // Clear the URL parameter even if there's an error
        window.history.replaceState({}, '', '/verify')
      }
    }
  }, [verificationHistory])

  const loadVerificationHistory = async () => {
    try {
      setIsLoading(true)
      const result = await getVerificationHistory(50)
      if (result.success) {
        // Convert VerificationData to VerificationHistory format for compatibility
        const history = result.data.map((item: VerificationData) => ({
          id: item.id,
          title: item.title,
          verdict: item.verdict,
          score: item.score,
          timestamp: item.timestamp,
          content: item.content,
          aiAnalysis: item.aiAnalysis,
          analysis: item.analysis,
          urlsAnalyzed: item.urlsAnalyzed,
          detectedContent: item.detectedContent,
        }))
        setVerificationHistory(history)
      } else {
        console.error('Failed to load verification history:', result.error)
      }
    } catch (error) {
      console.error('Error loading verification history:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadUserPlan = async () => {
    try {
      const result = await getUserTokenUsage()
      if (result.success) {
        const data = result.data as any
        setUserPlan(data.plan || 'free')
      }
    } catch (error) {
      console.error('Error loading user plan:', error)
    }
  }

  const handleNewVerification = () => {
    // Clear the chat interface for a new verification
    if (chatInterfaceRef.current) {
      chatInterfaceRef.current.clearChat()
    }
  }

  const handleHistoryItemClick = async (item: VerificationHistory) => {
    // Load the selected verification into the chat interface
    if (chatInterfaceRef.current) {
      chatInterfaceRef.current.loadVerification(item)
    }
  }

  const handleClearHistory = async () => {
    try {
      // Delete all verification data from Firebase
      const deletePromises = verificationHistory.map(async (item) => {
        const result = await deleteVerificationData(item.id)
        return { id: item.id, success: result.success, error: result.error }
      })
      
      const results = await Promise.all(deletePromises)
      const failedDeletions = results.filter(r => !r.success)
      
      if (failedDeletions.length > 0) {
        console.error('Some deletions failed:', failedDeletions)
        // Still clear local state but log the failures
      }
      
      setVerificationHistory([])
      console.log('Successfully cleared verification history')
    } catch (error) {
      console.error('Error clearing history:', error)
    }
  }

  const handleDeleteItem = async (id: string) => {
    try {
      const result = await deleteVerificationData(id)
      if (result.success) {
        // Only update local state if Firebase deletion was successful
        setVerificationHistory(prev => prev.filter(item => item.id !== id))
        
        // Reload verification history after a delay to account for Firebase's eventual consistency
        setTimeout(async () => {
          await loadVerificationHistory()
        }, 2000)
      } else {
        console.error('Failed to delete verification from Firebase:', result.error)
        // Show user feedback that deletion failed
        alert('Failed to delete verification. Please try again.')
      }
    } catch (error) {
      console.error('Error deleting verification:', error)
      alert('Error deleting verification. Please try again.')
    }
  }



  const handleTokenDepleted = () => {
    // Handle token depletion - show upgrade modal
    console.log('Tokens depleted')
  }

  const handleUpgradeClick = () => {
    // Handle upgrade click - show subscription modal
    console.log('Upgrade clicked')
  }

  const handleSignOut = async () => {
    try {
      await signOutUser()
      // User will be redirected by ProtectedRoute component
    } catch (error) {
      console.error('Error signing out:', error)
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

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`
    }
  }

  const handleMessagesUpdate = (messages: any[]) => {
    setCurrentMessages(messages)
  }

  const handleVerificationComplete = async (verificationData: {
    id: string
    title: string
    verdict: "real" | "likely-real" | "likely-fake" | "fake" | "questionable" | "ai-generated"
    score: number
    content: string
    aiAnalysis?: any
    analysis?: any
    urlsAnalyzed?: string[]
    detectedContent?: any
  }) => {
    try {
      setCurrentVerification(verificationData)
      // Save comprehensive verification data to Firebase
      const fullVerificationData: VerificationData = {
        id: verificationData.id,
        userId: '', // Will be set by Firebase function
        title: verificationData.title,
        content: verificationData.content,
        verdict: verificationData.verdict,
        score: verificationData.score,
        timestamp: new Date(),
        aiAnalysis: verificationData.aiAnalysis,
        analysis: verificationData.analysis,
        urlsAnalyzed: verificationData.urlsAnalyzed,
        detectedContent: verificationData.detectedContent,
      }

      const result = await saveVerificationData(fullVerificationData)
      if (result.success) {
        // Reload verification history to include the new item
        await loadVerificationHistory()
        // Trigger token refresh
        setTokenRefreshTrigger(prev => prev + 1)
      } else {
        console.error('Failed to save verification data:', result.error)
      }
    } catch (error) {
      console.error('Error saving verification data:', error)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {/* Mobile Header */}
        <header className="lg:hidden border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="lg:hidden">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0 flex flex-col h-full">
                                     <SheetHeader className="border-b p-4 flex-shrink-0">
                     <SheetTitle className="flex items-center justify-start pl-4">
                       <img 
                         src="/Images/Logo de FakeVerifier.png" 
                         alt="FakeVerifier Logo Icon" 
                         className="h-20 w-auto object-contain"
                       />
                     </SheetTitle>
                   </SheetHeader>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <TokenSystem 
                      onTokenDepleted={handleTokenDepleted}
                      onUpgradeClick={handleUpgradeClick}
                      refreshTrigger={tokenRefreshTrigger}
                    />
                    <Separator />
                    <div className="space-y-2">
                      <h3 className="font-semibold text-sm">Quick Actions</h3>
                      <div className="space-y-1">
                                                 <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleNewVerification}>
                           <Plus className="w-4 h-4 mr-2" />
                           New Verification
                         </Button>
                                                 <Button
                           variant="outline"
                           size="sm"
                           className="w-full justify-start"
                           onClick={() => {
                             window.location.href = '/recents'
                             setIsMobileMenuOpen(false)
                           }}
                         >
                           <History className="w-4 h-4 mr-2" />
                           Full History
                         </Button>
                         <Button
                           variant="outline"
                           size="sm"
                           className="w-full justify-start"
                           onClick={() => {
                             window.location.href = '/settings'
                             setIsMobileMenuOpen(false)
                           }}
                         >
                           <Settings className="w-4 h-4 mr-2" />
                           Settings
                         </Button>
                         <Button
                           variant="outline"
                           size="sm"
                           className="w-full justify-start"
                           onClick={() => {
                             window.location.href = '/help'
                             setIsMobileMenuOpen(false)
                           }}
                         >
                           <HelpCircle className="w-4 h-4 mr-2" />
                           Help & Support
                         </Button>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm">Recent Verifications</h3>
                        {verificationHistory.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClearHistory}
                            className="h-6 w-6 p-0"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                      {isLoading ? (
                        <div className="flex items-center justify-center py-4">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          </div>
                        </div>
                      ) : verificationHistory.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground">
                          <Bot className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No recent verifications</p>
                          <p className="text-xs">Start by verifying your first news article</p>
                        </div>
                      ) : (
                        <div className="space-y-1 max-h-60 overflow-y-auto">
                          {verificationHistory.slice(0, 5).map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                              onClick={() => {
                                handleHistoryItemClick(item)
                                setIsMobileMenuOpen(false)
                              }}
                            >
                              <div className="flex-shrink-0">
                                {item.verdict === "real" && <CheckCircle className="w-4 h-4 text-green-600" />}
                                {item.verdict === "likely-real" && <CheckCircle className="w-4 h-4 text-green-500" />}
                                {item.verdict === "likely-fake" && <XCircle className="w-4 h-4 text-red-500" />}
                                {item.verdict === "fake" && <XCircle className="w-4 h-4 text-red-600" />}
                                {item.verdict === "questionable" && <AlertTriangle className="w-4 h-4 text-yellow-600" />}
                                {item.verdict === "ai-generated" && <Bot className="w-4 h-4 text-purple-600" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{item.title}</p>
                                <div className="flex items-center justify-between">
                                  <Badge className={`text-xs ${
                                    item.verdict === "real" ? "bg-green-100 text-green-800" :
                                    item.verdict === "likely-real" ? "bg-green-50 text-green-700" :
                                    item.verdict === "likely-fake" ? "bg-red-50 text-red-700" :
                                    item.verdict === "fake" ? "bg-red-100 text-red-800" :
                                    item.verdict === "questionable" ? "bg-yellow-100 text-yellow-800" :
                                    "bg-purple-100 text-purple-800"
                                  }`}>
                                    {item.score}% • {item.verdict}
                                  </Badge>
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Clock className="w-3 h-3" />
                                    {formatTimeAgo(item.timestamp)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
                             <div className="flex items-center justify-center">
                 <img 
                   src="/Images/FakeVerifierlogoicon.png" 
                   alt="FakeVerifier Logo" 
                   className="h-17 w-auto object-contain"
                 />
               </div>
            </div>
            <div className="flex items-center gap-2">
              {currentMessages.length > 1 && (
                <ChatShareButton 
                  messages={currentMessages}
                  conversationTitle="FakeVerifier Chat"
                  className="flex"
                />
              )}
              
              {/* User Profile Dropdown */}
              {currentUser && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={currentUser.photoURL} alt={currentUser.displayName || currentUser.email} />
                        <AvatarFallback className="bg-blue-600 text-white text-xs font-medium">
                          {getUserInitials(currentUser)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {currentUser.displayName || 'User'}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {currentUser.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => window.location.href = '/settings'}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.location.href = '/settings'}>
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>Billing</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.location.href = '/settings'}>
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Security</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </header>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <SidebarProvider>
            <Sidebar>
              <SidebarRail />
                             <SidebarHeader className="border-b border-sidebar-border">
                 <div className="flex items-center justify-center py-1">
                   <img 
                     src="/Images/Logo de FakeVerifier.png" 
                     alt="FakeVerifier Logo Icon" 
                     className="h-24 w-auto object-contain flex-shrink-0"
                   />
                 </div>
               </SidebarHeader>
              <SidebarContent className="overflow-y-auto overflow-x-hidden">
                <SidebarGroup>
                  <SidebarGroupLabel>Token System</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <div className="p-2">
                      <TokenSystem 
                        onTokenDepleted={handleTokenDepleted}
                        onUpgradeClick={handleUpgradeClick}
                        refreshTrigger={tokenRefreshTrigger}
                      />
                    </div>
                  </SidebarGroupContent>
                </SidebarGroup>

                <SidebarSeparator />

                <SidebarGroup>
                  <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton onClick={handleNewVerification}>
                          <Plus className="w-4 h-4" />
                          <span>New Verification</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>


                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                <SidebarSeparator />

                <SidebarGroup>
                  <SidebarGroupLabel>Recent Verifications</SidebarGroupLabel>
                  <SidebarGroupContent>
                    {isLoading ? (
                      <div className="flex items-center justify-center py-4">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    ) : verificationHistory.length === 0 ? (
                      <div className="p-4 text-center text-sidebar-foreground/50">
                        <Bot className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No recent verifications</p>
                        <p className="text-xs">Start by verifying your first news article</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {verificationHistory.slice(0, 5).map((item) => (
                          <div
                            key={item.id}
                            className="group flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent cursor-pointer transition-colors relative"
                            onClick={() => handleHistoryItemClick(item)}
                          >
                            <div className="flex-shrink-0">
                              {item.verdict === "real" && <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />}
                              {item.verdict === "likely-real" && <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />}
                              {item.verdict === "likely-fake" && <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />}
                              {item.verdict === "fake" && <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />}
                              {item.verdict === "questionable" && <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0" />}
                              {item.verdict === "ai-generated" && <Bot className="w-4 h-4 text-purple-600 flex-shrink-0" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate break-words">{item.title}</p>
                              <div className="flex items-center justify-between gap-2">
                                <Badge className={`text-xs truncate max-w-[120px] ${
                                  item.verdict === "real" ? "bg-green-100 text-green-800" :
                                  item.verdict === "likely-real" ? "bg-green-50 text-green-700" :
                                  item.verdict === "likely-fake" ? "bg-red-50 text-red-700" :
                                  item.verdict === "fake" ? "bg-red-100 text-red-800" :
                                  item.verdict === "questionable" ? "bg-yellow-100 text-yellow-800" :
                                  "bg-purple-100 text-purple-800"
                                }`}>
                                  {item.score}% • {item.verdict}
                                </Badge>
                                <div className="flex items-center gap-1 text-xs text-sidebar-foreground/50 flex-shrink-0">
                                  <Clock className="w-3 h-3" />
                                  <span className="truncate">{formatTimeAgo(item.timestamp)}</span>
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteItem(item.id)
                              }}
                              className="h-6 w-6 p-0 text-sidebar-foreground/30 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </SidebarGroupContent>
                </SidebarGroup>

                <SidebarSeparator />

                <SidebarGroup>
                  <SidebarGroupLabel>Tools</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton onClick={() => window.location.href = '/recents'}>
                          <History className="w-4 h-4" />
                          <span>Full History</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      {userPlan !== 'free' ? (
                        <SidebarMenuItem>
                          <SidebarMenuButton onClick={() => window.location.href = '/usage'}>
                            <TrendingUp className="w-4 h-4" />
                            <span>Usage Analytics</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ) : (
                        <SidebarMenuItem>
                          <SidebarMenuButton disabled className="text-muted-foreground">
                            <TrendingUp className="w-4 h-4" />
                            <span>Usage Analytics (Pro+ Required)</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )}
                      <SidebarMenuItem>
                        <SidebarMenuButton onClick={() => window.location.href = '/settings'}>
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton onClick={() => window.location.href = '/help'}>
                          <HelpCircle className="w-4 h-4" />
                          <span>Help & Support</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>

              <SidebarFooter className="border-t border-sidebar-border">
                <div className="p-2">
                  <div className="rounded-lg bg-blue-50 p-3 text-center">
                    <Bot className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                    <p className="text-xs font-medium text-blue-900">AI-Powered</p>
                    <p className="text-xs text-blue-700">Verification Ready</p>
                  </div>
                </div>
              </SidebarFooter>
            </Sidebar>

            <SidebarInset>
              <div className="flex flex-col h-screen">
                <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <div className="flex h-14 items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                      <SidebarTrigger />
                      <Breadcrumb>
                        <BreadcrumbList>
                          <BreadcrumbItem>
                            <BreadcrumbLink href="/">Home</BreadcrumbLink>
                          </BreadcrumbItem>
                          <BreadcrumbSeparator />
                          <BreadcrumbItem>
                            <BreadcrumbPage>Verify</BreadcrumbPage>
                          </BreadcrumbItem>
                        </BreadcrumbList>
                      </Breadcrumb>
                    </div>
                    <div className="flex items-center gap-2">
                      {currentMessages.length > 1 && (
                        <ChatShareButton 
                          messages={currentMessages}
                          conversationTitle="FakeVerifier Chat"
                          className="flex"
                        />
                      )}
                      
                      {/* User Profile Dropdown */}
                      {currentUser && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={currentUser.photoURL} alt={currentUser.displayName || currentUser.email} />
                                <AvatarFallback className="bg-blue-600 text-white text-xs font-medium">
                                  {getUserInitials(currentUser)}
                                </AvatarFallback>
                              </Avatar>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                              <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">
                                  {currentUser.displayName || 'User'}
                                </p>
                                <p className="text-xs leading-none text-muted-foreground">
                                  {currentUser.email}
                                </p>
                              </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => window.location.href = '/settings'}>
                              <User className="mr-2 h-4 w-4" />
                              <span>Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => window.location.href = '/settings'}>
                              <CreditCard className="mr-2 h-4 w-4" />
                              <span>Billing</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => window.location.href = '/settings'}>
                              <Shield className="mr-2 h-4 w-4" />
                              <span>Security</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleSignOut}>
                              <LogOut className="mr-2 h-4 w-4" />
                              <span>Sign out</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                </header>
                <main className="flex-1 overflow-hidden">
                  <div className="h-full p-4 sm:p-6 overflow-hidden">
                    <EnhancedChatInterface
                      ref={chatInterfaceRef}
                      onVerificationComplete={handleVerificationComplete}
                      onMessagesUpdate={handleMessagesUpdate}
                    />
                  </div>
                </main>
              </div>
            </SidebarInset>
          </SidebarProvider>
        </div>

        {/* Mobile Main Content */}
        <main className="lg:hidden flex-1 overflow-hidden">
          <div className="h-[calc(100vh-4rem)] p-2 sm:p-4 overflow-hidden">
            <EnhancedChatInterface
              ref={chatInterfaceRef}
              onVerificationComplete={handleVerificationComplete}
              onMessagesUpdate={handleMessagesUpdate}
            />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
