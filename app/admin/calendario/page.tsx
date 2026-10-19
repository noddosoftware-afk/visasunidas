"use client";
import { useEffect, useState } from "react";
import type { Solicitud } from "../lib/types";
import {
  createEvento,
  deleteEvento,
  listEventos,
  TIPOS_EVENTO,
  toDateKey,
  type Evento,
  type TipoEvento,
} from "../lib/eventos";
import { listSolicitudes, tramiteLabel } from "../lib/storage";
import { CalendarMonth } from "../components/CalendarMonth";
import { PanelButton } from "../components/PanelButton";
import {
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
  IconPhoneCall,
  IconTrash,
} from "../components/Icons";

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const TIPO_BADGE: Record<TipoEvento, string> = {
  Llamada: "bg-brand/15 text-[#9ba0ff]",
  Cita: "bg-gold/15 text-gold",
  Otro: "bg-violet-400/15 text-violet-300",
};

export default function Calendario() {
  const hoy = new Date();
  const [cursor, setCursor] = useState({ year: hoy.getFullYear(), month: hoy.getMonth() });
  const [seleccionado, setSeleccionado] = useState(toDateKey(hoy));
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);

  const [tipo, setTipo] = useState<TipoEvento>("Llamada");
  const [hora, setHora] = useState("");
  const [titulo, setTitulo] = useState("");
  const [nota, setNota] = useState("");
  const [solicitudId, setSolicitudId] = useState("");

  const reload = () => listEventos().then(setEventos);

  useEffect(() => {
    reload();
    listSolicitudes().then(setSolicitudes);
  }, []);

  const eventosDelDia = eventos.filter((e) => e.fecha === seleccionado);
  const proximos = eventos.filter((e) => e.fecha >= toDateKey(hoy)).slice(0, 6);

  function cambiarMes(delta: number) {
    setCursor((c) => {
      const d = new Date(c.year, c.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/15 text-[#9ba0ff]">
          <IconCalendar />
        </span>
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Calendario
        </h1>
      </div>
      <p className="mt-1 text-sm text-white/55">
        Agenda llamadas, citas y notas de seguimiento.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <button
              onClick={() => cambiarMes(-1)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-white/45 hover:bg-white/8"
            >
              <IconChevronLeft className="h-4 w-4" />
            </button>
            <p className="text-lg font-semibold text-white">
              {MESES[cursor.month]} {cursor.year}
            </p>
            <button
              onClick={() => cambiarMes(1)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-white/45 hover:bg-white/8"
            >
              <IconChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4">
            <CalendarMonth
              year={cursor.year}
              month={cursor.month}
              eventos={eventos}
              selected={seleccionado}
              onSelect={setSeleccionado}
            />
          </div>

          <div className="mt-5 flex items-center gap-4 text-[12px] text-white/45">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-brand" /> Llamada
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-gold" /> Cita
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-violet-500" /> Otro
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 backdrop-blur-sm">
            <p className="text-[15px] font-semibold text-white">
              {new Date(seleccionado + "T00:00:00").toLocaleDateString("es-MX", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!titulo.trim()) return;
                await createEvento({
                  fecha: seleccionado,
                  hora,
                  tipo,
                  titulo: titulo.trim(),
                  nota,
                  solicitudId: solicitudId || null,
                });
                setTitulo("");
                setNota("");
                setHora("");
                setSolicitudId("");
                reload();
              }}
              className="mt-4 space-y-3 rounded-xl border border-white/8 bg-black/20 p-4"
            >
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value as TipoEvento)}
                  className="rounded-lg border border-white/12 bg-white/5 px-2.5 py-2 text-[13px] text-white/80 sel"
                >
                  {TIPOS_EVENTO.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <input
                  type="time"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  className="rounded-lg border border-white/12 bg-white/5 px-2.5 py-2 text-[13px] text-white/80"
                />
              </div>
              <input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Título (ej. Confirmar cita consular)"
                className="w-full rounded-lg border border-white/12 bg-white/5 px-3 py-2 text-[13px] text-white outline-none placeholder:text-white/30 focus:border-brand"
              />
              <select
                value={solicitudId}
                onChange={(e) => setSolicitudId(e.target.value)}
                className="w-full rounded-lg border border-white/12 bg-white/5 px-2.5 py-2 text-[13px] text-white/80 sel"
              >
                <option value="">Sin vincular a ningún caso</option>
                {solicitudes.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.folio} — {s.clienteNombre} ({tramiteLabel(s.tramiteSlug)})
                  </option>
                ))}
              </select>
              <textarea
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                rows={2}
                placeholder="Nota (opcional)"
                className="w-full resize-none rounded-lg border border-white/12 bg-white/5 px-3 py-2 text-[13px] text-white outline-none placeholder:text-white/30 focus:border-brand"
              />
              <PanelButton type="submit" className="w-full py-2 text-[13px]">
                + Agregar al {new Date(seleccionado + "T00:00:00").toLocaleDateString("es-MX", { day: "numeric", month: "short" })}
              </PanelButton>
            </form>

            <ul className="mt-4 space-y-2">
              {eventosDelDia.map((e) => (
                <li
                  key={e.id}
                  className="flex items-start justify-between gap-3 rounded-xl border border-white/8 px-3 py-2.5"
                >
                  <div className="flex items-start gap-2">
                    <span
                      className={`mt-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${TIPO_BADGE[e.tipo]}`}
                    >
                      {e.hora || "—"}
                    </span>
                    <div>
                      <p className="text-[13px] font-medium text-white">{e.titulo}</p>
                      {e.nota && <p className="text-[12px] text-white/45">{e.nota}</p>}
                      {e.solicitudId && (
                        <p className="text-[11px] text-brand">
                          {solicitudes.find((s) => s.id === e.solicitudId)?.folio}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      await deleteEvento(e.id);
                      reload();
                    }}
                    className="text-white/25 hover:text-coral"
                  >
                    <IconTrash className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
              {eventosDelDia.length === 0 && (
                <li className="text-[13px] text-white/35">Sin eventos este día.</li>
              )}
            </ul>
          </div>

          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 backdrop-blur-sm">
            <p className="flex items-center gap-2 text-[15px] font-semibold text-white">
              <IconPhoneCall className="h-4 w-4 text-brand" />
              Próximos eventos
            </p>
            <ul className="mt-3 space-y-2">
              {proximos.map((e) => (
                <li key={e.id} className="flex items-center gap-3 text-[13px]">
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${TIPO_BADGE[e.tipo]}`}>
                    {e.tipo}
                  </span>
                  <span className="text-white/55">
                    {new Date(e.fecha + "T00:00:00").toLocaleDateString("es-MX", {
                      day: "numeric",
                      month: "short",
                    })}
                    {e.hora && ` · ${e.hora}`}
                  </span>
                  <span className="truncate text-white/80">{e.titulo}</span>
                </li>
              ))}
              {proximos.length === 0 && (
                <li className="text-[13px] text-white/35">No hay eventos próximos.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
