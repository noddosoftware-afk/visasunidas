import { supabase } from "../../lib/supabaseClient";

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

interface AdminUserRow {
  id: string;
  nombre: string;
  correo: string;
  codigo_acceso: string;
  rol: Rol;
  activo: boolean;
  pausado: boolean;
  creado_en: string;
}

const TABLE = "admin_users";
export const SESSION_KEY = "visasunidas_admin_session_user";

function rowToUser(r: AdminUserRow): AdminUser {
  return {
    id: r.id,
    nombre: r.nombre,
    correo: r.correo,
    codigoAcceso: r.codigo_acceso,
    rol: r.rol,
    activo: r.activo,
    pausado: r.pausado,
    creadoEn: r.creado_en,
  };
}

export async function seedDefaultUser() {
  const { count } = await supabase.from(TABLE).select("*", { count: "exact", head: true });
  if ((count ?? 0) > 0) return;
  await supabase.from(TABLE).insert({
    nombre: "Administrador",
    correo: "admin@visasunidas.com",
    codigo_acceso: "visasunidas2026",
    rol: "Administrador",
    activo: true,
    pausado: false,
  });
}

export async function listUsers(): Promise<AdminUser[]> {
  const { data, error } = await supabase.from(TABLE).select("*").order("creado_en", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(rowToUser);
}

export async function getUserById(id: string): Promise<AdminUser | undefined> {
  const { data, error } = await supabase.from(TABLE).select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? rowToUser(data) : undefined;
}

export async function findUser(correo: string, codigoAcceso: string): Promise<AdminUser | undefined> {
  const correoNorm = correo.trim().toLowerCase();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .ilike("correo", correoNorm)
    .eq("codigo_acceso", codigoAcceso)
    .maybeSingle();
  if (error) throw error;
  return data ? rowToUser(data) : undefined;
}

export async function correoExiste(correo: string): Promise<boolean> {
  const correoNorm = correo.trim().toLowerCase();
  const { count } = await supabase
    .from(TABLE)
    .select("*", { count: "exact", head: true })
    .ilike("correo", correoNorm);
  return (count ?? 0) > 0;
}

export async function createUser(input: {
  nombre: string;
  correo: string;
  codigoAcceso: string;
  rol: Rol;
}): Promise<AdminUser> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      nombre: input.nombre,
      correo: input.correo,
      codigo_acceso: input.codigoAcceso,
      rol: input.rol,
      activo: true,
      pausado: false,
    })
    .select()
    .single();
  if (error) throw error;
  return rowToUser(data);
}

export async function updateRol(id: string, rol: Rol) {
  await supabase.from(TABLE).update({ rol }).eq("id", id);
}

export async function setActivo(id: string, activo: boolean) {
  await supabase.from(TABLE).update({ activo }).eq("id", id);
}

export async function setPausado(id: string, pausado: boolean) {
  await supabase.from(TABLE).update({ pausado }).eq("id", id);
}

export async function deleteUser(id: string) {
  await supabase.from(TABLE).delete().eq("id", id);
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
