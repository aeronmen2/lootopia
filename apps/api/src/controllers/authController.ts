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
    const { token } = c.req.param()
    await authService.verifyEmail(token)

    console.log("im here")
    console.log("token", token)

    return c.json({
      success: true,
      message: "Email verified successfully. You can now log in.",
    })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 400)
  }
}

export async function login(c: Context) {
  try {
    const { email, password } = await c.req.json()
    const result = await authService.login(email, password)

    setCookie(c, "session", result.sessionId, {
      ...config.cookieSettings,
    })

    return c.json({
      success: true,
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

    setCookie(c, "session", "", { ...config.cookieSettings, maxAge: 0 })

    return c.json({ success: true })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500)
  }
}

export async function refreshToken(c: Context) {
  try {
    const { refreshToken } = await c.req.json()

    if (!refreshToken) {
      return c.json({ success: false, error: "Refresh token is required" }, 400)
    }

    const result = await authService.refreshToken(refreshToken)

    return c.json({
      success: true,
      token: result.token,
      refreshToken: result.refreshToken,
      expiresAt: result.expiresAt,
      user: result.user,
    })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 401)
  }
}

export async function requestPasswordReset(c: Context) {
  try {
    const { email } = await c.req.json()
    await authService.requestPasswordReset(email)

    return c.json({
      success: true,
      message:
        "If your email exists in our system, you will receive a password reset link shortly",
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
      message:
        "Password has been reset successfully. You can now log in with your new password.",
    })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 400)
  }
}

export async function getCurrentUser(c: Context) {
  try {
    const userId = c.get("userId")
    const user = c.get("user")

    return c.json({
      success: true,
      user: user || { id: userId },
    })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500)
  }
}

export async function resendVerificationEmail(c: Context) {
  try {
    const { email } = await c.req.json()
    await authService.resendVerificationEmail(email)

    return c.json({
      success: true,
      message:
        "If your email exists and is not verified, you will receive a verification link shortly",
    })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 400)
  }
}
