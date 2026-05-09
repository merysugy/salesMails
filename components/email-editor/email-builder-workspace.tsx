"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CopyPlus,
  Eye,
  FolderPlus,
  Layers3,
  LayoutTemplate,
  Mail,
  MoveRight,
  PencilLine,
  Plus,
  Settings2,
  Sparkles,
  Trash2,
  Users,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { EmailBlockCanvas } from "@/components/email-editor/email-block-canvas";
import {
  EmailBlockInspectorCard,
  EmailTemplateSettingsCard,
  EmailVariablesCard,
  EmailVersionsCard,
} from "@/components/email-editor/email-inspector-pane";
import { EmailPreviewPane } from "@/components/email-editor/email-preview-pane";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  blockDefinitions,
  createTemplateSeed,
  createTemplateVersion,
  duplicateBlock,
  duplicateTemplateSeed,
  insertBlock,
  moveBlock,
  moveBlockByOffset,
  removeBlock,
  updateBlockInDocument,
} from "@/lib/email-builder/document";
import { emailVariableDefinitions, renderEmailDocument } from "@/lib/email-builder/render";
import type { EmailBlock, EmailTemplate, EmailViewport } from "@/lib/email-builder/types";
import type { EmailRenderData } from "@/lib/email-builder/types";
import {
  getPlantillas,
  createPlantilla,
  updatePlantilla,
  deletePlantilla,
  getClientes,
  type ClienteAPI,
} from "@/lib/api";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "salesmails.email-builder.templates.v1";

const previewBackground: Record<EmailTemplate["variante"], string> = {
  amber:
    "bg-[radial-gradient(circle_at_top,_rgba(139,105,20,0.22),_transparent_55%),linear-gradient(180deg,#f4efe4_0%,#f8f6f0_100%)]",
  sage:
    "bg-[radial-gradient(circle_at_top,_rgba(61,107,79,0.24),_transparent_50%),linear-gradient(180deg,#eef3ee_0%,#f7faf7_100%)]",
  stone:
    "bg-[radial-gradient(circle_at_top,_rgba(115,112,106,0.20),_transparent_50%),linear-gradient(180deg,#f3f1ec_0%,#faf9f7_100%)]",
  charcoal:
    "bg-[radial-gradient(circle_at_top,_rgba(20,20,20,0.28),_transparent_45%),linear-gradient(180deg,#ece9e2_0%,#f7f4ee_100%)]",
};

const wizardSteps = [
  {
    id: "plantilla",
    label: "Plantilla",
    title: "Elige una plantilla o crea una nueva",
    description: "Empieza desde una base existente antes de tocar bloques o contenido.",
    icon: FolderPlus,
  },
  {
    id: "estructura",
    label: "Estructura",
    title: "Ordena la estructura del email",
    description: "Inserta secciones y define el orden del mensaje.",
    icon: Layers3,
  },
  {
    id: "bloque",
    label: "Detalle",
    title: "Edita una seccion concreta",
    description: "Trabaja bloque a bloque con foco total en una sola pieza.",
    icon: PencilLine,
  },
  {
    id: "ajustes",
    label: "Ajustes",
    title: "Configura la plantilla y las variables",
    description: "Ajusta preheader, colores, tema y referencias dinamicas.",
    icon: Settings2,
  },
  {
    id: "preview",
    label: "Preview",
    title: "Revisa el resultado final",
    description: "Comprueba el HTML y exportalo cuando este listo.",
    icon: Eye,
  },
] as const;

type WizardStepId = (typeof wizardSteps)[number]["id"];

function mapClienteToRenderData(c: ClienteAPI): EmailRenderData {
  return {
    cliente: {
      nombre: c.nombre,
      empresa: c.empresa,
      email: c.email ?? "",
      localidad: c.ciudad ?? "",
      ultimoContacto: "",
    },
    campana: {
      nombre: "Campaña activa",
      propuestaValor: "",
      remitente: "",
    },
    empresa: {
      nombre: "",
      web: "",
      telefono: "",
    },
  };
}

function defaultRenderData(): EmailRenderData {
  return {
    cliente: {
      nombre: "Lead de ejemplo",
      empresa: "Empresa ejemplo",
      email: "ejemplo@empresa.com",
      localidad: "Madrid",
      ultimoContacto: "",
    },
    campana: { nombre: "Campaña activa", propuestaValor: "", remitente: "" },
    empresa: { nombre: "", web: "", telefono: "" },
  };
}

