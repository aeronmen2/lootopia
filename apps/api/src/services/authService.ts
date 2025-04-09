// src/services/authService.ts
import crypto from "crypto"
import { eq, and, gt } from "drizzle-orm"
import { db } from "../db"
import { users } from "../db/schemas/userSchema"
import { sessions } from "../db/schemas/sessionSchema"

export class AuthService {
  private static readonly SALT_ROUNDS = {
    algorithm: "bcrypt",
    cost: 10,
  } as const
  private static readonly VERIFICATION_TOKEN_EXPIRY = 24 * 60 * 60 * 1000 // 24 hours
  private static readonly RESET_TOKEN_EXPIRY = 60 * 60 * 1000 // 1 hour

  async signup(name: string, email: string, password: string) {
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
        email,
        passwordHash,
        verificationToken,
        verificationTokenExpiry,
      })
      .returning()

    return { userId: user.id, email: user.email }
  }

  async verifyEmail(token: string) {
    const user = await db.query.users.findFirst({
      where: and(
        eq(users.verificationToken, token),
        gt(users.verificationTokenExpiry!, new Date()),
      ),
    })

    if (!user) {
      throw new Error("Invalid or expired verification token")
    }

    await db
      .update(users)
      .set({
        emailVerified: true,
        verificationToken: null,
        verificationTokenExpiry: null,
      })
      .where(eq(users.id, user.id))

    return { verified: true }
  }

  async login(email: string, password: string) {
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

    // Create a session
    const sessionId = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    await db.insert(sessions).values({
      userId: user.id,
      sessionId,
      expiresAt,
    })

    return {
      sessionId,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    }
  }

  async logout(sessionId: string) {
    await db.delete(sessions).where(eq(sessions.sessionId, sessionId))

    return { success: true }
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
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
      },
    }
  }

  async requestPasswordReset(email: string) {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    })

    if (!user) {
      // Don't reveal that the user doesn't exist
      return { success: true }
    }

    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenExpiry = new Date(
      Date.now() + AuthService.RESET_TOKEN_EXPIRY,
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
      where: and(
        eq(users.resetPasswordToken!, token),
        gt(users.resetPasswordTokenExpiry!, new Date()),
      ),
    })

    if (!user) {
      throw new Error("Invalid or expired reset token")
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

    // Invalidate all existing sessions for security
    await db.delete(sessions).where(eq(sessions.userId, user.id))

    return { success: true }
  }

  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    })

    if (!user) {
      throw new Error("User not found")
    }

    const isPasswordValid = await Bun.password.verify(
      currentPassword,
      user.passwordHash,
    )

    if (!isPasswordValid) {
      throw new Error("Current password is incorrect")
    }

    const passwordHash = await Bun.password.hash(
      newPassword,
      AuthService.SALT_ROUNDS,
    )

    await db.update(users).set({ passwordHash }).where(eq(users.id, userId))

    return { success: true }
  }

  async resendVerificationEmail(email: string) {
    const user = await db.query.users.findFirst({
      where: and(eq(users.email, email), eq(users.emailVerified, false)),
    })

    if (!user) {
      return { success: true }
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

    return { success: true }
  }
}

export const authService = new AuthService()
