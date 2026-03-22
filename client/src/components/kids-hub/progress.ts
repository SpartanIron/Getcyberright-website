const STORAGE_KEY = "gcr-kids-hub-progress";

export interface KidsProgress {
  completedModules: Record<string, string[]>;
  quizScores: Record<string, Record<string, number>>;
  activitiesCompleted: Record<string, string[]>;
  totalStars: number;
  lastVisit: string;
}

function getDefaultProgress(): KidsProgress {
  return {
    completedModules: { "6-10": [], "11-13": [], "14-16": [] },
    quizScores: { "6-10": {}, "11-13": {}, "14-16": {} },
    activitiesCompleted: { "6-10": [], "11-13": [], "14-16": [] },
    totalStars: 0,
    lastVisit: new Date().toISOString(),
  };
}

function ensureKeys(progress: KidsProgress): KidsProgress {
  const groups = ["6-10", "11-13", "14-16"];
  if (!progress.completedModules) progress.completedModules = {};
  if (!progress.quizScores) progress.quizScores = {};
  if (!progress.activitiesCompleted) progress.activitiesCompleted = {};
  for (const g of groups) {
    if (!progress.completedModules[g]) progress.completedModules[g] = [];
    if (!progress.quizScores[g]) progress.quizScores[g] = {};
    if (!progress.activitiesCompleted[g]) progress.activitiesCompleted[g] = [];
  }
  const legacy: Record<string, string> = { "8-11": "6-10", "12-16": "14-16" };
  for (const [old, target] of Object.entries(legacy)) {
    if (progress.completedModules[old]?.length) {
      for (const m of progress.completedModules[old]) {
        if (!progress.completedModules[target].includes(m)) progress.completedModules[target].push(m);
      }
      delete progress.completedModules[old];
    }
    if (progress.quizScores[old]) {
      for (const [k, v] of Object.entries(progress.quizScores[old])) {
        if (!progress.quizScores[target][k] || v > progress.quizScores[target][k]) progress.quizScores[target][k] = v;
      }
      delete progress.quizScores[old];
    }
    if (progress.activitiesCompleted[old]?.length) {
      for (const a of progress.activitiesCompleted[old]) {
        if (!progress.activitiesCompleted[target].includes(a)) progress.activitiesCompleted[target].push(a);
      }
      delete progress.activitiesCompleted[old];
    }
  }
  if (typeof progress.totalStars !== "number") progress.totalStars = 0;
  return progress;
}

export function loadProgress(): KidsProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultProgress();
    const parsed = JSON.parse(raw) as KidsProgress;
    return ensureKeys(parsed);
  } catch {
    return getDefaultProgress();
  }
}

export function saveProgress(progress: KidsProgress) {
  try {
    progress.lastVisit = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {}
}

export function completeModule(ageGroup: string, moduleId: string): KidsProgress {
  const progress = loadProgress();
  if (!progress.completedModules[ageGroup]) {
    progress.completedModules[ageGroup] = [];
  }
  if (!progress.completedModules[ageGroup].includes(moduleId)) {
    progress.completedModules[ageGroup].push(moduleId);
    progress.totalStars += 1;
  }
  saveProgress(progress);
  return progress;
}

export function saveQuizScore(ageGroup: string, moduleId: string, score: number): KidsProgress {
  const progress = loadProgress();
  if (!progress.quizScores[ageGroup]) {
    progress.quizScores[ageGroup] = {};
  }
  const prev = progress.quizScores[ageGroup][moduleId] || 0;
  if (score > prev) {
    progress.quizScores[ageGroup][moduleId] = score;
  }
  saveProgress(progress);
  return progress;
}

export function completeActivity(ageGroup: string, activityId: string): KidsProgress {
  const progress = loadProgress();
  if (!progress.activitiesCompleted[ageGroup]) {
    progress.activitiesCompleted[ageGroup] = [];
  }
  if (!progress.activitiesCompleted[ageGroup].includes(activityId)) {
    progress.activitiesCompleted[ageGroup].push(activityId);
    progress.totalStars += 1;
  }
  saveProgress(progress);
  return progress;
}

export function getCompletionPercent(ageGroup: string, totalModules: number): number {
  const progress = loadProgress();
  const completed = progress.completedModules[ageGroup]?.length || 0;
  return totalModules > 0 ? Math.round((completed / totalModules) * 100) : 0;
}
