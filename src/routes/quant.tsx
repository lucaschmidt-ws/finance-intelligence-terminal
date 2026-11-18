import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DemoTag, Field, Formula, PageHeader, Panel, Stat, Warn } from "@/components/fi/primitives";
import { Input, tooltipStyle } from "@/components/fi/ui";
import { compoundGrowth, tradeMetrics } from "@/lib/finance";
import { fmtBRL, fmtNum, fmtPct, tone } from "@/lib/format";
import { logCalc } from "@/lib/audit-log";

export const Route = createFileRoute("/quant")({
  head: () => ({
    meta: [
      { title: "Quant Lab — Finance Intelligence" },
      { name: "description", content: "Laboratório quantitativo: estatísticas de operações e simulação de crescimento composto (hipotético)." },
      { property: "og:title", content: "Quant Lab — Finance Intelligence" },
      { property: "og:description", content: "Estatísticas de trade e simulações hipotéticas com fórmulas abertas." },
    ],
  }),
  component: Page,
});

const n = (v: string) => Number(v.replace(",", "."));

function Page() {
  const [t, setT] = useState({ trades: "100", wins: "55", losses: "45", avgGain: "320", avgLoss: "-210", cost: "8" });
  const [g, setG] = useState({ initial: "10000", rate: "1", periods: "36", contrib: "500" });

  const tm = useMemo(() => {
    try { return { r: tradeMetrics({ trades: n(t.trades), wins: n(t.wins), losses: n(t.losses), avgGain: n(t.avgGain), avgLoss: n(t.avgLoss), costPerTrade: n(t.cost) }) }; }
    catch (e) { return { error: (e as Error).message }; }
  }, [t]);
  const gr = useMemo(() => {
    try {
      const vals = [n(g.initial), n(g.rate), n(g.periods), n(g.contrib)];
      if (vals.some((v) => !Number.isFinite(v))) throw new Error("Preencha todos os campos com números.");
      if (vals[0]! < 0) throw new Error("Capital inicial deve ser ≥ 0.");
      if (vals[2]! > 600) throw new Error("Máximo de 600 períodos.");
      return { r: compoundGrowth(vals[0]!, vals[1]! / 100, vals[2]!, vals[3]!) };
    } catch (e) { return { error: (e as Error).message }; }
  }, [g]);

  useEffect(() => { if (tm.r) logCalc({ module: "Quant Lab", action: "Métricas de operações", inputs: JSON.stringify(t), result: `líquido=${fmtNum(tm.r.net)}; expectativa=${fmtNum(tm.r.expectancy)}` }); }, [tm, t]);
  useEffect(() => { if (gr.r) logCalc({ module: "Quant Lab", action: "Crescimento composto", inputs: JSON.stringify(g), result: `final=${fmtNum(gr.r.final)}` }); }, [gr, g]);

  const totalContrib = n(g.initial) + n(g.contrib) * n(g.periods);
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader eyebrow="Módulo 05 · Quant Lab" title="Laboratório quantitativo" desc="Ferramentas hipotéticas para estudo. Resultados passados ou simulados não garantem resultados futuros." actions={<DemoTag label="HIPOTÉTICO" />} />
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Estatísticas de operações" eyebrow="Valores em R$ por operação">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {([["trades", "Operações"], ["wins", "Ganhadoras"], ["losses", "Perdedoras"], ["avgGain", "Ganho médio"], ["avgLoss", "Perda média"], ["cost", "Custo/operação"]] as const).map(([k, l]) => (
              <Field key={k} label={l}><Input inputMode="decimal" value={t[k]} onChange={(e) => setT({ ...t, [k]: e.target.value })} /></Field>
            ))}
          </div>
          <div className="mt-4">
            {tm.error ? <Warn tone="error">{tm.error}</Warn> : tm.r && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <Stat label="Resultado líquido" value={fmtBRL(tm.r.net)} valueClass={tone(tm.r.net)} />
                  <Stat label="Expectativa/operação" value={fmtBRL(tm.r.expectancy)} valueClass={tone(tm.r.expectancy)} />
                </div>
                <div className="mt-3">
                  <Formula name="Taxa de acerto" expr={`${t.wins} / ${t.trades}`} result={fmtPct(tm.r.winRate)} />
                  <Formula name="Lucro bruto" expr={`${t.wins} × ${t.avgGain}`} result={fmtBRL(tm.r.grossProfit)} />
                  <Formula name="Prejuízo bruto" expr={`${t.losses} × |${t.avgLoss}|`} result={fmtBRL(tm.r.grossLoss)} />
                  <Formula name="Custos" expr={`${t.trades} × ${t.cost}`} result={fmtBRL(tm.r.costs)} />
                  <Formula name="Fator de lucro" expr="lucro bruto / prejuízo bruto" result={tm.r.profitFactor === null ? "indefinido (sem perdas)" : fmtNum(tm.r.profitFactor)} />
                  <Formula name="Payoff" expr="ganho médio / |perda média|" result={tm.r.payoff === null ? "indefinido" : fmtNum(tm.r.payoff)} />
                </div>
              </>
            )}
          </div>
        </Panel>
        <Panel title="Crescimento composto" eyebrow="Taxa constante hipotética">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Field label="Capital inicial"><Input value={g.initial} onChange={(e) => setG({ ...g, initial: e.target.value })} /></Field>
            <Field label="Taxa/período (%)"><Input value={g.rate} onChange={(e) => setG({ ...g, rate: e.target.value })} /></Field>
            <Field label="Períodos"><Input value={g.periods} onChange={(e) => setG({ ...g, periods: e.target.value })} /></Field>
            <Field label="Aporte/período"><Input value={g.contrib} onChange={(e) => setG({ ...g, contrib: e.target.value })} /></Field>
          </div>
          <div className="mt-4">
            {gr.error ? <Warn tone="error">{gr.error}</Warn> : gr.r && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <Stat label="Valor final (composto)" value={fmtBRL(gr.r.final)} />
                  <Stat label="Total aportado" value={fmtBRL(totalContrib)} sub={`Rendimento: ${fmtBRL(gr.r.final - totalContrib)}`} />
                </div>
                <div className="mt-3 h-48">
                  <ResponsiveContainer>
                    <LineChart data={gr.r.path.map((v, i) => ({ i, v }))}>
                      <CartesianGrid stroke="var(--border)" vertical={false} />
                      <XAxis dataKey="i" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
                      <YAxis width={70} tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
                      <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => fmtBRL(v)} />
                      <Line dataKey="v" stroke="var(--gold)" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <Formula name="Recorrência" expr="V(t+1) = V(t) × (1 + r) + aporte" result={fmtBRL(gr.r.final)} />
                <Formula name="Sem aportes, juros simples (ref.)" expr="V0 × (1 + r × n)" result={fmtBRL(gr.r.simpleFinal)} />
              </>
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}
