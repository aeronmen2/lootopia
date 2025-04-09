// src/middlewares/roleMiddleware.ts
import type { Context, Next } from "hono"

type Role = "admin" | "user" | "moderator"

export function roleMiddleware(allowedRoles: Role[]) {
  return async function (c: Context, next: Next) {
    const user = c.get("user")

    if (!user || !user.role) {
      return c.json(
        { success: false, error: "Unauthorized - No role specified" },
        403,
      )
    }

    if (!allowedRoles.includes(user.role)) {
      return c.json(
        {
          success: false,
          error: "Forbidden - Insufficient role permissions",
        },
        403,
      )
    }

    await next()
  }
}
