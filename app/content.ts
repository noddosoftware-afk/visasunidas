export const ACROSTIC = [
  { letter: "V", word: "Verdad" },
  { letter: "I", word: "Integridad" },
  { letter: "S", word: "Solidaridad" },
  { letter: "A", word: "Amabilidad" },
  { letter: "S", word: "Seguridad" },
  { letter: "U", word: "Unificar" },
  { letter: "N", word: "Nacionalizar" },
  { letter: "I", word: "Iluminar" },
  { letter: "D", word: "Donar" },
  { letter: "A", word: "Apoyar" },
  { letter: "S", word: "Soñar" },
] as const;

export const SERVICES = [
  {
    slug: "visa-turista",
    title: "Visa de Turista",
    detail: "Preparación completa de tu solicitud y cita consular.",
    variantes: ["Primera vez", "Renovación", "Negada anteriormente"],
  },
  {
    slug: "visa-emergencia",
    title: "Visa de Emergencia",
    detail: "Trámite acelerado para situaciones que no pueden esperar.",
    variantes: [
      "Emergencia médica",
      "Fallecimiento de familiar",
      "Otro caso urgente",
    ],
  },
  {
    slug: "perdon-presencia-ilegal",
    title: "Perdón por Presencia Ilegal",
    detail: "Proceso consular con perdón por presencia ilegal en EE.UU.",
    variantes: ["I-601A (provisional)", "I-601 (regular)"],
  },
  {
    slug: "perdon-deportacion",
    title: "Perdón por Deportación",
    detail: "Proceso consular con perdón por deportación de EE.UU.",
    variantes: ["Readmisión tras deportación", "Perdón por reingreso ilegal"],
  },
  {
    slug: "procesos-administrativos",
    title: "Procesos Administrativos",
    detail: "Gestión y seguimiento ante las autoridades correspondientes.",
    variantes: [
      "Seguimiento de trámite",
      "Corrección de expediente",
      "Otro",
    ],
  },
  {
    slug: "foia",
    title: "Record Migratorio (FOIA)",
    detail: "Solicitud de tu historial migratorio completo.",
    variantes: ["FOIA USCIS", "FOIA ICE", "FOIA CBP"],
  },
  {
    slug: "pasaportes",
    title: "Pasaportes",
    detail: "Mexicanos y americanos, trámite y renovación.",
    variantes: [
      "Mexicano — nuevo",
      "Mexicano — renovación",
      "Americano — nuevo",
      "Americano — renovación",
      "Menor de edad",
    ],
  },
  {
    slug: "divorcios",
    title: "Divorcios en México",
    detail: "Acompañamiento legal en todo el proceso.",
    variantes: ["Voluntario", "Necesario (contencioso)"],
  },
  {
    slug: "actas",
    title: "Actas de Nacimiento y Defunción",
    detail: "Obtención y gestión de actas oficiales.",
    variantes: ["Acta de nacimiento", "Acta de defunción", "Acta de matrimonio"],
  },
  {
    slug: "rectificacion-actas",
    title: "Rectificación de Actas",
    detail: "Corrección y nulidad de actas de nacimiento.",
    variantes: ["Corrección administrativa", "Nulidad judicial"],
  },
  {
    slug: "curp",
    title: "CURP",
    detail: "Obtención y corrección de tu Clave Única de Registro.",
    variantes: ["Obtención", "Corrección"],
  },
] as const;

export const LOCATION = {
  direccion: "3600 Lime St Bldg 2, Riverside, CA 92501, USA",
  mapsQuery: "3600 Lime St Bldg 2, Riverside, CA 92501, USA",
  mapsLink:
    "https://www.google.com/maps/search/?api=1&query=3600+Lime+St+Bldg+2,+Riverside,+CA+92501,+USA",
};
