import { getProfile, mapOfficialRoleToProfileId, PresentationLayer } from '../workspace/runtime/presentation-governance/ExecutiveAudienceProfile';
import { executiveRuntime, ExecutiveIntelligenceReport } from '../core/runtime/executive-intelligence-runtime';
import { InstitutionalBoardPackRuntime } from '../capabilities/runtime/institutional-reporting/InstitutionalBoardPackRuntime';
import { esgimAssessmentEngine } from '../capabilities/runtime/esgim/ESGIMAssessmentEngine';
import { institutionalResilienceIndexEngine } from '../capabilities/runtime/esgim/InstitutionalResilienceIndexEngine';
import { boardPrioritiesEngine } from '../capabilities/financial/runtime/board/BoardPrioritiesEngine';
import { governanceRoadmapEngine } from '../core/runtime/roadmap/GovernanceRoadmapEngine';
import { governanceMonitoringEngine } from '../core/runtime/monitoring/GovernanceMonitoringEngine';
import { executiveBoardReportEngine } from '../core/runtime/reports/ExecutiveBoardReportEngine';
import { ExecutiveBoardReportPDF } from '../core/runtime/reports/ExecutiveBoardReportPDF';
import { boardPackGeneratorEngine } from '../capabilities/financial/runtime/board-pack/BoardPackGeneratorEngine';
import { BoardPackPPTXGenerator } from '../capabilities/financial/runtime/board-pack/BoardPackPPTXGenerator';
import { BoardPackPDFGenerator } from '../capabilities/financial/runtime/board-pack/BoardPackPDFGenerator';
import { decisionRegistryEngine } from '../capabilities/runtime/execution/DecisionRegistryEngine';
import { boardMeetingEngine } from '../capabilities/financial/runtime/board-meeting/BoardMeetingEngine';
import { meetingMinutesEngine } from '../capabilities/financial/runtime/board-meeting/MeetingMinutesEngine';
import { InstitutionalWisdomLibrary } from '../core/runtime/knowledge/InstitutionalWisdomLibrary';
import { governanceKnowledgeEngine } from '../core/runtime/knowledge/GovernanceKnowledgeEngine';
import { benchmarkReadinessEngine } from '../core/runtime/benchmark/BenchmarkReadinessEngine';
import { benchmarkComparativeEngine } from '../core/runtime/benchmark/BenchmarkComparativeEngine';
import { benchmarkAdvisoryEngine } from '../core/runtime/benchmark/BenchmarkAdvisoryEngine';
import { governanceLearningEngine } from '../core/runtime/learning/GovernanceLearningEngine';
import { governanceJourneyEngine } from '../workspace/runtime/journey/GovernanceJourneyEngine';
import { InstitutionalBoardPackOutput, LineageAppendix } from '../capabilities/runtime/institutional-reporting/institutional-reporting-types';
import { ExecutiveAssuranceRuntime } from '../capabilities/runtime/audit-assurance/ExecutiveAssuranceRuntime';
import { InstitutionalAuditEngine } from '../capabilities/runtime/audit-assurance/InstitutionalAuditEngine';
import { ExecutiveInformationDensityFramework } from '../workspace/runtime/presentation-governance/ExecutiveInformationDensityFramework';
import { ExecutiveEmptyStatePolicy } from '../capabilities/financial/runtime/dre/ExecutiveEmptyStatePolicy';
import { ExecutiveLabelResolver } from '../workspace/runtime/executive-presentation/ExecutiveLabelResolver';
import { BalanceSheetFinancialMetricsEngine } from '../capabilities/runtime/governance/bp/BalanceSheetFinancialMetricsEngine';
import { DFCSemanticRenderingGuard } from '../workspace/runtime/lifecycle/DFCSemanticRenderingGuard';
import { ExecutivePriorityResolver } from '../capabilities/runtime/decision-intelligence/ExecutivePriorityResolver';
import { EFOSPresentationLeakGuard } from '../workspace/runtime/executive-consolidation/EFOSPresentationLeakGuard';
import { CrossStatementPresentationGuard } from '../workspace/runtime/executive-consolidation/CrossStatementPresentationGuard';
import { MetricCanonicalizationEngine } from '../workspace/runtime/executive-consolidation/MetricCanonicalizationEngine';
import { ExecutiveRecommendation } from '../workspace/runtime/executive-consolidation/ExecutiveRecommendationDeduplicationEngine';
import { RuntimeExecutionRegistry } from '../platform/observability/RuntimeExecutionRegistry';
import { RuntimeHealthMonitor } from '../platform/observability/RuntimeHealthMonitor';
import { ExecutionReplayEngine } from '../capabilities/financial/runtime/consolidated/ExecutionReplayEngine';
import { RuntimeExecutionRecord, RuntimeHealthSnapshot, ReplayExecutionResult } from '../platform/observability/observability-types';
import { ConsolidatedExecutiveAdvisoryReport } from '../capabilities/financial/runtime/consolidated/advisory/advisoryTypes';
import { DecisionRecordRegistry } from '../workspace/runtime/workflow-governance/DecisionRecordRegistry';
import { WorkflowAuditLogger } from '../workspace/runtime/workflow-governance/WorkflowAuditLogger';
import { detectCrossStatementCausality } from '../core/runtime/CrossStatementCausalityEngine';
import { InstitutionalDisclosure } from '../core/runtime/shared/runtime-contracts';
import { enterpriseRiskEngine } from '../capabilities/runtime/governance/risk/EnterpriseRiskEngine';
import { RiskHeatmap } from '../capabilities/runtime/governance/risk/types';
export type { RiskHeatmap };
import { RuntimeLatencySnapshot } from '../core/runtime/profiling/ProfilingTypes';
import { StrategicDecisionSimulator } from '../capabilities/runtime/strategic-simulation/StrategicDecisionSimulator';
import { MultiScenarioComparisonEngine } from '../capabilities/runtime/strategic-simulation/MultiScenarioComparisonEngine';
import { InstitutionalOrchestrationEngine } from '../workspace/runtime/governance-orchestration/InstitutionalOrchestrationEngine';
import { GovernanceRecommendationEvidenceBinder } from '../workspace/runtime/governance-orchestration/GovernanceRecommendationEvidenceBinder';
import { GovernanceCoordinationResult } from '../workspace/runtime/governance-orchestration/GovernanceOrchestrationTypes';
import { ScenarioAdapter } from '../capabilities/runtime/scenario-intelligence/scenario-adapter';
import { InstitutionalScenarioEngine } from '../capabilities/runtime/scenario-intelligence/InstitutionalScenarioEngine';
import { InstitutionalScenarioResult } from '../capabilities/runtime/scenario-intelligence/scenario-types';
import { ScenarioNarrativeComposer } from '../capabilities/runtime/scenario-intelligence/ScenarioNarrativeComposer';
import { DFCCausalDriverPresentationAudit } from '../capabilities/financial/runtime/cash-causal-intelligence/DFCCausalDriverPresentationAudit';
import { ExecutivePresentationLabelRegistry } from '../workspace/runtime/presentation-governance/ExecutivePresentationLabelRegistry';
import { DFCDensityComplianceAudit } from '../workspace/runtime/presentation-governance/DFCDensityComplianceAudit';
import { ScenarioSimulationConsistencyEngine } from '../capabilities/financial/runtime/cash-scenario-intelligence/ScenarioSimulationConsistencyEngine';
import { ExecutiveNumericPresentationGuard } from '../workspace/runtime/presentation-governance/ExecutiveNumericPresentationGuard';
import { ExecutivePresentationAuditEngine } from '../workspace/runtime/presentation-governance/ExecutivePresentationAuditEngine';
import { DFCBoardPriorityPresentationAdapter } from '../capabilities/runtime/decision-intelligence/DFCBoardPriorityPresentationAdapter';
import { DFCSnapshotBindingAudit } from '../workspace/runtime/presentation-governance/DFCSnapshotBindingAudit';
import { ExecutiveConsequenceIntelligenceLayer } from '../capabilities/runtime/decision-intelligence/ExecutiveConsequenceIntelligenceLayer';
import { TreasurySustainabilityNarrativeEngine } from '../capabilities/runtime/treasury-sustainability/TreasurySustainabilityNarrativeEngine';
import { ExecutiveLanguageRegistry } from '../workspace/runtime/presentation-governance/ExecutiveLanguageRegistry';
import { ExecutiveLanguageLeakAudit } from '../workspace/runtime/presentation-governance/ExecutiveLanguageLeakAudit';
import { ExecutiveLanguageBoundaryGuard } from '../workspace/runtime/presentation-governance/ExecutiveLanguageBoundaryGuard';
import { DFCGovernanceOrchestrator } from '../capabilities/runtime/governance/dfc/DFCGovernanceOrchestrator';
import { DFCSSOTGuard } from '../capabilities/runtime/governance/dfc/DFCSSOTGuard';
import { DFCRuntimeUIReconciliationAudit } from '../capabilities/runtime/governance/dfc/DFCRuntimeUIReconciliationAudit';

