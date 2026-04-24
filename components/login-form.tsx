"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AUTH_COOKIE } from "@/lib/auth-constants";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail ?? "Usuario o contraseña incorrectos.");
        return;
      }

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      // Cookie simple para que el middleware proteja las rutas
      document.cookie = `${AUTH_COOKIE}=1; path=/; max-age=${60 * 60}`;

      router.push("/dashboard");
    } catch {
      setError("No se puede conectar con el servidor.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
      <div className="space-y-2">
        <Label
          htmlFor="email"
          className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
        >
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="tu@email.com"
          required
          className="h-11 rounded-md border-border bg-card px-3.5 text-foreground shadow-none placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-ring/40"
        />
      </div>
      <div className="space-y-2">
        <Label
          htmlFor="password"
          className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
        >
          Contraseña
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
          className="h-11 rounded-md border-border bg-card px-3.5 text-foreground shadow-none placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-ring/40"
        />
      </div>
      {error ? (
        <p className="text-center text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      <Button
        type="submit"
        disabled={pending}
        className="h-10 w-full border-0 bg-primary text-base font-medium text-primary-foreground shadow-none transition-colors hover:bg-primary/90"
      >
        {pending ? "Entrando…" : "Entrar"}
      </Button>
    </form>
  );
}
