"use client";
import Image from "next/image";
import { Reveal } from "./Reveal";

export function TrustStory() {
  return (
    <section id="nosotros" className="relative bg-ink py-28 text-white">
      <div className="mx-auto grid max-w-6xl items-center gap-16 px-6 md:grid-cols-[0.8fr_1fr]">
        <Reveal>
          <div className="relative mx-auto w-full max-w-[280px]">
            <div className="absolute inset-0 scale-125 rounded-full bg-brand/20 blur-3xl" />
            <Image
              src="/logo.svg"
              alt="Corazón Visas Unidas"
              width={280}
              height={280}
              className="relative"
            />
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="text-[16px] font-semibold uppercase tracking-[0.2em] text-gold">
            ¿Por qué el corazón?
          </p>
          <h2 className="font-serif-display mt-4 text-[clamp(1.9rem,3.2vw,2.8rem)] font-medium leading-tight">
            El corazón representa la esencia de nuestra empresa y de
            nuestros colaboradores.
          </h2>
          <p className="mt-6 max-w-xl text-[19px] leading-relaxed text-white/85">
            De corazón apoyamos a nuestra comunidad latina{" "}
            <span className="font-medium text-white">
              sin lucrar en Estados Unidos
            </span>{" "}
            para que vuelvan a reencontrarse con sus seres queridos.
          </p>
          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-5 py-3.5 text-[17px]">
            <span className="h-2 w-2 rounded-full bg-rose" />
            Compromiso sin fines de lucro, de familia a familia.
          </div>
        </Reveal>
      </div>
    </section>
  );
}
