"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { SERVICES } from "../content";
import { Reveal } from "./Reveal";
import { ServiceCard } from "./ServiceCard";

export function Services() {
  const destacados = SERVICES.slice(0, 3);

  return (
    <section id="servicios" className="bg-paper-dim py-28">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto max-w-xl text-center">
          <p className="text-[16px] font-semibold uppercase tracking-[0.2em] text-brand">
            Cómo podemos ayudarte
          </p>
          <h2 className="font-serif-display mt-4 text-[clamp(1.9rem,3.2vw,2.8rem)] font-medium">
            Servicios
          </h2>
        </Reveal>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
          className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {destacados.map((s, i) => (
            <ServiceCard
              key={s.slug}
              slug={s.slug}
              title={s.title}
              detail={s.detail}
              index={i}
            />
          ))}
        </motion.div>

        <Reveal className="mt-10 text-center">
          <Link
            href="/servicios"
            className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-7 py-3.5 text-[16px] font-semibold text-ink transition-colors hover:border-brand hover:text-brand"
          >
            Ver todos los servicios ({SERVICES.length}) →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
