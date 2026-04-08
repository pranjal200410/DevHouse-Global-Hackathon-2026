"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAuthRoutes = void 0;
const crypto_1 = require("crypto");
const demoState_1 = require("../data/demoState");
const auth_1 = require("../lib/auth");
const http_1 = require("../lib/http");
const schemas_1 = require("../lib/schemas");
const sessionStore_1 = require("../lib/sessionStore");
const validation_1 = require("../lib/validation");
const DEMO_PIN = process.env.DEMO_PIN ?? "2026";
const DEMO_RESET_KEY = process.env.DEMO_RESET_KEY ?? (process.env.NODE_ENV === "production" ? "" : "devhouse-reset-2026");
const isSecretMatch = (providedSecret, expectedSecret) => {
    const provided = Buffer.from(providedSecret);
    const expected = Buffer.from(expectedSecret);
    if (provided.length !== expected.length) {
        return false;
    }
    return (0, crypto_1.timingSafeEqual)(provided, expected);
};
const readHeaderValue = (value) => Array.isArray(value) ? value[0] ?? "" : value ?? "";
const registerAuthRoutes = (fastify) => {
    fastify.post("/auth/demo-login", async (request, reply) => {
        const payload = (0, validation_1.parseOrThrow)(schemas_1.loginPayloadSchema, request.body ?? {}, "login payload");
        if (!isSecretMatch(payload.pin, DEMO_PIN)) {
            throw new http_1.AppError(401, "INVALID_CREDENTIALS", "Demo PIN is incorrect.");
        }
        const user = (0, demoState_1.getOrCreateDemoUser)(payload.email);
        const session = (0, sessionStore_1.createSession)(user);
        return reply.status(200).send((0, http_1.toSuccess)({
            token: session.token,
            expiresAt: session.expiresAt,
            demoMode: session.demoMode,
            user: session.user,
        }));
    });
    fastify.get("/auth/session", async (request, reply) => {
        const auth = (0, auth_1.requireAuth)(request);
        return reply.status(200).send((0, http_1.toSuccess)({
            token: auth.token,
            expiresAt: auth.session.expiresAt,
            demoMode: auth.session.demoMode,
            user: auth.session.user,
        }));
    });
    fastify.post("/auth/logout", async (request, reply) => {
        const auth = (0, auth_1.requireAuth)(request);
        (0, sessionStore_1.revokeSession)(auth.token);
        return reply.status(200).send((0, http_1.toSuccess)({
            loggedOut: true,
        }));
    });
    fastify.post("/auth/demo-reset", async (request, reply) => {
        const auth = (0, auth_1.requireAuth)(request);
        if (!DEMO_RESET_KEY) {
            throw new http_1.AppError(503, "RESET_NOT_CONFIGURED", "Demo reset is not configured on this environment.");
        }
        const providedResetKey = readHeaderValue(request.headers["x-demo-reset-key"]);
        if (!providedResetKey || !isSecretMatch(providedResetKey, DEMO_RESET_KEY)) {
            throw new http_1.AppError(403, "RESET_FORBIDDEN", "Reset key is invalid.");
        }
        (0, demoState_1.resetDemoStateForUser)(auth.user.id);
        return reply.status(200).send((0, http_1.toSuccess)({
            reset: true,
        }));
    });
};
exports.registerAuthRoutes = registerAuthRoutes;
