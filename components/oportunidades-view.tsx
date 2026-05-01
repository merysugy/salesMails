"use client";

import { CircleDollarSign, Plus, Trash2, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  deleteOportunidad,
  getOportunidades,
  updateOportunidad,
  type OportunidadAPI,
} from "@/lib/api";

const ESTADO_LABELS: Record<OportunidadAPI["estado"], string> = {
  abierta: "Abierta",
  en_progreso: "En progreso",
  ganada: "Ganada",
  perdida: "Perdida",
};

const ESTADO_DOT: Record<OportunidadAPI["estado"], string> = {
  abierta: "bg-blue-400",
  en_progreso: "bg-amber-400",
  ganada: "bg-emerald-500",
  perdida: "bg-rose-400",
};

export function OportunidadesView() {
  const [oportunidades, setOportunidades] = useState<OportunidadAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [updatingEstado, setUpdatingEstado] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [estadoFilter, setEstadoFilter] = useState<OportunidadAPI["estado"] | "todas">("todas");

  const oportunidadesFiltradas =
    estadoFilter === "todas"
      ? oportunidades
      : oportunidades.filter((op) => op.estado === estadoFilter);

  const load = () => {
    setLoading(true);
    setError(null);
    getOportunidades()
      .then(setOportunidades)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Error al cargar oportunidades"),
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar esta oportunidad? Esta acción no se puede deshacer.")) return;
    setDeleting(id);
    try {
      await deleteOportunidad(id);
      setOportunidades((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al eliminar.");
    } finally {
      setDeleting(null);
    }
  };

  const handleEstadoChange = async (id: number, estado: OportunidadAPI["estado"]) => {
    if (estado === "ganada" || estado === "perdida") {
      const op = oportunidades.find((o) => o.id === id);
      if (op && (!op.valor_estimado || op.probabilidad === null)) {
        alert("Para cerrar una oportunidad necesitas valor estimado y probabilidad.");
        return;
      }
    }
    setUpdatingEstado(id);
    try {
      const updated = await updateOportunidad(id, { estado });
      setOportunidades((prev) => prev.map((o) => (o.id === id ? updated : o)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al actualizar estado.");
    } finally {
      setUpdatingEstado(null);
    }
  };

  const listContent = () => {
    if (loading) {
      return (
        <p className="py-10 text-center text-sm text-figma-placeholder">
          Cargando oportunidades…
        </p>
      );
    }
    if (oportunidadesFiltradas.length === 0) {
      return (
        <div className="rounded-2xl border border-border/70 bg-card px-6 py-10 text-center">
          <TrendingUp className="mx-auto size-8 text-figma-placeholder/50" />
          <p className="mt-3 text-sm font-medium text-figma-table">
            Sin oportunidades
          </p>
          <p className="mt-1 text-sm text-figma-placeholder">
            {estadoFilter === "todas"
              ? "Crea la primera oportunidad comercial desde aquí o desde la ficha de un cliente."
              : "No hay oportunidades con este estado."}
          </p>
        </div>
      );
    }
    return (
      <div className="rounded-2xl border border-border/70 bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-figma-placeholder">
                Título
              </TableHead>
              <TableHead className="text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-figma-placeholder">
                Cliente
              </TableHead>
              <TableHead className="text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-figma-placeholder">
                Valor estimado
              </TableHead>
              <TableHead className="text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-figma-placeholder">
                Estado
              </TableHead>
              <TableHead className="text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-figma-placeholder">
                Creada
              </TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {oportunidadesFiltradas.map((op) => (
              <TableRow key={op.id}>
                <TableCell className="font-medium text-figma-table">
                  <div className="flex items-center gap-2">
                    <CircleDollarSign className="size-3.5 shrink-0 text-figma-placeholder/60" />
                    {op.titulo}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-figma-placeholder">
                  {op.cliente_detalle?.nombre ?? `#${op.cliente}`}
                </TableCell>
                <TableCell className="text-sm text-figma-placeholder">
                  {op.valor_estimado
                    ? `${Number.parseFloat(op.valor_estimado).toLocaleString("es-ES")} €`
                    : "—"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className={`size-2 shrink-0 rounded-full ${ESTADO_DOT[op.estado]}`} />
                    <select
                      value={op.estado}
                      disabled={updatingEstado === op.id}
                      onChange={(e) =>
                        handleEstadoChange(op.id, e.target.value as OportunidadAPI["estado"])
                      }
                      className="rounded-md border border-border bg-transparent px-2 py-1 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50"
                    >
                      {(["abierta", "en_progreso", "ganada", "perdida"] as const).map(
                        (est) => (
                          <option key={est} value={est}>
                            {ESTADO_LABELS[est]}
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-figma-placeholder">
                  {new Date(op.fecha_creacion).toLocaleDateString("es-ES")}
                </TableCell>
                <TableCell className="text-right">
                  <button
                    type="button"
                    onClick={() => handleDelete(op.id)}
                    disabled={deleting === op.id}
                    className="h-8 w-8 rounded p-0 text-figma-placeholder hover:text-destructive disabled:opacity-50"
                    aria-label="Eliminar oportunidad"
                  >
                    <Trash2 className="mx-auto size-3.5" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="flex min-h-full flex-col overflow-auto pr-1">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-figma-placeholder">
            Pipeline comercial
          </p>
          <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-figma-table md:text-3xl">
            Oportunidades
          </h1>
        </div>
        <Link href="/dashboard/oportunidades/nueva">
          <Button type="button" className="h-9 gap-2 px-4 text-sm font-medium">
            <Plus className="size-3.5" />
            Nueva oportunidad
          </Button>
        </Link>
      </div>

      {/* Filtros */}
      <div className="mt-6 flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant={estadoFilter === "todas" ? "default" : "outline"}
          onClick={() => setEstadoFilter("todas")}
          className="h-8 px-3 text-xs font-medium"
        >
          Todas
        </Button>
        {(["abierta", "en_progreso", "ganada", "perdida"] as const).map((estado) => (
          <Button
            key={estado}
            type="button"
            size="sm"
            variant={estadoFilter === estado ? "default" : "outline"}
            onClick={() => setEstadoFilter(estado)}
            className="h-8 gap-1.5 px-3 text-xs font-medium"
          >
            <span className={`size-1.5 rounded-full ${ESTADO_DOT[estado]}`} />
            {ESTADO_LABELS[estado]}
          </Button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-6">
        {error && (
          <p className="mb-4 text-sm text-destructive">{error}</p>
        )}
        {listContent()}
      </div>
    </div>
  );
}
