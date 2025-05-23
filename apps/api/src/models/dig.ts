// dig.model.ts
import { z } from "zod";
import type { Dig } from "../db/schemas/digs";

export const digSchema = z.object({
  cacheId: z.string().uuid(),
  userId: z.string().uuid(),
  lat: z.number().int(),
  lng: z.number().int(),
  digTime: z.coerce.date(),
  result: z.enum(["found", "missed"]),
  crownsSpent: z.number().int().min(0).default(0),
});

export type DigDto = z.infer<typeof digSchema>;

export class DigModel {
  static formatResponse(dig: Dig): Dig {
    return dig;
  }

  static validate(data: unknown): DigDto {
    return digSchema.parse(data);
  }
}
