import Link from "next/link";

const perks = [
  "10 realistic subscriptions",
  "Live renewal calendar",
  "Full cancellation flow",
  "No signup required",
];

export default function TryDemo() {
  return (
    <section
      className="py-20 px-12"
      style={{
        background: "var(--navy-mid)",
        borderTop: "0.5px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="max-w-5xl mx-auto grid gap-12 items-center grid-cols-1 lg:grid-cols-[1fr_1fr]">
        {/* Left: copy */}
        <div>
          <p
            className="text-xs uppercase tracking-widest font-medium mb-4"
            style={{ color: "var(--amber)" }}
          >
            No signup required
          </p>
          <h2
            className="font-display font-bold leading-snug mb-4"
            style={{
              fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
              letterSpacing: "-0.02em",
              color: "white",
            }}
          >
            See your subscriptions
            <br />
            in 10 seconds flat.
          </h2>
          <p
            className="font-light leading-relaxed mb-8 text-base"
            style={{ color: "rgba(248,249,251,0.55)" }}
          >
            The demo loads 10 realistic subscriptions with upcoming renewals, a live risk
            calendar, and a full cancellation flow — pre-filled with sample data so you
            experience the real product before you sign up.
          </p>

          <ul className="flex flex-col gap-2 mb-10">
            {perks.map((perk) => (
              <li key={perk} className="flex items-center gap-2 text-sm" style={{ color: "rgba(248,249,251,0.75)" }}>
                <span
                  className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-xs"
                  style={{
                    background: "rgba(29,158,117,0.2)",
                    border: "1px solid #1D9E75",
                    color: "#1D9E75",
                  }}
                >
                  ✓
                </span>
                {perk}
              </li>
            ))}
          </ul>

          <Link
            href="/auth"
            className="inline-flex px-9 py-4 rounded-xl font-medium text-base transition-all hover:-translate-y-px"
            style={{ background: "var(--emerald)", color: "var(--navy)" }}
          >
            Launch Demo →
          </Link>
        </div>

        {/* Right: mock dashboard */}
        <div
          className="rounded-2xl p-6 text-sm"
          style={{
            background: "#0D1A2C",
            border: "0.5px solid rgba(93,202,165,0.2)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="font-display font-bold text-sm">My Subscriptions</span>
            <span
              className="px-2 py-1 rounded-full text-xs font-medium"
              style={{
                background: "rgba(239,159,39,0.1)",
                color: "var(--amber)",
                border: "1px solid rgba(239,159,39,0.2)",
              }}
            >
              Demo Mode
            </span>
          </div>

          <div className="space-y-3">
            {[
              { name: "Netflix", price: "$15.99", renews: "Dec 15", status: "Active" },
              { name: "Spotify", price: "$9.99", renews: "Dec 20", status: "Active" },
              { name: "Adobe Creative", price: "$52.99", renews: "Jan 5", status: "Trial" },
              { name: "AWS", price: "$29.99", renews: "Dec 28", status: "Active" },
            ].map((sub) => (
              <div
                key={sub.name}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                    style={{ background: "rgba(255,255,255,0.1)" }}
                  >
                    {sub.name[0]}
                  </div>
                  <div>
                    <div className="font-medium" style={{ color: "white" }}>{sub.name}</div>
                    <div className="text-xs" style={{ color: "rgba(248,249,251,0.5)" }}>
                      Renews {sub.renews}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium" style={{ color: "white" }}>{sub.price}</div>
                  <div
                    className={`text-xs px-2 py-1 rounded-full ${
                      sub.status === "Trial"
                        ? "bg-amber-500/20 text-amber-300"
                        : "bg-emerald-500/20 text-emerald-300"
                    }`}
                  >
                    {sub.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}