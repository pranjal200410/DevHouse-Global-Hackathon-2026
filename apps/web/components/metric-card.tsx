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
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
          {helper ? <p className="mt-2 text-sm text-slate-600">{helper}</p> : null}
        </div>
        {icon ? <div className="rounded-xl bg-white p-2 text-slate-700 shadow-sm">{icon}</div> : null}
      </div>
    </article>
  );
}
