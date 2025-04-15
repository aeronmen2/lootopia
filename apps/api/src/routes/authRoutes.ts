import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { z } from "zod"
import * as authController from "../controllers/authController"
import { authMiddleware } from "../middleware/authMiddleware"

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

const refreshTokenSchema = z.object({
  refreshToken: z.string(),
})

const requestPasswordResetSchema = z.object({
  email: z.string().email(),
})

const resetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(6),
})

router.post("/signup", zValidator("json", signupSchema), authController.signup)
router.get("/verify-email/:token", authController.verifyEmail)
router.post("/login", zValidator("json", loginSchema), authController.login)
router.post(
  "/refresh-token",
  zValidator("json", refreshTokenSchema),
  authController.refreshToken,
)
router.post(
  "/request-password-reset",
  zValidator("json", requestPasswordResetSchema),
  authController.requestPasswordReset,
)
router.post(
  "/reset-password",
  zValidator("json", resetPasswordSchema),
  authController.resetPassword,
)

router.post("/auth/resend-verification", authController.resendVerificationEmail)

router.post("/logout", authMiddleware, authController.logout)
router.get("/me", authMiddleware, authController.getCurrentUser)

export default router
