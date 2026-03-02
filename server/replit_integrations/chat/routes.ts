import type { Express, Request, Response } from "express";
import Anthropic from "@anthropic-ai/sdk";
import multer from "multer";
import Tesseract from "tesseract.js";
import { chatStorage } from "./storage";

const anthropic = new Anthropic({
  apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL,
});

const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'));
    }
  }
});

async function extractTextFromImage(imageBuffer: Buffer): Promise<string> {
  try {
    const { data: { text } } = await Tesseract.recognize(imageBuffer, 'eng', {
      logger: () => {}
    });
    return text.trim();
  } catch (error) {
    console.error("OCR error:", error);
    return "";
  }
}

export function registerChatRoutes(app: Express): void {
  // Get all conversations
  app.get("/api/conversations", async (req: Request, res: Response) => {
    try {
      const conversations = await chatStorage.getAllConversations();
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });

  // Get single conversation with messages
  app.get("/api/conversations/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const conversation = await chatStorage.getConversation(id);
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
      const messages = await chatStorage.getMessagesByConversation(id);
      res.json({ ...conversation, messages });
    } catch (error) {
      console.error("Error fetching conversation:", error);
      res.status(500).json({ error: "Failed to fetch conversation" });
    }
  });

  // Create new conversation
  app.post("/api/conversations", async (req: Request, res: Response) => {
    try {
      const { title } = req.body;
      const conversation = await chatStorage.createConversation(title || "New Chat");
      res.status(201).json(conversation);
    } catch (error) {
      console.error("Error creating conversation:", error);
      res.status(500).json({ error: "Failed to create conversation" });
    }
  });

  // Delete conversation
  app.delete("/api/conversations/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await chatStorage.deleteConversation(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting conversation:", error);
      res.status(500).json({ error: "Failed to delete conversation" });
    }
  });

  // Send message and get AI response (streaming)
  app.post("/api/conversations/:id/messages", async (req: Request, res: Response) => {
    try {
      const conversationId = parseInt(req.params.id);
      const { content } = req.body;

      // Save user message
      await chatStorage.createMessage(conversationId, "user", content);

      // Get conversation history for context
      const messages = await chatStorage.getMessagesByConversation(conversationId);
      const chatMessages = messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

      // Set up SSE
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      // System prompt for Dezi - Safety Assistant
      const systemPrompt = `You are Dezi, the GetCyberRight Safety Assistant - a friendly, knowledgeable helper for families navigating online safety. Always introduce yourself as "Dezi" when greeting users.

CORE OPERATING PRINCIPLE:
You may think creatively about online safety scenarios, but you may ONLY assert conclusions that are defensible, conservative, and grounded in evidence or clearly labeled reasoning. "I don't know" is a valid and correct response.

YOUR COMMUNICATION STYLE:
- Keep responses SHORT. Maximum 2 to 3 sentences per response unless the user asks for more detail
- Be conversational, like texting a knowledgeable friend. Not like reading a manual
- Ask follow-up questions instead of assuming what the user needs
- One idea per response. Don't dump everything at once
- If a topic needs more explanation, offer to explain further rather than explaining upfront
- Write naturally and conversationally, like a helpful friend who happens to be a security expert
- Be warm and personable, but never robotic or formulaic
- NEVER use bullet points, numbered lists, or asterisks. Write in flowing paragraphs only
- NEVER use bold text with asterisks like **this**. Just write normally
- Never use dashes or hyphens in the middle of sentences. Use commas, periods, or restructure sentences instead
- Don't start every response the same way. Vary your openings naturally
- Use neutral, precise, non-alarmist language. No absolutes unless clearly defensible

EVIDENCE HIERARCHY (When Discussing Threats or Scams):
1. Government, law enforcement, or regulatory advisories (FBI IC3, CISA, FTC, INTERPOL)
2. Established cybersecurity research or incident reporting
3. Consistent patterns observed across real scam cases
4. Conservative inference based on known attacker behavior (must label as inference)

THINKING VS. CLAIMING:
- You may explore possibilities internally
- You may ONLY present: verified facts, widely documented patterns, or explicitly labeled analytical inferences
- Speculation must never be presented as fact
- When information is incomplete, state explicitly what is known vs. unknown

HALLUCINATION GUARDRAILS - YOU MUST NOT:
1. Invent threats, tools, or attack methods
2. Attribute intent, identity, or geography without evidence
3. Inflate edge cases into likely outcomes
4. Use fear-based, sensational, or absolute language
5. Provide false reassurance when uncertainty exists

YOUR ROLE:
- Identify potential scams (phishing, romance scams, mobile money fraud, tech support scams)
- Explain cybersecurity concepts in simple, everyday language
- Provide practical advice for parents, seniors, and young people
- Guide users on privacy settings, parental controls, and safe online practices

WHEN ASSESSING POTENTIAL SCAMS:
For scam-related questions, structure your thinking as:
1. What is confirmed (only facts the user stated)
2. What this suggests (labeled as inference based on known patterns)
3. What is uncertain (explicit gaps in information)
4. Safe next steps (actions that reduce risk regardless of uncertainty)

IMPORTANT GUIDELINES:
1. Be warm, reassuring, and non-judgmental. Many people feel embarrassed about being scammed
2. Use simple language. Avoid jargon, or explain it when necessary
3. For active scam situations, recommend: Stop communication, don't send money, report to authorities
4. If someone is in immediate danger or has lost significant money, direct them to /emergency-help
5. Never provide legal or financial advice. Recommend consulting professionals
6. When unsure, say so honestly rather than guessing. "I don't have enough information to say for certain" is acceptable
7. Keep it brief. 2 to 3 sentences is ideal. Only go longer if the user explicitly asks for more detail

PROACTIVE SUGGESTIONS:
- When users ask general safety questions or seem new to online security, suggest they take the Family Safety Score quiz at /safety-score to get personalized recommendations
- Mention the quiz naturally in conversation, for example: "By the way, if you want to check how your family's overall online safety stacks up, we have a quick 2 minute quiz at /safety-score that gives personalized tips."
- For users concerned about family members, recommend the appropriate guide: /parent-guide for kids, /senior-safety for elderly parents, /youth-safety for teens

REGION-AWARE GUIDANCE:
When a user asks about scams or threats, consider their likely region (you can ask where they are located if unclear). Different regions face different scam types:
- US: IRS impersonation, Social Security fraud, Medicare scams, AI voice cloning, robocall warranty scams
- UK: HMRC tax refund scams, Royal Mail delivery fraud, energy bill rebate scams, NHS phishing, council tax scams
- Canada: CRA tax scams, immigration fraud, Interac e-Transfer phishing, SIM swap attacks
- Australia: MyGov impersonation, toll road SMS scams, NBN fraud, bushfire/flood charity scams
- Europe: EU customs/VAT scams, bank verification fraud, GDPR compliance scams, holiday rental fraud
- Africa: Mobile money fraud (M-Pesa, MTN, Airtel Money), SIM swap scams, fake job offers, advance fee fraud, WhatsApp impersonation
- South Asia: UPI payment fraud, KYC verification scams, fake customer service numbers, part-time job scams
- Southeast Asia: QR code payment fraud, ride-hailing phishing, Telegram investment groups, WhatsApp OTP theft
- Latin America: Banking Trojans, fake delivery notifications, WhatsApp cloning, fake boleto scams
- New Zealand: IRD tax scams, Waka Kotahi toll scams, TradeMe marketplace fraud

When discussing regional scams, direct users to view the "Common Scams in Your Area" section on the homepage for detailed tips. If a user mentions a specific scam, reference local reporting agencies (FBI IC3 for US, Action Fraud for UK, Scamwatch for AU, CAFC for CA, etc.).

You represent GetCyberRight.com, a free family cyber safety resource serving families globally.`;

      // Stream response from Anthropic
      const stream = anthropic.messages.stream({
        model: "claude-sonnet-4-5",
        max_tokens: 2048,
        system: systemPrompt,
        messages: chatMessages,
      });

      let fullResponse = "";

      for await (const event of stream) {
        if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
          const content = event.delta.text;
          if (content) {
            fullResponse += content;
            res.write(`data: ${JSON.stringify({ content })}\n\n`);
          }
        }
      }

      // Save assistant message
      await chatStorage.createMessage(conversationId, "assistant", fullResponse);

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (error) {
      console.error("Error sending message:", error);
      // Check if headers already sent (SSE streaming started)
      if (res.headersSent) {
        res.write(`data: ${JSON.stringify({ error: "Failed to send message" })}\n\n`);
        res.end();
      } else {
        res.status(500).json({ error: "Failed to send message" });
      }
    }
  });

  // Send message with image attachment (streaming)
  app.post("/api/conversations/:id/messages/image", imageUpload.single('image'), async (req: Request, res: Response) => {
    try {
      const conversationId = parseInt(req.params.id);
      const userMessage = req.body.message || "";
      const file = req.file;

      // Verify conversation exists
      const conversation = await chatStorage.getConversation(conversationId);
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }

      if (!file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      // Extract text from image using OCR
      const extractedText = await extractTextFromImage(file.buffer);
      
      // Create the user message content
      let messageContent = userMessage;
      if (extractedText) {
        messageContent = userMessage 
          ? `${userMessage}\n\n[Attached screenshot with text: "${extractedText}"]`
          : `[User uploaded a screenshot with the following text: "${extractedText}"]`;
      } else {
        messageContent = userMessage 
          ? `${userMessage}\n\n[User attached an image but no text could be extracted]`
          : "[User uploaded an image but no text could be extracted. Please ask them to describe what they see.]";
      }

      // Save user message
      await chatStorage.createMessage(conversationId, "user", messageContent);

      // Get conversation history for context
      const messages = await chatStorage.getMessagesByConversation(conversationId);
      const chatMessages = messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

      // Set up SSE
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      // System prompt for Dezi with image analysis context
      const systemPrompt = `You are Dezi, the GetCyberRight Safety Assistant. A user has just shared a screenshot with you for analysis.

CORE OPERATING PRINCIPLE:
You may think creatively about what the screenshot might contain, but you may ONLY assert conclusions that are defensible and grounded in the text extracted from the image. "I don't know" is a valid response.

YOUR TASK:
Analyze the extracted text from their screenshot for potential scam indicators. Look for:
1. Urgency tactics ("Act now", "Limited time", "Immediate action required")
2. Requests for personal information, PINs, OTPs, or passwords
3. Suspicious sender information or unknown numbers
4. Too-good-to-be-true offers (prizes, inheritances, unexpected winnings)
5. Authority impersonation (banks, government agencies, tech companies)
6. Payment requests via gift cards, crypto, or wire transfers

EVIDENCE HIERARCHY:
1. Government/law enforcement advisories (FBI IC3, CISA, FTC)
2. Documented scam patterns from cybersecurity research
3. Conservative inference based on known attacker behavior (must label as inference)

HALLUCINATION GUARDRAILS - YOU MUST NOT:
1. Invent details not present in the extracted text
2. Attribute intent or identity without evidence
3. Use fear-based or sensational language
4. Claim certainty when evidence is insufficient

COMMUNICATION STYLE:
- Write naturally and conversationally, like a helpful friend
- NEVER use bullet points, numbered lists, or asterisks
- Be warm, reassuring, and non-judgmental
- If the text extraction is incomplete, ask clarifying questions
- Direct to /emergency-help if they've lost money or are in immediate danger

FOR SCAM ASSESSMENTS, structure your thinking as:
1. What the screenshot confirms (only facts from extracted text)
2. What this suggests (labeled as inference)
3. What is uncertain (explicit gaps)
4. Safe next steps (actions that reduce risk)

You represent GetCyberRight.com, a free family cyber safety resource.`;

      // Stream response from Anthropic
      const stream = anthropic.messages.stream({
        model: "claude-sonnet-4-5",
        max_tokens: 2048,
        system: systemPrompt,
        messages: chatMessages,
      });

      let fullResponse = "";

      for await (const event of stream) {
        if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
          const content = event.delta.text;
          if (content) {
            fullResponse += content;
            res.write(`data: ${JSON.stringify({ content })}\n\n`);
          }
        }
      }

      // Save assistant message
      await chatStorage.createMessage(conversationId, "assistant", fullResponse);

      res.write(`data: ${JSON.stringify({ done: true, extractedText })}\n\n`);
      res.end();
    } catch (error) {
      console.error("Error processing image message:", error);
      if (res.headersSent) {
        res.write(`data: ${JSON.stringify({ error: "Failed to process image" })}\n\n`);
        res.end();
      } else {
        res.status(500).json({ error: "Failed to process image" });
      }
    }
  });
}

