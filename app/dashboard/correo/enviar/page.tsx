import { Suspense } from "react";

import { SendEmailView } from "@/components/send-email-view";

export default function SendEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-[1.5rem] border border-border/80 bg-card p-6 text-sm text-figma-placeholder">
          Cargando formulario de envío...
        </div>
      }
    >
      <SendEmailView />
    </Suspense>
  );
}
