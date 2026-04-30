// =========================================================
// Tipos del backend
// =========================================================

export type ClienteAPI = {
  id: number;
  nombre: string;
  email: string | null;
  ciudad: string | null;
  pais: string | null;
  telefono: string | null;
  direccion: string | null;
  tipo: string;
  nif: string | null;
  activo: boolean;
  fecha_creacion: string;
  empresa: string;
  estado_cliente: number;
  estado_cliente_detalle: {
    id: number;
    nombre: string;
  } | null;
};

// =========================================================
// Cliente base de la API
// =========================================================

const API_BASE = "http://127.0.0.1:8000";

// =========================================================
// Función genérica
// =========================================================

export async function api<T = unknown>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem("access");

  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    document.cookie = "salesmails_auth=; path=/; max-age=0";
    globalThis.location.href = "/";
    return undefined as T;
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    const message =
      errorData?.detail ||
      errorData?.error ||
      (Array.isArray(errorData?.non_field_errors)
        ? errorData.non_field_errors.join(", ")
        : null) ||
      `Error ${res.status}`;
    throw new Error(message);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

// =========================================================
// Endpoints de clientes
// =========================================================

export async function getClientes(): Promise<ClienteAPI[]> {
  return api<ClienteAPI[]>("/api/clients/");
}

export async function getClienteById(id: string): Promise<ClienteAPI> {
  return api<ClienteAPI>(`/api/clients/${id}/`);
}

export async function updateCliente(
  id: string,
  data: Partial<ClienteAPI>,
): Promise<ClienteAPI> {
  return api<ClienteAPI>(`/api/clients/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function createCliente(
  data: Partial<ClienteAPI>,
): Promise<ClienteAPI> {
  return api<ClienteAPI>("/api/clients/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// =========================================================
// Endpoints de estados de cliente
// =========================================================

export type EstadoClienteAPI = {
  id: number;
  nombre: string;
};

export async function getEstadosCliente(): Promise<EstadoClienteAPI[]> {
  return api<EstadoClienteAPI[]>("/api/client-status/");
}

// =========================================================
// Delete cliente
// =========================================================

export async function deleteCliente(id: string): Promise<void> {
  return api<void>(`/api/clients/${id}/`, {
    method: "DELETE",
  });
}

// =========================================================
// Actividad de cliente
// =========================================================

export type ActividadClienteAPI = {
  id: number;
  tipo: string;
  descripcion: string;
  fecha_creacion: string;
  usuario_nombre: string | null;
};

export async function getClienteActividad(
  id: string,
): Promise<ActividadClienteAPI[]> {
  return api<ActividadClienteAPI[]>(`/api/clients/${id}/activity/`);
}

export async function getClientesInactivos(): Promise<ClienteAPI[]> {
  return api<ClienteAPI[]>("/api/clients/inactive/");
}

export async function restoreCliente(id: string): Promise<ClienteAPI> {
  return api<ClienteAPI>(`/api/clients/${id}/restore/`, {
    method: "POST",
  });
}

// =========================================================
// Envío directo de email a clientes
// =========================================================

export type SendDirectEmailResponse = {
  total: number;
  enviados: number;
  errores: {
    cliente_id: number;
    error: string;
  }[];
};

export async function sendDirectEmail(data: {
  cliente_ids: number[];
  plantilla_id?: number;
  asunto: string;
  mensaje: string;
}): Promise<SendDirectEmailResponse> {
  return api<SendDirectEmailResponse>("/api/campaign-sends/send-direct/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// =========================================================
// Plantillas de email
// =========================================================

export type PlantillaEmailAPI = {
  id: number;
  nombre: string;
  asunto: string;
  cuerpo: string;
};

export async function getPlantillas(): Promise<PlantillaEmailAPI[]> {
  return api<PlantillaEmailAPI[]>("/api/templates/");
}

export async function createPlantilla(
  data: Omit<PlantillaEmailAPI, "id">,
): Promise<PlantillaEmailAPI> {
  return api<PlantillaEmailAPI>("/api/templates/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deletePlantilla(id: number): Promise<void> {
  return api<void>(`/api/templates/${id}/`, { method: "DELETE" });
}

export async function updatePlantilla(
  id: number,
  data: Partial<Omit<PlantillaEmailAPI, "id">>,
): Promise<PlantillaEmailAPI> {
  return api<PlantillaEmailAPI>(`/api/templates/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// =========================================================
// Campañas de email
// =========================================================

export type CampanaEmailAPI = {
  id: number;
  nombre: string;
  descripcion: string | null;
  plantilla: number;
  fecha_creacion: string;
};

export async function getCampanas(): Promise<CampanaEmailAPI[]> {
  return api<CampanaEmailAPI[]>("/api/campaigns/");
}

export async function getCampanaById(id: number): Promise<CampanaEmailAPI> {
  return api<CampanaEmailAPI>(`/api/campaigns/${id}/`);
}

export async function createCampana(data: {
  nombre: string;
  descripcion?: string;
  plantilla: number;
}): Promise<CampanaEmailAPI> {
  return api<CampanaEmailAPI>("/api/campaigns/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deleteCampana(id: number): Promise<void> {
  return api<void>(`/api/campaigns/${id}/`, { method: "DELETE" });
}

export async function updateCampana(
  id: number,
  data: Partial<{ nombre: string; descripcion: string; plantilla: number }>,
): Promise<CampanaEmailAPI> {
  return api<CampanaEmailAPI>(`/api/campaigns/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// =========================================================
// Envíos de campaña (CampaignSend)
// =========================================================

export type CampaignSendAPI = {
  id: number;
  campana: number;
  cliente: number | null;
  estado: "pendiente" | "enviado" | "error";
  fecha_envio: string | null;
  error_mensaje: string | null;
};

export async function getCampaignSends(
  campana_id?: number,
): Promise<CampaignSendAPI[]> {
  const qs = campana_id ? `?campana=${campana_id}` : "";
  return api<CampaignSendAPI[]>(`/api/campaign-sends/${qs}`);
}

export async function createCampaignSend(data: {
  campana: number;
  cliente: number;
}): Promise<CampaignSendAPI> {
  return api<CampaignSendAPI>("/api/campaign-sends/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deleteCampaignSend(id: number): Promise<void> {
  return api<void>(`/api/campaign-sends/${id}/`, { method: "DELETE" });
}

export type SendBulkResponse = {
  total: number;
  enviados: number;
  errores: number;
};

export async function sendCampaignSend(id: number): Promise<{ message: string }> {
  return api<{ message: string }>(`/api/campaign-sends/${id}/send/`, {
    method: "POST",
  });
}

export async function sendBulk(campana_id?: number): Promise<SendBulkResponse> {
  return api<SendBulkResponse>("/api/campaign-sends/send-bulk/", {
    method: "POST",
    body: JSON.stringify(campana_id ? { campana_id } : {}),
  });
}
