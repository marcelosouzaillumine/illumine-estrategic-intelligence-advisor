# Duplicate Logic Audit

Mapeamento de implementações paralelas ou duplicação de cálculos críticos (ex: EBITDA, Liquidez).

### Cálculo de `score` (61 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/ExecutiveExperienceConsistencyEngine.ts`
- `src/core/runtime/behavioral-intelligence/ExecutiveConsistencyEngine.ts`
- `src/core/runtime/benchmark/BenchmarkReadinessEngine.ts`
- `src/core/runtime/board-pack/BoardPackGeneratorEngine.ts`
- `src/core/runtime/causal-intelligence/engines/RootCausePrioritizationEngine.ts`
- `src/core/runtime/compliance/RuntimeComplianceEngine.ts`
- `src/core/runtime/confidence/InstitutionalConfidenceEngine.ts`
- `src/core/runtime/decision-intelligence/InstitutionalStabilityEngine.ts`
- `src/core/runtime/esgim/InstitutionalResilienceIndexEngine.ts`
- `src/core/runtime/executive-command/InstitutionalAlignmentEngine.ts`
- `src/core/runtime/executive-intelligence-runtime.ts`
- `src/core/runtime/governance/bp/BalanceSheetFiduciaryConsistencyEngine.ts`
- `src/core/runtime/governance/bp/DebtToEquityEngine.ts`
- `src/core/runtime/governance/bp/InstitutionalPatrimonialClassificationEngine.ts`
- `src/core/runtime/governance/bp/PatrimonialExecutiveInterpretationEngine.ts`
- `src/core/runtime/governance/bp/PatrimonialGovernanceConsistencyEngine.ts`
- `src/core/runtime/governance/bp/PatrimonialScoreExplainabilityEngine.ts`
- `src/core/runtime/governance/dlpa/CapitalPreservationScoreEngine.ts`
- `src/core/runtime/governance/dlpa/DLPACanonicalScoreResolver.ts`
- `src/core/runtime/institutional-memory/GovernanceFatigueDetection.ts`
- `src/core/runtime/institutional-memory/InstitutionalDeteriorationModel.ts`
- `src/core/runtime/institutional-recovery/RecoveryConsistencyValidationEngine.ts`
- `src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime.ts`
- `src/core/runtime/institutional-reporting/engines/LongitudinalScoreEngine.ts`
- `src/core/runtime/institutional-resilience/AntifragilityAssessmentEngine.ts`
- `src/core/runtime/institutional-resilience/CrisisLearningValidationEngine.ts`
- `src/core/runtime/institutional-resilience/InstitutionalShockAbsorptionEngine.ts`
- `src/core/runtime/institutional-resilience/VulnerabilityReductionEngine.ts`
- `src/core/runtime/integrations/PilotRollbackProtocol.ts`
- `src/core/runtime/journey/GovernanceJourneyEngine.ts`
- `src/core/runtime/knowledge/GovernanceKnowledgeEngine.ts`
- `src/core/runtime/operating-pressure/FundingFragilityEngine.ts`
- `src/core/runtime/operating-pressure/LiquidityCompressionEngine.ts`
- `src/core/runtime/operating-pressure/OperationalFatigueEngine.ts`
- `src/core/runtime/operating-pressure/PressureAccumulationEngine.ts`
- `src/core/runtime/operating-pressure/TreasuryErosionEngine.ts`
- `src/core/runtime/predictive-governance/InstitutionalTrajectoryEngine.ts`
- `src/core/runtime/predictive-governance/PredictiveGovernanceScoreEngine.ts`
- `src/core/runtime/predictive-intelligence/StrategicCollapseRiskEngine.ts`
- `src/core/runtime/prescriptive-governance/FiduciaryPriorityEngine.ts`
- `src/core/runtime/recovery-regression/RecoveryStabilityMonitoringEngine.ts`
- `src/core/runtime/roadmap/GovernanceRoadmapEngine.ts`
- `src/core/runtime/semantic-consistency/CrossEngineSemanticConsistencyEngine.ts`
- `src/core/runtime/structural-capital/SupplierDependencyEngine.ts`
- `src/core/runtime/war-gaming/InstitutionalSurvivalThesisEngine.ts`
- `src/core/governance/signal-hierarchy/SignalPriorityEngine.ts`
- `src/runtime/adapters/BoardRiskMatrixAdapter.ts`
- `src/runtime/adapters/CapitalGovernanceAdapter.ts`
- `src/runtime/adapters/SovereignDecisionAdapter.ts`
- `src/runtime/governance/capital/CapitalGovernanceSemanticEngine.ts`
- `src/components/operating-pressure/InstitutionalPressureDashboard.tsx`
- `src/components/pages/DLPAPage.tsx`
- `src/components/pages/EstruturaGovernancaPage.tsx`
- `src/components/pages/LeadershipProfilePage.tsx`
- `src/components/pages/PortfolioPage.tsx`
- `src/components/pages/TaxReformImpactPage.tsx`
- `src/components/pages/governance/ComplianceIntegrityCenter.tsx`
- `src/components/pages/governance/ExecutiveExecutionCenter.tsx`
- `src/components/pages/governance/GovernanceMaturityCenter.tsx`
- `src/components/pages/governance/LeadershipDNACenter.tsx`
- `src/components/pages/governance/RiskExposureCenter.tsx`

### Cálculo de `generate` (33 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/InstitutionalFinancialThesisEngine.ts`
- `src/core/runtime/causal-intelligence/InstitutionalCausalityExplorer.ts`
- `src/core/runtime/consolidated/advisory/ConsolidatedAdvisoryOrchestrator.ts`
- `src/core/runtime/consolidated/advisory/ConsolidatedNarrativeEngine.ts`
- `src/core/runtime/constitutional-governance/ConstitutionalGovernanceDashboardEngine.ts`
- `src/core/runtime/economic-value/InstitutionalExecutiveThesisEngine.ts`
- `src/core/runtime/executive-intelligence-runtime.ts`
- `src/core/runtime/executive-prioritization/BoardTop3DecisionEngine.ts`
- `src/core/runtime/executive-prioritization/ExecutiveActionPlanEngine.ts`
- `src/core/runtime/executive-prioritization/InstitutionalPriorityMatrixEngine.ts`
- `src/core/runtime/executive-timeline/ExecutiveTimelineEngine.ts`
- `src/core/runtime/governance/bp/BalanceSheetExecutiveNarrativeEngine.ts`
- `src/core/runtime/governance/bp/BalanceSheetLongitudinalNarrativeGenerator.ts`
- `src/core/runtime/governance/bp/BalanceSheetPatrimonialIntelligenceEngine.ts`
- `src/core/runtime/governance/bp/BoardPatrimonialAdvisoryEngine.ts`
- `src/core/runtime/institutional-memory/InstitutionalTimelineRuntime.ts`
- `src/core/runtime/institutional-reporting/InstitutionalBoardPackRuntime.ts`
- `src/core/runtime/institutional-reporting/engines/BoardResolutionAppendixEngine.ts`
- `src/core/runtime/institutional-reporting/engines/ContinuityReportingEngine.ts`
- `src/core/runtime/institutional-reporting/engines/ExecutiveDirectiveReportingEngine.ts`
- `src/core/runtime/institutional-reporting/engines/ExecutiveLongitudinalIntegration.spec.ts`
- `src/core/runtime/institutional-reporting/engines/ExecutiveSnapshotEngine.ts`
- `src/core/runtime/institutional-reporting/engines/GovernanceReportingEngine.ts`
- `src/core/runtime/institutional-reporting/engines/InstitutionalBoardPackEndToEnd.spec.ts`
- `src/core/runtime/institutional-reporting/engines/InstitutionalDisclosureReportingEngine.ts`
- `src/core/runtime/institutional-reporting/engines/InstitutionalExplainabilityAppendixEngine.ts`
- `src/core/runtime/institutional-reporting/engines/InstitutionalLineageAppendixEngine.ts`
- `src/core/runtime/institutional-reporting/engines/OperationalGovernanceReportingEngine.ts`
- `src/core/runtime/institutional-reporting/engines/StrategicDirectionReportingEngine.ts`
- `src/core/runtime/institutional-reporting/engines/TreasuryPressureReportingEngine.ts`
- `src/core/governance/__tests__/GranatumLongitudinalGolden.test.ts`
- `src/core/governance/narrative/ExecutiveSummaryGenerator.ts`
- `src/services/FiduciaryRuntimeAdapter.ts`

### Cálculo de `generateboardbriefing` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/advisory-narrative/BoardCommunicationEngine.ts`
- `src/core/runtime/advisory-narrative/ExecutiveNarrativeEngine.ts`

### Cálculo de `scores` (20 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/advisory-narrative/BoardCommunicationEngine.ts`
- `src/core/runtime/advisory-narrative/ExecutiveSummaryEngine.ts`
- `src/core/runtime/advisory-narrative/FiduciaryCommunicationEngine.ts`
- `src/core/runtime/advisory-narrative/GovernanceNarrativeEngine.ts`
- `src/core/runtime/board-decision/BoardResolutionEngine.ts`
- `src/core/runtime/compliance/RuntimeComplianceEngine.ts`
- `src/core/runtime/executive-intelligence-runtime.ts`
- `src/core/runtime/executive-timeline/engines/TrajectoryClassificationEngine.ts`
- `src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime.ts`
- `src/core/runtime/operating-pressure/InstitutionalPressureRuntime.ts`
- `src/core/runtime/strategic-simulation/GovernanceImpactSimulationEngine.ts`
- `src/core/runtime/strategic-simulation/InstitutionalOptimizationEngine.ts`
- `src/core/runtime/strategic-simulation/InstitutionalPreservationEngine.ts`
- `src/services/aiBoardReportService.ts`
- `src/runtime/adapters/LegacyFinancialAdapter.ts`
- `src/components/operating-pressure/InstitutionalPressureDashboard.tsx`
- `src/components/pages/EFOSPage.tsx`
- `src/components/pages/EstruturaGovernancaPage.tsx`
- `src/components/pages/LeadershipProfilePage.tsx`
- `src/components/pages/governance/LeadershipDNACenter.tsx`

