import { Hono } from "hono"
import userRoutes from "./userRoutes"
import authRoutes from "./authRoutes"
import huntRoutes from "./huntRoutes"
import cacheRoutes from "./cacheRoutes"
import paymentRoutes from "./paymentRoutes"
import artefactRoutes from "./artefactRoutes"
import { authMiddleware } from "../middleware/authMiddleware"
import mapRouter from "./mapRoutes"
import stepRouter from "./stepRoutes"
import uploadRoutes from "./uploadRoutes"

const router = new Hono()

router.route("/auth", authRoutes)

router.use("/users", authMiddleware)
router.route("/users", userRoutes)

router.route("/hunts", huntRoutes)
router.route("maps", mapRouter)
router.route("/step", stepRouter)
router.route("/caches", cacheRoutes)
router.route("/payments", paymentRoutes)
router.route("/artefacts", artefactRoutes)
router.route("/upload", uploadRoutes)

export default router
