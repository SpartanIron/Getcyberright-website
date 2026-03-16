import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  MessageCircle, 
  X, 
  Send, 
  Shield, 
  AlertTriangle,
  HelpCircle,
  ChevronDown,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import deziAvatar from "@/assets/images/dezi-avatar.png";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
  timestamp: Date;
}

const CONVERSATION_KEY = "dezi_conversation_id";
const MESSAGES_KEY = "dezi_messages";
const WELCOME_KEY = "dezi_welcomed_session";

function generatePassword(length: number = 16): string {
  const lowercase = "abcdefghijkmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const numbers = "23456789";
  const symbols = "!@#$%^&*";
  const allChars = lowercase + uppercase + numbers + symbols;
  let password = "";
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  return password.split("").sort(() => Math.random() - 0.5).join("");
}

function isPasswordRequest(text: string): boolean {
  const lower = text.toLowerCase();
  return lower.includes("password") && (lower.includes("generate") || lower.includes("create") || lower.includes("make") || lower.includes("new") || lower.includes("strong"));
}

function getLocalPasswordResponse(): string {
  const password = generatePassword(16);
  return `Here's a strong, randomly generated password for you:\n\n${password}\n\nIt's 16 characters with uppercase, lowercase, numbers, and symbols. Copy it somewhere safe. Want another one, or would you prefer to use our Password Generator tool for more options?`;
}

function getContextualPrompts(pathname: string): { text: string; icon: typeof Shield }[] {
  if (pathname.includes("scam-checker") || pathname.includes("tools")) {
    return [
      { text: "I got a suspicious text message", icon: AlertTriangle },
      { text: "Is this email real or fake?", icon: HelpCircle },
      { text: "Someone called claiming to be my bank", icon: Shield },
      { text: "Generate a strong password", icon: Shield },
    ];
  }
  if (pathname.includes("kids") || pathname.includes("parents")) {
    return [
      { text: "How do I keep my kids safe online?", icon: Shield },
      { text: "What parental controls should I use?", icon: HelpCircle },
      { text: "My child got a strange message", icon: AlertTriangle },
      { text: "Age-appropriate screen time rules", icon: Shield },
    ];
  }
  if (pathname.includes("seniors")) {
    return [
      { text: "How do I spot a phone scam?", icon: AlertTriangle },
      { text: "Is this call from Medicare real?", icon: HelpCircle },
      { text: "How to set up fraud alerts", icon: Shield },
      { text: "Someone wants my Social Security number", icon: AlertTriangle },
    ];
  }
  if (pathname.includes("data-removal")) {
    return [
      { text: "How do data brokers get my info?", icon: HelpCircle },
      { text: "What information is being sold about me?", icon: AlertTriangle },
      { text: "How do I remove myself from these sites?", icon: Shield },
      { text: "Is my personal data at risk?", icon: Shield },
    ];
  }
  return [
    { text: "I got a suspicious message", icon: AlertTriangle },
    { text: "How do I protect my family online?", icon: Shield },
    { text: "Generate a strong password", icon: Shield },
    { text: "What should I do if I clicked a bad link?", icon: HelpCircle },
  ];
}

function getContextualWelcome(pathname: string): string {
  if (pathname.includes("scam-checker") || pathname.includes("tools")) {
    return "Got something suspicious? Paste it here and I'll take a look.";
  }
  if (pathname.includes("kids") || pathname.includes("parents")) {
    return "Need help keeping your family safe online? I'm here for that.";
  }
  if (pathname.includes("seniors")) {
    return "Questions about staying safe from scams? I can help with that.";
  }
  if (pathname.includes("data-removal")) {
    return "Want to know who has your personal data? Ask me anything.";
  }
  return "Your AI safety assistant. Ask me anything about staying safe online.";
}

