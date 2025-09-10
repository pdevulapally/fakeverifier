"use client";

import { ArrowRight, Bot, Check, ChevronDown, Paperclip } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

import { useAuth } from "@/lib/auth-context";
import { MODEL_CONFIG, getUserTier } from "@/lib/model-selection";
import { useUTM, utmParamsToSearchString } from "@/lib/utm-context";

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

interface UseAutoResizeTextareaProps {
    minHeight: number;
    maxHeight?: number;
}

function useAutoResizeTextarea({
    minHeight,
    maxHeight,
}: UseAutoResizeTextareaProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = useCallback(
        (reset?: boolean) => {
            const textarea = textareaRef.current;
            if (!textarea) return;

            if (reset) {
                textarea.style.height = `${minHeight}px`;
                return;
            }

            textarea.style.height = `${minHeight}px`;

            const newHeight = Math.max(
                minHeight,
                Math.min(
                    textarea.scrollHeight,
                    maxHeight ?? Number.POSITIVE_INFINITY
                )
            );

            textarea.style.height = `${newHeight}px`;
        },
        [minHeight, maxHeight]
    );

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = `${minHeight}px`;
        }
    }, [minHeight]);

    useEffect(() => {
        const handleResize = () => adjustHeight();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [adjustHeight]);

    return { textareaRef, adjustHeight };
}

const OPENAI_ICON = (
    <>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 256 260"
            aria-label="OpenAI Icon"
            className="w-4 h-4 dark:hidden block"
        >
            <title>OpenAI Icon Light</title>
            <path d="M239.184 106.203a64.716 64.716 0 0 0-5.576-53.103C219.452 28.459 191 15.784 163.213 21.74A65.586 65.586 0 0 0 52.096 45.22a64.716 64.716 0 0 0-43.23 31.36c-14.31 24.602-11.061 55.634 8.033 76.74a64.665 64.665 0 0 0 5.525 53.102c14.174 24.65 42.644 37.324 70.446 31.36a64.72 64.72 0 0 0 48.754 21.744c28.481.025 53.714-18.361 62.414-45.481a64.767 64.767 0 0 0 43.229-31.36c14.137-24.558 10.875-55.423-8.083-76.483Zm-97.56 136.338a48.397 48.397 0 0 1-31.105-11.255l1.535-.87 51.67-29.825a8.595 8.595 0 0 0 4.247-7.367v-72.85l21.845 12.636c.218.111.37.32.409.563v60.367c-.056 26.818-21.783 48.545-48.601 48.601Zm-104.466-44.61a48.345 48.345 0 0 1-5.781-32.589l1.534.921 51.722 29.826a8.339 8.339 0 0 0 8.441 0l63.181-36.425v25.221a.87.87 0 0 1-.358.665l-52.335 30.184c-23.257 13.398-52.97 5.431-66.404-17.803ZM23.549 85.38a48.499 48.499 0 0 1 25.58-21.333v61.39a8.288 8.288 0 0 0 4.195 7.316l62.874 36.272-21.845 12.636a.819.819 0 0 1-.767 0L41.353 151.53c-23.211-13.454-31.171-43.144-17.804-66.405v.256Zm179.466 41.695-63.08-36.63L161.73 77.86a.819.819 0 0 1 .768 0l52.233 30.184a48.6 48.6 0 0 1-7.316 87.635v-61.391a8.544 8.544 0 0 0-4.4-7.213Zm21.742-32.69-1.535-.922-51.619-30.081a8.39 8.39 0 0 0-8.492 0L99.98 99.808V74.587a.716.716 0 0 1 .307-.665l52.233-30.133a48.652 48.652 0 0 1 72.236 50.391v.205ZM88.061 139.097l-21.845-12.585a.87.87 0 0 1-.41-.614V65.685a48.652 48.652 0 0 1 79.757-37.346l-1.535.87-51.67 29.825a8.595 8.595 0 0 0-4.246 7.367l-.051 72.697Zm11.868-25.58 28.138-16.217 28.188 16.218v32.434l-28.086 16.218-28.188-16.218-.052-32.434Z" />
        </svg>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 256 260"
            aria-label="OpenAI Icon"
            className="w-4 h-4 hidden dark:block"
        >
            <title>OpenAI Icon Dark</title>
            <path
                fill="#fff"
                d="M239.184 106.203a64.716 64.716 0 0 0-5.576-53.103C219.452 28.459 191 15.784 163.213 21.74A65.586 65.586 0 0 0 52.096 45.22a64.716 64.716 0 0 0-43.23 31.36c-14.31 24.602-11.061 55.634 8.033 76.74a64.665 64.665 0 0 0 5.525 53.102c14.174 24.65 42.644 37.324 70.446 31.36a64.72 64.72 0 0 0 48.754 21.744c28.481.025 53.714-18.361 62.414-45.481a64.767 64.767 0 0 0 43.229-31.36c14.137-24.558 10.875-55.423-8.083-76.483Zm-97.56 136.338a48.397 48.397 0 0 1-31.105-11.255l1.535-.87 51.67-29.825a8.595 8.595 0 0 0 4.247-7.367v-72.85l21.845 12.636c.218.111.37.32.409.563v60.367c-.056 26.818-21.783 48.545-48.601 48.601Zm-104.466-44.61a48.345 48.345 0 0 1-5.781-32.589l1.534.921 51.722 29.826a8.339 8.339 0 0 0 8.441 0l63.181-36.425v25.221a.87.87 0 0 1-.358.665l-52.335 30.184c-23.257 13.398-52.97 5.431-66.404-17.803ZM23.549 85.38a48.499 48.499 0 0 1 25.58-21.333v61.39a8.288 8.288 0 0 0 4.195 7.316l62.874 36.272-21.845 12.636a.819.819 0 0 1-.767 0L41.353 151.53c-23.211-13.454-31.171-43.144-17.804-66.405v.256Zm179.466 41.695-63.08-36.63L161.73 77.86a.819.819 0 0 1 .768 0l52.233 30.184a48.6 48.6 0 0 1-7.316 87.635v-61.391a8.544 8.544 0 0 0-4.4-7.213Zm21.742-32.69-1.535-.922-51.619-30.081a8.39 8.39 0 0 0-8.492 0L99.98 99.808V74.587a.716.716 0 0 1 .307-.665l52.233-30.133a48.652 48.652 0 0 1 72.236 50.391v.205ZM88.061 139.097l-21.845-12.585a.87.87 0 0 1-.41-.614V65.685a48.652 48.652 0 0 1 79.757-37.346l-1.535.87-51.67 29.825a8.595 8.595 0 0 0-4.246 7.367l-.051 72.697Zm11.868-25.58 28.138-16.217 28.188 16.218v32.434l-28.086 16.218-28.188-16.218-.052-32.434Z"
            />
        </svg>
    </>
);

