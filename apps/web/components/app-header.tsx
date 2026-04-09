import Link from "next/link";
import type { ReactNode } from "react";

interface AppHeaderProps {
  title: string;
  subtitle: string;
  rightSlot?: ReactNode;
}

export function AppHeader({ title, subtitle, rightSlot }: AppHeaderProps) {
  return (
    <header className="glass-card reveal p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="eyebrow">Subscription Cancellation Guarantee</p>
          <h1 className="display-title mt-2">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-300 md:text-base">{subtitle}</p>
        </div>

        <div className="flex items-center gap-2">{rightSlot}</div>
      </div>

      <nav className="mt-6 flex flex-wrap gap-2">
        <Link className="nav-pill" href="/dashboard">
          Dashboard
        </Link>
        <Link className="nav-pill" href="/renewals">
          Renewal Calendar
        </Link>
        <Link className="nav-pill" href="/auth">
          Auth
        </Link>
      </nav>
    </header>
  );
}
