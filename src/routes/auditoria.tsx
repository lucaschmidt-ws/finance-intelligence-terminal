import { createFileRoute } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { DemoTag, PageHeader, Panel, Warn } from "@/components/fi/primitives";
import { Btn } from "@/components/fi/ui";
import { DATASETS, DATASET_META } from "@/lib/data";
import { FORMULAS } from "@/lib/formulas";
import { clearLog, useAuditLog } from "@/lib/audit-log";

export const Route = createFileRoute("/auditoria")({
  head: () => ({
    meta: [
      { title: "Auditoria — Finance Intelligence" },
      { name: "description", content: "Catálogo de fórmulas, metadados dos conjuntos de dados e registro dos cálculos executados na sessão." },
      { property: "og:title", content: "Auditoria — Finance Intelligence" },
      { property: "og:description", content: "Transparência de fórmulas e fontes em ambiente demonstrativo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

const th = "eyebrow px-3 py-2 text-left font-normal";
const td = "px-3 py-2 align-top";

function Page() {
  const log = useAuditLog();
  return (
    <div className="mx-auto max-w-7xl space-y-4">
      <PageHeader eyebrow="Módulo 07 · Auditoria" title="Auditoria" desc="Tudo o que a estação calcula, de onde vêm os dados e o que foi executado nesta sessão." actions={<DemoTag />} />
      <Warn>Feed de mercado ao vivo: <strong>{DATASET_META.liveFeed ? "ativo" : "não conectado"}</strong>. Esta estação não executa ordens nem emite recomendação individualizada de investimento.</Warn>

      <Panel title="Conjuntos de dados" bodyClass="p-0 overflow-x-auto">
        <table className="w-full text-sm"><thead className="border-b"><tr><th className={th}>ID</th><th className={th}>Descrição</th><th className={th}>Fonte</th><th className={th}>Classificação</th><th className={th}>Atualizado</th></tr></thead>
          <tbody>{DATASETS.map((d) => (
            <tr key={d.id} className="border-b last:border-0"><td className={`${td} font-mono text-xs text-gold`}>{d.id}</td><td className={td}>{d.name}</td><td className={`${td} text-muted-foreground`}>{d.source}</td><td className={`${td} font-mono text-xs`}>{d.classification}</td><td className={`${td} num text-xs text-muted-foreground`}>{new Date(d.updatedAt).toLocaleDateString("pt-BR")}</td></tr>
          ))}</tbody></table>
      </Panel>

      <Panel title="Catálogo de fórmulas" eyebrow={`${FORMULAS.length} fórmulas · src/lib/finance.ts`} bodyClass="p-0 overflow-x-auto">
        <table className="w-full text-sm"><thead className="border-b"><tr><th className={th}>Métrica</th><th className={th}>Expressão</th><th className={th}>Implementação</th><th className={th}>Módulo</th></tr></thead>
          <tbody>{FORMULAS.map((f) => (
            <tr key={f.name} className="border-b last:border-0"><td className={td}>{f.name}</td><td className={`${td} font-mono text-xs text-muted-foreground`}>{f.expr}</td><td className={`${td} font-mono text-xs text-gold`}>{f.fn}()</td><td className={`${td} text-xs`}>{f.module}</td></tr>
          ))}</tbody></table>
      </Panel>

      <Panel title="Registro de cálculos da sessão" eyebrow="Mantido apenas na memória desta aba" actions={<Btn onClick={clearLog} disabled={!log.length}><Trash2 className="size-3.5" /> Limpar</Btn>} bodyClass="p-0 overflow-x-auto">
        {log.length === 0 ? <p className="p-4 text-xs text-muted-foreground">Nenhum cálculo registrado ainda. Use Risco, Quant Lab ou Relatórios e volte aqui.</p> : (
          <table className="w-full text-sm"><thead className="border-b"><tr><th className={th}>Horário</th><th className={th}>Módulo</th><th className={th}>Ação</th><th className={th}>Entradas</th><th className={th}>Resultado</th></tr></thead>
            <tbody>{log.map((e, i) => (
              <tr key={e.at + i} className="border-b last:border-0"><td className={`${td} num text-xs`}>{new Date(e.at).toLocaleTimeString("pt-BR")}</td><td className={td}>{e.module}</td><td className={td}>{e.action}</td><td className={`${td} max-w-xs break-all font-mono text-[0.7rem] text-muted-foreground`}>{e.inputs}</td><td className={`${td} font-mono text-xs text-gold`}>{e.result}</td></tr>
            ))}</tbody></table>
        )}
      </Panel>
    </div>
  );
}
