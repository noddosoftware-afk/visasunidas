"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "./Button";

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[94vh] items-center overflow-hidden pt-24"
    >
      <div className="absolute inset-0">
        <Image
          src="/hero.jpg"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-ink/20" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-5 text-[16px] font-semibold uppercase tracking-[0.2em] text-gold"
        >
          Podemos ayudarte
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif-display max-w-3xl text-[clamp(2.6rem,6vw,5.2rem)] font-medium leading-[1.03] text-white"
        >
          Reunificación{" "}
          <span className="italic text-white/90">familiar.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-7 max-w-lg text-[19px] leading-relaxed text-white/90"
        >
          Somos una empresa americana enfocada en resolver tus necesidades de
          trámites migratorios: consultoría, preparación y elaboración de
          visas, perdones legales y residencia americana.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Button href="#contacto">Agenda tu consulta →</Button>
          <Button href="#servicios" variant="ghost">
            <span className="!text-white/85">Ver servicios</span>
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="h-9 w-5 rounded-full border border-white/35 p-1"
        >
          <div className="h-1.5 w-1.5 rounded-full bg-white/70" />
        </motion.div>
      </motion.div>
    </section>
  );
}
