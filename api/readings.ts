import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as db from '../lib/db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const mystery_id = typeof req.query.mystery_id === 'string' ? req.query.mystery_id : null;
  if (!mystery_id) {
    return res.status(400).json({ error: 'mystery_id query is required' });
  }

  try {
    const rows = await db.getReadingsByMystery(mystery_id);
    return res.status(200).json(rows.map((r) => ({ id: r.id, mystery_id: r.mystery_id, reference: r.reference, text: r.text })));
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to fetch readings' });
  }
}
