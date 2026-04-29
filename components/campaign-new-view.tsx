"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCampana, getPlantillas, type PlantillaEmailAPI } from "@/lib/api";

export function CampaignNewView() {
  const router = useRouter();

  const [plantillas, setPlantillas] = useState<PlantillaEmailAPI[]>([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [plantillaId, setPlantillaId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPlantillas().then(setPlantillas).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    setError(null);

    if (!nombre.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    if (!plantillaId) {
      setError("Selecciona una plantilla.");
      return;
    }

    setSaving(true);
    try {
      const nueva = await createCampana({
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || undefined,
        plantilla: plantillaId,
      });
      router.push(`/dashboard/campanas/${nueva.id}`);
    } catch {
      setError("Error al crear la campaña. Inténtalo de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  const plantillaSeleccionada = plantillas.find((p) => p.id === plantillaId) ?? null;

  return (
    <div className="flex min-h-full flex-col overflow-auto pr-1">
      {/* Header */}
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

      <div className="mt-6">
        <div className="border-b border-border/70 pb-6">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-figma-placeholder">
            Email marketing
          </p>
          <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-figma-table md:text-3xl">
            Nueva campaña
          </h1>
          <p className="mt-2 text-sm text-figma-placeholder">
            Crea una campaña asociándola a una plantilla. Después podrás asignar clientes y enviarla.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 max-w-xl space-y-6">
          {/* Nombre */}
          <div className="space-y-1.5">
            <label htmlFor="campana-nombre" className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-figma-placeholder">
              Nombre *
            </label>
            <Input
              id="campana-nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Campaña verano 2026"
              className="h-10"
            />
          </div>

          {/* Descripción */}
          <div className="space-y-1.5">
            <label htmlFor="campana-descripcion" className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-figma-placeholder">
              Descripción
            </label>
            <textarea
              id="campana-descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción opcional de la campaña…"
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-figma-table placeholder:text-figma-placeholder/60 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0 resize-none"
            />
          </div>

          {/* Plantilla */}
          <div className="space-y-1.5">
            <label htmlFor="campana-plantilla" className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-figma-placeholder">
              Plantilla de email *
            </label>
            {plantillas.length === 0 ? (
              <p className="text-sm text-figma-placeholder italic">
                No hay plantillas disponibles. Crea una antes de continuar.
              </p>
            ) : (
              <select
                id="campana-plantilla"
                value={plantillaId ?? ""}
                onChange={(e) =>
                  setPlantillaId(e.target.value ? Number(e.target.value) : null)
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-figma-table focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Selecciona una plantilla…</option>
                {plantillas.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Preview plantilla seleccionada */}
          {plantillaSeleccionada !== null && (
            <div className="rounded-2xl border border-border/70 bg-figma-shell/40 px-5 py-4 space-y-2">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-figma-placeholder">
                Vista previa de la plantilla
              </p>
              <p className="text-xs font-medium text-figma-placeholder">
                Asunto: <span className="text-figma-table">{plantillaSeleccionada.asunto}</span>
              </p>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-figma-table line-clamp-4">
                {plantillaSeleccionada.cuerpo}
              </p>
            </div>
          )}

          {/* Error */}
          {error !== null && (
            <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </p>
          )}

          {/* Acciones */}
          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" disabled={saving} className="h-9 px-5 text-sm font-medium">
              {saving ? "Creando…" : "Crear campaña"}
            </Button>
            <Link href="/dashboard/campanas">
              <Button type="button" variant="ghost" className="h-9 px-4 text-sm text-figma-placeholder">
                Cancelar
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
