import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { FlaskConical } from "lucide-react";

export function Panel({ title, eyebrow, actions, children, className, bodyClass }: {
  title?: ReactNode; eyebrow?: ReactNode; actions?: ReactNode; children: ReactNode; className?: string; bodyClass?: string;
}) {
  return (
    <section className={cn("rounded-md border bg-panel", className)}>
      {(title || actions) && (
        <header className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3">
          <div className="min-w-0">
            {eyebrow && <div className="eyebrow mb-0.5">{eyebrow}</div>}
            {title && <h2 className="truncate text-sm font-medium tracking-wide text-foreground">{title}</h2>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className={cn("p-4", bodyClass)}>{children}</div>
    </section>
  );
}

export function DemoTag({ label = "DEMONSTRATIVO / SIMULADO", className }: { label?: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-sm border border-gold/40 bg-gold-dim px-1.5 py-0.5 font-mono text-[0.6rem] tracking-[0.12em] text-gold", className)}>
      <FlaskConical className="size-3" aria-hidden /> {label}
    </span>
  );
}

export function Stat({ label, value, sub, valueClass }: { label: string; value: ReactNode; sub?: ReactNode; valueClass?: string }) {
  return (
    <div className="rounded-md border bg-panel p-4">
      <div className="eyebrow">{label}</div>
      <div className={cn("num mt-2 text-2xl font-medium text-foreground", valueClass)}>{value}</div>
      {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}

export function Formula({ name, expr, result }: { name: string; expr: string; result?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-dashed py-2 last:border-0">
      <span className="text-sm text-foreground">{name}</span>
      <code className="font-mono text-xs text-muted-foreground">{expr}</code>
      {result !== undefined && <span className="num text-sm text-gold">{result}</span>}
    </div>
  );
}

export function PageHeader({ eyebrow, title, desc, actions }: { eyebrow: string; title: string; desc?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="eyebrow text-gold">{eyebrow}</div>
        <h1 className="mt-1 font-serif text-2xl font-medium text-foreground md:text-3xl">{title}</h1>
        {desc && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{desc}</p>}
        <div className="gold-rule mt-3 w-24" />
      </div>
      {actions}
    </div>
  );
}

export function Warn({ children, tone = "warn" }: { children: ReactNode; tone?: "warn" | "error" | "info" }) {
  return (
    <div className={cn("rounded-sm border-l-2 px-3 py-2 text-xs",
      tone === "error" && "border-negative bg-negative/10 text-negative",
      tone === "warn" && "border-gold bg-gold-dim text-foreground",
      tone === "info" && "border-border bg-panel-2 text-muted-foreground")}>{children}</div>
  );
}

export function EmptyState({ icon, title, desc, action }: { icon: ReactNode; title: string; desc?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed px-6 py-10 text-center">
      <div className="text-faint">{icon}</div>
      <div className="text-sm text-foreground">{title}</div>
      {desc && <p className="max-w-sm text-xs text-muted-foreground">{desc}</p>}
      {action}
    </div>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="eyebrow">{label}</span>
      {children}
      {hint && <span className="block text-[0.7rem] text-faint">{hint}</span>}
    </label>
  );
}
