import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Plus, RotateCcw, Trash2 } from "lucide-react";
import { DemoTag, Field, PageHeader, Panel, Stat, Warn } from "@/components/fi/primitives";
import { Btn, CHART_COLORS, Input, inputCls, tooltipStyle } from "@/components/fi/ui";
import { ASSET_CLASSES, FX_DEMO, priceBRL, type AssetClass } from "@/lib/data";
import { portfolioSummary, usePortfolio } from "@/lib/portfolio-store";
import { fmtBRL, fmtNum, fmtPct, tone } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/carteira")({
  head: () => ({
    meta: [
      { title: "Carteira — Finance Intelligence" },
      { name: "description", content: "Carteira modelo editável com posições, resultado, pesos e alocação por classe (dados simulados)." },
      { property: "og:title", content: "Carteira — Finance Intelligence" },
      { property: "og:description", content: "Gestão de carteira modelo em ambiente demonstrativo." },
    ],
  }),
  component: Page,
});

export const CONCENTRATION_LIMIT = 0.25;

function Page() {
  const { holdings, setHoldings, reset } = usePortfolio();
  const s = useMemo(() => portfolioSummary(holdings), [holdings]);
  const [form, setForm] = useState({ ticker: "", cls: "Ações BR" as AssetClass, qty: "", avgCost: "", price: "" });
  const [err, setErr] = useState<string | null>(null);
  const num = (v: string) => Number(v.replace(",", "."));

  const add = () => {
    const t = form.ticker.trim().toUpperCase(), qty = num(form.qty), cost = num(form.avgCost);
    const price = form.price ? num(form.price) : priceBRL(t);
    if (!t) return setErr("Informe o ticker.");
    if (!(qty > 0)) return setErr("Quantidade deve ser maior que zero.");
    if (!(cost >= 0) || !form.avgCost) return setErr("Custo médio deve ser ≥ 0.");
    if (price === undefined || !(price > 0)) return setErr("Ticker fora do universo demo: informe o preço manualmente.");
    setErr(null);
    setHoldings([...holdings, { id: crypto.randomUUID(), ticker: t, cls: form.cls, qty, avgCost: cost, price }]);
    setForm({ ...form, ticker: "", qty: "", avgCost: "", price: "" });
  };
  const update = (id: string, k: "qty" | "avgCost" | "price", v: string) => {
    const n = num(v);
    if (!Number.isFinite(n) || n < 0) return;
    setHoldings(holdings.map((h) => (h.id === id ? { ...h, [k]: n } : h)));
  };
  const concentrated = s.rows.filter((r) => r.weight > CONCENTRATION_LIMIT);

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader eyebrow="Módulo 03 · Carteira" title="Carteira modelo" desc="Posições editáveis salvas apenas neste navegador. Preços ilustrativos; ativos em USD convertidos por câmbio simulado." actions={<DemoTag />} />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Valor de mercado" value={fmtBRL(s.total)} sub="Preços simulados" />
        <Stat label="Custo total" value={fmtBRL(s.totalCost)} />
        <Stat label="Resultado" value={fmtBRL(s.pl)} valueClass={tone(s.pl)} sub={s.totalCost ? fmtPct(s.pl / s.totalCost, 2, true) : "—"} />
        <Stat label="Posições" value={s.rows.length} sub={`USD/BRL simulado: ${fmtNum(FX_DEMO)}`} />
      </div>
      {concentrated.length > 0 && (
        <div className="mt-3"><Warn>Concentração acima de {fmtPct(CONCENTRATION_LIMIT, 0)} em: {concentrated.map((r) => `${r.ticker} (${fmtPct(r.weight, 1)})`).join(", ")}. Indicador informativo, não constitui recomendação.</Warn></div>
      )}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2" title="Posições" eyebrow="Editável" bodyClass="p-0 overflow-x-auto"
          actions={<Btn onClick={reset}><RotateCcw className="size-3" /> Restaurar exemplo</Btn>}>
          <table className="w-full min-w-[720px] text-sm">
            <thead><tr className="border-b">{["Ativo", "Classe", "Qtd", "Custo médio", "Preço (R$)", "Valor", "Resultado", "Peso", ""].map((h, i) => <th key={i} className={cn("eyebrow px-3 py-2 font-normal", i > 1 ? "text-right" : "text-left")}>{h}</th>)}</tr></thead>
            <tbody>
              {s.rows.map((r) => (
                <tr key={r.id} className="border-b last:border-0">
                  <td className="px-3 py-1.5 font-mono text-foreground">{r.ticker}</td>
                  <td className="px-3 py-1.5 text-xs text-muted-foreground">{r.cls}</td>
                  {(["qty", "avgCost", "price"] as const).map((k) => (
                    <td key={k} className="px-1 py-1"><Input key={`${r.id}-${k}-${r[k]}`} aria-label={`${k} ${r.ticker}`} className="w-24 text-right" type="number" min={0} step="any" defaultValue={r[k]} onBlur={(e) => update(r.id, k, e.target.value)} /></td>
                  ))}
                  <td className="num px-3 py-1.5 text-right">{fmtBRL(r.value)}</td>
                  <td className={cn("num px-3 py-1.5 text-right", tone(r.pl))}>{fmtPct(r.plPct, 1, true)}</td>
                  <td className="num px-3 py-1.5 text-right">{fmtPct(r.weight, 1)}</td>
                  <td className="px-2"><button aria-label={`Remover ${r.ticker}`} onClick={() => setHoldings(holdings.filter((h) => h.id !== r.id))} className="text-faint hover:text-negative"><Trash2 className="size-3.5" /></button></td>
                </tr>
              ))}
              {s.rows.length === 0 && <tr><td colSpan={9} className="px-3 py-6 text-center text-xs text-muted-foreground">Carteira vazia. Adicione uma posição ou restaure o exemplo.</td></tr>}
            </tbody>
          </table>
        </Panel>
        <Panel title="Alocação por classe" eyebrow="Peso = valor / total">
          <div className="h-48">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={s.allocation} dataKey="value" nameKey="name" innerRadius={48} outerRadius={74} stroke="var(--panel)" strokeWidth={2}>
                  {s.allocation.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % 6]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => fmtBRL(v)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="space-y-1.5">
            {s.allocation.map((a, i) => (
              <li key={a.name} className="flex justify-between text-sm"><span className="flex items-center gap-2 text-muted-foreground"><span className="size-2 rounded-sm" style={{ background: CHART_COLORS[i % 6] }} />{a.name}</span><span className="num">{fmtPct(a.weight, 1)}</span></li>
            ))}
          </ul>
        </Panel>
      </div>
      <Panel className="mt-4" title="Adicionar posição" eyebrow="Ticker do universo demo preenche o preço automaticamente">
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Field label="Ticker"><input className={inputCls} value={form.ticker} onChange={(e) => setForm({ ...form, ticker: e.target.value })} placeholder="PETR4" /></Field>
          <Field label="Classe"><select className={inputCls} value={form.cls} onChange={(e) => setForm({ ...form, cls: e.target.value as AssetClass })}>{ASSET_CLASSES.map((c) => <option key={c}>{c}</option>)}</select></Field>
          <Field label="Quantidade"><Input inputMode="decimal" value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })} /></Field>
          <Field label="Custo médio (R$)"><Input inputMode="decimal" value={form.avgCost} onChange={(e) => setForm({ ...form, avgCost: e.target.value })} /></Field>
          <Field label="Preço (R$)" hint="Opcional p/ universo demo"><Input inputMode="decimal" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></Field>
          <div className="flex items-end"><Btn variant="gold" onClick={add}><Plus className="size-3" /> Adicionar</Btn></div>
        </div>
        {err && <div className="mt-3"><Warn tone="error">{err}</Warn></div>}
      </Panel>
    </div>
  );
}
