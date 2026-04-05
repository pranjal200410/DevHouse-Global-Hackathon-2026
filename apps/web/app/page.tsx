import { ArrowRight, CalendarClock, ShieldAlert, Wallet } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-8 md:py-12">
      <section className="glass-card reveal grid gap-8 p-7 md:grid-cols-[1.4fr_1fr] md:p-10" style={{ animationDelay: "60ms" }}>
        <div>
          <p className="eyebrow">DevHouse Hackathon 2026</p>
          <h1 className="hero-title mt-4">
            Detect. Cancel. <span className="text-gradient">Block. Prove.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-slate-700 md:text-lg">
            Subscription Cancellation Guarantee helps users stop hidden renewals before the next bill lands.
            See the full flow instantly with realistic demo data and zero external credentials.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/auth" className="cta-primary">
              Try Demo Now
              <ArrowRight size={16} />
            </Link>
            <Link href="/dashboard" className="cta-secondary">
              View Dashboard Preview
            </Link>
          </div>
        </div>

        <div className="surface-muted p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-500">Live demo flow</p>
          <ol className="mt-4 space-y-3 text-sm text-slate-700 md:text-base">
            <li className="flex items-start gap-2">
              <span className="mt-1 inline-flex size-5 items-center justify-center rounded-full bg-white text-xs font-bold text-slate-700">
                1
              </span>
              Enter demo auth and create a secure temporary session.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 inline-flex size-5 items-center justify-center rounded-full bg-white text-xs font-bold text-slate-700">
                2
              </span>
              Review monthly spend, upcoming renewals, and high-risk subscriptions.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 inline-flex size-5 items-center justify-center rounded-full bg-white text-xs font-bold text-slate-700">
                3
              </span>
              Trigger cancellation, enable auto-block, and validate dispute evidence.
            </li>
          </ol>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Detect risky renewals",
            text: "Color-coded risk levels surface subscriptions most likely to trigger surprise charges.",
            icon: <ShieldAlert className="text-rose-500" size={20} />,
          },
          {
            title: "Track spend instantly",
            text: "The dashboard computes monthly exposure and projected savings in one glance.",
            icon: <Wallet className="text-emerald-600" size={20} />,
          },
          {
            title: "Plan ahead by date",
            text: "Renewal calendar gives exact billing order so users can act before renewals happen.",
            icon: <CalendarClock className="text-amber-500" size={20} />,
          },
        ].map((item, index) => (
          <article
            key={item.title}
            className="glass-card reveal p-5"
            style={{ animationDelay: `${120 + index * 80}ms` }}
          >
            <div className="inline-flex rounded-xl bg-white p-2 shadow-sm">{item.icon}</div>
            <h2 className="mt-4 text-lg font-bold text-slate-900">{item.title}</h2>
            <p className="mt-2 text-sm text-slate-600 md:text-base">{item.text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
