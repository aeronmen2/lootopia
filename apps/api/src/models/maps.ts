// hunt-map.model.ts
import { z } from "zod";
import type { Map } from "../db/schemas/maps";

export const huntMapSchema = z.object({
  huntId: z.string().uuid(),
  name: z.string().min(2).max(50).optional(),
  skin: z.string().max(30).optional(),
  bearing: z.number(),
  lng: z.number(),
  lat: z.number(),
  zoom: z.number(),
  pitch: z.number(),
  isForDig: z.boolean().default(false),
  createdAt: z.coerce.date().optional(),
});

export type HuntMapDto = z.infer<typeof huntMapSchema>;

export class HuntMapModel {
  static formatResponse(map: Map): Map {
    return map;
  }

  static validate(data: unknown): HuntMapDto {
    return huntMapSchema.parse(data);
  }
}
