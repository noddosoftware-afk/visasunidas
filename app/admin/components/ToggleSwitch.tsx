"use client";
import { motion } from "framer-motion";

export function ToggleSwitch({
  checked,
  onChange,
  disabled,
  activeColor = "#30d158",
  title,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  activeColor?: string;
  title?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      title={title}
      onClick={() => !disabled && onChange(!checked)}
      style={{ backgroundColor: disabled ? undefined : checked ? activeColor : undefined }}
      className={`relative h-[26px] w-[45px] shrink-0 rounded-full ring-1 ring-inset ring-black/10 transition-colors duration-200 ease-out ${
        disabled
          ? "cursor-not-allowed bg-white/8"
          : checked
            ? "cursor-pointer"
            : "cursor-pointer bg-white/[0.14] hover:bg-white/[0.18]"
      }`}
    >
      <motion.span
        initial={false}
        animate={{ x: checked ? 20 : 2 }}
        whileTap={disabled ? undefined : { scaleX: 1.15 }}
        transition={{ type: "spring", stiffness: 700, damping: 34 }}
        className="absolute top-[2px] h-[22px] w-[22px] rounded-full bg-white"
        style={{
          boxShadow:
            "0 3px 8px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.12), inset 0 0 0 0.5px rgba(0,0,0,0.04)",
        }}
      />
    </button>
  );
}
