import { Hono } from "hono"
import { UserController } from "../controllers/userController"
import { zValidator } from "@hono/zod-validator"
import { createUserSchema, updateUserSchema } from "../models/userModel"

const userRouter = new Hono()

// Routes
userRouter.get("/", UserController.getAll)
userRouter.get("/:id", UserController.getById)
userRouter.post(
  "/",
  zValidator("json", createUserSchema),
  UserController.create
)
userRouter.patch(
  "/:id",
  zValidator("json", updateUserSchema),
  UserController.update
)
userRouter.delete("/:id", UserController.delete)

export default userRouter
