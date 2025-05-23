// userArtefact.model.ts
import { z } from "zod";
import type { userArtefact } from "../db/schemas/user_artefacts";

export const userArtefactSchema = z.object({
  userId: z.string().uuid(),
  artefactId: z.string().uuid(),
  huntId: z.string().uuid(),
  obtainedAt: z.coerce.date(),
});

export type UserArtefactDto = z.infer<typeof userArtefactSchema>;

export class UserArtefactModel {
  static formatResponse(userArtefact: userArtefact): userArtefact {
    return userArtefact;
  }

  static validate(data: unknown): UserArtefactDto {
    return userArtefactSchema.parse(data);
  }
}
