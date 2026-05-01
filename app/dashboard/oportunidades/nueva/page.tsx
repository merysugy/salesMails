import { Suspense } from "react";
import { OportunidadNuevaView } from "@/components/oportunidad-nueva-view";

export default function OportunidadNuevaPage() {
  return (
    <Suspense>
      <OportunidadNuevaView />
    </Suspense>
  );
}
