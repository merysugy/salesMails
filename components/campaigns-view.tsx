"use client";

import { CalendarDays, FileText, Megaphone, Plus, Trash2 } from "lucide-react";
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
  deleteCampana,
  getCampanas,
  getPlantillas,
  type CampanaEmailAPI,
  type PlantillaEmailAPI,
} from "@/lib/api";

export function CampaignsView() {
  const [campanas, setCampanas] = useState<CampanaEmailAPI[]>([]);
  const [plantillas, setPlantillas] = useState<PlantillaEmailAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    Promise.all([getCampanas(), getPlantillas()])
      .then(([c, p]) => {
        setCampanas(c);
        setPlantillas(p);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const nombrePlantilla = (id: number) =>
    plantillas.find((p) => p.id === id)?.nombre ?? "—";

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar esta campaña? Esta acción no se puede deshacer.")) return;
    setDeleting(id);
    try {
      await deleteCampana(id);
      setCampanas((prev) => prev.filter((c) => c.id !== id));
    } catch {
      alert("Error al eliminar la campaña.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="flex min-h-full flex-col overflow-auto pr-1">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-figma-placeholder">
            Email marketing
          </p>
          <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-figma-table md:text-3xl">
            Campañas
          </h1>
        </div>
        <Link href="/dashboard/campanas/new">
          <Button
            type="button"
            className="h-9 gap-2 px-4 text-sm font-medium"
          >
            <Plus className="size-3.5" />
            Nueva campaña
          </Button>
        </Link>
      </div>

      {/* Contenido */}
      <div className="mt-8">
        {loading ? (
          <div className="rounded-2xl border border-border/70 bg-card px-6 py-10 text-center text-sm text-figma-placeholder">
            Cargando campañas…
          </div>
        ) : null}
        {!loading && campanas.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-border/70 bg-card px-6 py-14 text-center">
            <Megaphone className="size-8 text-figma-placeholder/50" />
            <div>
              <p className="text-sm font-medium text-figma-table">
                Todavía no hay campañas
              </p>
              <p className="mt-1 text-sm text-figma-placeholder">
                Crea tu primera campaña para empezar a enviar correos masivos.
              </p>
            </div>
            <Link href="/dashboard/campanas/new">
              <Button type="button" className="mt-2 h-9 gap-2 px-4 text-sm">
                <Plus className="size-3.5" />
                Nueva campaña
              </Button>
            </Link>
          </div>
        ) : null}
        {!loading && campanas.length > 0 ? (
          <div className="rounded-2xl border border-border/70 bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border/70 bg-figma-shell/30">
                  <TableHead className="text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-figma-placeholder">
                    Nombre
                  </TableHead>
                  <TableHead className="text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-figma-placeholder">
                    Descripción
                  </TableHead>
                  <TableHead className="text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-figma-placeholder">
                    <span className="flex items-center gap-1.5">
                      <FileText className="size-3" />
                      Plantilla
                    </span>
                  </TableHead>
                  <TableHead className="text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-figma-placeholder">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="size-3" />
                      Creada
                    </span>
                  </TableHead>
                  <TableHead className="w-[120px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {campanas.map((campana) => (
                  <TableRow
                    key={campana.id}
                    className="border-border/60 hover:bg-figma-shell/30"
                  >
                    <TableCell className="font-medium text-figma-table">
                      {campana.nombre}
                    </TableCell>
                    <TableCell className="max-w-[260px] truncate text-sm text-figma-placeholder">
                      {campana.descripcion || <span className="italic">Sin descripción</span>}
                    </TableCell>
                    <TableCell className="text-sm text-figma-table">
                      {nombrePlantilla(campana.plantilla)}
                    </TableCell>
                    <TableCell className="text-sm text-figma-placeholder">
                      {new Date(campana.fecha_creacion).toLocaleDateString("es-ES")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/dashboard/campanas/${campana.id}`}>
                          <Button
                            type="button"
                            variant="outline"
                            className="h-8 px-3 text-xs font-medium border-border text-figma-table hover:bg-muted"
                          >
                            Ver
                          </Button>
                        </Link>
                        <Button
                          type="button"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-figma-placeholder hover:text-destructive"
                          disabled={deleting === campana.id}
                          onClick={() => handleDelete(campana.id)}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : null}
      </div>
    </div>
  );
}
