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
    throw new Error(`API error ${res.status}: ${url}`);
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
  asunto: string;
  mensaje: string;
}): Promise<SendDirectEmailResponse> {
  return api<SendDirectEmailResponse>("/api/campaign-sends/send-direct/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
