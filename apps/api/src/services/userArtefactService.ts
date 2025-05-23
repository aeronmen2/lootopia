import { eq } from "drizzle-orm";
import { db } from "../db";
import { userArtefact } from "../db/schemas/user_artefacts";
import type { UserArtefactDto } from "../models/user_artefacts";
import type { userArtefact as UserArtefact, userArtefactInsert as UserArtefactInsert } from "../db/schemas/user_artefacts";

export class UserArtefactService {
  static async findAll(): Promise<UserArtefact[]> {
    return await db.select().from(userArtefact);
  }

  static async findById(id: string): Promise<UserArtefact | null> {
    const result = await db.select().from(userArtefact).where(eq(userArtefact.id, id));
    
    return result[0] ?? null;
  }

    static async findByUserId(userId: string): Promise<UserArtefact[]> {
        return await db.select().from(userArtefact).where(eq(userArtefact.userId, userId));
    }

    static async findByArtefactId(artefactId: string): Promise<UserArtefact[]> {
        return await db.select().from(userArtefact).where(eq(userArtefact.artefactId, artefactId));
    }

    static async findByHuntId(huntId: string): Promise<UserArtefact[]> {
        return await db.select().from(userArtefact).where(eq(userArtefact.huntId, huntId));
    }

  static async create(userArtefactData: UserArtefactDto): Promise<UserArtefact> {
    console.log("userArtefactData", userArtefactData);
    const newUserArtefact = await db
      .insert(userArtefact)
      .values({
        ...userArtefactData,
        obtainedAt: new Date(), // Set the obtainedAt date to now
      })
      .returning();

    return newUserArtefact[0];
  }

  static async update(id: string, userArtefactData: Partial<UserArtefactInsert>): Promise<UserArtefact | null> {
    const updated = await db
      .update(userArtefact)
      .set({
        ...userArtefactData,
      })
      .where(eq(userArtefact.id, id))
      .returning();

    return updated[0] ?? null;
  }

  static async delete(id: string): Promise<UserArtefact | null> {
    const deleted = await db.delete(userArtefact).where(eq(userArtefact.id, id)).returning();
    
    return deleted[0] ?? null;
  }
}