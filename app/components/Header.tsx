"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

const LINKS = [
  { href: "#nosotros", label: "Nosotros" },
  { href: "#servicios", label: "Servicios" },
  { href: "#historia", label: "Nuestra historia" },
];

function IconMenu() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-6 w-6">
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </svg>
  );
}

function IconX() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-6 w-6">
      <line x1="5" y1="5" x2="19" y2="19" />
      <line x1="19" y1="5" x2="5" y2="19" />
    </svg>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-paper/85 backdrop-blur-md shadow-[0_1px_0_0_rgba(10,14,42,0.06)]"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#top" className="flex items-center gap-2.5">
            <Image
              src="/logo.svg"
              alt="Visas Unidas"
              width={38}
              height={38}
              priority
            />
            <span className="font-serif-display text-[18px] font-medium tracking-tight">
              Visas Unidas
            </span>
          </a>
          <nav className="hidden items-center gap-9 text-[17px] font-medium text-ink/80 md:flex">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} className="group relative">
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-brand transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <motion.a
              href="#contacto"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="hidden rounded-full bg-brand px-6 py-3 text-[16px] font-semibold text-white shadow-[0_6px_18px_-6px_rgba(41,48,249,0.6)] md:inline-flex"
            >
              Agenda tu consulta
            </motion.a>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menú"
              className="flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/5 md:hidden"
            >
              <IconMenu />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMenuOpen(false)}
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
                <span className="font-serif-display text-[18px] font-medium text-ink">
                  Visas Unidas
                </span>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Cerrar menú"
                  className="flex h-10 w-10 items-center justify-center rounded-full text-ink/60 transition-colors hover:bg-ink/5 hover:text-ink"
                >
                  <IconX />
                </button>
              </div>

              <nav className="flex flex-col gap-1 p-4">
                {LINKS.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-xl px-3 py-4 text-[18px] font-medium text-ink/80 transition-colors hover:bg-paper-dim hover:text-ink"
                  >
                    {l.label}
                  </a>
                ))}
              </nav>

              <div className="mt-auto border-t border-ink/8 p-6">
                <motion.a
                  href="#contacto"
                  onClick={() => setMenuOpen(false)}
                  whileTap={{ scale: 0.97 }}
                  className="flex w-full items-center justify-center rounded-full bg-brand py-3.5 text-[16px] font-semibold text-white shadow-[0_6px_18px_-6px_rgba(41,48,249,0.6)]"
                >
                  Agenda tu consulta
                </motion.a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
