// hunt-marker.model.ts
import { z } from "zod";
import type { HuntMarker } from "../db/schemas/hunt_markers";

export const huntMarkerSchema = z.object({
  mapId: z.string().uuid(),
  type: z.enum(["marker", "step", "cache"]),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  label: z.string().max(100).optional(),
  visibleToUsers: z.boolean().default(false),
  createdAt: z.coerce.date().optional(),
});

export type HuntMarkerDto = z.infer<typeof huntMarkerSchema>;

export class HuntMarkerModel {
  static formatResponse(marker: HuntMarker): HuntMarker {
    return marker;
  }

  static validate(data: unknown): HuntMarkerDto {
    return huntMarkerSchema.parse(data);
  }
}