function readLocalTemplates(): EmailTemplate[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as EmailTemplate[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function formatUpdatedAt(value: string) {
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function templateStatusLabel(status: EmailTemplate["status"]) {
  return status === "published" ? "Publicada" : "Borrador";
}

function templateStatusClass(status: EmailTemplate["status"]) {
  return status === "published"
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : "border-amber-200 bg-amber-50 text-amber-700";
}

export function EmailBuilderWorkspace() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedClientIds = useMemo(() => {
    const value = searchParams.get("clientes");
    if (!value) return [];
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }, [searchParams]);

  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [apiClientes, setApiClientes] = useState<ClienteAPI[]>([]);
  const [activeTemplateId, setActiveTemplateId] = useState("");
  const [selectedBlockId, setSelectedBlockId] = useState("");
  const [viewport, setViewport] = useState<EmailViewport>("desktop");
  const [draggingBlockId, setDraggingBlockId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [currentStep, setCurrentStep] = useState<WizardStepId>("plantilla");
  const [saving, setSaving] = useState(false);

  // Carga clientes reales de la API
  useEffect(() => {
    getClientes().then(setApiClientes).catch(() => {});
  }, []);

  // Carga plantillas de la API y las cruza con los documentos de localStorage
  useEffect(() => {
    setLoadingTemplates(true);
    getPlantillas()
      .then((apiPlantillas) => {
        const local = readLocalTemplates();

        const merged: EmailTemplate[] = apiPlantillas.map((p) => {
          const existing = local.find((t) => t.apiId === p.id);
          if (existing) {
            return { ...existing, titulo: p.nombre };
          }
          return createTemplateSeed({
            titulo: p.nombre,
            descripcion: "",
            categoria: "Primer contacto",
            variante: "amber",
            apiId: p.id,
          });
        });

        // Borradores locales sin apiId
        const localDrafts = local.filter((t) => !t.apiId);
        const all = [...merged, ...localDrafts];

        setTemplates(all);
        const first = all[0];
        if (first) {
          setActiveTemplateId(first.id);
          setSelectedBlockId(first.document.blocks[0]?.id ?? "");
        }
      })
      .catch(() => {
        // Si la API falla, usar solo borradores locales
        const local = readLocalTemplates();
        setTemplates(local);
        const first = local[0];
        if (first) {
          setActiveTemplateId(first.id);
          setSelectedBlockId(first.document.blocks[0]?.id ?? "");
        }
      })
      .finally(() => setLoadingTemplates(false));
  }, []);

  // Persiste en localStorage cada vez que cambian los templates
  useEffect(() => {
    if (!loadingTemplates) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
    }
  }, [templates, loadingTemplates]);

  const selectedClientes = useMemo(
    () =>
      selectedClientIds
        .map((id) => apiClientes.find((c) => String(c.id) === id))
        .filter((c): c is ClienteAPI => Boolean(c)),
    [selectedClientIds, apiClientes],
  );

  const activeTemplate =
    templates.find((t) => t.id === activeTemplateId) ?? templates[0] ?? null;

  const resolvedSelectedBlockId =
    activeTemplate?.document.blocks.some((b) => b.id === selectedBlockId)
      ? selectedBlockId
      : activeTemplate?.document.blocks[0]?.id ?? "";

  const activeBlock =
    activeTemplate?.document.blocks.find((b) => b.id === resolvedSelectedBlockId) ?? null;

  const renderData = useMemo(
    () =>
      selectedClientes[0]
        ? mapClienteToRenderData(selectedClientes[0])
        : defaultRenderData(),
    [selectedClientes],
  );

  const previewHtml = useMemo(() => {
    if (!activeTemplate) return "";
    return renderEmailDocument(activeTemplate.document, renderData);
  }, [activeTemplate, renderData]);

  function updateTemplate(
    templateId: string,
    updater: (template: EmailTemplate) => EmailTemplate,
  ) {
    setTemplates((prev) => prev.map((t) => (t.id === templateId ? updater(t) : t)));
  }

  function updateActiveTemplate(updater: (template: EmailTemplate) => EmailTemplate) {
    if (!activeTemplate) return;
    updateTemplate(activeTemplate.id, updater);
  }

  function createTemplate() {
    const next = createTemplateSeed({
      titulo: `Nueva plantilla ${templates.length + 1}`,
      descripcion: "Borrador inicial.",
      categoria: "Primer contacto",
      variante: "amber",
    });
    setTemplates((prev) => [next, ...prev]);
    setActiveTemplateId(next.id);
    setSelectedBlockId(next.document.blocks[0]?.id ?? "");
  }

  function duplicateTemplate() {
    if (!activeTemplate) return;
    const next = duplicateTemplateSeed(activeTemplate);
    // El duplicado es borrador local hasta que se guarde
    next.apiId = undefined;
    setTemplates((prev) => [next, ...prev]);
    setActiveTemplateId(next.id);
    setSelectedBlockId(next.document.blocks[0]?.id ?? "");
  }

  async function deleteTemplate() {
    if (!activeTemplate || templates.length <= 1) return;
    const confirmed = window.confirm(`Eliminar la plantilla "${activeTemplate.titulo}"?`);
    if (!confirmed) return;

    if (activeTemplate.apiId) {
      try {
        await deletePlantilla(activeTemplate.apiId);
      } catch {
        alert("Error al eliminar la plantilla del servidor.");
        return;
      }
    }

    const remaining = templates.filter((t) => t.id !== activeTemplate.id);
    setTemplates(remaining);
    setActiveTemplateId(remaining[0]?.id ?? "");
    setSelectedBlockId(remaining[0]?.document.blocks[0]?.id ?? "");
  }

  async function saveTemplate(nextStatus?: EmailTemplate["status"]) {
    if (!activeTemplate) return;

    const nextUpdatedAt = new Date().toISOString();
    const latestVersion = activeTemplate.versions[activeTemplate.versions.length - 1];
    const versionChanged =
      JSON.stringify(latestVersion?.document) !== JSON.stringify(activeTemplate.document);

    const updatedLocal: EmailTemplate = {
      ...activeTemplate,
      status: nextStatus ?? activeTemplate.status,
      updatedAt: nextUpdatedAt,
      versions: versionChanged
        ? [
            ...activeTemplate.versions,
            createTemplateVersion(activeTemplate.document, activeTemplate.versions.length + 1),
          ]
        : activeTemplate.versions,
    };

    // Sincroniza con la API
    const renderedHtml = renderEmailDocument(activeTemplate.document, renderData);
    const payload = {
      nombre: updatedLocal.titulo,
      asunto: updatedLocal.document.title,
      cuerpo: renderedHtml,
    };

    setSaving(true);
    try {
      if (updatedLocal.apiId) {
        await updatePlantilla(updatedLocal.apiId, payload);
        setTemplates((prev) =>
          prev.map((t) => (t.id === updatedLocal.id ? updatedLocal : t)),
        );
      } else {
        const created = await createPlantilla(payload);
        const withApiId = { ...updatedLocal, apiId: created.id };
        setTemplates((prev) =>
          prev.map((t) => (t.id === withApiId.id ? withApiId : t)),
        );
      }
    } catch {
      alert("Error al guardar la plantilla.");
    } finally {
      setSaving(false);
    }
  }

  async function saveAndNavigateToSend() {
    await saveTemplate("published");
    const current = templates.find((t) => t.id === activeTemplateId) ?? activeTemplate;
    const apiId = current?.apiId;
    if (!apiId) return;
    const clientesQs =
      selectedClientIds.length > 0 ? `&clientes=${selectedClientIds.join(",")}` : "";
    router.push(`/dashboard/correo/enviar?plantilla=${apiId}${clientesQs}`);
  }

  function updateActiveBlock(nextBlock: EmailBlock) {
    if (!activeTemplate) return;
    updateActiveTemplate((t) => ({
      ...t,
      document: updateBlockInDocument(t.document, nextBlock.id, () => nextBlock),
      updatedAt: new Date().toISOString(),
    }));
  }

  function insertNewBlock(blockType: EmailBlock["type"]) {
    if (!activeTemplate) return;
    updateActiveTemplate((t) => {
      const selectedIndex = t.document.blocks.findIndex(
        (b) => b.id === resolvedSelectedBlockId,
      );
      const result = insertBlock(t.document, blockType, selectedIndex);
      setSelectedBlockId(result.insertedBlockId);
      return { ...t, document: result.document, updatedAt: new Date().toISOString() };
    });
  }

  function duplicateCanvasBlock(blockId: string) {
    if (!activeTemplate) return;
    updateActiveTemplate((t) => {
      const result = duplicateBlock(t.document, blockId);
      if (result.duplicatedBlockId) setSelectedBlockId(result.duplicatedBlockId);
      return { ...t, document: result.document, updatedAt: new Date().toISOString() };
    });
  }

  function moveCanvasBlock(blockId: string, offset: -1 | 1) {
    updateActiveTemplate((t) => ({
      ...t,
      document: moveBlockByOffset(t.document, blockId, offset),
      updatedAt: new Date().toISOString(),
    }));
  }

  function dropCanvasBlock(sourceId: string, destinationId: string) {
    updateActiveTemplate((t) => ({
      ...t,
      document: moveBlock(t.document, sourceId, destinationId),
      updatedAt: new Date().toISOString(),
    }));
  }

  function removeCanvasBlock(blockId: string) {
    if (!activeTemplate || activeTemplate.document.blocks.length <= 1) return;
    updateActiveTemplate((t) => ({
      ...t,
      document: removeBlock(t.document, blockId),
      updatedAt: new Date().toISOString(),
    }));
  }

  async function copyHtml() {
    try {
      await navigator.clipboard.writeText(previewHtml);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  if (loadingTemplates) {
    return (
      <div className="py-12 text-center text-sm text-figma-placeholder">
        Cargando plantillas…
      </div>
    );
  }

  if (!activeTemplate) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-sm text-figma-placeholder">No hay plantillas. Crea la primera.</p>
        <Button type="button" onClick={createTemplate} className="gap-2">
          <FolderPlus className="size-4" />
          Crear plantilla
        </Button>
      </div>
    );
  }

  const currentStepIndex = wizardSteps.findIndex((s) => s.id === currentStep);
  const currentStepMeta = wizardSteps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === wizardSteps.length - 1;
  const selectedClientName =
    selectedClientes[0]?.nombre ?? "Lead de ejemplo";

  function goToNextStep() {
    if (!isLastStep) setCurrentStep(wizardSteps[currentStepIndex + 1].id);
  }
  function goToPreviousStep() {
    if (!isFirstStep) setCurrentStep(wizardSteps[currentStepIndex - 1].id);
  }

  return (
    <div className="flex min-w-0 flex-col gap-6 pb-2">
      <div className="shrink-0 space-y-2 border-b border-border/70 pb-5">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-figma-placeholder">
          Correo
        </p>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <h1 className="font-display text-2xl font-semibold tracking-tight text-figma-table md:text-3xl">
              Maquetador avanzado de emails
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-figma-placeholder">
              Asistente paso a paso para elegir plantilla, construir secciones,
              editar contenido y exportar el HTML final sin mezclarlo todo en la
              misma pantalla.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              size="lg"
              onClick={createTemplate}
              className="h-9 gap-2 border-0 bg-figma-table px-3 text-sm font-medium text-white hover:bg-figma-table/90"
            >
              <FolderPlus className="size-3.5" />
              Crear plantilla
            </Button>
            <Button
              type="button"
              size="lg"
              variant="outline"
              onClick={duplicateTemplate}
              className="h-9 gap-2 border-border bg-transparent px-3 text-sm font-medium text-figma-table hover:bg-muted"
            >
              <CopyPlus className="size-3.5" />
              Duplicar
            </Button>
            <Button
              type="button"
              size="lg"
              variant="outline"
              onClick={deleteTemplate}
              disabled={templates.length <= 1}
              className="h-9 gap-2 border-border bg-transparent px-3 text-sm font-medium text-figma-table hover:bg-muted"
            >
              <Trash2 className="size-3.5" />
              Eliminar
            </Button>
            <Button
              type="button"
              size="lg"
              variant="outline"
              disabled={saving}
              onClick={() => saveTemplate()}
              className="h-9 gap-2 border-border bg-transparent px-3 text-sm font-medium text-figma-table hover:bg-muted"
            >
              {saving ? "Guardando…" : "Guardar"}
            </Button>
            <Button
              type="button"
              size="lg"
              disabled={saving}
              onClick={() => saveTemplate("published")}
              className="h-9 gap-2 bg-figma-table px-3 text-sm font-medium text-white hover:bg-figma-table/90"
            >
              Publicar
            </Button>
          </div>
        </div>
      </div>

      <Card className="border-border/80 bg-card py-0 shadow-none ring-0">
        <CardContent className="space-y-5 p-5">
          {/* Pasos */}
          <div className="grid gap-3 lg:grid-cols-5">
            {wizardSteps.map((step, index) => {
              const isCurrent = step.id === currentStep;
              const isDone = index < currentStepIndex;
              const Icon = step.icon;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setCurrentStep(step.id)}
                  className={cn(
                    "rounded-[1.35rem] border p-4 text-left transition-all",
                    isCurrent
                      ? "border-figma-accent bg-[#fbf6ea] shadow-[0_0_0_2px_rgba(139,105,20,0.12)]"
                      : "border-border/70 bg-[#fbfaf7] hover:border-figma-accent/35",
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]",
                        isCurrent || isDone
                          ? "border-figma-accent/30 bg-white text-figma-table"
                          : "border-border bg-white text-figma-placeholder",
                      )}
                    >
                      Paso {index + 1}
                    </span>
                    <Icon className="size-4 text-figma-placeholder" />
                  </div>
                  <p className="mt-3 text-sm font-medium text-figma-table">{step.label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-figma-placeholder">
                    {step.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Contenido del paso activo */}
          <div className="rounded-[1.6rem] border border-border/70 bg-[#fcfaf6] p-5">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border/70 pb-4">
              <div className="space-y-1">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-figma-placeholder">
                  {currentStepMeta.label}
                </p>
                <h2 className="font-display text-2xl text-figma-table">
                  {currentStepMeta.title}
                </h2>
                <p className="max-w-3xl text-sm leading-relaxed text-figma-placeholder">
                  {currentStepMeta.description}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-figma-placeholder">
                <span className="rounded-full border border-border bg-white px-3 py-1.5">
                  {activeTemplate.document.blocks.length} bloques
                </span>
                <span className="rounded-full border border-border bg-white px-3 py-1.5">
                  {activeTemplate.versions.length} versiones
                </span>
                <span className="rounded-full border border-border bg-white px-3 py-1.5">
                  Destinatarios {Math.max(selectedClientes.length, 1)}
                </span>
              </div>
            </div>

            <div className="mt-5 min-h-0">
              {/* ── Paso 1: Plantilla ── */}
              {currentStep === "plantilla" ? (
                <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {templates.map((template) => {
                      const isActive = template.id === activeTemplate.id;
                      return (
                        <button
                          key={template.id}
                          type="button"
                          onClick={() => {
                            setActiveTemplateId(template.id);
                            setSelectedBlockId(template.document.blocks[0]?.id ?? "");
                          }}
                          className={cn(
                            "rounded-[1.5rem] border bg-white text-left transition-all",
                            isActive
                              ? "border-figma-accent shadow-[0_0_0_2px_rgba(139,105,20,0.18)]"
                              : "border-border/70 hover:border-figma-accent/40",
                          )}
                        >
                          <div
                            className={cn(
                              "m-3 rounded-[1.25rem] p-4",
                              previewBackground[template.variante],
                            )}
                          >
                            <div className="rounded-[1rem] border border-white/60 bg-white/90 p-3 shadow-[0_10px_26px_rgba(20,20,20,0.08)]">
                              <div className="h-2 w-14 rounded-full bg-figma-table/20" />
                              <div className="mt-3 space-y-2">
                                <div className="h-2 w-full rounded-full bg-figma-table/10" />
                                <div className="h-2 w-5/6 rounded-full bg-figma-table/10" />
                                <div className="h-2 w-2/3 rounded-full bg-figma-table/10" />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2 px-4 pb-4">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-medium text-figma-table">
                                {template.titulo}
                              </span>
                              <span
                                className={cn(
                                  "rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]",
                                  templateStatusClass(template.status),
                                )}
                              >
                                {templateStatusLabel(template.status)}
                              </span>
                            </div>
                            {template.descripcion && (
                              <p className="text-xs leading-relaxed text-figma-placeholder">
                                {template.descripcion}
                              </p>
                            )}
                            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-figma-placeholder">
                              <span>{template.categoria}</span>
                              <span>{template.versions.length} versiones</span>
                            </div>
                            <p className="text-[11px] text-figma-placeholder">
                              Actualizado {formatUpdatedAt(template.updatedAt)}
                            </p>
                            {!template.apiId && (
                              <p className="text-[10px] font-medium text-amber-600">
                                Borrador local — guarda para sincronizar
                              </p>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="space-y-4">
                    <Card className="border-border/80 bg-white py-0 shadow-none ring-0">
                      <CardHeader className="border-b border-border/70 py-4">
                        <CardTitle className="font-display text-base text-figma-table">
                          Plantilla activa
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 p-4">
                        <p className="text-lg font-medium text-figma-table">
                          {activeTemplate.titulo}
                        </p>
                        {activeTemplate.descripcion && (
                          <p className="text-sm leading-relaxed text-figma-placeholder">
                            {activeTemplate.descripcion}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2 text-xs text-figma-placeholder">
                          <span className="rounded-full border border-border bg-[#fbfaf7] px-3 py-1.5">
                            {activeTemplate.categoria}
                          </span>
                          <span className="rounded-full border border-border bg-[#fbfaf7] px-3 py-1.5">
                            {activeTemplate.document.blocks.length} bloques
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-border/80 bg-white py-0 shadow-none ring-0">
                      <CardHeader className="border-b border-border/70 py-4">
                        <CardTitle className="font-display text-base text-figma-table">
                          Crear desde cero
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 p-4">
                        <p className="text-sm leading-relaxed text-figma-placeholder">
                          Crea una plantilla nueva y continua con el asistente paso a paso.
                        </p>
                        <Button
                          type="button"
                          onClick={createTemplate}
                          className="h-10 w-full gap-2 bg-figma-table text-white hover:bg-figma-table/90"
                        >
                          <FolderPlus className="size-4" />
                          Crear plantilla nueva
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : null}

              {/* ── Paso 2: Estructura ── */}
              {currentStep === "estructura" ? (
                <div className="grid gap-4 xl:grid-cols-[300px_minmax(0,1fr)]">
                  <Card className="border-border/80 bg-white py-0 shadow-none ring-0">
                    <CardHeader className="border-b border-border/70 py-4">
                      <CardTitle className="font-display text-base text-figma-table">
                        Bloques disponibles
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 p-4">
                      {blockDefinitions.map((block) => (
                        <button
                          key={block.type}
                          type="button"
                          onClick={() => insertNewBlock(block.type)}
                          className="w-full rounded-2xl border border-border/70 bg-[#fbfaf7] p-3 text-left transition-colors hover:bg-[#f4efe4]"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-medium text-figma-table">
                                {block.title}
                              </p>
                              <p className="mt-1 text-xs leading-relaxed text-figma-placeholder">
                                {block.description}
                              </p>
                            </div>
                            <span className="rounded-full border border-border bg-white p-2 text-figma-table">
                              <Plus className="size-3.5" />
                            </span>
                          </div>
                        </button>
                      ))}
                    </CardContent>
                  </Card>
                  <EmailBlockCanvas
                    document={activeTemplate.document}
                    draggingBlockId={draggingBlockId}
                    selectedBlockId={resolvedSelectedBlockId}
                    selectedRecipients={Math.max(selectedClientes.length, 1)}
                    onBlockChange={updateActiveBlock}
                    onDropBlock={dropCanvasBlock}
                    onDuplicateBlock={duplicateCanvasBlock}
                    onMoveBlock={moveCanvasBlock}
                    onRemoveBlock={removeCanvasBlock}
                    onSelectBlock={setSelectedBlockId}
                    setDraggingBlockId={setDraggingBlockId}
                  />
                </div>
              ) : null}

              {/* ── Paso 3: Detalle ── */}
              {currentStep === "bloque" ? (
                <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
                  <Card className="border-border/80 bg-white py-0 shadow-none ring-0">
                    <CardHeader className="border-b border-border/70 py-4">
                      <CardTitle className="font-display text-base text-figma-table">
                        Secciones del email
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 p-4">
                      {activeTemplate.document.blocks.map((block, index) => {
                        const isActive = block.id === resolvedSelectedBlockId;
                        return (
                          <button
                            key={block.id}
                            type="button"
                            onClick={() => setSelectedBlockId(block.id)}
                            className={cn(
                              "w-full rounded-2xl border p-3 text-left transition-all",
                              isActive
                                ? "border-figma-accent bg-[#fbf6ea]"
                                : "border-border/70 bg-[#fbfaf7] hover:border-figma-accent/40",
                            )}
                          >
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-figma-placeholder">
                              Seccion {index + 1}
                            </p>
                            <p className="mt-1 text-sm font-medium text-figma-table">
                              {block.type}
                            </p>
                          </button>
                        );
                      })}
                    </CardContent>
                  </Card>
                  <EmailBlockInspectorCard
                    activeBlock={activeBlock}
                    onBlockChange={updateActiveBlock}
                  />
                </div>
              ) : null}

              {/* ── Paso 4: Ajustes ── */}
              {currentStep === "ajustes" ? (
                <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
                  <div className="space-y-4">
                    <EmailTemplateSettingsCard
                      activeTemplate={activeTemplate}
                      onDocumentMetaChange={(patch) =>
                        updateActiveTemplate((t) => ({
                          ...t,
                          document: { ...t.document, ...patch },
                          updatedAt: new Date().toISOString(),
                        }))
                      }
                      onTemplateMetaChange={(patch) =>
                        updateActiveTemplate((t) => ({
                          ...t,
                          ...patch,
                          updatedAt: new Date().toISOString(),
                        }))
                      }
                      onThemeChange={(patch) =>
                        updateActiveTemplate((t) => ({
                          ...t,
                          document: {
                            ...t.document,
                            theme: { ...t.document.theme, ...patch },
                          },
                          updatedAt: new Date().toISOString(),
                        }))
                      }
                    />

                    <Card className="border-border/80 bg-white py-0 shadow-none ring-0">
                      <CardHeader className="border-b border-border/70 py-4">
                        <div className="flex items-center gap-2">
                          <Users className="size-4 text-figma-placeholder" />
                          <CardTitle className="font-display text-base text-figma-table">
                            Audiencia de referencia
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3 p-4">
                        {selectedClientes.length > 0 ? (
                          <>
                            <p className="text-sm text-figma-placeholder">
                              La plantilla se previsualiza con el primer cliente y se
                              prepara para {selectedClientes.length} destinatarios.
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {selectedClientes.map((c) => (
                                <span
                                  key={c.id}
                                  className="rounded-full border border-border bg-[#fbfaf7] px-3 py-1.5 text-xs text-figma-table"
                                >
                                  {c.nombre}
                                </span>
                              ))}
                            </div>
                          </>
                        ) : (
                          <p className="text-sm text-figma-placeholder">
                            No hay clientes seleccionados. La preview usa datos de ejemplo.
                            Selecciona clientes desde el dashboard antes de abrir el editor.
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-4">
                    <EmailVariablesCard variableDefinitions={emailVariableDefinitions} />
                    <EmailVersionsCard activeTemplate={activeTemplate} />
                  </div>
                </div>
              ) : null}

              {/* ── Paso 5: Preview ── */}
              {currentStep === "preview" ? (
                <EmailPreviewPane
                  copied={copied}
                  html={previewHtml}
                  selectedClientName={selectedClientName}
                  selectedRecipients={Math.max(selectedClientes.length, 1)}
                  viewport={viewport}
                  saving={saving}
                  onCopyHtml={copyHtml}
                  onViewportChange={setViewport}
                  onSaveAndSend={saveAndNavigateToSend}
                />
              ) : null}
            </div>
          </div>

          {/* Navegación inferior */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="rounded-full border border-border bg-[#fbfaf7] px-3 py-1.5 text-xs text-figma-table">
                <LayoutTemplate className="mr-1 inline size-3.5" />
                Flujo tipo formulario
              </div>
              <div className="rounded-full border border-border bg-[#fbfaf7] px-3 py-1.5 text-xs text-figma-table">
                <Mail className="mr-1 inline size-3.5" />
                Sincronización con API activa
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={goToPreviousStep}
                disabled={isFirstStep}
                className="h-10 rounded-full border-border bg-transparent px-4 text-sm text-figma-table hover:bg-muted"
              >
                Anterior
              </Button>
              <Button
                type="button"
                onClick={goToNextStep}
                disabled={isLastStep}
                className="h-10 gap-2 rounded-full bg-figma-table px-4 text-sm text-white hover:bg-figma-table/90"
              >
                Siguiente
                <MoveRight className="size-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/80 bg-card py-0 shadow-none ring-0">
        <CardContent className="flex flex-wrap items-start justify-between gap-3 p-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-figma-placeholder" />
              <p className="text-sm font-medium text-figma-table">
                Flujo guiado por pasos
              </p>
            </div>
            <p className="max-w-2xl text-xs leading-relaxed text-figma-placeholder">
              Primero eliges plantilla, luego estructuras el email, despues editas
              cada seccion, configuras la plantilla y terminas revisando el HTML.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
