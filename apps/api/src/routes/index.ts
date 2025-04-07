import { Hono } from "hono"
import userRouter from "./userRoutes"
import postRouter from "./postRoutes"

const apiRouter = new Hono()

apiRouter.route("/users", userRouter)
apiRouter.route("/posts", postRouter)

export default apiRouter
