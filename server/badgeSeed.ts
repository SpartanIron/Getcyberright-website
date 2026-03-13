import { db } from "./db";
import { badgeDefinitions } from "@shared/schema";
import { sql } from "drizzle-orm";

const badges = [
  {
    id: "first-scan",
    name: "First Scan",
    description: "Complete your first security scan",
    category: "scanner",
    tier: "bronze",
    requirement: "Complete 1 scan",
    points: 10,
    iconName: "Search",
  },
  {
    id: "scan-master",
    name: "Scan Master",
    description: "Complete 25 security scans",
    category: "scanner",
    tier: "silver",
    requirement: "Complete 25 scans",
    points: 50,
    iconName: "Shield",
  },
  {
    id: "threat-hunter",
    name: "Threat Hunter",
    description: "Identify 10 malicious URLs",
    category: "scanner",
    tier: "gold",
    requirement: "Find 10 threats",
    points: 100,
    iconName: "Target",
  },
  {
    id: "security-expert",
    name: "Security Expert",
    description: "Complete 100 security scans",
    category: "scanner",
    tier: "platinum",
    requirement: "Complete 100 scans",
    points: 250,
    iconName: "Crown",
  },
  {
    id: "first-lesson",
    name: "Knowledge Seeker",
    description: "Complete your first security lesson",
    category: "education",
    tier: "bronze",
    requirement: "Complete 1 lesson",
    points: 15,
    iconName: "BookOpen",
  },
  {
    id: "phishing-expert",
    name: "Phishing Expert",
    description: "Complete all phishing awareness modules",
    category: "education",
    tier: "silver",
    requirement: "Complete phishing course",
    points: 75,
    iconName: "Eye",
  },
  {
    id: "deepfake-detective",
    name: "Deepfake Detective",
    description: "Complete the deepfake detection training",
    category: "education",
    tier: "gold",
    requirement: "Complete deepfake course",
    points: 100,
    iconName: "Zap",
  },
  {
    id: "cyber-scholar",
    name: "Cyber Scholar",
    description: "Complete all educational modules",
    category: "education",
    tier: "platinum",
    requirement: "Complete all courses",
    points: 300,
    iconName: "Award",
  },
  {
    id: "week-warrior",
    name: "Week Warrior",
    description: "Maintain a 7-day learning streak",
    category: "streak",
    tier: "bronze",
    requirement: "7-day streak",
    points: 25,
    iconName: "Flame",
  },
  {
    id: "month-master",
    name: "Month Master",
    description: "Maintain a 30-day learning streak",
    category: "streak",
    tier: "gold",
    requirement: "30-day streak",
    points: 150,
    iconName: "Medal",
  },
  {
    id: "community-helper",
    name: "Community Helper",
    description: "Report 5 scams to help protect others",
    category: "community",
    tier: "silver",
    requirement: "Report 5 scams",
    points: 50,
    iconName: "Users",
  },
  {
    id: "guardian",
    name: "Guardian",
    description: "Share security tips with 10 family members",
    category: "community",
    tier: "gold",
    requirement: "Share with 10 people",
    points: 100,
    iconName: "Shield",
  },
];

export async function seedBadgeDefinitions() {
  try {
    const existing = await db.select({ count: sql<number>`count(*)` }).from(badgeDefinitions);
    const count = Number(existing[0]?.count || 0);

    if (count >= badges.length) {
      console.log(`[badges] Badge definitions already seeded (${count} exist)`);
      return;
    }

    for (const badge of badges) {
      await db.insert(badgeDefinitions).values(badge).onConflictDoNothing();
    }

    const afterCount = await db.select({ count: sql<number>`count(*)` }).from(badgeDefinitions);
    console.log(`[badges] Seeded ${Number(afterCount[0]?.count || 0)} badge definitions`);
  } catch (error: any) {
    console.error("[badges] Failed to seed badge definitions:", error.message);
  }
}
