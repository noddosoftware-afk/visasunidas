export const UBICACIONES = ["México", "EU", "Otro"] as const;

export type Ubicacion = (typeof UBICACIONES)[number];

export function esElegiblePorUbicacion(ubicacion: Ubicacion): boolean {
  return ubicacion !== "Otro";
}
