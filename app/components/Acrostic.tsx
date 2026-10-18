"use client";
import { motion } from "framer-motion";
import { ACROSTIC } from "../content";
import { Reveal } from "./Reveal";

export function Acrostic() {
  return (
    <section id="historia" className="bg-paper py-24 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <Reveal>
          <h2 className="font-serif-display max-w-xl text-[clamp(1.7rem,3vw,2.4rem)] font-medium leading-tight text-ink">
            ¿Qué significa Visas Unidas?
          </h2>
        </Reveal>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.045 } } }}
          className="mt-12"
        >
          {ACROSTIC.map((item, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, x: -24 },
                show: {
                  opacity: 1,
                  x: 0,
                  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                },
              }}
              whileHover={{ x: 8 }}
              className="group flex items-baseline justify-between gap-6 py-12 first:pt-0 odd:bg-paper-dim md:py-6 md:px-6"
            >
              <span className="font-serif-display text-[clamp(2.2rem,6vw,4.2rem)] font-medium leading-none text-ink transition-colors group-hover:text-brand">
                <span className="text-brand transition-colors group-hover:text-gold">
                  {item.letter}
                </span>
                <span className="ml-3 text-[0.42em] font-sans font-medium tracking-tight text-ink/70">
                  {item.word}
                </span>
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
