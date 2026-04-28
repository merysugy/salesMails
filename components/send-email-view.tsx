"use client";

import { ArrowLeft, Mail, Send } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { sendDirectEmail } from "@/lib/api";

export function SendEmailView() {
  const searchParams = useSearchParams();

  const clienteIds =
    searchParams
      .get("clientes")
      ?.split(",")
      .map(Number)
      .filter(Boolean) ?? [];

  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{
    total: number;
    enviados: number;
    errores: { cliente_id: number; error: string }[];
  } | null>(null);

  const handleSend = async () => {
    if (clienteIds.length === 0) {
      alert("No hay clientes seleccionados. Vuelve al listado y selecciona clientes.");
      return;
    }
    if (!asunto.trim() || !mensaje.trim()) {
      alert("Asunto y mensaje son obligatorios.");
      return;
    }

    setSending(true);
    setResult(null);

    try {
      const res = await sendDirectEmail({
        cliente_ids: clienteIds,
        asunto: asunto.trim(),
        mensaje: mensaje.trim(),
      });
      setResult(res);
    } catch {
      alert("Error al enviar el correo. Comprueba tu sesión.");
    } finally {
      setSending(false);
    }
  };

  const plural = clienteIds.length === 1 ? "" : "s";
  const subtitulo =
    clienteIds.length > 0
      ? `Se enviará a ${clienteIds.length} cliente${plural} seleccionado${plural}.`
      : "No hay clientes seleccionados. Vuelve al listado para seleccionarlos.";

  return (
    <div className="flex min-h-full flex-col overflow-auto pr-1">
      {/* Header */}
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
            Envío directo
          </p>
          <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-figma-table md:text-3xl">
            Enviar correo
          </h1>
          <p className="mt-1 text-sm text-figma-placeholder">
            {subtitulo}
          </p>
        </div>

        {/* Resultado del envío */}
        {result && (
          <div
            className={`mt-6 rounded-2xl border px-5 py-4 text-sm ${
              result.errores.length === 0
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-amber-200 bg-amber-50 text-amber-800"
            }`}
          >
            <p className="font-semibold">
              {result.enviados} de {result.total} emails enviados correctamente.
            </p>
            {result.errores.length > 0 && (
              <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
                {result.errores.map((e) => (
                  <li key={e.cliente_id}>
                    Cliente #{e.cliente_id}: {e.error}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Formulario */}
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {/* Asunto */}
          <div className="space-y-3 md:col-span-2">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-figma-placeholder">
              Asunto
            </p>
            <input
              value={asunto}
              onChange={(e) => setAsunto(e.target.value)}
              placeholder="Escribe el asunto del correo..."
              disabled={sending}
              className="w-full rounded-2xl border border-figma-accent/50 bg-figma-shell/55 px-4 py-3 text-sm font-medium text-figma-table shadow-sm outline-none focus:border-figma-accent disabled:opacity-50"
            />
          </div>

          {/* Mensaje */}
          <div className="space-y-3 md:col-span-2">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-figma-placeholder">
              Mensaje
            </p>
            <textarea
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Escribe el mensaje. Puedes usar {{nombre}} para personalizar."
              rows={10}
              disabled={sending}
              className="w-full resize-none rounded-2xl border border-figma-accent/50 bg-figma-shell/55 px-4 py-3 text-sm font-medium text-figma-table shadow-sm outline-none focus:border-figma-accent disabled:opacity-50"
            />
            <p className="text-xs text-figma-placeholder">
              Tip: usa <span className="font-mono font-medium text-figma-table">{"{{nombre}}"}</span> para personalizar el mensaje con el nombre de cada cliente.
            </p>
          </div>
        </div>

        {/* Acciones */}
        <div className="mt-6 flex items-center gap-3">
          <Button
            type="button"
            onClick={handleSend}
            disabled={sending || clienteIds.length === 0}
            className="h-9 gap-2 bg-figma-table px-4 text-sm font-medium text-white hover:bg-figma-table/90 disabled:opacity-50"
          >
            {sending ? (
              <>
                <Mail className="size-3.5 animate-pulse" />
                Enviando…
              </>
            ) : (
              <>
                <Send className="size-3.5" />
                Enviar correo
                {clienteIds.length > 0 ? ` (${clienteIds.length})` : ""}
              </>
            )}
          </Button>
          <Link href="/dashboard">
            <Button
              type="button"
              variant="outline"
              disabled={sending}
              className="h-9 border-border px-4 text-sm font-medium text-figma-table hover:bg-muted"
            >
              Cancelar
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
