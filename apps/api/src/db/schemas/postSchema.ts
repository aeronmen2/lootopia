// src/db/schemas/postSchema.ts
import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core"
import { users } from "./userSchema"
import { relations } from "drizzle-orm"

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export type Post = typeof posts.$inferSelect
export type NewPost = typeof posts.$inferInsert
