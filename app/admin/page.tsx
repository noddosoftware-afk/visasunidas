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
  Alta: "border-l-4 border-l-coral",
  Media: "border-l-4 border-l-gold",
  Baja: "border-l-4 border-l-white/15",
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
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/15 text-[#9ba0ff]">
            <IconLayoutDashboard />
          </span>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
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
            className="text-[13px] font-medium text-white/35 underline-offset-2 hover:text-[#ff8079] hover:underline"
          >
            Restablecer datos de ejemplo
          </button>
          <Link href="/admin/nueva">
            <motion.span
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-deep"
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
        <StatCard label="No viables" value={stats.noViables} icon={<IconShieldCheck className="h-4 w-4" />} tone="coral" />
        <StatCard label="Pendientes de evaluar" value={stats.pendientes} icon={<IconShieldCheck className="h-4 w-4" />} tone="ink" />
        <StatCard label="Alta prioridad, abiertas" value={stats.altaPrioridad} icon={<IconFlag className="h-4 w-4" />} tone="coral" />
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <select
          value={tramiteFiltro}
          onChange={(e) => actualizarFiltro(setTramiteFiltro)(e.target.value)}
          className="rounded-xl border border-white/12 bg-white/5 px-3 py-2 text-sm text-white/80 transition-colors hover:border-white/25 sel"
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
          className="rounded-xl border border-white/12 bg-white/5 px-3 py-2 text-sm text-white/80 transition-colors hover:border-white/25 sel"
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
          className="rounded-xl border border-white/12 bg-white/5 px-3 py-2 text-sm text-white/80 transition-colors hover:border-white/25 sel"
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
          className="rounded-xl border border-white/12 bg-white/5 px-3 py-2 text-sm text-white/80 transition-colors hover:border-white/25 sel"
        >
          <option value="todos">Viabilidad (todas)</option>
          {VIABILIDADES.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>

        <div className="relative">
          <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input
            value={busqueda}
            onChange={(e) => actualizarFiltro(setBusqueda)(e.target.value)}
            placeholder="Buscar por nombre o folio..."
            className="w-56 rounded-xl border border-white/12 bg-white/5 py-2 pl-9 pr-3 text-sm text-white/80 transition-colors hover:border-white/25 focus:border-brand"
          />
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-white/8 bg-white/[0.03]">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-[12px] uppercase tracking-wide text-white/45">
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
                <td colSpan={10} className="px-5 py-14 text-center text-white/35">
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
                className={`cursor-pointer border-t border-white/6 transition-colors hover:bg-white/5 ${PRIORIDAD_ACCENT[s.prioridad]}`}
                onClick={() => router.push(`/admin/${s.id}`)}
              >
                <td className="px-5 py-3 font-mono text-[12px] text-white/45">
                  {s.folio}
                </td>
                <td className="px-5 py-3 font-medium text-white">
                  {s.clienteNombre}
                </td>
                <td className="px-5 py-3 text-white/65">
                  {tramiteLabel(s.tramiteSlug)}
                </td>
                <td className="px-5 py-3 text-white/65">{s.variante}</td>
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
                <td className="px-5 py-3 text-white/40">
                  {new Date(s.actualizadoEn).toLocaleDateString("es-MX")}
                </td>
              </motion.tr>
            ))}
            {!cargando && visibles.length === 0 && (
              <tr>
                <td colSpan={10} className="px-5 py-14 text-center text-white/35">
                  <div className="flex flex-col items-center gap-2">
                    <IconSearch className="h-6 w-6 text-white/20" />
                    No hay solicitudes con esos filtros.
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPaginas > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-white/55">
          <span>
            Página {paginaActual} de {totalPaginas} · {filtradas.length}{" "}
            solicitudes
          </span>
          <div className="flex gap-2">
            <button
              disabled={paginaActual === 1}
              onClick={() => setPagina((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-white/12 px-3 py-1.5 transition-colors hover:border-white/25 disabled:opacity-40"
            >
              ← Anterior
            </button>
            <button
              disabled={paginaActual === totalPaginas}
              onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
              className="rounded-lg border border-white/12 px-3 py-1.5 transition-colors hover:border-white/25 disabled:opacity-40"
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
  brand: { bg: "bg-brand/15", text: "text-[#9ba0ff]", bar: "bg-brand", border: "hover:border-brand/40" },
  emerald: { bg: "bg-emerald-400/15", text: "text-emerald-300", bar: "bg-emerald-400", border: "hover:border-emerald-400/40" },
  coral: { bg: "bg-coral/15", text: "text-[#ff8079]", bar: "bg-coral", border: "hover:border-coral/40" },
  ink: { bg: "bg-white/8", text: "text-white/70", bar: "bg-white/30", border: "hover:border-white/25" },
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
      className={`relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03] p-5 backdrop-blur-sm transition-colors ${border}`}
    >
      <span className={`absolute inset-x-0 top-0 h-1 ${bar}`} />
      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${bg} ${text}`}>
        {icon}
      </div>
      <p className="mt-3 text-[12px] uppercase tracking-wide text-white/45">{label}</p>
      <p className={`mt-1 text-3xl font-semibold tracking-tight ${text}`}>
        {value}
      </p>
    </motion.div>
  );
}
