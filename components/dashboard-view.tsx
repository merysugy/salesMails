"use client";

import {
  ChevronDown,
  ChevronUp,
  Mail,
  Search,
  Settings,
  SlidersHorizontal,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { getClientes, getClientesInactivos, restoreCliente, getEstadosCliente, type ClienteAPI } from "@/lib/api";

type Cliente = {
  id: string;
  nombre: string;
  estado: string;
  empresa: string;
  localidad: string;
  email: string;
  lugarContacto: string;
  insercion: string;
  ultimoContacto: string;
  emailsEnviados: number;
};

function mapClienteAPI(c: ClienteAPI): Cliente {
  return {
    id: String(c.id),
    nombre: c.nombre,
    estado: c.estado_cliente_detalle?.nombre ?? "Sin estado",
    empresa: c.tipo === "empresa" ? c.nombre : "",
    localidad: c.ciudad ?? "",
    email: c.email ?? "",
    lugarContacto: c.direccion ?? "",
    insercion: c.fecha_creacion
      ? new Date(c.fecha_creacion).toLocaleDateString("es-ES")
      : "",
    ultimoContacto: "",
    emailsEnviados: 0,
  };
}


const kpiDots = {
  campanas: "purple",
  nuevos: "green",
  contactados: "beige",
  negociacion: "orange",
  cerrados: "grey",
} as const;

const kpiDotClass: Record<(typeof kpiDots)[keyof typeof kpiDots], string> = {
  purple: "bg-kpi-purple",
  green: "bg-kpi-green",
  beige: "bg-kpi-beige",
  orange: "bg-kpi-orange",
  grey: "bg-kpi-grey",
};

function estadoDotClass(estado: string): string {
  switch (estado) {
    case "Lead":
      return "bg-kpi-green";
    case "Prospecto":
      return "bg-kpi-beige";
    case "Negociación":
      return "bg-kpi-orange";
    case "Cliente":
      return "bg-kpi-grey";
    default:
      return "bg-kpi-grey";
  }
}

function EstadoPill({ estado }: Readonly<{ estado: string }>) {
  return (
    <span className="inline-flex min-w-[8.5rem] max-w-[11rem] items-center justify-between gap-2 rounded-md bg-figma-shell/80 px-2.5 py-1 text-[11px] font-medium text-figma-table">
      <span className="truncate">{estado}</span>
      <span
        className={cn(
          "size-1.5 shrink-0 rounded-full",
          estadoDotClass(estado),
        )}
      />
    </span>
  );
}

function toggleValue<T>(values: T[], value: T) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

function ClientesTableBody({
  loading,
  error,
  filteredClientes,
  selectedClientes,
  onToggleCliente,
  showInactive,
  onRestore,
}: Readonly<{
  loading: boolean;
  error: boolean;
  filteredClientes: Cliente[];
  selectedClientes: string[];
  onToggleCliente: (id: string, checked: boolean | "indeterminate") => void;
  showInactive: boolean;
  onRestore: (id: string) => Promise<void>;
}>) {
  if (loading) {
    return (
      <TableRow className="border-border/60">
        <TableCell
          colSpan={11}
          className="py-10 text-center text-sm text-figma-placeholder"
        >
          Cargando clientes…
        </TableCell>
      </TableRow>
    );
  }

  if (error) {
    return (
      <TableRow className="border-border/60">
        <TableCell
          colSpan={11}
          className="py-10 text-center text-sm text-red-500"
        >
          No se pudieron cargar los clientes. Comprueba tu sesión o recarga la página.
        </TableCell>
      </TableRow>
    );
  }

  if (filteredClientes.length === 0) {
    return (
      <TableRow className="border-border/60">
        <TableCell
          colSpan={11}
          className="py-10 text-center text-sm text-figma-placeholder"
        >
          No hay clientes que coincidan con la búsqueda o los filtros activos.
        </TableCell>
      </TableRow>
    );
  }

  return filteredClientes.map((c: Cliente) => (
    <TableRow
      key={c.id}
      className="border-border/60 transition-colors hover:bg-muted/40"
    >
      <TableCell className="py-3">
        <Checkbox
          checked={selectedClientes.includes(c.id)}
          onCheckedChange={(checked) => onToggleCliente(c.id, checked)}
          aria-label={`Seleccionar ${c.nombre}`}
          className="border-figma-accent data-checked:border-figma-accent data-checked:bg-figma-accent"
        />
      </TableCell>
      <TableCell className="py-3 text-[10.5px] font-medium whitespace-nowrap text-figma-table">
        {c.nombre}
      </TableCell>
      <TableCell className="py-3">
        <EstadoPill estado={c.estado} />
      </TableCell>
      <TableCell className="max-w-[140px] truncate py-3 text-[10.5px] font-medium text-figma-table">
        {c.empresa}
      </TableCell>
      <TableCell className="py-3 text-[10.5px] font-medium whitespace-nowrap text-figma-table">
        {c.localidad}
      </TableCell>
      <TableCell className="max-w-[160px] truncate py-3 text-[10.5px] font-medium text-figma-table">
        {c.email}
      </TableCell>
      <TableCell className="max-w-[130px] truncate py-3 text-[10.5px] font-medium text-figma-table">
        {c.lugarContacto}
      </TableCell>
      <TableCell className="py-3 text-[10.5px] font-medium whitespace-nowrap text-figma-table">
        {c.insercion}
      </TableCell>
      <TableCell className="py-3 text-[10.5px] font-medium whitespace-nowrap text-figma-table">
        {c.ultimoContacto}
      </TableCell>
      <TableCell className="py-3 text-[10.5px] font-medium tabular-nums text-figma-table">
        {c.emailsEnviados}
      </TableCell>
      <TableCell className="py-3 text-right">
        {showInactive ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onRestore(c.id)}
            className="h-7 border-border px-2.5 text-[11px] font-medium text-figma-table hover:bg-muted"
          >
            Restaurar
          </Button>
        ) : (
          <Link href={`/dashboard/clientes/${c.id}`}>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 border-border px-2.5 text-[11px] font-medium text-figma-table hover:bg-muted"
            >
              Ficha
            </Button>
          </Link>
        )}
      </TableCell>
    </TableRow>
  ));
}

