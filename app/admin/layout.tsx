import type { ReactNode } from "react";
import Link from "next/link";
import { AuthGate } from "./components/AuthGate";
import { AdminNav } from "./components/AdminNav";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGate>
      <div className="min-h-screen bg-[#0a0a0f] [font-family:var(--font-plex)] text-white">
        <header className="sticky top-0 z-10 border-b border-white/8 bg-[#0a0a0f]/85 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/admin" className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-[15px] font-semibold text-white">
                VU
              </span>
              <span className="text-[16px] font-semibold tracking-tight text-white">
                Visas Unidas
              </span>
              <span className="hidden rounded-full bg-white/8 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white/60 sm:inline-flex">
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
