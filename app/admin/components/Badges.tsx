import type { Estado, Prioridad } from "../lib/types";
import type { Viabilidad } from "../lib/questions";

const ESTADO_STYLE: Record<Estado, string> = {
  Recibido: "bg-white/8 text-white/70 ring-1 ring-inset ring-white/15",
  "Documentos pendientes": "bg-gold/15 text-gold ring-1 ring-inset ring-gold/35",
  "En proceso": "bg-brand/20 text-[#9ba0ff] ring-1 ring-inset ring-brand/40",
  "Cita programada": "bg-violet-400/15 text-violet-300 ring-1 ring-inset ring-violet-400/35",
  Resuelto: "bg-emerald-400/15 text-emerald-300 ring-1 ring-inset ring-emerald-400/35",
  Cancelado: "bg-rose/15 text-[#ff8079] ring-1 ring-inset ring-rose/35",
};

export function EstadoBadge({ estado }: { estado: Estado }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[12px] font-medium ${ESTADO_STYLE[estado]}`}
    >
      {estado}
    </span>
  );
}

const VIABILIDAD_STYLE: Record<Viabilidad, string> = {
  Viable: "bg-emerald-400/15 text-emerald-300 ring-1 ring-inset ring-emerald-400/35",
  "No viable": "bg-rose/15 text-[#ff8079] ring-1 ring-inset ring-rose/35",
  Pendiente: "bg-white/8 text-white/50 ring-1 ring-inset ring-white/15",
};

export function ViabilidadBadge({ viabilidad }: { viabilidad: Viabilidad }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[12px] font-medium ${VIABILIDAD_STYLE[viabilidad]}`}
    >
      {viabilidad}
    </span>
  );
}

const PRIORIDAD_STYLE: Record<Prioridad, string> = {
  Alta: "bg-rose/15 text-[#ff8079] ring-1 ring-inset ring-rose/35",
  Media: "bg-gold/15 text-gold ring-1 ring-inset ring-gold/35",
  Baja: "bg-sky-400/15 text-sky-300 ring-1 ring-inset ring-sky-400/35",
};

export function PrioridadBadge({ prioridad }: { prioridad: Prioridad }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[12px] font-medium ${PRIORIDAD_STYLE[prioridad]}`}
    >
      {prioridad}
    </span>
  );
}
