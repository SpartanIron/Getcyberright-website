import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  X, 
  Send, 
  Shield, 
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  Loader2
} from "lucide-react";
import deziAvatar from "@/assets/images/dezi-avatar.png";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const suggestedPrompts = [
  { text: "Is this message a scam?", icon: AlertTriangle },
  { text: "How do phishing scams work?", icon: HelpCircle },
  { text: "How can I protect my family online?", icon: Shield },
  { text: "What should I do if I clicked a suspicious link?", icon: AlertTriangle },
];

const safetyResponses: Record<string, string> = {
  "scam": `To determine if a message is a scam, look for these common warning signs:

**Red Flags:**
• Urgent language demanding immediate action
• Requests for money, gift cards, or wire transfers
• Threats of account closure or legal action
• Poor grammar or spelling errors
• Suspicious sender addresses or phone numbers
• Links that do not match the company claimed

**What to Do:**
• Do not click any links or download attachments
• Do not reply or call back numbers in the message
• Verify by contacting the company directly through their official website
• Report the message to the FTC at ReportFraud.ftc.gov

If you are still unsure, use our Scam Checker tool to analyze the message.`,

  "phishing": `Phishing is a type of online scam where criminals attempt to steal your personal information by pretending to be a trusted organization.

**How Phishing Works:**
• Scammers send emails, texts, or messages that appear to be from banks, tech companies, or government agencies
• These messages often create urgency, claiming your account has been compromised
• They include links to fake websites designed to look legitimate
• When you enter your information, it goes directly to the criminals

**Common Phishing Tactics:**
• Fake password reset requests
• Suspicious package delivery notifications
• Prize or lottery winning announcements
• Tax refund or IRS impersonation

**Protection Tips:**
• Never click links in unexpected messages
• Verify requests by contacting organizations directly
• Look for misspellings in sender addresses
• Enable two-factor authentication on your accounts

For more information, visit CISA.gov or the FTC Consumer Protection page.`,

  "family": `Protecting your family online involves creating awareness and establishing safety habits for everyone.

**For Children:**
• Use parental controls appropriate for their age
• Keep devices in common areas of the home
• Talk regularly about online safety in age-appropriate ways
• Teach them to never share personal information online
• Establish rules about screen time and app downloads

**For Teenagers:**
• Discuss digital reputation and permanence of online content
• Talk about the risks of sharing personal information
• Encourage open communication about online interactions
• Set expectations about appropriate online behavior

**For Seniors:**
• Help set up fraud alerts on financial accounts
• Establish a family code word for emergencies
• Review privacy settings on devices and accounts
• Create a habit of verifying unexpected requests

**General Family Safety:**
• Use strong, unique passwords for each account
• Enable two-factor authentication where possible
• Keep software and devices updated
• Discuss current scam trends together

Visit StopBullying.gov for youth safety resources and AARP.org for senior protection guides.`,

  "clicked": `If you clicked a suspicious link, do not panic. Here is what to do next:

**Immediate Steps:**
1. Close the browser tab or window immediately
2. Do not enter any personal information
3. Do not download anything if prompted
4. Disconnect from the internet if concerned about malware

**Check for Damage:**
• Run a full antivirus scan on your device
• Check your browser for new extensions you did not install
• Review your download folder for unfamiliar files
• Look at installed programs for anything suspicious

**If You Entered Information:**
• Change your password immediately for that account
• Change passwords on any other accounts using the same password
• Enable two-factor authentication
• Contact your bank if you entered financial information
• Monitor your accounts for unauthorized activity

**Ongoing Protection:**
• Set up fraud alerts with credit bureaus if needed
• Report the phishing attempt to the FTC
• Watch for suspicious emails or calls in the coming weeks

For detailed guidance, visit our Emergency Help page or the FTC at IdentityTheft.gov.`,

  "default": `I am here to help you understand online safety and protect yourself from digital threats.

**I can help you with:**
• Understanding whether a message might be a scam
• Learning how common cyber threats work
• Getting practical tips to protect your family
• Knowing what steps to take after a security incident

**What I cannot do:**
• Provide legal, medical, or financial advice
• Guarantee that any message is safe or unsafe
• Replace professional cybersecurity services

For specific concerns about fraud or identity theft, I recommend contacting:
• **FTC**: ReportFraud.ftc.gov
• **FBI IC3**: ic3.gov for internet crimes
• **Your bank**: For financial concerns

Is there a specific safety topic I can help you learn about?`
};

function getResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes("scam") || lowerMessage.includes("suspicious") || lowerMessage.includes("fraud") || lowerMessage.includes("fake")) {
    return safetyResponses["scam"];
  }
  if (lowerMessage.includes("phishing") || lowerMessage.includes("email") || lowerMessage.includes("text message")) {
    return safetyResponses["phishing"];
  }
  if (lowerMessage.includes("family") || lowerMessage.includes("kids") || lowerMessage.includes("children") || lowerMessage.includes("protect") || lowerMessage.includes("senior") || lowerMessage.includes("parent")) {
    return safetyResponses["family"];
  }
  if (lowerMessage.includes("clicked") || lowerMessage.includes("link") || lowerMessage.includes("what should i do") || lowerMessage.includes("accident")) {
    return safetyResponses["clicked"];
  }
  
  return safetyResponses["default"];
}

