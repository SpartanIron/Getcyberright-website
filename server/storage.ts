import {
  type User,
  type InsertUser,
  type ContactMessage,
  type InsertContactMessage,
  type NewsletterSubscriber,
  type InsertNewsletterSubscriber,
  type AiPrompt,
  type InsertAiPrompt,
  type PromptReview,
  type InsertPromptReview,
  type PromptReviewRun,
  users,
  contactMessages,
  newsletterSubscribers,
  aiPrompts,
  promptReviews,
  promptReviewRuns,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
  createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber>;
  getNewsletterSubscribers(): Promise<NewsletterSubscriber[]>;
  getNewsletterSubscriberByEmail(email: string): Promise<NewsletterSubscriber | undefined>;

  getActivePrompts(): Promise<AiPrompt[]>;
  getAllPrompts(): Promise<AiPrompt[]>;
  getPromptById(id: string): Promise<AiPrompt | undefined>;
  getPromptBySlug(slug: string): Promise<AiPrompt | undefined>;
  createPrompt(prompt: InsertAiPrompt): Promise<AiPrompt>;
  updatePrompt(id: string, data: Partial<InsertAiPrompt>): Promise<AiPrompt | undefined>;

  getPromptReviews(status?: string): Promise<PromptReview[]>;
  getPromptReviewById(id: string): Promise<PromptReview | undefined>;
  createPromptReview(review: InsertPromptReview): Promise<PromptReview>;
  updatePromptReviewStatus(id: string, status: string, reviewedBy?: string): Promise<PromptReview | undefined>;

  createPromptReviewRun(triggerType: string): Promise<PromptReviewRun>;
  updatePromptReviewRun(id: string, data: Partial<PromptReviewRun>): Promise<PromptReviewRun | undefined>;
  getPromptReviewRuns(limit?: number): Promise<PromptReviewRun[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const result = await db.insert(contactMessages).values(message).returning();
    return result[0];
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages);
  }

  async createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    const result = await db.insert(newsletterSubscribers).values(subscriber).returning();
    return result[0];
  }

  async getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    return await db.select().from(newsletterSubscribers);
  }

  async getNewsletterSubscriberByEmail(email: string): Promise<NewsletterSubscriber | undefined> {
    const result = await db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.email, email));
    return result[0];
  }

  async getActivePrompts(): Promise<AiPrompt[]> {
    return await db.select().from(aiPrompts).where(eq(aiPrompts.isActive, true)).orderBy(aiPrompts.title);
  }

  async getAllPrompts(): Promise<AiPrompt[]> {
    return await db.select().from(aiPrompts).orderBy(aiPrompts.title);
  }

  async getPromptById(id: string): Promise<AiPrompt | undefined> {
    const result = await db.select().from(aiPrompts).where(eq(aiPrompts.id, id));
    return result[0];
  }

  async getPromptBySlug(slug: string): Promise<AiPrompt | undefined> {
    const result = await db.select().from(aiPrompts).where(eq(aiPrompts.slug, slug));
    return result[0];
  }

  async createPrompt(prompt: InsertAiPrompt): Promise<AiPrompt> {
    const result = await db.insert(aiPrompts).values(prompt).returning();
    return result[0];
  }

  async updatePrompt(id: string, data: Partial<InsertAiPrompt>): Promise<AiPrompt | undefined> {
    const result = await db.update(aiPrompts)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(aiPrompts.id, id))
      .returning();
    return result[0];
  }

  async getPromptReviews(status?: string): Promise<PromptReview[]> {
    if (status) {
      return await db.select().from(promptReviews)
        .where(eq(promptReviews.status, status))
        .orderBy(desc(promptReviews.createdAt));
    }
    return await db.select().from(promptReviews).orderBy(desc(promptReviews.createdAt));
  }

  async getPromptReviewById(id: string): Promise<PromptReview | undefined> {
    const result = await db.select().from(promptReviews).where(eq(promptReviews.id, id));
    return result[0];
  }

  async createPromptReview(review: InsertPromptReview): Promise<PromptReview> {
    const result = await db.insert(promptReviews).values(review).returning();
    return result[0];
  }

  async updatePromptReviewStatus(id: string, status: string, reviewedBy?: string): Promise<PromptReview | undefined> {
    const result = await db.update(promptReviews)
      .set({
        status,
        reviewedBy: reviewedBy || null,
        reviewedAt: new Date(),
      })
      .where(eq(promptReviews.id, id))
      .returning();
    return result[0];
  }

  async createPromptReviewRun(triggerType: string): Promise<PromptReviewRun> {
    const result = await db.insert(promptReviewRuns).values({
      triggerType,
      status: "running",
    }).returning();
    return result[0];
  }

  async updatePromptReviewRun(id: string, data: Partial<PromptReviewRun>): Promise<PromptReviewRun | undefined> {
    const result = await db.update(promptReviewRuns)
      .set(data)
      .where(eq(promptReviewRuns.id, id))
      .returning();
    return result[0];
  }

  async getPromptReviewRuns(limit = 20): Promise<PromptReviewRun[]> {
    return await db.select().from(promptReviewRuns)
      .orderBy(desc(promptReviewRuns.startedAt))
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();
