import { relations } from "drizzle-orm"
import { users, posts, authTokens, sessions } from "./schemas"

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  authTokens: many(authTokens),
  sessions: many(sessions),
}))

export const postsRelations = relations(posts, ({ one }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
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
