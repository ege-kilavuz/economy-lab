export interface Env {
  SCORES: KVNamespace;
}

interface ScoreEntry {
  name: string;
  score: number;
  difficulty: string;
  day: number;
  timestamp: number;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    // GET /scores — Top 20 leaderboard
    if (request.method === 'GET' && path === '/scores') {
      const list = await env.SCORES.list();
      const entries: ScoreEntry[] = [];

      for (const key of list.keys) {
        const val = await env.SCORES.get(key.name);
        if (val) {
          try {
            entries.push(JSON.parse(val));
          } catch { /* skip corrupt entries */ }
        }
      }

      // Sort by score descending, limit to 20
      entries.sort((a, b) => b.score - a.score);
      return json(entries.slice(0, 20));
    }

    // POST /scores — Submit a new score
    if (request.method === 'POST' && path === '/scores') {
      try {
        const body: ScoreEntry = await request.json();

        if (!body.name || typeof body.score !== 'number') {
          return json({ error: 'name and score required' }, 400);
        }

        if (body.name.length > 20) {
          return json({ error: 'name too long (max 20 chars)' }, 400);
        }

        const entry: ScoreEntry = {
          name: body.name.slice(0, 20),
          score: body.score,
          difficulty: body.difficulty || 'easy',
          day: body.day || 0,
          timestamp: Date.now(),
        };

        const key = `${entry.timestamp}-${entry.name}`;
        await env.SCORES.put(key, JSON.stringify(entry));
        return json({ ok: true });
      } catch {
        return json({ error: 'invalid json' }, 400);
      }
    }

    return json({ error: 'not found' }, 404);
  },
};
