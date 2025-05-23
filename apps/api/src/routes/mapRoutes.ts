import { Hono } from "hono";
import { MapController } from "../controllers/mapController";

const mapRouter = new Hono();

mapRouter.get("/hunt/:huntId", MapController.getByHuntId);
mapRouter.get("/:id", MapController.getById);
mapRouter.post("/", MapController.create);
mapRouter.patch("/:id", MapController.update);
mapRouter.delete("/:id", MapController.delete);

export default mapRouter;