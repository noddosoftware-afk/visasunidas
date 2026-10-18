"use client";
import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconChevronDown } from "./Icons";

const TONE_STYLE: Record<string, string> = {
  brand: "bg-brand/15 text-[#8c91ff] ring-1 ring-inset ring-brand/30",
  gold: "bg-gold/15 text-gold ring-1 ring-inset ring-gold/30",
  rose: "bg-rose/15 text-[#ff8079] ring-1 ring-inset ring-rose/30",
  emerald: "bg-emerald-400/15 text-emerald-300 ring-1 ring-inset ring-emerald-400/30",
  violet: "bg-violet-400/15 text-violet-300 ring-1 ring-inset ring-violet-400/30",
  sky: "bg-sky-400/15 text-sky-300 ring-1 ring-inset ring-sky-400/30",
  ink: "bg-white/8 text-white/70 ring-1 ring-inset ring-white/10",
};

const BORDER_STYLE: Record<string, string> = {
  brand: "hover:border-brand/40",
  gold: "hover:border-gold/40",
  rose: "hover:border-rose/40",
  emerald: "hover:border-emerald-400/40",
  violet: "hover:border-violet-400/40",
  sky: "hover:border-sky-400/40",
  ink: "hover:border-white/20",
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
      className={`overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03] backdrop-blur-sm transition-colors ${BORDER_STYLE[tone]}`}
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
            <h2 className="text-[16px] font-semibold text-white">{title}</h2>
            {subtitle && (
              <p className="mt-0.5 text-[13px] text-white/45">{subtitle}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {right}
          {collapsible && (
            <motion.span
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-white/30"
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
