import { Suspense } from "react";

import { EmailTemplatesView } from "@/components/email-templates-view";

export default function EmailTemplatesPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-[1.5rem] border border-border/80 bg-card p-6 text-sm text-figma-placeholder">
          Cargando maquetador de email...
        </div>
      }
    >
      <EmailTemplatesView />
    </Suspense>
  );
}
