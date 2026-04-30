"use client";

import { ArrowLeft, Mail, MapPin, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getClienteById, updateCliente, deleteCliente, getEstadosCliente, getClienteActividad, type ClienteAPI, type EstadoClienteAPI, type ActividadClienteAPI } from "@/lib/api";

function statusAccent(estado: string): string {
  switch (estado) {
    case "Lead":
      return "bg-kpi-green";
    case "Prospecto":
      return "bg-kpi-beige";
    case "Cliente":
      return "bg-kpi-grey";
    case "Inactivo":
      return "bg-kpi-orange";
    case "Perdido":
      return "bg-red-500";
    default:
      return "bg-kpi-grey";
  }
}

type ClienteDetalle = {
  id: string;
  nombre: string;
  estado: string;
  estadoCliente: number;
  empresa: string;
  localidad: string;
  email: string;
  lugarContacto: string;
  insercion: string;
  ultimoContacto: string;
  emailsEnviados: number;
};

function mapClienteAPI(c: ClienteAPI): ClienteDetalle {
  return {
    id: String(c.id),
    nombre: c.nombre,
    estado: c.estado_cliente_detalle?.nombre ?? "Sin estado",
    estadoCliente: c.estado_cliente,
    empresa: c.tipo === "empresa" ? c.nombre : "",
    localidad: c.ciudad ?? "",
    email: c.email ?? "",
    lugarContacto: c.direccion ?? "",
    insercion: c.fecha_creacion
      ? new Date(c.fecha_creacion).toLocaleDateString("es-ES")
      : "",
    ultimoContacto: "",
    emailsEnviados: c.emails_enviados ?? 0,
  };
}

function Field({
  label,
  value,
  grow,
}: Readonly<{
  label: string;
  value: string | number;
  grow?: boolean;
}>) {
  return (
    <div className={cn("space-y-3", grow && "md:col-span-2 xl:col-span-3")}>
      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-figma-placeholder">
        {label}
      </p>
      <div className="rounded-2xl border border-border/80 bg-figma-shell/55 px-4 py-3 text-sm font-medium text-figma-table shadow-sm">
        {value}
      </div>
    </div>
  );
}

function EditableField({
  label,
  value,
  editing,
  inputValue,
  onChange,
}: Readonly<{
  label: string;
  value: string;
  editing: boolean;
  inputValue: string;
  onChange: (v: string) => void;
}>) {
  if (!editing) return <Field label={label} value={value} />;
  return (
    <div className="space-y-3">
      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-figma-placeholder">
        {label}
      </p>
      <input
        value={inputValue}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-figma-accent/50 bg-figma-shell/55 px-4 py-3 text-sm font-medium text-figma-table shadow-sm outline-none focus:border-figma-accent"
      />
    </div>
  );
}

function EditableSelect({
  label,
  value,
  editing,
  selectValue,
  options,
  onChange,
}: Readonly<{
  label: string;
  value: string;
  editing: boolean;
  selectValue: number;
  options: EstadoClienteAPI[];
  onChange: (v: number) => void;
}>) {
  if (!editing) return <Field label={label} value={value} />;
  return (
    <div className="space-y-3">
      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-figma-placeholder">
        {label}
      </p>
      <select
        value={selectValue}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-2xl border border-figma-accent/50 bg-figma-shell/55 px-4 py-3 text-sm font-medium text-figma-table shadow-sm outline-none focus:border-figma-accent"
      >
        <option value={0} disabled>
          Selecciona estado
        </option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.nombre}
          </option>
        ))}
      </select>
    </div>
  );
}

