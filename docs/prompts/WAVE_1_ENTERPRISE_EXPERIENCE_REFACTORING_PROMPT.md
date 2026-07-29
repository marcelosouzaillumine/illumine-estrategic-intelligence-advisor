# WAVE 1 — ENTERPRISE EXPERIENCE ARCHITECTURE REFACTORING PROMPT (v21.6)
## Programa de Convergência UX/UI Enterprise & L4 Certification Readiness

============================================================
PAPEL E MISSÃO DE REFACTORING UI/UX ENTERPRISE
============================================================
Você é o Principal Principal User Experience & Frontend Architect responsável pela execução da WAVE 1 — Enterprise Experience Architecture Refactoring do Illumine OS™ (v21.6).
Sua missão é eliminar a dívida técnica de interface refatorando os 3 monólitos críticos (`DFCPage.tsx`, `ClientsPage.tsx` e `EstruturaGovernancaPage.tsx`) em visões passivas, desacopladas de ViewModels e padronizadas segundo os estilos canônicos EAA e EFA.

============================================================
METAS E CRITÉRIOS DE FATORAÇÃO DA WAVE 1
============================================================
1. **Refatoração 01 — DFCPage.tsx (EAA)**: Reduzir de ~2.800 para < 400 linhas na View. Estrutura modular em `src/components/pages/dfc/` (`CashPositionSummary.tsx`, `OperationalCashFlowChart.tsx`, `DFCDetailTable.tsx`) aplicando a hierarquia Nível 1 (Conselho), Nível 2 (Diretoria) e Nível 3 (Auditoria).
2. **Refatoração 02 — ClientsPage.tsx (EFA)**: Reduzir de ~3.120 para < 450 linhas na View. Estrutura modular em `src/components/pages/clients/` (`ClientListPanel.tsx`, `ClientDetailPanel.tsx`, `ClientGeneralForm.tsx`) desacoplada através do ViewModel `useClientsPageViewModel.ts`.
3. **Refatoração 03 — EstruturaGovernancaPage.tsx (EAA)**: Reduzir de ~1.900 para < 400 linhas na View. Estrutura modular em `src/components/pages/governance/` (`GovernanceRolesPanel.tsx`, `ResponsibilityMatrixPanel.tsx`) desacoplada através de `useEstruturaGovernancaPageViewModel.ts`.

============================================================
CRITÉRIOS DE ACEITAÇÃO DA WAVE 1
============================================================
✓ Redução drástica das Views principais (< 450 linhas) sem perda de funcionalidade
✓ Suíte de testes `tests/experience/wave1/wave1-refactoring.spec.ts` 100% aprovada
✓ Registro imutável de evidências em `docs/evidence/wave1-experience-refactoring-evidence.json`
✓ Incremento da conformidade visual global para $\ge 85\%$ | AHS $\ge 99.5$ | GCI $\ge 99.0\%$
