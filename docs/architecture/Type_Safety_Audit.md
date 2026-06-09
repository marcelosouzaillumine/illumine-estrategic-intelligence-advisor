# Type Safety Audit Report

**Data:** 2026-06-09T13:41:27.663Z

## Resumo Geral

- **Total de Ocorrências:** 3080
- **CRITICAL:** 1162
- **HIGH:** 98
- **MEDIUM:** 1676
- **LOW:** 144

## Por Tipo

- **any:** 2944
- **tsIgnore:** 8
- **recordStringAny:** 23
- **unknown:** 104
- **tsExpectError:** 1

## Detalhamento CRITICAL e HIGH

### src/context/ConsolidatedExecutiveContext.tsx

- Line 53: `any` (HIGH) -> `} catch (err: any) {`

### src/context/institutional-memory/InstitutionalMemoryProvider.tsx

- Line 33: `any` (HIGH) -> `appendRecord: () => ({} as any),`

### src/context/pilot-operations/PilotOperationsProvider.tsx

- Line 31: `any` (HIGH) -> `adoptionMetrics: any;`
- Line 127: `any` (HIGH) -> `} catch (err: any) {`
- Line 170: `any` (HIGH) -> `} catch (err: any) {`

### src/context/scenario-simulation/ScenarioSimulationProvider.tsx

- Line 185: `any` (HIGH) -> `} catch (err: any) {`
- Line 225: `any` (HIGH) -> `} catch (err: any) {`
- Line 259: `any` (HIGH) -> `} catch (err: any) {`

### src/core/governance/signal-hierarchy/types.ts

- Line 43: `recordStringAny` (CRITICAL) -> `metadata?: Record<string, any>;`

### src/core/runtime/CrossStatementCausalityEngine.ts

- Line 89: `any` (CRITICAL) -> `bpSummary: any,`
- Line 92: `any` (CRITICAL) -> `cashFlowReport: any,`
- Line 93: `any` (CRITICAL) -> `capitalGovernanceReport: any,`
- Line 96: `any` (CRITICAL) -> `const tensions: any[] = [];`

### src/core/runtime/ExecutiveNarrativeOrchestrator.ts

- Line 83: `any` (CRITICAL) -> `report: any,`

### src/core/runtime/ExecutivePriorityConsolidationEngine.ts

- Line 93: `any` (CRITICAL) -> `tensionsInput: any[],`
- Line 94: `any` (CRITICAL) -> `cashFlowReport: any,`
- Line 95: `any` (CRITICAL) -> `capitalGovernanceReport: any,`
- Line 96: `any` (CRITICAL) -> `metrics: any`

### src/core/runtime/InstitutionalFinancialThesisEngine.ts

- Line 95: `any` (CRITICAL) -> `bpSummary: any,`
- Line 98: `any` (CRITICAL) -> `cashFlowReport: any,`
- Line 99: `any` (CRITICAL) -> `capitalGovernanceReport: any,`
- Line 100: `any` (CRITICAL) -> `metrics: any`

### src/core/runtime/KPISemanticIntelligenceEngine.ts

- Line 54: `any` (CRITICAL) -> `public static enrich(kpi: any, segment: string): any {`
- Line 54: `any` (CRITICAL) -> `public static enrich(kpi: any, segment: string): any {`

### src/core/runtime/adapters/causality-interpretation-adapter.ts

- Line 24: `any` (CRITICAL) -> `scores: any,`

### src/core/runtime/advisory-narrative/BoardCommunicationEngine.ts

- Line 10: `any` (CRITICAL) -> `public static generateBoardBriefing(report: any, validationResult: any): string {`
- Line 10: `any` (CRITICAL) -> `public static generateBoardBriefing(report: any, validationResult: any): string {`

### src/core/runtime/advisory-narrative/ConfidenceNarrativeEngine.ts

- Line 13: `any` (CRITICAL) -> `report: any,`

### src/core/runtime/advisory-narrative/ExecutiveNarrativeEngine.ts

- Line 28: `any` (CRITICAL) -> `report: any,`
- Line 29: `any` (CRITICAL) -> `validationResult: any,`
- Line 30: `any` (CRITICAL) -> `comparisonReport: any,`

### src/core/runtime/advisory-narrative/ExecutiveSummaryEngine.ts

- Line 14: `any` (CRITICAL) -> `report: any,`

### src/core/runtime/advisory-narrative/FiduciaryCommunicationEngine.ts

- Line 13: `any` (CRITICAL) -> `report: any,`
- Line 14: `any` (CRITICAL) -> `validationResult: any,`

### src/core/runtime/advisory-narrative/GovernanceNarrativeEngine.ts

- Line 13: `any` (CRITICAL) -> `report: any,`
- Line 14: `any` (CRITICAL) -> `validationResult: any,`

### src/core/runtime/advisory-narrative/ScenarioExplanationEngine.ts

- Line 11: `any` (CRITICAL) -> `candidatePath: any,`
- Line 13: `any` (CRITICAL) -> `conservativePreservation: any;`
- Line 14: `any` (CRITICAL) -> `controlledGrowth: any;`
- Line 15: `any` (CRITICAL) -> `survivalStabilization: any;`

### src/core/runtime/advisory-narrative/TradeoffNarrativeEngine.ts

- Line 11: `any` (CRITICAL) -> `candidatePath: any,`
- Line 13: `any` (CRITICAL) -> `conservativePreservation: any;`
- Line 14: `any` (CRITICAL) -> `controlledGrowth: any;`
- Line 15: `any` (CRITICAL) -> `survivalStabilization: any;`

### src/core/runtime/ai-governance/AIGovernanceTypes.ts

- Line 33: `any` (CRITICAL) -> `payload: any;`
- Line 61: `any` (CRITICAL) -> `metadata?: any;`

### src/core/runtime/ai-governance/AIUsageAuditLogger.ts

- Line 6: `any` (CRITICAL) -> `static logEvent(event: AIUsageAuditRecord['event'], aiTraceId: string, tenantId: string, metadata?: any) {`

### src/core/runtime/ai-governance/InstitutionalCopilotRuntime.ts

- Line 43: `any` (CRITICAL) -> `} catch (e: any) {`

### src/core/runtime/ai-governance/providers/LLMProvider.ts

- Line 2: `any` (CRITICAL) -> `generateResponse(prompt: string, context: any[]): Promise<string>;`

### src/core/runtime/ai-governance/providers/MockLLMProvider.ts

- Line 10: `any` (CRITICAL) -> `async generateResponse(prompt: string, context: any[]): Promise<string> {`

### src/core/runtime/ai-governance/providers/OpenAIProvider.ts

- Line 4: `any` (CRITICAL) -> `async generateResponse(prompt: string, context: any[]): Promise<string> {`

### src/core/runtime/audit-assurance/AuditReconstructionEngine.ts

- Line 11: `any` (CRITICAL) -> `original: any,`
- Line 12: `any` (CRITICAL) -> `reconstructed: any`
- Line 90: `any` (CRITICAL) -> `private lookupValue(obj: any, key: string): any {`
- Line 90: `any` (CRITICAL) -> `private lookupValue(obj: any, key: string): any {`
- Line 116: `any` (CRITICAL) -> `public areSemanticallyEquivalent(a: any, b: any): boolean {`
- Line 116: `any` (CRITICAL) -> `public areSemanticallyEquivalent(a: any, b: any): boolean {`
- Line 133: `any` (CRITICAL) -> `const toBool = (val: any) => {`
- Line 162: `any` (CRITICAL) -> `public normalize(obj: any): any {`
- Line 162: `any` (CRITICAL) -> `public normalize(obj: any): any {`
- Line 175: `any` (CRITICAL) -> `const normObj: any = {};`

### src/core/runtime/audit-assurance/ExecutiveAssuranceRuntime.ts

- Line 59: `any` (CRITICAL) -> `original: any;`
- Line 60: `any` (CRITICAL) -> `reconstructed: any;`

### src/core/runtime/behavioral-intelligence/BehavioralTrajectoryEngine.ts

- Line 28: `any` (CRITICAL) -> `report: any,`

### src/core/runtime/behavioral-intelligence/GovernanceDriftEngine.ts

- Line 15: `any` (CRITICAL) -> `report: any`

### src/core/runtime/behavioral-intelligence/GovernanceFatigueEngine.ts

- Line 14: `any` (CRITICAL) -> `report: any`

### src/core/runtime/behavioral-intelligence/InstitutionalBehaviorProfileEngine.ts

- Line 51: `any` (CRITICAL) -> `public static getDecisionTargetProfile(decision: ExecutiveDecision, report: any): BehaviorProfile {`
- Line 104: `any` (CRITICAL) -> `report: any,`

### src/core/runtime/behavioral-intelligence/InstitutionalBehavioralIntelligenceEngine.ts

- Line 30: `any` (CRITICAL) -> `report: any,`

### src/core/runtime/behavioral-intelligence/LongitudinalPatternEngine.ts

- Line 23: `any` (CRITICAL) -> `report: any,`

### src/core/runtime/benchmarking/BenchmarkAnonymizationEngine.ts

- Line 8: `any` (CRITICAL) -> `static anonymizeProfile(rawTenantData: any): AnonymizedInstitutionalProfile {`

### src/core/runtime/benchmarking/BenchmarkAuditLogger.ts

- Line 2: `any` (CRITICAL) -> `private static logs: any[] = [];`
- Line 21: `any` (CRITICAL) -> `static getLogs(): any[] {`

### src/core/runtime/benchmarking/BenchmarkCohortBuilder.ts

- Line 13: `any` (CRITICAL) -> `rawTenantsInNetwork: any[]`

### src/core/runtime/benchmarking/BenchmarkDatasetBuilder.ts

- Line 6: `any` (CRITICAL) -> `static extractSafeInstitutionalNetworkData(): any[] {`

### src/core/runtime/benchmarking/BenchmarkPrivacyGuard.ts

- Line 27: `any` (CRITICAL) -> `static inspectPayloadForLeakage(payload: any): boolean {`

### src/core/runtime/board-decision/BoardResolutionEngine.ts

- Line 20: `any` (CRITICAL) -> `report?: any`

### src/core/runtime/board-pack/BoardPackPPTXGenerator.ts

- Line 11: `any` (CRITICAL) -> `public static async generatePPTX(pack: BoardPack, saveToFile: boolean = false): Promise<any> {`
- Line 18: `unknown` (CRITICAL) -> `: (pptxgen as unknown as { default: typeof pptxgen }).default;`
- Line 20: `any` (CRITICAL) -> `const pptx: any = new PptxConstructor();`

### src/core/runtime/cache/RuntimeCacheManager.ts

- Line 9: `any` (CRITICAL) -> `private static store = new Map<string, CacheEntry<any>>();`

### src/core/runtime/calibration/CalibrationTypes.ts

- Line 20: `any` (CRITICAL) -> `before: any;`
- Line 21: `any` (CRITICAL) -> `after: any;`

### src/core/runtime/capital-governance/capital-governance-adapter.ts

- Line 124: `any` (CRITICAL) -> `dlpaData: any[],`
- Line 131: `any` (CRITICAL) -> `context?: any,`
- Line 132: `any` (CRITICAL) -> `historicalCyclesRaw?: any[]`
- Line 141: `any` (CRITICAL) -> `preservedCapital: any;`
- Line 142: `any` (CRITICAL) -> `consumedCapital: any;`
- Line 143: `any` (CRITICAL) -> `capitalRecovery?: any;`
- Line 144: `any` (CRITICAL) -> `capitalErosionRisk?: any;`
- Line 145: `any` (CRITICAL) -> `capitalDependency: any;`
- Line 146: `any` (CRITICAL) -> `formationQuality: any;`
- Line 147: `any` (CRITICAL) -> `distributionCapacity: any;`
- Line 148: `any` (CRITICAL) -> `retention: any;`
- Line 149: `any` (CRITICAL) -> `governanceInterpretation: any;`
- Line 150: `any` (CRITICAL) -> `boardDecisionSupport: any;`
- Line 151: `any` (CRITICAL) -> `boardAdvisory: any;`
- Line 152: `any` (CRITICAL) -> `capitalPreservationStatus?: any;`
- Line 153: `any` (CRITICAL) -> `shareholderDependencyNarrative?: any;`
- Line 154: `any` (CRITICAL) -> `capitalRecoveryRequirement?: any;`
- Line 155: `any` (CRITICAL) -> `patrimonialRecoveryHorizon?: any;`
- Line 156: `any` (CRITICAL) -> `capitalRecoverability?: any;`
- Line 157: `any` (CRITICAL) -> `capitalPreservationScore?: any;`
- Line 160: `any` (CRITICAL) -> `temporalAudit?: any;`
- Line 181: `any` (CRITICAL) -> `consistencyAudit?: any;`
- Line 182: `any` (CRITICAL) -> `patrimonialRecoveryHorizon?: any;`
- Line 183: `any` (CRITICAL) -> `capitalRecoverability?: any;`
- Line 184: `any` (CRITICAL) -> `capitalPreservationScore?: any;`
- Line 259: `any` (CRITICAL) -> `const capSocialEntry = dlpaData.find((e: any) => {`
- Line 317: `any` (CRITICAL) -> `const bpEntries = cleanHistoricalCyclesRaw.filter((d: any) =>`
- Line 321: `any` (CRITICAL) -> `const matchedBPEntry = bpEntries.find((e: any) => {`
- Line 337: `any` (CRITICAL) -> `const bpEntriesForLp = (cleanHistoricalCyclesRaw || []).filter((d: any) =>`
- Line 345: `any` (CRITICAL) -> `const lpEntry = bpEntriesForLp.find((e: any) => {`
- Line 359: `any` (CRITICAL) -> `const lucrosPrejuizosEntry = cleanDlpaData.find((e: any) => {`
- Line 440: `any` (CRITICAL) -> `retentionStatus: fidOutput.retentionClassification as any,`
- Line 453: `any` (CRITICAL) -> `preservationStatus: fidOutput.patrimonialIntegrityStatus as any,`
- Line 584: `any` (CRITICAL) -> `let resolvedCapitalStatus = runtimeContext?.lifecycleProfile?.capitalStatus?.semanticLabel || (fidOutput.patrimonialIntegrityStatus as any);`
- Line 650: `any` (CRITICAL) -> `delete (reportWithExecutiveStory as any).legacyRecoveryYears;`
- Line 651: `any` (CRITICAL) -> `delete (reportWithExecutiveStory as any).legacyRecoveryClassification;`
- Line 652: `any` (CRITICAL) -> `delete (reportWithExecutiveStory as any).legacyCpsScore;`
- Line 803: `any` (CRITICAL) -> `private static parseHistoricalCycles(rawHistory?: any[]): HistoricalCycleMetrics[] {`
- Line 815: `any` (CRITICAL) -> `rawHistory.forEach((entry: any) => {`
- Line 869: `any` (CRITICAL) -> `return rawHistory.map((h: any) => {`

### src/core/runtime/capital-governance/capital-governance-types.ts

- Line 100: `any` (CRITICAL) -> `executiveLayer?: any;`

### src/core/runtime/cash-causal-intelligence/DFCCausalDriverPresentationAudit.ts

- Line 16: `unknown` (CRITICAL) -> `const isValidNumber = (value: unknown): value is number =>`
- Line 19: `unknown` (CRITICAL) -> `const isStrValid = (val: unknown): val is string =>`
- Line 23: `any` (CRITICAL) -> `public static audit(rawDrivers: any[]): AuditResult {`

### src/core/runtime/cash-intelligence/CashFlowReconciliationEngine.ts

- Line 8: `any` (CRITICAL) -> `dfcData: any[],`

### src/core/runtime/cash-intelligence/CashIntelligenceTypes.ts

- Line 241: `any` (CRITICAL) -> `dfcExecutiveSnapshot?: any;`
- Line 242: `any` (CRITICAL) -> `cqsExplainability?: any;`
- Line 243: `any` (CRITICAL) -> `compressedAdvisory?: any;`
- Line 244: `any` (CRITICAL) -> `consistencyAudit?: any;`
- Line 245: `any` (CRITICAL) -> `dfcPriorities?: any;`
- Line 258: `any` (CRITICAL) -> `earningsQuality?: any;`
- Line 259: `any` (CRITICAL) -> `cashQuality?: any;`

### src/core/runtime/cash-intelligence/CashQualityExplainabilityEngine.ts

- Line 15: `any` (CRITICAL) -> `public static explain(cqs: any): CQSExplanation {`

### src/core/runtime/cash-intelligence/DFCExecutiveBindingAudit.ts

- Line 8: `any` (CRITICAL) -> `public static audit(output: any): {`

### src/core/runtime/cash-intelligence/FiduciaryCashIntelligenceRuntime.ts

- Line 43: `any` (CRITICAL) -> `dfcData: any[],`
- Line 108: `unknown` (CRITICAL) -> `universalIndicators: {} as unknown as UniversalCashIndicators, // Not computed`
- Line 401: `any` (CRITICAL) -> `private static generateLineageHash(inputs: any[]): string {`

### src/core/runtime/cash-intelligence/InstitutionalCashSustainabilityEngine.ts

- Line 16: `any` (CRITICAL) -> `dfcData: any[],`

### src/core/runtime/cash-intelligence/LongitudinalCashIntelligenceEngine.spec.ts

- Line 26: `any` (CRITICAL) -> `classification: classification as any,`

### src/core/runtime/cash-intelligence/LongitudinalCashIntelligenceEngine.test.ts

- Line 7: `any` (CRITICAL) -> `function createMockCycle(overrides: any = {}): CashIntelligenceRuntimeOutput {`

### src/core/runtime/cashflow/CashFlowOperationalEngine.ts

- Line 4: `any` (CRITICAL) -> `export function calculateOperationalMetrics(dfcData: any): CashFlowOperationalMetrics | null {`

### src/core/runtime/cashflow/cashflow-adapter.ts

- Line 12: `any` (CRITICAL) -> `dfcData: any[],`

### src/core/runtime/cashflow/cashflow-types.ts

- Line 62: `any` (CRITICAL) -> `operational: any;`
- Line 63: `any` (CRITICAL) -> `conversion: any;`
- Line 64: `any` (CRITICAL) -> `treasury: any;`
- Line 65: `any` (CRITICAL) -> `sustainability: any;`
- Line 66: `any` (CRITICAL) -> `funding: any;`

### src/core/runtime/causal-intelligence/InstitutionalCausalIntelligenceRuntime.ts

- Line 24: `any` (CRITICAL) -> `allHistData: any[],`
- Line 30: `any` (CRITICAL) -> `const yearsAvailable = [...new Set(allHistData.map((d: any) => Number(d.year)))];`
- Line 34: `any` (CRITICAL) -> `const isDfcAvailable = allHistData.some((d: any) =>`

### src/core/runtime/causal-intelligence/LiquidityRootCauseEngine.ts

- Line 20: `any` (CRITICAL) -> `allHistData: any[],`

### src/core/runtime/causal-intelligence/StructuralDeteriorationMapper.ts

- Line 22: `any` (CRITICAL) -> `private static getVal(allHistData: any[], year: number, docType: string, keywords: string[]): number {`
- Line 23: `any` (CRITICAL) -> `const entries = allHistData.filter((d: any) => {`
- Line 29: `any` (CRITICAL) -> `const match = entries.find((d: any) => {`
- Line 38: `any` (CRITICAL) -> `allHistData: any[],`
- Line 44: `any` (CRITICAL) -> `const yearsAvailable = [...new Set(allHistData.map((d: any) => Number(d.year)))];`

### src/core/runtime/compliance/FiduciaryContracts.ts

- Line 12: `any` (CRITICAL) -> `validateFiduciarySafety(report: any): { isSafe: boolean; violations: RuntimeLabel[] };`
- Line 19: `any` (CRITICAL) -> `validateMathSanity(metrics: any): { isValid: boolean; errors: RuntimeLabel[] };`
- Line 26: `any` (CRITICAL) -> `validateSemanticSobriety(report: any): { isValid: boolean; warnings: RuntimeLabel[]; forbiddenTermsFound: RuntimeLabel[] };`
- Line 33: `any` (CRITICAL) -> `verifyLineage(report: any): { isComplete: boolean; lineageHash?: string; missingFields: RuntimeLabel[] };`
- Line 40: `any` (CRITICAL) -> `propagateConfidence(report: any): { confidenceLevel: 'HIGH_CONFIDENCE' | 'MEDIUM_CONFIDENCE' | 'LOW_CONFIDENCE'; factors: RuntimeLabel[] };`
- Line 47: `any` (CRITICAL) -> `applyFailClosed(report: any, reason: string): any;`
- Line 47: `any` (CRITICAL) -> `applyFailClosed(report: any, reason: string): any;`
- Line 54: `any` (CRITICAL) -> `generateAuditTrail(report: any): any;`
- Line 54: `any` (CRITICAL) -> `generateAuditTrail(report: any): any;`

### src/core/runtime/compliance/InstitutionalIntegrityEngine.ts

- Line 61: `unknown` (CRITICAL) -> `trend: integrityScore >= 80 ? 'Estável' : 'Atenção' as unknown as "Estável" | "Deteriorando" | "Melhorando", // tipagem mockada para trend`

### src/core/runtime/compliance/RuntimeComplianceEngine.ts

