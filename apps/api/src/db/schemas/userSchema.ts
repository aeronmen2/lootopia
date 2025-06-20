import { pgTable, text, timestamp, boolean, uuid } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Basic info
  name: text("name").notNull(),
  lastname: text("lastname").notNull(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),

  // Verification and security
  emailVerified: boolean("email_verified").default(false).notNull(),
  verificationToken: text("verification_token"),
  verificationTokenExpiry: timestamp("verification_token_expiry"),
  resetPasswordToken: text("reset_password_token"),
  resetPasswordTokenExpiry: timestamp("reset_password_token_expiry"),

  // Contact & location
  phoneNumber: text("phone_number"),
  country: text("country"),
  region: text("region"),
  city: text("city"),
  address: text("address"),

  // Profile customization
  photoUrl: text("photo_url"),
  bio: text("bio"),
  website: text("website"),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export type User = typeof users.$inferSelect
export type UserInsert = typeof users.$inferInsert
