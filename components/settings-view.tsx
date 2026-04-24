"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SettingsView() {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-lg flex-col overflow-auto pr-1">
      <div className="mb-6 shrink-0 border-b border-border/70 pb-5">
        <h1 className="font-display text-xl font-semibold tracking-tight text-figma-table md:text-2xl">
          Ajustes
        </h1>
        <p className="mt-1.5 text-sm text-figma-placeholder">
          Actualiza tus datos de cuenta. Los cambios son de demostración.
        </p>
      </div>

      <form
        className="flex flex-col gap-5 pb-2"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="space-y-2">
          <Label
            htmlFor="nombre"
            className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-figma-placeholder"
          >
            Nombre visible
          </Label>
          <Input
            id="nombre"
            name="nombre"
            type="text"
            autoComplete="name"
            defaultValue="María"
            className="h-11 rounded-md border-border bg-card px-3.5 text-foreground shadow-none placeholder:text-figma-placeholder/70 focus-visible:ring-2 focus-visible:ring-ring/40"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-figma-placeholder"
          >
            Correo electrónico
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue="maria@salesmails.local"
            className="h-11 rounded-md border-border bg-card px-3.5 text-foreground shadow-none placeholder:text-figma-placeholder/70 focus-visible:ring-2 focus-visible:ring-ring/40"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="organizacion"
            className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-figma-placeholder"
          >
            Organización
          </Label>
          <Input
            id="organizacion"
            name="organizacion"
            type="text"
            autoComplete="organization"
            defaultValue="SalesMails"
            className="h-11 rounded-md border-border bg-card px-3.5 text-foreground shadow-none placeholder:text-figma-placeholder/70 focus-visible:ring-2 focus-visible:ring-ring/40"
          />
        </div>

        <Button
          type="submit"
          className="h-11 w-full border-0 bg-figma-table text-base font-medium text-white shadow-none hover:bg-figma-table/90 sm:w-auto sm:px-8"
        >
          Guardar cambios
        </Button>
      </form>
    </div>
  );
}
