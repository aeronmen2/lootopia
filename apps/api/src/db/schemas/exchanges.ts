import { pgTable, uuid, timestamp } from "drizzle-orm/pg-core"
import { artefact } from "./artefacts"
import { users } from "./userSchema"

export const exchange = pgTable("exchange", {
  id: uuid("id").primaryKey().defaultRandom(), // id de l'instance
  userSender: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  userReceiver: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  artefactId: uuid("artefact_id")
    .notNull()
    .references(() => artefact.id, { onDelete: "cascade" }),
  exchangedAt: timestamp("obtained_at").defaultNow().notNull(),
})

export type Exchange = typeof exchange.$inferSelect
export type ExchangeInsert = typeof exchange.$inferInsert
