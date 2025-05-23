// cache.model.ts
import { z } from "zod";
import type { Cache } from "../db/schemas/caches";

export const cacheSchema = z.object({
  stepId: z.string().uuid().optional().nullable(),
  lat: z.string().refine(val => !isNaN(Number(val)), "Invalid latitude"),
  lng: z.string().refine(val => !isNaN(Number(val)), "Invalid longitude"),
  sizeCm: z.number().int().min(20).max(200).default(80),
  isVisible: z.boolean().default(false),
  precisionM: z.number().int().min(1).max(1000).default(1),
});

export type CacheDto = z.infer<typeof cacheSchema>;

export class CacheModel {
  static formatResponse(cache: Cache): Cache {
    return cache;
  }

  static validate(data: unknown): CacheDto {
    return cacheSchema.parse(data);
  }
}
