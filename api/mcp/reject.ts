import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as db from '../../lib/db';

const MCP_API_KEY = process.env.MCP_API_KEY || '';

function unauthorized(res: VercelResponse) {
  return res.status(401).json({ error: 'Unauthorized' });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const key = req.headers.authorization?.replace(/^Bearer\s+/i, '') || (req.body as { api_key?: string })?.api_key;
  if (!MCP_API_KEY || key !== MCP_API_KEY) {
    return unauthorized(res);
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const id = (req.body as { id?: string })?.id;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'id is required' });
  }

  try {
    const ok = await db.rejectEncouragement(id);
    return res.status(200).json({ rejected: ok });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to reject' });
  }
}
