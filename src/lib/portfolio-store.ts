import { useCallback, useEffect, useState } from "react";
import { SAMPLE_HOLDINGS, type Holding } from "./data";

const KEY = "fi.portfolio.v1";

export function usePortfolio() {
  const [holdings, setHoldings] = useState<Holding[]>(SAMPLE_HOLDINGS);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setHoldings(JSON.parse(raw));
    } catch { /* ignore */ }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded) localStorage.setItem(KEY, JSON.stringify(holdings));
  }, [holdings, loaded]);
  const reset = useCallback(() => setHoldings(SAMPLE_HOLDINGS), []);
  return { holdings, setHoldings, reset };
}

export function portfolioSummary(h: Holding[]) {
  const rows = h.map((x) => {
    const value = x.qty * x.price, cost = x.qty * x.avgCost;
    return { ...x, value, cost, pl: value - cost, plPct: cost ? (value - cost) / cost : 0 };
  });
  const total = rows.reduce((a, r) => a + r.value, 0);
  const totalCost = rows.reduce((a, r) => a + r.cost, 0);
  const byClass = new Map<string, number>();
  rows.forEach((r) => byClass.set(r.cls, (byClass.get(r.cls) ?? 0) + r.value));
  return {
    rows: rows.map((r) => ({ ...r, weight: total ? r.value / total : 0 })),
    total, totalCost, pl: total - totalCost,
    allocation: [...byClass.entries()].map(([name, v]) => ({ name, value: v, weight: total ? v / total : 0 })),
  };
}
