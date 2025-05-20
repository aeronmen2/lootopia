import { Hono } from "hono"
import userRoutes from "./userRoutes"
import authRoutes from "./authRoutes"
import { authMiddleware } from "../middleware/authMiddleware"

const router = new Hono()

router.route("/auth", authRoutes)

router.use("/users", authMiddleware)
router.route("/users", userRoutes)

export default router
