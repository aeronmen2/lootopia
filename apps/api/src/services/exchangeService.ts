import { db } from "../db";
import { exchange } from "../db/schemas/exchanges";
import { eq } from "drizzle-orm";
import type { Exchange, ExchangeInsert } from "../db/schemas/exchanges";

export class ExchangeService {
  static async findAll(): Promise<Exchange[]> {
    return await db.select().from(exchange);
  }

  static async findById(id: string): Promise<Exchange | null> {
    const result = await db.select().from(exchange).where(eq(exchange.id, id));

    
    return result[0] ?? null;
  }

    static async findByUserSender(userId: string): Promise<Exchange[]> {
        return await db.select().from(exchange).where(eq(exchange.userSender, userId));
    }

    static async findByUserReceiver(userId: string): Promise<Exchange[]> {
        return await db.select().from(exchange).where(eq(exchange.userReceiver, userId));
    }

  static async create(exchangeData: ExchangeInsert): Promise<Exchange> {
    const newExchange = await db.insert(exchange).values(exchangeData).returning();

    
    return newExchange[0];
  }

  static async delete(id: string): Promise<Exchange | null> {
    const deleted = await db.delete(exchange).where(eq(exchange.id, id)).returning();

    
    return deleted[0] ?? null;
  }
}