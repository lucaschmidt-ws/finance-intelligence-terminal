import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useMemo, useRef, useState, type ReactNode } from "react";
import { LayoutDashboard, Search, Briefcase, ShieldAlert, FlaskConical, FileText, ClipboardCheck, Bell, Menu, CircleUser, Info } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { UNIVERSE } from "@/lib/data";
import { cn } from "@/lib/utils";
import { fmtPct, tone } from "@/lib/format";

export const NAV = [
  { to: "/", label: "Visão Geral", icon: LayoutDashboard },
  { to: "/research", label: "Research", icon: Search },
  { to: "/carteira", label: "Carteira", icon: Briefcase },
  { to: "/risco", label: "Risco", icon: ShieldAlert },
  { to: "/quant", label: "Quant Lab", icon: FlaskConical },
  { to: "/relatorios", label: "Relatórios", icon: FileText },
  { to: "/auditoria", label: "Auditoria", icon: ClipboardCheck },
] as const;

function Brand() {
  return (
    <div className="flex items-center gap-3 px-5 py-5">
      <div className="grid size-9 place-items-center rounded-sm border border-gold/60 font-serif text-lg text-gold">FI</div>
      <div className="leading-tight">
        <div className="font-serif text-[0.95rem] tracking-[0.12em] text-foreground">FINANCE INTELLIGENCE</div>
        <div className="font-mono text-[0.55rem] tracking-[0.14em] text-muted-foreground">INSTITUTIONAL RESEARCH &amp; ANALYTICS</div>
      </div>
    </div>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex-1 px-3" aria-label="Módulos">
      <div className="eyebrow px-2 pb-2 pt-2">Módulos</div>
      <ul className="space-y-0.5">
        {NAV.map((n) => {
          const active = n.to === "/" ? path === "/" : path.startsWith(n.to);
          return (
            <li key={n.to}>
              <Link to={n.to} onClick={onNavigate}
                className={cn("group flex items-center gap-3 rounded-sm border-l-2 px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                  active ? "border-gold bg-panel-2 text-foreground" : "border-transparent text-muted-foreground hover:bg-panel hover:text-foreground")}>
                <n.icon className={cn("size-4", active ? "text-gold" : "text-faint group-hover:text-muted-foreground")} />
                {n.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function SideStatus() {
  return (
    <div className="m-3 rounded-sm border bg-panel p-3">
      <div className="flex items-center gap-2">
        <span className="size-1.5 rounded-full bg-gold" />
        <span className="font-mono text-[0.62rem] tracking-[0.14em] text-foreground">AMBIENTE DE ANÁLISE</span>
      </div>
      <div className="mt-1 pl-3.5 text-xs text-muted-foreground">Dados demonstrativos</div>
      <div className="mt-1 pl-3.5 font-mono text-[0.6rem] text-faint">Feed ao vivo: desconectado</div>
    </div>
  );
}

function TickerSearch() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const navigate = useNavigate();
  const ref = useRef<HTMLInputElement>(null);
  const results = useMemo(() => {
    const s = q.trim().toUpperCase();
    if (!s) return UNIVERSE.slice(0, 6);
    return UNIVERSE.filter((a) => a.ticker.includes(s) || a.name.toUpperCase().includes(s));
  }, [q]);
  const go = (ticker: string) => {
    setOpen(false); setQ(""); ref.current?.blur();
    navigate({ to: "/research", search: { ticker } });
  };
  return (
    <div className="relative w-full max-w-md">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint" />
      <input ref={ref} value={q} role="combobox" aria-expanded={open} aria-controls="ticker-results"
        aria-label="Buscar ativos ou tickers"
        onChange={(e) => { setQ(e.target.value); setOpen(true); setIdx(0); }}
        onFocus={() => setOpen(true)} onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") { e.preventDefault(); setIdx((i) => Math.min(i + 1, results.length - 1)); }
          if (e.key === "ArrowUp") { e.preventDefault(); setIdx((i) => Math.max(i - 1, 0)); }
          if (e.key === "Enter" && results[idx]) go(results[idx].ticker);
          if (e.key === "Escape") setOpen(false);
        }}
        placeholder="Buscar ativo ou ticker (ex.: PETR4, BTC, AAPL)"
        className="h-9 w-full rounded-sm border bg-panel pl-9 pr-3 text-sm text-foreground placeholder:text-faint focus:border-gold/60 focus:outline-none" />
      {open && (
        <ul id="ticker-results" role="listbox" className="absolute z-50 mt-1 w-full overflow-hidden rounded-sm border bg-popover shadow-xl">
          {results.length === 0 && <li className="px-3 py-3 text-xs text-muted-foreground">Nenhum ativo no universo demonstrativo.</li>}
          {results.map((a, i) => (
            <li key={a.ticker} role="option" aria-selected={i === idx}
              onMouseDown={(e) => { e.preventDefault(); go(a.ticker); }} onMouseEnter={() => setIdx(i)}
              className={cn("flex cursor-pointer items-center justify-between gap-3 px-3 py-2 text-sm", i === idx && "bg-panel-2")}>
              <span className="flex items-center gap-3"><span className="num w-16 text-gold">{a.ticker}</span><span className="truncate text-muted-foreground">{a.name}</span></span>
              <span className="font-mono text-[0.6rem] text-faint">{a.cls}</span>
            </li>
          ))}
          <li className="border-t px-3 py-1.5 font-mono text-[0.6rem] text-faint">↑↓ navegar · Enter analisar · universo simulado</li>
        </ul>
      )}
    </div>
  );
}

function TickerTape() {
  return (
    <div className="hidden items-center gap-5 overflow-hidden border-b bg-sidebar px-6 py-1.5 lg:flex">
      <span className="font-mono text-[0.6rem] tracking-widest text-gold">SIMULADO</span>
      {UNIVERSE.filter((a) => a.ticker !== "ALPHA3").map((a) => (
        <span key={a.ticker} className="num whitespace-nowrap text-[0.7rem] text-muted-foreground">
          {a.ticker} <span className={tone(a.change)}>{fmtPct(a.change, 2, true)}</span>
        </span>
      ))}
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [mobile, setMobile] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const current = NAV.find((n) => (n.to === "/" ? path === "/" : path.startsWith(n.to)))?.label ?? "—";
  const today = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date("2026-11-16T12:00:00Z"));
  return (
    <div className="flex min-h-screen w-full">
      <aside className="no-print sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r bg-sidebar md:flex">
        <Brand /><div className="gold-rule mx-5 mb-3 opacity-50" /><NavList /><SideStatus />
      </aside>
      <Sheet open={mobile} onOpenChange={setMobile}>
        <SheetContent side="left" className="w-72 bg-sidebar p-0">
          <SheetTitle className="sr-only">Navegação</SheetTitle>
          <div className="flex h-full flex-col"><Brand /><NavList onNavigate={() => setMobile(false)} /><SideStatus /></div>
        </SheetContent>
      </Sheet>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="no-print sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
          <div className="flex h-14 items-center gap-3 px-4 md:px-6">
            <button className="rounded-sm p-1.5 text-muted-foreground hover:text-foreground md:hidden" onClick={() => setMobile(true)} aria-label="Abrir menu"><Menu className="size-5" /></button>
            <div className="hidden min-w-0 items-center gap-2 text-sm sm:flex">
              <span className="font-mono text-[0.65rem] tracking-widest text-faint">FI</span>
              <span className="text-faint">/</span>
              <span className="whitespace-nowrap text-foreground">{current}</span>
            </div>
            <div className="flex flex-1 justify-center"><TickerSearch /></div>
            <span className="num hidden whitespace-nowrap text-xs text-muted-foreground lg:inline">{today}</span>
            <button className="relative rounded-sm p-1.5 text-muted-foreground hover:text-foreground" aria-label="Notificações" title="Sem novas notificações (ambiente demonstrativo)">
              <Bell className="size-4" /><span className="absolute right-1 top-1 size-1.5 rounded-full bg-gold" />
            </button>
            <button className="rounded-sm p-1.5 text-muted-foreground hover:text-foreground" aria-label="Perfil" title="Analista (sessão local)"><CircleUser className="size-5" /></button>
          </div>
          <TickerTape />
        </header>
        <main className="flex-1 px-4 py-6 md:px-8">{children}</main>
        <footer className="no-print sticky bottom-0 z-30 flex items-center gap-2 border-t bg-sidebar/95 px-4 py-2 text-[0.7rem] text-muted-foreground backdrop-blur md:px-8">
          <Info className="size-3.5 shrink-0 text-gold" />
          Ambiente demonstrativo. Dados simulados; não representa cotação em tempo real nem recomendação de investimento.
        </footer>
      </div>
    </div>
  );
}
