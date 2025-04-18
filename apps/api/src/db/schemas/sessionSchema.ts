import { pgTable, serial, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { users } from "./userSchema"
import { sql } from "drizzle-orm"

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  sessionId: text("session_id").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`now()`)
    .notNull(),
})