### Cálculo de `generateconfidencestatement` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/advisory-narrative/ConfidenceNarrativeEngine.ts`
- `src/core/runtime/advisory-narrative/ExecutiveNarrativeEngine.ts`

### Cálculo de `recommendedpath` (3 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/advisory-narrative/ExecutiveNarrativeEngine.ts`
- `src/core/runtime/advisory-narrative/StrategicRecommendationEngine.ts`
- `src/core/runtime/publication-governance/NarrativeConsistencyEngine.ts`

### Cálculo de `generatefiduciarynarrative` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/advisory-narrative/ExecutiveNarrativeEngine.ts`
- `src/core/runtime/advisory-narrative/FiduciaryCommunicationEngine.ts`

### Cálculo de `generaterecommendationnarrative` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/advisory-narrative/ExecutiveNarrativeEngine.ts`
- `src/core/runtime/advisory-narrative/StrategicRecommendationEngine.ts`

### Cálculo de `generatetradeoffanalysis` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/advisory-narrative/ExecutiveNarrativeEngine.ts`
- `src/core/runtime/advisory-narrative/TradeoffNarrativeEngine.ts`

### Cálculo de `generatescenarioexplanation` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/advisory-narrative/ExecutiveNarrativeEngine.ts`
- `src/core/runtime/advisory-narrative/ScenarioExplanationEngine.ts`

### Cálculo de `generategovernanceguidelines` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/advisory-narrative/ExecutiveNarrativeEngine.ts`
- `src/core/runtime/advisory-narrative/GovernanceNarrativeEngine.ts`

### Cálculo de `generatesummary` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/advisory-narrative/ExecutiveNarrativeEngine.ts`
- `src/core/runtime/advisory-narrative/ExecutiveSummaryEngine.ts`

### Cálculo de `generatefiduciarydisclosure` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/advisory-narrative/ExecutiveNarrativeEngine.ts`
- `src/core/runtime/advisory-narrative/InstitutionalDisclosureNarrativeEngine.ts`

### Cálculo de `liquidityscore` (2 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/advisory-narrative/FiduciaryCommunicationEngine.ts`
- `src/runtime/adapters/LegacyDFCAdapter.ts`

### Cálculo de `compositescore` (4 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/advisory-narrative/FiduciaryCommunicationEngine.ts`
- `src/core/runtime/decision-policy/InstitutionalMaterialityEngine.ts`
- `src/core/runtime/executive-timeline/ExecutiveTimelineEngine.ts`
- `src/core/runtime/institutional-causality/types.ts`

### Cálculo de `govscore` (3 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/advisory-narrative/GovernanceNarrativeEngine.ts`
- `src/core/runtime/compliance/ESGGovernanceEngine.ts`
- `src/core/runtime/strategic-simulation/GovernanceImpactSimulationEngine.ts`

### Cálculo de `generateresponse` (4 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/ai-governance/InstitutionalCopilotRuntime.ts`
- `src/core/runtime/ai-governance/providers/LLMProvider.ts`
- `src/core/runtime/ai-governance/providers/MockLLMProvider.ts`
- `src/core/runtime/ai-governance/providers/OpenAIProvider.ts`

### Cálculo de `overallscore` (3 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/audit-assurance/AssuranceCertificationEngine.ts`
- `src/core/runtime/esgim/ESGIMAssessmentEngine.ts`
- `src/hooks/usePredictiveGovernance.ts`

### Cálculo de `execution` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/audit-assurance/ExecutiveAssuranceRuntime.ts`
- `src/services/FiduciaryRuntimeAdapter.ts`

### Cálculo de `cumulativeprofile` (6 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/behavioral-intelligence/BehavioralTrajectoryEngine.ts`
- `src/core/runtime/behavioral-intelligence/InstitutionalBehaviorProfileEngine.ts`
- `src/core/runtime/behavioral-intelligence/InstitutionalBehavioralIntelligenceEngine.ts`
- `src/core/runtime/predictive-intelligence/DeteriorationMomentumEngine.ts`
- `src/core/runtime/predictive-intelligence/PredictiveGovernanceEngine.ts`
- `src/core/runtime/strategic-simulation/StrategicSimulationEngine.ts`

### Cálculo de `consistency` (3 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/behavioral-intelligence/ExecutiveConsistencyEngine.ts`
- `src/core/runtime/behavioral-intelligence/InstitutionalAdaptationEngine.ts`
- `src/core/runtime/behavioral-intelligence/InstitutionalBehavioralIntelligenceEngine.ts`

### Cálculo de `fatigue` (6 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/behavioral-intelligence/GovernanceFatigueEngine.ts`
- `src/core/runtime/behavioral-intelligence/InstitutionalBehavioralIntelligenceEngine.ts`
- `src/core/runtime/predictive-intelligence/BehavioralAccelerationEngine.ts`
- `src/core/runtime/predictive-intelligence/DeteriorationMomentumEngine.ts`
- `src/core/runtime/predictive-intelligence/PredictiveGovernanceEngine.ts`
- `src/core/runtime/strategic-simulation/StrategicSimulationEngine.ts`

### Cálculo de `adaptation` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/behavioral-intelligence/InstitutionalAdaptationEngine.ts`
- `src/core/runtime/behavioral-intelligence/InstitutionalBehavioralIntelligenceEngine.ts`

### Cálculo de `behavior` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/behavioral-intelligence/InstitutionalBehavioralIntelligenceEngine.ts`
- `src/core/runtime/decision-intelligence/InstitutionalDecisionIntelligenceEngine.ts`

### Cálculo de `patterns` (4 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/behavioral-intelligence/InstitutionalBehavioralIntelligenceEngine.ts`
- `src/core/runtime/behavioral-intelligence/LongitudinalPatternEngine.ts`
- `src/core/runtime/knowledge-graph/WorkflowPatternAnalyzer.ts`
- `src/components/knowledge-graph/WorkflowPatternPanel.tsx`

### Cálculo de `maturity` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/behavioral-intelligence/InstitutionalBehavioralIntelligenceEngine.ts`
- `src/core/runtime/behavioral-intelligence/InstitutionalMaturityEvolutionEngine.ts`

### Cálculo de `advisory` (5 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/benchmark/BenchmarkAdvisoryEngine.ts`
- `src/core/runtime/board-pack/BoardPackGeneratorEngine.ts`
- `src/core/runtime/journey/GovernanceJourneyEngine.ts`
- `src/core/runtime/reports/ExecutiveBoardReportEngine.ts`
- `src/components/pages/governance/BenchmarkAdvisoryPanel.tsx`

### Cálculo de `readiness` (12 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/benchmark/BenchmarkAdvisoryEngine.ts`
- `src/core/runtime/benchmark/BenchmarkComparativeEngine.ts`
- `src/core/runtime/benchmark/BenchmarkReadinessEngine.ts`
- `src/core/runtime/journey/GovernanceJourneyEngine.ts`
- `src/core/runtime/learning/GovernanceLearningEngine.ts`
- `src/core/runtime/reports/ExecutiveBoardReportEngine.ts`
- `src/components/pages/governance/BenchmarkAdvisoryPanel.tsx`
- `src/components/pages/governance/BenchmarkComparativePanel.tsx`
- `src/components/pages/governance/BenchmarkReadinessPanel.tsx`
- `src/components/pages/governance/BoardMeetingMode.tsx`
- `src/components/pages/governance/GovernanceJourneyPanel.tsx`
- `src/components/pages/governance/GovernanceLearningPanel.tsx`

### Cálculo de `comparison` (6 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/benchmark/BenchmarkAdvisoryEngine.ts`
- `src/core/runtime/benchmark/BenchmarkComparativeEngine.ts`
- `src/core/runtime/journey/GovernanceJourneyEngine.ts`
- `src/core/runtime/learning/GovernanceLearningEngine.ts`
- `src/core/runtime/reports/ExecutiveBoardReportEngine.ts`
- `src/components/pages/governance/BenchmarkComparativePanel.tsx`

### Cálculo de `assessment` (11 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/benchmark/BenchmarkAdvisoryEngine.ts`
- `src/core/runtime/benchmark/BenchmarkComparativeEngine.ts`
- `src/core/runtime/benchmark/BenchmarkReadinessEngine.ts`
- `src/core/runtime/board/BoardPrioritiesEngine.ts`
- `src/core/runtime/board-pack/BoardPackGeneratorEngine.ts`
- `src/core/runtime/esgim/ESGIMAssessmentEngine.ts`
- `src/core/runtime/journey/GovernanceJourneyEngine.ts`
- `src/core/runtime/knowledge/GovernanceKnowledgeEngine.ts`
- `src/core/runtime/monitoring/GovernanceMonitoringEngine.ts`
- `src/core/runtime/reports/ExecutiveBoardReportEngine.ts`
- `src/components/pages/governance/ESGIMAssessmentPage.tsx`

### Cálculo de `resilience` (13 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/benchmark/BenchmarkAdvisoryEngine.ts`
- `src/core/runtime/benchmark/BenchmarkComparativeEngine.ts`
- `src/core/runtime/benchmark/BenchmarkReadinessEngine.ts`
- `src/core/runtime/board/BoardPrioritiesEngine.ts`
- `src/core/runtime/board-pack/BoardPackGeneratorEngine.ts`
- `src/core/runtime/esgim/InstitutionalResilienceIndexEngine.ts`
- `src/core/runtime/journey/GovernanceJourneyEngine.ts`
- `src/core/runtime/monitoring/GovernanceMonitoringEngine.ts`
- `src/core/runtime/predictive-intelligence/InstitutionalResilienceEngine.ts`
- `src/core/runtime/predictive-intelligence/PredictiveGovernanceEngine.ts`
- `src/core/runtime/reports/ExecutiveBoardReportEngine.ts`
- `src/components/pages/governance/ESGIMAssessmentPage.tsx`
- `src/components/pages/governance/GovernanceJourneyPanel.tsx`