export const FiduciaryRuntimeAdapter = {
  DFCGovernanceOrchestrator,
  DFCSSOTGuard,
  DFCRuntimeUIReconciliationAudit,
  DFCCausalDriverPresentationAudit,
  ExecutivePresentationLabelRegistry,
  DFCDensityComplianceAudit,
  ScenarioSimulationConsistencyEngine,
  ExecutiveNumericPresentationGuard,
  ExecutivePresentationAuditEngine,
  DFCBoardPriorityPresentationAdapter,
  DFCSnapshotBindingAudit,
  ExecutiveConsequenceIntelligenceLayer,
  TreasurySustainabilityNarrativeEngine,
  ExecutiveLanguageRegistry,
  ExecutiveLanguageLeakAudit,
  ExecutiveLanguageBoundaryGuard,
  getProfile,
  mapOfficialRoleToProfileId,
  ExecutiveInformationDensityFramework,
  ExecutiveEmptyStatePolicy,
  ExecutiveLabelResolver,
  esgimAssessmentEngine,
  institutionalResilienceIndexEngine,
  boardPrioritiesEngine,
  governanceRoadmapEngine,
  governanceMonitoringEngine,
  executiveBoardReportEngine,
  ExecutiveBoardReportPDF,
  boardPackGeneratorEngine,
  BoardPackPPTXGenerator,
  BoardPackPDFGenerator,
  decisionRegistryEngine,
  boardMeetingEngine,
  meetingMinutesEngine,
  InstitutionalWisdomLibrary,
  governanceKnowledgeEngine,
  benchmarkReadinessEngine,
  benchmarkComparativeEngine,
  benchmarkAdvisoryEngine,
  governanceLearningEngine,
  governanceJourneyEngine,
  BalanceSheetFinancialMetricsEngine,
  DFCSemanticRenderingGuard,
  ExecutivePriorityResolver,
  EFOSPresentationLeakGuard,
  CrossStatementPresentationGuard,
  MetricCanonicalizationEngine,
  RuntimeExecutionRegistry,
  RuntimeHealthMonitor,
  ExecutionReplayEngine,
  DecisionRecordRegistry,
  WorkflowAuditLogger,
  detectCrossStatementCausality,
  enterpriseRiskEngine,
  StrategicDecisionSimulator,
  MultiScenarioComparisonEngine,
  InstitutionalOrchestrationEngine,
  GovernanceRecommendationEvidenceBinder,
  ScenarioAdapter,
  InstitutionalScenarioEngine,
  ScenarioNarrativeComposer,
  generateExecutiveReport(payload: any) {
    return executiveRuntime.generateExecutiveReport(payload);
  },
  generateBoardPack(payload: any) {
    const report = executiveRuntime.generateExecutiveReport(payload);
    return InstitutionalBoardPackRuntime.generate(report);
  },
  executeAssurance(payload: any) {
    const runtime = new ExecutiveAssuranceRuntime();
    return runtime.evaluateExecution(payload);
  },
  registerAudit(payload: any) {
    const engine = new InstitutionalAuditEngine();
    return engine.registerAudit(payload);
  }
};