export function ClientDetailView({ id }: Readonly<{ id: string }>) {
  const router = useRouter();
  const [cliente, setCliente] = useState<ClienteDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [estados, setEstados] = useState<EstadoClienteAPI[]>([]);
  const [actividades, setActividades] = useState<ActividadClienteAPI[]>([]);
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    localidad: "",
    lugarContacto: "",
    estadoCliente: 0,
  });

  const handleSave = async () => {
    if (!cliente) return;
    if (!form.nombre.trim()) {
      alert("El nombre es obligatorio");
      return;
    }
    if (!form.estadoCliente) {
      alert("Selecciona un estado");
      return;
    }
    if (
      form.nombre === cliente.nombre &&
      form.email === cliente.email &&
      form.localidad === cliente.localidad &&
      form.lugarContacto === cliente.lugarContacto &&
      form.estadoCliente === cliente.estadoCliente
    ) {
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      const updated = await updateCliente(cliente.id, {
        nombre: form.nombre.trim(),
        email: form.email.trim() || null,
        ciudad: form.localidad.trim() || null,
        direccion: form.lugarContacto.trim() || null,
        estado_cliente: form.estadoCliente,
      });
      const mapped = mapClienteAPI(updated);
      setCliente(mapped);
      setForm({
        nombre: mapped.nombre,
        email: mapped.email,
        localidad: mapped.localidad,
        lugarContacto: mapped.lugarContacto,
        estadoCliente: mapped.estadoCliente,
      });
      setEditing(false);
      getClienteActividad(cliente.id).then(setActividades).catch(() => {});
      alert("Cliente actualizado correctamente");
    } catch {
      alert("Error al guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (!cliente) return;
    setForm({
      nombre: cliente.nombre,
      email: cliente.email,
      localidad: cliente.localidad,
      lugarContacto: cliente.lugarContacto,
      estadoCliente: cliente.estadoCliente,
    });
    setEditing(false);
  };

  const handleDelete = async () => {
    if (!cliente) return;
    if (!confirm("¿Seguro que quieres eliminar este cliente?")) return;
    setDeleting(true);
    try {
      await deleteCliente(cliente.id);
      router.push("/dashboard");
    } catch {
      alert("Error al eliminar el cliente");
      setDeleting(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    setError(false);
    Promise.all([getClienteById(id), getEstadosCliente(), getClienteActividad(id)])
      .then(([clienteData, estadosData, actividadesData]) => {
        const mapped = mapClienteAPI(clienteData);
        setCliente(mapped);
        setEstados(estadosData);
        setActividades(actividadesData);
        setForm({
          nombre: mapped.nombre,
          email: mapped.email,
          localidad: mapped.localidad,
          lugarContacto: mapped.lugarContacto,
          estadoCliente: mapped.estadoCliente,
        });
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.message.includes("404")) {
          router.push("/dashboard");
          return;
        }
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <p className="text-sm text-figma-placeholder">Cargando cliente…</p>
      </div>
    );
  }

  if (error || !cliente) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-4">
        <p className="text-sm text-red-500">
          No se pudo cargar el cliente. Comprueba tu sesión o vuelve al listado.
        </p>
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
    );
  }

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
        <div className="flex flex-col gap-4 border-b border-border/70 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-figma-placeholder">
              Ficha de cliente
            </p>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-figma-table md:text-3xl">
              {editing ? form.nombre : cliente.nombre}
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-figma-placeholder">
              Resumen del lead, contexto comercial y últimos puntos de contacto.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Badge
              className="gap-2 rounded-full border border-border/70 bg-figma-shell/70 px-3 py-1.5 text-figma-table"
              variant="outline"
            >
              <span
                className={cn(
                  "size-2 rounded-full",
                  statusAccent(cliente.estado),
                )}
              />
              {cliente.estado}
            </Badge>
            <Badge
              className="rounded-full border border-border/70 bg-figma-shell/70 px-3 py-1.5 text-figma-table"
              variant="outline"
            >
              ID {cliente.id}
            </Badge>
            {editing ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={saving}
                  onClick={handleCancel}
                  className="h-8 border-border px-3 text-xs font-medium text-figma-table hover:bg-muted"
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={saving}
                  onClick={handleSave}
                  className="h-8 bg-figma-table px-3 text-xs font-medium text-white hover:bg-figma-table/90"
                >
                  {saving ? "Guardando…" : "Guardar"}
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditing(true)}
                  className="h-8 border-border px-3 text-xs font-medium text-figma-table hover:bg-muted"
                >
                  Editar
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  disabled={deleting}
                  onClick={handleDelete}
                  className="h-8 px-3 text-xs font-medium"
                >
                  {deleting ? "Eliminando…" : "Eliminar"}
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <EditableField
            label="Nombre"
            value={cliente.nombre}
            editing={editing}
            inputValue={form.nombre}
            onChange={(v) => setForm((f) => ({ ...f, nombre: v }))}
          />
          <Field label="Empresa" value={cliente.empresa} />
          <EditableField
            label="Localidad"
            value={cliente.localidad}
            editing={editing}
            inputValue={form.localidad}
            onChange={(v) => setForm((f) => ({ ...f, localidad: v }))}
          />
          <EditableField
            label="Email"
            value={cliente.email}
            editing={editing}
            inputValue={form.email}
            onChange={(v) => setForm((f) => ({ ...f, email: v }))}
          />
          <EditableField
            label="Lugar de contacto"
            value={cliente.lugarContacto}
            editing={editing}
            inputValue={form.lugarContacto}
            onChange={(v) => setForm((f) => ({ ...f, lugarContacto: v }))}
          />
          <EditableSelect
            label="Estado"
            value={cliente.estado}
            editing={editing}
            selectValue={form.estadoCliente}
            options={estados}
            onChange={(v) => setForm((f) => ({ ...f, estadoCliente: v }))}
          />
          <Field label="Fecha de inserción" value={cliente.insercion} />
          <Field label="Último contacto" value={cliente.ultimoContacto} />
          <Field label="Emails enviados" value={cliente.emailsEnviados} />
        </div>

        <div className="mt-8 grid gap-4 xl:grid-cols-[1.5fr_1fr]">
          <div className="rounded-3xl border border-border/70 bg-figma-shell/45 p-5">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-figma-placeholder">
              Próximo movimiento
            </p>
            <h2 className="mt-3 font-display text-xl font-semibold tracking-tight text-figma-table">
              Preparar seguimiento personalizado
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-figma-placeholder">
              El historial indica que este contacto encaja con una secuencia de
              correo centrada en valor sectorial y caso de uso concreto.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/dashboard/correo">
                <Button className="h-9 gap-2 bg-figma-table px-3 text-sm font-medium text-white hover:bg-figma-table/90">
                  <Mail className="size-3.5" />
                  Abrir maquetas
                </Button>
              </Link>
              <Link href="/dashboard/noticias/interesantes">
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 gap-2 border-border bg-transparent px-3 text-sm font-medium text-figma-table hover:bg-muted"
                >
                  <Sparkles className="size-3.5" />
                  Ver noticias relevantes
                </Button>
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-figma-placeholder">
              Resumen rápido
            </p>
            <div className="mt-4 space-y-4 text-sm text-figma-table">
              <div className="flex items-center gap-3">
                <MapPin className="size-4 text-figma-placeholder" />
                <span>{cliente.localidad}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="size-4 text-figma-placeholder" />
                <span>{cliente.email}</span>
              </div>
              <div className="rounded-2xl border border-border/60 bg-figma-shell/45 p-4 text-figma-placeholder">
                Lead con {cliente.emailsEnviados} envíos previos y estado actual{" "}
                <span className="font-medium text-figma-table">{cliente.estado}</span>.
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-border/70 bg-figma-shell/45 p-5">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-figma-placeholder">
            Actividad reciente
          </p>
          {actividades.length === 0 ? (
            <p className="mt-4 text-sm text-figma-placeholder">Sin actividad registrada.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {actividades.map((act) => (
                <li key={act.id} className="flex items-start gap-3">
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-figma-placeholder" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-figma-table">{act.descripcion}</p>
                    <p className="mt-0.5 text-xs text-figma-placeholder">
                      {new Date(act.fecha_creacion).toLocaleString("es-ES")}
                      {act.usuario_nombre ? ` · ${act.usuario_nombre}` : ""}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
