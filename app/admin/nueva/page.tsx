"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { SERVICES } from "../../content";
import { PRIORIDADES, type Prioridad } from "../lib/types";
import { createSolicitud } from "../lib/storage";
import { PanelButton } from "../components/PanelButton";
import {
  IconFilePlus,
  IconFlag,
  IconListChecks,
  IconUserPlus,
} from "../components/Icons";

export default function NuevaSolicitud() {
  const router = useRouter();
  const [tramiteSlug, setTramiteSlug] = useState<string>(SERVICES[0].slug);
  const [variante, setVariante] = useState<string>(SERVICES[0].variantes[0]);
  const [clienteNombre, setClienteNombre] = useState("");
  const [clienteTelefono, setClienteTelefono] = useState("");
  const [clienteEmail, setClienteEmail] = useState("");
  const [prioridad, setPrioridad] = useState<Prioridad>("Media");
  const [notas, setNotas] = useState("");

  const tramite = SERVICES.find((s) => s.slug === tramiteSlug)!;

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/15 text-[#9ba0ff]">
          <IconFilePlus />
        </span>
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Nueva solicitud
        </h1>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onSubmit={async (e) => {
          e.preventDefault();
          const s = await createSolicitud({
            clienteNombre,
            clienteTelefono,
            clienteEmail,
            tramiteSlug,
            variante,
            prioridad,
            notas,
          });
          router.push(`/admin/${s.id}`);
        }}
        className="mt-6 space-y-7 rounded-2xl border border-white/8 bg-white/[0.03] p-6 backdrop-blur-sm"
      >
        <FormGroup icon={<IconUserPlus className="h-4 w-4" />} label="Datos del cliente">
          <Field label="Nombre del cliente">
            <input
              required
              value={clienteNombre}
              onChange={(e) => setClienteNombre(e.target.value)}
              className="input"
            />
          </Field>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <Field label="Teléfono">
              <input
                value={clienteTelefono}
                onChange={(e) => setClienteTelefono(e.target.value)}
                className="input"
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                value={clienteEmail}
                onChange={(e) => setClienteEmail(e.target.value)}
                className="input"
              />
            </Field>
          </div>
        </FormGroup>

        <FormGroup icon={<IconListChecks className="h-4 w-4" />} label="Trámite">
          <Field label="Trámite">
            <select
              value={tramiteSlug}
              onChange={(e) => {
                const next = SERVICES.find((s) => s.slug === e.target.value)!;
                setTramiteSlug(next.slug);
                setVariante(next.variantes[0]);
              }}
              className="input sel"
            >
              {SERVICES.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.title}
                </option>
              ))}
            </select>
          </Field>

          <div className="mt-4">
            <Field label="Variante">
              <select
                value={variante}
                onChange={(e) => setVariante(e.target.value)}
                className="input sel"
              >
                {tramite.variantes.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </FormGroup>

        <FormGroup icon={<IconFlag className="h-4 w-4" />} label="Prioridad y notas">
          <Field label="Prioridad">
            <select
              value={prioridad}
              onChange={(e) => setPrioridad(e.target.value as Prioridad)}
              className="input sel"
            >
              {PRIORIDADES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </Field>

          <div className="mt-4">
            <Field label="Notas iniciales">
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                rows={3}
                className="input resize-none"
              />
            </Field>
          </div>
        </FormGroup>

        <PanelButton type="submit" className="w-full py-3.5 text-[15px]">
          Crear solicitud
        </PanelButton>
      </motion.form>

      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.12);
          padding: 0.65rem 0.9rem;
          font-size: 0.875rem;
          outline: none;
          background: rgba(255, 255, 255, 0.05);
          color: white;
          transition: border-color 0.15s ease;
        }
        .input::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }
        .input:hover {
          border-color: rgba(255, 255, 255, 0.25);
        }
        .input:focus {
          border-color: var(--brand);
        }
      `}</style>
    </div>
  );
}

function FormGroup({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2 border-b border-white/8 pb-3">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/8 text-white/45">
          {icon}
        </span>
        <h2 className="text-[13px] font-semibold uppercase tracking-wide text-white/45">
          {label}
        </h2>
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-white/65">
        {label}
      </span>
      {children}
    </label>
  );
}
