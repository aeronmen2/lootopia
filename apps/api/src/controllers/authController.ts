// src/controllers/authController.ts
import type { Context } from "hono"
import { setCookie, getCookie } from "hono/cookie"
import { authService } from "../services/authService"
import config from "../config/config"

export async function signup(c: Context) {
  try {
    const { name, email, password } = await c.req.json()
    const result = await authService.signup(name, email, password)

    return c.json({
      success: true,
      message: "Please check your email to verify your account",
      userId: result.userId,
    })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 400)
  }
}

export async function verifyEmail(c: Context) {
  try {
    const { token } = c.req.query()

    if (!token) {
      return c.json({ success: false, error: "Token is required" }, 400)
    }

    const result = await authService.verifyEmail(token)

    console.log(result)

    return c.json({
      success: true,
      message: "Email verified successfully",
    })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 400)
  }
}

export async function login(c: Context) {
  try {
    const { email, password } = await c.req.json()
    const result = await authService.login(email, password)
    // Set session cookie
    setCookie(c, "session", result.sessionId, config.cookieSettings)

    return c.json({
      success: true,
      user: result.user,
    })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 401)
  }
}

export async function logout(c: Context) {
  try {
    const sessionId = getCookie(c, "session")

    if (sessionId) {
      await authService.logout(sessionId)
    }
    // Clear the cookie

    setCookie(c, "session", "", { ...config.cookieSettings, maxAge: 0 })

    return c.json({ success: true })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500)
  }
}

export async function requestPasswordReset(c: Context) {
  try {
    const { email } = await c.req.json()
    await authService.requestPasswordReset(email)

    return c.json({
      success: true,
      message:
        "If an account with that email exists, a password reset link has been sent",
    })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500)
  }
}

export async function resetPassword(c: Context) {
  try {
    const { token, newPassword } = await c.req.json()
    await authService.resetPassword(token, newPassword)

    return c.json({
      success: true,
      message: "Password has been reset successfully",
    })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 400)
  }
}

export async function changePassword(c: Context) {
  try {
    const userId = c.get("userId")
    const { currentPassword, newPassword } = await c.req.json()

    await authService.changePassword(userId, currentPassword, newPassword)

    return c.json({
      success: true,
      message: "Password changed successfully",
    })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 400)
  }
}

export async function resendVerificationEmail(c: Context) {
  try {
    const { email } = await c.req.json()
    await authService.resendVerificationEmail(email)

    return c.json({
      success: true,
      message:
        "If your account exists and is not verified, a new verification email has been sent",
    })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500)
  }
}

export async function getCurrentUser(c: Context) {
  try {
    const userId = c.get("userId")

    return c.json({
      success: true,
      user: { id: userId },
    })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500)
  }
}
