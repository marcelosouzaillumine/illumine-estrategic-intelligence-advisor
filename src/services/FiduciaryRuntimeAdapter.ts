import { getProfile, mapOfficialRoleToProfileId, PresentationLayer } from '../core/runtime/presentation-governance/ExecutiveAudienceProfile';
import { executiveRuntime, ExecutiveIntelligenceReport } from '../core/runtime/executive-intelligence-runtime';
import { InstitutionalBoardPackRuntime } from '../core/runtime/institutional-reporting/InstitutionalBoardPackRuntime';
import { esgimAssessmentEngine } from '../core/runtime/esgim/ESGIMAssessmentEngine';
import { institutionalResilienceIndexEngine } from '../core/runtime/esgim/InstitutionalResilienceIndexEngine';
import { boardPrioritiesEngine } from '../core/runtime/board/BoardPrioritiesEngine';
import { governanceRoadmapEngine } from '../core/runtime/roadmap/GovernanceRoadmapEngine';
import { governanceMonitoringEngine } from '../core/runtime/monitoring/GovernanceMonitoringEngine';
import { executiveBoardReportEngine } from '../core/runtime/reports/ExecutiveBoardReportEngine';
import { ExecutiveBoardReportPDF } from '../core/runtime/reports/ExecutiveBoardReportPDF';
import { InstitutionalBoardPackOutput, LineageAppendix } from '../core/runtime/institutional-reporting/institutional-reporting-types';
import { ExecutiveAssuranceRuntime } from '../core/runtime/audit-assurance/ExecutiveAssuranceRuntime';
import { InstitutionalAuditEngine } from '../core/runtime/audit-assurance/InstitutionalAuditEngine';
import { ExecutiveInformationDensityFramework } from '../core/runtime/presentation-governance/ExecutiveInformationDensityFramework';
import { ExecutiveEmptyStatePolicy } from '../core/runtime/dre/ExecutiveEmptyStatePolicy';
import { ExecutiveLabelResolver } from '../core/runtime/executive-presentation/ExecutiveLabelResolver';
import { BalanceSheetFinancialMetricsEngine } from '../core/runtime/governance/bp/BalanceSheetFinancialMetricsEngine';
import { DFCSemanticRenderingGuard } from '../core/runtime/lifecycle/DFCSemanticRenderingGuard';
import { ExecutivePriorityResolver } from '../core/runtime/decision-intelligence/ExecutivePriorityResolver';
import { EFOSPresentationLeakGuard } from '../core/runtime/executive-consolidation/EFOSPresentationLeakGuard';
import { CrossStatementPresentationGuard } from '../core/runtime/executive-consolidation/CrossStatementPresentationGuard';
import { MetricCanonicalizationEngine } from '../core/runtime/executive-consolidation/MetricCanonicalizationEngine';
import { ExecutiveRecommendation } from '../core/runtime/executive-consolidation/ExecutiveRecommendationDeduplicationEngine';
import { RuntimeExecutionRegistry } from '../core/runtime/observability/RuntimeExecutionRegistry';
import { RuntimeHealthMonitor } from '../core/runtime/observability/RuntimeHealthMonitor';
import { ExecutionReplayEngine } from '../core/runtime/observability/ExecutionReplayEngine';
import { RuntimeExecutionRecord, RuntimeHealthSnapshot, ReplayExecutionResult } from '../core/runtime/observability/observability-types';
import { ConsolidatedExecutiveAdvisoryReport } from '../core/runtime/consolidated/advisory/advisoryTypes';
import { DecisionRecordRegistry } from '../core/runtime/workflow-governance/DecisionRecordRegistry';
import { WorkflowAuditLogger } from '../core/runtime/workflow-governance/WorkflowAuditLogger';
import { detectCrossStatementCausality } from '../core/runtime/CrossStatementCausalityEngine';
import { InstitutionalDisclosure } from '../core/runtime/shared/runtime-contracts';
import { enterpriseRiskEngine } from '../core/runtime/governance/risk/EnterpriseRiskEngine';
import { RiskHeatmap } from '../core/runtime/governance/risk/types';
export type { RiskHeatmap };
import { RuntimeLatencySnapshot } from '../core/runtime/profiling/ProfilingTypes';
import { StrategicDecisionSimulator } from '../core/runtime/strategic-simulation/StrategicDecisionSimulator';
import { MultiScenarioComparisonEngine } from '../core/runtime/strategic-simulation/MultiScenarioComparisonEngine';
import { InstitutionalOrchestrationEngine } from '../core/runtime/governance-orchestration/InstitutionalOrchestrationEngine';
import { GovernanceRecommendationEvidenceBinder } from '../core/runtime/governance-orchestration/GovernanceRecommendationEvidenceBinder';
import { GovernanceCoordinationResult } from '../core/runtime/governance-orchestration/GovernanceOrchestrationTypes';
import { ScenarioAdapter } from '../core/runtime/scenario-intelligence/scenario-adapter';
import { InstitutionalScenarioEngine } from '../core/runtime/scenario-intelligence/InstitutionalScenarioEngine';
import { InstitutionalScenarioResult } from '../core/runtime/scenario-intelligence/scenario-types';
import { ScenarioNarrativeComposer } from '../core/runtime/scenario-intelligence/ScenarioNarrativeComposer';
import { DFCCausalDriverPresentationAudit } from '../core/runtime/cash-causal-intelligence/DFCCausalDriverPresentationAudit';

