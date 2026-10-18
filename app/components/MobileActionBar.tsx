"use client";
import { motion } from "framer-motion";

function IconClipboard() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
      <line x1="8.5" y1="10" x2="15.5" y2="10" />
      <line x1="8.5" y1="14" x2="15.5" y2="14" />
    </svg>
  );
}

function IconPhoneCall() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M5.5 4h3l1.5 4-2 1.8a11 11 0 0 0 4.7 4.7l1.8-2 4 1.5v3c0 1-.8 1.8-1.8 1.7C9.8 18.1 5.4 13.7 4.3 6.3 4.2 5.3 4.5 4 5.5 4z" />
    </svg>
  );
}

export function MobileActionBar() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 flex h-[64px] md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <motion.a
        href="#contacto"
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.12 }}
        className="flex flex-1 items-center justify-center gap-2 bg-brand text-[17px] font-bold uppercase tracking-wide text-white"
      >
        <IconClipboard />
        Formulario
      </motion.a>
      <motion.a
        href="tel:+523123092619"
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.12 }}
        className="flex flex-1 items-center justify-center gap-2 bg-gold text-[17px] font-bold uppercase tracking-wide text-white"
      >
        <IconPhoneCall />
        Llamada
      </motion.a>
    </div>
  );
}
