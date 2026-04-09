const perks = [
  "10 real-looking subscriptions pre-loaded",
  "3 upcoming renewals on the risk calendar",
  "1 live charge incident ready to dispute",
  "No account, no email, no credit card",
];

const mockSubs = [
  { name: "Netflix Premium", date: "Renews Apr 14", amount: "$22.99", risk: "High risk", riskStyle: { color: "#F09595", background: "rgba(226,75,74,0.12)" } },
  { name: "Adobe CC", date: "Renews Apr 22", amount: "$54.99", risk: "Review", riskStyle: { color: "#FAC775", background: "rgba(239,159,39,0.12)" } },
  { name: "Spotify Family", date: "Renews May 3", amount: "$16.99", risk: "Protected", riskStyle: { color: "#5DCAA5", background: "rgba(29,158,117,0.12)" } },
  { name: "Dropbox Plus", date: "Renews May 10", amount: "$9.99", risk: "Protected", riskStyle: { color: "#5DCAA5", background: "rgba(29,158,117,0.12)" } },
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
      <div
        className="max-w-5xl mx-auto grid gap-12 items-center"
        style={{ gridTemplateColumns: "1fr 1fr" }}
      >
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
            style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", letterSpacing: "-0.02em" }}
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

          <button
            className="px-9 py-4 rounded-xl font-medium text-base transition-all hover:-translate-y-px"
            style={{ background: "var(--emerald)", color: "var(--navy)" }}
          >
            Launch Demo →
          </button>
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
              className="text-xs px-3 py-0.5 rounded-full"
              style={{
                background: "rgba(29,158,117,0.15)",
                color: "#5DCAA5",
                border: "0.5px solid rgba(29,158,117,0.3)",
              }}
            >
              Demo Mode
            </span>
          </div>

          {mockSubs.map((sub, i) => (
            <div
              key={sub.name}
              className="flex items-center justify-between py-3"
              style={{
                borderBottom: i < mockSubs.length - 1 ? "0.5px solid rgba(255,255,255,0.07)" : "none",
              }}
            >
              <div>
                <div className="font-medium text-sm">{sub.name}</div>
                <div className="text-xs mt-0.5" style={{ color: "rgba(248,249,251,0.38)" }}>
                  {sub.date}
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-sm">{sub.amount}</div>
                <div
                  className="text-xs rounded px-2 mt-0.5 inline-block"
                  style={sub.riskStyle}
                >
                  {sub.risk}
                </div>
              </div>
            </div>
          ))}

          <div
            className="flex justify-between mt-4 pt-4"
            style={{ borderTop: "0.5px solid rgba(255,255,255,0.1)" }}
          >
            <span className="text-sm" style={{ color: "rgba(248,249,251,0.45)" }}>
              Monthly exposure
            </span>
            <span className="font-display font-bold" style={{ color: "var(--amber)" }}>
              $247.83 / mo
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
