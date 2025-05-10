// dig-action.model.ts
import { z } from "zod";
import type { DigAction } from "../db/schemas/dig_actions";

export const digActionSchema = z.object({
  cacheId: z.string().uuid(),
  userId: z.string().uuid(),
  result: z.enum(["found", "missed"]),
  lat: z.number().int(),
  lng: z.number().int(),
  crownsSpent: z.number().int().min(0).default(0),
  artefactUsed: z.string().uuid().optional().nullable(),
});

export type DigActionDto = z.infer<typeof digActionSchema>;

export class DigActionModel {
  static formatResponse(action: DigAction): DigAction {
    return action;
  }

  static validate(data: unknown): DigActionDto {
    return digActionSchema.parse(data);
  }
}
