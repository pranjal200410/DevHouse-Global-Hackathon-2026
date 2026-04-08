"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSubscriptionRoutes = void 0;
const demoState_1 = require("../data/demoState");
const auth_1 = require("../lib/auth");
const http_1 = require("../lib/http");
const schemas_1 = require("../lib/schemas");
const validation_1 = require("../lib/validation");
const registerSubscriptionRoutes = (fastify) => {
    fastify.get("/subscriptions", async (request, reply) => {
        const auth = (0, auth_1.requireAuth)(request);
        const query = (0, validation_1.parseOrThrow)(schemas_1.listSubscriptionsQuerySchema, request.query ?? {}, "subscriptions query");
        const rows = (0, demoState_1.listSubscriptions)(auth.user.id, {
            status: query.status,
            riskLevel: query.riskLevel,
            sort: query.sort,
        });
        return reply.status(200).send((0, http_1.toSuccess)(rows));
    });
    fastify.get("/subscriptions/:id", async (request, reply) => {
        const auth = (0, auth_1.requireAuth)(request);
        const params = (0, validation_1.parseOrThrow)(schemas_1.subscriptionParamsSchema, request.params ?? {}, "subscription params");
        return reply.status(200).send((0, http_1.toSuccess)((0, demoState_1.getSubscriptionDetail)(auth.user.id, params.id)));
    });
    fastify.post("/subscriptions/:id/cancel", async (request, reply) => {
        const auth = (0, auth_1.requireAuth)(request);
        const params = (0, validation_1.parseOrThrow)(schemas_1.subscriptionParamsSchema, request.params ?? {}, "subscription params");
        return reply.status(200).send((0, http_1.toSuccess)((0, demoState_1.startCancellation)(auth.user.id, params.id)));
    });
    fastify.post("/subscriptions/:id/cancel/complete", async (request, reply) => {
        const auth = (0, auth_1.requireAuth)(request);
        const params = (0, validation_1.parseOrThrow)(schemas_1.subscriptionParamsSchema, request.params ?? {}, "subscription params");
        return reply.status(200).send((0, http_1.toSuccess)((0, demoState_1.completeCancellation)(auth.user.id, params.id)));
    });
    fastify.post("/subscriptions/:id/block", async (request, reply) => {
        const auth = (0, auth_1.requireAuth)(request);
        const params = (0, validation_1.parseOrThrow)(schemas_1.subscriptionParamsSchema, request.params ?? {}, "subscription params");
        const payload = (0, validation_1.parseOrThrow)(schemas_1.setBlockPayloadSchema, request.body ?? {}, "block payload");
        return reply.status(200).send((0, http_1.toSuccess)((0, demoState_1.setAutoBlock)(auth.user.id, params.id, payload.enabled)));
    });
    fastify.get("/renewals/calendar", async (request, reply) => {
        const auth = (0, auth_1.requireAuth)(request);
        return reply.status(200).send((0, http_1.toSuccess)((0, demoState_1.getRenewalCalendar)(auth.user.id)));
    });
};
exports.registerSubscriptionRoutes = registerSubscriptionRoutes;
