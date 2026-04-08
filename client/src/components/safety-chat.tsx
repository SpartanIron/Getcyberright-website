"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, User, AlertTriangle, Loader2, RotateCcw, Image, XCircle, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/navigation";
import deziLogo from "@assets/Logo_A_1768679989734.png";
import { imgSrc } from "@/lib/img-src";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  displayedContent?: string;
  isTyping?: boolean;
  imagePreview?: string;
  timestamp?: Date;
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1">
      <span className="text-sm text-slate-600 dark:text-slate-300">Dezi is typing</span>
      <span className="flex gap-0.5">
        <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
      </span>
    </div>
  );
}

function cleanMarkdown(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/^[\s]*[-*]\s+/gm, '');
}

function TypewriterText({ content, onComplete }: { content: string; onComplete?: () => void }) {
  const cleanedContent = cleanMarkdown(content);
  const [displayedContent, setDisplayedContent] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    if (currentIndex < cleanedContent.length) {
      const charsToAdd = Math.min(3, cleanedContent.length - currentIndex);
      const delay = cleanedContent[currentIndex] === '\n' ? 50 : 15;
      
      const timer = setTimeout(() => {
        setDisplayedContent(cleanedContent.slice(0, currentIndex + charsToAdd));
        setCurrentIndex(prev => prev + charsToAdd);
      }, delay);
      
      return () => clearTimeout(timer);
    } else if (onComplete && currentIndex >= cleanedContent.length && cleanedContent.length > 0) {
      onComplete();
    }
  }, [cleanedContent, currentIndex, onComplete]);
  
  useEffect(() => {
    if (cleanedContent.length > displayedContent.length + 50) {
      setDisplayedContent(cleanedContent);
      setCurrentIndex(cleanedContent.length);
    }
  }, [cleanedContent, displayedContent.length]);
  
  return <>{displayedContent}<span className="animate-pulse">|</span></>;
}

