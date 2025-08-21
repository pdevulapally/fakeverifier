"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTextareaResize } from "@/hooks/use-textarea-resize";
import { ArrowUpIcon, LinkIcon, Video } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type React from "react";
import { createContext, useContext, useState } from "react";

interface DetectedContent {
  links: string[]
  videoLinks: string[]
  images: File[]
  documents: File[]
}

interface ChatInputContextValue {
	value?: string;
	onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
	onSubmit?: () => void;
	loading?: boolean;
	onStop?: () => void;
	variant?: "default" | "unstyled";
	rows?: number;
	detectedContent?: DetectedContent;
}

const ChatInputContext = createContext<ChatInputContextValue>({});

interface ChatInputProps extends Omit<ChatInputContextValue, "variant"> {
	children: React.ReactNode;
	className?: string;
	variant?: "default" | "unstyled";
	rows?: number;
	detectedContent?: DetectedContent;
}

function ChatInput({
	children,
	className,
	variant = "default",
	value,
	onChange,
	onSubmit,
	loading,
	onStop,
	rows = 1,
	detectedContent,
}: ChatInputProps) {
	const contextValue: ChatInputContextValue = {
		value,
		onChange,
		onSubmit,
		loading,
		onStop,
		variant,
		rows,
		detectedContent,
	};

	return (
		<ChatInputContext.Provider value={contextValue}>
			<div className="space-y-2 sm:space-y-3">
				{/* Content Detection Indicators */}
				<AnimatePresence>
					{detectedContent && (detectedContent.links.length > 0 || detectedContent.videoLinks.length > 0) && (
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							className="flex flex-wrap gap-1 sm:gap-2"
						>
							{(["links", "videoLinks"] as const).map((type) => {
								const count = detectedContent[type]?.length || 0
								if (count === 0) return null

								return (
									<motion.div
										key={type}
										initial={{ scale: 0 }}
										animate={{ scale: 1 }}
										className="flex items-center gap-1"
									>
										<Badge variant="secondary" className="flex items-center gap-1 text-xs sm:text-sm px-2 py-1">
											<motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 0.5, repeat: 2 }}>
												{type === "videoLinks" ? <Video className="w-3 h-3 sm:w-4 sm:h-4" /> : <LinkIcon className="w-3 h-3 sm:w-4 sm:h-4" />}
											</motion.div>
											{count} {type === "videoLinks" ? "videos" : "links"}
										</Badge>
									</motion.div>
								)
							})}
						</motion.div>
					)}
				</AnimatePresence>

				{/* Input Area */}
				<div
					className={cn(
						variant === "default" &&
							"flex flex-col items-end w-full p-2 rounded-2xl border border-input bg-transparent focus-within:ring-1 focus-within:ring-ring focus-within:outline-none",
						variant === "unstyled" && "flex items-start gap-2 w-full",
						className,
					)}
				>
					{children}
				</div>
			</div>
		</ChatInputContext.Provider>
	);
}

ChatInput.displayName = "ChatInput";

interface ChatInputTextAreaProps extends React.ComponentProps<typeof Textarea> {
	value?: string;
	onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
	onSubmit?: () => void;
	variant?: "default" | "unstyled";
}

function ChatInputTextArea({
	onSubmit: onSubmitProp,
	value: valueProp,
	onChange: onChangeProp,
	className,
	variant: variantProp,
	...props
}: ChatInputTextAreaProps) {
	const context = useContext(ChatInputContext);
	const value = valueProp ?? context.value ?? "";
	const onChange = onChangeProp ?? context.onChange;
	const onSubmit = onSubmitProp ?? context.onSubmit;
	const rows = context.rows ?? 1;

	// Convert parent variant to textarea variant unless explicitly overridden
	const variant =
		variantProp ?? (context.variant === "default" ? "unstyled" : "default");

	const textareaRef = useTextareaResize(value, rows);
	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (!onSubmit) {
			return;
		}
		if (e.key === "Enter" && !e.shiftKey) {
			if (typeof value !== "string" || value.trim().length === 0) {
				return;
			}
			e.preventDefault();
			onSubmit();
		}
	};

	return (
		<Textarea
			ref={textareaRef}
			{...props}
			value={value}
			onChange={onChange}
			onKeyDown={handleKeyDown}
			className={cn(
				"max-h-[400px] min-h-0 resize-none overflow-x-hidden",
				variant === "unstyled" &&
					"border-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none",
				className,
			)}
			rows={rows}
		/>
	);
}

