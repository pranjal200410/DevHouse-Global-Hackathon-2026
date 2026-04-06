import type { FastifyInstance } from "fastify";
import { getDashboardSummary } from "../data/demoState";
import { requireAuth } from "../lib/auth";
import { toSuccess } from "../lib/http";

export const registerDashboardRoutes = (fastify: FastifyInstance): void => {
  fastify.get("/dashboard/summary", async (request, reply) => {
    const auth = requireAuth(request);
    return reply.status(200).send(toSuccess(getDashboardSummary(auth.user.id)));
  });
};
