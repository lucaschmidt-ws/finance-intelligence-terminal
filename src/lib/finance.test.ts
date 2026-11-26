import { describe, expect, it } from "vitest";
import { annualizedVol, compoundGrowth, fundamentalMetrics, maxDrawdown, mean, parseSeries, sharpe, simpleReturn, stdev, tradeMetrics } from "./finance";
import { ALPHA } from "./data";
import { portfolioSummary } from "./portfolio-store";

describe("fundamentos ALPHA", () => {
  const f = fundamentalMetrics(ALPHA);
  it("P/L 4,40x", () => expect(f.pe).toBeCloseTo(600 / 136.5, 6));
  it("ROE 22,75%", () => expect(f.roe).toBeCloseTo(0.2275, 6));
  it("P/VP 1,00x e DY 6%", () => { expect(f.pb).toBeCloseTo(1, 6); expect(f.dy).toBeCloseTo(0.06, 6); });
  it("Dív.líq/EBITDA", () => expect(f.netDebtEbitda).toBeCloseTo(180 / 220, 6));
});

describe("retornos e risco", () => {
  it("retorno simples", () => expect(simpleReturn(100, 110)).toBeCloseTo(0.1, 10));
  it("inicial zero falha", () => expect(() => simpleReturn(0, 1)).toThrow());
  it("média vazia falha", () => expect(() => mean([])).toThrow());
  it("desvio amostral", () => expect(stdev([2, 4, 4, 4, 5, 5, 7, 9])).toBeCloseTo(2.13809, 4));
  it("desvio com 1 ponto falha", () => expect(() => stdev([1])).toThrow());
  it("vol anualizada mensal", () => expect(annualizedVol([0.01, -0.01], 12)).toBeCloseTo(Math.SQRT2 * 0.01 * Math.sqrt(12), 8));
  it("drawdown conhecido", () => { const r = maxDrawdown([100, 120, 90, 130]); expect(r.mdd).toBeCloseTo(-0.25, 10); expect(r.peakIdx).toBe(1); expect(r.troughIdx).toBe(2); });
  it("drawdown com valor ≤0 falha", () => expect(() => maxDrawdown([100, 0])).toThrow());
  it("Sharpe com desvio zero falha", () => expect(() => sharpe([0.01, 0.01, 0.01], 0, 12)).toThrow());
  it("Sharpe sem rf", () => expect(sharpe([0.02, 0], 0, 12)).toBeCloseTo((0.01 / Math.sqrt(0.0002)) * Math.sqrt(12), 6));
});

describe("trades", () => {
  it("métricas", () => {
    const r = tradeMetrics({ trades: 10, wins: 6, losses: 4, avgGain: 100, avgLoss: -50, costPerTrade: 2 });
    expect(r.winRate).toBe(0.6); expect(r.profitFactor).toBe(3); expect(r.payoff).toBe(2); expect(r.net).toBe(380); expect(r.expectancy).toBe(38);
  });
  it("ganhos+perdas ≠ total falha", () => expect(() => tradeMetrics({ trades: 10, wins: 5, losses: 4, avgGain: 1, avgLoss: 1, costPerTrade: 0 })).toThrow());
  it("sem perdas → fator nulo", () => expect(tradeMetrics({ trades: 2, wins: 2, losses: 0, avgGain: 1, avgLoss: 0, costPerTrade: 0 }).profitFactor).toBeNull());
  it("composto", () => { const g = compoundGrowth(1000, 0.1, 2); expect(g.final).toBeCloseTo(1210, 8); expect(g.simpleFinal).toBe(1200); });
});

describe("parseSeries", () => {
  it("vírgula+espaço", () => expect(parseSeries("1, 2.5, 3").values).toEqual([1, 2.5, 3]));
  it("pt-BR com milhar", () => expect(parseSeries("1.234,5\n10,25").values).toEqual([1234.5, 10.25]));
  it("percentual", () => expect(parseSeries("5%; 2%").values).toEqual([5, 2]));
  it("token inválido", () => expect(parseSeries("1, abc").errors).toHaveLength(1));
});

describe("portfolioSummary", () => {
  it("pesos e resultado", () => {
    const s = portfolioSummary([{ id: "a", ticker: "A", cls: "Ações BR", qty: 10, avgCost: 8, price: 10 }, { id: "b", ticker: "B", cls: "FIIs", qty: 10, avgCost: 10, price: 30 }]);
    expect(s.total).toBe(400); expect(s.pl).toBe(220); expect(s.rows[0]!.weight).toBe(0.25);
  });
});
