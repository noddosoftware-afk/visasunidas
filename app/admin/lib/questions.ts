export interface Pregunta {
  id: string;
  texto: string;
  /** Valor de respuesta (Sí = true, No = false) que marca foco rojo. */
  redFlag: boolean;
}

/**
 * Preguntas clave de evaluación por trámite. Son un punto de partida —
 * deben revisarse y ajustarse con el equipo legal antes de usarse como
 * criterio real de viabilidad.
 */
export const PREGUNTAS: Record<string, Pregunta[]> = {
  "visa-turista": [
    { id: "pasaporte_vigente", texto: "¿Cuenta con pasaporte vigente?", redFlag: false },
    {
      id: "arraigo",
      texto: "¿Tiene arraigo comprobable en México (trabajo, propiedades, familia)?",
      redFlag: false,
    },
    {
      id: "rechazo_previo",
      texto: "¿Ha sido rechazado anteriormente para visa de EE.UU.?",
      redFlag: true,
    },
  ],
  "visa-emergencia": [
    {
      id: "comprobante_emergencia",
      texto: "¿La emergencia puede comprobarse con documento oficial (acta médica, defunción, etc.)?",
      redFlag: false,
    },
    {
      id: "historial_limpio",
      texto: "¿Tiene visa vigente o historial migratorio sin negaciones?",
      redFlag: false,
    },
  ],
  "perdon-presencia-ilegal": [
    {
      id: "peticionario",
      texto: "¿Tiene un familiar directo (cónyuge/hijo/padre) ciudadano o residente de EE.UU. que sirva de peticionario?",
      redFlag: false,
    },
    {
      id: "evidencia_hardship",
      texto: "¿Cuenta con evidencia de daño extremo (hardship) para el familiar peticionario?",
      redFlag: false,
    },
  ],
  "perdon-deportacion": [
    {
      id: "antecedentes_penales",
      texto: "¿Tiene antecedentes penales graves?",
      redFlag: true,
    },
    {
      id: "tiempo_cumplido",
      texto: "¿Han pasado los años requeridos desde la deportación (o aplica alguna excepción)?",
      redFlag: false,
    },
  ],
  "procesos-administrativos": [
    {
      id: "identificacion",
      texto: "¿Cuenta con identificación oficial vigente?",
      redFlag: false,
    },
  ],
  foia: [
    {
      id: "identificacion_foia",
      texto: "¿Cuenta con identificación oficial para solicitar su expediente?",
      redFlag: false,
    },
  ],
  pasaportes: [
    {
      id: "acta_vigente",
      texto: "¿Cuenta con acta de nacimiento certificada y vigente?",
      redFlag: false,
    },
  ],
  divorcios: [
    {
      id: "acuerdo_mutuo",
      texto: "¿Ambas partes están de acuerdo en el divorcio?",
      redFlag: false,
    },
    {
      id: "bienes_hijos_disputa",
      texto: "¿Hay bienes o hijos menores en disputa?",
      redFlag: true,
    },
  ],
  actas: [
    {
      id: "datos_registro",
      texto: "¿Conoce el lugar y la fecha exacta del registro del acta?",
      redFlag: false,
    },
  ],
  "rectificacion-actas": [
    {
      id: "copia_acta",
      texto: "¿Tiene copia del acta con el error a corregir?",
      redFlag: false,
    },
  ],
  curp: [
    {
      id: "doc_identidad",
      texto: "¿Cuenta con acta de nacimiento o documento de identidad vigente?",
      redFlag: false,
    },
  ],
};

export type Viabilidad = "Viable" | "No viable" | "Pendiente";

export function computeViabilidad(
  tramiteSlug: string,
  respuestas: Record<string, boolean | null | undefined>
): Viabilidad {
  const preguntas = PREGUNTAS[tramiteSlug] ?? [];
  if (preguntas.length === 0) return "Viable";

  let allAnswered = true;
  for (const p of preguntas) {
    const r = respuestas[p.id];
    if (r === null || r === undefined) {
      allAnswered = false;
      continue;
    }
    if (r === p.redFlag) return "No viable";
  }
  return allAnswered ? "Viable" : "Pendiente";
}
