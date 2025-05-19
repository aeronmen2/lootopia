import { pgTable, uuid, text, timestamp, unique } from "drizzle-orm/pg-core"
import { hunts } from "./hunts"
import { users } from "./userSchema"

export const huntParticipants = pgTable(
  "hunt_participants",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    huntId: uuid("hunt_id")
      .notNull()
      .references(() => hunts.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    status: text("status").notNull(), // "enrolled", "completed", "abandoned"
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
    leftAt: timestamp("left_at"),
  },
  (table) => ({
    uniqueHuntUser: unique().on(table.huntId, table.userId),
  })
)

export type HuntParticipant = typeof huntParticipants.$inferSelect
export type HuntParticipantInsert = typeof huntParticipants.$inferInsert