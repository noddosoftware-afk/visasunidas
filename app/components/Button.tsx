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
    "inline-flex items-center gap-2 rounded-full px-8 py-4 text-[17px] font-semibold tracking-wide";
  const styles = {
    primary: "bg-brand text-white",
    ghost: "border border-white/25 text-ink bg-transparent hover:border-white/50",
    light: "bg-white text-ink",
  }[variant];
  return (
    <motion.a
      href={href}
      className={`${base} ${styles}`}
      whileHover={{ scale: 1.035 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 420, damping: 24 }}
    >
      {children}
    </motion.a>
  );
}
