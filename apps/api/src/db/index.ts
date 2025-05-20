import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import config from "../config/config"
import * as schema from "./schemas"
import * as relations from "./relations"

const pool = new Pool({
  connectionString: config.databaseUrl,
})

export const db = drizzle(pool, {
  schema: {
    ...schema,
    ...relations,
  },
})

export { schema, relations }
