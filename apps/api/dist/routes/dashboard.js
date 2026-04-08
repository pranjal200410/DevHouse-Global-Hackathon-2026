"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDashboardRoutes = void 0;
const demoState_1 = require("../data/demoState");
const auth_1 = require("../lib/auth");
const http_1 = require("../lib/http");
const registerDashboardRoutes = (fastify) => {
    fastify.get("/dashboard/summary", async (request, reply) => {
        const auth = (0, auth_1.requireAuth)(request);
        return reply.status(200).send((0, http_1.toSuccess)((0, demoState_1.getDashboardSummary)(auth.user.id)));
    });
};
exports.registerDashboardRoutes = registerDashboardRoutes;
