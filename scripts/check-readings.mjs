#!/usr/bin/env node
/**
 * Debug script: query readings for a mystery directly (same as API).
 * Run from project root:
 *   node --env-file=.env scripts/check-readings.mjs
 *   node --env-file=.env scripts/check-readings.mjs joy_1
 * (Node 18+ for --env-file; otherwise set POSTGRES_URL in the environment.)
 */

const mysteryId = process.argv[2] || 'joy_1';

async function main() {
  const conn = process.env.POSTGRES_URL;
  if (!conn) {
    console.error('POSTGRES_URL not set. Use --env-file=.env or export it.');
    process.exit(1);
  }

  console.log('Querying readings for mystery_id:', mysteryId);
  try {
    const { createClient } = await import('@vercel/postgres');
    const client = createClient({ connectionString: conn });
    const { rows } = await client.sql`
      SELECT id, mystery_id, reference, text
      FROM readings
      WHERE mystery_id = ${mysteryId}
      ORDER BY id
    `;
    const list = Array.isArray(rows) ? rows : (rows ? Array.from(rows) : []);
    console.log('Rows returned:', list.length);
    list.forEach((r, i) => {
      console.log('  ', i + 1, (r && typeof r === 'object' && 'reference' in r) ? r.reference : r);
    });
  } catch (e) {
    console.error('Error:', e);
    process.exit(1);
  }
}

main();
