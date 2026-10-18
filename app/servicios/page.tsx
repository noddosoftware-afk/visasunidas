import type { Metadata } from "next";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { MobileActionBar } from "../components/MobileActionBar";
import { ServicesGrid } from "./ServicesGrid";

export const metadata: Metadata = {
  title: "Servicios — Visas Unidas",
  description:
    "Conoce todos los trámites que manejamos: visas, perdones migratorios, pasaportes, actas y más. Elige el tuyo y llena el formulario correspondiente.",
};

export default function ServiciosPage() {
  return (
    <div className="pb-20 md:pb-0">
      <Header />
      <main className="pt-32 pb-24">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-[16px] font-semibold uppercase tracking-[0.2em] text-brand">
            Todos nuestros trámites
          </p>
          <h1 className="font-serif-display mt-4 max-w-2xl text-[clamp(2rem,4vw,3rem)] font-medium">
            ¿Qué trámite necesitas resolver?
          </h1>
          <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-ink/70">
            Elige tu trámite y te mostraremos un formulario con las preguntas
            específicas de tu caso.
          </p>

          <ServicesGrid />
        </div>
      </main>
      <Footer />
      <MobileActionBar />
    </div>
  );
}
