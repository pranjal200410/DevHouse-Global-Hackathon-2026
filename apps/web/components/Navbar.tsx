import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      className="flex items-center justify-between px-12 py-5 sticky top-0 z-10 border-b"
      style={{
        background: "rgba(11,22,41,0.92)",
        backdropFilter: "blur(8px)",
        borderColor: "rgba(255,255,255,0.08)",
      }}
    >
      <div className="flex items-center gap-2 font-display font-extrabold text-xl tracking-tight text-cream">
        <span
          className="w-2 h-2 rounded-full animate-pulse-dot"
          style={{ background: "var(--emerald)" }}
        />
        SubGuard
      </div>

      <Link
        href="/auth"
        className="px-5 py-2 rounded-lg font-medium text-sm transition-colors hover:bg-[var(--emerald-light)]"
        style={{
          background: "var(--emerald)",
          color: "var(--navy)",
        }}
      >
        Try Demo — Free
      </Link>
    </nav>
  );
}
