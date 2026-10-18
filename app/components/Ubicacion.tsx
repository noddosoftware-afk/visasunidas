import { LOCATION } from "../content";
import { Reveal } from "./Reveal";

export function Ubicacion() {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(LOCATION.mapsQuery)}&output=embed`;

  return (
    <section id="ubicacion" className="bg-paper py-24">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="grid gap-10 md:grid-cols-[1fr_1.1fr] md:items-center">
          <Reveal>
            <h2 className="font-serif-display text-[clamp(1.9rem,3.6vw,3rem)] font-medium leading-tight text-ink">
              Nuestra ubicación
            </h2>
            <p className="mt-4 max-w-md text-[17px] leading-relaxed text-ink/70">
              {LOCATION.direccion}
            </p>
            <a
              href={LOCATION.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 text-[17px] font-semibold text-white"
            >
              Cómo llegar ↗
            </a>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="overflow-hidden bg-ink/5">
              <iframe
                title="Ubicación de Visas Unidas"
                src={mapSrc}
                width="100%"
                height="340"
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
