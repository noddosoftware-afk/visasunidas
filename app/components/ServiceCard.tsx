"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { SERVICE_TONES } from "../lib/serviceTones";

export function ServiceCard({
  slug,
  title,
  detail,
  index,
}: {
  slug: string;
  title: string;
  detail: string;
  index: number;
}) {
  const tone = SERVICE_TONES[index % SERVICE_TONES.length];
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 26 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
        },
      }}
      whileHover={{ y: -8 }}
    >
      <Link
        href={`/servicios/${slug}`}
        className={`group relative block overflow-hidden rounded-3xl border bg-white p-7 pt-8 shadow-[0_2px_14px_-8px_rgba(10,14,42,0.1)] transition-all duration-300 ${tone.border} ${tone.cardHover}`}
      >
        <span className={`absolute inset-x-0 top-0 h-1.5 ${tone.bar}`} />
        <div
          className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-300 ${tone.icon} ${tone.iconHover}`}
        >
          <span className="font-serif-display text-xl">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <h3 className="text-[19px] font-semibold text-ink">{title}</h3>
        <p className="mt-2 text-[17px] leading-relaxed text-ink/70">{detail}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-[14px] font-semibold text-brand opacity-0 transition-opacity group-hover:opacity-100">
          Solicitar este trámite →
        </span>
      </Link>
    </motion.div>
  );
}
