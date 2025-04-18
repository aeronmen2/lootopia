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
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
    exposeHeaders: ["Content-Length", "X-Request-Id"],
    maxAge: 600,
    credentials: true,
  }),
)

app.use(csrf({ origin: "http://localhost:5173" }))

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
