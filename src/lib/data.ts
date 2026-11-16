/**
 * DEMO DATA PROVIDER — all values are illustrative/simulated.
 * Extension point: implement `MarketDataProvider` against a verified vendor
 * (server-side, via createServerFn) and swap `demoProvider` in `getProvider()`.
 */
export type AssetClass = "Ações BR" | "FIIs" | "ETFs" | "Internacional" | "Cripto" | "Renda fixa";
export const ASSET_CLASSES: AssetClass[] = ["Ações BR", "FIIs", "ETFs", "Internacional", "Cripto", "Renda fixa"];

export interface Asset {
  ticker: string; name: string; cls: AssetClass; currency: "BRL" | "USD";
  price: number; change: number; sector: string; description: string;
}

export const UNIVERSE: Asset[] = [
  { ticker: "PETR4", name: "Petrobras PN", cls: "Ações BR", currency: "BRL", price: 37.42, change: 0.0081, sector: "Petróleo e gás", description: "Companhia integrada de energia com foco em exploração e produção em águas profundas." },
  { ticker: "VALE3", name: "Vale ON", cls: "Ações BR", currency: "BRL", price: 61.15, change: -0.0124, sector: "Mineração", description: "Mineradora com exposição relevante a minério de ferro e metais básicos." },
  { ticker: "ITUB4", name: "Itaú Unibanco PN", cls: "Ações BR", currency: "BRL", price: 34.9, change: 0.0043, sector: "Bancos", description: "Instituição financeira com atuação em varejo, atacado e gestão de recursos." },
  { ticker: "BOVA11", name: "iShares Ibovespa", cls: "ETFs", currency: "BRL", price: 124.3, change: 0.0019, sector: "Índice amplo", description: "ETF que replica o Ibovespa." },
  { ticker: "HGLG11", name: "CSHG Logística FII", cls: "FIIs", currency: "BRL", price: 158.2, change: -0.0031, sector: "Logística", description: "Fundo imobiliário de galpões logísticos." },
  { ticker: "BTC", name: "Bitcoin", cls: "Cripto", currency: "USD", price: 67250, change: 0.0215, sector: "Criptoativo", description: "Criptoativo descentralizado com oferta limitada." },
  { ticker: "ETH", name: "Ethereum", cls: "Cripto", currency: "USD", price: 3410, change: -0.0172, sector: "Criptoativo", description: "Plataforma de contratos inteligentes e seu token nativo." },
  { ticker: "AAPL", name: "Apple Inc.", cls: "Internacional", currency: "USD", price: 228.4, change: 0.0062, sector: "Tecnologia", description: "Fabricante de hardware, software e serviços de consumo." },
  { ticker: "MSFT", name: "Microsoft Corp.", cls: "Internacional", currency: "USD", price: 421.7, change: 0.0034, sector: "Tecnologia", description: "Software, nuvem e produtividade corporativa." },
  { ticker: "ALPHA3", name: "ALPHA S.A. (fictícia)", cls: "Ações BR", currency: "BRL", price: 25, change: 0, sector: "Industrial (fictício)", description: "Companhia fictícia criada para fins educacionais de análise fundamentalista." },
];

export const findAsset = (q: string) => {
  const s = q.trim().toUpperCase();
  return UNIVERSE.find((a) => a.ticker === s) ?? UNIVERSE.find((a) => a.ticker.startsWith(s) || a.name.toUpperCase().includes(s));
};

export const DATASET_META = {
  id: "DEMO-ALPHA-2026.1",
  source: "Gerado internamente (dataset sintético)",
  classification: "SIMULADO" as const,
  createdAt: "2026-01-15T09:00:00-03:00",
  updatedAt: "2026-11-10T18:00:00-03:00",
  liveFeed: false,
};

export const ALPHA = {
  name: "ALPHA S.A.",
  ticker: "ALPHA3",
  years: [2024, 2025, 2026],
  revenue: [800, 920, 1050],
  ebitda: [160, 190, 220],
  netIncome: [80, 110, 136.5],
  equity: [500, 550, 600],
  netDebt: [200, 190, 180],
  price: 25,
  shares: 24, // milhões
  dps: 1.5,
};

export const DASH_KPIS = {
  patrimonio: 248650,
  retorno: 0.0842,
  vol: 0.128,
  mdd: -0.063,
};

export const ALLOCATION: { name: AssetClass; value: number }[] = [
  { name: "Ações BR", value: 35 }, { name: "FIIs", value: 20 }, { name: "ETFs", value: 15 },
  { name: "Internacional", value: 15 }, { name: "Cripto", value: 10 }, { name: "Renda fixa", value: 5 },
];

/** Deterministic illustrative series (seeded LCG — no randomness at module scope). */
export function performanceSeries(days: number) {
  let seed = 42 + days;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) - 0.5;
  const end = DASH_KPIS.patrimonio;
  const start = end / (1 + DASH_KPIS.retorno * (days / 365));
  const out: { d: string; carteira: number; bench: number }[] = [];
  let noise = 0, bNoise = 0;
  const base = new Date("2026-11-16T00:00:00Z").getTime();
  for (let i = 0; i <= days; i++) {
    noise = noise * 0.9 + rnd() * 0.012;
    bNoise = bNoise * 0.9 + rnd() * 0.014;
    const t = i / days;
    const trend = start + (end - start) * t;
    const date = new Date(base - (days - i) * 86400000);
    out.push({
      d: date.toISOString().slice(0, 10),
      carteira: Math.round(i === days ? end : trend * (1 + noise)),
      bench: Math.round(start * (1 + 0.06 * (days / 365) * t) * (1 + bNoise)),
    });
  }
  return out;
}

export const RESEARCH_ACTIVITY = [
  { when: "16/11 14:20", ticker: "ALPHA3", title: "Atualização de múltiplos — exercício 2026", tag: "Fundamentos" },
  { when: "15/11 10:05", ticker: "HGLG11", title: "Revisão de vacância e cap rate implícito", tag: "FIIs" },
  { when: "13/11 17:42", ticker: "BTC", title: "Volatilidade realizada 30d vs. 90d", tag: "Quant" },
  { when: "12/11 09:15", ticker: "ITUB4", title: "Sensibilidade de margem financeira à Selic", tag: "Macro" },
];

export interface Holding { id: string; ticker: string; cls: AssetClass; qty: number; avgCost: number; price: number; }
export const SAMPLE_HOLDINGS: Holding[] = [
  { id: "h1", ticker: "PETR4", cls: "Ações BR", qty: 900, avgCost: 31.8, price: 37.42 },
  { id: "h2", ticker: "ITUB4", cls: "Ações BR", qty: 1000, avgCost: 30.2, price: 34.9 },
  { id: "h3", ticker: "VALE3", cls: "Ações BR", qty: 300, avgCost: 66.5, price: 61.15 },
  { id: "h4", ticker: "HGLG11", cls: "FIIs", qty: 310, avgCost: 152.4, price: 158.2 },
  { id: "h5", ticker: "BOVA11", cls: "ETFs", qty: 300, avgCost: 118.9, price: 124.3 },
  { id: "h6", ticker: "AAPL", cls: "Internacional", qty: 30, avgCost: 1050, price: 1245.6 },
  { id: "h7", ticker: "BTC", cls: "Cripto", qty: 0.07, avgCost: 310000, price: 366700 },
  { id: "h8", ticker: "TESOURO IPCA+", cls: "Renda fixa", qty: 4, avgCost: 3000, price: 3105 },
];
