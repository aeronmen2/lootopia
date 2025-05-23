import { pgTable, uuid, timestamp, text, integer } from "drizzle-orm/pg-core"
import { users } from "./userSchema"
import { cache } from "./caches"

export const dig = pgTable("dig", {
  id: uuid("id").primaryKey().defaultRandom(),
  cacheId: uuid("cache_id")
    .references(() => cache.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  lat: integer("lat").notNull(), // Latitude
  lng: integer("lng").notNull(), // Longitude
  digTime: timestamp("dig_time").defaultNow().notNull(),
  result: text("result").notNull(), // "found" ou "missed"
  crownsSpent: integer("crowns_spent").default(0),
})

export type Dig = typeof dig.$inferSelect
export type DigInsert = typeof dig.$inferInsert
