import Link from "next/link";

export default function CtaBanner() {
  return (
    <section className="py-20 px-12 text-center">
      <div className="max-w-2xl mx-auto">
        <p
          className="text-xs uppercase tracking-widest font-medium mb-4"
          style={{ color: "var(--amber)" }}
        >
          Ready?
        </p>
        <h2
          className="font-display font-extrabold leading-tight mb-4"
          style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", letterSpacing: "-0.03em" }}
        >
          Stop the silent drain.
          <br />
          Start in 10 seconds.
        </h2>
        <p
          className="font-light text-base mb-10"
          style={{ color: "rgba(248,249,251,0.5)" }}
        >
          No account needed. See the full product instantly with sample data — then sign
          up only when you&apos;re ready.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/auth"
            className="px-10 py-4 rounded-xl font-medium text-base transition-all hover:-translate-y-px"
            style={{ background: "var(--emerald)", color: "var(--navy)" }}
          >
            Try Demo Free
          </Link>
          <Link
            href="/auth"
            className="px-8 py-4 rounded-xl font-normal text-base transition-colors"
            style={{
              background: "transparent",
              color: "#F8F9FB",
              border: "0.5px solid rgba(255,255,255,0.25)",
            }}
          >
            Create Account
          </Link>
        </div>
      </div>
    </section>
  );
}