// Re-exports
export type { ExecutiveIntelligenceReport } from '../core/runtime/executive-intelligence-runtime';
export { executiveRuntime } from '../core/runtime/executive-intelligence-runtime';
export { InstitutionalLocaleGuard } from '../platform/locale/InstitutionalLocaleGuard';
export { ExecutiveLabelResolver } from '../workspace/runtime/executive-presentation/ExecutiveLabelResolver';
export { ExecutiveDisclosureResolver } from '../workspace/runtime/executive-presentation/ExecutiveDisclosureResolver';
export { ExecutiveNarrativeDeduplicationEngine } from '../workspace/runtime/executive-presentation/ExecutiveNarrativeDeduplicationEngine';
export { InstitutionalCopilotRuntime } from '../capabilities/runtime/ai-governance/InstitutionalCopilotRuntime';
export { MockLLMProvider } from '../capabilities/runtime/ai-governance/providers/MockLLMProvider';
export type { AIQueryRequest, AIQueryResponse, AIGroundingReference } from '../capabilities/runtime/ai-governance/AIGovernanceTypes';
export type { BenchmarkMetric, BenchmarkConfidenceSignal, BenchmarkExecutionRecord } from '../core/runtime/benchmarking/BenchmarkTypes';
export { SectorRiskPatternAnalyzer } from '../core/runtime/benchmarking/SectorRiskPatternAnalyzer';
export type { InstitutionalScenarioResult } from '../capabilities/runtime/scenario-intelligence/scenario-types';
export { BoardResolutionEngine } from '../capabilities/financial/runtime/board-decision/BoardResolutionEngine';
export type { ConsolidatedExecutiveAdvisoryReport } from '../capabilities/financial/runtime/consolidated/advisory/advisoryTypes';
export type { HoldingRoleAnalysis, DependencyAnalysis, CrossEntityCausality, SystemicRisk } from '../capabilities/financial/runtime/consolidated/advisory/advisoryTypes';
export { BenchmarkDeviationDetector } from '../capabilities/runtime/early-warning/BenchmarkDeviationDetector';
export { EarlyWarningSignalEngine } from '../capabilities/runtime/early-warning/EarlyWarningSignalEngine';
export type { PredictiveRiskEvent } from '../capabilities/runtime/early-warning/EarlyWarningTypes';
export { GovernanceDeteriorationIndex } from '../capabilities/runtime/early-warning/GovernanceDeteriorationIndex';
export { GraphPatternWarningEngine } from '../capabilities/runtime/early-warning/GraphPatternWarningEngine';
export { PredictiveGovernanceDetector } from '../capabilities/runtime/early-warning/PredictiveGovernanceDetector';
export { ScenarioDeteriorationWatcher } from '../capabilities/runtime/early-warning/ScenarioDeteriorationWatcher';
export { InstitutionalOfferingRegistry } from '../capabilities/runtime/commercial-readiness/InstitutionalOfferingRegistry';
export { RealDataValidationEngine } from '../capabilities/runtime/enterprise-validation/RealDataValidationEngine';
export { CognitiveLoadEvaluator } from '../workspace/runtime/ux-hardening/CognitiveLoadEvaluator';
export { EnterpriseOnboardingPlaybook } from '../capabilities/runtime/operational-playbooks/EnterpriseOnboardingPlaybook';
export { PilotGovernanceChecklist } from '../capabilities/runtime/pilot-readiness/PilotGovernanceChecklist';
export type { InstitutionalEvidenceValidationOutput } from '../capabilities/runtime/evidence-ingestion/InstitutionalEvidenceTypes';
export type { ExecutiveNarrative } from '../workspace/runtime/executive/types';
export { BoardModeGuard } from '../workspace/runtime/executive/board/BoardModeGuard';
export type { BoardFlowStep } from '../workspace/runtime/executive/board/InstitutionalBoardFlow';
export { InstitutionalBoardFlow } from '../workspace/runtime/executive/board/InstitutionalBoardFlow';
export { ExecutiveSessionContext } from '../workspace/runtime/executive/board/ExecutiveSessionContext';
export { ExecutiveDemoScenarioRegistry } from '../workspace/runtime/executive/demo/ExecutiveDemoScenarioRegistry';
export type { DemoScenario } from '../workspace/runtime/executive/demo/ExecutiveDemoScenarioRegistry';
export { ExecutiveDemoSession } from '../workspace/runtime/executive/demo/ExecutiveDemoSession';
export type { DemoSessionState } from '../workspace/runtime/executive/demo/ExecutiveDemoSession';
export { ExecutiveStorySequenceResolver } from '../workspace/runtime/executive/demo/ExecutiveStorySequenceResolver';
export { InstitutionalDemoDatasetGuard } from '../workspace/runtime/executive/demo/InstitutionalDemoDatasetGuard';
export type { GuidedJourneyStep } from '../workspace/runtime/executive/demo/GuidedBoardJourneyEngine';
export { GuidedBoardJourneyEngine } from '../workspace/runtime/executive/demo/GuidedBoardJourneyEngine';
export type { ExecutiveCommandExplainability, ExecutiveDirective, ExecutiveDriftEvent, GovernanceExecutionTracking, InstitutionalExecutiveCommandOutput, StrategicOrchestration, ExecutiveCommandThesis, InstitutionalAlignmentState } from '../workspace/runtime/executive-command/executive-command-types';
export { CalibrationEngine } from '../core/runtime/calibration/CalibrationEngine';
export type { CausalEdge, ExecutiveSeverityLevel, ExecutiveModalPriority, ExecutiveEscalationLevel } from '../workspace/runtime/executive-interaction/types';
export type { GovernanceSupervisionMode } from '../workspace/runtime/governance-command-center/types';
export type { GovernanceIncident } from '../workspace/runtime/governance-command-center/types';
export { InstitutionalOrchestrationEngine } from '../workspace/runtime/governance-orchestration/InstitutionalOrchestrationEngine';
export type { BoardPackMetadata, ConstitutionalSection, ContinuitySection, ExecutiveDirectiveSection, ExecutiveSnapshotSection, ExplainabilityAppendix, FiduciaryTimelineSection, GovernanceReportingSection, InstitutionalBoardPackOutput, LineageAppendix, OperationalGovernanceSection, FiduciaryRestriction, StrategicDirectionSection, TreasurySection, BoardResolutionAppendix, ReportGenerationStatus } from '../capabilities/runtime/institutional-reporting/institutional-reporting-types';
export { ConnectorRegistry } from '../capabilities/runtime/integrations/ConnectorRegistry';
export type { ImportedDataset, RollbackAuditEntry, SourceTrustLevel, IngestionLineageReference } from '../capabilities/runtime/integrations/IntegrationGovernanceTypes';
export type { ExternalConnector, StagingValidationWarning } from '../capabilities/runtime/integrations/IntegrationGovernanceTypes';
export { InstitutionalOperatingSystem } from '../workspace/runtime/ios/InstitutionalOperatingSystem';
export { GraphQueryEngine } from '../core/runtime/knowledge-graph/GraphQueryEngine';
export type { GraphQueryResult } from '../core/runtime/knowledge-graph/KnowledgeGraphTypes';
export { InstitutionalMemoryEngine } from '../core/runtime/knowledge-graph/InstitutionalMemoryEngine';
export { InstitutionalOntologyRegistry } from '../core/runtime/knowledge-graph/InstitutionalOntologyRegistry';
export { RiskCorrelationEngine } from '../core/runtime/knowledge-graph/RiskCorrelationEngine';
export { WorkflowPatternAnalyzer } from '../core/runtime/knowledge-graph/WorkflowPatternAnalyzer';
export { StagingValidationEngine } from '../capabilities/runtime/integrations/StagingValidationEngine';
export { ImportReviewQueue } from '../capabilities/runtime/integrations/ImportReviewQueue';
export { ImportPublicationEngine } from '../capabilities/runtime/integrations/ImportPublicationEngine';
export type { MonitoringSeverity, MonitoringAlert } from '../core/runtime/monitoring/MonitoringTypes';
export { PressureNarrativeComposer } from '../capabilities/runtime/operating-pressure/PressureNarrativeComposer';
export type { ExecutionIntegrityState, InstitutionalDependencyRisk, InstitutionalOperationalGovernanceOutput, OperationalContinuityState, OperationalFrictionEvent, StrategicExecutionAlignment, OperationalGovernanceThesis } from '../capabilities/runtime/operational-governance/operational-governance-types';
export type { ExplainabilityOutput } from '../core/runtime/shared/runtime-contracts';
export { CALIBRATION_PROFILES, BALANCED_PROFILE } from '../core/runtime/calibration/CalibrationProfiles';
export type { CalibrationParameters, CalibrationProfileVersion } from '../core/runtime/calibration/CalibrationTypes';
export type { EconomicGroupModel } from '../capabilities/financial/runtime/consolidated/data/GroupOnboardingRepository';
export { GroupOnboardingRepository } from '../capabilities/financial/runtime/consolidated/data/GroupOnboardingRepository';
export type { EconomicGroupEntityModel } from '../capabilities/financial/runtime/consolidated/data/GroupEntityMappingRepository';
export { GroupEntityMappingRepository } from '../capabilities/financial/runtime/consolidated/data/GroupEntityMappingRepository';
export type { IntercompanyRelationModel } from '../capabilities/financial/runtime/consolidated/data/IntercompanyRelationRepository';
export { IntercompanyRelationRepository } from '../capabilities/financial/runtime/consolidated/data/IntercompanyRelationRepository';
export { ConsolidatedDataModelValidator } from '../capabilities/financial/runtime/consolidated/data/ConsolidatedDataModelValidator';
export { CapitalGovernanceAdapter } from '../capabilities/financial/runtime/capital-governance/capital-governance-adapter';
export { LifecycleContextBuilder } from '../workspace/runtime/lifecycle/LifecycleContextBuilder';
export { LifecycleSemanticAuthority } from '../workspace/runtime/lifecycle/LifecycleSemanticAuthority';
export { LifecycleRenderAudit } from '../workspace/runtime/lifecycle/LifecycleRenderAudit';
export { DLPAExecutiveRenderingGuard } from '../workspace/runtime/lifecycle/DLPAExecutiveRenderingGuard';
export type { DLPAViolation } from '../workspace/runtime/lifecycle/DLPAExecutiveRenderingGuard';
export { DLPALegacyLabelScanner } from '../workspace/runtime/lifecycle/DLPALegacyLabelScanner';
export { DecisionRecordRegistry } from '../workspace/runtime/workflow-governance/DecisionRecordRegistry';
export { WorkflowAuditLogger } from '../workspace/runtime/workflow-governance/WorkflowAuditLogger';
export { AlertResponseWorkflow } from '../workspace/runtime/workflow-governance/AlertResponseWorkflow';
export { DecisionLineageBinder } from '../workspace/runtime/workflow-governance/DecisionLineageBinder';
export { InstitutionalBenchmarkEngine } from '../core/runtime/benchmarking/InstitutionalBenchmarkEngine';
export type { InstitutionalDeploymentReadinessOutput } from '../capabilities/runtime/deployment-readiness/DeploymentReadinessTypes';
export { ConnectorExecutionEngine } from '../capabilities/runtime/integrations/ConnectorExecutionEngine';
export { MonitoringExecutionScheduler } from '../core/runtime/monitoring/MonitoringExecutionScheduler';
export { MonitoringAlertRegistry } from '../core/runtime/monitoring/MonitoringAlertRegistry';
export type { InstitutionalOnboardingOutput } from '../capabilities/runtime/institutional-onboarding/InstitutionalOnboardingTypes';
export type { ExecutiveBoardPack } from '../core/runtime/reporting/ReportingTypes';
export { InstitutionalExecutiveCommandRuntime } from '../workspace/runtime/executive-command/InstitutionalExecutiveCommandRuntime';
export { InstitutionalOperationalGovernanceRuntime } from '../capabilities/runtime/operational-governance/InstitutionalOperationalGovernanceRuntime';
export { InstitutionalStrategicIntelligenceRuntime } from '../capabilities/runtime/strategic-intelligence/InstitutionalStrategicIntelligenceRuntime';
export { PilotRollbackProtocol } from '../capabilities/runtime/integrations/PilotRollbackProtocol';
export { ConnectorAuditLogger } from '../capabilities/runtime/integrations/ConnectorAuditLogger';
export { ProductGovernanceEngine } from '../capabilities/runtime/product-governance/ProductGovernanceEngine';
export { GoldenDatasetRegistry } from '../core/runtime/reality-validation/GoldenDatasetRegistry';
export { GoldenDatasetIsolationEngine } from '../core/runtime/reality-validation/GoldenDatasetIsolationEngine';
export type { GoldenDatasetProfile } from '../core/runtime/reality-validation/RealityValidationTypes';
export type { RuntimeExecutionRecord, RuntimeHealthSnapshot, ReplayExecutionResult } from '../platform/observability/observability-types';
export type { RuntimeLatencySnapshot } from '../core/runtime/profiling/ProfilingTypes';
export type { ScenarioTradeoffProfile, BoardResolution } from '../capabilities/financial/runtime/board-decision/board-decision-types';
export { ScenarioTradeoffEngine } from '../capabilities/runtime/scenario-intelligence/ScenarioTradeoffEngine';
export type { SystemicRiskProfile, ContagionEdge, StressPropagationWarning, StressPropagationConfidence } from '../capabilities/financial/runtime/consolidated/stress/stress-types';
export type { InstitutionalCausalityOutput, CausalChain } from '../capabilities/financial/runtime/causal-intelligence/causal-types';
export type { ConstitutionalAxiomStatus, ConfidenceBreakdown, ConstitutionalEnforcementAction, ConstitutionalGovernanceDashboardOutput, ConstitutionalLineageInformation, ConstitutionalRestriction } from '../capabilities/runtime/constitutional-governance/constitutional-dashboard-types';
export type { ExecutiveTimelineOutput } from '../workspace/runtime/executive-timeline/executive-timeline-types';
export { RuntimePartitionManager } from '../capabilities/runtime/distributed/RuntimePartitionManager';
export { WorkerRegistry } from '../capabilities/runtime/distributed/WorkerRegistry';
export { AsyncJobQueue } from '../capabilities/runtime/distributed/AsyncJobQueue';
export type { InstitutionalCashSignal } from '../capabilities/financial/runtime/cash-intelligence/types';
export type { CausalFactor, CausalSeverity, CausalGraph, CausalNode } from '../capabilities/financial/runtime/causal-intelligence/types';
export { ONBOARDING_STEPS } from '../capabilities/runtime/pilot-operations/ExecutiveOnboardingEngine';
export type { PilotValidationCategory, PilotFeedbackSeverity, PilotTenantStatus } from '../capabilities/runtime/pilot-operations/types';
export type { FeatureId, QuotaId } from '../capabilities/runtime/product-governance/ProductGovernanceTypes';
export type { ProductAccessEvent } from '../capabilities/runtime/product-governance/ProductGovernanceTypes';
export { FeatureFlagRegistry } from '../capabilities/runtime/product-governance/FeatureFlagRegistry';
export { ProductAccessAuditLogger } from '../capabilities/runtime/product-governance/ProductAccessAuditLogger';
export { ProductPlanRegistry } from '../capabilities/runtime/product-governance/ProductPlanRegistry';
export { CrossTenantStressValidator } from '../capabilities/runtime/operational-scale/CrossTenantStressValidator';
export { ExecutiveAttentionMapper } from '../workspace/runtime/premium-ux/ExecutiveAttentionMapper';
export { IntercompanyComplexitySimulator } from '../core/runtime/reality-validation/IntercompanyComplexitySimulator';
export { OperationalScalabilityEvaluator } from '../capabilities/runtime/operational-scale/OperationalScalabilityEvaluator';
export { OperationalStressDatasetBuilder } from '../core/runtime/reality-validation/OperationalStressDatasetBuilder';
export { InstitutionalSessionStabilityEngine } from '../capabilities/runtime/operational-scale/InstitutionalSessionStabilityEngine';
export type { SandboxConfig, SimulationIntegrityState, SimulationPropagationSeverity, SimulationScenarioType, SimulationTimeHorizon, StrategicStressLevel } from '../capabilities/runtime/scenario-simulation/types';
export type { CapitalStrategyAlignment, ExpansionSustainability, InstitutionalStrategicIntelligenceOutput, InstitutionalVector, StrategicContradiction, StrategicExplainability, StrategicPosture, LongitudinalTrajectoryStatus } from '../capabilities/runtime/strategic-intelligence/strategic-intelligence-types';
export { StrategicDecisionSimulator } from '../capabilities/runtime/strategic-simulation/StrategicDecisionSimulator';
export type { StrategicSimulationResult } from '../capabilities/runtime/strategic-simulation/StrategicSimulationTypes';
export type { StrategicSimulationInput } from '../capabilities/runtime/strategic-simulation/StrategicSimulationTypes';
export { StrategicDecisionEvidenceBinder } from '../capabilities/runtime/strategic-simulation/StrategicDecisionEvidenceBinder';
export type { TemporalTrajectoryPoint, TemporalEvent, PredictiveRecurrenceState, ResponsivenessMetrics, TemporalEscalationState, TemporalConfidenceState, EarlyWarningSignal, TemporalCausalityOutput, TemporalDensityMap } from '../capabilities/runtime/institutional-memory/types';
export { AdvisorWorkspaceManager } from '../platform/tenant/AdvisorWorkspaceManager';
export type { Workspace } from '../platform/tenant/TenancyTypes';
export type { CrisisPropagationNode, CrisisExplainabilityProfile, CrisisInput, CrisisType, InstitutionalSurvivalThesis, WarGameResult, TreasurySurvivalProfile } from '../capabilities/runtime/war-gaming/war-gaming-types';
export { WarGameAdapter } from '../capabilities/runtime/war-gaming/war-game-adapter';
export type { WorkflowStatus } from '../workspace/runtime/workflow-governance/WorkflowGovernanceTypes';
export type { WorkflowAuditRecord, DecisionWorkflow } from '../workspace/runtime/workflow-governance/WorkflowGovernanceTypes';

