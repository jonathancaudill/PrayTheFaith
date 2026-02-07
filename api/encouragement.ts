import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as db from './db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'GET') {
    try {
      const row = await db.getOneApprovedEncouragement();
      if (!row) {
        return res.status(200).json(null);
      }
      return res.status(200).json({
        id: row.id,
        author_name: row.author_name,
        location: row.location,
        content: row.content,
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'Failed to fetch encouragement' });
    }
  }

  if (req.method === 'POST') {
    const body = req.body as { author_name?: string; location?: string; content?: string };
    if (!body?.author_name?.trim() || !body?.location?.trim() || !body?.content?.trim()) {
      return res.status(400).json({ error: 'author_name, location, and content are required' });
    }
    try {
      const { id } = await db.createEncouragement({
        author_name: body.author_name.trim(),
        location: body.location.trim(),
        content: body.content.trim(),
      });
      return res.status(201).json({ id });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'Failed to submit encouragement' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
