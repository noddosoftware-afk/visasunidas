export const ROLES = ["Administrador", "Asesor legal", "Recepción"] as const;

export type Rol = (typeof ROLES)[number];

export interface AdminUser {
  id: string;
  nombre: string;
  correo: string;
  codigoAcceso: string;
  rol: Rol;
  activo: boolean;
  pausado: boolean;
  creadoEn: string;
}

const KEY = "visasunidas_admin_users";
export const SESSION_KEY = "visasunidas_admin_session_user";

function read(): AdminUser[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as AdminUser[]) : [];
    return parsed.map((u) => ({
      ...u,
      rol: u.rol ?? "Recepción",
      activo: u.activo ?? true,
      pausado: u.pausado ?? false,
    }));
  } catch {
    return [];
  }
}

function write(users: AdminUser[]) {
  window.localStorage.setItem(KEY, JSON.stringify(users));
}

export function seedDefaultUser() {
  if (typeof window === "undefined" || read().length > 0) return;
  write([
    {
      id: crypto.randomUUID(),
      nombre: "Administrador",
      correo: "admin@visasunidas.com",
      codigoAcceso: "visasunidas2026",
      rol: "Administrador",
      activo: true,
      pausado: false,
      creadoEn: new Date().toISOString(),
    },
  ]);
}

export function listUsers(): AdminUser[] {
  return read().sort((a, b) => a.creadoEn.localeCompare(b.creadoEn));
}

export function getUserById(id: string): AdminUser | undefined {
  return read().find((u) => u.id === id);
}

export function findUser(correo: string, codigoAcceso: string): AdminUser | undefined {
  const correoNorm = correo.trim().toLowerCase();
  return read().find(
    (u) => u.correo.toLowerCase() === correoNorm && u.codigoAcceso === codigoAcceso
  );
}

export function correoExiste(correo: string): boolean {
  const correoNorm = correo.trim().toLowerCase();
  return read().some((u) => u.correo.toLowerCase() === correoNorm);
}

export function createUser(input: {
  nombre: string;
  correo: string;
  codigoAcceso: string;
  rol: Rol;
}): AdminUser {
  const user: AdminUser = {
    id: crypto.randomUUID(),
    ...input,
    activo: true,
    pausado: false,
    creadoEn: new Date().toISOString(),
  };
  const all = read();
  all.push(user);
  write(all);
  return user;
}

export function updateRol(id: string, rol: Rol) {
  const all = read();
  const idx = all.findIndex((u) => u.id === id);
  if (idx === -1) return;
  all[idx].rol = rol;
  write(all);
}

export function setActivo(id: string, activo: boolean) {
  const all = read();
  const idx = all.findIndex((u) => u.id === id);
  if (idx === -1) return;
  all[idx].activo = activo;
  write(all);
}

export function setPausado(id: string, pausado: boolean) {
  const all = read();
  const idx = all.findIndex((u) => u.id === id);
  if (idx === -1) return;
  all[idx].pausado = pausado;
  write(all);
}

export function deleteUser(id: string) {
  write(read().filter((u) => u.id !== id));
}

export function getCurrentUserId(): string | null {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(SESSION_KEY);
}

type Listener = () => void;
let sessionListeners: Listener[] = [];

function notifySession() {
  sessionListeners.forEach((l) => l());
}

export function subscribeSession(listener: Listener): () => void {
  sessionListeners.push(listener);
  return () => {
    sessionListeners = sessionListeners.filter((l) => l !== listener);
  };
}

export function getSessionSnapshot(): string | null {
  return getCurrentUserId();
}

export function getSessionServerSnapshot(): string | null {
  return null;
}

export function setSession(userId: string) {
  window.sessionStorage.setItem(SESSION_KEY, userId);
  notifySession();
}

export function clearSession() {
  window.sessionStorage.removeItem(SESSION_KEY);
  notifySession();
}
