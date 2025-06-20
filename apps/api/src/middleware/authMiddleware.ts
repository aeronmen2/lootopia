import type { Context, Next } from "hono"
import { authService } from "../services/authService"
import { getCookie, setCookie } from "hono/cookie"

export async function authMiddleware(c: Context, next: Next) {
  const sessionId = getCookie(c, "session")

  if (!sessionId) {
    return c.json({ success: false, error: "Authentication required" }, 401)
  }

  const session = await authService.validateSession(sessionId)

  if (!session) {
    setCookie(c, "session", "", { maxAge: 0 })

    return c.json({ success: false, error: "Session expired or invalid" }, 401)
  }

  c.set("userId", session.userId)
  c.set("user", session.user)

  await next()
}
