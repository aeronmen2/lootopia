import { pgTable, uuid, timestamp, boolean } from "drizzle-orm/pg-core"
import { users } from "./userSchema"
import { step } from "./steps"

export const userStep = pgTable("userStep", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  stepId: uuid("step_id").notNull().references(() => step.id, { onDelete: "cascade" }),
  isValid: boolean("is_valid").default(false),
  validatedAt: timestamp("validated_at").defaultNow(),
})

export type UserStep = typeof userStep.$inferSelect
export type UserStepInsert = typeof userStep.$inferInsert
