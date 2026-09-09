# Financial Governance Foundation Layer™

**Status:** IMPLEMENTED (Wave 1)
**Scope:** Core Domain Engine for Financial Interpretation
**Owner:** Financial Capability Module
**Registry ID:** `financial.balance_sheet_governance`

## Objetivo
Desacoplar a lógica de inteligência e diagnóstico financeiro das camadas de apresentação (UI), transformando cálculos e interpretações matemáticas em motores de domínio focados no conhecimento financeiro de alto nível. Essa fundação prepara a Illumine para ser um sistema multiagentes escalável e inteligente, que alimenta dashboards, agentes autônomos e gera *executive insights*.

## Arquitetura (Clean Architecture / Ports & Adapters)
A Capability Financeira agora segue os preceitos da Constituição Canônica:
- **Global Governance Contracts (`src/core/governance/contracts`):** Contratos padronizados (`ExecutiveGovernanceOutput`, `GovernanceInsight`, `RiskExposure`) utilizados por todas as Engines para se comunicarem com outras camadas da plataforma de forma previsível e unificada.
- **Capability Registry (`src/core/governance/registry`):** Registro global das Capabilities implementadas, mapeadas por camada (GOVERNANCE, EXPERIENCE, DATA, INSTITUTIONAL).
- **Domain Models & Types (`src/capabilities/financial/domain/models`):** `NormalizedBalanceSheet` serve como a fonte de verdade do domínio, não poluída pelo modelo do Firestore (Data Layer) ou do View Model (Presentation Layer).
- **Engines & Rules (`src/capabilities/financial/domain/engines`):** O motor de inteligência subdividido em especialidades técnicas: `BalanceSheetGovernanceEngine`, `FleurietAnalysisEngine`, `CapitalStructureEngine`, `FinancialRiskEngine`, `FinancialDiagnosticEngine`. Todas sem acoplamento à UI.
- **Application Services (`src/capabilities/financial/application`):** `BalanceSheetGovernanceUseCase` implementa `FinancialGovernancePort` para atuar como o maestro que normaliza a entrada de dados (via `BalanceSheetNormalizer`) e invoca o motor de domínio.

## Testes & Qualidade
Testes de diagnóstico garantem que as regras de inteligência ("Cognitive Tests") extraiam os resultados qualitativos corretos. O engine foi coberto em `src/capabilities/financial/domain/__tests__/FinancialGovernance.spec.ts`.

## Backward Compatibility
O antigo `BalanceSheetDiagnosticEngine` foi marcado como `@deprecated` conforme a diretriz de não-ruptura estrita da arquitetura, e mantido para eventuais fluxos antigos até que sua desmobilização total seja priorizada.
