"use client";

import { AppHeader } from "@/components/app-header";
import { MetricCard } from "@/components/metric-card";
import { StatusBadge } from "@/components/status-badge";
import { ClientError, getAlertsFeed } from "@/lib/api";
import { formatDateTime } from "@/lib/format";
import { useSessionHydrated, useSessionStore } from "@/lib/session-store";
import type { AlertFeedItem } from "@/lib/types";
import { AlertTriangle, BellRing, ShieldAlert, Siren } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

const severityTone = (severity: AlertFeedItem["severity"]): "emerald" | "amber" | "rose" => {
  if (severity === "high") {
    return "rose";
  }
  if (severity === "medium") {
    return "amber";
  }
  return "emerald";
};

const typeLabel: Record<AlertFeedItem["type"], string> = {
  "renewal-risk": "Renewal Risk",
  "blocked-charge": "Blocked Charge",
  dispute: "Dispute",
  "cancellation-followup": "Cancellation Follow-up",
};

export default function AlertsFeedPage() {
  const router = useRouter();
  const isSessionHydrated = useSessionHydrated();
  const token = useSessionStore((state) => state.token);
  const clearSession = useSessionStore((state) => state.clearSession);

  const [alerts, setAlerts] = useState<AlertFeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAlerts = useCallback(async () => {
    if (!token) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getAlertsFeed(token);
      setAlerts(response);
    } catch (requestError) {
      if (requestError instanceof ClientError && requestError.statusCode === 401) {
        clearSession();
        router.replace("/auth");
        return;
      }
      setError("Could not load alerts feed.");
    } finally {
      setLoading(false);
    }
  }, [token, clearSession, router]);

  useEffect(() => {
    if (!isSessionHydrated) {
      return;
    }

    if (!token) {
      router.replace("/auth");
      return;
    }
    void loadAlerts();
  }, [isSessionHydrated, token, loadAlerts, router]);

  const counts = useMemo(
    () => ({
      total: alerts.length,
      high: alerts.filter((alert) => alert.severity === "high").length,
      followups: alerts.filter((alert) => alert.type === "cancellation-followup").length,
    }),
    [alerts],
  );

  if (!isSessionHydrated || !token) {
    return null;
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-8 md:py-10">
      <AppHeader
        title="Alerts & Incident Feed"
        subtitle="Screen 13: severity-coded timeline of operational notifications with clear action guidance."
        rightSlot={
          <>
            <button className="cta-secondary" onClick={() => void loadAlerts()} type="button">
              Refresh
            </button>
            <Link className="cta-primary" href="/protection">
              Protection Controls
            </Link>
          </>
        }
      />

      {error ? <p className="glass-card rounded-xl px-4 py-3 text-sm text-rose-300">{error}</p> : null}

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Open Alerts"
          value={loading ? "..." : String(counts.total)}
          helper="Current notifications in timeline"
          icon={<BellRing size={18} />}
        />
        <MetricCard
          label="High Severity"
          value={loading ? "..." : String(counts.high)}
          helper="Immediate action required"
          icon={<Siren size={18} />}
        />
        <MetricCard
          label="Cancellation Follow-ups"
          value={loading ? "..." : String(counts.followups)}
          helper="In-progress workflows to complete"
          icon={<ShieldAlert size={18} />}
        />
      </section>

      <section className="glass-card reveal p-6" style={{ animationDelay: "100ms" }}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Screen 13 - Alerts Feed</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-100">Incident Timeline</h2>
          </div>
          <StatusBadge label={`${counts.high} critical`} tone={counts.high > 0 ? "rose" : "emerald"} />
        </div>

        <div className="mt-5 grid gap-3">
          {alerts.map((alert, index) => (
            <article
              key={alert.id}
              className="surface-muted reveal p-4"
              style={{ animationDelay: `${140 + index * 50}ms` }}
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-slate-100">{alert.title}</h3>
                    <StatusBadge label={alert.severity} tone={severityTone(alert.severity)} />
                    <StatusBadge label={typeLabel[alert.type]} tone="slate" />
                  </div>
                  <p className="mt-2 text-sm text-slate-300">{alert.message}</p>
                  <p className="mt-2 text-xs uppercase tracking-wide text-slate-400">{formatDateTime(alert.occurredAt)}</p>
                </div>

                <Link className="cta-primary" href={alert.actionHref}>
                  {alert.actionLabel}
                </Link>
              </div>
            </article>
          ))}

          {!loading && alerts.length === 0 ? (
            <p className="rounded-lg bg-slate-900/70 px-3 py-2 text-sm text-slate-300">No alerts at the moment.</p>
          ) : null}

          {loading ? (
            <p className="rounded-lg bg-slate-900/70 px-3 py-2 text-sm text-slate-300">Loading alerts...</p>
          ) : null}
        </div>

        <div className="mt-5 rounded-lg border border-amber-300/20 bg-amber-500/10 p-3 text-sm text-amber-100">
          <div className="flex items-center gap-2 font-semibold">
            <AlertTriangle size={15} />
            Action guidance
          </div>
          <p className="mt-1 text-amber-100/90">
            Prioritize high severity renewal and dispute alerts first, then resolve cancellation follow-ups before the next billing cycle.
          </p>
        </div>
      </section>
    </main>
  );
}
