import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-ink/8 bg-paper py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-center">
        <Image src="/logo.svg" alt="Visas Unidas" width={34} height={34} />
        <p className="font-serif-display text-[17px] text-ink/80">
          Visas Unidas — Reuniendo Familias
        </p>
        <p className="max-w-md text-[14px] leading-relaxed text-ink/55">
          Demo visual elaborado por NODDO Software. Ejemplo de diseño, no
          publicado.
        </p>
      </div>
    </footer>
  );
}
