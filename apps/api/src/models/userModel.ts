import { z } from "zod"
import type { User } from "../db/schemas/userSchema"

export const updateUserSchema = z.object({
  // Basic info
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  lastname: z
    .string()
    .min(2, "Lastname must be at least 2 characters")
    .optional(),
  username: z
    .string()
    .min(2, "Username must be at least 2 characters")
    .optional(),
  email: z.string().email("Invalid email format").optional(),

  // Verification (usually handled internally, but included for completeness)
  emailVerified: z.boolean().optional(),
  verificationToken: z.string().optional(),
  verificationTokenExpiry: z.coerce.date().optional(),
  resetPasswordToken: z.string().optional(),
  resetPasswordTokenExpiry: z.coerce.date().optional(),

  // Contact & location
  phoneNumber: z.string().optional(),
  country: z.string().optional(),
  region: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),

  // Profile customization
  photoUrl: z.string().optional(),
  bio: z.string().max(500, "Bio must be 500 characters or less").optional(),
  website: z.string().optional(),

  role: z.string().optional(),
  // Optional timestamps (not usually provided on update)
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
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
