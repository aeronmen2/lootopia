import { Hono } from "hono"
import { CacheController } from "../controllers/cacheController"
import { zValidator } from "@hono/zod-validator"
import { cacheSchema } from "../models/caches"
import { digActionSchema } from "../models/dig_actions"

const cacheRouter = new Hono()

cacheRouter.get("/", CacheController.getAll)
cacheRouter.get("/:id", CacheController.getCacheDetails)
cacheRouter.get("/:id/dig", CacheController.getCacheDigs)

cacheRouter.post(
  "/",
  zValidator("json", cacheSchema),
  CacheController.create,
)

cacheRouter.post(
    "/:id/dig",
    zValidator("json", digActionSchema),
    CacheController.logDig,
)

cacheRouter.patch(
  "/:id",
  zValidator("json", cacheSchema),
  CacheController.update,
)
cacheRouter.delete("/:id", CacheController.delete)

export default cacheRouter
