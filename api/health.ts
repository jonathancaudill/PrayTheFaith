import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Minimal health check - no DB, no imports from db.
 * Hit /api/health to verify serverless functions are deployed and running.
 */
export default async function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  return res.status(200).json({ ok: true, ts: new Date().toISOString() });
}
