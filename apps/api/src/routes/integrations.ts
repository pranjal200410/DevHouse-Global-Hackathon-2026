import type { FastifyInstance } from "fastify";
import {
  appendProofEvent,
  getProofEvents,
  upsertDetectedSubscriptions,
} from "../data/demoState";
import { requireAuth } from "../lib/auth";
import { AppError, toSuccess } from "../lib/http";
import { inboxSyncPayloadSchema, proofLogQuerySchema, subscriptionParamsSchema } from "../lib/schemas";
import { syncInboxDetections } from "../lib/inboxIntegration";
import { parseOrThrow } from "../lib/validation";
import { detectCandidatesFromCSV } from "../lib/csvParser";

const generateDisputeDraft = (
  disputeId: string,
  merchant: string,
  amount: number,
  reason: string,
  incidentDate: string,
): { draft: string; claimId: string } => {
  const claimId = `claim_${Date.now()}`;
  const draft = [
    "CHARGEBACK/DISPUTE CLAIM LETTER",
    "=".repeat(50),
    "",
    `Generated: ${new Date().toLocaleDateString()}`,
    `Dispute ID: ${disputeId}`,
    `Claim Reference: ${claimId}`,
    "",
    "ISSUE SUMMARY",
    "-".repeat(50),
    `Merchant: ${merchant}`,
    `Amount: $${amount.toFixed(2)}`,
    `Date of Charge: ${new Date(incidentDate).toLocaleDateString()}`,
    `Reason: ${reason}`,
    "",
    "CLAIM DETAILS",
    "-".repeat(50),
    `I am disputing the charge of $${amount.toFixed(2)} from ${merchant} on ${new Date(incidentDate).toLocaleDateString()}.`,
    `Reason for dispute: ${reason}`,
    "",
    "REQUESTED ACTION",
    "-".repeat(50),
    `I request that the full amount of $${amount.toFixed(2)} be credited back to my account.`,
    "Please investigate this matter and confirm receipt of this dispute within 10 business days.",
    "",
    "SUPPORTING EVIDENCE",
    "-".repeat(50),
    "- Email records from SubGuard showing transaction history",
    "- Screenshots of subscription account status",
    "- Cancellation attempt evidence (if applicable)",
    "- Previous correspondence with merchant (if available)",
    "",
  ].join("\n");

  return { draft, claimId };
};

export const registerIntegrationRoutes = (fastify: FastifyInstance): void => {
  fastify.post("/integrations/inbox/sync", async (request, reply) => {
    const auth = requireAuth(request);
    const payload = parseOrThrow(inboxSyncPayloadSchema, request.body ?? {}, "inbox sync payload");

    const sync = await syncInboxDetections(payload.maxMessages ?? 100);

    appendProofEvent(auth.user.id, {
      type: "inbox-sync",
      status: sync.errors.length > 0 ? "failure" : "success",
      subscriptionId: null,
      merchant: null,
      details: {
        source: sync.source,
        startedAt: sync.startedAt,
        finishedAt: sync.finishedAt,
        processedMessages: sync.processedMessages,
        detectionCount: sync.detections.length,
        errors: sync.errors,
      },
    });

    const upserted = upsertDetectedSubscriptions(auth.user.id, sync.candidates);

    for (const detected of upserted.subscriptions) {
      appendProofEvent(auth.user.id, {
        type: "subscription-detected",
        status: "success",
        subscriptionId: detected.id,
        merchant: detected.merchant,
        details: {
          amount: detected.amount,
          nextRenewalDate: detected.nextRenewalDate,
          cancellationUrl: detected.cancellationUrl,
          source: sync.source,
        },
      });
    }

    return reply.status(200).send(
      toSuccess({
        source: sync.source,
        startedAt: sync.startedAt,
        finishedAt: sync.finishedAt,
        processedMessages: sync.processedMessages,
        importedCount: upserted.importedCount,
        detections: sync.detections,
        errors: sync.errors,
      }),
    );
  });

  fastify.get("/integrations/proof-log", async (request, reply) => {
    const auth = requireAuth(request);
    const query = parseOrThrow(proofLogQuerySchema, request.query ?? {}, "proof log query");
    return reply.status(200).send(toSuccess(getProofEvents(auth.user.id, query.limit ?? 100)));
  });

  fastify.post("/integrations/statement/import", async (request, reply) => {
    const auth = requireAuth(request);
    const payload = request.body as { csvContent?: string } ?? {};

    if (!payload.csvContent) {
      throw new AppError(400, "MISSING_CSV", "CSV content is required.");
    }

    try {
      const candidates = detectCandidatesFromCSV(payload.csvContent);

      appendProofEvent(auth.user.id, {
        type: "inbox-sync",
        status: candidates.length > 0 ? "success" : "info",
        subscriptionId: null,
        merchant: null,
        details: {
          source: "csv-statement-import",
          startedAt: new Date().toISOString(),
          finishedAt: new Date().toISOString(),
          processedMessages: 1,
          detectionCount: candidates.length,
          errors: [],
        },
      });

      const upserted = upsertDetectedSubscriptions(auth.user.id, candidates);

      for (const detected of upserted.subscriptions) {
        appendProofEvent(auth.user.id, {
          type: "subscription-detected",
          status: "success",
          subscriptionId: detected.id,
          merchant: detected.merchant,
          details: {
            amount: detected.amount,
            nextRenewalDate: detected.nextRenewalDate,
            cancellationUrl: detected.cancellationUrl,
            source: "csv-statement-import",
          },
        });
      }

      return reply.status(200).send(
        toSuccess({
          source: "csv-statement-import",
          importedCount: upserted.importedCount,
          detections: candidates,
          totalNewSubscriptions: upserted.subscriptions.length,
        }),
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "CSV import failed";
      throw new AppError(400, "CSV_IMPORT_ERROR", message);
    }
  });

  fastify.post("/integrations/dispute-draft/:id", async (request, reply) => {
    const auth = requireAuth(request);
    const params = parseOrThrow(subscriptionParamsSchema, request.params ?? {}, "dispute params");
    const payload = (request.body as { merchant?: string; amount?: number; reason?: string; incidentDate?: string }) ?? {};

    const draft = generateDisputeDraft(
      params.id,
      payload.merchant ?? "Unknown Merchant",
      payload.amount ?? 0,
      payload.reason ?? "Unauthorized recurring charge",
      payload.incidentDate ?? new Date().toISOString(),
    );

    appendProofEvent(auth.user.id, {
      type: "dispute-draft-generated",
      status: "success",
      subscriptionId: params.id,
      merchant: payload.merchant ?? null,
      details: {
        claimId: draft.claimId,
        amount: payload.amount ?? 0,
        reason: payload.reason ?? null,
      },
    });

    return reply.status(200).send(toSuccess(draft));
  });
};
