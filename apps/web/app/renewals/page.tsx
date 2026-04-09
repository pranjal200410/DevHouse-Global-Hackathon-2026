"use client";

import { AppHeader } from "@/components/app-header";
import { StatusBadge } from "@/components/status-badge";
import { ClientError, getRenewalCalendar } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/format";
import { useSessionStore } from "@/lib/session-store";
import type { RenewalCalendarItem } from "@/lib/types";
import { CalendarDays } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

const riskTone = (riskColor: RenewalCalendarItem["riskColor"]): "emerald" | "amber" | "rose" => {
  if (riskColor === "rose") {
    return "rose";
  }
  if (riskColor === "amber") {
    return "amber";
  }
  return "emerald";
};

export default function RenewalsPage() {
  const router = useRouter();
  const token = useSessionStore((state) => state.token);
  const clearSession = useSessionStore((state) => state.clearSession);

  const [events, setEvents] = useState<RenewalCalendarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCalendar = useCallback(async () => {
    if (!token) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getRenewalCalendar(token);
      setEvents(data);
    } catch (requestError) {
      if (requestError instanceof ClientError && requestError.statusCode === 401) {
        clearSession();
        router.replace("/auth");
        return;
      }

      setError("Could not load renewal calendar.");
    } finally {
      setLoading(false);
    }
  }, [token, clearSession, router]);

  useEffect(() => {
    if (!token) {
      router.replace("/auth");
      return;
    }
    void loadCalendar();
  }, [token, loadCalendar, router]);

  const totalUpcomingExposure = useMemo(
    () => events.reduce((sum, event) => sum + event.amount, 0),
    [events],
  );

  if (!token) {
    return null;
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-8 md:py-10">
      <AppHeader
        title="Renewal Calendar"
        subtitle="Spot upcoming charges in chronological order with risk color-coding for faster intervention."
        rightSlot={
          <>
            <button className="cta-secondary" onClick={() => void loadCalendar()} type="button">
              Refresh
            </button>
            <Link className="cta-primary" href="/dashboard">
              Back to Dashboard
            </Link>
          </>
        }
      />

      {error ? <p className="glass-card rounded-xl px-4 py-3 text-sm text-rose-700">{error}</p> : null}

      <section className="grid gap-4 md:grid-cols-[1fr_1.2fr]">
        <article className="glass-card reveal p-6" style={{ animationDelay: "80ms" }}>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Screen 9 - Renewal Calendar</p>
          <div className="mt-3 flex items-center gap-2 text-white">
            <CalendarDays size={18} />
            <h2 className="text-xl font-bold">Upcoming Exposure</h2>
          </div>

          {loading ? (
            <p className="mt-4 text-sm text-slate-300">Loading calendar...</p>
          ) : (
            <>
              <p className="mt-4 text-4xl font-bold text-white">{formatCurrency(totalUpcomingExposure)}</p>
              <p className="mt-2 text-sm text-slate-300">Potential amount to be charged over the next cycle.</p>

              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <StatusBadge label="low risk" tone="emerald" />
                  <span>Expected and manageable</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <StatusBadge label="medium risk" tone="amber" />
                  <span>Needs review this week</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <StatusBadge label="high risk" tone="rose" />
                  <span>Action required before renewal date</span>
                </div>
              </div>
            </>
          )}
        </article>

        <article className="glass-card reveal p-6" style={{ animationDelay: "120ms" }}>
          <h3 className="text-lg font-semibold text-white">Charge Timeline</h3>

          <div className="mt-4 space-y-3">
            {events.map((event, index) => (
              <div
                key={`${event.subscriptionId}-${event.date}`}
                className="surface-muted reveal flex flex-col gap-2 p-4 md:flex-row md:items-center md:justify-between"
                style={{ animationDelay: `${160 + index * 60}ms` }}
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-base font-semibold text-white">{event.merchant}</p>
                    <StatusBadge label={event.riskLevel} tone={riskTone(event.riskColor)} />
                  </div>
                  <p className="mt-1 text-sm text-slate-300">{formatDate(event.date)} · Status: {event.status}</p>
                </div>

                <p className="text-lg font-bold text-white">{formatCurrency(event.amount)}</p>
              </div>
            ))}

            {!loading && events.length === 0 ? (
              <p className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-300">No upcoming renewals found.</p>
            ) : null}
          </div>
        </article>
      </section>
    </main>
  );
}
