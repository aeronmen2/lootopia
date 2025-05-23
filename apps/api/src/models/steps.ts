// step.model.ts
import { z } from "zod";
import type { Step } from "../db/schemas/steps";

export const stepSchema = z.object({
  mapId: z.string().uuid(),
  content: z.string().min(1),
  order: z.number().int().min(0),
});

export type StepDto = z.infer<typeof stepSchema>;

export class StepModel {
  static formatResponse(step: Step): Step {
    return step;
  }

  static validate(data: unknown): StepDto {
    return stepSchema.parse(data);
  }
}
