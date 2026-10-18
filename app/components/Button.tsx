"use client";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function Button({
  children,
  href = "#contacto",
  variant = "primary",
}: {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "ghost" | "light";
}) {
  const base =
    "inline-flex items-center gap-2 rounded-full px-8 py-4 text-[17px] font-semibold tracking-wide transition-shadow";
  const styles = {
    primary:
      "bg-brand text-white shadow-[0_8px_24px_-8px_rgba(41,48,249,0.6)]",
    ghost:
      "border border-ink/15 text-ink bg-transparent hover:border-ink/30",
    light:
      "bg-white text-ink shadow-[0_8px_24px_-8px_rgba(10,14,42,0.35)]",
  }[variant];
  return (
    <motion.a
      href={href}
      className={`${base} ${styles}`}
      whileHover={{
        scale: 1.035,
        boxShadow:
          variant === "primary"
            ? "0 14px 32px -8px rgba(41,48,249,0.75)"
            : "0 10px 26px -8px rgba(10,14,42,0.3)",
      }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 420, damping: 24 }}
    >
      {children}
    </motion.a>
  );
}
