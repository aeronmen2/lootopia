// digActionService.ts
import { eq } from "drizzle-orm"
import { db } from "../db"
import { dig  } from "../db/schemas/digs"
import type {Dig} from "../db/schemas/digs";
import type { DigDto } from "../models/dig";

export class DigService {
  static async create(digData: DigDto): Promise<Dig> {
      const newDig = await db.insert(dig).values({
        ...digData,
        digTime: new Date() // Ajout de la date automatique
      }).returning()
      
      return newDig[0]
    }

    static async findByUserId(userId: string): Promise<Dig[]> {
      const result = await db
        .select()
        .from(dig)
        .where(eq(dig.userId, userId))

      return result
    }
    
  static async getByCache(cacheId: string): Promise<Dig[]> {
    return await db
      .select()
      .from(dig)
      .where(eq(dig.cacheId, cacheId))
  }
}
