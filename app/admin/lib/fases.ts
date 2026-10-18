export const FASES = [
  "Recepción de documentos",
  "Evaluación de viabilidad",
  "Preparación de expediente",
  "Trámite ante autoridad",
  "Seguimiento / cita",
  "Resolución final",
] as const;

export type Fase = (typeof FASES)[number];

export interface FaseProgreso {
  completada: boolean;
  fecha: string | null;
}

export type FasesState = Record<Fase, FaseProgreso>;

export function fasesIniciales(): FasesState {
  return FASES.reduce((acc, fase) => {
    acc[fase] = { completada: false, fecha: null };
    return acc;
  }, {} as FasesState);
}

export function contarCompletadas(fases: FasesState): number {
  return FASES.filter((f) => fases[f]?.completada).length;
}
