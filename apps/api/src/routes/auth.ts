import type { FastifyInstance } from "fastify";
import { resetDemoState, updateDemoUserEmail } from "../data/demoState";
import { requireAuth } from "../lib/auth";
import { AppError, toSuccess } from "../lib/http";
import { loginPayloadSchema } from "../lib/schemas";
import { clearSessions, createSession, revokeSession } from "../lib/sessionStore";
import { parseOrThrow } from "../lib/validation";

const DEMO_PIN = process.env.DEMO_PIN ?? "2026";

export const registerAuthRoutes = (fastify: FastifyInstance): void => {
  fastify.post("/auth/demo-login", async (request, reply) => {
    const payload = parseOrThrow(loginPayloadSchema, request.body ?? {}, "login payload");

    if (payload.pin && payload.pin !== DEMO_PIN) {
      throw new AppError(401, "INVALID_CREDENTIALS", "Demo PIN is incorrect.");
    }

    const user = updateDemoUserEmail(payload.email ?? "demo@devhouse.app");
    const session = createSession(user.id);

    return reply.status(200).send(
      toSuccess({
        token: session.token,
        expiresAt: session.expiresAt,
        demoMode: session.demoMode,
        user,
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
        user: auth.user,
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

  fastify.post("/auth/demo-reset", async (_request, reply) => {
    clearSessions();
    resetDemoState();
    return reply.status(200).send(
      toSuccess({
        reset: true,
      }),
    );
  });
};
