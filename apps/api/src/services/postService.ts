import { eq } from "drizzle-orm"
import { db } from "../db"
import { posts } from "../db/schemas/postSchema"
import type { Post } from "../db/schemas/postSchema"
import type { CreatePostDto, UpdatePostDto } from "../models/postModel"

export class PostService {
  // Get all posts
  static async findAll(): Promise<Post[]> {
    return await db.select().from(posts)
  }

  // Get posts by user ID
  static async findByUserId(userId: number): Promise<Post[]> {
    return await db.select().from(posts).where(eq(posts.userId, userId))
  }

  // Get post by ID
  static async findById(id: number): Promise<Post | null> {
    const result = await db.select().from(posts).where(eq(posts.id, id))

    return result.length > 0 ? result[0] : null
  }

  // Create a new post
  static async create(postData: CreatePostDto): Promise<Post> {
    const newPost = await db
      .insert(posts)
      .values({
        title: postData.title,
        content: postData.content,
        userId: postData.userId,
      })
      .returning()

    return newPost[0]
  }

  // Update an existing post
  static async update(
    id: number,
    postData: UpdatePostDto
  ): Promise<Post | null> {
    const updatedPost = await db
      .update(posts)
      .set({
        ...postData,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, id))
      .returning()

    return updatedPost.length > 0 ? updatedPost[0] : null
  }

  // Delete a post
  static async delete(id: number): Promise<Post | null> {
    const deletedPost = await db
      .delete(posts)
      .where(eq(posts.id, id))
      .returning()

    return deletedPost.length > 0 ? deletedPost[0] : null
  }
}