ChatInputTextArea.displayName = "ChatInputTextArea";

interface ChatInputSubmitProps extends React.ComponentProps<typeof Button> {
	onSubmit?: () => void;
	loading?: boolean;
	onStop?: () => void;
}

function ChatInputSubmit({
	onSubmit: onSubmitProp,
	loading: loadingProp,
	onStop: onStopProp,
	className,
	...props
}: ChatInputSubmitProps) {
	const context = useContext(ChatInputContext);
	const loading = loadingProp ?? context.loading;
	const onStop = onStopProp ?? context.onStop;
	const onSubmit = onSubmitProp ?? context.onSubmit;

	if (loading && onStop) {
		return (
			<Button
				onClick={onStop}
				className={cn(
					"h-10 w-10 sm:h-12 sm:w-12 p-0 rounded-2xl bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex-shrink-0 shadow-sm",
					className,
				)}
				{...props}
			>
				<motion.div 
					whileHover={{ scale: 1.05 }} 
					whileTap={{ scale: 0.95 }}
					className="flex items-center justify-center"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="currentColor"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-label="Stop"
						className="text-white"
					>
						<title>Stop</title>
						<rect x="6" y="6" width="12" height="12" />
					</svg>
				</motion.div>
			</Button>
		);
	}

	const isDisabled =
		typeof context.value !== "string" || context.value.trim().length === 0;

	return (
		<Button
			className={cn(
				"h-10 w-10 sm:h-12 sm:w-12 p-0 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex-shrink-0 shadow-sm",
				className,
			)}
			disabled={isDisabled}
			onClick={(event) => {
				event.preventDefault();
				if (!isDisabled) {
					onSubmit?.();
				}
			}}
			{...props}
		>
			<motion.div 
				whileHover={{ scale: 1.05 }} 
				whileTap={{ scale: 0.95 }}
				className="flex items-center justify-center"
			>
				<ArrowUpIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
			</motion.div>
		</Button>
	);
}

ChatInputSubmit.displayName = "ChatInputSubmit";

// Enhanced Chat Input Component with existing functionality
interface EnhancedChatInputProps {
  onSendMessage: (message: string, files: File[], detectedContent: DetectedContent) => void
  disabled?: boolean
  placeholder?: string
}

export function EnhancedChatInput({ onSendMessage, disabled, placeholder }: EnhancedChatInputProps) {
  const [message, setMessage] = useState("")
  const [detectedContent, setDetectedContent] = useState<DetectedContent>({
    links: [],
    videoLinks: [],
    images: [],
    documents: [],
  })

  // Detect content types in message
  const detectContent = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const videoRegex = /(youtube\.com|youtu\.be|vimeo\.com|tiktok\.com)/i

    const urls = text.match(urlRegex) || []
    const videoLinks = urls.filter((url) => videoRegex.test(url))
    const regularLinks = urls.filter((url) => !videoRegex.test(url))

    setDetectedContent((prev) => ({
      ...prev,
      links: regularLinks,
      videoLinks: videoLinks,
    }))
  }

  const handleMessageChange = (value: string) => {
    setMessage(value)
    detectContent(value)
  }

  const handleSend = () => {
    if (!message.trim() || disabled) return

    onSendMessage(message, [], detectedContent)
    setMessage("")
    setDetectedContent({
      links: [],
      videoLinks: [],
      images: [],
      documents: [],
    })
  }

  return (
    <ChatInput
      variant="default"
      value={message}
      onChange={(e) => handleMessageChange(e.target.value)}
      onSubmit={handleSend}
      loading={disabled}
      detectedContent={detectedContent}
    >
      <ChatInputTextArea placeholder={placeholder || "Paste content or share URLs to verify..."} />
      <ChatInputSubmit />
    </ChatInput>
  );
}
