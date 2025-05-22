import { Hono } from "hono"
import { HuntController } from "../controllers/huntController"
import { zValidator } from "@hono/zod-validator"
import { huntSchema } from "../models/hunts"
import { roleMiddleware } from "../middleware/roleMIddleware"
import { authMiddleware } from "../middleware/authMiddleware"

const huntRouter = new Hono()

huntRouter.use("*", authMiddleware)

huntRouter.get("/", HuntController.getAll)
huntRouter.get("/:id", HuntController.getHuntDetails)

huntRouter.post(
  "/",
  roleMiddleware(["admin", "organizer"]),
  zValidator("json", huntSchema),
  HuntController.create,
)

huntRouter.get("/organizer/:organizerId", HuntController.getHuntByOrganizer)
huntRouter.get(
  "/participant/:participantId",
  HuntController.getHuntByParticipantId,
)

huntRouter.get("/:id/participant", HuntController.getHuntParticipants)
huntRouter.post("/:id/participant/:userId", HuntController.addUserToHunt)
huntRouter.delete("/:id/participant/:userId", HuntController.removeUserFromHunt)

huntRouter.patch("/:id", zValidator("json", huntSchema), HuntController.update)

huntRouter.delete("/:id", HuntController.delete)

export default huntRouter
