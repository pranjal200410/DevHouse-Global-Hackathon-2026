import type { ReactNode } from "react";

type CardProps = {
  title: string;
  description: string;
  icon: ReactNode;
  className?: string;
};

export function Card({ title, description, icon, className }: CardProps) {
  return (
    <article
      className={`rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-6 shadow-[0_24px_80px_-48px_rgba(0,0,0,0.45)] transition duration-200 hover:-translate-y-0.5 hover:border-emerald-500/20${className ? ` ${className}` : ""}`}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-800/95 text-emerald-300 shadow-sm shadow-emerald-500/10">
        {icon}
      </div>
      <h3 className="mt-6 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-400">{description}</p>
    </article>
  );
}
