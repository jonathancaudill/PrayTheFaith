const API_BASE =
  typeof import.meta.env !== 'undefined' &&
  (import.meta.env as { VITE_API_URL?: string }).VITE_API_URL
    ? (import.meta.env as { VITE_API_URL: string }).VITE_API_URL
    : '';

const SUPABASE_URL =
  typeof import.meta.env !== 'undefined'
    ? (import.meta.env as { VITE_SUPABASE_URL?: string }).VITE_SUPABASE_URL
    : '';
const SUPABASE_ANON_KEY =
  typeof import.meta.env !== 'undefined'
    ? (import.meta.env as { VITE_SUPABASE_ANON_KEY?: string }).VITE_SUPABASE_ANON_KEY
    : '';
// Only use Supabase REST in development (localhost), never in production
const USE_SUPABASE_REST = 
  Boolean(SUPABASE_URL && SUPABASE_ANON_KEY) && 
  typeof window !== 'undefined' && 
  window.location.hostname === 'localhost';

export interface Reading {
  id: string;
  mystery_id: string;
  reference: string;
  text: string;
}

const cache = new Map<string, Reading[]>();

function normalize(raw: unknown[]): Reading[] {
  return raw
    .filter((x): x is Record<string, unknown> => x != null && typeof x === 'object')
    .map((x) => ({
      id: String(x.id ?? ''),
      mystery_id: String(x.mystery_id ?? ''),
      reference: String(x.reference ?? ''),
      text: String(x.text ?? ''),
    }))
    .filter((x) => x.reference || x.text);
}

function fetchFromSupabase(mysteryId: string): Promise<Reading[]> {
  const baseUrl = SUPABASE_URL!.replace(/\/$/, '');
  const anonKey = SUPABASE_ANON_KEY!;
  const url = `${baseUrl}/rest/v1/readings?mystery_id=eq.${encodeURIComponent(mysteryId)}&order=id.asc`;
  return fetch(url, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      Accept: 'application/json',
    },
  })
    .then((r) => (r.ok ? r.json() : []))
    .then((data) => (Array.isArray(data) ? normalize(data) : []));
}

function fetchFromApi(mysteryId: string): Promise<Reading[]> {
  const url = `${API_BASE}/api/readings?mystery_id=${encodeURIComponent(mysteryId)}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  return fetch(url, { signal: controller.signal })
    .then((r) => {
      clearTimeout(timeoutId);
      if (!r.ok) return r.text().then(() => []);
      return r.json();
    })
    .then((data) => {
      const raw = Array.isArray(data)
        ? data
        : Array.isArray((data as { rows?: unknown[] })?.rows)
          ? (data as { rows: unknown[] }).rows
          : [];
      return normalize(raw);
    })
    .catch(() => {
      clearTimeout(timeoutId);
      return [];
    });
}

/**
 * Fetch readings for a mystery. Returns cached data if available, otherwise fetches.
 */
export function fetchReadings(mysteryId: string): Promise<Reading[]> {
  const cached = cache.get(mysteryId);
  if (cached) return Promise.resolve(cached);

  const promise = USE_SUPABASE_REST
    ? fetchFromSupabase(mysteryId)
    : fetchFromApi(mysteryId);

  return promise.then((data) => {
    cache.set(mysteryId, data);
    return data;
  });
}

/**
 * Prefetch readings for multiple mysteries. Fetches in parallel; does not block.
 */
export function prefetchReadings(mysteryIds: string[]): void {
  for (const id of mysteryIds) {
    if (!cache.has(id)) {
      fetchReadings(id);
    }
  }
}
