"use client";

import { History } from "lucide-react";
import type { ComponentProps } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type {
  EmailBlock,
  EmailDocument,
  EmailTemplate,
  EmailTheme,
  EmailVariableDefinition,
} from "@/lib/email-builder/types";

type EmailInspectorPaneProps = {
  activeBlock: EmailBlock | null;
  activeTemplate: EmailTemplate;
  variableDefinitions: EmailVariableDefinition[];
  onBlockChange: (block: EmailBlock) => void;
  onDocumentMetaChange: (
    patch: Partial<Pick<EmailDocument, "title" | "preheader">>,
  ) => void;
  onTemplateMetaChange: (
    patch: Partial<Pick<EmailTemplate, "titulo" | "descripcion">>,
  ) => void;
  onThemeChange: (patch: Partial<EmailTheme>) => void;
};

function Field({
  label,
  value,
  onChange,
  multiline,
  type = "text",
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  multiline?: boolean;
  type?: ComponentProps<"input">["type"];
}) {
  return (
    <label className="space-y-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-figma-placeholder">
        {label}
      </span>
      {multiline ? (
        <textarea
          value={String(value)}
          onChange={(event) => onChange(event.target.value)}
          className="min-h-24 w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-figma-table outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
        />
      ) : (
        <Input
          type={type}
          value={String(value)}
          onChange={(event) => onChange(event.target.value)}
          className="h-10 rounded-xl border-border bg-white text-sm text-figma-table"
        />
      )}
    </label>
  );
}

