import type { FastifyInstance } from "fastify";
import {
  appendProofEvent,
  completeCancellation,
  getRenewalCalendar,
  getSubscriptionDetail,
  listSubscriptions,
  setAutoBlock,
  startCancellation,
} from "../data/demoState";
import { sendCancellationOutreach } from "../lib/cancellationOutreach";
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
    const detail = startCancellation(auth.user.id, params.id);

    if (detail.subscription.cancelMethod === "email") {
      const outreach = await sendCancellationOutreach(auth.user, detail.subscription);
      appendProofEvent(auth.user.id, {
        type: "cancellation-outreach",
        status: outreach.status === "sent" ? "success" : outreach.status === "failed" ? "failure" : "info",
        subscriptionId: detail.subscription.id,
        merchant: detail.subscription.merchant,
        details: {
          attemptedAt: outreach.attemptedAt,
          recipient: outreach.recipient,
          messageId: outreach.messageId,
          previewUrl: outreach.previewUrl,
          error: outreach.error,
        },
      });

      if (outreach.status === "sent") {
        setAutoBlock(auth.user.id, params.id, true);
        appendProofEvent(auth.user.id, {
          type: "auto-block-update",
          status: "success",
          subscriptionId: detail.subscription.id,
          merchant: detail.subscription.merchant,
          details: {
            enabled: true,
            reason: "Enabled automatically after successful email outreach.",
          },
        });
      }

      return reply.status(200).send(toSuccess(getSubscriptionDetail(auth.user.id, params.id)));
    }

    return reply.status(200).send(toSuccess(detail));
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
