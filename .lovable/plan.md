# Finance Intelligence — Auditoria técnica e plano de conclusão

## Diagnóstico (verificado)
- Funciona: shell (menu, topo, disclaimer), Visão Geral, Research (ALPHA S.A. + perfis), busca de ticker.
- Placeholders: /carteira, /risco, /quant, /relatorios, /auditoria.
- `finance.ts` e `portfolio-store.ts` existem mas não são usados por nenhuma página.
- Testes: só 1 teste de rota ("/"). Nenhum teste de fórmula.
- Inconsistências encontradas em `data.ts`:
  - AAPL custa US$ 228,40 no universo, mas R$ 1.245,60 na carteira; BTC US$ 67.250 vs R$ 366.700 — câmbio implícito (~5,45) não declarado.
  - Patrimônio do Dashboard (R$ 248.650) é fixo e não deriva das posições da carteira.
  - `parseSeries` troca só a primeira vírgula decimal por token (ok), mas não trata separador de milhar pt-BR ("1.234,5").

## Etapa 1 — Corrigir base de dados demo
- Adicionar `FX_DEMO` (USD/BRL simulado, rotulado) em `DATASET_META`; preços de holdings em USD derivam de `price × FX`.
- Patrimônio/alocação do Dashboard passam a vir de `portfolioSummary(SAMPLE_HOLDINGS)`.
- Registrar metadados por dataset (id, fonte, classificação SIMULADO, datas) para uso na Auditoria.

## Etapa 2 — Carteira
- Tabela editável (adicionar/editar/remover, validação qty>0, custo≥0), persistida no navegador, botão "Restaurar exemplo".
- Totais, P/L, pesos, donut por classe, alerta de concentração (>25% num ativo) — informativo, sem recomendação.

## Etapa 3 — Risco
- Entradas de série de retornos/curva (colar texto) + "usar série demo".
- Volatilidade anualizada, drawdown máximo (pico/vale destacados no gráfico), Sharpe com taxa livre de risco editável, periodicidade (diária 252/mensal 12).
- Cada métrica com fórmula visível e substituição numérica; erros claros (série curta, valores ≤0, desvio zero).

## Etapa 4 — Quant Lab
- Calculadora de métricas de trade (taxa de acerto, payoff, fator de lucro, expectativa, custos).
- Simulador de retorno simples/composto e curva de capital com gráfico; tudo marcado como hipotético.

## Etapa 5 — Relatórios
- Montar relatório a partir de Carteira, Risco e Research (seleção de seções).
- Pré-visualização, impressão (CSS de impressão), download Markdown e CSV, com cabeçalho de metadados e disclaimer.

## Etapa 6 — Auditoria
- Catálogo de fórmulas (nome, expressão, implementação, referência), metadados de datasets, status "sem feed ao vivo", log local de cálculos executados na sessão (ação, entradas, resultado, horário).
- Declaração de limites: sem execução de ordens, sem recomendação individualizada.

## Etapa 7 — Validação
- Testes Vitest em `finance.ts`: valores ALPHA (P/L 4,40x, ROE 22,75%, etc.), retorno simples, desvio amostral, vol anualizada, drawdown conhecido, Sharpe, trade metrics; edge cases (lista vazia, 1 ponto, inicial 0, desvio zero, ganhos+perdas ≠ total, perdas zero → fator nulo).
- Testes de `parseSeries` (vírgula/ponto, %, tokens inválidos) e `portfolioSummary`.
- Teste de rotas para os sete módulos.
- Rodar testes e lint, checar build, inspecionar visualmente cada página (desktop e celular) e corrigir.

## Etapa 8 — Documentação
- README: execução/build/testes, arquitetura, ponto de extensão `MarketDataProvider` (server function, fornecedor verificado), política de dados simulados.

## Fora de escopo
- Nenhuma API de mercado inventada; nenhum preço apresentado como cotação real; sem login/banco nesta fase.
