import type { FastifyInstance } from "fastify";
import {
  getAlertsFeed,
  getCancellationCenter,
  getProtectionControls,
  updateProtectionControl,
} from "../data/demoState";
import { requireAuth } from "../lib/auth";
import { toSuccess } from "../lib/http";
import { setBlockPayloadSchema, subscriptionParamsSchema } from "../lib/schemas";
import { parseOrThrow } from "../lib/validation";

export const registerOperationsRoutes = (fastify: FastifyInstance): void => {
  fastify.get("/cancellations/center", async (request, reply) => {
    const auth = requireAuth(request);
    return reply.status(200).send(toSuccess(getCancellationCenter(auth.user.id)));
  });

  fastify.get("/protection-controls", async (request, reply) => {
    const auth = requireAuth(request);
    return reply.status(200).send(toSuccess(getProtectionControls(auth.user.id)));
  });

  fastify.post("/protection-controls/:id", async (request, reply) => {
    const auth = requireAuth(request);
    const params = parseOrThrow(subscriptionParamsSchema, request.params ?? {}, "protection params");
    const payload = parseOrThrow(setBlockPayloadSchema, request.body ?? {}, "protection payload");

    return reply
      .status(200)
      .send(toSuccess(updateProtectionControl(auth.user.id, params.id, payload.enabled)));
  });

  fastify.get("/alerts/feed", async (request, reply) => {
    const auth = requireAuth(request);
    return reply.status(200).send(toSuccess(getAlertsFeed(auth.user.id)));
  });
};
