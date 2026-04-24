import { ArrowUpRight, Search, SlidersHorizontal, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getInterestingNews, newsItemsMock, type NewsItem } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const priorityClass: Record<NewsItem["prioridad"], string> = {
  Alta: "bg-kpi-green",
  Media: "bg-kpi-orange",
  Baja: "bg-kpi-grey",
};

function NewsTable({
  items,
  emphasizeImpact,
}: {
  items: NewsItem[];
  emphasizeImpact?: boolean;
}) {
  return (
    <div className="mt-5 min-h-0 flex-1 overflow-auto rounded-none border border-border/80">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-figma-table/15 bg-figma-shell/50 hover:bg-transparent">
            <TableHead className="sticky top-0 z-10 bg-figma-shell pb-2 text-xs font-semibold text-figma-table">
              Titular
            </TableHead>
            <TableHead className="sticky top-0 z-10 bg-figma-shell pb-2 text-xs font-semibold text-figma-table">
              Fuente
            </TableHead>
            <TableHead className="sticky top-0 z-10 bg-figma-shell pb-2 text-xs font-semibold text-figma-table">
              Sector
            </TableHead>
            <TableHead className="sticky top-0 z-10 bg-figma-shell pb-2 text-xs font-semibold text-figma-table">
              Publicada
            </TableHead>
            <TableHead className="sticky top-0 z-10 bg-figma-shell pb-2 text-xs font-semibold text-figma-table">
              Prioridad
            </TableHead>
            <TableHead className="sticky top-0 z-10 bg-figma-shell pb-2 text-xs font-semibold text-figma-table">
              {emphasizeImpact ? "Clientes impactados" : "Resumen"}
            </TableHead>
            <TableHead className="sticky top-0 z-10 bg-figma-shell pb-2 text-right text-xs font-semibold text-figma-table">
              Acción
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} className="border-border/60 hover:bg-muted/40">
              <TableCell className="max-w-[280px] py-3 align-top">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-figma-table">
                    {item.titular}
                  </p>
                  <p className="text-xs leading-relaxed text-figma-placeholder">
                    {item.resumen}
                  </p>
                </div>
              </TableCell>
              <TableCell className="py-3 text-[0.82rem] text-figma-table">
                {item.fuente}
              </TableCell>
              <TableCell className="py-3 text-[0.82rem] text-figma-table">
                {item.sector}
              </TableCell>
              <TableCell className="py-3 text-[0.82rem] text-figma-table">
                {item.publicada}
              </TableCell>
              <TableCell className="py-3">
                <Badge
                  variant="outline"
                  className="gap-2 rounded-full border-border/70 bg-figma-shell/60 px-2.5 py-1 text-[0.68rem] uppercase tracking-[0.14em] text-figma-table"
                >
                  <span
                    className={cn("size-2 rounded-full", priorityClass[item.prioridad])}
                  />
                  {item.prioridad}
                </Badge>
              </TableCell>
              <TableCell className="py-3 text-[0.82rem] text-figma-placeholder">
                {emphasizeImpact ? item.clientesImpactados : item.resumen}
              </TableCell>
              <TableCell className="py-3 text-right">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 gap-2 border-border px-3 text-[0.78rem] font-medium text-figma-table hover:bg-muted"
                >
                  Abrir
                  <ArrowUpRight className="size-3.5" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function NewsHeader({
  eyebrow,
  title,
  description,
  accentLabel,
}: {
  eyebrow: string;
  title: string;
  description: string;
  accentLabel: string;
}) {
  return (
    <div className="shrink-0 space-y-2 border-b border-border/70 pb-5">
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-figma-placeholder">
          {eyebrow}
        </p>
        <Badge
          variant="outline"
          className="rounded-full border-border/70 bg-figma-shell/60 px-2.5 py-1 text-[0.66rem] uppercase tracking-[0.14em] text-figma-accent"
        >
          {accentLabel}
        </Badge>
      </div>
      <h1 className="font-display text-2xl font-semibold tracking-tight text-figma-table md:text-3xl">
        {title}
      </h1>
      <p className="max-w-2xl text-sm leading-relaxed text-figma-placeholder">
        {description}
      </p>
    </div>
  );
}

function NewsToolbar({ highlightLabel }: { highlightLabel: string }) {
  return (
    <div className="mt-6 shrink-0 flex flex-col gap-4">
      <div className="flex w-full min-w-0 overflow-hidden rounded-md border border-border bg-card">
        <Input
          placeholder="Buscar noticia, empresa o sector…"
          className="h-10 flex-1 rounded-none border-0 bg-transparent px-3.5 text-sm shadow-none placeholder:text-figma-placeholder focus-visible:ring-0"
        />
        <Button
          type="button"
          size="lg"
          className="h-10 shrink-0 gap-2 rounded-none border-0 border-l border-border bg-figma-table px-4 text-sm font-medium text-white hover:bg-figma-table/90"
        >
          <Search className="size-3.5" />
          Buscar
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          size="lg"
          className="h-9 gap-2 border-0 bg-figma-table px-3 text-sm font-medium text-white hover:bg-figma-table/90"
        >
          <SlidersHorizontal className="size-3.5" />
          Limpiar filtros
        </Button>
        <Button
          type="button"
          size="lg"
          variant="outline"
          className="h-9 gap-2 border-border bg-transparent px-3 text-sm font-medium text-figma-table hover:bg-muted"
        >
          <SlidersHorizontal className="size-3.5" />
          Filtros
        </Button>
        <Button
          type="button"
          size="lg"
          variant="outline"
          className="h-9 gap-2 border-figma-accent/40 bg-transparent px-3 text-sm font-medium text-figma-accent hover:bg-figma-shell"
        >
          <Sparkles className="size-3.5" />
          {highlightLabel}
        </Button>
      </div>
    </div>
  );
}

export function NewsView() {
  return (
    <div className="flex min-h-full flex-col">
      <NewsHeader
        eyebrow="Noticias"
        title="Apartado de noticias"
        description="Monitoriza novedades relevantes para ajustar mensajes, reactivar cuentas y detectar oportunidades antes del siguiente contacto."
        accentLabel="Contexto comercial"
      />
      <NewsToolbar highlightLabel="Recientes" />
      <NewsTable items={newsItemsMock} />
    </div>
  );
}

export function InterestingNewsView() {
  const interestingNews = getInterestingNews();

  return (
    <div className="flex min-h-full flex-col">
      <NewsHeader
        eyebrow="Funciones IA"
        title="Noticias interesantes"
        description="Vista priorizada con señales de mayor impacto comercial para ordenar el outreach y decidir qué cuentas mover primero."
        accentLabel="Prioridad alta"
      />
      <NewsToolbar highlightLabel="Estado de cliente" />
      <NewsTable items={interestingNews} emphasizeImpact />
    </div>
  );
}