export function SafetyChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const copyToClipboard = async (text: string, messageId: number) => {
    try {
      await navigator.clipboard.writeText(cleanMarkdown(text));
      setCopiedId(messageId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const formatTime = (date?: Date) => {
    if (!date) return "";
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const startConversation = async () => {
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Safety Chat" }),
      });
      const data = await res.json();
      setConversationId(data.id);
      return data.id;
    } catch (error) {
      console.error("Failed to start conversation:", error);
      return null;
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    let currentConvId = conversationId;
    if (!currentConvId) {
      currentConvId = await startConversation();
      if (!currentConvId) return;
    }

    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch(`/api/conversations/${currentConvId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: userMessage }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const assistantMsg: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: "",
        isTyping: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);

      const decoder = new TextDecoder();
      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsg.id
                ? { ...msg, isTyping: false }
                : msg
            )
          );
          break;
        }

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                fullContent += data.content;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMsg.id
                      ? { ...msg, content: fullContent }
                      : msg
                  )
                );
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          role: "assistant",
          content: "I'm sorry, I encountered an error. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (selectedImage) {
        sendImageMessage();
      } else if (input.trim()) {
        sendMessage();
      }
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of Array.from(items)) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          setSelectedImage(file);
          const reader = new FileReader();
          reader.onloadend = () => {
            setImagePreview(reader.result as string);
          };
          reader.readAsDataURL(file);
        }
        break;
      }
    }
  }, []);

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const sendImageMessage = async () => {
    if (!selectedImage || isLoading) return;

    let currentConvId = conversationId;
    if (!currentConvId) {
      currentConvId = await startConversation();
      if (!currentConvId) return;
    }

    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      content: input.trim() || "Analyzing this screenshot...",
      imagePreview: imagePreview || undefined,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    const formData = new FormData();
    formData.append("image", selectedImage);
    if (input.trim()) {
      formData.append("message", input.trim());
    }

    setInput("");
    clearImage();

    try {
      const response = await fetch(`/api/conversations/${currentConvId}/messages/image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to send image");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const assistantMsg: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: "",
        isTyping: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);

      const decoder = new TextDecoder();
      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsg.id
                ? { ...msg, isTyping: false }
                : msg
            )
          );
          break;
        }

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                fullContent += data.content;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMsg.id
                      ? { ...msg, content: fullContent }
                      : msg
                  )
                );
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error("Error sending image:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          role: "assistant",
          content: "I'm sorry, I had trouble analyzing that image. Could you try uploading it again or describe what you see?",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[max(env(safe-area-inset-top),44px)] sm:top-auto bottom-0 sm:inset-auto sm:bottom-24 sm:right-6 w-full sm:w-96 sm:h-[500px] bg-white dark:bg-slate-900 sm:rounded-2xl shadow-2xl border-t sm:border border-slate-200 dark:border-slate-700 flex flex-col z-50 overflow-hidden pb-[env(safe-area-inset-bottom)]"
          >
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                  <img src={imgSrc(deziLogo)} alt="Dezi" className="h-8 w-8 object-contain" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Dezi</h3>
                  <p className="text-xs text-teal-100">Your Safety Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {messages.length > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setMessages([]);
                      setConversationId(null);
                    }}
                    className="text-white hover:bg-white/20 active:bg-white/30 h-10 w-10 min-h-[44px] min-w-[44px]"
                    title="New conversation"
                  >
                    <RotateCcw className="h-5 w-5" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 active:bg-white/30 h-10 w-10 min-h-[44px] min-w-[44px]"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <img src={imgSrc(deziLogo)} alt="Dezi" className="h-16 w-16 mx-auto mb-3 object-contain" />
                  <h4 className="font-semibold text-slate-800 dark:text-white mb-2">
                    Hi, I'm Dezi! How can I help you stay safe?
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    Ask me about scams, online safety, parental controls, or any cybersecurity concerns.
                  </p>
                  <div className="space-y-2">
                    {[
                      "Is this text message a scam?",
                      "How do I set up parental controls?",
                      "What should I do if I was scammed?",
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => {
                          setInput(suggestion);
                          inputRef.current?.focus();
                        }}
                        className="block w-full text-left text-sm p-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-900/30 active:bg-teal-100 dark:active:bg-teal-900/50 transition-colors min-h-[44px]"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="h-8 w-8 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <img src={imgSrc(deziLogo)} alt="Dezi" className="h-6 w-6 object-contain" />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl ${
                        message.role === "user"
                          ? "bg-teal-600 text-white rounded-br-md"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-md"
                      }`}
                    >
                      {message.imagePreview && (
                        <img 
                          src={message.imagePreview} 
                          alt="Uploaded screenshot" 
                          className="max-w-full h-auto rounded-lg mb-2 max-h-32 object-contain"
                        />
                      )}
                      <p className="text-sm whitespace-pre-wrap">
                        {message.role === "assistant" && message.isTyping ? (
                          <TypewriterText content={message.content} />
                        ) : message.role === "assistant" ? (
                          cleanMarkdown(message.content)
                        ) : (
                          message.content
                        )}
                      </p>
                    </div>
                    <div className={`flex items-center gap-2 mt-1 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                      <span className="text-xs text-slate-400 dark:text-slate-500">{formatTime(message.timestamp)}</span>
                      {message.role === "assistant" && !message.isTyping && message.content && (
                        <button
                          onClick={() => copyToClipboard(message.content, message.id)}
                          className="text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 transition-colors p-1 rounded"
                          title="Copy response"
                          aria-label={copiedId === message.id ? "Copied" : "Copy response"}
                        >
                          {copiedId === message.id ? (
                            <Check className="h-3.5 w-3.5 text-green-500" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                  {message.role === "user" && (
                    <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex gap-3 justify-start">
                  <div className="h-8 w-8 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <img src={imgSrc(deziLogo)} alt="Dezi" className="h-6 w-6 object-contain" />
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl rounded-bl-md">
                    <TypingIndicator />
                  </div>
                </div>
              )}

              {messages.length > 0 && !isLoading && messages[messages.length - 1]?.role === "assistant" && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {[
                    "Tell me more",
                    "What else should I know?",
                    "How do I report this?",
                  ].map((chip) => (
                    <button
                      key={chip}
                      onClick={() => {
                        setInput(chip);
                        inputRef.current?.focus();
                      }}
                      className="text-xs px-3 py-1.5 rounded-full border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-900/30 active:bg-teal-100 transition-colors"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-3 w-3 text-amber-500" />
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  In an emergency?{" "}
                  <Link href="/emergency-help" className="text-teal-600 hover:underline" onClick={() => setIsOpen(false)}>
                    Get help now
                  </Link>
                </span>
              </div>
              
              {imagePreview && (
                <div className="relative mb-2 inline-block">
                  <img 
                    src={imagePreview} 
                    alt="Selected screenshot" 
                    className="h-16 w-auto rounded-lg object-contain border border-slate-300 dark:border-slate-600"
                  />
                  <button
                    onClick={clearImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                </div>
              )}
              
              <div className="flex gap-2 items-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  size="icon"
                  variant="outline"
                  className="rounded-full flex-shrink-0 h-11 w-11 min-h-[44px] min-w-[44px] active:scale-95 transition-transform"
                  title="Upload screenshot"
                >
                  <Image className="h-5 w-5" />
                </Button>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onPaste={handlePaste}
                  placeholder={selectedImage ? "Add a message (optional)..." : "Type or paste an image..."}
                  disabled={isLoading}
                  enterKeyHint="send"
                  className="flex-1 px-4 py-3 rounded-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
                />
                <Button
                  onClick={selectedImage ? sendImageMessage : sendMessage}
                  disabled={(!input.trim() && !selectedImage) || isLoading}
                  size="icon"
                  className="rounded-full bg-teal-600 hover:bg-teal-700 active:bg-teal-800 disabled:opacity-50 h-11 w-11 min-h-[44px] min-w-[44px] active:scale-95 transition-transform"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed right-4 sm:right-6 h-14 w-14 rounded-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg flex items-center justify-center z-50 hover:shadow-xl active:shadow-md transition-all ${isOpen ? 'hidden sm:flex' : 'flex'}`}
        style={{ bottom: 'max(1rem, env(safe-area-inset-bottom))' }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="h-10 w-10 rounded-full overflow-hidden"
            >
              <img src={imgSrc(deziLogo)} alt="Dezi" className="h-full w-full object-cover" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
