export const NACIONALIDADES = ["Mexicana", "Estadounidense", "Otra"] as const;

export type Nacionalidad = (typeof NACIONALIDADES)[number];

export function esElegiblePorNacionalidad(nacionalidad: Nacionalidad): boolean {
  return nacionalidad !== "Otra";
}
