import type { ReactNode } from "react";
import Link from "next/link";
import { AuthGate } from "./components/AuthGate";
import { AdminNav } from "./components/AdminNav";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGate>
      <div className="min-h-screen bg-paper-dim">
        <header className="sticky top-0 z-10 border-b border-ink/8 bg-white/90 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/admin" className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-[15px] font-semibold text-white">
                VU
              </span>
              <span className="font-serif-display text-lg font-medium text-ink">
                Visas Unidas
              </span>
              <span className="hidden rounded-full bg-brand/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand sm:inline-flex">
                Admin
              </span>
            </Link>
            <AdminNav />
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
      </div>
    </AuthGate>
  );
}
