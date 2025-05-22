import crypto from "crypto"
import { eq, and, gt, lt } from "drizzle-orm"
import { db } from "../db"
import { users } from "../db/schemas/userSchema"
import type { User } from "../db/schemas/userSchema"
import { sessions } from "../db/schemas/sessionSchema"
import { authTokens } from "../db/schemas/authTokenSchema"
import { emailService } from "./emailService"

export class AuthService {
  private static readonly SALT_ROUNDS = {
    algorithm: "bcrypt",
    cost: 10,
  } as const
  private static readonly VERIFICATION_TOKEN_EXPIRY = 24 * 60 * 60 * 1000 // 24 hours
  private static readonly TOKEN_EXPIRY = 15 * 60 * 1000 // 15 minutes
  private static readonly SESSION_EXPIRY = 5 * 60 * 1000 // 5 minutes

  async signup(name: string, email: string, password: string) {
    email = email.toLowerCase().trim()

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    })

    if (existingUser) {
      throw new Error("Email already in use")
    }

    const passwordHash = await Bun.password.hash(
      password,
      AuthService.SALT_ROUNDS,
    )

    const verificationToken = crypto.randomBytes(32).toString("hex")
    const verificationTokenExpiry = new Date(
      Date.now() + AuthService.VERIFICATION_TOKEN_EXPIRY,
    )

    const [user] = await db
      .insert(users)
      .values({
        name,
        lastname: "",
        username: name.toLowerCase().replace(/\s+/g, ""),
        email,
        passwordHash,
        verificationToken,
        verificationTokenExpiry,
      })
      .returning()

    void emailService.sendVerificationEmail(email, verificationToken)

    return { userId: user.id, email: user.email }
  }

  async verifyEmail(token: string) {
    const user = await db.query.users.findFirst({
      where: eq(users.verificationToken, token),
    })

    if (!user || !user.verificationTokenExpiry) {
      throw new Error("Invalid verification token")
    }

    if (new Date() > user.verificationTokenExpiry) {
      throw new Error("Verification token expired")
    }

    await db
      .update(users)
      .set({
        emailVerified: true,
        verificationToken: null,
        verificationTokenExpiry: null,
      })
      .where(eq(users.id, user.id))

    return { success: true }
  }

  async login(email: string, password: string) {
    email = email.toLowerCase().trim()

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    })

    if (!user) {
      throw new Error("Invalid credentials")
    }

    const isPasswordValid = await Bun.password.verify(
      password,
      user.passwordHash,
    )

    if (!isPasswordValid) {
      throw new Error("Invalid credentials")
    }

    if (!user.emailVerified) {
      throw new Error("Email not verified")
    }

    const sessionId = crypto.randomUUID()

    const now = new Date()
    const sessionExpiresAt = new Date(
      now.getTime() + AuthService.SESSION_EXPIRY,
    )
    // Debug timestamps
    console.log("Current time (local):", now.toString())
    console.log("Current time (UTC):", now.toISOString())
    console.log("SESSION_EXPIRY (ms):", AuthService.SESSION_EXPIRY)
    console.log("Session expires at (local):", sessionExpiresAt.toString())
    console.log("Session expires at (UTC):", sessionExpiresAt.toISOString())

    await db.insert(sessions).values({
      userId: user.id,
      sessionId,
      expiresAt: sessionExpiresAt,
    })

    const token = crypto.randomBytes(32).toString("hex")
    const refreshToken = crypto.randomBytes(32).toString("hex")
    const tokenExpiresAt = new Date(Date.now() + AuthService.TOKEN_EXPIRY)

    await db.insert(authTokens).values({
      userId: user.id,
      token,
      refreshToken,
      expiresAt: tokenExpiresAt,
    })

    return {
      sessionId,
      token,
      refreshToken,
      tokenExpiresAt,
      user: this.sanitizeUser(user),
    }
  }

  async logout(sessionId: string) {
    await db.delete(sessions).where(eq(sessions.sessionId, sessionId))

    return { success: true }
  }

  async refreshToken(refreshToken: string) {
    const tokenRecord = await db.query.authTokens.findFirst({
      where: eq(authTokens.refreshToken, refreshToken),
      with: {
        user: true,
      },
    })

    if (!tokenRecord) {
      throw new Error("Invalid refresh token")
    }

    await db.delete(authTokens).where(eq(authTokens.id, tokenRecord.id))

    const newToken = crypto.randomBytes(32).toString("hex")
    const newRefreshToken = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + AuthService.TOKEN_EXPIRY)

    const sessionId = crypto.randomUUID()
    const sessionExpiresAt = new Date(Date.now() + AuthService.SESSION_EXPIRY)

    await db.insert(sessions).values({
      userId: tokenRecord.userId,
      sessionId,
      expiresAt: sessionExpiresAt,
    })

    const [newTokenRecord] = await db
      .insert(authTokens)
      .values({
        userId: tokenRecord.userId,
        token: newToken,
        refreshToken: newRefreshToken,
        expiresAt,
      })
      .returning()

    return {
      token: newTokenRecord.token,
      refreshToken: newTokenRecord.refreshToken,
      expiresAt: newTokenRecord.expiresAt,
      sessionId, // Add the sessionId to the return value
      user: this.sanitizeUser(tokenRecord.user),
    }
  }

  async validateSession(sessionId: string) {
    const session = await db.query.sessions.findFirst({
      where: and(
        eq(sessions.sessionId, sessionId),
        gt(sessions.expiresAt, new Date()),
      ),
      with: {
        user: true,
      },
    })

    if (!session) {
      return null
    }

    return {
      userId: session.userId,
      user: this.sanitizeUser(session.user),
    }
  }

  async validateToken(token: string) {
    const tokenRecord = await db.query.authTokens.findFirst({
      where: and(
        eq(authTokens.token, token),
        gt(authTokens.expiresAt, new Date()),
      ),
      with: {
        user: true,
      },
    })

    if (!tokenRecord) {
      return null
    }

    return {
      userId: tokenRecord.userId,
      user: this.sanitizeUser(tokenRecord.user),
    }
  }

  async requestPasswordReset(email: string) {
    email = email.toLowerCase().trim()

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    })

    if (!user) {
      return { success: true }
    }

    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenExpiry = new Date(
      Date.now() + AuthService.VERIFICATION_TOKEN_EXPIRY,
    )

    await db
      .update(users)
      .set({
        resetPasswordToken: resetToken,
        resetPasswordTokenExpiry: resetTokenExpiry,
      })
      .where(eq(users.id, user.id))

    await emailService.sendPasswordResetEmail(email, resetToken)

    return { success: true }
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await db.query.users.findFirst({
      where: eq(users.resetPasswordToken, token),
    })

    if (!user || !user.resetPasswordTokenExpiry) {
      throw new Error("Invalid reset token")
    }

    if (new Date() > user.resetPasswordTokenExpiry) {
      throw new Error("Reset token expired")
    }

    const passwordHash = await Bun.password.hash(
      newPassword,
      AuthService.SALT_ROUNDS,
    )

    await db
      .update(users)
      .set({
        passwordHash,
        resetPasswordToken: null,
        resetPasswordTokenExpiry: null,
      })
      .where(eq(users.id, user.id))

    await db.delete(sessions).where(eq(sessions.userId, user.id))
    await db.delete(authTokens).where(eq(authTokens.userId, user.id))

    return { success: true }
  }

  private sanitizeUser(user: User) {
    return {
      id: user.id,
      name: user.name,
      lastname: user.lastname,
      username: user.username,
      email: user.email,
      emailVerified: user.emailVerified,
      phoneNumber: user.phoneNumber,
      country: user.country,
      region: user.region,
      city: user.city,
      address: user.address,
      photoUrl: user.photoUrl,
      website: user.website,
      bio: user.bio,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }

  async cleanup() {
    const now = new Date()

    await db
      .delete(sessions)
      .where(and(sessions.expiresAt, lt(sessions.expiresAt, now)))

    await db
      .delete(authTokens)
      .where(and(authTokens.expiresAt, lt(authTokens.expiresAt, now)))

    return { success: true }
  }

  async resendVerificationEmail(email: string) {
    email = email.toLowerCase().trim()

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    })

    if (!user) {
      return { success: true }
    }

    if (user.emailVerified) {
      throw new Error("Email is already verified")
    }

    const verificationToken = crypto.randomBytes(32).toString("hex")
    const verificationTokenExpiry = new Date(
      Date.now() + AuthService.VERIFICATION_TOKEN_EXPIRY,
    )

    await db
      .update(users)
      .set({
        verificationToken,
        verificationTokenExpiry,
      })
      .where(eq(users.id, user.id))

    await emailService.sendVerificationEmail(email, verificationToken)

    return { success: true }
  }
}

export const authService = new AuthService()
