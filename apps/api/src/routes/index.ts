import { Hono } from "hono"
import userRoutes from "./userRoutes"
import authRoutes from "./authRoutes"
import huntRoutes from "./huntRoutes"
import cacheRoutes from "./cacheRoutes"
import { authMiddleware } from "../middleware/authMiddleware"

const router = new Hono()

router.route("/auth", authRoutes)

router.use("/users", authMiddleware)
router.route("/users", userRoutes)

router.route("/hunts", huntRoutes)
router.route("/caches", cacheRoutes)


export default router
