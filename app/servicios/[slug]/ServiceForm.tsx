"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { NACIONALIDADES, esElegiblePorNacionalidad, type Nacionalidad } from "../../lib/nacionalidad";
import { createSolicitud } from "../../admin/lib/storage";

interface Service {
  slug: string;
  title: string;
  variantes: readonly string[];
}

type ParaQuien = "yo" | "otra";

export function ServiceForm({ service }: { service: Service }) {
  const [sent, setSent] = useState(false);
  const [noElegible, setNoElegible] = useState(false);
  const [paraQuien, setParaQuien] = useState<ParaQuien>("yo");
  const [nacionalidadPropia, setNacionalidadPropia] = useState<Nacionalidad | "">("");
  const [nacionalidadPersona, setNacionalidadPersona] = useState<Nacionalidad | "">("");
  const [personaNombre, setPersonaNombre] = useState("");
  const [personaTelefono, setPersonaTelefono] = useState("");
  const [variante, setVariante] = useState(service.variantes[0]);
  const [contactoNombre, setContactoNombre] = useState("");
  const [contactoTelefono, setContactoTelefono] = useState("");
  const [contactoEmail, setContactoEmail] = useState("");
  const [mensaje, setMensaje] = useState("");

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

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mt-10 rounded-3xl border border-ink/10 bg-white p-10 text-center shadow-[0_2px_14px_-8px_rgba(10,14,42,0.1)]"
      >
        <p className="text-xl font-medium text-ink">
          Gracias — recibimos tu solicitud de {service.title}.
        </p>
        <p className="mt-2 text-[17px] text-ink/60">
          Un asesor de Visas Unidas te contactará muy pronto para continuar
          con tu trámite ({variante}).
        </p>
        <Link
          href="/servicios"
          className="mt-5 inline-block text-[15px] font-medium text-brand hover:underline"
        >
          ← Ver otros servicios
        </Link>
      </motion.div>
    );
  }

  if (noElegible) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mt-10 rounded-3xl border border-rose/20 bg-rose/5 p-10 text-center"
      >
        <p className="text-xl font-medium text-ink">
          Por ahora no podemos ayudar con este trámite.
        </p>
        <p className="mt-2 text-[17px] text-ink/60">
          Nuestros servicios están enfocados en personas de nacionalidad
          mexicana o estadounidense. Te recomendamos buscar asesoría
          específica para este caso.
        </p>
        <button
          onClick={resetElegibilidad}
          className="mt-5 text-[15px] font-medium text-brand hover:underline"
        >
          ← Volver al formulario
        </button>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={(e) => {
        e.preventDefault();
        const esOtra = paraQuien === "otra";
        createSolicitud({
          clienteNombre: esOtra ? personaNombre : contactoNombre,
          clienteTelefono: esOtra ? personaTelefono || contactoTelefono : contactoTelefono,
          clienteEmail: contactoEmail,
          tramiteSlug: service.slug,
          variante,
          notas: mensaje,
          esParaOtraPersona: esOtra,
          contactoNombre,
          contactoTelefono,
          contactoEmail,
          nacionalidad: (esOtra ? nacionalidadPersona : nacionalidadPropia) || "Mexicana",
          origen: "Sitio web",
        });
        setSent(true);
      }}
      className="mt-10 grid gap-5 rounded-3xl border border-ink/10 bg-white p-8 shadow-[0_2px_14px_-8px_rgba(10,14,42,0.1)]"
    >
      <Field label="Nombre completo (quien llena este formulario)">
        <input
          required
          value={contactoNombre}
          onChange={(e) => setContactoNombre(e.target.value)}
          placeholder="Tu nombre"
          className="input"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Teléfono">
          <input
            required
            type="tel"
            value={contactoTelefono}
            onChange={(e) => setContactoTelefono(e.target.value)}
            placeholder="(55) 0000 0000"
            className="input"
          />
        </Field>
        <Field label="Email">
          <input
            required
            type="email"
            value={contactoEmail}
            onChange={(e) => setContactoEmail(e.target.value)}
            placeholder="tu@email.com"
            className="input"
          />
        </Field>
      </div>

      <Field label="¿Este trámite es para ti o para otra persona?">
        <select
          value={paraQuien}
          onChange={(e) => {
            setParaQuien(e.target.value as ParaQuien);
            resetElegibilidad();
          }}
          className="input"
        >
          <option value="yo">Es para mí</option>
          <option value="otra">Es para otra persona</option>
        </select>
      </Field>

      {paraQuien === "yo" ? (
        <Field label="Tu nacionalidad">
          <select
            required
            value={nacionalidadPropia}
            onChange={(e) => evaluarNacionalidad(e.target.value, false)}
            className="input"
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
        </Field>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-brand/20 bg-brand/5 p-5"
          >
            <p className="text-[13px] font-semibold uppercase tracking-wide text-brand">
              Información de la persona
            </p>
            <div className="mt-3 grid gap-4">
              <Field label="Nombre completo de la persona">
                <input
                  required
                  value={personaNombre}
                  onChange={(e) => setPersonaNombre(e.target.value)}
                  placeholder="Nombre de la persona"
                  className="input"
                />
              </Field>
              <Field label="Teléfono de la persona (opcional)">
                <input
                  type="tel"
                  value={personaTelefono}
                  onChange={(e) => setPersonaTelefono(e.target.value)}
                  placeholder="(55) 0000 0000"
                  className="input"
                />
              </Field>
              <Field label="Nacionalidad de la persona">
                <select
                  required
                  value={nacionalidadPersona}
                  onChange={(e) => evaluarNacionalidad(e.target.value, true)}
                  className="input"
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
              </Field>
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      <Field label={`Variante de ${service.title}`}>
        <select
          value={variante}
          onChange={(e) => setVariante(e.target.value)}
          className="input"
        >
          {service.variantes.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Cuéntanos la situación (opcional)">
        <textarea
          rows={4}
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="Detalles que nos ayuden a entender el caso..."
          className="input resize-none"
        />
      </Field>

      <motion.button
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.98 }}
        className="mt-1 rounded-full bg-brand py-4 text-[17px] font-semibold text-white shadow-[0_10px_24px_-10px_rgba(41,48,249,0.6)]"
      >
        Enviar solicitud →
      </motion.button>

      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgba(10, 14, 42, 0.15);
          padding: 0.8rem 1rem;
          font-size: 16px;
          outline: none;
          background: white;
          transition: border-color 0.15s ease;
        }
        .input:hover {
          border-color: rgba(10, 14, 42, 0.25);
        }
        .input:focus {
          border-color: var(--brand);
        }
      `}</style>
    </motion.form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[14px] font-medium text-ink/70">
        {label}
      </span>
      {children}
    </label>
  );
}
