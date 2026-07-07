# HCA-001 Wave 05 — Executive Capability Discovery

## 1. Mapeamento de Entropia (Reactivity Drift & Coupling)

Esta análise cobre: `executive/`, `pages/executive/`, `advisor/`, `cognitive/`, `war-room/`.

| Arquivo | Tipo | React Hooks | Runtime/Engine | Drift Score |
|---------|------|-------------|----------------|-------------|
| `UniversalSearchHub.tsx` | Component | useState, useEffect | - | 3 |
| `ExecutiveDemoShell.tsx` | Component | useState, useEffect | - | 3 |
| `AdvisorCommandCenter.tsx` | Component | useEffect, useMemo | - | 3 |
| `AdvisorWorkspaceShell.tsx` | Component | useState, useEffect | - | 3 |
| `WarRoomWorkspace.tsx` | Component | useState, useEffect | - | 3 |
| `WorkspaceHubNavigation.tsx` | Component | useState | - | 1 |
| `BoardExperienceShell.tsx` | Component | useState | - | 1 |
| `BoardNarrativeNavigator.tsx` | Component | useState | - | 1 |
| `ExecutionTrackingDashboard.tsx` | Component | useState | - | 1 |
| `ScenarioCommandCenter.tsx` | Component | useMemo | - | 1 |
| `ExecutiveHomeWorkspace.tsx` | Component | - | - | 0 |
| `ExecutiveQuickActions.tsx` | Component | - | - | 0 |
| `GuidedInvestigationCard.tsx` | Component | - | - | 0 |
| `InstitutionalMemoryDashboard.tsx` | Component | - | - | 0 |
| `CausalDrilldownPanel.tsx` | Component | - | - | 0 |
| `ExecutiveEvidenceExplorer.tsx` | Component | - | - | 0 |
| `InstitutionalTimelineViewer.tsx` | Component | - | - | 0 |
| `RuntimeDisclosureBanner.tsx` | Component | - | - | 0 |
| `BoardCopilotPanel.tsx` | Component | - | - | 0 |
| `BoardPresentationMode.tsx` | Component | - | - | 0 |
| `ExecutiveDisclosurePanel.tsx` | Component | - | - | 0 |
| `ExecutiveScenarioSelector.tsx` | Component | - | - | 0 |
| `GuidedBoardJourneyNavigator.tsx` | Component | - | - | 0 |
| `InstitutionalScenarioTimeline.tsx` | Component | - | - | 0 |
| `AdvisorHistoricalSurface.tsx` | Component | - | - | 0 |
| `AdvisorInstitutionalOverview.tsx` | Component | - | - | 0 |
| `AdvisorInvestigationSurface.tsx` | Component | - | - | 0 |
| `ExecutiveAdvisorDashboard.tsx` | Component | - | - | 0 |
| `OrganizationPortfolioPanel.tsx` | Component | - | - | 0 |
| `PortfolioManagementPanel.tsx` | Component | - | - | 0 |
| `CausalPathPanel.tsx` | Component | - | - | 0 |
| `CognitiveSummaryCard.tsx` | Component | - | - | 0 |
| `DecisionCognitiveDrawer.tsx` | Component | - | - | 0 |
| `DecisionImpactPanel.tsx` | Component | - | - | 0 |
| `EvidenceDetailPanel.tsx` | Component | - | - | 0 |
| `EvidencePanel.tsx` | Component | - | - | 0 |
| `ExecutiveCognitiveDashboard.tsx` | Component | - | - | 0 |
| `ExplainabilityDetailPanel.tsx` | Component | - | - | 0 |
| `ExplainabilityPanel.tsx` | Component | - | - | 0 |
| `InstitutionalGraphViewer.tsx` | Component | - | - | 0 |
| `EvidenceCorrelationPanel.tsx` | Component | - | - | 0 |
| `ExecutiveScenarioDashboard.tsx` | Component | - | - | 0 |
| `ImpactExplorer.tsx` | Component | - | - | 0 |
| `RiskPropagationViewer.tsx` | Component | - | - | 0 |
| `ScenarioCatalog.tsx` | Component | - | - | 0 |
| `ScenarioImpactMap.tsx` | Component | - | - | 0 |

## 2. Destino Mapeado (Target Architecture)
O destino de todos os ViewModels, conectores e Dumb Renderers migrados será: `src/capabilities/executive/`.

## 3. Sugestão para Wave 05A
Para evitar risco sistêmico e obedecer ao limite de 3 arquivos com alta taxa de acoplamento, a sugestão para a Wave 05A (focada nas superfícies mais críticas da Executive Capability) é:

1. **ExecutiveDashboardPage**
2. **AxisDashboardPage**
3. **ExecutiveCognitiveDashboard**

*Por favor, aprove o escopo para iniciarmos a HCA-001 Wave 05A com a extração e criação dos ViewModels (usando dumb renderers).*