// src/config/config.ts
import dotenv from "dotenv"

dotenv.config()

export default {
  port: process.env.PORT || 3000,
  databaseUrl: process.env.DATABASE_URL || "",
  jwtSecret: process.env.JWT_SECRET || "your-jwt-secret",
  cookieSecret: process.env.COOKIE_SECRET || "your-cookie-secret",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  cookieSettings: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60,
    sameSite: "strict" as const,
  },
}
