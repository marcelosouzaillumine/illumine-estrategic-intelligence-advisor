# WAVE 2 — ENTERPRISE EXPERIENCE ARCHITECTURE REFACTORING PROMPT (v21.7)
## Simulation & Executive Workspace Architecture Refactoring

============================================================
PAPEL E MISSÃO DE REFACTORING UI/UX ENTERPRISE (WAVE 2)
============================================================
Você é o Principal User Experience & Frontend Architect responsável pela execução da WAVE 2 — Simulation & Executive Workspace Architecture Refactoring do Illumine OS™ (v21.7).
Sua missão é refatorar as 7 páginas estratégicas de simulação, diagnóstico, fluxo financeiro, dados históricos, workspace do cliente, vendas de parceiros e gestão de ativos (`LoanInvestmentSimPage.tsx`, `DiagnosticoPage.tsx`, `CashFlowPage.tsx`, `DadosHistoricosPage.tsx`, `ClientExecutiveWorkspace.tsx`, `PartnerSalesPage.tsx`, `PortfolioPage.tsx`), reduzindo todas as Views principais para < 450 linhas e desacoplando a lógica em ViewModels modulares.

============================================================
METAS E CRITÉRIOS DE FATORAÇÃO DA WAVE 2
============================================================
1. **LoanInvestmentSimPage.tsx**: Reduzir View de ~1.650 para < 400 linhas. Subcomponentes em `src/components/pages/simulation/` + `useLoanInvestmentSimViewModel.ts`.
2. **DiagnosticoPage.tsx**: Reduzir View de ~1.050 para < 400 linhas. Subcomponentes em `src/components/pages/diagnosis/` + `useDiagnosticoPageViewModel.ts`.
3. **CashFlowPage.tsx**: Reduzir View de ~1.000 para < 400 linhas. Subcomponentes em `src/components/pages/cashflow/` + `useCashFlowPageViewModel.ts`.
4. **DadosHistoricosPage.tsx**: Reduzir View de ~980 para < 400 linhas. Subcomponentes em `src/components/pages/historical/` + `useHistoricalDataViewModel.ts`.
5. **ClientExecutiveWorkspace.tsx**: Reduzir View de ~1.150 para < 450 linhas. Subcomponentes em `src/components/pages/workspace/` + `useClientExecutiveWorkspaceViewModel.ts`.
6. **PartnerSalesPage.tsx**: Reduzir View de ~1.300 para < 400 linhas. Subcomponentes em `src/components/pages/partners/` + `usePartnerSalesViewModel.ts`.
7. **PortfolioPage.tsx**: Reduzir View de ~1.350 para < 400 linhas. Subcomponentes em `src/components/pages/portfolio/` + `usePortfolioPageViewModel.ts`.

============================================================
CRITÉRIOS DE ACEITAÇÃO DA WAVE 2
============================================================
✓ Redução das 7 Views principais para < 450 linhas cada sem regressão funcional
✓ Suíte de testes `tests/experience/wave2/wave2-refactoring.spec.ts` 100% aprovada
✓ Atestado de evidências `docs/evidence/wave2-experience-refactoring-evidence.json` registrado
✓ Incremento da conformidade visual global para $\ge 92\%$ | AHS $\ge 99.5$ | GCI $\ge 99.0\%$
