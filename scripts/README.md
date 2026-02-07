# Database setup

1. **Create the schema**  
   In the Vercel dashboard, open your Postgres store and run the contents of `schema.sql` in the SQL tab.  
   Or with `psql`: `psql $POSTGRES_URL -f schema.sql`

2. **Seed readings (optional)**  
   Run `seed-readings.sql` in the same way, or use the Vercel SQL tab.  
   Or: `psql $POSTGRES_URL -f seed-readings.sql`

3. **Environment**  
   Ensure `POSTGRES_URL` (or Vercel’s automatic Postgres env vars) are set for the project so the API can connect.
