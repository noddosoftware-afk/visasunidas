"use client";
import { motion } from "framer-motion";
import { Button } from "./Button";

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[92vh] flex-col justify-between bg-ink px-6 pb-14 pt-32 text-white md:px-10 md:pb-16"
    >
      <motion.h1
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="font-serif-display max-w-5xl text-[clamp(3rem,9.5vw,7.2rem)] font-medium leading-[0.96] tracking-tight"
      >
        Reunificación
        <br />
        familiar.
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="mt-16 flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
      >
        <p className="max-w-md text-[21px] leading-relaxed text-white/80">
          Somos una empresa americana enfocada en resolver tus necesidades de
          trámites migratorios: consultoría, preparación y elaboración de
          visas, perdones legales y residencia americana.
        </p>
        <div className="flex flex-wrap items-center gap-5">
          <Button href="#contacto">Agenda tu consulta</Button>
          <Button href="#servicios" variant="ghost">Ver servicios</Button>
        </div>
      </motion.div>
    </section>
  );
}
