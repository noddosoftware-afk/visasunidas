"use client";
import { useEffect, useState } from "react";
import {
  createEvento,
  deleteEvento,
  eventosPorSolicitud,
  TIPOS_EVENTO,
  type Evento,
  type TipoEvento,
} from "../lib/eventos";
import { Section } from "./Section";
import { PanelButton } from "./PanelButton";
import { IconCalendar, IconTrash } from "./Icons";

const TIPO_BADGE: Record<TipoEvento, string> = {
  Llamada: "bg-brand/10 text-brand",
  Cita: "bg-gold/15 text-gold",
  Otro: "bg-violet-100 text-violet-700",
};

export function AgendaCaso({ solicitudId }: { solicitudId: string }) {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [tipo, setTipo] = useState<TipoEvento>("Llamada");
  const [titulo, setTitulo] = useState("");

  const reload = () => eventosPorSolicitud(solicitudId).then(setEventos);

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solicitudId]);

  return (
    <Section
      icon={<IconCalendar />}
      title="Agenda de este caso"
      subtitle="Programa llamadas o citas y quedan en el calendario general."
      tone="gold"
      right={
        <span className="rounded-full bg-ink/6 px-2.5 py-1 text-[12px] text-ink/50">
          {eventos.length}
        </span>
      }
    >
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!fecha || !titulo.trim()) return;
          await createEvento({
            fecha,
            hora,
            tipo,
            titulo: titulo.trim(),
            nota: "",
            solicitudId,
          });
          setTitulo("");
          setHora("");
          reload();
        }}
        className="grid grid-cols-2 gap-2 sm:grid-cols-4"
      >
        <input
          type="date"
          required
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="col-span-2 rounded-lg border border-ink/15 px-2.5 py-2 text-[13px] sm:col-span-1"
        />
        <input
          type="time"
          value={hora}
          onChange={(e) => setHora(e.target.value)}
          className="rounded-lg border border-ink/15 px-2.5 py-2 text-[13px]"
        />
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value as TipoEvento)}
          className="rounded-lg border border-ink/15 px-2.5 py-2 text-[13px]"
        >
          {TIPOS_EVENTO.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <input
          required
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Título"
          className="col-span-2 rounded-lg border border-ink/15 px-2.5 py-2 text-[13px] sm:col-span-4"
        />
        <PanelButton type="submit" variant="gold" className="col-span-2 w-full py-2 text-[13px] sm:col-span-4">
          + Agendar
        </PanelButton>
      </form>

      <ul className="mt-4 space-y-2">
        {eventos.map((e) => (
          <li
            key={e.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-ink/8 px-3 py-2.5"
          >
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${TIPO_BADGE[e.tipo]}`}>
                {e.tipo}
              </span>
              <span className="text-[13px] text-ink/60">
                {new Date(e.fecha + "T00:00:00").toLocaleDateString("es-MX", {
                  day: "numeric",
                  month: "short",
                })}
                {e.hora && ` · ${e.hora}`}
              </span>
              <span className="text-[13px] text-ink/80">{e.titulo}</span>
            </div>
            <button
              onClick={async () => {
                await deleteEvento(e.id);
                reload();
              }}
              className="text-ink/30 hover:text-rose"
            >
              <IconTrash className="h-3.5 w-3.5" />
            </button>
          </li>
        ))}
        {eventos.length === 0 && (
          <li className="text-sm text-ink/40">Sin eventos agendados.</li>
        )}
      </ul>
    </Section>
  );
}
