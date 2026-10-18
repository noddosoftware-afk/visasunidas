"use client";
import { motion } from "framer-motion";
import { ACROSTIC } from "../content";
import { Reveal } from "./Reveal";

const rowVariants = {
  hidden: { opacity: 0, x: -16 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
  },
};

function AcrosticList({
  title,
  items,
  tone,
}: {
  title: string;
  items: { letter: string; word: string }[];
  tone: "brand" | "gold";
}) {
  const accent = tone === "gold" ? "border-l-gold" : "border-l-brand";
  const chip = tone === "gold" ? "bg-gold/15 text-gold" : "bg-brand/10 text-brand";
  const label = tone === "gold" ? "text-gold" : "text-brand";
  return (
    <div>
      <p className={`text-[12px] font-bold uppercase tracking-[0.25em] ${label}`}>
        {title}
      </p>
      <div className="mt-2 flex flex-col gap-1.5">
        {items.map((item, i) => (
          <motion.div
            key={item.letter + i}
            variants={rowVariants}
            className={`flex items-center gap-3 rounded-xl border border-l-4 border-ink/8 bg-white px-3.5 py-2 shadow-[0_2px_8px_-6px_rgba(10,14,42,0.08)] ${accent}`}
          >
            <span
              className={`font-serif-display flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[15px] font-medium ${chip}`}
            >
              {item.letter}
            </span>
            <span className="text-[15px] font-medium text-ink/80">
              {item.word}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function Acrostic() {
  const visas = ACROSTIC.slice(0, 5);
  const unidas = ACROSTIC.slice(5);

  return (
    <section id="historia" className="bg-paper py-28">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto max-w-xl text-center">
          <p className="text-[16px] font-semibold uppercase tracking-[0.2em] text-brand">
            Nuestro nombre
          </p>
          <h2 className="font-serif-display mt-4 text-[clamp(1.9rem,3.2vw,2.8rem)] font-medium">
            ¿Qué significa Visas Unidas?
          </h2>
        </Reveal>

        {/* Móvil: lista vertical agrupada por VISAS / UNIDAS */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
          className="mt-8 space-y-5 sm:hidden"
        >
          <AcrosticList title="Visas" items={visas} tone="brand" />
          <AcrosticList title="Unidas" items={unidas} tone="gold" />
        </motion.div>

        {/* Tablet / escritorio: grilla de tarjetas */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
          className="mt-16 hidden grid-cols-3 gap-3 sm:grid md:grid-cols-4 lg:grid-cols-11 lg:gap-2"
        >
          {ACROSTIC.map((item, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover={{ y: -6 }}
              className="group relative flex flex-col items-center rounded-2xl border border-ink/8 bg-white p-4 text-center shadow-[0_2px_10px_-4px_rgba(10,14,42,0.08)] transition-shadow hover:shadow-[0_16px_30px_-10px_rgba(41,48,249,0.25)] lg:p-3"
            >
              <span className="font-serif-display text-3xl font-medium text-brand transition-colors group-hover:text-gold">
                {item.letter}
              </span>
              <span className="mt-2 text-[14px] font-medium leading-tight text-ink/70 lg:text-[13px]">
                {item.word}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
