"use client";

import { useActionState } from "react";

import { loginAction, type LoginState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: LoginState = { error: null };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="flex w-full flex-col gap-5">
      <div className="space-y-2">
        <Label
          htmlFor="usuario"
          className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
        >
          Usuario
        </Label>
        <Input
          id="usuario"
          name="usuario"
          type="text"
          autoComplete="username"
          placeholder="tu.usuario"
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
      {state.error ? (
        <p className="text-center text-sm text-destructive" role="alert">
          {state.error}
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
