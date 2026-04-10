import Link from "next/link";
import { Button } from "./ui/Button";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 py-4 sm:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold text-white">
            SubGuard
          </Link>
          <Button as={Link} href="/auth" variant="primary" className="hidden sm:flex">
            Try Demo
          </Button>
        </div>
      </div>
    </nav>
  );
}