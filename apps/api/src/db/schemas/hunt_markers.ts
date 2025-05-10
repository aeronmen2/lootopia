import { pgTable, uuid, text, numeric, boolean, timestamp } from "drizzle-orm/pg-core"

export const huntMarkers = pgTable("hunt_markers", {
  id: uuid("id").primaryKey().defaultRandom(),
  mapId: uuid("map_id").notNull(), // FK vers hunt_maps
  type: text("type").notNull(), // "marker", "step", "cache"
  lat: numeric("lat").notNull(),
  lng: numeric("lng").notNull(),
  label: text("label"),
  visibleToUsers: boolean("visible_to_users").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export type HuntMarker = typeof huntMarkers.$inferSelect
export type HuntMarkerInsert = typeof huntMarkers.$inferInsert
