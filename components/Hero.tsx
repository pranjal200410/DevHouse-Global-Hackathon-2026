"use client";

const stats = [
  { value: "$273", unit: "/yr", label: "avg. wasted on forgotten subs" },
  { value: "48", unit: "hrs", label: "avg. notice before renewal" },
  { value: "1 in 3", unit: "", label: "charges disputed successfully" },
];

export default function Hero() {
  return (
    <section className="max-w-5xl mx-auto px-12 pt-20 pb-16">
      <h1
        className="font-display font-extrabold leading-none tracking-tight mb-6"
        style={{ fontSize: "clamp(2.4rem, 5vw, 3.8rem)", letterSpacing: "-0.03em" }}
      >
        Stop losing money to{" "}
        <br />
        <span style={{ color: "var(--emerald-light)" }}>forgotten</span> subscriptions
        <br />
        and <span style={{ color: "var(--amber)" }}>dark patterns.</span>
      </h1>

      <p
        className="font-light leading-relaxed mb-10 max-w-xl"
        style={{ fontSize: "1.1rem", color: "rgba(248,249,251,0.62)" }}
      >
        SubGuard detects hidden renewals, predicts charges before they hit, and
        generates dispute-ready proof in seconds — no login needed to see it work.
      </p>

      <div className="flex flex-wrap gap-4 mb-14">
        <button
          className="px-8 py-3 rounded-xl font-medium text-base transition-all hover:-translate-y-px"
          style={{ background: "var(--emerald)", color: "var(--navy)" }}
        >
          Try the Live Demo
        </button>
        <button
          className="px-8 py-3 rounded-xl font-normal text-base transition-colors"
          style={{
            background: "transparent",
            color: "#F8F9FB",
            border: "0.5px solid rgba(255,255,255,0.25)",
          }}
        >
          How it works →
        </button>
      </div>

      <div
        className="flex flex-wrap gap-10 pt-6"
        style={{ borderTop: "0.5px solid rgba(255,255,255,0.1)" }}
      >
        {stats.map(({ value, unit, label }) => (
          <div key={label}>
            <div className="font-display font-bold text-2xl text-cream">
              {value}
              <span style={{ color: "var(--emerald)" }}>{unit}</span>
            </div>
            <div className="text-xs mt-0.5" style={{ color: "rgba(248,249,251,0.45)" }}>
              {label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
