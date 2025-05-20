import { relations } from "drizzle-orm"
import { users, authTokens, sessions } from "./schemas"

export const usersRelations = relations(users, ({ many }) => ({
  authTokens: many(authTokens),
  sessions: many(sessions),
}))

export const authTokensRelations = relations(authTokens, ({ one }) => ({
  user: one(users, {
    fields: [authTokens.userId],
    references: [users.id],
  }),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))
