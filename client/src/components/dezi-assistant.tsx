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
  "scam": `Great question! Spotting scams gets easier once you know what to look for.

**Common Warning Signs:**
• Messages that create urgency or pressure you to act fast
• Requests for money, gift cards, or wire transfers
• Threats about account closures or legal action
• Spelling mistakes and awkward grammar
• Email addresses or phone numbers that look suspicious
• Links that do not match the company they claim to be

**Here is What You Can Do:**
• Avoid clicking links or downloading attachments
• Do not reply or call numbers in the message
• Contact the company directly using their official website
• Report suspicious messages to the FTC at ReportFraud.ftc.gov

If something feels off, trust your instincts. You can also use our Scam Checker tool to analyze any message you are unsure about.`,

  "phishing": `Phishing is one of the most common online scams, and understanding how it works can help you avoid it.

**How It Works:**
Scammers send emails, texts, or messages pretending to be from trusted organizations like banks, tech companies, or government agencies. These messages usually claim something is wrong with your account and urge you to act quickly. They include links to fake websites that look real, and when you enter your information, it goes straight to the criminals.

**Watch Out For:**
• Unexpected password reset requests
• Package delivery notifications you were not expecting
• Prize or lottery announcements
• Messages claiming to be from the IRS about refunds

**How to Protect Yourself:**
• Never click links in unexpected messages
• When in doubt, contact the organization directly
• Check sender addresses for misspellings
• Turn on two factor authentication for your accounts

You can learn more at CISA.gov or the FTC Consumer Protection page.`,

  "family": `Keeping your family safe online is all about building good habits and having open conversations.

**For Children:**
Parental controls are a great starting point. Keep devices in common areas so you can stay involved, and talk about online safety in ways they can understand. Teach them never to share personal information, and set clear rules about screen time and app downloads.

**For Teenagers:**
Teens benefit from conversations about their digital reputation and how online content can stick around forever. Encourage them to come to you if something feels wrong, and help them understand the risks of oversharing personal details.

**For Seniors:**
Help set up fraud alerts on bank accounts and establish a family code word for emergencies. Review privacy settings together and encourage them to verify any unexpected requests before responding.

**For Everyone:**
Use strong, unique passwords for each account. Enable two factor authentication whenever possible, keep your devices updated, and talk as a family about the latest scam trends.

StopBullying.gov has great resources for youth, and AARP.org offers helpful guides for seniors.`,

  "clicked": `First, take a breath. Clicking a suspicious link is not the end of the world, but here is what you should do right away.

**Right Now:**
Close the browser tab or window immediately. If you have not entered any information or downloaded anything, you are probably fine. If you are worried about malware, you can disconnect from the internet temporarily.

**Check Your Device:**
Run a full antivirus scan. Look through your browser extensions for anything unfamiliar, check your downloads folder, and review your installed programs for anything you do not recognize.

**If You Entered Any Information:**
Change the password for that account right away. If you use the same password elsewhere, change those too. Turn on two factor authentication, and if you entered bank or credit card details, contact your bank immediately. Keep an eye on your accounts for any unusual activity.

**Moving Forward:**
Consider setting up fraud alerts with credit bureaus. Report the phishing attempt to the FTC, and stay alert for suspicious follow up emails or calls over the next few weeks.

Our Emergency Help page has more detailed guidance, and you can also visit IdentityTheft.gov.`,

  "default": `Hello! I am Dezi, your online safety assistant. I am here to help you understand digital risks and learn how to protect yourself and your family.

**I Can Help You With:**
• Figuring out if a message might be a scam
• Understanding how common cyber threats work
• Sharing practical tips to keep your family safe online
• Explaining what to do after a security incident

**Keep in Mind:**
I provide general educational information, but I cannot offer legal, medical, or financial advice. I also cannot guarantee whether any specific message is safe or dangerous, and I am not a replacement for professional cybersecurity services.

**Need Help Right Now?**
• Report fraud to the FTC at ReportFraud.ftc.gov
• Report internet crimes to FBI IC3 at ic3.gov
• Contact your bank for financial concerns

What would you like to learn about today?`
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
                          <div className="bg-muted rounded-lg p-3 flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
                              <img src={deziAvatar} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex items-center gap-1">
                              <span 
                                className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" 
                                style={{ animationDelay: "0ms", animationDuration: "600ms" }} 
                              />
                              <span 
                                className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" 
                                style={{ animationDelay: "150ms", animationDuration: "600ms" }} 
                              />
                              <span 
                                className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" 
                                style={{ animationDelay: "300ms", animationDuration: "600ms" }} 
                              />
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
