"use client";

import { Copy, Monitor, Smartphone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EmailViewport } from "@/lib/email-builder/types";
import { cn } from "@/lib/utils";

type EmailPreviewPaneProps = {
  copied: boolean;
  html: string;
  selectedClientName: string;
  selectedRecipients: number;
  viewport: EmailViewport;
  onCopyHtml: () => void;
  onViewportChange: (viewport: EmailViewport) => void;
};

export function EmailPreviewPane({
  copied,
  html,
  selectedClientName,
  selectedRecipients,
  viewport,
  onCopyHtml,
  onViewportChange,
}: EmailPreviewPaneProps) {
  const frameWidth = viewport === "desktop" ? "w-full" : "mx-auto w-[380px] max-w-full";

  return (
    <Card className="overflow-hidden border-border/80 bg-card py-0 shadow-none ring-0">
      <CardHeader className="border-b border-border/70 bg-[#faf6ee] py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-figma-placeholder">
              Preview HTML
            </p>
            <CardTitle className="font-display text-lg text-figma-table">
              Vista final del email
            </CardTitle>
            <p className="text-xs text-figma-placeholder">
              Simulando envio para {selectedClientName}. Destinatarios {selectedRecipients}.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant={viewport === "desktop" ? "default" : "outline"}
              onClick={() => onViewportChange("desktop")}
              className={cn(
                "h-8 gap-1.5 rounded-full px-3 text-xs",
                viewport === "desktop"
                  ? "bg-figma-table text-white hover:bg-figma-table/90"
                  : "border-border bg-transparent text-figma-table hover:bg-muted",
              )}
            >
              <Monitor className="size-3.5" />
              Desktop
            </Button>
            <Button
              type="button"
              size="sm"
              variant={viewport === "mobile" ? "default" : "outline"}
              onClick={() => onViewportChange("mobile")}
              className={cn(
                "h-8 gap-1.5 rounded-full px-3 text-xs",
                viewport === "mobile"
                  ? "bg-figma-table text-white hover:bg-figma-table/90"
                  : "border-border bg-transparent text-figma-table hover:bg-muted",
              )}
            >
              <Smartphone className="size-3.5" />
              Movil
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={onCopyHtml}
              className="h-8 gap-1.5 rounded-full border-border bg-transparent px-3 text-xs text-figma-table hover:bg-muted"
            >
              <Copy className="size-3.5" />
              {copied ? "HTML copiado" : "Copiar HTML"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 bg-[#f5efe4] p-4">
        <div
          className={cn(
            "overflow-hidden rounded-[1.5rem] border border-border/80 bg-white shadow-[0_18px_40px_rgba(20,20,20,0.08)]",
            frameWidth,
          )}
        >
          <iframe
            title="Preview del email"
            srcDoc={html}
            className="h-[720px] w-full bg-white"
          />
        </div>
        <div className="rounded-[1.1rem] border border-border/70 bg-white p-3">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-figma-placeholder">
            Exportacion
          </p>
          <textarea
            readOnly
            value={html}
            className="mt-2 h-40 w-full resize-none rounded-xl border border-border bg-[#fbfaf7] p-3 font-mono text-[11px] leading-5 text-figma-table outline-none"
          />
        </div>
      </CardContent>
    </Card>
  );
}
