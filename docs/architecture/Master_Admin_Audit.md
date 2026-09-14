# Master Admin Audit

Este relatório documenta papéis elevados como `isAdmin`, `isSuperAdmin`, `root`, etc., que potencialmente detêm permissões sobre a plataforma.

### Política Institucional
- Administradores de plataforma PODEM visualizar métricas globais agregadas e billing.
- Administradores de plataforma NÃO PODEM violar fronteiras de *Tenant* para acessar BP/DRE/DFC ou lógicas constitucionais de terceiros.

### Achados
Total: 273
| Arquivo | Linha | Código |
|---|---|---|
| `src/App.tsx` | 337 | `const root = window.document.documentElement;` |
| `src/App.tsx` | 338 | `root.classList.remove('light', 'dark');` |
| `src/App.tsx` | 342 | `root.classList.add(systemTheme);` |
| `src/App.tsx` | 344 | `root.classList.add(savedTheme);` |
| `src/app/navigation.ts` | 213 | `| 'adm_root'` |
| `src/app/navigation.ts` | 214 | `| 'contabil_root'` |
| `src/app/navigation.ts` | 215 | `| 'financeira_root'` |
| `src/app/navigation.ts` | 250 | `label?: string; // deprecated: developer reference only` |
| `src/app/navigation.ts` | 259 | `group?: string; // deprecated: developer reference only` |
| `src/app/navigation.ts` | 394 | `id: 'adm_root' as any,` |
| `src/app/navigation.ts` | 395 | `label: 'Administração', labelKey: 'navigation.page.adm_root',` |
| `src/app/navigation.ts` | 402 | `id: 'contabil_root' as any,` |
| `src/app/navigation.ts` | 403 | `label: 'Contabilidade', labelKey: 'navigation.page.contabil_root',` |
| `src/app/navigation.ts` | 414 | `id: 'financeira_root' as any,` |
| `src/app/navigation.ts` | 415 | `label: 'Finanças', labelKey: 'navigation.page.financeira_root',` |
| `src/app/routes.tsx` | 327 | `if (currentPage === 'clientes' || (currentPage as string) === 'clientes_root') {` |
| `src/components/Common/Base.tsx` | 476 | `const [internalPeriodMode, setInternalPeriodMode] = React.useState<'mensal' | 'anual'>('mensal');` |
| `src/components/Common/Base.tsx` | 478 | `const periodMode = isControlled ? periodModeProp : internalPeriodMode;` |
| `src/components/ExecutivePerspectiveSection.tsx` | 172 | `const rc = governanceReport.causality.rootCause;` |
| `src/components/executive-command/CommandExplainabilityDrawer.tsx` | 43 | `{explainability.supportingLineageHashes.map((hash, idx) => (` |
| `src/components/executive-interaction/RuntimeLineageViewer.tsx` | 41 | `<span>{t("overlays.root_hash")} {lineageHash.substring(0, 16)}...</span>` |
| `src/components/modals/ImportFinancialModal.tsx` | 67 | `throw new Error(t("modals.import_financial.unsupported_format"));` |
| `src/components/modals/ImportFinancialModal.tsx` | 296 | `<p className="text-xs text-slate-400 mt-2">{t("modals.import_financial.supported_formats")}</p>` |
| `src/components/modals/ManualFinancialModal.tsx` | 303 | `const rootOriginal = rows.find(r => r.id === current.id);` |
| `src/components/modals/ManualFinancialModal.tsx` | 304 | `if (rootOriginal && rootOriginal.type) {` |
| `src/components/modals/ManualFinancialModal.tsx` | 305 | `inferredType = rootOriginal.type;` |
| `src/components/pages/ClientExecutiveWorkspace.tsx` | 816 | `<p className="text-xs font-semibold text-slate-300 leading-relaxed">{currentStep.data.causality?.roo` |
| `src/components/pages/DFCPage.tsx` | 747 | `internal: {` |
| `src/components/pages/DREPage.tsx` | 145 | `const rootCauseReport = (executiveReport?.metrics as any)?.dreInsights?.rootCauseReport;` |
| `src/components/pages/PortfolioPage.tsx` | 126 | `const pdfWidth = pdf.internal.pageSize.getWidth();` |
| `src/components/pages/PreferencesPage.tsx` | 40 | `const root = window.document.documentElement;` |
| `src/components/pages/PreferencesPage.tsx` | 41 | `root.classList.remove('light', 'dark');` |
| `src/components/pages/PreferencesPage.tsx` | 45 | `root.classList.add(systemTheme);` |
| `src/components/pages/PreferencesPage.tsx` | 47 | `root.classList.add(theme);` |
| `src/components/pages/RelatorioExecutivoPage.tsx` | 131 | `const pdfWidth = pdf.internal.pageSize.getWidth();` |
| `src/components/pages/SupportPage/AdminSupportPanel.tsx` | 25 | `const data = await supportService.getAllTickets();` |
| `src/components/pages/SupportPage/ClientSupportPanel.tsx` | 39 | `const data = await supportService.getUserTickets(auth.currentUser.uid);` |
| `src/components/pages/SupportPage/ClientSupportPanel.tsx` | 58 | `const result = await supportService.createTicket({` |
| `src/components/pages/SupportPage/TicketChat.tsx` | 29 | `const unsubscribe = supportService.subscribeToTicketMessages(ticket.id!, (data) => {` |
| `src/components/pages/SupportPage/TicketChat.tsx` | 51 | `attachmentUrl = await supportService.uploadTicketAttachment(ticket.id!, attachment);` |
| `src/components/pages/SupportPage/TicketChat.tsx` | 54 | `await supportService.addTicketMessage(ticket.id!, {` |
| `src/components/pages/SupportPage/TicketChat.tsx` | 67 | `await supportService.updateTicketStatus(ticket.id!, 'in_progress');` |
| `src/components/pages/SupportPage/TicketChat.tsx` | 80 | `await supportService.updateTicketStatus(ticket.id!, status);` |
| `src/components/pages/SupportPage/TicketChat.tsx` | 197 | `const isAdmin = msg.senderRole === 'master';` |
| `src/components/pages/SupportPage/TicketChat.tsx` | 202 | `<span className="text-[10px] font-medium text-foreground">{isMe ? 'Você' : isAdmin ? 'Suporte Master` |
| `src/components/pages/SupportPage/TicketChat.tsx` | 203 | `{isAdmin && !isMe && (` |
| `src/components/pages/SupportPage/TicketChat.tsx` | 215 | `: isAdmin` |
| `src/components/pages/governance/CausalityExplorerPanel.tsx` | 33 | `supportingEvidence = [],` |
| `src/components/pages/governance/CausalityExplorerPanel.tsx` | 270 | `{!isRestricted && supportingEvidence.length > 0 && (` |
| `src/components/pages/governance/CausalityExplorerPanel.tsx` | 276 | `{supportingEvidence.map((ev, i) => {` |
| `src/components/pages/governance/ExecutiveExecutionCenter.tsx` | 403 | `<td className="p-3 text-slate-400">{dec.rootFriction || 'Nenhuma'}</td>` |
| `src/components/pages/governance/ObservabilityConsolePage.tsx` | 39 | `const isSuperAdmin = session?.role === 'SUPER_ADMIN';` |
| `src/components/pages/governance/ObservabilityConsolePage.tsx` | 40 | `const hasPermission = isSuperAdmin || session?.permissions?.includes('VIEW_OBSERVABILITY');` |
| `src/components/pages/governance/ObservabilityConsolePage.tsx` | 45 | `setSelectedTenantFilter(isSuperAdmin ? 'GLOBAL' : session.tenantId);` |
| `src/components/pages/governance/ObservabilityConsolePage.tsx` | 47 | `}, [isReady, session, isSuperAdmin]);` |
| `src/components/pages/governance/ObservabilityConsolePage.tsx` | 187 | `{isSuperAdmin && (` |
| `src/components/panels/causal-governance/InstitutionalCausalRootCausesPanel.tsx` | 7 | `rootCauses?: CausalFactor[];` |
| `src/components/panels/causal-governance/InstitutionalCausalRootCausesPanel.tsx` | 10 | `export const InstitutionalCausalRootCausesPanel: React.FC<RootCausesPanelProps> = ({ rootCauses = []` |
| `src/components/panels/causal-governance/InstitutionalCausalRootCausesPanel.tsx` | 28 | `<h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t('causal.root_caus` |
| `src/components/panels/causal-governance/InstitutionalCausalRootCausesPanel.tsx` | 35 | `{rootCauses.length === 0 ? (` |
| `src/components/panels/causal-governance/InstitutionalCausalRootCausesPanel.tsx` | 40 | `rootCauses.map((factor, idx) => (` |
| `src/components/panels/causal-governance/SurvivabilityDependencyGraphPanel.tsx` | 16 | `const rootCauses = nodes.filter(n => n.type === 'ROOT_CAUSE');` |
| `src/components/panels/causal-governance/SurvivabilityDependencyGraphPanel.tsx` | 25 | `rootCauses.forEach((node, i) => {` |
| `src/components/panels/causal-governance/SurvivabilityDependencyGraphPanel.tsx` | 26 | `const spacing = height / (rootCauses.length + 1);` |
| `src/components/ui/dialog.tsx` | 40 | `"fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-` |
| `src/contexts/LanguageContext.tsx` | 118 | `'administracao': 'navigation.page.adm_root',` |
| `src/contexts/LanguageContext.tsx` | 120 | `'contabilidade': 'navigation.page.contabil_root',` |
| `src/contexts/LanguageContext.tsx` | 126 | `'financas': 'navigation.page.financeira_root',` |
| `src/core/analytics/AdoptionAnalytics.ts` | 24 | `const isSuperAdmin = context.role === 'SUPER_ADMIN';` |
| `src/core/analytics/AdoptionAnalytics.ts` | 27 | `if (!isSuperAdmin && context.tenantId !== targetTenantId) {` |
| `src/core/diagnostics/EnterpriseReadinessDiagnostics.ts` | 20 | `const isSuperAdmin = context.role === 'SUPER_ADMIN';` |
| `src/core/diagnostics/EnterpriseReadinessDiagnostics.ts` | 23 | `if (!isSuperAdmin && context.tenantId !== targetTenantId) {` |
| `src/core/executive-experience/BoardPresentationRuntime.ts` | 16 | `causalChain: { event: string; rootCause: string; impact: string };` |
| `src/core/executive-experience/BoardPresentationRuntime.ts` | 112 | `rootCause: causality?.rootCause || 'N/A',` |
| `src/core/executive-experience/ExecutiveDiagnosisComposer.ts` | 35 | `report.causality.rootCause = this.sanitize(report.causality.rootCause);` |
| `src/core/executive-experience/ExecutiveStorytellingEngine.ts` | 68 | `const { event, rootCause, strategicImpact } = report.causality;` |
| `src/core/executive-experience/ExecutiveStorytellingEngine.ts` | 71 | `narrative: `Diagnóstico: ${event}. Causa Raiz: ${rootCause}. Impacto Estratégico: ${strategicImpact}` |
| `src/core/exporting/InstitutionalReportFormatter.ts` | 39 | `- **Causa Raiz Identificada**: ${report.causality?.rootCause || 'N/A'}` |
| `src/core/presentation/contracts/executive-view-models.ts` | 11 | `internal?: {` |
| `src/core/presentation/contracts/executive-view-models.ts` | 16 | `[key: string]: unknown; // Allow extensions for specialized internal fields` |
| `src/core/presentation/mappers/executive-presentation-mapper.ts` | 42 | `internal: {` |
| `src/core/presentation/mappers/executive-presentation-mapper.ts` | 62 | `internal: {` |
| `src/core/presentation/mappers/executive-presentation-mapper.ts` | 81 | `internal: {` |
| `src/core/presentation/mappers/executive-presentation-mapper.ts` | 117 | `internal: {` |
| `src/core/presentation/mappers/executive-presentation-mapper.ts` | 130 | `internal: {` |
| `src/core/presentation/mappers/executive-presentation-mapper.ts` | 154 | `internal: {` |
| `src/core/runtime/adapters/causality-interpretation-adapter.ts` | 8 | `rootCause: string;` |
| `src/core/runtime/adapters/causality-interpretation-adapter.ts` | 31 | `rootCause: 'Dados insuficientes para identificar a causa raiz',` |
| `src/core/runtime/adapters/causality-interpretation-adapter.ts` | 56 | `const rootCause = narrativeChain.causa || 'Ciclo financeiro em estabilidade estrutural provisória.';` |
| `src/core/runtime/adapters/causality-interpretation-adapter.ts` | 93 | `rootCause,` |
| `src/core/runtime/benchmarking/BenchmarkDatasetBuilder.ts` | 14 | `_internalId: `T-VAREJO-${i}`, // Nunca sai daqui` |
| `src/core/runtime/benchmarking/BenchmarkDatasetBuilder.ts` | 26 | `_internalId: `T-AERO-${i}`,` |
| `src/core/runtime/board/BoardPrioritiesEngine.ts` | 389 | `supportingPrinciples: gklResult.principleMatches.map(pm => pm.title),` |
| `src/core/runtime/cash-governance/InstitutionalContinuityEngine.ts` | 103 | `continuityRiskDrivers.push('artificial_liquidity_support');` |
| `src/core/runtime/causal-governance/InstitutionalCausalGovernanceRuntime.ts` | 64 | `rootCauses: [],` |
| `src/core/runtime/causal-governance/InstitutionalCausalGovernanceRuntime.ts` | 81 | `rootCauses: [],` |
| `src/core/runtime/causal-governance/InstitutionalCausalGovernanceRuntime.ts` | 110 | `const rootCauses = LiquidityRootCauseEngine.evaluate(` |
| `src/core/runtime/causal-governance/InstitutionalCausalGovernanceRuntime.ts` | 127 | `const dependencyGraph = SurvivabilityDependencyGraph.build(rootCauses, fco, isDfcAvailable);` |
| `src/core/runtime/causal-governance/InstitutionalCausalGovernanceRuntime.ts` | 130 | `const stressCascadePath = OperationalStressCascadeEngine.evaluate(rootCauses, fco, isDfcAvailable);` |
| `src/core/runtime/causal-governance/InstitutionalCausalGovernanceRuntime.ts` | 147 | `causalOpinion = 'Restricted causal inference due to missing DFC. Structural evidence indicates proba` |
| `src/core/runtime/causal-governance/InstitutionalCausalGovernanceRuntime.ts` | 149 | `const activeFactors = rootCauses.map(r => r.label).join(', ');` |
| `src/core/runtime/causal-governance/InstitutionalCausalGovernanceRuntime.ts` | 163 | `rootCauses,` |
| `src/core/runtime/causal-governance/InstitutionalCausalityExplorer.ts` | 57 | `const supportingEvidence: CausalEvidence[] = [];` |
| `src/core/runtime/causal-governance/InstitutionalCausalityExplorer.ts` | 61 | `supportingEvidence.push(` |
| `src/core/runtime/causal-governance/InstitutionalCausalityExplorer.ts` | 87 | `supportingEvidence,` |
| `src/core/runtime/causal-governance/causal-types.ts` | 40 | `supportingEvidence: CausalEvidence[];` |
| `src/core/runtime/causal-governance/types.ts` | 60 | `rootCauses: CausalFactor[];` |
| `src/core/runtime/decision-governance/ConstitutionalDecisionRuntime.ts` | 35 | `supportingMetrics: ['FCO', 'Liquidity Score'],` |
| `src/core/runtime/decision-governance/ConstitutionalDecisionRuntime.ts` | 54 | `supportingMetrics: d.supportingMetrics,` |
| `src/core/runtime/decision-governance/ExecutiveDecisionObject.ts` | 26 | `supportingMetrics: string[];` |
| `src/core/runtime/esgim/esgimTypes.ts` | 90 | `supportingPrinciples?: string[];` |
| `src/core/runtime/executive/AdvisoryCompressionEngine.ts` | 21 | `supportingMetrics: { ...narrative.supportingMetrics },` |
| `src/core/runtime/executive/RuntimeBackedStorytelling.ts` | 10 | `supportingMetrics: RuntimeMetrics,` |
| `src/core/runtime/executive/RuntimeBackedStorytelling.ts` | 30 | `supportingMetrics,` |
| `src/core/runtime/executive/demo/ExecutiveDemoScenarioRegistry.ts` | 83 | `'Establish capital structure milestones to support equity expansion.'` |
| `src/core/runtime/executive/types.ts` | 115 | `supportingMetrics: RuntimeMetrics;` |
| `src/core/runtime/executive-command/ExecutiveCommandExplainabilityEngine.ts` | 17 | `supportingLineageHashes: [context.lineageHash],` |
| `src/core/runtime/executive-command/ExecutiveCommandExplainabilityEngine.ts` | 34 | `supportingLineageHashes: [context.lineageHash],` |
| `src/core/runtime/executive-command/executive-command-types.ts` | 73 | `supportingLineageHashes: string[];` |
| `src/core/runtime/executive-governance-runtime.ts` | 218 | `rootCause?: string;` |
| `src/core/runtime/executive-governance-runtime.ts` | 233 | `supportingEvidence?: import('./causal-governance/causal-types').CausalEvidence[];` |
| `src/core/runtime/executive-governance-runtime.ts` | 785 | `if (!baseCausality.rootCause.includes('INSUFFICIENT_DATA')) {` |
| `src/core/runtime/executive-governance-runtime.ts` | 786 | `baseCausality.rootCause = `Indícios apontam para: ${baseCausality.rootCause}`;` |
| `src/core/runtime/executive-governance-runtime.ts` | 902 | `rootCause: sanitizeNarrative(rawCausality.rootCause),` |
| `src/core/runtime/executive-governance-runtime.ts` | 1238 | `const internalAuditErrors: string[] = [];` |
| `src/core/runtime/executive-governance-runtime.ts` | 1242 | `internalAuditErrors.push('Divergência matemática detectada: Lucro Bruto.');` |
| `src/core/runtime/executive-governance-runtime.ts` | 1252 | `breakEvenDays, indiceConversaoOperacional, ebitda, recGrowth, ebitdaGrowth, internalAuditErrors,` |
| `src/core/runtime/executive-governance-runtime.ts` | 1262 | `const rootCauseReport = EBITDARootCauseEngine.evaluate(` |
| `src/core/runtime/executive-governance-runtime.ts` | 1284 | `internalAuditErrors.length > 0` |
| `src/core/runtime/executive-governance-runtime.ts` | 1355 | `(dreInsights as any).rootCauseReport = rootCauseReport;` |
| `src/core/runtime/executive-governance-runtime.ts` | 2638 | `causalChainPresent: !!initialReport.causality?.rootCause,` |
| `src/core/runtime/executive-orchestration/cognitive/ExecutiveNarrativeHierarchyEngine.ts` | 11 | `level2: report.causality.rootCause || 'Sem causa raiz estrutural mapeada pelo Runtime.',` |
| `src/core/runtime/governance/bp/BalanceSheetExecutiveRecommendationEngine.ts` | 7 | `rootCause: string` |
| `src/core/runtime/governance/bp/BalanceSheetExecutiveRecommendationEngine.ts` | 12 | `rationale: [rootCause, 'Capital is formally preserved.']` |
| `src/core/runtime/governance/bp/BalanceSheetExecutiveRecommendationEngine.ts` | 20 | `rationale: [rootCause]` |
| `src/core/runtime/governance/bp/BalanceSheetExecutiveRecommendationEngine.ts` | 25 | `rationale: [rootCause]` |
| `src/core/runtime/governance/bp/BalanceSheetExecutiveRecommendationEngine.ts` | 30 | `rationale: [rootCause]` |
| `src/core/runtime/governance/bp/BalanceSheetExecutiveRecommendationEngine.ts` | 35 | `rationale: [rootCause]` |
| `src/core/runtime/governance/bp/BalanceSheetExecutiveRecommendationEngine.ts` | 40 | `rationale: [rootCause]` |
| `src/core/runtime/governance/bp/BalanceSheetRootCauseAnalyzer.ts` | 30 | `cause = `BP is formally preserved. Noted external alerts from ${externalAlerts.map(e => e.source).jo` |
| `src/core/runtime/institutional-memory/GovernanceFatigueDetection.ts` | 22 | `score += 10; // Volume acts as an amplifier, not a root cause` |
| `src/core/runtime/institutional-memory/TemporalCausalityEngine.ts` | 95 | `rootCauseId: history[0].lineageHash` |
| `src/core/runtime/institutional-memory/types.ts` | 221 | `rootCauseId?: string;` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime.ts` | 476 | `survivabilityInterpretation += `This section evaluates the root failure points, variables collapse s` |
| `src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime.ts` | 647 | `registerText += `| ${rec.title} | ${rec.owner || 'Não definido'} | ${rec.status} | ${evTypes} | ${re` |
| `src/core/runtime/integrity/EmptyCycleIntegrityEngine.ts` | 113 | `rootCause: emptyMsg,` |
| `src/core/runtime/integrity/StructuralRootNormalizer.ts` | 9 | `const rootNodes = nodes.filter(n => !n.parentId);` |
| `src/core/runtime/integrity/StructuralRootNormalizer.ts` | 11 | `rootNodes.forEach(root => {` |
| `src/core/runtime/integrity/StructuralRootNormalizer.ts` | 13 | `root.value === null ||` |
| `src/core/runtime/integrity/StructuralRootNormalizer.ts` | 14 | `root.value === undefined ||` |
| `src/core/runtime/integrity/StructuralRootNormalizer.ts` | 15 | `Number.isNaN(root.value) ||` |
| `src/core/runtime/integrity/StructuralRootNormalizer.ts` | 16 | `(root.value === 0 && this.hasChildrenWithValue(root, nodes))` |
| `src/core/runtime/integrity/StructuralRootNormalizer.ts` | 18 | `root.value = this.sumChildren(root, nodes);` |
| `src/core/runtime/lifecycle/DFCSemanticCanonicalRootResolver.ts` | 26 | `root: resolvedRoot,` |
| `src/core/runtime/lifecycle/DFCSemanticRenderingGuard.ts` | 33 | `if (audit.root !== audit.canonicalRoot) {` |
| `src/core/runtime/lifecycle/DFCSemanticRenderingGuard.ts` | 38 | `message: `Semantic root mismatch: root is ${audit.root} but canonicalRoot is ${audit.canonicalRoot}`` |
| `src/core/runtime/lifecycle/DFCSemanticRenderingGuard.ts` | 47 | `message: 'UI rendered LEGACY while canonical semantic root is ELSA.'` |
| `src/core/runtime/lifecycle/DFCSemanticRootAudit.ts` | 10 | `root: string;` |
| `src/core/runtime/orchestrator/CrossDomainCausalityResolver.ts` | 15 | `rootCause: string;` |
| `src/core/runtime/orchestrator/CrossDomainCausalityResolver.ts` | 33 | `rootCause: 'Dados insuficientes para estabelecimento de causalidade fiduciária.',` |
| `src/core/runtime/orchestrator/CrossDomainCausalityResolver.ts` | 44 | `rootCause: 'O ciclo de conversão de caixa continua deteriorando frente à tração de vendas.',` |
| `src/core/runtime/orchestrator/CrossDomainCausalityResolver.ts` | 51 | `rootCause: 'O ciclo de conversão de caixa não acompanha o ritmo de tração de vendas.',` |
| `src/core/runtime/orchestrator/CrossDomainCausalityResolver.ts` | 61 | `rootCause: 'Custo de serviço da dívida neutraliza ganhos reais de margem EBITDA.',` |
| `src/core/runtime/orchestrator/CrossDomainCausalityResolver.ts` | 71 | `rootCause: 'Despesa fixa incompatível com o platô de tração do segmento.',` |
| `src/core/runtime/orchestrator/CrossDomainCausalityResolver.ts` | 85 | `rootCause: 'Sincronia momentânea entre ciclo de vendas e conversão de caixa.',` |
| `src/core/runtime/orchestrator/CrossDomainCausalityResolver.ts` | 93 | `rootCause: 'Ciclos de conversão eficientes e ganho escalar de margens reais.',` |
| `src/core/runtime/orchestrator/CrossDomainCausalityResolver.ts` | 102 | `rootCause: 'Fatores multidirecionais diluindo a causalidade principal.',` |
| `src/core/runtime/orchestrator/InstitutionalFinancialDomainOrchestrator.ts` | 96 | `rootCause: rawCausality.rootCause,` |
| `src/core/runtime/orchestrator/InstitutionalViewContract.ts` | 15 | `readonly rootCause: string;` |
| `src/core/runtime/publication-governance/ExportAuthorizationEngine.ts` | 42 | `rationale: 'INTERNAL VIEW GRANTED: Publication allowed internally under restricted handling with war` |
| `src/core/runtime/publication-governance/ExportAuthorizationEngine.ts` | 52 | `rationale: `EXPORT BLOCKED: Restricted artifacts cannot be exported formally. Allowed only for inter` |
| `src/core/security/permission-engine.ts` | 98 | `return deny('DENY_ROLE_NOT_ALLOWED', 'Investors cannot view internal causality or logs');` |
| `src/i18n/en-US.ts` | 56 | `'navigation.page.adm_root': 'Administration',` |
| `src/i18n/en-US.ts` | 58 | `'navigation.page.contabil_root': 'Accounting',` |
| `src/i18n/en-US.ts` | 64 | `'navigation.page.financeira_root': 'Finance',` |
| `src/i18n/en-US.ts` | 180 | `'landing.hero.subtitle2': 'Continuous strategic support for founders, boards, and management in crit` |
| `src/i18n/en-US.ts` | 186 | `'landing.decisions.desc2': 'Therefore, Illumine acts as a permanent support structure — actively par` |
| `src/i18n/en-US.ts` | 584 | `'landing.auth.what.desc_p2': 'Everything connected in an architecture designed to support companies ` |
| `src/i18n/en-US.ts` | 730 | `'causal.root_causes': 'Root Cause Mapper',` |
| `src/i18n/en-US.ts` | 732 | `'causal.no_causes': 'No root cause or critical vector of structural pressure has been flagged.',` |
| `src/i18n/es-ES.ts` | 56 | `'navigation.page.adm_root': 'Administración',` |
| `src/i18n/es-ES.ts` | 58 | `'navigation.page.contabil_root': 'Contabilidad',` |
| `src/i18n/es-ES.ts` | 64 | `'navigation.page.financeira_root': 'Finanças',` |
| `src/i18n/es-ES.ts` | 730 | `'causal.root_causes': 'Mapeador de Causas Raíz',` |
| `src/i18n/pt-BR.ts` | 56 | `'navigation.page.adm_root': 'Administração',` |
| `src/i18n/pt-BR.ts` | 58 | `'navigation.page.contabil_root': 'Contabilidade',` |
| `src/i18n/pt-BR.ts` | 64 | `'navigation.page.financeira_root': 'Finanças',` |
| `src/i18n/pt-BR.ts` | 730 | `'causal.root_causes': 'Mapeador de Causas Raiz',` |
| `src/import-governance/HierarchyIntegrityValidator.ts` | 5 | `const rootSynthetic = entries.find(e => e.originalCategory.toLowerCase() === 'ativo total' || e.orig` |
| `src/import-governance/HierarchyIntegrityValidator.ts` | 6 | `if (rootSynthetic && entries.length < 5) {` |
| `src/import-governance/HierarchyIntegrityValidator.ts` | 13 | `rootSynthetic.violations.push(violation);` |
| `src/import-governance/HierarchyIntegrityValidator.ts` | 14 | `rootSynthetic.status = 'NEEDS_REVIEW';` |
| `src/lib/bpEngine.ts` | 200 | `const rootNodes = flatNodes.filter(n => !n.parentId);` |
| `src/lib/bpEngine.ts` | 218 | `rootNodes.forEach(root => calculateBottomUp(root));` |
| `src/lib/bpEngine.ts` | 456 | `return { nodes: rootNodes, flatNodes, summary };` |
| `src/lib/dreInsights.ts` | 23 | `internalAuditErrors: string[];` |
| `src/lib/dreInsights.ts` | 50 | `internalAuditErrors` |
| `src/lib/dreInsights.ts` | 86 | `internalAuditErrors.forEach(err => {` |
| `src/lib/executive-audience-adaptation-engine.ts` | 46 | `for (const evidence of reasoning.supportingEvidence) {` |
| `src/lib/executive-confidence-disclosure-engine.ts` | 14 | `evidenceCount: reasoning.supportingEvidence.length,` |
| `src/lib/executive-confidence-disclosure-engine.ts` | 15 | `memoryCount: reasoning.supportingMemories.length,` |
| `src/lib/executive-conversation-engine.ts` | 31 | `: `Based on deterministic institutional reasoning, ${traceability.evidenceCount} evidence points sup` |
| `src/lib/executive-conversation-engine.ts` | 40 | `if (reasoning.supportingMemories.length > 0) {` |
| `src/lib/governance-copilot-conflict-engine.ts` | 44 | `description: 'High ESG Governance score conflicts with high volume of internal governance friction.'` |
| `src/lib/governance-copilot-reasoning-engine.ts` | 24 | `const supportingEvidence = GovernanceCopilotEvidenceEngine.resolveEvidence(input, relevantTopics);` |
| `src/lib/governance-copilot-reasoning-engine.ts` | 25 | `const supportingMemories = GovernanceCopilotMemoryEngine.resolveMemories(input, relevantTopics);` |
| `src/lib/governance-copilot-reasoning-engine.ts` | 33 | `supportingEvidence.length,` |
| `src/lib/governance-copilot-reasoning-engine.ts` | 34 | `supportingMemories.length,` |
| `src/lib/governance-copilot-reasoning-engine.ts` | 54 | `supportingEvidence,` |
| `src/lib/governance-copilot-reasoning-engine.ts` | 55 | `supportingMemories,` |
| `src/lib/governance-copilot-reasoning-types.ts` | 67 | `supportingEvidence: GovernanceCopilotEvidenceReference[];` |
| `src/lib/governance-copilot-reasoning-types.ts` | 68 | `supportingMemories: GovernanceCopilotMemoryReference[];` |
| `src/lib/governance-digital-twin-engine.ts` | 47 | `: "Execution capability supports ongoing and new strategic commitments.",` |
| `src/main.tsx` | 30 | `createRoot(document.getElementById('root')!).render(` |
| `src/runtime/adapters/BoardRiskMatrixAdapter.ts` | 257 | `alerts.push('Operational continuity demonstrates elevated dependency on shareholder-supported struct` |
| `src/runtime/adapters/CreditCommitteeSimulatorAdapter.ts` | 301 | `rationale: 'Accounting earnings show improvement, but rely heavily on related party financial suppor` |
| `src/runtime/adapters/CreditCommitteeSimulatorAdapter.ts` | 515 | `alerts.push('Profitability demonstrates weak treasury conversion support.');` |
| `src/runtime/adapters/EconomicNormalizationAdapter.ts` | 280 | `alerts.push('Reported capital returns are not fully supported by recurring operational treasury gene` |
| `src/runtime/adapters/ExecutiveExecutionAdapter.ts` | 17 | `rootFriction?: 'CASH_CONSTRAINT' | 'PEOPLE_CONSTRAINT' | 'GOVERNANCE_CONSTRAINT' | 'SUPPLIER_CONSTRA` |
| `src/runtime/adapters/ExecutiveExecutionAdapter.ts` | 136 | `rootFriction: 'CASH_CONSTRAINT'` |
| `src/runtime/adapters/ExecutiveExecutionAdapter.ts` | 160 | `rootFriction: 'PEOPLE_CONSTRAINT',` |
| `src/runtime/adapters/ExecutiveExecutionAdapter.ts` | 490 | `if (rec.rootFriction) {` |
| `src/runtime/adapters/ExecutiveExecutionAdapter.ts` | 491 | `frictionCounts[rec.rootFriction] = (frictionCounts[rec.rootFriction] || 0) + 1;` |
| `src/runtime/adapters/ExecutiveExecutionAdapter.ts` | 642 | `friction: r.rootFriction,` |
| `src/runtime/adapters/InstitutionalMemoryAdapter.ts` | 402 | `alerts.push('Institutional continuity demonstrates recurring dependency on shareholder-supported str` |
| `src/runtime/adapters/LegacyDFCAdapter.ts` | 1144 | `const supportRatio = (Math.abs(fluxoPartesRelacionadas) + Math.abs(fluxoCapitalizacao)) / Math.max(M` |
| `src/runtime/adapters/LegacyDFCAdapter.ts` | 1146 | `if (supportRatio < 0.05) eqSupportDeduction = 0;` |
| `src/runtime/adapters/LegacyDFCAdapter.ts` | 1147 | `else if (supportRatio < 0.2) eqSupportDeduction = 3;` |
| `src/runtime/adapters/LegacyDFCAdapter.ts` | 1148 | `else if (supportRatio <= 0.5) eqSupportDeduction = 7;` |
| `src/runtime/adapters/LegacyDFCAdapter.ts` | 1186 | `if (historicalSupportYears > 0 && supportRatio >= 0.05) {` |
| `src/runtime/adapters/LegacyDFCAdapter.ts` | 1342 | `const supportFlow = Math.abs(fluxoPartesRelacionadas) + Math.abs(fluxoCapitalizacao);` |
| `src/runtime/adapters/LegacyDFCAdapter.ts` | 1343 | `if (supportFlow > 0.25 * Math.abs(fcoContabilReconciled)) {` |
| `src/runtime/adapters/LegacyDFCAdapter.ts` | 1878 | `value: supportRatio,` |
| `src/runtime/adapters/LegacyDREAdapter.ts` | 143 | `const internalAuditErrors: string[] = [];` |
| `src/runtime/adapters/LegacyDREAdapter.ts` | 147 | `internalAuditErrors.push(`Divergência matemática detectada: Lucro Bruto.`);` |
| `src/runtime/adapters/LegacyDREAdapter.ts` | 151 | `internalAuditErrors.push(`Divergência matemática detectada: Resultado Operacional.`);` |
| `src/runtime/adapters/LegacyDREAdapter.ts` | 269 | `breakEvenDays, indiceConversaoOperacional, ebitda, recGrowth, ebitdaGrowth, internalAuditErrors,` |
| `src/runtime/adapters/LegacyDREAdapter.ts` | 326 | `if (internalAuditErrors.length > 0) {` |
| `src/runtime/adapters/LegacyDREAdapter.ts` | 330 | `message: internalAuditErrors.join(' | '),` |
| `src/runtime/adapters/SovereignDecisionAdapter.ts` | 1139 | `lineageHash: `sde-root-hash-${runway}-${sdsUrgency}`` |
| `src/services/cashFlowService.ts` | 202 | `requestedAction: 'CREATE_SNAPSHOT', // Considering this an internal system snapshot of the cash flow` |
| `src/services/governanceService.ts` | 123 | `const isSuperAdmin = context.role === 'SUPER_ADMIN';` |
| `src/services/governanceService.ts` | 124 | `const targetTenant = isSuperAdmin ? (filters.tenantId || activeTenant) : activeTenant;` |
| `src/services/governanceService.ts` | 127 | `if (isSuperAdmin && !filters.tenantId) {` |
| `src/services/governanceService.ts` | 156 | `const isSuperAdmin = context.role === 'SUPER_ADMIN';` |
| `src/services/governanceService.ts` | 157 | `const targetTenant = isSuperAdmin ? (filters.tenantId || activeTenant) : activeTenant;` |
| `src/services/governanceService.ts` | 160 | `if (isSuperAdmin && !filters.tenantId) {` |
| `src/services/governanceService.ts` | 189 | `const isSuperAdmin = context.role === 'SUPER_ADMIN';` |
| `src/services/governanceService.ts` | 190 | `const targetTenant = isSuperAdmin ? (filters.tenantId || activeTenant) : activeTenant;` |
| `src/services/governanceService.ts` | 193 | `if (isSuperAdmin && !filters.tenantId) {` |
| `src/services/governanceService.ts` | 221 | `const isSuperAdmin = context.role === 'SUPER_ADMIN';` |
| `src/services/governanceService.ts` | 222 | `const targetTenant = isSuperAdmin ? (filters.tenantId || activeTenant) : activeTenant;` |
| `src/services/governanceService.ts` | 225 | `if (isSuperAdmin && !filters.tenantId) {` |
| `src/services/importService.ts` | 595 | `export const inferType = (code: string, name: string, rootMap?: Record<string, string>): string => {` |
| `src/services/importService.ts` | 656 | `if (rootMap) {` |
| `src/services/importService.ts` | 657 | `if (rootMap[firstGroup]) return rootMap[firstGroup];` |
| `src/services/importService.ts` | 658 | `if (rootMap[firstChar]) return rootMap[firstChar];` |
| `src/services/importService.ts` | 710 | `const rootMap: Record<string, string> = {};` |
| `src/services/importService.ts` | 730 | `rootMap[acc.code] = type;` |
| `src/services/importService.ts` | 733 | `rootMap[acc.code.charAt(0)] = type;` |
| `src/services/importService.ts` | 749 | `if (!rootMap[digit]) rootMap[digit] = type;` |
| `src/services/importService.ts` | 753 | `const rootKeys = Object.keys(rootMap).sort((a, b) => b.length - a.length);` |
| `src/services/importService.ts` | 761 | `const matchingRoot = rootKeys.find(rk => acc.code.startsWith(rk));` |
| `src/services/importService.ts` | 769 | `finalType = matchingRoot ? rootMap[matchingRoot] : selfType;` |
| `src/services/security/PermissionResolver.ts` | 21 | `isSuperAdmin(): boolean {` |
| `src/services/security/PermissionResolver.ts` | 44 | `return this.isSuperAdmin() || this.isGovernanceAdmin();` |
| `src/services/supportService.ts` | 21 | `const TICKETS_COLLECTION = 'support_tickets';` |
| `src/services/supportService.ts` | 22 | `const MESSAGES_COLLECTION = 'support_messages';` |
| `src/services/supportService.ts` | 24 | `export const supportService = {` |
| `src/services/supportService.ts` | 70 | `console.error('Error creating support ticket:', error);` |
| `src/services/supportService.ts` | 151 | `const storageRef = ref(storage, `support_attachments/${ticketId}/${fileName}`);` |
| `src/topology/IntercompanyResolver.ts` | 18 | `const internalOperations = operations.filter(op =>` |
| `src/topology/IntercompanyResolver.ts` | 27 | `for (const op of internalOperations) {` |
