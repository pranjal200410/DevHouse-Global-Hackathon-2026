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

export function Problem() {
  return (
    <Section
      id="problem"
      title="Why subscriptions keep costing you"
      description="Hidden renewals, forgotten plans, and surprise charges stack quietly until the next statement arrives."
      className="mt-20"
    >
      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {problemItems.map((item) => (
          <Card key={item.title} title={item.title} description={item.description} icon={item.icon} />
        ))}
      </div>
    </Section>
  );
}