### Cálculo de `geiweightedscore` (11 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/benchmark/BenchmarkAdvisoryEngine.ts`
- `src/core/runtime/benchmark/BenchmarkComparativeEngine.ts`
- `src/core/runtime/benchmark/BenchmarkReadinessEngine.ts`
- `src/core/runtime/board-pack/BoardPackGeneratorEngine.ts`
- `src/core/runtime/execution/DecisionRegistryEngine.ts`
- `src/core/runtime/journey/GovernanceJourneyEngine.ts`
- `src/core/runtime/knowledge/GovernanceKnowledgeEngine.ts`
- `src/core/runtime/learning/GovernanceLearningEngine.ts`
- `src/core/runtime/monitoring/GovernanceMonitoringEngine.ts`
- `src/core/runtime/reports/ExecutiveBoardReportEngine.ts`
- `src/components/pages/governance/GovernanceExecutionPanel.tsx`

### Cálculo de `briscore` (2 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/benchmark/BenchmarkAdvisoryEngine.ts`
- `src/core/runtime/benchmark/BenchmarkComparativeEngine.ts`

### Cálculo de `bpsscore` (2 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/benchmark/BenchmarkComparativeEngine.ts`
- `src/core/runtime/learning/GovernanceLearningEngine.ts`

### Cálculo de `recommendations` (6 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/benchmark/BenchmarkComparativeEngine.ts`
- `src/core/runtime/compliance/RuntimeComplianceEngine.ts`
- `src/core/runtime/dre/CrossStatementIsolationValidator.ts`
- `src/components/pages/MarketingComercialPage.tsx`
- `src/components/pages/OperacionalPage.tsx`
- `src/components/pages/TaxReformImpactPage.tsx`

### Cálculo de `monitoring` (7 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/benchmark/BenchmarkReadinessEngine.ts`
- `src/core/runtime/board-pack/BoardPackGeneratorEngine.ts`
- `src/core/runtime/journey/GovernanceJourneyEngine.ts`
- `src/core/runtime/learning/GovernanceLearningEngine.ts`
- `src/core/runtime/monitoring/GovernanceMonitoringEngine.ts`
- `src/core/runtime/reports/ExecutiveBoardReportEngine.ts`
- `src/components/pages/governance/ESGIMAssessmentPage.tsx`

### Cálculo de `buildcohort` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/benchmarking/BenchmarkCohortBuilder.ts`
- `src/core/runtime/benchmarking/InstitutionalBenchmarkEngine.ts`

### Cálculo de `index` (5 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/benchmarking/BenchmarkConfidenceIndex.ts`
- `src/core/runtime/benchmarking/InstitutionalBenchmarkEngine.ts`
- `src/core/runtime/early-warning/EarlyWarningSignalEngine.ts`
- `src/core/runtime/early-warning/GovernanceDeteriorationIndex.ts`
- `src/components/early-warning/GovernanceTrendPanel.tsx`

### Cálculo de `generateboardagenda` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/board/BoardAgendaGenerator.ts`
- `src/hooks/useBoardMode.ts`

### Cálculo de `executiverecommendation` (4 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/board/BoardAgendaGenerator.ts`
- `src/core/runtime/board/BoardAttentionEngine.ts`
- `src/core/runtime/board/BoardResolutionLayer.ts`
- `src/core/runtime/executive-consolidation/ExecutiveRecommendationDeduplicationEngine.ts`

### Cálculo de `generateattentionitems` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/board/BoardAttentionEngine.ts`
- `src/hooks/useBoardMode.ts`

### Cálculo de `generatepriorities` (7 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/board/BoardPrioritiesEngine.ts`
- `src/core/runtime/board-pack/BoardPackGeneratorEngine.ts`
- `src/core/runtime/journey/GovernanceJourneyEngine.ts`
- `src/core/runtime/monitoring/GovernanceMonitoringEngine.ts`
- `src/core/runtime/reports/ExecutiveBoardReportEngine.ts`
- `src/core/runtime/roadmap/GovernanceRoadmapEngine.ts`
- `src/components/pages/governance/ESGIMAssessmentPage.tsx`

### Cálculo de `generateboardresolutions` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/board/BoardResolutionLayer.ts`
- `src/hooks/useBoardMode.ts`

### Cálculo de `assessfiduciaryrisks` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/board/FiduciaryRiskEngine.ts`
- `src/hooks/useBoardMode.ts`

### Cálculo de `generateaudittrail` (4 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/board-decision/DecisionLineageTracker.ts`
- `src/core/runtime/compliance/FiduciaryContracts.ts`
- `src/core/runtime/compliance/RuntimeComplianceEngine.ts`
- `src/core/runtime/executive-intelligence-runtime.ts`

### Cálculo de `generatedat` (7 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/board-meeting/BoardMeetingEngine.ts`
- `src/core/runtime/board-meeting/MeetingMinutesEngine.ts`
- `src/core/runtime/board-pack/BoardPackGeneratorEngine.ts`
- `src/core/runtime/reports/ExecutiveBoardReportEngine.ts`
- `src/core/runtime/scenario-simulation/GovernanceForecastEngine.ts`
- `src/core/runtime/scenario-simulation/ScenarioMacroProjectionEngine.ts`
- `src/core/runtime/scenario-simulation/StrategicDecisionSandbox.ts`

### Cálculo de `generateboardpack` (6 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/board-meeting/BoardMeetingEngine.ts`
- `src/core/runtime/board-pack/BoardPackGeneratorEngine.ts`
- `src/services/FiduciaryRuntimeAdapter.ts`
- `src/components/modals/BoardPackPreviewModal.tsx`
- `src/components/pages/InstitutionalBoardPackPage.tsx`
- `src/components/pages/governance/BoardMeetingMode.tsx`

### Cálculo de `generateminutes` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/board-meeting/BoardMeetingEngine.ts`
- `src/core/runtime/board-meeting/MeetingMinutesEngine.ts`

### Cálculo de `generateroadmap` (7 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/board-pack/BoardPackGeneratorEngine.ts`
- `src/core/runtime/journey/GovernanceJourneyEngine.ts`
- `src/core/runtime/learning/GovernanceLearningEngine.ts`
- `src/core/runtime/monitoring/GovernanceMonitoringEngine.ts`
- `src/core/runtime/reports/ExecutiveBoardReportEngine.ts`
- `src/core/runtime/roadmap/GovernanceRoadmapEngine.ts`
- `src/components/pages/governance/ESGIMAssessmentPage.tsx`

### Cálculo de `generatereport` (6 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/board-pack/BoardPackGeneratorEngine.ts`
- `src/core/runtime/reports/ExecutiveBoardReportEngine.ts`
- `src/core/runtime/semantic-consistency/ExecutiveConsistencyReportEngine.ts`
- `src/components/modals/ExecutiveBoardReportModal.tsx`
- `src/components/pages/ClientExecutiveWorkspace.tsx`
- `src/hooks/useSemanticConsistency.ts`

### Cálculo de `generatejourney` (5 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/board-pack/BoardPackGeneratorEngine.ts`
- `src/core/runtime/journey/GovernanceJourneyEngine.ts`
- `src/core/runtime/reports/ExecutiveBoardReportEngine.ts`
- `src/components/pages/governance/BoardMeetingMode.tsx`
- `src/components/pages/governance/GovernanceJourneyPanel.tsx`

### Cálculo de `geisimplescore` (5 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/board-pack/BoardPackGeneratorEngine.ts`
- `src/core/runtime/execution/DecisionRegistryEngine.ts`
- `src/core/runtime/monitoring/GovernanceMonitoringEngine.ts`
- `src/core/runtime/reports/ExecutiveBoardReportEngine.ts`
- `src/components/pages/governance/GovernanceExecutionPanel.tsx`

### Cálculo de `gaiscore` (5 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/board-pack/BoardPackGeneratorEngine.ts`
- `src/core/runtime/execution/DecisionRegistryEngine.ts`
- `src/core/runtime/monitoring/GovernanceMonitoringEngine.ts`
- `src/core/runtime/reports/ExecutiveBoardReportEngine.ts`
- `src/components/pages/governance/GovernanceExecutionPanel.tsx`

### Cálculo de `overduerate` (6 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/board-pack/BoardPackGeneratorEngine.ts`
- `src/core/runtime/execution/DecisionRegistryEngine.ts`
- `src/core/runtime/journey/GovernanceJourneyEngine.ts`
- `src/core/runtime/monitoring/GovernanceMonitoringEngine.ts`
- `src/core/runtime/reports/ExecutiveBoardReportEngine.ts`
- `src/components/pages/governance/GovernanceExecutionPanel.tsx`

### Cálculo de `agingbuckets` (4 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/board-pack/BoardPackGeneratorEngine.ts`
- `src/core/runtime/execution/DecisionRegistryEngine.ts`
- `src/core/runtime/reports/ExecutiveBoardReportEngine.ts`
- `src/components/pages/governance/GovernanceExecutionPanel.tsx`

### Cálculo de `learning` (5 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/board-pack/BoardPackGeneratorEngine.ts`
- `src/core/runtime/journey/GovernanceJourneyEngine.ts`
- `src/core/runtime/learning/GovernanceLearningEngine.ts`
- `src/core/runtime/reports/ExecutiveBoardReportEngine.ts`
- `src/components/pages/governance/GovernanceLearningPanel.tsx`

### Cálculo de `generatepdf` (4 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/board-pack/BoardPackPDFGenerator.ts`
- `src/core/runtime/reports/ExecutiveBoardReportPDF.ts`
- `src/components/modals/BoardPackPreviewModal.tsx`
- `src/components/modals/ExecutiveBoardReportModal.tsx`

### Cálculo de `generatepptx` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/board-pack/BoardPackPPTXGenerator.ts`
- `src/components/modals/BoardPackPreviewModal.tsx`

### Cálculo de `buildgovernancescore` (2 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/capital-governance/capital-governance-adapter.ts`
- `src/runtime/adapters/CapitalGovernanceAdapter.ts`

