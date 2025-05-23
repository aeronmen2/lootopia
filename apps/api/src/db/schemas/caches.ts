import { pgTable, uuid, numeric, boolean, integer, timestamp } from "drizzle-orm/pg-core"
import { step } from "./steps"

export const cache = pgTable("cache", {
  id: uuid("id").primaryKey().defaultRandom(),
  stepId: uuid("step_id")
    .notNull()
    .references(() => step.id, { onDelete: "cascade" }),
  lat: numeric("lat").notNull(),
  lng: numeric("lng").notNull(),
  sizeCm: integer("size_cm").default(80),
  isVisible: boolean("is_visible").default(false),
  precisionM: integer("precision_m").default(1), // Précision en mètres
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export type Cache = typeof cache.$inferSelect
export type CacheInsert = typeof cache.$inferInsert
