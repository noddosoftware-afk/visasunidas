"use client";
import { motion } from "framer-motion";
import { ACROSTIC } from "../content";
import { Reveal } from "./Reveal";

type AcrosticItem = (typeof ACROSTIC)[number];

const VISAS = ACROSTIC.slice(0, 5);
const UNIDAS = ACROSTIC.slice(5);

function Fila({
  items,
  cols,
  delay,
}: {
  items: readonly AcrosticItem[];
  cols: string;
  delay: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.06, delayChildren: delay } },
      }}
      className={`grid gap-x-3 gap-y-10 ${cols}`}
    >
      {items.map((item, i) => (
        <motion.div
          key={i}
          variants={{
            hidden: { opacity: 0, y: 16 },
            show: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
            },
          }}
          whileHover={{ y: -4 }}
          className="group flex flex-col items-center text-center"
        >
          <span className="font-serif-display text-[clamp(2.1rem,6vw,4rem)] font-medium leading-none text-brand transition-colors group-hover:text-gold">
            {item.letter}
          </span>
          <span className="mt-3 text-[13px] font-medium leading-snug text-ink/65 sm:text-[14px]">
            {item.word}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}

export function Acrostic() {
  return (
    <section id="historia" className="bg-paper py-24 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <Reveal>
          <h2 className="font-serif-display max-w-xl text-[clamp(1.7rem,3vw,2.4rem)] font-medium leading-tight text-ink">
            ¿Qué significa Visas Unidas?
          </h2>
        </Reveal>

        <div className="mt-14 space-y-14">
          <Fila items={VISAS} cols="grid-cols-5" delay={0} />
          <Fila items={UNIDAS} cols="grid-cols-3 sm:grid-cols-6" delay={0.1} />
        </div>
      </div>
    </section>
  );
}
