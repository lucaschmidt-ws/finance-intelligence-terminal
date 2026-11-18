import { useSyncExternalStore } from "react";

export interface AuditEntry { at: string; module: string; action: string; inputs: string; result: string; }
let entries: AuditEntry[] = [];
const subs = new Set<() => void>();
const EMPTY: AuditEntry[] = [];

/** Registro local (memória da sessão) de cálculos executados. */
export function logCalc(e: Omit<AuditEntry, "at">) {
  const last = entries[0];
  if (last && last.module === e.module && last.action === e.action && last.inputs === e.inputs) return;
  entries = [{ ...e, at: new Date().toISOString() }, ...entries].slice(0, 200);
  subs.forEach((f) => f());
}
export function clearLog() { entries = []; subs.forEach((f) => f()); }
export function useAuditLog() {
  return useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f); }, () => entries, () => EMPTY);
}
