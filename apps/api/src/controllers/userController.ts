import type { Context } from "hono"
import { UserModel } from "../models/userModel"
import { UserService } from "../services/userService"
import { UploadService } from "../services/uploadService"

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
      const id = String(c.req.param("id"))
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
      const id = String(c.req.param("id"))

      // Check if multipart/form-data for file upload
      if (c.req.header("content-type")?.includes("multipart/form-data")) {
        const body = await c.req.parseBody()
        const file = body.file
        let imageUrl: string | undefined;
        
        if (file && (file instanceof File)) {
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          imageUrl = await UploadService.uploadFile(buffer, file.name, file.type);
        }

        const validatedData = UserModel.validateUpdate({
          ...body,
          photoUrl: imageUrl || body.photoUrl,
        })

        const updatedUser = await UserService.update(id, validatedData)

        if (!updatedUser) {
          return c.json({ success: false, message: "User not found" }, 404)
        }

        return c.json({ success: true, data: updatedUser })
      } else {
        // JSON classique (photoUrl déjà fourni ou pas d'image)
        const body = await c.req.json()
        const validatedData = UserModel.validateUpdate(body)
        const updatedUser = await UserService.update(id, validatedData)

        if (!updatedUser) {
          return c.json({ success: false, message: "User not found" }, 404)
        }

        return c.json({ success: true, data: updatedUser })
      }
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
      const id = String(c.req.param("id"))
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