// Additional Missing Exports
export type { PresentationLayer } from '../workspace/runtime/presentation-governance/ExecutiveAudienceProfile';
export type { InstitutionalDisclosure } from '../core/runtime/shared/runtime-contracts';
export type { ExecutiveRecommendation } from '../workspace/runtime/executive-consolidation/ExecutiveRecommendationDeduplicationEngine';
export type { GovernanceCoordinationResult } from '../workspace/runtime/governance-orchestration/GovernanceOrchestrationTypes';
export type { ESGIMDimension, ESGIMMode, ESGIMScenario, IRILevel, BoardPriority, BoardExecutiveBrief, GovernanceRoadmap, GovernanceRoadmapPhase, GovernanceMonitoringSnapshot, GovernanceMonitoringResult, MonitoringAlert as GMLMonitoringAlert, ExecutiveBoardReport, BoardPack, BoardPackSlide, RecommendedDecisionEntry, BoardPackSlideTemplate, SlideMeetingCriticality, GovernanceDecision, GovernanceDecisionType, CognitiveOriginEngine, DecisionExecutionRisk, MeetingAgendaItem, BoardResolution as MeetingBoardResolution, BoardMeeting, MeetingMinutes, PrincipleMatch, GovernanceKnowledgeResult, BenchmarkReadinessLevel, BenchmarkReadinessResult, BenchmarkPosition, BenchmarkGap, ComparativeDimension, BenchmarkComparativeResult, BenchmarkTargetTier, AdvisoryInitiative, BenchmarkAdvancementGap, BenchmarkAdvisoryResult, LearningObservation, GovernanceLearningResult, GovernanceJourneyStep, GovernanceJourneyResult } from '../capabilities/runtime/esgim/esgimTypes';
export type { IWLPrinciple } from '../core/runtime/knowledge/InstitutionalWisdomLibrary';
export { ExecutiveDecisionSynthesisEngine } from '../workspace/runtime/executive-consolidation/ExecutiveDecisionSynthesisEngine';
export { HistoricalInsightEngine } from '../workspace/runtime/executive-consolidation/HistoricalInsightEngine';
export type { HistoricalSeries } from '../workspace/runtime/executive-consolidation/HistoricalInsightEngine';
export type { ExecutiveStrategicDiagnosisPayload } from '../workspace/runtime/executive-consolidation/ExecutiveSynthesisTypes';
export type { ExecutiveDecisionPayload } from '../workspace/runtime/executive-consolidation/ExecutiveSynthesisTypes';
export type { ExecutiveAnalysisContext } from '../workspace/runtime/executive-consolidation/StrategicOpinionConsistencyEngine';
export type { HistoricalInsightDriver } from '../workspace/runtime/executive-consolidation/HistoricalInsightEngine';
export { ExecutivePrimaryMotiveConsistencyEngine } from '../workspace/runtime/executive-consolidation/ExecutivePrimaryMotiveConsistencyEngine';
export { LiquidityExecutiveAssessmentEngine } from '../workspace/runtime/executive-consolidation/LiquidityExecutiveAssessmentEngine';
export type { ExecutiveAssessmentResult } from '../workspace/runtime/executive-consolidation/LiquidityExecutiveAssessmentEngine';
export { AssetQualityExecutiveAssessmentEngine } from '../workspace/runtime/executive-consolidation/AssetQualityExecutiveAssessmentEngine';
export { CapitalStructureExecutiveAssessmentEngine } from '../workspace/runtime/executive-consolidation/CapitalStructureExecutiveAssessmentEngine';
export { WorkingCapitalExecutiveAssessmentEngine } from '../workspace/runtime/executive-consolidation/WorkingCapitalExecutiveAssessmentEngine';
export { CapitalEfficiencyExecutiveAssessmentEngine } from '../workspace/runtime/executive-consolidation/CapitalEfficiencyExecutiveAssessmentEngine';
export { CapitalPreservationExecutiveAssessmentEngine } from '../workspace/runtime/executive-consolidation/CapitalPreservationExecutiveAssessmentEngine';

