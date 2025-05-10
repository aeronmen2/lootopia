// hunt-map.model.ts
import { z } from "zod";
import type { HuntMap } from "../db/schemas/hunt_maps";

export const huntMapSchema = z.object({
  huntId: z.string().uuid(),
  name: z.string().min(2).max(50).optional(),
  skin: z.string().max(30).optional(),
  zone: z.string().max(100).optional(),
  scaleMin: z.number().min(1).max(1000000).optional(),
  scaleMax: z.number().min(1).max(1000000).optional(),
  isForDig: z.boolean().default(false),
  createdAt: z.coerce.date().optional(),
});

export type HuntMapDto = z.infer<typeof huntMapSchema>;

export class HuntMapModel {
  static formatResponse(map: HuntMap): HuntMap {
    return map;
  }

  static validate(data: unknown): HuntMapDto {
    return huntMapSchema.parse(data);
  }
}
