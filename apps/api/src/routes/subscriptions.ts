import type { FastifyInstance } from "fastify";
import {
  completeCancellation,
  getRenewalCalendar,
  getSubscriptionDetail,
  listSubscriptions,
  setAutoBlock,
  startCancellation,
} from "../data/demoState";
import { requireAuth } from "../lib/auth";
import { toSuccess } from "../lib/http";
import {
  listSubscriptionsQuerySchema,
  setBlockPayloadSchema,
  subscriptionParamsSchema,
} from "../lib/schemas";
import { parseOrThrow } from "../lib/validation";

export const registerSubscriptionRoutes = (fastify: FastifyInstance): void => {
  fastify.get("/subscriptions", async (request, reply) => {
    const auth = requireAuth(request);
    const query = parseOrThrow(listSubscriptionsQuerySchema, request.query ?? {}, "subscriptions query");
    const rows = listSubscriptions(auth.user.id, {
      status: query.status,
      riskLevel: query.riskLevel,
      sort: query.sort,
    });
    return reply.status(200).send(toSuccess(rows));
  });

  fastify.get("/subscriptions/:id", async (request, reply) => {
    const auth = requireAuth(request);
    const params = parseOrThrow(subscriptionParamsSchema, request.params ?? {}, "subscription params");
    return reply.status(200).send(toSuccess(getSubscriptionDetail(auth.user.id, params.id)));
  });

  fastify.post("/subscriptions/:id/cancel", async (request, reply) => {
    const auth = requireAuth(request);
    const params = parseOrThrow(subscriptionParamsSchema, request.params ?? {}, "subscription params");
    return reply.status(200).send(toSuccess(startCancellation(auth.user.id, params.id)));
  });

  fastify.post("/subscriptions/:id/cancel/complete", async (request, reply) => {
    const auth = requireAuth(request);
    const params = parseOrThrow(subscriptionParamsSchema, request.params ?? {}, "subscription params");
    return reply.status(200).send(toSuccess(completeCancellation(auth.user.id, params.id)));
  });

  fastify.post("/subscriptions/:id/block", async (request, reply) => {
    const auth = requireAuth(request);
    const params = parseOrThrow(subscriptionParamsSchema, request.params ?? {}, "subscription params");
    const payload = parseOrThrow(setBlockPayloadSchema, request.body ?? {}, "block payload");
    return reply.status(200).send(toSuccess(setAutoBlock(auth.user.id, params.id, payload.enabled)));
  });

  fastify.get("/renewals/calendar", async (request, reply) => {
    const auth = requireAuth(request);
    return reply.status(200).send(toSuccess(getRenewalCalendar(auth.user.id)));
  });
};
