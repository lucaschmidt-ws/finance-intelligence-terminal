import { createFileRoute } from "@tanstack/react-router";
import { Construction } from "lucide-react";
import { DemoTag, EmptyState, PageHeader } from "@/components/fi/primitives";

export const Route = createFileRoute("/quant")({
  head: () => ({
    meta: [
      { title: "Quant Lab — Finance Intelligence" },
      { name: "description", content: "Módulo Quant Lab da estação Finance Intelligence (dados simulados)." },
      { property: "og:title", content: "Quant Lab — Finance Intelligence" },
      { property: "og:description", content: "Módulo Quant Lab — ambiente demonstrativo." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader eyebrow="Módulo 05 · Quant Lab" title="Quant Lab" actions={<DemoTag />} />
      <EmptyState icon={<Construction className="size-6" />} title="Módulo em implementação" desc="Este módulo será concluído na próxima etapa." />
    </div>
  );
}
