type Step = {
  num: string;
  verb: string;
  title: string;
  desc: string;
  numStyle: React.CSSProperties;
  verbColor: string;
};

const steps: Step[] = [
  {
    num: "01",
    verb: "Detect",
    title: "Every subscription, instantly visible",
    desc: "Connect your account and see all active and dormant subscriptions in one place — including ones you forgot you had. No manual entry.",
    numStyle: {
      background: "rgba(29,158,117,0.15)",
      border: "1.5px solid #1D9E75",
      color: "#1D9E75",
    },
    verbColor: "#5DCAA5",
  },
  {
    num: "02",
    verb: "Predict",
    title: "Know the charge before it hits",
    desc: "SubGuard forecasts renewal dates and amounts up to 30 days ahead — color-coded by risk — so you're never surprised.",
    numStyle: {
      background: "rgba(93,202,165,0.12)",
      border: "1.5px solid #5DCAA5",
      color: "#5DCAA5",
    },
    verbColor: "#5DCAA5",
  },
  {
    num: "03",
    verb: "Cancel",
    title: "Step-by-step cancellation guidance",
    desc: "For every merchant we've mapped the exact cancellation flow — no dark patterns, no confusion. Follow the steps, log your attempt.",
    numStyle: {
      background: "rgba(239,159,39,0.12)",
      border: "1.5px solid #EF9F27",
      color: "#EF9F27",
    },
    verbColor: "#EF9F27",
  },
  {
    num: "04",
    verb: "Block",
    title: "Auto-block unauthorised renewals",
    desc: "Enable Auto-Block per subscription. If a charge attempts after cancellation, it's flagged and queued for dispute before it clears.",
    numStyle: {
      background: "rgba(239,159,39,0.10)",
      border: "1.5px solid #FAC775",
      color: "#FAC775",
    },
    verbColor: "#FAC775",
  },
  {
    num: "05",
    verb: "Prove",
    title: "Dispute-ready evidence in one click",
    desc: "Generate a timestamped evidence PDF with cancellation screenshots, email threads, and charge records — formatted for your bank's chargeback process.",
    numStyle: {
      background: "rgba(248,249,251,0.06)",
      border: "1.5px solid rgba(248,249,251,0.3)",
      color: "#F8F9FB",
    },
    verbColor: "rgba(248,249,251,0.5)",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 px-12">
      <div className="max-w-5xl mx-auto mb-14">
        <p
          className="text-xs uppercase tracking-widest font-medium mb-4"
          style={{ color: "var(--amber)" }}
        >
          How it works
        </p>
        <h2
          className="font-display font-bold mb-3"
          style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", letterSpacing: "-0.02em" }}
        >
          Detect. Predict. Cancel. Block. Prove.
        </h2>
        <p className="font-light" style={{ color: "rgba(248,249,251,0.5)" }}>
          Five steps from invisible charge to iron-clad dispute — automated at every stage.
        </p>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col">
        {steps.map((step, i) => (
          <div key={step.num} className="grid gap-6 relative" style={{ gridTemplateColumns: "56px 1fr" }}>
            {/* Connector line between steps */}
            {i < steps.length - 1 && (
              <div
                className="absolute"
                style={{
                  left: "27px",
                  top: "56px",
                  width: "1px",
                  height: "100%",
                  background: "linear-gradient(to bottom, rgba(29,158,117,0.4), rgba(29,158,117,0.05))",
                }}
              />
            )}

            {/* Step number circle */}
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center font-display font-bold text-lg relative z-10 flex-shrink-0"
              style={step.numStyle}
            >
              {step.num}
            </div>

            {/* Step content card */}
            <div
              className="rounded-2xl p-6 mb-5"
              style={{
                background: "var(--card-bg)",
                border: "0.5px solid var(--card-border)",
              }}
            >
              <p
                className="text-xs uppercase tracking-widest font-medium mb-1"
                style={{ color: step.verbColor }}
              >
                {step.verb}
              </p>
              <h3 className="font-display font-bold text-lg mb-2">{step.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(248,249,251,0.55)" }}>
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
