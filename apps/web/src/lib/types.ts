import { z } from "zod"

export const huntSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().max(500).optional(),
  worldType: z.enum(["real", "map"]),
  mode: z.enum(["public", "private"]),
  status: z.enum(["draft", "active", "closed"]),
  organizerId: z.string().uuid(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  maxParticipants: z.number().int().positive().optional(),
  feeCrowns: z.number().int().min(0).default(0),
  chatEnabled: z.boolean().default(false),
  nbParticipants: z.number().int().min(0).default(0),
  organizerName: z.string().optional(),
})

export const userSchema = z.object({
  id: z.string().uuid().optional(),
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

  // Role
  role: z.string().optional(),

  // Optional timestamps (not usually provided on update)
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
})

export type Hunt = z.infer<typeof huntSchema>
export type User = z.infer<typeof userSchema>
