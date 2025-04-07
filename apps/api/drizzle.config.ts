import type { Config } from "drizzle-kit"
import config from "./src/config/config"

export default {
  schema: "./src/db/schemas/*.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: config.databaseUrl,
  },
} satisfies Config
