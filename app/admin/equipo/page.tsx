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
  "bg-brand/15 text-[#9ba0ff]",
  "bg-gold/15 text-gold",
  "bg-emerald-400/15 text-emerald-300",
  "bg-coral/15 text-[#ff8079]",
  "bg-violet-400/15 text-violet-300",
  "bg-sky-400/15 text-sky-300",
];

const ROL_STYLE: Record<Rol, string> = {
  Administrador: "bg-brand/15 text-[#9ba0ff]",
  "Asesor legal": "bg-gold/15 text-gold",
  Recepción: "bg-white/8 text-white/55",
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
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/15 text-[#9ba0ff]">
          <IconUsers />
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Equipo
          </h1>
          <p className="text-sm text-white/55">
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
        className="mt-6 flex flex-wrap items-end gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-5 backdrop-blur-sm"
      >
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre"
          className="min-w-[140px] flex-1 rounded-xl border border-white/12 bg-white/5 text-white/80 px-3 py-2 text-sm outline-none transition-colors focus:border-brand"
        />
        <input
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          placeholder="Correo"
          className="min-w-[180px] flex-1 rounded-xl border border-white/12 bg-white/5 text-white/80 px-3 py-2 text-sm outline-none transition-colors focus:border-brand"
        />
        <input
          value={codigoAcceso}
          onChange={(e) => setCodigoAcceso(e.target.value)}
          placeholder="Código de acceso"
          className="min-w-[140px] flex-1 rounded-xl border border-white/12 bg-white/5 text-white/80 px-3 py-2 text-sm outline-none transition-colors focus:border-brand"
        />
        <select
          value={rol}
          onChange={(e) => setRol(e.target.value as Rol)}
          className="rounded-xl border border-white/12 bg-white/5 text-white/80 px-3 py-2 text-sm outline-none transition-colors focus:border-brand sel"
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
          className="mt-2 text-[13px] text-coral"
        >
          {error}
        </motion.p>
      )}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-white/8 bg-white/[0.03]">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/4 text-[12px] uppercase tracking-wide text-white/45">
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
                className={`border-t border-white/6 transition-colors hover:bg-white/5 ${
                  !u.activo || u.pausado ? "bg-white/4" : ""
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
                      className={`font-medium ${!u.activo || u.pausado ? "text-white/35" : "text-white"}`}
                    >
                      {u.nombre}
                    </span>
                    {u.id === currentUserId && (
                      <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-semibold text-brand">
                        Tú
                      </span>
                    )}
                    {!u.activo && (
                      <span className="rounded-full bg-coral/10 px-2 py-0.5 text-[11px] font-semibold text-coral">
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
                      className={`rounded-full border-0 px-2.5 py-1 text-[12px] font-medium outline-none sel sel-sm ${ROL_STYLE[u.rol]}`}
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
                <td className="px-5 py-3 text-white/65">
                  <span className="flex items-center gap-1.5">
                    <IconMail className="h-3.5 w-3.5 text-white/30" />
                    {u.correo}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex flex-col items-start gap-1">
                    <ToggleSwitch
                      checked={u.activo}
                      disabled={!esAdmin || u.id === currentUserId}
                      title={
                        u.id === currentUserId
                          ? "No puedes apagar tu propia cuenta"
                          : undefined
                      }
                      onChange={async (next) => {
                        if (!next) {
                          setConfirmarApagar(u);
                          return;
                        }
                        await setActivo(u.id, true);
                        reload();
                      }}
                    />
                    <span className="text-[11px] font-medium text-white/35">
                      {u.activo ? "Encendida" : "Apagada"}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="flex flex-col items-start gap-1">
                    <ToggleSwitch
                      checked={u.pausado}
                      disabled={!esAdmin || u.id === currentUserId}
                      activeColor="#c9973f"
                      title={
                        u.id === currentUserId
                          ? "No puedes pausar tu propia cuenta"
                          : undefined
                      }
                      onChange={async (next) => {
                        await setPausado(u.id, next);
                        reload();
                      }}
                    />
                    <span className="text-[11px] font-medium text-white/35">
                      {u.pausado ? "Pausada" : "Normal"}
                    </span>
                  </div>
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
                      className="inline-flex items-center gap-1.5 text-[13px] font-medium text-coral hover:underline"
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
        <p className="mt-4 text-[13px] text-white/35">
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
              className="fixed left-1/2 top-1/2 z-[90] w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-[#121218] p-6 shadow-2xl backdrop-blur-md"
            >
              <p className="text-[17px] font-semibold text-white">
                ¿Apagar la cuenta de {confirmarApagar.nombre}?
              </p>
              <p className="mt-2 text-[14px] leading-relaxed text-white/55">
                No podrá iniciar sesión en el panel hasta que vuelvas a
                encenderla. Se quedará apagada por tiempo indefinido.
              </p>
              <div className="mt-6 flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setConfirmarApagar(null)}
                  className="flex-1 rounded-xl border border-emerald-400/40 bg-emerald-400/10 py-2.5 text-[14px] font-semibold text-emerald-300 transition-colors hover:bg-emerald-400/20"
                >
                  Cancelar
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={async () => {
                    await setActivo(confirmarApagar.id, false);
                    reload();
                    setConfirmarApagar(null);
                  }}
                  className="flex-1 rounded-xl bg-coral py-2.5 text-[14px] font-semibold text-white transition-colors hover:brightness-110"
                >
                  Sí, continuar
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
