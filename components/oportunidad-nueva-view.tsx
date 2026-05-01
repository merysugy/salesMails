"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createOportunidad, getClientes, type ClienteAPI } from "@/lib/api";

const ESTADO_LABELS = {
  abierta: "Abierta",
  en_progreso: "En progreso",
  ganada: "Ganada",
  perdida: "Perdida",
} as const;

type Estado = keyof typeof ESTADO_LABELS;

export function OportunidadNuevaView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clienteIdParam = searchParams.get("cliente");

  const [clientes, setClientes] = useState<ClienteAPI[]>([]);
  const [titulo, setTitulo] = useState("");
  const [clienteId, setClienteId] = useState<number | "">(
    clienteIdParam ? Number(clienteIdParam) : "",
  );
  const [descripcion, setDescripcion] = useState("");
  const [valorEstimado, setValorEstimado] = useState("");
  const [estado, setEstado] = useState<Estado>("abierta");
  const [probabilidad, setProbabilidad] = useState("");
  const [fechaCierre, setFechaCierre] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getClientes().then(setClientes).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    setError(null);

    if (!titulo.trim()) {
      setError("El título es obligatorio.");
      return;
    }
    if (!clienteId) {
      setError("Selecciona un cliente.");
      return;
    }

    if (fechaCierre) {
      const hoy = new Date();
      const fecha = new Date(fechaCierre);
      hoy.setHours(0, 0, 0, 0);
      if (fecha < hoy) {
        setError("La fecha de cierre no puede ser anterior a hoy.");
        return;
      }
    }

    setSaving(true);
    try {
      await createOportunidad({
        titulo: titulo.trim(),
        cliente: Number(clienteId),
        descripcion: descripcion.trim() || undefined,
        valor_estimado: valorEstimado.trim() ? valorEstimado.trim().replace(",", ".") : undefined,
        estado,
        probabilidad: probabilidad ? Number(probabilidad) : undefined,
        fecha_cierre_prevista: fechaCierre || undefined,
      });
      router.push("/dashboard/oportunidades");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear la oportunidad.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col overflow-auto pr-1">
      {/* Header */}
      <div className="flex justify-end">
        <Link href="/dashboard/oportunidades">
          <Button
            type="button"
            variant="outline"
            className="h-9 gap-2 border-border px-3 text-sm font-medium text-figma-table hover:bg-muted"
          >
            <ArrowLeft className="size-3.5" />
            Volver a oportunidades
          </Button>
        </Link>
      </div>

      <div className="mt-6">
        <div className="border-b border-border/70 pb-6">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-figma-placeholder">
            Pipeline comercial
          </p>
          <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-figma-table md:text-3xl">
            Nueva oportunidad
          </h1>
          <p className="mt-2 text-sm text-figma-placeholder">
            Registra una oportunidad comercial asociada a un cliente existente.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 max-w-xl space-y-6">
          {/* Título */}
          <div className="space-y-1.5">
            <label
              htmlFor="op-titulo"
              className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-figma-placeholder"
            >
              Título *
            </label>
            <Input
              id="op-titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej. Renovación contrato anual"
              className="h-10"
            />
          </div>

          {/* Cliente */}
          <div className="space-y-1.5">
            <label
              htmlFor="op-cliente"
              className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-figma-placeholder"
            >
              Cliente *
            </label>
            <select
              id="op-cliente"
              value={clienteId}
              onChange={(e) =>
                setClienteId(e.target.value ? Number(e.target.value) : "")
              }
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-figma-table focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Selecciona un cliente…</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Estado */}
          <div className="space-y-1.5">
            <label
              htmlFor="op-estado"
              className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-figma-placeholder"
            >
              Estado
            </label>
            <select
              id="op-estado"
              value={estado}
              onChange={(e) => setEstado(e.target.value as Estado)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-figma-table focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {(Object.entries(ESTADO_LABELS) as [Estado, string][]).map(
                ([val, label]) => (
                  <option key={val} value={val}>
                    {label}
                  </option>
                ),
              )}
            </select>
          </div>

          {/* Valor estimado */}
          <div className="space-y-1.5">
            <label
              htmlFor="op-valor"
              className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-figma-placeholder"
            >
              Valor estimado (€)
            </label>
            <Input
              id="op-valor"
              type="text"
              inputMode="decimal"
              value={valorEstimado}
              onChange={(e) => setValorEstimado(e.target.value)}
              placeholder="Ej. 5000.00"
              className="h-10"
            />
          </div>

          {/* Probabilidad */}
          <div className="space-y-1.5">
            <label
              htmlFor="op-prob"
              className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-figma-placeholder"
            >
              Probabilidad (%)
            </label>
            <Input
              id="op-prob"
              type="number"
              min="0"
              max="100"
              value={probabilidad}
              onChange={(e) => setProbabilidad(e.target.value)}
              placeholder="Ej. 70"
              className="h-10"
            />
          </div>

          {/* Fecha cierre prevista */}
          <div className="space-y-1.5">
            <label
              htmlFor="op-fecha"
              className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-figma-placeholder"
            >
              Fecha de cierre prevista
            </label>
            <Input
              id="op-fecha"
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={fechaCierre}
              onChange={(e) => setFechaCierre(e.target.value)}
              className="h-10"
            />
          </div>

          {/* Descripción */}
          <div className="space-y-1.5">
            <label
              htmlFor="op-desc"
              className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-figma-placeholder"
            >
              Notas / Descripción
            </label>
            <textarea
              id="op-desc"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Contexto adicional sobre la oportunidad…"
              rows={4}
              className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm text-figma-table placeholder:text-figma-placeholder/60 focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={saving}
              className="h-9 px-6 text-sm font-medium"
            >
              {saving ? "Guardando…" : "Crear oportunidad"}
            </Button>
            <Link href="/dashboard/oportunidades">
              <Button
                type="button"
                variant="outline"
                className="h-9 px-4 text-sm font-medium"
              >
                Cancelar
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
