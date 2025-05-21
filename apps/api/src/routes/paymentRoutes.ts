import { Hono } from "hono"
import { authMiddleware } from "../middleware/authMiddleware"
import {
  createCheckout,
  getBalance,
  getTransactions,
  handleWebhook,
  verifyPayment,
} from "../controllers/paymentController"

const router = new Hono()

// Protected routes
router.use("*", authMiddleware)
router.post("/checkout", createCheckout)
router.post("/verify", verifyPayment)
router.get("/balance", getBalance)
router.get("/transactions", getTransactions)

// Also allow verifying payments without auth since users might return from payment
// with an expired session
router.get("/verify/:sessionId", verifyPayment)

// Webhook doesn't need auth
router.post("/webhook", handleWebhook)

export default router
