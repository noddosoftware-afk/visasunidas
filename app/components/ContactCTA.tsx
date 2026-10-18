"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SERVICES } from "../content";
import { NACIONALIDADES, esElegiblePorNacionalidad, type Nacionalidad } from "../lib/nacionalidad";
import { createSolicitud } from "../admin/lib/storage";
import { Reveal } from "./Reveal";

type ParaQuien = "yo" | "otra";

export function ContactCTA() {
  const [sent, setSent] = useState(false);
  const [noElegible, setNoElegible] = useState(false);
  const [paraQuien, setParaQuien] = useState<ParaQuien>("yo");
  const [nacionalidadPropia, setNacionalidadPropia] = useState<Nacionalidad | "">("");
  const [nacionalidadPersona, setNacionalidadPersona] = useState<Nacionalidad | "">("");
  const [personaNombre, setPersonaNombre] = useState("");
  const [personaTelefono, setPersonaTelefono] = useState("");
  const [contactoNombre, setContactoNombre] = useState("");
  const [contactoTelefono, setContactoTelefono] = useState("");
  const [tramiteSlug, setTramiteSlug] = useState("");

  function evaluarNacionalidad(valor: string, deOtraPersona: boolean) {
    const n = valor as Nacionalidad;
    if (deOtraPersona) setNacionalidadPersona(n);
    else setNacionalidadPropia(n);

    if (!esElegiblePorNacionalidad(n)) {
      setNoElegible(true);
    }
  }

  function resetElegibilidad() {
    setNoElegible(false);
    setNacionalidadPropia("");
    setNacionalidadPersona("");
  }

  return (
    <section id="contacto" className="relative overflow-hidden bg-ink py-28">
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand/25 blur-[120px]" />
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-gold/15 blur-[120px]" />

      <div className="relative mx-auto max-w-3xl px-6 text-center text-white">
        <Reveal>
          <p className="text-[16px] font-semibold uppercase tracking-[0.2em] text-gold">
            Agenda tu consulta en línea
          </p>
          <h2 className="font-serif-display mt-4 text-[clamp(2rem,4vw,3rem)] font-medium leading-tight">
            ¿Cómo podemos ayudarte?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-[18px] leading-relaxed text-white/85">
            Cuéntanos tu caso y un asesor te contactará para resolverlo de
            corazón, sin compromiso.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-12">
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto max-w-md rounded-3xl border border-white/15 bg-white/5 p-10"
            >
              <p className="text-xl font-medium">
                Gracias — recibimos tu solicitud.
              </p>
              <p className="mt-2 text-[17px] text-white/75">
                Un asesor de Visas Unidas te contactará muy pronto.
              </p>
            </motion.div>
          ) : noElegible ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto max-w-md rounded-3xl border border-white/15 bg-white/5 p-10"
            >
              <p className="text-xl font-medium">
                Por ahora no podemos ayudar con este trámite.
              </p>
              <p className="mt-2 text-[17px] text-white/75">
                Nuestros servicios están enfocados en personas de nacionalidad
                mexicana o estadounidense. Te recomendamos buscar asesoría
                específica para este caso.
              </p>
              <button
                onClick={resetElegibilidad}
                className="mt-5 text-[15px] font-medium text-gold hover:underline"
              >
                ← Volver al formulario
              </button>
            </motion.div>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const esOtra = paraQuien === "otra";
                await createSolicitud({
                  clienteNombre: esOtra ? personaNombre : contactoNombre,
                  clienteTelefono: esOtra
                    ? personaTelefono || contactoTelefono
                    : contactoTelefono,
                  clienteEmail: "",
                  tramiteSlug: tramiteSlug || "otro",
                  variante: "",
                  notas: "",
                  esParaOtraPersona: esOtra,
                  contactoNombre,
                  contactoTelefono,
                  contactoEmail: "",
                  nacionalidad: (esOtra ? nacionalidadPersona : nacionalidadPropia) || "Mexicana",
                  origen: "Sitio web",
                });
                setSent(true);
              }}
              className="mx-auto grid max-w-md gap-5 rounded-3xl border border-white/15 bg-white/5 p-8 text-left backdrop-blur-sm"
            >
              <label className="text-[15px] font-medium uppercase tracking-wide text-white/70">
                Nombre completo (quien llena este formulario)
                <input
                  required
                  value={contactoNombre}
                  onChange={(e) => setContactoNombre(e.target.value)}
                  placeholder="Tu nombre"
                  className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-[17px] text-white placeholder:text-white/50 outline-none transition-colors focus:border-brand"
                />
              </label>

              <label className="text-[15px] font-medium uppercase tracking-wide text-white/70">
                Teléfono
                <input
                  required
                  type="tel"
                  value={contactoTelefono}
                  onChange={(e) => setContactoTelefono(e.target.value)}
                  placeholder="(55) 0000 0000"
                  className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-[17px] text-white placeholder:text-white/50 outline-none transition-colors focus:border-brand"
                />
              </label>

              <label className="text-[15px] font-medium uppercase tracking-wide text-white/70">
                ¿Este trámite es para ti o para otra persona?
                <select
                  value={paraQuien}
                  onChange={(e) => {
                    setParaQuien(e.target.value as ParaQuien);
                    resetElegibilidad();
                  }}
                  className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-[17px] text-white outline-none transition-colors focus:border-brand [&>option]:text-ink"
                >
                  <option value="yo">Es para mí</option>
                  <option value="otra">Es para otra persona</option>
                </select>
              </label>

              {paraQuien === "yo" ? (
                <label className="text-[15px] font-medium uppercase tracking-wide text-white/70">
                  Tu nacionalidad
                  <select
                    required
                    value={nacionalidadPropia}
                    onChange={(e) => evaluarNacionalidad(e.target.value, false)}
                    className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-[17px] text-white outline-none transition-colors focus:border-brand [&>option]:text-ink"
                  >
                    <option value="" disabled>
                      Selecciona una opción
                    </option>
                    {NACIONALIDADES.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </label>
              ) : (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-gold/25 bg-gold/10 p-4"
                  >
                    <p className="text-[13px] font-semibold uppercase tracking-wide text-gold">
                      Información de la persona
                    </p>
                    <div className="mt-3 grid gap-4">
                      <label className="text-[13px] font-medium uppercase tracking-wide text-white/60">
                        Nombre completo de la persona
                        <input
                          required
                          value={personaNombre}
                          onChange={(e) => setPersonaNombre(e.target.value)}
                          placeholder="Nombre de la persona"
                          className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-[16px] text-white placeholder:text-white/40 outline-none transition-colors focus:border-brand"
                        />
                      </label>
                      <label className="text-[13px] font-medium uppercase tracking-wide text-white/60">
                        Teléfono de la persona (opcional)
                        <input
                          type="tel"
                          value={personaTelefono}
                          onChange={(e) => setPersonaTelefono(e.target.value)}
                          placeholder="(55) 0000 0000"
                          className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-[16px] text-white placeholder:text-white/40 outline-none transition-colors focus:border-brand"
                        />
                      </label>
                      <label className="text-[13px] font-medium uppercase tracking-wide text-white/60">
                        Nacionalidad de la persona
                        <select
                          required
                          value={nacionalidadPersona}
                          onChange={(e) => evaluarNacionalidad(e.target.value, true)}
                          className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-[16px] text-white outline-none transition-colors focus:border-brand [&>option]:text-ink"
                        >
                          <option value="" disabled>
                            Selecciona una opción
                          </option>
                          {NACIONALIDADES.map((n) => (
                            <option key={n} value={n}>
                              {n}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}

              <label className="text-[15px] font-medium uppercase tracking-wide text-white/70">
                Tipo de trámite
                <select
                  required
                  value={tramiteSlug}
                  onChange={(e) => setTramiteSlug(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-[17px] text-white outline-none transition-colors focus:border-brand [&>option]:text-ink"
                >
                  <option value="" disabled>
                    Selecciona una opción
                  </option>
                  {SERVICES.map((s) => (
                    <option key={s.slug} value={s.slug}>
                      {s.title}
                    </option>
                  ))}
                  <option value="otro">Otro</option>
                </select>
              </label>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-2 rounded-full bg-brand px-6 py-4 text-[17px] font-semibold text-white shadow-[0_10px_26px_-8px_rgba(41,48,249,0.7)]"
              >
                Enviar solicitud →
              </motion.button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
