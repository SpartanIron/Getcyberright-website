const API_BASE = `http://localhost:${process.env.PORT || 5000}`;

async function apiFetch<T>(path: string, fallback: T, revalidate = 3600): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${path}`, { next: { revalidate } });
    if (!res.ok) return fallback;
    return res.json();
  } catch {
    return fallback;
  }
}

export async function getPublishedGuides() {
  return apiFetch("/api/guides", []);
}

export async function getPublishedScamIntel() {
  return apiFetch("/api/scam-intel", []);
}

export async function getLatestNews(limit = 100) {
  const fallback = { articles: [], lastUpdated: null, stats: { categories: [], totalArticles: 0, lastFetch: null } };
  return apiFetch(`/api/news/latest?limit=${limit}`, fallback);
}

export async function getAllLearningPaths() {
  return apiFetch("/api/training/paths", []);
}
