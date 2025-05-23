import { Hono } from "hono";
import { StepController } from "../controllers/stepController";

const stepRouter = new Hono();

stepRouter.get("/", StepController.getAllSteps);
stepRouter.get("/:id", StepController.getStepById);
stepRouter.get("/map/:mapId", StepController.getStepsByMapId);
stepRouter.post("/", StepController.createStep);
stepRouter.patch("/:id", StepController.updateStep);
stepRouter.delete("/:id", StepController.deleteStep);

stepRouter.get("/user/:userId", StepController.getUserSteps);
stepRouter.get("/step/:stepId", StepController.getStepsByStepId);
stepRouter.post("/user", StepController.createUserStep);
stepRouter.patch("/user/:id", StepController.updateUserStep);
stepRouter.delete("/user/:id", StepController.deleteUserStep);

export default stepRouter;