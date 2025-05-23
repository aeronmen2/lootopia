import { pgTable, uuid, text, boolean, timestamp, numeric } from "drizzle-orm/pg-core"

export const map = pgTable("map", {
  id: uuid("id").primaryKey().defaultRandom(),
  huntId: uuid("hunt_id").notNull(), // FK vers hunts
  name: text("name"),
  skin: text("skin"),
  bearing: numeric("bearing").notNull(),
  lng: numeric("lng").notNull(),
  lat: numeric("lat").notNull(),
  zoom: numeric("zoom").notNull(),
  pitch: numeric("pitch").notNull(),
  isForDig: boolean("is_for_dig").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export type Map = typeof map.$inferSelect
export type MapInsert = typeof map.$inferInsert
