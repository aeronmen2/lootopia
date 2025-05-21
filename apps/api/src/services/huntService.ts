// huntService.ts
import { eq, count } from "drizzle-orm"
import { db } from "../db"
import { hunts } from "../db/schemas/hunts"
import type {Hunt} from "../db/schemas/hunts";
import type { HuntDto } from "../models/hunts"
import { huntParticipants } from "../db/schemas/hunt_participants";
export interface HuntWithParticipants extends Hunt {
  nbParticipants: number
}

export class HuntService {
  static async findAll(): Promise<HuntWithParticipants[]> {
    const result = await db
      .select({
        hunt: hunts,
        nbParticipants: count(huntParticipants.userId).as("nbParticipants"),
      })
      .from(hunts)
      .leftJoin(huntParticipants, eq(hunts.id, huntParticipants.huntId))
      .groupBy(hunts.id);
  
    return result.map(({ hunt, nbParticipants }) => ({
      ...hunt,
      nbParticipants,
    }));
  }

  static async findById(id: string): Promise<HuntWithParticipants | null> {
    const result = await db.select({
      hunt: hunts,
      nbParticipants: count(huntParticipants.userId).as("nbParticipants"),
    })
    .from(hunts).where(eq(hunts.id, id))
    .leftJoin(huntParticipants, eq(hunts.id, huntParticipants.huntId))
    .groupBy(hunts.id);

    return result[0]
      ? { ...result[0].hunt, nbParticipants: result[0].nbParticipants }
      : null;
  }

  static async findByOrganizerId(organizerId: string): Promise<HuntWithParticipants[]> {
    const result = await db
      .select({
        hunt: hunts,
        nbParticipants: count(huntParticipants.userId).as("nbParticipants"),
      })
      .from(hunts)
      .where(eq(hunts.organizerId, organizerId))
      .leftJoin(huntParticipants, eq(hunts.id, huntParticipants.huntId))
      .orderBy(hunts.startDate)
      .groupBy(hunts.id);
  
    return result.map(({ hunt, nbParticipants }) => ({
      ...hunt,
      nbParticipants,
    }));
  }

  static async create(huntData: HuntDto): Promise<Hunt> {
    const newHunt = await db.insert(hunts).values({
      ...huntData,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning()
    
    return newHunt[0]
  }

  static async update(id: string, huntData: Partial<HuntDto>): Promise<Hunt | null> {
    const updated = await db
      .update(hunts)
      .set({ 
        ...huntData, 
        updatedAt: new Date() // Mise à jour automatique
      })
      .where(eq(hunts.id, id))
      .returning()
    
    return updated[0] ?? null
  }

  static async delete(id: string): Promise<Hunt | null> {
    const deleted = await db.delete(hunts).where(eq(hunts.id, id)).returning()

    
return deleted[0] ?? null
  }
}
