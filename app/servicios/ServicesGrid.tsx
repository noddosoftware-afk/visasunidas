"use client";
import { motion } from "framer-motion";
import { SERVICES } from "../content";
import { ServiceCard } from "../components/ServiceCard";

export function ServicesGrid() {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
      className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
    >
      {SERVICES.map((s, i) => (
        <ServiceCard
          key={s.slug}
          slug={s.slug}
          title={s.title}
          detail={s.detail}
          index={i}
        />
      ))}
    </motion.div>
  );
}
