"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SERVICES } from "../../content";
import { ESTADOS, PRIORIDADES, type Estado, type Prioridad, type Solicitud } from "../lib/types";
import {
  addDocumentoPersonalizado,
  addNota,
  deleteSolicitud,
  getSolicitud,
  removeDocumentoPersonalizado,
  toggleDocumento,
  toggleFase,
  updateEstado,
  updatePrioridad,
  updateRespuesta,
} from "../lib/storage";
import { computeViabilidad, PREGUNTAS } from "../lib/questions";
import { FASES, contarCompletadas } from "../lib/fases";
import { contarRecibidos } from "../lib/documentos";
import { EstadoBadge, PrioridadBadge, ViabilidadBadge } from "../components/Badges";
import { Section } from "../components/Section";
import { ProgressBar } from "../components/ProgressBar";
import { ArchivosSection } from "../components/ArchivosSection";
import { AgendaCaso } from "../components/AgendaCaso";
import { PanelButton } from "../components/PanelButton";
import {
  IconClock,
  IconFileText,
  IconListChecks,
  IconMail,
  IconMessageSquare,
  IconPhone,
  IconShieldCheck,
  IconTrash,
} from "../components/Icons";

export default function SolicitudDetalle({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [solicitud, setSolicitud] = useState<Solicitud | null | undefined>(undefined);
  const [nuevaNota, setNuevaNota] = useState("");
  const [nuevoDocumento, setNuevoDocumento] = useState("");

  const reload = () => getSolicitud(id).then((s) => setSolicitud(s ?? null));

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (solicitud === undefined) {
    return <div className="text-white/35">Cargando solicitud...</div>;
  }

  if (solicitud === null) {
    return (
      <div className="text-white/55">
        Solicitud no encontrada.{" "}
        <Link href="/admin" className="text-brand">
          Volver
        </Link>
      </div>
    );
  }

  const tramite = SERVICES.find((s) => s.slug === solicitud.tramiteSlug);
  const preguntas = PREGUNTAS[solicitud.tramiteSlug] ?? [];
  const viabilidad = computeViabilidad(solicitud.tramiteSlug, solicitud.respuestas);
  const iniciales = solicitud.clienteNombre
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 backdrop-blur-sm"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand/15 text-xl font-semibold text-[#9ba0ff]">
                {iniciales || "?"}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-semibold tracking-tight text-white">
                    {solicitud.clienteNombre}
                  </h1>
                  <span className="rounded-full bg-white/8 px-2.5 py-0.5 font-mono text-[12px] text-white/45">
                    {solicitud.folio}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${
                      solicitud.origen === "Sitio web"
                        ? "bg-emerald-400/15 text-emerald-300"
                        : "bg-white/8 text-white/45"
                    }`}
                  >
                    {solicitud.origen}
                  </span>
                </div>
                <p className="mt-1 text-sm text-white/55">
                  {tramite?.title} — {solicitud.variante} · {solicitud.nacionalidad}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-[13px] text-white/40">
                  <span className="flex items-center gap-1.5">
                    <IconPhone className="h-3.5 w-3.5" />
                    {solicitud.clienteTelefono || "—"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <IconMail className="h-3.5 w-3.5" />
                    {solicitud.clienteEmail || "—"}
                  </span>
                </div>
                {solicitud.esParaOtraPersona && (
                  <div className="mt-3 rounded-xl border border-gold/25 bg-gold/10 px-3 py-2 text-[13px] text-white/65">
                    <span className="font-semibold text-gold">
                      Trámite gestionado por otra persona:
                    </span>{" "}
                    {solicitud.contactoNombre || "—"}
                    {solicitud.contactoTelefono && ` · ${solicitud.contactoTelefono}`}
                    {solicitud.contactoEmail && ` · ${solicitud.contactoEmail}`}
                  </div>
                )}
              </div>
            </div>
            <motion.div
              key={`${solicitud.estado}-${solicitud.prioridad}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-end gap-2"
            >
              <PrioridadBadge prioridad={solicitud.prioridad} />
              <EstadoBadge estado={solicitud.estado} />
              <ViabilidadBadge viabilidad={viabilidad} />
            </motion.div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-6 border-t border-white/6 pt-5">
            <div className="flex items-center gap-3">
              <label className="text-[13px] font-medium text-white/55">
                Estado
              </label>
              <select
                value={solicitud.estado}
                onChange={async (e) => {
                  await updateEstado(id, e.target.value as Estado);
                  reload();
                }}
                className="rounded-xl border border-white/12 bg-white/5 px-3 py-2 text-sm text-white/80 transition-colors hover:border-white/25"
              >
                {ESTADOS.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-[13px] font-medium text-white/55">
                Prioridad
              </label>
              <select
                value={solicitud.prioridad}
                onChange={async (e) => {
                  await updatePrioridad(id, e.target.value as Prioridad);
                  reload();
                }}
                className="rounded-xl border border-white/12 bg-white/5 px-3 py-2 text-sm text-white/80 transition-colors hover:border-white/25"
              >
                {PRIORIDADES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        <Section
          icon={<IconListChecks />}
          title="Fases del trámite"
          subtitle="Marca cada fase conforme avanza el caso."
          tone="brand"
          right={
            <ProgressBar
              value={contarCompletadas(solicitud.fases)}
              total={FASES.length}
            />
          }
        >
          <ul className="space-y-3">
            {FASES.map((fase) => {
              const progreso = solicitud.fases[fase];
              return (
                <li
                  key={fase}
                  className="flex items-center justify-between gap-4 border-b border-white/6 pb-3 last:border-0 last:pb-0"
                >
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={progreso.completada}
                      onChange={async () => {
                        await toggleFase(id, fase);
                        reload();
                      }}
                      className="h-4 w-4 accent-brand"
                    />
                    <span
                      className={`text-sm transition-colors ${
                        progreso.completada
                          ? "text-white/50 line-through"
                          : "text-white/80"
                      }`}
                    >
                      {fase}
                    </span>
                  </label>
                  {progreso.completada && progreso.fecha && (
                    <span className="text-[12px] text-white/35">
                      {new Date(progreso.fecha).toLocaleDateString("es-MX")}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </Section>

        <Section
          icon={<IconFileText />}
          title="Documentos solicitados"
          subtitle="Marca lo que el cliente ya entregó, o añade documentos extra para este caso."
          tone="gold"
          right={
            <ProgressBar
              value={contarRecibidos(solicitud.documentos)}
              total={solicitud.documentos.length}
              tone="gold"
            />
          }
        >
          <ul className="space-y-3">
            {solicitud.documentos.map((doc) => (
              <li
                key={doc.id}
                className="flex items-center justify-between gap-4 border-b border-white/6 pb-3 last:border-0 last:pb-0"
              >
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={doc.recibido}
                    onChange={async () => {
                      await toggleDocumento(id, doc.id);
                      reload();
                    }}
                    className="h-4 w-4 accent-gold"
                  />
                  <span
                    className={`text-sm transition-colors ${
                      doc.recibido ? "text-white/50 line-through" : "text-white/80"
                    }`}
                  >
                    {doc.nombre}
                  </span>
                  {doc.personalizado && (
                    <span className="rounded-full bg-white/8 px-2 py-0.5 text-[11px] text-white/35">
                      Extra
                    </span>
                  )}
                </label>
                <div className="flex items-center gap-3">
                  {doc.recibido && doc.fecha && (
                    <span className="text-[12px] text-white/35">
                      {new Date(doc.fecha).toLocaleDateString("es-MX")}
                    </span>
                  )}
                  {doc.personalizado && (
                    <button
                      onClick={async () => {
                        await removeDocumentoPersonalizado(id, doc.id);
                        reload();
                      }}
                      className="text-[12px] text-rose hover:underline"
                    >
                      Quitar
                    </button>
                  )}
                </div>
              </li>
            ))}
            {solicitud.documentos.length === 0 && (
              <li className="text-sm text-white/35">
                Este trámite no tiene documentos configurados.
              </li>
            )}
          </ul>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!nuevoDocumento.trim()) return;
              await addDocumentoPersonalizado(id, nuevoDocumento.trim());
              setNuevoDocumento("");
              reload();
            }}
            className="mt-4 flex gap-2"
          >
            <input
              value={nuevoDocumento}
              onChange={(e) => setNuevoDocumento(e.target.value)}
              placeholder="Añadir documento adicional..."
              className="flex-1 rounded-xl border border-white/12 bg-white/5 px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-gold"
            />
            <PanelButton type="submit" variant="gold">
              Añadir
            </PanelButton>
          </form>
        </Section>

        <ArchivosSection solicitudId={id} />

        <Section
          icon={<IconShieldCheck />}
          title="Preguntas clave de viabilidad"
          subtitle="Determina si este caso es atendible según su situación."
          tone={viabilidad === "No viable" ? "rose" : viabilidad === "Viable" ? "emerald" : "ink"}
        >
          <div className="space-y-4">
            {preguntas.length === 0 && (
              <p className="text-sm text-white/35">
                Este trámite no tiene preguntas de evaluación configuradas.
              </p>
            )}
            {preguntas.map((p) => {
              const valor = solicitud.respuestas[p.id];
              return (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-4 border-b border-white/6 pb-3 last:border-0 last:pb-0"
                >
                  <p className="text-sm text-white/80">{p.texto}</p>
                  <div className="flex gap-2">
                    {[
                      { label: "Sí", val: true },
                      { label: "No", val: false },
                    ].map((opt) => (
                      <motion.button
                        key={opt.label}
                        whileTap={{ scale: 0.93 }}
                        onClick={async () => {
                          await updateRespuesta(id, p.id, opt.val);
                          reload();
                        }}
                        className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
                          valor === opt.val
                            ? opt.val === p.redFlag
                              ? "bg-rose text-white"
                              : "bg-brand text-white"
                            : "bg-white/8 text-white/45 hover:bg-white/15"
                        }`}
                      >
                        {opt.label}
                      </motion.button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        <Section
          icon={<IconMessageSquare />}
          title="Notas iniciales"
          tone="ink"
          collapsible={false}
        >
          <p className="whitespace-pre-wrap text-sm text-white/65">
            {solicitud.notas || "—"}
          </p>
        </Section>

        <Section
          icon={<IconClock />}
          title="Bitácora de seguimiento"
          subtitle="Añade notas sin perder el historial anterior."
          tone="sky"
          right={
            <span className="rounded-full bg-white/8 px-2.5 py-1 text-[12px] text-white/45">
              {solicitud.bitacora.length}
            </span>
          }
        >
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!nuevaNota.trim()) return;
              await addNota(id, nuevaNota.trim());
              setNuevaNota("");
              reload();
            }}
            className="flex gap-2"
          >
            <input
              value={nuevaNota}
              onChange={(e) => setNuevaNota(e.target.value)}
              placeholder="Añadir nota de seguimiento..."
              className="flex-1 rounded-xl border border-white/12 bg-white/5 px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-brand"
            />
            <PanelButton type="submit">Añadir</PanelButton>
          </form>

          <ul className="mt-4 space-y-3">
            {[...solicitud.bitacora].reverse().map((n) => (
              <motion.li
                key={n.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                className="border-l-2 border-brand/30 pl-3"
              >
                <p className="text-[12px] text-white/35">
                  {new Date(n.fecha).toLocaleString("es-MX")}
                </p>
                <p className="text-sm text-white/80">{n.texto}</p>
              </motion.li>
            ))}
            {solicitud.bitacora.length === 0 && (
              <li className="text-sm text-white/35">Sin notas todavía.</li>
            )}
          </ul>
        </Section>

        <AgendaCaso solicitudId={id} />
      </div>

      <div className="space-y-6">
        <Section icon={<IconClock />} title="Historial" tone="violet">
          <ul className="space-y-3">
            {[...solicitud.historial].reverse().map((h, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="mt-1.5 h-2 w-2 rounded-full bg-brand" />
                <div>
                  <p className="text-sm font-medium text-white">{h.estado}</p>
                  <p className="text-[12px] text-white/35">
                    {new Date(h.fecha).toLocaleString("es-MX")}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        <PanelButton
          variant="danger"
          className="w-full py-2.5"
          onClick={async () => {
            if (confirm("¿Eliminar esta solicitud? Esta acción no se puede deshacer.")) {
              await deleteSolicitud(id);
              router.push("/admin");
            }
          }}
        >
          <IconTrash className="h-4 w-4" />
          Eliminar solicitud
        </PanelButton>
      </div>
    </div>
  );
}
