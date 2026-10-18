"use client";
import { motion } from "framer-motion";

export function ToggleSwitch({
  checked,
  onChange,
  disabled,
  activeColor = "bg-emerald-500",
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  activeColor?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
        checked ? activeColor : "bg-ink/15"
      } ${disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}
    >
      <motion.span
        animate={{ x: checked ? 20 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.35)]"
      />
    </button>
  );
}
