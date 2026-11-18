import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, Cell, Line, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowUpRight } from "lucide-react";
import { DemoTag, PageHeader, Panel, Stat } from "@/components/fi/primitives";
import { DASH_KPIS, RESEARCH_ACTIVITY, SAMPLE_HOLDINGS, UNIVERSE, performanceSeries } from "@/lib/data";
import { portfolioSummary } from "@/lib/portfolio-store";

const ALLOCATION = portfolioSummary(SAMPLE_HOLDINGS).allocation.map((a) => ({ name: a.name, value: Math.round(a.weight * 1000) / 10 }));
import { fmtBRL, fmtNum, fmtPct, tone } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Visão Geral — Finance Intelligence" },
      { name: "description", content: "Painel institucional com patrimônio simulado, desempenho, alocação e watchlist demonstrativa." },
      { property: "og:title", content: "Visão Geral — Finance Intelligence" },
      { property: "og:description", content: "Painel de research e analytics com dados simulados." },
    ],
  }),
  component: Dashboard,
});

const PERIODS = { "1M": 30, "3M": 90, "6M": 180, "1A": 365 } as const;
export const CHART_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)", "var(--chart-6)"];
const tooltipStyle = { background: "var(--panel-2)", border: "1px solid var(--border)", borderRadius: 4, fontSize: 12 };

function Dashboard() {
  const [period, setPeriod] = useState<keyof typeof PERIODS>("6M");
  const series = useMemo(() => performanceSeries(PERIODS[period]), [period]);
  const periodRet = series[series.length - 1]!.carteira / series[0]!.carteira - 1;

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader eyebrow="Módulo 01 · Visão Geral" title="Painel institucional" desc="Consolidação da carteira modelo, risco e atividade de research." actions={<DemoTag />} />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Patrimônio simulado" value={fmtBRL(DASH_KPIS.patrimonio)} sub="Carteira modelo" />
        <Stat label="Retorno acumulado" value={fmtPct(DASH_KPIS.retorno, 2, true)} valueClass="text-positive" sub="Desde o início (simulado)" />
        <Stat label="Volatilidade anualizada" value={fmtPct(DASH_KPIS.vol, 1)} sub="Desvio-padrão × √252" />
        <Stat label="Drawdown máximo" value={fmtPct(DASH_KPIS.mdd, 1)} valueClass="text-negative" sub="Pico a vale" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2" eyebrow="Série ilustrativa" title="Desempenho da carteira vs. benchmark"
          actions={
            <div role="tablist" aria-label="Período" className="flex rounded-sm border">
              {(Object.keys(PERIODS) as (keyof typeof PERIODS)[]).map((p) => (
                <button key={p} role="tab" aria-selected={period === p} onClick={() => setPeriod(p)}
                  className={cn("px-2.5 py-1 font-mono text-xs", period === p ? "bg-gold-dim text-gold" : "text-muted-foreground hover:text-foreground")}>{p}</button>
              ))}
            </div>
          }>
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Retorno no período: <span className={cn("num", tone(periodRet))}>{fmtPct(periodRet, 2, true)}</span></span>
            <DemoTag label="SÉRIE SIMULADA" />
          </div>
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={series} margin={{ left: 0, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--gold)" stopOpacity={0.25} /><stop offset="100%" stopColor="var(--gold)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" vertical={false} />
                <XAxis dataKey="d" tick={{ fill: "var(--faint)", fontSize: 10 }} tickFormatter={(d: string) => d.slice(5).split("-").reverse().join("/")} minTickGap={40} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--faint)", fontSize: 10 }} tickFormatter={(v: number) => `${fmtNum(v / 1000, 0)}k`} domain={["auto", "auto"]} width={44} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number, n) => [fmtBRL(v), n === "carteira" ? "Carteira" : "Benchmark"]} />
                <Area dataKey="carteira" stroke="var(--gold)" strokeWidth={1.5} fill="url(#g)" />
                <Line dataKey="bench" stroke="var(--chart-4)" strokeDasharray="4 3" dot={false} strokeWidth={1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel eyebrow="Alocação por classe" title="Distribuição estratégica" actions={<DemoTag label="SIMULADO" />}>
          <div className="h-44">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={ALLOCATION} dataKey="value" nameKey="name" innerRadius={52} outerRadius={78} stroke="var(--panel)" strokeWidth={2}>
                  {ALLOCATION.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-1.5">
            {ALLOCATION.map((a, i) => (
              <li key={a.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground"><span className="size-2 rounded-sm" style={{ background: CHART_COLORS[i] }} />{a.name}</span>
                <span className="num text-foreground">{fmtNum(a.value, 1)}%</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel eyebrow="Watchlist" title="Universo monitorado" actions={<DemoTag label="COTAÇÕES SIMULADAS" />} bodyClass="p-0">
          <table className="w-full text-sm">
            <thead><tr className="border-b text-left"><th className="eyebrow px-4 py-2 font-normal">Ticker</th><th className="eyebrow hidden px-4 py-2 font-normal sm:table-cell">Classe</th><th className="eyebrow px-4 py-2 text-right font-normal">Preço</th><th className="eyebrow px-4 py-2 text-right font-normal">Var.</th></tr></thead>
            <tbody>
              {UNIVERSE.filter((a) => a.ticker !== "ALPHA3").map((a) => (
                <tr key={a.ticker} className="border-b last:border-0 hover:bg-panel-2">
                  <td className="px-4 py-2"><Link to="/research" search={{ ticker: a.ticker }} className="num text-gold hover:underline">{a.ticker}</Link><div className="text-xs text-faint">{a.name}</div></td>
                  <td className="hidden px-4 py-2 text-xs text-muted-foreground sm:table-cell">{a.cls}</td>
                  <td className="num px-4 py-2 text-right">{a.currency === "USD" ? "US$ " : "R$ "}{fmtNum(a.price)}</td>
                  <td className={cn("num px-4 py-2 text-right", tone(a.change))}>{fmtPct(a.change, 2, true)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
        <Panel eyebrow="Research" title="Atividade recente" actions={<Link to="/research" className="flex items-center gap-1 text-xs text-gold hover:underline">Abrir Research <ArrowUpRight className="size-3" /></Link>}>
          <ol className="relative space-y-4 border-l pl-4">
            {RESEARCH_ACTIVITY.map((r) => (
              <li key={r.title} className="relative">
                <span className="absolute -left-[1.3rem] top-1.5 size-2 rounded-full border border-gold bg-background" />
                <div className="flex flex-wrap items-center gap-2 text-xs"><span className="num text-faint">{r.when}</span><span className="num text-gold">{r.ticker}</span><span className="rounded-sm border px-1.5 text-[0.65rem] text-muted-foreground">{r.tag}</span></div>
                <div className="mt-0.5 text-sm text-foreground">{r.title}</div>
              </li>
            ))}
          </ol>
        </Panel>
      </div>
    </div>
  );
}
