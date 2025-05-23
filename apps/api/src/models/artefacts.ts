// artefact.model.ts
import { z } from "zod";
import type { Artefact } from "../db/schemas/artefacts";

export const artefactSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  rarity: z.enum(["common", "rare", "epic", "legendary"]),
  imageUrl: z.string().url().optional(),
});

export type ArtefactDto = z.infer<typeof artefactSchema>;

export class ArtifactModel {
  static formatResponse(artefact: Artefact): Artefact {
    return artefact;
  }

  static validate(data: unknown): ArtefactDto {
    return artefactSchema.parse(data);
  }
}
