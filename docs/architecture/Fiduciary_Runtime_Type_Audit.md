# Fiduciary Runtime Type Safety Hardening v2.0
## Relatório de Auditoria de Tipagem (Fase 1)

Este relatório mapeia todas as ocorrências de `any`, `@ts-ignore` e `@ts-expect-error` nas três camadas mais vitais do repositório:
- `src/core/runtime`
- `src/core/governance`
- `src/core/financial`

NENHUMA correção foi aplicada. Este documento serve como plano base para segmentação.

### Resumo Executivo
- **CRITICAL:** 214 ocorrências
- **REVIEW_REQUIRED:** 522 ocorrências
- **SAFE:** 0 ocorrências

---

## 🔴 Nível: CRITICAL (214 itens)
> [!CAUTION]
> Alteraçoes nestes itens possuem alto risco de regressão matemática, fiduciária ou de runtime.

| Arquivo | Linha | Tipo | Código | 
|---|---|---|---| 
| `CrossStatementCausalityEngine.ts` | 89 | `: any` | `bpSummary: any,` | 
| `CrossStatementCausalityEngine.ts` | 92 | `: any` | `cashFlowReport: any,` | 
| `CrossStatementCausalityEngine.ts` | 93 | `: any` | `capitalGovernanceReport: any,` | 
| `CrossStatementCausalityEngine.ts` | 96 | `: any` | `const tensions: any[] = [];` | 
| `ExecutivePriorityConsolidationEngine.ts` | 93 | `: any` | `tensionsInput: any[],` | 
| `ExecutivePriorityConsolidationEngine.ts` | 94 | `: any` | `cashFlowReport: any,` | 
| `ExecutivePriorityConsolidationEngine.ts` | 95 | `: any` | `capitalGovernanceReport: any,` | 
| `ExecutivePriorityConsolidationEngine.ts` | 96 | `: any` | `metrics: any` | 
| `InstitutionalFinancialThesisEngine.ts` | 95 | `: any` | `bpSummary: any,` | 
| `InstitutionalFinancialThesisEngine.ts` | 98 | `: any` | `cashFlowReport: any,` | 
| `InstitutionalFinancialThesisEngine.ts` | 99 | `: any` | `capitalGovernanceReport: any,` | 
| `InstitutionalFinancialThesisEngine.ts` | 100 | `: any` | `metrics: any` | 
| `KPISemanticIntelligenceEngine.ts` | 54 | `: any` | `public static enrich(kpi: any, segment: string): any {` | 
| `BoardCommunicationEngine.ts` | 10 | `: any` | `public static generateBoardBriefing(report: any, validationR...` | 
| `ConfidenceNarrativeEngine.ts` | 13 | `: any` | `report: any,` | 
| `ExecutiveNarrativeEngine.ts` | 28 | `: any` | `report: any,` | 
| `ExecutiveNarrativeEngine.ts` | 29 | `: any` | `validationResult: any,` | 
| `ExecutiveNarrativeEngine.ts` | 30 | `: any` | `comparisonReport: any,` | 
| `ExecutiveSummaryEngine.ts` | 14 | `: any` | `report: any,` | 
| `FiduciaryCommunicationEngine.ts` | 13 | `: any` | `report: any,` | 
| `FiduciaryCommunicationEngine.ts` | 14 | `: any` | `validationResult: any,` | 
| `GovernanceNarrativeEngine.ts` | 13 | `: any` | `report: any,` | 
| `GovernanceNarrativeEngine.ts` | 14 | `: any` | `validationResult: any,` | 
| `ScenarioExplanationEngine.ts` | 11 | `: any` | `candidatePath: any,` | 
| `ScenarioExplanationEngine.ts` | 13 | `: any` | `conservativePreservation: any;` | 
| `ScenarioExplanationEngine.ts` | 14 | `: any` | `controlledGrowth: any;` | 
| `ScenarioExplanationEngine.ts` | 15 | `: any` | `survivalStabilization: any;` | 
| `TradeoffNarrativeEngine.ts` | 11 | `: any` | `candidatePath: any,` | 
| `TradeoffNarrativeEngine.ts` | 13 | `: any` | `conservativePreservation: any;` | 
| `TradeoffNarrativeEngine.ts` | 14 | `: any` | `controlledGrowth: any;` | 
| `TradeoffNarrativeEngine.ts` | 15 | `: any` | `survivalStabilization: any;` | 
| `AuditReconstructionEngine.ts` | 11 | `: any` | `original: any,` | 
| `AuditReconstructionEngine.ts` | 12 | `: any` | `reconstructed: any` | 
| `AuditReconstructionEngine.ts` | 90 | `: any` | `private lookupValue(obj: any, key: string): any {` | 
| `AuditReconstructionEngine.ts` | 116 | `: any` | `public areSemanticallyEquivalent(a: any, b: any): boolean {` | 
| `AuditReconstructionEngine.ts` | 133 | `: any` | `const toBool = (val: any) => {` | 
| `AuditReconstructionEngine.ts` | 162 | `: any` | `public normalize(obj: any): any {` | 
| `AuditReconstructionEngine.ts` | 175 | `: any` | `const normObj: any = {};` | 
| `BehavioralTrajectoryEngine.ts` | 28 | `: any` | `report: any,` | 
| `GovernanceDriftEngine.ts` | 15 | `: any` | `report: any` | 
| `GovernanceFatigueEngine.ts` | 14 | `: any` | `report: any` | 
| `InstitutionalBehaviorProfileEngine.ts` | 51 | `: any` | `public static getDecisionTargetProfile(decision: ExecutiveDe...` | 
| `InstitutionalBehaviorProfileEngine.ts` | 104 | `: any` | `report: any,` | 
| `InstitutionalBehavioralIntelligenceEngine.ts` | 30 | `: any` | `report: any,` | 
| `LongitudinalPatternEngine.ts` | 23 | `: any` | `report: any,` | 
| `BenchmarkAnonymizationEngine.ts` | 8 | `: any` | `static anonymizeProfile(rawTenantData: any): AnonymizedInsti...` | 
| `BoardResolutionEngine.ts` | 20 | `: any` | `report?: any` | 
| `CashFlowReconciliationEngine.ts` | 8 | `: any` | `dfcData: any[],` | 
| `CashQualityExplainabilityEngine.ts` | 15 | `: any` | `public static explain(cqs: any): CQSExplanation {` | 
| `InstitutionalCashSustainabilityEngine.ts` | 16 | `: any` | `dfcData: any[],` | 
| `LongitudinalCashIntelligenceEngine.spec.ts` | 26 | `as any` | `classification: classification as any,` | 
| `LongitudinalCashIntelligenceEngine.test.ts` | 7 | `: any` | `function createMockCycle(overrides: any = {}): CashIntellige...` | 
| `CashFlowOperationalEngine.ts` | 4 | `: any` | `export function calculateOperationalMetrics(dfcData: any): C...` | 
| `LiquidityRootCauseEngine.ts` | 20 | `: any` | `allHistData: any[],` | 
| `RuntimeComplianceEngine.ts` | 87 | `: any` | `public static validateBoardPack(boardPack: any): void {` | 
| `RuntimeComplianceEngine.ts` | 102 | `: any` | `public static validate(report: any, mode: ComplianceMode): C...` | 
| `RuntimeComplianceEngine.ts` | 197 | `: any` | `report: any,` | 
| `RuntimeComplianceEngine.ts` | 199 | `: any` | `mathCheck: any,` | 
| `RuntimeComplianceEngine.ts` | 200 | `: any` | `semanticCheck: any,` | 
| `RuntimeComplianceEngine.ts` | 201 | `: any` | `lineageCheck: any,` | 
| `RuntimeComplianceEngine.ts` | 202 | `: any` | `confCheck: any` | 
| `RuntimeComplianceEngine.ts` | 257 | `: any` | `public validateFiduciarySafety(report: any): { isSafe: boole...` | 
| `RuntimeComplianceEngine.ts` | 288 | `: any` | `public validateMathSanity(metrics: any): { isValid: boolean;...` | 
| `RuntimeComplianceEngine.ts` | 292 | `: any` | `const scanNumbers = (obj: any, path = '') => {` | 
| `RuntimeComplianceEngine.ts` | 349 | `: any` | `public validateSemanticSobriety(report: any): { isValid: boo...` | 
| `RuntimeComplianceEngine.ts` | 358 | `: any` | `const scanText = (obj: any, path = '') => {` | 
| `RuntimeComplianceEngine.ts` | 406 | `: any` | `public verifyLineage(report: any): { isComplete: boolean; li...` | 
| `RuntimeComplianceEngine.ts` | 432 | `: any` | `public propagateConfidence(report: any): { confidenceLevel: ...` | 
| `RuntimeComplianceEngine.ts` | 471 | `: any` | `public checkPayloadIntegrity(report: any): string[] {` | 
| `RuntimeComplianceEngine.ts` | 514 | `: any` | `public applyFailClosed(report: any, reason: string): any {` | 
| `RuntimeComplianceEngine.ts` | 552 | `: any` | `public generateAuditTrail(report: any) {` | 
| `IntercompanyEliminationEngine.ts` | 8 | `: any` | `eliminatedEntries: any[];` | 
| `IntercompanyEliminationEngine.ts` | 9 | `: any` | `unreconciledIntercompany: any[];` | 
| `IntercompanyEliminationEngine.ts` | 10 | `: any` | `eliminationWarnings: any[];` | 
| `IntercompanyEliminationEngine.ts` | 11 | `: any` | `consolidationAdjustments: any[];` | 
| `ConstitutionalAxiomDisclosureEngine.ts` | 4 | `: any` | `public static extractAxioms(runtimeOutput: any): Constitutio...` | 
| `ConstitutionalConfidenceDisclosureEngine.ts` | 4 | `: any` | `public static extractConfidence(runtimeOutput: any): Confide...` | 
| `ConstitutionalEnforcementDisclosureEngine.ts` | 4 | `: any` | `public static extractEnforcementActions(runtimeOutput: any):...` | 
| `ConstitutionalGovernanceDashboardEngine.ts` | 14 | `: any` | `public static generate(runtimeOutput: any): ConstitutionalGo...` | 
| `ConstitutionalLineageDisclosureEngine.ts` | 4 | `: any` | `public static extractLineage(runtimeOutput: any): Constituti...` | 
| `ConstitutionalRestrictionDisclosureEngine.ts` | 4 | `: any` | `public static extractRestrictions(runtimeOutput: any): Const...` | 
| `ConstitutionalRestrictionDisclosureEngine.ts` | 8 | `: any` | `canonicalRestr.forEach((r: any) => {` | 
| `FiduciaryAxiomEngine.ts` | 121 | `: any` | `public evaluateReportAxioms(report: any): { isViolated: bool...` | 
| `DecisionComplianceEngine.ts` | 16 | `: any` | `report: any,` | 
| `DecisionPrioritizationEngine.ts` | 2 | `: any` | `public static evaluatePriority(context: any): 'CRITICAL' | '...` | 
| `DecisionToCashCausalityEngine.test.ts` | 32 | `as any` | `cashCycles: [{ isAvailable: true } as any],` | 
| `DecisionToCashCausalityEngine.test.ts` | 33 | `as any` | `longitudinalCash: { trajectoryClassification: 'STABLE_SUSTAI...` | 
| `DecisionToCashCausalityEngine.test.ts` | 34 | `as any` | `fiduciaryTimeline: { timelineIntegrityStatus: isBroken ? 'BR...` | 
| `EarlyWarningEngine.test.ts` | 6 | `: any` | `function mockInput(overrides: any = {}): EarlyWarningIntelli...` | 
| `EarlyWarningEngine.test.ts` | 17 | `as any` | `{ fcoResult: 'CASH_GENERATION' } as any,` | 
| `EarlyWarningEngine.test.ts` | 18 | `as any` | `{ fcoResult: 'CASH_GENERATION' } as any,` | 
| `EarlyWarningEngine.test.ts` | 19 | `as any` | `{ fcoResult: 'CASH_GENERATION' } as any` | 
| `ExecutiveAccountabilityEngine.test.ts` | 6 | `: any` | `function mockInput(overrides: any = {}): ExecutiveAccountabi...` | 
| `ExecutiveActionMatrixEngine.ts` | 4 | `: any` | `public static mapActions(context: any): string[] {` | 
| `GovernanceDriftDetectionEngine.test.ts` | 6 | `: any` | `function mockInput(executiveNarrative: string, overrides: an...` | 
| `GovernanceDriftDetectionEngine.test.ts` | 52 | `as any` | `} as any` | 
| `InstitutionalBehavioralPatternsEngine.test.ts` | 6 | `: any` | `function mockInput(overrides: any = {}): InstitutionalBehavi...` | 
| `InstitutionalDecisionIntelligenceEngine.ts` | 31 | `: any` | `report: any` | 
| `InstitutionalDecisionIntelligenceEngine.ts` | 72 | `: any` | `let behavioralResult: any = null;` | 
| `InstitutionalDecisionIntelligenceEngine.ts` | 73 | `: any` | `let predictiveResult: any = null;` | 
| `InstitutionalRiskMatrixEngine.ts` | 2 | `: any` | `public static evaluateRisk(context: any): {` | 
| `InstitutionalStabilityEngine.test.ts` | 6 | `: any` | `function mockInput(overrides: any = {}): InstitutionalStabil...` | 
| `InstitutionalSurvivabilityEngine.ts` | 13 | `: any` | `public static calculate(report: any, policyContext?: PolicyC...` | 
| `StrategicStressEngine.ts` | 14 | `: any` | `report: any` | 
| `DecisionPolicyEngine.ts` | 20 | `: any` | `report: any` | 
| `InstitutionalMaterialityEngine.ts` | 13 | `: any` | `public static calculateMaterialityBase(report: any): number ...` | 
| `InstitutionalMaterialityEngine.ts` | 31 | `: any` | `report: any` | 
| `SectorGovernanceProfileEngine.ts` | 11 | `: any` | `public static analyzeSector(report: any): {` | 
| `StrategicPostureEngine.ts` | 11 | `: any` | `public static analyzePosture(report: any): {` | 
| `ExecutiveCommandMemoryEngine.ts` | 14 | `: any` | `): any {` | 
| `BoardTop3DecisionEngine.ts` | 13 | `: any` | `evidence: any[];` | 
| `BoardTop3DecisionEngine.ts` | 18 | `: any` | `public static generate(report: any, requiresEscalation: bool...` | 
| `ExecutiveActionPlanEngine.ts` | 16 | `: any` | `public static generate(report: any): ExecutiveAction[] {` | 
| `ExecutivePriorityRankingEngine.ts` | 28 | `: any` | `public static rank(report: any): RatedRecommendation[] {` | 
| `ExecutivePriorityRankingEngine.ts` | 33 | `: any` | `const fmt = (v: any) => {` | 
| `InstitutionalPriorityMatrixEngine.ts` | 11 | `: any` | `public static generate(report: any): PriorityMatrixRow[] {` | 
| `ExecutiveTimelineEngine.ts` | 11 | `: any` | `public static parseCycle(cycle: any): HistoricalRuntimeCycle...` | 
| `ExecutiveTimelineEngine.ts` | 129 | `: any` | `public static generate(rawData: any, currentReport: any): Ex...` | 
| `BalanceSheetExecutiveNarrativeEngine.ts` | 4 | `: any` | `static generate(indicators: any[], summary: any, exerciseYea...` | 
| `BalanceSheetFinancialMetricsEngine.ts` | 10 | `: any` | `evidence: any;` | 
| `PatrimonialGovernanceConsistencyEngine.ts` | 20 | `: any` | `patrimonialTrend: any;` | 
| `PatrimonialGovernanceConsistencyEngine.ts` | 120 | `: any` | `const familyTrends = patrimonialTrend?.trends?.filter((t: an...` | 
| `PatrimonialGovernanceConsistencyEngine.ts` | 121 | `: any` | `const deterioratingCount = familyTrends.filter((t: any) => t...` | 
| `PatrimonialGovernanceConsistencyEngine.ts` | 133 | `: any` | `const allDeteriorating = patrimonialTrend?.trends?.filter((t...` | 
| `PatrimonialPreservationEngine.ts` | 27 | `: any` | `static analyze(summary: BPSummary, dreData: any[]): Patrimon...` | 
| `WorkingCapitalIntelligenceEngine.ts` | 6 | `: any` | `static analyze(summary: BPSummary, dreData: any[]): Patrimon...` | 
| `CapitalPreservationScoreEngine.ts` | 6 | `: any` | `horizonFormattedOrObj: any,` | 
| `CapitalRecoverabilityEngine.ts` | 2 | `: any` | `static evaluate(endingEquity: number, recoveryHorizonInput: ...` | 
| `DLPACanonicalScoreResolver.ts` | 2 | `: any` | `public static resolve(capitalPreservationScore: any): {` | 
| `DLPAConsistencyAuditEngine.ts` | 2 | `: any` | `public static validate(report: any): { valid: boolean; viola...` | 
| `DLPAFiduciaryInterpretationEngine.ts` | 42 | `: any` | `dlpaData: any[];` | 
| `PatrimonialRecoveryHorizonEngine.ts` | 6 | `: any` | `eligibleHistoricalCycles?: any[];` | 
| `PatrimonialRecoveryHorizonEngine.ts` | 8 | `: any` | `temporalAudit?: any;` | 
| `PatrimonialRecoveryHorizonEngine.ts` | 13 | `: any` | `inputOrLosses: any,` | 
| `PatrimonialRecoveryHorizonEngine.ts` | 15 | `: any` | `historicalCycles: any[] = [],` | 
| `PatrimonialRecoveryHorizonEngine.ts` | 20 | `: any` | `let eligibleHistoricalCycles: any[] = [];` | 
| `PatrimonialRecoveryHorizonEngine.ts` | 22 | `: any` | `let temporalAudit: any = null;` | 
| `InstitutionalContextEngine.ts` | 27 | `: any` | `static resolve(rawData: any): InstitutionalContextProfile {` | 
| `InstitutionalContextEngine.ts` | 32 | `: any` | `let bpSummary: any = {};` | 
| `InstitutionalContextEngine.ts` | 41 | `: any` | `let dreCascade: any[] = [];` | 
| `GovernanceRecurrenceEngine.ts` | 101 | `: any` | `private static detectViolationPattern(cycles: HistoricalCycl...` | 
| `GovernanceRecurrenceEngine.ts` | 102 | `: any` | `const violationMap = new Map<string, { count: number; detail...` | 
| `InstitutionalSurvivalHierarchyEngine.ts` | 77 | `: any` | `const recurringLosses = historicalCycles.filter((c: any) => ...` | 
| `InstitutionalSurvivalHierarchyEngine.ts` | 184 | `: any` | `const hasErosionHistory = historicalCycles.some((c: any) => ...` | 
| `InstitutionalSurvivalHierarchyEngine.ts` | 187 | `: any` | `const hasSurvivalHistory = historicalCycles.filter((c: any) ...` | 
| `ConnectorExecutionEngine.ts` | 19 | `: any` | `rawPayload: any,` | 
| `SchemaMappingEngine.ts` | 7 | `: any` | `static normalizePayload(rawPayload: any): any {` | 
| `BenchmarkReferenceEngine.ts` | 8 | `: any` | `boardConfig?: any` | 
| `EmptyCycleIntegrityEngine.ts` | 8 | `: any` | `public static evaluate(rawData: any): boolean {` | 
| `EmptyCycleIntegrityEngine.ts` | 49 | `: any` | `const hasAtivo = hasBPPrecomputed ? bpSummary.ativoTotal !==...` | 
| `EmptyCycleIntegrityEngine.ts` | 54 | `: any` | `const hasPassivo = hasBPPrecomputed ? bpSummary.passivoTotal...` | 
| `EmptyCycleIntegrityEngine.ts` | 59 | `: any` | `const hasROL = dreLines.some((d: any) => {` | 
| `EmptyCycleIntegrityEngine.ts` | 64 | `: any` | `const hasEBITDA = dreLines.some((d: any) => {` | 
| `ExecutiveActionMatrixEngine.ts` | 22 | `: any` | `metrics: any,` | 
| `ExecutiveActionMatrixEngine.ts` | 23 | `: any` | `bpSummary: any,` | 
| `ExecutiveActionMatrixEngine.ts` | 24 | `: any` | `causality: any,` | 
| `ExecutiveActionMatrixEngine.ts` | 27 | `: any` | `fiduciaryOutput?: any,` | 
| `ExecutiveActionMatrixEngine.ts` | 28 | `: any` | `survivalReport?: any,` | 
| `ExecutiveActionMatrixEngine.ts` | 29 | `: any` | `recoveryReport?: any` | 
| `ExecutiveActionMatrixEngine.ts` | 206 | `: any` | `metrics: any,` | 
| `ExecutiveActionMatrixEngine.ts` | 207 | `: any` | `bp: any,` | 
| `ExecutiveActionMatrixEngine.ts` | 208 | `: any` | `causality: any,` | 
| `HistoricalSeriesIntegrityEngine.ts` | 5 | `: any` | `public static validate(chartData: any[]): boolean {` | 
| `InstitutionalMonitoringEngine.ts` | 10 | `: any` | `static runCycle(tenantId: string, workspaceId: string, avail...` | 
| `LiquidityWatchEngine.ts` | 7 | `: any` | `static evaluate(financialOutput: any, groupId: string): Liqu...` | 
| `MonitoringRuleEngine.ts` | 11 | `: any` | `evaluate: (context: any) => {` | 
| `MonitoringRuleEngine.ts` | 37 | `: any` | `static runRules(context: any): MonitoringAlert[] {` | 
| `LiquidityCompressionEngine.ts` | 41 | `: any` | `const isDistorted = diagnoses.some((d: any) => d.code === 'A...` | 
| `TreasuryErosionEngine.ts` | 54 | `: any` | `(d: any) => d.code?.includes('SUSTAINABILITY_ALERT') || d.co...` | 
| `PilotObservabilityEngine.ts` | 15 | `: any` | `rawPayload?: any` | 
| `BehavioralAccelerationEngine.ts` | 22 | `: any` | `report: any` | 
| `DeteriorationMomentumEngine.ts` | 34 | `: any` | `report: any,` | 
| `InstitutionalResilienceEngine.ts` | 22 | `: any` | `report: any,` | 
| `PredictiveGovernanceEngine.ts` | 31 | `: any` | `finalProfile: any;` | 
| `PredictiveGovernanceEngine.ts` | 41 | `: any` | `report: any,` | 
| `PredictiveGovernanceEngine.ts` | 151 | `: any` | `report: any,` | 
| `PredictiveGovernanceEngine.ts` | 164 | `: any` | `let domains: any[] = [];` | 
| `PredictiveGovernanceEngine.ts` | 253 | `: any` | `function driftPropertyWarning(severity: any): boolean {` | 
| `RecoveryViabilityEngine.ts` | 24 | `: any` | `report: any,` | 
| `StrategicCollapseRiskEngine.ts` | 22 | `: any` | `report: any,` | 
| `BoardAgendaEngine.ts` | 7 | `: any` | `scoreOutput: any` | 
| `PrescriptiveActionEngine.ts` | 55 | `as any` | `if (risk.category === 'LIQUIDITY_RISK' as any) {` | 
| `PrescriptiveActionEngine.ts` | 64 | `as any` | `if (risk.category === 'GOVERNANCE_RISK' as any) {` | 
| `PrescriptiveActionEngine.ts` | 73 | `as any` | `if (risk.category === 'EXECUTION_RISK' as any) {` | 
| `PrescriptiveActionEngine.ts` | 82 | `as any` | `if (risk.category === 'CAPITAL_RISK' as any) {` | 
| `ExecutivePresentationAuditEngine.ts` | 21 | `: any` | `public static audit(target: any, layer: PresentationLayer): ...` | 
| `ExecutivePresentationAuditEngine.ts` | 52 | `: any` | `const traverse = (obj: any, key?: string) => {` | 
| `BillingPreparationEngine.ts` | 14 | `: any` | `static async handleWebhookEvent(payload: any): Promise<void>...` | 
| `BoardPackGovernanceEngine.ts` | 13 | `: any` | `report: any,` | 
| `NarrativeConsistencyEngine.ts` | 11 | `: any` | `report: any,` | 
| `NarrativeConsistencyEngine.ts` | 12 | `: any` | `validationResult: any,` | 
| `NarrativeConsistencyEngine.ts` | 13 | `: any` | `advisoryNarrative: any` | 
| `PublicationLineageEngine.ts` | 11 | `: any` | `report: any,` | 
| `PublicationLineageEngine.ts` | 12 | `: any` | `validationResult: any,` | 
| `ReportIntegrityEngine.ts` | 11 | `: any` | `report: any,` | 
| `ReportIntegrityEngine.ts` | 12 | `: any` | `validationResult: any` | 
| `InstitutionalScenarioEngine.ts` | 10 | `: any` | `public static evaluateScenario(inputs: ScenarioInput[], cont...` | 
| `InstitutionalStressTestEngine.ts` | 15 | `: any` | `contextData: any` | 
| `PropagationSimulationEngine.ts` | 5 | `: any` | `public static simulate(inputs: ScenarioInput[], contextData:...` | 
| `ScenarioComparisonEngine.ts` | 10 | `: any` | `public static compare(baselineContext: any, scenarioContext:...` | 
| `ScenarioConstraintEngine.ts` | 9 | `: any` | `public static validate(inputs: ScenarioInput[], contextData:...` | 
| `ScenarioExplainabilityEngine.ts` | 7 | `: any` | `baselineContext: any,` | 
| `ScenarioExplainabilityEngine.ts` | 8 | `: any` | `simulationInputs: any[],` | 
| `ScenarioMutationEngine.ts` | 5 | `: any` | `public static applyMutations(baselineContext: any, mutations...` | 
| `ExecutiveScenarioEngine.ts` | 28 | `: any` | `report: any,` | 
| `GovernanceImpactSimulationEngine.ts` | 11 | `: any` | `report: any,` | 
| `InstitutionalPreservationEngine.ts` | 14 | `: any` | `initialReport: any` | 
| `LiquidityTrajectoryEngine.ts` | 10 | `: any` | `public static calculateRunway(report: any): number {` | 
| `LiquidityTrajectoryEngine.ts` | 43 | `: any` | `report: any,` | 
| `ScenarioStressEngine.ts` | 14 | `: any` | `report: any,` | 
| `ScenarioStressEngine.ts` | 16 | `: any` | `): { stressedReport: any; assumptions: string[]; traceHash: ...` | 
| `StrategicSimulationEngine.ts` | 30 | `: any` | `initialReport: any,` | 
| `LongitudinalCrisisMemoryEngine.ts` | 6 | `: any` | `private static mockMemory: any[] = [];` | 
| `LongitudinalCrisisMemoryEngine.ts` | 29 | `: any` | `public static getHistoricalCrises(): any[] {` | 

