"use client";

import { AppHeader } from "@/components/app-header";
import { StatusBadge } from "@/components/status-badge";
import {
  ClientError,
  completeCancellation,
  getCancellationCenter,
  startCancellation,
} from "@/lib/api";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { useSessionHydrated, useSessionStore } from "@/lib/session-store";
import type { CancellationCenterItem } from "@/lib/types";
import { CircleCheckBig, LoaderCircle, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const riskTone = (risk: CancellationCenterItem["riskLevel"]): "emerald" | "amber" | "rose" => {
  if (risk === "high") {
    return "rose";
  }
  if (risk === "medium") {
    return "amber";
  }
  return "emerald";
};

const stateTone = (state: CancellationCenterItem["state"]): "slate" | "amber" | "emerald" => {
  if (state === "in-progress") {
    return "amber";
  }
  if (state === "completed") {
    return "emerald";
  }
  return "slate";
};

export default function CancellationsPage() {
  const router = useRouter();
  const isSessionHydrated = useSessionHydrated();
  const token = useSessionStore((state) => state.token);
  const clearSession = useSessionStore((state) => state.clearSession);

  const [items, setItems] = useState<CancellationCenterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);

  const loadCenter = useCallback(async () => {
    if (!token) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getCancellationCenter(token);
      setItems(response);
    } catch (requestError) {
      if (requestError instanceof ClientError && requestError.statusCode === 401) {
        clearSession();
        router.replace("/auth");
        return;
      }
      setError("Could not load cancellation center.");
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
    void loadCenter();
  }, [isSessionHydrated, token, loadCenter, router]);

  const handleAction = async (item: CancellationCenterItem) => {
    if (!token || item.state === "completed") {
      return;
    }

    setActionId(item.subscriptionId);
    setError(null);

    try {
      if (item.state === "not-started") {
        await startCancellation(token, item.subscriptionId);
      } else {
        await completeCancellation(token, item.subscriptionId);
      }
      await loadCenter();
    } catch (requestError) {
      if (requestError instanceof ClientError && requestError.statusCode === 401) {
        clearSession();
        router.replace("/auth");
        return;
      }
      setError("Could not update cancellation state.");
    } finally {
      setActionId(null);
    }
  };

  if (!isSessionHydrated || !token) {
    return null;
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-8 md:py-10">
      <AppHeader
        title="Cancellation Center"
        subtitle="Screen 10: move every risky subscription through a guided cancel workflow with clear progress and next action."
        rightSlot={
          <>
            <button className="cta-secondary" onClick={() => void loadCenter()} type="button">
              Refresh
            </button>
            <Link className="cta-primary" href="/dashboard">
              Dashboard
            </Link>
          </>
        }
      />

      {error ? <p className="glass-card rounded-xl px-4 py-3 text-sm text-rose-300">{error}</p> : null}

      <section className="glass-card reveal p-6" style={{ animationDelay: "100ms" }}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Screen 10 - Cancellation Center</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-100">Guided Cancellation Queue</h2>
          </div>
          <StatusBadge label={`${items.filter((item) => item.state !== "completed").length} pending`} tone="amber" />
        </div>

        <div className="mt-5 grid gap-4">
          {items.map((item, index) => (
            <article
              key={item.cancellationId}
              className="surface-muted reveal p-4"
              style={{ animationDelay: `${160 + index * 70}ms` }}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-slate-100">{item.merchant}</h3>
                    <StatusBadge label={item.riskLevel} tone={riskTone(item.riskLevel)} />
                    <StatusBadge label={item.state} tone={stateTone(item.state)} />
                  </div>
                  <p className="text-sm text-slate-300">
                    {formatCurrency(item.amount)} · Method: {item.method} · Requested: {formatDateTime(item.requestedAt)}
                  </p>
                  <p className="text-sm text-slate-200">Next action: {item.nextAction}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link className="cta-secondary" href={`/subscriptions/${item.subscriptionId}`}>
                    Open Detail
                  </Link>
                  <button
                    className="cta-primary"
                    disabled={item.state === "completed" || actionId === item.subscriptionId}
                    onClick={() => void handleAction(item)}
                    type="button"
                  >
                    {actionId === item.subscriptionId ? (
                      <>
                        <LoaderCircle className="animate-spin" size={16} />
                        Saving
                      </>
                    ) : item.state === "not-started" ? (
                      <>
                        <ShieldAlert size={16} />
                        Start Flow
                      </>
                    ) : item.state === "in-progress" ? (
                      <>
                        <CircleCheckBig size={16} />
                        Mark Completed
                      </>
                    ) : (
                      "Completed"
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <span>Progress</span>
                  <span>{item.progressPercent}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800/90">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all"
                    style={{ width: `${item.progressPercent}%` }}
                  />
                </div>
              </div>

              <ol className="mt-4 grid gap-2 text-sm text-slate-300 md:grid-cols-3">
                {item.steps.map((step) => (
                  <li key={step} className="rounded-lg border border-slate-700/60 bg-slate-900/60 px-3 py-2">
                    {step}
                  </li>
                ))}
              </ol>
            </article>
          ))}

          {!loading && items.length === 0 ? (
            <p className="rounded-lg bg-slate-900/70 px-3 py-2 text-sm text-slate-300">No cancellation tasks right now.</p>
          ) : null}
        </div>
      </section>
    </main>
  );
}
