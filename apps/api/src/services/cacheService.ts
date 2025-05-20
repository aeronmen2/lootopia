// cacheService.ts
import { eq } from "drizzle-orm"
import { db } from "../db"
import { caches  } from "../db/schemas/caches"
import type {Cache} from "../db/schemas/caches";
import type { CacheDto } from "../models/caches"

export class CacheService {
  static async findAll(): Promise<Cache[]> {
    const result = await db.select().from(caches)
    
    return result
  }

  static async findById(id: string): Promise<Cache | null> {
    const result = await db.select().from(caches).where(eq(caches.id, id))

    return result[0] ?? null
  }

  static async create(cacheData: CacheDto): Promise<Cache> {
    const newCache = await db.insert(caches).values({
      ...cacheData,
      createdAt: new Date()
    }).returning()
    
    return newCache[0]
  }

  static async update(id: string, cacheData: Partial<CacheDto>): Promise<Cache | null> {
    const updated = await db
      .update(caches)
      .set({ 
        ...cacheData, 
        updatedAt: new Date() // Mise à jour automatique
      })
      .where(eq(caches.id, id))
      .returning()

    return updated[0] ?? null
  }

  static async delete(id: string): Promise<Cache | null> {
    const deleted = await db
      .delete(caches)
      .where(eq(caches.id, id))
      .returning()

    return deleted[0] ?? null
  }

  static async updateVisibility(id: string, isVisible: boolean): Promise<Cache | null> {
    const updated = await db
      .update(caches)
      .set({ isVisible })
      .where(eq(caches.id, id))
      .returning()
    
    return updated[0] ?? null
  }
}
