import clsx from "clsx";

interface StatusBadgeProps {
  label: string;
  tone: "slate" | "emerald" | "amber" | "rose" | "blue";
}

const toneClassMap: Record<StatusBadgeProps["tone"], string> = {
  slate: "bg-slate-100 text-slate-700 border-slate-200",
  emerald: "bg-emerald-100 text-emerald-800 border-emerald-200",
  amber: "bg-amber-100 text-amber-800 border-amber-200",
  rose: "bg-rose-100 text-rose-800 border-rose-200",
  blue: "bg-blue-100 text-blue-800 border-blue-200",
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
