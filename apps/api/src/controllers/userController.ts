import type { Context } from "hono"
import { UserModel } from "../models/userModel"
import { UserService } from "../services/userService"

export class UserController {
  static async getAll(c: Context) {
    try {
      const users = await UserService.findAll()

      return c.json({ success: true, data: users })
    } catch (error) {
      console.error("Error fetching users:", error)

      return c.json({ success: false, message: "Failed to fetch users" }, 500)
    }
  }

  static async getById(c: Context) {
    try {
      const id = Number(c.req.param("id"))
      const user = await UserService.findById(id)

      if (!user) {
        return c.json({ success: false, message: "User not found" }, 404)
      }

      return c.json({ success: true, data: user })
    } catch (error) {
      console.error("Error fetching user:", error)

      return c.json({ success: false, message: "Failed to fetch user" }, 500)
    }
  }

  static async update(c: Context) {
    try {
      const id = Number(c.req.param("id"))
      const body = await c.req.json()
      const validatedData = UserModel.validateUpdate(body)

      const updatedUser = await UserService.update(id, validatedData)

      if (!updatedUser) {
        return c.json({ success: false, message: "User not found" }, 404)
      }

      return c.json({ success: true, data: updatedUser })
    } catch (error) {
      console.error("Error updating user:", error)

      return c.json(
        {
          success: false,
          message: "Failed to update user",
          error: error instanceof Error ? error.message : "Unknown error",
        },
        500,
      )
    }
  }

  static async delete(c: Context) {
    try {
      const id = Number(c.req.param("id"))
      const deletedUser = await UserService.delete(id)

      if (!deletedUser) {
        return c.json({ success: false, message: "User not found" }, 404)
      }

      return c.json({ success: true, message: "User deleted successfully" })
    } catch (error) {
      console.error("Error deleting user:", error)

      return c.json({ success: false, message: "Failed to delete user" }, 500)
    }
  }
}
