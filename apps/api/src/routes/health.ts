import type { FastifyInstance } from "fastify";
import { toSuccess } from "../lib/http";

export const registerHealthRoute = (fastify: FastifyInstance): void => {
  fastify.get("/health", async (_request, reply) => {
    return reply.status(200).send(
      toSuccess({
        status: "ok",
        service: "subscription-cancellation-guarantee-api",
        timestamp: new Date().toISOString(),
      }),
    );
  });
};