### Cálculo de `classify` (27 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/cash-causal-intelligence/CashFlowCausalIntelligenceEngine.ts`
- `src/core/runtime/cash-causal-intelligence/CashFlowCausalSeverityEngine.ts`
- `src/core/runtime/cash-intelligence/CashBoardDecisionSupportEngine.ts`
- `src/core/runtime/cash-intelligence/DFCExecutiveSnapshotEngine.ts`
- `src/core/runtime/cash-intelligence/DFCFiduciaryPriorityResolver.ts`
- `src/core/runtime/cash-intelligence/FiduciaryCashIntelligenceRuntime.ts`
- `src/core/runtime/cash-intelligence/RunwayClassificationEngine.ts`
- `src/core/runtime/dre/OperationalHealthExplainabilityEngine.ts`
- `src/core/runtime/executive-intelligence-runtime.ts`
- `src/core/runtime/executive-timeline/ExecutiveTimelineEngine.ts`
- `src/core/runtime/executive-timeline/engines/TrajectoryClassificationEngine.ts`
- `src/core/runtime/governance/bp/InstitutionalPatrimonialClassificationEngine.ts`
- `src/core/runtime/governance/dlpa/CapitalRetentionClassificationEngine.ts`
- `src/core/runtime/governance/dlpa/DLPAFiduciaryInterpretationEngine.ts`
- `src/core/runtime/institutional-survival/InstitutionalSurvivalHierarchyEngine.ts`
- `src/core/runtime/institutional-survival/SurvivalPriorityClassificationEngine.ts`
- `src/core/runtime/lifecycle/LifecycleClassificationEngine.ts`
- `src/core/runtime/lifecycle/LifecycleContextBuilder.ts`
- `src/core/runtime/presentation-governance/OperationalSeverityGovernanceEngine.ts`
- `src/core/runtime/semantic/EarlyStageSemanticEngine.ts`
- `src/core/runtime/semantic/LifecycleClassificationEngine.ts`
- `src/core/runtime/structural-capital/InstitutionalCapitalStageClassifier.ts`
- `src/core/runtime/structural-capital/StructuralCapitalOrchestrator.ts`
- `src/core/governance/signal-hierarchy/FiduciaryCriticalityClassifier.ts`
- `src/runtime/FiscalYearScopeBuilder.ts`
- `src/runtime/adapters/CapitalGovernanceAdapter.ts`
- `src/runtime/governance/capital/CapitalClassificationEngine.ts`

### Cálculo de `generatepayload` (4 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/cash-intelligence/CashExecutiveAdvisoryEngine.ts`
- `src/core/runtime/cash-intelligence/FiduciaryCashIntelligenceRuntime.ts`
- `src/core/runtime/scenario-intelligence/InstitutionalScenarioEngine.ts`
- `src/core/runtime/scenario-intelligence/ScenarioExplainabilityEngine.ts`

### Cálculo de `buildsnapshot` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/cash-intelligence/DFCExecutiveSnapshotEngine.ts`
- `src/core/runtime/cash-intelligence/FiduciaryCashIntelligenceRuntime.ts`

### Cálculo de `generatelineagehash` (6 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/cash-intelligence/FiduciaryCashIntelligenceRuntime.ts`
- `src/core/runtime/ios/IOSGovernanceEngine.ts`
- `src/core/runtime/ios/InstitutionalPulseEngine.ts`
- `src/core/runtime/patrimonial-intelligence/PatrimonialContextMapper.ts`
- `src/core/runtime/patrimonial-intelligence/PatrimonialIntelligenceRuntime.ts`
- `src/core/runtime/treasury-intelligence/TreasuryIntelligenceRuntime.ts`

### Cálculo de `longitudinalscore` (5 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/cash-intelligence/LongitudinalCashIntelligenceEngine.ts`
- `src/core/runtime/executive-intelligence-runtime.ts`
- `src/core/runtime/institutional-reporting/engines/ExecutiveSnapshotEngine.ts`
- `src/core/runtime/institutional-reporting/engines/InstitutionalBoardPackEndToEnd.spec.ts`
- `src/components/institutional-reporting/ExecutiveSnapshotSurface.tsx`

### Cálculo de `resiliencescore` (5 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/cash-intelligence/OperationalSustainabilityRuntime.ts`
- `src/core/runtime/institutional-resilience/InstitutionalResilienceEngine.ts`
- `src/core/runtime/operational-governance/OperationalContinuityEngine.ts`
- `src/core/runtime/scenario-intelligence/InstitutionalStressTestEngine.ts`
- `src/components/pages/InstitutionalContinuityCockpitPage.tsx`

### Cálculo de `cashconversion` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/cashflow/CashConversionEngine.ts`
- `src/core/runtime/cashflow/cashflow-adapter.ts`

### Cálculo de `operationalmetrics` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/cashflow/CashFlowOperationalEngine.ts`
- `src/core/runtime/cashflow/cashflow-adapter.ts`

### Cálculo de `fundingdependency` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/cashflow/FundingDependencyEngine.ts`
- `src/core/runtime/cashflow/cashflow-adapter.ts`

### Cálculo de `liquiditysustainability` (2 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/cashflow/LiquiditySustainabilityEngine.ts`
- `src/core/runtime/cashflow/cashflow-adapter.ts`

### Cálculo de `sustainabilityscore` (2 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/cashflow/LiquiditySustainabilityEngine.ts`
- `src/runtime/adapters/LegacyDFCAdapter.ts`

### Cálculo de `treasurypressure` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/cashflow/TreasuryPressureEngine.ts`
- `src/core/runtime/cashflow/cashflow-adapter.ts`

### Cálculo de `build` (13 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/causal-intelligence/InstitutionalCausalIntelligenceRuntime.ts`
- `src/core/runtime/causal-intelligence/SurvivabilityDependencyGraph.ts`
- `src/core/runtime/financial-context/FinancialRuntimeContextAdapter.ts`
- `src/core/runtime/institutional-causality/GovernanceImpactChainEngine.ts`
- `src/core/runtime/institutional-causality/InstitutionalCausalityOrchestrator.ts`
- `src/core/runtime/institutional-causality/InstitutionalGraphBuilder.ts`
- `src/core/runtime/institutional-memory/LongitudinalSnapshotSummary.ts`
- `src/core/runtime/lifecycle/LifecycleContextBuilder.ts`
- `src/core/runtime/reporting/ExecutiveBoardPackBuilder.ts`
- `src/core/runtime/reporting/GovernanceAuditReportBuilder.ts`
- `src/core/runtime/reporting/InstitutionalReportBuilder.ts`
- `src/core/runtime/reporting/ScenarioStressReportBuilder.ts`
- `src/components/pages/DLPAPage.tsx`

### Cálculo de `determine` (4 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/causal-intelligence/InstitutionalCausalityExplorer.ts`
- `src/core/runtime/causal-intelligence/engines/CausalityConfidenceEngine.ts`
- `src/core/runtime/executive-timeline/ExecutiveTimelineEngine.ts`
- `src/core/runtime/executive-timeline/engines/TimelineConfidenceEngine.ts`

### Cálculo de `scoreid` (2 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/compliance/ESGGovernanceEngine.ts`
- `src/core/runtime/compliance/InstitutionalIntegrityEngine.ts`

### Cálculo de `esgscore` (2 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/compliance/ESGGovernanceEngine.ts`
- `src/core/runtime/compliance/InstitutionalIntegrityEngine.ts`

### Cálculo de `latestscore` (3 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/compliance/ESGGovernanceEngine.ts`
- `src/core/runtime/esgim/ESGIMAssessmentEngine.ts`
- `src/core/runtime/executive-timeline/engines/TrajectoryClassificationEngine.ts`

### Cálculo de `generateintegrityscore` (2 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/compliance/InstitutionalIntegrityEngine.ts`
- `src/core/runtime/esgim/ESGIMAssessmentEngine.ts`

### Cálculo de `integrityscore` (3 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/compliance/InstitutionalIntegrityEngine.ts`
- `src/core/runtime/publication-governance/ExecutivePublicationRuntime.ts`
- `src/core/runtime/scenario-intelligence/PropagationSimulationEngine.ts`

### Cálculo de `minscore` (3 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/compliance/RuntimeComplianceEngine.ts`
- `src/core/runtime/decision-intelligence/InstitutionalDecisionIntelligenceEngine.ts`
- `src/core/runtime/executive-timeline/engines/TrajectoryClassificationEngine.ts`

### Cálculo de `generateexecutivereport` (17 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/consolidated/ConsolidatedRuntimeOrchestrator.ts`
- `src/core/runtime/consolidated/EntityRuntimeExecutor.ts`
- `src/core/runtime/executive-intelligence-runtime.ts`
- `src/core/runtime/institutional-reporting/engines/InstitutionalBoardPackEndToEnd.spec.ts`
- `src/services/FiduciaryRuntimeAdapter.ts`
- `src/components/executive-command/InstitutionalExecutiveCommandCenter.tsx`
- `src/components/operating-pressure/InstitutionalPressureDashboard.tsx`
- `src/components/pages/AnaliseFinanceiraPage.tsx`
- `src/components/pages/BalanceSheetPage.tsx`
- `src/components/pages/CalibrationPlayground.tsx`
- `src/components/pages/CashFlowPage.tsx`
- `src/components/pages/ClientExecutiveWorkspace.tsx`
- `src/components/pages/DREPage.tsx`
- `src/components/pages/EFOSPage.tsx`
- `src/components/pages/InstitutionalContinuityCockpitPage.tsx`
- `src/components/pages/InstitutionalDeploymentReadinessPage.tsx`
- `src/components/pages/InstitutionalOnboardingControlCenterPage.tsx`

### Cálculo de `telemetry` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/consolidated/ConsolidatedRuntimeOrchestrator.ts`
- `src/core/runtime/performance/RuntimePerformanceMonitor.ts`

### Cálculo de `buildriskedges` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/consolidated/stress/ConsolidatedStressPropagationEngine.ts`
- `src/core/runtime/consolidated/stress/CrossEntityRiskGraph.ts`

### Cálculo de `overrideattempt` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/constitutional-governance/ExecutiveConstitutionalRuntime.ts`
- `src/core/runtime/constitutional-governance/GovernanceOverrideEngine.ts`

### Cálculo de `runtimestate` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/constitutional-governance/ExecutiveConstitutionalRuntime.ts`
- `src/core/runtime/executive-intelligence-runtime.ts`

