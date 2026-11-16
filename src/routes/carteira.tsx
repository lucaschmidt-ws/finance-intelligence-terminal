import { createFileRoute } from "@tanstack/react-router";
import { Construction } from "lucide-react";
import { DemoTag, EmptyState, PageHeader } from "@/components/fi/primitives";

export const Route = createFileRoute("/carteira")({
  head: () => ({
    meta: [
      { title: "Carteira — Finance Intelligence" },
      { name: "description", content: "Módulo Carteira da estação Finance Intelligence (dados simulados)." },
      { property: "og:title", content: "Carteira — Finance Intelligence" },
      { property: "og:description", content: "Módulo Carteira — ambiente demonstrativo." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader eyebrow="Módulo 03 · Carteira" title="Carteira" actions={<DemoTag />} />
      <EmptyState icon={<Construction className="size-6" />} title="Módulo em implementação" desc="Este módulo será concluído na próxima etapa." />
    </div>
  );
}
