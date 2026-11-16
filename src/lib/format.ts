const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
export const fmtBRL = (v: number) => brl.format(v);
export const fmtNum = (v: number, d = 2) =>
  new Intl.NumberFormat("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d }).format(v);
export const fmtPct = (v: number, d = 2, sign = false) =>
  `${sign && v > 0 ? "+" : ""}${fmtNum(v * 100, d)}%`;
export const fmtX = (v: number, d = 2) => `${fmtNum(v, d)}x`;
export const tone = (v: number) => (v > 0 ? "text-positive" : v < 0 ? "text-negative" : "text-muted-foreground");
