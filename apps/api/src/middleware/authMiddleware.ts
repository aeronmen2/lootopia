import type { Context, Next } from "hono"
import { authService } from "../services/authService"
import { getCookie, setCookie } from "hono/cookie"

export async function authMiddleware(c: Context, next: Next) {
  console.log("Auth middleware triggered")
  const sessionId = getCookie(c, "session")

  console.log("Session ID from cookie:", sessionId)

  if (!sessionId) {
    return c.json({ success: false, error: "Authentication required" }, 401)
  }

  const session = await authService.validateSession(sessionId)

  console.log("Session ID:", sessionId)
  console.log("Session:", session)
  console.log("User ID:", session?.userId)
  console.log("User:", session?.user)

  if (!session) {
    setCookie(c, "session", "", { maxAge: 0 })

    return c.json({ success: false, error: "Session expired or invalid" }, 401)
  }

  c.set("userId", session.userId)
  c.set("user", session.user)

  await next()
}