function BlockEditor({
  block,
  onChange,
}: {
  block: EmailBlock;
  onChange: (block: EmailBlock) => void;
}) {
  switch (block.type) {
    case "hero":
      return (
        <div className="space-y-3">
          <Field
            label="Eyebrow"
            value={block.content.eyebrow}
            onChange={(value) =>
              onChange({
                ...block,
                content: { ...block.content, eyebrow: value },
              })
            }
          />
          <Field
            label="Titulo"
            value={block.content.title}
            multiline
            onChange={(value) =>
              onChange({
                ...block,
                content: { ...block.content, title: value },
              })
            }
          />
          <Field
            label="Body"
            value={block.content.body}
            multiline
            onChange={(value) =>
              onChange({
                ...block,
                content: { ...block.content, body: value },
              })
            }
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label="CTA label"
              value={block.content.ctaLabel}
              onChange={(value) =>
                onChange({
                  ...block,
                  content: { ...block.content, ctaLabel: value },
                })
              }
            />
            <Field
              label="CTA url"
              value={block.content.ctaUrl}
              onChange={(value) =>
                onChange({
                  ...block,
                  content: { ...block.content, ctaUrl: value },
                })
              }
            />
          </div>
        </div>
      );
    case "texto":
      return (
        <div className="space-y-3">
          <Field
            label="Titulo"
            value={block.content.title}
            onChange={(value) =>
              onChange({
                ...block,
                content: { ...block.content, title: value },
              })
            }
          />
          <Field
            label="Texto"
            value={block.content.body}
            multiline
            onChange={(value) =>
              onChange({
                ...block,
                content: { ...block.content, body: value },
              })
            }
          />
        </div>
      );
    case "imagen":
      return (
        <div className="space-y-3">
          <Field
            label="URL imagen"
            value={block.content.imageUrl}
            onChange={(value) =>
              onChange({
                ...block,
                content: { ...block.content, imageUrl: value },
              })
            }
          />
          <Field
            label="Alt"
            value={block.content.alt}
            onChange={(value) =>
              onChange({
                ...block,
                content: { ...block.content, alt: value },
              })
            }
          />
          <Field
            label="Caption"
            value={block.content.caption}
            multiline
            onChange={(value) =>
              onChange({
                ...block,
                content: { ...block.content, caption: value },
              })
            }
          />
        </div>
      );
    case "cta":
      return (
        <div className="space-y-3">
          <Field
            label="Titulo"
            value={block.content.title}
            onChange={(value) =>
              onChange({
                ...block,
                content: { ...block.content, title: value },
              })
            }
          />
          <Field
            label="Texto"
            value={block.content.body}
            multiline
            onChange={(value) =>
              onChange({
                ...block,
                content: { ...block.content, body: value },
              })
            }
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label="Boton"
              value={block.content.buttonLabel}
              onChange={(value) =>
                onChange({
                  ...block,
                  content: { ...block.content, buttonLabel: value },
                })
              }
            />
            <Field
              label="URL boton"
              value={block.content.buttonUrl}
              onChange={(value) =>
                onChange({
                  ...block,
                  content: { ...block.content, buttonUrl: value },
                })
              }
            />
          </div>
        </div>
      );
    case "separador":
      return (
        <Field
          label="Etiqueta"
          value={block.content.label}
          onChange={(value) =>
            onChange({
              ...block,
              content: { ...block.content, label: value },
            })
          }
        />
      );
    case "dosColumnas":
      return (
        <div className="space-y-3">
          <Field
            label="Titulo columna izquierda"
            value={block.content.leftTitle}
            onChange={(value) =>
              onChange({
                ...block,
                content: { ...block.content, leftTitle: value },
              })
            }
          />
          <Field
            label="Texto izquierda"
            value={block.content.leftBody}
            multiline
            onChange={(value) =>
              onChange({
                ...block,
                content: { ...block.content, leftBody: value },
              })
            }
          />
          <Field
            label="Titulo columna derecha"
            value={block.content.rightTitle}
            onChange={(value) =>
              onChange({
                ...block,
                content: { ...block.content, rightTitle: value },
              })
            }
          />
          <Field
            label="Texto derecha"
            value={block.content.rightBody}
            multiline
            onChange={(value) =>
              onChange({
                ...block,
                content: { ...block.content, rightBody: value },
              })
            }
          />
        </div>
      );
    case "firma":
      return (
        <div className="space-y-3">
          <Field
            label="Nombre"
            value={block.content.name}
            onChange={(value) =>
              onChange({
                ...block,
                content: { ...block.content, name: value },
              })
            }
          />
          <Field
            label="Cargo"
            value={block.content.role}
            onChange={(value) =>
              onChange({
                ...block,
                content: { ...block.content, role: value },
              })
            }
          />
          <Field
            label="Empresa"
            value={block.content.company}
            onChange={(value) =>
              onChange({
                ...block,
                content: { ...block.content, company: value },
              })
            }
          />
          <Field
            label="Nota"
            value={block.content.note}
            multiline
            onChange={(value) =>
              onChange({
                ...block,
                content: { ...block.content, note: value },
              })
            }
          />
        </div>
      );
    case "footer":
      return (
        <div className="space-y-3">
          <Field
            label="Linea empresa"
            value={block.content.companyLine}
            onChange={(value) =>
              onChange({
                ...block,
                content: { ...block.content, companyLine: value },
              })
            }
          />
          <Field
            label="Direccion"
            value={block.content.address}
            onChange={(value) =>
              onChange({
                ...block,
                content: { ...block.content, address: value },
              })
            }
          />
          <Field
            label="Legal"
            value={block.content.legal}
            multiline
            onChange={(value) =>
              onChange({
                ...block,
                content: { ...block.content, legal: value },
              })
            }
          />
        </div>
      );
    default: {
      const exhaustiveCheck: never = block;
      return exhaustiveCheck;
    }
  }
}

