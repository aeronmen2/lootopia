import { Hono } from "hono";
import { ArtefactController } from "../controllers/artefactController";

const artefactRouter = new Hono();

artefactRouter.get("/", ArtefactController.getAllArtefacts);
artefactRouter.get("/:id", ArtefactController.getArtefactById);
artefactRouter.post("/", ArtefactController.createArtefact);
artefactRouter.patch("/:id", ArtefactController.updateArtefact);
artefactRouter.delete("/:id", ArtefactController.deleteArtefact);

artefactRouter.get("/user/:userId", ArtefactController.getUserArtefacts);
artefactRouter.post("/user", ArtefactController.createUserArtefact);
artefactRouter.delete("/user/:id", ArtefactController.deleteUserArtefact);

artefactRouter.get("/exchange/send/:userId", ArtefactController.getArtefactSend);
artefactRouter.get("/exchange/receive/:userId", ArtefactController.getArtefactReceive);
artefactRouter.post("/exchange", ArtefactController.createExchange);

export default artefactRouter;