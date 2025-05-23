import { pgTable, uuid, integer, text } from "drizzle-orm/pg-core"
import { map } from "./maps"

export const step = pgTable("step", {
  id: uuid("id").primaryKey().defaultRandom(),
  mapId: uuid("map_id")
    .notNull()
    .references(() => map.id, { onDelete: "cascade" }),
  content: text("content").notNull(), // Énigme ou texte de l'étape
  order: integer("order").notNull(),
})

export type Step = typeof step.$inferSelect
export type StepInsert = typeof step.$inferInsert
