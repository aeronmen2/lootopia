import { z } from "zod"
import type { User } from "../db/schemas/userSchema"

export const updateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email format").optional(),
})

export type UpdateUserDto = z.infer<typeof updateUserSchema>

export class UserModel {
  static formatResponse(user: User): User {
    return user
  }

  static validateUpdate(data: unknown): UpdateUserDto {
    return updateUserSchema.parse(data)
  }
}
