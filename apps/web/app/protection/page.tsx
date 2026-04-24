"use client";

import { AppHeader } from "@/components/app-header";
import { MetricCard } from "@/components/metric-card";
import { StatusBadge } from "@/components/status-badge";
import {
  ClientError,
  getProtectionControls,
  updateProtectionControl,
} from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/format";
import { useSessionHydrated, useSessionStore } from "@/lib/session-store";
import type { ProtectionControlItem, ProtectionControlsPayload } from "@/lib/types";
import { Lock, ShieldAlert, ShieldCheck, Timer } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const riskTone = (risk: ProtectionControlItem["riskLevel"]): "emerald" | "amber" | "rose" => {
  if (risk === "high") {
    return "rose";
  }
  if (risk === "medium") {
    return "amber";
  }
  return "emerald";
};

const statusTone = (status: ProtectionControlItem["status"]): "blue" | "amber" | "slate" => {
  if (status === "active") {
    return "blue";
  }
  if (status === "canceling") {
    return "amber";
  }
  return "slate";
};

export default function ProtectionControlsPage() {
  const router = useRouter();
  const isSessionHydrated = useSessionHydrated();
  const token = useSessionStore((state) => state.token);
  const clearSession = useSessionStore((state) => state.clearSession);

  const [payload, setPayload] = useState<ProtectionControlsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const loadControls = useCallback(async () => {
    if (!token) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getProtectionControls(token);
      setPayload(response);
    } catch (requestError) {
      if (requestError instanceof ClientError && requestError.statusCode === 401) {
        clearSession();
        router.replace("/auth");
        return;
      }
      setError("Could not load protection controls.");
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
    void loadControls();
  }, [isSessionHydrated, token, loadControls, router]);

  const handleToggle = async (item: ProtectionControlItem) => {
    if (!token) {
      return;
    }

    setSavingId(item.subscriptionId);
    setError(null);

    try {
      const response = await updateProtectionControl(token, item.subscriptionId, !item.autoBlockEnabled);
      setPayload(response);
    } catch (requestError) {
      if (requestError instanceof ClientError && requestError.statusCode === 401) {
        clearSession();
        router.replace("/auth");
        return;
      }
      setError("Could not update protection setting.");
    } finally {
      setSavingId(null);
    }
  };

  if (!isSessionHydrated || !token) {
    return null;
  }

  const summary = payload?.summary;
  const controls = payload?.controls ?? [];

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-8 md:py-10">
      <AppHeader
        title="Subscription Tracking"
        subtitle="Enable tracking on subscriptions to capture comprehensive evidence if you need to file disputes or prove unauthorized charges."
        rightSlot={
          <>
            <button className="cta-secondary" onClick={() => void loadControls()} type="button">
              Refresh
            </button>
            <Link className="cta-primary" href="/alerts">
              View Alerts
            </Link>
          </>
        }
      />

      {error ? <p className="glass-card rounded-xl px-4 py-3 text-sm text-rose-300">{error}</p> : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Tracked Subscriptions"
          value={summary ? String(summary.totalTracked) : loading ? "..." : "0"}
          helper="Subscriptions eligible for protection"
          icon={<Lock size={18} />}
        />
        <MetricCard
          label="Active Protections"
          value={summary ? String(summary.activeProtections) : loading ? "..." : "0"}
          helper="Auto-block currently enabled"
          icon={<ShieldCheck size={18} />}
        />
        <MetricCard
          label="High Risk Unprotected"
          value={summary ? String(summary.highRiskUnprotected) : loading ? "..." : "0"}
          helper="Immediate action recommended"
          icon={<ShieldAlert size={18} />}
        />
        <MetricCard
          label="Next Protected Renewal"
          value={summary ? formatDate(summary.nextProtectedRenewal) : loading ? "..." : "N/A"}
          helper="Earliest covered upcoming charge"
          icon={<Timer size={18} />}
        />
      </section>

      <section className="glass-card reveal p-6" style={{ animationDelay: "100ms" }}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Screen 11 - Subscription Tracking</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-100">Enable Tracking for Dispute Evidence</h2>
          </div>
          <StatusBadge
            label={`${controls.filter((item) => item.autoBlockEnabled).length} active`}
            tone="emerald"
          />
        </div>

        <div className="mt-5 grid gap-3">
          {controls.map((item, index) => (
            <article
              key={item.subscriptionId}
              className="surface-muted reveal flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between"
              style={{ animationDelay: `${140 + index * 60}ms` }}
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold text-slate-100">{item.merchant}</h3>
                  <StatusBadge label={item.riskLevel} tone={riskTone(item.riskLevel)} />
                  <StatusBadge label={item.status} tone={statusTone(item.status)} />
                  <StatusBadge
                    label={item.autoBlockEnabled ? "Protected" : "Unprotected"}
                    tone={item.autoBlockEnabled ? "emerald" : "amber"}
                  />
                </div>
                <p className="mt-2 text-sm text-slate-300">
                  {formatCurrency(item.amount)} · Renewal {formatDate(item.nextRenewalDate)}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Link className="cta-secondary" href={`/subscriptions/${item.subscriptionId}`}>
                  View Detail
                </Link>
                <button
                  className="cta-primary"
                  disabled={savingId === item.subscriptionId}
                  onClick={() => void handleToggle(item)}
                  type="button"
                >
                  {savingId === item.subscriptionId
                    ? "Saving..."
                    : item.autoBlockEnabled
                      ? "Disable Auto-Block"
                      : "Enable Auto-Block"}
                </button>
              </div>
            </article>
          ))}

          {!loading && controls.length === 0 ? (
            <p className="rounded-lg bg-slate-900/70 px-3 py-2 text-sm text-slate-300">No protection controls found.</p>
          ) : null}
        </div>
      </section>
    </main>
  );
}
