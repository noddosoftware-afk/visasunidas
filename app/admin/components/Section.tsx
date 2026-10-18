"use client";
import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconChevronDown } from "./Icons";

const TONE_STYLE: Record<string, string> = {
  brand: "bg-gradient-to-br from-brand/15 to-brand/5 text-brand ring-1 ring-inset ring-brand/20",
  gold: "bg-gradient-to-br from-gold/20 to-gold/5 text-gold ring-1 ring-inset ring-gold/25",
  rose: "bg-gradient-to-br from-rose/15 to-rose/5 text-rose ring-1 ring-inset ring-rose/20",
  emerald: "bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-300/50",
  violet: "bg-gradient-to-br from-violet-100 to-violet-50 text-violet-700 ring-1 ring-inset ring-violet-300/50",
  sky: "bg-gradient-to-br from-sky-100 to-sky-50 text-sky-700 ring-1 ring-inset ring-sky-300/50",
  ink: "bg-ink/8 text-ink/70 ring-1 ring-inset ring-ink/10",
};

const BORDER_STYLE: Record<string, string> = {
  brand: "hover:border-brand/25",
  gold: "hover:border-gold/30",
  rose: "hover:border-rose/25",
  emerald: "hover:border-emerald-300/60",
  violet: "hover:border-violet-300/60",
  sky: "hover:border-sky-300/60",
  ink: "hover:border-ink/20",
};

export function Section({
  icon,
  title,
  subtitle,
  tone = "brand",
  right,
  children,
  defaultOpen = true,
  collapsible = true,
}: {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  tone?: "brand" | "gold" | "rose" | "emerald" | "violet" | "sky" | "ink";
  right?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  collapsible?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`overflow-hidden rounded-2xl border border-ink/8 bg-white shadow-[0_2px_10px_-6px_rgba(10,14,42,0.08)] transition-all hover:shadow-[0_8px_22px_-10px_rgba(10,14,42,0.14)] ${BORDER_STYLE[tone]}`}
    >
      <button
        type="button"
        onClick={() => collapsible && setOpen((o) => !o)}
        className={`flex w-full items-center justify-between gap-4 p-6 text-left ${
          collapsible ? "cursor-pointer" : "cursor-default"
        }`}
      >
        <div className="flex items-center gap-3">
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${TONE_STYLE[tone]}`}
          >
            {icon}
          </span>
          <div>
            <h2 className="text-[16px] font-semibold text-ink">{title}</h2>
            {subtitle && (
              <p className="mt-0.5 text-[13px] text-ink/50">{subtitle}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {right}
          {collapsible && (
            <motion.span
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-ink/35"
            >
              <IconChevronDown />
            </motion.span>
          )}
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
