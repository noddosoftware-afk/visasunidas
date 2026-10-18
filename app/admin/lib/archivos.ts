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
}

export function formatoTamano(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
