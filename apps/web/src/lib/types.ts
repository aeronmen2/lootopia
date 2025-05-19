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

export type Hunt = z.infer<typeof huntSchema>
