import type { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: string;
  helper?: string;
  icon?: ReactNode;
}

export function MetricCard({ label, value, helper, icon }: MetricCardProps) {
  return (
    <article className="glass-card reveal p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-100">{value}</p>
          {helper ? <p className="mt-2 text-sm text-slate-300">{helper}</p> : null}
        </div>
        {icon ? <div className="rounded-xl bg-slate-900/80 p-2 text-emerald-300 shadow-sm shadow-emerald-500/10">{icon}</div> : null}
      </div>
    </article>
  );
}
