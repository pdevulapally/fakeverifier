"use client"

import { useState, useEffect } from "react"
import {
  Bot,
  History,
  Settings,
  HelpCircle,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Plus,
  Trash2,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

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

interface VerifySidebarProps {
  onNewVerification?: () => void
  onHistoryItemClick?: (item: VerificationHistory) => void
  verificationHistory?: VerificationHistory[]
  onClearHistory?: () => void
  isLoading?: boolean
}

export function VerifySidebar({ 
  onNewVerification, 
  onHistoryItemClick, 
  verificationHistory = [], 
  onClearHistory,
  isLoading = false
}: VerifySidebarProps) {
  const [history, setHistory] = useState<VerificationHistory[]>([])

  // Update local history when prop changes
  useEffect(() => {
    if (verificationHistory) {
      setHistory(verificationHistory)
    }
  }, [verificationHistory])

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case "real":
        return <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
      case "likely-real":
        return <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
      case "likely-fake":
        return <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
      case "fake":
        return <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
      case "questionable":
        return <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
      case "ai-generated":
        return <Bot className="w-4 h-4 text-purple-600 flex-shrink-0" />
      default:
        return null
    }
  }

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "real":
        return "bg-green-100 text-green-800"
      case "likely-real":
        return "bg-green-50 text-green-700"
      case "likely-fake":
        return "bg-red-50 text-red-700"
      case "fake":
        return "bg-red-100 text-red-800"
      case "questionable":
        return "bg-yellow-100 text-yellow-800"
      case "ai-generated":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
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

  const clearHistory = () => {
    setHistory([])
    if (onClearHistory) {
      onClearHistory()
    }
  }

  const handleNewVerification = () => {
    if (onNewVerification) {
      onNewVerification()
    }
  }

  const handleHistoryItemClick = (item: VerificationHistory) => {
    if (onHistoryItemClick) {
      onHistoryItemClick(item)
    }
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 flex-shrink-0">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold truncate">FakeVerifier</span>
            <span className="text-xs text-sidebar-foreground/70 truncate">AI News Verification</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="overflow-y-auto overflow-x-hidden">
        <SidebarGroup>
          <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleNewVerification}>
                  <Plus className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">New Verification</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <div className="flex items-center justify-between">
            <SidebarGroupLabel>Recent Verifications</SidebarGroupLabel>
            {history.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearHistory}
                className="h-6 w-6 p-0 text-sidebar-foreground/50 hover:text-sidebar-foreground flex-shrink-0"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
          </div>
          <SidebarGroupContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                  <div
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  />
                  <div
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                </div>
              </div>
            ) : history.length === 0 ? (
              <div className="px-2 py-4 text-center text-sm text-sidebar-foreground/50">
                <div className="truncate">No recent verifications</div>
                <div className="text-xs text-sidebar-foreground/30 mt-1 truncate">
                  Start by verifying your first news article
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-sidebar-border p-3 hover:bg-sidebar-accent/50 cursor-pointer transition-colors overflow-hidden"
                    onClick={() => handleHistoryItemClick(item)}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="text-sm font-medium leading-tight line-clamp-2 break-words min-w-0 flex-1">
                        {item.title}
                      </h4>
                      {getVerdictIcon(item.verdict)}
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <Badge className={`text-xs ${getVerdictColor(item.verdict)} truncate max-w-[120px]`}>
                        {item.score}% • {item.verdict}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-sidebar-foreground/50 flex-shrink-0">
                        <Clock className="w-3 h-3" />
                        <span className="truncate">{formatTimeAgo(item.timestamp)}</span>
                      </div>
                    </div>
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
                <SidebarMenuButton>
                  <History className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">Full History</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Settings className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <HelpCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">Help & Support</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className="p-2">
          <div className="rounded-lg bg-blue-50 p-3 text-center overflow-hidden">
            <Bot className="w-6 h-6 text-blue-600 mx-auto mb-1" />
            <p className="text-xs font-medium text-blue-900 truncate">AI-Powered</p>
            <p className="text-xs text-blue-700 truncate">Verification Ready</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
