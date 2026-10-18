"use client";
import { useEffect, useState, type ReactNode } from "react";
import { useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import {
  findUser,
  getSessionServerSnapshot,
  getSessionSnapshot,
  seedDefaultUser,
  setSession,
  subscribeSession,
} from "../lib/users";
import { IconMail, IconShieldCheck } from "./Icons";
import { PanelButton } from "./PanelButton";

export function AuthGate({ children }: { children: ReactNode }) {
  const userId = useSyncExternalStore(
    subscribeSession,
    getSessionSnapshot,
    getSessionServerSnapshot
  );
  const [correo, setCorreo] = useState("");
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    seedDefaultUser();
  }, []);

  if (!userId) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-6">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand/25 blur-[120px]" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-gold/15 blur-[120px]" />
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          onSubmit={(e) => {
            e.preventDefault();
            const user = findUser(correo, codigo);
            if (!user) {
              setError("Correo o código incorrecto.");
            } else if (!user.activo) {
              setError("Esta cuenta está apagada. Pide a un administrador que la encienda.");
            } else if (user.pausado) {
              setError("Esta cuenta está pausada temporalmente.");
            } else {
              setSession(user.id);
            }
          }}
          className="relative w-full max-w-sm rounded-2xl border border-ink/5 bg-white p-8 shadow-2xl"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand/20 to-brand/5 text-brand ring-1 ring-inset ring-brand/20">
            <IconShieldCheck className="h-6 w-6" />
          </div>
          <p className="mt-4 text-[12px] font-semibold uppercase tracking-[0.28em] text-brand">
            Panel administrativo
          </p>
          <h1 className="font-serif-display mt-2 text-2xl font-medium text-ink">
            Visas Unidas
          </h1>

          <div className="relative mt-6">
            <IconMail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
            <input
              type="email"
              autoFocus
              value={correo}
              onChange={(e) => {
                setCorreo(e.target.value);
                setError("");
              }}
              placeholder="Correo"
              className="w-full rounded-xl border border-ink/15 py-3 pl-11 pr-4 text-sm outline-none transition-colors focus:border-brand"
            />
          </div>
          <input
            type="password"
            value={codigo}
            onChange={(e) => {
              setCodigo(e.target.value);
              setError("");
            }}
            placeholder="Código de acceso"
            className="mt-3 w-full rounded-xl border border-ink/15 px-4 py-3 text-sm outline-none transition-colors focus:border-brand"
          />
          {error && (
            <motion.p
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              className="mt-2 text-[13px] text-rose"
            >
              {error}
            </motion.p>
          )}
          <PanelButton type="submit" className="mt-4 w-full py-3 text-sm">
            Entrar
          </PanelButton>
          <p className="mt-4 text-[12px] leading-relaxed text-ink/40">
            Acceso de ejemplo: admin@visasunidas.com / visasunidas2026.
            Prototipo local: este acceso no es seguro para producción. Al
            conectar una base de datos real, sustituir por autenticación
            propia (ej. Supabase Auth).
          </p>
        </motion.form>
      </div>
    );
  }

  return <>{children}</>;
}
