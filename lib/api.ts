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
      ...(options.headers as Record<string, string>),
    },
  });

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
