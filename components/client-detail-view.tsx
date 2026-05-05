"use client";

import { ArrowLeft, Mail, MapPin, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getClienteById, updateCliente, deleteCliente, getEstadosCliente, getClienteActividad, getActividades, createActividad, updateActividad, deleteActividad, type ClienteAPI, type EstadoClienteAPI, type ActividadClienteAPI, type ActividadAPI } from "@/lib/api";

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
  const [actividadesManual, setActividadesManual] = useState<ActividadAPI[]>([]);
  const [actividadLog, setActividadLog] = useState<ActividadClienteAPI[]>([]);
  const [actForm, setActForm] = useState({
    tipo: "llamada" as ActividadAPI["tipo"],
    descripcion: "",
    fecha: new Date().toISOString().split("T")[0],
  });
  const [actSaving, setActSaving] = useState(false);
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
      getClienteActividad(cliente.id).then(setActividadLog).catch(() => {});
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

  const handleAddActividad = async () => {
    if (!actForm.descripcion.trim() || !cliente) return;
    setActSaving(true);
    try {
      await createActividad({
        tipo: actForm.tipo,
        descripcion: actForm.descripcion.trim(),
        fecha: actForm.fecha,
        cliente: Number(cliente.id),
      });
      const updated = await getActividades(Number(cliente.id));
      setActividadesManual(updated);
      setActForm({ tipo: "llamada", descripcion: "", fecha: new Date().toISOString().split("T")[0] });
    } catch (error) {
      console.error("Error al añadir actividad:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Error al añadir la actividad",
      );
    } finally {
      setActSaving(false);
    }
  };

  const handleCompleteActividad = async (actId: number) => {
    try {
      await updateActividad(actId, { completada: true });
      setActividadesManual((prev) =>
        prev.map((a) => (a.id === actId ? { ...a, completada: true } : a)),
      );
    } catch {
      alert("Error al completar la actividad");
    }
  };

  const handleDeleteActividad = async (actId: number) => {
    if (!confirm("¿Eliminar esta actividad?")) return;
    try {
      await deleteActividad(actId);
      setActividadesManual((prev) => prev.filter((a) => a.id !== actId));
    } catch {
      alert("Error al eliminar la actividad");
    }
  };

  useEffect(() => {
    setLoading(true);
    setError(false);
    Promise.all([
      getClienteById(id),
      getEstadosCliente(),
      getActividades(Number(id)).catch(() => [] as ActividadAPI[]),
      getClienteActividad(id).catch(() => [] as ActividadClienteAPI[]),
    ])
      .then(([clienteData, estadosData, actividadesData, logData]) => {
        const mapped = mapClienteAPI(clienteData);
        setCliente(mapped);
        setEstados(estadosData);
        setActividadesManual(actividadesData);
        setActividadLog(logData);
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
                <Link href={`/dashboard/oportunidades/nueva?cliente=${cliente.id}`}>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5 border-border px-3 text-xs font-medium text-figma-table hover:bg-muted"
                  >
                    <TrendingUp className="size-3" />
                    Crear oportunidad
                  </Button>
                </Link>
                <Link href={`/dashboard/correo/enviar?clientes=${cliente.id}`}>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5 border-border px-3 text-xs font-medium text-figma-table hover:bg-muted"
                  >
                    <Mail className="size-3" />
                    Enviar correo
                  </Button>
                </Link>
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

          <div className="mt-4 grid gap-3 sm:grid-cols-[auto_1fr_auto_auto] sm:items-end">
            <div className="space-y-1.5">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-figma-placeholder">
                Tipo
              </p>
              <select
                value={actForm.tipo}
                onChange={(e) =>
                  setActForm((f) => ({ ...f, tipo: e.target.value as ActividadAPI["tipo"] }))
                }
                className="rounded-xl border border-border/80 bg-figma-shell/55 px-3 py-2 text-sm font-medium text-figma-table shadow-sm outline-none focus:border-figma-accent"
              >
                <option value="llamada">Llamada</option>
                <option value="email">Email</option>
                <option value="reunion">Reunión</option>
                <option value="tarea">Tarea</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-figma-placeholder">
                Descripción
              </p>
              <input
                value={actForm.descripcion}
                onChange={(e) => setActForm((f) => ({ ...f, descripcion: e.target.value }))}
                placeholder="Describe la actividad…"
                className="w-full rounded-xl border border-border/80 bg-figma-shell/55 px-3 py-2 text-sm font-medium text-figma-table shadow-sm outline-none focus:border-figma-accent"
              />
            </div>
            <div className="space-y-1.5">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-figma-placeholder">
                Fecha
              </p>
              <input
                type="date"
                value={actForm.fecha}
                onChange={(e) => setActForm((f) => ({ ...f, fecha: e.target.value }))}
                className="rounded-xl border border-border/80 bg-figma-shell/55 px-3 py-2 text-sm font-medium text-figma-table shadow-sm outline-none focus:border-figma-accent"
              />
            </div>
            <Button
              type="button"
              size="sm"
              disabled={actSaving || !actForm.descripcion.trim()}
              onClick={handleAddActividad}
              className="h-9 bg-figma-table px-3 text-xs font-medium text-white hover:bg-figma-table/90"
            >
              {actSaving ? "Añadiendo…" : "Añadir actividad"}
            </Button>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-figma-placeholder">
                Actividades manuales
              </p>
              {actividadesManual.length === 0 ? (
                <p className="mt-3 text-sm text-figma-placeholder">Sin actividades manuales.</p>
              ) : (
                <ul className="mt-3 space-y-3">
                  {actividadesManual.map((act) => (
                    <li key={act.id} className="flex items-start gap-3">
                      <span
                        className={cn(
                          "mt-1.5 size-2 shrink-0 rounded-full",
                          act.completada ? "bg-kpi-green" : "bg-figma-placeholder",
                        )}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="rounded-full border border-border/60 bg-figma-shell px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-figma-placeholder">
                            {act.tipo}
                          </span>
                          {act.completada && (
                            <span className="text-[0.65rem] font-medium text-kpi-green">
                              completada
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-figma-table">{act.descripcion}</p>
                        <p className="mt-0.5 text-xs text-figma-placeholder">
                          {new Date(act.fecha).toLocaleDateString("es-ES")}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        {!act.completada && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleCompleteActividad(act.id)}
                            className="h-7 border-border px-2 text-xs text-figma-table hover:bg-muted"
                          >
                            Completar
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteActividad(act.id)}
                          className="h-7 border-border px-2 text-xs text-red-500 hover:bg-red-50"
                        >
                          Eliminar
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-figma-placeholder">
                Historial automático
              </p>
              {actividadLog.length === 0 ? (
                <p className="mt-3 text-sm text-figma-placeholder">Sin historial registrado.</p>
              ) : (
                <ul className="mt-3 space-y-3">
                  {actividadLog.map((log) => (
                    <li key={log.id} className="flex items-start gap-3">
                      <span className="mt-1.5 size-2 shrink-0 rounded-full bg-figma-placeholder" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-figma-table">{log.descripcion}</p>
                        <p className="mt-0.5 text-xs text-figma-placeholder">
                          {new Date(log.fecha_creacion).toLocaleString("es-ES")}
                          {log.usuario_nombre ? ` · ${log.usuario_nombre}` : ""}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