### Cálculo de `reportaxioms` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/constitutional-governance/ExecutiveConstitutionalRuntime.ts`
- `src/core/runtime/constitutional-governance/FiduciaryAxiomEngine.ts`

### Cálculo de `state` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/constitutional-governance/ExecutiveConstitutionalRuntime.ts`
- `src/core/runtime/constitutional-governance/RuntimePolicyEngine.ts`

### Cálculo de `generatehash` (11 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/constitutional-governance/SemanticComplianceAuditRuntime.ts`
- `src/core/runtime/constitutional-governance/SemanticLineageReport.ts`
- `src/core/runtime/governance/bp/BalanceSheetFinancialMetricsEngine.ts`
- `src/core/runtime/institutional-reporting/InstitutionalBoardPackRuntime.ts`
- `src/core/runtime/scenario/ScenarioFiduciarySimulator.ts`
- `src/core/runtime/scenario/ScenarioSnapshotBuilder.ts`
- `src/core/runtime/scenario-intelligence/ScenarioHashFramework.ts`
- `src/core/runtime/scenario-intelligence/ScenarioImpactRuntime.ts`
- `src/core/runtime/strategic-simulation/ScenarioStressEngine.ts`
- `src/core/runtime/strategic-simulation/StrategicSimulationEngine.ts`
- `src/runtime/adapters/FinancialLineageIntegrityAdapter.ts`

### Cálculo de `priority` (4 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/decision-intelligence/ConstitutionalDecisionRuntime.ts`
- `src/core/runtime/decision-intelligence/DecisionPrioritizationEngine.ts`
- `src/core/governance/__tests__/SignalPriorityEngine.test.ts`
- `src/core/governance/signal-hierarchy/SignalPriorityEngine.ts`

### Cálculo de `urgency` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/decision-intelligence/ConstitutionalDecisionRuntime.ts`
- `src/core/runtime/decision-intelligence/DecisionPrioritizationEngine.ts`

### Cálculo de `tradeoffs` (6 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/decision-intelligence/DecisionTradeoffEngine.ts`
- `src/core/runtime/decision-intelligence/InstitutionalDecisionIntelligenceEngine.ts`
- `src/core/runtime/executive/ExecutiveDecisionEngine.ts`
- `src/core/runtime/executive/TradeOffAnalysisEngine.ts`
- `src/core/runtime/strategic-simulation/GovernanceTradeoffAnalyzer.ts`
- `src/core/runtime/strategic-simulation/StrategicDecisionSimulator.ts`

### Cálculo de `riskscore` (3 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/decision-intelligence/EarlyWarningEngine.ts`
- `src/core/runtime/decision-intelligence/GovernanceDriftDetectionEngine.ts`
- `src/core/runtime/early-warning/EarlyWarningSignalEngine.ts`

### Cálculo de `runwayimpactassessment` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/decision-intelligence/EarlyWarningEngine.ts`
- `src/core/runtime/decision-intelligence/InstitutionalStabilityEngine.ts`

### Cálculo de `fcoimpactassessment` (3 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/decision-intelligence/EarlyWarningEngine.ts`
- `src/core/runtime/decision-intelligence/GovernanceDriftDetectionEngine.ts`
- `src/core/runtime/decision-intelligence/InstitutionalStabilityEngine.ts`

### Cálculo de `accountabilityscore` (5 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/decision-intelligence/EarlyWarningEngine.ts`
- `src/core/runtime/decision-intelligence/ExecutiveAccountabilityEngine.ts`
- `src/core/runtime/decision-intelligence/InstitutionalStabilityEngine.ts`
- `src/runtime/adapters/ExecutiveExecutionAdapter.ts`
- `src/components/pages/governance/ExecutiveExecutionCenter.tsx`

### Cálculo de `basescore` (5 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/decision-intelligence/ExecutiveAccountabilityEngine.ts`
- `src/core/runtime/decision-intelligence/InstitutionalBehavioralPatternsEngine.ts`
- `src/core/runtime/institutional-memory/TemporalGovernanceScoring.ts`
- `src/core/runtime/knowledge/GovernanceKnowledgeEngine.ts`
- `src/components/scenario-simulation/GovernanceProjectionTimeline.tsx`

### Cálculo de `trajectory` (5 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/decision-intelligence/GovernanceTrajectoryEngine.ts`
- `src/core/runtime/decision-intelligence/InstitutionalDecisionIntelligenceEngine.ts`
- `src/core/runtime/predictive-governance/InstitutionalTrajectoryEngine.ts`
- `src/core/runtime/predictive-governance/PredictiveGovernanceScoreEngine.ts`
- `src/hooks/usePredictiveGovernance.ts`

### Cálculo de `finalscore` (2 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/decision-intelligence/InstitutionalBehavioralPatternsEngine.ts`
- `src/core/runtime/institutional-memory/TemporalGovernanceScoring.ts`

### Cálculo de `prediction` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/decision-intelligence/InstitutionalDecisionIntelligenceEngine.ts`
- `src/core/runtime/predictive-intelligence/PredictiveGovernanceEngine.ts`

### Cálculo de `stress` (4 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/decision-intelligence/InstitutionalDecisionIntelligenceEngine.ts`
- `src/core/runtime/decision-intelligence/StrategicStressEngine.ts`
- `src/core/runtime/scenario/PredictiveStressEngine.ts`
- `src/core/runtime/scenario/ScenarioPropagationRuntime.ts`

### Cálculo de `risk` (3 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/decision-intelligence/InstitutionalRiskMatrixEngine.ts`
- `src/core/runtime/governance/risk/EnterpriseRiskEngine.ts`
- `src/core/runtime/governance/risk/RiskMatrixEngine.ts`

### Cálculo de `resilienceassessment` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/decision-intelligence/InstitutionalStabilityEngine.ts`
- `src/core/runtime/decision-intelligence/InstitutionalStabilityTypes.ts`

### Cálculo de `financialscore` (2 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/decision-intelligence/InstitutionalSurvivabilityEngine.ts`
- `src/core/runtime/prescriptive-governance/ExecutionCapacityConstraintEngine.ts`

### Cálculo de `governancescore` (4 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/decision-intelligence/InstitutionalSurvivabilityEngine.ts`
- `src/core/runtime/institutional-reporting/engines/GovernanceReportingEngine.ts`
- `src/core/runtime/prescriptive-governance/ExecutionCapacityConstraintEngine.ts`
- `src/runtime/adapters/InstitutionalMemoryAdapter.ts`

### Cálculo de `structuralscore` (2 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/decision-intelligence/InstitutionalSurvivabilityEngine.ts`
- `src/core/runtime/strategic-simulation/GovernanceImpactSimulationEngine.ts`

### Cálculo de `eqsscore` (2 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/decision-intelligence/InstitutionalSurvivabilityEngine.ts`
- `src/runtime/adapters/LegacyDFCAdapter.ts`

### Cálculo de `sector` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/decision-policy/DecisionPolicyEngine.ts`
- `src/core/runtime/decision-policy/SectorGovernanceProfileEngine.ts`

### Cálculo de `posture` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/decision-policy/DecisionPolicyEngine.ts`
- `src/core/runtime/decision-policy/StrategicPostureEngine.ts`

### Cálculo de `materiality` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/decision-policy/DecisionPolicyEngine.ts`
- `src/core/runtime/decision-policy/InstitutionalMaterialityEngine.ts`

### Cálculo de `avgscore` (2 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/decision-policy/InstitutionalMaterialityEngine.ts`
- `src/components/pages/PortfolioPage.tsx`

### Cálculo de `validatedrerecommendation` (3 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/dre/CrossStatementIsolationValidator.ts`
- `src/core/runtime/dre/DREBoardAdvisoryEngine.ts`
- `src/core/runtime/executive-intelligence-runtime.ts`

### Cálculo de `generateexecutiveadvisory` (3 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/dre/DREBoardAdvisoryEngine.ts`
- `src/core/runtime/executive-intelligence-runtime.ts`
- `src/hooks/useExecutiveAdvisory.ts`

### Cálculo de `valuecreationassessment` (3 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/dre/DREBoardAdvisoryEngine.ts`
- `src/core/runtime/dre/DREBoardDecisionSupportEngine.ts`
- `src/core/runtime/dre/EconomicDiagnosisEngine.ts`

### Cálculo de `generateframework` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/dre/DREBoardDecisionSupportEngine.ts`
- `src/core/runtime/executive-intelligence-runtime.ts`

### Cálculo de `determinepredictiveconfidence` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/early-warning/EarlyWarningGovernanceEngine.ts`
- `src/core/runtime/early-warning/EarlyWarningSignalEngine.ts`

### Cálculo de `generatenarrative` (8 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/economic-value/EconomicValueCreationEngine.ts`
- `src/core/runtime/executive-consolidation/CrossStatementExecutiveNarrativeEngine.ts`
- `src/core/runtime/institutional-memory/ExecutiveMemoryNarrativeEngine.ts`
- `src/core/runtime/institutional-reporting/InstitutionalBoardPackRuntime.ts`
- `src/core/runtime/orchestrator/InstitutionalFinancialDomainOrchestrator.ts`
- `src/core/runtime/scenario/ScenarioFiduciarySimulator.ts`
- `src/core/runtime/scenario/ScenarioNarrativeEngine.ts`
- `src/core/runtime/semantic/EarlyStageSemanticEngine.ts`

### Cálculo de `generateexecutivesummary` (4 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/esgim/ESGIMAssessmentEngine.ts`
- `src/core/runtime/institutional-reporting/ExecutiveReportNarrativeOrchestrator.ts`
- `src/core/runtime/institutional-reporting/engines/ExecutiveLongitudinalIntegration.spec.ts`
- `src/core/runtime/institutional-reporting/engines/ExecutiveSnapshotEngine.ts`

### Cálculo de `rawscore` (3 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/esgim/InstitutionalResilienceIndexEngine.ts`
- `src/core/runtime/executive/ScenarioRankingEngine.ts`
- `src/core/runtime/strategic-simulation/ResilienceOptimizationEngine.ts`

### Cálculo de `impactscore` (2 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/execution-governance/ImpactValidationEngine.ts`
- `src/core/runtime/executive-prioritization/ExecutivePriorityRankingEngine.ts`

