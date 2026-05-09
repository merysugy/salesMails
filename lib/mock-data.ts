
export type ClienteEstado =
  | "Clientes nuevos"
  | "Contactados"
  | "Negociación"
  | "Trato cerrado";

export type Cliente = {
  id: string;
  nombre: string;
  estado: ClienteEstado;
  empresa: string;
  localidad: string;
  email: string;
  lugarContacto: string;
  insercion: string;
  ultimoContacto: string;
  emailsEnviados: number;
};


export type NewsPriority = "Alta" | "Media" | "Baja";

export type NewsItem = {
  id: string;
  titular: string;
  fuente: string;
  resumen: string;
  publicada: string;
  prioridad: NewsPriority;
  sector: string;
  clientesImpactados: number;
};

export const kpiStats = [
  { value: 14, label: "Campañas enviadas", dot: "purple" as const },
  { value: 10, label: "Clientes nuevos", dot: "green" as const },
  { value: 8, label: "Contactados", dot: "beige" as const },
  { value: 12, label: "Negociación", dot: "orange" as const },
  { value: 20, label: "Tratos cerrados", dot: "grey" as const },
];

/** Filas alineadas al frame Dashboard (Figma nodo 38:12) */
export const clientesMock: Cliente[] = [
  {
    id: "1",
    nombre: "Ana María Moreno",
    estado: "Clientes nuevos",
    empresa: "Abalia Consulting SL",
    localidad: "Madrid",
    email: "usuario@empresa.com",
    lugarContacto: "Evento comercial",
    insercion: "20/05/2023",
    ultimoContacto: "20/05/2025",
    emailsEnviados: 0,
  },
  {
    id: "2",
    nombre: "Juan Pelayo",
    estado: "Clientes nuevos",
    empresa: "Capital energy",
    localidad: "Madrid",
    email: "usuario@empresa.com",
    lugarContacto: "Networking",
    insercion: "20/05/2023",
    ultimoContacto: "20/05/2025",
    emailsEnviados: 1,
  },
  {
    id: "3",
    nombre: "Ramiro Casado",
    estado: "Clientes nuevos",
    empresa: "DBI Spain",
    localidad: "Madrid",
    email: "usuario@empresa.com",
    lugarContacto: "Visita a la empresa",
    insercion: "20/05/2023",
    ultimoContacto: "20/05/2025",
    emailsEnviados: 1,
  },
  {
    id: "4",
    nombre: "Nicolás López",
    estado: "Clientes nuevos",
    empresa: "Sercon",
    localidad: "Madrid",
    email: "usuario@empresa.com",
    lugarContacto: "Evento comercial",
    insercion: "20/05/2023",
    ultimoContacto: "20/05/2025",
    emailsEnviados: 0,
  },
  {
    id: "5",
    nombre: "Arancha Merino",
    estado: "Contactados",
    empresa: "Mirai",
    localidad: "Barcelona",
    email: "usuario@empresa.com",
    lugarContacto: "A través de contacto",
    insercion: "20/05/2023",
    ultimoContacto: "20/05/2025",
    emailsEnviados: 2,
  },
  {
    id: "6",
    nombre: "Carlos Herrero",
    estado: "Contactados",
    empresa: "Analistas financieros",
    localidad: "Barcelona",
    email: "usuario@empresa.com",
    lugarContacto: "Evento comercial",
    insercion: "20/05/2023",
    ultimoContacto: "20/05/2025",
    emailsEnviados: 1,
  },
  {
    id: "7",
    nombre: "María del Carmen",
    estado: "Contactados",
    empresa: "Auctane",
    localidad: "Cantabria",
    email: "usuario@empresa.com",
    lugarContacto: "Evento comercial",
    insercion: "20/05/2023",
    ultimoContacto: "20/05/2025",
    emailsEnviados: 2,
  },
  {
    id: "8",
    nombre: "Sonia González",
    estado: "Contactados",
    empresa: "Repsol",
    localidad: "Barcelona",
    email: "usuario@empresa.com",
    lugarContacto: "Evento comercial",
    insercion: "20/05/2023",
    ultimoContacto: "20/05/2025",
    emailsEnviados: 1,
  },
  {
    id: "9",
    nombre: "Nicolás López",
    estado: "Negociación",
    empresa: "Capital energy",
    localidad: "Madrid",
    email: "usuario@empresa.com",
    lugarContacto: "Networking",
    insercion: "20/05/2023",
    ultimoContacto: "20/05/2025",
    emailsEnviados: 0,
  },
  {
    id: "10",
    nombre: "Arancha Merino",
    estado: "Negociación",
    empresa: "Analistas financieros",
    localidad: "Madrid",
    email: "usuario@empresa.com",
    lugarContacto: "Evento comercial",
    insercion: "20/05/2023",
    ultimoContacto: "20/05/2025",
    emailsEnviados: 1,
  },
  {
    id: "11",
    nombre: "Sara Hernández",
    estado: "Negociación",
    empresa: "Abalia Consulting SL",
    localidad: "Barcelona",
    email: "usuario@empresa.com",
    lugarContacto: "Networking",
    insercion: "20/05/2023",
    ultimoContacto: "20/05/2025",
    emailsEnviados: 1,
  },
  {
    id: "12",
    nombre: "Ramiro Casado",
    estado: "Negociación",
    empresa: "Sercon",
    localidad: "Barcelona",
    email: "usuario@empresa.com",
    lugarContacto: "Evento comercial",
    insercion: "20/05/2023",
    ultimoContacto: "20/05/2025",
    emailsEnviados: 2,
  },
  {
    id: "13",
    nombre: "Nicolás López",
    estado: "Negociación",
    empresa: "DBI Spain",
    localidad: "Madrid",
    email: "usuario@empresa.com",
    lugarContacto: "Evento comercial",
    insercion: "20/05/2023",
    ultimoContacto: "20/05/2025",
    emailsEnviados: 2,
  },
  {
    id: "14",
    nombre: "Sara Hernández",
    estado: "Trato cerrado",
    empresa: "Abalia Consulting SL",
    localidad: "Cantabria",
    email: "usuario@empresa.com",
    lugarContacto: "A través de contacto",
    insercion: "20/05/2023",
    ultimoContacto: "20/05/2025",
    emailsEnviados: 4,
  },
  {
    id: "15",
    nombre: "Juan Pelayo",
    estado: "Trato cerrado",
    empresa: "Capital energy",
    localidad: "Barcelona",
    email: "usuario@empresa.com",
    lugarContacto: "A través de contacto",
    insercion: "20/05/2023",
    ultimoContacto: "20/05/2025",
    emailsEnviados: 4,
  },
];


