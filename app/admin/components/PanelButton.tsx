"use client";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

const VARIANTS: Record<string, string> = {
  primary: "bg-brand text-white hover:bg-brand-deep",
  gold: "bg-gold text-white hover:brightness-110",
  emerald: "bg-emerald-500 text-white hover:bg-emerald-600",
  outline:
    "border border-white/15 bg-white/5 text-white/70 hover:border-brand/50 hover:text-white",
  danger:
    "border border-coral/30 bg-coral/5 text-[#ff8079] hover:bg-coral/15 hover:border-coral/50",
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
