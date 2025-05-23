import { Hono } from "hono";
import { UploadController } from "../controllers/uploadController";

const uploadRoutes = new Hono();

uploadRoutes.post("/", UploadController.uploadFile);

export default uploadRoutes;
