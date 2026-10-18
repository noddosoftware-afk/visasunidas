import type { Estado, Prioridad } from "../lib/types";
import type { Viabilidad } from "../lib/questions";

const ESTADO_STYLE: Record<Estado, string> = {
  Recibido: "bg-ink/6 text-ink/70 ring-1 ring-inset ring-ink/15",
  "Documentos pendientes": "bg-gold/10 text-gold ring-1 ring-inset ring-gold/30",
  "En proceso": "bg-brand/10 text-brand ring-1 ring-inset ring-brand/30",
  "Cita programada": "bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-300/60",
  Resuelto: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-300/60",
  Cancelado: "bg-rose/10 text-rose ring-1 ring-inset ring-rose/30",
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
  Viable: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-300/60",
  "No viable": "bg-rose/10 text-rose ring-1 ring-inset ring-rose/30",
  Pendiente: "bg-ink/6 text-ink/50 ring-1 ring-inset ring-ink/15",
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
  Alta: "bg-rose/10 text-rose ring-1 ring-inset ring-rose/30",
  Media: "bg-gold/10 text-gold ring-1 ring-inset ring-gold/30",
  Baja: "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-300/60",
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
