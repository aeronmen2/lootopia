// hunt-participant.model.ts
import { z } from "zod";
import type { huntParticipants } from "../db/schemas/hunt_participants";

export const huntParticipantSchema = z.object({
  huntId: z.string().uuid(),
  userId: z.string().uuid(),
  status: z.enum(["enrolled", "completed", "abandoned"]).default("enrolled"),
  joinedAt: z.coerce.date().default(new Date()),
  leftAt: z.coerce.date().optional(),
});

export type HuntParticipantDto = z.infer<typeof huntParticipantSchema>;

export class HuntParticipantModel {
  static formatResponse(participant: typeof huntParticipants): typeof huntParticipants {
    return participant;
  }

  static validate(data: unknown): HuntParticipantDto {
    return huntParticipantSchema.parse(data);
  }
}
