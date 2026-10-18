import { LOCATION } from "../content";
import { Reveal } from "./Reveal";

export function Ubicacion() {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(LOCATION.mapsQuery)}&output=embed`;

  return (
    <section id="ubicacion" className="bg-paper py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 md:grid-cols-[1fr_1.1fr] md:items-center">
          <Reveal>
            <p className="text-[16px] font-semibold uppercase tracking-[0.2em] text-brand">
              Visítanos
            </p>
            <h2 className="font-serif-display mt-4 text-[clamp(1.9rem,3.2vw,2.6rem)] font-medium">
              Nuestra ubicación
            </h2>
            <p className="mt-4 max-w-md text-[17px] leading-relaxed text-ink/70">
              {LOCATION.direccion}
            </p>
            <a
              href={LOCATION.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 text-[16px] font-semibold text-white shadow-[0_8px_20px_-8px_rgba(41,48,249,0.6)]"
            >
              Cómo llegar ↗
            </a>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="overflow-hidden rounded-3xl border border-ink/10 shadow-[0_8px_28px_-14px_rgba(10,14,42,0.2)]">
              <iframe
                title="Ubicación de Visas Unidas"
                src={mapSrc}
                width="100%"
                height="320"
                style={{ border: 0, display: "block" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
