import { createFileRoute } from "@tanstack/react-router";
import { Construction } from "lucide-react";
import { DemoTag, EmptyState, PageHeader } from "@/components/fi/primitives";

export const Route = createFileRoute("/relatorios")({
  head: () => ({
    meta: [
      { title: "Relatórios — Finance Intelligence" },
      { name: "description", content: "Módulo Relatórios da estação Finance Intelligence (dados simulados)." },
      { property: "og:title", content: "Relatórios — Finance Intelligence" },
      { property: "og:description", content: "Módulo Relatórios — ambiente demonstrativo." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader eyebrow="Módulo 06 · Relatórios" title="Relatórios" actions={<DemoTag />} />
      <EmptyState icon={<Construction className="size-6" />} title="Módulo em implementação" desc="Este módulo será concluído na próxima etapa." />
    </div>
  );
}
