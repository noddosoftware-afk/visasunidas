"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { SERVICES } from "../content";
import { ESTADOS, PRIORIDADES, type Estado, type Prioridad, type Solicitud } from "./lib/types";
import { listSolicitudes, resetDemoData, seedDemoData, tramiteLabel } from "./lib/storage";
import { computeViabilidad, type Viabilidad } from "./lib/questions";
import { FASES, contarCompletadas } from "./lib/fases";
import { contarRecibidos } from "./lib/documentos";
import { EstadoBadge, PrioridadBadge, ViabilidadBadge } from "./components/Badges";
import { ProgressBar } from "./components/ProgressBar";
import {
  IconFilePlus,
  IconFlag,
  IconLayoutDashboard,
  IconSearch,
  IconShieldCheck,
} from "./components/Icons";

const VIABILIDADES: Viabilidad[] = ["Viable", "No viable", "Pendiente"];
const PAGE_SIZE = 8;

const PRIORIDAD_ACCENT: Record<Prioridad, string> = {
  Alta: "border-l-4 border-l-rose",
  Media: "border-l-4 border-l-gold",
  Baja: "border-l-4 border-l-ink/15",
};

export default function AdminDashboard() {
  const router = useRouter();
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;
    (async () => {
      await seedDemoData();
      const datos = await listSolicitudes();
      if (activo) {
        setSolicitudes(datos);
        setCargando(false);
      }
    })();
    return () => {
      activo = false;
    };
  }, []);
  const [tramiteFiltro, setTramiteFiltro] = useState("todos");
  const [estadoFiltro, setEstadoFiltro] = useState<Estado | "todos">("todos");
  const [prioridadFiltro, setPrioridadFiltro] = useState<Prioridad | "todos">(
    "todos"
  );
  const [viabilidadFiltro, setViabilidadFiltro] = useState<Viabilidad | "todos">(
    "todos"
  );
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);

  const filtradas = useMemo(() => {
    return solicitudes.filter((s) => {
      if (tramiteFiltro !== "todos" && s.tramiteSlug !== tramiteFiltro)
        return false;
      if (estadoFiltro !== "todos" && s.estado !== estadoFiltro) return false;
      if (prioridadFiltro !== "todos" && s.prioridad !== prioridadFiltro)
        return false;
      const viabilidad = computeViabilidad(s.tramiteSlug, s.respuestas);
      if (viabilidadFiltro !== "todos" && viabilidad !== viabilidadFiltro)
        return false;
      if (busqueda) {
        const q = busqueda.toLowerCase();
        const coincide =
          s.clienteNombre.toLowerCase().includes(q) ||
          s.folio.toLowerCase().includes(q);
        if (!coincide) return false;
      }
      return true;
    });
  }, [solicitudes, tramiteFiltro, estadoFiltro, prioridadFiltro, viabilidadFiltro, busqueda]);

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / PAGE_SIZE));
  const paginaActual = Math.min(pagina, totalPaginas);
  const visibles = filtradas.slice(
    (paginaActual - 1) * PAGE_SIZE,
    paginaActual * PAGE_SIZE
  );

  function actualizarFiltro<T>(setter: (v: T) => void) {
    return (v: T) => {
      setter(v);
      setPagina(1);
    };
  }

  const stats = useMemo(() => {
    const total = solicitudes.length;
    const viables = solicitudes.filter(
      (s) => computeViabilidad(s.tramiteSlug, s.respuestas) === "Viable"
    ).length;
    const noViables = solicitudes.filter(
      (s) => computeViabilidad(s.tramiteSlug, s.respuestas) === "No viable"
    ).length;
    const altaPrioridad = solicitudes.filter(
      (s) => s.prioridad === "Alta" && s.estado !== "Resuelto" && s.estado !== "Cancelado"
    ).length;
    const pendientes = total - viables - noViables;
    return { total, viables, noViables, pendientes, altaPrioridad };
  }, [solicitudes]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <IconLayoutDashboard />
          </span>
          <h1 className="font-serif-display text-2xl font-medium text-ink">
            Solicitudes
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={async () => {
              if (
                confirm(
                  "Esto borrará TODAS las solicitudes actuales (incluidas las reales capturadas desde el sitio) y las reemplazará solo con los casos de ejemplo. ¿Continuar?"
                )
              ) {
                setCargando(true);
                await resetDemoData();
                setSolicitudes(await listSolicitudes());
                setPagina(1);
                setCargando(false);
              }
            }}
            className="text-[13px] font-medium text-ink/40 underline-offset-2 hover:text-rose hover:underline"
          >
            Restablecer datos de ejemplo
          </button>
          <Link href="/admin/nueva">
            <motion.span
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 rounded-full bg-gradient-to-b from-[#4049ff] to-brand px-5 py-2.5 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_8px_20px_-10px_rgba(41,48,249,0.6)]"
            >
              <IconFilePlus className="h-4 w-4" />
              Nueva solicitud
            </motion.span>
          </Link>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
        <StatCard label="Total" value={stats.total} icon={<IconLayoutDashboard className="h-4 w-4" />} tone="brand" />
        <StatCard label="Viables" value={stats.viables} icon={<IconShieldCheck className="h-4 w-4" />} tone="emerald" />
        <StatCard label="No viables" value={stats.noViables} icon={<IconShieldCheck className="h-4 w-4" />} tone="rose" />
        <StatCard label="Pendientes de evaluar" value={stats.pendientes} icon={<IconShieldCheck className="h-4 w-4" />} tone="ink" />
        <StatCard label="Alta prioridad, abiertas" value={stats.altaPrioridad} icon={<IconFlag className="h-4 w-4" />} tone="rose" />
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <select
          value={tramiteFiltro}
          onChange={(e) => actualizarFiltro(setTramiteFiltro)(e.target.value)}
          className="rounded-xl border border-ink/15 bg-white px-3 py-2 text-sm transition-colors hover:border-ink/25"
        >
          <option value="todos">Todos los trámites</option>
          {SERVICES.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.title}
            </option>
          ))}
        </select>

        <select
          value={estadoFiltro}
          onChange={(e) =>
            actualizarFiltro(setEstadoFiltro)(e.target.value as Estado | "todos")
          }
          className="rounded-xl border border-ink/15 bg-white px-3 py-2 text-sm transition-colors hover:border-ink/25"
        >
          <option value="todos">Todos los estados</option>
          {ESTADOS.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>

        <select
          value={prioridadFiltro}
          onChange={(e) =>
            actualizarFiltro(setPrioridadFiltro)(
              e.target.value as Prioridad | "todos"
            )
          }
          className="rounded-xl border border-ink/15 bg-white px-3 py-2 text-sm transition-colors hover:border-ink/25"
        >
          <option value="todos">Prioridad (todas)</option>
          {PRIORIDADES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <select
          value={viabilidadFiltro}
          onChange={(e) =>
            actualizarFiltro(setViabilidadFiltro)(
              e.target.value as Viabilidad | "todos"
            )
          }
          className="rounded-xl border border-ink/15 bg-white px-3 py-2 text-sm transition-colors hover:border-ink/25"
        >
          <option value="todos">Viabilidad (todas)</option>
          {VIABILIDADES.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>

        <div className="relative">
          <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
          <input
            value={busqueda}
            onChange={(e) => actualizarFiltro(setBusqueda)(e.target.value)}
            placeholder="Buscar por nombre o folio..."
            className="w-56 rounded-xl border border-ink/15 bg-white py-2 pl-9 pr-3 text-sm transition-colors hover:border-ink/25 focus:border-brand"
          />
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-ink/8 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink/3 text-[12px] uppercase tracking-wide text-ink/50">
            <tr>
              <th className="px-5 py-3">Folio</th>
              <th className="px-5 py-3">Cliente</th>
              <th className="px-5 py-3">Trámite</th>
              <th className="px-5 py-3">Variante</th>
              <th className="px-5 py-3">Prioridad</th>
              <th className="px-5 py-3">Estado</th>
              <th className="px-5 py-3">Viabilidad</th>
              <th className="px-5 py-3">Fases</th>
              <th className="px-5 py-3">Documentos</th>
              <th className="px-5 py-3">Actualizado</th>
            </tr>
          </thead>
          <tbody>
            {cargando && (
              <tr>
                <td colSpan={10} className="px-5 py-14 text-center text-ink/40">
                  Cargando solicitudes...
                </td>
              </tr>
            )}
            {!cargando && visibles.map((s, i) => (
              <motion.tr
                key={s.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: Math.min(i, 8) * 0.03 }}
                className={`cursor-pointer border-t border-ink/6 transition-colors hover:bg-paper-dim ${PRIORIDAD_ACCENT[s.prioridad]}`}
                onClick={() => router.push(`/admin/${s.id}`)}
              >
                <td className="px-5 py-3 font-mono text-[12px] text-ink/50">
                  {s.folio}
                </td>
                <td className="px-5 py-3 font-medium text-ink">
                  {s.clienteNombre}
                </td>
                <td className="px-5 py-3 text-ink/70">
                  {tramiteLabel(s.tramiteSlug)}
                </td>
                <td className="px-5 py-3 text-ink/70">{s.variante}</td>
                <td className="px-5 py-3">
                  <PrioridadBadge prioridad={s.prioridad} />
                </td>
                <td className="px-5 py-3">
                  <EstadoBadge estado={s.estado} />
                </td>
                <td className="px-5 py-3">
                  <ViabilidadBadge
                    viabilidad={computeViabilidad(s.tramiteSlug, s.respuestas)}
                  />
                </td>
                <td className="px-5 py-3">
                  <ProgressBar value={contarCompletadas(s.fases)} total={FASES.length} />
                </td>
                <td className="px-5 py-3">
                  <ProgressBar
                    value={contarRecibidos(s.documentos)}
                    total={s.documentos.length}
                    tone="gold"
                  />
                </td>
                <td className="px-5 py-3 text-ink/50">
                  {new Date(s.actualizadoEn).toLocaleDateString("es-MX")}
                </td>
              </motion.tr>
            ))}
            {!cargando && visibles.length === 0 && (
              <tr>
                <td colSpan={10} className="px-5 py-14 text-center text-ink/40">
                  <div className="flex flex-col items-center gap-2">
                    <IconSearch className="h-6 w-6 text-ink/25" />
                    No hay solicitudes con esos filtros.
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPaginas > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-ink/60">
          <span>
            Página {paginaActual} de {totalPaginas} · {filtradas.length}{" "}
            solicitudes
          </span>
          <div className="flex gap-2">
            <button
              disabled={paginaActual === 1}
              onClick={() => setPagina((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-ink/15 px-3 py-1.5 transition-colors hover:border-ink/25 disabled:opacity-40"
            >
              ← Anterior
            </button>
            <button
              disabled={paginaActual === totalPaginas}
              onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
              className="rounded-lg border border-ink/15 px-3 py-1.5 transition-colors hover:border-ink/25 disabled:opacity-40"
            >
              Siguiente →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const STAT_TONE: Record<string, { bg: string; text: string; bar: string; border: string }> = {
  brand: { bg: "bg-brand/10", text: "text-brand", bar: "bg-brand", border: "hover:border-brand/30" },
  emerald: { bg: "bg-emerald-100", text: "text-emerald-700", bar: "bg-emerald-500", border: "hover:border-emerald-300/60" },
  rose: { bg: "bg-rose/10", text: "text-rose", bar: "bg-rose", border: "hover:border-rose/30" },
  ink: { bg: "bg-ink/8", text: "text-ink/70", bar: "bg-ink/40", border: "hover:border-ink/20" },
};

function StatCard({
  label,
  value,
  icon,
  tone = "ink",
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone?: keyof typeof STAT_TONE;
}) {
  const { bg, text, bar, border } = STAT_TONE[tone];
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`relative overflow-hidden rounded-2xl border border-ink/8 bg-white p-5 shadow-[0_2px_10px_-6px_rgba(10,14,42,0.06)] transition-all ${border}`}
    >
      <span className={`absolute inset-x-0 top-0 h-1 ${bar}`} />
      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${bg} ${text}`}>
        {icon}
      </div>
      <p className="mt-3 text-[12px] uppercase tracking-wide text-ink/50">{label}</p>
      <p className={`mt-1 font-serif-display text-3xl font-medium ${text}`}>
        {value}
      </p>
    </motion.div>
  );
}
