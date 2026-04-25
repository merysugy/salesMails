"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { createCliente, getEstadosCliente, type EstadoClienteAPI } from "@/lib/api";

type FormState = {
  nombre: string;
  email: string;
  ciudad: string;
  direccion: string;
  telefono: string;
  tipo: "persona" | "empresa";
  nif: string;
};

function FormField({
  label,
  children,
}: Readonly<{ label: string; children: React.ReactNode }>) {
  return (
    <div className="space-y-3">
      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-figma-placeholder">
        {label}
      </p>
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-2xl border border-border/80 bg-figma-shell/55 px-4 py-3 text-sm font-medium text-figma-table shadow-sm outline-none focus:border-figma-accent/60 focus:ring-0";

export function NuevoClienteView() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [estados, setEstados] = useState<EstadoClienteAPI[]>([]);
  const [estadoCliente, setEstadoCliente] = useState<number | "">("");
  const [form, setForm] = useState<FormState>({
    nombre: "",
    email: "",
    ciudad: "",
    direccion: "",
    telefono: "",
    tipo: "persona",
    nif: "",
  });

  useEffect(() => {
    getEstadosCliente().then((data) => {
      setEstados(data);
      setEstadoCliente(data[0]?.id ?? "");
    });
  }, []);

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();

    if (!form.nombre.trim()) {
      alert("El nombre es obligatorio");
      return;
    }

    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      alert("El formato del email no es válido");
      return;
    }

    if (!estadoCliente) {
      alert("El estado del cliente es obligatorio");
      return;
    }

    setSaving(true);
    try {
      const created = await createCliente({
        nombre: form.nombre.trim(),
        email: form.email.trim() || null,
        ciudad: form.ciudad.trim() || null,
        direccion: form.direccion.trim() || null,
        telefono: form.telefono.trim() || null,
        tipo: form.tipo,
        nif: form.nif.trim() || null,
        estado_cliente: estadoCliente,
      });
      router.push(`/dashboard/clientes/${created.id}`);
    } catch {
      alert("Error al crear el cliente");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col overflow-auto pr-1">
      <div className="flex justify-end">
        <Link href="/dashboard">
          <Button
            type="button"
            variant="outline"
            className="h-9 gap-2 border-border px-3 text-sm font-medium text-figma-table hover:bg-muted"
          >
            <ArrowLeft className="size-3.5" />
            Volver al listado
          </Button>
        </Link>
      </div>

      <div className="mt-6">
        <div className="border-b border-border/70 pb-6">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-figma-placeholder">
            Nuevo cliente
          </p>
          <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-figma-table md:text-3xl">
            Crear cliente
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-figma-placeholder">
            Rellena los datos del nuevo contacto. Solo el nombre es obligatorio.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <FormField label="Nombre *">
              <Input
                value={form.nombre}
                onChange={set("nombre")}
                placeholder="Nombre completo o razón social"
                className={cn(inputClass, "h-auto")}
              />
            </FormField>

            <FormField label="Email">
              <Input
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="correo@ejemplo.com"
                className={cn(inputClass, "h-auto")}
              />
            </FormField>

            <FormField label="Ciudad">
              <Input
                value={form.ciudad}
                onChange={set("ciudad")}
                placeholder="Barcelona"
                className={cn(inputClass, "h-auto")}
              />
            </FormField>

            <FormField label="Teléfono">
              <Input
                value={form.telefono}
                onChange={set("telefono")}
                placeholder="+34 600 000 000"
                className={cn(inputClass, "h-auto")}
              />
            </FormField>

            <FormField label="Dirección">
              <Input
                value={form.direccion}
                onChange={set("direccion")}
                placeholder="Calle, número, piso"
                className={cn(inputClass, "h-auto")}
              />
            </FormField>

            <FormField label="NIF / CIF">
              <Input
                value={form.nif}
                onChange={set("nif")}
                placeholder="12345678A"
                className={cn(inputClass, "h-auto")}
              />
            </FormField>

            <FormField label="Tipo">
              <select
                value={form.tipo}
                onChange={set("tipo")}
                className={inputClass}
              >
                <option value="persona">Persona</option>
                <option value="empresa">Empresa</option>
              </select>
            </FormField>

            <FormField label="Estado *">
              <select
                value={estadoCliente}
                onChange={(e) => setEstadoCliente(Number(e.target.value))}
                className={inputClass}
              >
                {estados.map((estado) => (
                  <option key={estado.id} value={estado.id}>
                    {estado.nombre}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <div className="mt-8 flex gap-3">
            <Button
              type="submit"
              disabled={saving}
              className="h-9 bg-figma-table px-4 text-sm font-medium text-white hover:bg-figma-table/90"
            >
              {saving ? "Creando…" : "Crear cliente"}
            </Button>
            <Link href="/dashboard">
              <Button
                type="button"
                variant="outline"
                disabled={saving}
                className="h-9 border-border px-4 text-sm font-medium text-figma-table hover:bg-muted"
              >
                Cancelar
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