- Line 87: `any` (CRITICAL) -> `public static validateBoardPack(boardPack: any): void {`
- Line 102: `any` (CRITICAL) -> `public static validate(report: any, mode: ComplianceMode): ComplianceValidationResult {`
- Line 197: `any` (CRITICAL) -> `report: any,`
- Line 199: `any` (CRITICAL) -> `mathCheck: any,`
- Line 200: `any` (CRITICAL) -> `semanticCheck: any,`
- Line 201: `any` (CRITICAL) -> `lineageCheck: any,`
- Line 202: `any` (CRITICAL) -> `confCheck: any`
- Line 257: `any` (CRITICAL) -> `public validateFiduciarySafety(report: any): { isSafe: boolean; violations: RuntimeLabel[] } {`
- Line 288: `any` (CRITICAL) -> `public validateMathSanity(metrics: any): { isValid: boolean; errors: RuntimeLabel[] } {`
- Line 292: `any` (CRITICAL) -> `const scanNumbers = (obj: any, path = '') => {`
- Line 349: `any` (CRITICAL) -> `public validateSemanticSobriety(report: any): { isValid: boolean; warnings: RuntimeLabel[]; forbiddenTermsFound: RuntimeLabel[] } {`
- Line 358: `any` (CRITICAL) -> `const scanText = (obj: any, path = '') => {`
- Line 406: `any` (CRITICAL) -> `public verifyLineage(report: any): { isComplete: boolean; lineageHash?: string; missingFields: RuntimeLabel[] } {`
- Line 432: `any` (CRITICAL) -> `public propagateConfidence(report: any): { confidenceLevel: 'HIGH_CONFIDENCE' | 'MEDIUM_CONFIDENCE' | 'LOW_CONFIDENCE'; factors: RuntimeLabel[] } {`
- Line 471: `any` (CRITICAL) -> `public checkPayloadIntegrity(report: any): string[] {`
- Line 514: `any` (CRITICAL) -> `public applyFailClosed(report: any, reason: string): any {`
- Line 514: `any` (CRITICAL) -> `public applyFailClosed(report: any, reason: string): any {`
- Line 552: `any` (CRITICAL) -> `public generateAuditTrail(report: any) {`

### src/core/runtime/config/RuntimeEnvironmentConfig.ts

- Line 16: `unknown` (CRITICAL) -> `const globalEnv = globalThis as unknown as Record<string, unknown>;`

### src/core/runtime/consolidated/ConsolidatedRuntimeOrchestrator.ts

- Line 38: `any` (CRITICAL) -> `public runConsolidatedAnalysis(input: any): ExecutiveIntelligenceReport {`
- Line 59: `unknown` (CRITICAL) -> `return this.legacyRuntime.generateExecutiveReport(input as unknown as Record<string, unknown>);`
- Line 62: `unknown` (CRITICAL) -> `const typedInput = input as unknown as ConsolidatedOrchestratorInput;`
- Line 67: `unknown` (CRITICAL) -> `typedInput.entities as unknown as never[], // Assuming TenantGovernanceEnforcer expects EntityGraphNode[]`

### src/core/runtime/consolidated/EliminationEngine.ts

- Line 47: `unknown` (CRITICAL) -> `type: op.type as unknown as "MUTUO" | "RECEITA_DESPESA" | "DIVIDENDO" | "INVESTIMENTO",`

### src/core/runtime/consolidated/IntercompanyEliminationEngine.ts

- Line 8: `any` (CRITICAL) -> `eliminatedEntries: any[];`
- Line 9: `any` (CRITICAL) -> `unreconciledIntercompany: any[];`
- Line 10: `any` (CRITICAL) -> `eliminationWarnings: any[];`
- Line 11: `any` (CRITICAL) -> `consolidationAdjustments: any[];`

### src/core/runtime/consolidated/consolidated-types.ts

- Line 83: `any` (CRITICAL) -> `rawData: any;`

### src/core/runtime/consolidated/data/ConsolidatedEntityRepository.ts

- Line 23: `any` (CRITICAL) -> `} catch (err: any) {`
- Line 43: `any` (CRITICAL) -> `} catch (err: any) {`

### src/core/runtime/consolidated/data/ConsolidatedGroupRepository.ts

- Line 20: `any` (CRITICAL) -> `const entities: ConsolidationEntity[] = (data.entities || []).map((e: any) => ({`
- Line 32: `any` (CRITICAL) -> `} catch (err: any) {`

### src/core/runtime/consolidated/data/GroupEntityMappingRepository.ts

- Line 24: `any` (CRITICAL) -> `} catch (err: any) {`
- Line 42: `any` (CRITICAL) -> `} catch (err: any) {`
- Line 51: `any` (CRITICAL) -> `} catch (err: any) {`

### src/core/runtime/consolidated/data/GroupOnboardingRepository.ts

- Line 23: `any` (CRITICAL) -> `} catch (err: any) {`
- Line 47: `any` (CRITICAL) -> `} catch (err: any) {`

### src/core/runtime/consolidated/data/IntercompanyRelationRepository.ts

- Line 25: `any` (CRITICAL) -> `} catch (err: any) {`
- Line 41: `any` (CRITICAL) -> `} catch (err: any) {`
- Line 50: `any` (CRITICAL) -> `} catch (err: any) {`

### src/core/runtime/consolidated/data/IntercompanyRelationsLoader.ts

- Line 21: `any` (CRITICAL) -> `} catch (err: any) {`

### src/core/runtime/consolidated/data/dataTypes.ts

- Line 10: `any` (CRITICAL) -> `intercompanyRelations: any[];`
- Line 11: `any` (CRITICAL) -> `ownershipStructure: any[];`

### src/core/runtime/consolidated/types.ts

- Line 87: `any` (CRITICAL) -> `auditTrail: { timestamp: string; action: string; [key: string]: any }[];`

### src/core/runtime/constitutional-governance/ConstitutionalAxiomDisclosureEngine.ts

- Line 4: `any` (CRITICAL) -> `public static extractAxioms(runtimeOutput: any): ConstitutionalAxiomStatus[] {`

### src/core/runtime/constitutional-governance/ConstitutionalConfidenceDisclosureEngine.ts

- Line 4: `any` (CRITICAL) -> `public static extractConfidence(runtimeOutput: any): ConfidenceBreakdown {`

### src/core/runtime/constitutional-governance/ConstitutionalEnforcementDisclosureEngine.ts

- Line 4: `any` (CRITICAL) -> `public static extractEnforcementActions(runtimeOutput: any): ConstitutionalEnforcementAction[] {`

### src/core/runtime/constitutional-governance/ConstitutionalGovernanceDashboardEngine.ts

- Line 14: `any` (CRITICAL) -> `public static generate(runtimeOutput: any): ConstitutionalGovernanceDashboardOutput {`

### src/core/runtime/constitutional-governance/ConstitutionalGovernanceRuntime.ts

- Line 26: `any` (CRITICAL) -> `public static evaluate(context: any): ConstitutionalComplianceReport {`
- Line 29: `recordStringAny` (CRITICAL) -> `const results: Record<string, any> = {};`
- Line 70: `any` (CRITICAL) -> `protocols: results as any,`

### src/core/runtime/constitutional-governance/ConstitutionalLineageDisclosureEngine.ts

- Line 4: `any` (CRITICAL) -> `public static extractLineage(runtimeOutput: any): ConstitutionalLineageInformation {`

### src/core/runtime/constitutional-governance/ConstitutionalProtocolDefinition.ts

- Line 4: `any` (CRITICAL) -> `payload?: any;`
- Line 12: `any` (CRITICAL) -> `validate(context: any): ValidationResult;`

### src/core/runtime/constitutional-governance/ConstitutionalRestrictionDisclosureEngine.ts

- Line 4: `any` (CRITICAL) -> `public static extractRestrictions(runtimeOutput: any): ConstitutionalRestriction[] {`
- Line 8: `any` (CRITICAL) -> `canonicalRestr.forEach((r: any) => {`

### src/core/runtime/constitutional-governance/ExecutiveConstitutionalRuntime.ts

- Line 242: `any` (CRITICAL) -> `} catch (err: any) {`

### src/core/runtime/constitutional-governance/FiduciaryAxiomEngine.ts

- Line 121: `any` (CRITICAL) -> `public evaluateReportAxioms(report: any): { isViolated: boolean; violations: string[] } {`

### src/core/runtime/constitutional-governance/protocols/AIConstitutionProtocol.ts

- Line 9: `any` (CRITICAL) -> `public validate(context: any): ValidationResult {`

### src/core/runtime/constitutional-governance/protocols/CausalConstitutionProtocol.ts

- Line 9: `any` (CRITICAL) -> `public validate(context: any): ValidationResult {`

### src/core/runtime/constitutional-governance/protocols/ExecutiveDecisionConstitutionProtocol.ts

- Line 13: `any` (CRITICAL) -> `public validate(context: { cglContext: any, decisions: ExecutiveDecisionObject[] }): ValidationResult {`

### src/core/runtime/constitutional-governance/protocols/FiduciaryConstitutionProtocol.ts

- Line 9: `any` (CRITICAL) -> `public validate(context: any): ValidationResult {`

### src/core/runtime/constitutional-governance/protocols/LineageConstitutionProtocol.ts

- Line 9: `any` (CRITICAL) -> `public validate(context: any): ValidationResult {`

### src/core/runtime/constitutional-governance/protocols/ScenarioConstitutionProtocol.ts

- Line 10: `any` (CRITICAL) -> `public validate(context: { baselineContext: any, scenarioContext: any }): ValidationResult {`
- Line 10: `any` (CRITICAL) -> `public validate(context: { baselineContext: any, scenarioContext: any }): ValidationResult {`

### src/core/runtime/constitutional-governance/protocols/ScenarioSimulationConstitutionProtocol.ts

- Line 13: `any` (CRITICAL) -> `public validate(context: { baselineContext: any, scenario: InstitutionalScenario, determinismHash1: string, determinismHash2: string }): ValidationResult {`

### src/core/runtime/constitutional-governance/protocols/SemanticConstitutionProtocol.ts

- Line 10: `any` (CRITICAL) -> `public validate(context: any): ValidationResult {`

### src/core/runtime/constitutional-governance/protocols/TreasuryConstitutionProtocol.ts

- Line 9: `any` (CRITICAL) -> `public validate(context: any): ValidationResult {`

### src/core/runtime/decision-intelligence/ConstitutionalDecisionRuntime.ts

- Line 12: `any` (CRITICAL) -> `context: any`

### src/core/runtime/decision-intelligence/DecisionComplianceEngine.ts

- Line 16: `any` (CRITICAL) -> `report: any,`

### src/core/runtime/decision-intelligence/DecisionPrioritizationEngine.ts

- Line 2: `any` (CRITICAL) -> `public static evaluatePriority(context: any): 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' {`

### src/core/runtime/decision-intelligence/DecisionToCashCausalityEngine.test.ts

- Line 32: `any` (CRITICAL) -> `cashCycles: [{ isAvailable: true } as any],`
- Line 33: `any` (CRITICAL) -> `longitudinalCash: { trajectoryClassification: 'STABLE_SUSTAINABILITY' } as any,`
- Line 34: `any` (CRITICAL) -> `fiduciaryTimeline: { timelineIntegrityStatus: isBroken ? 'BROKEN' : 'VERIFIED' } as any,`

### src/core/runtime/decision-intelligence/DecisionToCashCausalityTypes.ts

- Line 51: `any` (CRITICAL) -> `financialContext: any; // Simplified placeholder for FinancialRuntimeContext`

### src/core/runtime/decision-intelligence/EarlyWarningEngine.test.ts

- Line 6: `any` (CRITICAL) -> `function mockInput(overrides: any = {}): EarlyWarningIntelligenceInput {`
- Line 17: `any` (CRITICAL) -> `{ fcoResult: 'CASH_GENERATION' } as any,`
- Line 18: `any` (CRITICAL) -> `{ fcoResult: 'CASH_GENERATION' } as any,`
- Line 19: `any` (CRITICAL) -> `{ fcoResult: 'CASH_GENERATION' } as any`

### src/core/runtime/decision-intelligence/EarlyWarningTypes.ts

- Line 36: `any` (CRITICAL) -> `financialContext?: any;`

### src/core/runtime/decision-intelligence/ExecutiveAccountabilityEngine.test.ts

- Line 6: `any` (CRITICAL) -> `function mockInput(overrides: any = {}): ExecutiveAccountabilityInput {`

### src/core/runtime/decision-intelligence/ExecutiveAccountabilityTypes.ts

- Line 28: `any` (CRITICAL) -> `executiveIntelligenceReport?: any;`
- Line 30: `any` (CRITICAL) -> `financialContext?: any;`

### src/core/runtime/decision-intelligence/ExecutiveActionMatrixEngine.ts

- Line 4: `any` (CRITICAL) -> `public static mapActions(context: any): string[] {`

### src/core/runtime/decision-intelligence/ExecutivePriorityResolver.ts

- Line 12: `any` (CRITICAL) -> `public static resolve(report: any): ExecutivePriority[] {`
- Line 97: `any` (CRITICAL) -> `const currentLiquidity = kpis.find((k: any) => k.name === 'Liquidez Corrente')?.val ?? 1.0;`

### src/core/runtime/decision-intelligence/GovernanceDriftDetectionEngine.test.ts

- Line 6: `any` (CRITICAL) -> `function mockInput(executiveNarrative: string, overrides: any = {}): GovernanceDriftDetectionInput {`
- Line 52: `any` (CRITICAL) -> `} as any`

### src/core/runtime/decision-intelligence/GovernanceDriftTypes.ts

- Line 23: `any` (CRITICAL) -> `executiveIntelligenceReport?: any; // Representação simplificada para o teste de escopo`
- Line 29: `any` (CRITICAL) -> `financialContext?: any;`

### src/core/runtime/decision-intelligence/InstitutionalBehavioralPatternsEngine.test.ts

- Line 6: `any` (CRITICAL) -> `function mockInput(overrides: any = {}): InstitutionalBehavioralPatternsInput {`

### src/core/runtime/decision-intelligence/InstitutionalBehavioralTypes.ts

- Line 36: `any` (CRITICAL) -> `financialContext?: any;`

### src/core/runtime/decision-intelligence/InstitutionalDecisionIntelligenceEngine.ts

- Line 31: `any` (CRITICAL) -> `report: any`
- Line 72: `any` (CRITICAL) -> `let behavioralResult: any = null;`
- Line 73: `any` (CRITICAL) -> `let predictiveResult: any = null;`

### src/core/runtime/decision-intelligence/InstitutionalDecisionLedger.ts

- Line 31: `unknown` (CRITICAL) -> `role: decision.approverRole as unknown as "SYSTEM" | "UNAUTHENTICATED",`

### src/core/runtime/decision-intelligence/InstitutionalRiskMatrixEngine.ts

- Line 2: `any` (CRITICAL) -> `public static evaluateRisk(context: any): {`

### src/core/runtime/decision-intelligence/InstitutionalStabilityEngine.test.ts

- Line 6: `any` (CRITICAL) -> `function mockInput(overrides: any = {}): InstitutionalStabilityInput {`

### src/core/runtime/decision-intelligence/InstitutionalStabilityTypes.ts

- Line 46: `any` (CRITICAL) -> `financialContext?: any;`

### src/core/runtime/decision-intelligence/InstitutionalSurvivabilityEngine.ts

- Line 13: `any` (CRITICAL) -> `public static calculate(report: any, policyContext?: PolicyContext): SurvivabilityScores {`

### src/core/runtime/decision-intelligence/StrategicStressEngine.ts

- Line 14: `any` (CRITICAL) -> `report: any`

### src/core/runtime/decision-intelligence/decision-types.ts

- Line 80: `any` (CRITICAL) -> `predictiveAssessment?: any;`

### src/core/runtime/decision-policy/DecisionPolicyEngine.ts

- Line 20: `any` (CRITICAL) -> `report: any`

### src/core/runtime/decision-policy/InstitutionalMaterialityEngine.ts

- Line 13: `any` (CRITICAL) -> `public static calculateMaterialityBase(report: any): number {`
- Line 31: `any` (CRITICAL) -> `report: any`

### src/core/runtime/decision-policy/SectorGovernanceProfileEngine.ts

- Line 11: `any` (CRITICAL) -> `public static analyzeSector(report: any): {`

### src/core/runtime/decision-policy/StrategicPostureEngine.ts

- Line 11: `any` (CRITICAL) -> `public static analyzePosture(report: any): {`

### src/core/runtime/deployment-readiness/EnvironmentIntegrityValidationEngine.ts

- Line 31: `unknown` (CRITICAL) -> `const reportExt = executiveReport as unknown as { metadata?: { lineageHash?: string }, failClosedTriggered?: boolean };`

### src/core/runtime/deployment-readiness/FiduciaryReadinessAssessmentEngine.ts

- Line 36: `unknown` (CRITICAL) -> `(executiveReport.institutionalView as unknown as Record<string, unknown>)?.isFailClosedActivated === true;`

### src/core/runtime/deployment-readiness/InstitutionalDeploymentReadinessEngine.ts

- Line 102: `unknown` (CRITICAL) -> `lineageHash: input.lineageHash as unknown as import('../shared/lineage-types').LineageHash,`

### src/core/runtime/deployment-readiness/InstitutionalReadinessOrchestrator.ts

- Line 60: `unknown` (CRITICAL) -> `const historicalCyclesCount = (executiveReport as unknown as { historicalCyclesCount?: number }).historicalCyclesCount ?? 1;`

### src/core/runtime/deployment-readiness/RuntimeOperationalAssuranceEngine.ts

- Line 34: `unknown` (CRITICAL) -> `if ((executiveReport.regressionReport as unknown as { activeRecoveryStage?: string }).activeRecoveryStage === 'COLLAPSE') {`

### src/core/runtime/distributed/AsyncJobQueue.ts

- Line 35: `any` (CRITICAL) -> `entityScope?: any;`
- Line 38: `any` (CRITICAL) -> `payload?: any;`
- Line 135: `any` (CRITICAL) -> `payload: any,`

### src/core/runtime/distributed/WorkerRegistry.ts

- Line 17: `any` (CRITICAL) -> `export type JobExecutor = (job: AsyncJob) => Promise<any>;`
- Line 120: `any` (CRITICAL) -> `} catch (execErr: any) {`

### src/core/runtime/dre/DREExecutiveBindingAudit.ts

- Line 2: `any` (CRITICAL) -> `public static audit(metrics: any) {`

### src/core/runtime/dre/DREExecutiveDataMapper.ts

- Line 26: `any` (CRITICAL) -> `private static findValue(payload: any, aliases: string[]): NormalizedDREValue {`
- Line 44: `any` (CRITICAL) -> `public static map(payload: any) {`

### src/core/runtime/enterprise-validation/RealDatasetProfiler.ts

- Line 3: `any` (CRITICAL) -> `static profile(tenantId: string, datasetId: string): any {`

### src/core/runtime/evidence-ingestion/InstitutionalEvidenceTypes.ts

- Line 29: `any` (CRITICAL) -> `rawContentReference?: any; // Pointer to the parsed array/object`

### src/core/runtime/executive/types.ts

- Line 130: `any` (CRITICAL) -> `static hash(payload: any): string {`

### src/core/runtime/executive-command/ExecutiveCommandMemoryEngine.ts

- Line 14: `any` (CRITICAL) -> `): any {`

### src/core/runtime/executive-command/InstitutionalExecutiveCommandRuntime.ts

- Line 51: `unknown` (CRITICAL) -> `} as unknown as InstitutionalExecutiveCommandOutput;`

### src/core/runtime/executive-command/command-adapter.ts

- Line 26: `any` (CRITICAL) -> `const survivalReport = (report as any).survivalReport || {};`
- Line 31: `any` (CRITICAL) -> `const capitalGov = report.capitalGovernanceReport?.fiduciaryOutput || (report as any).fiduciaryOutput || {};`
- Line 36: `any` (CRITICAL) -> `const operatingPressureSeverity = (pressure as any).overallPressureLevel || 'STABLE';`
- Line 45: `any` (CRITICAL) -> `const metadata = (report as any).metadata || {};`

### src/core/runtime/executive-consolidation/EFOSPresentationLeakGuard.ts

- Line 16: `unknown` (CRITICAL) -> `(typeof import.meta !== 'undefined' && (import.meta as unknown as { env?: { PROD?: boolean } }).env && (import.meta as unknown as { env?: { PROD?: boolean } }).env?.PROD);`
- Line 16: `unknown` (CRITICAL) -> `(typeof import.meta !== 'undefined' && (import.meta as unknown as { env?: { PROD?: boolean } }).env && (import.meta as unknown as { env?: { PROD?: boolean } }).env?.PROD);`

### src/core/runtime/executive-consolidation/ExecutiveSemanticAudit.ts

- Line 9: `any` (CRITICAL) -> `export function audit(payload: any, profile?: string): { pass: boolean; violations: string[] } {`
- Line 13: `any` (CRITICAL) -> `const check = (obj: any) => {`

### src/core/runtime/executive-consolidation/ExecutiveSemanticBoundaryGuard.ts

- Line 9: `any` (CRITICAL) -> `export function sanitize(payload: any, profile?: string): any {`
- Line 9: `any` (CRITICAL) -> `export function sanitize(payload: any, profile?: string): any {`
- Line 24: `any` (CRITICAL) -> `const sanitized: any = {};`
- Line 38: `any` (CRITICAL) -> `export function translate(payload: any, profile?: string): any {`
- Line 38: `any` (CRITICAL) -> `export function translate(payload: any, profile?: string): any {`
- Line 47: `any` (CRITICAL) -> `const translated: any = {};`
- Line 58: `any` (CRITICAL) -> `export function validate(payload: any, profile?: string): void {`
- Line 69: `any` (CRITICAL) -> `const check = (obj: any) => {`
- Line 94: `any` (CRITICAL) -> `const check = (obj: any) => {`

### src/core/runtime/executive-consolidation/ProductionVisibilityPolicy.ts

- Line 21: `any` (CRITICAL) -> `export function isDebugAllowed(profile: any, showDebugTools: boolean = false): boolean {`

### src/core/runtime/executive-intelligence-runtime.ts

