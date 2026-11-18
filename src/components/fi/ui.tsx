import type { InputHTMLAttributes, ReactNode, ButtonHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const inputCls = "w-full rounded-sm border bg-background px-2.5 py-1.5 text-sm text-foreground outline-none focus:border-gold";
export function Input(p: InputHTMLAttributes<HTMLInputElement>) { return <input {...p} className={cn(inputCls, "num", p.className)} />; }
export function TextArea(p: TextareaHTMLAttributes<HTMLTextAreaElement>) { return <textarea {...p} className={cn(inputCls, "num min-h-24", p.className)} />; }
export function Btn({ variant = "ghost", ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "gold" | "ghost" }) {
  return <button type="button" {...p} className={cn("inline-flex items-center gap-1.5 rounded-sm border px-3 py-1.5 text-xs transition-colors disabled:opacity-50",
    variant === "gold" ? "border-gold/50 bg-gold-dim text-gold hover:bg-gold/20" : "text-muted-foreground hover:text-foreground", p.className)} />;
}
export function Segmented<T extends string>({ value, options, onChange, label }: { value: T; options: { v: T; l: ReactNode }[]; onChange: (v: T) => void; label: string }) {
  return (
    <div role="tablist" aria-label={label} className="inline-flex rounded-sm border">
      {options.map((o) => (
        <button key={o.v} type="button" role="tab" aria-selected={value === o.v} onClick={() => onChange(o.v)}
          className={cn("px-2.5 py-1 font-mono text-xs", value === o.v ? "bg-gold-dim text-gold" : "text-muted-foreground hover:text-foreground")}>{o.l}</button>
      ))}
    </div>
  );
}
export const tooltipStyle = { background: "var(--panel-2)", border: "1px solid var(--border)", borderRadius: 4, fontSize: 12 };
export const CHART_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)", "var(--chart-6)"];
