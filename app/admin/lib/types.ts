import type { FasesState } from "./fases";
import type { DocumentoItem } from "./documentos";
import type { ArchivoItem } from "./archivos";
import type { Nacionalidad } from "../../lib/nacionalidad";

export const ESTADOS = [
  "Recibido",
  "Documentos pendientes",
  "En proceso",
  "Cita programada",
  "Resuelto",
  "Cancelado",
] as const;

export type Estado = (typeof ESTADOS)[number];

export const PRIORIDADES = ["Alta", "Media", "Baja"] as const;

export type Prioridad = (typeof PRIORIDADES)[number];

export interface HistorialEntry {
  estado: Estado;
  fecha: string;
  nota?: string;
}

export interface NotaEntry {
  id: string;
  fecha: string;
  texto: string;
}

export interface Solicitud {
  id: string;
  folio: string;
  clienteNombre: string;
  clienteTelefono: string;
  clienteEmail: string;
  esParaOtraPersona: boolean;
  contactoNombre: string;
  contactoTelefono: string;
  contactoEmail: string;
  nacionalidad: Nacionalidad;
  origen: "Panel" | "Sitio web";
  tramiteSlug: string;
  variante: string;
  estado: Estado;
  prioridad: Prioridad;
  notas: string;
  bitacora: NotaEntry[];
  respuestas: Record<string, boolean | null>;
  fases: FasesState;
  documentos: DocumentoItem[];
  archivos: ArchivoItem[];
  creadoEn: string;
  actualizadoEn: string;
  historial: HistorialEntry[];
}
