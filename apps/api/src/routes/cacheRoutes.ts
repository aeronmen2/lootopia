import { Hono } from "hono"
import { CacheController } from "../controllers/cacheController"
import { zValidator } from "@hono/zod-validator"
import { cacheSchema } from "../models/caches"

const cacheRouter = new Hono()

cacheRouter.get("/", CacheController.getAll)
cacheRouter.get("/:id", CacheController.getCacheDetails)
cacheRouter.get("/step/:stepId", CacheController.getCachesByStepId)
cacheRouter.get("/:id/digs", CacheController.getCacheDigs)
cacheRouter.get("/user/:userId/digs", CacheController.getDigsByUserId)

cacheRouter.post(
  "/",
  zValidator("json", cacheSchema),
  CacheController.create,
)

cacheRouter.post("/digs", CacheController.createDig)

cacheRouter.patch(
  "/:id",
  zValidator("json", cacheSchema),
  CacheController.update,
)
cacheRouter.delete("/:id", CacheController.delete)

export default cacheRouter
