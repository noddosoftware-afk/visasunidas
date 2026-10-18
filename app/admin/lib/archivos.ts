export const CATEGORIAS_ARCHIVO = [
  "Acta de nacimiento",
  "RFC",
  "CURP",
  "Pasaporte",
  "INE",
  "Comprobante de domicilio",
  "Otro",
] as const;

export type CategoriaArchivo = (typeof CATEGORIAS_ARCHIVO)[number];

export interface ArchivoItem {
  id: string;
  nombre: string;
  categoria: CategoriaArchivo;
  tipo: string;
  tamano: number;
  fecha: string;
  storagePath: string;
}

export function formatoTamano(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

import { supabase } from "../../lib/supabaseClient";

const BUCKET = "archivos-expedientes";
const TABLE = "archivos";

interface ArchivoRow {
  id: string;
  nombre: string;
  categoria: CategoriaArchivo;
  tipo: string;
  tamano: number;
  fecha: string;
  storage_path: string;
}

function rowToArchivo(r: ArchivoRow): ArchivoItem {
  return {
    id: r.id,
    nombre: r.nombre,
    categoria: r.categoria,
    tipo: r.tipo,
    tamano: r.tamano,
    fecha: r.fecha,
    storagePath: r.storage_path,
  };
}

export async function listArchivos(solicitudId: string): Promise<ArchivoItem[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("solicitud_id", solicitudId)
    .order("fecha", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToArchivo);
}

export async function addArchivo(
  solicitudId: string,
  file: File,
  categoria: CategoriaArchivo
): Promise<void> {
  const archivoId = crypto.randomUUID();
  const path = `${solicitudId}/${archivoId}-${file.name}`;
  const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file);
  if (upErr) throw upErr;
  const { error } = await supabase.from(TABLE).insert({
    id: archivoId,
    solicitud_id: solicitudId,
    nombre: file.name,
    categoria,
    tipo: file.type || "application/octet-stream",
    tamano: file.size,
    storage_path: path,
  });
  if (error) throw error;
  await supabase
    .from("solicitudes")
    .update({ actualizado_en: new Date().toISOString() })
    .eq("id", solicitudId);
}

export async function removeArchivo(solicitudId: string, archivo: ArchivoItem): Promise<void> {
  await supabase.storage.from(BUCKET).remove([archivo.storagePath]);
  await supabase.from(TABLE).delete().eq("id", archivo.id);
  await supabase
    .from("solicitudes")
    .update({ actualizado_en: new Date().toISOString() })
    .eq("id", solicitudId);
}

export async function getArchivoUrl(storagePath: string): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(storagePath, 60);
  if (error) return null;
  return data.signedUrl;
}
