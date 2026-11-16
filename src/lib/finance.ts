import Decimal from "decimal.js";

Decimal.set({ precision: 28, rounding: Decimal.ROUND_HALF_UP });
export { Decimal };
const D = (v: Decimal.Value) => new Decimal(v);

/** Parse numbers separated by comma-space, semicolon or newline. Accepts pt-BR decimal comma when using ';' / newlines. */
export function parseSeries(input: string): { values: number[]; errors: string[] } {
  const errors: string[] = [];
  const raw = input.trim();
  if (!raw) return { values: [], errors: ["Nenhum valor informado."] };
  // If there are newlines or semicolons, treat commas as decimal separators.
  const tokens = /[\n;]/.test(raw)
    ? raw.split(/[\n;]+/).map((t) => t.trim().replace(/\s/g, "").replace(",", "."))
    : raw.split(/[,\s]+/).map((t) => t.trim());
  const values: number[] = [];
  tokens.filter(Boolean).forEach((t, i) => {
    const clean = t.replace("%", "");
    const n = Number(clean);
    if (!Number.isFinite(n)) errors.push(`Valor inválido na posição ${i + 1}: "${t}"`);
    else values.push(n);
  });
  return { values, errors };
}

export function simpleReturn(initial: number, final: number) {
  if (initial <= 0) throw new Error("Valor inicial deve ser maior que zero.");
  return D(final).minus(initial).div(initial).toNumber();
}

export function mean(xs: number[]) {
  return xs.reduce((a, x) => a.plus(x), D(0)).div(xs.length).toNumber();
}

/** Sample standard deviation (n-1). */
export function stdev(xs: number[]) {
  if (xs.length < 2) throw new Error("São necessários ao menos 2 retornos.");
  const m = D(mean(xs));
  const ss = xs.reduce((a, x) => a.plus(D(x).minus(m).pow(2)), D(0));
  return ss.div(xs.length - 1).sqrt().toNumber();
}

export function annualizedVol(returns: number[], periodsPerYear: number) {
  return D(stdev(returns)).times(D(periodsPerYear).sqrt()).toNumber();
}

export function maxDrawdown(curve: number[]) {
  if (curve.length < 2) throw new Error("Informe ao menos 2 pontos da curva.");
  if (curve.some((v) => v <= 0)) throw new Error("Valores da curva devem ser positivos.");
  let peak = curve[0]!, mdd = 0, peakIdx = 0, troughIdx = 0, curPeakIdx = 0;
  curve.forEach((v, i) => {
    if (v > peak) { peak = v; curPeakIdx = i; }
    const dd = D(v).minus(peak).div(peak).toNumber();
    if (dd < mdd) { mdd = dd; peakIdx = curPeakIdx; troughIdx = i; }
  });
  return { mdd, peakIdx, troughIdx };
}

/** Annualized Sharpe from periodic returns and annual risk-free rate. */
export function sharpe(returns: number[], rfAnnual: number, periodsPerYear: number) {
  const rfPer = D(1).plus(rfAnnual).pow(D(1).div(periodsPerYear)).minus(1);
  const excess = returns.map((r) => D(r).minus(rfPer).toNumber());
  const sd = stdev(excess);
  if (sd === 0) throw new Error("Desvio-padrão zero: Sharpe indefinido.");
  return D(mean(excess)).div(sd).times(D(periodsPerYear).sqrt()).toNumber();
}

export interface TradeStats {
  trades: number; wins: number; losses: number;
  avgGain: number; avgLoss: number; costPerTrade: number;
}
export function tradeMetrics(s: TradeStats) {
  if (s.wins + s.losses !== s.trades) throw new Error("Ganhos + perdas deve ser igual ao total de operações.");
  if (s.trades <= 0) throw new Error("Total de operações deve ser maior que zero.");
  const grossProfit = D(s.wins).times(s.avgGain);
  const grossLoss = D(s.losses).times(Math.abs(s.avgLoss));
  const gross = grossProfit.minus(grossLoss);
  const costs = D(s.trades).times(s.costPerTrade);
  const net = gross.minus(costs);
  const winRate = D(s.wins).div(s.trades);
  const expectancy = net.div(s.trades);
  const profitFactor = grossLoss.isZero() ? null : grossProfit.div(grossLoss).toNumber();
  return {
    grossProfit: grossProfit.toNumber(), grossLoss: grossLoss.toNumber(),
    gross: gross.toNumber(), costs: costs.toNumber(), net: net.toNumber(),
    winRate: winRate.toNumber(), expectancy: expectancy.toNumber(), profitFactor,
  };
}

export interface Fundamentals {
  price: number; shares: number; dps: number; // shares in millions
  revenue: number[]; ebitda: number[]; netIncome: number[]; equity: number[]; netDebt: number[];
}
export function fundamentalMetrics(f: Fundamentals) {
  const last = f.revenue.length - 1;
  const g = (a: number[], i: number) => a[i] as number;
  const mcap = D(f.price).times(f.shares);
  const ni = D(g(f.netIncome, last));
  return {
    marketCap: mcap.toNumber(),
    pe: mcap.div(ni).toNumber(),
    pb: mcap.div(g(f.equity, last)).toNumber(),
    roe: ni.div(g(f.equity, last)).toNumber(),
    dy: D(f.dps).div(f.price).toNumber(),
    netDebtEbitda: D(g(f.netDebt, last)).div(g(f.ebitda, last)).toNumber(),
    revenueGrowth: D(g(f.revenue, last)).div(g(f.revenue, last - 1)).minus(1).toNumber(),
    netIncomeGrowth: ni.div(g(f.netIncome, last - 1)).minus(1).toNumber(),
    netMargin: ni.div(g(f.revenue, last)).toNumber(),
    ebitdaMargin: D(g(f.ebitda, last)).div(g(f.revenue, last)).toNumber(),
  };
}
