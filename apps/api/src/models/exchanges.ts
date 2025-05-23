// exchange.model.ts
import { z } from "zod";
import type { Exchange } from "../db/schemas/exchanges";

export const exchangeSchema = z.object({
  userSender: z.string().uuid(),
  userReceiver: z.string().uuid(),
  artifactId: z.string().uuid(),
  exchangedAt: z.coerce.date(),
});

export type ExchangeDto = z.infer<typeof exchangeSchema>;

export class ExchangeModel {
  static formatResponse(exchange: Exchange): Exchange {
    return exchange;
  }

  static validate(data: unknown): ExchangeDto {
    return exchangeSchema.parse(data);
  }
}
