import { eq } from "drizzle-orm";
import { db } from "../db";
import { artefact } from "../db/schemas/artefacts";
import type { ArtefactDto } from "../models/artefacts";
import type { Artefact, ArtefactInsert } from "../db/schemas/artefacts";

export class ArtefactService {
  static async findAll(): Promise<Artefact[]> {
    return await db.select().from(artefact);
  }

  static async findById(id: string): Promise<Artefact | null> {
    const result = await db.select().from(artefact).where(eq(artefact.id, id));
    
    return result[0] ?? null;
  }

  static async create(artefactData: ArtefactDto): Promise<Artefact> {
    const newArtefact = await db
      .insert(artefact)
      .values({
        ...artefactData,
      })
      .returning();

    return newArtefact[0];
  }

  static async update(id: string, artefactData: Partial<ArtefactInsert>): Promise<Artefact | null> {
    const updated = await db
      .update(artefact)
      .set({
        ...artefactData,
      })
      .where(eq(artefact.id, id))
      .returning();

    return updated[0] ?? null;
  }

  static async delete(id: string): Promise<Artefact | null> {
    const deleted = await db.delete(artefact).where(eq(artefact.id, id)).returning();
    
    return deleted[0] ?? null;
  }
}