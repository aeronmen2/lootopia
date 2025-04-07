import { z } from "zod"
import type { User } from "../db/schemas/userSchema"

export const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
})

export const updateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email format").optional(),
})

export type CreateUserDto = z.infer<typeof createUserSchema>
export type UpdateUserDto = z.infer<typeof updateUserSchema>

export class UserModel {
  static formatResponse(user: User): User {
    return user
  }

  static validateCreate(data: unknown): CreateUserDto {
    return createUserSchema.parse(data)
  }

  static validateUpdate(data: unknown): UpdateUserDto {
    return updateUserSchema.parse(data)
  }
}
