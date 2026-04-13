"use client";

import { AppHeader } from "@/components/app-header";
import { MetricCard } from "@/components/metric-card";
import { StatusBadge } from "@/components/status-badge";
import { ClientError, getDisputeStudio } from "@/lib/api";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { useSessionStore } from "@/lib/session-store";
import type { DisputeStudioItem, DisputeStudioPayload } from "@/lib/types";
import { CircleDollarSign, FileCheck2, ShieldAlert, Scale } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const statusTone = (status: DisputeStudioItem["status"]): "slate" | "amber" | "emerald" | "rose" => {
  if (status === "submitted") {
    return "amber";
  }
  if (status === "won") {
    return "emerald";
  }
  if (status === "lost") {
    return "rose";
  }
  return "slate";
};

const riskTone = (risk: DisputeStudioItem["riskLevel"]): "emerald" | "amber" | "rose" => {
  if (risk === "high") {
    return "rose";
  }
  if (risk === "medium") {
    return "amber";
  }
  return "emerald";
};

export default function DisputesPage() {
  const router = useRouter();
  const token = useSessionStore((state) => state.token);
  const clearSession = useSessionStore((state) => state.clearSession);

  const [payload, setPayload] = useState<DisputeStudioPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDisputes = useCallback(async () => {
    if (!token) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getDisputeStudio(token);
      setPayload(response);
    } catch (requestError) {
      if (requestError instanceof ClientError && requestError.statusCode === 401) {
        clearSession();
        router.replace("/auth");
        return;
      }

      setError("Could not load dispute studio.");
    } finally {
      setLoading(false);
    }
  }, [token, clearSession, router]);

  useEffect(() => {
    if (!token) {
      router.replace("/auth");
      return;
    }

    void loadDisputes();
  }, [token, loadDisputes, router]);

  if (!token) {
    return null;
  }

  const summary = payload?.summary;
  const disputes = payload?.disputes ?? [];

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-8 md:py-10">
      <AppHeader
        title="Dispute Studio"
        subtitle="Screen 12: track dispute evidence readiness, action priority, and submission status in one queue."
        rightSlot={
          <>
            <button className="cta-secondary" onClick={() => void loadDisputes()} type="button">
              Refresh
            </button>
            <Link className="cta-primary" href="/alerts">
              Alerts Feed
            </Link>
          </>
        }
      />

      {error ? <p className="glass-card rounded-xl px-4 py-3 text-sm text-rose-300">{error}</p> : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Open Disputes"
          value={summary ? String(summary.openDisputes) : loading ? "..." : "0"}
          helper="Draft and submitted records"
          icon={<Scale size={18} />}
        />
        <MetricCard
          label="Disputed Amount"
          value={summary ? formatCurrency(summary.totalDisputedAmount) : loading ? "..." : "$0.00"}
          helper="Total value currently in review"
          icon={<CircleDollarSign size={18} />}
        />
        <MetricCard
          label="High Priority"
          value={summary ? String(summary.highPriorityDisputes) : loading ? "..." : "0"}
          helper="High-risk disputes needing action"
          icon={<ShieldAlert size={18} />}
        />
        <MetricCard
          label="Evidence Ready"
          value={summary ? String(summary.evidenceReadyDisputes) : loading ? "..." : "0"}
          helper="Disputes with complete checklist"
          icon={<FileCheck2 size={18} />}
        />
      </section>

      <section className="glass-card reveal p-6" style={{ animationDelay: "100ms" }}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Screen 12 - Dispute Studio + Settings</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-100">Evidence Queue</h2>
          </div>
          <StatusBadge
            label={`${disputes.filter((dispute) => dispute.status === "submitted").length} submitted`}
            tone="amber"
          />
        </div>

        <div className="mt-5 grid gap-4">
          {disputes.map((dispute, index) => (
            <article
              key={dispute.disputeId}
              className="surface-muted reveal p-4"
              style={{ animationDelay: `${140 + index * 60}ms` }}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-slate-100">{dispute.merchant}</h3>
                    <StatusBadge label={dispute.status} tone={statusTone(dispute.status)} />
                    <StatusBadge label={dispute.riskLevel} tone={riskTone(dispute.riskLevel)} />
                  </div>
                  <p className="mt-2 text-sm text-slate-300">
                    {formatCurrency(dispute.amount)} disputed on {formatDateTime(dispute.incidentDate)}
                  </p>
                  <p className="mt-2 text-sm text-slate-200">Reason: {dispute.reason}</p>
                  <p className="mt-2 text-sm text-slate-300">Recommended action: {dispute.recommendedAction}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Link className="cta-secondary" href={`/subscriptions/${dispute.subscriptionId}`}>
                    Open Detail
                  </Link>
                </div>
              </div>

              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <span>Evidence readiness</span>
                  <span>{dispute.evidenceProgressPercent}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800/90">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all"
                    style={{ width: `${dispute.evidenceProgressPercent}%` }}
                  />
                </div>
              </div>

              <ul className="mt-4 grid gap-2 text-sm text-slate-300 md:grid-cols-2">
                {dispute.checklist.map((item) => (
                  <li
                    key={`${dispute.disputeId}-${item.label}`}
                    className="rounded-lg border border-slate-700/60 bg-slate-900/60 px-3 py-2"
                  >
                    <span className={item.done ? "text-emerald-200" : "text-amber-200"}>
                      {item.done ? "Done" : "Pending"}
                    </span>
                    {" · "}
                    {item.label}
                  </li>
                ))}
              </ul>
            </article>
          ))}

          {!loading && disputes.length === 0 ? (
            <p className="rounded-lg bg-slate-900/70 px-3 py-2 text-sm text-slate-300">No disputes currently tracked.</p>
          ) : null}
        </div>
      </section>
    </main>
  );
}