function saveMessages(messages: Message[]) {
  try {
    const toStore = messages.slice(-30).map(m => ({
      id: m.id,
      role: m.role,
      content: m.content,
      timestamp: m.timestamp.toISOString(),
    }));
    sessionStorage.setItem(MESSAGES_KEY, JSON.stringify(toStore));
  } catch { /* storage full or unavailable */ }
}

function loadMessages(): Message[] {
  try {
    const stored = sessionStorage.getItem(MESSAGES_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return parsed.map((m: any) => ({
      ...m,
      timestamp: new Date(m.timestamp),
      isStreaming: false,
    }));
  } catch {
    return [];
  }
}

function getConversationId(): number | null {
  try {
    const id = sessionStorage.getItem(CONVERSATION_KEY);
    return id ? parseInt(id) : null;
  } catch {
    return null;
  }
}

function setConversationId(id: number) {
  try {
    sessionStorage.setItem(CONVERSATION_KEY, id.toString());
  } catch { /* */ }
}

export function DeziAssistant() {
  const { user } = useAuth();
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showWelcomeBubble, setShowWelcomeBubble] = useState(false);
  const [messages, setMessages] = useState<Message[]>(loadMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [conversationId, setConvId] = useState<number | null>(getConversationId);
  const [aiAvailable, setAiAvailable] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (messages.length > 0) saveMessages(messages);
  }, [messages]);

  useEffect(() => {
    const handleInteraction = () => {
      setHasInteracted(true);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, []);

  useEffect(() => {
    const hasBeenWelcomed = sessionStorage.getItem(WELCOME_KEY);
    if (!hasBeenWelcomed) {
      const showTimer = setTimeout(() => {
        setShowWelcomeBubble(true);
        sessionStorage.setItem(WELCOME_KEY, "true");
        if (hasInteracted) {
          try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.setValueAtTime(880, ctx.currentTime);
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.3);
          } catch { /* */ }
        }
      }, 3000);
      const hideTimer = setTimeout(() => setShowWelcomeBubble(false), 11000);
      return () => { clearTimeout(showTimer); clearTimeout(hideTimer); };
    }
  }, [hasInteracted]);

  useEffect(() => {
    if (isOpen) setShowWelcomeBubble(false);
  }, [isOpen]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  const ensureConversation = async (): Promise<number> => {
    if (conversationId) return conversationId;
    const res = await fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ title: "Dezi Chat" }),
    });
    if (!res.ok) throw new Error("Failed to create conversation");
    const data = await res.json();
    const id = data.id;
    setConvId(id);
    setConversationId(id);
    return id;
  };

  const streamAIResponse = async (text: string, convId: number, messageId: string) => {
    abortRef.current = new AbortController();

    const res = await fetch(`/api/conversations/${convId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ content: text }),
      signal: abortRef.current.signal,
    });

    if (res.status === 404) {
      setConvId(null);
      try { sessionStorage.removeItem(CONVERSATION_KEY); } catch { /* */ }
      throw new Error("API error: 404");
    }
    if (!res.ok) throw new Error(`API error: ${res.status}`);

    const reader = res.body?.getReader();
    if (!reader) throw new Error("No response stream");

    const decoder = new TextDecoder();
    let fullContent = "";
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data: ")) continue;
        try {
          const data = JSON.parse(trimmed.slice(6));
          if (data.done) continue;
          if (data.error) throw new Error(data.error);
          if (data.content) {
            fullContent += data.content;
            const snapshot = fullContent;
            setMessages(prev =>
              prev.map(msg =>
                msg.id === messageId ? { ...msg, content: snapshot } : msg
              )
            );
          }
        } catch (e) {
          if (e instanceof SyntaxError) continue;
          throw e;
        }
      }
    }

    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, isStreaming: false } : msg
      )
    );
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    if (isPasswordRequest(text)) {
      await new Promise(r => setTimeout(r, 300));
      const response = getLocalPasswordResponse();
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }]);
      setIsTyping(false);
      return;
    }

    const messageId = (Date.now() + 1).toString();

    if (!aiAvailable) {
      setMessages(prev => [...prev, {
        id: messageId,
        role: "assistant",
        content: "I'm reconnecting right now. In the meantime, you can use our Scam Checker tool to analyze suspicious messages, or try our Password Generator for a secure password.",
        timestamp: new Date(),
      }]);
      setIsTyping(false);
      return;
    }

    setMessages(prev => [...prev, {
      id: messageId,
      role: "assistant",
      content: "",
      isStreaming: true,
      timestamp: new Date(),
    }]);
    setIsTyping(false);

    try {
      const convId = await ensureConversation();
      await streamAIResponse(text, convId, messageId);
    } catch (error: any) {
      if (error.name === "AbortError") return;
      console.error("AI response error:", error);

      if (error.message?.includes("429") || error.message?.includes("rate limit")) {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === messageId
              ? { ...msg, content: "I've reached my message limit for now. Please try again in a little while, or explore our tools like the Scam Checker and Password Generator for immediate help.", isStreaming: false }
              : msg
          )
        );
      } else {
        setAiAvailable(false);
        setMessages(prev =>
          prev.map(msg =>
            msg.id === messageId
              ? { ...msg, content: "I'm having trouble connecting right now. In the meantime, you can use our Scam Checker tool to analyze suspicious messages, or try our Password Generator for a secure password. I'll be back shortly.", isStreaming: false }
              : msg
          )
        );
        setTimeout(() => setAiAvailable(true), 30000);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const handleNewChat = () => {
    abortRef.current?.abort();
    setMessages([]);
    setConvId(null);
    setIsTyping(false);
    try {
      sessionStorage.removeItem(CONVERSATION_KEY);
      sessionStorage.removeItem(MESSAGES_KEY);
    } catch { /* */ }
  };

  const handleClose = () => setIsOpen(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") handleClose();
  };

  const prompts = getContextualPrompts(location);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[400px] max-h-[70vh]"
            onKeyDown={handleKeyDown}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dezi-title"
            aria-describedby="dezi-description"
            id="dezi-dialog"
            data-testid="dezi-panel"
          >
            <Card className="shadow-2xl border-primary/20 overflow-hidden flex flex-col max-h-[70vh]">
              <CardHeader className="pb-3 bg-[#0A2A3C] text-white flex-shrink-0">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 flex-shrink-0">
                      <img 
                        src={deziAvatar} 
                        alt="Dezi" 
                        className="w-full h-full object-cover"
                        loading="lazy"
                        data-testid="img-dezi-avatar"
                      />
                    </div>
                    <div>
                      <h3 id="dezi-title" className="font-semibold text-white text-sm" data-testid="text-dezi-name">Dezi</h3>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <p id="dezi-description" className="text-white/70 text-xs" data-testid="text-dezi-role">AI Safety Assistant</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {messages.length > 0 && (
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="text-white/60 hover:text-white"
                        onClick={handleNewChat}
                        aria-label="New conversation"
                        data-testid="button-new-chat"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </Button>
                    )}
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="text-white/60 hover:text-white"
                      onClick={handleClose}
                      aria-label="Close Dezi assistant"
                      data-testid="button-close-dezi"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0 flex flex-col flex-1 min-h-0">
                <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[200px] max-h-[40vh]">
                  {messages.length === 0 ? (
                    <div className="space-y-4">
                      <div className="text-center py-4">
                        <p className="text-muted-foreground text-sm mb-4">
                          {getContextualWelcome(location)}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                          Try asking
                        </p>
                        {prompts.map((prompt, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendMessage(prompt.text)}
                            className="w-full flex items-center gap-3 p-3 text-left text-sm rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                            data-testid={`button-prompt-${idx}`}
                          >
                            <prompt.icon className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="flex-1">{prompt.text}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                          data-testid={`message-${message.role}-${message.id}`}
                        >
                          <div
                            className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                              message.role === "user"
                                ? "bg-[#0A2A3C] text-white rounded-br-md"
                                : "bg-muted rounded-bl-md"
                            }`}
                          >
                            {message.role === "assistant" && (
                              <div className="flex items-center gap-2 mb-1.5">
                                <div className="w-5 h-5 rounded-full overflow-hidden">
                                  <img src={deziAvatar} alt="" className="w-full h-full object-cover" loading="lazy" />
                                </div>
                                <span className="text-xs font-medium text-muted-foreground">Dezi</span>
                                {message.isStreaming && (
                                  <Loader2 className="w-3 h-3 text-primary/60 animate-spin" />
                                )}
                              </div>
                            )}
                            <div className="text-sm whitespace-pre-wrap leading-relaxed">
                              {message.content || (message.isStreaming ? "" : "")}
                            </div>
                          </div>
                        </div>
                      ))}
                      {isTyping && (
                        <div className="flex justify-start" data-testid="indicator-dezi-typing">
                          <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-2.5 flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
                              <img src={deziAvatar} alt="" className="w-full h-full object-cover" loading="lazy" />
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "0ms", animationDuration: "600ms" }} />
                              <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "150ms", animationDuration: "600ms" }} />
                              <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "300ms", animationDuration: "600ms" }} />
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                <div className="border-t p-3 bg-background flex-shrink-0">
                  <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input
                      ref={inputRef}
                      type="text"
                      placeholder="Ask about online safety..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="flex-1"
                      disabled={isTyping}
                      data-testid="input-dezi-message"
                    />
                    <Button 
                      type="submit" 
                      size="icon" 
                      disabled={!inputValue.trim() || isTyping}
                      data-testid="button-send-message"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                  <p className="text-[10px] text-muted-foreground mt-1.5 text-center" data-testid="text-dezi-disclosure">
                    AI-powered. General guidance only, not professional advice.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showWelcomeBubble && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-16 right-4 sm:right-6 z-50 max-w-[250px] sm:max-w-[320px]"
            data-testid="dezi-welcome-bubble"
          >
            <div className="bg-card border shadow-lg rounded-xl p-4 relative">
              <button
                onClick={() => setShowWelcomeBubble(false)}
                className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
                aria-label="Dismiss welcome message"
                data-testid="button-dismiss-welcome"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 flex-shrink-0">
                  <img src={deziAvatar} alt="Dezi" className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="flex-1 pr-4">
                  <p className="font-medium text-sm text-foreground mb-1">Hi! I'm Dezi</p>
                  <p className="text-sm text-muted-foreground">
                    {getContextualWelcome(location)}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setIsOpen(true)}
                size="sm"
                className="w-full mt-3"
                data-testid="button-welcome-chat"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Start a conversation
              </Button>
              <div className="absolute -bottom-2 right-6 w-4 h-4 bg-card border-b border-r rotate-45 transform" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-4 right-4 sm:right-6 z-50"
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={`rounded-full shadow-lg ${isOpen ? 'bg-muted text-muted-foreground' : ''} gap-2`}
          data-testid="button-open-dezi"
          aria-label={isOpen ? "Close Dezi" : "Open Dezi safety assistant"}
          aria-expanded={isOpen}
          aria-controls="dezi-dialog"
        >
          {isOpen ? (
            <>
              <ChevronDown className="w-5 h-5" />
              <span className="hidden sm:inline">Close</span>
            </>
          ) : (
            <>
              <div className="w-6 h-6 rounded-full overflow-hidden border border-white/30">
                <img src={deziAvatar} alt="" className="w-full h-full object-cover" />
              </div>
              <span className="hidden sm:inline">Ask Dezi</span>
              <MessageCircle className="w-5 h-5 sm:hidden" />
            </>
          )}
        </Button>
      </motion.div>
    </>
  );
}
