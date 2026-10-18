import { supabase } from "../../lib/supabaseClient";
import { SERVICES } from "../../content";
import { fasesIniciales, type Fase, type FasesState } from "./fases";
import { documentosIniciales } from "./documentos";
import type { DocumentoItem } from "./documentos";
import type { Estado, HistorialEntry, NotaEntry, Prioridad, Solicitud } from "./types";

const TABLE = "solicitudes";

interface SolicitudRow {
  id: string;
  folio: string;
  cliente_nombre: string;
  cliente_telefono: string;
  cliente_email: string;
  es_para_otra_persona: boolean;
  contacto_nombre: string;
  contacto_telefono: string;
  contacto_email: string;
  nacionalidad: Solicitud["nacionalidad"];
  origen: Solicitud["origen"];
  tramite_slug: string;
  variante: string;
  estado: Estado;
  prioridad: Prioridad;
  notas: string;
  bitacora: NotaEntry[];
  respuestas: Record<string, boolean | null>;
  fases: FasesState;
  documentos: DocumentoItem[];
  historial: HistorialEntry[];
  creado_en: string;
  actualizado_en: string;
}

function rowToSolicitud(r: SolicitudRow): Solicitud {
  return {
    id: r.id,
    folio: r.folio,
    clienteNombre: r.cliente_nombre,
    clienteTelefono: r.cliente_telefono,
    clienteEmail: r.cliente_email,
    esParaOtraPersona: r.es_para_otra_persona,
    contactoNombre: r.contacto_nombre,
    contactoTelefono: r.contacto_telefono,
    contactoEmail: r.contacto_email,
    nacionalidad: r.nacionalidad,
    origen: r.origen,
    tramiteSlug: r.tramite_slug,
    variante: r.variante,
    estado: r.estado,
    prioridad: r.prioridad,
    notas: r.notas,
    bitacora: r.bitacora ?? [],
    respuestas: r.respuestas ?? {},
    fases: r.fases ?? fasesIniciales(),
    documentos: r.documentos ?? [],
    creadoEn: r.creado_en,
    actualizadoEn: r.actualizado_en,
    historial: r.historial ?? [],
  };
}

async function nextFolio(): Promise<string> {
  const { count } = await supabase
    .from(TABLE)
    .select("*", { count: "exact", head: true });
  return `VU-${String((count ?? 0) + 1).padStart(4, "0")}`;
}

export async function listSolicitudes(): Promise<Solicitud[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("actualizado_en", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToSolicitud);
}

export async function getSolicitud(id: string): Promise<Solicitud | undefined> {
  const { data, error } = await supabase.from(TABLE).select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? rowToSolicitud(data) : undefined;
}

export async function createSolicitud(input: {
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
}): Promise<Solicitud> {
  const folio = await nextFolio();
  const now = new Date().toISOString();
  const row = {
    folio,
    cliente_nombre: input.clienteNombre,
    cliente_telefono: input.clienteTelefono,
    cliente_email: input.clienteEmail,
    es_para_otra_persona: input.esParaOtraPersona ?? false,
    contacto_nombre: input.contactoNombre ?? input.clienteNombre,
    contacto_telefono: input.contactoTelefono ?? input.clienteTelefono,
    contacto_email: input.contactoEmail ?? input.clienteEmail,
    nacionalidad: input.nacionalidad ?? "Mexicana",
    origen: input.origen ?? "Panel",
    tramite_slug: input.tramiteSlug,
    variante: input.variante,
    estado: "Recibido" as Estado,
    prioridad: input.prioridad ?? "Media",
    notas: input.notas,
    bitacora: [],
    respuestas: {},
    fases: fasesIniciales(),
    documentos: documentosIniciales(input.tramiteSlug),
    historial: [{ estado: "Recibido" as Estado, fecha: now }],
  };
  const { data, error } = await supabase.from(TABLE).insert(row).select().single();
  if (error) throw error;
  return rowToSolicitud(data);
}

export async function updateEstado(id: string, estado: Estado, nota?: string) {
  const s = await getSolicitud(id);
  if (!s) return;
  const now = new Date().toISOString();
  const historial = [...s.historial, { estado, fecha: now, nota }];
  await supabase
    .from(TABLE)
    .update({ estado, historial, actualizado_en: now })
    .eq("id", id);
}

export async function updatePrioridad(id: string, prioridad: Prioridad) {
  await supabase
    .from(TABLE)
    .update({ prioridad, actualizado_en: new Date().toISOString() })
    .eq("id", id);
}

export async function updateNotas(id: string, notas: string) {
  await supabase
    .from(TABLE)
    .update({ notas, actualizado_en: new Date().toISOString() })
    .eq("id", id);
}

