import { config } from "dotenv"

config()

export default {
  databaseUrl:
    process.env.DATABASE_URL ||
    "postgres://postgres:postgres@localhost:5432/hono_drizzle_db",
}
