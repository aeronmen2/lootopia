// huntParticipantService.ts
import { eq, and } from "drizzle-orm"
import { db } from "../db"
import { huntParticipants  } from "../db/schemas/hunt_participants"
import type {HuntParticipant} from "../db/schemas/hunt_participants";
import type { HuntParticipantDto } from "../models/hunt_participants";

export class HuntParticipantService {
  static async findByHuntId(huntId: string): Promise<HuntParticipant[]> {
    return await db
      .select()
      .from(huntParticipants)
      .where(eq(huntParticipants.huntId, huntId))
  }

  static async findByUserId(userId: string): Promise<HuntParticipant[]> {
    return await db
      .select()
      .from(huntParticipants)
      .where(eq(huntParticipants.userId, userId))
  }

  static async create(huntParticipantData: HuntParticipantDto): Promise<HuntParticipant> {
    const newParticipant = await db.insert(huntParticipants).values(huntParticipantData).returning()

    return newParticipant[0]
  }

  static async updateStatus(id: string, status: string): Promise<HuntParticipant | null> {
    const updated = await db
      .update(huntParticipants)
      .set({ status })
      .where(eq(huntParticipants.id, id))
      .returning()
    
    return updated[0] ?? null
  }

  static async deleteByHuntIdAndUserId(huntId: string, userId: string): Promise<void> {
    await db
      .delete(huntParticipants)
      .where(and(eq(huntParticipants.huntId, huntId), eq(huntParticipants.userId, userId)))
  }
}
