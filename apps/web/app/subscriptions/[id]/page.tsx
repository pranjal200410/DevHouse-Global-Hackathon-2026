"use client";

import { AppHeader } from "@/components/app-header";
import { StatusBadge } from "@/components/status-badge";
import {
  ClientError,
  completeCancellation,
  getSubscriptionDetail,
  setAutoBlock,
  startCancellation,
} from "@/lib/api";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/format";
import { useSessionHydrated, useSessionStore } from "@/lib/session-store";
import type { SubscriptionDetail } from "@/lib/types";
import { AlertTriangle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const getToneByRisk = (risk: "low" | "medium" | "high"): "emerald" | "amber" | "rose" => {
  if (risk === "high") {
    return "rose";
  }
  if (risk === "medium") {
    return "amber";
  }
  return "emerald";
};

export default function SubscriptionDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();

  const isSessionHydrated = useSessionHydrated();
  const token = useSessionStore((state) => state.token);
  const clearSession = useSessionStore((state) => state.clearSession);

  const subscriptionId = params.id;

  const [detail, setDetail] = useState<SubscriptionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<"cancel" | "complete" | "block" | null>(null);

  const intentParam = searchParams.get("intent");
  const planIntent = intentParam === "cancel" || intentParam === "switch" || intentParam === "downgrade" ? intentParam : null;

  const loadDetail = useCallback(async () => {
    if (!token) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getSubscriptionDetail(token, subscriptionId);
      setDetail(response);
    } catch (requestError) {
      if (requestError instanceof ClientError && requestError.statusCode === 401) {
        clearSession();
        router.replace("/auth");
        return;
      }

      setError("Could not load subscription detail.");
    } finally {
      setLoading(false);
    }
  }, [token, subscriptionId, clearSession, router]);

  useEffect(() => {
    if (!isSessionHydrated) {
      return;
    }

    if (!token) {
      router.replace("/auth");
      return;
    }
    void loadDetail();
  }, [isSessionHydrated, token, loadDetail, router]);

  const runAction = async (
    action: "cancel" | "complete" | "block",
    runner: () => Promise<SubscriptionDetail>,
  ) => {
    if (!token) {
      return;
    }

    setActionLoading(action);
    setError(null);
    try {
      const updated = await runner();
      setDetail(updated);
    } catch (requestError) {
      if (requestError instanceof ClientError && requestError.statusCode === 401) {
        clearSession();
        router.replace("/auth");
        return;
      }

      setError("Action failed. Please retry.");
    } finally {
      setActionLoading(null);
    }
  };

  if (!isSessionHydrated || !token) {
    return null;
  }

  const blockEnabled = detail?.blockRule?.enabled ?? false;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-8 md:py-10">
      <AppHeader
        title={detail?.subscription.merchant ?? "Subscription Detail"}
        subtitle="View full billing history, plan disputes, and capture proof of actions taken for evidence."
        rightSlot={
          <>
            <Link className="cta-secondary" href="/dashboard">
              Back to Dashboard
            </Link>
            <Link className="cta-primary" href="/renewals">
              Calendar
            </Link>
          </>
        }
      />

      {error ? <p className="glass-card rounded-xl px-4 py-3 text-sm text-rose-300">{error}</p> : null}

      <section className="grid gap-4 md:grid-cols-[1.25fr_1fr]">
        <article className="glass-card reveal p-6" style={{ animationDelay: "80ms" }}>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Screen 8 - Subscription Detail</p>

          {loading || !detail ? (
            <p className="mt-4 text-sm text-slate-300">Loading detail...</p>
          ) : (
            <>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <StatusBadge label={detail.subscription.riskLevel} tone={getToneByRisk(detail.subscription.riskLevel)} />
                <StatusBadge
                  label={detail.subscription.status}
                  tone={detail.subscription.status === "active" ? "blue" : detail.subscription.status === "canceling" ? "amber" : "slate"}
                />
                {detail.blockRule?.enabled ? <StatusBadge label="Auto-block active" tone="emerald" /> : null}
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <div className="surface-muted p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Amount</p>
                  <p className="mt-1 text-2xl font-bold text-slate-100">{formatCurrency(detail.subscription.amount)}</p>
                </div>
                <div className="surface-muted p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Next renewal</p>
                  <p className="mt-1 text-lg font-semibold text-slate-100">{formatDate(detail.subscription.nextRenewalDate)}</p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  id="cancel-actions"
                  className="cta-secondary"
                  disabled={actionLoading !== null || !detail.actions.canCancel}
                  onClick={() =>
                    void runAction("cancel", () => startCancellation(token, detail.subscription.id))
                  }
                  type="button"
                >
                  {actionLoading === "cancel" ? "Starting..." : "Guide: Start Cancellation"}
                </button>

                <button
                  className="cta-secondary"
                  disabled={actionLoading !== null || !detail.actions.canCancel}
                  onClick={() =>
                    void runAction("complete", () => completeCancellation(token, detail.subscription.id))
                  }
                  type="button"
                >
                  {actionLoading === "complete" ? "Saving proof..." : "Log: Cancellation Completed"}
                </button>

                <button
                  className="cta-primary"
                  disabled={actionLoading !== null || !detail.actions.canBlock}
                  onClick={() =>
                    void runAction("block", () => setAutoBlock(token, detail.subscription.id, !blockEnabled))
                  }
                  type="button"
                >
                  {actionLoading === "block"
                    ? "Saving..."
                    : blockEnabled
                      ? "Disable Tracking"
                      : "Enable Tracking"}
                </button>
              </div>

              {planIntent ? (
                <div id="plan-action" className="surface-muted mt-5 p-4">
                  <p className="text-sm font-semibold text-slate-100">Guided Action</p>
                  <p className="mt-1 text-sm text-slate-300">
                    {planIntent === "switch"
                      ? "To reduce this charge: Open the provider's billing portal (link below), select a lower-cost plan or equivalent service, and confirm the change. Return here to log proof of the action."
                      : planIntent === "downgrade"
                        ? "To reduce this charge: Open the provider's billing portal (link below), downgrade to a lower tier, and confirm. Return here to document the change as proof you took action."
                        : "To stop this charge: Click 'Start Cancellation' below to initiate. Follow the provider's cancellation process, then click 'Mark as Completed' once you have confirmation. We'll capture proof of cancellation for your records."}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {planIntent === "cancel" ? (
                      <a className="cta-secondary" href="#cancel-actions">
                        View Cancellation Steps
                      </a>
                    ) : (
                      <a className="cta-primary" href={detail.subscription.cancellationUrl} rel="noopener noreferrer" target="_blank">
                        Open Provider Portal
                      </a>
                    )}
                    <Link className="cta-secondary" href="/disputes">
                      Go to Evidence Capture
                    </Link>
                  </div>
                </div>
              ) : null}

              {detail.cancellation ? (
                <div className="surface-muted mt-5 p-4">
                  <p className="text-sm font-semibold text-slate-100">Cancellation progress</p>
                  <p className="mt-1 text-sm text-slate-300">State: {detail.cancellation.state}</p>
                  <p className="mt-1 text-sm text-slate-300">Next action: {detail.cancellation.nextAction}</p>
                  <ol className="mt-3 space-y-2 text-sm text-slate-200">
                    {detail.cancellation.steps.map((step) => (
                      <li key={step} className="flex items-start gap-2">
                        <span className="mt-1 inline-flex size-5 items-center justify-center rounded-full bg-slate-900 text-[11px] font-bold text-slate-200">
                          •
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              ) : null}
            </>
          )}
        </article>

        <aside className="space-y-4">
          <article className="glass-card reveal p-5" style={{ animationDelay: "130ms" }}>
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-emerald-600" size={18} />
              <h3 className="text-lg font-semibold text-slate-100">Renewal History</h3>
            </div>

            <div className="mt-4 space-y-3">
              {detail?.history.map((event) => (
                <div key={event.id} className="surface-muted p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-100">{formatDateTime(event.date)}</p>
                    <StatusBadge
                      label={event.status}
                      tone={event.status === "charged" ? "blue" : event.status === "blocked" ? "emerald" : "rose"}
                    />
                  </div>
                  <p className="mt-1 text-sm text-slate-300">
                    {formatCurrency(event.amount)} · {event.note}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <article className="glass-card reveal p-5" style={{ animationDelay: "180ms" }}>
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-amber-500" size={18} />
              <h3 className="text-lg font-semibold text-slate-100">Dispute Evidence</h3>
            </div>

            <div className="mt-4 space-y-3">
              {detail?.disputes.length ? (
                detail.disputes.map((dispute) => (
                  <div key={dispute.id} className="surface-muted p-3">
                    <p className="text-sm font-semibold text-slate-100">{formatDateTime(dispute.incidentDate)}</p>
                    <p className="mt-1 text-sm text-slate-300">
                      {formatCurrency(dispute.amount)} · {dispute.reason}
                    </p>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Status: {dispute.status}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-300">No disputes recorded for this subscription.</p>
              )}
            </div>
          </article>
        </aside>
      </section>
    </main>
  );
}
