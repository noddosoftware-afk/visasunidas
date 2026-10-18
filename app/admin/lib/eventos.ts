import { supabase } from "../../lib/supabaseClient";

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

interface EventoRow {
  id: string;
  fecha: string;
  hora: string;
  tipo: TipoEvento;
  titulo: string;
  nota: string;
  solicitud_id: string | null;
  creado_en: string;
}

const TABLE = "eventos";

function rowToEvento(r: EventoRow): Evento {
  return {
    id: r.id,
    fecha: r.fecha,
    hora: r.hora,
    tipo: r.tipo,
    titulo: r.titulo,
    nota: r.nota,
    solicitudId: r.solicitud_id,
    creadoEn: r.creado_en,
  };
}

export async function listEventos(): Promise<Evento[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("fecha", { ascending: true })
    .order("hora", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(rowToEvento);
}

export async function eventosPorFecha(fecha: string): Promise<Evento[]> {
  const { data, error } = await supabase.from(TABLE).select("*").eq("fecha", fecha);
  if (error) throw error;
  return (data ?? []).map(rowToEvento);
}

export async function eventosPorSolicitud(solicitudId: string): Promise<Evento[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("solicitud_id", solicitudId)
    .order("fecha", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(rowToEvento);
}

export async function createEvento(input: {
  fecha: string;
  hora: string;
  tipo: TipoEvento;
  titulo: string;
  nota: string;
  solicitudId?: string | null;
}): Promise<Evento> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      fecha: input.fecha,
      hora: input.hora,
      tipo: input.tipo,
      titulo: input.titulo,
      nota: input.nota,
      solicitud_id: input.solicitudId ?? null,
    })
    .select()
    .single();
  if (error) throw error;
  return rowToEvento(data);
}

export async function deleteEvento(id: string) {
  await supabase.from(TABLE).delete().eq("id", id);
}

export function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}
