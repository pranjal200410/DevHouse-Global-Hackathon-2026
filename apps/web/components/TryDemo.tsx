import { Button } from "./ui/Button";
import { Section } from "./ui/Section";

export function TryDemo() {
  return (
    <Section className="mt-20">
      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-r from-slate-950/95 via-slate-900/95 to-[#081430] p-8 shadow-[0_48px_120px_-80px_rgba(0,0,0,0.7)] sm:p-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-300">Try the demo</p>
            <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
              See all your subscriptions instantly with sample data.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
              Start the demo flow today and watch hidden renewals, charge risk, and dispute proof appear in one polished view.
            </p>
          </div>
          <div className="flex items-center justify-start lg:justify-end">
            <Button as="a" href="/auth" variant="primary" className="w-full sm:w-auto">
              Start Demo
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}