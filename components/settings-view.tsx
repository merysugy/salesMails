"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getCurrentUser,
  updateCurrentUser,
  type UserAPI,
} from "@/lib/api";

type FormState = {
  first_name: string;
  last_name: string;
  email: string;
};

function toForm(user: UserAPI): FormState {
  return {
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
  };
}

export function SettingsView() {
  const [user, setUser] = useState<UserAPI | null>(null);
  const [form, setForm] = useState<FormState>({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getCurrentUser()
      .then((u) => {
        setUser(u);
        setForm(toForm(u));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const isDirty =
    user !== null &&
    (form.first_name !== user.first_name ||
      form.last_name !== user.last_name ||
      form.email !== user.email);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !isDirty) return;
    if (!form.email.trim()) return;

    setSaving(true);
    setSaved(false);
    try {
      const updated = await updateCurrentUser({
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim(),
      });
      setUser(updated);
      setForm(toForm(updated));
      setSaved(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al guardar los cambios.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-full w-full max-w-lg flex-col overflow-auto pr-1">
      <div className="mb-6 shrink-0 border-b border-border/70 pb-5">
        <h1 className="font-display text-xl font-semibold tracking-tight text-figma-table md:text-2xl">
          Ajustes
        </h1>
        <p className="mt-1.5 text-sm text-figma-placeholder">
          Actualiza tus datos de cuenta.
        </p>
      </div>

      {loading ? (
        <p className="py-10 text-center text-sm text-figma-placeholder">
          Cargando perfil…
        </p>
      ) : (
        <form className="flex flex-col gap-5 pb-2" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label
              htmlFor="first_name"
              className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-figma-placeholder"
            >
              Nombre
            </Label>
            <Input
              id="first_name"
              name="first_name"
              type="text"
              autoComplete="given-name"
              value={form.first_name}
              onChange={(e) =>
                setForm((f) => ({ ...f, first_name: e.target.value }))
              }
              className="h-11 rounded-md border-border bg-card px-3.5 text-foreground shadow-none placeholder:text-figma-placeholder/70 focus-visible:ring-2 focus-visible:ring-ring/40"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="last_name"
              className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-figma-placeholder"
            >
              Apellidos
            </Label>
            <Input
              id="last_name"
              name="last_name"
              type="text"
              autoComplete="family-name"
              value={form.last_name}
              onChange={(e) =>
                setForm((f) => ({ ...f, last_name: e.target.value }))
              }
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
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              className="h-11 rounded-md border-border bg-card px-3.5 text-foreground shadow-none placeholder:text-figma-placeholder/70 focus-visible:ring-2 focus-visible:ring-ring/40"
            />
          </div>

          <div className="flex items-center gap-4">
            <Button
              type="submit"
              disabled={saving || !isDirty || !form.email.trim()}
              className="h-11 w-full border-0 bg-figma-table text-base font-medium text-white shadow-none hover:bg-figma-table/90 sm:w-auto sm:px-8"
            >
              {saving ? "Guardando…" : "Guardar cambios"}
            </Button>
            {saved && (
              <p className="text-sm text-emerald-600">
                Perfil actualizado correctamente.
              </p>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
