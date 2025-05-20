// digActionService.ts
import { eq } from "drizzle-orm"
import { db } from "../db"
import { digActions  } from "../db/schemas/dig_actions"
import type {DigAction} from "../db/schemas/dig_actions";
import type { DigActionDto } from "../models/dig_actions";

export class DigActionService {
    static async logDig(digData: DigActionDto): Promise<DigAction> {
        const newDig = await db.insert(digActions).values({
          ...digData,
          digTime: new Date() // Ajout de la date automatique
        }).returning()
        
        return newDig[0]
      }

  static async getByCache(cacheId: string): Promise<DigAction[]> {
    return await db
      .select()
      .from(digActions)
      .where(eq(digActions.cacheId, cacheId))
  }
}
