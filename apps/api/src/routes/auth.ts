import { timingSafeEqual } from "crypto";
import type { FastifyInstance } from "fastify";
import { getOrCreateDemoUser, resetDemoStateForUser } from "../data/demoState";
import { requireAuth } from "../lib/auth";
import { AppError, toSuccess } from "../lib/http";
import { loginPayloadSchema } from "../lib/schemas";
import { createSession, revokeSession } from "../lib/sessionStore";
import { parseOrThrow } from "../lib/validation";

const DEMO_PIN = process.env.DEMO_PIN ?? "2026";
const DEMO_RESET_KEY =
  process.env.DEMO_RESET_KEY ?? (process.env.NODE_ENV === "production" ? "" : "devhouse-reset-2026");

const isSecretMatch = (providedSecret: string, expectedSecret: string): boolean => {
  const provided = Buffer.from(providedSecret);
  const expected = Buffer.from(expectedSecret);
  if (provided.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(provided, expected);
};

const readHeaderValue = (value: string | string[] | undefined): string =>
  Array.isArray(value) ? value[0] ?? "" : value ?? "";

export const registerAuthRoutes = (fastify: FastifyInstance): void => {
  fastify.post("/auth/demo-login", async (request, reply) => {
    const payload = parseOrThrow(loginPayloadSchema, request.body ?? {}, "login payload");

    if (!isSecretMatch(payload.pin, DEMO_PIN)) {
      throw new AppError(401, "INVALID_CREDENTIALS", "Demo PIN is incorrect.");
    }

    const user = getOrCreateDemoUser(payload.email);
    const session = createSession(user);

    return reply.status(200).send(
      toSuccess({
        token: session.token,
        expiresAt: session.expiresAt,
        demoMode: session.demoMode,
        user: session.user,
      }),
    );
  });

  fastify.get("/auth/session", async (request, reply) => {
    const auth = requireAuth(request);
    return reply.status(200).send(
      toSuccess({
        token: auth.token,
        expiresAt: auth.session.expiresAt,
        demoMode: auth.session.demoMode,
        user: auth.session.user,
      }),
    );
  });

  fastify.post("/auth/logout", async (request, reply) => {
    const auth = requireAuth(request);
    revokeSession(auth.token);
    return reply.status(200).send(
      toSuccess({
        loggedOut: true,
      }),
    );
  });

  fastify.post("/auth/demo-reset", async (request, reply) => {
    const auth = requireAuth(request);
    if (!DEMO_RESET_KEY) {
      throw new AppError(503, "RESET_NOT_CONFIGURED", "Demo reset is not configured on this environment.");
    }

    const providedResetKey = readHeaderValue(request.headers["x-demo-reset-key"]);
    if (!providedResetKey || !isSecretMatch(providedResetKey, DEMO_RESET_KEY)) {
      throw new AppError(403, "RESET_FORBIDDEN", "Reset key is invalid.");
    }

    resetDemoStateForUser(auth.user.id);
    return reply.status(200).send(
      toSuccess({
        reset: true,
      }),
    );
  });
};
