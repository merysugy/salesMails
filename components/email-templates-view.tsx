"use client";

import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

import { EmailBuilderWorkspace } from "@/components/email-editor/email-builder-workspace";
import { Button } from "@/components/ui/button";
import {
  createPlantilla,
  deletePlantilla,
  getPlantillas,
  updatePlantilla,
  type PlantillaEmailAPI,
} from "@/lib/api";

type EditState = {
  id: number | null; // null = nueva
  nombre: string;
  asunto: string;
  cuerpo: string;
};

const EMPTY: EditState = { id: null, nombre: "", asunto: "", cuerpo: "" };

export function EmailTemplatesView() {
  const [plantillas, setPlantillas] = useState<PlantillaEmailAPI[]>([]);
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState<EditState | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    getPlantillas()
      .then(setPlantillas)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const openEdit = (p: PlantillaEmailAPI) => {
    setModal({ id: p.id, nombre: p.nombre, asunto: p.asunto, cuerpo: p.cuerpo });
  };

  const openNew = () => setModal({ ...EMPTY });

  const handleSave = async () => {
    if (!modal) return;
    if (!modal.nombre.trim() || !modal.asunto.trim()) return;
    setSaving(true);
    try {
      if (modal.id === null) {
        const created = await createPlantilla({
          nombre: modal.nombre.trim(),
          asunto: modal.asunto.trim(),
          cuerpo: modal.cuerpo.trim(),
        });
        setPlantillas((prev) => [...prev, created]);
      } else {
        const updated = await updatePlantilla(modal.id, {
          nombre: modal.nombre.trim(),
          asunto: modal.asunto.trim(),
          cuerpo: modal.cuerpo.trim(),
        });
        setPlantillas((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      }
      setModal(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al guardar la plantilla.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar esta plantilla?")) return;
    setDeletingId(id);
    try {
      await deletePlantilla(id);
      setPlantillas((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al eliminar la plantilla.");
    } finally {
      setDeletingId(null);
    }
  };

  const listContent = () => {
    if (loading) {
      return (
        <p className="py-8 text-center text-sm text-figma-placeholder">
          Cargando plantillas…
        </p>
      );
    }
    if (plantillas.length === 0) {
      return (
        <div className="rounded-2xl border border-border/70 bg-card px-6 py-10 text-center">
          <p className="text-sm font-medium text-figma-table">
            No hay plantillas guardadas
          </p>
          <p className="mt-1 text-sm text-figma-placeholder">
            Crea la primera para reutilizarla en campañas.
          </p>
        </div>
      );
    }
    return (
      <div className="overflow-hidden rounded-2xl border border-border/70 bg-card">
        {plantillas.map((p, i) => (
          <div
            key={p.id}
            className={
              "flex items-start justify-between gap-4 px-5 py-4" +
              (i === 0 ? "" : " border-t border-border/60")
            }
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-figma-table">
                {p.nombre}
              </p>
              <p className="mt-0.5 truncate text-xs text-figma-placeholder">
                Asunto: {p.asunto}
              </p>
              {p.cuerpo && (
                <p className="mt-0.5 line-clamp-1 text-xs text-figma-placeholder/70">
                  {p.cuerpo}
                </p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-8 gap-1.5 px-3 text-xs font-medium border-border text-figma-table hover:bg-muted"
                onClick={() => openEdit(p)}
              >
                <Pencil className="size-3" />
                Editar
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="h-8 w-8 p-0 text-figma-placeholder hover:text-destructive"
                disabled={deletingId === p.id}
                onClick={() => handleDelete(p.id)}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const actionLabel = modal?.id === null ? "Crear plantilla" : "Guardar cambios";
  const saveLabel = saving ? "Guardando…" : actionLabel;

  return (
    <div className="flex flex-col gap-8">
      {/* ── Plantillas guardadas ── */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-figma-placeholder">
              Plantillas de email
            </p>
            <h2 className="mt-1 font-display text-xl font-semibold tracking-tight text-figma-table">
              Plantillas guardadas
            </h2>
          </div>
          <Button
            type="button"
            className="h-9 gap-2 px-4 text-sm font-medium"
            onClick={openNew}
          >
            <Plus className="size-3.5" />
            Nueva plantilla
          </Button>
        </div>

        {listContent()}
      </section>

      {/* ── Editor visual ── */}
      <section>
        <div className="mb-4">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-figma-placeholder">
            Editor visual de plantillas
          </p>
          <h2 className="mt-1 font-display text-xl font-semibold tracking-tight text-figma-table">
            Diseñador de emails
          </h2>
          <p className="mt-1 text-sm text-figma-placeholder">
            Herramienta para componer emails de forma visual por bloques, complementaria a la gestión de plantillas del sistema.
          </p>
        </div>
        <EmailBuilderWorkspace />
      </section>

      {/* ── Modal editar / nueva plantilla ── */}
      {modal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-figma-table">
                {modal.id === null ? "Nueva plantilla" : "Editar plantilla"}
              </h2>
              <button
                type="button"
                className="rounded-lg p-1 text-figma-placeholder hover:text-figma-table"
                onClick={() => setModal(null)}
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="modal-nombre" className="text-xs font-medium text-figma-table">
                  Nombre <span className="text-destructive">*</span>
                </label>
                <input
                  id="modal-nombre"
                  type="text"
                  value={modal.nombre}
                  onChange={(e) =>
                    setModal((m) => m && { ...m, nombre: e.target.value })
                  }
                  placeholder="Ej. Bienvenida"
                  className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-figma-table placeholder:text-figma-placeholder/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="modal-asunto" className="text-xs font-medium text-figma-table">
                  Asunto <span className="text-destructive">*</span>
                </label>
                <input
                  id="modal-asunto"
                  type="text"
                  value={modal.asunto}
                  onChange={(e) =>
                    setModal((m) => m && { ...m, asunto: e.target.value })
                  }
                  placeholder="Ej. ¡Bienvenido a nuestro servicio!"
                  className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-figma-table placeholder:text-figma-placeholder/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="modal-cuerpo" className="text-xs font-medium text-figma-table">Cuerpo</label>
                <textarea
                  id="modal-cuerpo"
                  value={modal.cuerpo}
                  onChange={(e) =>
                    setModal((m) => m && { ...m, cuerpo: e.target.value })
                  }
                  rows={6}
                  placeholder="Escribe el contenido del email…"
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-figma-table placeholder:text-figma-placeholder/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                className="h-9 px-4 text-sm text-figma-placeholder"
                onClick={() => setModal(null)}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                className="h-9 px-5 text-sm font-medium"
                disabled={saving || !modal.nombre.trim() || !modal.asunto.trim()}
                onClick={handleSave}
              >
                {saving ? "Guardando…" : saveLabel}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

