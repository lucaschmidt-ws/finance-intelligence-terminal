import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Download, FileText, Printer } from "lucide-react";
import { DemoTag, PageHeader, Panel } from "@/components/fi/primitives";
import { Btn } from "@/components/fi/ui";
import { ALPHA, DATASET_META, performanceSeries } from "@/lib/data";
import { portfolioSummary, usePortfolio } from "@/lib/portfolio-store";
import { annualizedVol, fundamentalMetrics, maxDrawdown, returnsFromCurve, sharpe } from "@/lib/finance";
import { fmtBRL, fmtNum, fmtPct, fmtX } from "@/lib/format";
import { download, toCSV } from "@/lib/download";
import { logCalc } from "@/lib/audit-log";

export const Route = createFileRoute("/relatorios")({
  head: () => ({
    meta: [
      { title: "Relatórios — Finance Intelligence" },
      { name: "description", content: "Monte relatórios de carteira, risco e research com metadados e exporte em Markdown, CSV ou impressão." },
      { property: "og:title", content: "Relatórios — Finance Intelligence" },
      { property: "og:description", content: "Relatórios auditáveis em ambiente demonstrativo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

const DISCLAIMER = "Ambiente demonstrativo. Dados simulados; não representa cotação em tempo real nem recomendação de investimento.";
type Sec = "carteira" | "risco" | "research";

function Page() {
  const { holdings } = usePortfolio();
  const [sel, setSel] = useState<Record<Sec, boolean>>({ carteira: true, risco: true, research: true });
  const [generatedAt, setGeneratedAt] = useState("—");
  useEffect(() => setGeneratedAt(new Date().toISOString()), []);
  const p = useMemo(() => portfolioSummary(holdings), [holdings]);
  const risk = useMemo(() => {
    const curve = performanceSeries(252).map((d) => d.carteira);
    const r = returnsFromCurve(curve);
    return { vol: annualizedVol(r, 252), mdd: maxDrawdown(curve).mdd, sh: sharpe(r, 0.1075, 252), n: curve.length };
  }, []);
  const f = useMemo(() => fundamentalMetrics(ALPHA), []);

  const md = useMemo(() => {
    const L: string[] = [`# Relatório — Finance Intelligence`, ``, `- Gerado em: ${generatedAt}`, `- Dataset: ${DATASET_META.id} (${DATASET_META.classification})`, `- Fonte: ${DATASET_META.source}`, `- Feed ao vivo: não`, ``];
    if (sel.carteira) {
      L.push(`## Carteira`, ``, `Valor: ${fmtBRL(p.total)} · Custo: ${fmtBRL(p.totalCost)} · Resultado: ${fmtBRL(p.pl)}`, ``, `| Ticker | Classe | Qtd | Preço | Valor | Peso |`, `|---|---|---:|---:|---:|---:|`);
      p.rows.forEach((r) => L.push(`| ${r.ticker} | ${r.cls} | ${fmtNum(r.qty, 4)} | ${fmtBRL(r.price)} | ${fmtBRL(r.value)} | ${fmtPct(r.weight)} |`));
      L.push(``);
    }
    if (sel.risco) L.push(`## Risco (série demo, ${risk.n} pontos, diária)`, ``, `- Volatilidade anualizada: ${fmtPct(risk.vol)}`, `- Drawdown máximo: ${fmtPct(risk.mdd)}`, `- Sharpe (rf 10,75% a.a.): ${fmtNum(risk.sh)}`, ``);
    if (sel.research) L.push(`## Research — ${ALPHA.name} (fictícia)`, ``, `- P/L: ${fmtX(f.pe)}`, `- P/VP: ${fmtX(f.pb)}`, `- ROE: ${fmtPct(f.roe)}`, `- Dividend yield: ${fmtPct(f.dy)}`, `- Dív. líq./EBITDA: ${fmtX(f.netDebtEbitda)}`, ``);
    L.push(`---`, `_${DISCLAIMER}_`);
    return L.join("\n");
  }, [sel, p, risk, f, generatedAt]);

  const exportMd = () => { download("relatorio-finance-intelligence.md", md, "text/markdown"); logCalc({ module: "Relatórios", action: "Exportar Markdown", inputs: Object.keys(sel).filter((k) => sel[k as Sec]).join(","), result: `${md.length} caracteres` }); };
  const exportCsv = () => {
    const rows: unknown[][] = [["dataset", DATASET_META.id], ["classificacao", DATASET_META.classification], ["gerado_em", generatedAt], [], ["ticker", "classe", "qtd", "preco_brl", "custo_medio", "valor", "peso"]];
    p.rows.forEach((r) => rows.push([r.ticker, r.cls, r.qty, r.price, r.avgCost, r.value.toFixed(2), r.weight.toFixed(6)]));
    rows.push([], [DISCLAIMER]);
    download("carteira-finance-intelligence.csv", toCSV(rows), "text/csv");
    logCalc({ module: "Relatórios", action: "Exportar CSV", inputs: `${p.rows.length} posições`, result: "ok" });
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="print:hidden">
        <PageHeader eyebrow="Módulo 06 · Relatórios" title="Relatórios" desc="Selecione as seções, revise a pré-visualização e exporte. Os números vêm dos módulos Carteira, Risco e Research." actions={<DemoTag />} />
      </div>
      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        <Panel title="Seções" className="h-fit print:hidden">
          <div className="space-y-2">
            {(["carteira", "risco", "research"] as Sec[]).map((k) => (
              <label key={k} className="flex items-center gap-2 text-sm capitalize text-foreground">
                <input type="checkbox" checked={sel[k]} onChange={(e) => setSel({ ...sel, [k]: e.target.checked })} className="accent-[var(--gold)]" /> {k}
              </label>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <Btn variant="gold" onClick={() => window.print()}><Printer className="size-3.5" /> Imprimir / PDF</Btn>
            <Btn onClick={exportMd}><FileText className="size-3.5" /> Baixar Markdown</Btn>
            <Btn onClick={exportCsv}><Download className="size-3.5" /> Baixar CSV da carteira</Btn>
          </div>
        </Panel>
        <Panel title="Pré-visualização" eyebrow={`${DATASET_META.id} · ${DATASET_META.classification}`}>
          <pre className="num whitespace-pre-wrap text-xs leading-relaxed text-foreground">{md}</pre>
        </Panel>
      </div>
    </div>
  );
}