function matchesSearch(cliente: Cliente, query: string) {
  if (!query) {
    return true;
  }

  const normalizedQuery = query.trim().toLocaleLowerCase("es");
  const searchableValues = [
    cliente.nombre,
    cliente.estado,
    cliente.empresa,
    cliente.localidad,
    cliente.email,
    cliente.lugarContacto,
    cliente.insercion,
    cliente.ultimoContacto,
    String(cliente.emailsEnviados),
  ];

  return searchableValues.some((value) =>
    value.toLocaleLowerCase("es").includes(normalizedQuery),
  );
}

export function DashboardView() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showInactive, setShowInactive] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showStatusFilters, setShowStatusFilters] = useState(true);
  const [estadosFilter, setEstadosFilter] = useState<string[]>([]);
  const [selectedEstados, setSelectedEstados] = useState<string[]>([]);
  const [selectedLocalidades, setSelectedLocalidades] = useState<string[]>([]);
  const [selectedLugares, setSelectedLugares] = useState<string[]>([]);
  const [onlyWithEmails, setOnlyWithEmails] = useState(false);
  const [selectedClientes, setSelectedClientes] = useState<string[]>([]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    const fetch = showInactive ? getClientesInactivos : getClientes;
    fetch()
      .then((data) => setClientes(data.map(mapClienteAPI)))
      .catch(() => {
        setError(true);
        setClientes([]);
      })
      .finally(() => setLoading(false));
  }, [showInactive]);

  useEffect(() => {
    getEstadosCliente().then((data) => setEstadosFilter(data.map((e) => e.nombre)));
  }, []);

  const handleRestore = async (id: string) => {
    try {
      await restoreCliente(id);
      setClientes((current) => current.filter((c) => c.id !== id));
    } catch {
      alert("Error al restaurar el cliente");
    }
  };

  const localidadesDisponibles = useMemo(
    () => [...new Set(clientes.map((c) => c.localidad).filter(Boolean))].sort((a, b) => a.localeCompare(b, "es")),
    [clientes],
  );

  const lugaresDisponibles = useMemo(
    () => [...new Set(clientes.map((c) => c.lugarContacto).filter(Boolean))].sort((a, b) => a.localeCompare(b, "es")),
    [clientes],
  );

  const filteredClientes = useMemo(() => {
    return clientes.filter((cliente) => {
      const matchesEstado =
        selectedEstados.length === 0 || selectedEstados.includes(cliente.estado);
      const matchesLocalidad =
        selectedLocalidades.length === 0 ||
        selectedLocalidades.includes(cliente.localidad);
      const matchesLugar =
        selectedLugares.length === 0 ||
        selectedLugares.includes(cliente.lugarContacto);
      const matchesEmailStatus = !onlyWithEmails || cliente.emailsEnviados > 0;

      return (
        matchesSearch(cliente, searchQuery) &&
        matchesEstado &&
        matchesLocalidad &&
        matchesLugar &&
        matchesEmailStatus
      );
    });
  }, [
    clientes,
    onlyWithEmails,
    searchQuery,
    selectedEstados,
    selectedLocalidades,
    selectedLugares,
  ]);

  const visibleClienteIds = filteredClientes.map((cliente) => cliente.id);
  const allVisibleSelected =
    visibleClienteIds.length > 0 &&
    visibleClienteIds.every((id) => selectedClientes.includes(id));

  const activeAdvancedFilters =
    selectedLocalidades.length +
    selectedLugares.length +
    Number(onlyWithEmails);
  const activeFiltersCount =
    Number(Boolean(searchQuery)) +
    selectedEstados.length +
    activeAdvancedFilters;

  const filteredKpis = [
    {
      value: filteredClientes.reduce(
        (total, cliente) => total + cliente.emailsEnviados,
        0,
      ),
      label: "Emails enviados",
      dot: kpiDots.campanas,
    },
    {
      value: filteredClientes.filter(
        (cliente) => cliente.estado === "Lead",
      ).length,
      label: "Clientes nuevos",
      dot: kpiDots.nuevos,
    },
    {
      value: filteredClientes.filter((cliente) => cliente.estado === "Prospecto")
        .length,
      label: "Contactados",
      dot: kpiDots.contactados,
    },
    {
      value: filteredClientes.filter((cliente) => cliente.estado === "Negociación")
        .length,
      label: "Negociación",
      dot: kpiDots.negociacion,
    },
    {
      value: filteredClientes.filter(
        (cliente) => cliente.estado === "Cliente",
      ).length,
      label: "Tratos cerrados",
      dot: kpiDots.cerrados,
    },
  ] as const;

  const applySearch = () => {
    setSearchQuery(searchInput.trim());
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearchQuery("");
    setSelectedEstados([]);
    setSelectedLocalidades([]);
    setSelectedLugares([]);
    setOnlyWithEmails(false);
  };

  const toggleVisibleSelection = (checked: boolean | "indeterminate") => {
    if (checked === true) {
      setSelectedClientes((current) => [
        ...new Set([...current, ...visibleClienteIds]),
      ]);
      return;
    }

    setSelectedClientes((current) =>
      current.filter((id) => !visibleClienteIds.includes(id)),
    );
  };

  const toggleClienteSelection = (
    clienteId: string,
    checked: boolean | "indeterminate",
  ) => {
    setSelectedClientes((current) => {
      if (checked === true) {
        return current.includes(clienteId) ? current : [...current, clienteId];
      }

      return current.filter((id) => id !== clienteId);
    });
  };

  return (
    <div className="flex min-h-full flex-col">
      <div className="shrink-0 border-b border-border/70 pb-4">
        <h2 className="font-display text-xl font-semibold tracking-tight text-figma-table md:text-2xl">
          Clientes
        </h2>
        <p className="mt-1.5 text-sm text-figma-placeholder">
          Vista resumida del pipeline y últimos contactos.
        </p>
      </div>

      <div className="mt-6 grid shrink-0 gap-5 sm:grid-cols-2 xl:grid-cols-5">
        {filteredKpis.map((k) => (
          <div key={k.label} className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-figma-placeholder">
                {k.label}
              </p>
              <p className="mt-1 text-3xl font-semibold tabular-nums tracking-tight text-figma-table">
                {k.value}
              </p>
            </div>
            <span
              className={cn(
                "mt-2 size-2 shrink-0 rounded-full",
                kpiDotClass[k.dot],
              )}
            />
          </div>
        ))}
      </div>

      <div className="mt-5 flex shrink-0 flex-col gap-4">
        <div className="flex w-full min-w-0 overflow-hidden rounded-md border border-border bg-card">
          <Input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                applySearch();
              }
            }}
            placeholder="Buscar por nombre, empresa, estado…"
            className="h-10 flex-1 rounded-none border-0 bg-transparent px-3.5 text-sm shadow-none placeholder:text-figma-placeholder focus-visible:ring-0"
          />
          <Button
            type="button"
            size="lg"
            onClick={applySearch}
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
            onClick={clearFilters}
            className="h-9 gap-2 border-0 bg-figma-table px-3 text-sm font-medium text-white hover:bg-figma-table/90"
          >
            <X className="size-3.5" />
            Limpiar filtros
          </Button>
          <Button
            type="button"
            size="lg"
            variant="outline"
            aria-expanded={showFilters}
            onClick={() => setShowFilters((current) => !current)}
            className="h-9 gap-2 border-border bg-transparent px-3 text-sm font-medium text-figma-table hover:bg-muted"
          >
            <SlidersHorizontal className="size-3.5" />
            Filtros
            {activeAdvancedFilters > 0 ? ` (${activeAdvancedFilters})` : ""}
            {showFilters ? (
              <ChevronUp className="size-3.5" />
            ) : (
              <ChevronDown className="size-3.5" />
            )}
          </Button>
          <Button
            type="button"
            size="lg"
            variant="outline"
            aria-pressed={showStatusFilters}
            onClick={() => setShowStatusFilters((current) => !current)}
            className="h-9 gap-2 border-figma-accent/40 bg-transparent px-3 text-sm font-medium text-figma-accent hover:bg-figma-shell"
          >
            <Settings className="size-3.5" />
            Estado de cliente
            {selectedEstados.length > 0 ? ` (${selectedEstados.length})` : ""}
          </Button>
          <div className="ml-auto flex w-full justify-end gap-2 sm:w-auto">
            <Button
              type="button"
              size="lg"
              variant="outline"
              aria-pressed={showInactive}
              onClick={() => {
                setShowInactive((current) => !current);
                setClientes([]);
              }}
              className="h-9 gap-2 border-border bg-transparent px-3 text-sm font-medium text-figma-table hover:bg-muted"
            >
              {showInactive ? "Ver activos" : "Ver inactivos"}
            </Button>
            <Link href="/dashboard/clientes/nuevo">
              <Button
                type="button"
                size="lg"
                variant="outline"
                className="h-9 gap-2 border-border bg-transparent px-3 text-sm font-medium text-figma-table hover:bg-muted"
              >
                Nuevo cliente
              </Button>
            </Link>
            <Link
              href={
                selectedClientes.length > 0
                  ? `/dashboard/correo/enviar?clientes=${selectedClientes.join(",")}`
                  : "/dashboard/correo/enviar"
              }
            >
              <Button
                type="button"
                size="lg"
                className="h-9 gap-2 border-0 bg-figma-table text-sm font-medium text-white hover:bg-figma-table/90"
              >
                <Mail className="size-3.5" />
                Enviar correo
                {selectedClientes.length > 0 ? ` (${selectedClientes.length})` : ""}
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-figma-placeholder">
          <span>
            Mostrando {filteredClientes.length} de {clientes.length} clientes
          </span>
          {selectedClientes.length > 0 ? (
            <span>Seleccionados {selectedClientes.length}</span>
          ) : null}
          {activeFiltersCount > 0 ? (
            <span>Filtros activos {activeFiltersCount}</span>
          ) : null}
        </div>

        {showStatusFilters ? (
          <div className="flex flex-wrap gap-2">
            {estadosFilter.map((estado) => {
              const isActive = selectedEstados.includes(estado);

              return (
                <Button
                  key={estado}
                  type="button"
                  size="sm"
                  variant="outline"
                  aria-pressed={isActive}
                  onClick={() =>
                    setSelectedEstados((current) => toggleValue(current, estado))
                  }
                  className={cn(
                    "h-8 rounded-full border px-3 text-xs font-medium",
                    isActive
                      ? "border-figma-table bg-figma-table text-white hover:bg-figma-table/90"
                      : "border-border bg-transparent text-figma-table hover:bg-muted",
                  )}
                >
                  {estado}
                </Button>
              );
            })}
          </div>
        ) : null}

        {showFilters ? (
          <div className="max-h-40 overflow-auto rounded-xl p-1">
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-figma-placeholder">
                  Localidad
                </p>
                <div className="flex flex-wrap gap-2">
                  {localidadesDisponibles.map((localidad) => {
                    const isActive = selectedLocalidades.includes(localidad);

                    return (
                      <Button
                        key={localidad}
                        type="button"
                        size="sm"
                        variant="outline"
                        aria-pressed={isActive}
                        onClick={() =>
                          setSelectedLocalidades((current) =>
                            toggleValue(current, localidad),
                          )
                        }
                        className={cn(
                          "h-8 rounded-full border px-3 text-xs font-medium",
                          isActive
                            ? "border-figma-accent bg-figma-shell text-figma-accent hover:bg-figma-shell"
                            : "border-border bg-transparent text-figma-table hover:bg-muted",
                        )}
                      >
                        {localidad}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-figma-placeholder">
                  Lugar de contacto
                </p>
                <div className="flex flex-wrap gap-2">
                  {lugaresDisponibles.map((lugar) => {
                    const isActive = selectedLugares.includes(lugar);

                    return (
                      <Button
                        key={lugar}
                        type="button"
                        size="sm"
                        variant="outline"
                        aria-pressed={isActive}
                        onClick={() =>
                          setSelectedLugares((current) => toggleValue(current, lugar))
                        }
                        className={cn(
                          "h-auto min-h-8 rounded-full border px-3 py-1.5 text-xs font-medium",
                          isActive
                            ? "border-figma-accent bg-figma-shell text-figma-accent hover:bg-figma-shell"
                            : "border-border bg-transparent text-figma-table hover:bg-muted",
                        )}
                      >
                        {lugar}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-figma-placeholder">
                  Actividad
                </p>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  aria-pressed={onlyWithEmails}
                  onClick={() => setOnlyWithEmails((current) => !current)}
                  className={cn(
                    "h-8 rounded-full border px-3 text-xs font-medium",
                    onlyWithEmails
                      ? "border-figma-table bg-figma-table text-white hover:bg-figma-table/90"
                      : "border-border bg-transparent text-figma-table hover:bg-muted",
                  )}
                >
                  Solo clientes con emails enviados
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-5 min-h-0 flex-1 overflow-auto rounded-none border border-border/80">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-figma-table/15 bg-figma-shell/50 hover:bg-transparent">
              <TableHead className="sticky top-0 z-10 w-10 bg-figma-shell pb-2 align-bottom">
                <Checkbox
                  checked={allVisibleSelected}
                  onCheckedChange={toggleVisibleSelection}
                  aria-label="Seleccionar clientes visibles"
                  className="border-figma-accent data-checked:border-figma-accent data-checked:bg-figma-accent"
                />
              </TableHead>
              <TableHead className="sticky top-0 z-10 bg-figma-shell pb-2 text-xs font-semibold whitespace-nowrap text-figma-table">
                Nombre del cliente
              </TableHead>
              <TableHead className="sticky top-0 z-10 bg-figma-shell pb-2 text-xs font-semibold whitespace-nowrap text-figma-table">
                Estado del cliente
              </TableHead>
              <TableHead className="sticky top-0 z-10 bg-figma-shell pb-2 text-xs font-semibold whitespace-nowrap text-figma-table">
                Empresa
              </TableHead>
              <TableHead className="sticky top-0 z-10 bg-figma-shell pb-2 text-xs font-semibold whitespace-nowrap text-figma-table">
                Localidad
              </TableHead>
              <TableHead className="sticky top-0 z-10 bg-figma-shell pb-2 text-xs font-semibold whitespace-nowrap text-figma-table">
                Correo electrónico
              </TableHead>
              <TableHead className="sticky top-0 z-10 bg-figma-shell pb-2 text-xs font-semibold whitespace-nowrap text-figma-table">
                Lugar de contacto
              </TableHead>
              <TableHead className="sticky top-0 z-10 bg-figma-shell pb-2 text-xs font-semibold whitespace-nowrap text-figma-table">
                Inserción
              </TableHead>
              <TableHead className="sticky top-0 z-10 bg-figma-shell pb-2 text-xs font-semibold whitespace-nowrap text-figma-table">
                Último contacto
              </TableHead>
              <TableHead className="sticky top-0 z-10 bg-figma-shell pb-2 text-xs font-semibold whitespace-nowrap text-figma-table">
                Emails enviados
              </TableHead>
              <TableHead className="sticky top-0 z-10 bg-figma-shell pb-2 text-right text-xs font-semibold text-figma-table" />
            </TableRow>
          </TableHeader>
          <TableBody>
            <ClientesTableBody
              loading={loading}
              error={error}
              filteredClientes={filteredClientes}
              selectedClientes={selectedClientes}
              onToggleCliente={toggleClienteSelection}
              showInactive={showInactive}
              onRestore={handleRestore}
            />
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
