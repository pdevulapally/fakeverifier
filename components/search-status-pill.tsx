/**
 * Search Status Pill Component
 * Shows whether AI-only or AI + Web evidence mode is being used
 */

import { Badge } from "@/components/ui/badge";
import { Search, Brain } from "lucide-react";

interface SearchStatusPillProps {
  mode: 'ai-only' | 'ai-plus-web';
  message: string;
  className?: string;
}

export function SearchStatusPill({ mode, message, className = "" }: SearchStatusPillProps) {
  const isWebMode = mode === 'ai-plus-web';
  
  return (
    <Badge 
      variant={isWebMode ? "default" : "secondary"}
      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium ${
        isWebMode 
          ? "bg-green-100 text-green-800 border-green-200" 
          : "bg-yellow-100 text-yellow-800 border-yellow-200"
      } ${className}`}
    >
      {isWebMode ? (
        <Search className="w-3 h-3" />
      ) : (
        <Brain className="w-3 h-3" />
      )}
      {message}
    </Badge>
  );
}
