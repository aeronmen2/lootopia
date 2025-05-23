// huntParticipantService.ts
import { eq, and, count, inArray } from "drizzle-orm"
import { db } from "../db"
import { participant  } from "../db/schemas/participants"
import type { HuntParticipantDto } from "../models/participants";
import { hunts } from "../db/schemas";
import { users } from "../db/schemas/userSchema";
import type { User } from "../db/schemas/userSchema";
import type { Hunt } from "../db/schemas/hunts";
import type { Participant } from "../db/schemas/participants";

export interface UserWithJoinedDate extends User {
  joinedDate: Date;
}

export interface HuntWithParticipants extends Hunt {
  nbParticipants: number
}

export class HuntParticipantService {
  static async findByHuntId(huntId: string): Promise<UserWithJoinedDate[]> {
    const result = await db
      .select({
      users,
      joinedDate: participant.joinedAt, // assuming createdAt is the joined date
      })
      .from(users)
      .innerJoin(participant, eq(users.id, participant.userId))
      .where(eq(participant.huntId, huntId));
  
    return result.map(row => ({
      ...row.users,
      joinedDate: row.joinedDate,
    }));
  }

  static async findByUserId(userId: string): Promise<HuntWithParticipants[]> {
    // Sous-requête pour trouver les huntIds auxquels l'utilisateur participe
    const userHuntIds = await db
      .select({ huntId: participant.huntId })
      .from(participant)
      .where(eq(participant.userId, userId));
  
    const huntIds = userHuntIds.map((row) => row.huntId);
  
    if (huntIds.length === 0) return [];
  
    // Requête principale pour récupérer les hunts + nb total de participants
    const result = await db
      .select({
        hunt: hunts,
        nbParticipants: count(participant.userId).as('nbParticipants'),
      })
      .from(hunts)
      .innerJoin(participant, eq(hunts.id, participant.huntId))
      .where(inArray(hunts.id, huntIds))
      .orderBy(hunts.startDate)
      .groupBy(hunts.id);
  
    return result.map(({ hunt, nbParticipants }) => ({
      ...hunt,
      nbParticipants,
    }));
  }
  
  static async create(huntParticipantData: HuntParticipantDto): Promise<Participant> {
    const newParticipant = await db.insert(participant).values(huntParticipantData).returning()

    return newParticipant[0]
  }

  static async updateStatus(id: string, status: string): Promise<Participant | null> {
    const updated = await db
      .update(participant)
      .set({ status })
      .where(eq(participant.id, id))
      .returning()
    
    return updated[0] ?? null
  }

  static async deleteByHuntIdAndUserId(huntId: string, userId: string): Promise<void> {
    await db
      .delete(participant)
      .where(and(eq(participant.huntId, huntId), eq(participant.userId, userId)))
  }
}
