// src/config/config.ts
import dotenv from "dotenv"

dotenv.config()

export default {
  appUrl: process.env.API_URL || "http://localhost:3000",
  port: process.env.PORT || 3000,
  databaseUrl: process.env.DATABASE_URL || "",
  jwtSecret: process.env.JWT_SECRET || "your-jwt-secret",
  cookieSecret: process.env.COOKIE_SECRET || "your-cookie-secret",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  cookieSettings: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60,
    sameSite: "strict" as const,
    path: "/",
  },
  email: {
    resendApiKey: process.env.RESEND_API_KEY || "your_resend_api_key",
    fromName: "Your App Name",
    fromEmail: "noreply@aeronmen.com",
  },
}
