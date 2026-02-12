import { Pool } from 'pg';

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

const pool = new Pool({ connectionString: process.env.POSTGRES_URL });

export async function getOneApprovedEncouragement(): Promise<EncouragementRow | null> {
  const { rows } = await pool.query(`
    SELECT id, author_name, location, content, status, created_at
    FROM encouragements
    WHERE status = 'approved'
    ORDER BY created_at DESC
    LIMIT 1
  `);
  return (rows[0] as EncouragementRow) || null;
}

export async function createEncouragement(data: {
  author_name: string;
  location: string;
  content: string;
}): Promise<{ id: string }> {
  const { rows } = await pool.query(
    `INSERT INTO encouragements (author_name, location, content, status)
     VALUES ($1, $2, $3, 'pending')
     RETURNING id`,
    [data.author_name, data.location, data.content]
  );
  return { id: rows[0].id };
}

export async function getReadingsByMystery(mystery_id: string): Promise<ReadingRow[]> {
  const { rows } = await pool.query(
    `SELECT id, mystery_id, reference, text
     FROM readings
     WHERE mystery_id = $1
     ORDER BY id`,
    [mystery_id]
  );
  return rows as ReadingRow[];
}

export async function listPendingEncouragements(): Promise<EncouragementRow[]> {
  const { rows } = await pool.query(`
    SELECT id, author_name, location, content, status, created_at
    FROM encouragements
    WHERE status = 'pending'
    ORDER BY created_at ASC
  `);
  return rows as EncouragementRow[];
}

export async function approveEncouragement(id: string): Promise<boolean> {
  const { rowCount } = await pool.query(
    `UPDATE encouragements SET status = 'approved' WHERE id = $1 AND status = 'pending'`,
    [id]
  );
  return (rowCount ?? 0) > 0;
}

export async function rejectEncouragement(id: string): Promise<boolean> {
  const { rowCount } = await pool.query(
    `DELETE FROM encouragements WHERE id = $1 AND status = 'pending'`,
    [id]
  );
  return (rowCount ?? 0) > 0;
}
