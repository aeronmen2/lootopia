import { eq } from "drizzle-orm";
import { db } from "../db";
import { map } from "../db/schemas/maps";
import type { Map } from "../db/schemas/maps";
import type { HuntMapDto } from "../models/maps";

export class MapService {
  static async create(mapData: HuntMapDto): Promise<Map> {
    const newMap = await db.insert(map).values({
      ...mapData,
      scaleMin: mapData.scaleMin?.toString(),
      scaleMax: mapData.scaleMax?.toString(),
    }).returning();
    
    return newMap[0];
  }

  static async findByHuntId(huntId: string): Promise<Map[]> {
    const result = await db
      .select()
      .from(map)
      .where(eq(map.huntId, huntId));

    return result;
  }

  static async findById(mapId: string): Promise<Map | null> {
    const result = await db
      .select()
      .from(map)
      .where(eq(map.id, mapId))
      .limit(1);

    return result[0] || null;
  }

  static async update(mapId: string, mapData: Partial<HuntMapDto>): Promise<Map | null> {
    const updatedMap = await db
      .update(map)
      .set({
        ...mapData,
        scaleMin: mapData.scaleMin?.toString(),
        scaleMax: mapData.scaleMax?.toString(),
      })
      .where(eq(map.id, mapId))
      .returning();

    return updatedMap[0] || null;
  }

  static async delete(mapId: string): Promise<Map | null> {
    const deletedMap = await db
      .delete(map)
      .where(eq(map.id, mapId))
      .returning();

    return deletedMap[0] || null;
  }
}