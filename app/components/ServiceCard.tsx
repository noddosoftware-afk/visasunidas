"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export function ServiceCard({
  slug,
  title,
  detail,
}: {
  slug: string;
  title: string;
  detail: string;
  index: number;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
        },
      }}
    >
      <Link
        href={`/servicios/${slug}`}
        className="group flex flex-col gap-2 py-7 first:pt-0 md:flex-row md:items-baseline md:justify-between md:gap-10"
      >
        <h3 className="text-[clamp(1.3rem,2.4vw,1.75rem)] font-semibold text-ink transition-colors group-hover:text-brand">
          {title}
        </h3>
        <p className="max-w-md text-[17px] leading-relaxed text-ink/65 md:text-right">
          {detail}
        </p>
      </Link>
    </motion.div>
  );
}
