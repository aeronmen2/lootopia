// cacheService.ts
import { eq } from "drizzle-orm"
import { db } from "../db"
import { cache } from "../db/schemas/caches"
import type {Cache} from "../db/schemas/caches";
import type { CacheDto } from "../models/caches"

export class CacheService {
  static async findAll(): Promise<Cache[]> {
    const result = await db.select().from(cache)
    
    return result
  }

  static async findByStepId(stepId: string): Promise<Cache[]> {
    const result = await db.select().from(cache).where(eq(cache.stepId, stepId))

    return result
  }

  static async findById(id: string): Promise<Cache | null> {
    const result = await db.select().from(cache).where(eq(cache.id, id))

    return result[0] ?? null
  }

  static async create(cacheData: CacheDto): Promise<Cache> {
    const newCache = await db.insert(cache).values({
      ...cacheData,
      stepId: cacheData.stepId ?? "", // Provide a default value or handle null/undefined
    }).returning()
    
    return newCache[0]
  }

  static async update(id: string, cacheData: Partial<CacheDto>): Promise<Cache | null> {
    const updated = await db
      .update(cache)
      .set({ 
        ...cacheData, 
        stepId: cacheData.stepId ?? undefined, // Convert null to undefined
        updatedAt: new Date() // Mise à jour automatique
      })
      .where(eq(cache.id, id))
      .returning()

    return updated[0] ?? null
  }

  static async delete(id: string): Promise<Cache | null> {
    const deleted = await db
      .delete(cache)
      .where(eq(cache.id, id))
      .returning()

    return deleted[0] ?? null
  }

  static async updateVisibility(id: string, isVisible: boolean): Promise<Cache | null> {
    const updated = await db
      .update(cache)
      .set({ isVisible })
      .where(eq(cache.id, id))
      .returning()
    
    return updated[0] ?? null
  }
}