### Cálculo de `disclosurerequirements` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/executive/ConfidenceDisclosurePolicy.ts`
- `src/core/runtime/executive/ExecutiveDisclosureResolver.ts`

### Cálculo de `generatehashes` (4 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/executive/ExecutiveNarrativePolicy.ts`
- `src/core/runtime/executive/types.ts`
- `src/core/runtime/institutional-causality/CausalLineageIntegrityEngine.ts`
- `src/core/runtime/institutional-causality/InstitutionalCausalityOrchestrator.ts`

### Cálculo de `generatepersistencedelta` (4 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/executive-command/ExecutiveCommandMemoryEngine.ts`
- `src/core/runtime/executive-command/InstitutionalExecutiveCommandRuntime.ts`
- `src/core/runtime/operational-governance/InstitutionalOperationalGovernanceRuntime.ts`
- `src/core/runtime/operational-governance/OperationalGovernanceMemoryEngine.ts`

### Cálculo de `generatesnapshot` (3 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/executive-consolidation/ExecutiveStrategicSnapshotEngine.ts`
- `src/core/runtime/observability/RuntimeHealthMonitor.ts`
- `src/components/pages/RuntimeObservabilityPage.tsx`

### Cálculo de `buildmemory` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/executive-intelligence-runtime.ts`
- `src/core/runtime/institutional-memory/InstitutionalMemoryEngine.ts`

### Cálculo de `buildbphierarchy` (10 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/executive-intelligence-runtime.ts`
- `src/core/runtime/institutional-context/InstitutionalContextEngine.ts`
- `src/services/aiBoardReportService.ts`
- `src/services/intelligenceEngine.ts`
- `src/runtime/adapters/LegacyDFCAdapter.ts`
- `src/components/modals/ImportFinancialModal.tsx`
- `src/components/modals/ManualFinancialModal.tsx`
- `src/components/pages/BalanceSheetPage.tsx`
- `src/components/pages/governance/BoardPackDataLoader.ts`
- `src/hooks/useRealIndicatorData.ts`

### Cálculo de `financialmetrics` (4 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/executive-intelligence-runtime.ts`
- `src/services/aiBoardReportService.ts`
- `src/runtime/adapters/LegacyFinancialAdapter.ts`
- `src/hooks/useExecutiveAdvisory.ts`

### Cálculo de `mastercausality` (4 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/executive-intelligence-runtime.ts`
- `src/services/aiBoardReportService.ts`
- `src/runtime/adapters/LegacyFinancialAdapter.ts`
- `src/hooks/useExecutiveAdvisory.ts`

### Cálculo de `scoreestrutura` (2 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/executive-intelligence-runtime.ts`
- `src/runtime/adapters/LegacyDREAdapter.ts`

### Cálculo de `drecascade` (7 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/executive-intelligence-runtime.ts`
- `src/runtime/adapters/LegacyDFCAdapter.ts`
- `src/runtime/adapters/LegacyDREAdapter.ts`
- `src/components/modals/ManualFinancialModal.tsx`
- `src/components/pages/BalanceSheetPage.tsx`
- `src/components/pages/DashboardPage.tsx`
- `src/components/pages/governance/BoardPackDataLoader.ts`

### Cálculo de `generatedreinsights` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/executive-intelligence-runtime.ts`
- `src/runtime/adapters/LegacyDREAdapter.ts`

### Cálculo de `economicvalueassessment` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/executive-intelligence-runtime.ts`
- `src/components/pages/DREPage.tsx`

### Cálculo de `earningsqualityassessment` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/executive-intelligence-runtime.ts`
- `src/components/pages/DREPage.tsx`

### Cálculo de `confidenceassessment` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/executive-intelligence-runtime.ts`
- `src/components/pages/DREPage.tsx`

### Cálculo de `scoremargembruta` (2 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/executive-intelligence-runtime.ts`
- `src/runtime/adapters/LegacyDREAdapter.ts`

### Cálculo de `scorecmv` (2 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/executive-intelligence-runtime.ts`
- `src/runtime/adapters/LegacyDREAdapter.ts`

### Cálculo de `scoremargemebitda` (2 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/executive-intelligence-runtime.ts`
- `src/runtime/adapters/LegacyDREAdapter.ts`

### Cálculo de `scoremargemop` (2 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/executive-intelligence-runtime.ts`
- `src/runtime/adapters/LegacyDREAdapter.ts`

### Cálculo de `scorecobertura` (2 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/executive-intelligence-runtime.ts`
- `src/runtime/adapters/LegacyDREAdapter.ts`

### Cálculo de `scorecaixa` (2 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/executive-intelligence-runtime.ts`
- `src/runtime/adapters/LegacyDREAdapter.ts`

### Cálculo de `scoredivida` (2 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/executive-intelligence-runtime.ts`
- `src/runtime/adapters/LegacyDREAdapter.ts`

### Cálculo de `patrimonialstructure` (3 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/executive-intelligence-runtime.ts`
- `src/core/runtime/patrimonial-intelligence/PatrimonialIntelligenceRuntime.test.ts`
- `src/core/runtime/patrimonial-intelligence/PatrimonialIntelligenceRuntime.ts`

### Cálculo de `buildmatrix` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/executive-intelligence-runtime.ts`
- `src/core/runtime/integrity/ExecutiveActionMatrixEngine.ts`

### Cálculo de `indicators` (4 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/executive-intelligence-runtime.ts`
- `src/core/runtime/governance/bp/BalanceSheetFinancialMetricsEngine.ts`
- `src/core/runtime/governance/bp/PatrimonialTrendEngine.ts`
- `src/components/pages/BalanceSheetPage.tsx`

### Cálculo de `generateinterpretations` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/executive-intelligence-runtime.ts`
- `src/core/runtime/governance/bp/PatrimonialExecutiveInterpretationEngine.ts`

### Cálculo de `trend` (4 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/executive-intelligence-runtime.ts`
- `src/core/runtime/governance/bp/PatrimonialTrendEngine.ts`
- `src/core/runtime/semantic-consistency/ConsistencyTrendEngine.ts`
- `src/hooks/useSemanticConsistency.ts`

### Cálculo de `generatelineage` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/executive-intelligence-runtime.ts`
- `src/core/runtime/governance/bp/BalanceSheetSummaryLineageAudit.ts`

### Cálculo de `confidencescore` (3 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/executive-intelligence-runtime.ts`
- `src/core/runtime/governance/bp/PatrimonialGovernanceConsistencyEngine.ts`
- `src/core/runtime/governance/fiduciary/DecisionFiduciaryValidator.ts`

### Cálculo de `prevscore` (3 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/executive-timeline/engines/TimelineEventDetectionEngine.ts`
- `src/core/runtime/executive-timeline/engines/TrajectoryClassificationEngine.ts`
- `src/core/runtime/institutional-memory/GovernanceRecurrenceEngine.ts`

### Cálculo de `scoredactions` (2 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/governance/RoadmapPrioritizationEngine.ts`
- `src/core/runtime/prescriptive-governance/FiduciaryPriorityEngine.ts`

### Cálculo de `consistencyscore` (2 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/governance/bp/BalanceSheetLongitudinalConsistencyEngine.ts`
- `src/core/runtime/publication-governance/ExecutivePublicationRuntime.ts`

### Cálculo de `recommendation` (4 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/governance/dfc/DFCNarrativeConsistencyAudit.ts`
- `src/core/runtime/governance-orchestration/InstitutionalOrchestrationEngine.ts`
- `src/components/pages/GovernanceDashboardPage.tsx`
- `src/components/pages/RelatorioExecutivoPage.tsx`

### Cálculo de `dependencyscore` (2 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/governance/dlpa/CapitalPreservationScoreEngine.ts`
- `src/runtime/adapters/LegacyDFCAdapter.ts`

### Cálculo de `decisionconflicts` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/governance/fiduciary/ConflictOfInterestEngine.ts`
- `src/core/runtime/governance/fiduciary/DecisionFiduciaryValidator.ts`

### Cálculo de `severityscore` (3 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/governance/fiduciary/ConflictOfInterestEngine.ts`
- `src/core/runtime/orchestrator/UnifiedDisclosureEngine.ts`
- `src/runtime/adapters/SovereignDecisionAdapter.ts`

### Cálculo de `effectiveness` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/governance/risk/EnterpriseRiskEngine.ts`
- `src/core/runtime/governance/risk/RiskMitigationRegistry.ts`

### Cálculo de `generateheatmap` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/governance/risk/EnterpriseRiskEngine.ts`
- `src/components/pages/governance/GovernanceRiskHeatmap.tsx`

### Cálculo de `buildcontext` (5 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/governance-copilot/governance-copilot-adapter.ts`
- `src/core/runtime/ios/InstitutionalContextEngine.ts`
- `src/core/runtime/ios/InstitutionalStateManager.ts`
- `src/components/pages/CashFlowPage.tsx`
- `src/components/pages/InstitutionalReportsPage.tsx`

### Cálculo de `simulateexecution` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/governance-orchestration/InstitutionalOrchestrationEngine.ts`
- `src/core/runtime/governance-orchestration/PlaybookExecutionSimulator.ts`

### Cálculo de `confidencematrix` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/institutional-context/ContextualConfidenceMatrix.ts`
- `src/core/runtime/institutional-context/SegmentIntelligenceEngine.ts`

### Cálculo de `buildtimeline` (3 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/institutional-memory/GovernanceTimelineEngine.ts`
- `src/core/runtime/ios/InstitutionalStateManager.ts`
- `src/core/runtime/ios/UnifiedGovernanceTimeline.ts`

### Cálculo de `buildreplayreference` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/institutional-memory/HistoricalReplayIndex.ts`
- `src/core/runtime/institutional-memory/ReplayMetadataRegistry.ts`

### Cálculo de `advisoryadherence` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/institutional-memory/InstitutionalLearningEngine.ts`
- `src/core/runtime/institutional-memory/LongitudinalMaturityEngine.ts`

