// huntParticipantService.ts
import { eq, and, count, inArray } from "drizzle-orm"
import { db } from "../db"
import { huntParticipants  } from "../db/schemas/hunt_participants"
import type { HuntParticipantDto } from "../models/hunt_participants";
import { hunts } from "../db/schemas";
import { users } from "../db/schemas/userSchema";
import type { User } from "../db/schemas/userSchema";
import type { Hunt } from "../db/schemas/hunts";
import type { HuntParticipant } from "../db/schemas/hunt_participants";

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
      joinedDate: huntParticipants.joinedAt, // assuming createdAt is the joined date
      })
      .from(users)
      .innerJoin(huntParticipants, eq(users.id, huntParticipants.userId))
      .where(eq(huntParticipants.huntId, huntId));
  
    return result.map(row => ({
      ...row.users,
      joinedDate: row.joinedDate,
    }));
  }

  static async findByUserId(userId: string): Promise<HuntWithParticipants[]> {
    // Sous-requête pour trouver les huntIds auxquels l'utilisateur participe
    const userHuntIds = await db
      .select({ huntId: huntParticipants.huntId })
      .from(huntParticipants)
      .where(eq(huntParticipants.userId, userId));
  
    const huntIds = userHuntIds.map((row) => row.huntId);
  
    if (huntIds.length === 0) return [];
  
    // Requête principale pour récupérer les hunts + nb total de participants
    const result = await db
      .select({
        hunt: hunts,
        nbParticipants: count(huntParticipants.userId).as('nbParticipants'),
      })
      .from(hunts)
      .innerJoin(huntParticipants, eq(hunts.id, huntParticipants.huntId))
      .where(inArray(hunts.id, huntIds))
      .orderBy(hunts.startDate)
      .groupBy(hunts.id);
  
    return result.map(({ hunt, nbParticipants }) => ({
      ...hunt,
      nbParticipants,
    }));
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
