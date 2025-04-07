import { describe, expect, it } from "vitest"
import { app } from "../src"

describe("Hono app", () => {
  it("should return 200 response for GET /", async () => {
    const res = await app.request("/")
    expect(res.status).toBe(200)
  })
})

describe("Health check", () => {
  it("should return 200 response for GET /health", async () => {
    const res = await app.request("/health")
    expect(res.status).toBe(200)
  })
})

describe("Not Found", () => {
  it("should return 404 response for unknown route", async () => {
    const res = await app.request("/unknown")
    expect(res.status).toBe(404)
  })
})
