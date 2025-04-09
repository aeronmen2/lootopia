import { Hono } from "hono"
import userRoutes from "./userRoutes"
import postRoutes from "./postRoutes"
import authRoutes from "./authRoutes"
import { authMiddleware } from "../middleware/authMiddleware"

const router = new Hono()

router.route("/auth", authRoutes)

router.use("/users", authMiddleware)
router.route("/users", userRoutes)

router.use("/posts", authMiddleware)
router.route("/posts", postRoutes)

export default router
