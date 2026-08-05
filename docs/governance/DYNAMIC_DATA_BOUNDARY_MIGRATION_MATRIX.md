# Dynamic Data Boundary Migration Matrix

Matriz de acompanhamento para a remoção de formatações diretas (`toLocaleString`, `Intl.NumberFormat`, `Intl.DateTimeFormat`) em favor da infraestrutura unificada `useExecutiveFormatter()`.

| Componente | Caminho Relativo | Domínio | Status |
| --- | --- | --- | --- |
| `CashFlowExecutiveSummary.tsx` | `pages/cashflow/` | CFO | Done |
| `OperationalCashFlowChart.tsx` | `pages/dfc/` | CFO | Done |
| `DFCPage.tsx` | `pages/` | CFO | Done |
| `BalanceSheetPage.tsx` | `pages/` | CFO | Done |
| `FinancialPositionPage.tsx` | `pages/` | CFO | Done |
| `ManualFinancialModal.tsx` | `modals/` | CFO | Done |
| `ImportBankStatementModal.tsx` | `modals/` | CFO | Done |
| `TreasurySurvivalMap.tsx` | `war-gaming/` | CFO | Done |
| `RevenueSplitLedgerCard.tsx` | `platform/distribution/` | CFO | Done |
| `ExecutiveCRMCard.tsx` | `platform/revenue/` | CFO | Done |
| `ExecutiveRevenueDashboard.tsx`| `platform/revenue/` | CFO | Done |
| `ConsolidatedExecutivePage.tsx`| * | CEO | Done |
| `ExecutiveEvidenceCard.tsx` | `executive/` | CEO | Done |
| `ExecutiveDiagnosisCard.tsx` | `executive/` | CEO | Done |
| `OpportunityForecastCard.tsx` | `executive/predictive/` | CEO | Done |
| `RiskPredictionCard.tsx` | `executive/predictive/` | CEO | Done |
| `PeerDistributionCard.tsx` | `executive/benchmark/` | CEO | Done |
| `SovereignBoardPackPage.tsx` | `pages/governance/` | Board | Pending |
| `ConstitutionalEnforcementPanel.tsx` | `pages/governance/` | Board | Pending |
| `InstitutionalTimelineViewer.tsx`| `executive/board/` | Board | Pending |
| `ConstitutionalIntegrityPanel.tsx`| `institutional-reporting/` | Board | Pending |
| `AccountingIntegrityPanel.tsx` | `institutional-reporting/` | Board | Pending |
| `ExecutiveBoardReportModal.tsx`| `modals/` | Board | Pending |
| `DecisionSignaturePanel.tsx` | `executive-architecture/` | Board | Pending |
| `EvidenceIntegrityPanel.tsx` | `executive-architecture/` | Board | Pending |
| `HumanJudgmentGate.tsx` | `executive-architecture/` | Board | Pending |
| `ExecutiveRecommendationCard.tsx`| `executive/advisory/` | Advisory | Pending |
| `ExecutiveOpportunityCard.tsx` | `executive/advisory/` | Advisory | Pending |
| `AdvisorProfileCard.tsx` | `executive/partner/` | Partner | Pending |
| `HoldingStructureCard.tsx` | `executive/partner/` | Partner | Pending |
| `PartnerPipelineBoard.tsx` | `pages/partners/` | Partner | Pending |
| `AdvisorWorkspacePage.tsx` | `pages/` | Partner | Pending |

*(Esta matriz consolida os principais componentes detectados com formatação hardcoded.)*
