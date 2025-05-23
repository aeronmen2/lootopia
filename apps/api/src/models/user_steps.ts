// userStep.model.ts
import { z } from "zod";
import type { UserStep } from "../db/schemas/user_steps";

export const userStepSchema = z.object({
  userId: z.string().uuid(),
  stepId: z.string().uuid(),
  isValid: z.boolean().default(false),
  validatedAt: z.coerce.date().optional(),
});

export type UserStepDto = z.infer<typeof userStepSchema>;

export class UserStepModel {
  static formatResponse(userStep: UserStep): UserStep {
    return userStep;
  }

  static validate(data: unknown): UserStepDto {
    return userStepSchema.parse(data);
  }
}
