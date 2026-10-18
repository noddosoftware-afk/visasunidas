export const TIPOS_EVENTO = ["Llamada", "Cita", "Otro"] as const;

export type TipoEvento = (typeof TIPOS_EVENTO)[number];

export interface Evento {
  id: string;
  fecha: string; // YYYY-MM-DD
  hora: string; // HH:MM, puede ser ""
  tipo: TipoEvento;
  titulo: string;
  nota: string;
  solicitudId: string | null;
  creadoEn: string;
}

const KEY = "visasunidas_eventos";

function read(): Evento[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Evento[]) : [];
  } catch {
    return [];
  }
}

function write(eventos: Evento[]) {
  window.localStorage.setItem(KEY, JSON.stringify(eventos));
}

export function listEventos(): Evento[] {
  return read().sort((a, b) =>
    (a.fecha + a.hora).localeCompare(b.fecha + b.hora)
  );
}

export function eventosPorFecha(fecha: string): Evento[] {
  return listEventos().filter((e) => e.fecha === fecha);
}

export function eventosPorSolicitud(solicitudId: string): Evento[] {
  return listEventos().filter((e) => e.solicitudId === solicitudId);
}

export function createEvento(input: {
  fecha: string;
  hora: string;
  tipo: TipoEvento;
  titulo: string;
  nota: string;
  solicitudId?: string | null;
}): Evento {
  const evento: Evento = {
    id: crypto.randomUUID(),
    solicitudId: null,
    ...input,
    creadoEn: new Date().toISOString(),
  };
  const all = read();
  all.push(evento);
  write(all);
  return evento;
}

export function deleteEvento(id: string) {
  write(read().filter((e) => e.id !== id));
}

export function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}
