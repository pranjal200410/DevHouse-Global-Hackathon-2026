import clsx from "clsx";
import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  className?: string;
};

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex rounded-full border border-white/10 bg-slate-800/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-200",
        className
      )}
    >
      {children}
    </span>
  );
}
