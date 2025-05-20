import { pgTable, uuid, text, timestamp, integer, boolean } from "drizzle-orm/pg-core"
import { users } from "./userSchema"

export const hunts = pgTable("hunts", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  worldType: text("world_type").notNull(), // "real" ou "map"
  mode: text("mode").notNull(), // "public" ou "private"
  status: text("status").notNull(), // "draft", "active", "closed"
  organizerId: uuid("organizer_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  maxParticipants: integer("max_participants"),
  feeCrowns: integer("fee_crowns").default(0),
  chatEnabled: boolean("chat_enabled").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export type Hunt = typeof hunts.$inferSelect
export type HuntInsert = typeof hunts.$inferInsert
