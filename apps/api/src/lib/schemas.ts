import { z } from "zod";

export const loginPayloadSchema = z
  .object({
    email: z.string().email(),
    pin: z
      .string()
      .regex(/^\d{4}$/),
  })
  .strict();

export const subscriptionParamsSchema = z
  .object({
    id: z.string().min(1),
  })
  .strict();

export const listSubscriptionsQuerySchema = z
  .object({
    status: z.enum(["active", "canceling", "cancelled"]).optional(),
    riskLevel: z.enum(["low", "medium", "high"]).optional(),
    sort: z.enum(["renewal-asc", "amount-desc", "amount-asc"]).optional(),
  })
  .strict();

export const setBlockPayloadSchema = z
  .object({
    enabled: z.boolean(),
  })
  .strict();
