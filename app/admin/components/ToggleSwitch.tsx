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
  const on = checked && !disabled;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      title={title}
      onClick={() => !disabled && onChange(!checked)}
      style={{
        backgroundColor: disabled ? "#3a3a3c80" : on ? activeColor : "#3a3a3c",
        boxShadow: on
          ? `0 0 1px ${activeColor}, 0 0 10px 1px ${activeColor}99, 0 0 22px 2px ${activeColor}4d`
          : "none",
      }}
      className={`relative h-[26px] w-[45px] shrink-0 rounded-full transition-[background-color,box-shadow] duration-200 ease-out ${
        disabled ? "cursor-not-allowed" : "cursor-pointer hover:brightness-110"
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
            "0 3px 8px rgba(0,0,0,0.25), 0 1px 2px rgba(0,0,0,0.15), inset 0 0 0 0.5px rgba(0,0,0,0.04)",
        }}
      />
    </button>
  );
}
