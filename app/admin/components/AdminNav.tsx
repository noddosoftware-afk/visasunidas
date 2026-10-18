"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  IconCalendar,
  IconExternalLink,
  IconFilePlus,
  IconLayoutDashboard,
  IconMenu,
  IconUsers,
  IconX,
} from "./Icons";

const LINKS = [
  { href: "/admin", label: "Solicitudes", icon: IconLayoutDashboard, exact: true },
  { href: "/admin/nueva", label: "Nueva solicitud", icon: IconFilePlus },
  { href: "/admin/calendario", label: "Calendario", icon: IconCalendar },
  { href: "/admin/equipo", label: "Equipo", icon: IconUsers },
];

export function AdminNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Escritorio: pills horizontales */}
      <nav className="hidden items-center gap-1 text-[14px] font-medium text-ink/60 md:flex">
        {LINKS.map((l) => {
          const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
          const Icon = l.icon;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center gap-2 rounded-full px-4 py-2 transition-colors ${
                active ? "bg-brand/10 text-brand" : "hover:bg-ink/5 hover:text-ink"
              }`}
            >
              <Icon className="h-4 w-4" />
              {l.label}
            </Link>
          );
        })}
        <Link
          href="/"
          className="ml-2 flex items-center gap-1.5 rounded-full px-4 py-2 text-ink/50 transition-colors hover:bg-ink/5 hover:text-ink"
        >
          Ver sitio
          <IconExternalLink className="h-3.5 w-3.5" />
        </Link>
      </nav>

      {/* Móvil: botón de hamburguesa */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir menú"
        className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/5 md:hidden"
      >
        <IconMenu />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[60] bg-ink/50 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 right-0 z-[70] flex h-full w-[82%] max-w-sm flex-col bg-white shadow-2xl md:hidden"
            >
              <div className="flex items-center justify-between border-b border-ink/8 px-6 py-5">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-[13px] font-semibold text-white">
                    VU
                  </span>
                  <span className="font-serif-display text-[17px] font-medium text-ink">
                    Admin
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Cerrar menú"
                  className="flex h-10 w-10 items-center justify-center rounded-full text-ink/60 transition-colors hover:bg-ink/5 hover:text-ink"
                >
                  <IconX />
                </button>
              </div>

              <nav className="flex flex-col gap-1 p-4">
                {LINKS.map((l) => {
                  const active = l.exact
                    ? pathname === l.href
                    : pathname.startsWith(l.href);
                  const Icon = l.icon;
                  return (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-[17px] font-medium transition-colors ${
                        active
                          ? "bg-brand/10 text-brand"
                          : "text-ink/80 hover:bg-paper-dim"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {l.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-auto border-t border-ink/8 p-4">
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-4 py-3.5 text-[16px] font-medium text-ink/50 transition-colors hover:bg-paper-dim hover:text-ink"
                >
                  <IconExternalLink className="h-4 w-4" />
                  Ver sitio
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
