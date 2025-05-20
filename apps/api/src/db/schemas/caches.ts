import { pgTable, uuid, numeric, boolean, integer, timestamp } from "drizzle-orm/pg-core"
import { huntMaps } from "./hunt_maps"
import { hunts } from "./hunts"

export const caches = pgTable("caches", {
  id: uuid("id").primaryKey().defaultRandom(),
  huntId: uuid("hunt_id")
    .notNull()
    .references(() => hunts.id, { onDelete: "cascade" }),
  mapId: uuid("map_id").references(() => huntMaps.id),
  lat: numeric("lat").notNull(),
  lng: numeric("lng").notNull(),
  sizeCm: integer("size_cm").default(80),
  isVisible: boolean("is_visible").default(false),
  precisionM: integer("precision_m").default(1), // Précision en mètres
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export type Cache = typeof caches.$inferSelect
export type CacheInsert = typeof caches.$inferInsert
