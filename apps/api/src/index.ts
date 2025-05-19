import { Hono } from "hono"
import { logger } from "hono/logger"
import { prettyJSON } from "hono/pretty-json"
import apiRouter from "./routes"
import { cors } from "hono/cors"
import { csrf } from "hono/csrf"

const app = new Hono()

app.use("*", logger())
app.use("*", prettyJSON())

app.use(
  "*",
  cors({
    origin: "http://localhost:5173",
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
    exposeHeaders: ["Content-Length", "X-Request-Id"],
    maxAge: 600,
    credentials: true,
  }),
)

app.use("*", async (c, next) => {
  // Skip CSRF for API routes
  if (c.req.path.startsWith("/api")) {
    return next()
  }

  // Otherwise apply CSRF
  return csrf({ origin: "http://localhost:5173" })(c, next)
})

app.get("/", (c) => {
  return c.json({ message: "👋 Hello, world!" })
})

app.get("/health", (c) => {
  return c.json({ status: "🟢 OK", timestamp: new Date().toISOString() })
})

app.route("/api", apiRouter)

app.notFound((c) => {
  return c.json({ message: "🔍 404 - Not Found" }, 404)
})

app.onError((err, c) => {
  console.error("🐛 An error occurred:", err)

  return c.json({ message: "🔥 Internal Server Error" }, 500)
})

export { app }
