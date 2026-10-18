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
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0a0f] px-6 [font-family:var(--font-plex)]">
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          onSubmit={async (e) => {
            e.preventDefault();
            const user = await findUser(correo, codigo);
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
          className="relative w-full max-w-sm rounded-2xl border border-white/8 bg-white/[0.04] p-8 backdrop-blur-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/20 text-[#9ba0ff] ring-1 ring-inset ring-brand/30">
            <IconShieldCheck className="h-6 w-6" />
          </div>
          <p className="mt-4 text-[12px] font-semibold uppercase tracking-[0.28em] text-[#9ba0ff]">
            Panel administrativo
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">
            Visas Unidas
          </h1>

          <div className="relative mt-6">
            <IconMail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              type="email"
              autoFocus
              value={correo}
              onChange={(e) => {
                setCorreo(e.target.value);
                setError("");
              }}
              placeholder="Correo"
              className="w-full rounded-xl border border-white/12 bg-white/5 py-3 pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-brand"
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
            className="mt-3 w-full rounded-xl border border-white/12 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-brand"
          />
          {error && (
            <motion.p
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              className="mt-2 text-[13px] text-[#ff8079]"
            >
              {error}
            </motion.p>
          )}
          <PanelButton type="submit" className="mt-4 w-full py-3 text-sm">
            Entrar
          </PanelButton>
          <p className="mt-4 text-[12px] leading-relaxed text-white/35">
            Acceso de ejemplo: admin@visasunidas.com / visasunidas2026. Los
            datos ya viven en una base de datos real (Supabase), pero este
            login sigue siendo propio del panel, no Supabase Auth — para
            producción conviene reforzarlo con autenticación real.
          </p>
        </motion.form>
      </div>
    );
  }

  return <>{children}</>;
}