### Cálculo de `operationalpersistence` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/institutional-memory/InstitutionalLearningEngine.ts`
- `src/core/runtime/institutional-memory/LongitudinalMaturityEngine.ts`

### Cálculo de `resiliencetrend` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/institutional-memory/InstitutionalLearningEngine.ts`
- `src/core/runtime/institutional-memory/LongitudinalMaturityEngine.ts`

### Cálculo de `ignoredrecommendations` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/institutional-memory/InstitutionalLearningEngine.ts`
- `src/core/runtime/institutional-memory/InstitutionalMemoryEngine.ts`

### Cálculo de `maturityscore` (3 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/institutional-memory/LongitudinalMaturityEngine.ts`
- `src/core/runtime/pilot-operations/ProductionReadinessAssessment.ts`
- `src/components/pages/PortfolioPage.tsx`

### Cálculo de `classifyretentionlayer` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/institutional-memory/MemoryRetentionGovernance.ts`
- `src/core/runtime/institutional-memory/ReplayMetadataRegistry.ts`

### Cálculo de `stage` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/institutional-recovery/InstitutionalReauthorizationEngine.ts`
- `src/core/runtime/institutional-recovery/InstitutionalRecoveryEngine.ts`

### Cálculo de `constraints` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/institutional-recovery/InstitutionalRecoveryEngine.ts`
- `src/core/runtime/institutional-recovery/RecoveryConstraintReleaseEngine.ts`

### Cálculo de `generatedocument` (3 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime.test.ts`
- `src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime.ts`
- `src/core/runtime/institutional-reporting/engines/ExecutiveReportExportEngine.ts`

### Cálculo de `boardriskscore` (3 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime.ts`
- `src/runtime/adapters/BoardRiskMatrixAdapter.ts`
- `src/components/pages/governance/RiskExposureCenter.tsx`

### Cálculo de `bankingreadinessscore` (4 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime.ts`
- `src/runtime/adapters/BoardRiskMatrixAdapter.ts`
- `src/components/pages/governance/CreditCommitteeCenter.tsx`
- `src/components/pages/governance/RiskExposureCenter.tsx`

### Cálculo de `ensscore` (4 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime.ts`
- `src/runtime/adapters/EconomicNormalizationAdapter.ts`
- `src/runtime/adapters/SovereignDecisionAdapter.ts`
- `src/components/pages/governance/EconomicNormalizationCenter.tsx`

### Cálculo de `imsscore` (5 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime.ts`
- `src/runtime/adapters/CreditCommitteeSimulatorAdapter.ts`
- `src/runtime/adapters/InstitutionalMemoryAdapter.ts`
- `src/runtime/adapters/SovereignDecisionAdapter.ts`
- `src/components/pages/governance/InstitutionalMemoryCenter.tsx`

### Cálculo de `ccsscore` (4 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime.ts`
- `src/runtime/adapters/CreditCommitteeSimulatorAdapter.ts`
- `src/runtime/adapters/SovereignDecisionAdapter.ts`
- `src/components/pages/governance/CreditCommitteeCenter.tsx`

### Cálculo de `advisoryscore` (4 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime.ts`
- `src/runtime/adapters/CreditCommitteeSimulatorAdapter.ts`
- `src/runtime/adapters/InstitutionalMemoryAdapter.ts`
- `src/runtime/adapters/SovereignDecisionAdapter.ts`

### Cálculo de `capacityforecast` (3 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime.ts`
- `src/runtime/adapters/ExecutiveExecutionAdapter.ts`
- `src/components/pages/governance/ExecutiveExecutionCenter.tsx`

### Cálculo de `generaterestrictions` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/institutional-reporting/InstitutionalBoardPackRuntime.ts`
- `src/core/runtime/institutional-reporting/engines/InstitutionalDisclosureReportingEngine.ts`

### Cálculo de `trust` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/integrations/ConnectorExecutionEngine.ts`
- `src/core/runtime/integrations/SourceTrustEngine.ts`

### Cálculo de `metrics` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/integrations/PilotRollbackProtocol.ts`
- `src/components/pages/PilotMonitoringDashboard.tsx`

### Cálculo de `buildunifiedstate` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/ios/InstitutionalOperatingSystem.ts`
- `src/core/runtime/ios/InstitutionalStateManager.ts`

### Cálculo de `generatelineagereference` (3 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/knowledge-graph/GovernanceRelationshipGraph.ts`
- `src/core/runtime/knowledge-graph/InstitutionalMemoryEngine.ts`
- `src/core/runtime/knowledge-graph/SemanticLineageEngine.ts`

### Cálculo de `correlations` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/knowledge-graph/RiskCorrelationEngine.ts`
- `src/components/knowledge-graph/RiskCorrelationPanel.tsx`

### Cálculo de `totalscore` (4 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/lifecycle/LifecycleClassificationEngine.ts`
- `src/components/pages/EstruturaGovernancaPage.tsx`
- `src/components/pages/LeadershipProfilePage.tsx`
- `src/components/pages/governance/LeadershipDNACenter.tsx`

### Cálculo de `drift` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/monitoring/ConfidenceDriftDetector.ts`
- `src/core/runtime/monitoring/MonitoringRuleEngine.ts`

### Cálculo de `buildreplayenvelope` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/observability/ExecutionTraceBuilder.ts`
- `src/core/runtime/observability/RuntimeTelemetry.test.ts`

### Cálculo de `stabilityscore` (2 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/observability/ExplainabilityEngine.ts`
- `src/runtime/adapters/EconomicNormalizationAdapter.ts`

### Cálculo de `fragilityscore` (2 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/operating-pressure/FundingFragilityEngine.ts`
- `src/core/runtime/strategic-simulation/DecisionRiskBalancer.ts`

### Cálculo de `narrativesafety` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/orchestrator/InstitutionalFinancialDomainOrchestrator.ts`
- `src/core/runtime/orchestrator/InstitutionalInterpretationBoundary.ts`

### Cálculo de `momentum` (4 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/predictive-governance/GovernanceMomentumEngine.ts`
- `src/core/runtime/predictive-intelligence/DeteriorationMomentumEngine.ts`
- `src/core/runtime/predictive-intelligence/PredictiveGovernanceEngine.ts`
- `src/hooks/usePredictiveGovernance.ts`

### Cálculo de `generatewarnings` (4 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/predictive-governance/InstitutionalEarlyWarningEngine.ts`
- `src/core/runtime/predictive-intelligence/InstitutionalEarlyWarningEngine.ts`
- `src/core/runtime/predictive-intelligence/PredictiveGovernanceEngine.ts`
- `src/hooks/usePredictiveGovernance.ts`

### Cálculo de `generaterecommendations` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/predictive-governance/PredictiveRecommendationEngine.ts`
- `src/hooks/usePredictiveGovernance.ts`

### Cálculo de `risks` (3 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/predictive-governance/PredictiveRecommendationEngine.ts`
- `src/core/runtime/predictive-governance/PredictiveRiskEngine.ts`
- `src/hooks/usePredictiveGovernance.ts`

### Cálculo de `acceleration` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/predictive-intelligence/BehavioralAccelerationEngine.ts`
- `src/core/runtime/predictive-intelligence/PredictiveGovernanceEngine.ts`

### Cálculo de `rupture` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/predictive-intelligence/GovernanceRuptureEngine.ts`
- `src/core/runtime/predictive-intelligence/PredictiveGovernanceEngine.ts`

### Cálculo de `survivabilityscores` (2 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/predictive-intelligence/PredictiveGovernanceEngine.ts`
- `src/core/runtime/predictive-intelligence/SurvivabilityProjectionEngine.ts`

### Cálculo de `forecast` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/predictive-intelligence/PredictiveGovernanceEngine.ts`
- `src/components/pages/ExecutiveScenarioLabPage.tsx`

### Cálculo de `assessrecovery` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/predictive-intelligence/PredictiveGovernanceEngine.ts`
- `src/core/runtime/predictive-intelligence/RecoveryViabilityEngine.ts`

### Cálculo de `collapserisk` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/predictive-intelligence/PredictiveGovernanceEngine.ts`
- `src/core/runtime/predictive-intelligence/StrategicCollapseRiskEngine.ts`

### Cálculo de `generateagenda` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/prescriptive-governance/BoardAgendaEngine.ts`
- `src/hooks/usePrescriptiveGovernance.ts`

### Cálculo de `generateresolutions` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/prescriptive-governance/BoardDraftingEngine.ts`
- `src/hooks/usePrescriptiveGovernance.ts`

### Cálculo de `capacity` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/prescriptive-governance/ExecutionCapacityConstraintEngine.ts`
- `src/hooks/usePrescriptiveGovernance.ts`

### Cálculo de `generateactions` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/prescriptive-governance/PrescriptiveActionEngine.ts`
- `src/hooks/usePrescriptiveGovernance.ts`

### Cálculo de `certification` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/publication-governance/ExecutivePublicationRuntime.ts`
- `src/core/runtime/publication-governance/InstitutionalCertificationEngine.ts`

### Cálculo de `generateexportsignature` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/publication-governance/ExecutivePublicationRuntime.ts`
- `src/core/runtime/publication-governance/PublicationLineageEngine.ts`

### Cálculo de `compliancescore` (2 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/publication-governance/InstitutionalCertificationEngine.ts`
- `src/components/pages/ControladoriaPage.tsx`

### Cálculo de `simulate` (8 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/reality-validation/IntercompanyComplexitySimulator.ts`
- `src/core/runtime/scenario-intelligence/InstitutionalScenarioEngine.ts`
- `src/core/runtime/scenario-intelligence/PropagationSimulationEngine.ts`
- `src/core/runtime/strategic-simulation/ExecutiveScenarioEngine.ts`
- `src/core/runtime/strategic-simulation/StrategicDecisionSimulator.ts`
- `src/core/runtime/strategic-simulation/StrategicSimulationEngine.ts`
- `src/components/reality-validation/InstitutionalComplexityViewer.tsx`
- `src/components/strategic-simulation/StrategicSimulationFeed.tsx`

### Cálculo de `buildstressprofile` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/reality-validation/OperationalStressDatasetBuilder.ts`
- `src/components/reality-validation/OperationalStressDashboard.tsx`

