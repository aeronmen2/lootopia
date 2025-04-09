import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { z } from "zod"
import * as authController from "../controllers/authController"

const router = new Hono()

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

router.post("/signup", zValidator("json", signupSchema), authController.signup)
router.post("/login", zValidator("json", loginSchema), authController.login)
router.post("/logout", authController.logout)

export default router
