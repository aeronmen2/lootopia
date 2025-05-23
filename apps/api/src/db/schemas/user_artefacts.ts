import { pgTable, uuid, timestamp, text } from "drizzle-orm/pg-core"
import { artefact } from "./artefacts"
import { users } from "./userSchema"
import { hunts } from "./hunts"

export const userArtefact = pgTable("user_artefact", {
  id: uuid("id").primaryKey().defaultRandom(), // id de l'instance
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  artefactId: uuid("artefact_id")
    .notNull()
    .references(() => artefact.id, { onDelete: "cascade" }),
  huntId: uuid("hunt_id")
    .references(() => hunts.id, { onDelete: "cascade" }),
  obtainedAt: timestamp("obtained_at").defaultNow().notNull(),
})

export type userArtefact = typeof userArtefact.$inferSelect
export type userArtefactInsert = typeof userArtefact.$inferInsert
