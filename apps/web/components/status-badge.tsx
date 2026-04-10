import clsx from "clsx";

interface StatusBadgeProps {
  label: string;
  tone: "slate" | "emerald" | "amber" | "rose" | "blue";
}

const toneClassMap: Record<StatusBadgeProps["tone"], string> = {
  slate: "bg-slate-800/80 text-slate-200 border-slate-600/60",
  emerald: "bg-emerald-500/15 text-emerald-200 border-emerald-400/30",
  amber: "bg-amber-500/15 text-amber-200 border-amber-400/30",
  rose: "bg-rose-500/15 text-rose-200 border-rose-400/30",
  blue: "bg-cyan-500/15 text-cyan-200 border-cyan-400/30",
};

export function StatusBadge({ label, tone }: StatusBadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        toneClassMap[tone],
      )}
    >
      {label}
    </span>
  );
}