export const newsItemsMock: NewsItem[] = [
  {
    id: "news-1",
    titular: "Abalia amplía su cartera de servicios B2B en Iberia",
    fuente: "Expansión",
    resumen:
    "Movimiento interesante para priorizar un mensaje orientado a escalabilidad y soporte regional.",
    publicada: "Hoy",
    prioridad: "Alta",
    sector: "Consultoría",
    clientesImpactados: 3,
  },
  {
    id: "news-2",
    titular: "Capital Energy acelera nuevas alianzas tecnológicas",
    fuente: "Cinco Días",
    resumen:
      "Abre una oportunidad para reactivar contactos con foco en automatización operativa.",
    publicada: "Ayer",
    prioridad: "Alta",
    sector: "Energía",
    clientesImpactados: 2,
  },
  {
    id: "news-3",
    titular: "Mirai consolida su estrategia de expansión hotelera",
    fuente: "Hosteltur",
    resumen:
      "Buen encaje para campañas de nurturing con enfoque en eficiencia comercial.",
    publicada: "Hace 2 días",
    prioridad: "Media",
    sector: "Turismo",
    clientesImpactados: 1,
  },
  {
    id: "news-4",
    titular: "Repsol reorganiza equipos para nuevas líneas de innovación",
    fuente: "El Economista",
    resumen:
      "Puede justificar una actualización de propuesta para interlocutores ya contactados.",
    publicada: "Hace 4 días",
    prioridad: "Media",
    sector: "Energía",
    clientesImpactados: 4,
  },
  {
    id: "news-5",
    titular: "Auctane refuerza su presencia logística en el sur de Europa",
    fuente: "Logística Profesional",
    resumen:
      "Contexto útil para una secuencia de mensajes centrada en crecimiento y operaciones.",
    publicada: "Hace 1 semana",
    prioridad: "Baja",
    sector: "Logística",
    clientesImpactados: 2,
  },
];


export function getInterestingNews() {
  return newsItemsMock.filter((item) => item.prioridad !== "Baja");
}
