"use client";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

const VARIANTS: Record<string, string> = {
  primary:
    "bg-gradient-to-b from-[#4049ff] to-brand text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_8px_20px_-8px_rgba(41,48,249,0.55)]",
  gold:
    "bg-gradient-to-b from-[#ddab5e] to-gold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_8px_20px_-8px_rgba(201,151,63,0.5)]",
  emerald:
    "bg-gradient-to-b from-emerald-400 to-emerald-600 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_8px_20px_-8px_rgba(16,185,129,0.5)]",
  outline:
    "border-2 border-ink/12 bg-white text-ink/70 shadow-[0_1px_2px_rgba(10,14,42,0.04)] hover:border-brand/40 hover:text-brand",
  danger:
    "border-2 border-rose/25 bg-white text-rose hover:bg-rose/5 hover:border-rose/50",
};

export function PanelButton({
  children,
  variant = "primary",
  type = "button",
  onClick,
  disabled,
  className = "",
}: {
  children: ReactNode;
  variant?: keyof typeof VARIANTS;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-[14px] font-semibold transition-colors disabled:opacity-40 ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
}
