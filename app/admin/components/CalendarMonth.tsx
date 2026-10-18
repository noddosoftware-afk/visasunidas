"use client";
import { motion } from "framer-motion";
import type { Evento } from "../lib/eventos";
import { toDateKey } from "../lib/eventos";

const DIAS = ["L", "M", "M", "J", "V", "S", "D"];

const TIPO_DOT: Record<string, string> = {
  Llamada: "bg-brand",
  Cita: "bg-gold",
  Otro: "bg-violet-500",
};

export function CalendarMonth({
  year,
  month,
  eventos,
  selected,
  onSelect,
}: {
  year: number;
  month: number;
  eventos: Evento[];
  selected: string;
  onSelect: (dateKey: string) => void;
}) {
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = (firstOfMonth.getDay() + 6) % 7; // lunes=0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const eventosPorDia = new Map<string, Evento[]>();
  for (const e of eventos) {
    const list = eventosPorDia.get(e.fecha) ?? [];
    list.push(e);
    eventosPorDia.set(e.fecha, list);
  }

  const todayKey = toDateKey(new Date());
  const celdas: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 text-center text-[12px] font-semibold uppercase text-ink/40">
        {DIAS.map((d, i) => (
          <div key={i} className="py-1.5">
            {d}
          </div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1.5">
        {celdas.map((dia, i) => {
          if (dia === null) return <div key={i} />;
          const dateKey = toDateKey(new Date(year, month, dia));
          const dayEvents = eventosPorDia.get(dateKey) ?? [];
          const isToday = dateKey === todayKey;
          const isSelected = dateKey === selected;
          return (
            <motion.button
              key={dateKey}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(dateKey)}
              className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-xl text-[14px] font-medium transition-colors ${
                isSelected
                  ? "bg-brand text-white"
                  : isToday
                    ? "bg-brand/10 text-brand"
                    : "text-ink/70 hover:bg-paper-dim"
              }`}
            >
              {dia}
              <span className="flex h-1.5 gap-0.5">
                {dayEvents.slice(0, 3).map((e, idx) => (
                  <span
                    key={idx}
                    className={`h-1.5 w-1.5 rounded-full ${
                      isSelected ? "bg-white" : TIPO_DOT[e.tipo] ?? "bg-ink/30"
                    }`}
                  />
                ))}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
