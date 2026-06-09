# Tenant Sovereignty Audit v1.0

Mapeamento de vulnerabilidades potenciais e quebras de barreira fiduciária (Tenant Boundaries).

### Resumo
- **Total de Alertas:** 306
- **CRITICAL:** 33
- **REVIEW_REQUIRED:** 273

---

## CRITICAL (33)
| Arquivo | Linha | Tipo | Código |
|---|---|---|---|
| `src/components/executive/demo/ExecutiveDemoShell.tsx` | 112 | EXPLICIT_BYPASS | `Any narrative bypass has been prevented by the core validation engine.` |
| `src/core/orchestration/executiveOrchestrationEngine.ts` | 332 | EXPLICIT_BYPASS | `const bypassedBoardRecs: ExecutiveRecommendation[] = [];` |
| `src/core/orchestration/executiveOrchestrationEngine.ts` | 337 | EXPLICIT_BYPASS | `bypassedBoardRecs.push({` |
| `src/core/orchestration/executiveOrchestrationEngine.ts` | 345 | EXPLICIT_BYPASS | `...bypassedBoardRecs,` |
| `src/core/runtime/compliance/RuntimeComplianceEngine.ts` | 205 | EXPLICIT_BYPASS | `deterministicIntegrity: violations.some(v => v.labelKey.includes('bypass') || v.labelKey.includes('u` |
| `src/core/runtime/compliance/RuntimeComplianceEngine.ts` | 276 | EXPLICIT_BYPASS | `violations.push({ labelKey: 'runtime.compliance.architecture_bypass_ui_recalculation', severity: 'cr` |
| `src/core/runtime/decision-intelligence/DecisionComplianceEngine.ts` | 193 | EXPLICIT_BYPASS | `'rastreabilidade', 'matemática', 'safeguard', 'bypass',` |
| `src/core/runtime/decision-intelligence/DecisionComplianceEngine.ts` | 205 | EXPLICIT_BYPASS | `if (!isNonBypassable && (!policyContext.materiality.isMaterial || policyContext.flexibilityModifiers` |
| `src/core/runtime/decision-policy/ContextualSeverityEngine.ts` | 35 | EXPLICIT_BYPASS | `lower.includes('bypass') ||` |
| `src/core/runtime/decision-policy/DecisionPolicyEngine.ts` | 47 | EXPLICIT_BYPASS | `const bypassMinorBlocks = !materiality.isMaterial;` |
| `src/core/runtime/decision-policy/DecisionPolicyEngine.ts` | 57 | EXPLICIT_BYPASS | `bypassMinorBlocks` |
| `src/core/runtime/decision-policy/policy-types.ts` | 57 | EXPLICIT_BYPASS | `bypassMinorBlocks: boolean;` |
| `src/core/runtime/deployment-readiness/EnvironmentIntegrityValidationEngine.ts` | 47 | EXPLICIT_BYPASS | `issues.push('CRITICAL: Fail-closed protection bypassed. Confidence is not HIGH but fail-closed was n` |
| `src/core/runtime/deployment-readiness/FiduciaryReadinessAssessmentEngine.ts` | 39 | EXPLICIT_BYPASS | `issues.push('FIDUCIARY: Fail-closed safety triggers bypassed in degraded confidence states.');` |
| `src/core/runtime/deployment-readiness/FiduciaryReadinessAssessmentEngine.ts` | 59 | EXPLICIT_BYPASS | `issues.push('FIDUCIARY: Static active governance audits failed or bypassed.');` |
| `src/governance/RuntimeSelfAuditEngine.ts` | 120 | EXPLICIT_BYPASS | `report.recommendedActions.push('Bloquear release. Corrigir bypasses e violações arquiteturais report` |
| `src/runtime/adapters/InstitutionalMemoryAdapter.ts` | 323 | EXPLICIT_BYPASS | `let bypassDecay = false;` |
| `src/runtime/adapters/InstitutionalMemoryAdapter.ts` | 325 | EXPLICIT_BYPASS | `bypassDecay = currentCycle && (currentCycle.fco < 0 || currentCycle.caixaCaixa < currentCycle.shortT` |
| `src/runtime/adapters/InstitutionalMemoryAdapter.ts` | 327 | EXPLICIT_BYPASS | `bypassDecay = currentCycle && (currentCycle.ebitdaNormalizado < 0 || currentCycle.receitasNaoRecorre` |
| `src/runtime/adapters/InstitutionalMemoryAdapter.ts` | 329 | EXPLICIT_BYPASS | `bypassDecay = currentCycle && (currentCycle.passivosSocietarios > 0.05 * currentCycle.passivoCircula` |
| `src/runtime/adapters/InstitutionalMemoryAdapter.ts` | 331 | EXPLICIT_BYPASS | `bypassDecay = unresolvedCriticalCount > 0;` |
| `src/runtime/adapters/InstitutionalMemoryAdapter.ts` | 334 | EXPLICIT_BYPASS | `const weight = bypassDecay ? 1.0 : getDecayWeight(idx);` |
| `src/scripts/runAccessGovernanceAudit.ts` | 19 | EXPLICIT_BYPASS | `const bypassRegex = /(\|\|\s*true|&&\s*true)/i;` |
| `src/scripts/runAccessGovernanceAudit.ts` | 25 | EXPLICIT_BYPASS | `if (line.includes('if (currentPage ===') && bypassRegex.test(line)) {` |
| `src/scripts/runAccessGovernanceAudit.ts` | 35 | EXPLICIT_BYPASS | `console.error('Correção: Remova o bypass para garantir a integridade fiduciária e dualidade de acess` |
| `src/scripts/runAccessGovernanceAudit.ts` | 39 | EXPLICIT_BYPASS | `console.log('SUCCESS: Nenhuma violação de acesso (bypasses) detectada no roteamento.');` |
| `src/scripts/runEnterpriseValidationGovernanceAudit.ts` | 34 | EXPLICIT_BYPASS | `{ regex: /fetch\(/g, message: 'Violação: Proibido bypassar os Gatekeepers via fetch direto na UI.' }` |
| `src/scripts/runExecutiveCognitiveAudit.ts` | 41 | EXPLICIT_BYPASS | `message: 'Detecção de ordenação ou ranqueamento local executivo de prioridade/urgência (UI-driven ra` |
| `src/scripts/runExecutiveCognitiveAudit.ts` | 79 | EXPLICIT_BYPASS | `console.log('✅ Camada cognitiva livre de ranqueamento manual e bypasses de prioridade.');` |
| `src/scripts/runIntegrationGovernanceAudit.ts` | 48 | EXPLICIT_BYPASS | `{ regex: /RuntimeOrchestrator\.publish/gi, message: 'Tentativa de bypass: Publicação direta no Runti` |
| `src/scripts/runPilotOperationsAudit.ts` | 43 | EXPLICIT_BYPASS | `if (content.includes('bypassTenant') || content.includes('ignoreTenantIsolation')) {` |
| `src/scripts/runPilotOperationsAudit.ts` | 44 | EXPLICIT_BYPASS | `violations.push(`Violation in ${path.basename(filePath)}: Unsafe tenant bypass mechanisms found in c` |
| `src/scripts/runPilotOperationsAudit.ts` | 97 | EXPLICIT_BYPASS | `violations.push('Violation in ExecutiveOnboardingEngine.ts: Onboarding guide must validate sequentia` |

## REVIEW_REQUIRED (273)
| Arquivo | Linha | Tipo | Código |
|---|---|---|---|
| `src/App.tsx` | 337 | SUSPICIOUS_CLAIM | `const root = window.document.documentElement;` |
| `src/App.tsx` | 338 | SUSPICIOUS_CLAIM | `root.classList.remove('light', 'dark');` |
| `src/App.tsx` | 342 | SUSPICIOUS_CLAIM | `root.classList.add(systemTheme);` |
| `src/App.tsx` | 344 | SUSPICIOUS_CLAIM | `root.classList.add(savedTheme);` |
| `src/app/navigation.ts` | 213 | SUSPICIOUS_CLAIM | `| 'adm_root'` |
| `src/app/navigation.ts` | 214 | SUSPICIOUS_CLAIM | `| 'contabil_root'` |
| `src/app/navigation.ts` | 215 | SUSPICIOUS_CLAIM | `| 'financeira_root'` |
| `src/app/navigation.ts` | 250 | SUSPICIOUS_CLAIM | `label?: string; // deprecated: developer reference only` |
| `src/app/navigation.ts` | 259 | SUSPICIOUS_CLAIM | `group?: string; // deprecated: developer reference only` |
| `src/app/navigation.ts` | 394 | SUSPICIOUS_CLAIM | `id: 'adm_root' as any,` |
| `src/app/navigation.ts` | 395 | SUSPICIOUS_CLAIM | `label: 'Administração', labelKey: 'navigation.page.adm_root',` |
| `src/app/navigation.ts` | 402 | SUSPICIOUS_CLAIM | `id: 'contabil_root' as any,` |
| `src/app/navigation.ts` | 403 | SUSPICIOUS_CLAIM | `label: 'Contabilidade', labelKey: 'navigation.page.contabil_root',` |
| `src/app/navigation.ts` | 414 | SUSPICIOUS_CLAIM | `id: 'financeira_root' as any,` |
| `src/app/navigation.ts` | 415 | SUSPICIOUS_CLAIM | `label: 'Finanças', labelKey: 'navigation.page.financeira_root',` |
| `src/app/routes.tsx` | 327 | SUSPICIOUS_CLAIM | `if (currentPage === 'clientes' || (currentPage as string) === 'clientes_root') {` |
| `src/components/Common/Base.tsx` | 476 | SUSPICIOUS_CLAIM | `const [internalPeriodMode, setInternalPeriodMode] = React.useState<'mensal' | 'anual'>('mensal');` |
| `src/components/Common/Base.tsx` | 478 | SUSPICIOUS_CLAIM | `const periodMode = isControlled ? periodModeProp : internalPeriodMode;` |
| `src/components/ExecutivePerspectiveSection.tsx` | 172 | SUSPICIOUS_CLAIM | `const rc = intelligenceReport.causality.rootCause;` |
| `src/components/executive-command/CommandExplainabilityDrawer.tsx` | 43 | SUSPICIOUS_CLAIM | `{explainability.supportingLineageHashes.map((hash, idx) => (` |
| `src/components/executive-interaction/RuntimeLineageViewer.tsx` | 41 | SUSPICIOUS_CLAIM | `<span>{t("overlays.root_hash")} {lineageHash.substring(0, 16)}...</span>` |
| `src/components/modals/ImportFinancialModal.tsx` | 67 | SUSPICIOUS_CLAIM | `throw new Error(t("modals.import_financial.unsupported_format"));` |
| `src/components/modals/ImportFinancialModal.tsx` | 296 | SUSPICIOUS_CLAIM | `<p className="text-xs text-slate-400 mt-2">{t("modals.import_financial.supported_formats")}</p>` |
| `src/components/modals/ManualFinancialModal.tsx` | 303 | SUSPICIOUS_CLAIM | `const rootOriginal = rows.find(r => r.id === current.id);` |
| `src/components/modals/ManualFinancialModal.tsx` | 304 | SUSPICIOUS_CLAIM | `if (rootOriginal && rootOriginal.type) {` |
| `src/components/modals/ManualFinancialModal.tsx` | 305 | SUSPICIOUS_CLAIM | `inferredType = rootOriginal.type;` |
| `src/components/pages/ClientExecutiveWorkspace.tsx` | 816 | SUSPICIOUS_CLAIM | `<p className="text-xs font-semibold text-slate-300 leading-relaxed">{currentStep.data.causality?.roo` |
| `src/components/pages/DFCPage.tsx` | 747 | SUSPICIOUS_CLAIM | `internal: {` |
| `src/components/pages/DREPage.tsx` | 145 | SUSPICIOUS_CLAIM | `const rootCauseReport = (executiveReport?.metrics as any)?.dreInsights?.rootCauseReport;` |
| `src/components/pages/PortfolioPage.tsx` | 126 | SUSPICIOUS_CLAIM | `const pdfWidth = pdf.internal.pageSize.getWidth();` |
| `src/components/pages/PreferencesPage.tsx` | 40 | SUSPICIOUS_CLAIM | `const root = window.document.documentElement;` |
| `src/components/pages/PreferencesPage.tsx` | 41 | SUSPICIOUS_CLAIM | `root.classList.remove('light', 'dark');` |
| `src/components/pages/PreferencesPage.tsx` | 45 | SUSPICIOUS_CLAIM | `root.classList.add(systemTheme);` |
| `src/components/pages/PreferencesPage.tsx` | 47 | SUSPICIOUS_CLAIM | `root.classList.add(theme);` |
| `src/components/pages/RelatorioExecutivoPage.tsx` | 131 | SUSPICIOUS_CLAIM | `const pdfWidth = pdf.internal.pageSize.getWidth();` |
| `src/components/pages/SupportPage/AdminSupportPanel.tsx` | 25 | SUSPICIOUS_CLAIM | `const data = await supportService.getAllTickets();` |
| `src/components/pages/SupportPage/ClientSupportPanel.tsx` | 39 | SUSPICIOUS_CLAIM | `const data = await supportService.getUserTickets(auth.currentUser.uid);` |
| `src/components/pages/SupportPage/ClientSupportPanel.tsx` | 58 | SUSPICIOUS_CLAIM | `const result = await supportService.createTicket({` |
| `src/components/pages/SupportPage/TicketChat.tsx` | 29 | SUSPICIOUS_CLAIM | `const unsubscribe = supportService.subscribeToTicketMessages(ticket.id!, (data) => {` |
| `src/components/pages/SupportPage/TicketChat.tsx` | 51 | SUSPICIOUS_CLAIM | `attachmentUrl = await supportService.uploadTicketAttachment(ticket.id!, attachment);` |
| `src/components/pages/SupportPage/TicketChat.tsx` | 54 | SUSPICIOUS_CLAIM | `await supportService.addTicketMessage(ticket.id!, {` |
| `src/components/pages/SupportPage/TicketChat.tsx` | 67 | SUSPICIOUS_CLAIM | `await supportService.updateTicketStatus(ticket.id!, 'in_progress');` |
| `src/components/pages/SupportPage/TicketChat.tsx` | 80 | SUSPICIOUS_CLAIM | `await supportService.updateTicketStatus(ticket.id!, status);` |
| `src/components/pages/SupportPage/TicketChat.tsx` | 197 | SUSPICIOUS_CLAIM | `const isAdmin = msg.senderRole === 'master';` |
| `src/components/pages/SupportPage/TicketChat.tsx` | 202 | SUSPICIOUS_CLAIM | `<span className="text-[10px] font-medium text-foreground">{isMe ? 'Você' : isAdmin ? 'Suporte Master` |
| `src/components/pages/SupportPage/TicketChat.tsx` | 203 | SUSPICIOUS_CLAIM | `{isAdmin && !isMe && (` |
| `src/components/pages/SupportPage/TicketChat.tsx` | 215 | SUSPICIOUS_CLAIM | `: isAdmin` |
| `src/components/pages/governance/CausalityExplorerPanel.tsx` | 33 | SUSPICIOUS_CLAIM | `supportingEvidence = [],` |
| `src/components/pages/governance/CausalityExplorerPanel.tsx` | 270 | SUSPICIOUS_CLAIM | `{!isRestricted && supportingEvidence.length > 0 && (` |
| `src/components/pages/governance/CausalityExplorerPanel.tsx` | 276 | SUSPICIOUS_CLAIM | `{supportingEvidence.map((ev, i) => {` |
| `src/components/pages/governance/ExecutiveExecutionCenter.tsx` | 403 | SUSPICIOUS_CLAIM | `<td className="p-3 text-slate-400">{dec.rootFriction || 'Nenhuma'}</td>` |
| `src/components/pages/governance/ObservabilityConsolePage.tsx` | 39 | SUSPICIOUS_CLAIM | `const isSuperAdmin = session?.role === 'SUPER_ADMIN';` |
| `src/components/pages/governance/ObservabilityConsolePage.tsx` | 40 | SUSPICIOUS_CLAIM | `const hasPermission = isSuperAdmin || session?.permissions?.includes('VIEW_OBSERVABILITY');` |
| `src/components/pages/governance/ObservabilityConsolePage.tsx` | 45 | SUSPICIOUS_CLAIM | `setSelectedTenantFilter(isSuperAdmin ? 'GLOBAL' : session.tenantId);` |
| `src/components/pages/governance/ObservabilityConsolePage.tsx` | 47 | SUSPICIOUS_CLAIM | `}, [isReady, session, isSuperAdmin]);` |
| `src/components/pages/governance/ObservabilityConsolePage.tsx` | 187 | SUSPICIOUS_CLAIM | `{isSuperAdmin && (` |
| `src/components/panels/causal-intelligence/InstitutionalCausalRootCausesPanel.tsx` | 7 | SUSPICIOUS_CLAIM | `rootCauses?: CausalFactor[];` |
| `src/components/panels/causal-intelligence/InstitutionalCausalRootCausesPanel.tsx` | 10 | SUSPICIOUS_CLAIM | `export const InstitutionalCausalRootCausesPanel: React.FC<RootCausesPanelProps> = ({ rootCauses = []` |
| `src/components/panels/causal-intelligence/InstitutionalCausalRootCausesPanel.tsx` | 28 | SUSPICIOUS_CLAIM | `<h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t('causal.root_caus` |
| `src/components/panels/causal-intelligence/InstitutionalCausalRootCausesPanel.tsx` | 35 | SUSPICIOUS_CLAIM | `{rootCauses.length === 0 ? (` |
| `src/components/panels/causal-intelligence/InstitutionalCausalRootCausesPanel.tsx` | 40 | SUSPICIOUS_CLAIM | `rootCauses.map((factor, idx) => (` |
| `src/components/panels/causal-intelligence/SurvivabilityDependencyGraphPanel.tsx` | 16 | SUSPICIOUS_CLAIM | `const rootCauses = nodes.filter(n => n.type === 'ROOT_CAUSE');` |
| `src/components/panels/causal-intelligence/SurvivabilityDependencyGraphPanel.tsx` | 25 | SUSPICIOUS_CLAIM | `rootCauses.forEach((node, i) => {` |
| `src/components/panels/causal-intelligence/SurvivabilityDependencyGraphPanel.tsx` | 26 | SUSPICIOUS_CLAIM | `const spacing = height / (rootCauses.length + 1);` |
| `src/components/ui/dialog.tsx` | 40 | SUSPICIOUS_CLAIM | `"fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-` |
| `src/contexts/LanguageContext.tsx` | 118 | SUSPICIOUS_CLAIM | `'administracao': 'navigation.page.adm_root',` |
| `src/contexts/LanguageContext.tsx` | 120 | SUSPICIOUS_CLAIM | `'contabilidade': 'navigation.page.contabil_root',` |
| `src/contexts/LanguageContext.tsx` | 126 | SUSPICIOUS_CLAIM | `'financas': 'navigation.page.financeira_root',` |
| `src/core/analytics/AdoptionAnalytics.ts` | 24 | SUSPICIOUS_CLAIM | `const isSuperAdmin = context.role === 'SUPER_ADMIN';` |
| `src/core/analytics/AdoptionAnalytics.ts` | 27 | SUSPICIOUS_CLAIM | `if (!isSuperAdmin && context.tenantId !== targetTenantId) {` |
| `src/core/diagnostics/EnterpriseReadinessDiagnostics.ts` | 20 | SUSPICIOUS_CLAIM | `const isSuperAdmin = context.role === 'SUPER_ADMIN';` |
| `src/core/diagnostics/EnterpriseReadinessDiagnostics.ts` | 23 | SUSPICIOUS_CLAIM | `if (!isSuperAdmin && context.tenantId !== targetTenantId) {` |
| `src/core/executive-experience/BoardPresentationRuntime.ts` | 16 | SUSPICIOUS_CLAIM | `causalChain: { event: string; rootCause: string; impact: string };` |
| `src/core/executive-experience/BoardPresentationRuntime.ts` | 112 | SUSPICIOUS_CLAIM | `rootCause: causality?.rootCause || 'N/A',` |
| `src/core/executive-experience/ExecutiveDiagnosisComposer.ts` | 35 | SUSPICIOUS_CLAIM | `report.causality.rootCause = this.sanitize(report.causality.rootCause);` |
| `src/core/executive-experience/ExecutiveStorytellingEngine.ts` | 68 | SUSPICIOUS_CLAIM | `const { event, rootCause, strategicImpact } = report.causality;` |
| `src/core/executive-experience/ExecutiveStorytellingEngine.ts` | 71 | SUSPICIOUS_CLAIM | `narrative: `Diagnóstico: ${event}. Causa Raiz: ${rootCause}. Impacto Estratégico: ${strategicImpact}` |
| `src/core/exporting/InstitutionalReportFormatter.ts` | 39 | SUSPICIOUS_CLAIM | `- **Causa Raiz Identificada**: ${report.causality?.rootCause || 'N/A'}` |
| `src/core/presentation/contracts/executive-view-models.ts` | 11 | SUSPICIOUS_CLAIM | `internal?: {` |
| `src/core/presentation/contracts/executive-view-models.ts` | 16 | SUSPICIOUS_CLAIM | `[key: string]: unknown; // Allow extensions for specialized internal fields` |
| `src/core/presentation/mappers/executive-presentation-mapper.ts` | 42 | SUSPICIOUS_CLAIM | `internal: {` |
| `src/core/presentation/mappers/executive-presentation-mapper.ts` | 62 | SUSPICIOUS_CLAIM | `internal: {` |
| `src/core/presentation/mappers/executive-presentation-mapper.ts` | 81 | SUSPICIOUS_CLAIM | `internal: {` |
| `src/core/presentation/mappers/executive-presentation-mapper.ts` | 117 | SUSPICIOUS_CLAIM | `internal: {` |
| `src/core/presentation/mappers/executive-presentation-mapper.ts` | 130 | SUSPICIOUS_CLAIM | `internal: {` |
| `src/core/presentation/mappers/executive-presentation-mapper.ts` | 154 | SUSPICIOUS_CLAIM | `internal: {` |
| `src/core/runtime/adapters/causality-interpretation-adapter.ts` | 8 | SUSPICIOUS_CLAIM | `rootCause: string;` |
| `src/core/runtime/adapters/causality-interpretation-adapter.ts` | 31 | SUSPICIOUS_CLAIM | `rootCause: 'Dados insuficientes para identificar a causa raiz',` |
| `src/core/runtime/adapters/causality-interpretation-adapter.ts` | 56 | SUSPICIOUS_CLAIM | `const rootCause = narrativeChain.causa || 'Ciclo financeiro em estabilidade estrutural provisória.';` |
| `src/core/runtime/adapters/causality-interpretation-adapter.ts` | 93 | SUSPICIOUS_CLAIM | `rootCause,` |
| `src/core/runtime/benchmarking/BenchmarkDatasetBuilder.ts` | 14 | SUSPICIOUS_CLAIM | `_internalId: `T-VAREJO-${i}`, // Nunca sai daqui` |
| `src/core/runtime/benchmarking/BenchmarkDatasetBuilder.ts` | 26 | SUSPICIOUS_CLAIM | `_internalId: `T-AERO-${i}`,` |
| `src/core/runtime/board/BoardPrioritiesEngine.ts` | 389 | SUSPICIOUS_CLAIM | `supportingPrinciples: gklResult.principleMatches.map(pm => pm.title),` |
| `src/core/runtime/cash-intelligence/InstitutionalContinuityEngine.ts` | 103 | SUSPICIOUS_CLAIM | `continuityRiskDrivers.push('artificial_liquidity_support');` |
| `src/core/runtime/causal-intelligence/InstitutionalCausalIntelligenceRuntime.ts` | 64 | SUSPICIOUS_CLAIM | `rootCauses: [],` |
| `src/core/runtime/causal-intelligence/InstitutionalCausalIntelligenceRuntime.ts` | 81 | SUSPICIOUS_CLAIM | `rootCauses: [],` |
| `src/core/runtime/causal-intelligence/InstitutionalCausalIntelligenceRuntime.ts` | 110 | SUSPICIOUS_CLAIM | `const rootCauses = LiquidityRootCauseEngine.evaluate(` |
| `src/core/runtime/causal-intelligence/InstitutionalCausalIntelligenceRuntime.ts` | 127 | SUSPICIOUS_CLAIM | `const dependencyGraph = SurvivabilityDependencyGraph.build(rootCauses, fco, isDfcAvailable);` |
| `src/core/runtime/causal-intelligence/InstitutionalCausalIntelligenceRuntime.ts` | 130 | SUSPICIOUS_CLAIM | `const stressCascadePath = OperationalStressCascadeEngine.evaluate(rootCauses, fco, isDfcAvailable);` |
| `src/core/runtime/causal-intelligence/InstitutionalCausalIntelligenceRuntime.ts` | 147 | SUSPICIOUS_CLAIM | `causalOpinion = 'Restricted causal inference due to missing DFC. Structural evidence indicates proba` |
| `src/core/runtime/causal-intelligence/InstitutionalCausalIntelligenceRuntime.ts` | 149 | SUSPICIOUS_CLAIM | `const activeFactors = rootCauses.map(r => r.label).join(', ');` |
| `src/core/runtime/causal-intelligence/InstitutionalCausalIntelligenceRuntime.ts` | 163 | SUSPICIOUS_CLAIM | `rootCauses,` |
| `src/core/runtime/causal-intelligence/InstitutionalCausalityExplorer.ts` | 57 | SUSPICIOUS_CLAIM | `const supportingEvidence: CausalEvidence[] = [];` |
| `src/core/runtime/causal-intelligence/InstitutionalCausalityExplorer.ts` | 61 | SUSPICIOUS_CLAIM | `supportingEvidence.push(` |
| `src/core/runtime/causal-intelligence/InstitutionalCausalityExplorer.ts` | 87 | SUSPICIOUS_CLAIM | `supportingEvidence,` |
| `src/core/runtime/causal-intelligence/causal-types.ts` | 40 | SUSPICIOUS_CLAIM | `supportingEvidence: CausalEvidence[];` |
| `src/core/runtime/causal-intelligence/types.ts` | 60 | SUSPICIOUS_CLAIM | `rootCauses: CausalFactor[];` |
| `src/core/runtime/decision-intelligence/ConstitutionalDecisionRuntime.ts` | 35 | SUSPICIOUS_CLAIM | `supportingMetrics: ['FCO', 'Liquidity Score'],` |
| `src/core/runtime/decision-intelligence/ConstitutionalDecisionRuntime.ts` | 54 | SUSPICIOUS_CLAIM | `supportingMetrics: d.supportingMetrics,` |
| `src/core/runtime/decision-intelligence/ExecutiveDecisionObject.ts` | 26 | SUSPICIOUS_CLAIM | `supportingMetrics: string[];` |
| `src/core/runtime/esgim/esgimTypes.ts` | 90 | SUSPICIOUS_CLAIM | `supportingPrinciples?: string[];` |
| `src/core/runtime/executive/AdvisoryCompressionEngine.ts` | 21 | SUSPICIOUS_CLAIM | `supportingMetrics: { ...narrative.supportingMetrics },` |
| `src/core/runtime/executive/RuntimeBackedStorytelling.ts` | 10 | SUSPICIOUS_CLAIM | `supportingMetrics: RuntimeMetrics,` |
| `src/core/runtime/executive/RuntimeBackedStorytelling.ts` | 30 | SUSPICIOUS_CLAIM | `supportingMetrics,` |
| `src/core/runtime/executive/demo/ExecutiveDemoScenarioRegistry.ts` | 83 | SUSPICIOUS_CLAIM | `'Establish capital structure milestones to support equity expansion.'` |
| `src/core/runtime/executive/types.ts` | 115 | SUSPICIOUS_CLAIM | `supportingMetrics: RuntimeMetrics;` |
| `src/core/runtime/executive-command/ExecutiveCommandExplainabilityEngine.ts` | 17 | SUSPICIOUS_CLAIM | `supportingLineageHashes: [context.lineageHash],` |
| `src/core/runtime/executive-command/ExecutiveCommandExplainabilityEngine.ts` | 34 | SUSPICIOUS_CLAIM | `supportingLineageHashes: [context.lineageHash],` |
| `src/core/runtime/executive-command/executive-command-types.ts` | 73 | SUSPICIOUS_CLAIM | `supportingLineageHashes: string[];` |
| `src/core/runtime/executive-intelligence-runtime.ts` | 218 | SUSPICIOUS_CLAIM | `rootCause?: string;` |
| `src/core/runtime/executive-intelligence-runtime.ts` | 233 | SUSPICIOUS_CLAIM | `supportingEvidence?: import('./causal-intelligence/causal-types').CausalEvidence[];` |
| `src/core/runtime/executive-intelligence-runtime.ts` | 785 | SUSPICIOUS_CLAIM | `if (!baseCausality.rootCause.includes('INSUFFICIENT_DATA')) {` |
| `src/core/runtime/executive-intelligence-runtime.ts` | 786 | SUSPICIOUS_CLAIM | `baseCausality.rootCause = `Indícios apontam para: ${baseCausality.rootCause}`;` |
| `src/core/runtime/executive-intelligence-runtime.ts` | 902 | SUSPICIOUS_CLAIM | `rootCause: sanitizeNarrative(rawCausality.rootCause),` |
| `src/core/runtime/executive-intelligence-runtime.ts` | 1238 | SUSPICIOUS_CLAIM | `const internalAuditErrors: string[] = [];` |
| `src/core/runtime/executive-intelligence-runtime.ts` | 1242 | SUSPICIOUS_CLAIM | `internalAuditErrors.push('Divergência matemática detectada: Lucro Bruto.');` |
| `src/core/runtime/executive-intelligence-runtime.ts` | 1252 | SUSPICIOUS_CLAIM | `breakEvenDays, indiceConversaoOperacional, ebitda, recGrowth, ebitdaGrowth, internalAuditErrors,` |
| `src/core/runtime/executive-intelligence-runtime.ts` | 1262 | SUSPICIOUS_CLAIM | `const rootCauseReport = EBITDARootCauseEngine.evaluate(` |
| `src/core/runtime/executive-intelligence-runtime.ts` | 1284 | SUSPICIOUS_CLAIM | `internalAuditErrors.length > 0` |
| `src/core/runtime/executive-intelligence-runtime.ts` | 1355 | SUSPICIOUS_CLAIM | `(dreInsights as any).rootCauseReport = rootCauseReport;` |
| `src/core/runtime/executive-intelligence-runtime.ts` | 2638 | SUSPICIOUS_CLAIM | `causalChainPresent: !!initialReport.causality?.rootCause,` |
| `src/core/runtime/executive-orchestration/cognitive/ExecutiveNarrativeHierarchyEngine.ts` | 11 | SUSPICIOUS_CLAIM | `level2: report.causality.rootCause || 'Sem causa raiz estrutural mapeada pelo Runtime.',` |
| `src/core/runtime/governance/bp/BalanceSheetExecutiveRecommendationEngine.ts` | 7 | SUSPICIOUS_CLAIM | `rootCause: string` |
| `src/core/runtime/governance/bp/BalanceSheetExecutiveRecommendationEngine.ts` | 12 | SUSPICIOUS_CLAIM | `rationale: [rootCause, 'Capital is formally preserved.']` |
| `src/core/runtime/governance/bp/BalanceSheetExecutiveRecommendationEngine.ts` | 20 | SUSPICIOUS_CLAIM | `rationale: [rootCause]` |
| `src/core/runtime/governance/bp/BalanceSheetExecutiveRecommendationEngine.ts` | 25 | SUSPICIOUS_CLAIM | `rationale: [rootCause]` |
| `src/core/runtime/governance/bp/BalanceSheetExecutiveRecommendationEngine.ts` | 30 | SUSPICIOUS_CLAIM | `rationale: [rootCause]` |
| `src/core/runtime/governance/bp/BalanceSheetExecutiveRecommendationEngine.ts` | 35 | SUSPICIOUS_CLAIM | `rationale: [rootCause]` |
| `src/core/runtime/governance/bp/BalanceSheetExecutiveRecommendationEngine.ts` | 40 | SUSPICIOUS_CLAIM | `rationale: [rootCause]` |
| `src/core/runtime/governance/bp/BalanceSheetRootCauseAnalyzer.ts` | 30 | SUSPICIOUS_CLAIM | `cause = `BP is formally preserved. Noted external alerts from ${externalAlerts.map(e => e.source).jo` |
| `src/core/runtime/institutional-memory/GovernanceFatigueDetection.ts` | 22 | SUSPICIOUS_CLAIM | `score += 10; // Volume acts as an amplifier, not a root cause` |
| `src/core/runtime/institutional-memory/TemporalCausalityEngine.ts` | 95 | SUSPICIOUS_CLAIM | `rootCauseId: history[0].lineageHash` |
| `src/core/runtime/institutional-memory/types.ts` | 221 | SUSPICIOUS_CLAIM | `rootCauseId?: string;` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime.ts` | 476 | SUSPICIOUS_CLAIM | `survivabilityInterpretation += `This section evaluates the root failure points, variables collapse s` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime.ts` | 647 | SUSPICIOUS_CLAIM | `registerText += `| ${rec.title} | ${rec.owner || 'Não definido'} | ${rec.status} | ${evTypes} | ${re` |
| `src/core/runtime/integrity/EmptyCycleIntegrityEngine.ts` | 113 | SUSPICIOUS_CLAIM | `rootCause: emptyMsg,` |
| `src/core/runtime/integrity/StructuralRootNormalizer.ts` | 9 | SUSPICIOUS_CLAIM | `const rootNodes = nodes.filter(n => !n.parentId);` |
| `src/core/runtime/integrity/StructuralRootNormalizer.ts` | 11 | SUSPICIOUS_CLAIM | `rootNodes.forEach(root => {` |
| `src/core/runtime/integrity/StructuralRootNormalizer.ts` | 13 | SUSPICIOUS_CLAIM | `root.value === null ||` |
| `src/core/runtime/integrity/StructuralRootNormalizer.ts` | 14 | SUSPICIOUS_CLAIM | `root.value === undefined ||` |
| `src/core/runtime/integrity/StructuralRootNormalizer.ts` | 15 | SUSPICIOUS_CLAIM | `Number.isNaN(root.value) ||` |
| `src/core/runtime/integrity/StructuralRootNormalizer.ts` | 16 | SUSPICIOUS_CLAIM | `(root.value === 0 && this.hasChildrenWithValue(root, nodes))` |
| `src/core/runtime/integrity/StructuralRootNormalizer.ts` | 18 | SUSPICIOUS_CLAIM | `root.value = this.sumChildren(root, nodes);` |
| `src/core/runtime/lifecycle/DFCSemanticCanonicalRootResolver.ts` | 26 | SUSPICIOUS_CLAIM | `root: resolvedRoot,` |
| `src/core/runtime/lifecycle/DFCSemanticRenderingGuard.ts` | 33 | SUSPICIOUS_CLAIM | `if (audit.root !== audit.canonicalRoot) {` |
| `src/core/runtime/lifecycle/DFCSemanticRenderingGuard.ts` | 38 | SUSPICIOUS_CLAIM | `message: `Semantic root mismatch: root is ${audit.root} but canonicalRoot is ${audit.canonicalRoot}`` |
| `src/core/runtime/lifecycle/DFCSemanticRenderingGuard.ts` | 47 | SUSPICIOUS_CLAIM | `message: 'UI rendered LEGACY while canonical semantic root is ELSA.'` |
| `src/core/runtime/lifecycle/DFCSemanticRootAudit.ts` | 10 | SUSPICIOUS_CLAIM | `root: string;` |
| `src/core/runtime/orchestrator/CrossDomainCausalityResolver.ts` | 15 | SUSPICIOUS_CLAIM | `rootCause: string;` |
| `src/core/runtime/orchestrator/CrossDomainCausalityResolver.ts` | 33 | SUSPICIOUS_CLAIM | `rootCause: 'Dados insuficientes para estabelecimento de causalidade fiduciária.',` |
| `src/core/runtime/orchestrator/CrossDomainCausalityResolver.ts` | 44 | SUSPICIOUS_CLAIM | `rootCause: 'O ciclo de conversão de caixa continua deteriorando frente à tração de vendas.',` |
| `src/core/runtime/orchestrator/CrossDomainCausalityResolver.ts` | 51 | SUSPICIOUS_CLAIM | `rootCause: 'O ciclo de conversão de caixa não acompanha o ritmo de tração de vendas.',` |
| `src/core/runtime/orchestrator/CrossDomainCausalityResolver.ts` | 61 | SUSPICIOUS_CLAIM | `rootCause: 'Custo de serviço da dívida neutraliza ganhos reais de margem EBITDA.',` |
| `src/core/runtime/orchestrator/CrossDomainCausalityResolver.ts` | 71 | SUSPICIOUS_CLAIM | `rootCause: 'Despesa fixa incompatível com o platô de tração do segmento.',` |
| `src/core/runtime/orchestrator/CrossDomainCausalityResolver.ts` | 85 | SUSPICIOUS_CLAIM | `rootCause: 'Sincronia momentânea entre ciclo de vendas e conversão de caixa.',` |
| `src/core/runtime/orchestrator/CrossDomainCausalityResolver.ts` | 93 | SUSPICIOUS_CLAIM | `rootCause: 'Ciclos de conversão eficientes e ganho escalar de margens reais.',` |
| `src/core/runtime/orchestrator/CrossDomainCausalityResolver.ts` | 102 | SUSPICIOUS_CLAIM | `rootCause: 'Fatores multidirecionais diluindo a causalidade principal.',` |
| `src/core/runtime/orchestrator/InstitutionalFinancialDomainOrchestrator.ts` | 96 | SUSPICIOUS_CLAIM | `rootCause: rawCausality.rootCause,` |
| `src/core/runtime/orchestrator/InstitutionalViewContract.ts` | 15 | SUSPICIOUS_CLAIM | `readonly rootCause: string;` |
| `src/core/runtime/publication-governance/ExportAuthorizationEngine.ts` | 42 | SUSPICIOUS_CLAIM | `rationale: 'INTERNAL VIEW GRANTED: Publication allowed internally under restricted handling with war` |
| `src/core/runtime/publication-governance/ExportAuthorizationEngine.ts` | 52 | SUSPICIOUS_CLAIM | `rationale: `EXPORT BLOCKED: Restricted artifacts cannot be exported formally. Allowed only for inter` |
| `src/core/security/permission-engine.ts` | 98 | SUSPICIOUS_CLAIM | `return deny('DENY_ROLE_NOT_ALLOWED', 'Investors cannot view internal causality or logs');` |
| `src/i18n/en-US.ts` | 56 | SUSPICIOUS_CLAIM | `'navigation.page.adm_root': 'Administration',` |
| `src/i18n/en-US.ts` | 58 | SUSPICIOUS_CLAIM | `'navigation.page.contabil_root': 'Accounting',` |
| `src/i18n/en-US.ts` | 64 | SUSPICIOUS_CLAIM | `'navigation.page.financeira_root': 'Finance',` |
| `src/i18n/en-US.ts` | 180 | SUSPICIOUS_CLAIM | `'landing.hero.subtitle2': 'Continuous strategic support for founders, boards, and management in crit` |
| `src/i18n/en-US.ts` | 186 | SUSPICIOUS_CLAIM | `'landing.decisions.desc2': 'Therefore, Illumine acts as a permanent support structure — actively par` |
| `src/i18n/en-US.ts` | 584 | SUSPICIOUS_CLAIM | `'landing.auth.what.desc_p2': 'Everything connected in an architecture designed to support companies ` |
| `src/i18n/en-US.ts` | 730 | SUSPICIOUS_CLAIM | `'causal.root_causes': 'Root Cause Mapper',` |
| `src/i18n/en-US.ts` | 732 | SUSPICIOUS_CLAIM | `'causal.no_causes': 'No root cause or critical vector of structural pressure has been flagged.',` |
| `src/i18n/es-ES.ts` | 56 | SUSPICIOUS_CLAIM | `'navigation.page.adm_root': 'Administración',` |
| `src/i18n/es-ES.ts` | 58 | SUSPICIOUS_CLAIM | `'navigation.page.contabil_root': 'Contabilidad',` |
| `src/i18n/es-ES.ts` | 64 | SUSPICIOUS_CLAIM | `'navigation.page.financeira_root': 'Finanças',` |
| `src/i18n/es-ES.ts` | 730 | SUSPICIOUS_CLAIM | `'causal.root_causes': 'Mapeador de Causas Raíz',` |
| `src/i18n/pt-BR.ts` | 56 | SUSPICIOUS_CLAIM | `'navigation.page.adm_root': 'Administração',` |
| `src/i18n/pt-BR.ts` | 58 | SUSPICIOUS_CLAIM | `'navigation.page.contabil_root': 'Contabilidade',` |
| `src/i18n/pt-BR.ts` | 64 | SUSPICIOUS_CLAIM | `'navigation.page.financeira_root': 'Finanças',` |
| `src/i18n/pt-BR.ts` | 730 | SUSPICIOUS_CLAIM | `'causal.root_causes': 'Mapeador de Causas Raiz',` |
| `src/import-governance/HierarchyIntegrityValidator.ts` | 5 | SUSPICIOUS_CLAIM | `const rootSynthetic = entries.find(e => e.originalCategory.toLowerCase() === 'ativo total' || e.orig` |
| `src/import-governance/HierarchyIntegrityValidator.ts` | 6 | SUSPICIOUS_CLAIM | `if (rootSynthetic && entries.length < 5) {` |
| `src/import-governance/HierarchyIntegrityValidator.ts` | 13 | SUSPICIOUS_CLAIM | `rootSynthetic.violations.push(violation);` |
| `src/import-governance/HierarchyIntegrityValidator.ts` | 14 | SUSPICIOUS_CLAIM | `rootSynthetic.status = 'NEEDS_REVIEW';` |
| `src/lib/bpEngine.ts` | 200 | SUSPICIOUS_CLAIM | `const rootNodes = flatNodes.filter(n => !n.parentId);` |
| `src/lib/bpEngine.ts` | 218 | SUSPICIOUS_CLAIM | `rootNodes.forEach(root => calculateBottomUp(root));` |
| `src/lib/bpEngine.ts` | 456 | SUSPICIOUS_CLAIM | `return { nodes: rootNodes, flatNodes, summary };` |
| `src/lib/dreInsights.ts` | 23 | SUSPICIOUS_CLAIM | `internalAuditErrors: string[];` |
| `src/lib/dreInsights.ts` | 50 | SUSPICIOUS_CLAIM | `internalAuditErrors` |
| `src/lib/dreInsights.ts` | 86 | SUSPICIOUS_CLAIM | `internalAuditErrors.forEach(err => {` |
| `src/lib/executive-audience-adaptation-engine.ts` | 46 | SUSPICIOUS_CLAIM | `for (const evidence of reasoning.supportingEvidence) {` |
| `src/lib/executive-confidence-disclosure-engine.ts` | 14 | SUSPICIOUS_CLAIM | `evidenceCount: reasoning.supportingEvidence.length,` |
| `src/lib/executive-confidence-disclosure-engine.ts` | 15 | SUSPICIOUS_CLAIM | `memoryCount: reasoning.supportingMemories.length,` |
| `src/lib/executive-conversation-engine.ts` | 31 | SUSPICIOUS_CLAIM | `: `Based on deterministic institutional reasoning, ${traceability.evidenceCount} evidence points sup` |
| `src/lib/executive-conversation-engine.ts` | 40 | SUSPICIOUS_CLAIM | `if (reasoning.supportingMemories.length > 0) {` |
| `src/lib/governance-copilot-conflict-engine.ts` | 44 | SUSPICIOUS_CLAIM | `description: 'High ESG Governance score conflicts with high volume of internal governance friction.'` |
| `src/lib/governance-copilot-reasoning-engine.ts` | 24 | SUSPICIOUS_CLAIM | `const supportingEvidence = GovernanceCopilotEvidenceEngine.resolveEvidence(input, relevantTopics);` |
| `src/lib/governance-copilot-reasoning-engine.ts` | 25 | SUSPICIOUS_CLAIM | `const supportingMemories = GovernanceCopilotMemoryEngine.resolveMemories(input, relevantTopics);` |
| `src/lib/governance-copilot-reasoning-engine.ts` | 33 | SUSPICIOUS_CLAIM | `supportingEvidence.length,` |
| `src/lib/governance-copilot-reasoning-engine.ts` | 34 | SUSPICIOUS_CLAIM | `supportingMemories.length,` |
| `src/lib/governance-copilot-reasoning-engine.ts` | 54 | SUSPICIOUS_CLAIM | `supportingEvidence,` |
| `src/lib/governance-copilot-reasoning-engine.ts` | 55 | SUSPICIOUS_CLAIM | `supportingMemories,` |
| `src/lib/governance-copilot-reasoning-types.ts` | 67 | SUSPICIOUS_CLAIM | `supportingEvidence: GovernanceCopilotEvidenceReference[];` |
| `src/lib/governance-copilot-reasoning-types.ts` | 68 | SUSPICIOUS_CLAIM | `supportingMemories: GovernanceCopilotMemoryReference[];` |
| `src/lib/governance-digital-twin-engine.ts` | 47 | SUSPICIOUS_CLAIM | `: "Execution capability supports ongoing and new strategic commitments.",` |
| `src/main.tsx` | 30 | SUSPICIOUS_CLAIM | `createRoot(document.getElementById('root')!).render(` |
| `src/runtime/adapters/BoardRiskMatrixAdapter.ts` | 257 | SUSPICIOUS_CLAIM | `alerts.push('Operational continuity demonstrates elevated dependency on shareholder-supported struct` |
| `src/runtime/adapters/CreditCommitteeSimulatorAdapter.ts` | 301 | SUSPICIOUS_CLAIM | `rationale: 'Accounting earnings show improvement, but rely heavily on related party financial suppor` |
| `src/runtime/adapters/CreditCommitteeSimulatorAdapter.ts` | 515 | SUSPICIOUS_CLAIM | `alerts.push('Profitability demonstrates weak treasury conversion support.');` |
| `src/runtime/adapters/EconomicNormalizationAdapter.ts` | 280 | SUSPICIOUS_CLAIM | `alerts.push('Reported capital returns are not fully supported by recurring operational treasury gene` |
| `src/runtime/adapters/ExecutiveExecutionAdapter.ts` | 17 | SUSPICIOUS_CLAIM | `rootFriction?: 'CASH_CONSTRAINT' | 'PEOPLE_CONSTRAINT' | 'GOVERNANCE_CONSTRAINT' | 'SUPPLIER_CONSTRA` |
| `src/runtime/adapters/ExecutiveExecutionAdapter.ts` | 136 | SUSPICIOUS_CLAIM | `rootFriction: 'CASH_CONSTRAINT'` |
| `src/runtime/adapters/ExecutiveExecutionAdapter.ts` | 160 | SUSPICIOUS_CLAIM | `rootFriction: 'PEOPLE_CONSTRAINT',` |
| `src/runtime/adapters/ExecutiveExecutionAdapter.ts` | 490 | SUSPICIOUS_CLAIM | `if (rec.rootFriction) {` |
| `src/runtime/adapters/ExecutiveExecutionAdapter.ts` | 491 | SUSPICIOUS_CLAIM | `frictionCounts[rec.rootFriction] = (frictionCounts[rec.rootFriction] || 0) + 1;` |
| `src/runtime/adapters/ExecutiveExecutionAdapter.ts` | 642 | SUSPICIOUS_CLAIM | `friction: r.rootFriction,` |
| `src/runtime/adapters/InstitutionalMemoryAdapter.ts` | 402 | SUSPICIOUS_CLAIM | `alerts.push('Institutional continuity demonstrates recurring dependency on shareholder-supported str` |
| `src/runtime/adapters/LegacyDFCAdapter.ts` | 1144 | SUSPICIOUS_CLAIM | `const supportRatio = (Math.abs(fluxoPartesRelacionadas) + Math.abs(fluxoCapitalizacao)) / Math.max(M` |
| `src/runtime/adapters/LegacyDFCAdapter.ts` | 1146 | SUSPICIOUS_CLAIM | `if (supportRatio < 0.05) eqSupportDeduction = 0;` |
| `src/runtime/adapters/LegacyDFCAdapter.ts` | 1147 | SUSPICIOUS_CLAIM | `else if (supportRatio < 0.2) eqSupportDeduction = 3;` |
| `src/runtime/adapters/LegacyDFCAdapter.ts` | 1148 | SUSPICIOUS_CLAIM | `else if (supportRatio <= 0.5) eqSupportDeduction = 7;` |
| `src/runtime/adapters/LegacyDFCAdapter.ts` | 1186 | SUSPICIOUS_CLAIM | `if (historicalSupportYears > 0 && supportRatio >= 0.05) {` |
| `src/runtime/adapters/LegacyDFCAdapter.ts` | 1342 | SUSPICIOUS_CLAIM | `const supportFlow = Math.abs(fluxoPartesRelacionadas) + Math.abs(fluxoCapitalizacao);` |
| `src/runtime/adapters/LegacyDFCAdapter.ts` | 1343 | SUSPICIOUS_CLAIM | `if (supportFlow > 0.25 * Math.abs(fcoContabilReconciled)) {` |
| `src/runtime/adapters/LegacyDFCAdapter.ts` | 1878 | SUSPICIOUS_CLAIM | `value: supportRatio,` |
| `src/runtime/adapters/LegacyDREAdapter.ts` | 143 | SUSPICIOUS_CLAIM | `const internalAuditErrors: string[] = [];` |
| `src/runtime/adapters/LegacyDREAdapter.ts` | 147 | SUSPICIOUS_CLAIM | `internalAuditErrors.push(`Divergência matemática detectada: Lucro Bruto.`);` |
| `src/runtime/adapters/LegacyDREAdapter.ts` | 151 | SUSPICIOUS_CLAIM | `internalAuditErrors.push(`Divergência matemática detectada: Resultado Operacional.`);` |
| `src/runtime/adapters/LegacyDREAdapter.ts` | 269 | SUSPICIOUS_CLAIM | `breakEvenDays, indiceConversaoOperacional, ebitda, recGrowth, ebitdaGrowth, internalAuditErrors,` |
| `src/runtime/adapters/LegacyDREAdapter.ts` | 326 | SUSPICIOUS_CLAIM | `if (internalAuditErrors.length > 0) {` |
| `src/runtime/adapters/LegacyDREAdapter.ts` | 330 | SUSPICIOUS_CLAIM | `message: internalAuditErrors.join(' | '),` |
| `src/runtime/adapters/SovereignDecisionAdapter.ts` | 1139 | SUSPICIOUS_CLAIM | `lineageHash: `sde-root-hash-${runway}-${sdsUrgency}`` |
| `src/services/cashFlowService.ts` | 202 | SUSPICIOUS_CLAIM | `requestedAction: 'CREATE_SNAPSHOT', // Considering this an internal system snapshot of the cash flow` |
| `src/services/governanceService.ts` | 123 | SUSPICIOUS_CLAIM | `const isSuperAdmin = context.role === 'SUPER_ADMIN';` |
| `src/services/governanceService.ts` | 124 | SUSPICIOUS_CLAIM | `const targetTenant = isSuperAdmin ? (filters.tenantId || activeTenant) : activeTenant;` |
| `src/services/governanceService.ts` | 127 | SUSPICIOUS_CLAIM | `if (isSuperAdmin && !filters.tenantId) {` |
| `src/services/governanceService.ts` | 156 | SUSPICIOUS_CLAIM | `const isSuperAdmin = context.role === 'SUPER_ADMIN';` |
| `src/services/governanceService.ts` | 157 | SUSPICIOUS_CLAIM | `const targetTenant = isSuperAdmin ? (filters.tenantId || activeTenant) : activeTenant;` |
| `src/services/governanceService.ts` | 160 | SUSPICIOUS_CLAIM | `if (isSuperAdmin && !filters.tenantId) {` |
| `src/services/governanceService.ts` | 189 | SUSPICIOUS_CLAIM | `const isSuperAdmin = context.role === 'SUPER_ADMIN';` |
| `src/services/governanceService.ts` | 190 | SUSPICIOUS_CLAIM | `const targetTenant = isSuperAdmin ? (filters.tenantId || activeTenant) : activeTenant;` |
| `src/services/governanceService.ts` | 193 | SUSPICIOUS_CLAIM | `if (isSuperAdmin && !filters.tenantId) {` |
| `src/services/governanceService.ts` | 221 | SUSPICIOUS_CLAIM | `const isSuperAdmin = context.role === 'SUPER_ADMIN';` |
| `src/services/governanceService.ts` | 222 | SUSPICIOUS_CLAIM | `const targetTenant = isSuperAdmin ? (filters.tenantId || activeTenant) : activeTenant;` |
| `src/services/governanceService.ts` | 225 | SUSPICIOUS_CLAIM | `if (isSuperAdmin && !filters.tenantId) {` |
| `src/services/importService.ts` | 595 | SUSPICIOUS_CLAIM | `export const inferType = (code: string, name: string, rootMap?: Record<string, string>): string => {` |
| `src/services/importService.ts` | 656 | SUSPICIOUS_CLAIM | `if (rootMap) {` |
| `src/services/importService.ts` | 657 | SUSPICIOUS_CLAIM | `if (rootMap[firstGroup]) return rootMap[firstGroup];` |
| `src/services/importService.ts` | 658 | SUSPICIOUS_CLAIM | `if (rootMap[firstChar]) return rootMap[firstChar];` |
| `src/services/importService.ts` | 710 | SUSPICIOUS_CLAIM | `const rootMap: Record<string, string> = {};` |
| `src/services/importService.ts` | 730 | SUSPICIOUS_CLAIM | `rootMap[acc.code] = type;` |
| `src/services/importService.ts` | 733 | SUSPICIOUS_CLAIM | `rootMap[acc.code.charAt(0)] = type;` |
| `src/services/importService.ts` | 749 | SUSPICIOUS_CLAIM | `if (!rootMap[digit]) rootMap[digit] = type;` |
| `src/services/importService.ts` | 753 | SUSPICIOUS_CLAIM | `const rootKeys = Object.keys(rootMap).sort((a, b) => b.length - a.length);` |
| `src/services/importService.ts` | 761 | SUSPICIOUS_CLAIM | `const matchingRoot = rootKeys.find(rk => acc.code.startsWith(rk));` |
| `src/services/importService.ts` | 769 | SUSPICIOUS_CLAIM | `finalType = matchingRoot ? rootMap[matchingRoot] : selfType;` |
| `src/services/security/PermissionResolver.ts` | 21 | SUSPICIOUS_CLAIM | `isSuperAdmin(): boolean {` |
| `src/services/security/PermissionResolver.ts` | 44 | SUSPICIOUS_CLAIM | `return this.isSuperAdmin() || this.isGovernanceAdmin();` |
| `src/services/supportService.ts` | 21 | SUSPICIOUS_CLAIM | `const TICKETS_COLLECTION = 'support_tickets';` |
| `src/services/supportService.ts` | 22 | SUSPICIOUS_CLAIM | `const MESSAGES_COLLECTION = 'support_messages';` |
| `src/services/supportService.ts` | 24 | SUSPICIOUS_CLAIM | `export const supportService = {` |
| `src/services/supportService.ts` | 70 | SUSPICIOUS_CLAIM | `console.error('Error creating support ticket:', error);` |
| `src/services/supportService.ts` | 151 | SUSPICIOUS_CLAIM | `const storageRef = ref(storage, `support_attachments/${ticketId}/${fileName}`);` |
| `src/topology/IntercompanyResolver.ts` | 18 | SUSPICIOUS_CLAIM | `const internalOperations = operations.filter(op =>` |
| `src/topology/IntercompanyResolver.ts` | 27 | SUSPICIOUS_CLAIM | `for (const op of internalOperations) {` |

