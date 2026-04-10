import { Card } from "./ui/Card";
import { Section } from "./ui/Section";
import { ShieldAlert, EyeOff, CreditCard, Clock } from "lucide-react";

const problemItems = [
  {
    title: "Hidden renewals",
    description: "Most subscriptions renew automatically without warning, creating surprise charges on your card.",
    icon: <ShieldAlert size={20} />,
  },
  {
    title: "Forgotten plans",
    description: "Users keep paying for services they stopped using weeks or months ago.",
    icon: <EyeOff size={20} />,
  },
  {
    title: "Unexpected charges",
    description: "Renewals often appear after a trial ends, making budgets harder to control.",
    icon: <CreditCard size={20} />,
  },
  {
    title: "Slow dispute paths",
    description: "Without clear proof, chargebacks become stressful and time-consuming.",
    icon: <Clock size={20} />,
  },
];

export default function Problem() {
  return (
    <section
      className="py-16 px-12"
      style={{
        background: "var(--navy-mid)",
        borderTop: "0.5px solid rgba(255,255,255,0.07)",
        borderBottom: "0.5px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="max-w-5xl mx-auto">
        <p
          className="text-xs uppercase tracking-widest font-medium mb-4"
          style={{ color: "var(--amber)" }}
        >
          The problem
        </p>

        <h2
          className="font-display font-bold leading-snug max-w-2xl mb-5"
          style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", letterSpacing: "-0.02em" }}
        >
          Money You Don&apos;t Remember Spending
        </h2>

        <p
          className="font-light leading-relaxed max-w-2xl mb-6"
          style={{ fontSize: "1rem", color: "rgba(248,249,251,0.6)" }}
        >
          You sign up. You try it once. Life gets busy. Then you see a charge on your card. Another the next month. You're paying for something you haven't used in months. It's not a lot each time. But it adds up fast. And it keeps happening because companies count on you forgetting.
        </p>

        <p
          className="font-light leading-relaxed max-w-2xl mb-10"
          style={{ fontSize: "1rem", color: "rgba(248,249,251,0.6)" }}
        >
          The system is rigged against you. Trial dates turn into paid charges without warning. Renewal dates are hidden. You don't get reminders. By the time you catch it, weeks of charges have already gone through. You need one place that shows every subscription you have, warns you before they charge, and lets you kill them instantly.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {problemItems.map(({ icon, title, description }) => (
            <div
              key={title}
              className="rounded-xl p-5"
              style={{
                background: "rgba(239,159,39,0.07)",
                border: "0.5px solid rgba(239,159,39,0.22)",
              }}
            >
              <div className="text-xl mb-2">{icon}</div>
              <div className="font-medium text-base mb-1" style={{ color: "rgba(0,0,0,0.9)" }}>{title}</div>
              <div className="text-sm leading-relaxed" style={{ color: "rgba(0,0,0,0.7)" }}>
                {description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
