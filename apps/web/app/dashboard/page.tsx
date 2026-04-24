"use client";

import { AppHeader } from "@/components/app-header";
import { MetricCard } from "@/components/metric-card";
import { StatusBadge } from "@/components/status-badge";
import { StatementImporter } from "@/components/StatementImporter";
import {
  ClientError,
  getDashboardSummary,
  getSavingsOpportunities,
  getSubscriptions,
  logoutSession,
} from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/format";
import { useSessionHydrated, useSessionStore } from "@/lib/session-store";
import type { DashboardSummary, SavingsOpportunity, Subscription } from "@/lib/types";
import { CalendarClock, PiggyBank, ShieldAlert, Sparkles, Wallet } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const getRiskTone = (risk: Subscription["riskLevel"]): "emerald" | "amber" | "rose" => {
  if (risk === "high") {
    return "rose";
  }
  if (risk === "medium") {
    return "amber";
  }
  return "emerald";
};

const getStatusTone = (status: Subscription["status"]): "blue" | "amber" | "slate" => {
  if (status === "active") {
    return "blue";
  }
  if (status === "canceling") {
    return "amber";
  }
  return "slate";
};

const getRiskBandTone = (
  riskBand: DashboardSummary["riskBand"],
): {
  label: string;
  tone: "emerald" | "amber" | "rose";
} => {
  if (riskBand === "critical") {
    return { label: "Critical", tone: "rose" };
  }
  if (riskBand === "watch") {
    return { label: "Watch", tone: "amber" };
  }
  return { label: "Stable", tone: "emerald" };
};

const getOpportunityActionLabel = (action: SavingsOpportunity["action"]): string => {
  if (action === "cancel") {
    return "Cancel and Save";
  }
  if (action === "switch") {
    return "Switch Plan";
  }
  return "Downgrade Tier";
};

