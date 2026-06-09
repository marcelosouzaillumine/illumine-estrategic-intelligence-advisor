# Runtime Governance Audit v1.0

Este relatório mapeia **todos** os pontos que produzem inteligência institucional na plataforma, classificando-os de acordo com sua legitimidade arquitetural.

### Resumo Executivo
- **Total de motores lógicos interceptados:** 2545
- **AUTHORIZED_ENGINE:** 1906
- **PRESENTATION_CALCULATION:** 273
- **SHADOW_ENGINE:** 31
- **CRITICAL / RISCO FIDUCIÁRIO:** 101

---

## Ocorrências por Classificação

### CRITICAL (101)
| Arquivo | Função | Linha | Contexto |
|---|---|---|---|
| `src/services/aiBoardReportService.ts` | **calculateScores** | 316 | `const scores = calculateScores(bpSummary, metrics, dreRows.length, prevPl, busin` |
| `src/components/institutional-reporting/ExecutiveSnapshotSurface.tsx` | **longitudinalScore** | 60 | `<span className="text-2xl font-bold text-zinc-200">{data.longitudinalScore === '` |
| `src/components/operating-pressure/InstitutionalPressureDashboard.tsx` | **score** | 96 | `const score = pressureReport.pressureScore;` |
| `src/components/operating-pressure/InstitutionalPressureDashboard.tsx` | **scores** | 178 | `scores={{` |
| `src/components/pages/ControladoriaPage.tsx` | **adherenceScore** | 167 | `const adherenceScore = totalPlanned > 0 ? Math.max(0, 100 - Math.abs(Math.round(` |
| `src/components/pages/ControladoriaPage.tsx` | **complianceScore** | 168 | `const complianceScore = 95; // Indicador de conformidade de processos corporativ` |
| `src/components/pages/DFCPage.tsx` | **efsiScore** | 1314 | `const efsiScore = metrics.fiduciary?.efsiScore || 0;` |
| `src/components/pages/DLPAPage.tsx` | **ScoreRing** | 163 | `function ScoreRing({ value, label, color }: { value: number; label: string; colo` |
| `src/components/pages/DLPAPage.tsx` | **Score** | 822 | `{/* Capital Preservation Score (CPS) Header Block */}` |
| `src/components/pages/DLPAPage.tsx` | **Score** | 828 | `<h3 className="text-xl font-black tracking-wide text-[#0E1C2C]">Capital Preserva` |
| `src/components/pages/DREPage.tsx` | **finalHealthScore** | 132 | `const finalHealthScore = (executiveReport?.metrics.financialMetrics as any)?.dre` |
| `src/components/pages/DashboardPage.tsx` | **semScore** | 227 | `const semScore = docs.reduce((sum, doc) => {` |
| `src/components/pages/EFOSPage.tsx` | **scoreInput** | 267 | `const scoreInput = {` |
| `src/components/pages/EFOSPage.tsx` | **scores** | 384 | `const scores = executiveReport?.scores;` |
| `src/components/pages/EstruturaGovernancaPage.tsx` | **scores** | 322 | `const scores = Array(10).fill(0);` |
| `src/components/pages/EstruturaGovernancaPage.tsx` | **adherenceScore** | 332 | `const adherenceScore = useMemo(() => {` |
| `src/components/pages/EstruturaGovernancaPage.tsx` | **score** | 346 | `const score = userEnneagram[type] || 0;` |
| `src/components/pages/EstruturaGovernancaPage.tsx` | **totalScore** | 385 | `let totalScore = 0;` |
| `src/components/pages/EstruturaGovernancaPage.tsx` | **score** | 386 | `Object.values(dilemmaAnswers).forEach(score => {` |
| `src/components/pages/IndicatorsPage.tsx` | **semScore** | 374 | `const semScore = docs.reduce((sum, doc) => {` |
| `src/components/pages/IndicatorsPage.tsx` | **healthScore** | 459 | `const healthScore = finalIndicators.length > 0 ? Math.round(` |
| `src/components/pages/InstitutionalContinuityCockpitPage.tsx` | **resilienceScore** | 202 | `resilienceScore={resilienceReport.resilienceScore}` |
| `src/components/pages/InstitutionalContinuityCockpitPage.tsx` | **antifragilityScore** | 203 | `antifragilityScore={resilienceReport.antifragilityScore}` |
| `src/components/pages/InstitutionalContinuityCockpitPage.tsx` | **vulnerabilityReductionScore** | 204 | `vulnerabilityReductionScore={resilienceReport.vulnerabilityReductionScore}` |
| `src/components/pages/InstitutionalContinuityCockpitPage.tsx` | **institutionalLearningScore** | 205 | `institutionalLearningScore={resilienceReport.institutionalLearningScore}` |
| `src/components/pages/InstitutionalContinuityCockpitPage.tsx` | **shockAbsorptionScore** | 206 | `shockAbsorptionScore={resilienceReport.shockAbsorptionScore}` |
| `src/components/pages/LeadershipProfilePage.tsx` | **scores** | 354 | `const scores = Array(10).fill(0);` |
| `src/components/pages/LeadershipProfilePage.tsx` | **adherenceScore** | 364 | `const adherenceScore = useMemo(() => {` |
| `src/components/pages/LeadershipProfilePage.tsx` | **score** | 376 | `const score = userEnneagram[type] || 0;` |
| `src/components/pages/LeadershipProfilePage.tsx` | **governanceAlignmentScore** | 384 | `const governanceAlignmentScore = useMemo(() => {` |
| `src/components/pages/LeadershipProfilePage.tsx` | **totalScore** | 388 | `let totalScore = 0;` |
| `src/components/pages/LeadershipProfilePage.tsx` | **score** | 389 | `Object.values(dilemmaAnswers).forEach(score => {` |
| `src/components/pages/PortfolioPage.tsx` | **score** | 208 | `let score = 0;` |
| `src/components/pages/PortfolioPage.tsx` | **score** | 224 | `score = isNaN(calculated) ? 65 : Math.max(30, Math.min(98, Math.round(calculated` |
| `src/components/pages/PortfolioPage.tsx` | **score** | 227 | `score = 0;` |
| `src/components/pages/PortfolioPage.tsx` | **calculateGovernanceAlignmentScore** | 230 | `const governanceScore = calculateGovernanceAlignmentScore([` |
| `src/components/pages/PortfolioPage.tsx` | **avgScore** | 346 | `const avgScore = activeClients.length > 0 ? Math.round(activeClients.reduce((acc` |
| `src/components/pages/PortfolioPage.tsx` | **maturityScore** | 356 | `const maturityScore = activeClients.length > 0 ? Math.round((above60 / activeCli` |
| `src/components/pages/PortfolioPage.tsx` | **avgScore** | 396 | `const avgScore = partnerClients.length > 0 ? partnerClients.reduce((acc, c) => a` |
| `src/components/pages/StrategicSimulatorPage.tsx` | **simulatedEbitda** | 87 | `const simulatedEbitda = finalRevenue * finalMargin;` |
| `src/components/pages/StrategicSimulatorPage.tsx` | **simulatedValuation** | 92 | `const simulatedValuation = simulatedEbitda * multiple;` |
| `src/components/pages/TaxReformImpactPage.tsx` | **ScoreGauge** | 51 | `function ScoreGauge({ label, score, color }: { label: string, score: number, col` |
| `src/components/pages/TaxReformImpactPage.tsx` | **calculateReformScores** | 198 | `const scores = useMemo(() => calculateReformScores(diagnosis, metrics), [diagnos` |
| `src/components/pages/TaxReformImpactPage.tsx` | **score** | 711 | `<ScoreGauge label="Score de Impacto" score={hasData ? scores.impact : 0} color="` |
| `src/components/pages/TaxReformImpactPage.tsx` | **score** | 712 | `<ScoreGauge label="Vulnerabilidade Setorial" score={hasData ? scores.vulnerabili` |
| `src/components/pages/TaxReformImpactPage.tsx` | **score** | 713 | `<ScoreGauge label="Maturidade Fiscal" score={hasData ? scores.maturity : 0} colo` |
| `src/components/pages/governance/BenchmarkReadinessPanel.tsx` | **scoreColor** | 65 | `let scoreColor = 'text-emerald-450';` |
| `src/components/pages/governance/BenchmarkReadinessPanel.tsx` | **scoreColor** | 68 | `scoreColor = 'text-red-450';` |
| `src/components/pages/governance/BenchmarkReadinessPanel.tsx` | **scoreColor** | 71 | `scoreColor = 'text-amber-450';` |
| `src/components/pages/governance/CapitalGovernanceCenter.tsx` | **CgsScoreRing** | 44 | `function CgsScoreRing({ value, label, status }: { value: number; label: string; ` |
| `src/components/pages/governance/ComplianceIntegrityCenter.tsx` | **score** | 157 | `<ESGPillarCard title="Ambiental (E)" score={88} />` |
| `src/components/pages/governance/ComplianceIntegrityCenter.tsx` | **score** | 158 | `<ESGPillarCard title="Social (S)" score={94} />` |
| `src/components/pages/governance/ComplianceIntegrityCenter.tsx` | **score** | 159 | `<ESGPillarCard title="Governança (G)" score={95} />` |
| `src/components/pages/governance/ContinuityRiskPanel.tsx` | **antfragilityScore** | 19 | `const antfragilityScore = continuityReport?.antifragilityScore ?? 0;` |
| `src/components/pages/governance/ContinuityRiskPanel.tsx` | **scoreColor** | 22 | `const scoreColor = antfragilityScore >= 80` |
| `src/components/pages/governance/CreditCommitteeCenter.tsx` | **ccsScore** | 85 | `ccsScore = 70,` |
| `src/components/pages/governance/CreditCommitteeCenter.tsx` | **bankingReadinessScore** | 137 | `const bankingReadinessScore = brmMetrics.bankingReadinessScore ?? 70;` |
| `src/components/pages/governance/CreditCommitteeCenter.tsx` | **getScoreColor** | 186 | `const getScoreColor = (val: number): string => {` |
| `src/components/pages/governance/CreditCommitteeCenter.tsx` | **getScoreBg** | 193 | `const getScoreBg = (val: number): string => {` |
| `src/components/pages/governance/CreditCommitteeCenter.tsx` | **getScoreBg** | 302 | `<span className={cn("px-3 py-1 rounded-xl text-[10px] font-black tracking-widest` |
| `src/components/pages/governance/CreditCommitteeCenter.tsx` | **getScoreColor** | 308 | `<span className={cn("text-7xl font-light tracking-tight transition-colors", getS` |
| `src/components/pages/governance/CreditCommitteeCenter.tsx` | **getScoreColor** | 382 | `<span className={cn("text-5xl font-light", getScoreColor(bankingReadinessScore))` |
| `src/components/pages/governance/CreditCommitteeCenter.tsx` | **getScoreColor** | 402 | `<span className={cn("text-5xl font-light", getScoreColor(ccsScore))}>{ccsScore}<` |
| `src/components/pages/governance/EconomicNormalizationCenter.tsx` | **ensScore** | 70 | `ensScore = 70,` |
| `src/components/pages/governance/ExecutiveExecutionCenter.tsx` | **eesScore** | 65 | `eesScore = 100,` |
| `src/components/pages/governance/ExecutiveExecutionCenter.tsx` | **accountabilityScore** | 71 | `accountabilityScore = 100,` |
| `src/components/pages/governance/ExecutiveExecutionCenter.tsx` | **alignmentScore** | 72 | `alignmentScore = 100,` |
| `src/components/pages/governance/ExecutiveExecutionCenter.tsx` | **learningScore** | 73 | `learningScore = 100,` |
| `src/components/pages/governance/ExecutiveExecutionCenter.tsx` | **iddsScore** | 75 | `iddsScore = 0,` |
| `src/components/pages/governance/ExecutiveExecutionCenter.tsx` | **Score** | 175 | `<p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Execut` |
| `src/components/pages/governance/GovernanceExecutionPanel.tsx` | **calculateGeiSimpleScore** | 118 | `const geiSimple = registry.calculateGeiSimpleScore(scenario);` |
| `src/components/pages/governance/GovernanceExecutionPanel.tsx` | **calculateGeiWeightedScore** | 119 | `const geiWeighted = registry.calculateGeiWeightedScore(scenario);` |
| `src/components/pages/governance/GovernanceExecutionPanel.tsx` | **calculateGaiScore** | 120 | `const gai = registry.calculateGaiScore(scenario);` |
| `src/components/pages/governance/GovernanceMaturityCenter.tsx` | **calculateGovernanceMaturityScore** | 110 | `const maturityScore = calculateGovernanceMaturityScore(finalResponses);` |
| `src/components/pages/governance/GovernanceMaturityCenter.tsx` | **calculateGovernanceAlignmentScore** | 111 | `const alignmentScore = calculateGovernanceAlignmentScore(indicators);` |
| `src/components/pages/governance/GovernanceMaturityCenter.tsx` | **score** | 697 | `const score = finalResponses[p.id] ?? 0;` |
| `src/components/pages/governance/InstitutionalMemoryCenter.tsx` | **imsScore** | 63 | `imsScore = 70,` |
| `src/components/pages/governance/LeadershipDNACenter.tsx` | **scores** | 322 | `const scores = Array(10).fill(0);` |
| `src/components/pages/governance/LeadershipDNACenter.tsx` | **adherenceScore** | 332 | `const adherenceScore = useMemo(() => {` |
| `src/components/pages/governance/LeadershipDNACenter.tsx` | **score** | 346 | `const score = userEnneagram[type] || 0;` |
| `src/components/pages/governance/LeadershipDNACenter.tsx` | **totalScore** | 385 | `let totalScore = 0;` |
| `src/components/pages/governance/LeadershipDNACenter.tsx` | **score** | 386 | `Object.values(dilemmaAnswers).forEach(score => {` |
| `src/components/pages/governance/RiskExposureCenter.tsx` | **boardRiskScore** | 62 | `boardRiskScore = 70,` |
| `src/components/pages/governance/RiskExposureCenter.tsx` | **bankingReadinessScore** | 64 | `bankingReadinessScore = 70,` |
| `src/components/pages/governance/RiskExposureCenter.tsx` | **getScoreColor** | 107 | `const getScoreColor = (val: number) => {` |
| `src/components/pages/governance/RiskExposureCenter.tsx` | **getScoreBg** | 113 | `const getScoreBg = (val: number) => {` |
| `src/components/pages/governance/RiskExposureCenter.tsx` | **getScoreBg** | 157 | `<span className={cn("px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wide` |
| `src/components/pages/governance/RiskExposureCenter.tsx` | **getScoreColor** | 162 | `<span className={cn("text-5xl font-light tracking-tight", getScoreColor(boardRis` |
| `src/components/pages/governance/RiskExposureCenter.tsx` | **getScoreBg** | 190 | `<span className={cn("px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wide` |
| `src/components/pages/governance/RiskExposureCenter.tsx` | **getScoreColor** | 195 | `<span className={cn("text-5xl font-light tracking-tight", getScoreColor(bankingR` |
| `src/components/pages/governance/RiskExposureCenter.tsx` | **score** | 299 | `<HeatmapBlock title="Treasury Integrity" score={dimensions.treasury} />` |
| `src/components/pages/governance/RiskExposureCenter.tsx` | **score** | 300 | `<HeatmapBlock title="Earnings Integrity" score={dimensions.earnings} />` |
| `src/components/pages/governance/RiskExposureCenter.tsx` | **score** | 301 | `<HeatmapBlock title="Operational Survivability" score={dimensions.survivability}` |
| `src/components/pages/governance/RiskExposureCenter.tsx` | **score** | 302 | `<HeatmapBlock title="Governance Exposure" score={dimensions.governance} />` |
| `src/components/pages/governance/RiskExposureCenter.tsx` | **score** | 303 | `<HeatmapBlock title="Capital Structure" score={dimensions.capital} />` |
| `src/components/pages/governance/RiskExposureCenter.tsx` | **score** | 304 | `<HeatmapBlock title="Stability" score={dimensions.stability} />` |
| `src/components/pages/governance/SovereignDecisionCenter.tsx` | **domainScores** | 65 | `domainScores = { treasury: 50, capital: 50, growth: 50, profitability: 50, gover` |
| `src/components/scenario-simulation/GovernanceProjectionTimeline.tsx` | **baseScore** | 18 | `const baseScore = simulationOutput.projectedDeterioration.score;` |
| `src/components/scenario-simulation/GovernanceProjectionTimeline.tsx` | **sandboxScore** | 19 | `const sandboxScore = sandboxResult ? sandboxResult.simulatedOutput.projectedDete` |
| `src/hooks/useBoardMode.ts` | **assessFiduciaryRisks** | 16 | `const risks = BoardRuntimeAdapter.assessFiduciaryRisks(input);` |
| `src/hooks/usePredictiveGovernance.ts` | **overallScore** | 51 | `const overallScore = PredictiveGovernanceScoreEngine.computeScore(snapshots);` |

### SHADOW_ENGINE (31)
| Arquivo | Função | Linha | Contexto |
|---|---|---|---|
| `src/services/FiduciaryRuntimeAdapter.ts` | **generateExecutiveReport** | 138 | `generateExecutiveReport(payload: any) {` |
| `src/services/FiduciaryRuntimeAdapter.ts` | **generateExecutiveReport** | 139 | `return executiveRuntime.generateExecutiveReport(payload);` |
| `src/services/FiduciaryRuntimeAdapter.ts` | **generateBoardPack** | 141 | `generateBoardPack(payload: any) {` |
| `src/services/FiduciaryRuntimeAdapter.ts` | **generateExecutiveReport** | 142 | `const report = executiveRuntime.generateExecutiveReport(payload);` |
| `src/services/FiduciaryRuntimeAdapter.ts` | **generate** | 143 | `return InstitutionalBoardPackRuntime.generate(report);` |
| `src/services/FiduciaryRuntimeAdapter.ts` | **evaluateExecution** | 147 | `return runtime.evaluateExecution(payload);` |
| `src/services/advisoryAiService.ts` | **generateAdvisoryParecer** | 17 | `export async function generateAdvisoryParecer(req: AdvisoryReportRequest): Promi` |
| `src/services/aiBoardReportService.ts` | **generateBoardReportFull** | 273 | `export async function generateBoardReportFull(companyName: string, financialData` |
| `src/services/aiBoardReportService.ts` | **buildBPHierarchy** | 288 | `const { summary: bpSummary } = buildBPHierarchy(bpRows);` |
| `src/services/aiBoardReportService.ts` | **calculateFinancialMetrics** | 299 | `const metrics = calculateFinancialMetrics(bpSummary, ebitda, lucroLiquido);` |
| `src/services/aiBoardReportService.ts` | **buildBPHierarchy** | 304 | `const { summary: prevBpSummary } = buildBPHierarchy(prevBpRows);` |
| `src/services/aiBoardReportService.ts` | **calculatedCycles** | 310 | `let calculatedCycles = years.length || 1; // years already filters unique years ` |
| `src/services/aiBoardReportService.ts` | **evaluateMasterCausality** | 314 | `const masterCausality = evaluateMasterCausality(bpSummary, metrics, businessIden` |
| `src/services/aiBoardReportService.ts` | **generateContent** | 357 | `const p1 = await ai.models.generateContent({` |
| `src/services/aiBoardReportService.ts` | **generateContent** | 372 | `const p2 = await ai.models.generateContent({` |
| `src/services/aiBoardReportService.ts` | **generateContent** | 386 | `const p3 = await ai.models.generateContent({` |
| `src/services/aiService.ts` | **generateGovernanceDiagnosis** | 147 | `export const generateGovernanceDiagnosis = async (` |
| `src/services/aiService.ts` | **generateContent** | 181 | `const response = await ai.models.generateContent({` |
| `src/services/aiService.ts` | **generateContent** | 261 | `const response = await ai.models.generateContent({` |
| `src/services/cashFlowService.ts` | **generateCashFlow** | 18 | `export async function generateCashFlow(context: DataAccessContext, clientId: str` |
| `src/services/governanceAiService.ts` | **generateGovernanceParecer** | 18 | `export async function generateGovernanceParecer(req: GovernanceParecerRequest): ` |
| `src/services/governanceAiService.ts` | **generateContent** | 80 | `const response = await ai.models.generateContent({` |
| `src/services/importService.ts` | **classifyAccounts** | 424 | `resolve(classifyAccounts(accounts));` |
| `src/services/importService.ts` | **classifyAccounts** | 471 | `resolve(classifyAccounts(accounts));` |
| `src/services/importService.ts` | **classifyAccounts** | 540 | `return classifyAccounts(accounts);` |
| `src/services/importService.ts` | **classifyAccounts** | 572 | `resolve(classifyAccounts(accounts));` |
| `src/services/importService.ts` | **classifyAccounts** | 709 | `export const classifyAccounts = (accounts: ImportedAccount[]): ImportedAccount[]` |
| `src/services/intelligenceEngine.ts` | **buildBPHierarchy** | 51 | `const bpSummary = currentBp.length > 0 ? buildBPHierarchy(currentBp).summary : n` |
| `src/services/taxService.ts` | **calculateSimplesNacional** | 18 | `export const calculateSimplesNacional = (rbt12: number, anexoStr: string, fatura` |
| `src/services/taxService.ts` | **calculatePayrollBurdens** | 41 | `export const calculatePayrollBurdens = (salarioBase: number, config: {` |
| `src/services/taxService.ts` | **calculateSeverance** | 70 | `export const calculateSeverance = (` |

### PRESENTATION_CALCULATION (273)
| Arquivo | Função | Linha | Contexto |
|---|---|---|---|
| `src/components/ClientUserManager.tsx` | **getDerivedStateFromError** | 42 | `static getDerivedStateFromError(error: Error) {` |
| `src/components/ClientUserManager.tsx` | **generatedPass** | 134 | `let generatedPass = null;` |
| `src/components/ClientUserManager.tsx` | **generatedPass** | 145 | `generatedPass = Math.random().toString(36).substring(2, 8).toUpperCase() + '@123` |
| `src/components/EmployeeManager.tsx` | **calculatePayrollBurdens** | 75 | `const burdens = calculatePayrollBurdens(baseSalario, {` |
| `src/components/EmployeeManager.tsx` | **calculateSeverance** | 83 | `const severance = calculateSeverance(baseSalario, formData.admissao, {` |
| `src/components/EmployeeManager.tsx` | **calculateSeverance** | 263 | `{ label: 'Aviso Prévio', val: calculateSeverance(formData.salarioBase, formData.` |
| `src/components/EmployeeManager.tsx` | **calculateSeverance** | 264 | `{ label: 'Multa FGTS (Est.)', val: calculateSeverance(formData.salarioBase, form` |
| `src/components/EmployeeManager.tsx` | **calculateSeverance** | 265 | `{ label: '13º Prop.', val: calculateSeverance(formData.salarioBase, formData.adm` |
| `src/components/EmployeeManager.tsx` | **calculateSeverance** | 266 | `{ label: 'Férias + 1/3 Prop.', val: calculateSeverance(formData.salarioBase, for` |
| `src/components/early-warning/GovernanceTrendPanel.tsx` | **calculateIndex** | 7 | `const trend = GovernanceDeteriorationIndex.calculateIndex(tenantId, 0.82);` |
| `src/components/enterprise-validation/InstitutionalUXInsights.tsx` | **evaluate** | 6 | `const uxMetrics = CognitiveLoadEvaluator.evaluate(tenantId);` |
| `src/components/enterprise-validation/PilotReadinessPanel.tsx` | **evaluate** | 6 | `const checks = PilotGovernanceChecklist.evaluate(tenantId);` |
| `src/components/executive-command/InstitutionalExecutiveCommandCenter.tsx` | **generateExecutiveReport** | 44 | `return executiveRuntime.generateExecutiveReport(input);` |
| `src/components/governance-orchestration/GovernanceRecommendationFeed.tsx` | **GovernanceRecommendationFeed** | 5 | `export function GovernanceRecommendationFeed({ tenantId }: { tenantId: string })` |
| `src/components/integrations/ConnectorRegistryPanel.tsx` | **onSimulateUpload** | 27 | `onClick={() => onSimulateUpload(conn.connectorId)}` |
| `src/components/knowledge-graph/RiskCorrelationPanel.tsx` | **analyzeCorrelations** | 6 | `const correlations = RiskCorrelationEngine.analyzeCorrelations(tenantId);` |
| `src/components/knowledge-graph/WorkflowPatternPanel.tsx` | **analyzePatterns** | 6 | `const patterns = WorkflowPatternAnalyzer.analyzePatterns(tenantId);` |
| `src/components/modals/BoardPackPreviewModal.tsx` | **generateBoardPack** | 30 | `const pack: BoardPack = FiduciaryRuntimeAdapter.boardPackGeneratorEngine.generat` |
| `src/components/modals/BoardPackPreviewModal.tsx` | **generatePPTX** | 41 | `await FiduciaryRuntimeAdapter.BoardPackPPTXGenerator.generatePPTX(pack, true);` |
| `src/components/modals/BoardPackPreviewModal.tsx` | **generatePDF** | 49 | `const doc = FiduciaryRuntimeAdapter.BoardPackPDFGenerator.generatePDF(pack);` |
| `src/components/modals/ExecutiveBoardReportModal.tsx` | **generateReport** | 29 | `const report: ExecutiveBoardReport = FiduciaryRuntimeAdapter.executiveBoardRepor` |
| `src/components/modals/ExecutiveBoardReportModal.tsx` | **generatePDF** | 38 | `const doc = FiduciaryRuntimeAdapter.ExecutiveBoardReportPDF.generatePDF(report);` |
| `src/components/modals/GenerateBoardReportModal.tsx` | **GenerateBoardReportModal** | 21 | `export function GenerateBoardReportModal({` |
| `src/components/modals/ImportFinancialModal.tsx` | **buildBPHierarchy** | 148 | `const { summary } = buildBPHierarchy(classified);` |
| `src/components/modals/ManualFinancialModal.tsx` | **generateInitialDreState** | 214 | `const initialDreState = generateInitialDreState() as Row[];` |
| `src/components/modals/ManualFinancialModal.tsx` | **calculateDreCascade** | 215 | `existingData = calculateDreCascade([...initialDreState, ...mappedEntries]);` |
| `src/components/modals/ManualFinancialModal.tsx` | **generateInitialDreState** | 218 | `existingData = generateInitialDreState() as Row[];` |
| `src/components/modals/ManualFinancialModal.tsx` | **generateInitialDreState** | 221 | `const initialDreState = generateInitialDreState() as Row[];` |
| `src/components/modals/ManualFinancialModal.tsx` | **calculateDreCascade** | 223 | `existingData = calculateDreCascade([...existingData, ...missingSynthetics]);` |
| `src/components/modals/ManualFinancialModal.tsx` | **calculated** | 260 | `const calculated = calculateDreCascade(rows);` |
| `src/components/modals/ManualFinancialModal.tsx` | **buildBPHierarchy** | 293 | `const { flatNodes } = buildBPHierarchy(rows);` |
| `src/components/modals/ManualFinancialModal.tsx` | **buildBPHierarchy** | 365 | `const { summary } = buildBPHierarchy(computedRows);` |
| `src/components/operating-pressure/InstitutionalPressureDashboard.tsx` | **generateExecutiveReport** | 53 | `return executiveRuntime.generateExecutiveReport(input);` |
| `src/components/pages/AnaliseFinanceiraPage.tsx` | **calculatedCycles** | 121 | `let calculatedCycles = Object.keys(historyByYear ?? {}).filter((year) => {` |
| `src/components/pages/AnaliseFinanceiraPage.tsx` | **generateExecutiveReport** | 150 | `const report = executiveRuntime.generateExecutiveReport(payload);` |
| `src/components/pages/AxisDashboardPage.tsx` | **evaluateAxisRules** | 259 | `return evaluateAxisRules(flatMetrics, axis, isBlocked);` |
| `src/components/pages/BalanceSheetPage.tsx` | **buildBPHierarchy** | 120 | `return buildBPHierarchy(arr);` |
| `src/components/pages/BalanceSheetPage.tsx` | **calculateIndicators** | 236 | `const bpCalc = FiduciaryRuntimeAdapter.BalanceSheetFinancialMetricsEngine.calcul` |
| `src/components/pages/BalanceSheetPage.tsx` | **generateInitialDreState** | 310 | `...generateInitialDreState(),` |
| `src/components/pages/BalanceSheetPage.tsx` | **calculateDreCascade** | 321 | `const cascadeResult = calculateDreCascade(allRows);` |
| `src/components/pages/BalanceSheetPage.tsx` | **calculatedCycles** | 341 | `let calculatedCycles = Object.keys(historyByYear ?? {}).filter((year) => {` |
| `src/components/pages/BalanceSheetPage.tsx` | **generateExecutiveReport** | 370 | `const report = FiduciaryRuntimeAdapter.generateExecutiveReport(input);` |
| `src/components/pages/CalibrationPlayground.tsx` | **simulateStagingWarnings** | 136 | `const simulateStagingWarnings = () => {` |
| `src/components/pages/CalibrationPlayground.tsx` | **generateExecutiveReport** | 162 | `const simulationReport = executiveRuntime.generateExecutiveReport(MOCK_SANDBOX_D` |
| `src/components/pages/CalibrationPlayground.tsx` | **simulateStagingWarnings** | 167 | `const stagingWarnings = simulateStagingWarnings();` |
| `src/components/pages/CashFlowPage.tsx` | **buildContext** | 50 | `const buildContext = (action: 'VIEW_FINANCIALS' | 'CREATE_SNAPSHOT' = 'VIEW_FINA` |
| `src/components/pages/CashFlowPage.tsx` | **buildContext** | 81 | `const context = buildContext('VIEW_FINANCIALS', cleanId);` |
| `src/components/pages/CashFlowPage.tsx` | **generateExecutiveReport** | 101 | `const report = FiduciaryRuntimeAdapter.generateExecutiveReport(input);` |
| `src/components/pages/CashFlowPage.tsx` | **handleGenerate** | 112 | `const handleGenerate = async () => {` |
| `src/components/pages/CashFlowPage.tsx` | **buildContext** | 116 | `const context = buildContext('CREATE_SNAPSHOT', cleanId);` |
| `src/components/pages/CashFlowPage.tsx` | **generateCashFlow** | 118 | `const data = await generateCashFlow(context, cleanId);` |
| `src/components/pages/ClientExecutiveWorkspace.tsx` | **generateExecutiveReport** | 77 | `const compiled = executiveRuntime.generateExecutiveReport(getMockInput());` |
| `src/components/pages/ClientExecutiveWorkspace.tsx` | **buildDataAccessContext** | 100 | `const context = buildDataAccessContext('CREATE_REPORT', 'Workflow');` |
| `src/components/pages/ClientExecutiveWorkspace.tsx` | **buildDataAccessContext** | 126 | `const context = buildDataAccessContext('VIEW_DASHBOARD', 'Collaboration');` |
| `src/components/pages/ClientExecutiveWorkspace.tsx` | **buildDataAccessContext** | 183 | `const context = buildDataAccessContext('VIEW_DASHBOARD', 'Diagnostics');` |
| `src/components/pages/ClientExecutiveWorkspace.tsx` | **generateReport** | 184 | `return EnterpriseReadinessDiagnostics.generateReport(context, selectedClient);` |
| `src/components/pages/ClientExecutiveWorkspace.tsx` | **buildDataAccessContext** | 195 | `const context = buildDataAccessContext('VIEW_DASHBOARD', 'Analytics');` |
| `src/components/pages/ClientExecutiveWorkspace.tsx` | **buildDataAccessContext** | 337 | `const context = buildDataAccessContext('CREATE_REPORT', 'Collaboration', selecte` |
| `src/components/pages/ClientExecutiveWorkspace.tsx` | **buildDataAccessContext** | 350 | `const freshContext = buildDataAccessContext('VIEW_DASHBOARD', 'Collaboration');` |
| `src/components/pages/ClientExecutiveWorkspace.tsx` | **buildDataAccessContext** | 366 | `const context = buildDataAccessContext('APPROVE_BOARD_PACK', 'Workflow', selecte` |
| `src/components/pages/ClientExecutiveWorkspace.tsx` | **buildDataAccessContext** | 383 | `const context = buildDataAccessContext('APPROVE_BOARD_PACK', 'Workflow');` |
| `src/components/pages/ClientExecutiveWorkspace.tsx` | **buildDataAccessContext** | 397 | `const context = buildDataAccessContext('APPROVE_BOARD_PACK', 'Workflow');` |
| `src/components/pages/DFCPage.tsx` | **isGenerated** | 229 | `const isGenerated = metrics.isGenerated || false;` |
| `src/components/pages/DFCPage.tsx` | **evaluate** | 729 | `const consequence = FiduciaryRuntimeAdapter.ExecutiveConsequenceIntelligenceLaye` |
| `src/components/pages/DFCPage.tsx` | **evaluate** | 1210 | `const consistency = FiduciaryRuntimeAdapter.ScenarioSimulationConsistencyEngine.` |
| `src/components/pages/DFCPage.tsx` | **evaluate** | 1316 | `const narrative = FiduciaryRuntimeAdapter.TreasurySustainabilityNarrativeEngine.` |
| `src/components/pages/DLPAPage.tsx` | **build** | 429 | `const lContext = LifecycleContextBuilder.build({` |
| `src/components/pages/DREPage.tsx` | **generateExecutiveReport** | 126 | `const report = FiduciaryRuntimeAdapter.generateExecutiveReport(input);` |
| `src/components/pages/DREPage.tsx` | **economicValueAssessment** | 146 | `const economicValueAssessment = (executiveReport?.metrics as any)?.dreInsights?.` |
| `src/components/pages/DREPage.tsx` | **earningsQualityAssessment** | 147 | `const earningsQualityAssessment = (executiveReport?.metrics as any)?.dreInsights` |
| `src/components/pages/DREPage.tsx` | **confidenceAssessment** | 148 | `const confidenceAssessment = (executiveReport?.metrics as any)?.dreInsights?.con` |
| `src/components/pages/DashboardPage.tsx` | **calculateDreCascade** | 384 | `const cascadeResult = calculateDreCascade([...DRE_OFFICIAL_STRUCTURE.map(account` |
| `src/components/pages/DiagnosticoPage.tsx` | **calculateIVE** | 57 | `const calculateIVE = (g: number, u: number, t: number, i: number) => {` |
| `src/components/pages/DiagnosticoPage.tsx` | **calculateIVE** | 103 | `const baseScore  = calculateIVE(formData.gravidade!, formData.urgencia!, formDat` |
| `src/components/pages/DreGerencialPage.tsx` | **calculatedRows** | 172 | `const calculatedRows = calculateDreCascade(rowsToCalc);` |
| `src/components/pages/EFOSPage.tsx` | **setGenerateError** | 188 | `setGenerateError(null);` |
| `src/components/pages/EFOSPage.tsx` | **generateExecutiveReport** | 191 | `const report = FiduciaryRuntimeAdapter.generateExecutiveReport(input);` |
| `src/components/pages/EFOSPage.tsx` | **setGenerateError** | 317 | `setGenerateError(err.message);` |
| `src/components/pages/EFOSPage.tsx` | **setGenerateError** | 321 | `setGenerateError(err.message || 'Erro desconhecido');` |
| `src/components/pages/EstruturaGovernancaPage.tsx` | **setTeamAssessments** | 259 | `setTeamAssessments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));` |
| `src/components/pages/EstruturaGovernancaPage.tsx` | **calculateUserDISC** | 281 | `disc: calculateUserDISC(),` |
| `src/components/pages/EstruturaGovernancaPage.tsx` | **calculateUserEnneagram** | 282 | `enneagram: calculateUserEnneagram(),` |
| `src/components/pages/EstruturaGovernancaPage.tsx` | **calculateUserDISC** | 303 | `const calculateUserDISC = () => {` |
| `src/components/pages/EstruturaGovernancaPage.tsx` | **calculateUserEnneagram** | 321 | `const calculateUserEnneagram = () => {` |
| `src/components/pages/EstruturaGovernancaPage.tsx` | **calculateUserDISC** | 329 | `const userProfile = useMemo(() => calculateUserDISC(), [answers]);` |
| `src/components/pages/EstruturaGovernancaPage.tsx` | **calculateUserEnneagram** | 330 | `const userEnneagram = useMemo(() => calculateUserEnneagram(), [enneagramAnswers]` |
| `src/components/pages/EstruturaGovernancaPage.tsx` | **setAssessmentStep** | 507 | `setAssessmentStep(0);` |
| `src/components/pages/EstruturaGovernancaPage.tsx` | **assessmentType** | 846 | `{!hasConfirmedRole ? 'Confirme seu Cargo' : assessmentType === 'disc' ? 'DNA Com` |
| `src/components/pages/EstruturaGovernancaPage.tsx` | **assessmentType** | 852 | `{Array.from({ length: Math.ceil((assessmentType === 'disc' ? DISC_QUESTIONS : EN` |
| `src/components/pages/EstruturaGovernancaPage.tsx` | **assessmentType** | 911 | `{(assessmentType === 'disc' ? DISC_QUESTIONS : ENNEAGRAM_QUESTIONS).slice(assess` |
| `src/components/pages/EstruturaGovernancaPage.tsx` | **assessmentType** | 916 | `{assessmentType === 'disc' ? 'Comportamento' : 'Motivação'}` |
| `src/components/pages/EstruturaGovernancaPage.tsx` | **assessmentType** | 931 | `if (assessmentType === 'disc') {` |
| `src/components/pages/EstruturaGovernancaPage.tsx` | **assessmentType** | 939 | `(assessmentType === 'disc' ? answers[q.id] : enneagramAnswers[q.id]) === val` |
| `src/components/pages/EstruturaGovernancaPage.tsx` | **assessmentStep** | 955 | `disabled={assessmentStep === 0 && assessmentType === 'disc'}` |
| `src/components/pages/EstruturaGovernancaPage.tsx` | **setAssessmentStep** | 958 | `setAssessmentStep(s => s - 1);` |
| `src/components/pages/EstruturaGovernancaPage.tsx` | **assessmentType** | 959 | `} else if (assessmentType === 'enneagram') {` |
| `src/components/pages/EstruturaGovernancaPage.tsx` | **setAssessmentType** | 960 | `setAssessmentType('disc');` |
| `src/components/pages/EstruturaGovernancaPage.tsx` | **setAssessmentStep** | 961 | `setAssessmentStep(Math.ceil(DISC_QUESTIONS.length / 2) - 1);` |
| `src/components/pages/EstruturaGovernancaPage.tsx` | **assessmentType** | 969 | `{assessmentStep < Math.ceil((assessmentType === 'disc' ? DISC_QUESTIONS : ENNEAG` |
| `src/components/pages/EstruturaGovernancaPage.tsx` | **setAssessmentStep** | 971 | `onClick={() => setAssessmentStep(s => s + 1)}` |
| `src/components/pages/EstruturaGovernancaPage.tsx` | **assessmentType** | 977 | `) : assessmentType === 'disc' ? (` |
| `src/components/pages/EstruturaGovernancaPage.tsx` | **setAssessmentType** | 980 | `setAssessmentType('enneagram');` |
| `src/components/pages/EstruturaGovernancaPage.tsx` | **setAssessmentStep** | 981 | `setAssessmentStep(0);` |
| `src/components/pages/ExecutiveScenarioLabPage.tsx` | **Forecast** | 45 | `{/* Diagnóstico de Forecast (100% de largura para dar espaço de leitura premium)` |
| `src/components/pages/FinancialAdminDashboard.tsx` | **evaluateAxisRules** | 173 | `return evaluateAxisRules(flatMetrics, 'Gestão Administrativa e Financeira');` |
| `src/components/pages/GovernanceDashboardPage.tsx` | **evaluateAxisRules** | 203 | `return evaluateAxisRules(flatMetrics, 'Governança Corporativa', isBlocked);` |
| `src/components/pages/GovernanceDashboardPage.tsx` | **handleGenerateAnalysis** | 211 | `const handleGenerateAnalysis = async () => {` |
| `src/components/pages/GovernanceDashboardPage.tsx` | **recommendation** | 636 | `recommendation={rule.recommendation}` |
| `src/components/pages/InstitutionalBoardPackPage.tsx` | **generateBoardPack** | 74 | `const boardPack = FiduciaryRuntimeAdapter.generateBoardPack(payload);` |
| `src/components/pages/InstitutionalBoardPackPage.tsx` | **generateBoardPack** | 82 | `const boardPack = FiduciaryRuntimeAdapter.generateBoardPack(MOCK_SANDBOX_DATA);` |
| `src/components/pages/InstitutionalContinuityCockpitPage.tsx` | **generateExecutiveReport** | 44 | `return executiveRuntime.generateExecutiveReport(input);` |
| `src/components/pages/InstitutionalDeploymentReadinessPage.tsx` | **generateExecutiveReport** | 14 | `report = executiveRuntime.generateExecutiveReport({` |
| `src/components/pages/InstitutionalIntegrationsPage.tsx` | **handleSimulateUpload** | 26 | `const handleSimulateUpload = (connectorId: string) => {` |
| `src/components/pages/InstitutionalIntegrationsPage.tsx` | **onSimulateUpload** | 55 | `<ConnectorRegistryPanel onSimulateUpload={handleSimulateUpload} />` |
| `src/components/pages/InstitutionalOnboardingControlCenterPage.tsx` | **generateExecutiveReport** | 18 | `report = executiveRuntime.generateExecutiveReport({` |
| `src/components/pages/InstitutionalReportsPage.tsx` | **buildContext** | 74 | `const buildContext = (action: 'EXPORT_BOARD_PACK' | 'EXPORT_SNAPSHOT'): DataAcce` |
| `src/components/pages/InstitutionalReportsPage.tsx` | **buildContext** | 100 | `const context = buildContext('EXPORT_BOARD_PACK');` |
| `src/components/pages/InstitutionalReportsPage.tsx` | **buildContext** | 112 | `const context = buildContext('EXPORT_SNAPSHOT');` |
| `src/components/pages/InstitutionalStrategicIntelligencePage.tsx` | **evaluate** | 33 | `const strategicOutput = InstitutionalStrategicIntelligenceRuntime.evaluate(dummy` |
| `src/components/pages/LeadershipProfilePage.tsx` | **setTeamAssessments** | 292 | `setTeamAssessments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));` |
| `src/components/pages/LeadershipProfilePage.tsx` | **calculateUserDISC** | 318 | `disc: calculateUserDISC(),` |
| `src/components/pages/LeadershipProfilePage.tsx` | **calculateUserEnneagram** | 319 | `enneagram: calculateUserEnneagram(),` |
| `src/components/pages/LeadershipProfilePage.tsx` | **calculateUserDISC** | 335 | `const calculateUserDISC = () => {` |
| `src/components/pages/LeadershipProfilePage.tsx` | **calculateUserEnneagram** | 353 | `const calculateUserEnneagram = () => {` |
| `src/components/pages/LeadershipProfilePage.tsx` | **calculateUserDISC** | 361 | `const userProfile = useMemo(() => calculateUserDISC(), [answers]);` |
| `src/components/pages/LeadershipProfilePage.tsx` | **calculateUserEnneagram** | 362 | `const userEnneagram = useMemo(() => calculateUserEnneagram(), [enneagramAnswers]` |
| `src/components/pages/LeadershipProfilePage.tsx` | **assessmentType** | 673 | `{!hasConfirmedRole ? 'Confirme seu Cargo' : assessmentType === 'disc' ? 'DNA de ` |
| `src/components/pages/LeadershipProfilePage.tsx` | **assessmentType** | 679 | `{Array.from({ length: Math.ceil((assessmentType === 'disc' ? DISC_QUESTIONS : EN` |
| `src/components/pages/LeadershipProfilePage.tsx` | **assessmentType** | 739 | `{(assessmentType === 'disc' ? DISC_QUESTIONS : ENNEAGRAM_QUESTIONS).slice(assess` |
| `src/components/pages/LeadershipProfilePage.tsx` | **assessmentType** | 750 | `if (assessmentType === 'disc') {` |
| `src/components/pages/LeadershipProfilePage.tsx` | **assessmentType** | 758 | `(assessmentType === 'disc' ? answers[q.id] : enneagramAnswers[q.id]) === val` |
| `src/components/pages/LeadershipProfilePage.tsx` | **assessmentStep** | 773 | `disabled={assessmentStep === 0 && assessmentType === 'disc'}` |
| `src/components/pages/LeadershipProfilePage.tsx` | **setAssessmentStep** | 776 | `setAssessmentStep(s => s - 1);` |
| `src/components/pages/LeadershipProfilePage.tsx` | **assessmentType** | 777 | `} else if (assessmentType === 'enneagram') {` |
| `src/components/pages/LeadershipProfilePage.tsx` | **setAssessmentType** | 778 | `setAssessmentType('disc');` |
| `src/components/pages/LeadershipProfilePage.tsx` | **setAssessmentStep** | 779 | `setAssessmentStep(Math.ceil(DISC_QUESTIONS.length / 2) - 1);` |
| `src/components/pages/LeadershipProfilePage.tsx` | **assessmentType** | 787 | `{assessmentStep < Math.ceil((assessmentType === 'disc' ? DISC_QUESTIONS : ENNEAG` |
| `src/components/pages/LeadershipProfilePage.tsx` | **setAssessmentStep** | 789 | `onClick={() => setAssessmentStep(s => s + 1)}` |
| `src/components/pages/LeadershipProfilePage.tsx` | **assessmentType** | 795 | `) : assessmentType === 'disc' ? (` |
| `src/components/pages/LeadershipProfilePage.tsx` | **setAssessmentType** | 798 | `setAssessmentType('enneagram');` |
| `src/components/pages/LeadershipProfilePage.tsx` | **setAssessmentStep** | 799 | `setAssessmentStep(0);` |
| `src/components/pages/LoanInvestmentSimPage.tsx` | **calculateNPV** | 82 | `const calculateNPV = (rate: number) => {` |
| `src/components/pages/LoanInvestmentSimPage.tsx` | **calculateNPV** | 91 | `let npv = calculateNPV(mid);` |
| `src/components/pages/LoanInvestmentSimPage.tsx` | **consortiumCalculatedResults** | 268 | `const consortiumCalculatedResults = useMemo(() => {` |
| `src/components/pages/LoansPage.tsx` | **buildPriceSchedule** | 61 | `function buildPriceSchedule({ valorEmprestimo, periodoMeses, taxaMensal, parcela` |
| `src/components/pages/LoansPage.tsx` | **buildSacSchedule** | 84 | `function buildSacSchedule({ valorEmprestimo, periodoMeses, taxaMensal, dataPrime` |
| `src/components/pages/LoansPage.tsx` | **buildPriceSchedule** | 169 | `const priceSchedule = useMemo(() => buildPriceSchedule(inputs), [inputs]);` |
| `src/components/pages/LoansPage.tsx` | **buildSacSchedule** | 170 | `const sacSchedule = useMemo(() => buildSacSchedule(inputs), [inputs]);` |
| `src/components/pages/MarketingComercialPage.tsx` | **recommendations** | 124 | `const recommendations = useMemo(() => {` |
| `src/components/pages/OperacionalPage.tsx` | **recommendations** | 93 | `const recommendations = useMemo(() => {` |
| `src/components/pages/PilotExperienceDashboard.tsx` | **calculate** | 98 | `const metrics = PilotExperienceMetrics.calculate(selectedTenant);` |
| `src/components/pages/PilotMonitoringDashboard.tsx` | **calculateMetrics** | 49 | `const metrics = PilotRollbackProtocol.calculateMetrics(selectedTenant);` |
| `src/components/pages/PortfolioPage.tsx` | **calculated** | 223 | `const calculated = 40 + (margin * 2) + (liq * 5);` |
| `src/components/pages/PurchasingPage.tsx` | **totalSavingsGenerated** | 101 | `let totalSavingsGenerated = 0;` |
| `src/components/pages/RelatorioExecutivoPage.tsx` | **evaluateFinancialRules** | 77 | `const sacerdotalRules = useMemo(() => evaluateFinancialRules(kpis), [kpis]);` |
| `src/components/pages/RelatorioExecutivoPage.tsx` | **generateReportSummary** | 108 | `const generateReportSummary = async () => {` |
| `src/components/pages/RelatorioExecutivoPage.tsx` | **recommendation** | 322 | `recommendation={rule.recommendation}` |
| `src/components/pages/RuntimeObservabilityPage.tsx` | **generateSnapshot** | 88 | `const sn = await FiduciaryRuntimeAdapter.RuntimeHealthMonitor.generateSnapshot()` |
| `src/components/pages/TaxReformImpactPage.tsx` | **calculateTaxImpact** | 196 | `const metrics = useMemo(() => calculateTaxImpact(diagnosis, selectedScenario), [` |
| `src/components/pages/TaxReformImpactPage.tsx` | **recommendations** | 197 | `const recommendations = useMemo(() => getStrategicRecommendations(diagnosis, met` |
| `src/components/pages/TaxReformImpactPage.tsx` | **calculateTaxImpact** | 516 | `const scenarioMetrics = calculateTaxImpact(diagnosis, s);` |
| `src/components/pages/TaxReformImpactPage.tsx` | **calculateTaxImpact** | 519 | `const maxImpact = Math.max(...scenarios.map(sc => calculateTaxImpact(diagnosis, ` |
| `src/components/pages/ViabilityPage.tsx` | **simulatedFlows** | 29 | `const simulatedFlows = originalFlows.map((v: number, i: number) => {` |
| `src/components/pages/ViabilityPage.tsx` | **calculateVPL** | 34 | `const simulatedVPL = calculateVPL(simulatedFlows, discountRate / 100);` |
| `src/components/pages/ViabilityPage.tsx` | **calculateTIR** | 35 | `const simulatedTIR = calculateTIR(simulatedFlows);` |
| `src/components/pages/ViabilityPage.tsx` | **calculatePayback** | 36 | `const simulatedPayback = calculatePayback(simulatedFlows);` |
| `src/components/pages/ViabilityPage.tsx` | **simulatedIL** | 38 | `const simulatedIL = investment !== 0 ? (simulatedVPL + investment) / investment ` |
| `src/components/pages/governance/BenchmarkAdvisoryPanel.tsx` | **evaluateAdvisory** | 29 | `const advisory = FiduciaryRuntimeAdapter.benchmarkAdvisoryEngine.evaluateAdvisor` |
| `src/components/pages/governance/BenchmarkAdvisoryPanel.tsx` | **evaluateReadiness** | 30 | `const readiness = FiduciaryRuntimeAdapter.benchmarkReadinessEngine.evaluateReadi` |
| `src/components/pages/governance/BenchmarkComparativePanel.tsx` | **calculateComparison** | 27 | `const comparison = FiduciaryRuntimeAdapter.benchmarkComparativeEngine.calculateC` |
| `src/components/pages/governance/BenchmarkComparativePanel.tsx` | **evaluateReadiness** | 28 | `const readiness = FiduciaryRuntimeAdapter.benchmarkReadinessEngine.evaluateReadi` |
| `src/components/pages/governance/BenchmarkReadinessPanel.tsx` | **evaluateReadiness** | 28 | `const readiness = FiduciaryRuntimeAdapter.benchmarkReadinessEngine.evaluateReadi` |
| `src/components/pages/governance/BoardMeetingMode.tsx` | **generateBoardPack** | 64 | `return FiduciaryRuntimeAdapter.boardPackGeneratorEngine.generateBoardPack(client` |
| `src/components/pages/governance/BoardMeetingMode.tsx` | **generateJourney** | 68 | `return FiduciaryRuntimeAdapter.governanceJourneyEngine.generateJourney(clientId,` |
| `src/components/pages/governance/BoardMeetingMode.tsx` | **evaluateReadiness** | 201 | `const isLocked = FiduciaryRuntimeAdapter.benchmarkReadinessEngine.evaluateReadin` |
| `src/components/pages/governance/BoardPackDataLoader.ts` | **buildBPHierarchy** | 43 | `const { summary: bpSummary } = buildBPHierarchy(arr);` |
| `src/components/pages/governance/BoardPackDataLoader.ts` | **generateInitialDreState** | 99 | `...generateInitialDreState(),` |
| `src/components/pages/governance/BoardPackDataLoader.ts` | **calculateDreCascade** | 106 | `const cascadeResult = calculateDreCascade(allRows);` |
| `src/components/pages/governance/BoardPackDataLoader.ts` | **calculatedCycles** | 135 | `const calculatedCycles = Object.keys(historyByYear).filter(year => {` |
| `src/components/pages/governance/ESGIMAssessmentPage.tsx` | **ESGIMAssessmentPage** | 49 | `export function ESGIMAssessmentPage({ clientId }: { clientId: string }) {` |
| `src/components/pages/governance/ESGIMAssessmentPage.tsx` | **assessment** | 122 | `const assessment = useMemo(() => {` |
| `src/components/pages/governance/ESGIMAssessmentPage.tsx` | **calculateAssessment** | 123 | `return FiduciaryRuntimeAdapter.esgimAssessmentEngine.calculateAssessment(clientI` |
| `src/components/pages/governance/ESGIMAssessmentPage.tsx` | **calculateResilience** | 127 | `return FiduciaryRuntimeAdapter.institutionalResilienceIndexEngine.calculateResil` |
| `src/components/pages/governance/ESGIMAssessmentPage.tsx` | **generatePriorities** | 132 | `return FiduciaryRuntimeAdapter.boardPrioritiesEngine.generatePriorities(clientId` |
| `src/components/pages/governance/ESGIMAssessmentPage.tsx` | **generateRoadmap** | 137 | `return FiduciaryRuntimeAdapter.governanceRoadmapEngine.generateRoadmap(clientId,` |
| `src/components/pages/governance/ESGIMAssessmentPage.tsx` | **calculateMonitoring** | 142 | `return FiduciaryRuntimeAdapter.governanceMonitoringEngine.calculateMonitoring(cl` |
| `src/components/pages/governance/ESGIMAssessmentPage.tsx` | **Assessores** | 162 | `Esta área é restrita a Conselheiros (Board), Assessores (Advisor), Executivos e ` |
| `src/components/pages/governance/ExecutiveExecutionCenter.tsx` | **capacityForecast** | 77 | `capacityForecast = 'HIGH',` |
| `src/components/pages/governance/ExecutiveExecutionCenter.tsx` | **capacityForecast** | 263 | `capacityForecast === 'HIGH' ? "bg-emerald-500" : capacityForecast === 'MODERATE'` |
| `src/components/pages/governance/ExecutiveExecutionCenter.tsx` | **capacityForecast** | 265 | `style={{ width: capacityForecast === 'HIGH' ? '100%' : capacityForecast === 'MOD` |
| `src/components/pages/governance/ExecutiveExecutionCenter.tsx` | **capacityForecast** | 269 | `{capacityForecast === 'HIGH' ? "Pronto para novos planos" : "Restrição de novos ` |
| `src/components/pages/governance/GovernanceExecutionPanel.tsx` | **calculateOverdueRate** | 121 | `const overdueRate = registry.calculateOverdueRate(scenario);` |
| `src/components/pages/governance/GovernanceExecutionPanel.tsx` | **calculateAgingBuckets** | 122 | `const aging = registry.calculateAgingBuckets(scenario);` |
| `src/components/pages/governance/GovernanceJourneyPanel.tsx` | **generateJourney** | 44 | `return FiduciaryRuntimeAdapter.governanceJourneyEngine.generateJourney(clientId,` |
| `src/components/pages/governance/GovernanceJourneyPanel.tsx` | **evaluateReadiness** | 49 | `return FiduciaryRuntimeAdapter.benchmarkReadinessEngine.evaluateReadiness(client` |
| `src/components/pages/governance/GovernanceJourneyPanel.tsx` | **calculateResilience** | 238 | `IRI: {FiduciaryRuntimeAdapter.institutionalResilienceIndexEngine.calculateResili` |
| `src/components/pages/governance/GovernanceKnowledgePanel.tsx` | **calculatePAI** | 31 | `const { score: paiScore, level: paiLevel } = FiduciaryRuntimeAdapter.governanceK` |
| `src/components/pages/governance/GovernanceLearningPanel.tsx` | **calculateLearning** | 25 | `const learning = FiduciaryRuntimeAdapter.governanceLearningEngine.calculateLearn` |
| `src/components/pages/governance/GovernanceLearningPanel.tsx` | **evaluateReadiness** | 26 | `const readiness = FiduciaryRuntimeAdapter.benchmarkReadinessEngine.evaluateReadi` |
| `src/components/pages/governance/GovernanceMaturityCenter.tsx` | **calculateAxisMaturity** | 117 | `A: calculateAxisMaturity(finalResponses, e as any),` |
| `src/components/pages/governance/GovernanceMaturityCenter.tsx` | **handleGenerateIntelligence** | 121 | `const handleGenerateIntelligence = async () => {` |
| `src/components/pages/governance/GovernanceMaturityCenter.tsx` | **calculateAxisMaturity** | 127 | `axisScores[e] = calculateAxisMaturity(finalResponses, e as any);` |
| `src/components/pages/governance/GovernanceMaturityCenter.tsx` | **generateGovernanceDiagnosis** | 130 | `const diagnosis = await generateGovernanceDiagnosis(axisScores, indicators, "Emp` |
| `src/components/pages/governance/GovernanceMaturityCenter.tsx` | **calculateAxisMaturity** | 149 | `[e]: calculateAxisMaturity(finalResponses, e as any)` |
| `src/components/pages/governance/GovernanceRiskHeatmap.tsx` | **generateHeatmap** | 14 | `const data = FiduciaryRuntimeAdapter.enterpriseRiskEngine.generateHeatmap('curre` |
| `src/components/pages/governance/LeadershipDNACenter.tsx` | **setTeamAssessments** | 259 | `setTeamAssessments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));` |
| `src/components/pages/governance/LeadershipDNACenter.tsx` | **calculateUserDISC** | 281 | `disc: calculateUserDISC(),` |
| `src/components/pages/governance/LeadershipDNACenter.tsx` | **calculateUserEnneagram** | 282 | `enneagram: calculateUserEnneagram(),` |
| `src/components/pages/governance/LeadershipDNACenter.tsx` | **calculateUserDISC** | 303 | `const calculateUserDISC = () => {` |
| `src/components/pages/governance/LeadershipDNACenter.tsx` | **calculateUserEnneagram** | 321 | `const calculateUserEnneagram = () => {` |
| `src/components/pages/governance/LeadershipDNACenter.tsx` | **calculateUserDISC** | 329 | `const userProfile = useMemo(() => calculateUserDISC(), [answers]);` |
| `src/components/pages/governance/LeadershipDNACenter.tsx` | **calculateUserEnneagram** | 330 | `const userEnneagram = useMemo(() => calculateUserEnneagram(), [enneagramAnswers]` |
| `src/components/pages/governance/LeadershipDNACenter.tsx` | **setAssessmentStep** | 507 | `setAssessmentStep(0);` |
| `src/components/pages/governance/LeadershipDNACenter.tsx` | **assessmentType** | 846 | `{!hasConfirmedRole ? 'Confirme seu Cargo' : assessmentType === 'disc' ? 'DNA Com` |
| `src/components/pages/governance/LeadershipDNACenter.tsx` | **assessmentType** | 852 | `{Array.from({ length: Math.ceil((assessmentType === 'disc' ? DISC_QUESTIONS : EN` |
| `src/components/pages/governance/LeadershipDNACenter.tsx` | **assessmentType** | 911 | `{(assessmentType === 'disc' ? DISC_QUESTIONS : ENNEAGRAM_QUESTIONS).slice(assess` |
| `src/components/pages/governance/LeadershipDNACenter.tsx` | **assessmentType** | 916 | `{assessmentType === 'disc' ? 'Comportamento' : 'Motivação'}` |
| `src/components/pages/governance/LeadershipDNACenter.tsx` | **assessmentType** | 931 | `if (assessmentType === 'disc') {` |
| `src/components/pages/governance/LeadershipDNACenter.tsx` | **assessmentType** | 939 | `(assessmentType === 'disc' ? answers[q.id] : enneagramAnswers[q.id]) === val` |
| `src/components/pages/governance/LeadershipDNACenter.tsx` | **assessmentStep** | 955 | `disabled={assessmentStep === 0 && assessmentType === 'disc'}` |
| `src/components/pages/governance/LeadershipDNACenter.tsx` | **setAssessmentStep** | 958 | `setAssessmentStep(s => s - 1);` |
| `src/components/pages/governance/LeadershipDNACenter.tsx` | **assessmentType** | 959 | `} else if (assessmentType === 'enneagram') {` |
| `src/components/pages/governance/LeadershipDNACenter.tsx` | **setAssessmentType** | 960 | `setAssessmentType('disc');` |
| `src/components/pages/governance/LeadershipDNACenter.tsx` | **setAssessmentStep** | 961 | `setAssessmentStep(Math.ceil(DISC_QUESTIONS.length / 2) - 1);` |
| `src/components/pages/governance/LeadershipDNACenter.tsx` | **assessmentType** | 969 | `{assessmentStep < Math.ceil((assessmentType === 'disc' ? DISC_QUESTIONS : ENNEAG` |
| `src/components/pages/governance/LeadershipDNACenter.tsx` | **setAssessmentStep** | 971 | `onClick={() => setAssessmentStep(s => s + 1)}` |
| `src/components/pages/governance/LeadershipDNACenter.tsx` | **assessmentType** | 977 | `) : assessmentType === 'disc' ? (` |
| `src/components/pages/governance/LeadershipDNACenter.tsx` | **setAssessmentType** | 980 | `setAssessmentType('enneagram');` |
| `src/components/pages/governance/LeadershipDNACenter.tsx` | **setAssessmentStep** | 981 | `setAssessmentStep(0);` |
| `src/components/pages/governance/ObservabilityConsolePage.tsx` | **buildDataAccessContext** | 59 | `const context = buildDataAccessContext(` |
| `src/components/pages/governance/ObservabilityConsolePage.tsx` | **buildDataAccessContext** | 581 | `const ctx = buildDataAccessContext('VIEW_OBSERVABILITY', 'ObservabilityTelemetry` |
| `src/components/reality-validation/InstitutionalComplexityViewer.tsx` | **simulate** | 9 | `const intercompany = IntercompanyComplexitySimulator.simulate(tenantId, dataset)` |
| `src/components/reality-validation/OperationalScalePanel.tsx` | **evaluate** | 8 | `const report = OperationalScalabilityEvaluator.evaluate(tenantId);` |
| `src/components/reality-validation/OperationalStressDashboard.tsx` | **buildStressProfile** | 9 | `const stress = OperationalStressDatasetBuilder.buildStressProfile(tenantId, data` |
| `src/components/reality-validation/RuntimeStabilityPanel.tsx` | **evaluate** | 6 | `const report = InstitutionalSessionStabilityEngine.evaluate(tenantId, 120);` |
| `src/components/scenario-simulation/GovernanceForecastSurface.tsx` | **activeForecast** | 18 | `const activeForecast = forecastOutput;` |
| `src/components/strategic-simulation/StrategicSimulationFeed.tsx` | **simulate** | 39 | `const simResult = StrategicDecisionSimulator.simulate(input);` |
| `src/components/war-gaming/CrisisScenarioPanel.tsx` | **handleSimulate** | 10 | `const handleSimulate = () => {` |
| `src/components/war-gaming/CrisisScenarioPanel.tsx` | **onSimulate** | 19 | `onSimulate(inputs);` |
| `src/components/war-gaming/InstitutionalWarRoomPage.tsx` | **handleSimulate** | 20 | `const handleSimulate = (inputs: CrisisInput[]) => {` |
| `src/components/war-gaming/InstitutionalWarRoomPage.tsx` | **executeSimulatedCrisis** | 23 | `const result = WarGameAdapter.executeSimulatedCrisis(` |
| `src/components/war-gaming/InstitutionalWarRoomPage.tsx` | **onSimulate** | 55 | `<CrisisScenarioPanel onSimulate={handleSimulate} />` |
| `src/components/war-gaming/LiquidityStressTimeline.tsx` | **maxSimulated** | 10 | `const maxSimulated = 24;` |
| `src/hooks/useBoardMode.ts` | **generateAttentionItems** | 17 | `const attentionItems = BoardRuntimeAdapter.generateAttentionItems(input);` |
| `src/hooks/useBoardMode.ts` | **generateBoardResolutions** | 18 | `const resolutions = BoardRuntimeAdapter.generateBoardResolutions(input, attentio` |
| `src/hooks/useBoardMode.ts` | **generateBoardAgenda** | 19 | `const agenda = BoardRuntimeAdapter.generateBoardAgenda(input, attentionItems, ri` |
| `src/hooks/useExecutiveAdvisory.ts` | **calculateFinancialMetrics** | 39 | `const metrics = calculateFinancialMetrics(bpSummary as any, dreEbitda, dreLucro,` |
| `src/hooks/useExecutiveAdvisory.ts` | **evaluateMasterCausality** | 47 | `const causal = evaluateMasterCausality(bpSummary, metrics, identity, 12); // Ass` |
| `src/hooks/useExecutiveAdvisory.ts` | **analyzeOperationalIntelligence** | 78 | `const operational = analyzeOperationalIntelligence(operationalInput);` |
| `src/hooks/useExecutiveAdvisory.ts` | **analyzeCashFlowIntelligence** | 101 | `const cashFlow = analyzeCashFlowIntelligence(cashFlowInput);` |
| `src/hooks/useExecutiveAdvisory.ts` | **generateExecutiveAdvisory** | 110 | `return generateExecutiveAdvisory(input);` |
| `src/hooks/useFinancialData.ts` | **buildHistoricalSeries** | 153 | `const series = buildHistoricalSeries(clientId, allEntries);` |
| `src/hooks/usePredictiveGovernance.ts` | **calculateTrajectory** | 45 | `const trajectory = InstitutionalTrajectoryEngine.calculateTrajectory(snapshots);` |
| `src/hooks/usePredictiveGovernance.ts` | **evaluateRisks** | 46 | `const risks = PredictiveRiskEngine.evaluateRisks(snapshots);` |
| `src/hooks/usePredictiveGovernance.ts` | **generateWarnings** | 47 | `const warnings = InstitutionalEarlyWarningEngine.generateWarnings(snapshots);` |
| `src/hooks/usePredictiveGovernance.ts` | **calculateMomentum** | 49 | `const momentum = GovernanceMomentumEngine.calculateMomentum(snapshots);` |
| `src/hooks/usePredictiveGovernance.ts` | **generateRecommendations** | 50 | `const recommendations = PredictiveRecommendationEngine.generateRecommendations(s` |
| `src/hooks/usePrescriptiveGovernance.ts` | **evaluateCapacity** | 55 | `const capacity = ExecutionCapacityConstraintEngine.evaluateCapacity(snapshots);` |
| `src/hooks/usePrescriptiveGovernance.ts` | **generateActions** | 58 | `const rawActions = PrescriptiveActionEngine.generateActions(predictiveOutput.ris` |
| `src/hooks/usePrescriptiveGovernance.ts` | **generateAgenda** | 70 | `const boardAgenda = BoardAgendaEngine.generateAgenda(decisionMatrix, predictiveO` |
| `src/hooks/usePrescriptiveGovernance.ts` | **generateResolutions** | 73 | `const boardResolutions = BoardDraftingEngine.generateResolutions(boardAgenda);` |
| `src/hooks/useRealIndicatorData.ts` | **calculateAll** | 135 | `const calculateAll = () => {` |
| `src/hooks/useRealIndicatorData.ts` | **buildBPHierarchy** | 222 | `const bpSummary = bpEntries.length > 0 ? buildBPHierarchy(bpEntries).summary : n` |
| `src/hooks/useRealIndicatorData.ts` | **calculateAll** | 247 | `onSnapshot(qAcc, snap => { mappedAccounts = snap.docs.map(d => d.data() as { nam` |
| `src/hooks/useRealIndicatorData.ts` | **calculateAll** | 268 | `calculateAll();` |
| `src/hooks/useRealIndicatorData.ts` | **calculateAll** | 270 | `onSnapshot(qAssets, snap => { currentAssets = snap.docs.map(d => d.data()); calc` |
| `src/hooks/useRealIndicatorData.ts` | **calculateAll** | 271 | `onSnapshot(qCashFlows, snap => { currentCashFlows = snap.docs.map(d => d.data())` |
| `src/hooks/useRealIndicatorData.ts` | **calculateAll** | 272 | `onSnapshot(qPositions, snap => { currentPositions = snap.docs.map(d => d.data())` |
| `src/hooks/useRealIndicatorData.ts` | **calculateAll** | 273 | `onSnapshot(qPayables, snap => { currentPayables = snap.docs.map(d => d.data()); ` |
| `src/hooks/useRealIndicatorData.ts` | **calculateAll** | 274 | `onSnapshot(qReceivables, snap => { currentReceivables = snap.docs.map(d => d.dat` |
| `src/hooks/useScenarioSimulation.ts` | **simulateGrowthScenario** | 36 | `const result = simulateGrowthScenario(input);` |
| `src/hooks/useSemanticConsistency.ts` | **generateReport** | 34 | `const report = ExecutiveConsistencyReportEngine.generateReport(effectiveOutputs)` |
| `src/hooks/useSemanticConsistency.ts` | **evaluateTrend** | 43 | `const trend = ConsistencyTrendEngine.evaluateTrend(history);` |

### AUTHORIZED_ENGINE (1906)
| Arquivo | Função | Linha | Contexto |
|---|---|---|---|
| `src/core/runtime/CrossStatementCausalityEngine.ts` | **analyze** | 88 | `public static analyze(` |
| `src/core/runtime/ExecutiveExperienceConsistencyEngine.ts` | **score** | 13 | `const score = report.scores?.composite ?? 0;` |
| `src/core/runtime/ExecutiveNarrativeOrchestrator.ts` | **evaluate** | 100 | `const enforcement = GlobalFiduciaryDistributionEnforcementEngine.evaluate(fiduci` |
| `src/core/runtime/ExecutivePriorityConsolidationEngine.ts` | **evaluate** | 99 | `const enforcement = GlobalFiduciaryDistributionEnforcementEngine.evaluate(fiduci` |
| `src/core/runtime/InstitutionalFinancialThesisEngine.ts` | **generateInstitutionalFinancialThesisProfile** | 20 | `export function generateInstitutionalFinancialThesisProfile(` |
| `src/core/runtime/InstitutionalFinancialThesisEngine.ts` | **generate** | 94 | `public static generate(` |
| `src/core/runtime/InstitutionalFinancialThesisEngine.ts` | **generateInstitutionalFinancialThesisProfile** | 123 | `const profile = generateInstitutionalFinancialThesisProfile(` |
| `src/core/runtime/adapters/causality-interpretation-adapter.ts` | **evaluateExecutiveCausality** | 39 | `const executiveCausality = evaluateExecutiveCausality(metrics, bpSummary, scores` |
| `src/core/runtime/adapters/severity-modulator-adapter.ts` | **evaluateInventoryQuality** | 34 | `const inventory = evaluateInventoryQuality(bpSummary, metrics, segment, salesGro` |
| `src/core/runtime/adapters/severity-modulator-adapter.ts` | **evaluateMaturityContext** | 35 | `const maturity = evaluateMaturityContext(bpSummary, metrics, segment, dreDataLen` |
| `src/core/runtime/adapters/severity-modulator-adapter.ts` | **calculateInferenceConfidence** | 37 | `const confidence = calculateInferenceConfidence(1, 1, 0.5);` |
| `src/core/runtime/advisory-narrative/BoardCommunicationEngine.ts` | **generateBoardBriefing** | 10 | `public static generateBoardBriefing(report: any, validationResult: any): string ` |
| `src/core/runtime/advisory-narrative/BoardCommunicationEngine.ts` | **scores** | 11 | `const scores = report.scores ?? { structural: 80, capitalPreservation: 80 };` |
| `src/core/runtime/advisory-narrative/ConfidenceNarrativeEngine.ts` | **generateConfidenceStatement** | 12 | `public static generateConfidenceStatement(` |
| `src/core/runtime/advisory-narrative/ExecutiveNarrativeEngine.ts` | **recommendedPath** | 62 | `recommendedPath = comparisonReport.recommendedPath;` |
| `src/core/runtime/advisory-narrative/ExecutiveNarrativeEngine.ts` | **generateFiduciaryNarrative** | 74 | `const fiduciarySum = FiduciaryCommunicationEngine.generateFiduciaryNarrative(rep` |
| `src/core/runtime/advisory-narrative/ExecutiveNarrativeEngine.ts` | **generateBoardBriefing** | 75 | `const boardBrief = BoardCommunicationEngine.generateBoardBriefing(report, valida` |
| `src/core/runtime/advisory-narrative/ExecutiveNarrativeEngine.ts` | **generateRecommendationNarrative** | 76 | `const recData = StrategicRecommendationEngine.generateRecommendationNarrative(` |
| `src/core/runtime/advisory-narrative/ExecutiveNarrativeEngine.ts` | **generateTradeoffAnalysis** | 84 | `? TradeoffNarrativeEngine.generateTradeoffAnalysis(comparisonReport.candidatePat` |
| `src/core/runtime/advisory-narrative/ExecutiveNarrativeEngine.ts` | **generateScenarioExplanation** | 88 | `? ScenarioExplanationEngine.generateScenarioExplanation(comparisonReport.candida` |
| `src/core/runtime/advisory-narrative/ExecutiveNarrativeEngine.ts` | **generateGovernanceGuidelines** | 91 | `const govGuidelines = GovernanceNarrativeEngine.generateGovernanceGuidelines(rep` |
| `src/core/runtime/advisory-narrative/ExecutiveNarrativeEngine.ts` | **generateSummary** | 92 | `const summary = ExecutiveSummaryEngine.generateSummary(report, recommendedPath, ` |
| `src/core/runtime/advisory-narrative/ExecutiveNarrativeEngine.ts` | **generateConfidenceStatement** | 93 | `const confidenceStatement = ConfidenceNarrativeEngine.generateConfidenceStatemen` |
| `src/core/runtime/advisory-narrative/ExecutiveNarrativeEngine.ts` | **generateFiduciaryDisclosure** | 94 | `const disclosure = InstitutionalDisclosureNarrativeEngine.generateFiduciaryDiscl` |
| `src/core/runtime/advisory-narrative/ExecutiveSummaryEngine.ts` | **generateSummary** | 13 | `public static generateSummary(` |
| `src/core/runtime/advisory-narrative/ExecutiveSummaryEngine.ts` | **scores** | 18 | `const scores = report.scores ?? { composite: 70 };` |
| `src/core/runtime/advisory-narrative/FiduciaryCommunicationEngine.ts` | **generateFiduciaryNarrative** | 12 | `public static generateFiduciaryNarrative(` |
| `src/core/runtime/advisory-narrative/FiduciaryCommunicationEngine.ts` | **scores** | 17 | `const scores = report.scores ?? { financial: 70, composite: 70, governance: 70 }` |
| `src/core/runtime/advisory-narrative/FiduciaryCommunicationEngine.ts` | **liquidityScore** | 18 | `const liquidityScore = scores.liquidity ?? scores.financial ?? 70;` |
| `src/core/runtime/advisory-narrative/FiduciaryCommunicationEngine.ts` | **compositeScore** | 19 | `const compositeScore = scores.composite ?? 70;` |
| `src/core/runtime/advisory-narrative/GovernanceNarrativeEngine.ts` | **generateGovernanceGuidelines** | 12 | `public static generateGovernanceGuidelines(` |
| `src/core/runtime/advisory-narrative/GovernanceNarrativeEngine.ts` | **scores** | 17 | `const scores = report.scores ?? { governance: 70 };` |
| `src/core/runtime/advisory-narrative/GovernanceNarrativeEngine.ts` | **govScore** | 18 | `const govScore = scores.governance ?? 70;` |
| `src/core/runtime/advisory-narrative/InstitutionalDisclosureNarrativeEngine.ts` | **generateFiduciaryDisclosure** | 10 | `public static generateFiduciaryDisclosure(` |
| `src/core/runtime/advisory-narrative/ScenarioExplanationEngine.ts` | **generateScenarioExplanation** | 10 | `public static generateScenarioExplanation(` |
| `src/core/runtime/advisory-narrative/StrategicRecommendationEngine.ts` | **generateRecommendationNarrative** | 12 | `public static generateRecommendationNarrative(` |
| `src/core/runtime/advisory-narrative/StrategicRecommendationEngine.ts` | **recommendedPath** | 25 | `if (recommendedPath === 'Survival Stabilization' || recommendedPath === 'Conserv` |
| `src/core/runtime/advisory-narrative/TradeoffNarrativeEngine.ts` | **generateTradeoffAnalysis** | 10 | `public static generateTradeoffAnalysis(` |
| `src/core/runtime/ai-governance/AIPromptPolicyEngine.ts` | **evaluate** | 12 | `static evaluate(query: string): AIPromptPolicy {` |
| `src/core/runtime/ai-governance/InstitutionalCopilotRuntime.ts` | **evaluate** | 22 | `const policy = AIPromptPolicyEngine.evaluate(request.query);` |
| `src/core/runtime/ai-governance/InstitutionalCopilotRuntime.ts` | **generateResponse** | 56 | `const rawResponse = await this.provider.generateResponse(request.query, allowedC` |
| `src/core/runtime/ai-governance/providers/LLMProvider.ts` | **generateResponse** | 2 | `generateResponse(prompt: string, context: any[]): Promise<string>;` |
| `src/core/runtime/ai-governance/providers/MockLLMProvider.ts` | **generateResponse** | 10 | `async generateResponse(prompt: string, context: any[]): Promise<string> {` |
| `src/core/runtime/ai-governance/providers/OpenAIProvider.ts` | **generateResponse** | 4 | `async generateResponse(prompt: string, context: any[]): Promise<string> {` |
| `src/core/runtime/audit-assurance/AssuranceCertificationEngine.ts` | **overallScore** | 57 | `const overallScore = Math.round(` |
| `src/core/runtime/audit-assurance/EvidenceIntegrityEngine.ts` | **recalculated** | 19 | `const recalculated = this.evidenceEngine.signPackage(pkg);` |
| `src/core/runtime/audit-assurance/ExecutiveAssuranceRuntime.ts` | **evaluateExecution** | 51 | `public evaluateExecution(inputs: {` |
| `src/core/runtime/audit-assurance/ExecutiveAssuranceRuntime.ts` | **auditabilityScore** | 119 | `const auditabilityScore = completenessResult.complete ? 100 : 100 - (completenes` |
| `src/core/runtime/audit-assurance/ExecutiveAssuranceRuntime.ts` | **explainabilityScore** | 120 | `const explainabilityScore = Object.keys(explainabilityNarrative).length > 0 ? 10` |
| `src/core/runtime/audit-assurance/ExecutiveAssuranceRuntime.ts` | **evidenceIntegrityScore** | 121 | `const evidenceIntegrityScore = isSignatureValid && !orphanResult.hasOrphans ? 10` |
| `src/core/runtime/audit-assurance/ExecutiveAssuranceRuntime.ts` | **lineageReproducibilityScore** | 124 | `const lineageReproducibilityScore = isLineageChainValid && chronologyValid ? lin` |
| `src/core/runtime/audit-assurance/ExecutiveAssuranceRuntime.ts` | **regulatoryReadinessScore** | 125 | `const regulatoryReadinessScore = disclosureResult.adequate ? 100 : 100 - (disclo` |
| `src/core/runtime/audit-assurance/ExecutiveAssuranceRuntime.ts` | **CertificationScores** | 127 | `const baseScores: CertificationScores = {` |
| `src/core/runtime/audit-assurance/InstitutionalAuditEngine.ts` | **sumScores** | 50 | `let sumScores = 0;` |
| `src/core/runtime/audit-assurance/InstitutionalAuditEngine.ts` | **systemIntegrityScore** | 76 | `const systemIntegrityScore =` |
| `src/core/runtime/audit-assurance/InstitutionalAuditEngine.ts` | **generateCertifiedLog** | 93 | `public generateCertifiedLog(): string {` |
| `src/core/runtime/audit-assurance/InstitutionalForensicsEngine.ts` | **analyzeTrails** | 19 | `public analyzeTrails(trails: AuditTrailEntry[]): ForensicsFinding[] {` |
| `src/core/runtime/behavioral-intelligence/BehavioralTrajectoryEngine.ts` | **calculateCumulativeProfile** | 51 | `const olderProfile = InstitutionalBehaviorProfileEngine.calculateCumulativeProfi` |
| `src/core/runtime/behavioral-intelligence/BehavioralTrajectoryEngine.ts` | **projectedScores** | 83 | `const projectedScores = {` |
| `src/core/runtime/behavioral-intelligence/ExecutiveConsistencyEngine.ts` | **calculateConsistency** | 12 | `public static calculateConsistency(` |
| `src/core/runtime/behavioral-intelligence/ExecutiveConsistencyEngine.ts` | **score** | 16 | `let score = 100;` |
| `src/core/runtime/behavioral-intelligence/GovernanceFatigueEngine.ts` | **calculateFatigue** | 12 | `public static calculateFatigue(` |
| `src/core/runtime/behavioral-intelligence/InstitutionalAdaptationEngine.ts` | **calculateAdaptation** | 14 | `public static calculateAdaptation(` |
| `src/core/runtime/behavioral-intelligence/InstitutionalAdaptationEngine.ts` | **adaptationScore** | 22 | `let adaptationScore = 50;` |
| `src/core/runtime/behavioral-intelligence/InstitutionalAdaptationEngine.ts` | **calculateConsistency** | 25 | `const currentConsistency = ExecutiveConsistencyEngine.calculateConsistency(curre` |
| `src/core/runtime/behavioral-intelligence/InstitutionalAdaptationEngine.ts` | **calculateConsistency** | 30 | `historicalConsistencySum += ExecutiveConsistencyEngine.calculateConsistency(d, h` |
| `src/core/runtime/behavioral-intelligence/InstitutionalBehaviorProfileEngine.ts` | **calculateCumulativeProfile** | 102 | `public static calculateCumulativeProfile(` |
| `src/core/runtime/behavioral-intelligence/InstitutionalBehavioralIntelligenceEngine.ts` | **evaluateBehavior** | 28 | `public static evaluateBehavior(` |
| `src/core/runtime/behavioral-intelligence/InstitutionalBehavioralIntelligenceEngine.ts` | **calculateCumulativeProfile** | 35 | `const profile = InstitutionalBehaviorProfileEngine.calculateCumulativeProfile(` |
| `src/core/runtime/behavioral-intelligence/InstitutionalBehavioralIntelligenceEngine.ts` | **calculateConsistency** | 45 | `const consistencyScore = ExecutiveConsistencyEngine.calculateConsistency(decisio` |
| `src/core/runtime/behavioral-intelligence/InstitutionalBehavioralIntelligenceEngine.ts` | **calculateFatigue** | 48 | `const fatigue = GovernanceFatigueEngine.calculateFatigue(history, report);` |
| `src/core/runtime/behavioral-intelligence/InstitutionalBehavioralIntelligenceEngine.ts` | **calculateAdaptation** | 51 | `const adaptationScore = InstitutionalAdaptationEngine.calculateAdaptation(decisi` |
| `src/core/runtime/behavioral-intelligence/InstitutionalBehavioralIntelligenceEngine.ts` | **analyzePatterns** | 54 | `const patternsResult = LongitudinalPatternEngine.analyzePatterns(history, report` |
| `src/core/runtime/behavioral-intelligence/InstitutionalBehavioralIntelligenceEngine.ts` | **calculateMaturity** | 58 | `const maturityLevel = InstitutionalMaturityEvolutionEngine.calculateMaturity(` |
| `src/core/runtime/behavioral-intelligence/InstitutionalBehavioralIntelligenceEngine.ts` | **BehavioralScores** | 70 | `const scores: BehavioralScores = {` |
| `src/core/runtime/behavioral-intelligence/InstitutionalMaturityEvolutionEngine.ts` | **calculateMaturity** | 13 | `public static calculateMaturity(` |
| `src/core/runtime/behavioral-intelligence/LongitudinalPatternEngine.ts` | **analyzePatterns** | 21 | `public static analyzePatterns(` |
| `src/core/runtime/benchmark/BenchmarkAdvisoryEngine.ts` | **evaluateAdvisory** | 32 | `public evaluateAdvisory(` |
| `src/core/runtime/benchmark/BenchmarkAdvisoryEngine.ts` | **evaluateReadiness** | 40 | `const readiness = benchmarkReadinessEngine.evaluateReadiness(clientId, scenario)` |
| `src/core/runtime/benchmark/BenchmarkAdvisoryEngine.ts` | **calculateComparison** | 41 | `const comparison = benchmarkComparativeEngine.calculateComparison(clientId, mode` |
| `src/core/runtime/benchmark/BenchmarkAdvisoryEngine.ts` | **calculateAssessment** | 71 | `const esgimScore = esgimAssessmentEngine.calculateAssessment(clientId, 'DEMO_SCE` |
| `src/core/runtime/benchmark/BenchmarkAdvisoryEngine.ts` | **calculateResilience** | 72 | `const iriScore = institutionalResilienceIndexEngine.calculateResilience(clientId` |
| `src/core/runtime/benchmark/BenchmarkAdvisoryEngine.ts` | **calculatePAI** | 73 | `const paiScore = governanceKnowledgeEngine.calculatePAI(clientId, scenario).scor` |
| `src/core/runtime/benchmark/BenchmarkAdvisoryEngine.ts` | **calculateGeiWeightedScore** | 74 | `const geiScore = decisionRegistryEngine.calculateGeiWeightedScore(scenario);` |
| `src/core/runtime/benchmark/BenchmarkAdvisoryEngine.ts` | **briScore** | 75 | `const briScore = readiness.score;` |
| `src/core/runtime/benchmark/BenchmarkAdvisoryEngine.ts` | **apsScore** | 86 | `let apsScore = rawAPS;` |
| `src/core/runtime/benchmark/BenchmarkAdvisoryEngine.ts` | **apsScore** | 88 | `apsScore = Math.min(apsScore, 30);` |
| `src/core/runtime/benchmark/BenchmarkAdvisoryEngine.ts` | **apsScore** | 90 | `apsScore = Math.min(apsScore, 45);` |
| `src/core/runtime/benchmark/BenchmarkAdvisoryEngine.ts` | **apsScore** | 92 | `apsScore = Math.min(apsScore, 58);` |
| `src/core/runtime/benchmark/BenchmarkAdvisoryEngine.ts` | **apsScore** | 94 | `apsScore = Math.min(apsScore, 85);` |
| `src/core/runtime/benchmark/BenchmarkAdvisoryEngine.ts` | **advisoryConfidenceScore** | 98 | `let advisoryConfidenceScore = 90;` |
| `src/core/runtime/benchmark/BenchmarkAdvisoryEngine.ts` | **advisoryConfidenceScore** | 107 | `advisoryConfidenceScore = 65;` |
| `src/core/runtime/benchmark/BenchmarkAdvisoryEngine.ts` | **simulatedBpsImpact** | 255 | `init3.simulatedBpsImpact = 12;` |
| `src/core/runtime/benchmark/BenchmarkAdvisoryEngine.ts` | **simulatedBpsImpact** | 262 | `init2.simulatedBpsImpact = 10;` |
| `src/core/runtime/benchmark/BenchmarkAdvisoryEngine.ts` | **simulatedBps** | 270 | `const simulatedBps = Math.min(100, comparison.bpsScore + totalImpact);` |
| `src/core/runtime/benchmark/BenchmarkAdvisoryEngine.ts` | **simulatedTargetPosition** | 273 | `if (simulatedBps >= 90) simulatedTargetPosition = 'TOP_10';` |
| `src/core/runtime/benchmark/BenchmarkAdvisoryEngine.ts` | **simulatedTargetPosition** | 274 | `else if (simulatedBps >= 80) simulatedTargetPosition = 'TOP_25';` |
| `src/core/runtime/benchmark/BenchmarkAdvisoryEngine.ts` | **simulatedTargetPosition** | 275 | `else if (simulatedBps >= 65) simulatedTargetPosition = 'TOP_50';` |
| `src/core/runtime/benchmark/BenchmarkAdvisoryEngine.ts` | **simulatedTargetPosition** | 276 | `else if (simulatedBps >= 50) simulatedTargetPosition = 'BOTTOM_50';` |
| `src/core/runtime/benchmark/BenchmarkAdvisoryEngine.ts` | **simulatedTargetPosition** | 280 | `init.simulatedTargetPosition = simulatedTargetPosition;` |
| `src/core/runtime/benchmark/BenchmarkAdvisoryEngine.ts` | **roadmapRecommendations** | 295 | `const roadmapRecommendations = [` |
| `src/core/runtime/benchmark/BenchmarkComparativeEngine.ts` | **calculateComparison** | 30 | `public calculateComparison(` |
| `src/core/runtime/benchmark/BenchmarkComparativeEngine.ts` | **evaluateReadiness** | 38 | `const readiness = benchmarkReadinessEngine.evaluateReadiness(clientId, scenario)` |
| `src/core/runtime/benchmark/BenchmarkComparativeEngine.ts` | **calculateAssessment** | 74 | `const esgimScore = esgimAssessmentEngine.calculateAssessment(clientId, 'DEMO_SCE` |
| `src/core/runtime/benchmark/BenchmarkComparativeEngine.ts` | **calculateResilience** | 75 | `const iriScore = institutionalResilienceIndexEngine.calculateResilience(clientId` |
| `src/core/runtime/benchmark/BenchmarkComparativeEngine.ts` | **calculatePAI** | 76 | `const paiScore = governanceKnowledgeEngine.calculatePAI(clientId, scenario).scor` |
| `src/core/runtime/benchmark/BenchmarkComparativeEngine.ts` | **calculateGeiWeightedScore** | 77 | `const geiScore = decisionRegistryEngine.calculateGeiWeightedScore(scenario);` |
| `src/core/runtime/benchmark/BenchmarkComparativeEngine.ts` | **briScore** | 78 | `const briScore = readiness.score;` |
| `src/core/runtime/benchmark/BenchmarkComparativeEngine.ts` | **bpsScore** | 82 | `const bpsScore = Math.round(` |
| `src/core/runtime/benchmark/BenchmarkComparativeEngine.ts` | **recommendations** | 200 | `const recommendations = [` |
| `src/core/runtime/benchmark/BenchmarkReadinessEngine.ts` | **evaluateReadiness** | 27 | `public evaluateReadiness(clientId: string, scenario: ESGIMScenario): BenchmarkRe` |
| `src/core/runtime/benchmark/BenchmarkReadinessEngine.ts` | **calculateAssessment** | 53 | `const esgim = esgimAssessmentEngine.calculateAssessment(clientId, 'DEMO_SCENARIO` |
| `src/core/runtime/benchmark/BenchmarkReadinessEngine.ts` | **calculateResilience** | 54 | `const iri = institutionalResilienceIndexEngine.calculateResilience(clientId, 'DE` |
| `src/core/runtime/benchmark/BenchmarkReadinessEngine.ts` | **calculateGeiWeightedScore** | 55 | `const geiWeighted = decisionRegistryEngine.calculateGeiWeightedScore(scenario);` |
| `src/core/runtime/benchmark/BenchmarkReadinessEngine.ts` | **calculateMonitoring** | 56 | `const monitoring = governanceMonitoringEngine.calculateMonitoring(clientId, 'DEM` |
| `src/core/runtime/benchmark/BenchmarkReadinessEngine.ts` | **calculatePAI** | 67 | `const pai = governanceKnowledgeEngine.calculatePAI(clientId, scenario);` |
| `src/core/runtime/benchmark/BenchmarkReadinessEngine.ts` | **score** | 100 | `let score = rawBRI;` |
| `src/core/runtime/benchmark/BenchmarkReadinessEngine.ts` | **score** | 105 | `score = Math.min(score, 34);` |
| `src/core/runtime/benchmark/BenchmarkReadinessEngine.ts` | **score** | 109 | `score = Math.min(score, 49);` |
| `src/core/runtime/benchmark/BenchmarkReadinessEngine.ts` | **score** | 113 | `score = Math.min(score, 59);` |
| `src/core/runtime/benchmark/BenchmarkReadinessEngine.ts` | **score** | 117 | `score = Math.min(score, 89); // Capped below EXCELLENT` |
| `src/core/runtime/benchmark/BenchmarkReadinessEngine.ts` | **score** | 119 | `score = Math.min(score, 89); // Capped below EXCELLENT` |
| `src/core/runtime/benchmarking/BenchmarkAnonymizationEngine.ts` | **classifyRevenue** | 15 | `revenueBand: this.classifyRevenue(rawTenantData.revenue || 0),` |
| `src/core/runtime/benchmarking/BenchmarkAnonymizationEngine.ts` | **classifyRevenue** | 22 | `private static classifyRevenue(revenue: number): string {` |
| `src/core/runtime/benchmarking/BenchmarkCohortBuilder.ts` | **buildCohort** | 10 | `static buildCohort(` |
| `src/core/runtime/benchmarking/BenchmarkConfidenceIndex.ts` | **calculateIndex** | 8 | `static calculateIndex(cohort: BenchmarkCohort): Record<BenchmarkConfidenceSignal` |
| `src/core/runtime/benchmarking/BenchmarkExecutiveReportBuilder.ts` | **buildReport** | 7 | `static buildReport(execution: BenchmarkExecutionRecord): string {` |
| `src/core/runtime/benchmarking/InstitutionalBenchmarkEngine.ts` | **buildCohort** | 22 | `const cohort = BenchmarkCohortBuilder.buildCohort(sectorToCompare, revenueBandTo` |
| `src/core/runtime/benchmarking/InstitutionalBenchmarkEngine.ts` | **calculateIndex** | 39 | `const confidenceDist = BenchmarkConfidenceIndex.calculateIndex(cohort);` |
| `src/core/runtime/board/BoardAgendaGenerator.ts` | **generateBoardAgenda** | 18 | `export function generateBoardAgenda(` |
| `src/core/runtime/board/BoardAgendaGenerator.ts` | **executiveRecommendation** | 32 | `if (!input.isBaseline && input.executiveRecommendation === '1º Recomendado') {` |
| `src/core/runtime/board/BoardAttentionEngine.ts` | **generateAttentionItems** | 13 | `export function generateAttentionItems(input: BoardIntelligenceInput): BoardAtte` |
| `src/core/runtime/board/BoardAttentionEngine.ts` | **executiveRecommendation** | 38 | `if (input.executiveRecommendation === '1º Recomendado' && !input.isBaseline) {` |
| `src/core/runtime/board/BoardIntelligenceAdapter.ts` | **buildBoardIntelligenceInput** | 16 | `export function buildBoardIntelligenceInput(` |
| `src/core/runtime/board/BoardPrioritiesEngine.ts` | **generatePriorities** | 26 | `public generatePriorities(` |
| `src/core/runtime/board/BoardPrioritiesEngine.ts` | **calculateAssessment** | 34 | `const assessment = esgimAssessmentEngine.calculateAssessment(clientId, mode, sce` |
| `src/core/runtime/board/BoardPrioritiesEngine.ts` | **calculateResilience** | 35 | `const resilience = institutionalResilienceIndexEngine.calculateResilience(client` |
| `src/core/runtime/board/BoardResolutionLayer.ts` | **generateBoardResolutions** | 11 | `export function generateBoardResolutions(` |
| `src/core/runtime/board/BoardResolutionLayer.ts` | **executiveRecommendation** | 31 | `if (input.executiveRecommendation === '1º Recomendado' && !input.isBaseline) {` |
| `src/core/runtime/board/FiduciaryRiskEngine.ts` | **calculateLevel** | 13 | `function calculateLevel(score: number, invert: boolean = false): RiskLevel {` |
| `src/core/runtime/board/FiduciaryRiskEngine.ts` | **assessFiduciaryRisks** | 29 | `export function assessFiduciaryRisks(input: BoardIntelligenceInput): FiduciaryRi` |
| `src/core/runtime/board/FiduciaryRiskEngine.ts` | **calculateLevel** | 42 | `const instLevel = calculateLevel(input.gpiScore, true);` |
| `src/core/runtime/board/FiduciaryRiskEngine.ts` | **calculateLevel** | 49 | `const execLevel = calculateLevel(input.ieiScore, false);` |
| `src/core/runtime/board/FiduciaryRiskEngine.ts` | **calculateLevel** | 56 | `const govLevel = calculateLevel(input.irgScore, true);` |
| `src/core/runtime/board-decision/BoardResolutionEngine.ts` | **scores** | 93 | `reportContext.scores = {` |
| `src/core/runtime/board-decision/BoardResolutionEngine.ts` | **calculate** | 116 | `const survivabilityScores = InstitutionalSurvivabilityEngine.calculate(reportCon` |
| `src/core/runtime/board-decision/DecisionLineageTracker.ts` | **generateAuditTrail** | 27 | `public static generateAuditTrail(resolutions: BoardResolution[]): string[] {` |
| `src/core/runtime/board-meeting/BoardMeetingEngine.ts` | **generatedAt** | 72 | `const generatedAt = new Date().toISOString();` |
| `src/core/runtime/board-meeting/BoardMeetingEngine.ts` | **generateBoardPack** | 75 | `const boardPack = boardPackGeneratorEngine.generateBoardPack(clientId, 'DEMO_SCE` |
| `src/core/runtime/board-meeting/BoardMeetingEngine.ts` | **generateMinutes** | 230 | `const minutes = meetingMinutesEngine.generateMinutes(meeting, participants, 'APP` |
| `src/core/runtime/board-meeting/MeetingMinutesEngine.ts` | **generateMinutes** | 18 | `public generateMinutes(` |
| `src/core/runtime/board-meeting/MeetingMinutesEngine.ts` | **generatedAt** | 23 | `const generatedAt = new Date().toISOString();` |
| `src/core/runtime/board-pack/BoardPackGeneratorEngine.ts` | **generateBoardPack** | 37 | `public generateBoardPack(` |
| `src/core/runtime/board-pack/BoardPackGeneratorEngine.ts` | **generatedAt** | 46 | `const generatedAt = new Date().toISOString();` |
| `src/core/runtime/board-pack/BoardPackGeneratorEngine.ts` | **calculateAssessment** | 49 | `const esgim = esgimAssessmentEngine.calculateAssessment(clientId, mode, scenario` |
| `src/core/runtime/board-pack/BoardPackGeneratorEngine.ts` | **calculateResilience** | 50 | `const iri = institutionalResilienceIndexEngine.calculateResilience(clientId, mod` |
| `src/core/runtime/board-pack/BoardPackGeneratorEngine.ts` | **generatePriorities** | 51 | `const prioritiesData = boardPrioritiesEngine.generatePriorities(clientId, mode, ` |
| `src/core/runtime/board-pack/BoardPackGeneratorEngine.ts` | **generateRoadmap** | 52 | `const roadmap = governanceRoadmapEngine.generateRoadmap(clientId, mode, scenario` |
| `src/core/runtime/board-pack/BoardPackGeneratorEngine.ts` | **calculateMonitoring** | 53 | `const monitoring = governanceMonitoringEngine.calculateMonitoring(clientId, mode` |
| `src/core/runtime/board-pack/BoardPackGeneratorEngine.ts` | **generateReport** | 54 | `const report = executiveBoardReportEngine.generateReport(clientId, mode, scenari` |
| `src/core/runtime/board-pack/BoardPackGeneratorEngine.ts` | **decisionReadinessScore** | 61 | `let decisionReadinessScore = baseReadiness;` |
| `src/core/runtime/board-pack/BoardPackGeneratorEngine.ts` | **decisionReadinessScore** | 63 | `decisionReadinessScore = Math.min(baseReadiness, 42); // Severe breach cap` |
| `src/core/runtime/board-pack/BoardPackGeneratorEngine.ts` | **decisionReadinessScore** | 65 | `decisionReadinessScore = Math.min(baseReadiness, 28); // Liquidity shock cap` |
| `src/core/runtime/board-pack/BoardPackGeneratorEngine.ts` | **generateJourney** | 101 | `const journey = governanceJourneyEngine.generateJourney(clientId || 'GLOBAL', mo` |
| `src/core/runtime/board-pack/BoardPackGeneratorEngine.ts` | **calculateGeiSimpleScore** | 233 | `const geiSimple = decisionRegistryEngine.calculateGeiSimpleScore(scenario);` |
| `src/core/runtime/board-pack/BoardPackGeneratorEngine.ts` | **calculateGeiWeightedScore** | 234 | `const geiWeighted = decisionRegistryEngine.calculateGeiWeightedScore(scenario);` |
| `src/core/runtime/board-pack/BoardPackGeneratorEngine.ts` | **calculateGaiScore** | 235 | `const gai = decisionRegistryEngine.calculateGaiScore(scenario);` |
| `src/core/runtime/board-pack/BoardPackGeneratorEngine.ts` | **calculateOverdueRate** | 236 | `const overdueRate = decisionRegistryEngine.calculateOverdueRate(scenario);` |
| `src/core/runtime/board-pack/BoardPackGeneratorEngine.ts` | **calculateAgingBuckets** | 237 | `const aging = decisionRegistryEngine.calculateAgingBuckets(scenario);` |
| `src/core/runtime/board-pack/BoardPackGeneratorEngine.ts` | **calculatePAI** | 255 | `const { score: paiScore, level: paiLevel } = governanceKnowledgeEngine.calculate` |
| `src/core/runtime/board-pack/BoardPackGeneratorEngine.ts` | **evaluateAdvisory** | 275 | `const advisory = benchmarkAdvisoryEngine.evaluateAdvisory(clientId, mode, scenar` |
| `src/core/runtime/board-pack/BoardPackGeneratorEngine.ts` | **Score** | 279 | ``Advancement Potential Score (APS™): ${advisory.apsScore}/100 | Confiança Adviso` |
| `src/core/runtime/board-pack/BoardPackGeneratorEngine.ts` | **calculateLearning** | 304 | `const learning = governanceLearningEngine.calculateLearning(clientId, mode, scen` |
| `src/core/runtime/board-pack/BoardPackPDFGenerator.ts` | **generatePDF** | 10 | `public static generatePDF(pack: BoardPack): jsPDF {` |
| `src/core/runtime/board-pack/BoardPackPPTXGenerator.ts` | **generatePPTX** | 11 | `public static async generatePPTX(pack: BoardPack, saveToFile: boolean = false): ` |
| `src/core/runtime/capital-governance/CapitalRetentionEngine.ts` | **calculateCapitalRetention** | 12 | `export function calculateCapitalRetention(` |
| `src/core/runtime/capital-governance/EquityPreservationEngine.ts` | **calculateEquityPreservation** | 18 | `export function calculateEquityPreservation(` |
| `src/core/runtime/capital-governance/GovernanceCapitalBehaviorEngine.ts` | **calculateGovernanceCapitalBehavior** | 32 | `export function calculateGovernanceCapitalBehavior(` |
| `src/core/runtime/capital-governance/InstitutionalCapitalizationEngine.ts` | **calculateInstitutionalCapitalization** | 4 | `export function calculateInstitutionalCapitalization(` |
| `src/core/runtime/capital-governance/ShareholderDistributionEngine.ts` | **calculateShareholderDistribution** | 16 | `export function calculateShareholderDistribution(` |
| `src/core/runtime/capital-governance/capital-governance-adapter.ts` | **evaluate** | 397 | `const fidOutput = DLPAFiduciaryInterpretationEngine.evaluate({` |
| `src/core/runtime/capital-governance/capital-governance-adapter.ts` | **buildGovernanceScore** | 423 | `const { score: cgs, status: cgsStatus } = buildGovernanceScore({` |
| `src/core/runtime/capital-governance/capital-governance-adapter.ts` | **evaluate** | 470 | `const preservedCapital = DLPAMetricsEngine.evaluate(endingEquity, capitalSocial)` |
| `src/core/runtime/capital-governance/capital-governance-adapter.ts` | **evaluate** | 471 | `const consumedCapital = DLPACapitalConsumptionEngine.evaluate(lucrosPrejuizos, c` |
| `src/core/runtime/capital-governance/capital-governance-adapter.ts` | **evaluate** | 472 | `const capitalRecovery = CapitalRecoveryEngine.evaluate(endingEquity, capitalSoci` |
| `src/core/runtime/capital-governance/capital-governance-adapter.ts` | **evaluate** | 473 | `const capitalErosionRisk = CapitalErosionRiskEngine.evaluate(lucrosPrejuizos, ca` |
| `src/core/runtime/capital-governance/capital-governance-adapter.ts` | **evaluate** | 474 | `const capitalDependency = DLPAShareholderCapitalDependencyEngine.evaluate(capita` |
| `src/core/runtime/capital-governance/capital-governance-adapter.ts` | **evaluate** | 478 | `const formationQuality = DLPAEquityFormationQualityEngine.evaluate(capitalDepend` |
| `src/core/runtime/capital-governance/capital-governance-adapter.ts` | **evaluate** | 479 | `const distributionCapacity = DLPADistributionCapacityEngine.evaluate(netIncome, ` |
| `src/core/runtime/capital-governance/capital-governance-adapter.ts` | **evaluate** | 480 | `const retention = DLPARetentionEngine.evaluate(netIncome, retainedEarnings, lucr` |
| `src/core/runtime/capital-governance/capital-governance-adapter.ts` | **evaluate** | 482 | `const governanceInterpretation = DLPAGovernanceInterpretationEngine.evaluate(` |
| `src/core/runtime/capital-governance/capital-governance-adapter.ts` | **evaluate** | 489 | `const capitalPreservationStatus = CapitalPreservationStatusEngine.evaluate(endin` |
| `src/core/runtime/capital-governance/capital-governance-adapter.ts` | **evaluate** | 490 | `const shareholderDependencyNarrative = ShareholderDependencyNarrativeEngine.eval` |
| `src/core/runtime/capital-governance/capital-governance-adapter.ts` | **evaluate** | 491 | `const capitalRecoveryRequirement = CapitalRecoveryRequirementEngine.evaluate(luc` |
| `src/core/runtime/capital-governance/capital-governance-adapter.ts` | **evaluate** | 509 | `const patrimonialRecoveryHorizon = PatrimonialRecoveryHorizonEngine.evaluate({` |
| `src/core/runtime/capital-governance/capital-governance-adapter.ts` | **evaluate** | 517 | `const capitalRecoverability = CapitalRecoverabilityEngine.evaluate(endingEquity,` |
| `src/core/runtime/capital-governance/capital-governance-adapter.ts` | **evaluate** | 518 | `const capitalPreservationScore = CapitalPreservationScoreEngine.evaluate(` |
| `src/core/runtime/capital-governance/capital-governance-adapter.ts` | **evaluate** | 528 | `const boardDecisionSupport = DLPABoardDecisionSupportEngine.evaluate(` |
| `src/core/runtime/capital-governance/capital-governance-adapter.ts` | **evaluate** | 540 | `const boardAdvisory = DLPABoardAdvisoryEngine.evaluate(` |
| `src/core/runtime/capital-governance/capital-governance-adapter.ts` | **buildExecutiveFinancialStory** | 643 | `const executiveStory = buildExecutiveFinancialStory(executiveStoryInput);` |
| `src/core/runtime/capital-governance/capital-governance-adapter.ts` | **buildBoardNarrative** | 660 | `const boardNarrative = buildBoardNarrative(boardNarrativeInput);` |
| `src/core/runtime/capital-governance/capital-governance-adapter.ts` | **buildAdvisoryNarrative** | 668 | `const advisoryNarrative = buildAdvisoryNarrative(advisoryNarrativeInput);` |
| `src/core/runtime/capital-governance/capital-governance-adapter.ts` | **buildPartnerNarrative** | 676 | `const partnerNarrative = buildPartnerNarrative(partnerNarrativeInput);` |
| `src/core/runtime/capital-governance/capital-governance-adapter.ts` | **buildManagementNarrative** | 684 | `const managementNarrative = buildManagementNarrative(managementNarrativeInput);` |
| `src/core/runtime/capital-governance/capital-governance-adapter.ts` | **buildGovernanceCommunicationFramework** | 692 | `const governanceCommunicationFramework = buildGovernanceCommunicationFramework(g` |
| `src/core/runtime/capital-governance/capital-governance-adapter.ts` | **buildBoardPack** | 700 | `const boardPack = buildBoardPack(boardPackInput);` |
| `src/core/runtime/capital-governance/capital-governance-adapter.ts` | **buildBoardDeck** | 708 | `const boardDeck = buildBoardDeck(boardDeckInput);` |
| `src/core/runtime/capital-governance/capital-governance-adapter.ts` | **buildInstitutionalReportPackage** | 716 | `const institutionalReportPackage = buildInstitutionalReportPackage(institutional` |
| `src/core/runtime/capital-governance/capital-governance-adapter.ts` | **buildGovernanceMemory** | 724 | `const governanceMemory = buildGovernanceMemory(governanceMemoryInput);` |
| `src/core/runtime/capital-governance/capital-governance-adapter.ts` | **buildGovernanceIntelligenceNetwork** | 732 | `const governanceIntelligence = buildGovernanceIntelligenceNetwork(governanceInte` |
| `src/core/runtime/capital-governance/capital-governance-adapter.ts` | **buildGovernanceDigitalTwin** | 740 | `const governanceDigitalTwin = buildGovernanceDigitalTwin(governanceDigitalTwinIn` |
| `src/core/runtime/capital-governance/capital-governance-adapter.ts` | **buildESGIntelligence** | 748 | `const esgIntelligence = buildESGIntelligence(esgInput);` |
| `src/core/runtime/capital-governance/capital-governance-adapter.ts` | **buildValuationIntelligence** | 756 | `const valuationIntelligence = buildValuationIntelligence(valuationInput);` |
| `src/core/runtime/capital-governance/capital-governance-adapter.ts` | **buildBenchmarkIntelligence** | 764 | `const benchmarkIntelligence = buildBenchmarkIntelligence(benchmarkInput);` |
| `src/core/runtime/capital-governance/capital-governance-adapter.ts` | **buildSectorIntelligence** | 773 | `const sectorIntelligence = buildSectorIntelligence(sectorIntelligenceInput);` |
| `src/core/runtime/capital-governance/capital-governance-adapter.ts` | **buildCapitalAllocationIntelligence** | 781 | `const capitalAllocationIntelligence = buildCapitalAllocationIntelligence(capital` |
| `src/core/runtime/capital-governance/capital-governance-adapter.ts` | **buildExecutiveSovereigntyProfile** | 790 | `const executiveSovereignty = buildExecutiveSovereigntyProfile(executiveSovereign` |
| `src/core/runtime/cash-causal-intelligence/CashFlowCausalIntelligenceEngine.ts` | **evaluate** | 6 | `public static evaluate(` |
| `src/core/runtime/cash-causal-intelligence/CashFlowCausalIntelligenceEngine.ts` | **classify** | 57 | `const severity = CashFlowCausalSeverityEngine.classify(impactPercent);` |
| `src/core/runtime/cash-causal-intelligence/CashFlowCausalSeverityEngine.ts` | **classify** | 2 | `public static classify(impactPercent: number): 'LOW' | 'MODERATE' | 'HIGH' | 'CR` |
| `src/core/runtime/cash-intelligence/ArtificialLiquidityDetector.ts` | **evaluate** | 7 | `public static evaluate(` |
| `src/core/runtime/cash-intelligence/CashBoardDecisionSupportEngine.ts` | **evaluate** | 5 | `public static evaluate(` |
| `src/core/runtime/cash-intelligence/CashBoardDecisionSupportEngine.ts` | **cashGenerationAssessment** | 17 | `const cashGenerationAssessment = isBurning` |
| `src/core/runtime/cash-intelligence/CashBoardDecisionSupportEngine.ts` | **runwayAssessment** | 25 | `const runwayAssessment = (() => {` |
| `src/core/runtime/cash-intelligence/CashBoardDecisionSupportEngine.ts` | **classify** | 27 | `const classification = RunwayClassificationEngine.classify(safeRunway);` |
| `src/core/runtime/cash-intelligence/CashBoardDecisionSupportEngine.ts` | **revenueConversionAssessment** | 59 | `const revenueConversionAssessment = isBurning` |
| `src/core/runtime/cash-intelligence/CashBoardDecisionSupportEngine.ts` | **boardPriorityAssessment** | 63 | `const boardPriorityAssessment = 'Reduzir a queima operacional de caixa e restaur` |
| `src/core/runtime/cash-intelligence/CashConstraintDiagnosisEngine.ts` | **evaluate** | 4 | `public static evaluate(` |
| `src/core/runtime/cash-intelligence/CashConversionStressEngine.ts` | **evaluate** | 4 | `public static evaluate(fco: number, ebitda: number): InstitutionalCashSignal {` |
| `src/core/runtime/cash-intelligence/CashExecutiveAdvisoryEngine.ts` | **generatePayload** | 72 | `public static generatePayload(` |
| `src/core/runtime/cash-intelligence/CashReinvestmentEngine.ts` | **evaluate** | 4 | `public static evaluate(` |
| `src/core/runtime/cash-intelligence/CashSustainabilityEngine.ts` | **evaluate** | 4 | `public static evaluate(` |
| `src/core/runtime/cash-intelligence/DFCCashAdvisoryEngine.ts` | **evaluate** | 4 | `public static evaluate(` |
| `src/core/runtime/cash-intelligence/DFCExecutiveSnapshotEngine.ts` | **buildSnapshot** | 15 | `public static buildSnapshot(` |
| `src/core/runtime/cash-intelligence/DFCExecutiveSnapshotEngine.ts` | **classify** | 24 | `const runwayClass = RunwayClassificationEngine.classify(safeRunway);` |
| `src/core/runtime/cash-intelligence/DFCFiduciaryPriorityResolver.ts` | **classify** | 17 | `const runwayClass = RunwayClassificationEngine.classify(context.runwayMonths);` |
| `src/core/runtime/cash-intelligence/DebtDependencyPressureEngine.ts` | **evaluate** | 4 | `public static evaluate(fco: number, thirdPartyFunding: number): InstitutionalCas` |
| `src/core/runtime/cash-intelligence/EarningsCashConversionEngine.ts` | **evaluate** | 8 | `public static evaluate(` |
| `src/core/runtime/cash-intelligence/FiduciaryCashIntelligenceRuntime.spec.ts` | **evaluate** | 9 | `const result = FiduciaryCashIntelligenceRuntime.evaluate(` |
| `src/core/runtime/cash-intelligence/FiduciaryCashIntelligenceRuntime.spec.ts` | **evaluate** | 42 | `const result = FiduciaryCashIntelligenceRuntime.evaluate(` |
| `src/core/runtime/cash-intelligence/FiduciaryCashIntelligenceRuntime.spec.ts` | **evaluate** | 72 | `const result = FiduciaryCashIntelligenceRuntime.evaluate(` |
| `src/core/runtime/cash-intelligence/FiduciaryCashIntelligenceRuntime.spec.ts` | **evaluate** | 102 | `const result = FiduciaryCashIntelligenceRuntime.evaluate(` |
| `src/core/runtime/cash-intelligence/FiduciaryCashIntelligenceRuntime.spec.ts` | **evaluate** | 141 | `const result = FiduciaryCashIntelligenceRuntime.evaluate(` |
| `src/core/runtime/cash-intelligence/FiduciaryCashIntelligenceRuntime.ts` | **evaluate** | 42 | `public static evaluate(` |
| `src/core/runtime/cash-intelligence/FiduciaryCashIntelligenceRuntime.ts` | **generateLineageHash** | 95 | `const lineageHash = this.generateLineageHash(hashInputs);` |
| `src/core/runtime/cash-intelligence/FiduciaryCashIntelligenceRuntime.ts` | **evaluate** | 174 | `const universalIndicators = UniversalCashIndicatorsEngine.evaluate(` |
| `src/core/runtime/cash-intelligence/FiduciaryCashIntelligenceRuntime.ts` | **evaluate** | 181 | `const artificial = ArtificialLiquidityDetector.evaluate(` |
| `src/core/runtime/cash-intelligence/FiduciaryCashIntelligenceRuntime.ts` | **evaluate** | 187 | `const sustainabilityOutputs = OperationalSustainabilityRuntime.evaluate(` |
| `src/core/runtime/cash-intelligence/FiduciaryCashIntelligenceRuntime.ts` | **evaluate** | 195 | `const continuity = InstitutionalContinuityEngine.evaluate(` |
| `src/core/runtime/cash-intelligence/FiduciaryCashIntelligenceRuntime.ts` | **evaluate** | 207 | `const classification = LiquidityClassificationEngine.evaluate(` |
| `src/core/runtime/cash-intelligence/FiduciaryCashIntelligenceRuntime.ts` | **evaluate** | 257 | `const cashConstraintDiagnosis = CashConstraintDiagnosisEngine.evaluate(fcoOperac` |
| `src/core/runtime/cash-intelligence/FiduciaryCashIntelligenceRuntime.ts` | **evaluate** | 258 | `const cashBurnAnalysis = OperationalCashBurnEngine.evaluate(fcoOperacionalReal, ` |
| `src/core/runtime/cash-intelligence/FiduciaryCashIntelligenceRuntime.ts` | **evaluate** | 259 | `const shareholderDependencyAnalysis = ShareholderDependencyEngine.evaluate(fcoOp` |
| `src/core/runtime/cash-intelligence/FiduciaryCashIntelligenceRuntime.ts` | **evaluate** | 263 | `const cashSustainabilityAnalysis = CashSustainabilityEngine.evaluate(fcoOperacio` |
| `src/core/runtime/cash-intelligence/FiduciaryCashIntelligenceRuntime.ts` | **evaluate** | 265 | `const cashConversionAnalysis = RevenueCashConversionEngine.evaluate(fcoOperacion` |
| `src/core/runtime/cash-intelligence/FiduciaryCashIntelligenceRuntime.ts` | **evaluate** | 267 | `const cashBoardDecisionFramework = CashBoardDecisionSupportEngine.evaluate(fcoOp` |
| `src/core/runtime/cash-intelligence/FiduciaryCashIntelligenceRuntime.ts` | **evaluate** | 268 | `const cashExecutiveAdvisory = DFCCashAdvisoryEngine.evaluate(fcoOperacionalReal,` |
| `src/core/runtime/cash-intelligence/FiduciaryCashIntelligenceRuntime.ts` | **evaluate** | 269 | `const cashReinvestmentAnalysis = CashReinvestmentEngine.evaluate(fcoOperacionalR` |
| `src/core/runtime/cash-intelligence/FiduciaryCashIntelligenceRuntime.ts` | **classify** | 274 | `const runwayClass = RunwayClassificationEngine.classify(continuity.projectedRunw` |
| `src/core/runtime/cash-intelligence/FiduciaryCashIntelligenceRuntime.ts` | **buildSnapshot** | 278 | `const dfcExecutiveSnapshot = DFCExecutiveSnapshotEngine.buildSnapshot(` |
| `src/core/runtime/cash-intelligence/FiduciaryCashIntelligenceRuntime.ts` | **generatePayload** | 293 | `const advisoryPayload = CashExecutiveAdvisoryEngine.generatePayload(` |
| `src/core/runtime/cash-intelligence/FiduciaryCashIntelligenceRuntime.ts` | **evaluate** | 318 | `const causalIntelligence = CashFlowCausalIntelligenceEngine.evaluate(` |
| `src/core/runtime/cash-intelligence/FiduciaryCashIntelligenceRuntime.ts` | **evaluate** | 327 | `const scenarioIntelligence = CashFlowScenarioEngine.evaluate(` |
| `src/core/runtime/cash-intelligence/FiduciaryCashIntelligenceRuntime.ts` | **evaluate** | 339 | `const earlyWarningSystem = TreasuryEarlyWarningEngine.evaluate(` |
| `src/core/runtime/cash-intelligence/FiduciaryCashIntelligenceRuntime.ts` | **evaluate** | 348 | `const treasurySustainability = TreasurySustainabilityEngine.evaluate(` |
| `src/core/runtime/cash-intelligence/FiduciaryCashIntelligenceRuntime.ts` | **generateLineageHash** | 401 | `private static generateLineageHash(inputs: any[]): string {` |
| `src/core/runtime/cash-intelligence/InstitutionalCashSustainabilityEngine.ts` | **evaluate** | 15 | `public static evaluate(` |
| `src/core/runtime/cash-intelligence/InstitutionalCashSustainabilityEngine.ts` | **evaluate** | 52 | `const operatingCashIntegrity = OperatingCashIntegrityEngine.evaluate(fco, dreEbi` |
| `src/core/runtime/cash-intelligence/InstitutionalCashSustainabilityEngine.ts` | **evaluate** | 53 | `const earningsCashConversion = EarningsCashConversionEngine.evaluate(dreNetIncom` |
| `src/core/runtime/cash-intelligence/InstitutionalCashSustainabilityEngine.ts` | **evaluate** | 54 | `const syntheticProfitRisk = SyntheticProfitDetectionEngine.evaluate(dreNetIncome` |
| `src/core/runtime/cash-intelligence/InstitutionalCashSustainabilityEngine.ts` | **evaluate** | 55 | `const cashConversionStress = CashConversionStressEngine.evaluate(fco, dreEbitda)` |
| `src/core/runtime/cash-intelligence/InstitutionalCashSustainabilityEngine.ts` | **evaluate** | 56 | `const liquidityConsumptionVelocity = LiquidityConsumptionVelocityEngine.evaluate` |
| `src/core/runtime/cash-intelligence/InstitutionalCashSustainabilityEngine.ts` | **evaluate** | 57 | `const workingCapitalPressure = WorkingCapitalDrainDetector.evaluate(workingCapit` |
| `src/core/runtime/cash-intelligence/InstitutionalCashSustainabilityEngine.ts` | **evaluate** | 58 | `const debtDependencyPressure = DebtDependencyPressureEngine.evaluate(fco, thirdP` |
| `src/core/runtime/cash-intelligence/InstitutionalContinuityEngine.ts` | **evaluate** | 7 | `public static evaluate(` |
| `src/core/runtime/cash-intelligence/LiquidityClassificationEngine.ts` | **evaluate** | 7 | `public static evaluate(` |
| `src/core/runtime/cash-intelligence/LiquidityConsumptionVelocityEngine.ts` | **evaluate** | 4 | `public static evaluate(fco: number, availableCash: number): InstitutionalCashSig` |
| `src/core/runtime/cash-intelligence/LongitudinalCashIntelligenceEngine.spec.ts` | **evaluate** | 47 | `const result = LongitudinalCashIntelligenceEngine.evaluate([p1, p2, p3]);` |
| `src/core/runtime/cash-intelligence/LongitudinalCashIntelligenceEngine.spec.ts` | **evaluate** | 59 | `const result = LongitudinalCashIntelligenceEngine.evaluate([p1, p2, p3]);` |
| `src/core/runtime/cash-intelligence/LongitudinalCashIntelligenceEngine.spec.ts` | **evaluate** | 71 | `const result = LongitudinalCashIntelligenceEngine.evaluate([p1, p2, p3]);` |
| `src/core/runtime/cash-intelligence/LongitudinalCashIntelligenceEngine.spec.ts` | **evaluate** | 80 | `const result = LongitudinalCashIntelligenceEngine.evaluate([p1, p2]);` |
| `src/core/runtime/cash-intelligence/LongitudinalCashIntelligenceEngine.spec.ts` | **evaluate** | 90 | `const result = LongitudinalCashIntelligenceEngine.evaluate([p1, p2, p3]);` |
| `src/core/runtime/cash-intelligence/LongitudinalCashIntelligenceEngine.test.ts` | **evaluate** | 42 | `const result = LongitudinalCashIntelligenceEngine.evaluate(cycles);` |
| `src/core/runtime/cash-intelligence/LongitudinalCashIntelligenceEngine.test.ts` | **evaluate** | 50 | `const result = LongitudinalCashIntelligenceEngine.evaluate(cycles);` |
| `src/core/runtime/cash-intelligence/LongitudinalCashIntelligenceEngine.test.ts` | **evaluate** | 61 | `const result = LongitudinalCashIntelligenceEngine.evaluate(cycles);` |
| `src/core/runtime/cash-intelligence/LongitudinalCashIntelligenceEngine.test.ts` | **evaluate** | 76 | `const result = LongitudinalCashIntelligenceEngine.evaluate(cycles);` |
| `src/core/runtime/cash-intelligence/LongitudinalCashIntelligenceEngine.test.ts` | **evaluate** | 88 | `const result = LongitudinalCashIntelligenceEngine.evaluate(cycles);` |
| `src/core/runtime/cash-intelligence/LongitudinalCashIntelligenceEngine.test.ts` | **evaluate** | 100 | `const result = LongitudinalCashIntelligenceEngine.evaluate(cycles);` |
| `src/core/runtime/cash-intelligence/LongitudinalCashIntelligenceEngine.test.ts` | **evaluate** | 110 | `const result = LongitudinalCashIntelligenceEngine.evaluate(cycles);` |
| `src/core/runtime/cash-intelligence/LongitudinalCashIntelligenceEngine.ts` | **evaluate** | 5 | `public static evaluate(cycles: CashIntelligenceRuntimeOutput[]): {` |
| `src/core/runtime/cash-intelligence/LongitudinalCashIntelligenceEngine.ts` | **longitudinalScore** | 100 | `longitudinalScore = 38; // Max 40` |
| `src/core/runtime/cash-intelligence/LongitudinalCashIntelligenceEngine.ts` | **longitudinalScore** | 103 | `longitudinalScore = 34; // Max 35` |
| `src/core/runtime/cash-intelligence/LongitudinalCashIntelligenceEngine.ts` | **longitudinalScore** | 110 | `longitudinalScore = 80;` |
| `src/core/runtime/cash-intelligence/LongitudinalCashIntelligenceEngine.ts` | **longitudinalScore** | 117 | `longitudinalScore = 25; // Max 30` |
| `src/core/runtime/cash-intelligence/LongitudinalCashIntelligenceEngine.ts` | **longitudinalScore** | 120 | `longitudinalScore = 90;` |
| `src/core/runtime/cash-intelligence/OperatingCashIntegrityEngine.ts` | **evaluate** | 4 | `public static evaluate(fco: number, ebitda: number): InstitutionalCashSignal {` |
| `src/core/runtime/cash-intelligence/OperationalCashBurnEngine.ts` | **evaluate** | 4 | `public static evaluate(` |
| `src/core/runtime/cash-intelligence/OperationalSustainabilityRuntime.ts` | **evaluate** | 11 | `public static evaluate(` |
| `src/core/runtime/cash-intelligence/OperationalSustainabilityRuntime.ts` | **resilienceScore** | 78 | `const resilienceScore = 100 - operationalFragilityIndex;` |
| `src/core/runtime/cash-intelligence/OperationalSustainabilityRuntime.ts` | **LegacyOperationalSustainabilityAssessment** | 93 | `const legacy: LegacyOperationalSustainabilityAssessment = {` |
| `src/core/runtime/cash-intelligence/OperationalSustainabilityRuntime.ts` | **FiduciaryOperationalSustainabilityAssessment** | 118 | `const fiduciary: FiduciaryOperationalSustainabilityAssessment = {` |
| `src/core/runtime/cash-intelligence/RevenueCashConversionEngine.ts` | **evaluate** | 4 | `public static evaluate(` |
| `src/core/runtime/cash-intelligence/RunwayClassificationEngine.ts` | **classify** | 7 | `public static classify(runwayMonths: number): FiduciaryRunwayClassification {` |
| `src/core/runtime/cash-intelligence/ShareholderDependencyEngine.ts` | **evaluate** | 4 | `public static evaluate(` |
| `src/core/runtime/cash-intelligence/SyntheticProfitDetectionEngine.ts` | **evaluate** | 4 | `public static evaluate(` |
| `src/core/runtime/cash-intelligence/UniversalCashIndicatorsEngine.spec.ts` | **evaluate** | 8 | `const indicators = UniversalCashIndicatorsEngine.evaluate(` |
| `src/core/runtime/cash-intelligence/UniversalCashIndicatorsEngine.spec.ts` | **evaluate** | 28 | `const indicators = UniversalCashIndicatorsEngine.evaluate(` |
| `src/core/runtime/cash-intelligence/UniversalCashIndicatorsEngine.spec.ts` | **evaluate** | 49 | `const indicators = UniversalCashIndicatorsEngine.evaluate(` |
| `src/core/runtime/cash-intelligence/UniversalCashIndicatorsEngine.ts` | **evaluate** | 11 | `public static evaluate(` |
| `src/core/runtime/cash-intelligence/WorkingCapitalDrainDetector.ts` | **evaluate** | 4 | `public static evaluate(workingCapitalVariation: number, fco: number): Institutio` |
| `src/core/runtime/cash-scenario-intelligence/CashFlowScenarioEngine.ts` | **evaluate** | 4 | `public static evaluate(` |
| `src/core/runtime/cash-scenario-intelligence/CashFlowScenarioEngine.ts` | **buildScenarioGroup** | 16 | `const buildScenarioGroup = (` |
| `src/core/runtime/cash-scenario-intelligence/CashFlowScenarioEngine.ts` | **fcoSimulated** | 44 | `const fcoSimulated = currentFCO + cashRelease;` |
| `src/core/runtime/cash-scenario-intelligence/CashFlowScenarioEngine.ts` | **cashSimulated** | 45 | `const cashSimulated = Math.max(0, availableCash + cashRelease);` |
| `src/core/runtime/cash-scenario-intelligence/CashFlowScenarioEngine.ts` | **runwaySimulated** | 47 | `let runwaySimulated = 99;` |
| `src/core/runtime/cash-scenario-intelligence/CashFlowScenarioEngine.ts` | **runwaySimulated** | 50 | `runwaySimulated = Math.round((cashSimulated / monthlyBurn) * 10) / 10;` |
| `src/core/runtime/cash-scenario-intelligence/CashFlowScenarioEngine.ts` | **dependencySimulated** | 56 | `let dependencySimulated = 'AUTONOMA';` |
| `src/core/runtime/cash-scenario-intelligence/CashFlowScenarioEngine.ts` | **dependencySimulated** | 59 | `if (ratio < 0.1) dependencySimulated = 'BAIXA_DEPENDENCIA';` |
| `src/core/runtime/cash-scenario-intelligence/CashFlowScenarioEngine.ts` | **dependencySimulated** | 60 | `else if (ratio < 0.25) dependencySimulated = 'MODERADA_DEPENDENCIA';` |
| `src/core/runtime/cash-scenario-intelligence/CashFlowScenarioEngine.ts` | **dependencySimulated** | 61 | `else if (ratio <= 0.5) dependencySimulated = 'ALTA_DEPENDENCIA';` |
| `src/core/runtime/cash-scenario-intelligence/CashFlowScenarioEngine.ts` | **dependencySimulated** | 62 | `else dependencySimulated = 'DEPENDENCIA_CRITICA';` |
| `src/core/runtime/cash-scenario-intelligence/CashFlowScenarioEngine.ts` | **buildScenarioGroup** | 84 | `buildScenarioGroup('Redução de Estoques', [0.1, 0.2, 0.3], 'STOCK'),` |
| `src/core/runtime/cash-scenario-intelligence/CashFlowScenarioEngine.ts` | **buildScenarioGroup** | 85 | `buildScenarioGroup('Redução de Overhead', [0.1, 0.2, 0.3], 'OVERHEAD'),` |
| `src/core/runtime/cash-scenario-intelligence/CashFlowScenarioEngine.ts` | **buildScenarioGroup** | 86 | `buildScenarioGroup('Melhoria de Recebimento (PMR)', [10, 20, 30], 'PMR')` |
| `src/core/runtime/cash-scenario-intelligence/ScenarioSimulationConsistencyEngine.ts` | **evaluate** | 13 | `public static evaluate(` |
| `src/core/runtime/cashflow/CashConversionEngine.ts` | **calculateCashConversion** | 4 | `export function calculateCashConversion(` |
| `src/core/runtime/cashflow/CashFlowOperationalEngine.ts` | **calculateOperationalMetrics** | 4 | `export function calculateOperationalMetrics(dfcData: any): CashFlowOperationalMe` |
| `src/core/runtime/cashflow/FundingDependencyEngine.ts` | **calculateFundingDependency** | 4 | `export function calculateFundingDependency(` |
| `src/core/runtime/cashflow/LiquiditySustainabilityEngine.ts` | **calculateLiquiditySustainability** | 4 | `export function calculateLiquiditySustainability(` |
| `src/core/runtime/cashflow/LiquiditySustainabilityEngine.ts` | **sustainabilityScore** | 12 | `let sustainabilityScore = 0;` |
| `src/core/runtime/cashflow/LiquiditySustainabilityEngine.ts` | **sustainabilityScore** | 16 | `sustainabilityScore = 0;` |
| `src/core/runtime/cashflow/LiquiditySustainabilityEngine.ts` | **sustainabilityScore** | 19 | `sustainabilityScore = 100;` |
| `src/core/runtime/cashflow/LiquiditySustainabilityEngine.ts` | **sustainabilityScore** | 25 | `sustainabilityScore = Math.round(capexCoverage * 100);` |
| `src/core/runtime/cashflow/TreasuryPressureEngine.ts` | **calculateTreasuryPressure** | 4 | `export function calculateTreasuryPressure(` |
| `src/core/runtime/cashflow/cashflow-adapter.ts` | **calculateOperationalMetrics** | 36 | `const operational = calculateOperationalMetrics(dfcData);` |
| `src/core/runtime/cashflow/cashflow-adapter.ts` | **calculateCashConversion** | 53 | `const conversion = calculateCashConversion(ebitda, workingCapitalVariation, cape` |
| `src/core/runtime/cashflow/cashflow-adapter.ts` | **calculateTreasuryPressure** | 54 | `const treasury = calculateTreasuryPressure(debtService, availableCash, operation` |
| `src/core/runtime/cashflow/cashflow-adapter.ts` | **calculateLiquiditySustainability** | 55 | `const sustainability = calculateLiquiditySustainability(operational.operatingCas` |
| `src/core/runtime/cashflow/cashflow-adapter.ts` | **calculateFundingDependency** | 56 | `const funding = calculateFundingDependency(operational.operatingCashFlow, operat` |
| `src/core/runtime/causal-intelligence/InstitutionalCausalIntelligenceRuntime.ts` | **evaluate** | 14 | `public static evaluate(` |
| `src/core/runtime/causal-intelligence/InstitutionalCausalIntelligenceRuntime.ts` | **evaluate** | 99 | `const pressurePropagation = InstitutionalPressurePropagationEngine.evaluate(` |
| `src/core/runtime/causal-intelligence/InstitutionalCausalIntelligenceRuntime.ts` | **evaluate** | 110 | `const rootCauses = LiquidityRootCauseEngine.evaluate(` |
| `src/core/runtime/causal-intelligence/InstitutionalCausalIntelligenceRuntime.ts` | **build** | 127 | `const dependencyGraph = SurvivabilityDependencyGraph.build(rootCauses, fco, isDf` |
| `src/core/runtime/causal-intelligence/InstitutionalCausalIntelligenceRuntime.ts` | **evaluate** | 130 | `const stressCascadePath = OperationalStressCascadeEngine.evaluate(rootCauses, fc` |
| `src/core/runtime/causal-intelligence/InstitutionalCausalIntelligenceRuntime.ts` | **evaluate** | 133 | `const fragilityCorrelations = InstitutionalFragilityCorrelationEngine.evaluate(` |
| `src/core/runtime/causal-intelligence/InstitutionalCausalityExplorer.ts` | **generate** | 18 | `public static generate(` |
| `src/core/runtime/causal-intelligence/InstitutionalCausalityExplorer.ts` | **determine** | 23 | `const confidenceLevel = CausalityConfidenceEngine.determine(cycles, timelineConf` |
| `src/core/runtime/causal-intelligence/InstitutionalFragilityCorrelationEngine.ts` | **evaluate** | 7 | `public static evaluate(` |
| `src/core/runtime/causal-intelligence/InstitutionalPressurePropagationEngine.ts` | **evaluate** | 6 | `public static evaluate(` |
| `src/core/runtime/causal-intelligence/LiquidityRootCauseEngine.ts` | **evaluate** | 10 | `public static evaluate(` |
| `src/core/runtime/causal-intelligence/LiquidityRootCauseEngine.ts` | **evaluate** | 28 | `const structTrends = StructuralDeteriorationMapper.evaluate(allHistData, filterY` |
| `src/core/runtime/causal-intelligence/LiquidityRootCauseEngine.ts` | **evaluate** | 31 | `const wcTrends = WorkingCapitalCausalEngine.evaluate(` |
| `src/core/runtime/causal-intelligence/OperationalStressCascadeEngine.ts` | **evaluate** | 6 | `public static evaluate(` |
| `src/core/runtime/causal-intelligence/StructuralDeteriorationMapper.ts` | **evaluate** | 37 | `public static evaluate(` |
| `src/core/runtime/causal-intelligence/SurvivabilityDependencyGraph.ts` | **build** | 6 | `public static build(` |
| `src/core/runtime/causal-intelligence/WorkingCapitalCausalEngine.ts` | **evaluate** | 7 | `public static evaluate(` |
| `src/core/runtime/causal-intelligence/engines/CausalityConfidenceEngine.ts` | **determine** | 7 | `public static determine(` |
| `src/core/runtime/causal-intelligence/engines/RootCausePrioritizationEngine.ts` | **scoredChains** | 12 | `const scoredChains = chains.map(chain => {` |
| `src/core/runtime/causal-intelligence/engines/RootCausePrioritizationEngine.ts` | **score** | 13 | `let score = 0;` |
| `src/core/runtime/coherence/LongitudinalIntelligenceGuard.ts` | **evaluate** | 15 | `public static evaluate(historicalCyclesCount: number): LongitudinalGuardResult {` |
| `src/core/runtime/compliance/ESGGovernanceEngine.ts` | **calculateInstitutionalESGScore** | 18 | `public calculateInstitutionalESGScore(` |
| `src/core/runtime/compliance/ESGGovernanceEngine.ts` | **envScore** | 25 | `let envScore = 0, envCount = 0;` |
| `src/core/runtime/compliance/ESGGovernanceEngine.ts` | **socScore** | 26 | `let socScore = 0, socCount = 0;` |
| `src/core/runtime/compliance/ESGGovernanceEngine.ts` | **govScore** | 27 | `let govScore = 0, govCount = 0;` |
| `src/core/runtime/compliance/ESGGovernanceEngine.ts` | **indScore** | 31 | `let indScore = 0;` |
| `src/core/runtime/compliance/ESGGovernanceEngine.ts` | **indScore** | 33 | `indScore = ind.metrics.reduce((acc, m) => acc + (m.targetValue ? (m.value / m.ta` |
| `src/core/runtime/compliance/ESGGovernanceEngine.ts` | **envScore** | 41 | `envScore = envCount > 0 ? Math.min(100, envScore / envCount) : 100; // 100 é bas` |
| `src/core/runtime/compliance/ESGGovernanceEngine.ts` | **socScore** | 42 | `socScore = socCount > 0 ? Math.min(100, socScore / socCount) : 100;` |
| `src/core/runtime/compliance/ESGGovernanceEngine.ts` | **govScore** | 43 | `govScore = govCount > 0 ? Math.min(100, govScore / govCount) : 100;` |
| `src/core/runtime/compliance/ESGGovernanceEngine.ts` | **govScore** | 46 | `govScore = Math.max(0, govScore - ethicsPenalties);` |
| `src/core/runtime/compliance/ESGGovernanceEngine.ts` | **consolidatedScore** | 48 | `const consolidatedScore = Math.round((envScore * 0.3) + (socScore * 0.3) + (govS` |
| `src/core/runtime/compliance/ESGGovernanceEngine.ts` | **scoreId** | 51 | `const scoreId = `ESG-SCORE-${Date.now()}`;` |
| `src/core/runtime/compliance/ESGGovernanceEngine.ts` | **ESGScore** | 53 | `const esgScore: ESGScore = {` |
| `src/core/runtime/compliance/ESGGovernanceEngine.ts` | **getLatestScore** | 77 | `public getLatestScore(tenantId: string): ESGScore | null {` |
| `src/core/runtime/compliance/FiduciaryContracts.ts` | **generateAuditTrail** | 54 | `generateAuditTrail(report: any): any;` |
| `src/core/runtime/compliance/InstitutionalIntegrityEngine.ts` | **generateIntegrityScore** | 11 | `public generateIntegrityScore(tenantId: string, activeUserIds: string[]): Instit` |
| `src/core/runtime/compliance/InstitutionalIntegrityEngine.ts` | **esgScore** | 29 | `const esgScore = esgGovernanceEngine.getLatestScore(tenantId);` |
| `src/core/runtime/compliance/InstitutionalIntegrityEngine.ts` | **integrityScore** | 33 | `let integrityScore = 100;` |
| `src/core/runtime/compliance/InstitutionalIntegrityEngine.ts` | **integrityScore** | 48 | `integrityScore = Math.max(0, Math.min(100, integrityScore));` |
| `src/core/runtime/compliance/InstitutionalIntegrityEngine.ts` | **scoreId** | 51 | `const scoreId = `INT-SCORE-${Date.now()}`;` |
| `src/core/runtime/compliance/InstitutionalIntegrityEngine.ts` | **InstitutionalIntegrityScore** | 53 | `const score: InstitutionalIntegrityScore = {` |
| `src/core/runtime/compliance/RuntimeComplianceEngine.ts` | **scores** | 204 | `const scores = {` |
| `src/core/runtime/compliance/RuntimeComplianceEngine.ts` | **minScore** | 223 | `const minScore = Math.min(` |
| `src/core/runtime/compliance/RuntimeComplianceEngine.ts` | **recalculatedOnUI** | 275 | `if (report.recalculatedOnUI === true) {` |
| `src/core/runtime/compliance/RuntimeComplianceEngine.ts` | **score** | 331 | `const score = metrics.scores[k];` |
| `src/core/runtime/compliance/RuntimeComplianceEngine.ts` | **score** | 332 | `if (typeof score === 'number') {` |
| `src/core/runtime/compliance/RuntimeComplianceEngine.ts` | **recommendations** | 536 | `report.orchestratedNarrative.recommendations = [];` |
| `src/core/runtime/compliance/RuntimeComplianceEngine.ts` | **generateAuditTrail** | 552 | `public generateAuditTrail(report: any) {` |
| `src/core/runtime/compliance/WhistleblowingEngine.ts` | **calculateInitialSeverity** | 29 | `const severity = this.calculateInitialSeverity(category);` |
| `src/core/runtime/compliance/WhistleblowingEngine.ts` | **determineRiskLevel** | 56 | `riskLevel: this.determineRiskLevel(severity),` |
| `src/core/runtime/compliance/WhistleblowingEngine.ts` | **calculateInitialSeverity** | 96 | `private calculateInitialSeverity(category: WhistleblowingCategory): Whistleblowi` |
| `src/core/runtime/compliance/WhistleblowingEngine.ts` | **determineRiskLevel** | 114 | `private determineRiskLevel(severity: WhistleblowingSeverity) {` |
| `src/core/runtime/confidence/InstitutionalConfidenceEngine.ts` | **evaluate** | 10 | `static evaluate(` |
| `src/core/runtime/confidence/InstitutionalConfidenceEngine.ts` | **score** | 17 | `let score = 0;` |
| `src/core/runtime/consolidated/ConsolidatedRuntimeOrchestrator.ts` | **generateExecutiveReport** | 59 | `return this.legacyRuntime.generateExecutiveReport(input as unknown as Record<str` |
| `src/core/runtime/consolidated/ConsolidatedRuntimeOrchestrator.ts` | **generateExecutiveReport** | 88 | `return this.legacyRuntime.generateExecutiveReport(typedInput.entities[0].rawData` |
| `src/core/runtime/consolidated/ConsolidatedRuntimeOrchestrator.ts` | **analyzeTelemetry** | 129 | `const warnings = RuntimePerformanceMonitor.analyzeTelemetry(telemetryData);` |
| `src/core/runtime/consolidated/CrossEntityLineageResolver.ts` | **buildLineageTree** | 3 | `export function buildLineageTree(` |
| `src/core/runtime/consolidated/EntityRuntimeExecutor.ts` | **generateExecutiveReport** | 17 | `const report = this.runtime.generateExecutiveReport(entityInput.rawData);` |
| `src/core/runtime/consolidated/advisory/ConsolidatedAdvisoryOrchestrator.ts` | **generateBlockedReport** | 21 | `return this.generateBlockedReport(financialOutput, 'Dados financeiros rejeitados` |
| `src/core/runtime/consolidated/advisory/ConsolidatedAdvisoryOrchestrator.ts` | **analyze** | 25 | `const structuralRoles = HoldingStructureInterpreter.analyze(entities, financialO` |
| `src/core/runtime/consolidated/advisory/ConsolidatedAdvisoryOrchestrator.ts` | **analyze** | 28 | `const dependencies = IntercompanyDependencyAnalyzer.analyze(financialOutput);` |
| `src/core/runtime/consolidated/advisory/ConsolidatedAdvisoryOrchestrator.ts` | **analyze** | 31 | `const causalities = CrossEntityCausalityEngine.analyze(financialOutput, dependen` |
| `src/core/runtime/consolidated/advisory/ConsolidatedAdvisoryOrchestrator.ts` | **analyze** | 34 | `const systemicRisks = GroupRiskPropagationEngine.analyze(financialOutput, depend` |
| `src/core/runtime/consolidated/advisory/ConsolidatedAdvisoryOrchestrator.ts` | **generate** | 40 | `const narrative = ConsolidatedNarrativeEngine.generate(causalities, systemicRisk` |
| `src/core/runtime/consolidated/advisory/ConsolidatedAdvisoryOrchestrator.ts` | **generateBlockedReport** | 62 | `private static generateBlockedReport(financialOutput: ConsolidatedFinancialOutpu` |
| `src/core/runtime/consolidated/advisory/ConsolidatedNarrativeEngine.ts` | **generate** | 4 | `static generate(` |
| `src/core/runtime/consolidated/advisory/CrossEntityCausalityEngine.ts` | **analyze** | 5 | `static analyze(` |
| `src/core/runtime/consolidated/advisory/GroupRiskPropagationEngine.ts` | **analyze** | 5 | `static analyze(` |
| `src/core/runtime/consolidated/advisory/HoldingStructureInterpreter.ts` | **analyze** | 5 | `static analyze(entities: ConsolidationEntity[], financialOutput: ConsolidatedFin` |
| `src/core/runtime/consolidated/advisory/IntercompanyDependencyAnalyzer.ts` | **analyze** | 5 | `static analyze(financialOutput: ConsolidatedFinancialOutput): DependencyAnalysis` |
| `src/core/runtime/consolidated/stress/ConsolidatedStressPropagationEngine.ts` | **buildRiskEdges** | 27 | `const baseEdges = this.graph.buildRiskEdges(input.entities, eliminatedEntries, u` |
| `src/core/runtime/consolidated/stress/CrossEntityRiskGraph.ts` | **buildRiskEdges** | 16 | `public buildRiskEdges(` |
| `src/core/runtime/constitutional-governance/ConstitutionalGovernanceDashboardEngine.ts` | **generate** | 14 | `public static generate(runtimeOutput: any): ConstitutionalGovernanceDashboardOut` |
| `src/core/runtime/constitutional-governance/ConstitutionalGovernanceRuntime.ts` | **evaluate** | 26 | `public static evaluate(context: any): ConstitutionalComplianceReport {` |
| `src/core/runtime/constitutional-governance/ConstitutionalRestrictionEngine.ts` | **scoreCeiling** | 26 | `let scoreCeiling = 100;` |
| `src/core/runtime/constitutional-governance/ConstitutionalRestrictionEngine.ts` | **scoreCeiling** | 55 | `scoreCeiling = Math.min(scoreCeiling, 0); // MISSING_CONSTITUTIONAL_LINEAGE scor` |
| `src/core/runtime/constitutional-governance/ConstitutionalRestrictionEngine.ts` | **scoreCeiling** | 65 | `scoreCeiling = Math.min(scoreCeiling, 0); // AXIOM_VIOLATION score ceiling: 0` |
| `src/core/runtime/constitutional-governance/ConstitutionalRestrictionEngine.ts` | **scoreCeiling** | 76 | `scoreCeiling = Math.min(scoreCeiling, 10); // FORBIDDEN_OVERRIDE_ATTEMPT score c` |
| `src/core/runtime/constitutional-governance/ConstitutionalRestrictionEngine.ts` | **scoreCeiling** | 85 | `scoreCeiling = Math.min(scoreCeiling, 20); // CONSTITUTIONAL_CONFLICT score ceil` |
| `src/core/runtime/constitutional-governance/ConstitutionalRestrictionEngine.ts` | **scoreCeiling** | 94 | `scoreCeiling = Math.min(scoreCeiling, 20); // INCOMPATIBLE_RUNTIME_TRANSITION sc` |
| `src/core/runtime/constitutional-governance/ConstitutionalRestrictionEngine.ts` | **scoreCeiling** | 105 | `scoreCeiling = Math.min(scoreCeiling, 30); // GOVERNANCE_EROSION_DETECTED score ` |
| `src/core/runtime/constitutional-governance/ConstitutionalRestrictionEngine.ts` | **scoreCeiling** | 114 | `scoreCeiling = Math.min(scoreCeiling, 30); // DOCTRINE_DRIFT score ceiling: 30` |
| `src/core/runtime/constitutional-governance/ConstitutionalRestrictionEngine.ts` | **scoreCeiling** | 123 | `scoreCeiling = Math.min(scoreCeiling, 0);` |
| `src/core/runtime/constitutional-governance/ExecutiveConstitutionalRuntime.ts` | **evaluateOverrideAttempt** | 71 | `const result = this.overrideEngine.evaluateOverrideAttempt({` |
| `src/core/runtime/constitutional-governance/ExecutiveConstitutionalRuntime.ts` | **evaluateRuntimeState** | 179 | `public evaluateRuntimeState(payload: {` |
| `src/core/runtime/constitutional-governance/ExecutiveConstitutionalRuntime.ts` | **evaluateReportAxioms** | 211 | `const axiomEvaluation = this.axiomEngine.evaluateReportAxioms(payload);` |
| `src/core/runtime/constitutional-governance/ExecutiveConstitutionalRuntime.ts` | **evaluateState** | 214 | `const policyEvaluation = this.policyEngine.evaluateState(payload);` |
| `src/core/runtime/constitutional-governance/ExecutiveConstitutionalRuntime.ts` | **evaluate** | 233 | `const semanticReport = SemanticComplianceAuditRuntime.evaluate(` |
| `src/core/runtime/constitutional-governance/FiduciaryAxiomEngine.ts` | **evaluateReportAxioms** | 121 | `public evaluateReportAxioms(report: any): { isViolated: boolean; violations: str` |
| `src/core/runtime/constitutional-governance/GovernanceOverrideEngine.ts` | **evaluateOverrideAttempt** | 17 | `public evaluateOverrideAttempt(params: {` |
| `src/core/runtime/constitutional-governance/RuntimePolicyEngine.ts` | **evaluateState** | 61 | `public evaluateState(state: {` |
| `src/core/runtime/constitutional-governance/SemanticComplianceAuditRuntime.ts` | **evaluate** | 16 | `public static evaluate(` |
| `src/core/runtime/constitutional-governance/SemanticComplianceAuditRuntime.ts` | **generateHash** | 24 | `const semanticLineageHash = SemanticLineageReport.generateHash(lineagePayload);` |
| `src/core/runtime/constitutional-governance/SemanticLineageReport.ts` | **generateHash** | 14 | `public static generateHash(payload: SemanticLineagePayload): string {` |
| `src/core/runtime/constitutional-governance/protocols/SemanticConstitutionProtocol.ts` | **evaluate** | 14 | `const sccfReport = SemanticComplianceAuditRuntime.evaluate(` |
| `src/core/runtime/decision-intelligence/ConstitutionalDecisionRuntime.ts` | **evaluate** | 10 | `public static evaluate(` |
| `src/core/runtime/decision-intelligence/ConstitutionalDecisionRuntime.ts` | **evaluatePriority** | 18 | `const priority = DecisionPrioritizationEngine.evaluatePriority(context);` |
| `src/core/runtime/decision-intelligence/ConstitutionalDecisionRuntime.ts` | **evaluateUrgency** | 19 | `const urgency = DecisionPrioritizationEngine.evaluateUrgency(priority);` |
| `src/core/runtime/decision-intelligence/DecisionCausalityEngine.ts` | **analyze** | 12 | `public static analyze(decision: ExecutiveDecision): {` |
| `src/core/runtime/decision-intelligence/DecisionMemoryLayer.test.ts` | **evaluate** | 32 | `const result = DecisionMemoryLayer.evaluate([]);` |
| `src/core/runtime/decision-intelligence/DecisionMemoryLayer.test.ts` | **evaluate** | 44 | `const result = DecisionMemoryLayer.evaluate(decisions);` |
| `src/core/runtime/decision-intelligence/DecisionMemoryLayer.test.ts` | **evaluate** | 57 | `const result = DecisionMemoryLayer.evaluate(decisions);` |
| `src/core/runtime/decision-intelligence/DecisionMemoryLayer.test.ts` | **evaluate** | 68 | `const result = DecisionMemoryLayer.evaluate(decisions);` |
| `src/core/runtime/decision-intelligence/DecisionMemoryLayer.test.ts` | **evaluate** | 79 | `const result = DecisionMemoryLayer.evaluate(decisions);` |
| `src/core/runtime/decision-intelligence/DecisionMemoryLayer.ts` | **evaluate** | 8 | `public static evaluate(decisions: ExecutiveDecisionEvent[]): DecisionMemoryOutpu` |
| `src/core/runtime/decision-intelligence/DecisionMemoryLayer.ts` | **decisionDisciplineScore** | 61 | `decisionDisciplineScore = Math.max(10, 50 - (destructiveCount * 10));` |
| `src/core/runtime/decision-intelligence/DecisionMemoryLayer.ts` | **decisionDisciplineScore** | 63 | `decisionDisciplineScore = Math.min(100, 50 + (correctiveCount * 15));` |
| `src/core/runtime/decision-intelligence/DecisionPrioritizationEngine.ts` | **evaluatePriority** | 2 | `public static evaluatePriority(context: any): 'CRITICAL' | 'HIGH' | 'MEDIUM' | '` |
| `src/core/runtime/decision-intelligence/DecisionPrioritizationEngine.ts` | **evaluateUrgency** | 22 | `public static evaluateUrgency(priority: string): 'SHORT_TERM' | 'IMMEDIATE' | 'S` |
| `src/core/runtime/decision-intelligence/DecisionToCashCausalityEngine.test.ts` | **evaluate** | 43 | `const result = DecisionToCashCausalityEngine.evaluate(input);` |
| `src/core/runtime/decision-intelligence/DecisionToCashCausalityEngine.test.ts` | **evaluate** | 50 | `const result = DecisionToCashCausalityEngine.evaluate(input);` |
| `src/core/runtime/decision-intelligence/DecisionToCashCausalityEngine.test.ts` | **evaluate** | 57 | `const result = DecisionToCashCausalityEngine.evaluate(input);` |
| `src/core/runtime/decision-intelligence/DecisionToCashCausalityEngine.test.ts` | **evaluate** | 66 | `const result = DecisionToCashCausalityEngine.evaluate(input);` |
| `src/core/runtime/decision-intelligence/DecisionToCashCausalityEngine.test.ts` | **evaluate** | 74 | `const result = DecisionToCashCausalityEngine.evaluate(input);` |
| `src/core/runtime/decision-intelligence/DecisionToCashCausalityEngine.test.ts` | **evaluate** | 82 | `const result = DecisionToCashCausalityEngine.evaluate(input);` |
| `src/core/runtime/decision-intelligence/DecisionToCashCausalityEngine.test.ts` | **evaluate** | 89 | `const result = DecisionToCashCausalityEngine.evaluate(input);` |
| `src/core/runtime/decision-intelligence/DecisionToCashCausalityEngine.test.ts` | **evaluate** | 97 | `const result = DecisionToCashCausalityEngine.evaluate(input);` |
| `src/core/runtime/decision-intelligence/DecisionToCashCausalityEngine.test.ts` | **evaluate** | 106 | `const result = DecisionToCashCausalityEngine.evaluate(input);` |
| `src/core/runtime/decision-intelligence/DecisionToCashCausalityEngine.ts` | **evaluate** | 10 | `public static evaluate(input: DecisionToCashCausalityInput): DecisionToCashCausa` |
| `src/core/runtime/decision-intelligence/DecisionTradeoffEngine.ts` | **analyzeTradeoffs** | 18 | `public static analyzeTradeoffs(` |
| `src/core/runtime/decision-intelligence/EarlyWarningEngine.test.ts` | **evaluate** | 122 | `const result = EarlyWarningEngine.evaluate(input);` |
| `src/core/runtime/decision-intelligence/EarlyWarningEngine.test.ts` | **evaluate** | 132 | `const result = EarlyWarningEngine.evaluate(input);` |
| `src/core/runtime/decision-intelligence/EarlyWarningEngine.test.ts` | **evaluate** | 142 | `const result = EarlyWarningEngine.evaluate(input);` |
| `src/core/runtime/decision-intelligence/EarlyWarningEngine.test.ts` | **evaluate** | 151 | `const result = EarlyWarningEngine.evaluate(input);` |
| `src/core/runtime/decision-intelligence/EarlyWarningEngine.test.ts` | **evaluate** | 161 | `const result = EarlyWarningEngine.evaluate(input);` |
| `src/core/runtime/decision-intelligence/EarlyWarningEngine.test.ts` | **evaluate** | 170 | `const result = EarlyWarningEngine.evaluate(input);` |
| `src/core/runtime/decision-intelligence/EarlyWarningEngine.test.ts` | **evaluate** | 183 | `const result = EarlyWarningEngine.evaluate(input);` |
| `src/core/runtime/decision-intelligence/EarlyWarningEngine.ts` | **evaluate** | 8 | `public static evaluate(input: EarlyWarningIntelligenceInput): EarlyWarningIntell` |
| `src/core/runtime/decision-intelligence/EarlyWarningEngine.ts` | **riskScore** | 35 | `let riskScore = 0; // 0 = lowest risk, 100 = critical threat` |
| `src/core/runtime/decision-intelligence/EarlyWarningEngine.ts` | **runwayImpactAssessment** | 44 | `const runwayPressure = causalityOutput.runwayImpactAssessment === 'IMPACTO_NEGAT` |
| `src/core/runtime/decision-intelligence/EarlyWarningEngine.ts` | **fcoImpactAssessment** | 45 | `const isFCONegative = causalityOutput.fcoImpactAssessment === 'IMPACTO_NEGATIVO_` |
| `src/core/runtime/decision-intelligence/EarlyWarningEngine.ts` | **accountabilityScore** | 51 | `const isAccountabilityFragile = typeof accountabilityOutput.accountabilityScore ` |
| `src/core/runtime/decision-intelligence/EarlyWarningEngine.ts` | **riskScore** | 110 | `riskScore = Math.min(100, Math.max(0, riskScore));` |
| `src/core/runtime/decision-intelligence/ExecutiveAccountabilityEngine.test.ts` | **evaluate** | 84 | `const result = ExecutiveAccountabilityEngine.evaluate(input);` |
| `src/core/runtime/decision-intelligence/ExecutiveAccountabilityEngine.test.ts` | **evaluate** | 91 | `const result = ExecutiveAccountabilityEngine.evaluate(input);` |
| `src/core/runtime/decision-intelligence/ExecutiveAccountabilityEngine.test.ts` | **evaluate** | 100 | `const result = ExecutiveAccountabilityEngine.evaluate(input);` |
| `src/core/runtime/decision-intelligence/ExecutiveAccountabilityEngine.test.ts` | **evaluate** | 110 | `const result = ExecutiveAccountabilityEngine.evaluate(input);` |
| `src/core/runtime/decision-intelligence/ExecutiveAccountabilityEngine.test.ts` | **evaluate** | 121 | `const result = ExecutiveAccountabilityEngine.evaluate(input);` |
| `src/core/runtime/decision-intelligence/ExecutiveAccountabilityEngine.test.ts` | **evaluate** | 131 | `const result = ExecutiveAccountabilityEngine.evaluate(input);` |
| `src/core/runtime/decision-intelligence/ExecutiveAccountabilityEngine.test.ts` | **evaluate** | 147 | `const resWithout = ExecutiveAccountabilityEngine.evaluate(inputWithoutDrift);` |
| `src/core/runtime/decision-intelligence/ExecutiveAccountabilityEngine.test.ts` | **evaluate** | 148 | `const resWith = ExecutiveAccountabilityEngine.evaluate(inputWithDrift);` |
| `src/core/runtime/decision-intelligence/ExecutiveAccountabilityEngine.ts` | **evaluate** | 8 | `public static evaluate(input: ExecutiveAccountabilityInput): ExecutiveAccountabi` |
| `src/core/runtime/decision-intelligence/ExecutiveAccountabilityEngine.ts` | **baseScore** | 33 | `let baseScore = 50;` |
| `src/core/runtime/decision-intelligence/ExecutiveAccountabilityEngine.ts` | **accountabilityScore** | 113 | `const accountabilityScore = Math.max(0, Math.min(100, baseScore));` |
| `src/core/runtime/decision-intelligence/ExecutiveAccountabilityEngine.ts` | **reactionSpeedAssessment** | 115 | `let reactionSpeedAssessment = 'MODERADA';` |
| `src/core/runtime/decision-intelligence/ExecutiveAccountabilityEngine.ts` | **reactionSpeedAssessment** | 116 | `if (status === 'HIGH_EXECUTIVE_DISCIPLINE') reactionSpeedAssessment = 'RÁPIDA_E_` |
| `src/core/runtime/decision-intelligence/ExecutiveAccountabilityEngine.ts` | **reactionSpeedAssessment** | 117 | `else if (status === 'CHRONIC_REACTION_DELAY' || status === 'REACTIVE_CORRECTION'` |
| `src/core/runtime/decision-intelligence/ExecutiveAccountabilityEngine.ts` | **reactionSpeedAssessment** | 118 | `else if (status === 'NON_CORRECTIVE_MANAGEMENT_PATTERN') reactionSpeedAssessment` |
| `src/core/runtime/decision-intelligence/ExecutiveConsequenceIntelligenceLayer.ts` | **evaluate** | 12 | `public static evaluate(` |
| `src/core/runtime/decision-intelligence/GovernanceDriftDetectionEngine.test.ts` | **evaluate** | 62 | `const result = GovernanceDriftDetectionEngine.evaluate(input);` |
| `src/core/runtime/decision-intelligence/GovernanceDriftDetectionEngine.test.ts` | **evaluate** | 72 | `const result = GovernanceDriftDetectionEngine.evaluate(input);` |
| `src/core/runtime/decision-intelligence/GovernanceDriftDetectionEngine.test.ts` | **evaluate** | 80 | `const result = GovernanceDriftDetectionEngine.evaluate(input);` |
| `src/core/runtime/decision-intelligence/GovernanceDriftDetectionEngine.test.ts` | **evaluate** | 88 | `const result = GovernanceDriftDetectionEngine.evaluate(input);` |
| `src/core/runtime/decision-intelligence/GovernanceDriftDetectionEngine.test.ts` | **evaluate** | 96 | `const result = GovernanceDriftDetectionEngine.evaluate(input);` |
| `src/core/runtime/decision-intelligence/GovernanceDriftDetectionEngine.test.ts` | **evaluate** | 104 | `const result = GovernanceDriftDetectionEngine.evaluate(input);` |
| `src/core/runtime/decision-intelligence/GovernanceDriftDetectionEngine.test.ts` | **evaluate** | 115 | `const result = GovernanceDriftDetectionEngine.evaluate(input);` |
| `src/core/runtime/decision-intelligence/GovernanceDriftDetectionEngine.test.ts` | **evaluate** | 123 | `const result = GovernanceDriftDetectionEngine.evaluate(input);` |
| `src/core/runtime/decision-intelligence/GovernanceDriftDetectionEngine.test.ts` | **evaluate** | 131 | `const result = GovernanceDriftDetectionEngine.evaluate(input);` |
| `src/core/runtime/decision-intelligence/GovernanceDriftDetectionEngine.ts` | **evaluate** | 10 | `public static evaluate(input: GovernanceDriftDetectionInput): GovernanceDriftDet` |
| `src/core/runtime/decision-intelligence/GovernanceDriftDetectionEngine.ts` | **baseRiskScore** | 37 | `let baseRiskScore = 0;` |
| `src/core/runtime/decision-intelligence/GovernanceDriftDetectionEngine.ts` | **fcoImpactAssessment** | 44 | `causalityOutput.fcoImpactAssessment === 'IMPACTO_NEGATIVO_OBSERVADO' ||` |
| `src/core/runtime/decision-intelligence/GovernanceDriftDetectionEngine.ts` | **riskScore** | 135 | `const riskScore = behavioralPatterns.behavioralRiskScore;` |
| `src/core/runtime/decision-intelligence/GovernanceDriftDetectionEngine.ts` | **isRiskScoreHigh** | 136 | `const isRiskScoreHigh = typeof riskScore === 'number' && (riskScore as number) >` |
| `src/core/runtime/decision-intelligence/GovernanceDriftDetectionEngine.ts` | **narrativeRiskScore** | 161 | `const narrativeRiskScore = Math.min(100, baseRiskScore);` |
| `src/core/runtime/decision-intelligence/GovernanceTrajectoryEngine.ts` | **analyzeTrajectory** | 12 | `public static analyzeTrajectory(` |
| `src/core/runtime/decision-intelligence/InstitutionalBehavioralPatternsEngine.test.ts` | **evaluate** | 58 | `const result = InstitutionalBehavioralPatternsEngine.evaluate(input);` |
| `src/core/runtime/decision-intelligence/InstitutionalBehavioralPatternsEngine.test.ts` | **evaluate** | 65 | `const result = InstitutionalBehavioralPatternsEngine.evaluate(input);` |
| `src/core/runtime/decision-intelligence/InstitutionalBehavioralPatternsEngine.test.ts` | **evaluate** | 72 | `const result = InstitutionalBehavioralPatternsEngine.evaluate(input);` |
| `src/core/runtime/decision-intelligence/InstitutionalBehavioralPatternsEngine.test.ts` | **evaluate** | 90 | `const result = InstitutionalBehavioralPatternsEngine.evaluate(input);` |
| `src/core/runtime/decision-intelligence/InstitutionalBehavioralPatternsEngine.test.ts` | **evaluate** | 105 | `const result = InstitutionalBehavioralPatternsEngine.evaluate(input);` |
| `src/core/runtime/decision-intelligence/InstitutionalBehavioralPatternsEngine.test.ts` | **evaluate** | 129 | `const result = InstitutionalBehavioralPatternsEngine.evaluate(input);` |
| `src/core/runtime/decision-intelligence/InstitutionalBehavioralPatternsEngine.test.ts` | **evaluate** | 141 | `const result = InstitutionalBehavioralPatternsEngine.evaluate(input);` |
| `src/core/runtime/decision-intelligence/InstitutionalBehavioralPatternsEngine.test.ts` | **evaluate** | 162 | `const result = InstitutionalBehavioralPatternsEngine.evaluate(input);` |
| `src/core/runtime/decision-intelligence/InstitutionalBehavioralPatternsEngine.ts` | **evaluate** | 10 | `public static evaluate(input: InstitutionalBehavioralPatternsInput): Institution` |
| `src/core/runtime/decision-intelligence/InstitutionalBehavioralPatternsEngine.ts` | **baseScore** | 26 | `let baseScore = 50;` |
| `src/core/runtime/decision-intelligence/InstitutionalBehavioralPatternsEngine.ts` | **finalScore** | 129 | `let finalScore = Math.max(0, Math.min(100, baseScore));` |
| `src/core/runtime/decision-intelligence/InstitutionalDecisionIntelligenceEngine.ts` | **evaluateDecision** | 29 | `public static async evaluateDecision(` |
| `src/core/runtime/decision-intelligence/InstitutionalDecisionIntelligenceEngine.ts` | **calculate** | 43 | `const survivabilityScores = InstitutionalSurvivabilityEngine.calculate(report, p` |
| `src/core/runtime/decision-intelligence/InstitutionalDecisionIntelligenceEngine.ts` | **analyze** | 50 | `const causalityResult = DecisionCausalityEngine.analyze(decision);` |
| `src/core/runtime/decision-intelligence/InstitutionalDecisionIntelligenceEngine.ts` | **analyzeTrajectory** | 59 | `const trajectory = GovernanceTrajectoryEngine.analyzeTrajectory(historicalDecisi` |
| `src/core/runtime/decision-intelligence/InstitutionalDecisionIntelligenceEngine.ts` | **evaluateBehavior** | 76 | `behavioralResult = InstitutionalBehavioralIntelligenceEngine.evaluateBehavior(` |
| `src/core/runtime/decision-intelligence/InstitutionalDecisionIntelligenceEngine.ts` | **evaluatePrediction** | 106 | `predictiveResult = PredictiveGovernanceEngine.evaluatePrediction(` |
| `src/core/runtime/decision-intelligence/InstitutionalDecisionIntelligenceEngine.ts` | **evaluateStress** | 171 | `const stress = StrategicStressEngine.evaluateStress(decision, report);` |
| `src/core/runtime/decision-intelligence/InstitutionalDecisionIntelligenceEngine.ts` | **analyzeTradeoffs** | 174 | `const tradeoffs = DecisionTradeoffEngine.analyzeTradeoffs(decision, survivabilit` |
| `src/core/runtime/decision-intelligence/InstitutionalDecisionIntelligenceEngine.ts` | **minScore** | 186 | `const minScore = Math.min(` |
| `src/core/runtime/decision-intelligence/InstitutionalRiskMatrixEngine.ts` | **evaluateRisk** | 2 | `public static evaluateRisk(context: any): {` |
| `src/core/runtime/decision-intelligence/InstitutionalStabilityEngine.test.ts` | **evaluate** | 101 | `const result = InstitutionalStabilityEngine.evaluate(input);` |
| `src/core/runtime/decision-intelligence/InstitutionalStabilityEngine.test.ts` | **evaluate** | 108 | `const result = InstitutionalStabilityEngine.evaluate(input);` |
| `src/core/runtime/decision-intelligence/InstitutionalStabilityEngine.test.ts` | **evaluate** | 120 | `const result = InstitutionalStabilityEngine.evaluate(input);` |
| `src/core/runtime/decision-intelligence/InstitutionalStabilityEngine.test.ts` | **evaluate** | 132 | `const result = InstitutionalStabilityEngine.evaluate(input);` |
| `src/core/runtime/decision-intelligence/InstitutionalStabilityEngine.test.ts` | **evaluate** | 144 | `const result = InstitutionalStabilityEngine.evaluate(input);` |
| `src/core/runtime/decision-intelligence/InstitutionalStabilityEngine.test.ts` | **evaluate** | 158 | `const result = InstitutionalStabilityEngine.evaluate(input);` |
| `src/core/runtime/decision-intelligence/InstitutionalStabilityEngine.test.ts` | **evaluate** | 168 | `const result = InstitutionalStabilityEngine.evaluate(input);` |
| `src/core/runtime/decision-intelligence/InstitutionalStabilityEngine.test.ts` | **evaluate** | 182 | `const result = InstitutionalStabilityEngine.evaluate(input);` |
| `src/core/runtime/decision-intelligence/InstitutionalStabilityEngine.ts` | **evaluate** | 10 | `public static evaluate(input: InstitutionalStabilityInput): InstitutionalStabili` |
| `src/core/runtime/decision-intelligence/InstitutionalStabilityEngine.ts` | **score** | 41 | `let score = 100;` |
| `src/core/runtime/decision-intelligence/InstitutionalStabilityEngine.ts` | **runwayImpactAssessment** | 51 | `const isRunwayCritical = causalityOutput.runwayImpactAssessment === 'IMPACTO_NEG` |
| `src/core/runtime/decision-intelligence/InstitutionalStabilityEngine.ts` | **fcoImpactAssessment** | 58 | `const isFCONegative = causalityOutput.fcoImpactAssessment === 'IMPACTO_NEGATIVO_` |
| `src/core/runtime/decision-intelligence/InstitutionalStabilityEngine.ts` | **behavioralScore** | 80 | `const behavioralScore = typeof behavioralPatterns.behavioralRiskScore === 'numbe` |
| `src/core/runtime/decision-intelligence/InstitutionalStabilityEngine.ts` | **accountabilityScore** | 87 | `const accountabilityScore = typeof accountabilityOutput.accountabilityScore === ` |
| `src/core/runtime/decision-intelligence/InstitutionalStabilityEngine.ts` | **score** | 108 | `score = Math.min(score, 35);` |
| `src/core/runtime/decision-intelligence/InstitutionalStabilityEngine.ts` | **score** | 112 | `score = Math.min(score, 40);` |
| `src/core/runtime/decision-intelligence/InstitutionalStabilityEngine.ts` | **score** | 116 | `score = Math.min(score, 30);` |
| `src/core/runtime/decision-intelligence/InstitutionalStabilityEngine.ts` | **score** | 120 | `score = Math.min(score, 15);` |
| `src/core/runtime/decision-intelligence/InstitutionalStabilityEngine.ts` | **score** | 125 | `score = Math.min(score, 35);` |
| `src/core/runtime/decision-intelligence/InstitutionalStabilityEngine.ts` | **score** | 130 | `score = Math.min(score, 25);` |
| `src/core/runtime/decision-intelligence/InstitutionalStabilityEngine.ts` | **score** | 134 | `score = Math.min(score, 20);` |
| `src/core/runtime/decision-intelligence/InstitutionalStabilityEngine.ts` | **score** | 138 | `score = Math.min(score, 40);` |
| `src/core/runtime/decision-intelligence/InstitutionalStabilityEngine.ts` | **score** | 142 | `score = Math.max(0, score); // Ensure min is 0` |
| `src/core/runtime/decision-intelligence/InstitutionalStabilityEngine.ts` | **ResilienceAssessment** | 176 | `let resilienceAssessment: ResilienceAssessment = 'LOW_RESILIENCE';` |
| `src/core/runtime/decision-intelligence/InstitutionalStabilityEngine.ts` | **resilienceAssessment** | 177 | `if (classification === 'STRUCTURALLY_STABLE') resilienceAssessment = 'HIGH_RESIL` |
| `src/core/runtime/decision-intelligence/InstitutionalStabilityEngine.ts` | **resilienceAssessment** | 178 | `else if (classification === 'FRAGILE_STABILITY' || classification === 'STABLE_BU` |
| `src/core/runtime/decision-intelligence/InstitutionalStabilityEngine.ts` | **resilienceAssessment** | 179 | `else if (classification === 'APPARENT_STABILITY') resilienceAssessment = 'FRAGIL` |
| `src/core/runtime/decision-intelligence/InstitutionalStabilityEngine.ts` | **resilienceAssessment** | 180 | `else if (classification === 'COLLAPSE_RISK') resilienceAssessment = 'NO_EVIDENCE` |
| `src/core/runtime/decision-intelligence/InstitutionalStabilityTypes.ts` | **ResilienceAssessment** | 28 | `export type ResilienceAssessment =` |
| `src/core/runtime/decision-intelligence/InstitutionalSurvivabilityEngine.ts` | **calculate** | 13 | `public static calculate(report: any, policyContext?: PolicyContext): Survivabili` |
| `src/core/runtime/decision-intelligence/InstitutionalSurvivabilityEngine.ts` | **financialScore** | 15 | `const financialScore = report.scores?.financial ?? 70;` |
| `src/core/runtime/decision-intelligence/InstitutionalSurvivabilityEngine.ts` | **operationalScore** | 16 | `const operationalScore = report.scores?.operational ?? 70;` |
| `src/core/runtime/decision-intelligence/InstitutionalSurvivabilityEngine.ts` | **governanceScore** | 17 | `const governanceScore = report.scores?.governance ?? 70;` |
| `src/core/runtime/decision-intelligence/InstitutionalSurvivabilityEngine.ts` | **structuralScore** | 18 | `const structuralScore = report.scores?.structural ?? 70;` |
| `src/core/runtime/decision-intelligence/InstitutionalSurvivabilityEngine.ts` | **eqsScore** | 58 | `const eqsScore =` |
| `src/core/runtime/decision-intelligence/StrategicStressEngine.ts` | **evaluateStress** | 12 | `public static evaluateStress(` |
| `src/core/runtime/decision-intelligence/StrategicStressEngine.ts` | **stressScoreDelta** | 21 | `let stressScoreDelta = 0;` |
| `src/core/runtime/decision-intelligence/StrategicStressEngine.ts` | **stressScoreDelta** | 35 | `stressScoreDelta = -30;` |
| `src/core/runtime/decision-intelligence/StrategicStressEngine.ts` | **stressScoreDelta** | 39 | `stressScoreDelta = -15;` |
| `src/core/runtime/decision-intelligence/StrategicStressEngine.ts` | **stressScoreDelta** | 48 | `stressScoreDelta = -25;` |
| `src/core/runtime/decision-intelligence/StrategicStressEngine.ts` | **stressScoreDelta** | 52 | `stressScoreDelta = -10;` |
| `src/core/runtime/decision-intelligence/StrategicStressEngine.ts` | **stressScoreDelta** | 60 | `stressScoreDelta = -20;` |
| `src/core/runtime/decision-intelligence/StrategicStressEngine.ts` | **stressScoreDelta** | 66 | `stressScoreDelta = 0;` |
| `src/core/runtime/decision-policy/DecisionPolicyEngine.ts` | **analyzeSector** | 31 | `const sectorAnalysis = SectorGovernanceProfileEngine.analyzeSector(report);` |
| `src/core/runtime/decision-policy/DecisionPolicyEngine.ts` | **analyzePosture** | 32 | `const postureAnalysis = StrategicPostureEngine.analyzePosture(report);` |
| `src/core/runtime/decision-policy/DecisionPolicyEngine.ts` | **analyzeSector** | 39 | `const sectorInfo = SectorGovernanceProfileEngine.analyzeSector(report);` |
| `src/core/runtime/decision-policy/DecisionPolicyEngine.ts` | **evaluateMateriality** | 42 | `const materiality = InstitutionalMaterialityEngine.evaluateMateriality(decision,` |
| `src/core/runtime/decision-policy/InstitutionalMaterialityEngine.ts` | **calculateMaterialityBase** | 13 | `public static calculateMaterialityBase(report: any): number {` |
| `src/core/runtime/decision-policy/InstitutionalMaterialityEngine.ts` | **evaluateMateriality** | 29 | `public static evaluateMateriality(` |
| `src/core/runtime/decision-policy/InstitutionalMaterialityEngine.ts` | **calculateMaterialityBase** | 33 | `const materialityBase = this.calculateMaterialityBase(report);` |
| `src/core/runtime/decision-policy/InstitutionalMaterialityEngine.ts` | **compositeScore** | 68 | `const compositeScore = report?.scores?.composite ?? report?.scores?.financial ??` |
| `src/core/runtime/decision-policy/InstitutionalMaterialityEngine.ts` | **avgScore** | 86 | `const avgScore = Math.round(` |
| `src/core/runtime/decision-policy/SectorGovernanceProfileEngine.ts` | **analyzeSector** | 11 | `public static analyzeSector(report: any): {` |
| `src/core/runtime/decision-policy/StrategicPostureEngine.ts` | **analyzePosture** | 11 | `public static analyzePosture(report: any): {` |
| `src/core/runtime/deployment-readiness/FiduciaryReadinessAssessmentEngine.ts` | **evaluate** | 18 | `public static evaluate(input: DeploymentReadinessInput): FiduciaryReadinessOutpu` |
| `src/core/runtime/deployment-readiness/InstitutionalDeploymentReadinessEngine.ts` | **evaluate** | 10 | `public static evaluate(input: DeploymentReadinessInput): InstitutionalDeployment` |
| `src/core/runtime/deployment-readiness/InstitutionalReadinessOrchestrator.ts` | **evaluate** | 34 | `const fidValidation = FiduciaryReadinessAssessmentEngine.evaluate(input);` |
| `src/core/runtime/distributed/DistributedAnomalyAggregator.ts` | **analyzeEvent** | 79 | `static async analyzeEvent(event: AuditEvent): Promise<void> {` |
| `src/core/runtime/distributed/RuntimePartitionManager.ts` | **recalculateHealthAndPressure** | 84 | `this.recalculateHealthAndPressure(partition);` |
| `src/core/runtime/distributed/RuntimePartitionManager.ts` | **recalculateHealthAndPressure** | 89 | `this.recalculateHealthAndPressure(partition);` |
| `src/core/runtime/distributed/RuntimePartitionManager.ts` | **recalculateHealthAndPressure** | 92 | `private static recalculateHealthAndPressure(partition: RuntimePartitionType) {` |
| `src/core/runtime/dre/BreakEvenAnalysisEngine.ts` | **evaluate** | 12 | `public static evaluate(input: NormalizedDREPayload): ExecutiveMetricResult<Break` |
| `src/core/runtime/dre/CrossStatementIsolationValidator.ts` | **validateDRERecommendation** | 43 | `public static validateDRERecommendation(text: string): CrossStatementValidationR` |
| `src/core/runtime/dre/CrossStatementIsolationValidator.ts` | **recommendations** | 48 | `const recommendations = blockedTerms.map(term =>` |
| `src/core/runtime/dre/CrossStatementIsolationValidator.ts` | **filterDRERecommendations** | 58 | `public static filterDRERecommendations(items: string[]): string[] {` |
| `src/core/runtime/dre/CrossStatementIsolationValidator.ts` | **validateDRERecommendation** | 60 | `const { isValid } = this.validateDRERecommendation(item);` |
| `src/core/runtime/dre/DREBoardAdvisoryEngine.ts` | **generateSynthesis** | 23 | `public static generateSynthesis(normalizedDRE: NormalizedDREPayload, diagnosis: ` |
| `src/core/runtime/dre/DREBoardAdvisoryEngine.ts` | **generateExecutiveAdvisory** | 24 | `const advisory = this.generateExecutiveAdvisory(normalizedDRE, diagnosis);` |
| `src/core/runtime/dre/DREBoardAdvisoryEngine.ts` | **generateExecutiveAdvisory** | 28 | `public static generateExecutiveAdvisory(` |
| `src/core/runtime/dre/DREBoardAdvisoryEngine.ts` | **valueCreationAssessment** | 75 | `const outlook = valueCreationAssessment === 'Sim'` |
| `src/core/runtime/dre/DREBoardAdvisoryEngine.ts` | **validateDRERecommendation** | 88 | `const isolationValidated = CrossStatementIsolationValidator.validateDRERecommend` |
| `src/core/runtime/dre/DREBoardDecisionSupportEngine.ts` | **generateFramework** | 35 | `public static generateFramework(` |
| `src/core/runtime/dre/DREBoardDecisionSupportEngine.ts` | **valueCreationAssessment** | 42 | `const criacaoDeValor = valueCreationAssessment === 'Sim'` |
| `src/core/runtime/dre/DREBoardDecisionSupportEngine.ts` | **valueCreationAssessment** | 48 | `if (valueCreationAssessment === 'Sim') {` |
| `src/core/runtime/dre/DREBoardDecisionSupportEngine.ts` | **valueCreationAssessment** | 85 | `const criacaoValorEconomico = valueCreationAssessment === 'Sim'` |
| `src/core/runtime/dre/DRECostStructureEngine.ts` | **evaluate** | 15 | `public static evaluate(metrics: CostStructureMetrics): CostStructureInsight {` |
| `src/core/runtime/dre/DREExecutiveInterpretationEngine.ts` | **evaluate** | 19 | `public static evaluate(input: ExecutiveInterpretationInput): ExecutiveInterpreta` |
| `src/core/runtime/dre/DREExecutiveInterpretationEngine.ts` | **evaluate** | 20 | `const economicValue = EconomicValueNarrativeEngine.evaluate(input.economicValueI` |
| `src/core/runtime/dre/DREExecutiveInterpretationEngine.ts` | **evaluate** | 21 | `const recoverability = RecoverabilityAssessmentEngine.evaluate(input.recoverabil` |
| `src/core/runtime/dre/DREExecutiveInterpretationEngine.ts` | **recoverabilityAssessment** | 34 | `let recoverabilityAssessment = recoverability.classificacao;` |
| `src/core/runtime/dre/DREOperationalEfficiencyEngine.ts` | **evaluate** | 16 | `public static evaluate(metrics: OperationalEfficiencyMetrics): EfficiencyInsight` |
| `src/core/runtime/dre/DRERecoverabilityGovernanceEngine.ts` | **evaluate** | 8 | `public static evaluate(coveragePercentage: number, grossMargin: number): string ` |
| `src/core/runtime/dre/DREUnitEconomicsEngine.ts` | **evaluate** | 16 | `public static evaluate(metrics: UnitEconomicsMetrics): UnitEconomicsInsight {` |
| `src/core/runtime/dre/EconomicBurnRateEngine.ts` | **evaluate** | 12 | `public static evaluate(input: NormalizedDREPayload): ExecutiveMetricResult<Econo` |
| `src/core/runtime/dre/EconomicDiagnosisEngine.ts` | **evaluate** | 26 | `public static evaluate(input: EconomicDiagnosisInput): EconomicDiagnosisOutput {` |
| `src/core/runtime/dre/EconomicDiagnosisEngine.ts` | **valueCreationAssessment** | 40 | `let valueCreationAssessment = 'Não';` |
| `src/core/runtime/dre/EconomicDiagnosisEngine.ts` | **valueCreationAssessment** | 41 | `if (netProfit.value > 0) valueCreationAssessment = 'Sim';` |
| `src/core/runtime/dre/EconomicDiagnosisEngine.ts` | **evaluate** | 57 | `const recoverabilityAssessment = DRERecoverabilityGovernanceEngine.evaluate(` |
| `src/core/runtime/dre/EconomicValueNarrativeEngine.ts` | **evaluate** | 17 | `public static evaluate(input: EconomicValueInput): EconomicValueOutput {` |
| `src/core/runtime/dre/OperationalAbsorptionEngine.ts` | **evaluate** | 11 | `public static evaluate(input: NormalizedDREPayload): ExecutiveMetricResult<Opera` |
| `src/core/runtime/dre/OperationalHealthExplainabilityEngine.ts` | **classify** | 29 | `const classification = this.classify(score);` |
| `src/core/runtime/dre/OperationalHealthExplainabilityEngine.ts` | **buildDrivers** | 31 | `const drivers = this.buildDrivers(score, { ebitda, breakEvenCoverage, grossMargi` |
| `src/core/runtime/dre/OperationalHealthExplainabilityEngine.ts` | **buildSummary** | 32 | `const executiveSummary = this.buildSummary(score, classification, drivers);` |
| `src/core/runtime/dre/OperationalHealthExplainabilityEngine.ts` | **classify** | 37 | `private static classify(score: number): string {` |
| `src/core/runtime/dre/OperationalHealthExplainabilityEngine.ts` | **buildDrivers** | 53 | `private static buildDrivers(` |
| `src/core/runtime/dre/OperationalHealthExplainabilityEngine.ts` | **buildSummary** | 90 | `private static buildSummary(score: number, classification: string, drivers: stri` |
| `src/core/runtime/dre/RecoverabilityAssessmentEngine.ts` | **evaluate** | 14 | `public static evaluate(input: RecoverabilityInput): RecoverabilityOutput {` |
| `src/core/runtime/dre/RevenueEconomicStructureEngine.ts` | **evaluate** | 14 | `public static evaluate(input: NormalizedDREPayload): ExecutiveMetricResult<Reven` |
| `src/core/runtime/early-warning/EarlyWarningGovernanceEngine.ts` | **determinePredictiveConfidence** | 28 | `static determinePredictiveConfidence(evidenceCount: number): PredictiveConfidenc` |
| `src/core/runtime/early-warning/EarlyWarningSignalEngine.ts` | **riskScore** | 27 | `const riskScore = RiskSignalAggregator.aggregateSignals(allSignals);` |
| `src/core/runtime/early-warning/EarlyWarningSignalEngine.ts` | **calculateIndex** | 29 | `GovernanceDeteriorationIndex.calculateIndex(tenantId, riskScore);` |
| `src/core/runtime/early-warning/EarlyWarningSignalEngine.ts` | **determinePredictiveConfidence** | 52 | `predictiveConfidence: EarlyWarningGovernanceEngine.determinePredictiveConfidence` |
| `src/core/runtime/early-warning/GovernanceDeteriorationIndex.ts` | **calculateIndex** | 4 | `static calculateIndex(tenantId: string, riskScore: number): GovernanceRiskTrend ` |
| `src/core/runtime/economic-value/EconomicReturnEngine.ts` | **evaluate** | 22 | `public static evaluate(` |
| `src/core/runtime/economic-value/EconomicValueCreationEngine.ts` | **generateNarrative** | 7 | `public static generateNarrative(` |
| `src/core/runtime/economic-value/ExecutiveMaturityLayer.ts` | **evaluate** | 18 | `public static evaluate(historicalCyclesCount: number, netRevenue: number): Execu` |
| `src/core/runtime/economic-value/InstitutionalExecutiveThesisEngine.ts` | **generate** | 16 | `public static generate(input: ThesisInput): ThesisOutput {` |
| `src/core/runtime/efos/InstitutionalExecutionAssessment.ts` | **calculateInstitutionalExecution** | 17 | `export function calculateInstitutionalExecution(input: ExecutionAssessmentInput)` |
| `src/core/runtime/enterprise-validation/ProductionReadinessEvaluator.ts` | **evaluate** | 4 | `static evaluate(tenantId: string): ProductionReadinessScore {` |
| `src/core/runtime/enterprise-validation/RealDataValidationEngine.ts` | **evaluate** | 18 | `const readiness = ProductionReadinessEvaluator.evaluate(tenantId);` |
| `src/core/runtime/esgim/ESGIMAssessmentEngine.ts` | **ESGIMAssessmentEngine** | 19 | `ESGIMAssessmentEngine.instance = new ESGIMAssessmentEngine();` |
| `src/core/runtime/esgim/ESGIMAssessmentEngine.ts` | **calculateAssessment** | 27 | `public calculateAssessment(` |
| `src/core/runtime/esgim/ESGIMAssessmentEngine.ts` | **getLatestScore** | 45 | `const liveEsg = esgGovernanceEngine.getLatestScore(clientId);` |
| `src/core/runtime/esgim/ESGIMAssessmentEngine.ts` | **generateIntegrityScore** | 56 | `const liveIntegrity = institutionalIntegrityEngine.generateIntegrityScore(client` |
| `src/core/runtime/esgim/ESGIMAssessmentEngine.ts` | **rawOverallScore** | 130 | `let rawOverallScore = Math.round(` |
| `src/core/runtime/esgim/ESGIMAssessmentEngine.ts` | **overallScore** | 138 | `let overallScore = rawOverallScore;` |
| `src/core/runtime/esgim/ESGIMAssessmentEngine.ts` | **overallScore** | 142 | `overallScore = Math.min(overallScore, 39);` |
| `src/core/runtime/esgim/ESGIMAssessmentEngine.ts` | **overallScore** | 145 | `overallScore = Math.min(overallScore, 59);` |
| `src/core/runtime/esgim/ESGIMAssessmentEngine.ts` | **overallScore** | 148 | `overallScore = Math.min(overallScore, 89);` |
| `src/core/runtime/esgim/ESGIMAssessmentEngine.ts` | **overallScore** | 151 | `overallScore = Math.min(overallScore, 89);` |
| `src/core/runtime/esgim/ESGIMAssessmentEngine.ts` | **generateExecutiveSummary** | 202 | `const executiveSummary = this.generateExecutiveSummary(maturityLevel, {` |
| `src/core/runtime/esgim/ESGIMAssessmentEngine.ts` | **generateExecutiveSummary** | 372 | `private generateExecutiveSummary(` |
| `src/core/runtime/esgim/ESGIMAssessmentEngine.ts` | **esgimAssessmentEngine** | 415 | `export const esgimAssessmentEngine = ESGIMAssessmentEngine.getInstance();` |
| `src/core/runtime/esgim/InstitutionalResilienceIndexEngine.ts` | **calculateResilience** | 24 | `public calculateResilience(` |
| `src/core/runtime/esgim/InstitutionalResilienceIndexEngine.ts` | **rawScore** | 136 | `let rawScore = Math.round(` |
| `src/core/runtime/esgim/InstitutionalResilienceIndexEngine.ts` | **score** | 143 | `let score = rawScore;` |
| `src/core/runtime/esgim/InstitutionalResilienceIndexEngine.ts` | **score** | 150 | `score = Math.min(score, 39);` |
| `src/core/runtime/esgim/InstitutionalResilienceIndexEngine.ts` | **score** | 154 | `score = Math.min(score, 39);` |
| `src/core/runtime/esgim/InstitutionalResilienceIndexEngine.ts` | **score** | 158 | `score = Math.min(score, 59);` |
| `src/core/runtime/esgim/InstitutionalResilienceIndexEngine.ts` | **score** | 162 | `score = Math.min(score, 89);` |
| `src/core/runtime/esgim/InstitutionalResilienceIndexEngine.ts` | **score** | 166 | `score = Math.min(score, 89);` |
| `src/core/runtime/esgim/InstitutionalResilienceIndexEngine.ts` | **generateResilienceNarrative** | 193 | `const executiveSummary = this.generateResilienceNarrative(level, {` |
| `src/core/runtime/esgim/InstitutionalResilienceIndexEngine.ts` | **generateResilienceNarrative** | 290 | `private generateResilienceNarrative(` |
| `src/core/runtime/evidence-ingestion/InstitutionalEvidenceOrchestrator.ts` | **evaluate** | 9 | `public static evaluate(input: InstitutionalEvidenceInput): InstitutionalEvidence` |
| `src/core/runtime/execution/DecisionRegistryEngine.ts` | **calculateGeiSimpleScore** | 395 | `public calculateGeiSimpleScore(scenario: ESGIMScenario): number {` |
| `src/core/runtime/execution/DecisionRegistryEngine.ts` | **calculateGeiWeightedScore** | 407 | `public calculateGeiWeightedScore(scenario: ESGIMScenario): number {` |
| `src/core/runtime/execution/DecisionRegistryEngine.ts` | **calculateGaiScore** | 452 | `public calculateGaiScore(scenario: ESGIMScenario): number {` |
| `src/core/runtime/execution/DecisionRegistryEngine.ts` | **calculateOverdueRate** | 463 | `public calculateOverdueRate(scenario: ESGIMScenario): number {` |
| `src/core/runtime/execution/DecisionRegistryEngine.ts` | **calculateAgingBuckets** | 474 | `public calculateAgingBuckets(scenario: ESGIMScenario) {` |
| `src/core/runtime/execution-governance/BoardFollowupEngine.ts` | **generateBoardFollowupAgenda** | 12 | `export function generateBoardFollowupAgenda(commitments: ExecutionCommitment[]):` |
| `src/core/runtime/execution-governance/ExecutionTrackingEngine.ts` | **calculateExecutionSlippage** | 3 | `export function calculateExecutionSlippage(commitment: ExecutionCommitment, curr` |
| `src/core/runtime/execution-governance/ExecutionTrackingEngine.ts` | **overallSlippageScore** | 58 | `let overallSlippageScore = Math.min(100, Math.round((totalSeverity / 9) * 100));` |
| `src/core/runtime/execution-governance/ExecutionTrackingEngine.ts` | **calculateExecutionSlippage** | 75 | `updated.slippage = calculateExecutionSlippage(updated, updated.lastUpdated);` |
| `src/core/runtime/execution-governance/ImpactValidationEngine.ts` | **impactScore** | 22 | `let impactScore = 100;` |
| `src/core/runtime/execution-governance/ImpactValidationEngine.ts` | **impactScore** | 52 | `impactScore = Math.max(0, Math.min(100, impactScore));` |
| `src/core/runtime/executive/ConfidenceDisclosurePolicy.ts` | **evaluateDisclosureRequirements** | 7 | `static evaluateDisclosureRequirements(narrative: ExecutiveNarrative): {` |
| `src/core/runtime/executive/ConfidenceDisclosurePolicy.ts` | **evaluateDisclosureRequirements** | 28 | `const rules = this.evaluateDisclosureRequirements(narrative);` |
| `src/core/runtime/executive/ExecutiveDecisionEngine.ts` | **evaluateExecutiveDecision** | 15 | `export function evaluateExecutiveDecision(scenarios: ExecutiveDecisionInput[], b` |
| `src/core/runtime/executive/ExecutiveDecisionEngine.ts` | **recommended** | 23 | `const recommended = rankedScenarios.find(s => s.rankCategory === '1º Recomendado` |
| `src/core/runtime/executive/ExecutiveDecisionEngine.ts` | **analyzeTradeOffs** | 29 | `const tradeOffs = analyzeTradeOffs(recommended, baseline);` |
| `src/core/runtime/executive/ExecutiveDecisionTypes.ts` | **buildExecutiveDecisionInput** | 13 | `export function buildExecutiveDecisionInput(` |
| `src/core/runtime/executive/ExecutiveDisclosureResolver.ts` | **evaluateDisclosureRequirements** | 10 | `const rules = ConfidenceDisclosurePolicy.evaluateDisclosureRequirements(narrativ` |
| `src/core/runtime/executive/ExecutiveNarrativePolicy.ts` | **generateHashes** | 13 | `const hashes = NarrativeHasher.generateHashes(data);` |
| `src/core/runtime/executive/ExecutiveNarrativePolicy.ts` | **generateHashes** | 28 | `const computedHashes = NarrativeHasher.generateHashes(data as ExecutiveNarrative` |
| `src/core/runtime/executive/ScenarioRankingEngine.ts` | **scoredScenarios** | 15 | `const scoredScenarios = scenarios.map(s => {` |
| `src/core/runtime/executive/ScenarioRankingEngine.ts` | **evScore** | 17 | `const evScore = (s.enterpriseValue / maxEv) * 100; // 0 to 100` |
| `src/core/runtime/executive/ScenarioRankingEngine.ts` | **rawScore** | 25 | `let rawScore = (evScore * 0.4) + (s.ieiScore * 0.3) - (s.irgScore * 0.2) - (s.gp` |
| `src/core/runtime/executive/TradeOffAnalysisEngine.ts` | **analyzeTradeOffs** | 10 | `export function analyzeTradeOffs(` |
| `src/core/runtime/executive/types.ts` | **generateHashes** | 134 | `static generateHashes(data: ExecutiveNarrativeData): { narrativeHash: string, li` |
| `src/core/runtime/executive-command/ExecutiveCommandExplainabilityEngine.ts` | **evaluate** | 7 | `static evaluate(` |
| `src/core/runtime/executive-command/ExecutiveCommandMemoryEngine.ts` | **generatePersistenceDelta** | 11 | `static generatePersistenceDelta(` |
| `src/core/runtime/executive-command/ExecutiveCommandThesisEngine.ts` | **evaluate** | 13 | `static evaluate(` |
| `src/core/runtime/executive-command/ExecutiveDriftDetectionEngine.ts` | **evaluate** | 7 | `static evaluate(context: CommandEvaluationContext, activeDirectives: ExecutiveDi` |
| `src/core/runtime/executive-command/GovernanceExecutionTrackingEngine.ts` | **evaluate** | 7 | `static evaluate(context: CommandEvaluationContext): GovernanceExecutionTracking ` |
| `src/core/runtime/executive-command/InstitutionalAlignmentEngine.ts` | **evaluate** | 7 | `static evaluate(context: CommandEvaluationContext, directives: ExecutiveDirectiv` |
| `src/core/runtime/executive-command/InstitutionalAlignmentEngine.ts` | **score** | 45 | `let score = 100;` |
| `src/core/runtime/executive-command/InstitutionalAlignmentEngine.ts` | **score** | 53 | `score = Math.max(0, score);` |
| `src/core/runtime/executive-command/InstitutionalDirectiveEngine.ts` | **evaluate** | 7 | `static evaluate(context: CommandEvaluationContext): ExecutiveDirective[] {` |
| `src/core/runtime/executive-command/InstitutionalExecutiveCommandRuntime.ts` | **evaluate** | 16 | `static evaluate(report: ExecutiveIntelligenceReport): InstitutionalExecutiveComm` |
| `src/core/runtime/executive-command/InstitutionalExecutiveCommandRuntime.ts` | **evaluate** | 21 | `const activeDirectives = InstitutionalDirectiveEngine.evaluate(context);` |
| `src/core/runtime/executive-command/InstitutionalExecutiveCommandRuntime.ts` | **evaluate** | 22 | `const driftEvents = ExecutiveDriftDetectionEngine.evaluate(context, activeDirect` |
| `src/core/runtime/executive-command/InstitutionalExecutiveCommandRuntime.ts` | **evaluate** | 23 | `const institutionalAlignment = InstitutionalAlignmentEngine.evaluate(context, ac` |
| `src/core/runtime/executive-command/InstitutionalExecutiveCommandRuntime.ts` | **evaluate** | 24 | `const governanceTracking = GovernanceExecutionTrackingEngine.evaluate(context);` |
| `src/core/runtime/executive-command/InstitutionalExecutiveCommandRuntime.ts` | **evaluate** | 25 | `const strategicOrchestration = StrategicOrchestrationEngine.evaluate(context, ac` |
| `src/core/runtime/executive-command/InstitutionalExecutiveCommandRuntime.ts` | **evaluate** | 27 | `const commandThesis = ExecutiveCommandThesisEngine.evaluate(` |
| `src/core/runtime/executive-command/InstitutionalExecutiveCommandRuntime.ts` | **evaluate** | 31 | `const explainability = ExecutiveCommandExplainabilityEngine.evaluate(` |
| `src/core/runtime/executive-command/InstitutionalExecutiveCommandRuntime.ts` | **generatePersistenceDelta** | 46 | `const persistenceDelta = ExecutiveCommandMemoryEngine.generatePersistenceDelta(c` |
| `src/core/runtime/executive-command/StrategicOrchestrationEngine.ts` | **evaluate** | 7 | `static evaluate(` |
| `src/core/runtime/executive-consolidation/CompositeScoreGovernanceEngine.ts` | **fiduciaryAdjustedScore** | 44 | `const fiduciaryAdjustedScore = Math.max(input.calculatedScore, floor);` |
| `src/core/runtime/executive-consolidation/CrossStatementExecutiveNarrativeEngine.ts` | **generateNarrative** | 12 | `public static generateNarrative(result: CrossStatementPropagationResult): Execut` |
| `src/core/runtime/executive-consolidation/ExecutiveRecommendationDeduplicationEngine.ts` | **ExecutiveRecommendation** | 79 | `const sanitizedRec: ExecutiveRecommendation = {` |
| `src/core/runtime/executive-consolidation/ExecutiveStrategicMaturityEngine.ts` | **evaluate** | 37 | `public static evaluate(input: ExecutiveStrategicMaturityInput): ExecutiveStrateg` |
| `src/core/runtime/executive-consolidation/ExecutiveStrategicSnapshotEngine.ts` | **generateSnapshot** | 25 | `public static generateSnapshot(input: SnapshotEngineInput): ExecutiveStrategicSn` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **generateAuditTrail** | 395 | `public generateAuditTrail(report: any) {` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **generateAuditTrail** | 396 | `return RuntimeComplianceEngine.getInstance().generateAuditTrail(report);` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **generateExecutiveReport** | 403 | `public generateExecutiveReport(rawData: any, externalMetadata?: any): ExecutiveI` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **buildMemory** | 498 | `const memoryProfile = InstitutionalMemoryEngine.buildMemory(rawData.runtimeHisto` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **evaluate** | 501 | `const causalityProfile = InstitutionalCausalityOrchestrator.evaluate(rawData.run` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **evaluate** | 569 | `const evidenceReport = InstitutionalEvidenceOrchestrator.evaluate(evidenceInput)` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **buildBPHierarchy** | 602 | `const hierarchy = buildBPHierarchy(rawData.bpData);` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **calculateFinancialMetrics** | 632 | `const metrics = calculateFinancialMetrics(bpSummary, dreEbitda, dreLucro, segmen` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **evaluateMasterCausality** | 635 | `const masterCausality = hasBP ? evaluateMasterCausality(bpSummary, metrics, iden` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **calcScores** | 641 | `const calcScores = (bp: any, ebitda: number, lucroLiq: number) => {` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **scoreLiquidez** | 663 | `const scoreLiquidez = Math.min(liqCorrente * 0.5 + liqSec * 0.35 + liqImediata *` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **scoreEstrutura** | 668 | `const scoreEstrutura = Math.min(` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **scoreCapGiro** | 676 | `const scoreCapGiro = Math.min(Math.max(50 + ncgRatio * 2, 0), 100);` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **scoreSolidez** | 683 | `const scoreSolidez = Math.min(coberturaPL, 100);` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **scoreEvolucao** | 687 | `let scoreEvolucao = 60;` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **scoreEvolucao** | 690 | `scoreEvolucao = Math.min(Math.max(50 + growthPct, 0), 100);` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **scoreEvolucao** | 692 | `scoreEvolucao = 65;` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **evaluate** | 722 | `const guard = LongitudinalIntelligenceGuard.evaluate(cycles);` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **scoreEvolucao** | 734 | `scoreEvolucao = 0; // Nullify evolution impact` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **rawScores** | 770 | `const rawScores = calcScores(bpSummary, dreEbitda, dreLucro);` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **rawEvolutionScore** | 771 | `const rawEvolutionScore = rawScores.composite; // Evolution score as fallback` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **scores** | 773 | `const scores = prudencyOutput.adjustedScores;` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **analyze** | 914 | `? StructuralCapitalOrchestrator.analyze(bpSummary, institutionalContext)` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **scoreLiq** | 948 | `const scoreLiq = Math.min(liqCorr * 45 * 0.5 + liqSec * 40 * 0.35 + liqImId * 15` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **scoreEstr** | 952 | `let scoreEstr = Math.min(Math.max(autonomia2 * 0.6, 0) + Math.max((100 - endivCP` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **scoreEstr** | 956 | `scoreEstr = Math.max(scoreEstr - 15, 0);` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **scoreEstr** | 958 | `scoreEstr = Math.max(scoreEstr - 10, 0);` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **scoreEstr** | 960 | `scoreEstr = Math.max(scoreEstr - 5, 0);` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **scoreGiro** | 965 | `const scoreGiro = Math.min(Math.max(50 + (at2 > 0 ? (ncg2 / at2) * 100 * 2 : 0),` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **scoreSolid** | 968 | `const scoreSolid = Math.min(cobert2, 100);` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **scoreEvol** | 971 | `let scoreEvol = 60;` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **scoreEvol** | 973 | `scoreEvol = Math.min(Math.max(50 + ((pl2 - prevPlDec) / Math.abs(prevPlDec)) * 1` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **scoreEvol** | 975 | `scoreEvol = 65;` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **buildDreMetricsPayload** | 1028 | `const buildDreMetricsPayload = () => {` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **calculateDreCascade** | 1103 | `const cascadeResult = calculateDreCascade(allRows);` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **calcScore** | 1184 | `const calcScore = (real: number, target: number, isLowerBetter: boolean) => {` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **calcScore** | 1193 | `const eficienciaComercial  = calcScore(cmvVal, targetCmvMax, true);` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **calcScore** | 1194 | `const eficienciaOperacional= calcScore(ebitdaVal, targetEbitdaMin, false);` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **calcScore** | 1195 | `const eficienciaAdministrativa = calcScore(indiceDespesasAdministrativas, target` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **calcScore** | 1196 | `const eficienciaFinanceira = calcScore(indiceDespesasFinanceiras, targetFinMax, ` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **calcScore** | 1197 | `const eficienciaTributaria = calcScore(burdenTributarioPerc, targetTribMax, true` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **calcScore** | 1198 | `const eficienciaEstrutural = calcScore(capacidadeAbsorcaoEstrutura, targetAbsorc` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **calculateDreCascade** | 1214 | `const res = calculateDreCascade([...DRE_OFFICIAL_STRUCTURE.map((a: any) => ({ ..` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **generateDreInsights** | 1255 | `const dreInsights = generateDreInsights(dreMetrics);` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **evaluate** | 1258 | `const qualityReport = ExecutiveEconomicQualityEngine.evaluate(` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **evaluate** | 1262 | `const rootCauseReport = EBITDARootCauseEngine.evaluate(` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **evaluate** | 1266 | `const economicValueAssessment = EconomicValueIntelligenceEngine.evaluate(` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **evaluate** | 1270 | `const earningsQualityAssessment = EarningsCompositionEngine.evaluate(` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **evaluate** | 1279 | `const confidenceAssessment = InstitutionalConfidenceEngine.evaluate(` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **evaluate** | 1286 | `const managementDiscussion = ManagementDiscussionAnalysisEngine.evaluate(` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **evaluate** | 1290 | `const executiveInterpretation = DREExecutiveInterpretationEngine.evaluate({` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **evaluate** | 1310 | `const revenueEconomicStructure = RevenueEconomicStructureEngine.evaluate(normali` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **evaluate** | 1311 | `const economicBurnRate = EconomicBurnRateEngine.evaluate(normalizedDRE);` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **evaluate** | 1312 | `const breakEvenAnalysis = BreakEvenAnalysisEngine.evaluate(normalizedDRE);` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **evaluate** | 1313 | `const operationalAbsorption = OperationalAbsorptionEngine.evaluate(normalizedDRE` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **evaluate** | 1315 | `const economicDiagnosis = EconomicDiagnosisEngine.evaluate({` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **generateExecutiveAdvisory** | 1324 | `const dreExecutiveAdvisoryFull = DREBoardAdvisoryEngine.generateExecutiveAdvisor` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **generateFramework** | 1328 | `const dreBoardDecisionSupport = DREBoardDecisionSupportEngine.generateFramework(` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **validateDRERecommendation** | 1351 | `const dreIsolationAudit = CrossStatementIsolationValidator.validateDRERecommenda` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **economicValueAssessment** | 1356 | `(dreInsights as any).economicValueAssessment = economicValueAssessment;` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **earningsQualityAssessment** | 1357 | `(dreInsights as any).earningsQualityAssessment = earningsQualityAssessment;` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **confidenceAssessment** | 1358 | `(dreInsights as any).confidenceAssessment = confidenceAssessment;` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **dreHealthScoreBase** | 1403 | `let dreHealthScoreBase = 0;` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **scoreMargemBruta** | 1405 | `const scoreMargemBruta   = Math.min(Math.max((mbVal / 40) * 100, 0), 100) * 0.15` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **scoreCMV** | 1406 | `let scoreCMV = 0;` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **scoreCMV** | 1407 | `if (cmvVal <= cmvMax) scoreCMV = 100;` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **scoreCMV** | 1408 | `else if (cmvVal >= cmvCritical) scoreCMV = 0;` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **scoreCMV** | 1409 | `else scoreCMV = 100 - (((cmvVal - cmvMax) / (cmvCritical - cmvMax)) * 100);` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **scoreMargemEbitda** | 1411 | `const scoreMargemEbitda  = Math.min(Math.max((ebitdaVal / 15) * 100, 0), 100) * ` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **scoreMargemOp** | 1412 | `const scoreMargemOp      = Math.min(Math.max(((margemOperacional + 10) / 25) * 1` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **scoreCobertura** | 1413 | `const scoreCobertura     = Math.min(Math.max((indiceCoberturaOperacional / 100) ` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **scoreEstrut** | 1414 | `const scoreEstrut        = Math.min(Math.max(capacidadeAbsorcaoEstrutura * 100, ` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **scoreCaixa** | 1415 | `const scoreCaixa         = Math.min(Math.max((indiceConversaoOperacional / 80) *` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **scoreDivida** | 1417 | `const scoreDivida        = Math.max((1 - debtRatio) * 100, 0) * 0.10;` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **dreHealthScoreBase** | 1418 | `dreHealthScoreBase = scoreMargemBruta + scoreCMV + scoreMargemEbitda + scoreMarg` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **dreHealthScoreBase** | 1421 | `if (ebitda < 0 || margemOperacional < 0 || recLiquida < pontoEquilibrio) dreHeal` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **dreHealthScore** | 1423 | `const dreHealthScore = Math.round(Math.min(Math.max(dreHealthScoreBase, 0), 100)` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **buildDreMetricsPayload** | 1471 | `const metricsPayload = buildDreMetricsPayload();` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **evaluate** | 1694 | `const cashSustainabilityReport = FiduciaryCashIntelligenceRuntime.evaluate(` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **evaluate** | 1725 | `const { longitudinalOut } = LongitudinalCashIntelligenceEngine.evaluate(allCashR` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **longitudinalScore** | 1729 | `cashSustainabilityReport.longitudinalScore = longitudinalOut.longitudinalScore;` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **evaluate** | 1732 | `const causalIntelligenceReport = InstitutionalCausalIntelligenceRuntime.evaluate` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **evaluate** | 1762 | `const treasuryIntelligenceReport = TreasuryIntelligenceRuntime.evaluate({` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **generate** | 1862 | `const financialThesis = InstitutionalFinancialThesisEngine.generate(` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **analyze** | 1872 | `const crossStatementCausality = CrossStatementCausalityEngine.analyze(` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **evaluate** | 1902 | `const fiduciaryEnforcement = GlobalFiduciaryDistributionEnforcementEngine.evalua` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **evaluatePatrimonialStructure** | 1985 | `const patrimonialIntelligenceReport = patrimonialRuntime.evaluatePatrimonialStru` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **evaluate** | 2003 | `const operatingPressureReport = InstitutionalPressureRuntime.evaluate(pressureIn` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **evaluate** | 2012 | `let recoveryReport = InstitutionalRecoveryEngine.evaluate({` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **evaluate** | 2025 | `let regressionReport = RecoveryRegressionGuardEngine.evaluate({` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **evaluate** | 2039 | `const resilienceReport = InstitutionalResilienceEngine.evaluate({` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **evaluate** | 2054 | `regressionReport = RecoveryRegressionGuardEngine.evaluate({` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **evaluate** | 2069 | `recoveryReport = InstitutionalRecoveryEngine.evaluate({` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **evaluate** | 2096 | `const survivalReport = InstitutionalSurvivalHierarchyEngine.evaluate({` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **reevaluatedMatrix** | 2125 | `const reevaluatedMatrix = TreasuryPriorityMatrixEngine.evaluate({` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **reevaluatedMatrix** | 2167 | `const reevaluatedMatrix = TreasuryPriorityMatrixEngine.evaluate({` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **buildMatrix** | 2194 | `const enrichedActionMatrix = ExecutiveActionMatrixEngine.buildMatrix(` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **calculateIndicators** | 2228 | `const bpIndicators = BalanceSheetFinancialMetricsEngine.calculateIndicators(bpSu` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **analyze** | 2230 | `bpIndicators.push(...BalanceSheetQualityEngine.analyze(bpSummary));` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **analyze** | 2231 | `bpIndicators.push(...WorkingCapitalIntelligenceEngine.analyze(bpSummary, dreData` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **analyze** | 2232 | `bpIndicators.push(...PatrimonialPreservationEngine.analyze(bpSummary, dreDataArr` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **evaluate** | 2234 | `const lrOutput = LiquidityRealityEngine.evaluate(bpSummary);` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **evaluate** | 2237 | `const eqOutput = EquityQualityEngine.evaluate(bpSummary);` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **analyze** | 2241 | `bpIndicators.push(...CapitalStructureIntelligenceEngine.analyze(bpSummary, lrOut` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **calculateScore** | 2243 | `const scoreBreakdown = PatrimonialScoreExplainabilityEngine.calculateScore(bpInd` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **classify** | 2244 | `const classification = InstitutionalPatrimonialClassificationEngine.classify(sco` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **evaluate** | 2248 | `ceilingOutput = PatrimonialClassificationCeilingEngine.evaluate(` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **generateInterpretations** | 2258 | `const interpretations = PatrimonialExecutiveInterpretationEngine.generateInterpr` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **buildBPHierarchy** | 2273 | `const hierarchy = buildBPHierarchy(yearEntries);` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **analyzeTrend** | 2281 | `const patrimonialTrend = PatrimonialTrendEngine.analyzeTrend(bpHistoryArray);` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **generate** | 2283 | `const rawAdvisory = BoardPatrimonialAdvisoryEngine.generate(bpIndicators, interp` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **liquidityAssessment** | 2298 | `rawAdvisory.boardAssessment.liquidityAssessment = cLiquidez.scrubbedText;` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **capitalPreservationAssessment** | 2301 | `rawAdvisory.boardAssessment.capitalPreservationAssessment = cPreservacao.scrubbe` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **capitalStructureAssessment** | 2304 | `rawAdvisory.boardAssessment.capitalStructureAssessment = cEstrutura.scrubbedText` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **boardRecommendation** | 2307 | `rawAdvisory.boardAssessment.boardRecommendation = cRec.scrubbedText;` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **evaluate** | 2318 | `const inventoryDependency = InventoryDependencyEngine.evaluate(` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **generateLineage** | 2328 | `const lineageAudit = BalanceSheetSummaryLineageAudit.generateLineage(bpSummary, ` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **generate** | 2332 | `const { text: generatedNarrativeText, narrativeMetadata } = BalanceSheetExecutiv` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **generate** | 2380 | `patrimonialIntelligence: BalanceSheetPatrimonialIntelligenceEngine.generate(bpSu` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **evaluate** | 2428 | `const consistency = PatrimonialGovernanceConsistencyEngine.evaluate({` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **confidenceScore** | 2443 | `executivePatrimonialReport.confidenceScore = consistency.confidenceScore;` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **confidenceScore** | 2446 | `executivePatrimonialReport.confidenceScore = Math.min(executivePatrimonialReport` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **generate** | 2540 | `initialReport.constitutionalDashboard = ConstitutionalGovernanceDashboardEngine.` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **scores** | 2574 | `initialReport.scores = {` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **evaluate** | 2615 | `const semanticCompliance = SemanticComplianceAuditRuntime.evaluate(` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **evaluate** | 2646 | `const constitutionalCompliance = ConstitutionalGovernanceRuntime.evaluate(consti` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **evaluate** | 2650 | `const decisionIntelligence = ConstitutionalDecisionRuntime.evaluate(` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **evaluate** | 2658 | `const scenarioIntelligence = ScenarioImpactRuntime.evaluate(` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **evaluate** | 2672 | `if (EmptyCycleIntegrityEngine.evaluate(rawData)) {` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **evaluate** | 2676 | `if (ScaleEfficiencyIntegrityEngine.evaluate(anosHistorico)) {` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **evaluate** | 2693 | `report.executiveCommand = InstitutionalExecutiveCommandRuntime.evaluate(report);` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **evaluate** | 2696 | `report.operationalGovernance = InstitutionalOperationalGovernanceRuntime.evaluat` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **evaluate** | 2699 | `report.strategicIntelligence = InstitutionalStrategicIntelligenceRuntime.evaluat` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **generate** | 2703 | `report.institutionalBoardPack = InstitutionalBoardPackRuntime.generate(report);` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **evaluate** | 2710 | `const deploymentReadiness = InstitutionalDeploymentReadinessEngine.evaluate({` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **evaluate** | 2752 | `report.institutionalOnboarding = InstitutionalOnboardingOrchestrator.evaluate(on` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **evaluateRuntimeState** | 2770 | `report.constitutionalEvaluation = constRuntime.evaluateRuntimeState({` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **generate** | 2799 | `report.timeline = ExecutiveTimelineEngine.generate(rawData, report);` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **generate** | 2804 | `const parsedCycles = report.timeline.lineageHash ? (ExecutiveTimelineEngine as a` |
| `src/core/runtime/executive-intelligence-runtime.ts` | **generate** | 2836 | `report.fiduciaryCausality = InstitutionalCausalityExplorer.generate(sortedCycles` |
| `src/core/runtime/executive-orchestration/cognitive/ExecutiveNarrativeHierarchyEngine.ts` | **buildBlock** | 8 | `public static buildBlock(report: ExecutiveIntelligenceReport): NarrativeHierarch` |
| `src/core/runtime/executive-presentation/ExecutiveNarrativeDeduplicationEngine.ts` | **generateSignature** | 16 | `const signature = this.generateSignature(msg);` |
| `src/core/runtime/executive-presentation/ExecutiveNarrativeDeduplicationEngine.ts` | **generateSignature** | 27 | `private static generateSignature(msg: string): string {` |
| `src/core/runtime/executive-prioritization/BoardAttentionDemandIndexEngine.ts` | **evaluate** | 12 | `public static evaluate(` |
| `src/core/runtime/executive-prioritization/BoardTop3DecisionEngine.ts` | **generate** | 18 | `public static generate(report: any, requiresEscalation: boolean): BoardDecision[` |
| `src/core/runtime/executive-prioritization/BoardTop3DecisionEngine.ts` | **badiScore** | 42 | `const badiScore = report.advisory?.badi || 0;` |
| `src/core/runtime/executive-prioritization/ExecutiveActionPlanEngine.ts` | **generate** | 16 | `public static generate(report: any): ExecutiveAction[] {` |
| `src/core/runtime/executive-prioritization/ExecutivePriorityRankingEngine.ts` | **impactScore** | 69 | `const impactScore = 95;` |
| `src/core/runtime/executive-prioritization/ExecutivePriorityRankingEngine.ts` | **urgencyScore** | 70 | `const urgencyScore = runwayMonths > 0 && runwayMonths < 3 ? 95 : 85;` |
| `src/core/runtime/executive-prioritization/ExecutivePriorityRankingEngine.ts` | **effortScore** | 71 | `const effortScore = 40;` |
| `src/core/runtime/executive-prioritization/ExecutivePriorityRankingEngine.ts` | **impactScore** | 101 | `const impactScore = 92;` |
| `src/core/runtime/executive-prioritization/ExecutivePriorityRankingEngine.ts` | **urgencyScore** | 102 | `const urgencyScore = 85;` |
| `src/core/runtime/executive-prioritization/ExecutivePriorityRankingEngine.ts` | **effortScore** | 103 | `const effortScore = 30;` |
| `src/core/runtime/executive-prioritization/ExecutivePriorityRankingEngine.ts` | **impactScore** | 133 | `const impactScore = 85;` |
| `src/core/runtime/executive-prioritization/ExecutivePriorityRankingEngine.ts` | **urgencyScore** | 134 | `const urgencyScore = 92;` |
| `src/core/runtime/executive-prioritization/ExecutivePriorityRankingEngine.ts` | **effortScore** | 135 | `const effortScore = 20;` |
| `src/core/runtime/executive-prioritization/ExecutivePriorityRankingEngine.ts` | **impactScore** | 165 | `const impactScore = 80;` |
| `src/core/runtime/executive-prioritization/ExecutivePriorityRankingEngine.ts` | **urgencyScore** | 166 | `const urgencyScore = 75;` |
| `src/core/runtime/executive-prioritization/ExecutivePriorityRankingEngine.ts` | **effortScore** | 167 | `const effortScore = 30;` |
| `src/core/runtime/executive-prioritization/ExecutivePriorityRankingEngine.ts` | **impactScore** | 197 | `const impactScore = 70;` |
| `src/core/runtime/executive-prioritization/ExecutivePriorityRankingEngine.ts` | **urgencyScore** | 198 | `const urgencyScore = 80;` |
| `src/core/runtime/executive-prioritization/ExecutivePriorityRankingEngine.ts` | **effortScore** | 199 | `const effortScore = 25;` |
| `src/core/runtime/executive-prioritization/ExecutivePriorityRankingEngine.ts` | **impactScore** | 229 | `const impactScore = 40;` |
| `src/core/runtime/executive-prioritization/ExecutivePriorityRankingEngine.ts` | **urgencyScore** | 230 | `const urgencyScore = 30;` |
| `src/core/runtime/executive-prioritization/ExecutivePriorityRankingEngine.ts` | **effortScore** | 231 | `const effortScore = 15;` |
| `src/core/runtime/executive-prioritization/InstitutionalPriorityMatrixEngine.ts` | **generate** | 11 | `public static generate(report: any): PriorityMatrixRow[] {` |
| `src/core/runtime/executive-timeline/ExecutiveTimelineEngine.ts` | **compositeScore** | 27 | `const compositeScore = Number(` |
| `src/core/runtime/executive-timeline/ExecutiveTimelineEngine.ts` | **generate** | 129 | `public static generate(rawData: any, currentReport: any): ExecutiveTimelineOutpu` |
| `src/core/runtime/executive-timeline/ExecutiveTimelineEngine.ts` | **classify** | 166 | `const trajectoryClassification = TrajectoryClassificationEngine.classify(sortedC` |
| `src/core/runtime/executive-timeline/ExecutiveTimelineEngine.ts` | **evaluate** | 167 | `const accelerationState = TimelineAccelerationEngine.evaluate(sortedCycles);` |
| `src/core/runtime/executive-timeline/ExecutiveTimelineEngine.ts` | **determine** | 168 | `const confidenceLevel = TimelineConfidenceEngine.determine(sortedCycles);` |
| `src/core/runtime/executive-timeline/engines/TimelineAccelerationEngine.ts` | **evaluate** | 6 | `public static evaluate(cycles: HistoricalRuntimeCycle[]): AccelerationState {` |
| `src/core/runtime/executive-timeline/engines/TimelineConfidenceEngine.ts` | **determine** | 6 | `public static determine(cycles: HistoricalRuntimeCycle[]): TimelineConfidence {` |
| `src/core/runtime/executive-timeline/engines/TimelineEventDetectionEngine.ts` | **SCORE_INFLECTION_THRESHOLD** | 11 | `const SCORE_INFLECTION_THRESHOLD = 10;` |
| `src/core/runtime/executive-timeline/engines/TimelineEventDetectionEngine.ts` | **scoreDiff** | 20 | `const scoreDiff = curr.compositeScore - prev.compositeScore;` |
| `src/core/runtime/executive-timeline/engines/TimelineEventDetectionEngine.ts` | **prevScore** | 34 | `const prevScore = prev.compositeScore;` |
| `src/core/runtime/executive-timeline/engines/TimelineEventDetectionEngine.ts` | **currScore** | 35 | `const currScore = curr.compositeScore;` |
| `src/core/runtime/executive-timeline/engines/TrajectoryClassificationEngine.ts` | **classify** | 6 | `public static classify(cycles: HistoricalRuntimeCycle[]): TrajectoryClassificati` |
| `src/core/runtime/executive-timeline/engines/TrajectoryClassificationEngine.ts` | **scores** | 16 | `const scores = cycles.map(c => c.compositeScore);` |
| `src/core/runtime/executive-timeline/engines/TrajectoryClassificationEngine.ts` | **latestScore** | 19 | `const latestScore = scores[n - 1];` |
| `src/core/runtime/executive-timeline/engines/TrajectoryClassificationEngine.ts` | **prevScore** | 20 | `const prevScore = scores[n - 2];` |
| `src/core/runtime/executive-timeline/engines/TrajectoryClassificationEngine.ts` | **firstScore** | 21 | `const firstScore = scores[0];` |
| `src/core/runtime/executive-timeline/engines/TrajectoryClassificationEngine.ts` | **maxScore** | 37 | `const maxScore = Math.max(...scores);` |
| `src/core/runtime/executive-timeline/engines/TrajectoryClassificationEngine.ts` | **minScore** | 38 | `const minScore = Math.min(...scores);` |
| `src/core/runtime/financial-context/FinancialRuntimeContextAdapter.ts` | **build** | 36 | `lifecycle = LifecycleContextBuilder.build(lifecycleParams);` |
| `src/core/runtime/governance/GovernanceJourneyAdapter.ts` | **buildGovernanceJourneyContext** | 11 | `export function buildGovernanceJourneyContext(` |
| `src/core/runtime/governance/InstitutionalReadinessAssessment.ts` | **calculateInstitutionalReadiness** | 17 | `export function calculateInstitutionalReadiness(input: InstitutionalReadinessAss` |
| `src/core/runtime/governance/RoadmapPrioritizationEngine.ts` | **generateInstitutionalRoadmap** | 40 | `export function generateInstitutionalRoadmap(input: RoadmapPrioritizationInput):` |
| `src/core/runtime/governance/RoadmapPrioritizationEngine.ts` | **scoredActions** | 49 | `const scoredActions = applicableActions.map(rec => {` |
| `src/core/runtime/governance/RoadmapPrioritizationEngine.ts` | **priorityScore** | 54 | `const priorityScore = (impactVal / effortVal) * 10;` |
| `src/core/runtime/governance/bp/BalanceSheetExecutiveNarrativeEngine.ts` | **generate** | 4 | `static generate(indicators: any[], summary: any, exerciseYear: number, summaryHa` |
| `src/core/runtime/governance/bp/BalanceSheetExecutiveRecommendationEngine.ts` | **generatePrimary** | 5 | `public static generatePrimary(` |
| `src/core/runtime/governance/bp/BalanceSheetExecutiveRecommendationEngine.ts` | **generateSecondary** | 48 | `public static generateSecondary(` |
| `src/core/runtime/governance/bp/BalanceSheetFiduciaryConsistencyEngine.ts` | **score** | 12 | `let score = 100;` |
| `src/core/runtime/governance/bp/BalanceSheetFinancialMetricsEngine.ts` | **generateHash** | 17 | `function generateHash(seed: string) {` |
| `src/core/runtime/governance/bp/BalanceSheetFinancialMetricsEngine.ts` | **calculateIndicators** | 27 | `static calculateIndicators(summary: BPSummary): PatrimonialIndicator[] {` |
| `src/core/runtime/governance/bp/BalanceSheetFinancialMetricsEngine.ts` | **generateHash** | 51 | `lineageHash: generateHash(`${metricName}-${val}`),` |
| `src/core/runtime/governance/bp/BalanceSheetFinancialMetricsEngine.ts` | **generateHash** | 75 | `lineageHash: generateHash(`${metricName}-${val}`),` |
| `src/core/runtime/governance/bp/BalanceSheetFinancialMetricsEngine.ts` | **generateHash** | 99 | `lineageHash: generateHash(`${metricName}-${val}`),` |
| `src/core/runtime/governance/bp/BalanceSheetFinancialMetricsEngine.ts` | **generateHash** | 131 | `lineageHash: generateHash(`${metricName}-${val}`),` |
| `src/core/runtime/governance/bp/BalanceSheetFinancialMetricsEngine.ts` | **generateHash** | 156 | `lineageHash: generateHash(`${metricName}-${val}`),` |
| `src/core/runtime/governance/bp/BalanceSheetFinancialMetricsEngine.ts` | **generateHash** | 180 | `lineageHash: generateHash(`${metricName}-${val}`),` |
| `src/core/runtime/governance/bp/BalanceSheetFinancialMetricsEngine.ts` | **generateHash** | 206 | `lineageHash: generateHash(`${metricName}-${val}`),` |
| `src/core/runtime/governance/bp/BalanceSheetFinancialMetricsEngine.ts` | **generateHash** | 231 | `lineageHash: generateHash(`${metricName}-${val}`),` |
| `src/core/runtime/governance/bp/BalanceSheetFinancialMetricsEngine.ts` | **generateHash** | 255 | `lineageHash: generateHash(`${metricName}-${val}`),` |
| `src/core/runtime/governance/bp/BalanceSheetFinancialMetricsEngine.ts` | **calculate** | 268 | `const dte = DebtToEquityEngine.calculate(summary);` |
| `src/core/runtime/governance/bp/BalanceSheetFinancialMetricsEngine.ts` | **generateHash** | 277 | `lineageHash: generateHash(`DTE-${dte.value}`),` |
| `src/core/runtime/governance/bp/BalanceSheetFinancialMetricsEngine.ts` | **generateHash** | 298 | `lineageHash: generateHash(`${metricName}-${val}`),` |
| `src/core/runtime/governance/bp/BalanceSheetFinancialMetricsEngine.ts` | **generateHash** | 326 | `lineageHash: generateHash(`${metricName}-${val}`),` |
| `src/core/runtime/governance/bp/BalanceSheetFinancialMetricsEngine.ts` | **generateHash** | 351 | `lineageHash: generateHash(`${metricName}-${val}`),` |
| `src/core/runtime/governance/bp/BalanceSheetFinancialMetricsEngine.ts` | **generateHash** | 376 | `lineageHash: generateHash(`${metricName}-NA`),` |
| `src/core/runtime/governance/bp/BalanceSheetFinancialMetricsEngine.ts` | **generateHash** | 391 | `lineageHash: generateHash(`FinDebtToEquity-${val}`),` |
| `src/core/runtime/governance/bp/BalanceSheetLongitudinalConsistencyEngine.ts` | **evaluate** | 18 | `public static evaluate(` |
| `src/core/runtime/governance/bp/BalanceSheetLongitudinalConsistencyEngine.ts` | **consistencyScore** | 40 | `let consistencyScore = 100;` |
| `src/core/runtime/governance/bp/BalanceSheetLongitudinalNarrativeGenerator.ts` | **generate** | 5 | `public static generate(` |
| `src/core/runtime/governance/bp/BalanceSheetPatrimonialIntelligenceEngine.ts` | **generate** | 5 | `static generate(bpSummary: BPSummary | undefined, indicators: PatrimonialIndicat` |
| `src/core/runtime/governance/bp/BalanceSheetQualityEngine.ts` | **analyze** | 6 | `static analyze(summary: BPSummary): PatrimonialIndicator[] {` |
| `src/core/runtime/governance/bp/BalanceSheetQualityEngine.ts` | **cashAssessment** | 28 | `const cashAssessment = CashConcentrationAssessmentEngine.assess(summary);` |
| `src/core/runtime/governance/bp/BalanceSheetRootCauseAnalyzer.ts` | **analyze** | 6 | `public static analyze(` |
| `src/core/runtime/governance/bp/BalanceSheetSummaryLineageAudit.ts` | **generateLineage** | 9 | `static generateLineage(bpSummary: any, exerciseYear: number, rawData: any): Summ` |
| `src/core/runtime/governance/bp/BoardPatrimonialAdvisoryEngine.ts` | **generate** | 21 | `public static generate(` |
| `src/core/runtime/governance/bp/CapitalRecoveryIndexEngine.ts` | **evaluate** | 5 | `public static evaluate(summary: BPSummary): PatrimonialIndicator | null {` |
| `src/core/runtime/governance/bp/CapitalStructureIntelligenceEngine.ts` | **analyze** | 5 | `static analyze(` |
| `src/core/runtime/governance/bp/CapitalStructureIntelligenceEngine.ts` | **debtCapacityScore** | 64 | `let debtCapacityScore = 100;` |
| `src/core/runtime/governance/bp/CapitalStructureIntelligenceEngine.ts` | **debtCapacityScore** | 78 | `if (debtCapacityScore < 0) debtCapacityScore = 0;` |
| `src/core/runtime/governance/bp/CashConcentrationAssessmentEngine.ts` | **assess** | 4 | `static assess(summary: BPSummary) {` |
| `src/core/runtime/governance/bp/DebtToEquityEngine.ts` | **calculate** | 5 | `static calculate(summary: BPSummary) {` |
| `src/core/runtime/governance/bp/DebtToEquityEngine.ts` | **score** | 32 | `let score = 100;` |
| `src/core/runtime/governance/bp/DebtToEquityEngine.ts` | **score** | 36 | `score = 20;` |
| `src/core/runtime/governance/bp/DebtToEquityEngine.ts` | **score** | 39 | `score = 60;` |
| `src/core/runtime/governance/bp/EquityQualityEngine.ts` | **evaluate** | 8 | `static evaluate(summary: BPSummary): {` |
| `src/core/runtime/governance/bp/HistoricalTrendExplainabilityEngine.ts` | **generateExplainability** | 5 | `public static generateExplainability(` |
| `src/core/runtime/governance/bp/InstitutionalPatrimonialClassificationEngine.ts` | **classify** | 13 | `public static classify(score: number | null): PatrimonialClassificationOutput {` |
| `src/core/runtime/governance/bp/InstitutionalPatrimonialClassificationEngine.ts` | **score** | 14 | `if (score === null) {` |
| `src/core/runtime/governance/bp/InventoryDependencyEngine.ts` | **evaluate** | 8 | `public static evaluate(` |
| `src/core/runtime/governance/bp/LiquidityRealityEngine.ts` | **evaluate** | 12 | `static evaluate(` |
| `src/core/runtime/governance/bp/PatrimonialClassificationCeilingEngine.ts` | **evaluate** | 15 | `public static evaluate(` |
| `src/core/runtime/governance/bp/PatrimonialExecutiveInterpretationEngine.ts` | **generateInterpretations** | 21 | `public static generateInterpretations(` |
| `src/core/runtime/governance/bp/PatrimonialExecutiveInterpretationEngine.ts` | **score** | 30 | `const score = breakdown.globalScore ?? 0;` |
| `src/core/runtime/governance/bp/PatrimonialGovernanceConsistencyEngine.ts` | **evaluate** | 30 | `public static evaluate(inputs: ConsistencyEngineInputs): PatrimonialGovernanceCo` |
| `src/core/runtime/governance/bp/PatrimonialGovernanceConsistencyEngine.ts` | **score** | 56 | `const score = scoreBreakdown.globalScore;` |
| `src/core/runtime/governance/bp/PatrimonialGovernanceConsistencyEngine.ts` | **confidenceScore** | 183 | `let confidenceScore = 100;` |
| `src/core/runtime/governance/bp/PatrimonialGovernanceConsistencyEngine.ts` | **confidenceScore** | 188 | `confidenceScore = Math.min(confidenceScore, 60); // As instructed, block at 60` |
| `src/core/runtime/governance/bp/PatrimonialGovernanceConsistencyEngine.ts` | **confidenceScore** | 192 | `confidenceScore = 75;` |
| `src/core/runtime/governance/bp/PatrimonialGovernanceConsistencyEngine.ts` | **confidenceScore** | 196 | `confidenceScore = 90;` |
| `src/core/runtime/governance/bp/PatrimonialPreservationEngine.ts` | **analyze** | 27 | `static analyze(summary: BPSummary, dreData: any[]): PatrimonialIndicator[] {` |
| `src/core/runtime/governance/bp/PatrimonialScoreExplainabilityEngine.ts` | **mapSeverityToScore** | 24 | `private static mapSeverityToScore(severity: string): number {` |
| `src/core/runtime/governance/bp/PatrimonialScoreExplainabilityEngine.ts` | **calculateFamilyScore** | 37 | `private static calculateFamilyScore(indicators: PatrimonialIndicator[], family: ` |
| `src/core/runtime/governance/bp/PatrimonialScoreExplainabilityEngine.ts` | **mapSeverityToScore** | 41 | `const total = familyInds.reduce((sum, ind) => sum + this.mapSeverityToScore(ind.` |
| `src/core/runtime/governance/bp/PatrimonialScoreExplainabilityEngine.ts` | **calculateScore** | 45 | `public static calculateScore(indicators: PatrimonialIndicator[]): PatrimonialSco` |
| `src/core/runtime/governance/bp/PatrimonialScoreExplainabilityEngine.ts` | **calculateFamilyScore** | 46 | `const liquidityScore = this.calculateFamilyScore(indicators, 'Liquidez');` |
| `src/core/runtime/governance/bp/PatrimonialScoreExplainabilityEngine.ts` | **calculateFamilyScore** | 47 | `const workingCapitalScore = this.calculateFamilyScore(indicators, 'Capital de Gi` |
| `src/core/runtime/governance/bp/PatrimonialScoreExplainabilityEngine.ts` | **calculateFamilyScore** | 48 | `const capitalStructureScore = this.calculateFamilyScore(indicators, 'Estrutura d` |
| `src/core/runtime/governance/bp/PatrimonialScoreExplainabilityEngine.ts` | **calculateFamilyScore** | 49 | `const assetImmobilizationScore = this.calculateFamilyScore(indicators, 'Imobiliz` |
| `src/core/runtime/governance/bp/PatrimonialScoreExplainabilityEngine.ts` | **globalScore** | 51 | `let globalScore = null;` |
| `src/core/runtime/governance/bp/PatrimonialScoreExplainabilityEngine.ts` | **scoreSum** | 53 | `let scoreSum = 0;` |
| `src/core/runtime/governance/bp/PatrimonialScoreExplainabilityEngine.ts` | **globalScore** | 61 | `globalScore = Math.round(scoreSum / effectiveWeight);` |
| `src/core/runtime/governance/bp/PatrimonialTrendEngine.ts` | **analyzeTrend** | 32 | `public static analyzeTrend(history: { year: number; summary: BPSummary }[]): Pat` |
| `src/core/runtime/governance/bp/PatrimonialTrendEngine.ts` | **calculatedYears** | 46 | `const calculatedYears = sortedHistory.map(h => ({` |
| `src/core/runtime/governance/bp/PatrimonialTrendEngine.ts` | **calculateIndicators** | 48 | `indicators: BalanceSheetFinancialMetricsEngine.calculateIndicators(h.summary)` |
| `src/core/runtime/governance/bp/WorkingCapitalIntelligenceEngine.ts` | **analyze** | 6 | `static analyze(summary: BPSummary, dreData: any[]): PatrimonialIndicator[] {` |
| `src/core/runtime/governance/cross-statement/CrossStatementReconciliationEngine.test.ts` | **evaluate** | 23 | `const report = CrossStatementReconciliationEngine.evaluate(baseIntegrityParams);` |
| `src/core/runtime/governance/cross-statement/CrossStatementReconciliationEngine.test.ts` | **evaluate** | 31 | `const report = CrossStatementReconciliationEngine.evaluate(params);` |
| `src/core/runtime/governance/cross-statement/CrossStatementReconciliationEngine.test.ts` | **evaluate** | 39 | `const report = CrossStatementReconciliationEngine.evaluate(params);` |
| `src/core/runtime/governance/cross-statement/CrossStatementReconciliationEngine.test.ts` | **evaluate** | 47 | `const report = CrossStatementReconciliationEngine.evaluate(params);` |
| `src/core/runtime/governance/cross-statement/CrossStatementReconciliationEngine.test.ts` | **evaluate** | 54 | `const report = CrossStatementReconciliationEngine.evaluate(params);` |
| `src/core/runtime/governance/cross-statement/CrossStatementReconciliationEngine.test.ts` | **evaluate** | 61 | `const report = CrossStatementReconciliationEngine.evaluate(params);` |
| `src/core/runtime/governance/cross-statement/CrossStatementReconciliationEngine.test.ts` | **evaluate** | 73 | `const report = CrossStatementReconciliationEngine.evaluate(params);` |
| `src/core/runtime/governance/cross-statement/CrossStatementReconciliationEngine.test.ts` | **evaluate** | 80 | `const report = CrossStatementReconciliationEngine.evaluate(params);` |
| `src/core/runtime/governance/cross-statement/CrossStatementReconciliationEngine.test.ts` | **evaluate** | 92 | `const report = CrossStatementReconciliationEngine.evaluate(params);` |
| `src/core/runtime/governance/cross-statement/CrossStatementReconciliationEngine.test.ts` | **evaluate** | 98 | `const report = CrossStatementReconciliationEngine.evaluate(params);` |
| `src/core/runtime/governance/cross-statement/CrossStatementReconciliationEngine.test.ts` | **evaluate** | 112 | `const report = CrossStatementReconciliationEngine.evaluate(params);` |
| `src/core/runtime/governance/cross-statement/CrossStatementReconciliationEngine.ts` | **evaluate** | 81 | `public static evaluate(params: ReconciliationEngineParams): CrossStatementReconc` |
| `src/core/runtime/governance/dfc/DFCCashBPDivergenceAudit.ts` | **evaluate** | 4 | `static evaluate(` |
| `src/core/runtime/governance/dfc/DFCCashFlowExplainabilityEngine.ts` | **evaluate** | 11 | `static evaluate(` |
| `src/core/runtime/governance/dfc/DFCCashFlowIntegrityGuard.ts` | **calculatedVariation** | 20 | `const calculatedVariation = fco + fci + fcf;` |
| `src/core/runtime/governance/dfc/DFCCausalChainEngine.ts` | **evaluate** | 2 | `static evaluate(` |
| `src/core/runtime/governance/dfc/DFCGovernanceOrchestrator.ts` | **buildBlockedOutput** | 30 | `return this.buildBlockedOutput(exerciseYear, fco, fci, fcf, netVariation, accoun` |
| `src/core/runtime/governance/dfc/DFCGovernanceOrchestrator.ts` | **evaluate** | 34 | `const divergence = DFCCashBPDivergenceAudit.evaluate(accountingProfit, fco, cash` |
| `src/core/runtime/governance/dfc/DFCGovernanceOrchestrator.ts` | **buildBlockedOutput** | 36 | `return this.buildBlockedOutput(exerciseYear, fco, fci, fcf, netVariation, accoun` |
| `src/core/runtime/governance/dfc/DFCGovernanceOrchestrator.ts` | **evaluate** | 40 | `const dependency = DFCShareholderDependencyEngine.evaluate(fco, shareholderContr` |
| `src/core/runtime/governance/dfc/DFCGovernanceOrchestrator.ts` | **evaluate** | 43 | `const narrative = DFCNarrativeConsistencyAudit.evaluate(fco, dependency, diverge` |
| `src/core/runtime/governance/dfc/DFCGovernanceOrchestrator.ts` | **evaluate** | 46 | `const causal = DFCCausalChainEngine.evaluate(accountingProfit, fco, shareholderC` |
| `src/core/runtime/governance/dfc/DFCGovernanceOrchestrator.ts` | **buildBlockedOutput** | 48 | `return this.buildBlockedOutput(exerciseYear, fco, fci, fcf, netVariation, accoun` |
| `src/core/runtime/governance/dfc/DFCGovernanceOrchestrator.ts` | **evaluate** | 52 | `const explainability = DFCCashFlowExplainabilityEngine.evaluate(fco, fci, fcf, d` |
| `src/core/runtime/governance/dfc/DFCGovernanceOrchestrator.ts` | **evaluate** | 55 | `const recAudit = DFCRecommendationConsistencyAudit.evaluate(fco, dependency, nar` |
| `src/core/runtime/governance/dfc/DFCGovernanceOrchestrator.ts` | **buildBlockedOutput** | 57 | `return this.buildBlockedOutput(exerciseYear, fco, fci, fcf, netVariation, accoun` |
| `src/core/runtime/governance/dfc/DFCGovernanceOrchestrator.ts` | **buildBlockedOutput** | 107 | `private static buildBlockedOutput(` |
| `src/core/runtime/governance/dfc/DFCNarrativeConsistencyAudit.ts` | **evaluate** | 4 | `static evaluate(` |
| `src/core/runtime/governance/dfc/DFCNarrativeConsistencyAudit.ts` | **recommendation** | 11 | `let recommendation = '';` |
| `src/core/runtime/governance/dfc/DFCNarrativeConsistencyAudit.ts` | **recommendation** | 16 | `recommendation = `Preservar a eficiência do capital de giro e direcionar o exced` |
| `src/core/runtime/governance/dfc/DFCNarrativeConsistencyAudit.ts` | **recommendation** | 21 | `recommendation = `Congelar qualquer expansão estrutural que exija consumo adicio` |
| `src/core/runtime/governance/dfc/DFCNarrativeConsistencyAudit.ts` | **recommendation** | 26 | `recommendation = `Mapear e neutralizar os gargalos de capital de giro (contas a ` |
| `src/core/runtime/governance/dfc/DFCNarrativeConsistencyAudit.ts` | **recommendation** | 31 | `recommendation = `Monitorar as linhas de variação de capital de giro para garant` |
| `src/core/runtime/governance/dfc/DFCRecommendationConsistencyAudit.ts` | **evaluate** | 4 | `static evaluate(` |
| `src/core/runtime/governance/dfc/DFCRuntimeUIReconciliationAudit.ts` | **evaluate** | 4 | `static evaluate(` |
| `src/core/runtime/governance/dfc/DFCSSOTAuthorityGuard.ts` | **buildUnauthorizedFallback** | 15 | `return this.buildUnauthorizedFallback('UNAUTHORIZED_DFC_OUTPUT_SOURCE: Tentativa` |
| `src/core/runtime/governance/dfc/DFCSSOTAuthorityGuard.ts` | **buildUnauthorizedFallback** | 19 | `return this.buildUnauthorizedFallback('UNAUTHORIZED_DFC_OUTPUT_SOURCE: Payload n` |
| `src/core/runtime/governance/dfc/DFCSSOTAuthorityGuard.ts` | **buildUnauthorizedFallback** | 26 | `private static buildUnauthorizedFallback(reason: string): CashFlowGovernanceOutp` |
| `src/core/runtime/governance/dfc/DFCShareholderDependencyEngine.ts` | **evaluate** | 4 | `static evaluate(` |
| `src/core/runtime/governance/dlpa/CapitalErosionRiskEngine.ts` | **evaluate** | 2 | `static evaluate(accumulatedLosses: number, capitalSocial: number) {` |
| `src/core/runtime/governance/dlpa/CapitalPreservationScoreEngine.ts` | **evaluate** | 2 | `static evaluate(` |
| `src/core/runtime/governance/dlpa/CapitalPreservationScoreEngine.ts` | **remanescenteScore** | 29 | `const remanescenteScore = Math.max(0, Math.min(100, preservationRatio * 100));` |
| `src/core/runtime/governance/dlpa/CapitalPreservationScoreEngine.ts` | **dependencyScore** | 32 | `let dependencyScore = 0;` |
| `src/core/runtime/governance/dlpa/CapitalPreservationScoreEngine.ts` | **dependencyScore** | 34 | `dependencyScore = 0;` |
| `src/core/runtime/governance/dlpa/CapitalPreservationScoreEngine.ts` | **dependencyScore** | 36 | `dependencyScore = 100;` |
| `src/core/runtime/governance/dlpa/CapitalPreservationScoreEngine.ts` | **dependencyScore** | 38 | `dependencyScore = 70;` |
| `src/core/runtime/governance/dlpa/CapitalPreservationScoreEngine.ts` | **dependencyScore** | 40 | `dependencyScore = 40;` |
| `src/core/runtime/governance/dlpa/CapitalPreservationScoreEngine.ts` | **dependencyScore** | 42 | `dependencyScore = 20;` |
| `src/core/runtime/governance/dlpa/CapitalPreservationScoreEngine.ts` | **distributionScore** | 46 | `let distributionScore = 25;` |
| `src/core/runtime/governance/dlpa/CapitalPreservationScoreEngine.ts` | **distributionScore** | 48 | `distributionScore = 100;` |
| `src/core/runtime/governance/dlpa/CapitalPreservationScoreEngine.ts` | **distributionScore** | 50 | `distributionScore = 75;` |
| `src/core/runtime/governance/dlpa/CapitalPreservationScoreEngine.ts` | **distributionScore** | 52 | `distributionScore = 50;` |
| `src/core/runtime/governance/dlpa/CapitalPreservationScoreEngine.ts` | **distributionScore** | 54 | `distributionScore = 25;` |
| `src/core/runtime/governance/dlpa/CapitalPreservationScoreEngine.ts` | **horizonScore** | 58 | `let horizonScore = 50;` |
| `src/core/runtime/governance/dlpa/CapitalPreservationScoreEngine.ts` | **horizonScore** | 62 | `horizonScore = 25;` |
| `src/core/runtime/governance/dlpa/CapitalPreservationScoreEngine.ts` | **horizonScore** | 64 | `horizonScore = 100;` |
| `src/core/runtime/governance/dlpa/CapitalPreservationScoreEngine.ts` | **horizonScore** | 66 | `horizonScore = 90;` |
| `src/core/runtime/governance/dlpa/CapitalPreservationScoreEngine.ts` | **horizonScore** | 68 | `horizonScore = 70;` |
| `src/core/runtime/governance/dlpa/CapitalPreservationScoreEngine.ts` | **horizonScore** | 70 | `horizonScore = 40;` |
| `src/core/runtime/governance/dlpa/CapitalPreservationScoreEngine.ts` | **horizonScore** | 72 | `horizonScore = 15;` |
| `src/core/runtime/governance/dlpa/CapitalPreservationScoreEngine.ts` | **score** | 76 | `let score = Math.round(` |
| `src/core/runtime/governance/dlpa/CapitalPreservationScoreEngine.ts` | **score** | 85 | `score = Math.min(20, score);` |
| `src/core/runtime/governance/dlpa/CapitalPreservationStatusEngine.ts` | **evaluate** | 2 | `static evaluate(endingEquity: number, capitalSocial: number) {` |
| `src/core/runtime/governance/dlpa/CapitalRecoverabilityEngine.ts` | **evaluate** | 2 | `static evaluate(endingEquity: number, recoveryHorizonInput: any) {` |
| `src/core/runtime/governance/dlpa/CapitalRecoveryEngine.ts` | **evaluate** | 2 | `static evaluate(endingEquity: number, capitalSocial: number) {` |
| `src/core/runtime/governance/dlpa/CapitalRecoveryRequirementEngine.ts` | **evaluate** | 2 | `static evaluate(accumulatedLosses: number, capitalSocial: number) {` |
| `src/core/runtime/governance/dlpa/CapitalRetentionClassificationEngine.ts` | **classify** | 18 | `public static classify(params: {` |
| `src/core/runtime/governance/dlpa/DLPABoardAdvisoryEngine.ts` | **evaluate** | 2 | `static evaluate(` |
| `src/core/runtime/governance/dlpa/DLPABoardDecisionSupportEngine.ts` | **evaluate** | 2 | `static evaluate(` |
| `src/core/runtime/governance/dlpa/DLPACanonicalPayloadEnforcer.ts` | **expectedScore** | 27 | `const expectedScore = Math.round(` |
| `src/core/runtime/governance/dlpa/DLPACanonicalScoreResolver.ts` | **score** | 8 | `const score = capitalPreservationScore?.score ?? capitalPreservationScore?.value` |
| `src/core/runtime/governance/dlpa/DLPACapitalConsumptionEngine.ts` | **evaluate** | 2 | `static evaluate(accumulatedLosses: number, capitalSocial: number) {` |
| `src/core/runtime/governance/dlpa/DLPAConsistencyAuditEngine.ts` | **hasCpsHorizonScoreOf25** | 36 | `const hasCpsHorizonScoreOf25 = cps.components?.horizonScore === 25;` |
| `src/core/runtime/governance/dlpa/DLPADistributionCapacityEngine.ts` | **evaluate** | 2 | `static evaluate(netIncome: number, accumulatedLosses: number) {` |
| `src/core/runtime/governance/dlpa/DLPAEquityFormationQualityEngine.ts` | **evaluate** | 2 | `static evaluate(dependencyValue: number, hasLosses: boolean) {` |
| `src/core/runtime/governance/dlpa/DLPAFiduciaryInterpretationEngine.ts` | **evaluate** | 40 | `public static evaluate(params: {` |
| `src/core/runtime/governance/dlpa/DLPAFiduciaryInterpretationEngine.ts` | **evaluate** | 100 | `const integrityReport = PatrimonialIntegrityEngine.evaluate({` |
| `src/core/runtime/governance/dlpa/DLPAFiduciaryInterpretationEngine.ts` | **evaluate** | 113 | `const distributionEligibility = DistributionEligibilityEngine.evaluate({` |
| `src/core/runtime/governance/dlpa/DLPAFiduciaryInterpretationEngine.ts` | **evaluate** | 129 | `const consistencyReport = DLPAHistoricalConsistencyEngine.evaluate(historicalCyc` |
| `src/core/runtime/governance/dlpa/DLPAFiduciaryInterpretationEngine.ts` | **classify** | 134 | `const retentionClassification = CapitalRetentionClassificationEngine.classify({` |
| `src/core/runtime/governance/dlpa/DLPAGovernanceInterpretationEngine.ts` | **evaluate** | 2 | `static evaluate(capitalDependency: number, formationQuality: string, distributio` |
| `src/core/runtime/governance/dlpa/DLPAGovernanceRadarEngine.ts` | **evaluate** | 2 | `public static evaluate(capitalPreservedPercent: number): string {` |
| `src/core/runtime/governance/dlpa/DLPAGovernanceRadarEngine.ts` | **evaluate** | 26 | `return this.evaluate(capitalPreservedPercent);` |
| `src/core/runtime/governance/dlpa/DLPAHistoricalConsistencyEngine.ts` | **evaluate** | 25 | `public static evaluate(` |
| `src/core/runtime/governance/dlpa/DLPAMetricsEngine.ts` | **evaluate** | 2 | `static evaluate(endingEquity: number, capitalSocial: number) {` |
| `src/core/runtime/governance/dlpa/DLPARetentionEngine.ts` | **evaluate** | 2 | `static evaluate(netIncome: number, retainedEarnings: number, lucrosPrejuizos: nu` |
| `src/core/runtime/governance/dlpa/DLPAShareholderCapitalDependencyEngine.ts` | **evaluate** | 2 | `static evaluate(capitalSocial: number, endingEquity: number) {` |
| `src/core/runtime/governance/dlpa/DistributionEligibilityEngine.ts` | **evaluate** | 15 | `public static evaluate(params: {` |
| `src/core/runtime/governance/dlpa/PatrimonialIntegrityEngine.ts` | **evaluate** | 31 | `public static evaluate(params: {` |
| `src/core/runtime/governance/dlpa/PatrimonialRecoveryHorizonEngine.ts` | **evaluate** | 12 | `static evaluate(` |
| `src/core/runtime/governance/dlpa/ShareholderDependencyNarrativeEngine.ts` | **evaluate** | 2 | `static evaluate(capitalSocial: number, endingEquity: number) {` |
| `src/core/runtime/governance/dre/EBITDARootCauseEngine.ts` | **evaluate** | 13 | `static evaluate(` |
| `src/core/runtime/governance/dre/EarningsCompositionEngine.ts` | **evaluate** | 11 | `static evaluate(` |
| `src/core/runtime/governance/dre/EconomicValueIntelligenceEngine.ts` | **evaluate** | 12 | `static evaluate(` |
| `src/core/runtime/governance/dre/ExecutiveEconomicQualityEngine.ts` | **evaluate** | 10 | `static evaluate(` |
| `src/core/runtime/governance/dre/ManagementDiscussionAnalysisEngine.ts` | **evaluate** | 14 | `static evaluate(` |
| `src/core/runtime/governance/fiduciary/ConflictOfInterestEngine.ts` | **evaluateDecisionConflicts** | 33 | `public evaluateDecisionConflicts(` |
| `src/core/runtime/governance/fiduciary/ConflictOfInterestEngine.ts` | **severityScore** | 42 | `let severityScore = 0; // 0 a 100` |
| `src/core/runtime/governance/fiduciary/DecisionFiduciaryValidator.ts` | **evaluateGate** | 17 | `public evaluateGate(` |
| `src/core/runtime/governance/fiduciary/DecisionFiduciaryValidator.ts` | **evaluateDecisionConflicts** | 25 | `const conflictEval = conflictOfInterestEngine.evaluateDecisionConflicts(tenantId` |
| `src/core/runtime/governance/fiduciary/DecisionFiduciaryValidator.ts` | **confidenceScore** | 52 | `let confidenceScore = 100 - conflictEval.severityScore;` |
| `src/core/runtime/governance/fiduciary/DecisionFiduciaryValidator.ts` | **confidenceScore** | 55 | `confidenceScore = Math.max(0, confidenceScore);` |
| `src/core/runtime/governance/fiduciary-enforcement/GlobalFiduciaryDistributionEnforcementEngine.ts` | **evaluate** | 23 | `public static evaluate(` |
| `src/core/runtime/governance/risk/EnterpriseRiskEngine.ts` | **calculateEffectiveness** | 25 | `? riskMitigationRegistry.calculateEffectiveness(risk.mitigationPlan.planId)` |
| `src/core/runtime/governance/risk/EnterpriseRiskEngine.ts` | **evaluateRisk** | 28 | `const evaluation = riskMatrixEngine.evaluateRisk({` |
| `src/core/runtime/governance/risk/EnterpriseRiskEngine.ts` | **generateHeatmap** | 74 | `public generateHeatmap(tenantId: string): RiskHeatmap {` |
| `src/core/runtime/governance/risk/RiskMatrixEngine.ts` | **evaluateRisk** | 8 | `public evaluateRisk(input: RiskMatrixInput): RiskMatrixOutput {` |
| `src/core/runtime/governance/risk/RiskMatrixEngine.ts` | **inherentRiskScore** | 10 | `const inherentRiskScore = input.impact * input.probability;` |
| `src/core/runtime/governance/risk/RiskMatrixEngine.ts` | **residualRiskScore** | 17 | `const residualRiskScore = Math.max(1, Math.round(residualRiskRaw));` |
| `src/core/runtime/governance/risk/RiskMatrixEngine.ts` | **determineCriticality** | 22 | `criticalityLevel: this.determineCriticality(residualRiskScore),` |
| `src/core/runtime/governance/risk/RiskMatrixEngine.ts` | **getRecommendedAction** | 23 | `recommendedAction: this.getRecommendedAction(residualRiskScore)` |
| `src/core/runtime/governance/risk/RiskMatrixEngine.ts` | **determineCriticality** | 27 | `private determineCriticality(score: number): 'Baixa' | 'Média' | 'Alta' | 'Críti` |
| `src/core/runtime/governance/risk/RiskMatrixEngine.ts` | **getRecommendedAction** | 34 | `private getRecommendedAction(score: number): string {` |
| `src/core/runtime/governance/risk/RiskMitigationRegistry.ts` | **calculateEffectiveness** | 50 | `public calculateEffectiveness(planId: string): number {` |
| `src/core/runtime/governance-command-center/GovernanceIncidentOrchestrator.ts` | **deriveStatus** | 14 | `public static deriveStatus(` |
| `src/core/runtime/governance-command-center/GovernanceIncidentOrchestrator.ts` | **deriveStatus** | 86 | `currentStatus: this.deriveStatus(incident, events)` |
| `src/core/runtime/governance-command-center/RuntimeHealthMonitoringEngine.ts` | **evaluateHealth** | 8 | `public static evaluateHealth(params: {` |
| `src/core/runtime/governance-copilot/executive-conversation-adapter.ts` | **buildExecutiveConversation** | 30 | `const executiveConversation = ExecutiveConversationEngine.buildExecutiveConversa` |
| `src/core/runtime/governance-copilot/governance-copilot-adapter.ts` | **buildContext** | 14 | `const governanceCopilotContext = GovernanceCopilotContextEngine.buildContext(gov` |
| `src/core/runtime/governance-copilot/governance-copilot-reasoning-adapter.ts` | **buildGovernanceCopilotReasoning** | 25 | `const governanceCopilotReasoning = GovernanceCopilotReasoningEngine.buildGoverna` |
| `src/core/runtime/governance-orchestration/InstitutionalOrchestrationEngine.ts` | **recommendation** | 24 | `const recommendation = GovernancePlaybookOrchestrator.emit(tenantId, playbook, e` |
| `src/core/runtime/governance-orchestration/InstitutionalOrchestrationEngine.ts` | **simulateExecution** | 44 | `const projection = PlaybookExecutionSimulator.simulateExecution(playbookId);` |
| `src/core/runtime/governance-orchestration/PlaybookExecutionSimulator.ts` | **simulateExecution** | 4 | `static simulateExecution(playbookId: string): PlaybookExecutionProjection {` |
| `src/core/runtime/institutional-causality/CausalConfidenceEngine.ts` | **evaluate** | 5 | `public static evaluate(cycles: HistoricalCycleData[]): CausalConfidenceProfile {` |
| `src/core/runtime/institutional-causality/CausalLineageIntegrityEngine.ts` | **generateHashes** | 6 | `public static generateHashes(` |
| `src/core/runtime/institutional-causality/GovernanceImpactChainEngine.ts` | **build** | 6 | `public static build(` |
| `src/core/runtime/institutional-causality/InstitutionalCausalityOrchestrator.ts` | **evaluate** | 20 | `public static evaluate(runtimeHistory: HistoricalCycleData[]): InstitutionalCaus` |
| `src/core/runtime/institutional-causality/InstitutionalCausalityOrchestrator.ts` | **evaluate** | 47 | `const confidenceProfile = CausalConfidenceEngine.evaluate(sortedCycles);` |
| `src/core/runtime/institutional-causality/InstitutionalCausalityOrchestrator.ts` | **build** | 51 | `const impactChains = GovernanceImpactChainEngine.build(sortedCycles, propagation` |
| `src/core/runtime/institutional-causality/InstitutionalCausalityOrchestrator.ts` | **build** | 60 | `const graph = InstitutionalGraphBuilder.build(sortedCycles, metrics, sequences, ` |
| `src/core/runtime/institutional-causality/InstitutionalCausalityOrchestrator.ts` | **generateHashes** | 61 | `const hashes = CausalLineageIntegrityEngine.generateHashes(sortedCycles, sequenc` |
| `src/core/runtime/institutional-causality/InstitutionalGraphBuilder.ts` | **build** | 12 | `public static build(` |
| `src/core/runtime/institutional-causality/LongitudinalRiskEngine.ts` | **scoreDecreasing** | 70 | `let scoreDecreasing = true;` |
| `src/core/runtime/institutional-causality/LongitudinalRiskEngine.ts` | **scoreDecreasing** | 73 | `scoreDecreasing = false;` |
| `src/core/runtime/institutional-causality/types.ts` | **compositeScore** | 200 | `const compositeScore = cycle.scores?.composite ?? 0;` |
| `src/core/runtime/institutional-context/ContextualConfidenceMatrix.ts` | **calculateConfidenceMatrix** | 4 | `export function calculateConfidenceMatrix(profile: InstitutionalBusinessProfile)` |
| `src/core/runtime/institutional-context/ContextualConfidenceMatrix.ts` | **completenessScore** | 5 | `let completenessScore = 0;` |
| `src/core/runtime/institutional-context/InstitutionalContextEngine.ts` | **buildBPHierarchy** | 34 | `const hierarchy = buildBPHierarchy(rawData.bpData);` |
| `src/core/runtime/institutional-context/InstitutionalContextEngine.ts` | **blockedRecommendations** | 83 | `blockedRecommendations = ['Expansão física ou Capex imobiliário', 'Investimento ` |
| `src/core/runtime/institutional-context/InstitutionalContextEngine.ts` | **blockedRecommendations** | 86 | `blockedRecommendations = ['Distribuição de lucros ou dividendos', 'Financiamento` |
| `src/core/runtime/institutional-context/InstitutionalContextEngine.ts` | **blockedRecommendations** | 89 | `blockedRecommendations = ['Redução desmedida do time de vendas', 'Desaceleração ` |
| `src/core/runtime/institutional-context/InstitutionalContextEngine.ts` | **blockedRecommendations** | 92 | `blockedRecommendations = [];` |
| `src/core/runtime/institutional-context/InstitutionalContextEngine.ts` | **SegmentConfidenceScore** | 213 | `const segmentConfidence: SegmentConfidenceScore = {` |
| `src/core/runtime/institutional-context/SegmentIntelligenceEngine.ts` | **calculateConfidenceMatrix** | 18 | `const confidenceMatrix = calculateConfidenceMatrix(profile);` |
| `src/core/runtime/institutional-context/SegmentIntelligenceExplainability.ts` | **generateExecutiveExplanation** | 3 | `export function generateExecutiveExplanation(profile: SegmentIntelligenceProfile` |
| `src/core/runtime/institutional-evidence/institutional-evidence-adapter.ts` | **buildInstitutionalOutcomesDatabase** | 16 | `const institutionalOutcomes = buildInstitutionalOutcomesDatabase(evidenceInput);` |
| `src/core/runtime/institutional-memory/ExecutiveMemoryNarrativeEngine.ts` | **generateNarrative** | 8 | `public static generateNarrative(` |
| `src/core/runtime/institutional-memory/ExecutiveResponsivenessEngine.ts` | **evaluate** | 11 | `public static evaluate(actionMarkers: ActionMarker[]): ResponsivenessMetrics {` |
| `src/core/runtime/institutional-memory/ExecutiveResponsivenessEngine.ts` | **responsivenessScore** | 44 | `let responsivenessScore = executionDisciplineIndex;` |
| `src/core/runtime/institutional-memory/ExecutiveResponsivenessEngine.ts` | **responsivenessScore** | 48 | `responsivenessScore = Math.max(0, responsivenessScore - 20);` |
| `src/core/runtime/institutional-memory/ExecutiveResponsivenessEngine.ts` | **responsivenessScore** | 50 | `responsivenessScore = Math.min(100, responsivenessScore + 10);` |
| `src/core/runtime/institutional-memory/GovernanceFatigueDetection.ts` | **evaluate** | 4 | `public static evaluate(` |
| `src/core/runtime/institutional-memory/GovernanceFatigueDetection.ts` | **score** | 20 | `let score = (ignoredAlertsCount * 15) + (unresolvedWorkflowCount * 10);` |
| `src/core/runtime/institutional-memory/GovernanceFatigueDetection.ts` | **score** | 31 | `if (score === 0) trend = 'STABLE';` |
| `src/core/runtime/institutional-memory/GovernanceRecurrenceEngine.ts` | **evaluate** | 4 | `public static evaluate(cycles: HistoricalCycleData[]): {` |
| `src/core/runtime/institutional-memory/GovernanceRecurrenceEngine.ts` | **scoreDecreasedConsecutively** | 37 | `let scoreDecreasedConsecutively = true;` |
| `src/core/runtime/institutional-memory/GovernanceRecurrenceEngine.ts` | **prevScore** | 39 | `const prevScore = sorted[i - 1].scores?.composite || 0;` |
| `src/core/runtime/institutional-memory/GovernanceRecurrenceEngine.ts` | **currentScore** | 40 | `const currentScore = sorted[i].scores?.composite || 0;` |
| `src/core/runtime/institutional-memory/GovernanceRecurrenceEngine.ts` | **scoreDecreasedConsecutively** | 42 | `scoreDecreasedConsecutively = false;` |
| `src/core/runtime/institutional-memory/GovernanceTimelineEngine.ts` | **buildTimeline** | 18 | `public static buildTimeline(records: InstitutionalMemoryRecord[]): TimelinePhase` |
| `src/core/runtime/institutional-memory/HistoricalReplayIndex.ts` | **buildReplayReference** | 48 | `public static buildReplayReference(replayId: string): HistoricalReplayIndexEntry` |
| `src/core/runtime/institutional-memory/InstitutionalBehaviorAnalyzer.ts` | **analyze** | 4 | `public static analyze(` |
| `src/core/runtime/institutional-memory/InstitutionalBehaviorAnalyzer.ts` | **scoreDown** | 39 | `const scoreDown = (newest.scores?.composite || 0) < (oldest.scores?.composite ||` |
| `src/core/runtime/institutional-memory/InstitutionalDeteriorationModel.ts` | **evaluate** | 4 | `public static evaluate(` |
| `src/core/runtime/institutional-memory/InstitutionalDeteriorationModel.ts` | **score** | 19 | `let score = 0;` |
| `src/core/runtime/institutional-memory/InstitutionalEarlyWarningSystem.ts` | **evaluate** | 10 | `public static evaluate(` |
| `src/core/runtime/institutional-memory/InstitutionalLearningEngine.ts` | **evaluate** | 11 | `public static evaluate(cycles: HistoricalCycleData[], minRecurrence: number = 3)` |
| `src/core/runtime/institutional-memory/InstitutionalLearningEngine.ts` | **calculateAdvisoryAdherence** | 23 | `const advisoryAdherenceScore = LongitudinalMaturityEngine.calculateAdvisoryAdher` |
| `src/core/runtime/institutional-memory/InstitutionalLearningEngine.ts` | **calculateOperationalPersistence** | 24 | `const operationalPersistenceScore = LongitudinalMaturityEngine.calculateOperatio` |
| `src/core/runtime/institutional-memory/InstitutionalLearningEngine.ts` | **calculateResilienceTrend** | 25 | `const resilienceTrend = LongitudinalMaturityEngine.calculateResilienceTrend(cycl` |
| `src/core/runtime/institutional-memory/InstitutionalLearningEngine.ts` | **ignoredRecommendations** | 28 | `const ignoredRecommendations = RecommendationPersistenceTracker.trackIgnored(cyc` |
| `src/core/runtime/institutional-memory/InstitutionalLearningEngine.ts` | **governanceFatigueScore** | 31 | `let governanceFatigueScore = ignoredCount * 20;` |
| `src/core/runtime/institutional-memory/InstitutionalLearningEngine.ts` | **governanceFatigueScore** | 32 | `governanceFatigueScore = Math.min(100, Math.max(0, governanceFatigueScore));` |
| `src/core/runtime/institutional-memory/InstitutionalLearningEngine.ts` | **executiveResponsivenessScore** | 36 | `let executiveResponsivenessScore = advisoryAdherenceScore - (governanceFatigueSc` |
| `src/core/runtime/institutional-memory/InstitutionalLearningEngine.ts` | **executiveResponsivenessScore** | 37 | `executiveResponsivenessScore = Math.min(100, Math.max(0, executiveResponsiveness` |
| `src/core/runtime/institutional-memory/InstitutionalLearningEngine.ts` | **structuralResilienceScore** | 40 | `const structuralResilienceScore = resilienceTrend;` |
| `src/core/runtime/institutional-memory/InstitutionalMemoryEngine.ts` | **buildMemory** | 9 | `public static buildMemory(runtimeHistory: HistoricalCycleData[]): InstitutionalM` |
| `src/core/runtime/institutional-memory/InstitutionalMemoryEngine.ts` | **ignoredRecommendations** | 40 | `const ignoredRecommendations = RecommendationPersistenceTracker.trackIgnored(sor` |
| `src/core/runtime/institutional-memory/InstitutionalMemoryEngine.ts` | **evaluate** | 42 | `const govResult = GovernanceRecurrenceEngine.evaluate(sorted);` |
| `src/core/runtime/institutional-memory/InstitutionalMemoryEngine.ts` | **analyze** | 44 | `const behaviorPatterns = InstitutionalBehaviorAnalyzer.analyze(` |
| `src/core/runtime/institutional-memory/InstitutionalTimelineRuntime.ts` | **generate** | 13 | `public static generate(ledger: InstitutionalDecisionLedger): TimelineMilestone[]` |
| `src/core/runtime/institutional-memory/LongitudinalMaturityEngine.ts` | **evaluate** | 8 | `public static evaluate(cycles: HistoricalCycleData[]): LongitudinalMaturityProfi` |
| `src/core/runtime/institutional-memory/LongitudinalMaturityEngine.ts` | **calculateGovernanceConsistency** | 21 | `const governanceConsistencyIndex = this.calculateGovernanceConsistency(sortedCyc` |
| `src/core/runtime/institutional-memory/LongitudinalMaturityEngine.ts` | **calculateResilienceTrend** | 22 | `const resilienceTrend = this.calculateResilienceTrend(sortedCycles);` |
| `src/core/runtime/institutional-memory/LongitudinalMaturityEngine.ts` | **calculateDeteriorationTrend** | 23 | `const deteriorationTrend = this.calculateDeteriorationTrend(sortedCycles);` |
| `src/core/runtime/institutional-memory/LongitudinalMaturityEngine.ts` | **calculateAdvisoryAdherence** | 24 | `const advisoryAdherence = this.calculateAdvisoryAdherence(sortedCycles);` |
| `src/core/runtime/institutional-memory/LongitudinalMaturityEngine.ts` | **calculateOperationalPersistence** | 25 | `const operationalPersistence = this.calculateOperationalPersistence(sortedCycles` |
| `src/core/runtime/institutional-memory/LongitudinalMaturityEngine.ts` | **maturityScore** | 29 | `let maturityScore = 100;` |
| `src/core/runtime/institutional-memory/LongitudinalMaturityEngine.ts` | **maturityScore** | 40 | `maturityScore = Math.max(0, Math.min(100, maturityScore));` |
| `src/core/runtime/institutional-memory/LongitudinalMaturityEngine.ts` | **calculateGovernanceConsistency** | 58 | `public static calculateGovernanceConsistency(cycles: HistoricalCycleData[]): num` |
| `src/core/runtime/institutional-memory/LongitudinalMaturityEngine.ts` | **calculateResilienceTrend** | 72 | `public static calculateResilienceTrend(cycles: HistoricalCycleData[]): number {` |
| `src/core/runtime/institutional-memory/LongitudinalMaturityEngine.ts` | **calculateDeteriorationTrend** | 85 | `private static calculateDeteriorationTrend(cycles: HistoricalCycleData[]): numbe` |
| `src/core/runtime/institutional-memory/LongitudinalMaturityEngine.ts` | **calculateAdvisoryAdherence** | 97 | `public static calculateAdvisoryAdherence(cycles: HistoricalCycleData[]): number ` |
| `src/core/runtime/institutional-memory/LongitudinalMaturityEngine.ts` | **calculateOperationalPersistence** | 115 | `public static calculateOperationalPersistence(cycles: HistoricalCycleData[]): nu` |
| `src/core/runtime/institutional-memory/LongitudinalSnapshotSummary.ts` | **build** | 17 | `public static build(payload: any): LongitudinalSnapshotSummaryData {` |
| `src/core/runtime/institutional-memory/MemoryRetentionGovernance.ts` | **classifyRetentionLayer** | 7 | `public static classifyRetentionLayer(timestamp: string): 'HOT' | 'WARM' | 'COLD'` |
| `src/core/runtime/institutional-memory/MemoryRetentionGovernance.ts` | **recommendationReferences** | 35 | `compacted.recommendationReferences = [];` |
| `src/core/runtime/institutional-memory/PatternRecurrenceResolver.ts` | **newestScore** | 16 | `const newestScore = newest.scores?.composite || 0;` |
| `src/core/runtime/institutional-memory/PatternRecurrenceResolver.ts` | **previousScore** | 17 | `const previousScore = previous.scores?.composite || 0;` |
| `src/core/runtime/institutional-memory/PatternRecurrenceResolver.ts` | **oldestScore** | 18 | `const oldestScore = oldest.scores?.composite || 0;` |
| `src/core/runtime/institutional-memory/PredictiveRecurrenceEngine.ts` | **evaluate** | 4 | `public static evaluate(anomalyLineageHashes: string[], totalCycles: number): Pre` |
| `src/core/runtime/institutional-memory/PredictiveRecurrenceEngine.ts` | **recurrenceScore** | 17 | `const recurrenceScore = Math.min((frequency / totalCycles) * 100, 100);` |
| `src/core/runtime/institutional-memory/PriorityDeteriorationEngine.ts` | **evaluatePriorityDeterioration** | 16 | `export function evaluatePriorityDeterioration(` |
| `src/core/runtime/institutional-memory/ReplayMetadataRegistry.ts` | **classifyRetentionLayer** | 28 | `const layer = MemoryRetentionGovernance.classifyRetentionLayer(entry.timestamp);` |
| `src/core/runtime/institutional-memory/ReplayMetadataRegistry.ts` | **buildReplayReference** | 49 | `const entry = HistoricalReplayIndex.buildReplayReference(replayId);` |
| `src/core/runtime/institutional-memory/TemporalCausalityEngine.ts` | **evaluateLongitudinalCausality** | 18 | `public static evaluateLongitudinalCausality(` |
| `src/core/runtime/institutional-memory/TemporalCausalityEngine.ts` | **evaluate** | 50 | `const deterioration = InstitutionalDeteriorationModel.evaluate(history, anomalyC` |
| `src/core/runtime/institutional-memory/TemporalCausalityEngine.ts` | **evaluate** | 51 | `const responsiveness = ExecutiveResponsivenessEngine.evaluate(actionMarkers);` |
| `src/core/runtime/institutional-memory/TemporalCausalityEngine.ts` | **evaluate** | 52 | `const fatigue = GovernanceFatigueDetection.evaluate(ignoredRecommendationsCount,` |
| `src/core/runtime/institutional-memory/TemporalCausalityEngine.ts` | **evaluate** | 57 | `const recurrence = PredictiveRecurrenceEngine.evaluate(anomalyLineageHashes, his` |
| `src/core/runtime/institutional-memory/TemporalCausalityEngine.ts` | **evaluate** | 61 | `const escalation = TemporalEscalationEngine.evaluate(` |
| `src/core/runtime/institutional-memory/TemporalCausalityEngine.ts` | **evaluate** | 69 | `const scoring = TemporalGovernanceScoring.evaluate(deterioration, responsiveness` |
| `src/core/runtime/institutional-memory/TemporalCausalityEngine.ts` | **evaluate** | 76 | `const earlyWarnings = InstitutionalEarlyWarningSystem.evaluate(` |
| `src/core/runtime/institutional-memory/TemporalEscalationEngine.ts` | **evaluate** | 4 | `public static evaluate(` |
| `src/core/runtime/institutional-memory/TemporalGovernanceScoring.ts` | **evaluate** | 10 | `public static evaluate(` |
| `src/core/runtime/institutional-memory/TemporalGovernanceScoring.ts` | **baseScore** | 18 | `const baseScore = 100;` |
| `src/core/runtime/institutional-memory/TemporalGovernanceScoring.ts` | **finalScore** | 30 | `let finalScore = baseScore - (deteriorationWeight * 0.4) - (fatigueWeight * 0.3)` |
| `src/core/runtime/institutional-memory/TemporalGovernanceScoring.ts` | **finalScore** | 32 | `finalScore = Math.max(0, Math.min(100, finalScore));` |
| `src/core/runtime/institutional-onboarding/InstitutionalOnboardingOrchestrator.ts` | **evaluate** | 9 | `public static evaluate(input: InstitutionalOnboardingInput): InstitutionalOnboar` |
| `src/core/runtime/institutional-recovery/InstitutionalReauthorizationEngine.ts` | **evaluateStage** | 7 | `public static evaluateStage(` |
| `src/core/runtime/institutional-recovery/InstitutionalRecoveryEngine.ts` | **evaluate** | 10 | `public static evaluate(input: RecoveryEvaluationInput): InstitutionalRecoveryOut` |
| `src/core/runtime/institutional-recovery/InstitutionalRecoveryEngine.ts` | **evaluateStage** | 68 | `let reauthorization = InstitutionalReauthorizationEngine.evaluateStage(consisten` |
| `src/core/runtime/institutional-recovery/InstitutionalRecoveryEngine.ts` | **evaluateConstraints** | 97 | `const constraints = RecoveryConstraintReleaseEngine.evaluateConstraints(reauthor` |
| `src/core/runtime/institutional-recovery/RecoveryConsistencyValidationEngine.ts` | **score** | 79 | `let score = 0;` |
| `src/core/runtime/institutional-recovery/RecoveryConstraintReleaseEngine.ts` | **evaluateConstraints** | 6 | `public static evaluateConstraints(` |
| `src/core/runtime/institutional-reporting/ExecutiveReportNarrativeOrchestrator.ts` | **generateExecutiveSummary** | 16 | `public static generateExecutiveSummary(context: {` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime.test.ts` | **generateDocument** | 43 | `const result = InstitutionalBoardPackDocumentRuntime.generateDocument(mockReport` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime.test.ts` | **generateDocument** | 60 | `const bankingResult = InstitutionalBoardPackDocumentRuntime.generateDocument(moc` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime.test.ts` | **generateDocument** | 68 | `const auditResult = InstitutionalBoardPackDocumentRuntime.generateDocument(audit` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime.test.ts` | **generateDocument** | 80 | `const result = InstitutionalBoardPackDocumentRuntime.generateDocument(restricted` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime.ts` | **generateDocument** | 30 | `public static generateDocument(report: ExecutiveIntelligenceReport, variant: Rep` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime.ts` | **buildMarkdownSections** | 44 | `const markdownSections = this.buildMarkdownSections(report, formattedNarrative, ` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime.ts` | **buildMarkdownSections** | 94 | `private static buildMarkdownSections(` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime.ts` | **boardRiskScore** | 107 | `const boardRiskScore = brmMetrics.boardRiskScore ?? 70;` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime.ts` | **bankingReadinessScore** | 109 | `const bankingReadinessScore = brmMetrics.bankingReadinessScore ?? 70;` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime.ts` | **ensScore** | 198 | `const ensScore = eneMetrics.ensScore ?? 70;` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime.ts` | **Score** | 215 | `summaryText += `- **Economic Normalization Score (ENS)**: ${ensScore}/100 (${ens` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime.ts` | **imsScore** | 300 | `const imsScore = imeMetrics.imsScore ?? 70;` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime.ts` | **Score** | 312 | `summaryText += `- **Institutional Memory Score (IMS)**: ${imsScore}/100\n`;` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime.ts` | **ignoredRecommendationsReport** | 330 | `sections.ignoredRecommendationsReport = ignoredText;` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime.ts` | **ccsScore** | 386 | `const ccsScore = ccsMetrics.ccsScore ?? 70;` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime.ts` | **Score** | 401 | `ccsExecSummary += `- **Credit Committee Simulator Score (CCS)**: ${ccsScore}/100` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime.ts` | **Score** | 452 | `refinancingExposure += `- **Treasury Score (Financeability)**: ${domains.treasur` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime.ts` | **advisoryScore** | 485 | `const advisoryScore = imeMetrics.advisoryScore ?? 70;` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime.ts` | **Score** | 536 | `summaryText += `- **Sovereign Decision Urgency Score (SDS)**: ${sdsUrgency}/100\` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime.ts` | **Score** | 538 | `summaryText += `- **Execution Capacity Score (ECE)**: ${executionCapacity}/100\n` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime.ts` | **Score** | 653 | `dvrText += `- **Decision Value Realization Score (DVRS)**: ${e3Metrics.dvrs ?? 1` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime.ts` | **Score** | 667 | `debtText += `- **Institutional Decision Debt Score (IDDS)**: ${e3Metrics.iddsSco` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime.ts` | **forecastText** | 684 | `let forecastText = `## Execution Capacity Forecast\n\n`;` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime.ts` | **capacityForecast** | 687 | `if (e3Metrics.capacityForecast === 'HIGH') {` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime.ts` | **capacityForecast** | 689 | `} else if (e3Metrics.capacityForecast === 'MODERATE') {` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime.ts` | **executionCapacityForecast** | 694 | `sections.executionCapacityForecast = forecastText;` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime.ts` | **Score** | 748 | `evidenceQualityText += `- **Cash Quality Score (CQS)**: ${cashQuality.score ?? 0` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime.ts` | **Score** | 749 | `evidenceQualityText += `- **Earnings Quality Score (EQS)**: ${earningsQuality.sc` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime.ts` | **Score** | 790 | `flifText += `- **Executive Data Reliability Score (EDRS)**: ${flifResult.edrs}/1` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime.ts` | **Score** | 860 | ``- **Capital Governance Score (CGS)**: ${cgs}/100 (${finalCgsStatus})\n` +` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime.ts` | **equityResilienceAssessment** | 890 | `sections.equityResilienceAssessment = `## Equity Resilience Assessment\n\n` +` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime.ts` | **scores** | 1004 | ``- **Impacto Fiduciário**: Todos os scores (CQS, EQS, ENS, CGS, etc.) refletem e` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackRuntime.ts` | **generate** | 32 | `public static generate(report: ExecutiveIntelligenceReport): InstitutionalBoardP` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackRuntime.ts` | **generateHash** | 48 | `const boardPackLineageHash = this.generateHash('BOARD_PACK', {` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackRuntime.ts` | **generate** | 84 | `const executiveSnapshot = ExecutiveSnapshotEngine.generate(report);` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackRuntime.ts` | **generate** | 85 | `const governanceReport = GovernanceReportingEngine.generate(report);` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackRuntime.ts` | **generate** | 86 | `const strategicDirection = StrategicDirectionReportingEngine.generate(report);` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackRuntime.ts` | **generate** | 87 | `const treasuryReport = TreasuryPressureReportingEngine.generate(report);` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackRuntime.ts` | **generate** | 88 | `const continuityReport = ContinuityReportingEngine.generate(report);` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackRuntime.ts` | **generate** | 89 | `const operationalGovernance = OperationalGovernanceReportingEngine.generate(repo` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackRuntime.ts` | **generate** | 90 | `const executiveDirectives = ExecutiveDirectiveReportingEngine.generate(report);` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackRuntime.ts` | **generate** | 93 | `const explainabilityAppendix = InstitutionalExplainabilityAppendixEngine.generat` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackRuntime.ts` | **generate** | 94 | `const lineageAppendix = InstitutionalLineageAppendixEngine.generate(report, boar` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackRuntime.ts` | **generate** | 95 | `const boardResolutionAppendix = BoardResolutionAppendixEngine.generate(report);` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackRuntime.ts` | **generate** | 97 | `const disclosures = InstitutionalDisclosureReportingEngine.generate(report, meta` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackRuntime.ts` | **generateRestrictions** | 98 | `const fiduciaryRestrictions = InstitutionalDisclosureReportingEngine.generateRes` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackRuntime.ts` | **evaluate** | 187 | `const maturity = ExecutiveMaturityLayer.evaluate(historicalCyclesCount, netReven` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackRuntime.ts` | **evaluate** | 190 | `const economicReturnOut = EconomicReturnEngine.evaluate(` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackRuntime.ts` | **generateNarrative** | 199 | `const returnNarrative = EconomicValueCreationEngine.generateNarrative(` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackRuntime.ts` | **evaluate** | 218 | `const badi = BoardAttentionDemandIndexEngine.evaluate(` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackRuntime.ts` | **rankedRecommendations** | 232 | `const rankedRecommendations = ExecutivePriorityRankingEngine.rank(report);` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackRuntime.ts` | **generate** | 235 | `const top3BoardDecisions = BoardTop3DecisionEngine.generate(report, false);` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackRuntime.ts` | **generate** | 238 | `const top5ExecutiveActions = ExecutiveActionPlanEngine.generate(report);` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackRuntime.ts` | **generate** | 241 | `const priorityMatrix = InstitutionalPriorityMatrixEngine.generate(report);` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackRuntime.ts` | **generate** | 266 | `const executiveThesis = InstitutionalExecutiveThesisEngine.generate({` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackRuntime.ts` | **generateHash** | 501 | `private static generateHash(prefix: string, data: Record<string, string>): strin` |
| `src/core/runtime/institutional-reporting/engines/BoardResolutionAppendixEngine.ts` | **generate** | 8 | `public static generate(report: ExecutiveIntelligenceReport): BoardResolutionAppe` |
| `src/core/runtime/institutional-reporting/engines/ContinuityReportingEngine.ts` | **generate** | 8 | `public static generate(report: ExecutiveIntelligenceReport): ContinuitySection {` |
| `src/core/runtime/institutional-reporting/engines/ExecutiveDirectiveReportingEngine.ts` | **generate** | 8 | `public static generate(report: ExecutiveIntelligenceReport): ExecutiveDirectiveS` |
| `src/core/runtime/institutional-reporting/engines/ExecutiveLongitudinalIntegration.spec.ts` | **calculate** | 50 | `const score = LongitudinalScoreEngine.calculate('ARTIFICIAL_TURNAROUND', 90);` |
| `src/core/runtime/institutional-reporting/engines/ExecutiveLongitudinalIntegration.spec.ts` | **calculate** | 55 | `const score = LongitudinalScoreEngine.calculate('STRUCTURAL_IMPROVEMENT', 40);` |
| `src/core/runtime/institutional-reporting/engines/ExecutiveLongitudinalIntegration.spec.ts` | **calculate** | 61 | `const score = LongitudinalScoreEngine.calculate('INSUFFICIENT_HISTORICAL_DATA', ` |
| `src/core/runtime/institutional-reporting/engines/ExecutiveLongitudinalIntegration.spec.ts` | **calculate** | 66 | `const score = LongitudinalScoreEngine.calculate('CHRONIC_DEPENDENCY', 85);` |
| `src/core/runtime/institutional-reporting/engines/ExecutiveLongitudinalIntegration.spec.ts` | **calculate** | 71 | `const score = LongitudinalScoreEngine.calculate('VOLATILE_RECOVERY', 70);` |
| `src/core/runtime/institutional-reporting/engines/ExecutiveLongitudinalIntegration.spec.ts` | **calculate** | 76 | `const score = LongitudinalScoreEngine.calculate('STABLE_SUSTAINABILITY', 70);` |
| `src/core/runtime/institutional-reporting/engines/ExecutiveLongitudinalIntegration.spec.ts` | **generate** | 122 | `const snapshot = ExecutiveSnapshotEngine.generate(mockReport as ExecutiveIntelli` |
| `src/core/runtime/institutional-reporting/engines/ExecutiveLongitudinalIntegration.spec.ts` | **generateExecutiveSummary** | 134 | `const result = ExecutiveReportNarrativeOrchestrator.generateExecutiveSummary({` |
| `src/core/runtime/institutional-reporting/engines/ExecutiveReportExportEngine.ts` | **generateDocument** | 19 | `const documentAgnostic = InstitutionalBoardPackDocumentRuntime.generateDocument(` |
| `src/core/runtime/institutional-reporting/engines/ExecutiveSnapshotEngine.ts` | **generate** | 9 | `public static generate(report: ExecutiveIntelligenceReport): ExecutiveSnapshotSe` |
| `src/core/runtime/institutional-reporting/engines/ExecutiveSnapshotEngine.ts` | **generateExecutiveSummary** | 18 | `const executiveSummary = ExecutiveReportNarrativeOrchestrator.generateExecutiveS` |
| `src/core/runtime/institutional-reporting/engines/ExecutiveSnapshotEngine.ts` | **longitudinalScore** | 52 | `const longitudinalScore = report.cashSustainabilityReport?.longitudinalScore || ` |
| `src/core/runtime/institutional-reporting/engines/GovernanceReportingEngine.ts` | **generate** | 8 | `public static generate(report: ExecutiveIntelligenceReport): GovernanceReporting` |
| `src/core/runtime/institutional-reporting/engines/GovernanceReportingEngine.ts` | **governanceScore** | 22 | `const governanceScore = 100 - ((gov.frictions?.length || 0) * 10);` |
| `src/core/runtime/institutional-reporting/engines/InstitutionalBoardPackEndToEnd.spec.ts` | **generateExecutiveReport** | 291 | `const report = engine.generateExecutiveReport(data, {` |
| `src/core/runtime/institutional-reporting/engines/InstitutionalBoardPackEndToEnd.spec.ts` | **generate** | 305 | `const boardPack = InstitutionalBoardPackRuntime.generate(report, {` |
| `src/core/runtime/institutional-reporting/engines/InstitutionalBoardPackEndToEnd.spec.ts` | **longitudinalScore** | 345 | `assert.ok(boardPack.executiveSnapshot.longitudinalScore > 50 || boardPack.execut` |
| `src/core/runtime/institutional-reporting/engines/InstitutionalDisclosureReportingEngine.ts` | **generate** | 9 | `public static generate(report: ExecutiveIntelligenceReport, metadata: BoardPackM` |
| `src/core/runtime/institutional-reporting/engines/InstitutionalDisclosureReportingEngine.ts` | **generateRestrictions** | 24 | `public static generateRestrictions(report: ExecutiveIntelligenceReport, metadata` |
| `src/core/runtime/institutional-reporting/engines/InstitutionalExplainabilityAppendixEngine.ts` | **generate** | 8 | `public static generate(report: ExecutiveIntelligenceReport): ExplainabilityAppen` |
| `src/core/runtime/institutional-reporting/engines/InstitutionalLineageAppendixEngine.ts` | **generate** | 9 | `public static generate(report: ExecutiveIntelligenceReport, boardPackHash: strin` |
| `src/core/runtime/institutional-reporting/engines/LongitudinalScoreEngine.ts` | **calculate** | 20 | `public static calculate(` |
| `src/core/runtime/institutional-reporting/engines/LongitudinalScoreEngine.ts` | **score** | 28 | `let score = baseScore;` |
| `src/core/runtime/institutional-reporting/engines/LongitudinalScoreEngine.ts` | **score** | 32 | `score = Math.max(85, Math.min(100, score + 20));` |
| `src/core/runtime/institutional-reporting/engines/LongitudinalScoreEngine.ts` | **score** | 35 | `score = Math.max(80, Math.min(95, score + 15));` |
| `src/core/runtime/institutional-reporting/engines/LongitudinalScoreEngine.ts` | **score** | 38 | `score = Math.max(70, Math.min(85, score + 10));` |
| `src/core/runtime/institutional-reporting/engines/LongitudinalScoreEngine.ts` | **score** | 41 | `score = Math.max(50, Math.min(70, score));` |
| `src/core/runtime/institutional-reporting/engines/LongitudinalScoreEngine.ts` | **score** | 44 | `score = Math.max(35, Math.min(55, score - 10));` |
| `src/core/runtime/institutional-reporting/engines/LongitudinalScoreEngine.ts` | **score** | 47 | `score = Math.min(score - 20, 40);` |
| `src/core/runtime/institutional-reporting/engines/LongitudinalScoreEngine.ts` | **score** | 50 | `score = Math.min(score - 30, 35);` |
| `src/core/runtime/institutional-reporting/engines/LongitudinalScoreEngine.ts` | **score** | 53 | `score = Math.max(10, Math.min(30, score - 40));` |
| `src/core/runtime/institutional-reporting/engines/LongitudinalScoreEngine.ts` | **score** | 56 | `score = Math.max(20, Math.min(45, score - 30));` |
| `src/core/runtime/institutional-reporting/engines/OperationalGovernanceReportingEngine.ts` | **generate** | 8 | `public static generate(report: ExecutiveIntelligenceReport): OperationalGovernan` |
| `src/core/runtime/institutional-reporting/engines/StrategicDirectionReportingEngine.ts` | **generate** | 8 | `public static generate(report: ExecutiveIntelligenceReport): StrategicDirectionS` |
| `src/core/runtime/institutional-reporting/engines/TreasuryPressureReportingEngine.ts` | **generate** | 8 | `public static generate(report: ExecutiveIntelligenceReport): TreasurySection {` |
| `src/core/runtime/institutional-resilience/AntifragilityAssessmentEngine.ts` | **evaluate** | 13 | `public static evaluate(` |
| `src/core/runtime/institutional-resilience/AntifragilityAssessmentEngine.ts` | **score** | 23 | `let score = 0;` |
| `src/core/runtime/institutional-resilience/AntifragilityAssessmentEngine.ts` | **score** | 74 | `score = Math.max(0, Math.min(100, score));` |
| `src/core/runtime/institutional-resilience/CrisisLearningValidationEngine.ts` | **evaluate** | 13 | `public static evaluate(input: ResilienceEvaluationInput): CrisisLearningResult {` |
| `src/core/runtime/institutional-resilience/CrisisLearningValidationEngine.ts` | **score** | 14 | `let score = 50; // Base score` |
| `src/core/runtime/institutional-resilience/CrisisLearningValidationEngine.ts` | **score** | 73 | `score = Math.max(0, Math.min(100, score));` |
| `src/core/runtime/institutional-resilience/InstitutionalResilienceEngine.ts` | **evaluate** | 90 | `public static evaluate(input: ResilienceEvaluationInput): InstitutionalResilienc` |
| `src/core/runtime/institutional-resilience/InstitutionalResilienceEngine.ts` | **evaluate** | 92 | `const vulnResult = VulnerabilityReductionEngine.evaluate(input);` |
| `src/core/runtime/institutional-resilience/InstitutionalResilienceEngine.ts` | **evaluate** | 95 | `const learningResult = CrisisLearningValidationEngine.evaluate(input);` |
| `src/core/runtime/institutional-resilience/InstitutionalResilienceEngine.ts` | **evaluate** | 98 | `const shockResult = InstitutionalShockAbsorptionEngine.evaluate(input);` |
| `src/core/runtime/institutional-resilience/InstitutionalResilienceEngine.ts` | **evaluate** | 101 | `const antifragilityResult = AntifragilityAssessmentEngine.evaluate(` |
| `src/core/runtime/institutional-resilience/InstitutionalResilienceEngine.ts` | **resilienceScore** | 114 | `const resilienceScore = Math.round(` |
| `src/core/runtime/institutional-resilience/InstitutionalShockAbsorptionEngine.ts` | **evaluate** | 11 | `public static evaluate(input: ResilienceEvaluationInput): ShockAbsorptionResult ` |
| `src/core/runtime/institutional-resilience/InstitutionalShockAbsorptionEngine.ts` | **score** | 12 | `let score = 50; // Base score` |
| `src/core/runtime/institutional-resilience/InstitutionalShockAbsorptionEngine.ts` | **score** | 52 | `score = Math.max(0, Math.min(100, score));` |
| `src/core/runtime/institutional-resilience/VulnerabilityReductionEngine.ts` | **evaluate** | 12 | `public static evaluate(input: ResilienceEvaluationInput): VulnerabilityReduction` |
| `src/core/runtime/institutional-resilience/VulnerabilityReductionEngine.ts` | **score** | 13 | `let score = 50; // Base score` |
| `src/core/runtime/institutional-resilience/VulnerabilityReductionEngine.ts` | **score** | 54 | `score = Math.max(0, Math.min(100, score));` |
| `src/core/runtime/institutional-survival/InstitutionalSurvivalHierarchyEngine.ts` | **evaluate** | 8 | `public static evaluate(input: SurvivalEvaluationInput): InstitutionalSurvivalOut` |
| `src/core/runtime/institutional-survival/InstitutionalSurvivalHierarchyEngine.ts` | **classify** | 132 | `let classification = SurvivalPriorityClassificationEngine.classify(input, isSurv` |
| `src/core/runtime/institutional-survival/SurvivalPriorityClassificationEngine.ts` | **classify** | 6 | `public static classify(` |
| `src/core/runtime/integrations/ConnectorExecutionEngine.ts` | **evaluateTrust** | 40 | `const trust = SourceTrustEngine.evaluateTrust(connector.type);` |
| `src/core/runtime/integrations/PilotRollbackProtocol.ts` | **calculateMetrics** | 262 | `static calculateMetrics(tenantId: string): {` |
| `src/core/runtime/integrations/PilotRollbackProtocol.ts` | **score** | 290 | `let score = 0;` |
| `src/core/runtime/integrations/PilotRollbackProtocol.ts` | **score** | 291 | `if (dataset.trustLevel === 'LOW') score = 33;` |
| `src/core/runtime/integrations/PilotRollbackProtocol.ts` | **score** | 292 | `else if (dataset.trustLevel === 'MEDIUM') score = 66;` |
| `src/core/runtime/integrations/PilotRollbackProtocol.ts` | **score** | 293 | `else if (dataset.trustLevel === 'HIGH' || dataset.trustLevel === 'INSTITUTIONAL'` |
| `src/core/runtime/integrations/PilotRollbackProtocol.ts` | **score** | 294 | `else if (dataset.trustLevel === 'UNVERIFIED') score = 10;` |
| `src/core/runtime/integrations/PilotRollbackProtocol.ts` | **averageConfidenceScore** | 322 | `const averageConfidenceScore = confidenceCount > 0 ? Math.round(totalConfidenceS` |
| `src/core/runtime/integrations/SourceTrustEngine.ts` | **evaluateTrust** | 7 | `static evaluateTrust(connectorType: ConnectorType): SourceTrustLevel {` |
| `src/core/runtime/integrity/EmptyCycleIntegrityEngine.ts` | **evaluate** | 8 | `public static evaluate(rawData: any): boolean {` |
| `src/core/runtime/integrity/ExecutiveActionMatrixEngine.ts` | **buildMatrix** | 20 | `public static buildMatrix(` |
| `src/core/runtime/integrity/ExecutiveActionMatrixEngine.ts` | **evaluate** | 39 | `const enforcement = GlobalFiduciaryDistributionEnforcementEngine.evaluate(fiduci` |
| `src/core/runtime/integrity/ScaleEfficiencyIntegrityEngine.ts` | **evaluate** | 5 | `public static evaluate(historicalCycles: number): boolean {` |
| `src/core/runtime/ios/IOSGovernanceEngine.ts` | **generateLineageHash** | 18 | `static generateLineageHash(tenantId: string, sourceDomains: string[], executionI` |
| `src/core/runtime/ios/InstitutionalContextEngine.ts` | **buildContext** | 4 | `static buildContext(tenantId: string): InstitutionalContext {` |
| `src/core/runtime/ios/InstitutionalOperatingSystem.ts` | **buildUnifiedState** | 16 | `const state = InstitutionalStateManager.buildUnifiedState(tenantId);` |
| `src/core/runtime/ios/InstitutionalPulseEngine.ts` | **generateLineageHash** | 18 | `lineageHash: IOSGovernanceEngine.generateLineageHash(tenantId, ['EARLY_WARNING',` |
| `src/core/runtime/ios/InstitutionalStateManager.ts` | **buildUnifiedState** | 9 | `static buildUnifiedState(tenantId: string): InstitutionalState {` |
| `src/core/runtime/ios/InstitutionalStateManager.ts` | **buildContext** | 11 | `const context = InstitutionalContextEngine.buildContext(tenantId);` |
| `src/core/runtime/ios/InstitutionalStateManager.ts` | **buildTimeline** | 13 | `const timeline = UnifiedGovernanceTimeline.buildTimeline(tenantId);` |
| `src/core/runtime/ios/UnifiedGovernanceTimeline.ts` | **buildTimeline** | 4 | `static buildTimeline(tenantId: string): InstitutionalTimelineEvent[] {` |
| `src/core/runtime/journey/GovernanceJourneyEngine.ts` | **generateJourney** | 34 | `public generateJourney(` |
| `src/core/runtime/journey/GovernanceJourneyEngine.ts` | **calculateAssessment** | 42 | `const esgim = esgimAssessmentEngine.calculateAssessment(clientId, mode, scenario` |
| `src/core/runtime/journey/GovernanceJourneyEngine.ts` | **calculateResilience** | 43 | `const iri = institutionalResilienceIndexEngine.calculateResilience(clientId, mod` |
| `src/core/runtime/journey/GovernanceJourneyEngine.ts` | **generatePriorities** | 44 | `const prioritiesData = boardPrioritiesEngine.generatePriorities(clientId, mode, ` |
| `src/core/runtime/journey/GovernanceJourneyEngine.ts` | **generateRoadmap** | 45 | `const roadmap = governanceRoadmapEngine.generateRoadmap(clientId, mode, scenario` |
| `src/core/runtime/journey/GovernanceJourneyEngine.ts` | **calculateMonitoring** | 46 | `const monitoring = governanceMonitoringEngine.calculateMonitoring(clientId, mode` |
| `src/core/runtime/journey/GovernanceJourneyEngine.ts` | **calculateLearning** | 47 | `const learning = governanceLearningEngine.calculateLearning(clientId, mode, scen` |
| `src/core/runtime/journey/GovernanceJourneyEngine.ts` | **evaluateReadiness** | 48 | `const readiness = benchmarkReadinessEngine.evaluateReadiness(clientId, scenario)` |
| `src/core/runtime/journey/GovernanceJourneyEngine.ts` | **calculateGeiWeightedScore** | 51 | `const geiWeighted = decisionRegistryEngine.calculateGeiWeightedScore(scenario);` |
| `src/core/runtime/journey/GovernanceJourneyEngine.ts` | **calculateOverdueRate** | 52 | `const overdueRate = decisionRegistryEngine.calculateOverdueRate(scenario);` |
| `src/core/runtime/journey/GovernanceJourneyEngine.ts` | **gjiScore** | 58 | `let gjiScore = 0;` |
| `src/core/runtime/journey/GovernanceJourneyEngine.ts` | **gjiScore** | 61 | `gjiScore = Math.round(` |
| `src/core/runtime/journey/GovernanceJourneyEngine.ts` | **gjiScore** | 67 | `gjiScore = Math.round(` |
| `src/core/runtime/journey/GovernanceJourneyEngine.ts` | **gjiScore** | 77 | `gjiScore = Math.min(gjiScore, 38);` |
| `src/core/runtime/journey/GovernanceJourneyEngine.ts` | **gjiScore** | 79 | `gjiScore = Math.min(gjiScore, 24);` |
| `src/core/runtime/journey/GovernanceJourneyEngine.ts` | **gjiScore** | 81 | `gjiScore = Math.min(gjiScore, 58);` |
| `src/core/runtime/journey/GovernanceJourneyEngine.ts` | **gjiScore** | 83 | `gjiScore = Math.min(gjiScore, 78);` |
| `src/core/runtime/journey/GovernanceJourneyEngine.ts` | **calculateComparison** | 299 | `const comparison = benchmarkComparativeEngine.calculateComparison(clientId, mode` |
| `src/core/runtime/journey/GovernanceJourneyEngine.ts` | **evaluateAdvisory** | 337 | `const advisory = benchmarkAdvisoryEngine.evaluateAdvisory(clientId, mode, scenar` |
| `src/core/runtime/journey/GovernanceJourneyEngine.ts` | **Score** | 347 | `s8Summary = `Caminho simulado de ascensão para o quadrante ${s8Value}. Advanceme` |
| `src/core/runtime/knowledge/GovernanceKnowledgeEngine.ts` | **calculatePAI** | 27 | `public calculatePAI(clientId: string, scenario: ESGIMScenario): { score: number;` |
| `src/core/runtime/knowledge/GovernanceKnowledgeEngine.ts` | **calculateGeiWeightedScore** | 29 | `const geiWeighted = decisionRegistryEngine.calculateGeiWeightedScore(scenario);` |
| `src/core/runtime/knowledge/GovernanceKnowledgeEngine.ts` | **calculateAssessment** | 30 | `const esgim = esgimAssessmentEngine.calculateAssessment(clientId, 'DEMO_SCENARIO` |
| `src/core/runtime/knowledge/GovernanceKnowledgeEngine.ts` | **baseScore** | 33 | `const baseScore = Math.round((geiWeighted * 0.6) + (esgim.overallScore * 0.4));` |
| `src/core/runtime/knowledge/GovernanceKnowledgeEngine.ts` | **score** | 36 | `let score = baseScore;` |
| `src/core/runtime/knowledge/GovernanceKnowledgeEngine.ts` | **score** | 38 | `score = Math.min(score, 34); // Capped at 34 (CRITICAL) due to ethical/constitut` |
| `src/core/runtime/knowledge/GovernanceKnowledgeEngine.ts` | **score** | 40 | `score = Math.min(score, 48); // Capped at 48 (CONCERN) due to severe runway/stew` |
| `src/core/runtime/knowledge/GovernanceKnowledgeEngine.ts` | **score** | 42 | `score = Math.min(score, 55); // Capped at 55 (DEVELOPING) due to purpose dilutio` |
| `src/core/runtime/knowledge-graph/GovernanceRelationshipGraph.ts` | **generateLineageReference** | 6 | `const lineage = SemanticLineageEngine.generateLineageReference(Date.now().toStri` |
| `src/core/runtime/knowledge-graph/GovernanceRelationshipGraph.ts` | **generateLineageReference** | 23 | `const lineage = SemanticLineageEngine.generateLineageReference(Date.now().toStri` |
| `src/core/runtime/knowledge-graph/InstitutionalMemoryEngine.ts` | **generateLineageReference** | 11 | `const lineage = SemanticLineageEngine.generateLineageReference('DEMO_EXEC_001');` |
| `src/core/runtime/knowledge-graph/RiskCorrelationEngine.ts` | **analyzeCorrelations** | 6 | `static analyzeCorrelations(tenantId: string): RiskCorrelation[] {` |
| `src/core/runtime/knowledge-graph/SemanticLineageEngine.ts` | **generateLineageReference** | 4 | `static generateLineageReference(` |
| `src/core/runtime/knowledge-graph/WorkflowPatternAnalyzer.ts` | **analyzePatterns** | 5 | `static analyzePatterns(tenantId: string): WorkflowPattern[] {` |
| `src/core/runtime/learning/GovernanceLearningEngine.ts` | **calculateLearning** | 33 | `public calculateLearning(` |
| `src/core/runtime/learning/GovernanceLearningEngine.ts` | **evaluateReadiness** | 41 | `const readiness = benchmarkReadinessEngine.evaluateReadiness(clientId, scenario)` |
| `src/core/runtime/learning/GovernanceLearningEngine.ts` | **calculateGeiWeightedScore** | 62 | `const geiWeighted = decisionRegistryEngine.calculateGeiWeightedScore(scenario);` |
| `src/core/runtime/learning/GovernanceLearningEngine.ts` | **generateRoadmap** | 63 | `const roadmap = governanceRoadmapEngine.generateRoadmap(clientId, mode, scenario` |
| `src/core/runtime/learning/GovernanceLearningEngine.ts` | **calculateComparison** | 65 | `const comparison = benchmarkComparativeEngine.calculateComparison(clientId, mode` |
| `src/core/runtime/learning/GovernanceLearningEngine.ts` | **bpsScore** | 66 | `const bpsScore = comparison.bpsScore;` |
| `src/core/runtime/learning/GovernanceLearningEngine.ts` | **calculateMonitoring** | 68 | `const monitoring = governanceMonitoringEngine.calculateMonitoring(clientId, mode` |
| `src/core/runtime/learning/GovernanceLearningEngine.ts` | **gliScore** | 80 | `let gliScore = rawGLI;` |
| `src/core/runtime/learning/GovernanceLearningEngine.ts` | **gliScore** | 82 | `gliScore = Math.min(gliScore, 20);` |
| `src/core/runtime/learning/GovernanceLearningEngine.ts` | **gliScore** | 84 | `gliScore = Math.min(gliScore, 30);` |
| `src/core/runtime/learning/GovernanceLearningEngine.ts` | **gliScore** | 86 | `gliScore = Math.min(gliScore, 55);` |
| `src/core/runtime/learning/GovernanceLearningEngine.ts` | **gliScore** | 88 | `gliScore = Math.min(gliScore, 80);` |
| `src/core/runtime/learning/GovernanceLearningEngine.ts` | **aaiScore** | 98 | `let aaiScore = 93;` |
| `src/core/runtime/learning/GovernanceLearningEngine.ts` | **aaiScore** | 102 | `aaiScore = 78;` |
| `src/core/runtime/learning/GovernanceLearningEngine.ts` | **aaiScore** | 105 | `aaiScore = 68;` |
| `src/core/runtime/learning/GovernanceLearningEngine.ts` | **aaiScore** | 108 | `aaiScore = 45;` |
| `src/core/runtime/learning/GovernanceLearningEngine.ts` | **aaiScore** | 111 | `aaiScore = 0;` |
| `src/core/runtime/lifecycle/LifecycleClassificationEngine.ts` | **classify** | 28 | `public static classify(params: LifecycleClassificationParams): LifecycleClassifi` |
| `src/core/runtime/lifecycle/LifecycleClassificationEngine.ts` | **ageScore** | 51 | `let ageScore = 10;` |
| `src/core/runtime/lifecycle/LifecycleClassificationEngine.ts` | **ageScore** | 52 | `if (age > 7) ageScore = 100;` |
| `src/core/runtime/lifecycle/LifecycleClassificationEngine.ts` | **ageScore** | 53 | `else if (age > 5) ageScore = 90;` |
| `src/core/runtime/lifecycle/LifecycleClassificationEngine.ts` | **ageScore** | 54 | `else if (age > 3) ageScore = 70;` |
| `src/core/runtime/lifecycle/LifecycleClassificationEngine.ts` | **ageScore** | 55 | `else if (age > 1) ageScore = 40;` |
| `src/core/runtime/lifecycle/LifecycleClassificationEngine.ts` | **cyclesScore** | 58 | `let cyclesScore = 10;` |
| `src/core/runtime/lifecycle/LifecycleClassificationEngine.ts` | **cyclesScore** | 59 | `if (historicalCycles > 5) cyclesScore = 100;` |
| `src/core/runtime/lifecycle/LifecycleClassificationEngine.ts` | **cyclesScore** | 60 | `else if (historicalCycles > 3) cyclesScore = 90;` |
| `src/core/runtime/lifecycle/LifecycleClassificationEngine.ts` | **cyclesScore** | 61 | `else if (historicalCycles > 2) cyclesScore = 75;` |
| `src/core/runtime/lifecycle/LifecycleClassificationEngine.ts` | **cyclesScore** | 62 | `else if (historicalCycles > 1) cyclesScore = 45;` |
| `src/core/runtime/lifecycle/LifecycleClassificationEngine.ts` | **revenueScore** | 65 | `let revenueScore = 10;` |
| `src/core/runtime/lifecycle/LifecycleClassificationEngine.ts` | **revenueScore** | 66 | `if (revenue > 30000000) revenueScore = 100;` |
| `src/core/runtime/lifecycle/LifecycleClassificationEngine.ts` | **revenueScore** | 67 | `else if (revenue > 10000000) revenueScore = 90;` |
| `src/core/runtime/lifecycle/LifecycleClassificationEngine.ts` | **revenueScore** | 68 | `else if (revenue > 2000000) revenueScore = 70;` |
| `src/core/runtime/lifecycle/LifecycleClassificationEngine.ts` | **revenueScore** | 69 | `else if (revenue > 100000) revenueScore = 40;` |
| `src/core/runtime/lifecycle/LifecycleClassificationEngine.ts` | **capitalScore** | 72 | `let capitalScore = 15;` |
| `src/core/runtime/lifecycle/LifecycleClassificationEngine.ts` | **capitalScore** | 73 | `if (capitalSocial > 5000000) capitalScore = 100;` |
| `src/core/runtime/lifecycle/LifecycleClassificationEngine.ts` | **capitalScore** | 74 | `else if (capitalSocial > 500000) capitalScore = 80;` |
| `src/core/runtime/lifecycle/LifecycleClassificationEngine.ts` | **capitalScore** | 75 | `else if (capitalSocial > 50000) capitalScore = 50;` |
| `src/core/runtime/lifecycle/LifecycleClassificationEngine.ts` | **incomeScore** | 78 | `let incomeScore = 20;` |
| `src/core/runtime/lifecycle/LifecycleClassificationEngine.ts` | **incomeScore** | 79 | `if (netIncome >= 500000) incomeScore = 100;` |
| `src/core/runtime/lifecycle/LifecycleClassificationEngine.ts` | **incomeScore** | 80 | `else if (netIncome >= 50000) incomeScore = 80;` |
| `src/core/runtime/lifecycle/LifecycleClassificationEngine.ts` | **incomeScore** | 81 | `else if (netIncome >= 0) incomeScore = 50;` |
| `src/core/runtime/lifecycle/LifecycleClassificationEngine.ts` | **totalScore** | 84 | `const totalScore =` |
| `src/core/runtime/lifecycle/LifecycleContextBuilder.ts` | **build** | 16 | `public static build(params: {` |
| `src/core/runtime/lifecycle/LifecycleContextBuilder.ts` | **classify** | 24 | `const classification = LifecycleClassificationEngine.classify(params);` |
| `src/core/runtime/monitoring/ConfidenceDriftDetector.ts` | **analyzeDrift** | 7 | `static analyzeDrift(historicalConfidences: string[], groupId: string): Confidenc` |
| `src/core/runtime/monitoring/GovernanceMonitoringEngine.ts` | **calculateMonitoring** | 30 | `public calculateMonitoring(` |
| `src/core/runtime/monitoring/GovernanceMonitoringEngine.ts` | **calculateAssessment** | 38 | `const esgimResult = esgimAssessmentEngine.calculateAssessment(clientId, mode, sc` |
| `src/core/runtime/monitoring/GovernanceMonitoringEngine.ts` | **calculateResilience** | 39 | `const iriResult = institutionalResilienceIndexEngine.calculateResilience(clientI` |
| `src/core/runtime/monitoring/GovernanceMonitoringEngine.ts` | **generatePriorities** | 40 | `const prioritiesResult = boardPrioritiesEngine.generatePriorities(clientId, mode` |
| `src/core/runtime/monitoring/GovernanceMonitoringEngine.ts` | **generateRoadmap** | 41 | `const roadmapResult = governanceRoadmapEngine.generateRoadmap(clientId, mode, sc` |
| `src/core/runtime/monitoring/GovernanceMonitoringEngine.ts` | **calculateGeiWeightedScore** | 47 | `const presentPei = decisionRegistryEngine.calculateGeiWeightedScore(scenario);` |
| `src/core/runtime/monitoring/GovernanceMonitoringEngine.ts` | **calculateGeiSimpleScore** | 117 | `geiSimpleScore: decisionRegistryEngine.calculateGeiSimpleScore(scenario),` |
| `src/core/runtime/monitoring/GovernanceMonitoringEngine.ts` | **calculateGaiScore** | 119 | `gaiScore: decisionRegistryEngine.calculateGaiScore(scenario),` |
| `src/core/runtime/monitoring/GovernanceMonitoringEngine.ts` | **calculateOverdueRate** | 120 | `overdueRate: decisionRegistryEngine.calculateOverdueRate(scenario)` |
| `src/core/runtime/monitoring/LiquidityWatchEngine.ts` | **evaluate** | 7 | `static evaluate(financialOutput: any, groupId: string): LiquidityHealthSignal {` |
| `src/core/runtime/monitoring/MonitoringExecutionScheduler.ts` | **generatedCount** | 14 | `let generatedCount = 0;` |
| `src/core/runtime/monitoring/MonitoringExecutionScheduler.ts` | **generatedCount** | 18 | `generatedCount = alerts.length;` |
| `src/core/runtime/monitoring/MonitoringRuleEngine.ts` | **analyzeDrift** | 14 | `const trend = ConfidenceDriftDetector.analyzeDrift(context.historicalConfidences` |
| `src/core/runtime/monitoring/MonitoringRuleEngine.ts` | **evaluate** | 41 | `const result = rule.evaluate(context);` |
| `src/core/runtime/monitoring/SystemicRiskTrendAnalyzer.ts` | **analyze** | 7 | `static analyze(snapshots: any[], groupId: string): SystemicRiskTrend | null {` |
| `src/core/runtime/observability/ConfidenceTelemetryEngine.ts` | **baseConfidenceScore** | 18 | `this.baseConfidenceScore = score;` |
| `src/core/runtime/observability/ConfidenceTelemetryEngine.ts` | **currentConfidenceScore** | 19 | `this.currentConfidenceScore = score;` |
| `src/core/runtime/observability/ConfidenceTelemetryEngine.ts` | **currentConfidenceScore** | 24 | `if (this.currentConfidenceScore < 0) this.currentConfidenceScore = 0;` |
| `src/core/runtime/observability/ExecutionTraceBuilder.ts` | **buildReplayEnvelope** | 60 | `buildReplayEnvelope(): RuntimeReplayEnvelope | null {` |
| `src/core/runtime/observability/ExplainabilityEngine.ts` | **stabilityScore** | 24 | `if (this.stabilityScore < 0) this.stabilityScore = 0;` |
| `src/core/runtime/observability/InstitutionalExplainabilityEngine.ts` | **generateFiduciaryRationale** | 26 | `export function generateFiduciaryRationale(` |
| `src/core/runtime/observability/ObservedConsolidatedRuntimeService.ts` | **ExecutionTraceBuilder** | 27 | `const trace = new ExecutionTraceBuilder(executionId);` |
| `src/core/runtime/observability/RuntimeHealthMonitor.ts` | **generateSnapshot** | 7 | `static async generateSnapshot(): Promise<RuntimeHealthSnapshot> {` |
| `src/core/runtime/observability/RuntimeTelemetry.test.ts` | **builder** | 27 | `const builder = new ExecutionTraceBuilder('trace_456');` |
| `src/core/runtime/observability/RuntimeTelemetry.test.ts` | **buildReplayEnvelope** | 42 | `const replayEnvelope = builder.buildReplayEnvelope();` |
| `src/core/runtime/observability/ThesisStabilityEngine.ts` | **sensitivityScore** | 43 | `const sensitivityScore = (Math.abs(currSev - prevSev) / 3) + (oscillationsPreven` |
| `src/core/runtime/operating-pressure/FundingFragilityEngine.ts` | **evaluate** | 6 | `public static evaluate(input: PressureRuntimeInput): FundingFragilityOutput {` |
| `src/core/runtime/operating-pressure/FundingFragilityEngine.ts` | **score** | 9 | `let score = 0;` |
| `src/core/runtime/operating-pressure/FundingFragilityEngine.ts` | **fragilityScore** | 49 | `const fragilityScore = Math.min(Math.max(score, 0), 100);` |
| `src/core/runtime/operating-pressure/InstitutionalPressureRuntime.ts` | **evaluate** | 17 | `public static evaluate(input: PressureRuntimeInput): InstitutionalPressureRuntim` |
| `src/core/runtime/operating-pressure/InstitutionalPressureRuntime.ts` | **evaluate** | 23 | `const accumulation = PressureAccumulationEngine.evaluate(input);` |
| `src/core/runtime/operating-pressure/InstitutionalPressureRuntime.ts` | **evaluate** | 24 | `const fatigue = OperationalFatigueEngine.evaluate(input);` |
| `src/core/runtime/operating-pressure/InstitutionalPressureRuntime.ts` | **evaluate** | 25 | `const compression = LiquidityCompressionEngine.evaluate(input);` |
| `src/core/runtime/operating-pressure/InstitutionalPressureRuntime.ts` | **evaluate** | 26 | `const erosion = TreasuryErosionEngine.evaluate(input);` |
| `src/core/runtime/operating-pressure/InstitutionalPressureRuntime.ts` | **evaluate** | 27 | `const fragility = FundingFragilityEngine.evaluate(input);` |
| `src/core/runtime/operating-pressure/InstitutionalPressureRuntime.ts` | **scores** | 29 | `const scores = {` |
| `src/core/runtime/operating-pressure/InstitutionalPressureRuntime.ts` | **pressureScore** | 39 | `const pressureScore = Math.min(` |
| `src/core/runtime/operating-pressure/InstitutionalPressureRuntime.ts` | **evaluate** | 73 | `const propagation = PressurePropagationEngine.evaluate(input, scores);` |
| `src/core/runtime/operating-pressure/InstitutionalPressureRuntime.ts` | **thesisScores** | 74 | `const thesisScores = { ...scores, overall: pressureScore };` |
| `src/core/runtime/operating-pressure/InstitutionalPressureRuntime.ts` | **evaluate** | 75 | `const thesis = OperatingPressureThesisEngine.evaluate(input, thesisScores);` |
| `src/core/runtime/operating-pressure/InstitutionalPressureRuntime.ts` | **evaluate** | 78 | `const explainability = OperatingPressureExplainabilityEngine.evaluate(` |
| `src/core/runtime/operating-pressure/LiquidityCompressionEngine.ts` | **evaluate** | 6 | `public static evaluate(input: PressureRuntimeInput): LiquidityCompressionOutput ` |
| `src/core/runtime/operating-pressure/LiquidityCompressionEngine.ts` | **score** | 9 | `let score = 0;` |
| `src/core/runtime/operating-pressure/LiquidityCompressionEngine.ts` | **compressionScore** | 54 | `const compressionScore = Math.min(Math.max(score, 0), 100);` |
| `src/core/runtime/operating-pressure/OperatingPressureExplainabilityEngine.ts` | **evaluate** | 6 | `public static evaluate(` |
| `src/core/runtime/operating-pressure/OperatingPressureThesisEngine.ts` | **evaluate** | 6 | `public static evaluate(` |
| `src/core/runtime/operating-pressure/OperationalFatigueEngine.ts` | **evaluate** | 6 | `public static evaluate(input: PressureRuntimeInput): OperationalFatigueOutput {` |
| `src/core/runtime/operating-pressure/OperationalFatigueEngine.ts` | **score** | 9 | `let score = 0;` |
| `src/core/runtime/operating-pressure/OperationalFatigueEngine.ts` | **fatigueScore** | 56 | `const fatigueScore = Math.min(Math.max(score, 0), 100);` |
| `src/core/runtime/operating-pressure/PressureAccumulationEngine.ts` | **evaluate** | 6 | `public static evaluate(input: PressureRuntimeInput): PressureAccumulationOutput ` |
| `src/core/runtime/operating-pressure/PressureAccumulationEngine.ts` | **score** | 9 | `let score = 0;` |
| `src/core/runtime/operating-pressure/PressureAccumulationEngine.ts` | **accumulationScore** | 52 | `const accumulationScore = Math.min(Math.max(score, 0), 100);` |
| `src/core/runtime/operating-pressure/PressurePropagationEngine.ts` | **evaluate** | 6 | `public static evaluate(` |
| `src/core/runtime/operating-pressure/TreasuryErosionEngine.ts` | **evaluate** | 6 | `public static evaluate(input: PressureRuntimeInput): TreasuryErosionOutput {` |
| `src/core/runtime/operating-pressure/TreasuryErosionEngine.ts` | **score** | 9 | `let score = 0;` |
| `src/core/runtime/operating-pressure/TreasuryErosionEngine.ts` | **erosionScore** | 61 | `const erosionScore = Math.min(Math.max(score, 0), 100);` |
| `src/core/runtime/operational-governance/ExecutionIntegrityEngine.ts` | **evaluate** | 7 | `static evaluate(context: OperationalEvaluationContext): ExecutionIntegrityState ` |
| `src/core/runtime/operational-governance/InstitutionalDependencyEngine.ts` | **evaluate** | 7 | `static evaluate(context: OperationalEvaluationContext): InstitutionalDependencyR` |
| `src/core/runtime/operational-governance/InstitutionalFrictionEngine.ts` | **evaluate** | 7 | `static evaluate(context: OperationalEvaluationContext): OperationalFrictionEvent` |
| `src/core/runtime/operational-governance/InstitutionalOperationalGovernanceRuntime.ts` | **evaluate** | 17 | `static evaluate(` |
| `src/core/runtime/operational-governance/InstitutionalOperationalGovernanceRuntime.ts` | **evaluate** | 26 | `const rawExecutionState = ExecutionIntegrityEngine.evaluate(context);` |
| `src/core/runtime/operational-governance/InstitutionalOperationalGovernanceRuntime.ts` | **evaluate** | 30 | `const frictions = InstitutionalFrictionEngine.evaluate(context);` |
| `src/core/runtime/operational-governance/InstitutionalOperationalGovernanceRuntime.ts` | **evaluate** | 31 | `const dependencies = InstitutionalDependencyEngine.evaluate(context);` |
| `src/core/runtime/operational-governance/InstitutionalOperationalGovernanceRuntime.ts` | **evaluate** | 34 | `const continuity = OperationalContinuityEngine.evaluate(context, executionIntegr` |
| `src/core/runtime/operational-governance/InstitutionalOperationalGovernanceRuntime.ts` | **evaluate** | 35 | `const strategicAlignment = StrategicExecutionAlignmentEngine.evaluate(context, e` |
| `src/core/runtime/operational-governance/InstitutionalOperationalGovernanceRuntime.ts` | **evaluate** | 38 | `const thesis = OperationalGovernanceThesisEngine.evaluate(context, executionInte` |
| `src/core/runtime/operational-governance/InstitutionalOperationalGovernanceRuntime.ts` | **evaluate** | 39 | `const explainability = OperationalGovernanceExplainabilityEngine.evaluate(contex` |
| `src/core/runtime/operational-governance/InstitutionalOperationalGovernanceRuntime.ts` | **generatePersistenceDelta** | 70 | `output._persistenceDelta = OperationalGovernanceMemoryEngine.generatePersistence` |
| `src/core/runtime/operational-governance/OperationalContinuityEngine.ts` | **evaluate** | 7 | `static evaluate(context: OperationalEvaluationContext, executionState: Execution` |
| `src/core/runtime/operational-governance/OperationalContinuityEngine.ts` | **resilienceScore** | 18 | `let resilienceScore = 100;` |
| `src/core/runtime/operational-governance/OperationalContinuityEngine.ts` | **resilienceScore** | 40 | `resilienceScore = Math.max(0, resilienceScore);` |
| `src/core/runtime/operational-governance/OperationalContinuityEngine.ts` | **resilienceScore** | 42 | `if (resilienceScore === 100) {` |
| `src/core/runtime/operational-governance/OperationalGovernanceExplainabilityEngine.ts` | **evaluate** | 14 | `static evaluate(` |
| `src/core/runtime/operational-governance/OperationalGovernanceMemoryEngine.ts` | **generatePersistenceDelta** | 7 | `static generatePersistenceDelta(` |
| `src/core/runtime/operational-governance/OperationalGovernanceThesisEngine.ts` | **evaluate** | 12 | `static evaluate(` |
| `src/core/runtime/operational-governance/StrategicExecutionAlignmentEngine.ts` | **evaluate** | 7 | `static evaluate(context: OperationalEvaluationContext, executionState: Execution` |
| `src/core/runtime/operational-scale/InstitutionalSessionStabilityEngine.ts` | **evaluate** | 4 | `static evaluate(tenantId: string, sessionMinutes: number): SessionStabilityRepor` |
| `src/core/runtime/operational-scale/OperationalScalabilityEvaluator.ts` | **evaluate** | 4 | `static evaluate(tenantId: string): ScaleReadinessReport {` |
| `src/core/runtime/operational-scale/RuntimeConcurrencyAnalyzer.ts` | **analyze** | 4 | `static analyze(tenantCount: number): ConcurrencyAnalysis {` |
| `src/core/runtime/orchestrator/InstitutionalFinancialDomainOrchestrator.ts` | **persistentRecommendations** | 44 | `persistentRecommendations = RecommendationPersistenceTracker.track(ledger);` |
| `src/core/runtime/orchestrator/InstitutionalFinancialDomainOrchestrator.ts` | **generateNarrative** | 50 | `continuityNarrative = ExecutiveMemoryNarrativeEngine.generateNarrative(` |
| `src/core/runtime/orchestrator/InstitutionalFinancialDomainOrchestrator.ts` | **evaluateNarrativeSafety** | 75 | `const safePrimaryEvent = InstitutionalInterpretationBoundary.evaluateNarrativeSa` |
| `src/core/runtime/orchestrator/InstitutionalInterpretationBoundary.ts` | **evaluateNarrativeSafety** | 7 | `public static evaluateNarrativeSafety(` |
| `src/core/runtime/orchestrator/UnifiedDisclosureEngine.ts` | **severityScore** | 44 | `let severityScore = 0;` |
| `src/core/runtime/patrimonial-intelligence/PatrimonialContextMapper.ts` | **generateLineageHash** | 19 | `public static generateLineageHash(context: FinancialRuntimeContext): string {` |
| `src/core/runtime/patrimonial-intelligence/PatrimonialIntelligenceRuntime.test.ts` | **evaluatePatrimonialStructure** | 22 | `const output = runtime.evaluatePatrimonialStructure(undefined, mockBP);` |
| `src/core/runtime/patrimonial-intelligence/PatrimonialIntelligenceRuntime.test.ts` | **evaluatePatrimonialStructure** | 34 | `const output = runtime.evaluatePatrimonialStructure(context, undefined);` |
| `src/core/runtime/patrimonial-intelligence/PatrimonialIntelligenceRuntime.test.ts` | **evaluatePatrimonialStructure** | 50 | `const output = runtime.evaluatePatrimonialStructure(context, badBP);` |
| `src/core/runtime/patrimonial-intelligence/PatrimonialIntelligenceRuntime.test.ts` | **evaluatePatrimonialStructure** | 67 | `const output = runtime.evaluatePatrimonialStructure(context, mockBP);` |
| `src/core/runtime/patrimonial-intelligence/PatrimonialIntelligenceRuntime.test.ts` | **evaluatePatrimonialStructure** | 85 | `const output = runtime.evaluatePatrimonialStructure(context, heavyBP);` |
| `src/core/runtime/patrimonial-intelligence/PatrimonialIntelligenceRuntime.test.ts` | **evaluatePatrimonialStructure** | 102 | `const output = runtime.evaluatePatrimonialStructure(context, mockBP);` |
| `src/core/runtime/patrimonial-intelligence/PatrimonialIntelligenceRuntime.test.ts` | **evaluatePatrimonialStructure** | 119 | `const output = runtime.evaluatePatrimonialStructure(context, mockBP);` |
| `src/core/runtime/patrimonial-intelligence/PatrimonialIntelligenceRuntime.test.ts` | **evaluatePatrimonialStructure** | 135 | `const output = runtime.evaluatePatrimonialStructure(context, mockBP);` |
| `src/core/runtime/patrimonial-intelligence/PatrimonialIntelligenceRuntime.test.ts` | **evaluatePatrimonialStructure** | 147 | `const output = runtime.evaluatePatrimonialStructure(context, mockBP);` |
| `src/core/runtime/patrimonial-intelligence/PatrimonialIntelligenceRuntime.test.ts` | **evaluatePatrimonialStructure** | 162 | `const output = runtime.evaluatePatrimonialStructure(context, mockBP);` |
| `src/core/runtime/patrimonial-intelligence/PatrimonialIntelligenceRuntime.ts` | **evaluatePatrimonialStructure** | 24 | `public evaluatePatrimonialStructure(` |
| `src/core/runtime/patrimonial-intelligence/PatrimonialIntelligenceRuntime.ts` | **generateLineageHash** | 35 | `const lineageHash = PatrimonialContextMapper.generateLineageHash(context);` |
| `src/core/runtime/performance/RuntimePerformanceMonitor.ts` | **analyzeTelemetry** | 18 | `static analyzeTelemetry(telemetry: RuntimeTelemetryData) {` |
| `src/core/runtime/performance/TenantScopedRuntimeCache.ts` | **buildKeyString** | 8 | `private buildKeyString(key: SovereignCacheKey): string {` |
| `src/core/runtime/performance/TenantScopedRuntimeCache.ts` | **buildKeyString** | 38 | `const keyString = this.buildKeyString(key);` |
| `src/core/runtime/performance/TenantScopedRuntimeCache.ts` | **buildKeyString** | 56 | `const keyString = this.buildKeyString(key);` |
| `src/core/runtime/pilot-operations/PilotObservabilityEngine.ts` | **analyzeCognitiveSignals** | 47 | `public static analyzeCognitiveSignals(` |
| `src/core/runtime/pilot-operations/PilotOperationsEngine.ts` | **evaluatePilot** | 18 | `public static evaluatePilot(` |
| `src/core/runtime/pilot-operations/ProductionReadinessAssessment.ts` | **evaluate** | 9 | `public static evaluate(` |
| `src/core/runtime/pilot-operations/ProductionReadinessAssessment.ts` | **maturityScore** | 14 | `let maturityScore = 100;` |
| `src/core/runtime/pilot-operations/ProductionReadinessAssessment.ts` | **maturityScore** | 44 | `maturityScore = 0;` |
| `src/core/runtime/pilot-operations/ProductionReadinessAssessment.ts` | **maturityScore** | 47 | `maturityScore = Math.min(maturityScore, 40);` |
| `src/core/runtime/pilot-operations/ProductionReadinessAssessment.ts` | **maturityScore** | 51 | `maturityScore = Math.max(0, Math.min(100, maturityScore));` |
| `src/core/runtime/pilot-operations/ProductionReadinessAssessment.ts` | **recommendedProductionTimeline** | 56 | `let recommendedProductionTimeline = '';` |
| `src/core/runtime/pilot-operations/ProductionReadinessAssessment.ts` | **recommendedProductionTimeline** | 61 | `recommendedProductionTimeline = 'Imediata liberação de chaves produtivas (Go-Liv` |
| `src/core/runtime/pilot-operations/ProductionReadinessAssessment.ts` | **recommendedProductionTimeline** | 65 | `recommendedProductionTimeline = 'Próximos 15 dias, sob acompanhamento diário do ` |
| `src/core/runtime/pilot-operations/ProductionReadinessAssessment.ts` | **recommendedProductionTimeline** | 69 | `recommendedProductionTimeline = 'Bloqueado. Reavaliar após correção das violaçõe` |
| `src/core/runtime/pilot-readiness/PilotGovernanceChecklist.ts` | **evaluate** | 4 | `static evaluate(tenantId: string): PilotGovernanceCheck[] {` |
| `src/core/runtime/predictive-governance/GovernanceMomentumEngine.ts` | **calculateMomentum** | 11 | `public static calculateMomentum(snapshots: InstitutionalSnapshot[]): MomentumOut` |
| `src/core/runtime/predictive-governance/InstitutionalEarlyWarningEngine.ts` | **generateWarnings** | 16 | `public static generateWarnings(snapshots: InstitutionalSnapshot[]): EarlyWarning` |
| `src/core/runtime/predictive-governance/InstitutionalTrajectoryEngine.ts` | **calculateTrajectory** | 10 | `public static calculateTrajectory(snapshots: InstitutionalSnapshot[]): Trajector` |
| `src/core/runtime/predictive-governance/InstitutionalTrajectoryEngine.ts` | **score** | 35 | `const score = Math.max(0, Math.min(100, 50 + overallDiff));` |
| `src/core/runtime/predictive-governance/PredictiveGovernanceScoreEngine.ts` | **GovernanceScoreClassification** | 4 | `export type GovernanceScoreClassification =` |
| `src/core/runtime/predictive-governance/PredictiveGovernanceScoreEngine.ts` | **computeScore** | 17 | `public static computeScore(snapshots: InstitutionalSnapshot[]): ScoreOutput {` |
| `src/core/runtime/predictive-governance/PredictiveGovernanceScoreEngine.ts` | **calculateTrajectory** | 27 | `const trajectory = InstitutionalTrajectoryEngine.calculateTrajectory(snapshots);` |
| `src/core/runtime/predictive-governance/PredictiveGovernanceScoreEngine.ts` | **score** | 28 | `const score = trajectory.trajectoryScore; // Derived from trajectory base logic ` |
| `src/core/runtime/predictive-governance/PredictiveGovernanceScoreEngine.ts` | **GovernanceScoreClassification** | 30 | `let classification: GovernanceScoreClassification = 'ATENCAO_PREVENTIVA';` |
| `src/core/runtime/predictive-governance/PredictiveRecommendationEngine.ts` | **generateRecommendations** | 14 | `public static generateRecommendations(snapshots: InstitutionalSnapshot[]): Recom` |
| `src/core/runtime/predictive-governance/PredictiveRecommendationEngine.ts` | **evaluateRisks** | 23 | `const riskOutput = PredictiveRiskEngine.evaluateRisks(snapshots);` |
| `src/core/runtime/predictive-governance/PredictiveRiskEngine.ts` | **evaluateRisks** | 23 | `public static evaluateRisks(snapshots: InstitutionalSnapshot[]): PredictiveRiskO` |
| `src/core/runtime/predictive-intelligence/BehavioralAccelerationEngine.ts` | **calculateAcceleration** | 20 | `public static calculateAcceleration(` |
| `src/core/runtime/predictive-intelligence/BehavioralAccelerationEngine.ts` | **calculateFatigue** | 36 | `const firstFatigue = GovernanceFatigueEngine.calculateFatigue(rolling.slice(0, M` |
| `src/core/runtime/predictive-intelligence/BehavioralAccelerationEngine.ts` | **calculateFatigue** | 37 | `const lastFatigue = GovernanceFatigueEngine.calculateFatigue(rolling, report);` |
| `src/core/runtime/predictive-intelligence/DeteriorationMomentumEngine.ts` | **calculateMomentum** | 32 | `public static calculateMomentum(` |
| `src/core/runtime/predictive-intelligence/DeteriorationMomentumEngine.ts` | **calculateCumulativeProfile** | 73 | `const profile = InstitutionalBehaviorProfileEngine.calculateCumulativeProfile(su` |
| `src/core/runtime/predictive-intelligence/DeteriorationMomentumEngine.ts` | **calculateFatigue** | 74 | `const fatigue = GovernanceFatigueEngine.calculateFatigue(subHistory, report);` |
| `src/core/runtime/predictive-intelligence/GovernanceRuptureEngine.ts` | **evaluateRupture** | 21 | `public static evaluateRupture(` |
| `src/core/runtime/predictive-intelligence/GovernanceRuptureEngine.ts` | **hasImminentRuptureScores** | 32 | `const hasImminentRuptureScores = projection.isImminentRupture;` |
| `src/core/runtime/predictive-intelligence/InstitutionalEarlyWarningEngine.ts` | **generateWarnings** | 20 | `public static generateWarnings(` |
| `src/core/runtime/predictive-intelligence/InstitutionalResilienceEngine.ts` | **evaluateResilience** | 20 | `public static evaluateResilience(` |
| `src/core/runtime/predictive-intelligence/PredictiveGovernanceEngine.ts` | **evaluatePrediction** | 39 | `public static evaluatePrediction(` |
| `src/core/runtime/predictive-intelligence/PredictiveGovernanceEngine.ts` | **calculateMomentum** | 74 | `const momentum = DeteriorationMomentumEngine.calculateMomentum(history, report, ` |
| `src/core/runtime/predictive-intelligence/PredictiveGovernanceEngine.ts` | **calculateAcceleration** | 75 | `const acceleration = BehavioralAccelerationEngine.calculateAcceleration(history,` |
| `src/core/runtime/predictive-intelligence/PredictiveGovernanceEngine.ts` | **SurvivabilityScores** | 78 | `const currentScores: SurvivabilityScores = {` |
| `src/core/runtime/predictive-intelligence/PredictiveGovernanceEngine.ts` | **forecast** | 89 | `const forecast = TrajectoryForecastEngine.forecastTrajectory(currentScores, mome` |
| `src/core/runtime/predictive-intelligence/PredictiveGovernanceEngine.ts` | **evaluateResilience** | 90 | `const resilience = InstitutionalResilienceEngine.evaluateResilience(history, rep` |
| `src/core/runtime/predictive-intelligence/PredictiveGovernanceEngine.ts` | **assessRecovery** | 91 | `const recovery = RecoveryViabilityEngine.assessRecovery(history, report, behavio` |
| `src/core/runtime/predictive-intelligence/PredictiveGovernanceEngine.ts` | **evaluateCollapseRisk** | 92 | `const collapse = StrategicCollapseRiskEngine.evaluateCollapseRisk(history, repor` |
| `src/core/runtime/predictive-intelligence/PredictiveGovernanceEngine.ts` | **evaluateRupture** | 93 | `const rupture = GovernanceRuptureEngine.evaluateRupture(projection, resilience, ` |
| `src/core/runtime/predictive-intelligence/PredictiveGovernanceEngine.ts` | **generateWarnings** | 95 | `const warnings = InstitutionalEarlyWarningEngine.generateWarnings(` |
| `src/core/runtime/predictive-intelligence/PredictiveGovernanceEngine.ts` | **simulateScenario** | 149 | `public static simulateScenario(` |
| `src/core/runtime/predictive-intelligence/PredictiveGovernanceEngine.ts` | **calculateCumulativeProfile** | 225 | `const finalProfile = InstitutionalBehaviorProfileEngine.calculateCumulativeProfi` |
| `src/core/runtime/predictive-intelligence/PredictiveGovernanceEngine.ts` | **calculateFatigue** | 226 | `const finalFatigue = GovernanceFatigueEngine.calculateFatigue(simHistory, dummyR` |
| `src/core/runtime/predictive-intelligence/PredictiveGovernanceEngine.ts` | **SurvivabilityScores** | 228 | `const finalSurvivabilityScores: SurvivabilityScores = {` |
| `src/core/runtime/predictive-intelligence/RecoveryViabilityEngine.ts` | **assessRecovery** | 22 | `public static assessRecovery(` |
| `src/core/runtime/predictive-intelligence/StrategicCollapseRiskEngine.ts` | **evaluateCollapseRisk** | 20 | `public static evaluateCollapseRisk(` |
| `src/core/runtime/predictive-intelligence/StrategicCollapseRiskEngine.ts` | **score** | 27 | `let score = 10; // start low` |
| `src/core/runtime/predictive-intelligence/SurvivabilityProjectionEngine.ts` | **SurvivabilityScores** | 30 | `const projectedScores: SurvivabilityScores = {` |
| `src/core/runtime/predictive-intelligence/TrajectoryForecastEngine.ts` | **forecastTrajectory** | 15 | `public static forecastTrajectory(` |
| `src/core/runtime/premium-ux/ExecutiveClarityEngine.ts` | **evaluate** | 4 | `static evaluate(tenantId: string, role: string): ExecutiveClarityScore {` |
| `src/core/runtime/premium-ux/InstitutionalStorytellingOptimizer.ts` | **buildNarrative** | 5 | `static buildNarrative(dataset: GoldenDatasetProfile): StorytellingNarrative {` |
| `src/core/runtime/prescriptive-governance/BoardAgendaEngine.ts` | **generateAgenda** | 5 | `static generateAgenda(` |
| `src/core/runtime/prescriptive-governance/BoardDraftingEngine.ts` | **generateResolutions** | 4 | `static generateResolutions(agenda: BoardAgenda): BoardResolution[] {` |
| `src/core/runtime/prescriptive-governance/ExecutionCapacityConstraintEngine.ts` | **evaluateCapacity** | 5 | `static evaluateCapacity(snapshots: InstitutionalSnapshot[]): InstitutionalCapaci` |
| `src/core/runtime/prescriptive-governance/ExecutionCapacityConstraintEngine.ts` | **financialScore** | 20 | `let financialScore = latest.bpHealth + latest.dfcHealth + latest.dreHealth;` |
| `src/core/runtime/prescriptive-governance/ExecutionCapacityConstraintEngine.ts` | **governanceScore** | 21 | `let governanceScore = latest.governanceScore + latest.cescfScore;` |
| `src/core/runtime/prescriptive-governance/ExecutionCapacityConstraintEngine.ts` | **capacityScore** | 42 | `const capacityScore = Math.min(100, Math.round(((financialScore / 3) + (governan` |
| `src/core/runtime/prescriptive-governance/FiduciaryPriorityEngine.ts` | **scoredActions** | 8 | `const scoredActions = actions.map(action => {` |
| `src/core/runtime/prescriptive-governance/FiduciaryPriorityEngine.ts` | **score** | 9 | `let score = 0;` |
| `src/core/runtime/prescriptive-governance/PrescriptiveActionEngine.ts` | **generateActions** | 5 | `static generateActions(riskOutput: PredictiveRiskOutput): ExecutivePriority[] {` |
| `src/core/runtime/presentation-governance/ExecutiveInformationDensityFramework.ts` | **evaluate** | 8 | `public static evaluate(layer: PresentationLayer) {` |
| `src/core/runtime/presentation-governance/OperationalSeverityGovernanceEngine.ts` | **classify** | 9 | `public static classify(score: number): { level: string; color: 'emerald' | 'ambe` |
| `src/core/runtime/profiling/ExecutionLatencyAnalyzer.ts` | **analyze** | 18 | `static analyze(snapshot: RuntimeLatencySnapshot): RuntimeLatencySnapshot {` |
| `src/core/runtime/prudency/InstitutionalPrudencyLayer.ts` | **capEvolutionScore** | 48 | `capEvolutionScore(score: number | null, cycles: number): number | null {` |
| `src/core/runtime/prudency/InstitutionalPrudencyLayer.ts` | **evaluate** | 76 | `const longitudinalGuard = LongitudinalIntelligenceGuard.evaluate(cycles);` |
| `src/core/runtime/prudency/InstitutionalPrudencyLayer.ts` | **evolutionScore** | 79 | `let evolutionScore = rawEvolutionScore;` |
| `src/core/runtime/prudency/InstitutionalPrudencyLayer.ts` | **evolutionScore** | 81 | `evolutionScore = null;` |
| `src/core/runtime/prudency/InstitutionalPrudencyLayer.ts` | **evolutionScore** | 89 | `evolutionScore = this.capEvolutionScore(rawEvolutionScore, cycles);` |
| `src/core/runtime/prudency/InstitutionalPrudencyLayer.ts` | **rawCompositeScore** | 102 | `let rawCompositeScore = rawScores.composite;` |
| `src/core/runtime/prudency/InstitutionalPrudencyLayer.ts` | **adjustedCompositeScore** | 111 | `const adjustedCompositeScore = Math.min(rawCompositeScore, cap);` |
| `src/core/runtime/publication-governance/ExecutivePublicationRuntime.ts` | **evaluatePublication** | 26 | `public static evaluatePublication(` |
| `src/core/runtime/publication-governance/ExecutivePublicationRuntime.ts` | **lineageScore** | 76 | `const lineageScore = isLineageBroken ? 0 : 100;` |
| `src/core/runtime/publication-governance/ExecutivePublicationRuntime.ts` | **integrityScore** | 77 | `const integrityScore = Math.max(0, 100 - integrityResult.errors.length * 25);` |
| `src/core/runtime/publication-governance/ExecutivePublicationRuntime.ts` | **consistencyScore** | 78 | `const consistencyScore = Math.max(0, 100 - (consistencyResult.contradictions.len` |
| `src/core/runtime/publication-governance/ExecutivePublicationRuntime.ts` | **calculateCertification** | 87 | `const { grade, complianceScore } = InstitutionalCertificationEngine.calculateCer` |
| `src/core/runtime/publication-governance/ExecutivePublicationRuntime.ts` | **generateExportSignature** | 105 | `const signatureResult = PublicationLineageEngine.generateExportSignature(report,` |
| `src/core/runtime/publication-governance/InstitutionalCertificationEngine.ts` | **calculateCertification** | 10 | `public static calculateCertification(` |
| `src/core/runtime/publication-governance/InstitutionalCertificationEngine.ts` | **complianceScore** | 17 | `const complianceScore = Math.round(` |
| `src/core/runtime/publication-governance/NarrativeConsistencyEngine.ts` | **recommendedPath** | 18 | `const recommendedPath = recs.recommendedPath ?? 'Controlled Growth';` |
| `src/core/runtime/publication-governance/NarrativeConsistencyEngine.ts` | **recommendedPath** | 19 | `const isGrowthOrExpansion = recommendedPath === 'Controlled Growth' || recommend` |
| `src/core/runtime/publication-governance/PublicationLineageEngine.ts` | **generateExportSignature** | 10 | `public static generateExportSignature(` |
| `src/core/runtime/reality-validation/IntercompanyComplexitySimulator.ts` | **simulate** | 5 | `static simulate(tenantId: string, dataset: GoldenDatasetProfile): {` |
| `src/core/runtime/reality-validation/OperationalStressDatasetBuilder.ts` | **buildStressProfile** | 5 | `static buildStressProfile(tenantId: string, dataset: GoldenDatasetProfile): {` |
| `src/core/runtime/recovery-regression/RecoveryRegressionGuardEngine.ts` | **evaluate** | 9 | `public static evaluate(input: RegressionEvaluationInput): RecoveryRegressionOutp` |
| `src/core/runtime/recovery-regression/RecoveryRegressionGuardEngine.ts` | **generateFailClosedOutput** | 18 | `return this.generateFailClosedOutput(auditTrail);` |
| `src/core/runtime/recovery-regression/RecoveryRegressionGuardEngine.ts` | **adjustedStabilityScore** | 51 | `let adjustedStabilityScore = stabilityResult.recoveryStabilityScore;` |
| `src/core/runtime/recovery-regression/RecoveryRegressionGuardEngine.ts` | **adjustedStabilityScore** | 57 | `adjustedStabilityScore = Math.max(0, adjustedStabilityScore - 15);` |
| `src/core/runtime/recovery-regression/RecoveryRegressionGuardEngine.ts` | **adjustedStabilityScore** | 61 | `adjustedStabilityScore = Math.min(100, adjustedStabilityScore + 10);` |
| `src/core/runtime/recovery-regression/RecoveryRegressionGuardEngine.ts` | **calculateDowngrade** | 75 | `const stageRegressionResult = RecoveryStageRegressionEngine.calculateDowngrade(` |
| `src/core/runtime/recovery-regression/RecoveryRegressionGuardEngine.ts` | **generateFailClosedOutput** | 118 | `private static generateFailClosedOutput(auditTrail: string[]): RecoveryRegressio` |
| `src/core/runtime/recovery-regression/RecoveryStabilityMonitoringEngine.ts` | **score** | 15 | `let score = 100;` |
| `src/core/runtime/recovery-regression/RecoveryStabilityMonitoringEngine.ts` | **score** | 52 | `score = Math.max(0, score);` |
| `src/core/runtime/recovery-regression/RecoveryStageRegressionEngine.ts` | **calculateDowngrade** | 13 | `public static calculateDowngrade(` |
| `src/core/runtime/reporting/ExecutiveBoardPackBuilder.ts` | **build** | 13 | `static build(` |
| `src/core/runtime/reporting/GovernanceAuditReportBuilder.ts` | **build** | 5 | `static build(` |
| `src/core/runtime/reporting/InstitutionalReportBuilder.ts` | **build** | 10 | `static build(` |
| `src/core/runtime/reporting/ScenarioStressReportBuilder.ts` | **build** | 5 | `static build(` |
| `src/core/runtime/reports/ExecutiveBoardReportEngine.ts` | **generateReport** | 34 | `public generateReport(` |
| `src/core/runtime/reports/ExecutiveBoardReportEngine.ts` | **generatedAt** | 42 | `const generatedAt = new Date().toISOString();` |
| `src/core/runtime/reports/ExecutiveBoardReportEngine.ts` | **calculateAssessment** | 45 | `const esgim = esgimAssessmentEngine.calculateAssessment(clientId, mode, scenario` |
| `src/core/runtime/reports/ExecutiveBoardReportEngine.ts` | **calculateResilience** | 46 | `const iri = institutionalResilienceIndexEngine.calculateResilience(clientId, mod` |
| `src/core/runtime/reports/ExecutiveBoardReportEngine.ts` | **generatePriorities** | 47 | `const prioritiesData = boardPrioritiesEngine.generatePriorities(clientId, mode, ` |
| `src/core/runtime/reports/ExecutiveBoardReportEngine.ts` | **generateRoadmap** | 48 | `const roadmap = governanceRoadmapEngine.generateRoadmap(clientId, mode, scenario` |
| `src/core/runtime/reports/ExecutiveBoardReportEngine.ts` | **calculateMonitoring** | 49 | `const monitoring = governanceMonitoringEngine.calculateMonitoring(clientId, mode` |
| `src/core/runtime/reports/ExecutiveBoardReportEngine.ts` | **overallAssessment** | 140 | `const overallAssessment =` |
| `src/core/runtime/reports/ExecutiveBoardReportEngine.ts` | **calculateGeiSimpleScore** | 354 | `const geiSimple = decisionRegistryEngine.calculateGeiSimpleScore(scenario);` |
| `src/core/runtime/reports/ExecutiveBoardReportEngine.ts` | **calculateGeiWeightedScore** | 355 | `const geiWeighted = decisionRegistryEngine.calculateGeiWeightedScore(scenario);` |
| `src/core/runtime/reports/ExecutiveBoardReportEngine.ts` | **calculateGaiScore** | 356 | `const gai = decisionRegistryEngine.calculateGaiScore(scenario);` |
| `src/core/runtime/reports/ExecutiveBoardReportEngine.ts` | **calculateOverdueRate** | 357 | `const overdueRate = decisionRegistryEngine.calculateOverdueRate(scenario);` |
| `src/core/runtime/reports/ExecutiveBoardReportEngine.ts` | **calculateAgingBuckets** | 358 | `const aging = decisionRegistryEngine.calculateAgingBuckets(scenario);` |
| `src/core/runtime/reports/ExecutiveBoardReportEngine.ts` | **evaluateReadiness** | 373 | `const readiness = benchmarkReadinessEngine.evaluateReadiness(clientId || 'GLOBAL` |
| `src/core/runtime/reports/ExecutiveBoardReportEngine.ts` | **calculateComparison** | 374 | `const comparison = benchmarkComparativeEngine.calculateComparison(clientId || 'G` |
| `src/core/runtime/reports/ExecutiveBoardReportEngine.ts` | **evaluateAdvisory** | 375 | `const advisory = benchmarkAdvisoryEngine.evaluateAdvisory(clientId || 'GLOBAL', ` |
| `src/core/runtime/reports/ExecutiveBoardReportEngine.ts` | **calculateLearning** | 377 | `const learningResult = governanceLearningEngine.calculateLearning(clientId || 'G` |
| `src/core/runtime/reports/ExecutiveBoardReportEngine.ts` | **generateJourney** | 408 | `journeyOverview: governanceJourneyEngine.generateJourney(clientId || 'GLOBAL', m` |
| `src/core/runtime/reports/ExecutiveBoardReportPDF.ts` | **generatePDF** | 10 | `public static generatePDF(report: ExecutiveBoardReport): jsPDF {` |
| `src/core/runtime/roadmap/GovernanceRoadmapEngine.ts` | **generateRoadmap** | 25 | `public generateRoadmap(` |
| `src/core/runtime/roadmap/GovernanceRoadmapEngine.ts` | **generatePriorities** | 31 | `const prioritiesData = boardPrioritiesEngine.generatePriorities(clientId, mode, ` |
| `src/core/runtime/roadmap/GovernanceRoadmapEngine.ts` | **Score** | 252 | `benchmarkTierImpact = "Qualificação fiduciária com Advisory Confidence Score (AC` |
| `src/core/runtime/roadmap/GovernanceRoadmapEngine.ts` | **generateRoadmapSummary** | 272 | `executiveSummary: this.generateRoadmapSummary(maturityStage, scenario),` |
| `src/core/runtime/roadmap/GovernanceRoadmapEngine.ts` | **generateRoadmapSummary** | 287 | `private generateRoadmapSummary(` |
| `src/core/runtime/scenario/PredictiveStressEngine.ts` | **evaluateStress** | 9 | `static evaluateStress(stressedInput: ConsolidatedFinancialInput) {` |
| `src/core/runtime/scenario/ScenarioFiduciarySimulator.ts` | **generateHash** | 28 | `const snapshotHash = ScenarioSnapshotBuilder.generateHash(input.baseSnapshot);` |
| `src/core/runtime/scenario/ScenarioFiduciarySimulator.ts` | **buildClone** | 29 | `const isolatedSnapshot = ScenarioSnapshotBuilder.buildClone(input.baseSnapshot);` |
| `src/core/runtime/scenario/ScenarioFiduciarySimulator.ts` | **generateNarrative** | 213 | `const narrative = ScenarioNarrativeEngine.generateNarrative(input.shocks, propag` |
| `src/core/runtime/scenario/ScenarioNarrativeEngine.ts` | **generateNarrative** | 8 | `static generateNarrative(shocks: ScenarioShock[], propagation: ScenarioPropagati` |
| `src/core/runtime/scenario/ScenarioPropagationRuntime.ts` | **evaluateStress** | 12 | `const rawStress = PredictiveStressEngine.evaluateStress(stressedInput);` |
| `src/core/runtime/scenario/ScenarioSnapshotBuilder.ts` | **buildClone** | 8 | `static buildClone(input: ConsolidatedFinancialInput): ConsolidatedFinancialInput` |
| `src/core/runtime/scenario/ScenarioSnapshotBuilder.ts` | **generateHash** | 14 | `static generateHash(input: ConsolidatedFinancialInput): string {` |
| `src/core/runtime/scenario-intelligence/InstitutionalScenarioEngine.ts` | **evaluateScenario** | 10 | `public static evaluateScenario(inputs: ScenarioInput[], contextData: any): Insti` |
| `src/core/runtime/scenario-intelligence/InstitutionalScenarioEngine.ts` | **simulate** | 20 | `const propagationProfile = PropagationSimulationEngine.simulate(inputs, contextD` |
| `src/core/runtime/scenario-intelligence/InstitutionalScenarioEngine.ts` | **generatePayload** | 30 | `const explainability = ScenarioExplainabilityEngine.generatePayload(contextData,` |
| `src/core/runtime/scenario-intelligence/InstitutionalStressTestEngine.ts` | **resilienceScore** | 18 | `let resilienceScore = 100;` |
| `src/core/runtime/scenario-intelligence/InstitutionalStressTestEngine.ts` | **resilienceScore** | 39 | `resilienceScore = Math.max(0, resilienceScore);` |
| `src/core/runtime/scenario-intelligence/PropagationSimulationEngine.ts` | **simulate** | 5 | `public static simulate(inputs: ScenarioInput[], contextData: any): PropagationSi` |
| `src/core/runtime/scenario-intelligence/PropagationSimulationEngine.ts` | **integrityScore** | 8 | `let integrityScore = 100;` |
| `src/core/runtime/scenario-intelligence/ScenarioExplainabilityEngine.ts` | **generatePayload** | 6 | `public static generatePayload(` |
| `src/core/runtime/scenario-intelligence/ScenarioHashFramework.ts` | **generateHash** | 5 | `public static generateHash(` |
| `src/core/runtime/scenario-intelligence/ScenarioImpactRuntime.ts` | **evaluate** | 13 | `public static evaluate(` |
| `src/core/runtime/scenario-intelligence/ScenarioImpactRuntime.ts` | **generateHash** | 30 | `const scenarioHash = ScenarioHashFramework.generateHash(` |
| `src/core/runtime/scenario-intelligence/ScenarioStabilityEngine.ts` | **structuralIntegrityScore** | 11 | `p.structuralIntegrityScore = 20; // Hard floor to avoid panic signaling when thi` |
| `src/core/runtime/scenario-intelligence/ThesisFutureImpactEngine.ts` | **evaluate** | 11 | `public static evaluate(` |
| `src/core/runtime/scenario-simulation/GovernanceForecastEngine.ts` | **generateForecast** | 33 | `public static generateForecast(input: SimulationInput): ForecastOutput {` |
| `src/core/runtime/scenario-simulation/GovernanceForecastEngine.ts` | **generatedAt** | 39 | `const generatedAt = new Date().toISOString();` |
| `src/core/runtime/scenario-simulation/GovernanceForecastEngine.ts` | **forecastConfidence** | 45 | `forecastConfidence = 'INSUFFICIENT_HISTORY';` |
| `src/core/runtime/scenario-simulation/GovernanceForecastEngine.ts` | **forecastConfidence** | 148 | `forecastConfidence === 'INSUFFICIENT_HISTORY'` |
| `src/core/runtime/scenario-simulation/PropagationSimulationEngine.ts` | **calculateContagion** | 11 | `public static calculateContagion(` |
| `src/core/runtime/scenario-simulation/ScenarioMacroProjectionEngine.ts` | **generatedAt** | 21 | `const generatedAt = new Date().toISOString();` |
| `src/core/runtime/scenario-simulation/ScenarioMacroProjectionEngine.ts` | **projectedScore** | 111 | `let projectedScore = Math.min(100, Math.max(10, impliedRisk * scenarioMultiplier` |
| `src/core/runtime/scenario-simulation/ScenarioMacroProjectionEngine.ts` | **projectedScore** | 113 | `projectedScore = Math.min(100, projectedScore + 15); // penalidade por falta de ` |
| `src/core/runtime/scenario-simulation/ScenarioMacroProjectionEngine.ts` | **calculatedVelocity** | 116 | `const calculatedVelocity = Number((historicalVelocity * scenarioMultiplier * hor` |
| `src/core/runtime/scenario-simulation/StrategicDecisionSandbox.ts` | **generatedAt** | 26 | `const generatedAt = new Date().toISOString();` |
| `src/core/runtime/scenario-simulation/StrategicDecisionSandbox.ts` | **simulatedOutput** | 108 | `const simulatedOutput = ScenarioMacroProjectionEngine.run(clonedInput);` |
| `src/core/runtime/segment-intelligence/SegmentThresholdEngine.ts` | **evaluateCurrentLiquidity** | 20 | `static evaluateCurrentLiquidity(segmentCode: SegmentCode, liquidityRatio: number` |
| `src/core/runtime/segment-intelligence/SegmentThresholdEngine.ts` | **evaluateInventoryDependency** | 34 | `static evaluateInventoryDependency(segmentCode: SegmentCode, inventoryToAssetsRa` |
| `src/core/runtime/segment-intelligence/SegmentThresholdEngine.ts` | **evaluateShortTermDebtPressure** | 49 | `static evaluateShortTermDebtPressure(segmentCode: SegmentCode, shortTermDebtToAs` |
| `src/core/runtime/segment-intelligence/SegmentThresholdEngine.ts` | **evaluateCashReserveDays** | 63 | `static evaluateCashReserveDays(segmentCode: SegmentCode, cashReserveDays: number` |
| `src/core/runtime/semantic/EarlyStageSemanticEngine.ts` | **evaluateContext** | 19 | `public static evaluateContext(params: LifecycleClassificationParams): EarlyStage` |
| `src/core/runtime/semantic/EarlyStageSemanticEngine.ts` | **classify** | 20 | `const lifecycleStage = LifecycleClassificationEngine.classify(params);` |
| `src/core/runtime/semantic/EarlyStageSemanticEngine.ts` | **generateNarrative** | 38 | `public static generateNarrative(lifecycleStage: LifecycleStage, defaultNarrative` |
| `src/core/runtime/semantic/LifecycleClassificationEngine.ts` | **classify** | 10 | `public static classify(params: LifecycleClassificationParams): LifecycleStage {` |
| `src/core/runtime/semantic/RunwayAuditEngine.ts` | **calculate** | 11 | `public static calculate(` |
| `src/core/runtime/semantic/RunwayDisclosureEngine.ts` | **calculate** | 2 | `static calculate(cashAvailable: number, operationalCashBurn: number, periodBase:` |
| `src/core/runtime/semantic-consistency/ConsistencyTrendEngine.ts` | **evaluateTrend** | 16 | `public static evaluateTrend(history: ConsistencyDataPoint[]): ConsistencyTrend {` |
| `src/core/runtime/semantic-consistency/CrossEngineSemanticConsistencyEngine.ts` | **evaluate** | 33 | `public static evaluate(outputs: EngineSemanticOutput[]): SemanticConsistencyResu` |
| `src/core/runtime/semantic-consistency/CrossEngineSemanticConsistencyEngine.ts` | **score** | 97 | `let score = 100 - (criticalCount * 30) - (majorCount * 15) - (minorCount * 5);` |
| `src/core/runtime/semantic-consistency/CrossEngineSemanticConsistencyEngine.ts` | **score** | 98 | `if (score < 0) score = 0;` |
| `src/core/runtime/semantic-consistency/ExecutiveConsistencyReportEngine.ts` | **generateReport** | 13 | `public static generateReport(outputs: EngineSemanticOutput[]): ExecutiveConsiste` |
| `src/core/runtime/semantic-consistency/ExecutiveConsistencyReportEngine.ts` | **evaluate** | 15 | `const consistencyResult = CrossEngineSemanticConsistencyEngine.evaluate(outputs)` |
| `src/core/runtime/semantic-consistency/ExecutiveConsistencyReportEngine.ts` | **evaluate** | 19 | `const narrativeStatus = NarrativeConsistencyEngine.evaluate(narratives);` |
| `src/core/runtime/semantic-consistency/ExecutiveConsistencyReportEngine.ts` | **generateCausalExplanation** | 22 | `const causalNarrative = InstitutionalCausalAlignmentEngine.generateCausalExplana` |
| `src/core/runtime/semantic-consistency/InstitutionalCausalAlignmentEngine.ts` | **generateCausalExplanation** | 8 | `public static generateCausalExplanation(conflicts: SemanticConflict[]): string {` |
| `src/core/runtime/semantic-consistency/NarrativeConsistencyEngine.ts` | **evaluate** | 11 | `public static evaluate(narratives: string[]): NarrativeStatus {` |
| `src/core/runtime/strategic-intelligence/CapitalStrategyAlignmentEngine.ts` | **evaluate** | 6 | `static evaluate(` |
| `src/core/runtime/strategic-intelligence/ExpansionSustainabilityEngine.ts` | **evaluate** | 6 | `static evaluate(context: StrategicEvaluationContext, posture: StrategicPosture):` |
| `src/core/runtime/strategic-intelligence/InstitutionalStrategicIntelligenceRuntime.ts` | **evaluate** | 17 | `static evaluate(report: ExecutiveIntelligenceReport): InstitutionalStrategicInte` |
| `src/core/runtime/strategic-intelligence/InstitutionalStrategicIntelligenceRuntime.ts` | **evaluate** | 20 | `const posture = StrategicPostureEngine.evaluate(context);` |
| `src/core/runtime/strategic-intelligence/InstitutionalStrategicIntelligenceRuntime.ts` | **evaluate** | 21 | `const vector = InstitutionalVectorEngine.evaluate(context);` |
| `src/core/runtime/strategic-intelligence/InstitutionalStrategicIntelligenceRuntime.ts` | **evaluate** | 22 | `const contradictions = StrategicContradictionEngine.evaluate(context, posture);` |
| `src/core/runtime/strategic-intelligence/InstitutionalStrategicIntelligenceRuntime.ts` | **evaluate** | 23 | `const sustainability = ExpansionSustainabilityEngine.evaluate(context, posture);` |
| `src/core/runtime/strategic-intelligence/InstitutionalStrategicIntelligenceRuntime.ts` | **evaluate** | 24 | `const trajectory = LongitudinalTrajectoryEngine.evaluate(context, vector.directi` |
| `src/core/runtime/strategic-intelligence/InstitutionalStrategicIntelligenceRuntime.ts` | **evaluate** | 25 | `const capitalAlignment = CapitalStrategyAlignmentEngine.evaluate(context, postur` |
| `src/core/runtime/strategic-intelligence/InstitutionalStrategicIntelligenceRuntime.ts` | **evaluate** | 27 | `const thesis = StrategicInstitutionalThesisEngine.evaluate(` |
| `src/core/runtime/strategic-intelligence/InstitutionalStrategicIntelligenceRuntime.ts` | **evaluate** | 37 | `const explainability = StrategicExplainabilityEngine.evaluate(` |
| `src/core/runtime/strategic-intelligence/InstitutionalStrategicIntelligenceRuntime.ts` | **evaluate** | 47 | `const memorySync = StrategicMemoryEngine.evaluate(context, posture, vector.direc` |
| `src/core/runtime/strategic-intelligence/InstitutionalVectorEngine.ts` | **evaluate** | 6 | `static evaluate(context: StrategicEvaluationContext): InstitutionalVector {` |
| `src/core/runtime/strategic-intelligence/LongitudinalTrajectoryEngine.ts` | **evaluate** | 6 | `static evaluate(` |
| `src/core/runtime/strategic-intelligence/StrategicContradictionEngine.ts` | **evaluate** | 6 | `static evaluate(context: StrategicEvaluationContext, posture: StrategicPosture):` |
| `src/core/runtime/strategic-intelligence/StrategicExplainabilityEngine.ts` | **evaluate** | 14 | `static evaluate(` |
| `src/core/runtime/strategic-intelligence/StrategicInstitutionalThesisEngine.ts` | **evaluate** | 16 | `static evaluate(` |
| `src/core/runtime/strategic-intelligence/StrategicMemoryEngine.ts` | **evaluate** | 6 | `static evaluate(` |
| `src/core/runtime/strategic-intelligence/StrategicPostureEngine.ts` | **evaluate** | 6 | `static evaluate(context: StrategicEvaluationContext): StrategicPosture {` |
| `src/core/runtime/strategic-simulation/DecisionRiskBalancer.ts` | **analyzeBalance** | 4 | `static analyzeBalance(simResult: StrategicSimulationResult): { isSustainable: bo` |
| `src/core/runtime/strategic-simulation/DecisionRiskBalancer.ts` | **fragilityScore** | 6 | `const fragilityScore = simResult.risks.reduce((acc, curr) => acc + (curr.probabi` |
| `src/core/runtime/strategic-simulation/ExecutiveScenarioEngine.ts` | **simulateAndCompare** | 26 | `public static simulateAndCompare(` |
| `src/core/runtime/strategic-simulation/ExecutiveScenarioEngine.ts` | **simulate** | 45 | `const candidatePath = StrategicSimulationEngine.simulate(` |
| `src/core/runtime/strategic-simulation/ExecutiveScenarioEngine.ts` | **simulate** | 54 | `const conservativePreservation = StrategicSimulationEngine.simulate(` |
| `src/core/runtime/strategic-simulation/ExecutiveScenarioEngine.ts` | **simulate** | 61 | `const controlledGrowth = StrategicSimulationEngine.simulate(` |
| `src/core/runtime/strategic-simulation/ExecutiveScenarioEngine.ts` | **simulate** | 68 | `const survivalStabilization = StrategicSimulationEngine.simulate(` |
| `src/core/runtime/strategic-simulation/ExecutiveScenarioEngine.ts` | **recommendedPathInstance** | 82 | `const recommendedPathInstance = [` |
| `src/core/runtime/strategic-simulation/ExecutiveScenarioEngine.ts` | **calculateUncertainty** | 89 | `const uncertainty = StrategicPathComparisonEngine.calculateUncertainty(recommend` |
| `src/core/runtime/strategic-simulation/GovernanceImpactSimulationEngine.ts` | **scores** | 16 | `report.scores = { financial: 70, operational: 70, governance: 70, structural: 70` |
| `src/core/runtime/strategic-simulation/GovernanceImpactSimulationEngine.ts` | **govScore** | 19 | `let govScore = report.scores.governance ?? 70;` |
| `src/core/runtime/strategic-simulation/GovernanceImpactSimulationEngine.ts` | **structuralScore** | 20 | `let structuralScore = report.scores.structural ?? 70;` |
| `src/core/runtime/strategic-simulation/GovernanceImpactSimulationEngine.ts` | **govScore** | 25 | `govScore = Math.min(100, govScore + 3);` |
| `src/core/runtime/strategic-simulation/GovernanceImpactSimulationEngine.ts` | **structuralScore** | 26 | `structuralScore = Math.min(100, structuralScore + 4);` |
| `src/core/runtime/strategic-simulation/GovernanceImpactSimulationEngine.ts` | **govScore** | 34 | `govScore = Math.min(100, govScore + 1);` |
| `src/core/runtime/strategic-simulation/GovernanceImpactSimulationEngine.ts` | **structuralScore** | 35 | `structuralScore = Math.min(100, structuralScore + 1);` |
| `src/core/runtime/strategic-simulation/GovernanceImpactSimulationEngine.ts` | **govScore** | 40 | `govScore = Math.min(100, govScore + 4);` |
| `src/core/runtime/strategic-simulation/GovernanceImpactSimulationEngine.ts` | **structuralScore** | 41 | `structuralScore = Math.min(100, structuralScore + 3);` |
| `src/core/runtime/strategic-simulation/GovernanceImpactSimulationEngine.ts` | **govScore** | 49 | `govScore = Math.max(0, govScore - 5);` |
| `src/core/runtime/strategic-simulation/GovernanceImpactSimulationEngine.ts` | **structuralScore** | 50 | `structuralScore = Math.max(0, structuralScore - 5);` |
| `src/core/runtime/strategic-simulation/GovernanceImpactSimulationEngine.ts` | **govScore** | 58 | `govScore = Math.max(0, govScore - 3);` |
| `src/core/runtime/strategic-simulation/GovernanceImpactSimulationEngine.ts` | **structuralScore** | 59 | `structuralScore = Math.max(0, structuralScore - 8);` |
| `src/core/runtime/strategic-simulation/GovernanceImpactSimulationEngine.ts` | **govScore** | 67 | `govScore = Math.max(0, govScore - 1);` |
| `src/core/runtime/strategic-simulation/GovernanceTradeoffAnalyzer.ts` | **analyzeTradeoffs** | 4 | `static analyzeTradeoffs(input: StrategicSimulationInput, impacts: DecisionImpact` |
| `src/core/runtime/strategic-simulation/InstitutionalOptimizationEngine.ts` | **scores** | 24 | `const scores = path.finalSurvivabilityScores;` |
| `src/core/runtime/strategic-simulation/InstitutionalOptimizationEngine.ts` | **calculateRecoveryViability** | 54 | `const aRecovery = ResilienceOptimizationEngine.calculateRecoveryViability(a);` |
| `src/core/runtime/strategic-simulation/InstitutionalOptimizationEngine.ts` | **calculateRecoveryViability** | 55 | `const bRecovery = ResilienceOptimizationEngine.calculateRecoveryViability(b);` |
| `src/core/runtime/strategic-simulation/InstitutionalOptimizationEngine.ts` | **scoreA** | 57 | `const scoreA =` |
| `src/core/runtime/strategic-simulation/InstitutionalOptimizationEngine.ts` | **scoreB** | 63 | `const scoreB =` |
| `src/core/runtime/strategic-simulation/InstitutionalPreservationEngine.ts` | **scores** | 17 | `const scores = path.finalSurvivabilityScores;` |
| `src/core/runtime/strategic-simulation/InstitutionalResilienceProjector.ts` | **preDecisionScore** | 5 | `const preDecisionScore = 0.72; // Mock base` |
| `src/core/runtime/strategic-simulation/LiquidityTrajectoryEngine.ts` | **calculateRunway** | 10 | `public static calculateRunway(report: any): number {` |
| `src/core/runtime/strategic-simulation/ResilienceOptimizationEngine.ts` | **calculateRecoveryViability** | 13 | `public static calculateRecoveryViability(path: SimulatedPath): number {` |
| `src/core/runtime/strategic-simulation/ResilienceOptimizationEngine.ts` | **rawScore** | 28 | `const rawScore = Math.round(compositeWeight + fatigueWeight + runwayWeight);` |
| `src/core/runtime/strategic-simulation/ResilienceOptimizationEngine.ts` | **calculateRecoveryViability** | 37 | `const targetResilience = this.calculateRecoveryViability(path);` |
| `src/core/runtime/strategic-simulation/ScenarioStressEngine.ts` | **financialScoreReduction** | 23 | `let financialScoreReduction = 0;` |
| `src/core/runtime/strategic-simulation/ScenarioStressEngine.ts` | **operationalScoreReduction** | 24 | `let operationalScoreReduction = 0;` |
| `src/core/runtime/strategic-simulation/ScenarioStressEngine.ts` | **financialScoreReduction** | 30 | `financialScoreReduction = 10;` |
| `src/core/runtime/strategic-simulation/ScenarioStressEngine.ts` | **operationalScoreReduction** | 31 | `operationalScoreReduction = 5;` |
| `src/core/runtime/strategic-simulation/ScenarioStressEngine.ts` | **financialScoreReduction** | 37 | `financialScoreReduction = 20;` |
| `src/core/runtime/strategic-simulation/ScenarioStressEngine.ts` | **operationalScoreReduction** | 38 | `operationalScoreReduction = 10;` |
| `src/core/runtime/strategic-simulation/ScenarioStressEngine.ts` | **financialScoreReduction** | 44 | `financialScoreReduction = 35;` |
| `src/core/runtime/strategic-simulation/ScenarioStressEngine.ts` | **operationalScoreReduction** | 45 | `operationalScoreReduction = 20;` |
| `src/core/runtime/strategic-simulation/ScenarioStressEngine.ts` | **generateHash** | 91 | `const traceHash = this.generateHash(traceString);` |
| `src/core/runtime/strategic-simulation/ScenarioStressEngine.ts` | **generateHash** | 103 | `public static generateHash(str: string): string {` |
| `src/core/runtime/strategic-simulation/ScenarioTradeoffEngine.ts` | **analyzeDeltas** | 25 | `public static analyzeDeltas(` |
| `src/core/runtime/strategic-simulation/StrategicDecisionSimulator.ts` | **simulate** | 13 | `static simulate(input: StrategicSimulationInput): StrategicSimulationResult | nu` |
| `src/core/runtime/strategic-simulation/StrategicDecisionSimulator.ts` | **analyzeTradeoffs** | 38 | `const tradeoffs = GovernanceTradeoffAnalyzer.analyzeTradeoffs(input, impacts);` |
| `src/core/runtime/strategic-simulation/StrategicPathComparisonEngine.ts` | **buildMatrixRow** | 28 | `this.buildMatrixRow(candidate),` |
| `src/core/runtime/strategic-simulation/StrategicPathComparisonEngine.ts` | **buildMatrixRow** | 29 | `this.buildMatrixRow(conservative),` |
| `src/core/runtime/strategic-simulation/StrategicPathComparisonEngine.ts` | **buildMatrixRow** | 30 | `this.buildMatrixRow(growth),` |
| `src/core/runtime/strategic-simulation/StrategicPathComparisonEngine.ts` | **buildMatrixRow** | 31 | `this.buildMatrixRow(survival)` |
| `src/core/runtime/strategic-simulation/StrategicPathComparisonEngine.ts` | **buildMatrixRow** | 38 | `private static buildMatrixRow(path: SimulatedPath): ComparisonMatrixRow {` |
| `src/core/runtime/strategic-simulation/StrategicPathComparisonEngine.ts` | **calculateUncertainty** | 80 | `public static calculateUncertainty(path: SimulatedPath): { min: number; max: num` |
| `src/core/runtime/strategic-simulation/StrategicPathComparisonEngine.ts` | **buildMatrixRow** | 81 | `const row = this.buildMatrixRow(path);` |
| `src/core/runtime/strategic-simulation/StrategicSimulationEngine.ts` | **simulate** | 27 | `public static simulate(` |
| `src/core/runtime/strategic-simulation/StrategicSimulationEngine.ts` | **simulatedHistory** | 42 | `simulatedHistory = JSON.parse(JSON.stringify(initialReport.historicalDecisions))` |
| `src/core/runtime/strategic-simulation/StrategicSimulationEngine.ts` | **simulatedHistory** | 62 | `simulatedHistory = [...baseHistory, ...simulatedHistory];` |
| `src/core/runtime/strategic-simulation/StrategicSimulationEngine.ts` | **calculate** | 149 | `const finalSurvivabilityScores = InstitutionalSurvivabilityEngine.calculate(curr` |
| `src/core/runtime/strategic-simulation/StrategicSimulationEngine.ts` | **calculateCumulativeProfile** | 150 | `const finalProfile = InstitutionalBehaviorProfileEngine.calculateCumulativeProfi` |
| `src/core/runtime/strategic-simulation/StrategicSimulationEngine.ts` | **calculateFatigue** | 155 | `const finalFatigue = GovernanceFatigueEngine.calculateFatigue(simulatedHistory, ` |
| `src/core/runtime/strategic-simulation/StrategicSimulationEngine.ts` | **calculateRunway** | 156 | `const liquidityRunwayCycles = LiquidityTrajectoryEngine.calculateRunway(currentR` |
| `src/core/runtime/strategic-simulation/StrategicSimulationEngine.ts` | **generateHash** | 184 | `const traceHash = ScenarioStressEngine.generateHash(hashInput);` |
| `src/core/runtime/structural-capital/InstitutionalCapitalStageClassifier.ts` | **classify** | 8 | `static classify(activeSignals: StructuralCapitalSignal[]): StructuralCapitalStag` |
| `src/core/runtime/structural-capital/InventoryQualityEngine.ts` | **evaluate** | 12 | `static evaluate(bpSummary: BPSummary, segmentCode: SegmentCode = 'GENERIC_OPERAT` |
| `src/core/runtime/structural-capital/OperationalLiquidityRealityEngine.ts` | **evaluate** | 12 | `static evaluate(bpSummary: BPSummary, segmentCode: SegmentCode = 'GENERIC_OPERAT` |
| `src/core/runtime/structural-capital/ShareholderExposureEngine.ts` | **evaluate** | 9 | `static evaluate(bpSummary: BPSummary): ShareholderExposureProfile {` |
| `src/core/runtime/structural-capital/StructuralCapitalOrchestrator.ts` | **analyze** | 26 | `static analyze(bpSummary: BPSummary, institutionalContext: InstitutionalContextP` |
| `src/core/runtime/structural-capital/StructuralCapitalOrchestrator.ts` | **evaluate** | 31 | `const inventory = InventoryQualityEngine.evaluate(bpSummary, segmentCode);` |
| `src/core/runtime/structural-capital/StructuralCapitalOrchestrator.ts` | **evaluate** | 32 | `const supplier = SupplierDependencyEngine.evaluate(bpSummary);` |
| `src/core/runtime/structural-capital/StructuralCapitalOrchestrator.ts` | **evaluate** | 33 | `const shareholder = ShareholderExposureEngine.evaluate(bpSummary);` |
| `src/core/runtime/structural-capital/StructuralCapitalOrchestrator.ts` | **evaluate** | 34 | `const liquidity = OperationalLiquidityRealityEngine.evaluate(bpSummary, segmentC` |
| `src/core/runtime/structural-capital/StructuralCapitalOrchestrator.ts` | **classify** | 70 | `const structuralStage = InstitutionalCapitalStageClassifier.classify(signals);` |
| `src/core/runtime/structural-capital/StructuralCapitalOrchestrator.ts` | **calculateDelta** | 85 | `const scoreAdjustment = StructuralCapitalScoreAdapter.calculateDelta(` |
| `src/core/runtime/structural-capital/StructuralCapitalScoreAdapter.ts` | **calculateDelta** | 9 | `static calculateDelta(` |
| `src/core/runtime/structural-capital/SupplierDependencyEngine.ts` | **evaluate** | 9 | `static evaluate(bpSummary: BPSummary): SupplierDependencyProfile {` |
| `src/core/runtime/structural-capital/SupplierDependencyEngine.ts` | **score** | 76 | `let score = Math.min((supplierToTotalLiabilities * 100), 100);` |
| `src/core/runtime/structural-capital/SupplierDependencyEngine.ts` | **score** | 79 | `score = Math.min(score + 20, 100);` |
| `src/core/runtime/tenancy/hardening/ScopedRuntimeResolver.ts` | **generateTenantScopedCacheKey** | 9 | `static generateTenantScopedCacheKey(context: TenantExecutionContext, baseKey: st` |
| `src/core/runtime/tenancy/hardening/ScopedRuntimeResolver.ts` | **generateTenantScopedLineageKey** | 14 | `static generateTenantScopedLineageKey(context: TenantExecutionContext, lineageNo` |
| `src/core/runtime/treasury-early-warning/TreasuryEarlyWarningEngine.ts` | **evaluate** | 4 | `public static evaluate(` |
| `src/core/runtime/treasury-intelligence/CapitalAllocationEngine.ts` | **evaluate** | 38 | `public static evaluate(` |
| `src/core/runtime/treasury-intelligence/CapitalAllocationEngine.ts` | **runwayPreservationScore** | 54 | `let runwayPreservationScore = 100;` |
| `src/core/runtime/treasury-intelligence/CapitalAllocationEngine.ts` | **runwayPreservationScore** | 56 | `runwayPreservationScore = Math.max(100 - pctOfCash * 150, 0);` |
| `src/core/runtime/treasury-intelligence/CapitalAllocationEngine.ts` | **runwayPreservationScore** | 58 | `runwayPreservationScore = Math.max(100 - pctOfCash * 50, 0);` |
| `src/core/runtime/treasury-intelligence/CapitalAllocationEngine.ts` | **fiduciaryEfficiencyScore** | 87 | `let fiduciaryEfficiencyScore = 90;` |
| `src/core/runtime/treasury-intelligence/CapitalAllocationEngine.ts` | **fiduciaryEfficiencyScore** | 89 | `fiduciaryEfficiencyScore = 40; // low efficiency to allocate growth under stress` |
| `src/core/runtime/treasury-intelligence/CapitalAllocationEngine.ts` | **fiduciaryEfficiencyScore** | 91 | `fiduciaryEfficiencyScore = 60;` |
| `src/core/runtime/treasury-intelligence/CapitalAllocationEngine.ts` | **suitabilityScore** | 105 | `let suitabilityScore = (runwayPreservationScore * 0.2) + (fiduciaryEfficiencySco` |
| `src/core/runtime/treasury-intelligence/CapitalAllocationEngine.ts` | **suitabilityScore** | 110 | `suitabilityScore = Math.round(Math.min(Math.max(suitabilityScore, 0), 100));` |
| `src/core/runtime/treasury-intelligence/CashPriorityEngine.ts` | **evaluate** | 17 | `public static evaluate(input: CashPriorityEvaluationInput): CashPriorityOutput {` |
| `src/core/runtime/treasury-intelligence/CashPriorityEngine.ts` | **payrollPriorityScore** | 21 | `let payrollPriorityScore = 70;` |
| `src/core/runtime/treasury-intelligence/CashPriorityEngine.ts` | **criticalCapexPriorityScore** | 22 | `let criticalCapexPriorityScore = 50;` |
| `src/core/runtime/treasury-intelligence/CashPriorityEngine.ts` | **reserveProtectionPriorityScore** | 23 | `let reserveProtectionPriorityScore = 40;` |
| `src/core/runtime/treasury-intelligence/CashPriorityEngine.ts` | **payrollPriorityScore** | 30 | `payrollPriorityScore = 100; // Absolute protection` |
| `src/core/runtime/treasury-intelligence/CashPriorityEngine.ts` | **criticalCapexPriorityScore** | 31 | `criticalCapexPriorityScore = 10; // Frozen/De-prioritized` |
| `src/core/runtime/treasury-intelligence/CashPriorityEngine.ts` | **reserveProtectionPriorityScore** | 32 | `reserveProtectionPriorityScore = 95; // Extreme protection` |
| `src/core/runtime/treasury-intelligence/CashPriorityEngine.ts` | **payrollPriorityScore** | 42 | `payrollPriorityScore = 90;` |
| `src/core/runtime/treasury-intelligence/CashPriorityEngine.ts` | **criticalCapexPriorityScore** | 43 | `criticalCapexPriorityScore = 30; // Reduced priority to protect cash` |
| `src/core/runtime/treasury-intelligence/CashPriorityEngine.ts` | **reserveProtectionPriorityScore** | 44 | `reserveProtectionPriorityScore = 75;` |
| `src/core/runtime/treasury-intelligence/CashPriorityEngine.ts` | **payrollPriorityScore** | 55 | `payrollPriorityScore = 70;` |
| `src/core/runtime/treasury-intelligence/CashPriorityEngine.ts` | **criticalCapexPriorityScore** | 56 | `criticalCapexPriorityScore = 60;` |
| `src/core/runtime/treasury-intelligence/CashPriorityEngine.ts` | **reserveProtectionPriorityScore** | 57 | `reserveProtectionPriorityScore = 50;` |
| `src/core/runtime/treasury-intelligence/DistributionSustainabilityEngine.ts` | **evaluate** | 28 | `public static evaluate(input: DistributionEvaluationInput): DistributionSustaina` |
| `src/core/runtime/treasury-intelligence/FiduciaryEfficiencyEngine.ts` | **evaluate** | 22 | `public static evaluate(input: EfficiencyEvaluationInput): FiduciaryEfficiencyOut` |
| `src/core/runtime/treasury-intelligence/FiduciaryEfficiencyEngine.ts` | **adjustedScore** | 35 | `let adjustedScore = baseEfficiencyScore;` |
| `src/core/runtime/treasury-intelligence/FiduciaryEfficiencyEngine.ts` | **adjustedScore** | 84 | `adjustedScore = Math.round(Math.max(adjustedScore, 0) * 10) / 10;` |
| `src/core/runtime/treasury-intelligence/ReinvestmentIntelligenceEngine.ts` | **evaluate** | 17 | `public static evaluate(input: ReinvestmentEvaluationInput): ReinvestmentIntellig` |
| `src/core/runtime/treasury-intelligence/TreasuryGovernanceEngine.ts` | **evaluate** | 24 | `public static evaluate(input: GovernanceEvaluationInput): {` |
| `src/core/runtime/treasury-intelligence/TreasuryIntelligenceRuntime.ts` | **evaluate** | 52 | `public static evaluate(input: TreasuryRuntimeInput): TreasuryIntelligenceRuntime` |
| `src/core/runtime/treasury-intelligence/TreasuryIntelligenceRuntime.ts` | **generateLineageHash** | 99 | `const treasuryLineageHash = this.generateLineageHash(hashInputs);` |
| `src/core/runtime/treasury-intelligence/TreasuryIntelligenceRuntime.ts` | **evaluate** | 103 | `const distribution = DistributionSustainabilityEngine.evaluate({` |
| `src/core/runtime/treasury-intelligence/TreasuryIntelligenceRuntime.ts` | **evaluate** | 124 | `const reinvestment = ReinvestmentIntelligenceEngine.evaluate({` |
| `src/core/runtime/treasury-intelligence/TreasuryIntelligenceRuntime.ts` | **evaluate** | 133 | `const resilience = TreasuryResilienceEngine.evaluate({` |
| `src/core/runtime/treasury-intelligence/TreasuryIntelligenceRuntime.ts` | **evaluate** | 145 | `const cashPriority = CashPriorityEngine.evaluate({` |
| `src/core/runtime/treasury-intelligence/TreasuryIntelligenceRuntime.ts` | **evaluate** | 153 | `const stressSimulations = TreasuryStressEngine.evaluate({` |
| `src/core/runtime/treasury-intelligence/TreasuryIntelligenceRuntime.ts` | **evaluate** | 176 | `const capitalPreservation = TreasuryPreservationScoringEngine.evaluate({` |
| `src/core/runtime/treasury-intelligence/TreasuryIntelligenceRuntime.ts` | **baseEfficiencyScore** | 187 | `const baseEfficiencyScore = ebitda > 0 && availableCash > 0 ? Math.min((ebitda /` |
| `src/core/runtime/treasury-intelligence/TreasuryIntelligenceRuntime.ts` | **evaluate** | 191 | `const fiduciaryEfficiency = FiduciaryEfficiencyEngine.evaluate({` |
| `src/core/runtime/treasury-intelligence/TreasuryIntelligenceRuntime.ts` | **evaluate** | 204 | `const priorityMatrix = TreasuryPriorityMatrixEngine.evaluate({` |
| `src/core/runtime/treasury-intelligence/TreasuryIntelligenceRuntime.ts` | **evaluate** | 221 | `const governance = TreasuryGovernanceEngine.evaluate({` |
| `src/core/runtime/treasury-intelligence/TreasuryIntelligenceRuntime.ts` | **generateLineageHash** | 344 | `private static generateLineageHash(inputs: any[]): string {` |
| `src/core/runtime/treasury-intelligence/TreasuryPreservationScoringEngine.ts` | **evaluate** | 18 | `public static evaluate(input: PreservationEvaluationInput): CapitalPreservationO` |
| `src/core/runtime/treasury-intelligence/TreasuryPreservationScoringEngine.ts` | **preservationScore** | 34 | `let preservationScore = 100;` |
| `src/core/runtime/treasury-intelligence/TreasuryPreservationScoringEngine.ts` | **preservationScore** | 53 | `preservationScore = Math.round(Math.min(Math.max(preservationScore, 0), 100));` |
| `src/core/runtime/treasury-intelligence/TreasuryPriorityMatrixEngine.ts` | **evaluate** | 32 | `public static evaluate(input: PriorityEvaluationInput): {` |
| `src/core/runtime/treasury-intelligence/TreasuryResilienceEngine.ts` | **evaluate** | 20 | `public static evaluate(input: ResilienceEvaluationInput): TreasuryResilienceOutp` |
| `src/core/runtime/treasury-intelligence/TreasuryStressEngine.ts` | **evaluate** | 27 | `public static evaluate(input: StressSimulationInput): TreasuryStressOutput {` |
| `src/core/runtime/treasury-intelligence/TreasuryStressEngine.ts` | **simulatedCash** | 50 | `let simulatedCash = availableCash;` |
| `src/core/runtime/treasury-intelligence/TreasuryStressEngine.ts` | **simulatedMonthlyBurn** | 51 | `let simulatedMonthlyBurn = normalizedMonthlyCashBurn > 0 ? normalizedMonthlyCash` |
| `src/core/runtime/treasury-intelligence/TreasuryStressEngine.ts` | **simulatedMonthlyBurn** | 59 | `simulatedMonthlyBurn = simulatedMonthlyBurn * 1.40;` |
| `src/core/runtime/treasury-intelligence/TreasuryStressEngine.ts` | **simulatedCash** | 77 | `simulatedCash = 0;` |
| `src/core/runtime/treasury-intelligence/TreasuryStressEngine.ts` | **dailySimulatedBurn** | 82 | `const dailySimulatedBurn = simulatedMonthlyBurn / 30;` |
| `src/core/runtime/treasury-intelligence/TreasuryStressEngine.ts` | **simulatedExhaustionProjected** | 104 | `const simulatedExhaustionProjected = cumulativeExhaustionDays < 120 || baselineE` |
| `src/core/runtime/treasury-sustainability/TreasurySustainabilityEngine.ts` | **evaluate** | 4 | `public static evaluate(` |
| `src/core/runtime/treasury-sustainability/TreasurySustainabilityEngine.ts` | **fcoScore** | 11 | `let fcoScore = 0;` |
| `src/core/runtime/treasury-sustainability/TreasurySustainabilityEngine.ts` | **fcoScore** | 13 | `fcoScore = 100;` |
| `src/core/runtime/treasury-sustainability/TreasurySustainabilityEngine.ts` | **fcoScore** | 15 | `if (runwayMonths >= 12) fcoScore = 70;` |
| `src/core/runtime/treasury-sustainability/TreasurySustainabilityEngine.ts` | **fcoScore** | 16 | `else if (runwayMonths >= 6) fcoScore = 50;` |
| `src/core/runtime/treasury-sustainability/TreasurySustainabilityEngine.ts` | **fcoScore** | 17 | `else if (runwayMonths >= 3) fcoScore = 30;` |
| `src/core/runtime/treasury-sustainability/TreasurySustainabilityEngine.ts` | **fcoScore** | 18 | `else fcoScore = 10;` |
| `src/core/runtime/treasury-sustainability/TreasurySustainabilityEngine.ts` | **runwayScore** | 22 | `let runwayScore = 0;` |
| `src/core/runtime/treasury-sustainability/TreasurySustainabilityEngine.ts` | **runwayScore** | 23 | `if (runwayMonths >= 12) runwayScore = 100;` |
| `src/core/runtime/treasury-sustainability/TreasurySustainabilityEngine.ts` | **runwayScore** | 24 | `else if (runwayMonths >= 6) runwayScore = 75;` |
| `src/core/runtime/treasury-sustainability/TreasurySustainabilityEngine.ts` | **runwayScore** | 25 | `else if (runwayMonths >= 3) runwayScore = 40;` |
| `src/core/runtime/treasury-sustainability/TreasurySustainabilityEngine.ts` | **runwayScore** | 26 | `else if (runwayMonths >= 1) runwayScore = 15;` |
| `src/core/runtime/treasury-sustainability/TreasurySustainabilityEngine.ts` | **runwayScore** | 27 | `else runwayScore = 0;` |
| `src/core/runtime/treasury-sustainability/TreasurySustainabilityEngine.ts` | **fundingScore** | 30 | `let fundingScore = 0;` |
| `src/core/runtime/treasury-sustainability/TreasurySustainabilityEngine.ts` | **fundingScore** | 31 | `if (fundingRatio <= 0.10) fundingScore = 100;` |
| `src/core/runtime/treasury-sustainability/TreasurySustainabilityEngine.ts` | **fundingScore** | 32 | `else if (fundingRatio <= 0.30) fundingScore = 80;` |
| `src/core/runtime/treasury-sustainability/TreasurySustainabilityEngine.ts` | **fundingScore** | 33 | `else if (fundingRatio <= 0.50) fundingScore = 50;` |
| `src/core/runtime/treasury-sustainability/TreasurySustainabilityEngine.ts` | **fundingScore** | 34 | `else if (fundingRatio <= 0.70) fundingScore = 20;` |
| `src/core/runtime/treasury-sustainability/TreasurySustainabilityEngine.ts` | **fundingScore** | 35 | `else fundingScore = 0;` |
| `src/core/runtime/treasury-sustainability/TreasurySustainabilityEngine.ts` | **reinvestmentScore** | 39 | `let reinvestmentScore = 0;` |
| `src/core/runtime/treasury-sustainability/TreasurySustainabilityEngine.ts` | **reinvestmentScore** | 42 | `reinvestmentScore = 100;` |
| `src/core/runtime/treasury-sustainability/TreasurySustainabilityEngine.ts` | **reinvestmentScore** | 44 | `reinvestmentScore = 70;` |
| `src/core/runtime/treasury-sustainability/TreasurySustainabilityEngine.ts` | **reinvestmentScore** | 46 | `reinvestmentScore = 40;` |
| `src/core/runtime/treasury-sustainability/TreasurySustainabilityEngine.ts` | **reinvestmentScore** | 49 | `reinvestmentScore = 10; // FCO negative makes reinvestment highly unsustainable` |
| `src/core/runtime/treasury-sustainability/TreasurySustainabilityEngine.ts` | **efsiScore** | 52 | `const efsiScore = Math.round(` |
| `src/core/runtime/treasury-sustainability/TreasurySustainabilityNarrativeEngine.ts` | **evaluate** | 5 | `public static evaluate(efsiScore: number, fco: number, runwayMonths: number): st` |
| `src/core/runtime/ux-hardening/CognitiveLoadEvaluator.ts` | **evaluate** | 5 | `static evaluate(tenantId: string): UXValidationMetrics {` |
| `src/core/runtime/ux-hardening/OperationalFrictionAnalyzer.ts` | **analyze** | 3 | `static analyze(tenantId: string): any {` |
| `src/core/runtime/validation/RealWorldValidationSuite.spec.ts` | **buildScenarioPayload** | 28 | `const payload = ValidationDatasetFactory.buildScenarioPayload(scenario);` |
| `src/core/runtime/validation/ValidationDatasetFactory.ts` | **buildScenarioPayload** | 25 | `public static buildScenarioPayload(scenario: RealWorldScenario): ConsolidatedRun` |
| `src/core/runtime/war-gaming/CrisisExplainabilityEngine.ts` | **generateProfile** | 6 | `public static generateProfile(` |
| `src/core/runtime/war-gaming/InstitutionalCollapsePropagationEngine.ts` | **simulatedReceita** | 24 | `const simulatedReceita = Math.max(0, baselineMetrics.receita * (1 - input.magnit` |
| `src/core/runtime/war-gaming/InstitutionalCollapsePropagationEngine.ts` | **simulatedMC** | 38 | `const simulatedMC = simulatedReceita * baselineMetrics.margemContribuicaoPct;` |
| `src/core/runtime/war-gaming/InstitutionalCollapsePropagationEngine.ts` | **simulatedEbitda** | 53 | `const simulatedEbitda = simulatedMC - baselineMetrics.custosFixos;` |
| `src/core/runtime/war-gaming/InstitutionalCollapsePropagationEngine.ts` | **simulatedPrazo** | 69 | `const simulatedPrazo = Math.max(0, baselineMetrics.prazoMedioFornecedores * (1 -` |
| `src/core/runtime/war-gaming/InstitutionalSurvivalThesisEngine.ts` | **evaluate** | 6 | `public static evaluate(` |
| `src/core/runtime/war-gaming/InstitutionalSurvivalThesisEngine.ts` | **score** | 11 | `let score = 100;` |
| `src/core/runtime/war-gaming/InstitutionalSurvivalThesisEngine.ts` | **score** | 42 | `score = Math.max(0, score);` |
| `src/core/runtime/war-gaming/InstitutionalWarGameEngine.ts` | **evaluate** | 78 | `const thesis = InstitutionalSurvivalThesisEngine.evaluate(treasurySurvival, node` |
| `src/core/runtime/war-gaming/InstitutionalWarGameEngine.ts` | **generateProfile** | 86 | `const explainability = CrisisExplainabilityEngine.generateProfile(` |
| `src/core/runtime/war-gaming/war-game-adapter.ts` | **executeSimulatedCrisis** | 11 | `public static executeSimulatedCrisis(` |
| `src/core/governance/__tests__/DFCCashFlowIntegrityGuard.test.ts` | **evaluate** | 27 | `const result = DFCCashBPDivergenceAudit.evaluate(1000, 500, 2000, 1500);` |
| `src/core/governance/__tests__/DFCCashFlowIntegrityGuard.test.ts` | **evaluate** | 32 | `const result = DFCCashBPDivergenceAudit.evaluate(1500, -500, 2000, 2000);` |
| `src/core/governance/__tests__/DFCCashFlowIntegrityGuard.test.ts` | **evaluate** | 39 | `const result = DFCCashBPDivergenceAudit.evaluate(1500, 2000, 2000, 2000);` |
| `src/core/governance/__tests__/Granatum2023BPIntegrationGolden.test.ts` | **recommendationText** | 21 | `const recommendationText = 'Recomendamos estancar a queima de caixa imediatament` |
| `src/core/governance/__tests__/GranatumLongitudinalGolden.test.ts` | **evaluate** | 27 | `const evalResult = BalanceSheetLongitudinalConsistencyEngine.evaluate(` |
| `src/core/governance/__tests__/GranatumLongitudinalGolden.test.ts` | **generate** | 50 | `const narrative = BalanceSheetLongitudinalNarrativeGenerator.generate(` |
| `src/core/governance/__tests__/GranatumLongitudinalGolden.test.ts` | **evaluate** | 80 | `const evalResult = BalanceSheetLongitudinalConsistencyEngine.evaluate(` |
| `src/core/governance/__tests__/InstitutionalNarrativeEngine.test.ts` | **generateCausalNarrative** | 13 | `const res = engine.generateCausalNarrative(signals, []);` |
| `src/core/governance/__tests__/InstitutionalNarrativeEngine.test.ts` | **generateCausalNarrative** | 22 | `const res = engine.generateCausalNarrative(signals, [{ sourceSignalId: 'fin', ta` |
| `src/core/governance/__tests__/SignalPriorityEngine.test.ts` | **calculatePriority** | 21 | `const resFid = engine.calculatePriority(fidSignal);` |
| `src/core/governance/__tests__/SignalPriorityEngine.test.ts` | **calculatePriority** | 22 | `const resOp = engine.calculatePriority(opSignal);` |
| `src/core/governance/__tests__/SignalPriorityEngine.test.ts` | **calculatePriority** | 35 | `const res = engine.calculatePriority(leakSignal);` |
| `src/core/governance/__tests__/SignalSuppressionEngine.test.ts` | **evaluateSignal** | 27 | `const res1 = engine.evaluateSignal(signal);` |
| `src/core/governance/__tests__/SignalSuppressionEngine.test.ts` | **evaluateSignal** | 30 | `const res2 = engine.evaluateSignal(signalDup);` |
| `src/core/governance/causality/GovernanceCascadeAnalyzer.ts` | **analyzeCascade** | 4 | `public analyzeCascade(graph: CausalRelationship[]): CausalityEngineResolution<st` |
| `src/core/governance/executive-attention/ExecutiveSignalVisibilityEngine.ts` | **determineVisibility** | 4 | `public determineVisibility(signal: GovernanceSignal, role: string): SignalEngine` |
| `src/core/governance/narrative/ExecutiveSummaryGenerator.ts` | **generate** | 4 | `public generate(causalNarrative: string): SignalEngineResolution<string> {` |
| `src/core/governance/narrative/InstitutionalNarrativeEngine.ts` | **generateCausalNarrative** | 5 | `public generateCausalNarrative(signals: GovernanceSignal[], relationships: Causa` |
| `src/core/governance/signal-hierarchy/FiduciaryCriticalityClassifier.ts` | **classify** | 4 | `public classify(signal: Partial<GovernanceSignal>): SignalEngineResolution<Fiduc` |
| `src/core/governance/signal-hierarchy/SignalPriorityEngine.ts` | **calculatePriority** | 4 | `public calculatePriority(signal: GovernanceSignal): SignalEngineResolution<numbe` |
| `src/core/governance/signal-hierarchy/SignalPriorityEngine.ts` | **score** | 9 | `let score = 0;` |
| `src/core/governance/signal-hierarchy/SignalSuppressionEngine.ts` | **evaluateSignal** | 6 | `public evaluateSignal(signal: GovernanceSignal): SignalEngineResolution<Governan` |

