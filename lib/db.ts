import { createClient } from '@vercel/postgres';

export interface EncouragementRow {
  id: string;
  author_name: string;
  location: string;
  content: string;
  status: 'pending' | 'approved';
  created_at: Date;
}

export interface ReadingRow {
  id: string;
  mystery_id: string;
  reference: string;
  text: string;
}

async function withClient<T>(fn: (client: ReturnType<typeof createClient>) => Promise<T>): Promise<T> {
  const client = createClient({ connectionString: process.env.POSTGRES_URL });
  await client.connect();
  try {
    return await fn(client);
  } finally {
    try { await client.end(); } catch { /* ignore close errors */ }
  }
}

export async function getOneApprovedEncouragement(): Promise<EncouragementRow | null> {
  return withClient(async (client) => {
    const { rows } = await client.sql`
      SELECT id, author_name, location, content, status, created_at
      FROM encouragements
      WHERE status = 'approved'
      ORDER BY created_at DESC
      LIMIT 1
    `;
    return (rows[0] as EncouragementRow) || null;
  });
}

export async function createEncouragement(data: {
  author_name: string;
  location: string;
  content: string;
}): Promise<{ id: string }> {
  return withClient(async (client) => {
    const { rows } = await client.sql`
      INSERT INTO encouragements (author_name, location, content, status)
      VALUES (${data.author_name}, ${data.location}, ${data.content}, 'pending')
      RETURNING id
    `;
    return { id: (rows[0] as { id: string }).id };
  });
}

export async function getReadingsByMystery(mystery_id: string): Promise<ReadingRow[]> {
  return withClient(async (client) => {
    const { rows } = await client.sql`
      SELECT id, mystery_id, reference, text
      FROM readings
      WHERE mystery_id = ${mystery_id}
      ORDER BY id
    `;
    return rows as ReadingRow[];
  });
}

export async function listPendingEncouragements(): Promise<EncouragementRow[]> {
  return withClient(async (client) => {
    const { rows } = await client.sql`
      SELECT id, author_name, location, content, status, created_at
      FROM encouragements
      WHERE status = 'pending'
      ORDER BY created_at ASC
    `;
    return rows as EncouragementRow[];
  });
}

export async function approveEncouragement(id: string): Promise<boolean> {
  return withClient(async (client) => {
    const { rowCount } = await client.sql`
      UPDATE encouragements SET status = 'approved' WHERE id = ${id} AND status = 'pending'
    `;
    return (rowCount ?? 0) > 0;
  });
}

export async function rejectEncouragement(id: string): Promise<boolean> {
  return withClient(async (client) => {
    const { rowCount } = await client.sql`
      DELETE FROM encouragements WHERE id = ${id} AND status = 'pending'
    `;
    return (rowCount ?? 0) > 0;
  });
}
