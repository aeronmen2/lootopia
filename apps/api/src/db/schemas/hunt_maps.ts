import { pgTable, uuid, text, boolean, timestamp, numeric } from "drizzle-orm/pg-core"

export const huntMaps = pgTable("hunt_maps", {
  id: uuid("id").primaryKey().defaultRandom(),
  huntId: uuid("hunt_id").notNull(), // FK vers hunts
  name: text("name"),
  skin: text("skin"),
  zone: text("zone"),
  scaleMin: numeric("scale_min"),
  scaleMax: numeric("scale_max"),
  isForDig: boolean("is_for_dig").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export type HuntMap = typeof huntMaps.$inferSelect
export type HuntMapInsert = typeof huntMaps.$inferInsert
