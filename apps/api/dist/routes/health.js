"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerHealthRoute = void 0;
const http_1 = require("../lib/http");
const registerHealthRoute = (fastify) => {
    fastify.get("/health", async (_request, reply) => {
        return reply.status(200).send((0, http_1.toSuccess)({
            status: "ok",
            service: "subscription-cancellation-guarantee-api",
            timestamp: new Date().toISOString(),
        }));
    });
};
exports.registerHealthRoute = registerHealthRoute;
