import { users, type User, type UpsertUser, FREE_TRIAL_DAYS } from "@shared/models/auth";
import { db } from "../../db";
import { eq } from "drizzle-orm";

export interface IAuthStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
}

class AuthStorage implements IAuthStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [existingUser] = await db.select().from(users).where(eq(users.id, userData.id!));
    
    if (existingUser) {
      const [user] = await db
        .update(users)
        .set({
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userData.id!))
        .returning();
      return user;
    }
    
    const now = new Date();
    const trialEndsAt = new Date(now.getTime() + FREE_TRIAL_DAYS * 24 * 60 * 60 * 1000);
    
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        subscriptionTier: "free",
        trialStartedAt: now,
        trialEndsAt,
        trialTier: "essential",
      })
      .returning();
    return user;
  }
}

export const authStorage = new AuthStorage();