export {
  CrossStatementExecutiveNarrativeEngine,
} from '../workspace/runtime/executive-consolidation/CrossStatementExecutiveNarrativeEngine';


export { ExecutiveStrategicTensionEngine } from '../workspace/runtime/executive-consolidation/ExecutiveStrategicTensionEngine';
export type { StrategicTension } from '../workspace/runtime/executive-consolidation/ExecutiveStrategicTensionEngine';
export { BalanceSheetExecutiveViewModelBuilder } from '../workspace/runtime/executive-consolidation/BalanceSheetExecutiveViewModelBuilder';
export { FinancialAnalyticsBuilder } from '../workspace/runtime/executive-consolidation/builders/FinancialAnalyticsBuilder';

export { DreExecutiveViewModelBuilder } from '../capabilities/financial/runtime/dre/DreExecutiveViewModelBuilder';
export { DreContractGuard } from '../capabilities/financial/runtime/dre/DreContractGuard';
export type { DreExecutiveViewModel } from '../capabilities/financial/runtime/dre/DreExecutiveViewModelBuilder';
export { BPStrategicDiagnosisDriverMapper } from '../capabilities/runtime/governance/bp/BPStrategicDiagnosisDriverMapper';
export type { BPStrategicDiagnosisDrivers } from '../capabilities/runtime/governance/bp/BPStrategicDiagnosisDriverMapper';
