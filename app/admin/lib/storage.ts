import { SERVICES } from "../../content";
import { fasesIniciales, type Fase } from "./fases";
import { documentosIniciales } from "./documentos";
import type { CategoriaArchivo } from "./archivos";
import { deleteBlob, saveBlob } from "./idb";
import type { Estado, Prioridad, Solicitud } from "./types";

const KEY = "visasunidas_solicitudes";

function normalize(s: Solicitud): Solicitud {
  return {
    ...s,
    folio: s.folio ?? `VU-${s.id.slice(0, 4).toUpperCase()}`,
    prioridad: s.prioridad ?? "Media",
    bitacora: s.bitacora ?? [],
    respuestas: s.respuestas ?? {},
    fases: s.fases ?? fasesIniciales(),
    documentos: s.documentos ?? documentosIniciales(s.tramiteSlug),
    archivos: s.archivos ?? [],
    esParaOtraPersona: s.esParaOtraPersona ?? false,
    contactoNombre: s.contactoNombre ?? s.clienteNombre,
    contactoTelefono: s.contactoTelefono ?? s.clienteTelefono,
    contactoEmail: s.contactoEmail ?? s.clienteEmail,
    nacionalidad: s.nacionalidad ?? "Mexicana",
    origen: s.origen ?? "Panel",
  };
}

function nextFolio(all: Solicitud[]): string {
  return `VU-${String(all.length + 1).padStart(4, "0")}`;
}

function read(): Solicitud[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as Solicitud[]) : [];
    return parsed.map(normalize);
  } catch {
    return [];
  }
}

function write(solicitudes: Solicitud[]) {
  window.localStorage.setItem(KEY, JSON.stringify(solicitudes));
}

export function listSolicitudes(): Solicitud[] {
  return read().sort((a, b) => b.actualizadoEn.localeCompare(a.actualizadoEn));
}

export function getSolicitud(id: string): Solicitud | undefined {
  return read().find((s) => s.id === id);
}

export function createSolicitud(input: {
  clienteNombre: string;
  clienteTelefono: string;
  clienteEmail: string;
  tramiteSlug: string;
  variante: string;
  notas: string;
  prioridad?: Prioridad;
  esParaOtraPersona?: boolean;
  contactoNombre?: string;
  contactoTelefono?: string;
  contactoEmail?: string;
  nacionalidad?: Solicitud["nacionalidad"];
  origen?: Solicitud["origen"];
}): Solicitud {
  const all = read();
  const now = new Date().toISOString();
  const solicitud: Solicitud = {
    id: crypto.randomUUID(),
    folio: nextFolio(all),
    ...input,
    prioridad: input.prioridad ?? "Media",
    esParaOtraPersona: input.esParaOtraPersona ?? false,
    contactoNombre: input.contactoNombre ?? input.clienteNombre,
    contactoTelefono: input.contactoTelefono ?? input.clienteTelefono,
    contactoEmail: input.contactoEmail ?? input.clienteEmail,
    nacionalidad: input.nacionalidad ?? "Mexicana",
    origen: input.origen ?? "Panel",
    estado: "Recibido",
    bitacora: [],
    respuestas: {},
    fases: fasesIniciales(),
    documentos: documentosIniciales(input.tramiteSlug),
    archivos: [],
    creadoEn: now,
    actualizadoEn: now,
    historial: [{ estado: "Recibido", fecha: now }],
  };
  all.push(solicitud);
  write(all);
  return solicitud;
}

export function updateEstado(id: string, estado: Estado, nota?: string) {
  const all = read();
  const idx = all.findIndex((s) => s.id === id);
  if (idx === -1) return;
  const now = new Date().toISOString();
  all[idx].estado = estado;
  all[idx].actualizadoEn = now;
  all[idx].historial.push({ estado, fecha: now, nota });
  write(all);
}

