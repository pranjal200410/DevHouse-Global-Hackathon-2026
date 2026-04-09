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
        {icon ? <div className="rounded-xl bg-slate-800 p-2 text-white shadow-sm">{icon}</div> : null}
      </div>
    </article>
  );
}
