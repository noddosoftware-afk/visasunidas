"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  correoExiste,
  createUser,
  deleteUser,
  getCurrentUserId,
  getUserById,
  listUsers,
  ROLES,
  setActivo,
  setPausado,
  updateRol,
  type AdminUser,
  type Rol,
} from "../lib/users";
import { IconMail, IconTrash, IconUserPlus, IconUsers } from "../components/Icons";
import { PanelButton } from "../components/PanelButton";
import { ToggleSwitch } from "../components/ToggleSwitch";

const AVATAR_TONES = [
  "bg-brand/10 text-brand",
  "bg-gold/15 text-gold",
  "bg-emerald-100 text-emerald-700",
  "bg-rose/10 text-rose",
  "bg-violet-100 text-violet-700",
  "bg-sky-100 text-sky-700",
];

const ROL_STYLE: Record<Rol, string> = {
  Administrador: "bg-brand/10 text-brand",
  "Asesor legal": "bg-gold/15 text-gold",
  Recepción: "bg-ink/8 text-ink/60",
};

function iniciales(nombre: string) {
  return nombre
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export default function Equipo() {
  const currentUserId = getCurrentUserId();
  const [currentUser, setCurrentUser] = useState<AdminUser | undefined>(undefined);
  const esAdmin = currentUser?.rol === "Administrador";

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [codigoAcceso, setCodigoAcceso] = useState("");
  const [rol, setRol] = useState<Rol>("Recepción");
  const [error, setError] = useState("");
  const [confirmarApagar, setConfirmarApagar] = useState<AdminUser | null>(null);

  const reload = () => listUsers().then(setUsers);

  useEffect(() => {
    reload();
    if (currentUserId) getUserById(currentUserId).then(setCurrentUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
          <IconUsers />
        </span>
        <div>
          <h1 className="font-serif-display text-2xl font-medium text-ink">
            Equipo
          </h1>
          <p className="text-sm text-ink/60">
            {esAdmin
              ? "Da acceso al panel, cambia roles y activa o pausa cuentas."
              : "Da acceso al panel a alguien más con su propio correo y código."}
          </p>
        </div>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={async (e) => {
          e.preventDefault();
          if (!nombre || !correo || !codigoAcceso) {
            setError("Completa nombre, correo y código.");
            return;
          }
          if (await correoExiste(correo)) {
            setError("Ese correo ya tiene acceso.");
            return;
          }
          await createUser({ nombre, correo, codigoAcceso, rol });
          reload();
          setNombre("");
          setCorreo("");
          setCodigoAcceso("");
          setRol("Recepción");
          setError("");
        }}
        className="mt-6 flex flex-wrap items-end gap-3 rounded-2xl border border-ink/8 bg-white p-5"
      >
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre"
          className="min-w-[140px] flex-1 rounded-xl border border-ink/15 px-3 py-2 text-sm outline-none transition-colors focus:border-brand"
        />
        <input
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          placeholder="Correo"
          className="min-w-[180px] flex-1 rounded-xl border border-ink/15 px-3 py-2 text-sm outline-none transition-colors focus:border-brand"
        />
        <input
          value={codigoAcceso}
          onChange={(e) => setCodigoAcceso(e.target.value)}
          placeholder="Código de acceso"
          className="min-w-[140px] flex-1 rounded-xl border border-ink/15 px-3 py-2 text-sm outline-none transition-colors focus:border-brand"
        />
        <select
          value={rol}
          onChange={(e) => setRol(e.target.value as Rol)}
          className="rounded-xl border border-ink/15 px-3 py-2 text-sm outline-none transition-colors focus:border-brand"
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <PanelButton type="submit">
          <IconUserPlus className="h-4 w-4" />
          Añadir
        </PanelButton>
      </motion.form>
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 text-[13px] text-rose"
        >
          {error}
        </motion.p>
      )}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-ink/8 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink/3 text-[12px] uppercase tracking-wide text-ink/50">
            <tr>
              <th className="px-5 py-3">Nombre</th>
              <th className="px-5 py-3">Rol</th>
              <th className="px-5 py-3">Correo</th>
              <th className="px-5 py-3">Cuenta</th>
              <th className="px-5 py-3">Pausada</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <motion.tr
                key={u.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`border-t border-ink/6 transition-colors hover:bg-paper-dim ${
                  !u.activo || u.pausado ? "bg-ink/3" : ""
                }`}
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-semibold ${AVATAR_TONES[i % AVATAR_TONES.length]} ${
                        !u.activo || u.pausado ? "opacity-50" : ""
                      }`}
                    >
                      {iniciales(u.nombre) || "?"}
                    </span>
                    <span
                      className={`font-medium ${!u.activo || u.pausado ? "text-ink/40" : "text-ink"}`}
                    >
                      {u.nombre}
                    </span>
                    {u.id === currentUserId && (
                      <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-semibold text-brand">
                        Tú
                      </span>
                    )}
                    {!u.activo && (
                      <span className="rounded-full bg-rose/10 px-2 py-0.5 text-[11px] font-semibold text-rose">
                        Apagada
                      </span>
                    )}
                    {u.activo && u.pausado && (
                      <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[11px] font-semibold text-gold">
                        Pausada
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-3">
                  {esAdmin ? (
                    <select
                      value={u.rol}
                      onChange={async (e) => {
                        await updateRol(u.id, e.target.value as Rol);
                        reload();
                      }}
                      className={`rounded-full border-0 px-2.5 py-1 text-[12px] font-medium outline-none ${ROL_STYLE[u.rol]}`}
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span
                      className={`rounded-full px-2.5 py-1 text-[12px] font-medium ${ROL_STYLE[u.rol]}`}
                    >
                      {u.rol}
                    </span>
                  )}
                </td>
                <td className="px-5 py-3 text-ink/70">
                  <span className="flex items-center gap-1.5">
                    <IconMail className="h-3.5 w-3.5 text-ink/35" />
                    {u.correo}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <ToggleSwitch
                    checked={u.activo}
                    disabled={!esAdmin}
                    activeColor="bg-emerald-500"
                    onChange={async (next) => {
                      if (!next) {
                        setConfirmarApagar(u);
                        return;
                      }
                      await setActivo(u.id, true);
                      reload();
                    }}
                  />
                </td>
                <td className="px-5 py-3">
                  <ToggleSwitch
                    checked={u.pausado}
                    disabled={!esAdmin}
                    activeColor="bg-gold"
                    onChange={async (next) => {
                      await setPausado(u.id, next);
                      reload();
                    }}
                  />
                </td>
                <td className="px-5 py-3 text-right">
                  {users.length > 1 && (
                    <button
                      onClick={async () => {
                        if (confirm(`¿Quitar acceso a ${u.nombre}?`)) {
                          await deleteUser(u.id);
                          reload();
                        }
                      }}
                      className="inline-flex items-center gap-1.5 text-[13px] font-medium text-rose hover:underline"
                    >
                      <IconTrash className="h-3.5 w-3.5" />
                      Quitar
                    </button>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {!esAdmin && (
        <p className="mt-4 text-[13px] text-ink/40">
          Solo un Administrador puede cambiar roles o activar/pausar cuentas.
        </p>
      )}

      <AnimatePresence>
        {confirmarApagar && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmarApagar(null)}
              className="fixed inset-0 z-[80] bg-ink/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              transition={{ duration: 0.2 }}
              className="fixed left-1/2 top-1/2 z-[90] w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl"
            >
              <p className="text-[17px] font-semibold text-ink">
                ¿Apagar la cuenta de {confirmarApagar.nombre}?
              </p>
              <p className="mt-2 text-[14px] leading-relaxed text-ink/60">
                No podrá iniciar sesión en el panel hasta que vuelvas a
                encenderla. Se quedará apagada por tiempo indefinido.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setConfirmarApagar(null)}
                  className="flex-1 rounded-xl border-2 border-emerald-500 py-2.5 text-[14px] font-semibold text-emerald-600 transition-colors hover:bg-emerald-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={async () => {
                    await setActivo(confirmarApagar.id, false);
                    reload();
                    setConfirmarApagar(null);
                  }}
                  className="flex-1 rounded-xl bg-rose py-2.5 text-[14px] font-semibold text-white transition-colors hover:brightness-95"
                >
                  Sí, continuar
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
