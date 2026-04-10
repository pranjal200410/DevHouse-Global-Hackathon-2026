import Link from "next/link";
import { ArrowRight, ShieldAlert, ShieldCheck, Wallet, CalendarDays } from "lucide-react";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";

const heroHighlights = [
  { label: "Auto-risk scanning", icon: <ShieldAlert size={16} /> },
  { label: "Renewal prediction", icon: <CalendarDays size={16} /> },
  { label: "Proof-ready reports", icon: <ShieldCheck size={16} /> },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_48px_120px_-80px_rgba(0,0,0,0.7)] ring-1 ring-white/10 sm:p-12 lg:p-16">
      <div className="pointer-events-none absolute -left-24 top-10 hidden h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl sm:block" />
      <div className="pointer-events-none absolute right-0 top-0 hidden h-96 w-96 rounded-full bg-amber-400/5 blur-3xl lg:block" />
      <div className="relative grid gap-12 lg:grid-cols-[1.3fr_0.9fr] lg:items-end">
        <div className="max-w-2xl">
          <Badge>Premium audit</Badge>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
            Detect. Cancel. Block. Prove.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
            Stop losing money to hidden subscription renewals. See the full picture in seconds with a demo dashboard built for financial clarity.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button as={Link} href="/auth" variant="primary">
              Try Demo
              <ArrowRight size={16} />
            </Button>
            <Button as={Link} href="/auth" variant="secondary">
              Explore live dashboard
            </Button>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {heroHighlights.map((item) => (
              <div
                key={item.label}
                className="rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-4"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-800 text-emerald-300">
                  {item.icon}
                </div>
                <p className="mt-4 text-sm font-semibold text-white">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/90 p-6 ring-1 ring-white/5 shadow-[0_28px_64px_-32px_rgba(0,0,0,0.55)] sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs uppercase tracking-[0.24em] text-slate-400">Demo snapshot</span>
            <span className="rounded-full bg-slate-800 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-300">
              Sample data
            </span>
          </div>

          <div className="mt-8 space-y-6">
            <div className="rounded-3xl border border-white/5 bg-slate-950/80 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Monthly spend</p>
                  <p className="mt-2 text-3xl font-semibold text-white">$1,780</p>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">
                  24% saved
                </span>
              </div>
            </div>

            <div className="rounded-3xl border border-white/5 bg-slate-950/80 p-4">
              <div className="grid gap-4">
                {[
                  "Subscription risk score",
                  "Upcoming charge preview",
                  "Dispute evidence ready",
                ].map((text) => (
                  <div key={text} className="flex items-center gap-3 text-sm text-slate-300">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-slate-800 text-emerald-300">
                      <Wallet size={16} />
                    </span>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
