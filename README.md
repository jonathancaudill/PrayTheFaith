# Pray The Faith

A simple, beautiful site to help people pray the rosary: guided prayers, mysteries for today, scripture readings, and community encouragement.

## Stack

- **Frontend:** Preact + Vite + TypeScript
- **Backend:** Vercel serverless API + Supabase (Postgres)
- **MCP:** Optional [separate MCP server repo](https://github.com/your-org/PrayTheFaith-MCP) for moderating encouragement submissions via an AI agent

## Local development

1. Install dependencies: `npm install`
2. Run the dev server: `npm run dev`
3. Open [http://localhost:5173](http://localhost:5173)

For the encouragement and readings API to work, you need a Postgres database and environment variables (see below). Without them, the app still runs; encouragement will show empty and readings will be empty.

## Database (Supabase)

1. Create a project at [Supabase](https://supabase.com).
2. In **Project Settings → Database**, copy the **Connection string** (use **Connection pooling** / Transaction mode, port 6543, for serverless).
3. Run the schema and seed (with the URI you copied):
   ```bash
   psql "postgresql://postgres.[ref]:[PASSWORD]@...pooler.supabase.com:6543/postgres" -f scripts/schema.sql
   psql "..." -f scripts/seed-readings.sql   # optional
   ```
4. Put the connection string in `POSTGRES_URL` (see **Where to put API keys** below).

## Where to put API keys

**Local development**

- Create a file **`.env`** or **`.env.local`** in the project root (same folder as `package.json`).
- Add your variables there. These files are gitignored and will not be committed.
- Example:
  ```bash
  POSTGRES_URL=postgresql://postgres.xxxx:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres
  MCP_API_KEY=your-secret
  ```
- For the **frontend** only, you can also set `VITE_API_URL=http://localhost:5173` if you need to point at a different API.

**Production (Vercel)**

- In the Vercel dashboard: your project → **Settings → Environment Variables**.
- Add `POSTGRES_URL` (your Supabase connection string) and `MCP_API_KEY` for Production (and Preview if you want).
- Never commit real keys to the repo; use `.env` locally and Vercel’s UI in production.

## Environment variables

**Vercel (production) and local (.env / .env.local)**

- `POSTGRES_URL` – Supabase connection string (Database → Connection string, pooling recommended)
- `MCP_API_KEY` – Secret for MCP-only endpoints (list/approve/reject encouragements). Use the same value in your MCP client.

**Frontend (optional)**

- `VITE_API_URL` – Base URL of the API (e.g. `https://your-app.vercel.app`). Omit to use same origin.

**MCP server** (in the [separate PrayTheFaith-MCP repo](https://github.com/your-org/PrayTheFaith-MCP))

- `PRAY_THE_FAITH_API_URL` – Deployed site URL
- `MCP_API_KEY` – Same as in Vercel

## Hero background

The home and menu use a full-bleed background image. Add your own image at `public/landscape.jpg` (or update the URL in `src/index.css`). Without it, the hero uses a light grey background.

## Deploy on Vercel

1. Connect the repo to Vercel.
2. In **Settings → Environment Variables**, add `POSTGRES_URL` (your Supabase connection string) and `MCP_API_KEY` if you use the MCP server.
3. Deploy. The `api/` folder is deployed as serverless functions automatically.

## MCP server (optional)

The MCP server lives in a separate repo for compartmentalization. Clone and configure it so an AI agent (e.g. in Cursor) can list, approve, and reject encouragement submissions. See [PrayTheFaith-MCP](https://github.com/your-org/PrayTheFaith-MCP).