export async function addNota(id: string, texto: string) {
  const s = await getSolicitud(id);
  if (!s) return;
  const now = new Date().toISOString();
  const bitacora = [...s.bitacora, { id: crypto.randomUUID(), fecha: now, texto }];
  await supabase.from(TABLE).update({ bitacora, actualizado_en: now }).eq("id", id);
}

export async function updateRespuesta(id: string, preguntaId: string, valor: boolean) {
  const s = await getSolicitud(id);
  if (!s) return;
  const respuestas = { ...s.respuestas, [preguntaId]: valor };
  await supabase
    .from(TABLE)
    .update({ respuestas, actualizado_en: new Date().toISOString() })
    .eq("id", id);
}

export async function toggleFase(id: string, fase: Fase) {
  const s = await getSolicitud(id);
  if (!s) return;
  const now = new Date().toISOString();
  const completada = !s.fases[fase].completada;
  const fases = { ...s.fases, [fase]: { completada, fecha: completada ? now : null } };
  await supabase.from(TABLE).update({ fases, actualizado_en: now }).eq("id", id);
}

export async function toggleDocumento(id: string, docId: string) {
  const s = await getSolicitud(id);
  if (!s) return;
  const docIdx = s.documentos.findIndex((d) => d.id === docId);
  if (docIdx === -1) return;
  const now = new Date().toISOString();
  const recibido = !s.documentos[docIdx].recibido;
  const documentos = [...s.documentos];
  documentos[docIdx] = { ...documentos[docIdx], recibido, fecha: recibido ? now : null };
  await supabase.from(TABLE).update({ documentos, actualizado_en: now }).eq("id", id);
}

export async function addDocumentoPersonalizado(id: string, nombre: string) {
  const s = await getSolicitud(id);
  if (!s) return;
  const documentos = [
    ...s.documentos,
    { id: crypto.randomUUID(), nombre, recibido: false, fecha: null, personalizado: true },
  ];
  await supabase
    .from(TABLE)
    .update({ documentos, actualizado_en: new Date().toISOString() })
    .eq("id", id);
}

export async function removeDocumentoPersonalizado(id: string, docId: string) {
  const s = await getSolicitud(id);
  if (!s) return;
  const documentos = s.documentos.filter((d) => d.id !== docId || !d.personalizado);
  await supabase
    .from(TABLE)
    .update({ documentos, actualizado_en: new Date().toISOString() })
    .eq("id", id);
}