export const FiduciaryRuntimeAdapter = {
  DFCCausalDriverPresentationAudit,
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
export { InstitutionalLocaleGuard } from '../core/runtime/locale/InstitutionalLocaleGuard';
export { ExecutiveLabelResolver } from '../core/runtime/executive-presentation/ExecutiveLabelResolver';
export { ExecutiveDisclosureResolver } from '../core/runtime/executive-presentation/ExecutiveDisclosureResolver';
export { ExecutiveNarrativeDeduplicationEngine } from '../core/runtime/executive-presentation/ExecutiveNarrativeDeduplicationEngine';
export { InstitutionalCopilotRuntime } from '../core/runtime/ai-governance/InstitutionalCopilotRuntime';
export { MockLLMProvider } from '../core/runtime/ai-governance/providers/MockLLMProvider';
export type { AIQueryRequest, AIQueryResponse, AIGroundingReference } from '../core/runtime/ai-governance/AIGovernanceTypes';
export type { BenchmarkMetric, BenchmarkConfidenceSignal, BenchmarkExecutionRecord } from '../core/runtime/benchmarking/BenchmarkTypes';
export { SectorRiskPatternAnalyzer } from '../core/runtime/benchmarking/SectorRiskPatternAnalyzer';
export type { InstitutionalScenarioResult } from '../core/runtime/scenario-intelligence/scenario-types';
export { BoardResolutionEngine } from '../core/runtime/board-decision/BoardResolutionEngine';
export type { ConsolidatedExecutiveAdvisoryReport } from '../core/runtime/consolidated/advisory/advisoryTypes';
export type { HoldingRoleAnalysis, DependencyAnalysis, CrossEntityCausality, SystemicRisk } from '../core/runtime/consolidated/advisory/advisoryTypes';
export { BenchmarkDeviationDetector } from '../core/runtime/early-warning/BenchmarkDeviationDetector';
export { EarlyWarningSignalEngine } from '../core/runtime/early-warning/EarlyWarningSignalEngine';
export type { PredictiveRiskEvent } from '../core/runtime/early-warning/EarlyWarningTypes';
export { GovernanceDeteriorationIndex } from '../core/runtime/early-warning/GovernanceDeteriorationIndex';
export { GraphPatternWarningEngine } from '../core/runtime/early-warning/GraphPatternWarningEngine';
export { PredictiveGovernanceDetector } from '../core/runtime/early-warning/PredictiveGovernanceDetector';
export { ScenarioDeteriorationWatcher } from '../core/runtime/early-warning/ScenarioDeteriorationWatcher';
export { InstitutionalOfferingRegistry } from '../core/runtime/commercial-readiness/InstitutionalOfferingRegistry';
export { RealDataValidationEngine } from '../core/runtime/enterprise-validation/RealDataValidationEngine';
export { CognitiveLoadEvaluator } from '../core/runtime/ux-hardening/CognitiveLoadEvaluator';
export { EnterpriseOnboardingPlaybook } from '../core/runtime/operational-playbooks/EnterpriseOnboardingPlaybook';
export { PilotGovernanceChecklist } from '../core/runtime/pilot-readiness/PilotGovernanceChecklist';
export type { InstitutionalEvidenceValidationOutput } from '../core/runtime/evidence-ingestion/InstitutionalEvidenceTypes';
export type { ExecutiveNarrative } from '../core/runtime/executive/types';
export { BoardModeGuard } from '../core/runtime/executive/board/BoardModeGuard';
export type { BoardFlowStep } from '../core/runtime/executive/board/InstitutionalBoardFlow';
export { InstitutionalBoardFlow } from '../core/runtime/executive/board/InstitutionalBoardFlow';
export { ExecutiveSessionContext } from '../core/runtime/executive/board/ExecutiveSessionContext';
export { ExecutiveDemoScenarioRegistry } from '../core/runtime/executive/demo/ExecutiveDemoScenarioRegistry';
export type { DemoScenario } from '../core/runtime/executive/demo/ExecutiveDemoScenarioRegistry';
export { ExecutiveDemoSession } from '../core/runtime/executive/demo/ExecutiveDemoSession';
export type { DemoSessionState } from '../core/runtime/executive/demo/ExecutiveDemoSession';
export { ExecutiveStorySequenceResolver } from '../core/runtime/executive/demo/ExecutiveStorySequenceResolver';
export { InstitutionalDemoDatasetGuard } from '../core/runtime/executive/demo/InstitutionalDemoDatasetGuard';
export type { GuidedJourneyStep } from '../core/runtime/executive/demo/GuidedBoardJourneyEngine';
export { GuidedBoardJourneyEngine } from '../core/runtime/executive/demo/GuidedBoardJourneyEngine';
export type { ExecutiveCommandExplainability, ExecutiveDirective, ExecutiveDriftEvent, GovernanceExecutionTracking, InstitutionalExecutiveCommandOutput, StrategicOrchestration, ExecutiveCommandThesis, InstitutionalAlignmentState } from '../core/runtime/executive-command/executive-command-types';
export { CalibrationEngine } from '../core/runtime/calibration/CalibrationEngine';
export type { CausalEdge, ExecutiveSeverityLevel, ExecutiveModalPriority, ExecutiveEscalationLevel } from '../core/runtime/executive-interaction/types';
export type { GovernanceSupervisionMode } from '../core/runtime/governance-command-center/types';
export type { GovernanceIncident } from '../core/runtime/governance-command-center/types';
export { InstitutionalOrchestrationEngine } from '../core/runtime/governance-orchestration/InstitutionalOrchestrationEngine';
export type { BoardPackMetadata, ConstitutionalSection, ContinuitySection, ExecutiveDirectiveSection, ExecutiveSnapshotSection, ExplainabilityAppendix, FiduciaryTimelineSection, GovernanceReportingSection, InstitutionalBoardPackOutput, LineageAppendix, OperationalGovernanceSection, FiduciaryRestriction, StrategicDirectionSection, TreasurySection, BoardResolutionAppendix, ReportGenerationStatus } from '../core/runtime/institutional-reporting/institutional-reporting-types';
export { ConnectorRegistry } from '../core/runtime/integrations/ConnectorRegistry';
export type { ImportedDataset, RollbackAuditEntry, SourceTrustLevel, IngestionLineageReference } from '../core/runtime/integrations/IntegrationGovernanceTypes';
export type { ExternalConnector, StagingValidationWarning } from '../core/runtime/integrations/IntegrationGovernanceTypes';
export { InstitutionalOperatingSystem } from '../core/runtime/ios/InstitutionalOperatingSystem';
export { GraphQueryEngine } from '../core/runtime/knowledge-graph/GraphQueryEngine';
export type { GraphQueryResult } from '../core/runtime/knowledge-graph/KnowledgeGraphTypes';
export { InstitutionalMemoryEngine } from '../core/runtime/knowledge-graph/InstitutionalMemoryEngine';
export { InstitutionalOntologyRegistry } from '../core/runtime/knowledge-graph/InstitutionalOntologyRegistry';
export { RiskCorrelationEngine } from '../core/runtime/knowledge-graph/RiskCorrelationEngine';
export { WorkflowPatternAnalyzer } from '../core/runtime/knowledge-graph/WorkflowPatternAnalyzer';
export { StagingValidationEngine } from '../core/runtime/integrations/StagingValidationEngine';
export { ImportReviewQueue } from '../core/runtime/integrations/ImportReviewQueue';
export { ImportPublicationEngine } from '../core/runtime/integrations/ImportPublicationEngine';
export type { MonitoringSeverity, MonitoringAlert } from '../core/runtime/monitoring/MonitoringTypes';
export { PressureNarrativeComposer } from '../core/runtime/operating-pressure/PressureNarrativeComposer';
export type { ExecutionIntegrityState, InstitutionalDependencyRisk, InstitutionalOperationalGovernanceOutput, OperationalContinuityState, OperationalFrictionEvent, StrategicExecutionAlignment, OperationalGovernanceThesis } from '../core/runtime/operational-governance/operational-governance-types';
export type { ExplainabilityOutput } from '../core/runtime/shared/runtime-contracts';
export { CALIBRATION_PROFILES, BALANCED_PROFILE } from '../core/runtime/calibration/CalibrationProfiles';
export type { CalibrationParameters, CalibrationProfileVersion } from '../core/runtime/calibration/CalibrationTypes';
export type { EconomicGroupModel } from '../core/runtime/consolidated/data/GroupOnboardingRepository';
export { GroupOnboardingRepository } from '../core/runtime/consolidated/data/GroupOnboardingRepository';
export type { EconomicGroupEntityModel } from '../core/runtime/consolidated/data/GroupEntityMappingRepository';
export { GroupEntityMappingRepository } from '../core/runtime/consolidated/data/GroupEntityMappingRepository';
export type { IntercompanyRelationModel } from '../core/runtime/consolidated/data/IntercompanyRelationRepository';
export { IntercompanyRelationRepository } from '../core/runtime/consolidated/data/IntercompanyRelationRepository';
export { ConsolidatedDataModelValidator } from '../core/runtime/consolidated/data/ConsolidatedDataModelValidator';
export { CapitalGovernanceAdapter } from '../core/runtime/capital-governance/capital-governance-adapter';
export { LifecycleContextBuilder } from '../core/runtime/lifecycle/LifecycleContextBuilder';
export { LifecycleSemanticAuthority } from '../core/runtime/lifecycle/LifecycleSemanticAuthority';
export { LifecycleRenderAudit } from '../core/runtime/lifecycle/LifecycleRenderAudit';
export { DLPAExecutiveRenderingGuard } from '../core/runtime/lifecycle/DLPAExecutiveRenderingGuard';
export type { DLPAViolation } from '../core/runtime/lifecycle/DLPAExecutiveRenderingGuard';
export { DLPALegacyLabelScanner } from '../core/runtime/lifecycle/DLPALegacyLabelScanner';
export { DecisionRecordRegistry } from '../core/runtime/workflow-governance/DecisionRecordRegistry';
export { WorkflowAuditLogger } from '../core/runtime/workflow-governance/WorkflowAuditLogger';
export { AlertResponseWorkflow } from '../core/runtime/workflow-governance/AlertResponseWorkflow';
export { DecisionLineageBinder } from '../core/runtime/workflow-governance/DecisionLineageBinder';
export { InstitutionalBenchmarkEngine } from '../core/runtime/benchmarking/InstitutionalBenchmarkEngine';
export type { InstitutionalDeploymentReadinessOutput } from '../core/runtime/deployment-readiness/DeploymentReadinessTypes';
export { ConnectorExecutionEngine } from '../core/runtime/integrations/ConnectorExecutionEngine';
export { MonitoringExecutionScheduler } from '../core/runtime/monitoring/MonitoringExecutionScheduler';
export { MonitoringAlertRegistry } from '../core/runtime/monitoring/MonitoringAlertRegistry';
export type { InstitutionalOnboardingOutput } from '../core/runtime/institutional-onboarding/InstitutionalOnboardingTypes';
export type { ExecutiveBoardPack } from '../core/runtime/reporting/ReportingTypes';
export { InstitutionalExecutiveCommandRuntime } from '../core/runtime/executive-command/InstitutionalExecutiveCommandRuntime';
export { InstitutionalOperationalGovernanceRuntime } from '../core/runtime/operational-governance/InstitutionalOperationalGovernanceRuntime';
export { InstitutionalStrategicIntelligenceRuntime } from '../core/runtime/strategic-intelligence/InstitutionalStrategicIntelligenceRuntime';
export { PilotRollbackProtocol } from '../core/runtime/integrations/PilotRollbackProtocol';
export { ConnectorAuditLogger } from '../core/runtime/integrations/ConnectorAuditLogger';
export { ProductGovernanceEngine } from '../core/runtime/product-governance/ProductGovernanceEngine';
export { GoldenDatasetRegistry } from '../core/runtime/reality-validation/GoldenDatasetRegistry';
export { GoldenDatasetIsolationEngine } from '../core/runtime/reality-validation/GoldenDatasetIsolationEngine';
export type { GoldenDatasetProfile } from '../core/runtime/reality-validation/RealityValidationTypes';
export type { RuntimeExecutionRecord, RuntimeHealthSnapshot, ReplayExecutionResult } from '../core/runtime/observability/observability-types';
export type { RuntimeLatencySnapshot } from '../core/runtime/profiling/ProfilingTypes';
export type { ScenarioTradeoffProfile, BoardResolution } from '../core/runtime/board-decision/board-decision-types';
export { ScenarioTradeoffEngine } from '../core/runtime/scenario-intelligence/ScenarioTradeoffEngine';
export type { SystemicRiskProfile, ContagionEdge, StressPropagationWarning, StressPropagationConfidence } from '../core/runtime/consolidated/stress/stress-types';
export type { InstitutionalCausalityOutput, CausalChain } from '../core/runtime/causal-intelligence/causal-types';
export type { ConstitutionalAxiomStatus, ConfidenceBreakdown, ConstitutionalEnforcementAction, ConstitutionalGovernanceDashboardOutput, ConstitutionalLineageInformation, ConstitutionalRestriction } from '../core/runtime/constitutional-governance/constitutional-dashboard-types';
export type { ExecutiveTimelineOutput } from '../core/runtime/executive-timeline/executive-timeline-types';
export { RuntimePartitionManager } from '../core/runtime/distributed/RuntimePartitionManager';
export { WorkerRegistry } from '../core/runtime/distributed/WorkerRegistry';
export { AsyncJobQueue } from '../core/runtime/distributed/AsyncJobQueue';
export type { InstitutionalCashSignal } from '../core/runtime/cash-intelligence/types';
export type { CausalFactor, CausalSeverity, CausalGraph, CausalNode } from '../core/runtime/causal-intelligence/types';
export { ONBOARDING_STEPS } from '../core/runtime/pilot-operations/ExecutiveOnboardingEngine';
export type { PilotValidationCategory, PilotFeedbackSeverity, PilotTenantStatus } from '../core/runtime/pilot-operations/types';
export type { FeatureId, QuotaId } from '../core/runtime/product-governance/ProductGovernanceTypes';
export type { ProductAccessEvent } from '../core/runtime/product-governance/ProductGovernanceTypes';
export { FeatureFlagRegistry } from '../core/runtime/product-governance/FeatureFlagRegistry';
export { ProductAccessAuditLogger } from '../core/runtime/product-governance/ProductAccessAuditLogger';
export { ProductPlanRegistry } from '../core/runtime/product-governance/ProductPlanRegistry';
export { CrossTenantStressValidator } from '../core/runtime/operational-scale/CrossTenantStressValidator';
export { ExecutiveAttentionMapper } from '../core/runtime/premium-ux/ExecutiveAttentionMapper';
export { IntercompanyComplexitySimulator } from '../core/runtime/reality-validation/IntercompanyComplexitySimulator';
export { OperationalScalabilityEvaluator } from '../core/runtime/operational-scale/OperationalScalabilityEvaluator';
export { OperationalStressDatasetBuilder } from '../core/runtime/reality-validation/OperationalStressDatasetBuilder';
export { InstitutionalSessionStabilityEngine } from '../core/runtime/operational-scale/InstitutionalSessionStabilityEngine';
export type { SandboxConfig, SimulationIntegrityState, SimulationPropagationSeverity, SimulationScenarioType, SimulationTimeHorizon, StrategicStressLevel } from '../core/runtime/scenario-simulation/types';
export type { CapitalStrategyAlignment, ExpansionSustainability, InstitutionalStrategicIntelligenceOutput, InstitutionalVector, StrategicContradiction, StrategicExplainability, StrategicPosture, LongitudinalTrajectoryStatus } from '../core/runtime/strategic-intelligence/strategic-intelligence-types';
export { StrategicDecisionSimulator } from '../core/runtime/strategic-simulation/StrategicDecisionSimulator';
export type { StrategicSimulationResult } from '../core/runtime/strategic-simulation/StrategicSimulationTypes';
export type { StrategicSimulationInput } from '../core/runtime/strategic-simulation/StrategicSimulationTypes';
export { StrategicDecisionEvidenceBinder } from '../core/runtime/strategic-simulation/StrategicDecisionEvidenceBinder';
export type { TemporalTrajectoryPoint, TemporalEvent, PredictiveRecurrenceState, ResponsivenessMetrics, TemporalEscalationState, TemporalConfidenceState, EarlyWarningSignal, TemporalCausalityOutput, TemporalDensityMap } from '../core/runtime/institutional-memory/types';
export { AdvisorWorkspaceManager } from '../core/runtime/tenancy/AdvisorWorkspaceManager';
export type { Workspace } from '../core/runtime/tenancy/TenancyTypes';
export type { CrisisPropagationNode, CrisisExplainabilityProfile, CrisisInput, CrisisType, InstitutionalSurvivalThesis, WarGameResult, TreasurySurvivalProfile } from '../core/runtime/war-gaming/war-gaming-types';
export { WarGameAdapter } from '../core/runtime/war-gaming/war-game-adapter';
export type { WorkflowStatus } from '../core/runtime/workflow-governance/WorkflowGovernanceTypes';
export type { WorkflowAuditRecord, DecisionWorkflow } from '../core/runtime/workflow-governance/WorkflowGovernanceTypes';

// Additional Missing Exports
export type { PresentationLayer } from '../core/runtime/presentation-governance/ExecutiveAudienceProfile';
export type { InstitutionalDisclosure } from '../core/runtime/shared/runtime-contracts';
export type { ExecutiveRecommendation } from '../core/runtime/executive-consolidation/ExecutiveRecommendationDeduplicationEngine';
export type { GovernanceCoordinationResult } from '../core/runtime/governance-orchestration/GovernanceOrchestrationTypes';
export type { ESGIMDimension, ESGIMMode, ESGIMScenario, IRILevel, BoardPriority, BoardExecutiveBrief, GovernanceRoadmap, GovernanceRoadmapPhase, GovernanceMonitoringSnapshot, GovernanceMonitoringResult, MonitoringAlert as GMLMonitoringAlert, ExecutiveBoardReport } from '../core/runtime/esgim/esgimTypes';
