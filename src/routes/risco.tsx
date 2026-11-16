import { createFileRoute } from "@tanstack/react-router";
import { Construction } from "lucide-react";
import { DemoTag, EmptyState, PageHeader } from "@/components/fi/primitives";

export const Route = createFileRoute("/risco")({
  head: () => ({
    meta: [
      { title: "Risco — Finance Intelligence" },
      { name: "description", content: "Módulo Risco da estação Finance Intelligence (dados simulados)." },
      { property: "og:title", content: "Risco — Finance Intelligence" },
      { property: "og:description", content: "Módulo Risco — ambiente demonstrativo." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader eyebrow="Módulo 04 · Risco" title="Risco" actions={<DemoTag />} />
      <EmptyState icon={<Construction className="size-6" />} title="Módulo em implementação" desc="Este módulo será concluído na próxima etapa." />
    </div>
  );
}
