import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import config from "../config/config"
import * as postSchema from "./schemas/postSchema"
import * as userSchema from "./schemas/userSchema"

const pool = new Pool({
  connectionString: config.databaseUrl,
})

export const db = drizzle(pool, {
  schema: {
    ...userSchema,
    ...postSchema,
  },
})

export const schemas = {
  users: userSchema,
  posts: postSchema,
}
