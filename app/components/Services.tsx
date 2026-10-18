"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { SERVICES } from "../content";
import { Reveal } from "./Reveal";
import { ServiceCard } from "./ServiceCard";

export function Services() {
  const destacados = SERVICES.slice(0, 3);

  return (
    <section id="servicios" className="bg-paper-dim py-24 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <h2 className="font-serif-display max-w-md text-[clamp(1.9rem,3.6vw,3rem)] font-medium leading-[1.1] text-ink">
              Cómo podemos ayudarte
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              href="/servicios"
              className="text-[17px] font-semibold text-brand underline-offset-4 hover:underline"
            >
              Ver los {SERVICES.length} servicios →
            </Link>
          </Reveal>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          className="mt-12"
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
      </div>
    </section>
  );
}