export function updatePrioridad(id: string, prioridad: Prioridad) {
  const all = read();
  const idx = all.findIndex((s) => s.id === id);
  if (idx === -1) return;
  all[idx].prioridad = prioridad;
  all[idx].actualizadoEn = new Date().toISOString();
  write(all);
}

export function updateNotas(id: string, notas: string) {
  const all = read();
  const idx = all.findIndex((s) => s.id === id);
  if (idx === -1) return;
  all[idx].notas = notas;
  all[idx].actualizadoEn = new Date().toISOString();
  write(all);
}

export function addNota(id: string, texto: string) {
  const all = read();
  const idx = all.findIndex((s) => s.id === id);
  if (idx === -1) return;
  const now = new Date().toISOString();
  all[idx].bitacora.push({ id: crypto.randomUUID(), fecha: now, texto });
  all[idx].actualizadoEn = now;
  write(all);
}

export function updateRespuesta(id: string, preguntaId: string, valor: boolean) {
  const all = read();
  const idx = all.findIndex((s) => s.id === id);
  if (idx === -1) return;
  all[idx].respuestas[preguntaId] = valor;
  all[idx].actualizadoEn = new Date().toISOString();
  write(all);
}

export function toggleFase(id: string, fase: Fase) {
  const all = read();
  const idx = all.findIndex((s) => s.id === id);
  if (idx === -1) return;
  const actual = all[idx].fases[fase];
  const completada = !actual.completada;
  const now = new Date().toISOString();
  all[idx].fases[fase] = { completada, fecha: completada ? now : null };
  all[idx].actualizadoEn = now;
  write(all);
}

export function toggleDocumento(id: string, docId: string) {
  const all = read();
  const idx = all.findIndex((s) => s.id === id);
  if (idx === -1) return;
  const docs = all[idx].documentos;
  const docIdx = docs.findIndex((d) => d.id === docId);
  if (docIdx === -1) return;
  const recibido = !docs[docIdx].recibido;
  const now = new Date().toISOString();
  docs[docIdx] = { ...docs[docIdx], recibido, fecha: recibido ? now : null };
  all[idx].actualizadoEn = now;
  write(all);
}

export function addDocumentoPersonalizado(id: string, nombre: string) {
  const all = read();
  const idx = all.findIndex((s) => s.id === id);
  if (idx === -1) return;
  all[idx].documentos.push({
    id: crypto.randomUUID(),
    nombre,
    recibido: false,
    fecha: null,
    personalizado: true,
  });
  all[idx].actualizadoEn = new Date().toISOString();
  write(all);
}

export function removeDocumentoPersonalizado(id: string, docId: string) {
  const all = read();
  const idx = all.findIndex((s) => s.id === id);
  if (idx === -1) return;
  all[idx].documentos = all[idx].documentos.filter(
    (d) => d.id !== docId || !d.personalizado
  );
  all[idx].actualizadoEn = new Date().toISOString();
  write(all);
}

export async function addArchivo(
  id: string,
  file: File,
  categoria: CategoriaArchivo
) {
  const all = read();
  const idx = all.findIndex((s) => s.id === id);
  if (idx === -1) return;
  const archivoId = crypto.randomUUID();
  await saveBlob(archivoId, file);
  all[idx].archivos.push({
    id: archivoId,
    nombre: file.name,
    categoria,
    tipo: file.type || "application/octet-stream",
    tamano: file.size,
    fecha: new Date().toISOString(),
  });
  all[idx].actualizadoEn = new Date().toISOString();
  write(all);
}

export async function removeArchivo(id: string, archivoId: string) {
  const all = read();
  const idx = all.findIndex((s) => s.id === id);
  if (idx === -1) return;
  all[idx].archivos = all[idx].archivos.filter((a) => a.id !== archivoId);
  all[idx].actualizadoEn = new Date().toISOString();
  write(all);
  await deleteBlob(archivoId);
}

export function deleteSolicitud(id: string) {
  write(read().filter((s) => s.id !== id));
}

