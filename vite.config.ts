import { defineConfig, loadEnv } from 'vite';
import preact from '@preact/preset-vite';
import path from 'path';

export default defineConfig(({ mode }) => ({
  server: {
    port: 5174,
  },
  plugins: [
    preact(),
    {
      name: 'api-dev-proxy',
      configureServer(server) {
        /* Load ALL .env vars (not just VITE_*) into process.env
           so @vercel/postgres can find POSTGRES_URL */
        const env = loadEnv(mode, process.cwd(), '');
        for (const k in env) {
          if (process.env[k] === undefined) process.env[k] = env[k];
        }

        server.middlewares.use(async (req, res, next) => {
          if (!req.url?.startsWith('/api/')) return next();

          const conn = process.env.POSTGRES_URL;
          if (!conn) {
            console.log('[api] POSTGRES_URL not set');
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'POSTGRES_URL not set' }));
            return;
          }

          try {
            const url = new URL(req.url, 'http://localhost');

            /* ---- /api/health ---- */
            if (url.pathname === '/api/health') {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ ok: true, ts: new Date().toISOString() }));
              return;
            }

            /* ---- /api/readings ---- */
            if (url.pathname === '/api/readings') {
              const mystery_id = url.searchParams.get('mystery_id');
              console.log('[api] /api/readings received, mystery_id=', mystery_id);
              if (!mystery_id) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'mystery_id required' }));
                return;
              }
              console.log('[api] importing createClient...');
              const { createClient } = await import('@vercel/postgres');
              console.log('[api] creating client...');
              const client = createClient({ connectionString: conn });
              console.log('[api] querying DB...');
              const QUERY_MS = 8000;
              const queryPromise = client.sql`
                SELECT id, mystery_id, reference, text
                FROM readings
                WHERE mystery_id = ${mystery_id}
                ORDER BY id
              `;
              const timeoutPromise = new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error('DB query timeout')), QUERY_MS)
              );
              const { rows } = await Promise.race([queryPromise, timeoutPromise]);
              console.log('[api] query done, rows=', Array.isArray(rows) ? rows.length : 'not-array');
              const rawRows = Array.isArray(rows) ? rows : (rows ? Array.from(rows as Iterable<Record<string, unknown>>) : []);
              const list = rawRows.map((r: Record<string, unknown>) => ({
                id: String(r?.id ?? ''),
                mystery_id: String(r?.mystery_id ?? ''),
                reference: String(r?.reference ?? ''),
                text: String(r?.text ?? ''),
              }));
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(list));
              return;
            }

            /* ---- /api/encouragement ---- */
            if (url.pathname === '/api/encouragement') {
              if (req.method === 'GET') {
                const { rows } = await client.sql`
                  SELECT id, author_name, location, content
                  FROM encouragements
                  WHERE status = 'approved'
                  ORDER BY created_at DESC
                  LIMIT 1
                `;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(rows[0] || null));
                return;
              }
              if (req.method === 'POST') {
                const body = await new Promise<string>((resolve) => {
                  let data = '';
                  req.on('data', (chunk: Buffer) => { data += chunk.toString(); });
                  req.on('end', () => resolve(data));
                });
                const data = JSON.parse(body);
                const { rows } = await client.sql`
                  INSERT INTO encouragements (author_name, location, content, status)
                  VALUES (${data.author_name}, ${data.location}, ${data.content}, 'pending')
                  RETURNING id
                `;
                res.statusCode = 201;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ id: (rows[0] as { id: string }).id }));
                return;
              }
            }

            next();
          } catch (e) {
            console.error('[api] proxy error:', e);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Server error', message: e instanceof Error ? e.message : String(e) }));
          }
        });
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}));
