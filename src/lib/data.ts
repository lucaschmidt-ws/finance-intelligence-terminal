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
  /** Câmbio USD/BRL SIMULADO, usado apenas para converter ativos em USD na carteira demo. */
  fxUsdBrl: 5.45,
};

export const FX_DEMO = DATASET_META.fxUsdBrl;

export const DATASETS = [
  { id: DATASET_META.id, name: "Universo de ativos e cotações ilustrativas", source: DATASET_META.source, classification: "SIMULADO", updatedAt: DATASET_META.updatedAt },
  { id: "DEMO-ALPHA-FIN-2024-2026", name: "Demonstrações ALPHA S.A. (fictícia)", source: "Construído para fins educacionais", classification: "FICTÍCIO", updatedAt: DATASET_META.updatedAt },
  { id: "DEMO-PORTFOLIO-01", name: "Carteira modelo de exemplo", source: "Gerado internamente", classification: "SIMULADO", updatedAt: DATASET_META.updatedAt },
  { id: "DEMO-FX-USDBRL", name: `Câmbio USD/BRL fixo (${DATASET_META.fxUsdBrl})`, source: "Parâmetro de demonstração", classification: "SIMULADO", updatedAt: DATASET_META.updatedAt },
];

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
  get patrimonio() { return SAMPLE_TOTAL; },
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
/** Preço em BRL: ativos em USD convertidos pelo câmbio simulado FX_DEMO. */
export const priceBRL = (ticker: string) => {
  const a = UNIVERSE.find((x) => x.ticker === ticker);
  if (!a) return undefined;
  return a.currency === "USD" ? Math.round(a.price * FX_DEMO * 100) / 100 : a.price;
};
const h = (id: string, ticker: string, cls: AssetClass, qty: number, avgCost: number, price?: number): Holding =>
  ({ id, ticker, cls, qty, avgCost, price: price ?? priceBRL(ticker)! });
export const SAMPLE_HOLDINGS: Holding[] = [
  h("h1", "PETR4", "Ações BR", 900, 31.8),
  h("h2", "ITUB4", "Ações BR", 1000, 30.2),
  h("h3", "VALE3", "Ações BR", 300, 66.5),
  h("h4", "HGLG11", "FIIs", 310, 152.4),
  h("h5", "BOVA11", "ETFs", 300, 118.9),
  h("h6", "AAPL", "Internacional", 30, 1050),
  h("h7", "BTC", "Cripto", 0.07, 310000),
  h("h8", "TESOURO IPCA+", "Renda fixa", 4, 3000, 3105),
];
export const SAMPLE_TOTAL = Math.round(SAMPLE_HOLDINGS.reduce((a, x) => a + x.qty * x.price, 0) * 100) / 100;