export function AI_Prompt() {
    const [value, setValue] = useState("");
    const [error, setError] = useState("");
    const { textareaRef, adjustHeight } = useAutoResizeTextarea({
        minHeight: 72,
        maxHeight: 300,
    });
    const { user, loading } = useAuth();
    const router = useRouter();
    const { utmParams, hasUTMs } = useUTM();

    // Get user tier and available models
    const userTier = getUserTier(!!user, user);
    const availableModels = MODEL_CONFIG[userTier].models.default;
    
    // Create user-friendly model names
    const getModelDisplayName = (model: string) => {
        const modelMap: { [key: string]: string } = {
            'qwen/qwen3-coder:free': 'Qwen 3 Coder',
            'mistralai/mistral-7b-instruct:free': 'Mistral 7B',
            'meta-llama/llama-3.1-8b-instruct:free': 'Llama 3.1 8B',
            'google/gemma-2-9b-it:free': 'Gemma 2 9B',
            'gpt-4o': 'GPT-4o',
            'gpt-4o-search-preview': 'GPT-4o Search'
        };
        return modelMap[model] || model.split('/').pop()?.split(':')[0] || model;
    };

    const AI_MODELS = availableModels.map(model => ({
        value: model,
        label: getModelDisplayName(model)
    }));

    const [selectedModel, setSelectedModel] = useState(AI_MODELS[0]?.value || "qwen/qwen3-coder:free");

    // Get tier display info
    const tierInfo = userTier === 'FREE' ? { label: 'Free', color: 'text-yellow-500' } : { label: 'Pro', color: 'text-green-500' };

    const MODEL_ICONS: Record<string, React.ReactNode> = {
        "qwen/qwen3-coder:free": (
            <svg width="16" height="16" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
                <path d="M174.82 108.75L155.38 75L165.64 57.75C166.46 56.31 166.46 54.53 165.64 53.09L155.38 35.84C154.86 34.91 153.87 34.33 152.78 34.33H114.88L106.14 19.03C105.62 18.1 104.63 17.52 103.54 17.52H83.3C82.21 17.52 81.22 18.1 80.7 19.03L61.26 52.77H41.02C39.93 52.77 38.94 53.35 38.42 54.28L28.16 71.53C27.34 72.97 27.34 74.75 28.16 76.19L45.52 107.5L36.78 122.8C35.96 124.24 35.96 126.02 36.78 127.46L47.04 144.71C47.56 145.64 48.55 146.22 49.64 146.22H87.54L96.28 161.52C96.8 162.45 97.79 163.03 98.88 163.03H119.12C120.21 163.03 121.2 162.45 121.72 161.52L141.16 127.78H158.52C159.61 127.78 160.6 127.2 161.12 126.27L171.38 109.02C172.2 107.58 172.2 105.8 171.38 104.36L174.82 108.75Z" fill="url(#paint0_radial)"/>
                <path d="M119.12 163.03H98.88L87.54 144.71H49.64L61.26 126.39H80.7L38.42 55.29H61.26L83.3 19.03L93.56 37.35L83.3 55.29H161.58L151.32 72.54L170.76 106.28H151.32L141.16 88.34L101.18 163.03H119.12Z" fill="white"/>
                <path d="M127.86 79.83H76.14L101.18 122.11L127.86 79.83Z" fill="url(#paint1_radial)"/>
                <defs>
                    <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(100 100) rotate(90) scale(100)">
                        <stop stopColor="#665CEE"/>
                        <stop offset="1" stopColor="#332E91"/>
                    </radialGradient>
                    <radialGradient id="paint1_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(100 100) rotate(90) scale(100)">
                        <stop stopColor="#665CEE"/>
                        <stop offset="1" stopColor="#332E91"/>
                    </radialGradient>
                </defs>
            </svg>
        ),
        "mistralai/mistral-7b-instruct:free": (
            <svg width="16" height="16" viewBox="0 0 129 91" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
                <rect x="18.292" y="0" width="18.293" height="18.123" fill="#ffd800"/>
                <rect x="91.473" y="0" width="18.293" height="18.123" fill="#ffd800"/>
                <rect x="18.292" y="18.121" width="36.586" height="18.123" fill="#ffaf00"/>
                <rect x="73.181" y="18.121" width="36.586" height="18.123" fill="#ffaf00"/>
                <rect x="18.292" y="36.243" width="91.476" height="18.122" fill="#ff8205"/>
                <rect x="18.292" y="54.37" width="18.293" height="18.123" fill="#fa500f"/>
                <rect x="54.883" y="54.37" width="18.293" height="18.123" fill="#fa500f"/>
                <rect x="91.473" y="54.37" width="18.293" height="18.123" fill="#fa500f"/>
                <rect x="0" y="72.504" width="54.89" height="18.123" fill="#e10500"/>
                <rect x="73.181" y="72.504" width="54.89" height="18.123" fill="#e10500"/>
            </svg>
        ),
        "meta-llama/llama-3.1-8b-instruct:free": (
            <svg width="16" height="16" viewBox="0 0 290 191" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
                <defs>
                    <linearGradient id="Grad_Logo1" x1="61" y1="117" x2="259" y2="127" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#0064e1" offset="0"/>
                        <stop stopColor="#0064e1" offset="0.4"/>
                        <stop stopColor="#0073ee" offset="0.83"/>
                        <stop stopColor="#0082fb" offset="1"/>
                    </linearGradient>
                    <linearGradient id="Grad_Logo2" x1="45" y1="139" x2="45" y2="66" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#0082fb" offset="0"/>
                        <stop stopColor="#0064e0" offset="1"/>
                    </linearGradient>
                </defs>
                <path fill="#0081fb" d="m31.06,125.96c0,10.98 2.41,19.41 5.56,24.51 4.13,6.68 10.29,9.51 16.57,9.51 8.1,0 15.51-2.01 29.79-21.76 11.44-15.83 24.92-38.05 33.99-51.98l15.36-23.6c10.67-16.39 23.02-34.61 37.18-46.96 11.56-10.08 24.03-15.68 36.58-15.68 21.07,0 41.14,12.21 56.5,35.11 16.81,25.08 24.97,56.67 24.97,89.27 0,19.38-3.82,33.62-10.32,44.87-6.28,10.88-18.52,21.75-39.11,21.75l0-31.02c17.63,0 22.03-16.2 22.03-34.74 0-26.42-6.16-55.74-19.73-76.69-9.63-14.86-22.11-23.94-35.84-23.94-14.85,0-26.8,11.2-40.23,31.17-7.14,10.61-14.47,23.54-22.7,38.13l-9.06,16.05c-18.2,32.27-22.81,39.62-31.91,51.75-15.95,21.24-29.57,29.29-47.5,29.29-21.27,0-34.72-9.21-43.05-23.09-6.8-11.31-10.14-26.15-10.14-43.06z"/>
                <path fill="url(#Grad_Logo1)" d="m24.49,37.3c14.24-21.95 34.79-37.3 58.36-37.3 13.65,0 27.22,4.04 41.39,15.61 15.5,12.65 32.02,33.48 52.63,67.81l7.39,12.32c17.84,29.72 27.99,45.01 33.93,52.22 7.64,9.26 12.99,12.02 19.94,12.02 17.63,0 22.03-16.2 22.03-34.74l27.4-.86c0,19.38-3.82,33.62-10.32,44.87-6.28,10.88-18.52,21.75-39.11,21.75-12.8,0-24.14-2.78-36.68-14.61-9.64-9.08-20.91-25.21-29.58-39.71l-25.79-43.08c-12.94-21.62-24.81-37.74-31.68-45.04-7.39-7.85-16.89-17.33-32.05-17.33-12.27,0-22.69,8.61-31.41,21.78z"/>
                <path fill="url(#Grad_Logo2)" d="m82.35,31.23c-12.27,0-22.69,8.61-31.41,21.78-12.33,18.61-19.88,46.33-19.88,72.95 0,10.98 2.41,19.41 5.56,24.51l-26.48,17.44c-6.8-11.31-10.14-26.15-10.14-43.06 0-30.75 8.44-62.8 24.49-87.55 14.24-21.95 34.79-37.3 58.36-37.3z"/>
            </svg>
        ),
        "google/gemma-2-9b-it:free": (
            <svg height="16" width="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
                <title>Gemma</title>
                <defs>
                    <linearGradient id="lobe-icons-gemma-fill" x1="24.419%" x2="75.194%" y1="75.581%" y2="25.194%">
                        <stop offset="0%" stopColor="#446EFF"/>
                        <stop offset="36.661%" stopColor="#2E96FF"/>
                        <stop offset="83.221%" stopColor="#B1C5FF"/>
                    </linearGradient>
                </defs>
                <path d="M12.34 5.953a8.233 8.233 0 01-.247-1.125V3.72a8.25 8.25 0 015.562 2.232H12.34zm-.69 0c.113-.373.199-.755.257-1.145V3.72a8.25 8.25 0 00-5.562 2.232h5.304zm-5.433.187h5.373a7.98 7.98 0 01-.267.696 8.41 8.41 0 01-1.76 2.65L6.216 6.14zm-.264-.187H2.977v.187h2.915a8.436 8.436 0 00-2.357 5.767H0v.186h3.535a8.436 8.436 0 002.357 5.767H2.977v.186h2.976v2.977h.187v-2.915a8.436 8.436 0 005.767 2.357V24h.186v-3.535a8.436 8.436 0 005.767-2.357v2.915h.186v-2.977h2.977v-.186h-2.915a8.436 8.436 0 002.357-5.767H24v-.186h-3.535a8.436 8.436 0 00-2.357-5.767h2.915v-.187h-2.977V2.977h-.186v2.915a8.436 8.436 0 00-5.767-2.357V0h-.186v3.535A8.436 8.436 0 006.14 5.892V2.977h-.187v2.976zm6.14 14.326a8.25 8.25 0 005.562-2.233H12.34c-.108.367-.19.743-.247 1.126v1.107zm-.186-1.087a8.015 8.015 0 00-.258-1.146H6.345a8.25 8.25 0 005.562 2.233v-1.087zm-8.186-7.285h1.107a8.23 8.23 0 001.125-.247V6.345a8.25 8.25 0 00-2.232 5.562zm1.087.186H3.72a8.25 8.25 0 002.232 5.562v-5.304a8.012 8.012 0 00-1.145-.258zm15.47-.186a8.25 8.25 0 00-2.232-5.562v5.315c.367.108.743.19 1.126.247h1.107zm-1.086.186c-.39.058-.772.144-1.146.258v5.304a8.25 8.25 0 002.233-5.562h-1.087zm-1.332 5.69V12.41a7.97 7.97 0 00-.696.267 8.409 8.409 0 00-2.65 1.76l3.346 3.346zm0-6.18v-5.45l-.012-.013h-5.451c.076.235.162.468.26.696a8.698 8.698 0 001.819 2.688 8.698 8.698 0 002.688 1.82c.228.097.46.183.696.259zM6.14 17.848V12.41c.235.078.468.167.696.267a8.403 8.403 0 012.688 1.799 8.404 8.404 0 011.799 2.688c.1.228.19.46.267.696H6.152l-.012-.012zm0-6.245V6.326l3.29 3.29a8.716 8.716 0 01-2.594 1.728 8.14 8.14 0 01-.696.259zm6.257 6.257h5.277l-3.29-3.29a8.716 8.716 0 00-1.728 2.594 8.135 8.135 0 00-.259.696zm-2.347-7.81a9.435 9.435 0 01-2.88 1.96 9.14 9.14 0 012.88 1.94 9.14 9.14 0 011.94 2.88 9.435 9.435 0 011.96-2.88 9.14 9.14 0 012.88-1.94 9.435 9.435 0 01-2.88-1.96 9.434 9.434 0 01-1.96-2.88 9.14 9.14 0 01-1.94 2.88z" fill="url(#lobe-icons-gemma-fill)" fillRule="evenodd"/>
            </svg>
        ),
        "gpt-4o": OPENAI_ICON,
        "gpt-4o-search-preview": OPENAI_ICON,
    };

    // Validation function
    const validateInput = (text: string): { isValid: boolean; error?: string } => {
        const trimmed = text.trim();
        
        if (!trimmed) {
            return { isValid: false, error: "Please enter some text to verify" };
        }
        
        if (trimmed.length > 2000) {
            return { isValid: false, error: "Text must be 2000 characters or less" };
        }
        
        return { isValid: true };
    };

    // Handle form submission
    const handleSubmit = () => {
        const validation = validateInput(value);
        
        if (!validation.isValid) {
            setError(validation.error || "Invalid input");
            return;
        }
        
        setError("");
        const trimmedValue = value.trim();
        
        // Store the selected model and prompt for later use
        const promptData = {
            prompt: trimmedValue,
            model: selectedModel,
            timestamp: Date.now()
        };
        sessionStorage.setItem('pendingVerificationData', JSON.stringify(promptData));
        
        // Build URL with query parameter and UTM params
        const queryParam = `q=${encodeURIComponent(trimmedValue)}`;
        const utmSearchString = utmParamsToSearchString(utmParams);
        const allParams = utmSearchString ? `${queryParam}&${utmSearchString}` : queryParam;
        
        // Fire analytics event
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'hero_submit', {
                q_length: trimmedValue.length,
                utm_source: utmParams.utm_source || null,
                utm_campaign: utmParams.utm_campaign || null,
                utm_medium: utmParams.utm_medium || null,
            });
        }
        
        // Navigate to /verify with the query parameter and UTM params
        router.push(`/verify?${allParams}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey && value.trim()) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="w-full py-4">
            {/* Error message */}
            {error && (
                <div className="mb-3 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm">
                    {error}
                </div>
            )}
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-1.5 border border-white/20">
                <div className="relative">
                    <div className="relative flex flex-col">
                        <div
                            className="overflow-y-auto"
                            style={{ maxHeight: "400px" }}
                        >
                            <Textarea
                                id="ai-input-15"
                                value={value}
                                placeholder={"What news would you like me to verify?"}
                                className={cn(
                                    "w-full rounded-xl rounded-b-none px-4 py-3 bg-white/10 backdrop-blur-sm border-none text-white placeholder:text-white/70 resize-none focus-visible:ring-0 focus-visible:ring-offset-0",
                                    "min-h-[72px]",
                                    error && "border-red-500/50"
                                )}
                                ref={textareaRef}
                                onKeyDown={handleKeyDown}
                                onChange={(e) => {
                                    setValue(e.target.value);
                                    setError(""); // Clear error when user types
                                    adjustHeight();
                                }}
                            />
                        </div>

                        <div className="h-14 bg-white/10 backdrop-blur-sm rounded-b-xl flex items-center">
                            <div className="absolute left-3 right-3 bottom-3 flex items-center justify-between w-[calc(100%-24px)]">
                                <div className="flex items-center gap-2">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="flex items-center gap-1 h-8 pl-1 pr-2 text-xs rounded-md text-white hover:bg-white/20 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-blue-500"
                                            >
                                                <AnimatePresence mode="wait">
                                                    <motion.div
                                                        key={selectedModel}
                                                        initial={{
                                                            opacity: 0,
                                                            y: -5,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            y: 0,
                                                        }}
                                                        exit={{
                                                            opacity: 0,
                                                            y: 5,
                                                        }}
                                                        transition={{
                                                            duration: 0.15,
                                                        }}
                                                        className="flex items-center gap-1"
                                                    >
                                                         {
                                                             MODEL_ICONS[
                                                                 selectedModel
                                                             ]
                                                         }
                                                         {getModelDisplayName(selectedModel)}
                                                         <span className={`text-xs ${tierInfo.color} ml-1`}>
                                                             {tierInfo.label}
                                                         </span>
                                                         <ChevronDown className="w-3 h-3 opacity-50" />
                                                    </motion.div>
                                                </AnimatePresence>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            className={cn(
                                                "min-w-[10rem]",
                                                "border-white/20",
                                                "bg-gradient-to-b from-white via-white to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800"
                                            )}
                                        >
                                             {AI_MODELS.map((model) => (
                                                 <DropdownMenuItem
                                                     key={model.value}
                                                     onSelect={() =>
                                                         setSelectedModel(model.value)
                                                     }
                                                     className="flex items-center justify-between gap-2"
                                                 >
                                                     <div className="flex items-center gap-2">
                                                         {MODEL_ICONS[model.value] || (
                                                             <Bot className="w-4 h-4 opacity-50" />
                                                         )}
                                                         <span>{model.label}</span>
                                                         <span className={`text-xs ${tierInfo.color} ml-1`}>
                                                             {tierInfo.label}
                                                         </span>
                                                     </div>
                                                     {selectedModel ===
                                                         model.value && (
                                                         <Check className="w-4 h-4 text-blue-500" />
                                                     )}
                                                 </DropdownMenuItem>
                                             ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <div className="h-4 w-px bg-white/20 mx-0.5" />
                                    <label
                                        className={cn(
                                            "rounded-lg p-2 bg-white/10 cursor-pointer",
                                            "hover:bg-white/20 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-blue-500",
                                            "text-white/60 hover:text-white"
                                        )}
                                        aria-label="Attach file"
                                    >
                                        <input type="file" className="hidden" />
                                        <Paperclip className="w-4 h-4 transition-colors" />
                                    </label>
                                </div>
                                <button
                                    type="button"
                                    className={cn(
                                        "rounded-lg p-2 bg-white/10",
                                        "hover:bg-white/20 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-blue-500"
                                    )}
                                    aria-label="Send message"
                                    disabled={!value.trim()}
                                    onClick={handleSubmit}
                                >
                                    <ArrowRight
                                        className={cn(
                                            "w-4 h-4 text-white transition-opacity duration-200",
                                            value.trim()
                                                ? "opacity-100"
                                                : "opacity-30"
                                        )}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
