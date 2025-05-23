import { eq } from "drizzle-orm";
import { db } from "../db";
import { userStep } from "../db/schemas/user_steps";
import type { UserStepDto } from "../models/user_steps";
import type { UserStep, UserStepInsert } from "../db/schemas/user_steps";

export class UserStepService {
  static async findAll(): Promise<UserStep[]> {
    return await db.select().from(userStep);
  }

  static async findById(id: string): Promise<UserStep | null> {
    const result = await db.select().from(userStep).where(eq(userStep.id, id));

    return result[0] ?? null;
  }

  static async findByUserId(userId: string): Promise<UserStep[]> {
    return await db.select().from(userStep).where(eq(userStep.userId, userId));
  }

  static async findByStepId(stepId: string): Promise<UserStep[]> {
    return await db.select().from(userStep).where(eq(userStep.stepId, stepId));
  }

  static async create(userStepData: UserStepDto): Promise<UserStep> {
    const newUserStep = await db
      .insert(userStep)
      .values({
        ...userStepData,
        validatedAt: userStepData.validatedAt || null, // Ensure validatedAt is handled
      })
      .returning();

    return newUserStep[0];
  }

  static async update(id: string, userStepData: Partial<UserStepInsert>): Promise<UserStep | null> {
    const updated = await db
      .update(userStep)
      .set({
        ...userStepData,
      })
      .where(eq(userStep.id, id))
      .returning();

    return updated[0] ?? null;
  }

  static async delete(id: string): Promise<UserStep | null> {
    const deleted = await db.delete(userStep).where(eq(userStep.id, id)).returning();

    return deleted[0] ?? null;
  }
}