- Line 244: `any` (CRITICAL) -> `actionMatrix: any[];`
- Line 246: `any` (CRITICAL) -> `fiduciaryEnforcement?: any;`
- Line 258: `any` (CRITICAL) -> `propagationChains?: any[];`
- Line 259: `any` (CRITICAL) -> `fiduciaryRationale?: any;`
- Line 260: `any` (CRITICAL) -> `fiduciaryEnforcement?: any;`
- Line 264: `any` (CRITICAL) -> `normalizedDRE?: any;`
- Line 265: `any` (CRITICAL) -> `revenueEconomicStructure?: any;`
- Line 266: `any` (CRITICAL) -> `economicBurnRate?: any;`
- Line 267: `any` (CRITICAL) -> `breakEvenAnalysis?: any;`
- Line 268: `any` (CRITICAL) -> `operationalAbsorption?: any;`
- Line 269: `any` (CRITICAL) -> `economicDiagnosis?: any;`
- Line 270: `any` (CRITICAL) -> `dreExecutiveAdvisory?: any;`
- Line 271: `any` (CRITICAL) -> `dreBoardDecisionSupport?: any;`
- Line 272: `any` (CRITICAL) -> `bindingAudit?: any;`
- Line 273: `any` (CRITICAL) -> `[key: string]: any;`
- Line 303: `any` (CRITICAL) -> `chartData: any[];`
- Line 312: `any` (CRITICAL) -> `fiduciaryEnforcement?: any;`
- Line 316: `any` (CRITICAL) -> `scenarioProjections?: any;`
- Line 326: `any` (CRITICAL) -> `institutionalCausality?: any;`
- Line 337: `any` (CRITICAL) -> `patrimonialIntelligenceReport?: any;`
- Line 360: `any` (CRITICAL) -> `inferences?: Record<string, { metrics: any; narrative?: any; confidence?: string; score?: number }>;`
- Line 360: `any` (CRITICAL) -> `inferences?: Record<string, { metrics: any; narrative?: any; confidence?: string; score?: number }>;`
- Line 362: `any` (CRITICAL) -> `temporalAudit?: any;`
- Line 364: `any` (CRITICAL) -> `featureFlags?: any;`
- Line 377: `any` (CRITICAL) -> `public validateFiduciarySafety(report: any) {`
- Line 380: `any` (CRITICAL) -> `public validateMathSanity(metrics: any) {`
- Line 383: `any` (CRITICAL) -> `public validateSemanticSobriety(report: any) {`
- Line 386: `any` (CRITICAL) -> `public verifyLineage(report: any) {`
- Line 389: `any` (CRITICAL) -> `public propagateConfidence(report: any) {`
- Line 392: `any` (CRITICAL) -> `public applyFailClosed(report: any, reason: string) {`
- Line 395: `any` (CRITICAL) -> `public generateAuditTrail(report: any) {`
- Line 403: `any` (CRITICAL) -> `public generateExecutiveReport(rawData: any, externalMetadata?: any): ExecutiveIntelligenceReport {`
- Line 403: `any` (CRITICAL) -> `public generateExecutiveReport(rawData: any, externalMetadata?: any): ExecutiveIntelligenceReport {`
- Line 412: `any` (CRITICAL) -> `let tempValidation: any = null;`
- Line 584: `any` (CRITICAL) -> `let bpSummary: any = rawData.rawFinancialData?.bpSummary || rawData.bpSummary || {};`
- Line 603: `any` (CRITICAL) -> `const cleanHierarchySummary: any = {};`
- Line 625: `any` (CRITICAL) -> `: (hasDRE ? (rawData.dreData.find((r: any) => r.category === 'EBITDA' || r.id === 'EBITDA')?.value || 0) : 0);`
- Line 628: `any` (CRITICAL) -> `: (hasDRE ? (rawData.dreData.find((r: any) => r.category === 'LUCRO LÍQUIDO DO EXERCÍCIO' || r.id === 'LUCRO_LIQ')?.value || 0) : 0);`
- Line 641: `any` (CRITICAL) -> `const calcScores = (bp: any, ebitda: number, lucroLiq: number) => {`
- Line 724: `any` (CRITICAL) -> `let finalWeights: any = baseWeights;`
- Line 726: `unknown` (CRITICAL) -> `const recalibrated = LongitudinalIntelligenceGuard.recalibrateWeights(baseWeights as unknown as Record<string, number>);`
- Line 906: `any` (CRITICAL) -> `insights: rawCausality.insights?.map((ins: any) => ({`
- Line 936: `unknown` (CRITICAL) -> `const bp = bpSummary || {} as unknown;`
- Line 1021: `any` (CRITICAL) -> `const isOfficialDfcAvailable = allHistData.some((d: any) => {`
- Line 1054: `any` (CRITICAL) -> `const yearEntries = dreRawData.filter((d: any) => {`
- Line 1060: `any` (CRITICAL) -> `.sort((a: any, b: any) => (a.ordem || 0) - (b.ordem || 0))`
- Line 1060: `any` (CRITICAL) -> `.sort((a: any, b: any) => (a.ordem || 0) - (b.ordem || 0))`
- Line 1061: `any` (CRITICAL) -> `.map((d: any) => {`
- Line 1099: `any` (CRITICAL) -> `...DRE_OFFICIAL_STRUCTURE.map((account: any) => ({ ...account, value: 0 })),`
- Line 1106: `any` (CRITICAL) -> `const row = cascadeResult.find((r: any) => r.id === id);`
- Line 1124: `any` (CRITICAL) -> `const cmvRow = cascadeResult.find((r: any) => r.parentId === 'CUSTOS' && r.tipo !== 'SINTETICA') ||`
- Line 1125: `any` (CRITICAL) -> `cascadeResult.find((r: any) => r.id === 'CUSTOS');`
- Line 1152: `any` (CRITICAL) -> `.filter((r: any) => r.parentId === 'DESP_OPER' && (r.conta || r.category || r.nome || '').toLowerCase().includes('venda'))`
- Line 1153: `any` (CRITICAL) -> `.reduce((a: any, b: any) => a + (b.computedValue || b.value || b.val || 0), 0);`
- Line 1153: `any` (CRITICAL) -> `.reduce((a: any, b: any) => a + (b.computedValue || b.value || b.val || 0), 0);`
- Line 1155: `any` (CRITICAL) -> `.filter((r: any) => r.parentId === 'DESP_OPER' && (r.conta || r.category || r.nome || '').toLowerCase().includes('admin'))`
- Line 1156: `any` (CRITICAL) -> `.reduce((a: any, b: any) => a + (b.computedValue || b.value || b.val || 0), 0);`
- Line 1156: `any` (CRITICAL) -> `.reduce((a: any, b: any) => a + (b.computedValue || b.value || b.val || 0), 0);`
- Line 1206: `any` (CRITICAL) -> `const yearHist = allHistoryData.filter((d: any) =>`
- Line 1213: `any` (CRITICAL) -> `const m = yearHist.map((d: any) => ({ ...d, value: d.val || d.valor || d.value || 0 }));`
- Line 1214: `any` (CRITICAL) -> `const res = calculateDreCascade([...DRE_OFFICIAL_STRUCTURE.map((a: any) => ({ ...a, value: 0 })), ...m]);`
- Line 1215: `any` (CRITICAL) -> `rl  = res.find((r: any) => r.id === 'ROL')?.computedValue || 0;`
- Line 1216: `any` (CRITICAL) -> `ebt = res.find((r: any) => r.id === 'EBITDA')?.computedValue || 0;`
- Line 1217: `any` (CRITICAL) -> `ll  = res.find((r: any) => r.id === 'LUCRO_LIQ')?.computedValue || 0;`
- Line 1218: `any` (CRITICAL) -> `cmv = Math.abs(res.find((r: any) => r.id === 'CUSTOS')?.computedValue || 0);`
- Line 1221: `any` (CRITICAL) -> `}).filter((d: any) => d.receita > 0 || d.ebitda > 0 || d.lucro > 0 || d.cmv > 0 || d.year === filterYear.toString());`
- Line 1224: `any` (CRITICAL) -> `let recGrowth = 0, ebitdaGrowth = 0, trendNote: any = null;`
- Line 1227: `any` (CRITICAL) -> `const oldest  = chartData.find((d: any) => d.receita > 0) || chartData[0];`
- Line 1354: `any` (CRITICAL) -> `(dreInsights as any).qualityReport = qualityReport;`
- Line 1355: `any` (CRITICAL) -> `(dreInsights as any).rootCauseReport = rootCauseReport;`
- Line 1356: `any` (CRITICAL) -> `(dreInsights as any).economicValueAssessment = economicValueAssessment;`
- Line 1357: `any` (CRITICAL) -> `(dreInsights as any).earningsQualityAssessment = earningsQualityAssessment;`
- Line 1358: `any` (CRITICAL) -> `(dreInsights as any).confidenceAssessment = confidenceAssessment;`
- Line 1359: `any` (CRITICAL) -> `(dreInsights as any).managementDiscussion = managementDiscussion;`
- Line 1360: `any` (CRITICAL) -> `(dreInsights as any).executiveInterpretation = executiveInterpretation;`
- Line 1363: `any` (CRITICAL) -> `(dreInsights as any).normalizedDRE = normalizedDRE;`
- Line 1364: `any` (CRITICAL) -> `(dreInsights as any).revenueEconomicStructure = revenueEconomicStructure;`
- Line 1365: `any` (CRITICAL) -> `(dreInsights as any).economicBurnRate = economicBurnRate;`
- Line 1366: `any` (CRITICAL) -> `(dreInsights as any).breakEvenAnalysis = breakEvenAnalysis;`
- Line 1367: `any` (CRITICAL) -> `(dreInsights as any).operationalAbsorption = operationalAbsorption;`
- Line 1368: `any` (CRITICAL) -> `(dreInsights as any).economicDiagnosis = economicDiagnosis;`
- Line 1369: `any` (CRITICAL) -> `(dreInsights as any).dreExecutiveAdvisory = dreBoardAdvisory;`
- Line 1370: `any` (CRITICAL) -> `(dreInsights as any).dreExecutiveAdvisoryFull = dreExecutiveAdvisoryFull;`
- Line 1371: `any` (CRITICAL) -> `(dreInsights as any).dreBoardDecisionSupport = dreBoardDecisionSupport;`
- Line 1372: `any` (CRITICAL) -> `(dreInsights as any).healthExplainability = healthExplainability;`
- Line 1373: `any` (CRITICAL) -> `(dreInsights as any).dreIsolationAudit = dreIsolationAudit;`
- Line 1374: `any` (CRITICAL) -> `(dreInsights as any).dreBindingAudit = DREExecutiveBindingAudit.audit({`
- Line 1455: `any` (CRITICAL) -> `...dreInsights as any,`
- Line 1478: `any` (CRITICAL) -> `: (isOfficialDfcAvailable ? allHistData.filter((d: any) => {`
- Line 1511: `any` (CRITICAL) -> `const getDfcVal = (entries: any[], keywords: string[]) => {`
- Line 1512: `any` (CRITICAL) -> `const matches = entries.filter((s:any) => {`
- Line 1522: `any` (CRITICAL) -> `const totalMatch = matches.find((s:any) => {`
- Line 1535: `any` (CRITICAL) -> `const yearEntries = allHistData.filter((d: any) =>`
- Line 1539: `any` (CRITICAL) -> `const match = yearEntries.find((d: any) => {`
- Line 1547: `any` (CRITICAL) -> `const yearEntries = allHistData.filter((d: any) =>`
- Line 1552: `any` (CRITICAL) -> `yearEntries.forEach((d: any) => {`
- Line 1576: `any` (CRITICAL) -> `const yearDfcEntries = allHistData.filter((d: any) =>`
- Line 1610: `any` (CRITICAL) -> `const yearEntries = allHistData.filter((d: any) =>`
- Line 1614: `any` (CRITICAL) -> `const match = yearEntries.find((d: any) => {`
- Line 1627: `any` (CRITICAL) -> `fco = dfcDataForRuntime.filter((d: any) => d.category === 'Atividades Operacionais').reduce((acc: number, curr: any) => acc + curr.amount, 0);`
- Line 1627: `any` (CRITICAL) -> `fco = dfcDataForRuntime.filter((d: any) => d.category === 'Atividades Operacionais').reduce((acc: number, curr: any) => acc + curr.amount, 0);`
- Line 1628: `any` (CRITICAL) -> `fci = dfcDataForRuntime.filter((d: any) => d.category === 'Atividades de Investimento').reduce((acc: number, curr: any) => acc + curr.amount, 0);`
- Line 1628: `any` (CRITICAL) -> `fci = dfcDataForRuntime.filter((d: any) => d.category === 'Atividades de Investimento').reduce((acc: number, curr: any) => acc + curr.amount, 0);`
- Line 1629: `any` (CRITICAL) -> `fcf = dfcDataForRuntime.filter((d: any) => d.category === 'Atividades de Financiamento').reduce((acc: number, curr: any) => acc + curr.amount, 0);`
- Line 1629: `any` (CRITICAL) -> `fcf = dfcDataForRuntime.filter((d: any) => d.category === 'Atividades de Financiamento').reduce((acc: number, curr: any) => acc + curr.amount, 0);`
- Line 1632: `any` (CRITICAL) -> `.filter((d: any) => {`
- Line 1641: `any` (CRITICAL) -> `.reduce((acc: number, curr: any) => acc + Math.abs(curr.amount || curr.val || curr.valor || curr.value || 0), 0);`
- Line 1644: `any` (CRITICAL) -> `.filter((d: any) => {`
- Line 1655: `any` (CRITICAL) -> `.reduce((acc: number, curr: any) => acc + Math.abs(curr.amount || curr.val || curr.valor || curr.value || 0), 0);`
- Line 1657: `any` (CRITICAL) -> `const relEntries = dfcDataForRuntime.filter((d: any) => {`
- Line 1662: `any` (CRITICAL) -> `resolvedContasRelacionadas = relEntries.reduce((acc: number, curr: any) => acc + (curr.amount || curr.val || curr.valor || curr.value || 0), 0);`
- Line 1790: `any` (CRITICAL) -> `const totalDistributed = rawData.dlpaData ? rawData.dlpaData.reduce((acc: number, cur: any) => acc + (cur.distributedDividends || 0), 0) : 0;`
- Line 1809: `any` (CRITICAL) -> `const dlpaCapSocialEntry = (rawData.dlpaData || []).find((e: any) => {`
- Line 1851: `unknown` (CRITICAL) -> `fiduciaryOutput: (rawCapitalGov.diagnostics as unknown as { fiduciaryOutput: import('./governance/dlpa/DLPAFiduciaryInterpretationEngine').DLPAFiduciaryOutput }).fiduciaryOutput,`
- Line 2086: `unknown` (CRITICAL) -> `((recoveryReport as unknown) as { regressionReport?: unknown }).regressionReport = regressionReport;`
- Line 2086: `unknown` (CRITICAL) -> `((recoveryReport as unknown) as { regressionReport?: unknown }).regressionReport = regressionReport;`
- Line 2087: `unknown` (CRITICAL) -> `((recoveryReport as unknown) as { resilienceReport?: unknown }).resilienceReport = resilienceReport;`
- Line 2087: `unknown` (CRITICAL) -> `((recoveryReport as unknown) as { resilienceReport?: unknown }).resilienceReport = resilienceReport;`
- Line 2152: `unknown` (CRITICAL) -> `(capitalGovernanceReport as unknown as { fiduciaryOutput: Record<string, unknown> }).fiduciaryOutput.patrimonialIntegrityStatus = 'SEVERELY_ERODED';`
- Line 2153: `unknown` (CRITICAL) -> `(capitalGovernanceReport as unknown as { fiduciaryOutput: Record<string, unknown> }).fiduciaryOutput.capitalProtectionStatus = 'WEAK_CAPITAL_PROTECTION';`
- Line 2154: `unknown` (CRITICAL) -> `(capitalGovernanceReport as unknown as { fiduciaryOutput: Record<string, unknown> }).fiduciaryOutput.distributionEligibility = {`
- Line 2159: `unknown` (CRITICAL) -> `(capitalGovernanceReport as unknown as { fiduciaryOutput: Record<string, unknown> }).fiduciaryOutput.retentionClassification = 'FORCED_RETENTION';`
- Line 2160: `unknown` (CRITICAL) -> `(capitalGovernanceReport as unknown as { fiduciaryOutput: Record<string, unknown> }).fiduciaryOutput.institutionalStage = 'SURVIVAL_STAGE_CAPITAL_STRUCTURE';`
- Line 2220: `any` (CRITICAL) -> `bpWorkingCapitalPressure: (capitalGovernanceReport.isAvailable && Array.isArray(capitalGovernanceReport.behavior) && capitalGovernanceReport.behavior.some((b: any) => b.includes('pressão') || b.includes('Working Capital'))),`
- Line 2221: `any` (CRITICAL) -> `bpHighLeverage: (capitalGovernanceReport.isAvailable && Array.isArray(capitalGovernanceReport.behavior) && capitalGovernanceReport.behavior.some((b: any) => b.includes('alavanca')))`
- Line 2240: `any` (CRITICAL) -> `const lossAbsorption = bpIndicators.find((i: any) => i.metricName === 'Loss Absorption Capacity')?.value as number | 'INSUFFICIENT_DATA';`
- Line 2266: `any` (CRITICAL) -> `const bpHistoryArray: { year: number; summary: any }[] = [];`
- Line 2268: `any` (CRITICAL) -> `const uniqueYears = [...new Set(historySource.map((h: any) => h.year))] as number[];`
- Line 2271: `any` (CRITICAL) -> `const yearEntries = historySource.filter((d: any) => d.year === year && (d.type === 'Balanço Patrimonial' || d.type === 'BP' || d.tipo === 'BP'));`
- Line 2425: `any` (CRITICAL) -> `governanceConsistency: undefined as any`
- Line 2493: `unknown` (CRITICAL) -> `} as unknown as RuntimeExecutionTrace,`
- Line 2519: `any` (CRITICAL) -> `} as any,`
- Line 2524: `any` (CRITICAL) -> `} as any,`
- Line 2532: `any` (CRITICAL) -> `} as any`
- Line 2535: `any` (CRITICAL) -> `constitutionalDashboard: undefined as any // Placeholder to be populated`
- Line 2551: `any` (CRITICAL) -> `} as any);`
- Line 2566: `any` (CRITICAL) -> `} as any);`
- Line 2713: `unknown` (CRITICAL) -> `environmentType: envConfig.environmentType as unknown as DeploymentEnvironment,`
- Line 2749: `unknown` (CRITICAL) -> `environmentType: envConfig.environmentType as unknown as DeploymentEnvironment,`
- Line 2804: `any` (CRITICAL) -> `const parsedCycles = report.timeline.lineageHash ? (ExecutiveTimelineEngine as any).generate(rawData, report).timelineEvents : []; // Wait, let's look at how ExecutiveTimelineEngine parses cycles.`
- Line 2826: `any` (CRITICAL) -> `const uniqueCyclesMap: { [key: string]: any } = {};`
- Line 2832: `any` (CRITICAL) -> `const sortedCycles = Object.values(uniqueCyclesMap).sort((a: any, b: any) =>`
- Line 2832: `any` (CRITICAL) -> `const sortedCycles = Object.values(uniqueCyclesMap).sort((a: any, b: any) =>`

### src/core/runtime/executive-prioritization/BoardTop3DecisionEngine.ts

- Line 13: `any` (CRITICAL) -> `evidence: any[];`
- Line 18: `any` (CRITICAL) -> `public static generate(report: any, requiresEscalation: boolean): BoardDecision[] {`

### src/core/runtime/executive-prioritization/ExecutiveActionPlanEngine.ts

- Line 16: `any` (CRITICAL) -> `public static generate(report: any): ExecutiveAction[] {`

### src/core/runtime/executive-prioritization/ExecutivePriorityRankingEngine.ts

- Line 28: `any` (CRITICAL) -> `public static rank(report: any): RatedRecommendation[] {`
- Line 33: `any` (CRITICAL) -> `const fmt = (v: any) => {`

### src/core/runtime/executive-prioritization/InstitutionalPriorityMatrixEngine.ts

- Line 11: `any` (CRITICAL) -> `public static generate(report: any): PriorityMatrixRow[] {`

### src/core/runtime/executive-timeline/ExecutiveTimelineEngine.ts

- Line 11: `any` (CRITICAL) -> `public static parseCycle(cycle: any): HistoricalRuntimeCycle {`
- Line 129: `any` (CRITICAL) -> `public static generate(rawData: any, currentReport: any): ExecutiveTimelineOutput {`
- Line 129: `any` (CRITICAL) -> `public static generate(rawData: any, currentReport: any): ExecutiveTimelineOutput {`

### src/core/runtime/financial-context/FinancialRuntimeContextAdapter.test.ts

- Line 139: `any` (CRITICAL) -> `} as any as SegmentIntelligenceProfile;`

### src/core/runtime/governance/bp/BalanceSheetExecutiveNarrativeEngine.ts

- Line 4: `any` (CRITICAL) -> `static generate(indicators: any[], summary: any, exerciseYear: number, summaryHash: string): { text: string; narrativeMetadata: any } {`
- Line 4: `any` (CRITICAL) -> `static generate(indicators: any[], summary: any, exerciseYear: number, summaryHash: string): { text: string; narrativeMetadata: any } {`
- Line 4: `any` (CRITICAL) -> `static generate(indicators: any[], summary: any, exerciseYear: number, summaryHash: string): { text: string; narrativeMetadata: any } {`

### src/core/runtime/governance/bp/BalanceSheetFinancialMetricsEngine.ts

- Line 10: `any` (CRITICAL) -> `evidence: any;`

### src/core/runtime/governance/bp/BalanceSheetHistoricalContaminationAudit.ts

