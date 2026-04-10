"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerOperationsRoutes = void 0;
const demoState_1 = require("../data/demoState");
const auth_1 = require("../lib/auth");
const http_1 = require("../lib/http");
const schemas_1 = require("../lib/schemas");
const validation_1 = require("../lib/validation");
const registerOperationsRoutes = (fastify) => {
    fastify.get("/cancellations/center", async (request, reply) => {
        const auth = (0, auth_1.requireAuth)(request);
        return reply.status(200).send((0, http_1.toSuccess)((0, demoState_1.getCancellationCenter)(auth.user.id)));
    });
    fastify.get("/protection-controls", async (request, reply) => {
        const auth = (0, auth_1.requireAuth)(request);
        return reply.status(200).send((0, http_1.toSuccess)((0, demoState_1.getProtectionControls)(auth.user.id)));
    });
    fastify.post("/protection-controls/:id", async (request, reply) => {
        const auth = (0, auth_1.requireAuth)(request);
        const params = (0, validation_1.parseOrThrow)(schemas_1.subscriptionParamsSchema, request.params ?? {}, "protection params");
        const payload = (0, validation_1.parseOrThrow)(schemas_1.setBlockPayloadSchema, request.body ?? {}, "protection payload");
        return reply
            .status(200)
            .send((0, http_1.toSuccess)((0, demoState_1.updateProtectionControl)(auth.user.id, params.id, payload.enabled)));
    });
    fastify.get("/alerts/feed", async (request, reply) => {
        const auth = (0, auth_1.requireAuth)(request);
        return reply.status(200).send((0, http_1.toSuccess)((0, demoState_1.getAlertsFeed)(auth.user.id)));
    });
};
exports.registerOperationsRoutes = registerOperationsRoutes;
