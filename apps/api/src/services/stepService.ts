import { eq } from "drizzle-orm";
import { db } from "../db";
import { step } from "../db/schemas/steps";
import type { Step } from "../db/schemas/steps";
import type { StepDto } from "../models/steps";
import { StepModel } from "../models/steps";

export class StepService {
  static async findAll(): Promise<Step[]> {
    const result = await db.select().from(step);

    return result.map(StepModel.formatResponse);
  }

  static async findByMapId(mapId: string): Promise<Step[]> {
    const result = await db.select().from(step).where(eq(step.mapId, mapId));
    
    return result.map(StepModel.formatResponse);
  }

  static async findById(id: string): Promise<Step | null> {
    const result = await db.select().from(step).where(eq(step.id, id));

    return result[0] ? StepModel.formatResponse(result[0]) : null;
  }

  static async create(stepData: StepDto): Promise<Step> {
    const validatedData = StepModel.validate(stepData);
    const newStep = await db.insert(step).values({
      ...validatedData,
    }).returning();

    return StepModel.formatResponse(newStep[0]);
  }

  static async update(id: string, stepData: Partial<StepDto>): Promise<Step | null> {
    const updated = await db.update(step).set({
      ...stepData,
    }).where(eq(step.id, id)).returning();

    return updated[0] ? StepModel.formatResponse(updated[0]) : null;
  }

  static async delete(id: string): Promise<Step | null> {
    const deleted = await db.delete(step).where(eq(step.id, id)).returning();

    return deleted[0] ? StepModel.formatResponse(deleted[0]) : null;
  }
}