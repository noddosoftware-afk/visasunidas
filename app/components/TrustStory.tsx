"use client";
import { Reveal } from "./Reveal";

const HECHOS = [
  { label: "Qué somos", value: "Despacho migratorio" },
  { label: "Dónde", value: "Riverside, California" },
  { label: "Cómo trabajamos", value: "Sin fines de lucro" },
];

export function TrustStory() {
  return (
    <section id="nosotros" className="bg-ink py-24 text-white md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="grid gap-12 md:grid-cols-[220px_1fr] md:gap-16">
          <Reveal>
            <dl className="flex flex-col gap-9">
              {HECHOS.map((h) => (
                <div key={h.label}>
                  <dt className="text-[14px] text-white/45">{h.label}</dt>
                  <dd className="mt-1 text-[17px] font-medium text-white">
                    {h.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="max-w-xl text-[clamp(1.4rem,2.6vw,2.25rem)] font-medium leading-[1.25] text-white">
              De corazón, sin lucrar, para que las familias{" "}
              <span className="text-gold">vuelvan a reencontrarse.</span>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