export async function deleteSolicitud(id: string) {
  await supabase.from(TABLE).delete().eq("id", id);
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
  {
    input: {
      clienteNombre: "Rocío Pérez",
      clienteTelefono: "444 303 1144",
      clienteEmail: "rocio.perez@example.com",
      tramiteSlug: "visa-emergencia",
      variante: "Emergencia médica",
      notas: "Su hija está hospitalizada en Houston, necesita viajar de inmediato.",
      prioridad: "Alta",
    },
    respuestas: { comprobante_emergencia: true, historial_limpio: true },
    estado: "Cita programada",
    fasesCompletas: [
      "Recepción de documentos",
      "Evaluación de viabilidad",
      "Preparación de expediente",
      "Trámite ante autoridad",
    ],
    documentosRecibidos: [
      "Pasaporte vigente",
      "Documento que acredite la emergencia (acta médica o de defunción)",
      "Comprobante de parentesco",
    ],
    notaSeguimiento: "Cita de emergencia otorgada para mañana en el consulado.",
  },
  {
    input: {
      clienteNombre: "Arturo Salinas",
      clienteTelefono: "444 919 5566",
      clienteEmail: "arturo.salinas@example.com",
      tramiteSlug: "perdon-deportacion",
      variante: "Perdón por reingreso ilegal",
      notas: "Reingresó al país tras una deportación previa hace varios años.",
      prioridad: "Alta",
    },
    respuestas: { antecedentes_penales: false, tiempo_cumplido: true },
    estado: "En proceso",
    fasesCompletas: ["Recepción de documentos", "Evaluación de viabilidad"],
    documentosRecibidos: ["Orden de deportación", "Identificación oficial"],
    notaSeguimiento: "Caso complejo, se canalizó con el abogado migratorio del despacho.",
  },
  {
    input: {
      clienteNombre: "Norma Delgado",
      clienteTelefono: "444 474 8899",
      clienteEmail: "norma.delgado@example.com",
      tramiteSlug: "procesos-administrativos",
      variante: "Corrección de expediente",
      notas: "Su expediente tiene un error de nombre que necesita corregirse.",
      prioridad: "Media",
    },
    respuestas: { identificacion: true },
    estado: "Documentos pendientes",
    fasesCompletas: ["Recepción de documentos"],
    documentosRecibidos: ["Identificación oficial"],
    notaSeguimiento: "Se solicitó acta de nacimiento para comprobar el nombre correcto.",
  },
  {
    input: {
      clienteNombre: "Pablo Enríquez",
      clienteTelefono: "444 626 3311",
      clienteEmail: "pablo.enriquez@example.com",
      tramiteSlug: "procesos-administrativos",
      variante: "Otro",
      notas: "Necesita orientación sobre un citatorio que recibió.",
      prioridad: "Baja",
    },
    respuestas: { identificacion: true },
    estado: "Recibido",
    fasesCompletas: [],
    documentosRecibidos: [],
    notaSeguimiento: "Primera llamada agendada para revisar el citatorio con detalle.",
  },
  {
    input: {
      clienteNombre: "Claudia Rentería",
      clienteTelefono: "444 787 2200",
      clienteEmail: "claudia.renteria@example.com",
      tramiteSlug: "foia",
      variante: "FOIA CBP",
      notas: "Necesita su historial de cruces fronterizos para su caso.",
      prioridad: "Baja",
    },
    respuestas: { identificacion_foia: true },
    estado: "Recibido",
    fasesCompletas: ["Recepción de documentos"],
    documentosRecibidos: ["Identificación oficial"],
    notaSeguimiento: "Formato FOIA en preparación para enviarse a CBP.",
  },
  {
    input: {
      clienteNombre: "Iván Botello",
      clienteTelefono: "444 535 7722",
      clienteEmail: "ivan.botello@example.com",
      tramiteSlug: "pasaportes",
      variante: "Mexicano — nuevo",
      notas: "Nunca ha tramitado pasaporte mexicano.",
      prioridad: "Baja",
    },
    respuestas: { acta_vigente: true },
    estado: "En proceso",
    fasesCompletas: ["Recepción de documentos", "Preparación de expediente"],
    documentosRecibidos: ["Acta de nacimiento certificada", "Comprobante de domicilio"],
    notaSeguimiento: "Cita en el consulado mexicano pendiente de confirmar.",
  },
  {
    input: {
      clienteNombre: "Marisol Peña",
      clienteTelefono: "444 646 1188",
      clienteEmail: "marisol.pena@example.com",
      tramiteSlug: "pasaportes",
      variante: "Mexicano — renovación",
      notas: "Su pasaporte mexicano venció el mes pasado.",
      prioridad: "Media",
    },
    respuestas: { acta_vigente: true },
    estado: "Resuelto",
    fasesCompletas: [
      "Recepción de documentos",
      "Evaluación de viabilidad",
      "Preparación de expediente",
      "Trámite ante autoridad",
      "Resolución final",
    ],
    documentosRecibidos: [
      "Acta de nacimiento certificada",
      "Comprobante de domicilio",
      "Fotografía tamaño pasaporte",
    ],
    notaSeguimiento: "Pasaporte entregado al cliente, caso cerrado.",
  },
  {
    input: {
      clienteNombre: "Diego Villagómez",
      clienteTelefono: "444 858 4433",
      clienteEmail: "diego.villagomez@example.com",
      tramiteSlug: "pasaportes",
      variante: "Americano — nuevo",
      notas: "Primera vez tramitando pasaporte americano para su bebé.",
      prioridad: "Media",
    },
    respuestas: { acta_vigente: true },
    estado: "Cita programada",
    fasesCompletas: [
      "Recepción de documentos",
      "Evaluación de viabilidad",
      "Preparación de expediente",
    ],
    documentosRecibidos: ["Acta de nacimiento certificada", "Identificación oficial de los padres (si es menor)"],
    notaSeguimiento: "Cita confirmada en la oficina de pasaportes la próxima semana.",
  },
  {
    input: {
      clienteNombre: "Leticia Orozco",
      clienteTelefono: "444 969 5500",
      clienteEmail: "leticia.orozco@example.com",
      tramiteSlug: "actas",
      variante: "Acta de defunción",
      notas: "Necesita el acta de defunción de su esposo para trámites de herencia.",
      prioridad: "Media",
    },
    respuestas: { datos_registro: true },
    estado: "En proceso",
    fasesCompletas: ["Recepción de documentos", "Preparación de expediente"],
    documentosRecibidos: ["Identificación oficial"],
    notaSeguimiento: "Solicitada copia certificada ante el registro civil.",
  },
  {
    input: {
      clienteNombre: "Osvaldo Benítez",
      clienteTelefono: "444 070 6611",
      clienteEmail: "osvaldo.benitez@example.com",
      tramiteSlug: "actas",
      variante: "Acta de matrimonio",
      notas: "Necesita copia certificada para trámite migratorio de su esposa.",
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
    notaSeguimiento: "Acta de matrimonio entregada, caso cerrado.",
  },
  {
    input: {
      clienteNombre: "Yolanda Campos",
      clienteTelefono: "444 181 7733",
      clienteEmail: "yolanda.campos@example.com",
      tramiteSlug: "rectificacion-actas",
      variante: "Corrección administrativa",
      notas: "Su acta tiene un error ortográfico en el apellido materno.",
      prioridad: "Baja",
    },
    respuestas: { copia_acta: true },
    estado: "En proceso",
    fasesCompletas: ["Recepción de documentos", "Evaluación de viabilidad"],
    documentosRecibidos: ["Copia del acta con el error", "Identificación oficial"],
    notaSeguimiento: "Trámite de corrección administrativa en curso ante el registro civil.",
  },
  {
    input: {
      clienteNombre: "Raúl Figueroa",
      clienteTelefono: "444 292 8844",
      clienteEmail: "raul.figueroa@example.com",
      tramiteSlug: "curp",
      variante: "Obtención",
      notas: "Nunca ha tramitado su CURP, la necesita para un trámite escolar.",
      prioridad: "Baja",
    },
    respuestas: { doc_identidad: true },
    estado: "Resuelto",
    fasesCompletas: [
      "Recepción de documentos",
      "Evaluación de viabilidad",
      "Preparación de expediente",
      "Resolución final",
    ],
    documentosRecibidos: ["Acta de nacimiento", "Identificación oficial"],
    notaSeguimiento: "CURP generada y entregada al cliente.",
  },
];

function construirFilaDemo(caso: DemoCaso, folio: string) {
  const now = new Date().toISOString();
  const fases = fasesIniciales();
  caso.fasesCompletas.forEach((f) => {
    fases[f] = { completada: true, fecha: now };
  });

  const documentos = documentosIniciales(caso.input.tramiteSlug);
  const recibidos = new Set(caso.documentosRecibidos ?? []);
  documentos.forEach((d) => {
    if (recibidos.has(d.nombre)) {
      d.recibido = true;
      d.fecha = now;
    }
  });

  const historial: HistorialEntry[] =
    caso.estado === "Recibido"
      ? [{ estado: "Recibido", fecha: now }]
      : [
          { estado: "Recibido", fecha: now },
          { estado: caso.estado, fecha: now },
        ];

  const bitacora: NotaEntry[] = caso.notaSeguimiento
    ? [{ id: crypto.randomUUID(), fecha: now, texto: caso.notaSeguimiento }]
    : [];

  return {
    folio,
    cliente_nombre: caso.input.clienteNombre,
    cliente_telefono: caso.input.clienteTelefono,
    cliente_email: caso.input.clienteEmail,
    es_para_otra_persona: caso.input.esParaOtraPersona ?? false,
    contacto_nombre: caso.input.contactoNombre ?? caso.input.clienteNombre,
    contacto_telefono: caso.input.contactoTelefono ?? caso.input.clienteTelefono,
    contacto_email: caso.input.contactoEmail ?? caso.input.clienteEmail,
    nacionalidad: caso.input.nacionalidad ?? "Mexicana",
    origen: caso.input.origen ?? "Panel",
    tramite_slug: caso.input.tramiteSlug,
    variante: caso.input.variante,
    estado: caso.estado,
    prioridad: caso.input.prioridad ?? "Media",
    notas: caso.input.notas,
    bitacora,
    respuestas: caso.respuestas,
    fases,
    documentos,
    historial,
    creado_en: now,
    actualizado_en: now,
  };
}

async function sembrarCasosDemo() {
  const filas = DEMO_CASOS.map((caso, i) =>
    construirFilaDemo(caso, `VU-${String(i + 1).padStart(4, "0")}`)
  );
  const { error } = await supabase.from(TABLE).insert(filas);
  if (error) throw error;
}

let seedingPromise: Promise<void> | null = null;

/** Protegido contra llamadas concurrentes (ej. doble efecto de React
 * StrictMode en desarrollo) para no sembrar los casos de ejemplo dos veces. */
export function seedDemoData(): Promise<void> {
  if (seedingPromise) return seedingPromise;
  seedingPromise = (async () => {
    const { count } = await supabase.from(TABLE).select("*", { count: "exact", head: true });
    if ((count ?? 0) > 0) return;
    await sembrarCasosDemo();
  })().finally(() => {
    seedingPromise = null;
  });
  return seedingPromise;
}

/** Borra TODAS las solicitudes actuales (incluidas las reales capturadas)
 * y vuelve a cargar únicamente los casos de ejemplo. Acción irreversible. */
export async function resetDemoData() {
  const { error: delErr } = await supabase.from(TABLE).delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (delErr) throw delErr;
  await sembrarCasosDemo();
}

export function tramiteLabel(slug: string): string {
  return SERVICES.find((s) => s.slug === slug)?.title ?? slug;
}