- Line 2: `any` (CRITICAL) -> `static audit(selectedYear: number, rawData: any): { isContaminated: boolean; violations: string[] } {`

### src/core/runtime/governance/bp/BalanceSheetNarrativeTemporalAudit.ts

- Line 2: `any` (CRITICAL) -> `static audit(narrative: string, summary: any, indicators: any[]): { isDriftDetected: boolean; violations: string[] } {`
- Line 2: `any` (CRITICAL) -> `static audit(narrative: string, summary: any, indicators: any[]): { isDriftDetected: boolean; violations: string[] } {`

### src/core/runtime/governance/bp/BalanceSheetPresentationLeakAudit.ts

- Line 4: `any` (CRITICAL) -> `static audit(output: any): { hasLeak: boolean; leaks: string[] } {`

### src/core/runtime/governance/bp/BalanceSheetSummaryLineageAudit.ts

- Line 9: `any` (CRITICAL) -> `static generateLineage(bpSummary: any, exerciseYear: number, rawData: any): SummaryLineage {`
- Line 9: `any` (CRITICAL) -> `static generateLineage(bpSummary: any, exerciseYear: number, rawData: any): SummaryLineage {`

### src/core/runtime/governance/bp/PatrimonialGovernanceConsistencyEngine.ts

- Line 20: `any` (CRITICAL) -> `patrimonialTrend: any;`
- Line 120: `any` (CRITICAL) -> `const familyTrends = patrimonialTrend?.trends?.filter((t: any) => familyMetrics.includes(t.metricName)) || [];`
- Line 121: `any` (CRITICAL) -> `const deterioratingCount = familyTrends.filter((t: any) => t.trend === 'DETERIORATING').length;`
- Line 133: `any` (CRITICAL) -> `const allDeteriorating = patrimonialTrend?.trends?.filter((t: any) => t.trend === 'DETERIORATING').length || 0;`

### src/core/runtime/governance/bp/PatrimonialPreservationEngine.ts

- Line 27: `any` (CRITICAL) -> `static analyze(summary: BPSummary, dreData: any[]): PatrimonialIndicator[] {`

### src/core/runtime/governance/bp/WorkingCapitalIntelligenceEngine.ts

- Line 6: `any` (CRITICAL) -> `static analyze(summary: BPSummary, dreData: any[]): PatrimonialIndicator[] {`

### src/core/runtime/governance/common/NaNEliminationGuard.ts

- Line 2: `any` (CRITICAL) -> `static sanitizeNumber(value: any, fallback: string | number = 'INSUFFICIENT_DATA'): number | string {`
- Line 21: `any` (CRITICAL) -> `static isSafe(value: any): boolean {`

### src/core/runtime/governance/dfc/DFCSSOTAuthorityGuard.ts

- Line 9: `any` (CRITICAL) -> `output: any,`

### src/core/runtime/governance/dfc/DFCSSOTGuard.ts

- Line 8: `any` (CRITICAL) -> `static enforce(output: any): CashFlowGovernanceOutput {`

### src/core/runtime/governance/dlpa/CapitalPreservationScoreEngine.ts

- Line 6: `any` (CRITICAL) -> `horizonFormattedOrObj: any,`

### src/core/runtime/governance/dlpa/CapitalRecoverabilityEngine.ts

- Line 2: `any` (CRITICAL) -> `static evaluate(endingEquity: number, recoveryHorizonInput: any) {`

### src/core/runtime/governance/dlpa/DLPACanonicalBindingAudit.ts

- Line 3: `any` (CRITICAL) -> `engineOutput: any;`
- Line 4: `any` (CRITICAL) -> `adapterOutput: any;`
- Line 5: `any` (CRITICAL) -> `uiOutput?: any;`

### src/core/runtime/governance/dlpa/DLPACanonicalPayloadEnforcer.ts

- Line 4: `any` (CRITICAL) -> `public static enforce(payload: any): {`
- Line 6: `any` (CRITICAL) -> `normalizedPayload: any;`

### src/core/runtime/governance/dlpa/DLPACanonicalScoreResolver.ts

- Line 2: `any` (CRITICAL) -> `public static resolve(capitalPreservationScore: any): {`

### src/core/runtime/governance/dlpa/DLPAConsistencyAuditEngine.ts

- Line 2: `any` (CRITICAL) -> `public static validate(report: any): { valid: boolean; violations: string[] } {`

### src/core/runtime/governance/dlpa/DLPAFiduciaryInterpretationEngine.ts

- Line 42: `any` (CRITICAL) -> `dlpaData: any[];`

### src/core/runtime/governance/dlpa/DLPALegacyFieldScanner.ts

- Line 2: `any` (CRITICAL) -> `public static scan(payload: any): 'CANONICAL' | 'LEGACY_PAYLOAD_DETECTED' {`

### src/core/runtime/governance/dlpa/DLPALegacyPayloadAudit.ts

- Line 2: `any` (CRITICAL) -> `public static audit(payload: any): { valid: boolean; error?: string } {`

### src/core/runtime/governance/dlpa/DLPARecoveryHorizonResolver.ts

- Line 2: `any` (CRITICAL) -> `public static resolve(patrimonialRecoveryHorizon: any, capitalRecoverability: any): {`
- Line 2: `any` (CRITICAL) -> `public static resolve(patrimonialRecoveryHorizon: any, capitalRecoverability: any): {`

### src/core/runtime/governance/dlpa/DLPATemporalIntegrityGuard.ts

- Line 7: `any` (CRITICAL) -> `public static filterHistoricalCycles(historicalCycles: any[], analysisYear: number): any[] {`
- Line 7: `any` (CRITICAL) -> `public static filterHistoricalCycles(historicalCycles: any[], analysisYear: number): any[] {`

### src/core/runtime/governance/dlpa/PatrimonialRecoveryHorizonEngine.ts

- Line 6: `any` (CRITICAL) -> `eligibleHistoricalCycles?: any[];`
- Line 8: `any` (CRITICAL) -> `temporalAudit?: any;`
- Line 13: `any` (CRITICAL) -> `inputOrLosses: any,`
- Line 15: `any` (CRITICAL) -> `historicalCycles: any[] = [],`
- Line 20: `any` (CRITICAL) -> `let eligibleHistoricalCycles: any[] = [];`
- Line 22: `any` (CRITICAL) -> `let temporalAudit: any = null;`

### src/core/runtime/governance-copilot/executive-conversation-adapter.ts

- Line 12: `any` (CRITICAL) -> `): any {`

### src/core/runtime/governance-copilot/governance-copilot-adapter.ts

- Line 9: `any` (CRITICAL) -> `): any {`

### src/core/runtime/governance-copilot/governance-copilot-reasoning-adapter.ts

- Line 9: `any` (CRITICAL) -> `): any {`

### src/core/runtime/institutional-causality/types.ts

- Line 186: `unknown` (CRITICAL) -> `if (summary.ativoTotal === 0 && (cycle as unknown as { rawFinancialData?: { bpSummary?: Record<string, number> } }).rawFinancialData?.bpSummary) {`
- Line 187: `unknown` (CRITICAL) -> `const s = (cycle as unknown as { rawFinancialData?: { bpSummary?: Record<string, number> } }).rawFinancialData!.bpSummary!;`

### src/core/runtime/institutional-context/GrowthPatternResolver.ts

- Line 11: `any` (CRITICAL) -> `const ebitda = ctx.dreCascade?.find((d: any) => d.id === 'EBITDA' || d.category?.toLowerCase().includes('ebitda'))?.value`
- Line 14: `any` (CRITICAL) -> `const netIncome = ctx.dreCascade?.find((d: any) => d.id === 'LUCRO_LÍQUIDO_DO_EXERCÍCIO' || d.category?.toLowerCase().includes('lucro'))?.value`

### src/core/runtime/institutional-context/HistoricalDensityResolver.ts

- Line 6: `unknown` (CRITICAL) -> `return 'NO_VALID_HISTORY' as unknown as import("./types").HistoricalDensity; // Type needs to be adjusted in types.ts`

### src/core/runtime/institutional-context/InstitutionalContextEngine.ts

- Line 27: `any` (CRITICAL) -> `static resolve(rawData: any): InstitutionalContextProfile {`
- Line 32: `any` (CRITICAL) -> `let bpSummary: any = {};`
- Line 41: `any` (CRITICAL) -> `let dreCascade: any[] = [];`

### src/core/runtime/institutional-context/SegmentIntelligenceEngine.ts

- Line 68: `unknown` (CRITICAL) -> `assetIntensityProfile: result.assetIntensityProfile as unknown as "UNKNOWN",`
- Line 69: `unknown` (CRITICAL) -> `workingCapitalCycleProfile: result.workingCapitalCycleProfile as unknown as "UNKNOWN",`
- Line 70: `unknown` (CRITICAL) -> `revenueModelSensitivity: result.revenueModelSensitivity as unknown as "UNKNOWN",`
- Line 71: `unknown` (CRITICAL) -> `marginStructureProfile: result.marginStructureProfile as unknown as "UNKNOWN",`
- Line 72: `unknown` (CRITICAL) -> `governanceComplexityLevel: result.governanceComplexityLevel as unknown as "UNKNOWN",`
- Line 73: `unknown` (CRITICAL) -> `institutionalMaturityContext: result.institutionalMaturityContext as unknown as "UNKNOWN",`

### src/core/runtime/institutional-context/types.ts

- Line 127: `any` (CRITICAL) -> `operationalProfile?: any;`
- Line 141: `any` (CRITICAL) -> `operationalProfile?: any;`
- Line 145: `any` (CRITICAL) -> `rawData: any;`
- Line 146: `any` (CRITICAL) -> `bpSummary: any;`
- Line 147: `any` (CRITICAL) -> `dreCascade: any[];`

### src/core/runtime/institutional-evidence/institutional-evidence-adapter.ts

- Line 6: `any` (CRITICAL) -> `reportWithExecutiveSovereignty: any,`
- Line 8: `any` (CRITICAL) -> `): any {`

### src/core/runtime/institutional-memory/GovernanceRecurrenceEngine.ts

- Line 101: `any` (CRITICAL) -> `private static detectViolationPattern(cycles: HistoricalCycleData[], filterFn: (v: any) => boolean) {`
- Line 102: `any` (CRITICAL) -> `const violationMap = new Map<string, { count: number; details: any }>();`

### src/core/runtime/institutional-memory/HistoricalReplayIndex.ts

- Line 29: `any` (CRITICAL) -> `public static assertNoPayloadBloat(entry: any): void {`

### src/core/runtime/institutional-memory/InstitutionalBehaviorAnalyzer.ts

- Line 54: `any` (CRITICAL) -> `private static parseBPSummary(bpData?: any[]): any {`
- Line 54: `any` (CRITICAL) -> `private static parseBPSummary(bpData?: any[]): any {`

### src/core/runtime/institutional-memory/LongitudinalSnapshotSummary.ts

- Line 17: `any` (CRITICAL) -> `public static build(payload: any): LongitudinalSnapshotSummaryData {`

### src/core/runtime/institutional-memory/RecommendationPersistenceTracker.ts

- Line 10: `any` (CRITICAL) -> `public static trackIgnored(cycles: any[]): string[] {`

### src/core/runtime/institutional-memory/types.ts

- Line 125: `any` (CRITICAL) -> `bpData?: any[];`

### src/core/runtime/institutional-recovery/RecoveryTypes.ts

- Line 34: `any` (CRITICAL) -> `survivalReport?: any;`
- Line 35: `any` (CRITICAL) -> `fiduciaryOutput?: any;`
- Line 36: `any` (CRITICAL) -> `treasuryRuntime?: any;`
- Line 37: `any` (CRITICAL) -> `cashIntelligenceRuntime?: any;`
- Line 38: `any` (CRITICAL) -> `patrimonialIntelligenceRuntime?: any;`
- Line 39: `any` (CRITICAL) -> `longitudinalRuntimeHistory?: any[];`
- Line 40: `any` (CRITICAL) -> `historicalCycles?: any[];`
- Line 44: `any` (CRITICAL) -> `memoryProfile?: any;`
- Line 45: `any` (CRITICAL) -> `regressionReport?: any;`
- Line 46: `any` (CRITICAL) -> `resilienceReport?: any;`

### src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime.test.ts

- Line 14: `any` (CRITICAL) -> `} as any as import('../institutional-context/types').InstitutionalContextProfile,`
- Line 18: `any` (CRITICAL) -> `} as any as import('../observability/observability-types').RuntimeExecutionTrace,`
- Line 23: `any` (CRITICAL) -> `} as any as ExecutiveIntelligenceReport['compliance'],`
- Line 28: `any` (CRITICAL) -> `} as any as import('../strategic-intelligence/strategic-intelligence-types').InstitutionalStrategicIntelligenceOutput,`
- Line 32: `any` (CRITICAL) -> `} as any as import('../evidence-ingestion/InstitutionalEvidenceTypes').InstitutionalEvidenceValidationOutput,`
- Line 39: `any` (CRITICAL) -> `} as any as import('../cash-intelligence/CashIntelligenceTypes').LongitudinalCashIntelligenceOutput`

### src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime.ts

