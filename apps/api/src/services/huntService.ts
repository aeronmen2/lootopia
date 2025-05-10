// huntService.ts
import { eq } from "drizzle-orm"
import { db } from "../db"
import { hunts } from "../db/schemas/hunts"
import type {Hunt} from "../db/schemas/hunts";
import type { HuntDto } from "../models/hunts"

export class HuntService {
  static async findAll(): Promise<Hunt[]> {
    return await db.select().from(hunts)
  }

  static async findById(id: string): Promise<Hunt | null> {
    const result = await db.select().from(hunts).where(eq(hunts.id, id))

    return result[0] ?? null
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
