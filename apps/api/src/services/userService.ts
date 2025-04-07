import { eq } from "drizzle-orm"
import { db } from "../db"
import type { User } from "../db/schemas/userSchema"
import { users } from "../db/schemas/userSchema"
import type { CreateUserDto, UpdateUserDto } from "../models/userModel"

export class UserService {
  static async findAll(): Promise<User[]> {
    return await db.select().from(users)
  }

  static async findById(id: number): Promise<User | null> {
    const result = await db.select().from(users).where(eq(users.id, id))

    return result.length > 0 ? result[0] : null
  }

  static async create(userData: CreateUserDto): Promise<User> {
    const newUser = await db
      .insert(users)
      .values({
        name: userData.name,
        email: userData.email,
      })
      .returning()

    return newUser[0]
  }

  static async update(
    id: number,
    userData: UpdateUserDto
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

  static async delete(id: number): Promise<User | null> {
    const deletedUser = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning()

    return deletedUser.length > 0 ? deletedUser[0] : null
  }
}
