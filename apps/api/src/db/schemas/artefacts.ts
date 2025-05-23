import { pgTable, uuid, text } from "drizzle-orm/pg-core"

export const artefact = pgTable("artefact", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  rarity: text("rarity").notNull(), // "common", "rare", "epic", "legendary", etc.
  imageUrl: text("image_url"), // lien vers une image ou illustration
})

export type Artefact = typeof artefact.$inferSelect
export type ArtefactInsert = typeof artefact.$inferInsert
