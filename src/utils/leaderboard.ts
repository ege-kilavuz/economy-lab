const API_BASE = 'https://econ-lab-leaderboard.egela7863.workers.dev';

export interface ScoreEntry {
  name: string;
  score: number;
  difficulty: string;
  day: number;
  timestamp: number;
}

export async function fetchLeaderboard(): Promise<ScoreEntry[]> {
  try {
    const res = await fetch(`${API_BASE}/scores`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function submitScore(name: string, score: number, difficulty: string, day: number): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/scores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, score, difficulty, day }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
