# Finance Intelligence Terminal

Build a polished, working first MVP of a standalone web application named FINANCE INTELLIGENCE — Institutional Research & Analytics. Product language: Brazilian Portuguese (pt-BR), with institutional finance terminology. Visual identity: Dark Institutional, near-black (#090B0F), graphite panels (#12161D/#191F28), restrained antique gold (#C7A35A), muted gray typography, green positive and red negative. Premium institutional research terminal aesthetic, high information density but clear hierarchy, responsive desktop and mobile. Do not use a generic SaaS template.

PRODUCT PURPOSE
An educational/informational financial research and analytics workstation covering Brazilian equities, FIIs, international equities, ETFs, crypto, fixed income, macro, derivatives and day-trading analytics. No order execution, brokerage, custody or individualized regulated investment advice. Clearly label simulated/sample data and never imply live prices unless an actual verified data provider is connected.

BUILD THE ACTUAL FUNCTIONAL FRONTEND, not just a mockup:
1) Persistent left navigation with brand mark/wordmark FINANCE INTELLIGENCE, subtitle INSTITUTIONAL RESEARCH & ANALYTICS, menu: Visão Geral, Research, Carteira, Risco, Quant Lab, Relatórios, Auditoria; bottom status 'AMBIENTE DE ANÁLISE' and 'Dados demonstrativos'.
2) Top bar with breadcrumb/current module, search field for ativos/tickers, date, notification/profile icon. Search should work against a small built-in universe (PETR4, VALE3, ITUB4, BOVA11, HGLG11, BTC, ETH, AAPL, MSFT) and open a detail/analysis panel or populate research.
3) Dashboard with institutional dark cards: Patrimônio simulado R$ 248.650,00; Retorno acumulado +8,42%; Volatilidade anualizada 12,8%; Drawdown máximo -6,3%. Include a portfolio performance chart with selectable 1M/3M/6M/1A periods (use illustrative clearly labeled series), allocation donut (Ações BR 35%, FIIs 20%, ETFs 15%, Internacional 15%, Cripto 10%, Renda fixa 5%), watchlist and recent research activity. Label all data 'DEMONSTRATIVO / SIMULADO'.
4) Research module: asset-class filters, ticker/company input, action 'Analisar ativo', show structured analysis output. Include sample company ALPHA S.A. clearly fictional with metrics and formulas; show data table 2024–2026: Receita líquida R$ mi 800, 920, 1050; EBITDA R$ mi 160,190,220; Lucro líquido R$ mi 80,110,136.5; Patrimônio líquido R$ mi 500,550,600; Dívida líquida R$ mi 200,190,180. Assumptions: price R$25, 24 million shares, annual dividends/share R$1.50. Correct calculated metrics: market cap R$600m; P/L 4.40x; P/VP 1.00x; ROE 22.75% (net income/equity); dividend yield 6.00%; net debt/EBITDA 0.82x; revenue growth 2026 vs 2025 14.13%; net income growth 24.09%; net margin 13.00%. Show formulas and simulated data source metadata. Analysis sections: business overview, fundamental indicators, strengths, risks, data quality, limitations. Do not make buy/sell recommendation.
5) Portfolio module: editable simulated holdings table with ticker, class, quantity, average cost, current value, weight, P/L; allow add/remove holding and update quantity/cost; persist edits in browser localStorage if feasible. Include allocation summary.
6) Risk module: functional calculators for simple return, annualized volatility from manually entered comma/line-separated periodic returns, max drawdown from equity curve values, Sharpe ratio with editable risk-free rate; validate input, display formulas and warnings. No false precision.
7) Quant Lab: trade journal/backtest educational calculator: trades count, wins, losses, average gain/loss, costs, gross/net P&L, win rate, expectancy, profit factor; editable values and clear formulas. Include disclaimer that historical simulation doesn't predict future.
8) Reports module: generate a complete concise institutional report from ALPHA simulated dataset and portfolio sample, with executive summary, methodology, indicators, risks, recommendations framed as research considerations not personalized advice. Include 'Gerar relatório' interaction, print-friendly view and functional export/download to Markdown or CSV using browser Blob/download if implemented. Show report preview.
9) Audit module: source/data status, calculation checks with pass/fail, timestamps for sample dataset, classification 'SIMULADO', formulas, no live feeds connected. Add clear data provenance table and audit log.
10) Provide reusable UI components, charts, empty states, responsive behavior, keyboard-friendly controls. Use polished icons, subtle borders, restrained gold accents, elegant tables, no excessive glow. Use lucide icons and a chart library already available in stack if possible.

FUNCTIONAL REQUIREMENTS
- Use React + TypeScript + Tailwind + shadcn/ui from the default stack.
- Implement all navigation and key buttons with real state changes; do not leave dead controls.
- For financial calculations use precise decimal arithmetic where practical, sensible input validation, and display units.
- For charts, mark demo series as simulated.
- Add an explicit persistent banner/footer: 'Ambiente demonstrativo. Dados simulados; não representa cotação em tempo real nem recomendação de investimento.'
- No authentication requirement in this first MVP. No database needed yet; local demo state is sufficient.
- Include a README in project with run/build notes and clear architecture / data-provider extension points.
- Ensure build compiles and visually inspect/fix errors before finishing.

Create a strong first implementation, not just a plan.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5e5013a7-c888-4223-a15c-739979515ce6).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