// Check if user has been welcomed this session
const WELCOME_KEY = "dezi_welcomed_session";

export function DeziAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [showWelcomeBubble, setShowWelcomeBubble] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Create notification sound (soft chime)
  useEffect(() => {
    // Create audio context for notification sound
    const createNotificationSound = () => {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5 note
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      } catch (e) {
        // Audio not supported or blocked
      }
    };
    
    // Store the function for later use
    (window as any).deziNotificationSound = createNotificationSound;
  }, []);

  // Track user interaction for sound permission
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

  // Auto-welcome after delay (only once per session)
  useEffect(() => {
    const hasBeenWelcomed = sessionStorage.getItem(WELCOME_KEY);
    
    if (!hasBeenWelcomed) {
      const timer = setTimeout(() => {
        setShowWelcomeBubble(true);
        sessionStorage.setItem(WELCOME_KEY, "true");
        
        // Play sound if user has interacted
        if (hasInteracted && (window as any).deziNotificationSound) {
          (window as any).deziNotificationSound();
        }
      }, 3000); // 3 second delay
      
      return () => clearTimeout(timer);
    }
  }, [hasInteracted]);

  // Hide welcome bubble when panel opens
  useEffect(() => {
    if (isOpen) {
      setShowWelcomeBubble(false);
    }
  }, [isOpen]);

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

  const dismissWelcome = () => {
    setShowWelcomeBubble(false);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 700));

    const response = getResponse(text);
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsTyping(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const handlePromptClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClose();
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
              <CardHeader className="pb-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex-shrink-0">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 flex-shrink-0">
                      <img 
                        src={deziAvatar} 
                        alt="Dezi" 
                        className="w-full h-full object-cover"
                        data-testid="img-dezi-avatar"
                      />
                    </div>
                    <div>
                      <h3 id="dezi-title" className="font-semibold text-white text-sm" data-testid="text-dezi-name">Dezi</h3>
                      <p id="dezi-description" className="text-white/70 text-xs" data-testid="text-dezi-role">Your Online Safety Assistant</p>
                    </div>
                  </div>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="text-white/70"
                    onClick={handleClose}
                    aria-label="Close Dezi assistant"
                    data-testid="button-close-dezi"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-0 flex flex-col flex-1 min-h-0">
                <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[200px] max-h-[40vh]">
                  {messages.length === 0 ? (
                    <div className="space-y-4">
                      <div className="text-center py-4">
                        <p className="text-muted-foreground text-sm mb-4">
                          I am here to help you understand online risks and stay safe.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                          Common Questions
                        </p>
                        {suggestedPrompts.map((prompt, idx) => (
                          <button
                            key={idx}
                            onClick={() => handlePromptClick(prompt.text)}
                            className="w-full flex items-center gap-3 p-3 text-left text-sm rounded-lg border bg-card hover-elevate transition-colors"
                            data-testid={`button-prompt-${idx}`}
                          >
                            <prompt.icon className="w-4 h-4 text-primary flex-shrink-0" />
                            <span>{prompt.text}</span>
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
                            className={`max-w-[85%] rounded-lg p-3 ${
                              message.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            {message.role === "assistant" && (
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-5 h-5 rounded-full overflow-hidden">
                                  <img src={deziAvatar} alt="" className="w-full h-full object-cover" />
                                </div>
                                <span className="text-xs font-medium text-muted-foreground">Dezi</span>
                              </div>
                            )}
                            <div className="text-sm whitespace-pre-wrap leading-relaxed">
                              {message.content.split("\n").map((line, idx) => {
                                if (line.startsWith("**") && line.endsWith("**")) {
                                  return <p key={idx} className="font-semibold mt-3 mb-1">{line.replace(/\*\*/g, "")}</p>;
                                }
                                if (line.startsWith("• ")) {
                                  return <p key={idx} className="ml-2">{line}</p>;
                                }
                                return <p key={idx}>{line}</p>;
                              })}
                            </div>
                          </div>
                        </div>
                      ))}
                      {isTyping && (
                        <div className="flex justify-start" data-testid="indicator-dezi-typing">
                          <div className="bg-muted rounded-lg p-3 flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Dezi is typing...</span>
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
                  
                  <p className="text-xs text-muted-foreground mt-2 text-center" data-testid="text-dezi-disclosure">
                    Dezi provides general educational guidance and does not replace professional advice.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Welcome bubble - mobile friendly */}
      <AnimatePresence>
        {showWelcomeBubble && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-16 right-4 sm:right-6 z-50 max-w-[280px] sm:max-w-[320px]"
            data-testid="dezi-welcome-bubble"
          >
            <div className="bg-card border shadow-lg rounded-xl p-4 relative">
              {/* Close button */}
              <button
                onClick={dismissWelcome}
                className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
                aria-label="Dismiss welcome message"
                data-testid="button-dismiss-welcome"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 flex-shrink-0">
                  <img 
                    src={deziAvatar} 
                    alt="Dezi" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 pr-4">
                  <p className="font-medium text-sm text-foreground mb-1">Hi! I'm Dezi</p>
                  <p className="text-sm text-muted-foreground">
                    Your cybersecurity guide. How can I help you stay safe online today?
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
              
              {/* Speech bubble pointer */}
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