- Line 17: `any` (CRITICAL) -> `evidenceAppendix: any[];`
- Line 25: `any` (CRITICAL) -> `temporalAudit?: any;`
- Line 47: `any` (CRITICAL) -> `const evidenceTrail: any[] = [];`
- Line 66: `any` (CRITICAL) -> `(report as any).featureFlags?.showTechnicalAudit ||`
- Line 67: `any` (CRITICAL) -> `(report as any).compliance?.featureFlags?.showTechnicalAudit ||`
- Line 68: `any` (CRITICAL) -> `(report as any).institutionalContext?.featureFlags?.showTechnicalAudit ||`
- Line 69: `any` (CRITICAL) -> `(report as any).context?.input?.featureFlags?.showTechnicalAudit ||`
- Line 70: `any` (CRITICAL) -> `(report as any).context?.input?.rawFinancialData?.featureFlags?.showTechnicalAudit ||`
- Line 71: `any` (CRITICAL) -> `(report as any).context?.input?.rawFinancialData?.featureFlags?.showTechnicalAudit === true`
- Line 210: `any` (CRITICAL) -> `const fmtVal = (val: any): string => (typeof val === 'number') ? val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'N/A';`
- Line 211: `any` (CRITICAL) -> `const fmtPct = (val: any): string => (typeof val === 'number') ? `${(val * 100).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%` : 'N/A';`
- Line 347: `any` (CRITICAL) -> `timeline.forEach((evt: any) => {`
- Line 359: `any` (CRITICAL) -> `const years = heatmaps.treasury?.map((h: any) => h.year) || [];`
- Line 426: `any` (CRITICAL) -> `const baseMetrics = stressScenarios.find((s: any) => s.name === 'Base Institutional Scenario')?.metrics || {};`
- Line 443: `any` (CRITICAL) -> `stressScenarios.forEach((sc: any) => {`
- Line 487: `any` (CRITICAL) -> `const severeStressScenario = stressScenarios.find((s: any) => s.name === 'Refinancing Shock Scenario') || {};`
- Line 490: `any` (CRITICAL) -> `const activeCascadeLogs = ccsMetrics.stressScenarios?.find((s: any) => s.name === 'Refinancing Shock Scenario')?.cascadeLogs || [];`
- Line 555: `any` (CRITICAL) -> `topDecisions.forEach((dec: any) => {`
- Line 562: `any` (CRITICAL) -> `topDecisions.forEach((dec: any, idx: number) => {`
- Line 576: `any` (CRITICAL) -> `conflicts.forEach((c: any) => {`
- Line 590: `any` (CRITICAL) -> `topDecisions.slice(0, 5).forEach((dec: any) => {`
- Line 598: `any` (CRITICAL) -> `const getLabel = (id: string) => allDecs.find((d: any) => d.id === id)?.label || id;`
- Line 611: `any` (CRITICAL) -> `capitalAllocationRanking.forEach((r: any) => {`
- Line 619: `any` (CRITICAL) -> `topDecisions.slice(0, 3).forEach((dec: any) => {`
- Line 641: `any` (CRITICAL) -> `decisions.forEach((rec: any) => {`
- Line 642: `any` (CRITICAL) -> `const evTypes = rec.evidence?.map((e: any) => e.type).join(', ') || 'Nenhuma';`
- Line 656: `any` (CRITICAL) -> `decisions.forEach((rec: any) => {`
- Line 670: `any` (CRITICAL) -> `const overdueDecs = decisions.filter((r: any) => {`
- Line 675: `any` (CRITICAL) -> `overdueDecs.forEach((r: any) => {`
- Line 708: `any` (CRITICAL) -> `const fmtVal = (val: any): string => (typeof val === 'number') ? val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'N/A';`
- Line 777: `any` (CRITICAL) -> `? (FinancialLineageIntegrityAdapter as any).audit({`
- Line 779: `any` (CRITICAL) -> `input: { rawFinancialData: { allHistoryData: [] } } as any,`
- Line 799: `any` (CRITICAL) -> `flifResult.violations.forEach((v: any) => {`
- Line 807: `any` (CRITICAL) -> `const netIncomeMetric = flifResult.auditedMetrics.find((m: any) => m.metricId === 'NET_INCOME_EQE');`
- Line 855: `any` (CRITICAL) -> `const fmtVal = (val: any): string => (typeof val === 'number') ? val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'N/A';`
- Line 856: `any` (CRITICAL) -> `const fmtPct = (val: any): string => (typeof val === 'number') ? `${(val * 100).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%` : 'N/A';`
- Line 920: `any` (CRITICAL) -> `const formatLineageVal = (val: any) => {`
- Line 933: `any` (CRITICAL) -> `const preservationMetric = (cgeMetrics.metricsRegistry || []).find((m: any) => m.metricId === 'capitalPreservation');`
- Line 994: `any` (CRITICAL) -> `const lifecycleStage = cgeMetrics2.lifecycleStage || (report.institutionalContext as any)?.lifecycleStage || 'ESTABLISHED_ANALYSIS';`

### src/core/runtime/institutional-reporting/InstitutionalBoardPackRuntime.ts

- Line 82: `unknown` (CRITICAL) -> `} as unknown as Record<string, unknown>)`
- Line 152: `any` (CRITICAL) -> `liquidityFragilityOverride: !!structuralRestrictions.appliedOverrides.find((o: any) => o.name === 'Liquidity Fragility Override'),`
- Line 153: `any` (CRITICAL) -> `shortTermDebtConcentrationOverride: !!structuralRestrictions.appliedOverrides.find((o: any) => o.name === 'Short-Term Debt Concentration Override'),`
- Line 159: `any` (CRITICAL) -> `const bpSummary = (report as any).capitalGovernanceReport?.bpSummary`
- Line 160: `any` (CRITICAL) -> `|| (report as any).context?.input?.rawFinancialData?.bpSummary`
- Line 161: `any` (CRITICAL) -> `|| (report as any).metrics?.financialMetrics`
- Line 164: `any` (CRITICAL) -> `const netRevenue = Number((report.metrics as any)?.netRevenue ?? (report.metrics as any)?.receitaLiquida ?? 0);`
- Line 164: `any` (CRITICAL) -> `const netRevenue = Number((report.metrics as any)?.netRevenue ?? (report.metrics as any)?.receitaLiquida ?? 0);`
- Line 165: `any` (CRITICAL) -> `const netProfit = Number((report.metrics as any)?.netProfit ?? (report.metrics as any)?.netIncome ?? 0);`
- Line 165: `any` (CRITICAL) -> `const netProfit = Number((report.metrics as any)?.netProfit ?? (report.metrics as any)?.netIncome ?? 0);`
- Line 166: `any` (CRITICAL) -> `const ebit = Number((report.metrics as any)?.ebit ?? (report.metrics as any)?.dreInsights?.normalizedDRE?.ebitda?.value ?? (report.metrics as any)?.ebitda ?? netProfit ?? 0);`
- Line 166: `any` (CRITICAL) -> `const ebit = Number((report.metrics as any)?.ebit ?? (report.metrics as any)?.dreInsights?.normalizedDRE?.ebitda?.value ?? (report.metrics as any)?.ebitda ?? netProfit ?? 0);`
- Line 166: `any` (CRITICAL) -> `const ebit = Number((report.metrics as any)?.ebit ?? (report.metrics as any)?.dreInsights?.normalizedDRE?.ebitda?.value ?? (report.metrics as any)?.ebitda ?? netProfit ?? 0);`
- Line 172: `any` (CRITICAL) -> `const capitalSocial = Number((report.capitalGovernanceReport as any)?.capitalSocial`
- Line 173: `any` (CRITICAL) -> `?? (report as any).executiveLayer?.consumedCapital?.capitalSocial`
- Line 177: `any` (CRITICAL) -> `const lucrosPrejuizos = Number((report.capitalGovernanceReport as any)?.retainedEarnings`
- Line 178: `any` (CRITICAL) -> `?? (report.capitalGovernanceReport as any)?.lucrosPrejuizos`
- Line 179: `any` (CRITICAL) -> `?? (report as any).executiveLayer?.consumedCapital?.value`
- Line 183: `any` (CRITICAL) -> `|| (report as any).historicalCyclesCount`
- Line 212: `any` (CRITICAL) -> `|| (report.metrics as any)?.fiduciary?.cashRunwayInstitucional?.months`
- Line 213: `any` (CRITICAL) -> `|| (report as any).continuityRisk?.projectedRunwayMonths`
- Line 216: `any` (CRITICAL) -> `const fco = Number((report.metrics as any)?.fco || (report.cashSustainabilityReport as any)?.sourceMetrics?.fco || 0);`
- Line 216: `any` (CRITICAL) -> `const fco = Number((report.metrics as any)?.fco || (report.cashSustainabilityReport as any)?.sourceMetrics?.fco || 0);`
- Line 315: `any` (CRITICAL) -> `(report as any)?.featureFlags?.showTechnicalAudit ||`
- Line 316: `any` (CRITICAL) -> `(report as any).compliance?.featureFlags?.showTechnicalAudit ||`
- Line 317: `any` (CRITICAL) -> `(report as any).institutionalContext?.featureFlags?.showTechnicalAudit ||`
- Line 318: `any` (CRITICAL) -> `(report as any).context?.input?.featureFlags?.showTechnicalAudit ||`
- Line 319: `any` (CRITICAL) -> `(report as any).context?.input?.rawFinancialData?.featureFlags?.showTechnicalAudit ||`
- Line 320: `any` (CRITICAL) -> `(report as any).context?.input?.rawFinancialData?.featureFlags?.showTechnicalAudit === true`
- Line 374: `any` (CRITICAL) -> `cqs: (report.capitalGovernanceReport as any)?.diagnostics?.behavior?.capitalReinforcementIndex ?? report.scores?.governance ?? 0,`
- Line 375: `any` (CRITICAL) -> `eqs: (report.metrics as any)?.fiduciary?.earningsQuality ?? null,`
- Line 376: `any` (CRITICAL) -> `dlpaTechnicalLayer: (report.capitalGovernanceReport as any)?.diagnostics ?? null,`
- Line 377: `any` (CRITICAL) -> `dfcTechnicalLayer: (report.metrics as any)?.fiduciary ?? null,`
- Line 379: `any` (CRITICAL) -> `constitutionalAudit: (report.constitutionalEvaluation as any)?.constitutionalAuditTrail ?? (report.constitutionalEvaluation as any)?.auditRecords ?? []`
- Line 379: `any` (CRITICAL) -> `constitutionalAudit: (report.constitutionalEvaluation as any)?.constitutionalAuditTrail ?? (report.constitutionalEvaluation as any)?.auditRecords ?? []`
- Line 402: `any` (CRITICAL) -> `const capReport = report.capitalGovernanceReport as any;`

### src/core/runtime/institutional-reporting/engines/ExecutiveLongitudinalIntegration.spec.ts

- Line 31: `any` (CRITICAL) -> `classification: classification as any,`
- Line 106: `any` (CRITICAL) -> `strategicIntelligence: { posture: 'EXPANSION_POSTURE', trajectory: 'TRAJECTORY_STABLE', thesis: { unifiedThesisStatement: 'Fake thesis' }, explainability: {} as any } as any,`
- Line 106: `any` (CRITICAL) -> `strategicIntelligence: { posture: 'EXPANSION_POSTURE', trajectory: 'TRAJECTORY_STABLE', thesis: { unifiedThesisStatement: 'Fake thesis' }, explainability: {} as any } as any,`
- Line 135: `any` (CRITICAL) -> `strategic: { posture: 'EXPANSION_POSTURE', trajectory: 'TRAJECTORY_STABLE', thesis: { unifiedThesisStatement: 'Fake thesis' }, explainability: {} as any } as any,`
- Line 135: `any` (CRITICAL) -> `strategic: { posture: 'EXPANSION_POSTURE', trajectory: 'TRAJECTORY_STABLE', thesis: { unifiedThesisStatement: 'Fake thesis' }, explainability: {} as any } as any,`
- Line 149: `any` (CRITICAL) -> `} as any);`

### src/core/runtime/institutional-reporting/engines/GovernanceReportingEngine.ts

- Line 25: `unknown` (CRITICAL) -> `complianceStatus: ((report.institutionalContext as unknown as { historicalCyclesCount?: number }).historicalCyclesCount || 2) >= 2 ? 'COMPLIANT' : 'RESTRICTED_MODE',`

### src/core/runtime/institutional-reporting/engines/InstitutionalBoardPackEndToEnd.spec.ts

- Line 299: `any` (CRITICAL) -> `(report.runtimeMetadata as any).lineageHash = 'canonical-hash-1234';`
- Line 300: `any` (CRITICAL) -> `(report.runtimeMetadata as any).historicalCyclesAvailable = data.historicalCyclesCount || 3;`
- Line 302: `any` (CRITICAL) -> `(report as any).runtimeMetadata = { lineageHash: 'canonical-hash-1234', auditTrail: [], historicalCyclesAvailable: data.historicalCyclesCount || 3 };`

### src/core/runtime/institutional-reporting/engines/InstitutionalDisclosureReportingEngine.ts

- Line 27: `unknown` (CRITICAL) -> `const runtimeMetadataAny = report.runtimeMetadata as unknown as { lineageHash?: string, historicalCyclesAvailable?: number };`

### src/core/runtime/institutional-reporting/engines/InstitutionalExplainabilityAppendixEngine.ts

- Line 17: `unknown` (CRITICAL) -> `'EXECUTION_INTEGRITY': (gov.executionIntegrity as unknown as { inferenceBasis?: string }).inferenceBasis || 'N/A'`

### src/core/runtime/institutional-reporting/engines/InstitutionalLineageAppendixEngine.ts

- Line 12: `unknown` (CRITICAL) -> `boardPackLineageHash: boardPackHash as unknown as BoardPackLineageHash,`
- Line 14: `unknown` (CRITICAL) -> `'EXECUTIVE_REPORT': ((report.runtimeMetadata as unknown as { lineageHash?: string })?.lineageHash || 'UNAVAILABLE') as unknown as RuntimeLineageHash,`
- Line 14: `unknown` (CRITICAL) -> `'EXECUTIVE_REPORT': ((report.runtimeMetadata as unknown as { lineageHash?: string })?.lineageHash || 'UNAVAILABLE') as unknown as RuntimeLineageHash,`
- Line 15: `unknown` (CRITICAL) -> `'STRATEGIC_INTELLIGENCE': (report.strategicIntelligence?.explainability.strategicLineage || 'UNAVAILABLE') as unknown as RuntimeLineageHash,`
- Line 16: `unknown` (CRITICAL) -> `'OPERATIONAL_GOVERNANCE': (((report.operationalGovernance as unknown as { auditTrail?: string[] })?.auditTrail?.[0]) || 'UNAVAILABLE') as unknown as RuntimeLineageHash,`
- Line 16: `unknown` (CRITICAL) -> `'OPERATIONAL_GOVERNANCE': (((report.operationalGovernance as unknown as { auditTrail?: string[] })?.auditTrail?.[0]) || 'UNAVAILABLE') as unknown as RuntimeLineageHash,`
- Line 17: `unknown` (CRITICAL) -> `'CONTINUITY_COCKPIT': (((report.resilienceReport as unknown as { lineageHash?: string })?.lineageHash) || 'UNAVAILABLE') as unknown as RuntimeLineageHash,`
- Line 17: `unknown` (CRITICAL) -> `'CONTINUITY_COCKPIT': (((report.resilienceReport as unknown as { lineageHash?: string })?.lineageHash) || 'UNAVAILABLE') as unknown as RuntimeLineageHash,`
- Line 18: `unknown` (CRITICAL) -> `'TREASURY_INTELLIGENCE': (((report.treasuryIntelligenceReport as unknown as { treasuryLineageHash?: string })?.treasuryLineageHash) || 'UNAVAILABLE') as unknown as RuntimeLineageHash`
- Line 18: `unknown` (CRITICAL) -> `'TREASURY_INTELLIGENCE': (((report.treasuryIntelligenceReport as unknown as { treasuryLineageHash?: string })?.treasuryLineageHash) || 'UNAVAILABLE') as unknown as RuntimeLineageHash`
- Line 20: `unknown` (CRITICAL) -> `propagationHashes: ((report.runtimeMetadata as unknown as { auditTrail?: string[] })?.auditTrail) || []`

### src/core/runtime/institutional-reporting/engines/OperationalGovernanceReportingEngine.ts

- Line 15: `unknown` (CRITICAL) -> `continuityStrain: gov?.continuity?.status || (gov as unknown as { operationalContinuity?: { status?: string } })?.operationalContinuity?.status || 'UNKNOWN'`

### src/core/runtime/institutional-reporting/institutional-reporting-types.ts

- Line 172: `any` (CRITICAL) -> `appliedOverrides: any[];`
- Line 177: `any` (CRITICAL) -> `inventoryDependency: any;`
- Line 256: `any` (CRITICAL) -> `cqs: any;`
- Line 257: `any` (CRITICAL) -> `eqs: any;`
- Line 258: `any` (CRITICAL) -> `dlpaTechnicalLayer: any;`
- Line 259: `any` (CRITICAL) -> `dfcTechnicalLayer: any;`
- Line 261: `any` (CRITICAL) -> `constitutionalAudit: any[];`
- Line 263: `any` (CRITICAL) -> `temporalAudit?: any;`

### src/core/runtime/institutional-resilience/ResilienceTypes.ts

- Line 36: `any` (CRITICAL) -> `survivalReport?: any;`
- Line 37: `any` (CRITICAL) -> `recoveryReport?: any;`
- Line 38: `any` (CRITICAL) -> `regressionReport?: any;`
- Line 39: `any` (CRITICAL) -> `fiduciaryOutput?: any;`
- Line 40: `any` (CRITICAL) -> `treasuryRuntime?: any;`
- Line 41: `any` (CRITICAL) -> `cashIntelligenceRuntime?: any;`
- Line 42: `any` (CRITICAL) -> `patrimonialIntelligenceRuntime?: any;`
- Line 43: `any` (CRITICAL) -> `governanceTrajectoryRuntime?: any;`
- Line 44: `any` (CRITICAL) -> `historicalInstitutionalMemory?: any; // To be derived if missing`
- Line 45: `any` (CRITICAL) -> `longitudinalRuntimeHistory?: any[];`
- Line 46: `any` (CRITICAL) -> `historicalCycles?: any[];`
- Line 47: `any` (CRITICAL) -> `scenarioStressRuntime?: any;`
- Line 48: `any` (CRITICAL) -> `operationalContinuityRuntime?: any;`

### src/core/runtime/institutional-survival/InstitutionalSurvivalHierarchyEngine.ts

- Line 77: `any` (CRITICAL) -> `const recurringLosses = historicalCycles.filter((c: any) => c.netIncome <= 0).length >= 2;`
- Line 184: `any` (CRITICAL) -> `const hasErosionHistory = historicalCycles.some((c: any) => c.endingEquity < c.startingEquity);`
- Line 187: `any` (CRITICAL) -> `const hasSurvivalHistory = historicalCycles.filter((c: any) => c.netIncome <= 0).length >= 2;`

### src/core/runtime/institutional-survival/SurvivalTypes.ts

- Line 29: `any` (CRITICAL) -> `fiduciaryOutput?: any;`
- Line 30: `any` (CRITICAL) -> `treasuryRuntime?: any;`
- Line 31: `any` (CRITICAL) -> `cashIntelligenceRuntime?: any;`
- Line 32: `any` (CRITICAL) -> `patrimonialIntelligenceRuntime?: any;`
- Line 33: `any` (CRITICAL) -> `recoveryReport?: any;`
- Line 34: `any` (CRITICAL) -> `historicalCycles?: any[];`
- Line 39: `any` (CRITICAL) -> `memoryProfile?: any;`
- Line 40: `any` (CRITICAL) -> `regressionReport?: any;`
- Line 41: `any` (CRITICAL) -> `resilienceReport?: any;`

### src/core/runtime/integrations/ConnectorExecutionEngine.ts

- Line 19: `any` (CRITICAL) -> `rawPayload: any,`

### src/core/runtime/integrations/DataIngestionGateway.ts

- Line 5: `any` (CRITICAL) -> `static receivePayload(rawInput: any): any {`
- Line 5: `any` (CRITICAL) -> `static receivePayload(rawInput: any): any {`

### src/core/runtime/integrations/DataQualityGatekeeper.ts

- Line 8: `any` (CRITICAL) -> `static inspect(payload: any, tenantId: string, workspaceId: string): DataQualityViolation[] {`

### src/core/runtime/integrations/IntegrationGovernanceTypes.ts

- Line 79: `any` (CRITICAL) -> `parsedData?: any; // To hold parsed data for staging validation`

### src/core/runtime/integrations/SchemaMappingEngine.ts

- Line 7: `any` (CRITICAL) -> `static normalizePayload(rawPayload: any): any {`
- Line 7: `any` (CRITICAL) -> `static normalizePayload(rawPayload: any): any {`

### src/core/runtime/integrity/ActionEvidenceResolver.ts

- Line 37: `any` (CRITICAL) -> `public static resolve(actionText: string, metrics: any): { domain: STRATEGIC_ACTION_DOMAIN, evidence: string; kpi: string; expectedImpact: string; executionRisk: string } | null {`

### src/core/runtime/integrity/BenchmarkGovernanceRegistry.ts

- Line 90: `any` (CRITICAL) -> `public static getBenchmark(segment: string, boardConfig?: any): SectorBenchmark {`

### src/core/runtime/integrity/BenchmarkReferenceEngine.ts

- Line 8: `any` (CRITICAL) -> `boardConfig?: any`

### src/core/runtime/integrity/EmptyCycleIntegrityEngine.ts

- Line 8: `any` (CRITICAL) -> `public static evaluate(rawData: any): boolean {`
- Line 49: `any` (CRITICAL) -> `const hasAtivo = hasBPPrecomputed ? bpSummary.ativoTotal !== undefined && bpSummary.ativoTotal !== null : bpLines.some((d: any) => {`
- Line 54: `any` (CRITICAL) -> `const hasPassivo = hasBPPrecomputed ? bpSummary.passivoTotal !== undefined && bpSummary.passivoTotal !== null : bpLines.some((d: any) => {`
- Line 59: `any` (CRITICAL) -> `const hasROL = dreLines.some((d: any) => {`
- Line 64: `any` (CRITICAL) -> `const hasEBITDA = dreLines.some((d: any) => {`

### src/core/runtime/integrity/ExecutiveActionMatrixEngine.ts

- Line 22: `any` (CRITICAL) -> `metrics: any,`
- Line 23: `any` (CRITICAL) -> `bpSummary: any,`
- Line 24: `any` (CRITICAL) -> `causality: any,`
- Line 27: `any` (CRITICAL) -> `fiduciaryOutput?: any,`
- Line 28: `any` (CRITICAL) -> `survivalReport?: any,`
- Line 29: `any` (CRITICAL) -> `recoveryReport?: any`
- Line 206: `any` (CRITICAL) -> `metrics: any,`
- Line 207: `any` (CRITICAL) -> `bp: any,`
- Line 208: `any` (CRITICAL) -> `causality: any,`

### src/core/runtime/integrity/HistoricalSeriesIntegrityEngine.ts

- Line 5: `any` (CRITICAL) -> `public static validate(chartData: any[]): boolean {`
- Line 31: `unknown` (CRITICAL) -> `recGrowth: null as unknown as number,`
- Line 32: `unknown` (CRITICAL) -> `ebitdaGrowth: null as unknown as number,`

### src/core/runtime/integrity/InvalidMetricGuard.ts

- Line 21: `any` (CRITICAL) -> `public static sanitize(val: any, fallbackType: 'NOT_APPLICABLE' | 'INSUFFICIENT' | 'UNCOMPARABLE' = 'NOT_APPLICABLE'): any {`
- Line 21: `any` (CRITICAL) -> `public static sanitize(val: any, fallbackType: 'NOT_APPLICABLE' | 'INSUFFICIENT' | 'UNCOMPARABLE' = 'NOT_APPLICABLE'): any {`

### src/core/runtime/integrity/ScaleEfficiencyIntegrityEngine.ts

- Line 21: `unknown` (CRITICAL) -> `recGrowth: null as unknown as number,`
- Line 22: `unknown` (CRITICAL) -> `ebitdaGrowth: null as unknown as number,`

### src/core/runtime/ios/CrossDomainStateResolver.ts

- Line 3: `any` (CRITICAL) -> `static resolveIntersections(tenantId: string): any {`

### src/core/runtime/ios/InstitutionalCommandCenter.ts

- Line 5: `any` (CRITICAL) -> `static getExecutiveSummary(tenantId: string): any {`

### src/core/runtime/ios/OperationalSynchronizationRuntime.ts

- Line 3: `any` (CRITICAL) -> `static synchronize(tenantId: string): any {`

### src/core/runtime/lifecycle/DFCSemanticCanonicalRootResolver.ts

- Line 5: `any` (CRITICAL) -> `lifecycleProfile?: any;`
- Line 6: `any` (CRITICAL) -> `semanticContext?: any;`
- Line 7: `any` (CRITICAL) -> `cqsSemantic?: any;`
- Line 8: `any` (CRITICAL) -> `eqsSemantic?: any;`

### src/core/runtime/lifecycle/DFCSemanticRenderingGuard.ts

- Line 30: `any` (CRITICAL) -> `static auditSemanticRoot(audit: any, renderedSource: string): any | null {`
- Line 30: `any` (CRITICAL) -> `static auditSemanticRoot(audit: any, renderedSource: string): any | null {`

### src/core/runtime/lifecycle/LifecycleSemanticConsumptionGuard.ts

- Line 4: `any` (CRITICAL) -> `public static assertLifecycleSemanticConsumption(context: any, consumedValues: {`

### src/core/runtime/lineage/LineageService.ts

- Line 6: `any` (CRITICAL) -> `static createHash(payload: any): string {`

### src/core/runtime/monitoring/InstitutionalMonitoringEngine.ts

- Line 10: `any` (CRITICAL) -> `static runCycle(tenantId: string, workspaceId: string, availableContexts: any[]): MonitoringAlert[] {`

### src/core/runtime/monitoring/LiquidityWatchEngine.ts

- Line 7: `any` (CRITICAL) -> `static evaluate(financialOutput: any, groupId: string): LiquidityHealthSignal {`

### src/core/runtime/monitoring/MonitoringExecutionScheduler.ts

- Line 10: `any` (CRITICAL) -> `static runManualCycle(tenantId: string, workspaceId: string, mockContexts: any[]) {`

### src/core/runtime/monitoring/MonitoringRuleEngine.ts

- Line 11: `any` (CRITICAL) -> `evaluate: (context: any) => {`
- Line 37: `any` (CRITICAL) -> `static runRules(context: any): MonitoringAlert[] {`

### src/core/runtime/monitoring/MonitoringTypes.ts

- Line 74: `any` (CRITICAL) -> `evaluate: (context: any) => MonitoringAlert | null;`

### src/core/runtime/monitoring/SystemicRiskTrendAnalyzer.ts

- Line 7: `any` (CRITICAL) -> `static analyze(snapshots: any[], groupId: string): SystemicRiskTrend | null {`

### src/core/runtime/observability/ConfidenceTimelineEngine.ts

- Line 11: `any` (CRITICAL) -> `} catch (err: any) {`
- Line 25: `any` (CRITICAL) -> `} catch (err: any) {`

### src/core/runtime/observability/ExecutionReplayEngine.ts

- Line 22: `unknown` (CRITICAL) -> `const snapshotReport: ConsolidatedExecutiveAdvisoryReport = record.lineageSnapshot.advisoryReport as unknown as ConsolidatedExecutiveAdvisoryReport;`

### src/core/runtime/observability/ExecutionTraceBuilder.ts

- Line 99: `any` (CRITICAL) -> `} catch (err: any) {`

### src/core/runtime/observability/GovernanceViolationHistory.ts

- Line 14: `any` (CRITICAL) -> `} catch (err: any) {`
- Line 28: `any` (CRITICAL) -> `} catch (err: any) {`

### src/core/runtime/observability/ObservedConsolidatedRuntimeService.ts

- Line 34: `unknown` (CRITICAL) -> `const modelValidation = ConsolidatedDataModelValidator.validate(rawInput as unknown as EconomicGroupModel, [], (rawInput as unknown as { intercompanyRelations?: IntercompanyRelationModel[] }).intercompanyRelations || []);`
- Line 34: `unknown` (CRITICAL) -> `const modelValidation = ConsolidatedDataModelValidator.validate(rawInput as unknown as EconomicGroupModel, [], (rawInput as unknown as { intercompanyRelations?: IntercompanyRelationModel[] }).intercompanyRelations || []);`
- Line 88: `unknown` (CRITICAL) -> `affectedEntities: ('affectedEntities' in v) ? (v as unknown as { affectedEntities: string[] }).affectedEntities : [],`
- Line 110: `unknown` (CRITICAL) -> `advisoryReport: advisoryReport as unknown // O Snapshot integral do report gerado`
- Line 133: `any` (CRITICAL) -> `} catch (err: any) {`

### src/core/runtime/observability/RuntimeExecutionRegistry.ts

- Line 9: `any` (CRITICAL) -> `} catch (err: any) {`
- Line 15: `any` (CRITICAL) -> `static log(entry: any): void {`
- Line 24: `any` (CRITICAL) -> `} catch (err: any) {`
- Line 39: `any` (CRITICAL) -> `} catch (err: any) {`
- Line 53: `any` (CRITICAL) -> `} catch (err: any) {`

### src/core/runtime/observability/RuntimeHealthMonitor.ts

- Line 47: `any` (CRITICAL) -> `} catch (err: any) {`
- Line 63: `any` (CRITICAL) -> `} catch (err: any) {`

### src/core/runtime/observability/observability-types.ts

- Line 128: `any` (CRITICAL) -> `systemicRisks: any[];`
- Line 148: `any` (CRITICAL) -> `snapshotReport: any; // Using any instead of ConsolidatedExecutiveAdvisoryReport for now to fix circular/missing imports`

### src/core/runtime/operating-pressure/InstitutionalPressureRuntime.ts

- Line 94: `any` (CRITICAL) -> `? input.historicalCycles.filter((h: any) => h.overallPressureLevel === 'ACUTE' || h.pressureScore > 85).length`

### src/core/runtime/operating-pressure/LiquidityCompressionEngine.ts

- Line 41: `any` (CRITICAL) -> `const isDistorted = diagnoses.some((d: any) => d.code === 'APPARENT_LIQUIDITY_DISTORTED_BY_INVENTORY');`

### src/core/runtime/operating-pressure/TreasuryErosionEngine.ts

- Line 54: `any` (CRITICAL) -> `(d: any) => d.code?.includes('SUSTAINABILITY_ALERT') || d.code?.includes('RISK')`

### src/core/runtime/operating-pressure/operating-pressure-types.ts

- Line 89: `any` (CRITICAL) -> `historicalCycles: any[]; // outputs from past cycles if any`
- Line 113: `any` (CRITICAL) -> `cashSustainabilityReport?: any;`
- Line 114: `any` (CRITICAL) -> `treasuryReport?: any;`
- Line 115: `any` (CRITICAL) -> `patrimonialReport?: any;`

### src/core/runtime/operating-pressure/pressure-adapter.ts

- Line 7: `any` (CRITICAL) -> `rawData: any,`
- Line 8: `any` (CRITICAL) -> `bpSummary: any,`
- Line 14: `any` (CRITICAL) -> `cashSustainabilityReport: any,`
- Line 15: `any` (CRITICAL) -> `treasuryReport: any,`
- Line 16: `any` (CRITICAL) -> `patrimonialReport: any`
- Line 27: `any` (CRITICAL) -> `const yearEntries = allHistoryData.filter((d: any) =>`
- Line 32: `any` (CRITICAL) -> `yearEntries.forEach((d: any) => {`

### src/core/runtime/operational-governance/InstitutionalOperationalGovernanceRuntime.ts

- Line 47: `unknown` (CRITICAL) -> `cycleReference: (context as unknown as { cycleReference?: string }).cycleReference || 'UNKNOWN'`
- Line 50: `unknown` (CRITICAL) -> `lineageHash: context.lineageHash as unknown as import('../shared/lineage-types').LineageHash,`

### src/core/runtime/operational-governance/operational-governance-adapter.ts

- Line 29: `any` (CRITICAL) -> `const survivalReport = (report as any).survivalReport || {};`
- Line 33: `any` (CRITICAL) -> `const capitalGov = report.capitalGovernanceReport?.fiduciaryOutput || (report as any).fiduciaryOutput || {};`
- Line 38: `any` (CRITICAL) -> `const operatingPressureSeverity = (pressure as any).overallPressureLevel || 'STABLE';`
- Line 53: `any` (CRITICAL) -> `const metadata = (report as any).metadata || {};`

### src/core/runtime/orchestrator/InstitutionalFinancialDomainOrchestrator.ts

- Line 34: `any` (CRITICAL) -> `let persistentRecommendations: any[] = [];`
- Line 35: `any` (CRITICAL) -> `let patterns: any[] = [];`
- Line 38: `any` (CRITICAL) -> `let resolutions: any[] = [];`

### src/core/runtime/performance/LazyExecutionCoordinator.ts

- Line 48: `any` (CRITICAL) -> `} catch (error: any) {`

### src/core/runtime/pilot-operations/PilotObservabilityEngine.ts

- Line 15: `any` (CRITICAL) -> `rawPayload?: any`

### src/core/runtime/predictive-intelligence/BehavioralAccelerationEngine.ts

- Line 22: `any` (CRITICAL) -> `report: any`

### src/core/runtime/predictive-intelligence/DeteriorationMomentumEngine.ts

- Line 34: `any` (CRITICAL) -> `report: any,`

### src/core/runtime/predictive-intelligence/InstitutionalResilienceEngine.ts

- Line 22: `any` (CRITICAL) -> `report: any,`

### src/core/runtime/predictive-intelligence/PredictiveGovernanceEngine.ts

- Line 31: `any` (CRITICAL) -> `finalProfile: any;`
- Line 41: `any` (CRITICAL) -> `report: any,`
- Line 151: `any` (CRITICAL) -> `report: any,`
- Line 164: `any` (CRITICAL) -> `let domains: any[] = [];`
- Line 253: `any` (CRITICAL) -> `function driftPropertyWarning(severity: any): boolean {`

### src/core/runtime/predictive-intelligence/RecoveryViabilityEngine.ts

- Line 24: `any` (CRITICAL) -> `report: any,`

### src/core/runtime/predictive-intelligence/StrategicCollapseRiskEngine.ts

- Line 22: `any` (CRITICAL) -> `report: any,`

### src/core/runtime/prescriptive-governance/BoardAgendaEngine.ts

- Line 7: `any` (CRITICAL) -> `scoreOutput: any`

### src/core/runtime/prescriptive-governance/PrescriptiveActionEngine.ts

- Line 55: `any` (CRITICAL) -> `if (risk.category === 'LIQUIDITY_RISK' as any) {`
- Line 64: `any` (CRITICAL) -> `if (risk.category === 'GOVERNANCE_RISK' as any) {`
- Line 73: `any` (CRITICAL) -> `if (risk.category === 'EXECUTION_RISK' as any) {`
- Line 82: `any` (CRITICAL) -> `if (risk.category === 'CAPITAL_RISK' as any) {`

### src/core/runtime/presentation-governance/DFCSnapshotBindingAudit.ts

- Line 2: `any` (CRITICAL) -> `cashGenerationStatus: any;`
- Line 3: `any` (CRITICAL) -> `runwayStatus: any;`
- Line 4: `any` (CRITICAL) -> `shareholderDependencyStatus: any;`
- Line 5: `any` (CRITICAL) -> `primaryRisk: any;`
- Line 6: `any` (CRITICAL) -> `recommendedAction: any;`

### src/core/runtime/presentation-governance/ExecutiveLanguageLeakAudit.ts

- Line 21: `any` (CRITICAL) -> `public static audit(target: any, layer: PresentationLayer): LanguageLeakAuditResult {`
- Line 63: `any` (CRITICAL) -> `const traverse = (obj: any, key?: string) => {`

### src/core/runtime/presentation-governance/ExecutiveNumericPresentationGuard.ts

- Line 11: `unknown` (CRITICAL) -> `public static isValid(value: unknown): boolean {`
- Line 26: `unknown` (CRITICAL) -> `public static formatSafe(value: unknown, formatter: (val: number) => string): string {`

### src/core/runtime/presentation-governance/ExecutivePresentationAuditEngine.ts

- Line 21: `any` (CRITICAL) -> `public static audit(target: any, layer: PresentationLayer): AuditEngineResult {`
- Line 52: `any` (CRITICAL) -> `const traverse = (obj: any, key?: string) => {`

### src/core/runtime/product-governance/BillingPreparationEngine.ts

- Line 14: `any` (CRITICAL) -> `static async handleWebhookEvent(payload: any): Promise<void> {`

### src/core/runtime/product-governance/DemoModeGovernance.ts

- Line 17: `unknown` (CRITICAL) -> `subscription.quotasState = ({ MAX_SCENARIOS: 1, MAX_UPLOADS: 1, MAX_BOARD_PACKS: 1, MAX_MONITORING_CYCLES: 1, MAX_WORKSPACES: 1 } as unknown) as Record<import('./ProductGovernanceTypes').QuotaId, number>;`
- Line 21: `unknown` (CRITICAL) -> `'DEMO_RESET' as unknown as "DEMO_RESET" | "FEATURE_GRANTED",`

### src/core/runtime/profiling/RuntimeMemoryTracker.ts

- Line 10: `any` (CRITICAL) -> `static estimatePayloadSize(action: string, payload: any): number {`

### src/core/runtime/prudency/InstitutionalPrudencyLayer.ts

- Line 56: `any` (CRITICAL) -> `resolveCompositeCap(context: any): number {`
- Line 72: `any` (CRITICAL) -> `context: any`

### src/core/runtime/publication-governance/BoardPackGovernanceEngine.ts

- Line 13: `any` (CRITICAL) -> `report: any,`

### src/core/runtime/publication-governance/ExecutivePublicationRuntime.ts

- Line 29: `any` (CRITICAL) -> `report: any,`
- Line 30: `any` (CRITICAL) -> `validationResult: any,`
- Line 31: `any` (CRITICAL) -> `advisoryNarrative: any,`
- Line 41: `any` (CRITICAL) -> `Object.values(advisoryNarrative.sections).forEach((sec: any) => {`

### src/core/runtime/publication-governance/NarrativeConsistencyEngine.ts

- Line 11: `any` (CRITICAL) -> `report: any,`
- Line 12: `any` (CRITICAL) -> `validationResult: any,`
- Line 13: `any` (CRITICAL) -> `advisoryNarrative: any`

### src/core/runtime/publication-governance/PublicationLineageEngine.ts

- Line 11: `any` (CRITICAL) -> `report: any,`
- Line 12: `any` (CRITICAL) -> `validationResult: any,`

### src/core/runtime/publication-governance/ReportIntegrityEngine.ts

- Line 11: `any` (CRITICAL) -> `report: any,`
- Line 12: `any` (CRITICAL) -> `validationResult: any`

### src/core/runtime/recovery-regression/RecoveryRegressionTypes.ts

- Line 27: `any` (CRITICAL) -> `recoveryReport?: any;`
- Line 28: `any` (CRITICAL) -> `survivalReport?: any;`
- Line 29: `any` (CRITICAL) -> `fiduciaryOutput?: any;`
- Line 30: `any` (CRITICAL) -> `treasuryRuntime?: any;`
- Line 31: `any` (CRITICAL) -> `cashIntelligenceRuntime?: any;`
- Line 32: `any` (CRITICAL) -> `patrimonialIntelligenceRuntime?: any;`
- Line 33: `any` (CRITICAL) -> `liquidityStressRuntime?: any;`
- Line 34: `any` (CRITICAL) -> `longitudinalRuntimeHistory?: any[];`
- Line 35: `any` (CRITICAL) -> `operationalContinuityRuntime?: any;`
- Line 36: `any` (CRITICAL) -> `governanceTrajectoryRuntime?: any;`
- Line 39: `any` (CRITICAL) -> `historicalCycles?: any[];`
- Line 41: `any` (CRITICAL) -> `memoryProfile?: any;`
- Line 42: `any` (CRITICAL) -> `resilienceReport?: any;`

### src/core/runtime/reporting/ReportingTypes.ts

- Line 24: `any` (CRITICAL) -> `systemicRisks: any[]; // vindo do Advisory`
- Line 59: `any` (CRITICAL) -> `systemicRisks: any[];`

### src/core/runtime/scenario/ScenarioPropagationRuntime.ts

- Line 17: `unknown` (CRITICAL) -> `for (const relation of (stressedInput as unknown as { intercompanyRelations?: { fromEntityId: string, toEntityId: string, amount: number, materiality: string }[] }).intercompanyRelations || []) {`

### src/core/runtime/scenario-intelligence/InstitutionalScenarioEngine.ts

- Line 10: `any` (CRITICAL) -> `public static evaluateScenario(inputs: ScenarioInput[], contextData: any): InstitutionalScenarioResult {`

### src/core/runtime/scenario-intelligence/InstitutionalStressTestEngine.ts

- Line 15: `any` (CRITICAL) -> `contextData: any`

### src/core/runtime/scenario-intelligence/PropagationSimulationEngine.ts

- Line 5: `any` (CRITICAL) -> `public static simulate(inputs: ScenarioInput[], contextData: any): PropagationSimulationProfile {`

### src/core/runtime/scenario-intelligence/ScenarioBaselineValidator.ts

- Line 2: `any` (CRITICAL) -> `public static validate(baselineContext: any): {`

### src/core/runtime/scenario-intelligence/ScenarioComparisonEngine.ts

- Line 10: `any` (CRITICAL) -> `public static compare(baselineContext: any, scenarioContext: any): ScenarioComparison[] {`
- Line 10: `any` (CRITICAL) -> `public static compare(baselineContext: any, scenarioContext: any): ScenarioComparison[] {`

### src/core/runtime/scenario-intelligence/ScenarioConstraintEngine.ts

- Line 9: `any` (CRITICAL) -> `public static validate(inputs: ScenarioInput[], contextData: any): ScenarioConstraintValidation {`

### src/core/runtime/scenario-intelligence/ScenarioExplainabilityEngine.ts

- Line 7: `any` (CRITICAL) -> `baselineContext: any,`
- Line 8: `any` (CRITICAL) -> `simulationInputs: any[],`

### src/core/runtime/scenario-intelligence/ScenarioImpactRuntime.ts

- Line 14: `any` (CRITICAL) -> `baselineContext: any,`
- Line 80: `any` (CRITICAL) -> `private static mapDecisionToMutation(actionId: string): any {`

### src/core/runtime/scenario-intelligence/ScenarioMutationEngine.ts

- Line 5: `any` (CRITICAL) -> `public static applyMutations(baselineContext: any, mutations: ScenarioMutation[]): any {`
- Line 5: `any` (CRITICAL) -> `public static applyMutations(baselineContext: any, mutations: ScenarioMutation[]): any {`

### src/core/runtime/scenario-intelligence/ScenarioSurvivabilityFilter.ts

- Line 4: `any` (CRITICAL) -> `public static validate(baselineContext: any, mutations: ScenarioMutation[]): {`

### src/core/runtime/strategic-intelligence/strategic-intelligence-adapter.ts

- Line 12: `any` (CRITICAL) -> `lineageHash: report.runtimeMetadata?.lineageHash || (report as any).metadata?.lineageHash || 'UNVERIFIED',`
- Line 13: `any` (CRITICAL) -> `tenantId: report.institutionalContext?.tenantId || (report as any).metadata?.tenantId || 'UNKNOWN',`
- Line 14: `any` (CRITICAL) -> `cycleReference: report.institutionalContext?.currentCycle || (report as any).metadata?.cycleReference || 'UNKNOWN',`
- Line 15: `any` (CRITICAL) -> `historicalCyclesCount: report.runtimeMetadata?.historicalCyclesAvailable || (report as any).metadata?.historicalCyclesCount || 0,`
- Line 18: `unknown` (CRITICAL) -> `fundingDependenceLevel: (report.capitalGovernanceReport as unknown as { metrics?: { fundingDependenceLevel?: string } })?.metrics?.fundingDependenceLevel || 'UNKNOWN',`
- Line 35: `unknown` (CRITICAL) -> `directives: (report.treasuryIntelligenceReport as unknown as { directives?: string[] }).directives ||`
- Line 37: `unknown` (CRITICAL) -> `stressStatus: (report.treasuryIntelligenceReport as unknown as { stressStatus?: string }).stressStatus ||`
- Line 41: `unknown` (CRITICAL) -> `structuralPressureSeverity: (report.operatingPressureReport as unknown as { structuralPressureSeverity?: string }).structuralPressureSeverity ||`

### src/core/runtime/strategic-simulation/ExecutiveScenarioEngine.ts

- Line 28: `any` (CRITICAL) -> `report: any,`

### src/core/runtime/strategic-simulation/GovernanceImpactSimulationEngine.ts

- Line 11: `any` (CRITICAL) -> `report: any,`

### src/core/runtime/strategic-simulation/InstitutionalPreservationEngine.ts

- Line 14: `any` (CRITICAL) -> `initialReport: any`

### src/core/runtime/strategic-simulation/LiquidityTrajectoryEngine.ts

- Line 10: `any` (CRITICAL) -> `public static calculateRunway(report: any): number {`
- Line 43: `any` (CRITICAL) -> `report: any,`

### src/core/runtime/strategic-simulation/ScenarioStressEngine.ts

- Line 14: `any` (CRITICAL) -> `report: any,`
- Line 16: `any` (CRITICAL) -> `): { stressedReport: any; assumptions: string[]; traceHash: string } {`

### src/core/runtime/strategic-simulation/StrategicSimulationEngine.ts

- Line 30: `any` (CRITICAL) -> `initialReport: any,`

### src/core/runtime/temporal-governance/TemporalEvidenceFilter.ts

- Line 4: `any` (CRITICAL) -> `filteredRawData: any;`
- Line 9: `any` (CRITICAL) -> `public static filter(rawData: any, analysisYear: number): FilterResult {`
- Line 36: `any` (CRITICAL) -> `const collectYears = (arr: any[]) => {`
- Line 71: `any` (CRITICAL) -> `const filterArray = (arr: any[]) => {`
- Line 113: `any` (CRITICAL) -> `public static filterByAnalysisYear(cycles: any[], analysisYear: number): any[] {`
- Line 113: `any` (CRITICAL) -> `public static filterByAnalysisYear(cycles: any[], analysisYear: number): any[] {`

### src/core/runtime/tenancy/TenancyTypes.ts

- Line 45: `any` (CRITICAL) -> `metadata?: any;`

### src/core/runtime/tenancy/TenantAuditLogger.ts

- Line 14: `any` (CRITICAL) -> `metadata?: any`

### src/core/runtime/tenancy/hardening/TenantGovernanceEnforcer.ts

- Line 35: `any` (CRITICAL) -> `} catch (error: any) {`
- Line 45: `any` (CRITICAL) -> `} catch (error: any) {`

### src/core/runtime/tenancy/hardening/TenantOwnershipValidator.ts

- Line 14: `unknown` (CRITICAL) -> `const id = entity.id || (entity as unknown as { entityId?: string }).entityId;`

### src/core/runtime/treasury-intelligence/TreasuryIntelligenceRuntime.ts

- Line 344: `any` (CRITICAL) -> `private static generateLineageHash(inputs: any[]): string {`

### src/core/runtime/ux-hardening/OperationalFrictionAnalyzer.ts

- Line 3: `any` (CRITICAL) -> `static analyze(tenantId: string): any {`

### src/core/runtime/ux-hardening/UXValidationAuditLogger.ts

- Line 7: `any` (CRITICAL) -> `private static logs: any[] = [];`

### src/core/runtime/validation/MockBoardPackScenarios.ts

- Line 1: `any` (CRITICAL) -> `export const MockBoardPackScenarios: any = {};`

### src/core/runtime/validation/ValidationDatasetFactory.ts

- Line 36: `unknown` (CRITICAL) -> `} as unknown as ConsolidatedRuntimeInputExt;`

### src/core/runtime/war-gaming/LongitudinalCrisisMemoryEngine.ts

- Line 6: `any` (CRITICAL) -> `private static mockMemory: any[] = [];`
- Line 29: `any` (CRITICAL) -> `public static getHistoricalCrises(): any[] {`

### src/core/runtime/war-gaming/war-game-adapter.ts

- Line 14: `any` (CRITICAL) -> `rawData: any`
- Line 27: `any` (CRITICAL) -> `const receitaNode = dreData.find((d: any) => d.category?.toUpperCase().includes('RECEITA') && d.category?.toUpperCase().includes('LÍQUIDA'));`
- Line 30: `any` (CRITICAL) -> `const ebitdaNode = dreData.find((d: any) => d.category === 'EBITDA');`
- Line 33: `any` (CRITICAL) -> `const custoNode = dreData.find((d: any) => d.category?.toUpperCase().includes('CUSTO'));`
- Line 38: `any` (CRITICAL) -> `const fcoNode = dfcData.find((d: any) => d.category === 'FCO');`

### src/hooks/useBoardCopilot.ts

- Line 17: `any` (HIGH) -> `export function useBoardCopilot(baseReport: any, prescriptiveData: any) {`
- Line 17: `any` (HIGH) -> `export function useBoardCopilot(baseReport: any, prescriptiveData: any) {`
- Line 32: `any` (HIGH) -> `prescriptiveData.boardAgenda.items.forEach((item: any, index: number) => {`
- Line 40: `any` (HIGH) -> `prescriptiveData.boardResolutions.forEach((res: any, index: number) => {`

### src/hooks/useBoardMode.ts

- Line 6: `any` (HIGH) -> `risks: any;`
- Line 7: `any` (HIGH) -> `attentionItems: any[];`
- Line 8: `any` (HIGH) -> `resolutions: any[];`
- Line 9: `any` (HIGH) -> `agenda: any;`

### src/hooks/useCurrencyRates.ts

- Line 20: `any` (HIGH) -> `const exchangeSecao = (DATA as any).premissas?.economicas?.find(`
- Line 21: `any` (HIGH) -> `(s: any) => s.categoria?.includes('Câmbio')`
- Line 24: `any` (HIGH) -> `exchangeSecao?.indicadores?.find((i: any) => i.nome?.includes('Dólar'))`
- Line 28: `any` (HIGH) -> `exchangeSecao?.indicadores?.find((i: any) => i.nome?.includes('Euro'))`

### src/hooks/useDataTable.ts

- Line 3: `any` (HIGH) -> `export function useDataTable(data: any[], config: {`
- Line 7: `any` (HIGH) -> `customFilter?: (item: any, currentFilters: Record<string, string>) => boolean;`

### src/hooks/useExecutiveAdvisory.ts

- Line 10: `any` (HIGH) -> `export function useExecutiveAdvisory(clientId: string, year: number, month: number, rawClientData?: any) {`
- Line 21: `any` (HIGH) -> `const getVal = (data: any[], name: string) => data.find(d => d.category === name || d.conta === name)?.value || data.find(d => d.category === name || d.conta === name)?.val || 0;`
- Line 39: `any` (HIGH) -> `const metrics = calculateFinancialMetrics(bpSummary as any, dreEbitda, dreLucro, clientSector);`
- Line 43: `any` (HIGH) -> `const identity: BusinessIdentity = inferBusinessIdentity(clientSector, 0, bpSummary as any, undefined);`
- Line 46: `tsIgnore` (HIGH) -> `// @ts-ignore`
- Line 96: `tsIgnore` (HIGH) -> `// @ts-ignore`

### src/hooks/useFinancialData.ts

- Line 8: `any` (HIGH) -> `if ((globalThis as any).__mockUseFinancialData) {`
- Line 9: `any` (HIGH) -> `return (globalThis as any).__mockUseFinancialData(clientId, year, month, type);`
- Line 36: `any` (HIGH) -> `const allEntries: any[] = [];`
- Line 38: `any` (HIGH) -> `const docData = doc.data() as any;`
- Line 47: `any` (HIGH) -> `docData.data.forEach((entry: any) => {`
- Line 67: `any` (HIGH) -> `} catch (e: any) {`
- Line 91: `any` (HIGH) -> `if ((globalThis as any).__mockUseAllFinancialData) {`
- Line 92: `any` (HIGH) -> `return (globalThis as any).__mockUseAllFinancialData(clientId);`
- Line 112: `any` (HIGH) -> `const allEntries: any[] = [];`
- Line 114: `any` (HIGH) -> `const docData = doc.data() as any;`
- Line 121: `any` (HIGH) -> `docData.data.forEach((entry: any) => {`
- Line 153: `any` (HIGH) -> `} catch (e: any) {`
- Line 186: `any` (HIGH) -> `if ((globalThis as any).__mockUseAnnualFinancialData) {`
- Line 187: `any` (HIGH) -> `return (globalThis as any).__mockUseAnnualFinancialData(clientId, year, type);`
- Line 208: `any` (HIGH) -> `const allEntries: any[] = [];`
- Line 214: `any` (HIGH) -> `const docData = docSnap.data() as any;`
- Line 223: `any` (HIGH) -> `docData.data.forEach((entry: any) => {`
- Line 301: `any` (HIGH) -> `let finalEntries: any[] = [];`
- Line 384: `any` (HIGH) -> `} catch (e: any) {`

### src/hooks/useFinancialMath.ts

- Line 5: `any` (HIGH) -> `aggregatePositions: (positions: any[], exchangeRates: Record<string, number>) => {`
- Line 21: `any` (HIGH) -> `aggregateHistory: (positions: any[], exchangeRates: Record<string, number>, monthOrder: string[]) => {`
- Line 28: `any` (HIGH) -> `let allMonths = Array.from(new Set(positions.flatMap(p => p.historico?.map((h: any) => normalizeMonth(h.mes)) || []))) as string[];`
- Line 41: `any` (HIGH) -> `const hist = p.historico?.find((h: any) => normalizeMonth(h.mes) === m);`
- Line 50: `any` (HIGH) -> `calculateTotalValue: (items: any[], valueKey: string) => {`

### src/hooks/useHistoricalDemonstracoes.ts

- Line 53: `any` (HIGH) -> `const docData = docSnap.data() as any;`
- Line 63: `any` (HIGH) -> `docData.data.forEach((entry: any) => {`
- Line 109: `any` (HIGH) -> `} catch (e: any) {`

### src/hooks/useInstitutionalRuntime.ts

- Line 7: `any` (HIGH) -> `input: any;`
- Line 11: `any` (HIGH) -> `if ((globalThis as any).__mockUseInstitutionalRuntime) {`
- Line 12: `any` (HIGH) -> `return (globalThis as any).__mockUseInstitutionalRuntime({ engineType, input });`

### src/hooks/useMethodologicalAnalysis.ts

- Line 6: `any` (HIGH) -> `export function useMethodologicalAnalysis(clientId: string, year: number, month: number, dbDre: any[], dbBp: any[]) {`
- Line 6: `any` (HIGH) -> `export function useMethodologicalAnalysis(clientId: string, year: number, month: number, dbDre: any[], dbBp: any[]) {`
- Line 7: `any` (HIGH) -> `const [analysis, setAnalysis] = useState<any>(null);`
- Line 54: `any` (HIGH) -> `} catch (err: any) {`
- Line 85: `any` (HIGH) -> `setAnalysis((prev: any) => ({`
- Line 92: `any` (HIGH) -> `} catch (err: any) {`

### src/hooks/useModuleData.ts

- Line 48: `any` (HIGH) -> `const add = async (item: any): Promise<string> => {`
- Line 65: `any` (HIGH) -> `} catch (err: any) {`
- Line 72: `any` (HIGH) -> `const update = async (id: string, item: any) => {`
- Line 83: `any` (HIGH) -> `} catch (err: any) {`
- Line 93: `any` (HIGH) -> `} catch (err: any) {`

### src/hooks/usePaginatedData.ts

- Line 18: `any` (HIGH) -> `filters: { field: string; operator: any; value: any }[];`
- Line 18: `any` (HIGH) -> `filters: { field: string; operator: any; value: any }[];`
- Line 63: `any` (HIGH) -> `...(doc.data() as any)`
- Line 74: `any` (HIGH) -> `} catch (err: any) {`

### src/hooks/useRealIndicatorData.ts

- Line 126: `any` (HIGH) -> `let mappedAccounts: any[] = [];`
- Line 127: `any` (HIGH) -> `let allEntries: any[] = [];`
- Line 128: `any` (HIGH) -> `let currentAssets: any[] = [];`
- Line 129: `any` (HIGH) -> `let currentCashFlows: any[] = [];`
- Line 130: `any` (HIGH) -> `let currentPositions: any[] = [];`
- Line 131: `any` (HIGH) -> `let currentPayables: any[] = [];`
- Line 132: `any` (HIGH) -> `let currentReceivables: any[] = [];`
- Line 140: `any` (HIGH) -> `mappedAccounts.forEach((acc: any) => {`
- Line 142: `any` (HIGH) -> `.filter((e: any) => e.category === acc.name)`
- Line 143: `any` (HIGH) -> `.reduce((s: number, e: any) => s + (Number(e.value) || 0), 0);`
- Line 160: `any` (HIGH) -> `.filter((e: any) => {`
- Line 183: `any` (HIGH) -> `.reduce((s: number, e: any) => s + (Number(e.value || e.valor || e.val) || 0), 0);`
- Line 207: `any` (HIGH) -> `overdueLiabilities = passivo.reduce((s: number, p: any) => s + (Number(p.Valor) || 0), 0);`
- Line 216: `any` (HIGH) -> `const bpEntries = allEntries.filter((e: any) => {`
- Line 254: `any` (HIGH) -> `data.data.forEach((entry: any) => {`

### src/hooks/useScenarioExecutionIntelligence.ts

- Line 5: `any` (HIGH) -> `valuationOutput: any,`
- Line 6: `any` (HIGH) -> `scenarioValuationInput: any,`
- Line 7: `any` (HIGH) -> `efosSnapshot: any,`
- Line 9: `any` (HIGH) -> `scenarioImpacts: any[]`

### src/hooks/useScenarioSimulation.ts

- Line 39: `any` (HIGH) -> `} catch (err: any) {`

### src/lib/firebase.ts

- Line 74: `unknown` (CRITICAL) -> `export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {`

### src/runtime/FiscalYearScopeBuilder.ts

- Line 7: `any` (CRITICAL) -> `bp: any[];`
- Line 8: `any` (CRITICAL) -> `dre: any[];`
- Line 9: `any` (CRITICAL) -> `dfc: any[];`
- Line 10: `any` (CRITICAL) -> `dlpa: any[];`
- Line 11: `any` (CRITICAL) -> `indicators: any[];`
- Line 13: `any` (CRITICAL) -> `previousYearsData: any[];`
- Line 14: `any` (CRITICAL) -> `historicalDataToDate: any[];`
- Line 15: `any` (CRITICAL) -> `futureYearsData?: any[]; // optional, ideally not passed to annual engines`
- Line 28: `any` (CRITICAL) -> `allHistoryData: any[];`
- Line 35: `any` (CRITICAL) -> `const currentYearRecords = allHistoryData.filter((x: any) => Number(x.year) === selectedYearNum);`
- Line 36: `any` (CRITICAL) -> `const previousYearsData = allHistoryData.filter((x: any) => Number(x.year) < selectedYearNum);`
- Line 37: `any` (CRITICAL) -> `const historicalDataToDate = allHistoryData.filter((x: any) => Number(x.year) <= selectedYearNum);`
- Line 38: `any` (CRITICAL) -> `const futureYearsData = allHistoryData.filter((x: any) => Number(x.year) > selectedYearNum);`
- Line 42: `any` (CRITICAL) -> `bp: currentYearRecords.filter((x: any) => x.type === 'Ativo' || x.type === 'Passivo' || x.docType === 'BP' || String(x.type).toUpperCase().includes('BP')),`
- Line 43: `any` (CRITICAL) -> `dre: currentYearRecords.filter((x: any) => x.type === 'DRE' || x.docType === 'DRE'),`
- Line 44: `any` (CRITICAL) -> `dfc: currentYearRecords.filter((x: any) => x.type === 'DFC' || x.docType === 'DFC'),`
- Line 45: `any` (CRITICAL) -> `dlpa: currentYearRecords.filter((x: any) => x.type === 'DLPA' || x.docType === 'DLPA'),`
- Line 46: `any` (CRITICAL) -> `indicators: currentYearRecords.filter((x: any) => x.type === 'INDICATOR' || x.category === 'Indicator')`
- Line 49: `any` (CRITICAL) -> `const distinctFiscalYears = new Set(historicalDataToDate.map((x: any) => Number(x.year)));`

### src/runtime/FiscalYearScopeGuard.ts

- Line 1: `any` (CRITICAL) -> `export function assertNoFutureYearLeakage(records: any[], selectedYear: number): { violation: string, severity: 'CRITICAL', yearsDetected: number[] } | null {`

### src/runtime/InferencePipeline.ts

- Line 49: `any` (CRITICAL) -> `} catch (error: any) {`

### src/runtime/InstitutionalExecutionContext.ts

- Line 13: `any` (CRITICAL) -> `let tempValidation: any = null;`

### src/runtime/adapters/BoardRiskMatrixAdapter.ts

- Line 143: `any` (CRITICAL) -> `const yearEntries = allHistoryData.filter((d: any) => Number(d.year) === y);`
- Line 144: `any` (CRITICAL) -> `const hasDRE = yearEntries.some((d: any) => d.type === 'dre' || d.docType === 'dre' || d.entryType === 'dre');`
- Line 146: `any` (CRITICAL) -> `const yearLL = yearEntries.find((d: any) => {`
- Line 164: `any` (CRITICAL) -> `const yearEntries = allHistoryData.filter((d: any) => Number(d.year) === y);`
- Line 165: `any` (CRITICAL) -> `const ebitdaRow = yearEntries.find((d: any) => (d.conta || d.category || '').toLowerCase().includes('ebitda'));`
- Line 166: `any` (CRITICAL) -> `const revRow = yearEntries.find((d: any) => (d.conta || d.category || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes('receita liquida'));`
- Line 188: `any` (CRITICAL) -> `const prevLL = allHistoryData.find((d: any) => Number(d.year) === filterYear - 1 && (d.conta || d.category || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes('lucro liquido'));`
- Line 407: `any` (CRITICAL) -> `} catch (e: any) {`

### src/runtime/adapters/CapitalGovernanceAdapter.ts

- Line 16: `any` (CRITICAL) -> `const matchDocType = (d: any, docTypes: string[]) => {`
- Line 26: `any` (CRITICAL) -> `export function extractSovereignNetIncome(allHistoryData: any[], filterYear: number, input: any): number | null {`
- Line 26: `any` (CRITICAL) -> `export function extractSovereignNetIncome(allHistoryData: any[], filterYear: number, input: any): number | null {`
- Line 27: `any` (CRITICAL) -> `const dreEntries = allHistoryData.filter((d: any) =>`
- Line 42: `any` (CRITICAL) -> `const matchedEntry = dreEntries.find((d: any) => {`
- Line 67: `any` (CRITICAL) -> `allHistoryData: any[],`
- Line 69: `any` (CRITICAL) -> `input: any,`
- Line 70: `any` (CRITICAL) -> `financialInf: any`
- Line 76: `any` (CRITICAL) -> `const bpEntries = allHistoryData.filter((d: any) =>`
- Line 90: `any` (CRITICAL) -> `const matchedEntry = bpEntries.find((d: any) => {`
- Line 145: `any` (CRITICAL) -> `context?: any;`
- Line 215: `any` (CRITICAL) -> `const bpEntriesForLp = allHistoryData.filter((d: any) =>`
- Line 219: `any` (CRITICAL) -> `const lpEntry = bpEntriesForLp.find((e: any) => {`
- Line 237: `any` (CRITICAL) -> `const currentYearEntries = allHistoryData.filter((d: any) => Number(d.year) === filterYear);`
- Line 240: `any` (CRITICAL) -> `const divEntry = currentYearEntries.find((d: any) => {`
- Line 251: `any` (CRITICAL) -> `const capInjEntry = currentYearEntries.find((d: any) => {`
- Line 322: `any` (CRITICAL) -> `const foundationYear = input.foundationYear ?? (context.input as any)?.foundationYear ?? (context.input as any)?.rawFinancialData?.foundationYear;`
- Line 322: `any` (CRITICAL) -> `const foundationYear = input.foundationYear ?? (context.input as any)?.foundationYear ?? (context.input as any)?.rawFinancialData?.foundationYear;`
- Line 323: `any` (CRITICAL) -> `const historicalCycles = input.historicalCyclesCount ?? (context.input as any)?.historicalCyclesCount ?? (allHistoryData.length > 0 ? Array.from(new Set(allHistoryData.map((d: any) => Number(d.year)))).filter((y: any) => Number(y) > 0).length : 0);`
- Line 323: `any` (CRITICAL) -> `const historicalCycles = input.historicalCyclesCount ?? (context.input as any)?.historicalCyclesCount ?? (allHistoryData.length > 0 ? Array.from(new Set(allHistoryData.map((d: any) => Number(d.year)))).filter((y: any) => Number(y) > 0).length : 0);`
- Line 323: `any` (CRITICAL) -> `const historicalCycles = input.historicalCyclesCount ?? (context.input as any)?.historicalCyclesCount ?? (allHistoryData.length > 0 ? Array.from(new Set(allHistoryData.map((d: any) => Number(d.year)))).filter((y: any) => Number(y) > 0).length : 0);`
- Line 332: `any` (CRITICAL) -> `allHistoryData.forEach((d: any) => {`
- Line 341: `any` (CRITICAL) -> `allHistoryData.forEach((d: any) => {`
- Line 411: `any` (CRITICAL) -> `const extraViolations: any[] = [];`
- Line 438: `any` (CRITICAL) -> `const renderingPayload = (context.input as any)?.renderingPayload || input?.renderingPayload;`
- Line 466: `any` (CRITICAL) -> `lineageStatus: status as any`
- Line 471: `recordStringAny` (CRITICAL) -> `const lineageAudit: Record<string, any> = {`
- Line 498: `any` (CRITICAL) -> `let propagationViolations: any[] = [];`
- Line 512: `any` (CRITICAL) -> `context.violations = context.violations.filter((v: any) => !v.message.includes('Capital Social ausente ou inválido'));`
- Line 603: `any` (CRITICAL) -> `violations: finalViolations.length > 0 ? finalViolations as any : undefined`
- Line 606: `any` (CRITICAL) -> `} catch (error: any) {`
- Line 616: `any` (CRITICAL) -> `} as any]`

### src/runtime/adapters/CreditCommitteeSimulatorAdapter.ts

- Line 92: `any` (CRITICAL) -> `const trajectoryPoints: any[] = [];`
- Line 248: `any` (CRITICAL) -> `const entries = allHistoryData.filter((d: any) => Number(d.year) === year);`
- Line 249: `any` (CRITICAL) -> `const match = entries.find((d: any) => {`
- Line 601: `any` (CRITICAL) -> `const getDeltaComparison = (otherScenario: any) => {`
- Line 669: `any` (CRITICAL) -> `} catch (e: any) {`

### src/runtime/adapters/EconomicNormalizationAdapter.ts

- Line 31: `any` (CRITICAL) -> `const matchDocType = (d: any, docTypes: string[]): boolean => {`
- Line 46: `any` (CRITICAL) -> `const yearEntries = allHistoryData.filter((d: any) => {`
- Line 54: `any` (CRITICAL) -> `yearEntries.forEach((d: any) => {`
- Line 64: `any` (CRITICAL) -> `const yearEntries = allHistoryData.filter((d: any) => {`
- Line 71: `any` (CRITICAL) -> `const match = yearEntries.find((d: any) => {`
- Line 221: `any` (CRITICAL) -> `const yearEntries = allHistoryData.filter((d: any) => Number(d.year) === y);`
- Line 222: `any` (CRITICAL) -> `const hasDRE = yearEntries.some((d: any) => matchDocType(d, ['dre', 'resultado']));`
- Line 426: `any` (CRITICAL) -> `} catch (err: any) {`

### src/runtime/adapters/ExecutiveDecisionAdapter.ts

- Line 119: `any` (CRITICAL) -> `} catch (e: any) {`

### src/runtime/adapters/ExecutiveExecutionAdapter.ts

- Line 295: `any` (CRITICAL) -> `const sdeMatch = sdeDecs.find((s: any) => s.id === rec.decisionId || s.id === rec.sdeLineage?.id);`
- Line 391: `any` (CRITICAL) -> `sdeRecommendations.forEach((recSde: any) => {`
- Line 706: `any` (CRITICAL) -> `} catch (e: any) {`

### src/runtime/adapters/FinancialLineageIntegrityAdapter.ts

- Line 88: `any` (CRITICAL) -> `const yearEntries = allHistoryData.filter((d: any) => {`
- Line 94: `any` (CRITICAL) -> `yearEntries.forEach((d: any) => {`
- Line 348: `any` (CRITICAL) -> `} catch (e: any) {`

### src/runtime/adapters/InstitutionalMemoryAdapter.ts

- Line 30: `any` (CRITICAL) -> `const matchDocType = (d: any, docTypes: string[]): boolean => {`
- Line 45: `any` (CRITICAL) -> `const yearEntries = allHistoryData.filter((d: any) => {`
- Line 53: `any` (CRITICAL) -> `yearEntries.forEach((d: any) => {`
- Line 63: `any` (CRITICAL) -> `const yearEntries = allHistoryData.filter((d: any) => {`
- Line 70: `any` (CRITICAL) -> `const match = yearEntries.find((d: any) => {`
- Line 78: `any` (CRITICAL) -> `const yearsInDb = Array.from(new Set(allHistoryData.map((d: any) => Number(d.year)).filter(Boolean)));`
- Line 570: `any` (CRITICAL) -> `} catch (e: any) {`

### src/runtime/adapters/LegacyDFCAdapter.ts

- Line 18: `any` (CRITICAL) -> `export function extractSovereignNetIncomeWithAccount(dre: any[]): { value: number; account: string } | null {`
- Line 49: `any` (CRITICAL) -> `const matchedEntry = dre.find((d: any) => {`
- Line 72: `any` (CRITICAL) -> `export function extractSovereignNetIncome(dre: any[]): number | null {`
- Line 110: `any` (CRITICAL) -> `const matchDocType = (d: any, docTypes: string[]) => {`
- Line 121: `any` (CRITICAL) -> `const yearEntries = allHistoryData.filter((d: any) =>`
- Line 125: `any` (CRITICAL) -> `const match = yearEntries.find((d: any) => {`
- Line 133: `any` (CRITICAL) -> `const yearEntries = allHistoryData.filter((d: any) =>`
- Line 138: `any` (CRITICAL) -> `yearEntries.forEach((d: any) => {`
- Line 148: `any` (CRITICAL) -> `const yearEntries = allHistoryData.filter((d: any) =>`
- Line 154: `any` (CRITICAL) -> `yearEntries.forEach((d: any) => {`
- Line 168: `any` (CRITICAL) -> `const isOfficialDfcAvailable = allHistoryData.some((d: any) => Number(d.year) === filterYear && matchDocType(d, ['dfc']));`
- Line 172: `any` (CRITICAL) -> `const hasDRE = allHistoryData.some((d: any) => Number(d.year) === filterYear && matchDocType(d, ['dre', 'resultado']));`
- Line 173: `any` (CRITICAL) -> `const hasBP_current = allHistoryData.some((d: any) => Number(d.year) === filterYear && matchDocType(d, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco']));`
- Line 174: `any` (CRITICAL) -> `const hasBP_previous = allHistoryData.some((d: any) => Number(d.year) === filterYear - 1 && matchDocType(d, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco']));`
- Line 177: `any` (CRITICAL) -> `let violations: any[] = [];`
- Line 212: `any` (CRITICAL) -> `const dreEntries = allHistoryData.filter((d: any) =>`
- Line 217: `any` (CRITICAL) -> `const m = dreEntries.map((d: any) => ({ ...d, value: d.val || d.valor || d.value || 0 }));`
- Line 219: `any` (CRITICAL) -> `const calculatedLL = cascadeRes.find((r: any) => r.id === 'LUCRO_LIQ')?.computedValue;`
- Line 313: `any` (CRITICAL) -> `const getDfcSectionSubtotal = (entries: any[], section: 'FCO' | 'FCI' | 'FCF') => {`
- Line 314: `any` (CRITICAL) -> `const match = entries.find((s:any) => {`
- Line 337: `any` (CRITICAL) -> `const getDfcSectionSum = (entries: any[], section: 'FCO' | 'FCI' | 'FCF') => {`
- Line 339: `any` (CRITICAL) -> `entries.forEach((s:any) => {`
- Line 363: `any` (CRITICAL) -> `const yearDfcEntries = allHistoryData.filter((d: any) => Number(d.year) === filterYear && matchDocType(d, ['dfc']));`
- Line 447: `any` (CRITICAL) -> `const bpEntriesForYear = allHistoryData.filter((d: any) =>`
- Line 452: `any` (CRITICAL) -> `const mappedBpEntries = bpEntriesForYear.map((d: any) => ({`
- Line 466: `any` (CRITICAL) -> `flatNodes.forEach((node: any) => {`
- Line 480: `any` (CRITICAL) -> `const parentNode = flatNodes.find((p: any) => p.id === current.parentId);`
- Line 510: `any` (CRITICAL) -> `const yearDfcEntries = allHistoryData.filter((d: any) => Number(d.year) === filterYear && matchDocType(d, ['dfc']));`
- Line 511: `any` (CRITICAL) -> `yearDfcEntries.forEach((d: any) => {`
- Line 532: `any` (CRITICAL) -> `const bpEntriesPrevYear = allHistoryData.filter((d: any) =>`
- Line 542: `any` (CRITICAL) -> `const mappedBpEntriesPrev = bpEntriesPrevYear.map((d: any) => ({ ...d, type: d.entryType || d.type }));`
- Line 588: `any` (CRITICAL) -> `const reconstructedFiduciaryEntries: any[] = [];`
- Line 591: `any` (CRITICAL) -> `const yearDfcEntries = allHistoryData.filter((d: any) => Number(d.year) === filterYear && matchDocType(d, ['dfc']));`
- Line 594: `any` (CRITICAL) -> `yearDfcEntries.forEach((d: any) => {`
- Line 825: `any` (CRITICAL) -> `const uniqueYears = [...new Set(allHistoryData.map((d: any) => Number(d.year)))] as number[];`
- Line 832: `any` (CRITICAL) -> `const yearDfc = allHistoryData.filter((d: any) => Number(d.year) === y && matchDocType(d, ['dfc']));`
- Line 835: `any` (CRITICAL) -> `yearDfc.forEach((d: any) => {`
- Line 998: `any` (CRITICAL) -> `const yearDfcEntries = allHistoryData.filter((d: any) => Number(d.year) === filterYear && matchDocType(d, ['dfc']));`
- Line 1161: `any` (CRITICAL) -> `const yDfcEntries = allHistoryData.filter((d: any) => Number(d.year) === y && matchDocType(d, ['dfc']));`
- Line 1163: `any` (CRITICAL) -> `yDfcEntries.forEach((d: any) => {`
- Line 1170: `any` (CRITICAL) -> `const bpEntriesForY = allHistoryData.filter((d: any) => Number(d.year) === y && matchDocType(d, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco']));`
- Line 1215: `any` (CRITICAL) -> `const prevDfcEntries = allHistoryData.filter((d: any) => Number(d.year) === prevYear && matchDocType(d, ['dfc']));`
- Line 1263: `any` (CRITICAL) -> `const hasDREForYear = allHistoryData.some((d: any) => Number(d.year) === y && matchDocType(d, ['dre', 'resultado']));`
- Line 1427: `any` (CRITICAL) -> `let tableRows: any[] = [];`
- Line 1429: `any` (CRITICAL) -> `tableRows = allHistoryData.filter((d: any) => Number(d.year) === filterYear && matchDocType(d, ['dfc']));`
- Line 1449: `any` (CRITICAL) -> `let fiduciaryTableRows: any[] = [];`
- Line 1451: `any` (CRITICAL) -> `const yearDfcEntries = allHistoryData.filter((d: any) => Number(d.year) === filterYear && matchDocType(d, ['dfc']));`
- Line 1454: `any` (CRITICAL) -> `const fcoDetails: any[] = [];`
- Line 1455: `any` (CRITICAL) -> `const fciDetails: any[] = [];`
- Line 1456: `any` (CRITICAL) -> `const fcfDetails: any[] = [];`
- Line 1458: `any` (CRITICAL) -> `yearDfcEntries.forEach((d: any) => {`
- Line 1575: `any` (CRITICAL) -> `const yearEntries = allHistoryData.filter((d: any) => Number(d.year) === y && matchDocType(d, ['dfc']));`
- Line 1589: `any` (CRITICAL) -> `const yearRp = yearEntries.filter((d: any) => isRelatedParty(d.conta || d.category || d.item || ''));`
- Line 1622: `any` (CRITICAL) -> `? allHistoryData.filter((d: any) => Number(d.year) === filterYear && matchDocType(d, ['dfc']))`
- Line 1628: `any` (CRITICAL) -> `const yearEntries = allHistoryData.filter((d: any) => Number(d.year) === y && matchDocType(d, ['dfc']));`
- Line 1997: `any` (CRITICAL) -> `} catch (error: any) {`

### src/runtime/adapters/LegacyDREAdapter.ts

- Line 37: `any` (CRITICAL) -> `const yearEntries = allHistoryData.filter((d: any) => {`
- Line 57: `any` (CRITICAL) -> `const mappedEntries = yearEntries.sort((a:any, b:any) => (a.ordem || 0) - (b.ordem || 0)).map((d: any) => {`
- Line 57: `any` (CRITICAL) -> `const mappedEntries = yearEntries.sort((a:any, b:any) => (a.ordem || 0) - (b.ordem || 0)).map((d: any) => {`
- Line 57: `any` (CRITICAL) -> `const mappedEntries = yearEntries.sort((a:any, b:any) => (a.ordem || 0) - (b.ordem || 0)).map((d: any) => {`
- Line 96: `any` (CRITICAL) -> `const exactMatch = cascadeResult.find((s: any) => s.id === idMatch);`
- Line 108: `any` (CRITICAL) -> `const cmvRow = cascadeResult.find((r: any) => r.parentId === 'CUSTOS' && r.tipo !== 'SINTETICA') || cascadeResult.find((r: any) => r.id === 'CUSTOS');`
- Line 108: `any` (CRITICAL) -> `const cmvRow = cascadeResult.find((r: any) => r.parentId === 'CUSTOS' && r.tipo !== 'SINTETICA') || cascadeResult.find((r: any) => r.id === 'CUSTOS');`
- Line 117: `any` (CRITICAL) -> `const despVendas = cascadeResult.filter((r: any) => r.parentId === 'DESP_OPER' && (r.conta || r.category || r.nome || '').toLowerCase().includes('venda')).reduce((a: any, b: any) => a + (b.computedValue || b.value || b.val || 0), 0);`
- Line 117: `any` (CRITICAL) -> `const despVendas = cascadeResult.filter((r: any) => r.parentId === 'DESP_OPER' && (r.conta || r.category || r.nome || '').toLowerCase().includes('venda')).reduce((a: any, b: any) => a + (b.computedValue || b.value || b.val || 0), 0);`
- Line 117: `any` (CRITICAL) -> `const despVendas = cascadeResult.filter((r: any) => r.parentId === 'DESP_OPER' && (r.conta || r.category || r.nome || '').toLowerCase().includes('venda')).reduce((a: any, b: any) => a + (b.computedValue || b.value || b.val || 0), 0);`
- Line 118: `any` (CRITICAL) -> `const despAdmin = cascadeResult.filter((r: any) => r.parentId === 'DESP_OPER' && (r.conta || r.category || r.nome || '').toLowerCase().includes('admin')).reduce((a: any, b: any) => a + (b.computedValue || b.value || b.val || 0), 0);`
- Line 118: `any` (CRITICAL) -> `const despAdmin = cascadeResult.filter((r: any) => r.parentId === 'DESP_OPER' && (r.conta || r.category || r.nome || '').toLowerCase().includes('admin')).reduce((a: any, b: any) => a + (b.computedValue || b.value || b.val || 0), 0);`
- Line 118: `any` (CRITICAL) -> `const despAdmin = cascadeResult.filter((r: any) => r.parentId === 'DESP_OPER' && (r.conta || r.category || r.nome || '').toLowerCase().includes('admin')).reduce((a: any, b: any) => a + (b.computedValue || b.value || b.val || 0), 0);`
- Line 197: `any` (CRITICAL) -> `const yearHist = allHistoryData.filter((d: any) => Number(d.year) === y && d.type === 'DRE' && (d.entryType || '').toLowerCase() !== 'ativo' && (d.entryType || '').toLowerCase() !== 'passivo');`
- Line 201: `any` (CRITICAL) -> `const m = yearHist.map((d: any) => ({ ...d, value: d.val || d.valor || 0 }));`
- Line 203: `any` (CRITICAL) -> `rl = res.find((r: any) => r.id === 'ROL')?.computedValue || 0;`
- Line 204: `any` (CRITICAL) -> `ebt = res.find((r: any) => r.id === 'EBITDA')?.computedValue || 0;`
- Line 205: `any` (CRITICAL) -> `ll = res.find((r: any) => r.id === 'LUCRO_LIQ')?.computedValue || 0;`
- Line 206: `any` (CRITICAL) -> `cmv = Math.abs(res.find((r: any) => r.id === 'CUSTOS')?.computedValue || 0);`
- Line 329: `any` (CRITICAL) -> `severity: 'HIGH' as any,`
- Line 337: `any` (CRITICAL) -> `severity: 'HIGH' as any,`
- Line 351: `any` (CRITICAL) -> `} catch (error: any) {`

### src/runtime/adapters/LegacyFinancialAdapter.ts

- Line 71: `any` (CRITICAL) -> `const advisory = generateAdvisory(baseMetrics, bpSummary, scoreMetrics, businessIdentity, trend as any);`
- Line 110: `any` (CRITICAL) -> `} catch (error: any) {`

### src/runtime/adapters/SovereignDecisionAdapter.ts

- Line 30: `any` (CRITICAL) -> `simulateCapitalAllocation: (allocationProfile: any) => any;`
- Line 31: `any` (CRITICAL) -> `simulateFundingStrategy: (strategyProfile: any) => any;`
- Line 32: `any` (CRITICAL) -> `integrateDigitalTwin: (twinData: any) => any;`
- Line 33: `any` (CRITICAL) -> `runWarGameScenario: (wargameParams: any) => any;`
- Line 55: `any` (CRITICAL) -> `simulateCapitalAllocation(allocationProfile: any) {`
- Line 58: `any` (CRITICAL) -> `simulateFundingStrategy(strategyProfile: any) {`
- Line 61: `any` (CRITICAL) -> `integrateDigitalTwin(twinData: any) {`
- Line 64: `any` (CRITICAL) -> `runWarGameScenario(wargameParams: any) {`
- Line 112: `any` (CRITICAL) -> `const baseScenario = ccsMetrics.stressScenarios?.find((s: any) => s.name === 'Base Institutional Scenario') || {};`
- Line 1010: `recordStringAny` (CRITICAL) -> `const decisionScenarioMatrix: Record<string, any> = {};`
- Line 1156: `any` (CRITICAL) -> `} catch (e: any) {`

### src/runtime/adapters/StressTestAdapter.ts

- Line 37: `any` (CRITICAL) -> `let violations: any[] = [];`
- Line 82: `any` (CRITICAL) -> `const scenarios: any[] = [];`
- Line 163: `any` (CRITICAL) -> `} catch (error: any) {`

### src/runtime/auditors/DFCSemanticContextAudit.ts

- Line 1: `any` (CRITICAL) -> `export function auditSemanticContextBinding(dfcInference: any, semanticContext: any, semanticSource: string): {`
- Line 1: `any` (CRITICAL) -> `export function auditSemanticContextBinding(dfcInference: any, semanticContext: any, semanticSource: string): {`

### src/runtime/governance/capital/CapitalClassificationEngine.ts

- Line 8: `any` (CRITICAL) -> `[key: string]: any; // To allow checking for forbidden legacy parameters`

### src/runtime/governance/capital/CapitalGovernancePropagationAudit.ts

- Line 18: `any` (CRITICAL) -> `public static audit(runtime: PropagationPayload, rendered: any): PropagationViolation[] {`

### src/runtime/governance/capital/CapitalGovernanceSemanticEngine.ts

- Line 23: `any` (CRITICAL) -> `public static validateSemanticConsistency(params: SemanticCheckParams, context?: any): void {`

### src/runtime/types.ts

- Line 37: `any` (CRITICAL) -> `lifecycleProfile?: any;`
- Line 38: `any` (CRITICAL) -> `semanticContext?: any;`
- Line 42: `any` (CRITICAL) -> `semanticAudit?: any;`
- Line 44: `recordStringAny` (CRITICAL) -> `metrics: Record<string, any>;`
- Line 53: `any` (CRITICAL) -> `rawFinancialData: any; // Type accurately later`
- Line 54: `any` (CRITICAL) -> `dreData?: any[]; // Type accurately later`
- Line 55: `any` (CRITICAL) -> `dfcData?: any[]; // Type accurately later`
- Line 56: `any` (CRITICAL) -> `businessIdentity?: any; // Type accurately later`
- Line 57: `any` (CRITICAL) -> `governanceMetrics?: any;`
- Line 67: `any` (CRITICAL) -> `financialRuntimeContext?: any;`
- Line 73: `recordStringAny` (CRITICAL) -> `normalizedData: Record<string, any>;`
- Line 113: `any` (CRITICAL) -> `cashSustainabilityReport?: any;`

### src/services/ClientExecutiveFinancialDataAdapter.ts

- Line 94: `any` (CRITICAL) -> `resolve(snap.docs.map(d => ({ id: d.id, ...d.data() as any })));`

### src/services/FiduciaryRuntimeAdapter.ts

- Line 140: `any` (CRITICAL) -> `generateExecutiveReport(payload: any) {`
- Line 143: `any` (CRITICAL) -> `generateBoardPack(payload: any) {`
- Line 147: `any` (CRITICAL) -> `executeAssurance(payload: any) {`
- Line 151: `any` (CRITICAL) -> `registerAudit(payload: any) {`

### src/services/aiBoardReportService.ts

- Line 273: `any` (CRITICAL) -> `export async function generateBoardReportFull(companyName: string, financialData: FinancialEntry[], onProgress: (step: string) => void, clientData?: any): Promise<BoardReportData> {`
- Line 364: `any` (CRITICAL) -> `responseSchema: phase1Schema as any,`
- Line 378: `any` (CRITICAL) -> `responseSchema: phase2Schema as any,`
- Line 392: `any` (CRITICAL) -> `responseSchema: phase3Schema as any,`

### src/services/aiService.ts

- Line 148: `any` (CRITICAL) -> `indicators: any[],`
- Line 185: `any` (CRITICAL) -> `responseSchema: governanceDiagnosisSchema as any,`
- Line 265: `any` (CRITICAL) -> `responseSchema: financialStatementSchema as any,`

### src/services/auditService.ts

- Line 10: `any` (CRITICAL) -> `details: any;`

### src/services/cashFlowService.ts

- Line 36: `any` (CRITICAL) -> `const payables = payablesSnap.docs.map(d => ({ id: d.id, ...d.data() as any }));`
- Line 37: `any` (CRITICAL) -> `const receivables = receivablesSnap.docs.map(d => ({ id: d.id, ...d.data() as any }));`
- Line 38: `any` (CRITICAL) -> `const positions = positionsSnap.docs.map(d => ({ id: d.id, ...d.data() as any }));`
- Line 53: `any` (CRITICAL) -> `const exchangeSecao = (DATA as any).premissas?.economicas?.find((s: any) => s.categoria.includes('Câmbio'));`
- Line 53: `any` (CRITICAL) -> `const exchangeSecao = (DATA as any).premissas?.economicas?.find((s: any) => s.categoria.includes('Câmbio'));`
- Line 54: `any` (CRITICAL) -> `const usdRate = parseFloat(exchangeSecao?.indicadores?.find((i: any) => i.nome.includes('Dólar'))?.valor.replace('R$ ', '').replace(',', '.') || '4.9809');`
- Line 55: `any` (CRITICAL) -> `const eurRate = parseFloat(exchangeSecao?.indicadores?.find((i: any) => i.nome.includes('Euro'))?.valor.replace('R$ ', '').replace(',', '.') || '5.772');`
- Line 64: `any` (CRITICAL) -> `const saldoInicialTotal = finalPositions.reduce((acc: number, p: any) => {`
- Line 74: `any` (CRITICAL) -> `const projections: any[] = [];`
- Line 85: `any` (CRITICAL) -> `.filter((r: any) => r.vencimento === dateStr && r.status !== 'Pago')`
- Line 86: `any` (CRITICAL) -> `.reduce((acc: number, r: any) => acc + (Number(r.valorAberto ?? r.valor) || 0), 0);`
- Line 90: `any` (CRITICAL) -> `.filter((p: any) => p.vencimento === dateStr && p.status !== 'Pago')`
- Line 91: `any` (CRITICAL) -> `.reduce((acc: number, p: any) => acc + (Number(p.valorAberto ?? p.valor) || 0), 0);`
- Line 109: `any` (CRITICAL) -> `.filter((r: any) => {`
- Line 114: `any` (CRITICAL) -> `.map((r: any) => ({`
- Line 123: `any` (CRITICAL) -> `.filter((p: any) => {`
- Line 128: `any` (CRITICAL) -> `.map((p: any) => ({`
- Line 138: `any` (CRITICAL) -> `.filter((p: any) => {`
- Line 141: `any` (CRITICAL) -> `.map((p: any) => ({`
- Line 150: `any` (CRITICAL) -> `.filter((r: any) => {`
- Line 153: `any` (CRITICAL) -> `.map((r: any) => ({`
- Line 237: `any` (CRITICAL) -> `.filter((d: any) => d.status !== 'archived' && d.status !== 'pending' && d.status !== 'rejected');`

### src/services/governanceService.ts

- Line 22: `any` (CRITICAL) -> `async getFirestoreDocs(q: any): Promise<any> {`
- Line 22: `any` (CRITICAL) -> `async getFirestoreDocs(q: any): Promise<any> {`
- Line 67: `any` (CRITICAL) -> `timestamp: serverTimestamp() as any`
- Line 144: `any` (CRITICAL) -> `return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));`
- Line 177: `any` (CRITICAL) -> `return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));`

### src/services/importService.ts

- Line 53: `tsIgnore` (CRITICAL) -> `// @ts-ignore`
- Line 72: `any` (CRITICAL) -> `textContent.items.forEach((item: any) => {`
- Line 148: `any` (CRITICAL) -> `textContent.items.forEach((item: any) => {`
- Line 203: `any` (CRITICAL) -> `const rawData = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];`
- Line 373: `any` (CRITICAL) -> `const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];`
- Line 482: `tsIgnore` (CRITICAL) -> `// @ts-ignore`
- Line 497: `any` (CRITICAL) -> `textContent.items.forEach((item: any) => {`
- Line 587: `any` (CRITICAL) -> `.map(acc => (acc as any).id)`
- Line 797: `any` (CRITICAL) -> `const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];`
- Line 946: `tsIgnore` (CRITICAL) -> `// @ts-ignore`
- Line 963: `any` (CRITICAL) -> `textContent.items.forEach((item: any) => {`
- Line 1079: `any` (CRITICAL) -> `const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];`
- Line 1134: `tsIgnore` (CRITICAL) -> `// @ts-ignore`
- Line 1150: `any` (CRITICAL) -> `textContent.items.forEach((item: any) => {`

### src/services/intelligenceEngine.ts

- Line 5: `any` (CRITICAL) -> `const getVal = (data: any[], names: string[]) => {`
- Line 16: `any` (CRITICAL) -> `const extractCMV = (dreRows: any[]): number => {`
- Line 40: `any` (CRITICAL) -> `processFinancialData: (currentDre: any[], currentBp: any[], version: string = CURRENT_METHODOLOGY_VERSION) => {`
- Line 40: `any` (CRITICAL) -> `processFinancialData: (currentDre: any[], currentBp: any[], version: string = CURRENT_METHODOLOGY_VERSION) => {`

### src/services/logging/InstitutionalLogger.ts

- Line 21: `any` (CRITICAL) -> `debug(message: string, payload?: any) {`
- Line 31: `any` (CRITICAL) -> `info(message: string, payload?: any) {`
- Line 41: `any` (CRITICAL) -> `warn(message: string, payload?: any) {`
- Line 51: `any` (CRITICAL) -> `error(message: string, error?: any, context?: any) {`
- Line 51: `any` (CRITICAL) -> `error(message: string, error?: any, context?: any) {`
- Line 71: `any` (CRITICAL) -> `audit(event: string, payload: any) {`

### src/services/logging/LogSanitizer.ts

- Line 9: `any` (CRITICAL) -> `static sanitizeForLog(payload: any): any {`
- Line 9: `any` (CRITICAL) -> `static sanitizeForLog(payload: any): any {`
- Line 21: `any` (CRITICAL) -> `const sanitized: any = {};`

### src/services/notificationService.ts

- Line 24: `any` (CRITICAL) -> `metadata?: any;`
- Line 25: `any` (CRITICAL) -> `createdAt: any;`

### src/services/security/AccessControlService.ts

- Line 9: `recordStringAny` (CRITICAL) -> `claims: Record<string, any>;`

### src/services/supportService.ts

- Line 108: `any` (CRITICAL) -> `const updateData: any = { status, updatedAt: serverTimestamp() };`

### src/services/taxService.ts

- Line 23: `any` (CRITICAL) -> `const anexoData = (DATA as any).premissas.tributarias.simplesNacional.find((a: any) => a.anexo === anexoNum);`
- Line 23: `any` (CRITICAL) -> `const anexoData = (DATA as any).premissas.tributarias.simplesNacional.find((a: any) => a.anexo === anexoNum);`
- Line 27: `any` (CRITICAL) -> `const faixa = anexoData.faixas.find((f: any) => rbt12 <= f.ate) || anexoData.faixas[anexoData.faixas.length - 1];`

### tests/security-auth-tenant-provider.test.ts

- Line 7: `any` (HIGH) -> `let originalGetFirestoreDocs: any;`
- Line 22: `unknown` (HIGH) -> `} as unknown as User;`
- Line 60: `any` (HIGH) -> `TenantResolutionEngine.getFirestoreDocs = async (q: any) => {`
- Line 95: `any` (HIGH) -> `TenantResolutionEngine.getFirestoreDocs = async (q: any) => {`
- Line 143: `any` (HIGH) -> `TenantResolutionEngine.getFirestoreDocs = async (q: any) => {`

