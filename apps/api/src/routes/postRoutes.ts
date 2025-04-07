import { Hono } from "hono"
import { PostController } from "../controllers/postController"
import { zValidator } from "@hono/zod-validator"
import { createPostSchema, updatePostSchema } from "../models/postModel"

const postRouter = new Hono()

// Routes
postRouter.get("/", PostController.getAll)
postRouter.get("/:id", PostController.getById)
postRouter.get("/user/:userId", PostController.getByUserId)
postRouter.post(
  "/",
  zValidator("json", createPostSchema),
  PostController.create
)
postRouter.patch(
  "/:id",
  zValidator("json", updatePostSchema),
  PostController.update
)
postRouter.delete("/:id", PostController.delete)

export default postRouter
