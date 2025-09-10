"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

interface UTMContextType {
  utmParams: UTMParams;
  setUTMParams: (params: UTMParams) => void;
  hasUTMs: boolean;
  clearUTMs: () => void;
}

const UTMContext = createContext<UTMContextType | undefined>(undefined);

const STORAGE_KEY = 'fakeverifier-utm-params';
const ALLOWED_UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

// Sanitize UTM parameters to only allow expected keys and escape values
function sanitizeUTMParams(params: Record<string, string>): UTMParams {
  const sanitized: UTMParams = {};
  
  for (const [key, value] of Object.entries(params)) {
    if (ALLOWED_UTM_KEYS.includes(key) && typeof value === 'string') {
      // Escape HTML entities and limit length
      const sanitizedValue = value
        .replace(/[<>\"'&]/g, (char) => {
          const escapeMap: Record<string, string> = {
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '&': '&amp;'
          };
          return escapeMap[char] || char;
        })
        .substring(0, 100); // Limit to 100 characters
      
      if (sanitizedValue.trim()) {
        sanitized[key as keyof UTMParams] = sanitizedValue.trim();
      }
    }
  }
  
  return sanitized;
}

// Parse UTM parameters from URL search params
function parseUTMFromURL(searchParams: URLSearchParams): UTMParams {
  const params: Record<string, string> = {};
  
  for (const [key, value] of searchParams.entries()) {
    if (ALLOWED_UTM_KEYS.includes(key)) {
      params[key] = value;
    }
  }
  
  return sanitizeUTMParams(params);
}

// Convert UTM params to URL search string
export function utmParamsToSearchString(utmParams: UTMParams): string {
  const params = new URLSearchParams();
  
  for (const [key, value] of Object.entries(utmParams)) {
    if (value) {
      params.append(key, value);
    }
  }
  
  return params.toString();
}

interface UTMProviderProps {
  children: ReactNode;
}

export function UTMProvider({ children }: UTMProviderProps) {
  const [utmParams, setUTMParamsState] = useState<UTMParams>({});

  // Load UTM params from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setUTMParamsState(sanitizeUTMParams(parsed));
        }
      } catch (error) {
        console.warn('Failed to load UTM params from sessionStorage:', error);
      }
    }
  }, []);

  // Save UTM params to sessionStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        if (Object.keys(utmParams).length > 0) {
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utmParams));
        } else {
          sessionStorage.removeItem(STORAGE_KEY);
        }
      } catch (error) {
        console.warn('Failed to save UTM params to sessionStorage:', error);
      }
    }
  }, [utmParams]);

  const setUTMParams = (params: UTMParams) => {
    setUTMParamsState(sanitizeUTMParams(params));
  };

  const clearUTMs = () => {
    setUTMParamsState({});
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  };

  const hasUTMs = Object.keys(utmParams).length > 0;

  const value: UTMContextType = {
    utmParams,
    setUTMParams,
    hasUTMs,
    clearUTMs,
  };

  return (
    <UTMContext.Provider value={value}>
      {children}
    </UTMContext.Provider>
  );
}

export function useUTM(): UTMContextType {
  const context = useContext(UTMContext);
  if (context === undefined) {
    throw new Error('useUTM must be used within a UTMProvider');
  }
  return context;
}

// Hook to initialize UTM params from URL (for use in pages)
export function useInitializeUTMFromURL() {
  const { setUTMParams } = useUTM();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const utmParams = parseUTMFromURL(urlParams);
      
      if (Object.keys(utmParams).length > 0) {
        setUTMParams(utmParams);
      }
    }
  }, [setUTMParams]);
}
