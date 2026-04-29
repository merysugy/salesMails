"use client";

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Send,
  Trash2,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

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
  createCampaignSend,
  deleteCampaignSend,
  getCampanaById,
  getCampaignSends,
  getClientes,
  getPlantillas,
  sendBulk,
  sendCampaignSend,
  type CampanaEmailAPI,
  type CampaignSendAPI,
  type ClienteAPI,
  type PlantillaEmailAPI,
} from "@/lib/api";
import { cn } from "@/lib/utils";

type Props = Readonly<{ campanaId: number }>;

const estadoBadge: Record<
  CampaignSendAPI["estado"],
  { label: string; icon: React.ReactNode; className: string }
> = {
  pendiente: {
    label: "Pendiente",
    icon: <Clock className="size-3" />,
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  enviado: {
    label: "Enviado",
    icon: <CheckCircle2 className="size-3" />,
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  error: {
    label: "Error",
    icon: <AlertCircle className="size-3" />,
    className: "bg-red-50 text-red-600 border-red-200",
  },
};

export function CampaignDetailView({ campanaId }: Props) {
  const [campana, setCampana] = useState<CampanaEmailAPI | null>(null);
  const [plantilla, setPlantilla] = useState<PlantillaEmailAPI | null>(null);
  const [sends, setSends] = useState<CampaignSendAPI[]>([]);
  const [clientes, setClientes] = useState<ClienteAPI[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal asignar clientes
  const [showModal, setShowModal] = useState(false);
  const [selectedClientes, setSelectedClientes] = useState<number[]>([]);
  const [assigning, setAssigning] = useState(false);

  // Envío individual
  const [sendingId, setSendingId] = useState<number | null>(null);
  // Envío masivo
  const [sendingBulk, setSendingBulk] = useState(false);
  // Eliminar envío
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadSends = useCallback(async () => {
    try {
      const all = await getCampaignSends(campanaId);
      setSends(all);
    } catch {
      setSends([]);
    }
  }, [campanaId]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getCampanaById(campanaId),
      getPlantillas(),
      getCampaignSends(campanaId),
      getClientes(),
    ])
      .then(([c, ps, ss, cls]) => {
        setCampana(c);
        setPlantilla(ps.find((p) => p.id === c.plantilla) ?? null);
        setSends(ss);
        setClientes(cls);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [campanaId]);

  // Clientes ya asignados
  const clientesAsignados = new Set(sends.map((s) => s.cliente));
  const clientesDisponibles = clientes.filter(
    (c) => !clientesAsignados.has(c.id),
  );

  const nombreCliente = (id: number | null) => {
    if (!id) return "—";
    return clientes.find((c) => c.id === id)?.nombre ?? `#${id}`;
  };

  const handleSendOne = async (sendId: number) => {
    setSendingId(sendId);
    try {
      await sendCampaignSend(sendId);
      await loadSends();
    } catch {
      alert("Error al enviar.");
    } finally {
      setSendingId(null);
    }
  };

  const handleBulk = async () => {
    if (!confirm("¿Enviar todos los envíos pendientes de esta campaña?")) return;
    setSendingBulk(true);
    try {
      const res = await sendBulk(campanaId);
      alert(`Enviados: ${res.enviados} / ${res.total}. Errores: ${res.errores}`);
      await loadSends();
    } catch {
      alert("Error en el envío masivo.");
    } finally {
      setSendingBulk(false);
    }
  };

  const handleDeleteSend = async (id: number) => {
    if (!confirm("¿Eliminar este envío?")) return;
    setDeletingId(id);
    try {
      await deleteCampaignSend(id);
      setSends((prev) => prev.filter((s) => s.id !== id));
    } catch {
      alert("Error al eliminar.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleAssign = async () => {
    if (selectedClientes.length === 0) return;
    setAssigning(true);
    try {
      await Promise.all(
        selectedClientes.map((cid) =>
          createCampaignSend({ campana: campanaId, cliente: cid }),
        ),
      );
      setShowModal(false);
      setSelectedClientes([]);
      await loadSends();
    } catch {
      alert("Error al asignar clientes.");
    } finally {
      setAssigning(false);
    }
  };

  const pendientes = sends.filter((s) => s.estado === "pendiente").length;

  const toggleCliente = (clienteId: number, checked: boolean) => {
    setSelectedClientes((prev) =>
      checked ? [...prev, clienteId] : prev.filter((id) => id !== clienteId),
    );
  };

  const asignarSufijo = selectedClientes.length > 0 ? ` (${selectedClientes.length})` : "";
  const asignarLabel = assigning ? "Asignando…" : `Asignar${asignarSufijo}`;

  if (loading) {
    return (
      <div className="rounded-2xl border border-border/70 bg-card px-6 py-10 text-center text-sm text-figma-placeholder">
        Cargando campaña…
      </div>
    );
  }

  if (!campana) {
    return (
      <div className="rounded-2xl border border-border/70 bg-card px-6 py-10 text-center text-sm text-destructive">
        Campaña no encontrada.
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col overflow-auto pr-1">
      {/* Nav */}
      <div className="flex justify-end">
        <Link href="/dashboard/campanas">
          <Button
            type="button"
            variant="outline"
            className="h-9 gap-2 border-border px-3 text-sm font-medium text-figma-table hover:bg-muted"
          >
            <ArrowLeft className="size-3.5" />
            Volver a campañas
          </Button>
        </Link>
      </div>

      {/* Header campaña */}
      <div className="mt-6 border-b border-border/70 pb-6">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-figma-placeholder">
          Campaña
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-figma-table md:text-3xl">
          {campana.nombre}
        </h1>
        {campana.descripcion && (
          <p className="mt-2 text-sm text-figma-placeholder">{campana.descripcion}</p>
        )}
        {plantilla && (
          <p className="mt-3 text-xs text-figma-placeholder">
            Plantilla:{" "}
            <span className="font-medium text-figma-table">{plantilla.nombre}</span>
          </p>
        )}
      </div>

      {/* Estadísticas */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        {[
          { label: "Total envíos", value: sends.length },
          {
            label: "Enviados",
            value: sends.filter((s) => s.estado === "enviado").length,
          },
          {
            label: "Pendientes",
            value: pendientes,
          },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-2xl border border-border/70 bg-card px-5 py-4"
          >
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-figma-placeholder">
              {label}
            </p>
            <p className="mt-1.5 font-display text-2xl font-semibold text-figma-table">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Acciones */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="outline"
          className="h-9 gap-2 border-border px-4 text-sm font-medium text-figma-table hover:bg-muted"
          onClick={() => setShowModal(true)}
        >
          <UserPlus className="size-3.5" />
          Asignar clientes
        </Button>
        <Button
          type="button"
          className="h-9 gap-2 px-4 text-sm font-medium"
          disabled={sendingBulk || pendientes === 0}
          onClick={handleBulk}
        >
          <Zap className="size-3.5" />
          {sendingBulk ? "Enviando…" : `Enviar todos los pendientes (${pendientes})`}
        </Button>
      </div>

      {/* Tabla de envíos */}
      <div className="mt-6">
        {sends.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-border/70 bg-card px-6 py-12 text-center">
            <Users className="size-7 text-figma-placeholder/50" />
            <div>
              <p className="text-sm font-medium text-figma-table">
                No hay clientes asignados
              </p>
              <p className="mt-1 text-sm text-figma-placeholder">
                Usa "Asignar clientes" para añadir destinatarios a esta campaña.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border/70 bg-card">
            <Table>
              <TableHeader>
                <TableRow className="border-border/70 bg-figma-shell/30">
                  <TableHead className="text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-figma-placeholder">
                    Cliente
                  </TableHead>
                  <TableHead className="text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-figma-placeholder">
                    Estado
                  </TableHead>
                  <TableHead className="text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-figma-placeholder">
                    Fecha envío
                  </TableHead>
                  <TableHead className="text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-figma-placeholder">
                    Error
                  </TableHead>
                  <TableHead className="w-[140px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {sends.map((s) => {
                  const badge = estadoBadge[s.estado];
                  return (
                    <TableRow
                      key={s.id}
                      className="border-border/60 hover:bg-figma-shell/30"
                    >
                      <TableCell className="font-medium text-figma-table">
                        {nombreCliente(s.cliente)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
                            badge.className,
                          )}
                        >
                          {badge.icon}
                          {badge.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-figma-placeholder">
                        {s.fecha_envio
                          ? new Date(s.fecha_envio).toLocaleString("es-ES")
                          : "—"}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-xs text-red-500">
                        {s.error_mensaje || "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          {s.estado === "pendiente" && (
                            <Button
                              type="button"
                              variant="outline"
                              className="h-8 gap-1.5 px-3 text-xs font-medium border-border text-figma-table hover:bg-muted"
                              disabled={sendingId === s.id}
                              onClick={() => handleSendOne(s.id)}
                            >
                              <Send className="size-3" />
                              {sendingId === s.id ? "Enviando…" : "Enviar"}
                            </Button>
                          )}
                          <Button
                            type="button"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-figma-placeholder hover:text-destructive"
                            disabled={deletingId === s.id}
                            onClick={() => handleDeleteSend(s.id)}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Modal asignar clientes */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
            <h2 className="font-display text-lg font-semibold text-figma-table">
              Asignar clientes
            </h2>
            <p className="mt-1 text-sm text-figma-placeholder">
              Selecciona los clientes que recibirán esta campaña.
            </p>

            <div className="mt-4 max-h-64 overflow-y-auto space-y-1 rounded-xl border border-border/70 p-2">
              {clientesDisponibles.length === 0 ? (
                <p className="px-2 py-3 text-center text-sm text-figma-placeholder italic">
                  Todos los clientes activos ya están asignados.
                </p>
              ) : (
                clientesDisponibles.map((c) => (
                  <label
                    key={c.id}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 hover:bg-figma-shell/50"
                  >
                    <input
                      type="checkbox"
                      className="accent-primary"
                      checked={selectedClientes.includes(c.id)}
                      onChange={(e) => toggleCliente(c.id, e.target.checked)}
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-figma-table">
                        {c.nombre}
                      </p>
                      {c.email && (
                        <p className="truncate text-xs text-figma-placeholder">
                          {c.email}
                        </p>
                      )}
                    </div>
                  </label>
                ))
              )}
            </div>

            <div className="mt-5 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                className="h-9 px-4 text-sm text-figma-placeholder"
                onClick={() => {
                  setShowModal(false);
                  setSelectedClientes([]);
                }}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                className="h-9 px-5 text-sm font-medium"
                disabled={assigning || selectedClientes.length === 0}
                onClick={handleAssign}
              >
                {assigning
                  ? "Asignando…"
                  : asignarLabel}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