## 🔴 Nível: REVIEW_REQUIRED (522 itens)
> [!WARNING]
> Requer revisão pontual de contratos de interface.

| Arquivo | Linha | Tipo | Código | 
|---|---|---|---| 
| `ExecutiveNarrativeOrchestrator.ts` | 83 | `: any` | `report: any,` | 
| `causality-interpretation-adapter.ts` | 24 | `: any` | `scores: any,` | 
| `AIGovernanceTypes.ts` | 33 | `: any` | `payload: any;` | 
| `AIGovernanceTypes.ts` | 61 | `: any` | `metadata?: any;` | 
| `AIUsageAuditLogger.ts` | 6 | `: any` | `static logEvent(event: AIUsageAuditRecord['event'], aiTraceI...` | 
| `LLMProvider.ts` | 2 | `: any` | `generateResponse(prompt: string, context: any[]): Promise<st...` | 
| `MockLLMProvider.ts` | 10 | `: any` | `async generateResponse(prompt: string, context: any[]): Prom...` | 
| `OpenAIProvider.ts` | 4 | `: any` | `async generateResponse(prompt: string, context: any[]): Prom...` | 
| `ExecutiveAssuranceRuntime.ts` | 59 | `: any` | `original: any;` | 
| `ExecutiveAssuranceRuntime.ts` | 60 | `: any` | `reconstructed: any;` | 
| `BenchmarkAuditLogger.ts` | 2 | `: any` | `private static logs: any[] = [];` | 
| `BenchmarkAuditLogger.ts` | 21 | `: any` | `static getLogs(): any[] {` | 
| `BenchmarkCohortBuilder.ts` | 13 | `: any` | `rawTenantsInNetwork: any[]` | 
| `BenchmarkDatasetBuilder.ts` | 6 | `: any` | `static extractSafeInstitutionalNetworkData(): any[] {` | 
| `BenchmarkPrivacyGuard.ts` | 27 | `: any` | `static inspectPayloadForLeakage(payload: any): boolean {` | 
| `BoardPackPPTXGenerator.ts` | 11 | `<any>` | `public static async generatePPTX(pack: BoardPack, saveToFile...` | 
| `BoardPackPPTXGenerator.ts` | 20 | `: any` | `const pptx: any = new PptxConstructor();` | 
| `RuntimeCacheManager.ts` | 9 | `<any>` | `private static store = new Map<string, CacheEntry<any>>();` | 
| `CalibrationTypes.ts` | 20 | `: any` | `before: any;` | 
| `CalibrationTypes.ts` | 21 | `: any` | `after: any;` | 
| `capital-governance-adapter.ts` | 124 | `: any` | `dlpaData: any[],` | 
| `capital-governance-adapter.ts` | 131 | `: any` | `context?: any,` | 
| `capital-governance-adapter.ts` | 132 | `: any` | `historicalCyclesRaw?: any[]` | 
| `capital-governance-adapter.ts` | 141 | `: any` | `preservedCapital: any;` | 
| `capital-governance-adapter.ts` | 142 | `: any` | `consumedCapital: any;` | 
| `capital-governance-adapter.ts` | 143 | `: any` | `capitalRecovery?: any;` | 
| `capital-governance-adapter.ts` | 144 | `: any` | `capitalErosionRisk?: any;` | 
| `capital-governance-adapter.ts` | 145 | `: any` | `capitalDependency: any;` | 
| `capital-governance-adapter.ts` | 146 | `: any` | `formationQuality: any;` | 
| `capital-governance-adapter.ts` | 147 | `: any` | `distributionCapacity: any;` | 
| `capital-governance-adapter.ts` | 148 | `: any` | `retention: any;` | 
| `capital-governance-adapter.ts` | 149 | `: any` | `governanceInterpretation: any;` | 
| `capital-governance-adapter.ts` | 150 | `: any` | `boardDecisionSupport: any;` | 
| `capital-governance-adapter.ts` | 151 | `: any` | `boardAdvisory: any;` | 
| `capital-governance-adapter.ts` | 152 | `: any` | `capitalPreservationStatus?: any;` | 
| `capital-governance-adapter.ts` | 153 | `: any` | `shareholderDependencyNarrative?: any;` | 
| `capital-governance-adapter.ts` | 154 | `: any` | `capitalRecoveryRequirement?: any;` | 
| `capital-governance-adapter.ts` | 155 | `: any` | `patrimonialRecoveryHorizon?: any;` | 
| `capital-governance-adapter.ts` | 156 | `: any` | `capitalRecoverability?: any;` | 
| `capital-governance-adapter.ts` | 157 | `: any` | `capitalPreservationScore?: any;` | 
| `capital-governance-adapter.ts` | 160 | `: any` | `temporalAudit?: any;` | 
| `capital-governance-adapter.ts` | 181 | `: any` | `consistencyAudit?: any;` | 
| `capital-governance-adapter.ts` | 182 | `: any` | `patrimonialRecoveryHorizon?: any;` | 
| `capital-governance-adapter.ts` | 183 | `: any` | `capitalRecoverability?: any;` | 
| `capital-governance-adapter.ts` | 184 | `: any` | `capitalPreservationScore?: any;` | 
| `capital-governance-adapter.ts` | 259 | `: any` | `const capSocialEntry = dlpaData.find((e: any) => {` | 
| `capital-governance-adapter.ts` | 317 | `: any` | `const bpEntries = cleanHistoricalCyclesRaw.filter((d: any) =...` | 
| `capital-governance-adapter.ts` | 321 | `: any` | `const matchedBPEntry = bpEntries.find((e: any) => {` | 
| `capital-governance-adapter.ts` | 337 | `: any` | `const bpEntriesForLp = (cleanHistoricalCyclesRaw || []).filt...` | 
| `capital-governance-adapter.ts` | 345 | `: any` | `const lpEntry = bpEntriesForLp.find((e: any) => {` | 
| `capital-governance-adapter.ts` | 359 | `: any` | `const lucrosPrejuizosEntry = cleanDlpaData.find((e: any) => ...` | 
| `capital-governance-adapter.ts` | 440 | `as any` | `retentionStatus: fidOutput.retentionClassification as any,` | 
| `capital-governance-adapter.ts` | 453 | `as any` | `preservationStatus: fidOutput.patrimonialIntegrityStatus as ...` | 
| `capital-governance-adapter.ts` | 584 | `as any` | `let resolvedCapitalStatus = runtimeContext?.lifecycleProfile...` | 
| `capital-governance-adapter.ts` | 650 | `as any` | `delete (reportWithExecutiveStory as any).legacyRecoveryYears...` | 
| `capital-governance-adapter.ts` | 651 | `as any` | `delete (reportWithExecutiveStory as any).legacyRecoveryClass...` | 
| `capital-governance-adapter.ts` | 652 | `as any` | `delete (reportWithExecutiveStory as any).legacyCpsScore;` | 
| `capital-governance-adapter.ts` | 803 | `: any` | `private static parseHistoricalCycles(rawHistory?: any[]): Hi...` | 
| `capital-governance-adapter.ts` | 815 | `: any` | `rawHistory.forEach((entry: any) => {` | 
| `capital-governance-adapter.ts` | 869 | `: any` | `return rawHistory.map((h: any) => {` | 
| `capital-governance-types.ts` | 100 | `: any` | `executiveLayer?: any;` | 
| `DFCCausalDriverPresentationAudit.ts` | 23 | `: any` | `public static audit(rawDrivers: any[]): AuditResult {` | 
| `CashIntelligenceTypes.ts` | 241 | `: any` | `dfcExecutiveSnapshot?: any;` | 
| `CashIntelligenceTypes.ts` | 242 | `: any` | `cqsExplainability?: any;` | 
| `CashIntelligenceTypes.ts` | 243 | `: any` | `compressedAdvisory?: any;` | 
| `CashIntelligenceTypes.ts` | 244 | `: any` | `consistencyAudit?: any;` | 
| `CashIntelligenceTypes.ts` | 245 | `: any` | `dfcPriorities?: any;` | 
| `CashIntelligenceTypes.ts` | 258 | `: any` | `earningsQuality?: any;` | 
| `CashIntelligenceTypes.ts` | 259 | `: any` | `cashQuality?: any;` | 
| `DFCExecutiveBindingAudit.ts` | 8 | `: any` | `public static audit(output: any): {` | 
| `FiduciaryCashIntelligenceRuntime.ts` | 43 | `: any` | `dfcData: any[],` | 
| `FiduciaryCashIntelligenceRuntime.ts` | 401 | `: any` | `private static generateLineageHash(inputs: any[]): string {` | 
| `cashflow-adapter.ts` | 12 | `: any` | `dfcData: any[],` | 
| `cashflow-types.ts` | 62 | `: any` | `operational: any;` | 
| `cashflow-types.ts` | 63 | `: any` | `conversion: any;` | 
| `cashflow-types.ts` | 64 | `: any` | `treasury: any;` | 
| `cashflow-types.ts` | 65 | `: any` | `sustainability: any;` | 
| `cashflow-types.ts` | 66 | `: any` | `funding: any;` | 
| `InstitutionalCausalIntelligenceRuntime.ts` | 24 | `: any` | `allHistData: any[],` | 
| `InstitutionalCausalIntelligenceRuntime.ts` | 30 | `: any` | `const yearsAvailable = [...new Set(allHistData.map((d: any) ...` | 
| `InstitutionalCausalIntelligenceRuntime.ts` | 34 | `: any` | `const isDfcAvailable = allHistData.some((d: any) =>` | 
| `StructuralDeteriorationMapper.ts` | 22 | `: any` | `private static getVal(allHistData: any[], year: number, docT...` | 
| `StructuralDeteriorationMapper.ts` | 23 | `: any` | `const entries = allHistData.filter((d: any) => {` | 
| `StructuralDeteriorationMapper.ts` | 29 | `: any` | `const match = entries.find((d: any) => {` | 
| `StructuralDeteriorationMapper.ts` | 38 | `: any` | `allHistData: any[],` | 
| `StructuralDeteriorationMapper.ts` | 44 | `: any` | `const yearsAvailable = [...new Set(allHistData.map((d: any) ...` | 
| `FiduciaryContracts.ts` | 12 | `: any` | `validateFiduciarySafety(report: any): { isSafe: boolean; vio...` | 
| `FiduciaryContracts.ts` | 19 | `: any` | `validateMathSanity(metrics: any): { isValid: boolean; errors...` | 
| `FiduciaryContracts.ts` | 26 | `: any` | `validateSemanticSobriety(report: any): { isValid: boolean; w...` | 
| `FiduciaryContracts.ts` | 33 | `: any` | `verifyLineage(report: any): { isComplete: boolean; lineageHa...` | 
| `FiduciaryContracts.ts` | 40 | `: any` | `propagateConfidence(report: any): { confidenceLevel: 'HIGH_C...` | 
| `FiduciaryContracts.ts` | 47 | `: any` | `applyFailClosed(report: any, reason: string): any;` | 
| `FiduciaryContracts.ts` | 54 | `: any` | `generateAuditTrail(report: any): any;` | 
| `ConsolidatedRuntimeOrchestrator.ts` | 38 | `: any` | `public runConsolidatedAnalysis(input: any): ExecutiveIntelli...` | 
| `consolidated-types.ts` | 83 | `: any` | `rawData: any;` | 
| `ConsolidatedGroupRepository.ts` | 20 | `: any` | `const entities: ConsolidationEntity[] = (data.entities || []...` | 
| `ConsolidatedGroupRepository.ts` | 32 | `: any` | `} catch (err: any) {` | 
| `IntercompanyRelationsLoader.ts` | 21 | `: any` | `} catch (err: any) {` | 
| `dataTypes.ts` | 10 | `: any` | `intercompanyRelations: any[];` | 
| `dataTypes.ts` | 11 | `: any` | `ownershipStructure: any[];` | 
| `types.ts` | 87 | `: any` | `auditTrail: { timestamp: string; action: string; [key: strin...` | 
| `ConstitutionalGovernanceRuntime.ts` | 26 | `: any` | `public static evaluate(context: any): ConstitutionalComplian...` | 
| `ConstitutionalGovernanceRuntime.ts` | 70 | `as any` | `protocols: results as any,` | 
| `ConstitutionalProtocolDefinition.ts` | 4 | `: any` | `payload?: any;` | 
| `ConstitutionalProtocolDefinition.ts` | 12 | `: any` | `validate(context: any): ValidationResult;` | 
| `ExecutiveConstitutionalRuntime.ts` | 242 | `: any` | `} catch (err: any) {` | 
| `AIConstitutionProtocol.ts` | 9 | `: any` | `public validate(context: any): ValidationResult {` | 
| `CausalConstitutionProtocol.ts` | 9 | `: any` | `public validate(context: any): ValidationResult {` | 
| `ExecutiveDecisionConstitutionProtocol.ts` | 13 | `: any` | `public validate(context: { cglContext: any, decisions: Execu...` | 
| `FiduciaryConstitutionProtocol.ts` | 9 | `: any` | `public validate(context: any): ValidationResult {` | 
| `LineageConstitutionProtocol.ts` | 9 | `: any` | `public validate(context: any): ValidationResult {` | 
| `ScenarioConstitutionProtocol.ts` | 10 | `: any` | `public validate(context: { baselineContext: any, scenarioCon...` | 
| `ScenarioSimulationConstitutionProtocol.ts` | 13 | `: any` | `public validate(context: { baselineContext: any, scenario: I...` | 
| `SemanticConstitutionProtocol.ts` | 10 | `: any` | `public validate(context: any): ValidationResult {` | 
| `TreasuryConstitutionProtocol.ts` | 9 | `: any` | `public validate(context: any): ValidationResult {` | 
| `ConstitutionalDecisionRuntime.ts` | 12 | `: any` | `context: any` | 
| `DecisionToCashCausalityTypes.ts` | 51 | `: any` | `financialContext: any; // Simplified placeholder for Financi...` | 
| `EarlyWarningTypes.ts` | 36 | `: any` | `financialContext?: any;` | 
| `ExecutiveAccountabilityTypes.ts` | 28 | `: any` | `executiveIntelligenceReport?: any;` | 
| `ExecutiveAccountabilityTypes.ts` | 30 | `: any` | `financialContext?: any;` | 
| `ExecutivePriorityResolver.ts` | 12 | `: any` | `public static resolve(report: any): ExecutivePriority[] {` | 
| `ExecutivePriorityResolver.ts` | 97 | `: any` | `const currentLiquidity = kpis.find((k: any) => k.name === 'L...` | 
| `GovernanceDriftTypes.ts` | 23 | `: any` | `executiveIntelligenceReport?: any; // Representação simplifi...` | 
| `GovernanceDriftTypes.ts` | 29 | `: any` | `financialContext?: any;` | 
| `InstitutionalBehavioralTypes.ts` | 36 | `: any` | `financialContext?: any;` | 
| `InstitutionalStabilityTypes.ts` | 46 | `: any` | `financialContext?: any;` | 
| `decision-types.ts` | 80 | `: any` | `predictiveAssessment?: any;` | 
| `AsyncJobQueue.ts` | 35 | `: any` | `entityScope?: any;` | 
| `AsyncJobQueue.ts` | 38 | `: any` | `payload?: any;` | 
| `AsyncJobQueue.ts` | 135 | `: any` | `payload: any,` | 
| `WorkerRegistry.ts` | 17 | `<any>` | `export type JobExecutor = (job: AsyncJob) => Promise<any>;` | 
| `WorkerRegistry.ts` | 120 | `: any` | `} catch (execErr: any) {` | 
| `DREExecutiveBindingAudit.ts` | 2 | `: any` | `public static audit(metrics: any) {` | 
| `DREExecutiveDataMapper.ts` | 26 | `: any` | `private static findValue(payload: any, aliases: string[]): N...` | 
| `DREExecutiveDataMapper.ts` | 44 | `: any` | `public static map(payload: any) {` | 
| `RealDatasetProfiler.ts` | 3 | `: any` | `static profile(tenantId: string, datasetId: string): any {` | 
| `InstitutionalEvidenceTypes.ts` | 29 | `: any` | `rawContentReference?: any; // Pointer to the parsed array/ob...` | 
| `types.ts` | 130 | `: any` | `static hash(payload: any): string {` | 
| `command-adapter.ts` | 26 | `as any` | `const survivalReport = (report as any).survivalReport || {};` | 
| `command-adapter.ts` | 31 | `as any` | `const capitalGov = report.capitalGovernanceReport?.fiduciary...` | 
| `command-adapter.ts` | 36 | `as any` | `const operatingPressureSeverity = (pressure as any).overallP...` | 
| `command-adapter.ts` | 45 | `as any` | `const metadata = (report as any).metadata || {};` | 
| `ExecutiveSemanticAudit.ts` | 9 | `: any` | `export function audit(payload: any, profile?: string): { pas...` | 
| `ExecutiveSemanticAudit.ts` | 13 | `: any` | `const check = (obj: any) => {` | 
| `ExecutiveSemanticBoundaryGuard.ts` | 9 | `: any` | `export function sanitize(payload: any, profile?: string): an...` | 
| `ExecutiveSemanticBoundaryGuard.ts` | 24 | `: any` | `const sanitized: any = {};` | 
| `ExecutiveSemanticBoundaryGuard.ts` | 38 | `: any` | `export function translate(payload: any, profile?: string): a...` | 
| `ExecutiveSemanticBoundaryGuard.ts` | 47 | `: any` | `const translated: any = {};` | 
| `ExecutiveSemanticBoundaryGuard.ts` | 58 | `: any` | `export function validate(payload: any, profile?: string): vo...` | 
| `ExecutiveSemanticBoundaryGuard.ts` | 69 | `: any` | `const check = (obj: any) => {` | 
| `ExecutiveSemanticBoundaryGuard.ts` | 94 | `: any` | `const check = (obj: any) => {` | 
| `ProductionVisibilityPolicy.ts` | 21 | `: any` | `export function isDebugAllowed(profile: any, showDebugTools:...` | 
| `executive-intelligence-runtime.ts` | 244 | `: any` | `actionMatrix: any[];` | 
| `executive-intelligence-runtime.ts` | 246 | `: any` | `fiduciaryEnforcement?: any;` | 
| `executive-intelligence-runtime.ts` | 258 | `: any` | `propagationChains?: any[];` | 
| `executive-intelligence-runtime.ts` | 259 | `: any` | `fiduciaryRationale?: any;` | 
| `executive-intelligence-runtime.ts` | 260 | `: any` | `fiduciaryEnforcement?: any;` | 
| `executive-intelligence-runtime.ts` | 264 | `: any` | `normalizedDRE?: any;` | 
| `executive-intelligence-runtime.ts` | 265 | `: any` | `revenueEconomicStructure?: any;` | 
| `executive-intelligence-runtime.ts` | 266 | `: any` | `economicBurnRate?: any;` | 
| `executive-intelligence-runtime.ts` | 267 | `: any` | `breakEvenAnalysis?: any;` | 
| `executive-intelligence-runtime.ts` | 268 | `: any` | `operationalAbsorption?: any;` | 
| `executive-intelligence-runtime.ts` | 269 | `: any` | `economicDiagnosis?: any;` | 
| `executive-intelligence-runtime.ts` | 270 | `: any` | `dreExecutiveAdvisory?: any;` | 
| `executive-intelligence-runtime.ts` | 271 | `: any` | `dreBoardDecisionSupport?: any;` | 
| `executive-intelligence-runtime.ts` | 272 | `: any` | `bindingAudit?: any;` | 
| `executive-intelligence-runtime.ts` | 273 | `: any` | `[key: string]: any;` | 
| `executive-intelligence-runtime.ts` | 303 | `: any` | `chartData: any[];` | 
| `executive-intelligence-runtime.ts` | 312 | `: any` | `fiduciaryEnforcement?: any;` | 
| `executive-intelligence-runtime.ts` | 316 | `: any` | `scenarioProjections?: any;` | 
| `executive-intelligence-runtime.ts` | 326 | `: any` | `institutionalCausality?: any;` | 
| `executive-intelligence-runtime.ts` | 337 | `: any` | `patrimonialIntelligenceReport?: any;` | 
| `executive-intelligence-runtime.ts` | 360 | `: any` | `inferences?: Record<string, { metrics: any; narrative?: any;...` | 
| `executive-intelligence-runtime.ts` | 362 | `: any` | `temporalAudit?: any;` | 
| `executive-intelligence-runtime.ts` | 364 | `: any` | `featureFlags?: any;` | 
| `executive-intelligence-runtime.ts` | 377 | `: any` | `public validateFiduciarySafety(report: any) {` | 
| `executive-intelligence-runtime.ts` | 380 | `: any` | `public validateMathSanity(metrics: any) {` | 
| `executive-intelligence-runtime.ts` | 383 | `: any` | `public validateSemanticSobriety(report: any) {` | 
| `executive-intelligence-runtime.ts` | 386 | `: any` | `public verifyLineage(report: any) {` | 
| `executive-intelligence-runtime.ts` | 389 | `: any` | `public propagateConfidence(report: any) {` | 
| `executive-intelligence-runtime.ts` | 392 | `: any` | `public applyFailClosed(report: any, reason: string) {` | 
| `executive-intelligence-runtime.ts` | 395 | `: any` | `public generateAuditTrail(report: any) {` | 
| `executive-intelligence-runtime.ts` | 403 | `: any` | `public generateExecutiveReport(rawData: any, externalMetadat...` | 
| `executive-intelligence-runtime.ts` | 412 | `: any` | `let tempValidation: any = null;` | 
| `executive-intelligence-runtime.ts` | 584 | `: any` | `let bpSummary: any = rawData.rawFinancialData?.bpSummary || ...` | 
| `executive-intelligence-runtime.ts` | 603 | `: any` | `const cleanHierarchySummary: any = {};` | 
| `executive-intelligence-runtime.ts` | 625 | `: any` | `: (hasDRE ? (rawData.dreData.find((r: any) => r.category ===...` | 
| `executive-intelligence-runtime.ts` | 628 | `: any` | `: (hasDRE ? (rawData.dreData.find((r: any) => r.category ===...` | 
| `executive-intelligence-runtime.ts` | 641 | `: any` | `const calcScores = (bp: any, ebitda: number, lucroLiq: numbe...` | 
| `executive-intelligence-runtime.ts` | 724 | `: any` | `let finalWeights: any = baseWeights;` | 
| `executive-intelligence-runtime.ts` | 906 | `: any` | `insights: rawCausality.insights?.map((ins: any) => ({` | 
| `executive-intelligence-runtime.ts` | 1021 | `: any` | `const isOfficialDfcAvailable = allHistData.some((d: any) => ...` | 
| `executive-intelligence-runtime.ts` | 1054 | `: any` | `const yearEntries = dreRawData.filter((d: any) => {` | 
| `executive-intelligence-runtime.ts` | 1060 | `: any` | `.sort((a: any, b: any) => (a.ordem || 0) - (b.ordem || 0))` | 
| `executive-intelligence-runtime.ts` | 1061 | `: any` | `.map((d: any) => {` | 
| `executive-intelligence-runtime.ts` | 1099 | `: any` | `...DRE_OFFICIAL_STRUCTURE.map((account: any) => ({ ...accoun...` | 
| `executive-intelligence-runtime.ts` | 1106 | `: any` | `const row = cascadeResult.find((r: any) => r.id === id);` | 
| `executive-intelligence-runtime.ts` | 1124 | `: any` | `const cmvRow = cascadeResult.find((r: any) => r.parentId ===...` | 
| `executive-intelligence-runtime.ts` | 1125 | `: any` | `cascadeResult.find((r: any) => r.id === 'CUSTOS');` | 
| `executive-intelligence-runtime.ts` | 1152 | `: any` | `.filter((r: any) => r.parentId === 'DESP_OPER' && (r.conta |...` | 
| `executive-intelligence-runtime.ts` | 1153 | `: any` | `.reduce((a: any, b: any) => a + (b.computedValue || b.value ...` | 
| `executive-intelligence-runtime.ts` | 1155 | `: any` | `.filter((r: any) => r.parentId === 'DESP_OPER' && (r.conta |...` | 
| `executive-intelligence-runtime.ts` | 1156 | `: any` | `.reduce((a: any, b: any) => a + (b.computedValue || b.value ...` | 
| `executive-intelligence-runtime.ts` | 1206 | `: any` | `const yearHist = allHistoryData.filter((d: any) =>` | 
| `executive-intelligence-runtime.ts` | 1213 | `: any` | `const m = yearHist.map((d: any) => ({ ...d, value: d.val || ...` | 
| `executive-intelligence-runtime.ts` | 1214 | `: any` | `const res = calculateDreCascade([...DRE_OFFICIAL_STRUCTURE.m...` | 
| `executive-intelligence-runtime.ts` | 1215 | `: any` | `rl  = res.find((r: any) => r.id === 'ROL')?.computedValue ||...` | 
| `executive-intelligence-runtime.ts` | 1216 | `: any` | `ebt = res.find((r: any) => r.id === 'EBITDA')?.computedValue...` | 
| `executive-intelligence-runtime.ts` | 1217 | `: any` | `ll  = res.find((r: any) => r.id === 'LUCRO_LIQ')?.computedVa...` | 
| `executive-intelligence-runtime.ts` | 1218 | `: any` | `cmv = Math.abs(res.find((r: any) => r.id === 'CUSTOS')?.comp...` | 
| `executive-intelligence-runtime.ts` | 1221 | `: any` | `}).filter((d: any) => d.receita > 0 || d.ebitda > 0 || d.luc...` | 
| `executive-intelligence-runtime.ts` | 1224 | `: any` | `let recGrowth = 0, ebitdaGrowth = 0, trendNote: any = null;` | 
| `executive-intelligence-runtime.ts` | 1227 | `: any` | `const oldest  = chartData.find((d: any) => d.receita > 0) ||...` | 
| `executive-intelligence-runtime.ts` | 1354 | `as any` | `(dreInsights as any).qualityReport = qualityReport;` | 
| `executive-intelligence-runtime.ts` | 1355 | `as any` | `(dreInsights as any).rootCauseReport = rootCauseReport;` | 
| `executive-intelligence-runtime.ts` | 1356 | `as any` | `(dreInsights as any).economicValueAssessment = economicValue...` | 
| `executive-intelligence-runtime.ts` | 1357 | `as any` | `(dreInsights as any).earningsQualityAssessment = earningsQua...` | 
| `executive-intelligence-runtime.ts` | 1358 | `as any` | `(dreInsights as any).confidenceAssessment = confidenceAssess...` | 
| `executive-intelligence-runtime.ts` | 1359 | `as any` | `(dreInsights as any).managementDiscussion = managementDiscus...` | 
| `executive-intelligence-runtime.ts` | 1360 | `as any` | `(dreInsights as any).executiveInterpretation = executiveInte...` | 
| `executive-intelligence-runtime.ts` | 1363 | `as any` | `(dreInsights as any).normalizedDRE = normalizedDRE;` | 
| `executive-intelligence-runtime.ts` | 1364 | `as any` | `(dreInsights as any).revenueEconomicStructure = revenueEcono...` | 
| `executive-intelligence-runtime.ts` | 1365 | `as any` | `(dreInsights as any).economicBurnRate = economicBurnRate;` | 
| `executive-intelligence-runtime.ts` | 1366 | `as any` | `(dreInsights as any).breakEvenAnalysis = breakEvenAnalysis;` | 
| `executive-intelligence-runtime.ts` | 1367 | `as any` | `(dreInsights as any).operationalAbsorption = operationalAbso...` | 
| `executive-intelligence-runtime.ts` | 1368 | `as any` | `(dreInsights as any).economicDiagnosis = economicDiagnosis;` | 
| `executive-intelligence-runtime.ts` | 1369 | `as any` | `(dreInsights as any).dreExecutiveAdvisory = dreBoardAdvisory...` | 
| `executive-intelligence-runtime.ts` | 1370 | `as any` | `(dreInsights as any).dreExecutiveAdvisoryFull = dreExecutive...` | 
| `executive-intelligence-runtime.ts` | 1371 | `as any` | `(dreInsights as any).dreBoardDecisionSupport = dreBoardDecis...` | 
| `executive-intelligence-runtime.ts` | 1372 | `as any` | `(dreInsights as any).healthExplainability = healthExplainabi...` | 
| `executive-intelligence-runtime.ts` | 1373 | `as any` | `(dreInsights as any).dreIsolationAudit = dreIsolationAudit;` | 
| `executive-intelligence-runtime.ts` | 1374 | `as any` | `(dreInsights as any).dreBindingAudit = DREExecutiveBindingAu...` | 
| `executive-intelligence-runtime.ts` | 1455 | `as any` | `...dreInsights as any,` | 
| `executive-intelligence-runtime.ts` | 1478 | `: any` | `: (isOfficialDfcAvailable ? allHistData.filter((d: any) => {` | 
| `executive-intelligence-runtime.ts` | 1511 | `: any` | `const getDfcVal = (entries: any[], keywords: string[]) => {` | 
| `executive-intelligence-runtime.ts` | 1535 | `: any` | `const yearEntries = allHistData.filter((d: any) =>` | 
| `executive-intelligence-runtime.ts` | 1539 | `: any` | `const match = yearEntries.find((d: any) => {` | 
| `executive-intelligence-runtime.ts` | 1547 | `: any` | `const yearEntries = allHistData.filter((d: any) =>` | 
| `executive-intelligence-runtime.ts` | 1552 | `: any` | `yearEntries.forEach((d: any) => {` | 
| `executive-intelligence-runtime.ts` | 1576 | `: any` | `const yearDfcEntries = allHistData.filter((d: any) =>` | 
| `executive-intelligence-runtime.ts` | 1610 | `: any` | `const yearEntries = allHistData.filter((d: any) =>` | 
| `executive-intelligence-runtime.ts` | 1614 | `: any` | `const match = yearEntries.find((d: any) => {` | 
| `executive-intelligence-runtime.ts` | 1627 | `: any` | `fco = dfcDataForRuntime.filter((d: any) => d.category === 'A...` | 
| `executive-intelligence-runtime.ts` | 1628 | `: any` | `fci = dfcDataForRuntime.filter((d: any) => d.category === 'A...` | 
| `executive-intelligence-runtime.ts` | 1629 | `: any` | `fcf = dfcDataForRuntime.filter((d: any) => d.category === 'A...` | 
| `executive-intelligence-runtime.ts` | 1632 | `: any` | `.filter((d: any) => {` | 
| `executive-intelligence-runtime.ts` | 1641 | `: any` | `.reduce((acc: number, curr: any) => acc + Math.abs(curr.amou...` | 
| `executive-intelligence-runtime.ts` | 1644 | `: any` | `.filter((d: any) => {` | 
| `executive-intelligence-runtime.ts` | 1655 | `: any` | `.reduce((acc: number, curr: any) => acc + Math.abs(curr.amou...` | 
| `executive-intelligence-runtime.ts` | 1657 | `: any` | `const relEntries = dfcDataForRuntime.filter((d: any) => {` | 
| `executive-intelligence-runtime.ts` | 1662 | `: any` | `resolvedContasRelacionadas = relEntries.reduce((acc: number,...` | 
| `executive-intelligence-runtime.ts` | 1790 | `: any` | `const totalDistributed = rawData.dlpaData ? rawData.dlpaData...` | 
| `executive-intelligence-runtime.ts` | 1809 | `: any` | `const dlpaCapSocialEntry = (rawData.dlpaData || []).find((e:...` | 
| `executive-intelligence-runtime.ts` | 2220 | `: any` | `bpWorkingCapitalPressure: (capitalGovernanceReport.isAvailab...` | 
| `executive-intelligence-runtime.ts` | 2221 | `: any` | `bpHighLeverage: (capitalGovernanceReport.isAvailable && Arra...` | 
| `executive-intelligence-runtime.ts` | 2240 | `: any` | `const lossAbsorption = bpIndicators.find((i: any) => i.metri...` | 
| `executive-intelligence-runtime.ts` | 2266 | `: any` | `const bpHistoryArray: { year: number; summary: any }[] = [];` | 
| `executive-intelligence-runtime.ts` | 2268 | `: any` | `const uniqueYears = [...new Set(historySource.map((h: any) =...` | 
| `executive-intelligence-runtime.ts` | 2271 | `: any` | `const yearEntries = historySource.filter((d: any) => d.year ...` | 
| `executive-intelligence-runtime.ts` | 2425 | `as any` | `governanceConsistency: undefined as any` | 
| `executive-intelligence-runtime.ts` | 2519 | `as any` | `} as any,` | 
| `executive-intelligence-runtime.ts` | 2524 | `as any` | `} as any,` | 
| `executive-intelligence-runtime.ts` | 2532 | `as any` | `} as any` | 
| `executive-intelligence-runtime.ts` | 2535 | `as any` | `constitutionalDashboard: undefined as any // Placeholder to ...` | 
| `executive-intelligence-runtime.ts` | 2551 | `as any` | `} as any);` | 
| `executive-intelligence-runtime.ts` | 2566 | `as any` | `} as any);` | 
| `executive-intelligence-runtime.ts` | 2804 | `as any` | `const parsedCycles = report.timeline.lineageHash ? (Executiv...` | 
| `executive-intelligence-runtime.ts` | 2826 | `: any` | `const uniqueCyclesMap: { [key: string]: any } = {};` | 
| `executive-intelligence-runtime.ts` | 2832 | `: any` | `const sortedCycles = Object.values(uniqueCyclesMap).sort((a:...` | 
| `FinancialRuntimeContextAdapter.test.ts` | 139 | `as any` | `} as any as SegmentIntelligenceProfile;` | 
| `BalanceSheetHistoricalContaminationAudit.ts` | 2 | `: any` | `static audit(selectedYear: number, rawData: any): { isContam...` | 
| `BalanceSheetNarrativeTemporalAudit.ts` | 2 | `: any` | `static audit(narrative: string, summary: any, indicators: an...` | 
| `BalanceSheetPresentationLeakAudit.ts` | 4 | `: any` | `static audit(output: any): { hasLeak: boolean; leaks: string...` | 
| `BalanceSheetSummaryLineageAudit.ts` | 9 | `: any` | `static generateLineage(bpSummary: any, exerciseYear: number,...` | 
| `NaNEliminationGuard.ts` | 2 | `: any` | `static sanitizeNumber(value: any, fallback: string | number ...` | 
| `NaNEliminationGuard.ts` | 21 | `: any` | `static isSafe(value: any): boolean {` | 
| `DFCSSOTAuthorityGuard.ts` | 10 | `: any` | `output: any,` | 
| `DFCSSOTGuard.ts` | 8 | `: any` | `static enforce(output: any): CashFlowGovernanceOutput {` | 
| `DLPACanonicalBindingAudit.ts` | 3 | `: any` | `engineOutput: any;` | 
| `DLPACanonicalBindingAudit.ts` | 4 | `: any` | `adapterOutput: any;` | 
| `DLPACanonicalBindingAudit.ts` | 5 | `: any` | `uiOutput?: any;` | 
| `DLPACanonicalPayloadEnforcer.ts` | 4 | `: any` | `public static enforce(payload: any): {` | 
| `DLPACanonicalPayloadEnforcer.ts` | 6 | `: any` | `normalizedPayload: any;` | 
| `DLPALegacyFieldScanner.ts` | 2 | `: any` | `public static scan(payload: any): 'CANONICAL' | 'LEGACY_PAYL...` | 
| `DLPALegacyPayloadAudit.ts` | 2 | `: any` | `public static audit(payload: any): { valid: boolean; error?:...` | 
| `DLPARecoveryHorizonResolver.ts` | 2 | `: any` | `public static resolve(patrimonialRecoveryHorizon: any, capit...` | 
| `DLPATemporalIntegrityGuard.ts` | 7 | `: any` | `public static filterHistoricalCycles(historicalCycles: any[]...` | 
| `executive-conversation-adapter.ts` | 12 | `: any` | `): any {` | 
| `governance-copilot-adapter.ts` | 9 | `: any` | `): any {` | 
| `governance-copilot-reasoning-adapter.ts` | 9 | `: any` | `): any {` | 
| `GrowthPatternResolver.ts` | 11 | `: any` | `const ebitda = ctx.dreCascade?.find((d: any) => d.id === 'EB...` | 
| `GrowthPatternResolver.ts` | 14 | `: any` | `const netIncome = ctx.dreCascade?.find((d: any) => d.id === ...` | 
| `types.ts` | 127 | `: any` | `operationalProfile?: any;` | 
| `types.ts` | 141 | `: any` | `operationalProfile?: any;` | 
| `types.ts` | 145 | `: any` | `rawData: any;` | 
| `types.ts` | 146 | `: any` | `bpSummary: any;` | 
| `types.ts` | 147 | `: any` | `dreCascade: any[];` | 
| `institutional-evidence-adapter.ts` | 6 | `: any` | `reportWithExecutiveSovereignty: any,` | 
| `institutional-evidence-adapter.ts` | 8 | `: any` | `): any {` | 
| `HistoricalReplayIndex.ts` | 29 | `: any` | `public static assertNoPayloadBloat(entry: any): void {` | 
| `InstitutionalBehaviorAnalyzer.ts` | 54 | `: any` | `private static parseBPSummary(bpData?: any[]): any {` | 
| `LongitudinalSnapshotSummary.ts` | 17 | `: any` | `public static build(payload: any): LongitudinalSnapshotSumma...` | 
| `RecommendationPersistenceTracker.ts` | 10 | `: any` | `public static trackIgnored(cycles: any[]): string[] {` | 
| `types.ts` | 125 | `: any` | `bpData?: any[];` | 
| `RecoveryTypes.ts` | 34 | `: any` | `survivalReport?: any;` | 
| `RecoveryTypes.ts` | 35 | `: any` | `fiduciaryOutput?: any;` | 
| `RecoveryTypes.ts` | 36 | `: any` | `treasuryRuntime?: any;` | 
| `RecoveryTypes.ts` | 37 | `: any` | `cashIntelligenceRuntime?: any;` | 
| `RecoveryTypes.ts` | 38 | `: any` | `patrimonialIntelligenceRuntime?: any;` | 
| `RecoveryTypes.ts` | 39 | `: any` | `longitudinalRuntimeHistory?: any[];` | 
| `RecoveryTypes.ts` | 40 | `: any` | `historicalCycles?: any[];` | 
| `RecoveryTypes.ts` | 44 | `: any` | `memoryProfile?: any;` | 
| `RecoveryTypes.ts` | 45 | `: any` | `regressionReport?: any;` | 
| `RecoveryTypes.ts` | 46 | `: any` | `resilienceReport?: any;` | 
| `InstitutionalBoardPackDocumentRuntime.test.ts` | 14 | `as any` | `} as any as import('../institutional-context/types').Institu...` | 
| `InstitutionalBoardPackDocumentRuntime.test.ts` | 18 | `as any` | `} as any as import('../observability/observability-types').R...` | 
| `InstitutionalBoardPackDocumentRuntime.test.ts` | 23 | `as any` | `} as any as ExecutiveIntelligenceReport['compliance'],` | 
| `InstitutionalBoardPackDocumentRuntime.test.ts` | 28 | `as any` | `} as any as import('../strategic-intelligence/strategic-inte...` | 
| `InstitutionalBoardPackDocumentRuntime.test.ts` | 32 | `as any` | `} as any as import('../evidence-ingestion/InstitutionalEvide...` | 
| `InstitutionalBoardPackDocumentRuntime.test.ts` | 39 | `as any` | `} as any as import('../cash-intelligence/CashIntelligenceTyp...` | 
| `InstitutionalBoardPackDocumentRuntime.ts` | 17 | `: any` | `evidenceAppendix: any[];` | 
| `InstitutionalBoardPackDocumentRuntime.ts` | 25 | `: any` | `temporalAudit?: any;` | 
| `InstitutionalBoardPackDocumentRuntime.ts` | 47 | `: any` | `const evidenceTrail: any[] = [];` | 
| `InstitutionalBoardPackDocumentRuntime.ts` | 66 | `as any` | `(report as any).featureFlags?.showTechnicalAudit ||` | 
| `InstitutionalBoardPackDocumentRuntime.ts` | 67 | `as any` | `(report as any).compliance?.featureFlags?.showTechnicalAudit...` | 
| `InstitutionalBoardPackDocumentRuntime.ts` | 68 | `as any` | `(report as any).institutionalContext?.featureFlags?.showTech...` | 
| `InstitutionalBoardPackDocumentRuntime.ts` | 69 | `as any` | `(report as any).context?.input?.featureFlags?.showTechnicalA...` | 
| `InstitutionalBoardPackDocumentRuntime.ts` | 70 | `as any` | `(report as any).context?.input?.rawFinancialData?.featureFla...` | 
| `InstitutionalBoardPackDocumentRuntime.ts` | 71 | `as any` | `(report as any).context?.input?.rawFinancialData?.featureFla...` | 
| `InstitutionalBoardPackDocumentRuntime.ts` | 210 | `: any` | `const fmtVal = (val: any): string => (typeof val === 'number...` | 
| `InstitutionalBoardPackDocumentRuntime.ts` | 211 | `: any` | `const fmtPct = (val: any): string => (typeof val === 'number...` | 
| `InstitutionalBoardPackDocumentRuntime.ts` | 347 | `: any` | `timeline.forEach((evt: any) => {` | 
| `InstitutionalBoardPackDocumentRuntime.ts` | 359 | `: any` | `const years = heatmaps.treasury?.map((h: any) => h.year) || ...` | 
| `InstitutionalBoardPackDocumentRuntime.ts` | 426 | `: any` | `const baseMetrics = stressScenarios.find((s: any) => s.name ...` | 
| `InstitutionalBoardPackDocumentRuntime.ts` | 443 | `: any` | `stressScenarios.forEach((sc: any) => {` | 
| `InstitutionalBoardPackDocumentRuntime.ts` | 487 | `: any` | `const severeStressScenario = stressScenarios.find((s: any) =...` | 
| `InstitutionalBoardPackDocumentRuntime.ts` | 490 | `: any` | `const activeCascadeLogs = ccsMetrics.stressScenarios?.find((...` | 
| `InstitutionalBoardPackDocumentRuntime.ts` | 555 | `: any` | `topDecisions.forEach((dec: any) => {` | 
| `InstitutionalBoardPackDocumentRuntime.ts` | 562 | `: any` | `topDecisions.forEach((dec: any, idx: number) => {` | 
| `InstitutionalBoardPackDocumentRuntime.ts` | 576 | `: any` | `conflicts.forEach((c: any) => {` | 
| `InstitutionalBoardPackDocumentRuntime.ts` | 590 | `: any` | `topDecisions.slice(0, 5).forEach((dec: any) => {` | 
| `InstitutionalBoardPackDocumentRuntime.ts` | 598 | `: any` | `const getLabel = (id: string) => allDecs.find((d: any) => d....` | 
| `InstitutionalBoardPackDocumentRuntime.ts` | 611 | `: any` | `capitalAllocationRanking.forEach((r: any) => {` | 
| `InstitutionalBoardPackDocumentRuntime.ts` | 619 | `: any` | `topDecisions.slice(0, 3).forEach((dec: any) => {` | 
| `InstitutionalBoardPackDocumentRuntime.ts` | 641 | `: any` | `decisions.forEach((rec: any) => {` | 
| `InstitutionalBoardPackDocumentRuntime.ts` | 642 | `: any` | `const evTypes = rec.evidence?.map((e: any) => e.type).join('...` | 
| `InstitutionalBoardPackDocumentRuntime.ts` | 656 | `: any` | `decisions.forEach((rec: any) => {` | 
| `InstitutionalBoardPackDocumentRuntime.ts` | 670 | `: any` | `const overdueDecs = decisions.filter((r: any) => {` | 
| `InstitutionalBoardPackDocumentRuntime.ts` | 675 | `: any` | `overdueDecs.forEach((r: any) => {` | 
| `InstitutionalBoardPackDocumentRuntime.ts` | 708 | `: any` | `const fmtVal = (val: any): string => (typeof val === 'number...` | 
| `InstitutionalBoardPackDocumentRuntime.ts` | 777 | `as any` | `? (FinancialLineageIntegrityAdapter as any).audit({` | 
| `InstitutionalBoardPackDocumentRuntime.ts` | 779 | `as any` | `input: { rawFinancialData: { allHistoryData: [] } } as any,` | 
| `InstitutionalBoardPackDocumentRuntime.ts` | 799 | `: any` | `flifResult.violations.forEach((v: any) => {` | 
| `InstitutionalBoardPackDocumentRuntime.ts` | 807 | `: any` | `const netIncomeMetric = flifResult.auditedMetrics.find((m: a...` | 
| `InstitutionalBoardPackDocumentRuntime.ts` | 855 | `: any` | `const fmtVal = (val: any): string => (typeof val === 'number...` | 
| `InstitutionalBoardPackDocumentRuntime.ts` | 856 | `: any` | `const fmtPct = (val: any): string => (typeof val === 'number...` | 
| `InstitutionalBoardPackDocumentRuntime.ts` | 920 | `: any` | `const formatLineageVal = (val: any) => {` | 
| `InstitutionalBoardPackDocumentRuntime.ts` | 933 | `: any` | `const preservationMetric = (cgeMetrics.metricsRegistry || []...` | 
| `InstitutionalBoardPackDocumentRuntime.ts` | 994 | `as any` | `const lifecycleStage = cgeMetrics2.lifecycleStage || (report...` | 
| `InstitutionalBoardPackRuntime.ts` | 152 | `: any` | `liquidityFragilityOverride: !!structuralRestrictions.applied...` | 
| `InstitutionalBoardPackRuntime.ts` | 153 | `: any` | `shortTermDebtConcentrationOverride: !!structuralRestrictions...` | 
| `InstitutionalBoardPackRuntime.ts` | 159 | `as any` | `const bpSummary = (report as any).capitalGovernanceReport?.b...` | 
| `InstitutionalBoardPackRuntime.ts` | 160 | `as any` | `|| (report as any).context?.input?.rawFinancialData?.bpSumma...` | 
| `InstitutionalBoardPackRuntime.ts` | 161 | `as any` | `|| (report as any).metrics?.financialMetrics` | 
| `InstitutionalBoardPackRuntime.ts` | 164 | `as any` | `const netRevenue = Number((report.metrics as any)?.netRevenu...` | 
| `InstitutionalBoardPackRuntime.ts` | 165 | `as any` | `const netProfit = Number((report.metrics as any)?.netProfit ...` | 
| `InstitutionalBoardPackRuntime.ts` | 166 | `as any` | `const ebit = Number((report.metrics as any)?.ebit ?? (report...` | 
| `InstitutionalBoardPackRuntime.ts` | 172 | `as any` | `const capitalSocial = Number((report.capitalGovernanceReport...` | 
| `InstitutionalBoardPackRuntime.ts` | 173 | `as any` | `?? (report as any).executiveLayer?.consumedCapital?.capitalS...` | 
| `InstitutionalBoardPackRuntime.ts` | 177 | `as any` | `const lucrosPrejuizos = Number((report.capitalGovernanceRepo...` | 
| `InstitutionalBoardPackRuntime.ts` | 178 | `as any` | `?? (report.capitalGovernanceReport as any)?.lucrosPrejuizos` | 
| `InstitutionalBoardPackRuntime.ts` | 179 | `as any` | `?? (report as any).executiveLayer?.consumedCapital?.value` | 
| `InstitutionalBoardPackRuntime.ts` | 183 | `as any` | `|| (report as any).historicalCyclesCount` | 
| `InstitutionalBoardPackRuntime.ts` | 212 | `as any` | `|| (report.metrics as any)?.fiduciary?.cashRunwayInstitucion...` | 
| `InstitutionalBoardPackRuntime.ts` | 213 | `as any` | `|| (report as any).continuityRisk?.projectedRunwayMonths` | 
| `InstitutionalBoardPackRuntime.ts` | 216 | `as any` | `const fco = Number((report.metrics as any)?.fco || (report.c...` | 
| `InstitutionalBoardPackRuntime.ts` | 315 | `as any` | `(report as any)?.featureFlags?.showTechnicalAudit ||` | 
| `InstitutionalBoardPackRuntime.ts` | 316 | `as any` | `(report as any).compliance?.featureFlags?.showTechnicalAudit...` | 
| `InstitutionalBoardPackRuntime.ts` | 317 | `as any` | `(report as any).institutionalContext?.featureFlags?.showTech...` | 
| `InstitutionalBoardPackRuntime.ts` | 318 | `as any` | `(report as any).context?.input?.featureFlags?.showTechnicalA...` | 
| `InstitutionalBoardPackRuntime.ts` | 319 | `as any` | `(report as any).context?.input?.rawFinancialData?.featureFla...` | 
| `InstitutionalBoardPackRuntime.ts` | 320 | `as any` | `(report as any).context?.input?.rawFinancialData?.featureFla...` | 
| `InstitutionalBoardPackRuntime.ts` | 374 | `as any` | `cqs: (report.capitalGovernanceReport as any)?.diagnostics?.b...` | 
| `InstitutionalBoardPackRuntime.ts` | 375 | `as any` | `eqs: (report.metrics as any)?.fiduciary?.earningsQuality ?? ...` | 
| `InstitutionalBoardPackRuntime.ts` | 376 | `as any` | `dlpaTechnicalLayer: (report.capitalGovernanceReport as any)?...` | 
| `InstitutionalBoardPackRuntime.ts` | 377 | `as any` | `dfcTechnicalLayer: (report.metrics as any)?.fiduciary ?? nul...` | 
| `InstitutionalBoardPackRuntime.ts` | 379 | `as any` | `constitutionalAudit: (report.constitutionalEvaluation as any...` | 
| `InstitutionalBoardPackRuntime.ts` | 402 | `as any` | `const capReport = report.capitalGovernanceReport as any;` | 
| `ExecutiveLongitudinalIntegration.spec.ts` | 31 | `as any` | `classification: classification as any,` | 
| `ExecutiveLongitudinalIntegration.spec.ts` | 106 | `as any` | `strategicIntelligence: { posture: 'EXPANSION_POSTURE', traje...` | 
| `ExecutiveLongitudinalIntegration.spec.ts` | 135 | `as any` | `strategic: { posture: 'EXPANSION_POSTURE', trajectory: 'TRAJ...` | 
| `ExecutiveLongitudinalIntegration.spec.ts` | 149 | `as any` | `} as any);` | 
| `InstitutionalBoardPackEndToEnd.spec.ts` | 299 | `as any` | `(report.runtimeMetadata as any).lineageHash = 'canonical-has...` | 
| `InstitutionalBoardPackEndToEnd.spec.ts` | 300 | `as any` | `(report.runtimeMetadata as any).historicalCyclesAvailable = ...` | 
| `InstitutionalBoardPackEndToEnd.spec.ts` | 302 | `as any` | `(report as any).runtimeMetadata = { lineageHash: 'canonical-...` | 
| `institutional-reporting-types.ts` | 172 | `: any` | `appliedOverrides: any[];` | 
| `institutional-reporting-types.ts` | 177 | `: any` | `inventoryDependency: any;` | 
| `institutional-reporting-types.ts` | 256 | `: any` | `cqs: any;` | 
| `institutional-reporting-types.ts` | 257 | `: any` | `eqs: any;` | 
| `institutional-reporting-types.ts` | 258 | `: any` | `dlpaTechnicalLayer: any;` | 
| `institutional-reporting-types.ts` | 259 | `: any` | `dfcTechnicalLayer: any;` | 
| `institutional-reporting-types.ts` | 261 | `: any` | `constitutionalAudit: any[];` | 
| `institutional-reporting-types.ts` | 263 | `: any` | `temporalAudit?: any;` | 
| `ResilienceTypes.ts` | 36 | `: any` | `survivalReport?: any;` | 
| `ResilienceTypes.ts` | 37 | `: any` | `recoveryReport?: any;` | 
| `ResilienceTypes.ts` | 38 | `: any` | `regressionReport?: any;` | 
| `ResilienceTypes.ts` | 39 | `: any` | `fiduciaryOutput?: any;` | 
| `ResilienceTypes.ts` | 40 | `: any` | `treasuryRuntime?: any;` | 
| `ResilienceTypes.ts` | 41 | `: any` | `cashIntelligenceRuntime?: any;` | 
| `ResilienceTypes.ts` | 42 | `: any` | `patrimonialIntelligenceRuntime?: any;` | 
| `ResilienceTypes.ts` | 43 | `: any` | `governanceTrajectoryRuntime?: any;` | 
| `ResilienceTypes.ts` | 44 | `: any` | `historicalInstitutionalMemory?: any; // To be derived if mis...` | 
| `ResilienceTypes.ts` | 45 | `: any` | `longitudinalRuntimeHistory?: any[];` | 
| `ResilienceTypes.ts` | 46 | `: any` | `historicalCycles?: any[];` | 
| `ResilienceTypes.ts` | 47 | `: any` | `scenarioStressRuntime?: any;` | 
| `ResilienceTypes.ts` | 48 | `: any` | `operationalContinuityRuntime?: any;` | 
| `SurvivalTypes.ts` | 29 | `: any` | `fiduciaryOutput?: any;` | 
| `SurvivalTypes.ts` | 30 | `: any` | `treasuryRuntime?: any;` | 
| `SurvivalTypes.ts` | 31 | `: any` | `cashIntelligenceRuntime?: any;` | 
| `SurvivalTypes.ts` | 32 | `: any` | `patrimonialIntelligenceRuntime?: any;` | 
| `SurvivalTypes.ts` | 33 | `: any` | `recoveryReport?: any;` | 
| `SurvivalTypes.ts` | 34 | `: any` | `historicalCycles?: any[];` | 
| `SurvivalTypes.ts` | 39 | `: any` | `memoryProfile?: any;` | 
| `SurvivalTypes.ts` | 40 | `: any` | `regressionReport?: any;` | 
| `SurvivalTypes.ts` | 41 | `: any` | `resilienceReport?: any;` | 
| `DataIngestionGateway.ts` | 5 | `: any` | `static receivePayload(rawInput: any): any {` | 
| `DataQualityGatekeeper.ts` | 8 | `: any` | `static inspect(payload: any, tenantId: string, workspaceId: ...` | 
| `IntegrationGovernanceTypes.ts` | 79 | `: any` | `parsedData?: any; // To hold parsed data for staging validat...` | 
| `ActionEvidenceResolver.ts` | 37 | `: any` | `public static resolve(actionText: string, metrics: any): { d...` | 
| `BenchmarkGovernanceRegistry.ts` | 90 | `: any` | `public static getBenchmark(segment: string, boardConfig?: an...` | 
| `InvalidMetricGuard.ts` | 21 | `: any` | `public static sanitize(val: any, fallbackType: 'NOT_APPLICAB...` | 
| `CrossDomainStateResolver.ts` | 3 | `: any` | `static resolveIntersections(tenantId: string): any {` | 
| `InstitutionalCommandCenter.ts` | 5 | `: any` | `static getExecutiveSummary(tenantId: string): any {` | 
| `OperationalSynchronizationRuntime.ts` | 3 | `: any` | `static synchronize(tenantId: string): any {` | 
| `DFCSemanticCanonicalRootResolver.ts` | 5 | `: any` | `lifecycleProfile?: any;` | 
| `DFCSemanticCanonicalRootResolver.ts` | 6 | `: any` | `semanticContext?: any;` | 
| `DFCSemanticCanonicalRootResolver.ts` | 7 | `: any` | `cqsSemantic?: any;` | 
| `DFCSemanticCanonicalRootResolver.ts` | 8 | `: any` | `eqsSemantic?: any;` | 
| `DFCSemanticRenderingGuard.ts` | 30 | `: any` | `static auditSemanticRoot(audit: any, renderedSource: string)...` | 
| `LifecycleSemanticConsumptionGuard.ts` | 4 | `: any` | `public static assertLifecycleSemanticConsumption(context: an...` | 
| `LineageService.ts` | 6 | `: any` | `static createHash(payload: any): string {` | 
| `MonitoringExecutionScheduler.ts` | 10 | `: any` | `static runManualCycle(tenantId: string, workspaceId: string,...` | 
| `MonitoringTypes.ts` | 74 | `: any` | `evaluate: (context: any) => MonitoringAlert | null;` | 
| `SystemicRiskTrendAnalyzer.ts` | 7 | `: any` | `static analyze(snapshots: any[], groupId: string): SystemicR...` | 
| `RuntimeExecutionRegistry.ts` | 15 | `: any` | `static log(entry: any): void {` | 
| `observability-types.ts` | 128 | `: any` | `systemicRisks: any[];` | 
| `observability-types.ts` | 148 | `: any` | `snapshotReport: any; // Using any instead of ConsolidatedExe...` | 
| `InstitutionalPressureRuntime.ts` | 94 | `: any` | `? input.historicalCycles.filter((h: any) => h.overallPressur...` | 
| `operating-pressure-types.ts` | 89 | `: any` | `historicalCycles: any[]; // outputs from past cycles if any` | 
| `operating-pressure-types.ts` | 113 | `: any` | `cashSustainabilityReport?: any;` | 
| `operating-pressure-types.ts` | 114 | `: any` | `treasuryReport?: any;` | 
| `operating-pressure-types.ts` | 115 | `: any` | `patrimonialReport?: any;` | 
| `pressure-adapter.ts` | 7 | `: any` | `rawData: any,` | 
| `pressure-adapter.ts` | 8 | `: any` | `bpSummary: any,` | 
| `pressure-adapter.ts` | 14 | `: any` | `cashSustainabilityReport: any,` | 
| `pressure-adapter.ts` | 15 | `: any` | `treasuryReport: any,` | 
| `pressure-adapter.ts` | 16 | `: any` | `patrimonialReport: any` | 
| `pressure-adapter.ts` | 27 | `: any` | `const yearEntries = allHistoryData.filter((d: any) =>` | 
| `pressure-adapter.ts` | 32 | `: any` | `yearEntries.forEach((d: any) => {` | 
| `operational-governance-adapter.ts` | 29 | `as any` | `const survivalReport = (report as any).survivalReport || {};` | 
| `operational-governance-adapter.ts` | 33 | `as any` | `const capitalGov = report.capitalGovernanceReport?.fiduciary...` | 
| `operational-governance-adapter.ts` | 38 | `as any` | `const operatingPressureSeverity = (pressure as any).overallP...` | 
| `operational-governance-adapter.ts` | 53 | `as any` | `const metadata = (report as any).metadata || {};` | 
| `InstitutionalFinancialDomainOrchestrator.ts` | 34 | `: any` | `let persistentRecommendations: any[] = [];` | 
| `InstitutionalFinancialDomainOrchestrator.ts` | 35 | `: any` | `let patterns: any[] = [];` | 
| `InstitutionalFinancialDomainOrchestrator.ts` | 38 | `: any` | `let resolutions: any[] = [];` | 
| `LazyExecutionCoordinator.ts` | 48 | `: any` | `} catch (error: any) {` | 
| `DFCSnapshotBindingAudit.ts` | 2 | `: any` | `cashGenerationStatus: any;` | 
| `DFCSnapshotBindingAudit.ts` | 3 | `: any` | `runwayStatus: any;` | 
| `DFCSnapshotBindingAudit.ts` | 4 | `: any` | `shareholderDependencyStatus: any;` | 
| `DFCSnapshotBindingAudit.ts` | 5 | `: any` | `primaryRisk: any;` | 
| `DFCSnapshotBindingAudit.ts` | 6 | `: any` | `recommendedAction: any;` | 
| `ExecutiveLanguageLeakAudit.ts` | 21 | `: any` | `public static audit(target: any, layer: PresentationLayer): ...` | 
| `ExecutiveLanguageLeakAudit.ts` | 63 | `: any` | `const traverse = (obj: any, key?: string) => {` | 
| `RuntimeMemoryTracker.ts` | 10 | `: any` | `static estimatePayloadSize(action: string, payload: any): nu...` | 
| `InstitutionalPrudencyLayer.ts` | 56 | `: any` | `resolveCompositeCap(context: any): number {` | 
| `InstitutionalPrudencyLayer.ts` | 72 | `: any` | `context: any` | 
| `ExecutivePublicationRuntime.ts` | 29 | `: any` | `report: any,` | 
| `ExecutivePublicationRuntime.ts` | 30 | `: any` | `validationResult: any,` | 
| `ExecutivePublicationRuntime.ts` | 31 | `: any` | `advisoryNarrative: any,` | 
| `ExecutivePublicationRuntime.ts` | 41 | `: any` | `Object.values(advisoryNarrative.sections).forEach((sec: any)...` | 
| `RecoveryRegressionTypes.ts` | 27 | `: any` | `recoveryReport?: any;` | 
| `RecoveryRegressionTypes.ts` | 28 | `: any` | `survivalReport?: any;` | 
| `RecoveryRegressionTypes.ts` | 29 | `: any` | `fiduciaryOutput?: any;` | 
| `RecoveryRegressionTypes.ts` | 30 | `: any` | `treasuryRuntime?: any;` | 
| `RecoveryRegressionTypes.ts` | 31 | `: any` | `cashIntelligenceRuntime?: any;` | 
| `RecoveryRegressionTypes.ts` | 32 | `: any` | `patrimonialIntelligenceRuntime?: any;` | 
| `RecoveryRegressionTypes.ts` | 33 | `: any` | `liquidityStressRuntime?: any;` | 
| `RecoveryRegressionTypes.ts` | 34 | `: any` | `longitudinalRuntimeHistory?: any[];` | 
| `RecoveryRegressionTypes.ts` | 35 | `: any` | `operationalContinuityRuntime?: any;` | 
| `RecoveryRegressionTypes.ts` | 36 | `: any` | `governanceTrajectoryRuntime?: any;` | 
| `RecoveryRegressionTypes.ts` | 39 | `: any` | `historicalCycles?: any[];` | 
| `RecoveryRegressionTypes.ts` | 41 | `: any` | `memoryProfile?: any;` | 
| `RecoveryRegressionTypes.ts` | 42 | `: any` | `resilienceReport?: any;` | 
| `ReportingTypes.ts` | 24 | `: any` | `systemicRisks: any[]; // vindo do Advisory` | 
| `ReportingTypes.ts` | 59 | `: any` | `systemicRisks: any[];` | 
| `ScenarioBaselineValidator.ts` | 2 | `: any` | `public static validate(baselineContext: any): {` | 
| `ScenarioImpactRuntime.ts` | 14 | `: any` | `baselineContext: any,` | 
| `ScenarioImpactRuntime.ts` | 80 | `: any` | `private static mapDecisionToMutation(actionId: string): any ...` | 
| `ScenarioSurvivabilityFilter.ts` | 4 | `: any` | `public static validate(baselineContext: any, mutations: Scen...` | 
| `strategic-intelligence-adapter.ts` | 12 | `as any` | `lineageHash: report.runtimeMetadata?.lineageHash || (report ...` | 
| `strategic-intelligence-adapter.ts` | 13 | `as any` | `tenantId: report.institutionalContext?.tenantId || (report a...` | 
| `strategic-intelligence-adapter.ts` | 14 | `as any` | `cycleReference: report.institutionalContext?.currentCycle ||...` | 
| `strategic-intelligence-adapter.ts` | 15 | `as any` | `historicalCyclesCount: report.runtimeMetadata?.historicalCyc...` | 
| `TemporalEvidenceFilter.ts` | 4 | `: any` | `filteredRawData: any;` | 
| `TemporalEvidenceFilter.ts` | 9 | `: any` | `public static filter(rawData: any, analysisYear: number): Fi...` | 
| `TemporalEvidenceFilter.ts` | 36 | `: any` | `const collectYears = (arr: any[]) => {` | 
| `TemporalEvidenceFilter.ts` | 71 | `: any` | `const filterArray = (arr: any[]) => {` | 
| `TemporalEvidenceFilter.ts` | 113 | `: any` | `public static filterByAnalysisYear(cycles: any[], analysisYe...` | 
| `TenancyTypes.ts` | 45 | `: any` | `metadata?: any;` | 
| `TenantAuditLogger.ts` | 14 | `: any` | `metadata?: any` | 
| `TenantGovernanceEnforcer.ts` | 35 | `: any` | `} catch (error: any) {` | 
| `TenantGovernanceEnforcer.ts` | 45 | `: any` | `} catch (error: any) {` | 
| `TreasuryIntelligenceRuntime.ts` | 344 | `: any` | `private static generateLineageHash(inputs: any[]): string {` | 
| `OperationalFrictionAnalyzer.ts` | 3 | `: any` | `static analyze(tenantId: string): any {` | 
| `UXValidationAuditLogger.ts` | 7 | `: any` | `private static logs: any[] = [];` | 
| `MockBoardPackScenarios.ts` | 1 | `: any` | `export const MockBoardPackScenarios: any = {};` | 
| `war-game-adapter.ts` | 14 | `: any` | `rawData: any` | 
| `war-game-adapter.ts` | 27 | `: any` | `const receitaNode = dreData.find((d: any) => d.category?.toU...` | 
| `war-game-adapter.ts` | 30 | `: any` | `const ebitdaNode = dreData.find((d: any) => d.category === '...` | 
| `war-game-adapter.ts` | 33 | `: any` | `const custoNode = dreData.find((d: any) => d.category?.toUpp...` | 
| `war-game-adapter.ts` | 38 | `: any` | `const fcoNode = dfcData.find((d: any) => d.category === 'FCO...` | 

## 🔴 Nível: SAFE (0 itens)
> [!TIP]
> Seguros para migração imediata (ex: catch (err: any) -> catch (err: unknown)).

_Nenhuma ocorrência encontrada._

