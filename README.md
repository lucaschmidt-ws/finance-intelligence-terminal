# Finance Intelligence — Institutional Research & Analytics

Estação de pesquisa e análise financeira em pt-BR. **Ambiente demonstrativo**: todos os dados são simulados ou fictícios; não há feed de mercado, execução de ordens nem recomendação individualizada.

## Executar
```bash
bun install
bun run dev        # servidor de desenvolvimento (Vite / TanStack Start)
bun run build      # build de produção
bunx vitest run    # testes (fórmulas, parser, carteira, rotas)
bun run lint
```

## Módulos
| Rota | Módulo |
|---|---|
| `/` | Visão Geral (patrimônio e alocação derivados da carteira) |
| `/research` | Research — ALPHA S.A. (fictícia) e perfis de ativos |
| `/carteira` | Carteira editável (salva no navegador) |
| `/risco` | Volatilidade, drawdown máximo, Sharpe com memória de cálculo |
| `/quant` | Métricas de operações e crescimento composto (hipotético) |
| `/relatorios` | Montagem de relatório, impressão, Markdown e CSV |
| `/auditoria` | Catálogo de fórmulas, datasets e registro de cálculos |

## Arquitetura
- `src/lib/finance.ts` — fórmulas puras com `decimal.js` (testadas em `finance.test.ts`).
- `src/lib/formulas.ts` — catálogo exibido na Auditoria.
- `src/lib/data.ts` — provedor de dados demo, metadados (`DATASET_META`, `DATASETS`) e câmbio simulado `FX_DEMO`.
- `src/lib/portfolio-store.ts` — estado da carteira (localStorage) e `portfolioSummary`.
- `src/lib/audit-log.ts` — registro em memória dos cálculos da sessão.
- `src/components/fi/*` — shell, primitivas visuais e controles.

## Ponto de extensão de dados
Para dados reais, implemente um `MarketDataProvider` contra um fornecedor verificado e licenciado, chamado **no servidor** via `createServerFn` (chaves nunca no navegador). Substitua o provedor demo, atualize `DATASET_META` (fonte, classificação, `liveFeed: true`) e mantenha os rótulos de origem em cada número exibido. Nunca apresente valores sintéticos como cotação real.
