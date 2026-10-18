/**
 * Documentos que normalmente se solicitan por trámite. Punto de partida —
 * debe revisarse y ajustarse con el equipo legal.
 */
export const DOCUMENTOS_REQUERIDOS: Record<string, string[]> = {
  "visa-turista": [
    "Pasaporte vigente",
    "Comprobante de domicilio",
    "Comprobante de ingresos",
    "Fotografía tamaño pasaporte",
  ],
  "visa-emergencia": [
    "Pasaporte vigente",
    "Documento que acredite la emergencia (acta médica o de defunción)",
    "Comprobante de parentesco",
  ],
  "perdon-presencia-ilegal": [
    "Acta de nacimiento",
    "Pasaporte vigente",
    "Prueba de parentesco con el peticionario",
    "Evidencia de daño extremo (hardship)",
  ],
  "perdon-deportacion": [
    "Orden de deportación",
    "Acta de nacimiento",
    "Identificación oficial",
    "Carta de antecedentes no penales",
  ],
  "procesos-administrativos": [
    "Identificación oficial",
    "Documento del trámite en curso",
  ],
  foia: ["Identificación oficial", "Formato de autorización FOIA firmado"],
  pasaportes: [
    "Acta de nacimiento certificada",
    "Identificación oficial de los padres (si es menor)",
    "Comprobante de domicilio",
    "Fotografía tamaño pasaporte",
  ],
  divorcios: [
    "Acta de matrimonio",
    "Identificación oficial de ambas partes",
    "Acta de nacimiento de los hijos (si aplica)",
  ],
  actas: ["Identificación oficial", "Datos del registro (lugar y fecha)"],
  "rectificacion-actas": [
    "Copia del acta con el error",
    "Identificación oficial",
    "Documento que compruebe el dato correcto",
  ],
  curp: ["Acta de nacimiento", "Identificación oficial"],
};

export interface DocumentoItem {
  id: string;
  nombre: string;
  recibido: boolean;
  fecha: string | null;
  personalizado: boolean;
}

export function documentosIniciales(tramiteSlug: string): DocumentoItem[] {
  const requeridos = DOCUMENTOS_REQUERIDOS[tramiteSlug] ?? [];
  return requeridos.map((nombre, i) => ({
    id: `req-${i}`,
    nombre,
    recibido: false,
    fecha: null,
    personalizado: false,
  }));
}

export function contarRecibidos(documentos: DocumentoItem[]): number {
  return documentos.filter((d) => d.recibido).length;
}
