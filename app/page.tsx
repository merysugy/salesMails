import Link from "next/link";

import { AppLogoMark } from "@/components/app-logo-mark";
import { LoginForm } from "@/components/login-form";

export default function Home() {
  return (
    <div className="grid h-full min-h-0 grid-cols-1 overflow-hidden lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <aside
        className="sm-minimal-dots relative hidden min-h-0 border-border/60 lg:block"
        aria-hidden
      >
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-figma-accent/35 to-transparent" />
        <div className="absolute bottom-16 left-10 max-w-[14rem] text-pretty">
          <p className="font-display text-2xl leading-snug text-foreground/85 md:text-[1.65rem]">
            Menos ruido. Más conversaciones que cierran.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            SalesMails concentra clientes, estados y envíos en una sola vista clara.
          </p>
        </div>
      </aside>

      <div className="flex min-h-0 flex-col justify-center overflow-auto bg-background px-6 py-8 sm:px-10 md:py-10 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-[26rem] space-y-8">
          <div className="animate-minimal-in space-y-6 text-center">
            <AppLogoMark
              className="mx-auto"
              imageClassName="h-16 w-auto max-w-none md:h-[4.5rem]"
              priority
            />
            <div className="space-y-2">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Acceso
              </p>
              <h1 className="font-display text-balance text-[1.65rem] font-semibold leading-tight text-foreground sm:text-3xl">
                Inicia sesión
              </h1>
              <p className="text-pretty text-sm text-muted-foreground">
                Usuario y contraseña de tu organización.
              </p>
            </div>
          </div>

          <div className="animate-minimal-in animate-minimal-in-delay-1">
            <LoginForm />
          </div>

          <p className="animate-minimal-in animate-minimal-in-delay-2 text-pretty text-center text-sm leading-relaxed text-muted-foreground">
            ¿Sin usuario?{" "}
            <Link
              href="mailto:contacto@salesmails.local"
              className="font-medium text-figma-accent underline decoration-figma-accent/30 underline-offset-4 transition-colors hover:decoration-figma-accent"
            >
              Escríbenos
            </Link>{" "}
            y te damos acceso.
          </p>
        </div>
      </div>
    </div>
  );
}
