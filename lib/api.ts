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
