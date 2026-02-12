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

function getClient() {
  return createClient({ connectionString: process.env.POSTGRES_URL });
}

export async function getOneApprovedEncouragement(): Promise<EncouragementRow | null> {
  const client = getClient();
  try {
    const { rows } = await client.sql`
      SELECT id, author_name, location, content, status, created_at
      FROM encouragements
      WHERE status = 'approved'
      ORDER BY created_at DESC
      LIMIT 1
    `;
    return (rows[0] as EncouragementRow) || null;
  } finally {
    await client.end();
  }
}

export async function createEncouragement(data: {
  author_name: string;
  location: string;
  content: string;
}): Promise<{ id: string }> {
  const client = getClient();
  try {
    const { rows } = await client.sql`
      INSERT INTO encouragements (author_name, location, content, status)
      VALUES (${data.author_name}, ${data.location}, ${data.content}, 'pending')
      RETURNING id
    `;
    return { id: (rows[0] as { id: string }).id };
  } finally {
    await client.end();
  }
}

export async function getReadingsByMystery(mystery_id: string): Promise<ReadingRow[]> {
  const client = getClient();
  try {
    const { rows } = await client.sql`
      SELECT id, mystery_id, reference, text
      FROM readings
      WHERE mystery_id = ${mystery_id}
      ORDER BY id
    `;
    return rows as ReadingRow[];
  } finally {
    await client.end();
  }
}

export async function listPendingEncouragements(): Promise<EncouragementRow[]> {
  const client = getClient();
  try {
    const { rows } = await client.sql`
      SELECT id, author_name, location, content, status, created_at
      FROM encouragements
      WHERE status = 'pending'
      ORDER BY created_at ASC
    `;
    return rows as EncouragementRow[];
  } finally {
    await client.end();
  }
}

export async function approveEncouragement(id: string): Promise<boolean> {
  const client = getClient();
  try {
    const { rowCount } = await client.sql`
      UPDATE encouragements SET status = 'approved' WHERE id = ${id} AND status = 'pending'
    `;
    return (rowCount ?? 0) > 0;
  } finally {
    await client.end();
  }
}

export async function rejectEncouragement(id: string): Promise<boolean> {
  const client = getClient();
  try {
    const { rowCount } = await client.sql`
      DELETE FROM encouragements WHERE id = ${id} AND status = 'pending'
    `;
    return (rowCount ?? 0) > 0;
  } finally {
    await client.end();
  }
}
