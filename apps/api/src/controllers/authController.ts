import type { Context } from "hono"
import { setCookie, getCookie } from "hono/cookie"
import { authService } from "../services/authService"
import config from "../config/config"

export async function signup(c: Context) {
  try {
    const { name, email, password } = await c.req.json()
    const result = await authService.signup(name, email, password)

    return c.json(
      {
        status: "success",
        message: "Please check your email to verify your account",
        data: { userId: result.userId },
      },
      201,
    )
  } catch (error: any) {
    return c.json(
      {
        status: "error",
        message: error.message,
      },
      400,
    )
  }
}

export async function verifyEmail(c: Context) {
  try {
    const { token } = c.req.param()
    await authService.verifyEmail(token)

    return c.json(
      {
        status: "success",
        message: "Email verified successfully. You can now log in.",
      },
      200,
    )
  } catch (error: any) {
    return c.json(
      {
        status: "error",
        message: error.message,
      },
      400,
    )
  }
}

export async function login(c: Context) {
  try {
    const { email, password } = await c.req.json()
    const result = await authService.login(email, password)

    setCookie(c, "session", result.sessionId, {
      ...config.cookieSettings,
    })

    setCookie(c, "refreshToken", result.refreshToken, {
      ...config.cookieSettings,
      httpOnly: true,
    })

    return c.json(
      {
        status: "success",
        message: "Login successful",
        data: { user: result },
      },
      200,
    )
  } catch (error: any) {
    return c.json(
      {
        status: "error",
        message: error.message,
      },
      401,
    )
  }
}

export async function logout(c: Context) {
  try {
    const sessionId = getCookie(c, "session")

    if (sessionId) {
      await authService.logout(sessionId)
    }

    setCookie(c, "session", "", { ...config.cookieSettings, maxAge: 0 })
    setCookie(c, "refreshToken", "", {
      ...config.cookieSettings,
      maxAge: 0,
      httpOnly: true,
    })

    return c.json(
      {
        status: "success",
        message: "Logged out successfully",
      },
      200,
    )
  } catch (error: any) {
    return c.json(
      {
        status: "error",
        message: error.message,
      },
      500,
    )
  }
}

export async function refreshToken(c: Context) {
  try {
    const refreshToken = getCookie(c, "refreshToken")

    if (!refreshToken) {
      return c.json(
        {
          status: "error",
          message: "Refresh token is required",
        },
        400,
      )
    }

    const result = await authService.refreshToken(refreshToken)

    // Set the new session cookie
    setCookie(c, "session", result.sessionId, {
      ...config.cookieSettings,
    })

    // Set the new refresh token cookie
    setCookie(c, "refreshToken", result.refreshToken, {
      ...config.cookieSettings,
      httpOnly: true,
    })

    return c.json(
      {
        status: "success",
        message: "Token refreshed successfully",
        data: {
          token: result.token,
          expiresAt: result.expiresAt,
          user: result.user,
        },
      },
      200,
    )
  } catch (error: any) {
    return c.json(
      {
        status: "error",
        message: error.message,
      },
      401,
    )
  }
}

export async function requestPasswordReset(c: Context) {
  try {
    const { email } = await c.req.json()
    await authService.requestPasswordReset(email)

    return c.json(
      {
        status: "success",
        message:
          "If your email exists in our system, you will receive a password reset link shortly",
      },
      200,
    )
  } catch (error: any) {
    return c.json(
      {
        status: "error",
        message: error.message,
      },
      500,
    )
  }
}

export async function resetPassword(c: Context) {
  try {
    const { token, newPassword } = await c.req.json()
    await authService.resetPassword(token, newPassword)

    return c.json(
      {
        status: "success",
        message:
          "Password has been reset successfully. You can now log in with your new password.",
      },
      200,
    )
  } catch (error: any) {
    return c.json(
      {
        status: "error",
        message: error.message,
      },
      400,
    )
  }
}

export async function getCurrentUser(c: Context) {
  try {
    const userId = c.get("userId")
    const user = c.get("user")

    return c.json(
      {
        status: "success",
        data: { user: user || { id: userId } },
      },
      200,
    )
  } catch (error: any) {
    return c.json(
      {
        status: "error",
        message: error.message,
      },
      500,
    )
  }
}

export async function resendVerificationEmail(c: Context) {
  try {
    const { email } = await c.req.json()
    await authService.resendVerificationEmail(email)

    return c.json(
      {
        status: "success",
        message:
          "If your email exists and is not verified, you will receive a verification link shortly",
      },
      200,
    )
  } catch (error: any) {
    return c.json(
      {
        status: "error",
        message: error.message,
      },
      400,
    )
  }
}
