import { createFileRoute } from "@tanstack/react-router";
import { Construction } from "lucide-react";
import { DemoTag, EmptyState, PageHeader } from "@/components/fi/primitives";

export const Route = createFileRoute("/auditoria")({
  head: () => ({
    meta: [
      { title: "Auditoria — Finance Intelligence" },
      { name: "description", content: "Módulo Auditoria da estação Finance Intelligence (dados simulados)." },
      { property: "og:title", content: "Auditoria — Finance Intelligence" },
      { property: "og:description", content: "Módulo Auditoria — ambiente demonstrativo." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader eyebrow="Módulo 07 · Auditoria" title="Auditoria" actions={<DemoTag />} />
      <EmptyState icon={<Construction className="size-6" />} title="Módulo em implementação" desc="Este módulo será concluído na próxima etapa." />
    </div>
  );
}
