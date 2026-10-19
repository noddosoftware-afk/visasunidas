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
    <section id="contacto" className="bg-ink py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-[1fr_1.1fr] md:items-start md:gap-20 md:px-10">
        <Reveal>
          <h2 className="font-serif-display max-w-md text-[clamp(2rem,4.4vw,3.4rem)] font-medium leading-[1.1] text-white">
            ¿Cómo podemos ayudarte?
          </h2>
          <p className="mt-6 max-w-sm text-[21px] leading-relaxed text-white/75">
            Cuéntanos tu caso y un asesor te contactará para resolverlo de
            corazón, sin compromiso.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/[0.06] p-10"
            >
              <p className="text-xl font-medium text-white">
                Gracias — recibimos tu solicitud.
              </p>
              <p className="mt-2 text-[17px] text-white/70">
                Un asesor de Visas Unidas te contactará muy pronto.
              </p>
            </motion.div>
          ) : noElegible ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/[0.06] p-10"
            >
              <p className="text-xl font-medium text-white">
                Por ahora no podemos ayudar con este trámite.
              </p>
              <p className="mt-2 text-[17px] text-white/70">
                Nuestros servicios están enfocados en personas de nacionalidad
                mexicana o estadounidense. Te recomendamos buscar asesoría
                específica para este caso.
              </p>
              <button
                onClick={resetElegibilidad}
                className="mt-5 text-[14px] font-medium text-gold hover:underline"
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
              className="grid gap-4 bg-white/[0.06] p-7 text-left md:p-9"
            >
              <label className="text-[14px] font-medium text-white/60">
                Nombre completo (quien llena este formulario)
                <input
                  required
                  value={contactoNombre}
                  onChange={(e) => setContactoNombre(e.target.value)}
                  placeholder="Tu nombre"
                  className="mt-2 w-full bg-white/10 px-4 py-3.5 text-[17px] text-white placeholder:text-white/40 outline-none transition-colors focus:bg-white/[0.16]"
                />
              </label>

              <label className="text-[14px] font-medium text-white/60">
                Teléfono
                <input
                  required
                  type="tel"
                  value={contactoTelefono}
                  onChange={(e) => setContactoTelefono(e.target.value)}
                  placeholder="(55) 0000 0000"
                  className="mt-2 w-full bg-white/10 px-4 py-3.5 text-[17px] text-white placeholder:text-white/40 outline-none transition-colors focus:bg-white/[0.16]"
                />
              </label>

              <label className="text-[14px] font-medium text-white/60">
                ¿Este trámite es para ti o para otra persona?
                <select
                  value={paraQuien}
                  onChange={(e) => {
                    setParaQuien(e.target.value as ParaQuien);
                    resetElegibilidad();
                  }}
                  className="mt-2 w-full bg-white/10 px-4 py-3.5 text-[17px] text-white outline-none transition-colors focus:bg-white/[0.16] [&>option]:text-ink sel"
                >
                  <option value="yo">Es para mí</option>
                  <option value="otra">Es para otra persona</option>
                </select>
              </label>

              {paraQuien === "yo" ? (
                <label className="text-[14px] font-medium text-white/60">
                  Tu nacionalidad
                  <select
                    required
                    value={nacionalidadPropia}
                    onChange={(e) => evaluarNacionalidad(e.target.value, false)}
                    className="mt-2 w-full bg-white/10 px-4 py-3.5 text-[17px] text-white outline-none transition-colors focus:bg-white/[0.16] [&>option]:text-ink sel"
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
                    className="bg-gold/10 p-4"
                  >
                    <p className="text-[14px] font-semibold text-gold">
                      Información de la persona
                    </p>
                    <div className="mt-3 grid gap-4">
                      <label className="text-[14px] font-medium text-white/55">
                        Nombre completo de la persona
                        <input
                          required
                          value={personaNombre}
                          onChange={(e) => setPersonaNombre(e.target.value)}
                          placeholder="Nombre de la persona"
                          className="mt-2 w-full bg-white/10 px-4 py-3 text-[17px] text-white placeholder:text-white/35 outline-none transition-colors focus:bg-white/[0.16]"
                        />
                      </label>
                      <label className="text-[14px] font-medium text-white/55">
                        Teléfono de la persona (opcional)
                        <input
                          type="tel"
                          value={personaTelefono}
                          onChange={(e) => setPersonaTelefono(e.target.value)}
                          placeholder="(55) 0000 0000"
                          className="mt-2 w-full bg-white/10 px-4 py-3 text-[17px] text-white placeholder:text-white/35 outline-none transition-colors focus:bg-white/[0.16]"
                        />
                      </label>
                      <label className="text-[14px] font-medium text-white/55">
                        Nacionalidad de la persona
                        <select
                          required
                          value={nacionalidadPersona}
                          onChange={(e) => evaluarNacionalidad(e.target.value, true)}
                          className="mt-2 w-full bg-white/10 px-4 py-3 text-[17px] text-white outline-none transition-colors focus:bg-white/[0.16] [&>option]:text-ink sel"
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

              <label className="text-[14px] font-medium text-white/60">
                Tipo de trámite
                <select
                  required
                  value={tramiteSlug}
                  onChange={(e) => setTramiteSlug(e.target.value)}
                  className="mt-2 w-full bg-white/10 px-4 py-3.5 text-[17px] text-white outline-none transition-colors focus:bg-white/[0.16] [&>option]:text-ink sel"
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
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                className="mt-2 bg-brand px-6 py-4 text-[19px] font-semibold text-white"
              >
                Enviar solicitud
              </motion.button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
