"use client";
import { useEffect, useState } from "react";
import {
  addArchivo,
  CATEGORIAS_ARCHIVO,
  formatoTamano,
  getArchivoUrl,
  listArchivos,
  removeArchivo,
  type ArchivoItem,
  type CategoriaArchivo,
} from "../lib/archivos";
import { Section } from "./Section";
import { IconDownload, IconFileText, IconTrash, IconUpload } from "./Icons";

export function ArchivosSection({ solicitudId }: { solicitudId: string }) {
  const [archivos, setArchivos] = useState<ArchivoItem[]>([]);
  const [categoria, setCategoria] = useState<CategoriaArchivo>(CATEGORIAS_ARCHIVO[0]);
  const [subiendo, setSubiendo] = useState(false);

  const reload = () => listArchivos(solicitudId).then(setArchivos);

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solicitudId]);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setSubiendo(true);
    await addArchivo(solicitudId, file, categoria);
    setSubiendo(false);
    reload();
  }

  async function handleVer(archivo: ArchivoItem) {
    const url = await getArchivoUrl(archivo.storagePath);
    if (url) window.open(url, "_blank");
  }

  return (
    <Section
      icon={<IconFileText />}
      title="Archivos del expediente"
      subtitle="Sube actas, RFC, CURP, pasaporte, INE y demás documentos digitalizados de este cliente."
      tone="brand"
      right={
        <span className="rounded-full bg-white/8 px-2.5 py-1 text-[12px] text-white/45">
          {archivos.length}
        </span>
      }
    >
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value as CategoriaArchivo)}
          className="rounded-xl border border-white/12 bg-white/5 text-white/80 px-3 py-2 text-sm sel"
        >
          {CATEGORIAS_ARCHIVO.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <label className="flex cursor-pointer items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.03]">
          <IconUpload className="h-4 w-4" />
          {subiendo ? "Subiendo..." : "Subir archivo"}
          <input
            type="file"
            className="hidden"
            disabled={subiendo}
            onChange={(e) => {
              handleFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </label>
      </div>

      <ul className="mt-4 space-y-2">
        {archivos.map((a) => (
          <li
            key={a.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-white/8 px-4 py-3"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/15 text-[#9ba0ff]">
                <IconFileText className="h-4 w-4" />
              </span>
              <div className="truncate">
                <p className="truncate text-sm font-medium text-white">{a.nombre}</p>
                <p className="text-[12px] text-white/40">
                  {a.categoria} · {formatoTamano(a.tamano)} ·{" "}
                  {new Date(a.fecha).toLocaleDateString("es-MX")}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <button
                onClick={() => handleVer(a)}
                className="flex items-center gap-1 text-[13px] font-medium text-brand hover:underline"
              >
                <IconDownload className="h-3.5 w-3.5" />
                Ver
              </button>
              <button
                onClick={async () => {
                  if (confirm(`¿Eliminar "${a.nombre}"?`)) {
                    await removeArchivo(solicitudId, a);
                    reload();
                  }
                }}
                className="flex items-center gap-1 text-[13px] font-medium text-coral hover:underline"
              >
                <IconTrash className="h-3.5 w-3.5" />
              </button>
            </div>
          </li>
        ))}
        {archivos.length === 0 && (
          <li className="text-sm text-white/35">
            Sin archivos subidos todavía.
          </li>
        )}
      </ul>
    </Section>
  );
}
