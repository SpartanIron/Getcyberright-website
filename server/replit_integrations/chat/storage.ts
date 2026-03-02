import { db } from "../../db";
import { conversations, messages } from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";

export interface IChatStorage {
  getConversation(id: number, sessionId?: string): Promise<typeof conversations.$inferSelect | undefined>;
  getAllConversations(sessionId?: string): Promise<(typeof conversations.$inferSelect)[]>;
  createConversation(title: string, sessionId?: string): Promise<typeof conversations.$inferSelect>;
  deleteConversation(id: number, sessionId?: string): Promise<boolean>;
  getMessagesByConversation(conversationId: number): Promise<(typeof messages.$inferSelect)[]>;
  createMessage(conversationId: number, role: string, content: string): Promise<typeof messages.$inferSelect>;
  getMessageCount(conversationId: number): Promise<number>;
}

export const chatStorage: IChatStorage = {
  async getConversation(id: number, sessionId?: string) {
    if (sessionId) {
      const [conversation] = await db.select().from(conversations)
        .where(and(eq(conversations.id, id), eq(conversations.sessionId, sessionId)));
      return conversation;
    }
    const [conversation] = await db.select().from(conversations).where(eq(conversations.id, id));
    return conversation;
  },

  async getAllConversations(sessionId?: string) {
    if (sessionId) {
      return db.select().from(conversations)
        .where(eq(conversations.sessionId, sessionId))
        .orderBy(desc(conversations.createdAt));
    }
    return db.select().from(conversations).orderBy(desc(conversations.createdAt));
  },

  async createConversation(title: string, sessionId?: string) {
    const [conversation] = await db.insert(conversations)
      .values({ title, sessionId: sessionId || null })
      .returning();
    return conversation;
  },

  async deleteConversation(id: number, sessionId?: string) {
    if (sessionId) {
      const [conv] = await db.select().from(conversations)
        .where(and(eq(conversations.id, id), eq(conversations.sessionId, sessionId)));
      if (!conv) return false;
    }
    await db.delete(messages).where(eq(messages.conversationId, id));
    await db.delete(conversations).where(eq(conversations.id, id));
    return true;
  },

  async getMessagesByConversation(conversationId: number) {
    return db.select().from(messages).where(eq(messages.conversationId, conversationId)).orderBy(messages.createdAt);
  },

  async createMessage(conversationId: number, role: string, content: string) {
    const [message] = await db.insert(messages).values({ conversationId, role, content }).returning();
    return message;
  },

  async getMessageCount(conversationId: number) {
    const msgs = await db.select().from(messages).where(eq(messages.conversationId, conversationId));
    return msgs.length;
  },
};