export function EmailTemplateSettingsCard({
  activeTemplate,
  onDocumentMetaChange,
  onTemplateMetaChange,
  onThemeChange,
}: Pick<
  EmailInspectorPaneProps,
  "activeTemplate" | "onDocumentMetaChange" | "onTemplateMetaChange" | "onThemeChange"
>) {
  return (
    <Card className="border-border/80 bg-card py-0 shadow-none ring-0">
      <CardHeader className="border-b border-border/70 bg-[#faf6ee] py-4">
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-figma-placeholder">
            Inspector
          </p>
          <CardTitle className="font-display text-lg text-figma-table">
            Ajustes generales
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        <Field
          label="Nombre interno"
          value={activeTemplate.titulo}
          onChange={(value) => onTemplateMetaChange({ titulo: value })}
        />
        <Field
          label="Descripcion"
          value={activeTemplate.descripcion}
          multiline
          onChange={(value) => onTemplateMetaChange({ descripcion: value })}
        />
        <Field
          label="Asunto interno"
          value={activeTemplate.document.title}
          onChange={(value) => onDocumentMetaChange({ title: value })}
        />
        <Field
          label="Preheader"
          value={activeTemplate.document.preheader}
          multiline
          onChange={(value) => onDocumentMetaChange({ preheader: value })}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Accent"
            value={activeTemplate.document.theme.accentColor}
            type="color"
            onChange={(value) => onThemeChange({ accentColor: value })}
          />
          <Field
            label="Surface"
            value={activeTemplate.document.theme.surfaceColor}
            type="color"
            onChange={(value) => onThemeChange({ surfaceColor: value })}
          />
          <Field
            label="Texto"
            value={activeTemplate.document.theme.textColor}
            type="color"
            onChange={(value) => onThemeChange({ textColor: value })}
          />
          <Field
            label="Fondo"
            value={activeTemplate.document.theme.backgroundColor}
            type="color"
            onChange={(value) => onThemeChange({ backgroundColor: value })}
          />
          <Field
            label="Heading"
            value={activeTemplate.document.theme.headingColor}
            type="color"
            onChange={(value) => onThemeChange({ headingColor: value })}
          />
          <Field
            label="Ancho"
            value={activeTemplate.document.theme.width}
            type="number"
            onChange={(value) =>
              onThemeChange({
                width: Number(value) || activeTemplate.document.theme.width,
              })
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}

export function EmailBlockInspectorCard({
  activeBlock,
  onBlockChange,
}: Pick<EmailInspectorPaneProps, "activeBlock" | "onBlockChange">) {
  return (
    <Card className="border-border/80 bg-card py-0 shadow-none ring-0">
      <CardHeader className="border-b border-border/70 py-4">
        <CardTitle className="font-display text-base text-figma-table">
          Bloque activo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        {activeBlock ? (
          <>
            <p className="text-xs text-figma-placeholder">
              Editando bloque <span className="font-medium text-figma-table">{activeBlock.type}</span>
            </p>
            <BlockEditor block={activeBlock} onChange={onBlockChange} />
          </>
        ) : (
          <p className="text-sm text-figma-placeholder">
            Selecciona un bloque del canvas para editar contenido y propiedades.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function EmailVariablesCard({
  variableDefinitions,
}: Pick<EmailInspectorPaneProps, "variableDefinitions">) {
  return (
    <Card className="border-border/80 bg-card py-0 shadow-none ring-0">
      <CardHeader className="border-b border-border/70 py-4">
        <CardTitle className="font-display text-base text-figma-table">
          Variables disponibles
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 p-4">
        {variableDefinitions.map((variable) => (
          <div
            key={variable.key}
            className="rounded-2xl border border-border/70 bg-[#fbfaf7] p-3"
          >
            <p className="font-mono text-[11px] text-figma-table">{variable.key}</p>
            <p className="mt-1 text-xs text-figma-placeholder">{variable.label}</p>
            <p className="mt-1 text-xs text-figma-table">Ejemplo {variable.example}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function EmailVersionsCard({
  activeTemplate,
}: Pick<EmailInspectorPaneProps, "activeTemplate">) {
  return (
    <Card className="border-border/80 bg-card py-0 shadow-none ring-0">
      <CardHeader className="border-b border-border/70 py-4">
        <div className="flex items-center gap-2">
          <History className="size-4 text-figma-placeholder" />
          <CardTitle className="font-display text-base text-figma-table">
            Versiones
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 p-4">
        {[...activeTemplate.versions].reverse().map((version) => (
          <div
            key={version.id}
            className="rounded-2xl border border-border/70 bg-[#fbfaf7] p-3"
          >
            <p className="text-sm font-medium text-figma-table">{version.label}</p>
            <p className="text-xs text-figma-placeholder">
              {new Date(version.createdAt).toLocaleString("es-ES")}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function EmailInspectorPane({
  activeBlock,
  activeTemplate,
  variableDefinitions,
  onBlockChange,
  onDocumentMetaChange,
  onTemplateMetaChange,
  onThemeChange,
}: EmailInspectorPaneProps) {
  return (
    <div className="space-y-4">
      <EmailTemplateSettingsCard
        activeTemplate={activeTemplate}
        onDocumentMetaChange={onDocumentMetaChange}
        onTemplateMetaChange={onTemplateMetaChange}
        onThemeChange={onThemeChange}
      />
      <EmailBlockInspectorCard
        activeBlock={activeBlock}
        onBlockChange={onBlockChange}
      />
      <EmailVariablesCard variableDefinitions={variableDefinitions} />
      <EmailVersionsCard activeTemplate={activeTemplate} />
    </div>
  );
}
