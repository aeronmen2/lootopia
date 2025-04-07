import type { Context } from "hono"
import { PostModel } from "../models/postModel"
import { PostService } from "../services/postService"

export class PostController {
  // Get all posts
  static async getAll(c: Context) {
    try {
      const posts = await PostService.findAll()

      return c.json({ success: true, data: posts })
    } catch (error) {
      console.error("Error fetching posts:", error)

      return c.json({ success: false, message: "Failed to fetch posts" }, 500)
    }
  }

  // Get posts by user ID
  static async getByUserId(c: Context) {
    try {
      const userId = Number(c.req.param("userId"))
      const posts = await PostService.findByUserId(userId)

      return c.json({ success: true, data: posts })
    } catch (error) {
      console.error("Error fetching posts by user ID:", error)

      return c.json({ success: false, message: "Failed to fetch posts" }, 500)
    }
  }

  // Get post by ID
  static async getById(c: Context) {
    try {
      const id = Number(c.req.param("id"))
      const post = await PostService.findById(id)

      if (!post) {
        return c.json({ success: false, message: "Post not found" }, 404)
      }

      return c.json({ success: true, data: post })
    } catch (error) {
      console.error("Error fetching post:", error)

      return c.json({ success: false, message: "Failed to fetch post" }, 500)
    }
  }

  // Create new post
  static async create(c: Context) {
    try {
      const body = await c.req.json()
      const validatedData = PostModel.validateCreate(body)

      const newPost = await PostService.create(validatedData)

      return c.json({ success: true, data: newPost }, 201)
    } catch (error) {
      console.error("Error creating post:", error)

      return c.json(
        {
          success: false,
          message: "Failed to create post",
          error: error instanceof Error ? error.message : "Unknown error",
        },
        500
      )
    }
  }

  // Update post
  static async update(c: Context) {
    try {
      const id = Number(c.req.param("id"))
      const body = await c.req.json()
      const validatedData = PostModel.validateUpdate(body)

      const updatedPost = await PostService.update(id, validatedData)

      if (!updatedPost) {
        return c.json({ success: false, message: "Post not found" }, 404)
      }

      return c.json({ success: true, data: updatedPost })
    } catch (error) {
      console.error("Error updating post:", error)

      return c.json(
        {
          success: false,
          message: "Failed to update post",
          error: error instanceof Error ? error.message : "Unknown error",
        },
        500
      )
    }
  }

  // Delete post
  static async delete(c: Context) {
    try {
      const id = Number(c.req.param("id"))
      const deletedPost = await PostService.delete(id)

      if (!deletedPost) {
        return c.json({ success: false, message: "Post not found" }, 404)
      }

      return c.json({ success: true, message: "Post deleted successfully" })
    } catch (error) {
      console.error("Error deleting post:", error)

      return c.json({ success: false, message: "Failed to delete post" }, 500)
    }
  }
}