interface DemoCaso {
  input: Parameters<typeof createSolicitud>[0];
  respuestas: Record<string, boolean>;
  estado: Estado;
  fasesCompletas: Fase[];
  documentosRecibidos?: string[];
  notaSeguimiento?: string;
}

const DEMO_CASOS: DemoCaso[] = [
  {
    input: {
      clienteNombre: "María López",
      clienteTelefono: "444 123 4567",
      clienteEmail: "maria.lopez@example.com",
      tramiteSlug: "visa-turista",
      variante: "Primera vez",
      notas: "Primera cita agendada para la próxima semana.",
      prioridad: "Media",
    },
    respuestas: { pasaporte_vigente: true, arraigo: true, rechazo_previo: false },
    estado: "Cita programada",
    fasesCompletas: ["Recepción de documentos", "Evaluación de viabilidad", "Preparación de expediente"],
    documentosRecibidos: [
      "Pasaporte vigente",
      "Comprobante de domicilio",
      "Comprobante de ingresos",
      "Fotografía tamaño pasaporte",
    ],
    notaSeguimiento: "Confirmó cita en el consulado para el próximo martes.",
  },
  {
    input: {
      clienteNombre: "Jorge Hernández",
      clienteTelefono: "444 987 6543",
      clienteEmail: "jorge.hdz@example.com",
      tramiteSlug: "perdon-deportacion",
      variante: "Readmisión tras deportación",
      notas: "Falta acta de nacimiento certificada.",
      prioridad: "Alta",
    },
    respuestas: { antecedentes_penales: true, tiempo_cumplido: false },
    estado: "Documentos pendientes",
    fasesCompletas: ["Recepción de documentos"],
    documentosRecibidos: [
      "Orden de deportación",
      "Identificación oficial",
      "Carta de antecedentes no penales",
    ],
    notaSeguimiento: "Se le pidió traer acta certificada antes de continuar.",
  },
  {
    input: {
      clienteNombre: "Rosa Martínez",
      clienteTelefono: "444 555 1212",
      clienteEmail: "rosa.martinez@example.com",
      tramiteSlug: "perdon-presencia-ilegal",
      variante: "I-601A (provisional)",
      notas: "Esposo es ciudadano americano, ya peticionó.",
      prioridad: "Alta",
    },
    respuestas: { peticionario: true, evidencia_hardship: true },
    estado: "En proceso",
    fasesCompletas: [
      "Recepción de documentos",
      "Evaluación de viabilidad",
      "Preparación de expediente",
      "Trámite ante autoridad",
    ],
    documentosRecibidos: [
      "Acta de nacimiento",
      "Pasaporte vigente",
      "Prueba de parentesco con el peticionario",
      "Evidencia de daño extremo (hardship)",
    ],
    notaSeguimiento: "Expediente enviado a USCIS, en espera de recibo.",
  },
  {
    input: {
      clienteNombre: "Carlos Núñez",
      clienteTelefono: "444 222 3344",
      clienteEmail: "carlos.nunez@example.com",
      tramiteSlug: "visa-emergencia",
      variante: "Fallecimiento de familiar",
      notas: "Falleció su padre, necesita viajar en 3 días.",
      prioridad: "Alta",
    },
    respuestas: { comprobante_emergencia: true, historial_limpio: true },
    estado: "Resuelto",
    fasesCompletas: [
      "Recepción de documentos",
      "Evaluación de viabilidad",
      "Preparación de expediente",
      "Trámite ante autoridad",
      "Seguimiento / cita",
      "Resolución final",
    ],
    documentosRecibidos: [
      "Pasaporte vigente",
      "Documento que acredite la emergencia (acta médica o de defunción)",
      "Comprobante de parentesco",
    ],
    notaSeguimiento: "Visa otorgada en cita de emergencia, caso cerrado.",
  },
  {
    input: {
      clienteNombre: "Lucía Ramírez",
      clienteTelefono: "444 777 8899",
      clienteEmail: "lucia.ramirez@example.com",
      tramiteSlug: "divorcios",
      variante: "Necesario (contencioso)",
      notas: "Hay dos hijos menores y una propiedad en disputa.",
      prioridad: "Media",
    },
    respuestas: { acuerdo_mutuo: false, bienes_hijos_disputa: true },
    estado: "En proceso",
    fasesCompletas: ["Recepción de documentos"],
    documentosRecibidos: ["Acta de matrimonio", "Identificación oficial de ambas partes"],
    notaSeguimiento: "Se canalizó con abogado familiar por la disputa de bienes.",
  },
  {
    input: {
      clienteNombre: "Esteban Gómez",
      clienteTelefono: "444 333 4455",
      clienteEmail: "esteban.gomez@example.com",
      tramiteSlug: "curp",
      variante: "Corrección",
      notas: "Error de apellido en CURP actual.",
      prioridad: "Baja",
    },
    respuestas: { doc_identidad: true },
    estado: "Resuelto",
    fasesCompletas: [
      "Recepción de documentos",
      "Evaluación de viabilidad",
      "Preparación de expediente",
      "Trámite ante autoridad",
      "Resolución final",
    ],
    documentosRecibidos: ["Acta de nacimiento", "Identificación oficial"],
    notaSeguimiento: "CURP corregido y entregado al cliente.",
  },
  {
    input: {
      clienteNombre: "Patricia Villalobos",
      clienteTelefono: "444 909 1122",
      clienteEmail: "patricia.v@example.com",
      tramiteSlug: "pasaportes",
      variante: "Menor de edad",
      notas: "Trámite para su hija de 8 años, viaje familiar en 2 meses.",
      prioridad: "Baja",
    },
    respuestas: { acta_vigente: true },
    estado: "Recibido",
    fasesCompletas: [],
    notaSeguimiento: "Cita agendada para la próxima semana en oficina de pasaportes.",
  },
  {
    input: {
      clienteNombre: "Miguel Ángel Torres",
      clienteTelefono: "444 404 5566",
      clienteEmail: "miguel.torres@example.com",
      tramiteSlug: "foia",
      variante: "FOIA ICE",
      notas: "Necesita su expediente completo para audiencia.",
      prioridad: "Media",
    },
    respuestas: { identificacion_foia: true },
    estado: "En proceso",
    fasesCompletas: ["Recepción de documentos", "Preparación de expediente"],
    documentosRecibidos: ["Identificación oficial", "Formato de autorización FOIA firmado"],
    notaSeguimiento: "Solicitud enviada, ICE indica hasta 60 días de respuesta.",
  },
  {
    input: {
      clienteNombre: "Guadalupe Sánchez",
      clienteTelefono: "444 616 2233",
      clienteEmail: "guadalupe.sanchez@example.com",
      tramiteSlug: "rectificacion-actas",
      variante: "Nulidad judicial",
      notas: "Doble registro de nacimiento en dos municipios distintos.",
      prioridad: "Media",
    },
    respuestas: { copia_acta: true },
    estado: "Documentos pendientes",
    fasesCompletas: ["Recepción de documentos"],
    documentosRecibidos: ["Identificación oficial"],
    notaSeguimiento: "Se solicitaron copias certificadas de ambos registros.",
  },
  {
    input: {
      clienteNombre: "Antonio Flores",
      clienteTelefono: "444 727 3344",
      clienteEmail: "antonio.flores@example.com",
      tramiteSlug: "visa-turista",
      variante: "Negada anteriormente",
      notas: "Visa negada hace 2 años, busca aplicar de nuevo.",
      prioridad: "Baja",
    },
    respuestas: { pasaporte_vigente: true, arraigo: false, rechazo_previo: true },
    estado: "Cancelado",
    fasesCompletas: ["Recepción de documentos", "Evaluación de viabilidad"],
    documentosRecibidos: ["Pasaporte vigente"],
    notaSeguimiento: "No cumple arraigo suficiente por el momento, se le orientó para fortalecer su caso más adelante.",
  },
  {
    input: {
      clienteNombre: "Ramón Castillo",
      clienteTelefono: "444 818 4477",
      clienteEmail: "ramon.castillo@example.com",
      tramiteSlug: "procesos-administrativos",
      variante: "Seguimiento de trámite",
      notas: "Dio seguimiento a un trámite iniciado hace 3 meses, sin respuesta de la autoridad.",
      prioridad: "Alta",
    },
    respuestas: { identificacion: true },
    estado: "En proceso",
    fasesCompletas: ["Recepción de documentos", "Evaluación de viabilidad"],
    documentosRecibidos: ["Identificación oficial"],
    notaSeguimiento: "Se envió oficio de seguimiento a la dependencia correspondiente.",
  },
  {
    input: {
      clienteNombre: "Beatriz Mendoza",
      clienteTelefono: "444 252 6611",
      clienteEmail: "beatriz.mendoza@example.com",
      tramiteSlug: "actas",
      variante: "Acta de nacimiento",
      notas: "Necesita copia certificada para trámite escolar de su hijo.",
      prioridad: "Baja",
    },
    respuestas: { datos_registro: true },
    estado: "Resuelto",
    fasesCompletas: [
      "Recepción de documentos",
      "Evaluación de viabilidad",
      "Preparación de expediente",
      "Trámite ante autoridad",
      "Resolución final",
    ],
    documentosRecibidos: ["Identificación oficial", "Datos del registro (lugar y fecha)"],
    notaSeguimiento: "Acta certificada entregada al cliente.",
  },
  {
    input: {
      clienteNombre: "Fernando Aguilar",
      clienteTelefono: "444 363 7722",
      clienteEmail: "fernando.aguilar@example.com",
      tramiteSlug: "visa-turista",
      variante: "Renovación",
      notas: "Quiere renovar su visa antes de que venza en dos meses.",
      prioridad: "Media",
    },
    // Solo respondió una de las tres preguntas: viabilidad queda "Pendiente" hasta completar la evaluación.
    respuestas: { pasaporte_vigente: true },
    estado: "Recibido",
    fasesCompletas: ["Recepción de documentos"],
    documentosRecibidos: ["Pasaporte vigente", "Fotografía tamaño pasaporte"],
    notaSeguimiento: "Pendiente terminar la evaluación de arraigo e historial previo.",
  },
  {
    input: {
      clienteNombre: "Silvia Reyes",
      clienteTelefono: "444 141 9933",
      clienteEmail: "silvia.reyes@example.com",
      tramiteSlug: "perdon-presencia-ilegal",
      variante: "I-601 (regular)",
      notas: "Caso urgente: tiene cita consular programada en 3 semanas.",
      prioridad: "Alta",
    },
    respuestas: { peticionario: true, evidencia_hardship: false },
    estado: "Documentos pendientes",
    fasesCompletas: ["Recepción de documentos"],
    documentosRecibidos: ["Acta de nacimiento", "Pasaporte vigente"],
    notaSeguimiento: "Falta reforzar evidencia de hardship antes de la cita consular.",
  },
  {
    input: {
      clienteNombre: "Elena Vargas",
      clienteTelefono: "444 282 5511",
      clienteEmail: "elena.vargas@example.com",
      tramiteSlug: "visa-emergencia",
      variante: "Otro caso urgente",
      notas: "Necesita viajar por cirugía de emergencia de su madre.",
      prioridad: "Alta",
    },
    respuestas: { comprobante_emergencia: true, historial_limpio: true },
    estado: "En proceso",
    fasesCompletas: [
      "Recepción de documentos",
      "Evaluación de viabilidad",
      "Preparación de expediente",
    ],
    documentosRecibidos: [
      "Pasaporte vigente",
      "Documento que acredite la emergencia (acta médica o de defunción)",
    ],
    notaSeguimiento: "En trámite con el consulado para cita de emergencia esta semana.",
  },
  {
    input: {
      clienteNombre: "Héctor Morales",
      clienteTelefono: "444 636 8822",
      clienteEmail: "hector.morales@example.com",
      tramiteSlug: "divorcios",
      variante: "Voluntario",
      notas: "Ambos de acuerdo, sin hijos menores ni bienes en disputa.",
      prioridad: "Baja",
    },
    respuestas: { acuerdo_mutuo: true, bienes_hijos_disputa: false },
    estado: "Resuelto",
    fasesCompletas: [
      "Recepción de documentos",
      "Evaluación de viabilidad",
      "Preparación de expediente",
      "Trámite ante autoridad",
      "Seguimiento / cita",
      "Resolución final",
    ],
    documentosRecibidos: [
      "Acta de matrimonio",
      "Identificación oficial de ambas partes",
    ],
    notaSeguimiento: "Convenio de divorcio voluntario firmado y protocolizado, caso cerrado.",
  },
  {
    input: {
      clienteNombre: "Teresa Ibarra",
      clienteTelefono: "444 494 3366",
      clienteEmail: "teresa.ibarra@example.com",
      tramiteSlug: "pasaportes",
      variante: "Americano — renovación",
      notas: "Su pasaporte americano venció hace 6 meses.",
      prioridad: "Media",
    },
    respuestas: { acta_vigente: true },
    estado: "Cita programada",
    fasesCompletas: [
      "Recepción de documentos",
      "Evaluación de viabilidad",
      "Preparación de expediente",
      "Trámite ante autoridad",
    ],
    documentosRecibidos: [
      "Acta de nacimiento certificada",
      "Comprobante de domicilio",
      "Fotografía tamaño pasaporte",
    ],
    notaSeguimiento: "Cita en oficina de pasaportes confirmada para la próxima semana.",
  },
  {
    input: {
      clienteNombre: "Javier Domínguez",
      clienteTelefono: "444 757 2288",
      clienteEmail: "javier.dominguez@example.com",
      tramiteSlug: "foia",
      variante: "FOIA USCIS",
      notas: "Necesita su expediente migratorio completo para su abogado.",
      prioridad: "Media",
    },
    respuestas: { identificacion_foia: true },
    estado: "En proceso",
    fasesCompletas: ["Recepción de documentos", "Preparación de expediente"],
    documentosRecibidos: ["Identificación oficial"],
    notaSeguimiento: "Solicitud FOIA enviada a USCIS, en espera de respuesta (hasta 90 días).",
  },
];

function sembrarCasosDemo() {
  DEMO_CASOS.forEach((caso) => {
    const s = createSolicitud(caso.input);
    Object.entries(caso.respuestas).forEach(([preguntaId, valor]) =>
      updateRespuesta(s.id, preguntaId, valor)
    );
    updateEstado(s.id, caso.estado);
    caso.fasesCompletas.forEach((fase) => toggleFase(s.id, fase));
    const recibidos = new Set(caso.documentosRecibidos ?? []);
    const actual = getSolicitud(s.id);
    actual?.documentos
      .filter((d) => recibidos.has(d.nombre))
      .forEach((d) => toggleDocumento(s.id, d.id));
    if (caso.notaSeguimiento) addNota(s.id, caso.notaSeguimiento);
  });
}

export function seedDemoData() {
  if (read().length > 0) return;
  sembrarCasosDemo();
}

/** Borra TODAS las solicitudes actuales (incluidas las reales capturadas)
 * y vuelve a cargar únicamente los casos de ejemplo. Acción irreversible. */
export function resetDemoData() {
  write([]);
  sembrarCasosDemo();
}

export function tramiteLabel(slug: string): string {
  return SERVICES.find((s) => s.slug === slug)?.title ?? slug;
}
