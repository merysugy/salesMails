import { createTemplateSeed } from "@/lib/email-builder/document";
import type {
  EmailRenderData,
  EmailTemplate,
  EmailTemplateCategory,
} from "@/lib/email-builder/types";

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

export type { EmailTemplate, EmailTemplateCategory };

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

export const emailTemplatesMock: EmailTemplate[] = [
  createTemplateSeed({
    seedKey: "presentacion-consultiva",
    titulo: "Presentación consultiva",
    descripcion:
      "Email de introducción con enfoque en diagnóstico breve y propuesta de llamada.",
    categoria: "Primer contacto",
    variante: "amber",
    destacado: true,
    status: "published",
    updatedAt: "2026-03-23T09:00:00.000Z",
  }),
  createTemplateSeed({
    seedKey: "seguimiento-evento",
    titulo: "Seguimiento tras evento",
    descripcion:
      "Plantilla para leads captados en ferias, networking y encuentros comerciales.",
    categoria: "Seguimiento",
    variante: "sage",
    updatedAt: "2026-03-20T11:30:00.000Z",
  }),
  createTemplateSeed({
    seedKey: "caso-uso-sectorial",
    titulo: "Caso de uso sectorial",
    descripcion:
      "Secuencia corta con prueba social y caso de éxito adaptado por industria.",
    categoria: "Reactivación",
    variante: "stone",
    updatedAt: "2026-03-18T15:45:00.000Z",
  }),
  createTemplateSeed({
    seedKey: "cierre-propuesta",
    titulo: "Cierre con propuesta",
    descripcion:
      "Plantilla para siguiente paso comercial con CTA claro y resumen del valor.",
    categoria: "Cierre",
    variante: "charcoal",
    destacado: true,
    status: "published",
    updatedAt: "2026-03-25T08:15:00.000Z",
  }),
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

export function getClienteById(id: string) {
  return clientesMock.find((cliente) => cliente.id === id);
}

export function getClientesByIds(ids: string[]) {
  return ids
    .map((id) => getClienteById(id))
    .filter((cliente): cliente is Cliente => Boolean(cliente));
}

export function getEmailRenderData(cliente?: Cliente): EmailRenderData {
  const currentCliente = cliente ?? clientesMock[0];

  return {
    cliente: {
      nombre: currentCliente.nombre,
      empresa: currentCliente.empresa,
      email: currentCliente.email,
      localidad: currentCliente.localidad,
      ultimoContacto: currentCliente.ultimoContacto,
    },
    campana: {
      nombre: "Reactivación B2B Primavera",
      propuestaValor: "Mensajes más relevantes con menos trabajo manual",
      remitente: "María Fernández",
    },
    empresa: {
      nombre: "SalesMails",
      web: "salesmails.app",
      telefono: "+34 910 000 000",
    },
  };
}

export function getInterestingNews() {
  return newsItemsMock.filter((item) => item.prioridad !== "Baja");
}