export default function DashboardPage() {
  const router = useRouter();

  const isSessionHydrated = useSessionHydrated();
  const token = useSessionStore((state) => state.token);
  const user = useSessionStore((state) => state.user);
  const clearSession = useSessionStore((state) => state.clearSession);

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [opportunities, setOpportunities] = useState<SavingsOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!token) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [nextSummary, nextSubscriptions, nextOpportunities] = await Promise.all([
        getDashboardSummary(token),
        getSubscriptions(token, { sort: "renewal-asc" }),
        getSavingsOpportunities(token),
      ]);

      setSummary(nextSummary);
      setSubscriptions(nextSubscriptions);
      setOpportunities(nextOpportunities);
    } catch (requestError) {
      if (requestError instanceof ClientError && requestError.statusCode === 401) {
        clearSession();
        router.replace("/auth");
        return;
      }

      setError("Could not load dashboard data. Please refresh and try again.");
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
    void loadData();
  }, [isSessionHydrated, token, loadData, router]);



  const handleLogout = async () => {
    if (token) {
      try {
        await logoutSession(token);
      } catch {
        // Deliberately swallow API logout errors and always clear local session.
      }
    }

    clearSession();
    router.push("/auth");
  };

  if (!isSessionHydrated || !token) {
    return null;
  }

  const riskBand = summary ? getRiskBandTone(summary.riskBand) : null;
  const totalAnnualOpportunity = opportunities.reduce((sum, item) => sum + item.annualSavings, 0);
  const totalMonthlyOpportunity = opportunities.reduce((sum, item) => sum + item.monthlySavings, 0);
  const urgentCount = opportunities.filter((item) => item.urgency === "now").length;


  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-8 md:py-10">
      <AppHeader
        title={`Welcome, ${user?.name || "Demo User"}`}
        subtitle="Track subscription charges, identify hidden renewals, and prioritize which ones to challenge or prevent."
        rightSlot={
          <>
            <button className="cta-secondary" onClick={() => void loadData()} type="button">
              Refresh
            </button>
            <button className="cta-primary" onClick={handleLogout} type="button">
              Logout
            </button>
          </>
        }
      />

      {error ? <p className="glass-card rounded-xl px-4 py-3 text-sm text-rose-300">{error}</p> : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Monthly Spend"
          value={summary ? formatCurrency(summary.monthlySpend) : loading ? "..." : "$0.00"}
          helper="Total live subscription exposure"
          icon={<Wallet size={18} />}
        />
        <MetricCard
          label="Next Renewal"
          value={summary ? formatDate(summary.nextRenewalDate) : loading ? "..." : "N/A"}
          helper="Soonest upcoming charge"
          icon={<CalendarClock size={18} />}
        />
        <MetricCard
          label="High-Risk Count"
          value={summary ? String(summary.highRiskCount) : loading ? "..." : "0"}
          helper="Subscriptions flagged as risky"
          icon={<ShieldAlert size={18} />}
        />
        <MetricCard
          label="Potential Savings"
          value={summary ? formatCurrency(summary.potentialSavings) : loading ? "..." : "$0.00"}
          helper="Savings if high/medium risks are canceled"
          icon={<PiggyBank size={18} />}
        />
      </section>



      <section className="glass-card reveal p-6" style={{ animationDelay: "120ms" }}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Screen 6 - Dashboard</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-100">Subscriptions Overview</h2>
          </div>
          {riskBand ? <StatusBadge label={`Portfolio ${riskBand.label}`} tone={riskBand.tone} /> : null}
        </div>

        <div className="mt-5 grid gap-3">
          {subscriptions.map((subscription, index) => (
            <article
              key={subscription.id}
              className="surface-muted reveal flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between"
              style={{ animationDelay: `${150 + index * 60}ms` }}
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold text-slate-100">{subscription.merchant}</h3>
                  <StatusBadge label={subscription.riskLevel} tone={getRiskTone(subscription.riskLevel)} />
                  <StatusBadge label={subscription.status} tone={getStatusTone(subscription.status)} />
                </div>
                <p className="mt-2 text-sm text-slate-300">
                  {subscription.category} · {formatCurrency(subscription.amount)} · Renewal {formatDate(subscription.nextRenewalDate)}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Link className="cta-secondary" href={`/subscriptions/${subscription.id}`}>
                  View Detail
                </Link>
                {subscription.cancelMethod === "automated" || subscription.cancelMethod === "in-app" ? (
                  <Link className="cta-primary" href={`/subscriptions/${subscription.id}#cancel`}>
                    {subscription.cancelMethod === "automated" ? "Cancel Now" : "Start Cancellation"}
                  </Link>
                ) : (
                  <a className="cta-primary" href={subscription.cancellationUrl} rel="noopener noreferrer" target="_blank">
                    Open Cancel
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>

        {!loading && subscriptions.length === 0 ? (
          <p className="mt-4 rounded-lg bg-slate-900/70 px-4 py-3 text-sm text-slate-300">No subscriptions found for this filter.</p>
        ) : null}
      </section>

      <section className="glass-card reveal p-6" style={{ animationDelay: "180ms" }}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Action Priority Engine</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-100">Subscriptions to Take Action On</h2>
          </div>
          <StatusBadge
            label={`${opportunities.length} high-impact opportunities`}
            tone={opportunities.length >= 3 ? "emerald" : "amber"}
          />
        </div>

        <div className="mt-5 rounded-2xl border border-emerald-300/30 bg-gradient-to-r from-emerald-500/20 via-cyan-500/10 to-slate-900/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-100">Savings Forecast</p>
          <p className="mt-1 text-2xl font-extrabold text-white">
            Recover {formatCurrency(totalMonthlyOpportunity)}/month and {formatCurrency(totalAnnualOpportunity)}/year
          </p>
          <p className="mt-1 text-sm text-emerald-100/90">
            {urgentCount > 0
              ? `${urgentCount} move${urgentCount > 1 ? "s" : ""} should be executed immediately to avoid the next billing cycle.`
              : "No urgent renewals detected. Focus on weekly optimization moves."}
          </p>
        </div>

        <div className="mt-5 grid gap-3">
          {opportunities.map((opportunity, index) => (
            <article
              key={opportunity.subscriptionId}
              className="surface-muted reveal p-4"
              style={{ animationDelay: `${210 + index * 60}ms` }}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-slate-100">{opportunity.merchant}</h3>
                    <StatusBadge
                      label={`${opportunity.action} · ${opportunity.urgency}`}
                      tone={opportunity.urgency === "now" ? "rose" : opportunity.urgency === "this-week" ? "amber" : "blue"}
                    />
                  </div>
                  <p className="mt-2 text-sm text-slate-300">{opportunity.reason}</p>
                </div>

                <div className="rounded-xl bg-emerald-500/15 px-3 py-2 text-right">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-200">Projected Savings</p>
                  <p className="text-xl font-bold text-emerald-100">{formatCurrency(opportunity.monthlySavings)}/mo</p>
                  <p className="text-xs text-emerald-200">{formatCurrency(opportunity.annualSavings)} per year</p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div className="rounded-lg bg-slate-900/60 p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Current Annual Cost</p>
                  <p className="mt-1 text-base font-semibold text-slate-100">{formatCurrency(opportunity.currentAnnualCost)}</p>
                </div>
                <div className="rounded-lg bg-slate-900/60 p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Target Annual Cost</p>
                  <p className="mt-1 text-base font-semibold text-slate-100">{formatCurrency(opportunity.projectedAnnualCost)}</p>
                </div>
                <div className="rounded-lg bg-slate-900/60 p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Confidence</p>
                  <p className="mt-1 flex items-center gap-1 text-base font-semibold text-slate-100">
                    <Sparkles size={14} className="text-amber-300" />
                    {opportunity.confidenceScore}%
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm text-slate-300">Recommended move: <span className="font-semibold text-slate-100">{opportunity.recommendedPlan}</span></p>
                <Link className="cta-primary" href={`/subscriptions/${opportunity.subscriptionId}?intent=${opportunity.action}#plan-action`}>
                  {getOpportunityActionLabel(opportunity.action)}
                </Link>
              </div>
            </article>
          ))}
        </div>

        {!loading && opportunities.length === 0 ? (
          <p className="mt-4 rounded-lg bg-slate-900/70 px-4 py-3 text-sm text-slate-300">
            No savings opportunities detected right now. Your portfolio is already optimized.
          </p>
        ) : null}
      </section>

      <section className="glass-card reveal p-6" style={{ animationDelay: "240ms" }}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Discovery</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-100">Find Hidden Subscriptions</h2>
          <p className="mt-2 text-sm text-slate-400">
            Upload your bank or credit card statement to automatically discover subscription charges you may have forgotten about.
          </p>
        </div>
        <div className="mt-5">
          <StatementImporter />
        </div>
      </section>
    </main>
  );
}
