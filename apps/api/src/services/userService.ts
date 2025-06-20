import { eq } from "drizzle-orm"
import { db } from "../db"
import type { User } from "../db/schemas/userSchema"
import { users } from "../db/schemas/userSchema"
import type { UpdateUserDto } from "../models/userModel"

export class UserService {
  static async findAll(): Promise<User[]> {
    return await db.select().from(users)
  }

  static async findById(id: string): Promise<User | null> {
    const result = await db.select().from(users).where(eq(users.id, id))

    return result.length > 0 ? result[0] : null
  }

  static async update(
    id: string,
    userData: UpdateUserDto,
  ): Promise<User | null> {
    const updatedUser = await db
      .update(users)
      .set({
        ...userData,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning()

    return updatedUser.length > 0 ? updatedUser[0] : null
  }

  static async delete(id: string): Promise<User | null> {
    const deletedUser = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning()

    return deletedUser.length > 0 ? deletedUser[0] : null
  }
}
