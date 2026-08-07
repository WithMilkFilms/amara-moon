import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema"

const globalForDb = globalThis as unknown as {
  amaraMoonPool: Pool | undefined
}

// Reuse the pool across hot reloads in development so we don't exhaust connections.
export const pool =
  globalForDb.amaraMoonPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
  })

if (process.env.NODE_ENV !== "production") {
  globalForDb.amaraMoonPool = pool
}

export const db = drizzle(pool, { schema })
