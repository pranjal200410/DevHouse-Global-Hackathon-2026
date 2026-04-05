"use client";

import { ClientError, demoLogin } from "@/lib/api";
import { useSessionStore } from "@/lib/session-store";
import { LockKeyhole, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";

export default function AuthPage() {
  const router = useRouter();
  const setSession = useSessionStore((state) => state.setSession);

  const [email, setEmail] = useState("demo@devhouse.app");
  const [pin, setPin] = useState("2026");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const session = await demoLogin({
        email: email.trim(),
        pin: pin.trim() || undefined,
      });

      setSession({
        token: session.token,
        expiresAt: session.expiresAt,
        user: session.user,
      });

      router.push("/dashboard");
    } catch (requestError) {
      if (requestError instanceof ClientError) {
        setError(requestError.apiError.message);
      } else {
        setError("Unable to login right now. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto grid min-h-screen w-full max-w-6xl items-center gap-6 px-4 py-8 md:grid-cols-[1.1fr_1fr] md:px-8 md:py-12">
      <section className="glass-card reveal p-7 md:p-9" style={{ animationDelay: "60ms" }}>
        <p className="eyebrow">Screen 5 - Auth / Onboarding</p>
        <h1 className="display-title mt-4">
          Secure demo access
          <br />
          in under 10 seconds.
        </h1>
        <p className="mt-4 max-w-lg text-sm text-slate-700 md:text-base">
          Start with deterministic sample data and validate every API flow without external credentials.
          This demo session is isolated and resets cleanly on demand.
        </p>

        <div className="mt-6 space-y-3">
          {[
            "Fast demo login with in-memory session token",
            "Auth edge-case handling with clear validation feedback",
            "Session state persisted in client store for app navigation",
          ].map((item, index) => (
            <div key={item} className="surface-muted reveal flex items-start gap-3 p-3" style={{ animationDelay: `${140 + index * 80}ms` }}>
              <span className="mt-1 inline-flex size-5 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                {index + 1}
              </span>
              <p className="text-sm text-slate-700">{item}</p>
            </div>
          ))}
        </div>

        <Link className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-700 underline-offset-4 hover:text-slate-900 hover:underline" href="/">
          Back to landing
        </Link>
      </section>

      <section className="glass-card reveal p-7 md:p-9" style={{ animationDelay: "120ms" }}>
        <div className="mb-6 flex items-center gap-3">
          <span className="inline-flex rounded-xl bg-white p-2 shadow-sm">
            <LockKeyhole className="text-slate-700" size={18} />
          </span>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Demo Login</h2>
            <p className="text-sm text-slate-600">PIN defaults to 2026</p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold text-slate-700">
            Email
            <input
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none ring-emerald-200 transition focus:ring"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className="block text-sm font-semibold text-slate-700">
            PIN (optional)
            <input
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none ring-emerald-200 transition focus:ring"
              type="password"
              value={pin}
              onChange={(event) => setPin(event.target.value)}
              maxLength={4}
              inputMode="numeric"
              pattern="[0-9]{4}"
              placeholder="2026"
            />
          </label>

          {error ? <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}

          <button className="cta-primary w-full" disabled={loading} type="submit">
            {loading ? "Signing in..." : "Enter Demo Workspace"}
          </button>

          <p className="flex items-center gap-2 text-xs text-slate-500">
            <Sparkles size={14} />
            No external credentials required. Demo data is deterministic.
          </p>
        </form>
      </section>
    </main>
  );
}
