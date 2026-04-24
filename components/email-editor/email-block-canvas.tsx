"use client";

import {
  ArrowDown,
  ArrowUp,
  Copy,
  GripVertical,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { EmailBlock, EmailDocument } from "@/lib/email-builder/types";
import { cn } from "@/lib/utils";

type EmailBlockCanvasProps = {
  document: EmailDocument;
  draggingBlockId: string | null;
  selectedBlockId: string | null;
  selectedRecipients: number;
  onBlockChange: (block: EmailBlock) => void;
  onDropBlock: (sourceId: string, destinationId: string) => void;
  onDuplicateBlock: (blockId: string) => void;
  onMoveBlock: (blockId: string, offset: -1 | 1) => void;
  onRemoveBlock: (blockId: string) => void;
  onSelectBlock: (blockId: string) => void;
  setDraggingBlockId: (blockId: string | null) => void;
};

function CanvasInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <Input
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      className="h-9 rounded-xl border-border/80 bg-white/80 text-sm text-figma-table"
    />
  );
}

function CanvasTextarea({
  value,
  onChange,
  rows = 3,
}: {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <textarea
      rows={rows}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-xl border border-border/80 bg-white/80 px-3 py-2 text-sm leading-6 text-figma-table outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
    />
  );
}

function BlockBody({
  block,
  onChange,
}: {
  block: EmailBlock;
  onChange: (block: EmailBlock) => void;
}) {
  switch (block.type) {
    case "hero":
      return (
        <div className="space-y-3 rounded-[1.4rem] bg-[#fff7eb] p-5">
          <CanvasInput
            value={block.content.eyebrow}
            onChange={(value) =>
              onChange({
                ...block,
                content: { ...block.content, eyebrow: value },
              })
            }
          />
          <CanvasTextarea
            value={block.content.title}
            rows={3}
            onChange={(value) =>
              onChange({
                ...block,
                content: { ...block.content, title: value },
              })
            }
          />
          <CanvasTextarea
            value={block.content.body}
            rows={4}
            onChange={(value) =>
              onChange({
                ...block,
                content: { ...block.content, body: value },
              })
            }
          />
          <div className="grid gap-2 md:grid-cols-[1fr_1fr]">
            <CanvasInput
              value={block.content.ctaLabel}
              placeholder="CTA"
              onChange={(value) =>
                onChange({
                  ...block,
                  content: { ...block.content, ctaLabel: value },
                })
              }
            />
            <CanvasInput
              value={block.content.ctaUrl}
              placeholder="https://..."
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
        <div className="space-y-3 rounded-[1.4rem] bg-white p-5">
          <CanvasInput
            value={block.content.title}
            onChange={(value) =>
              onChange({
                ...block,
                content: { ...block.content, title: value },
              })
            }
          />
          <CanvasTextarea
            value={block.content.body}
            rows={5}
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
        <div className="space-y-3 rounded-[1.4rem] bg-white p-5">
          <div
            role="img"
            aria-label={block.content.alt}
            className="h-48 w-full rounded-[1.2rem] bg-cover bg-center"
            style={{ backgroundImage: `url(${block.content.imageUrl})` }}
          />
          <CanvasInput
            value={block.content.imageUrl}
            onChange={(value) =>
              onChange({
                ...block,
                content: { ...block.content, imageUrl: value },
              })
            }
          />
          <CanvasInput
            value={block.content.alt}
            onChange={(value) =>
              onChange({
                ...block,
                content: { ...block.content, alt: value },
              })
            }
          />
          <CanvasTextarea
            value={block.content.caption}
            rows={2}
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
        <div className="space-y-3 rounded-[1.4rem] bg-[#f5efe1] p-5">
          <CanvasInput
            value={block.content.title}
            onChange={(value) =>
              onChange({
                ...block,
                content: { ...block.content, title: value },
              })
            }
          />
          <CanvasTextarea
            value={block.content.body}
            rows={3}
            onChange={(value) =>
              onChange({
                ...block,
                content: { ...block.content, body: value },
              })
            }
          />
          <div className="grid gap-2 md:grid-cols-[1fr_1fr]">
            <CanvasInput
              value={block.content.buttonLabel}
              onChange={(value) =>
                onChange({
                  ...block,
                  content: { ...block.content, buttonLabel: value },
                })
              }
            />
            <CanvasInput
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
        <div className="rounded-[1.4rem] bg-white p-5">
          <CanvasInput
            value={block.content.label}
            onChange={(value) =>
              onChange({
                ...block,
                content: { ...block.content, label: value },
              })
            }
          />
        </div>
      );
    case "dosColumnas":
      return (
        <div className="grid gap-3 rounded-[1.4rem] bg-[#fbf7ef] p-5 md:grid-cols-2">
          <div className="space-y-2">
            <CanvasInput
              value={block.content.leftTitle}
              onChange={(value) =>
                onChange({
                  ...block,
                  content: { ...block.content, leftTitle: value },
                })
              }
            />
            <CanvasTextarea
              value={block.content.leftBody}
              rows={4}
              onChange={(value) =>
                onChange({
                  ...block,
                  content: { ...block.content, leftBody: value },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <CanvasInput
              value={block.content.rightTitle}
              onChange={(value) =>
                onChange({
                  ...block,
                  content: { ...block.content, rightTitle: value },
                })
              }
            />
            <CanvasTextarea
              value={block.content.rightBody}
              rows={4}
              onChange={(value) =>
                onChange({
                  ...block,
                  content: { ...block.content, rightBody: value },
                })
              }
            />
          </div>
        </div>
      );
    case "firma":
      return (
        <div className="space-y-3 rounded-[1.4rem] bg-white p-5">
          <CanvasInput
            value={block.content.name}
            onChange={(value) =>
              onChange({
                ...block,
                content: { ...block.content, name: value },
              })
            }
          />
          <div className="grid gap-2 md:grid-cols-2">
            <CanvasInput
              value={block.content.role}
              onChange={(value) =>
                onChange({
                  ...block,
                  content: { ...block.content, role: value },
                })
              }
            />
            <CanvasInput
              value={block.content.company}
              onChange={(value) =>
                onChange({
                  ...block,
                  content: { ...block.content, company: value },
                })
              }
            />
          </div>
          <CanvasTextarea
            value={block.content.note}
            rows={3}
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
        <div className="space-y-3 rounded-[1.4rem] bg-white p-5">
          <CanvasInput
            value={block.content.companyLine}
            onChange={(value) =>
              onChange({
                ...block,
                content: { ...block.content, companyLine: value },
              })
            }
          />
          <CanvasInput
            value={block.content.address}
            onChange={(value) =>
              onChange({
                ...block,
                content: { ...block.content, address: value },
              })
            }
          />
          <CanvasTextarea
            value={block.content.legal}
            rows={3}
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

export function EmailBlockCanvas({
  document,
  draggingBlockId,
  selectedBlockId,
  selectedRecipients,
  onBlockChange,
  onDropBlock,
  onDuplicateBlock,
  onMoveBlock,
  onRemoveBlock,
  onSelectBlock,
  setDraggingBlockId,
}: EmailBlockCanvasProps) {
  return (
    <Card className="border-border/80 bg-card py-0 shadow-none ring-0">
      <CardHeader className="border-b border-border/70 bg-[#faf6ee] py-4">
        <div className="space-y-1">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-figma-placeholder">
            Canvas
          </p>
          <CardTitle className="font-display text-lg text-figma-table">
            Maquetador visual de la plantilla
          </CardTitle>
          <p className="text-xs text-figma-placeholder">
            {document.blocks.length} bloques activos. Preview configurada para {selectedRecipients} destinatarios.
          </p>
        </div>
      </CardHeader>
      <CardContent className="bg-[#f5efe4] p-4">
        <div className="rounded-[2rem] border border-border/70 bg-white p-4 shadow-[0_16px_36px_rgba(20,20,20,0.08)]">
          <div className="mb-4 rounded-[1.4rem] border border-border/70 bg-[#fbfaf7] p-4">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-figma-placeholder">
              Preheader
            </p>
            <p className="mt-1 text-sm text-figma-table">{document.preheader}</p>
          </div>
          <div className="space-y-3">
            {document.blocks.map((block, index) => {
              const isSelected = block.id === selectedBlockId;
              const isDragging = block.id === draggingBlockId;

              return (
                <div
                  key={block.id}
                  draggable
                  onDragStart={() => setDraggingBlockId(block.id)}
                  onDragEnd={() => setDraggingBlockId(null)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => {
                    if (draggingBlockId) {
                      onDropBlock(draggingBlockId, block.id);
                    }
                    setDraggingBlockId(null);
                  }}
                  className={cn(
                    "rounded-[1.5rem] border bg-[#fcfaf6] transition-all",
                    isSelected
                      ? "border-figma-accent shadow-[0_0_0_2px_rgba(139,105,20,0.18)]"
                      : "border-border/70",
                    isDragging && "opacity-50",
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 px-4 py-3">
                    <button
                      type="button"
                      onClick={() => onSelectBlock(block.id)}
                      className="flex min-w-0 items-center gap-3 text-left"
                    >
                      <span className="rounded-full border border-border/80 bg-white p-2 text-figma-placeholder">
                        <GripVertical className="size-3.5" />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-figma-table">
                          {index + 1}. {block.type}
                        </p>
                        <p className="text-xs text-figma-placeholder">
                          Haz click para editar en el inspector.
                        </p>
                      </div>
                    </button>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => onMoveBlock(block.id, -1)}
                        className="text-figma-table hover:bg-muted"
                      >
                        <ArrowUp className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => onMoveBlock(block.id, 1)}
                        className="text-figma-table hover:bg-muted"
                      >
                        <ArrowDown className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => onDuplicateBlock(block.id)}
                        className="text-figma-table hover:bg-muted"
                      >
                        <Copy className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => onRemoveBlock(block.id)}
                        className="text-figma-table hover:bg-muted"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                  <div
                    className="p-4"
                    onClick={() => onSelectBlock(block.id)}
                    role="presentation"
                  >
                    <BlockBody block={block} onChange={onBlockChange} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
