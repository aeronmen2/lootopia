import { z } from "zod"
import type { Post } from "../db/schemas/postSchema"

export const createPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  userId: z.number().int().positive("User ID must be a positive integer"),
})

export const updatePostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").optional(),
  content: z
    .string()
    .min(10, "Content must be at least 10 characters")
    .optional(),
})

export type CreatePostDto = z.infer<typeof createPostSchema>
export type UpdatePostDto = z.infer<typeof updatePostSchema>

export class PostModel {
  static formatResponse(post: Post): Post {
    return post
  }

  static validateCreate(data: unknown): CreatePostDto {
    return createPostSchema.parse(data)
  }

  static validateUpdate(data: unknown): UpdatePostDto {
    return updatePostSchema.parse(data)
  }
}