### Cálculo de `downgrade` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/recovery-regression/RecoveryRegressionGuardEngine.ts`
- `src/core/runtime/recovery-regression/RecoveryStageRegressionEngine.ts`

### Cálculo de `buildclone` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/scenario/ScenarioFiduciarySimulator.ts`
- `src/core/runtime/scenario/ScenarioSnapshotBuilder.ts`

### Cálculo de `generatecausalexplanation` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/semantic-consistency/ExecutiveConsistencyReportEngine.ts`
- `src/core/runtime/semantic-consistency/InstitutionalCausalAlignmentEngine.ts`

### Cálculo de `uncertainty` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/strategic-simulation/ExecutiveScenarioEngine.ts`
- `src/core/runtime/strategic-simulation/StrategicPathComparisonEngine.ts`

### Cálculo de `recoveryviability` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/strategic-simulation/InstitutionalOptimizationEngine.ts`
- `src/core/runtime/strategic-simulation/ResilienceOptimizationEngine.ts`

### Cálculo de `runway` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/strategic-simulation/LiquidityTrajectoryEngine.ts`
- `src/core/runtime/strategic-simulation/StrategicSimulationEngine.ts`

### Cálculo de `delta` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/structural-capital/StructuralCapitalOrchestrator.ts`
- `src/core/runtime/structural-capital/StructuralCapitalScoreAdapter.ts`

### Cálculo de `efsiscore` (2 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/treasury-sustainability/TreasurySustainabilityEngine.ts`
- `src/components/pages/DFCPage.tsx`

### Cálculo de `buildscenariopayload` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/validation/RealWorldValidationSuite.spec.ts`
- `src/core/runtime/validation/ValidationDatasetFactory.ts`

### Cálculo de `generateprofile` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/war-gaming/CrisisExplainabilityEngine.ts`
- `src/core/runtime/war-gaming/InstitutionalWarGameEngine.ts`

### Cálculo de `simulatedebitda` (2 implementações)
**Classificação:** CRITICAL

- `src/core/runtime/war-gaming/InstitutionalCollapsePropagationEngine.ts`
- `src/components/pages/StrategicSimulatorPage.tsx`

### Cálculo de `executesimulatedcrisis` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/runtime/war-gaming/war-game-adapter.ts`
- `src/components/war-gaming/InstitutionalWarRoomPage.tsx`

### Cálculo de `generatecausalnarrative` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/governance/__tests__/InstitutionalNarrativeEngine.test.ts`
- `src/core/governance/narrative/InstitutionalNarrativeEngine.ts`

### Cálculo de `signal` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/core/governance/__tests__/SignalSuppressionEngine.test.ts`
- `src/core/governance/signal-hierarchy/SignalSuppressionEngine.ts`

### Cálculo de `dcycles` (4 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/services/aiBoardReportService.ts`
- `src/components/pages/AnaliseFinanceiraPage.tsx`
- `src/components/pages/BalanceSheetPage.tsx`
- `src/components/pages/governance/BoardPackDataLoader.ts`

### Cálculo de `generatecontent` (3 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/services/aiBoardReportService.ts`
- `src/services/aiService.ts`
- `src/services/governanceAiService.ts`

### Cálculo de `generategovernancediagnosis` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/services/aiService.ts`
- `src/components/pages/governance/GovernanceMaturityCenter.tsx`

### Cálculo de `generatecashflow` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/services/cashFlowService.ts`
- `src/components/pages/CashFlowPage.tsx`

### Cálculo de `payrollburdens` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/services/taxService.ts`
- `src/components/EmployeeManager.tsx`

### Cálculo de `severance` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/services/taxService.ts`
- `src/components/EmployeeManager.tsx`

### Cálculo de `inputconfidence` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/runtime/ConfidencePropagator.ts`
- `src/runtime/InferencePipeline.ts`

### Cálculo de `buildfiscalyearscope` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/runtime/FiscalYearScopeBuilder.ts`
- `src/runtime/InstitutionalExecutionContext.ts`

### Cálculo de `buildfirstcyclenarrative` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/runtime/adapters/CapitalGovernanceAdapter.ts`
- `src/runtime/governance/capital/CapitalGovernanceSemanticEngine.ts`

### Cálculo de `brmscore` (2 implementações)
**Classificação:** CRITICAL

- `src/runtime/adapters/CreditCommitteeSimulatorAdapter.ts`
- `src/runtime/adapters/SovereignDecisionAdapter.ts`

### Cálculo de `wcscore` (2 implementações)
**Classificação:** CRITICAL

- `src/runtime/adapters/EconomicNormalizationAdapter.ts`
- `src/runtime/adapters/LegacyDFCAdapter.ts`

### Cálculo de `iddsscore` (2 implementações)
**Classificação:** CRITICAL

- `src/runtime/adapters/ExecutiveExecutionAdapter.ts`
- `src/components/pages/governance/ExecutiveExecutionCenter.tsx`

### Cálculo de `alignmentscore` (2 implementações)
**Classificação:** CRITICAL

- `src/runtime/adapters/ExecutiveExecutionAdapter.ts`
- `src/components/pages/governance/ExecutiveExecutionCenter.tsx`

### Cálculo de `learningscore` (2 implementações)
**Classificação:** CRITICAL

- `src/runtime/adapters/ExecutiveExecutionAdapter.ts`
- `src/components/pages/governance/ExecutiveExecutionCenter.tsx`

### Cálculo de `finalhealthscore` (2 implementações)
**Classificação:** CRITICAL

- `src/runtime/adapters/LegacyDREAdapter.ts`
- `src/components/pages/DREPage.tsx`

### Cálculo de `domainscores` (2 implementações)
**Classificação:** CRITICAL

- `src/runtime/adapters/SovereignDecisionAdapter.ts`
- `src/components/pages/governance/SovereignDecisionCenter.tsx`

### Cálculo de `onsimulateupload` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/components/integrations/ConnectorRegistryPanel.tsx`
- `src/components/pages/InstitutionalIntegrationsPage.tsx`

### Cálculo de `generateinitialdrestate` (3 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/components/modals/ManualFinancialModal.tsx`
- `src/components/pages/BalanceSheetPage.tsx`
- `src/components/pages/governance/BoardPackDataLoader.ts`

### Cálculo de `axisrules` (3 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/components/pages/AxisDashboardPage.tsx`
- `src/components/pages/FinancialAdminDashboard.tsx`
- `src/components/pages/GovernanceDashboardPage.tsx`

### Cálculo de `builddataaccesscontext` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/components/pages/ClientExecutiveWorkspace.tsx`
- `src/components/pages/governance/ObservabilityConsolePage.tsx`

### Cálculo de `adherencescore` (4 implementações)
**Classificação:** CRITICAL

- `src/components/pages/ControladoriaPage.tsx`
- `src/components/pages/EstruturaGovernancaPage.tsx`
- `src/components/pages/LeadershipProfilePage.tsx`
- `src/components/pages/governance/LeadershipDNACenter.tsx`

### Cálculo de `semscore` (2 implementações)
**Classificação:** CRITICAL

- `src/components/pages/DashboardPage.tsx`
- `src/components/pages/IndicatorsPage.tsx`

### Cálculo de `setteamassessments` (3 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/components/pages/EstruturaGovernancaPage.tsx`
- `src/components/pages/LeadershipProfilePage.tsx`
- `src/components/pages/governance/LeadershipDNACenter.tsx`

### Cálculo de `userdisc` (3 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/components/pages/EstruturaGovernancaPage.tsx`
- `src/components/pages/LeadershipProfilePage.tsx`
- `src/components/pages/governance/LeadershipDNACenter.tsx`

### Cálculo de `userenneagram` (3 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/components/pages/EstruturaGovernancaPage.tsx`
- `src/components/pages/LeadershipProfilePage.tsx`
- `src/components/pages/governance/LeadershipDNACenter.tsx`

### Cálculo de `setassessmentstep` (3 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/components/pages/EstruturaGovernancaPage.tsx`
- `src/components/pages/LeadershipProfilePage.tsx`
- `src/components/pages/governance/LeadershipDNACenter.tsx`

### Cálculo de `assessmenttype` (3 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/components/pages/EstruturaGovernancaPage.tsx`
- `src/components/pages/LeadershipProfilePage.tsx`
- `src/components/pages/governance/LeadershipDNACenter.tsx`

### Cálculo de `assessmentstep` (3 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/components/pages/EstruturaGovernancaPage.tsx`
- `src/components/pages/LeadershipProfilePage.tsx`
- `src/components/pages/governance/LeadershipDNACenter.tsx`

### Cálculo de `setassessmenttype` (3 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/components/pages/EstruturaGovernancaPage.tsx`
- `src/components/pages/LeadershipProfilePage.tsx`
- `src/components/pages/governance/LeadershipDNACenter.tsx`

### Cálculo de `governancealignmentscore` (3 implementações)
**Classificação:** CRITICAL

- `src/components/pages/LeadershipProfilePage.tsx`
- `src/components/pages/PortfolioPage.tsx`
- `src/components/pages/governance/GovernanceMaturityCenter.tsx`

### Cálculo de `scorecolor` (4 implementações)
**Classificação:** CRITICAL

- `src/components/pages/governance/BenchmarkReadinessPanel.tsx`
- `src/components/pages/governance/ContinuityRiskPanel.tsx`
- `src/components/pages/governance/CreditCommitteeCenter.tsx`
- `src/components/pages/governance/RiskExposureCenter.tsx`

### Cálculo de `scorebg` (2 implementações)
**Classificação:** CRITICAL

- `src/components/pages/governance/CreditCommitteeCenter.tsx`
- `src/components/pages/governance/RiskExposureCenter.tsx`

### Cálculo de `handlesimulate` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/components/war-gaming/CrisisScenarioPanel.tsx`
- `src/components/war-gaming/InstitutionalWarRoomPage.tsx`

### Cálculo de `onsimulate` (2 implementações)
**Classificação:** REVIEW_REQUIRED

- `src/components/war-gaming/CrisisScenarioPanel.tsx`
- `src/components/war-gaming/InstitutionalWarRoomPage.tsx`

