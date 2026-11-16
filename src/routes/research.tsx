import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SearchX, Play, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DemoTag, EmptyState, Formula, PageHeader, Panel, Stat, Warn } from "@/components/fi/primitives";
import { ALPHA, ASSET_CLASSES, DATASET_META, UNIVERSE, findAsset, type Asset, type AssetClass } from "@/lib/data";
import { fundamentalMetrics } from "@/lib/finance";
import { fmtNum, fmtPct, fmtX, tone } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/research")({
  validateSearch: (s: Record<string, unknown>): { ticker?: string } =>
    typeof s.ticker === "string" && s.ticker ? { ticker: s.ticker } : {},
  head: () => ({
    meta: [
      { title: "Research — Finance Intelligence" },
      { name: "description", content: "Análise estruturada de ativos com indicadores fundamentalistas, fórmulas e metadados de dados simulados." },
      { property: "og:title", content: "Research — Finance Intelligence" },
      { property: "og:description", content: "Análise fundamentalista educacional com dataset fictício ALPHA S.A." },
    ],
  }),
  component: Research,
});

function Research() {
  const { ticker } = Route.useSearch();
  const navigate = useNavigate({ from: "/research" });
  const [cls, setCls] = useState<AssetClass | "Todas">("Todas");
  const [q, setQ] = useState(ticker ?? "ALPHA3");
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { if (ticker) setQ(ticker); }, [ticker]);
  const asset = ticker ? findAsset(ticker) : undefined;

  const analyze = () => {
    const a = findAsset(q);
    if (!q.trim()) return setError("Informe um ticker ou nome de companhia.");
    if (!a) return setError(`"${q}" não está no universo demonstrativo.`);
    setError(null);
    navigate({ search: { ticker: a.ticker } });
  };
  const list = UNIVERSE.filter((a) => cls === "Todas" || a.cls === cls);

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader eyebrow="Módulo 02 · Research" title="Análise de ativos" desc="Saída estruturada, sem recomendação de compra ou venda." actions={<DemoTag />} />
      <Panel>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Classe de ativo">
          {(["Todas", ...ASSET_CLASSES] as const).map((c) => (
            <button key={c} onClick={() => setCls(c)} aria-pressed={cls === c}
              className={cn("rounded-sm border px-2.5 py-1 text-xs", cls === c ? "border-gold/60 bg-gold-dim text-gold" : "text-muted-foreground hover:text-foreground")}>{c}</button>
          ))}
        </div>
        <form className="mt-4 flex flex-col gap-2 sm:flex-row" onSubmit={(e) => { e.preventDefault(); analyze(); }}>
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ticker ou companhia (ex.: ALPHA3, PETR4)" aria-label="Ticker ou companhia" className="font-mono uppercase" />
          <Button type="submit"><Play className="size-4" /> Analisar ativo</Button>
        </form>
        {error && <div className="mt-3"><Warn tone="error">{error}</Warn></div>}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {list.length === 0 ? <span className="text-xs text-faint">Nenhum ativo demonstrativo nesta classe.</span> :
            list.map((a) => (
              <button key={a.ticker} onClick={() => navigate({ search: { ticker: a.ticker } })}
                className={cn("num rounded-sm border bg-panel-2 px-2 py-0.5 text-xs hover:border-gold/50", ticker === a.ticker ? "text-gold" : "text-muted-foreground")}>{a.ticker}</button>
            ))}
        </div>
      </Panel>

      <div className="mt-4">
        {!ticker ? <EmptyState icon={<SearchX className="size-6" />} title="Nenhuma análise em andamento" desc="Selecione um ativo ou use ALPHA3 (companhia fictícia) para ver a análise fundamentalista completa."
            action={<Button variant="outline" size="sm" onClick={() => navigate({ search: { ticker: "ALPHA3" } })}>Carregar ALPHA S.A.</Button>} />
          : !asset ? <EmptyState icon={<SearchX className="size-6" />} title={`"${ticker}" não encontrado`} desc="O universo demonstrativo contém um conjunto limitado de ativos." />
          : asset.ticker === "ALPHA3" ? <AlphaAnalysis /> : <AssetProfile a={asset} />}
      </div>
    </div>
  );
}

function AssetProfile({ a }: { a: Asset }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Panel className="lg:col-span-2" eyebrow={`${a.cls} · ${a.sector}`} title={`${a.ticker} — ${a.name}`} actions={<DemoTag label="SIMULADO" />}>
        <p className="text-sm text-muted-foreground">{a.description}</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Stat label="Preço de referência" value={`${a.currency === "USD" ? "US$" : "R$"} ${fmtNum(a.price)}`} sub="Valor ilustrativo, não é cotação" />
          <Stat label="Variação diária" value={fmtPct(a.change, 2, true)} valueClass={tone(a.change)} sub="Simulada" />
        </div>
      </Panel>
      <Panel eyebrow="Qualidade dos dados" title="Cobertura">
        <Warn>Demonstrações financeiras não estão disponíveis para {a.ticker} no dataset demonstrativo. Conecte um provedor verificado para análise fundamentalista.</Warn>
        <p className="mt-3 text-xs text-muted-foreground">Para um exemplo completo de análise com fórmulas, use a companhia fictícia ALPHA3.</p>
      </Panel>
    </div>
  );
}

