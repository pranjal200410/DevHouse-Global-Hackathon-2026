"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setBlockPayloadSchema = exports.listSubscriptionsQuerySchema = exports.subscriptionParamsSchema = exports.loginPayloadSchema = void 0;
const zod_1 = require("zod");
exports.loginPayloadSchema = zod_1.z
    .object({
    email: zod_1.z.string().email(),
    pin: zod_1.z
        .string()
        .regex(/^\d{4}$/),
})
    .strict();
exports.subscriptionParamsSchema = zod_1.z
    .object({
    id: zod_1.z.string().min(1),
})
    .strict();
exports.listSubscriptionsQuerySchema = zod_1.z
    .object({
    status: zod_1.z.enum(["active", "canceling", "cancelled"]).optional(),
    riskLevel: zod_1.z.enum(["low", "medium", "high"]).optional(),
    sort: zod_1.z.enum(["renewal-asc", "amount-desc", "amount-asc"]).optional(),
})
    .strict();
exports.setBlockPayloadSchema = zod_1.z
    .object({
    enabled: zod_1.z.boolean(),
})
    .strict();
