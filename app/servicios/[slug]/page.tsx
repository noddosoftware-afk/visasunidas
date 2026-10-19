import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { MobileActionBar } from "../../components/MobileActionBar";
import { SERVICES } from "../../content";
import { ServiceForm } from "./ServiceForm";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  return {
    title: service ? `${service.title} — Visas Unidas` : "Servicio — Visas Unidas",
    description: service?.detail,
  };
}

export default async function ServicioDetalle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) notFound();

  return (
    <div className="pb-20 md:pb-0">
      <Header />
      <main className="pt-32 pb-24">
        <div className="mx-auto max-w-2xl px-6">
          <Link
            href="/"
            className="text-[15px] font-medium text-ink/50 hover:text-brand"
          >
            ← Volver al inicio
          </Link>
          <p className="mt-6 text-[16px] font-semibold uppercase tracking-[0.2em] text-brand">
            Solicitar trámite
          </p>
          <h1 className="font-serif-display mt-4 text-[clamp(1.9rem,3.5vw,2.8rem)] font-medium">
            {service.title}
          </h1>
          <p className="mt-3 text-[18px] leading-relaxed text-ink/70">
            {service.detail}
          </p>

          <ServiceForm service={service} />
        </div>
      </main>
      <Footer />
      <MobileActionBar />
    </div>
  );
}