export function AlphaTable() {
  const rows: [string, number[]][] = [
    ["Receita líquida", ALPHA.revenue], ["EBITDA", ALPHA.ebitda], ["Lucro líquido", ALPHA.netIncome],
    ["Patrimônio líquido", ALPHA.equity], ["Dívida líquida", ALPHA.netDebt],
  ];
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead><tr className="border-b"><th className="eyebrow py-2 text-left font-normal">R$ milhões</th>{ALPHA.years.map((y) => <th key={y} className="eyebrow py-2 text-right font-normal">{y}</th>)}</tr></thead>
        <tbody>{rows.map(([n, v]) => (
          <tr key={n} className="border-b last:border-0"><td className="py-2 text-muted-foreground">{n}</td>{v.map((x, i) => <td key={i} className="num py-2 text-right">{fmtNum(x, x % 1 ? 1 : 0)}</td>)}</tr>
        ))}</tbody>
      </table>
    </div>
  );
}

function AlphaAnalysis() {
  const m = fundamentalMetrics(ALPHA);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Valor de mercado" value={`R$ ${fmtNum(m.marketCap, 0)} mi`} />
        <Stat label="P/L" value={fmtX(m.pe)} />
        <Stat label="ROE" value={fmtPct(m.roe)} />
        <Stat label="Dividend yield" value={fmtPct(m.dy)} />
      </div>
      <div className="grid gap-4 lg:grid-cols-5">
        <Panel className="lg:col-span-3" eyebrow="Demonstrações · 2024–2026" title="ALPHA S.A. (companhia fictícia)" actions={<DemoTag />}>
          <AlphaTable />
          <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
            <div>Preço: <span className="num text-foreground">R$ 25,00</span></div>
            <div>Ações: <span className="num text-foreground">24 mi</span></div>
            <div>DPA anual: <span className="num text-foreground">R$ 1,50</span></div>
          </div>
        </Panel>
        <Panel className="lg:col-span-2" eyebrow="Metodologia" title="Indicadores e fórmulas">
          <Formula name="Valor de mercado" expr="Preço × Ações" result={`R$ ${fmtNum(m.marketCap, 0)} mi`} />
          <Formula name="P/L" expr="Valor de mercado ÷ Lucro líquido" result={fmtX(m.pe)} />
          <Formula name="P/VP" expr="Valor de mercado ÷ PL" result={fmtX(m.pb)} />
          <Formula name="ROE" expr="Lucro líquido ÷ PL" result={fmtPct(m.roe)} />
          <Formula name="Dividend yield" expr="DPA ÷ Preço" result={fmtPct(m.dy)} />
          <Formula name="Dív. líq./EBITDA" expr="Dívida líquida ÷ EBITDA" result={fmtX(m.netDebtEbitda)} />
          <Formula name="Cresc. receita 26/25" expr="Receita₂₆ ÷ Receita₂₅ − 1" result={fmtPct(m.revenueGrowth)} />
          <Formula name="Cresc. lucro 26/25" expr="LL₂₆ ÷ LL₂₅ − 1" result={fmtPct(m.netIncomeGrowth)} />
          <Formula name="Margem líquida" expr="LL ÷ Receita" result={fmtPct(m.netMargin)} />
        </Panel>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Panel eyebrow="1" title="Visão do negócio"><p className="text-sm text-muted-foreground">Companhia industrial fictícia com receita crescente de R$ 800 mi (2024) para R$ 1.050 mi (2026) e margem EBITDA estável próxima de {fmtPct(m.ebitdaMargin, 1)}.</p></Panel>
        <Panel eyebrow="2" title="Indicadores fundamentalistas"><p className="text-sm text-muted-foreground">Negociada a {fmtX(m.pe)} lucro e {fmtX(m.pb)} valor patrimonial, com ROE de {fmtPct(m.roe)} e alavancagem de {fmtX(m.netDebtEbitda)} dívida líquida/EBITDA.</p></Panel>
        <Panel eyebrow="3" title="Pontos fortes"><ul className="list-disc space-y-1 pl-4 text-sm text-muted-foreground"><li>Crescimento de lucro ({fmtPct(m.netIncomeGrowth)}) acima da receita ({fmtPct(m.revenueGrowth)}): alavancagem operacional.</li><li>Desalavancagem gradual: dívida líquida de R$ 200 mi para R$ 180 mi.</li><li>Margem líquida em expansão até {fmtPct(m.netMargin)}.</li></ul></Panel>
        <Panel eyebrow="4" title="Riscos"><ul className="list-disc space-y-1 pl-4 text-sm text-muted-foreground"><li>Múltiplo baixo pode refletir risco percebido não capturado nos dados.</li><li>Sensibilidade a ciclo econômico e custo de capital.</li><li>Série curta (3 exercícios) limita inferência de tendência.</li></ul></Panel>
        <Panel eyebrow="5" title="Qualidade dos dados"><div className="space-y-2 text-xs"><div className="flex items-center gap-2 text-muted-foreground"><Database className="size-3.5 text-gold" /> {DATASET_META.id}</div><div className="text-muted-foreground">Fonte: {DATASET_META.source}</div><div className="text-muted-foreground">Classificação: <span className="text-gold">{DATASET_META.classification}</span></div><div className="text-muted-foreground">Atualizado: <span className="num">{new Date(DATASET_META.updatedAt).toLocaleString("pt-BR")}</span></div></div></Panel>
        <Panel eyebrow="6" title="Limitações"><p className="text-sm text-muted-foreground">Dados sintéticos para fins educacionais. Não há ajustes contábeis, eventos não recorrentes nem projeções. Esta análise não constitui recomendação de investimento.</p></Panel>
      </div>
    </div>
  );
}
