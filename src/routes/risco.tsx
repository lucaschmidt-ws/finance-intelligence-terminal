import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ReferenceDot, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DemoTag, Field, Formula, PageHeader, Panel, Stat, Warn } from "@/components/fi/primitives";
import { Btn, Input, Segmented, TextArea, tooltipStyle } from "@/components/fi/ui";
import { performanceSeries } from "@/lib/data";
import { annualizedVol, maxDrawdown, mean, parseSeries, returnsFromCurve, sharpe, stdev } from "@/lib/finance";
import { fmtNum, fmtPct, tone } from "@/lib/format";
import { logCalc } from "@/lib/audit-log";

export const Route = createFileRoute("/risco")({
  head: () => ({
    meta: [
      { title: "Risco — Finance Intelligence" },
      { name: "description", content: "Volatilidade anualizada, drawdown máximo e índice de Sharpe com fórmulas transparentes (dados simulados)." },
      { property: "og:title", content: "Risco — Finance Intelligence" },
      { property: "og:description", content: "Métricas de risco auditáveis em ambiente demonstrativo." },
    ],
  }),
  component: Page,
});

const demoCurve = () => performanceSeries(180).filter((_, i) => i % 5 === 0).map((p) => p.carteira).join("\n");

function Page() {
  const [text, setText] = useState(demoCurve);
  const [mode, setMode] = useState<"curve" | "returns">("curve");
  const [ppy, setPpy] = useState<"252" | "52" | "12">("52");
  const [rf, setRf] = useState("10,75");

  const res = useMemo(() => {
    const { values, errors } = parseSeries(text);
    if (errors.length) return { error: errors.slice(0, 3).join(" · ") };
    const rfA = Number(rf.replace(",", ".")) / 100;
    if (!Number.isFinite(rfA)) return { error: "Taxa livre de risco inválida." };
    try {
      const p = Number(ppy);
      const curve = mode === "curve" ? values : values.reduce((a, r) => [...a, a[a.length - 1]! * (1 + r / 100)], [100]);
      const rets = mode === "curve" ? returnsFromCurve(values) : values.map((v) => v / 100);
      const dd = maxDrawdown(curve);
      const sd = stdev(rets);
      let sh: number | null = null, shErr: string | null = null;
      try { sh = sharpe(rets, rfA, p); } catch (e) { shErr = (e as Error).message; }
      return { n: rets.length, m: mean(rets), sd, vol: annualizedVol(rets, p), dd, sh, shErr, curve, p, rfA, total: curve[curve.length - 1]! / curve[0]! - 1 };
    } catch (e) { return { error: (e as Error).message }; }
  }, [text, mode, ppy, rf]);

  useEffect(() => {
    if ("vol" in res && res.vol !== undefined) logCalc({ module: "Risco", action: "Métricas de risco", inputs: `n=${res.n}; p=${res.p}; rf=${fmtPct(res.rfA)}`, result: `vol=${fmtPct(res.vol)}; mdd=${fmtPct(res.dd.mdd)}; sharpe=${res.sh === null ? "indef." : fmtNum(res.sh)}` });
  }, [res]);

  const chart = "curve" in res && res.curve ? res.curve.map((v, i) => ({ i, v })) : [];
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader eyebrow="Módulo 04 · Risco" title="Análise de risco" desc="Cole uma curva de patrimônio ou série de retornos. Cálculos em precisão decimal; nenhuma métrica implica recomendação." actions={<DemoTag />} />
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Entrada" eyebrow="Separe por quebra de linha ou ponto e vírgula">
          <div className="space-y-3">
            <Segmented label="Tipo" value={mode} onChange={setMode} options={[{ v: "curve", l: "Curva (valores)" }, { v: "returns", l: "Retornos (%)" }]} />
            <TextArea aria-label="Série" rows={10} value={text} onChange={(e) => setText(e.target.value)} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Periodicidade"><Segmented label="Periodicidade" value={ppy} onChange={setPpy} options={[{ v: "252", l: "Diária" }, { v: "52", l: "Semanal" }, { v: "12", l: "Mensal" }]} /></Field>
              <Field label="Livre de risco a.a. (%)" hint="Parâmetro editável"><Input value={rf} onChange={(e) => setRf(e.target.value)} /></Field>
            </div>
            <Btn onClick={() => { setMode("curve"); setText(demoCurve()); }}>Usar série demo (semanal, 26 semanas)</Btn>
          </div>
        </Panel>
        <div className="space-y-4 lg:col-span-2">
          {"error" in res ? <Warn tone="error">{res.error}</Warn> : (
            <>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <Stat label="Retorno total" value={fmtPct(res.total, 2, true)} valueClass={tone(res.total)} sub={`${res.n} períodos`} />
                <Stat label="Vol. anualizada" value={fmtPct(res.vol)} />
                <Stat label="Drawdown máximo" value={fmtPct(res.dd.mdd)} valueClass="text-negative" sub={`Pico #${res.dd.peakIdx + 1} → vale #${res.dd.troughIdx + 1}`} />
                <Stat label="Sharpe" value={res.sh === null ? "—" : fmtNum(res.sh)} sub={res.shErr ?? "Anualizado"} />
              </div>
              <Panel title="Curva e drawdown" eyebrow={mode === "curve" ? "Valores informados" : "Curva reconstruída (base 100)"}>
                <div className="h-64">
                  <ResponsiveContainer>
                    <AreaChart data={chart}>
                      <CartesianGrid stroke="var(--border)" vertical={false} />
                      <XAxis dataKey="i" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
                      <YAxis domain={["auto", "auto"]} width={70} tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
                      <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => fmtNum(v)} />
                      <Area dataKey="v" stroke="var(--gold)" fill="var(--gold-dim)" />
                      <ReferenceDot x={res.dd.peakIdx} y={res.curve[res.dd.peakIdx] ?? 0} r={4} fill="var(--positive)" />
                      <ReferenceDot x={res.dd.troughIdx} y={res.curve[res.dd.troughIdx] ?? 0} r={4} fill="var(--negative)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Panel>
              <Panel title="Memória de cálculo" eyebrow="Fórmulas e substituição">
                <Formula name="Retorno médio por período" expr="Σ rᵢ / n" result={fmtPct(res.m, 4)} />
                <Formula name="Desvio-padrão amostral" expr="√[Σ(rᵢ − r̄)² / (n−1)]" result={fmtPct(res.sd, 4)} />
                <Formula name="Volatilidade anualizada" expr={`${fmtPct(res.sd, 4)} × √${res.p}`} result={fmtPct(res.vol)} />
                <Formula name="Drawdown máximo" expr={`${fmtNum(res.curve[res.dd.troughIdx]!)} / ${fmtNum(res.curve[res.dd.peakIdx]!)} − 1`} result={fmtPct(res.dd.mdd)} />
                <Formula name="Sharpe" expr={`rf_p = (1 + ${fmtPct(res.rfA)})^(1/${res.p}) − 1; média(r − rf_p)/σ × √${res.p}`} result={res.sh === null ? "indefinido" : fmtNum(res.sh)} />
              </Panel>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
