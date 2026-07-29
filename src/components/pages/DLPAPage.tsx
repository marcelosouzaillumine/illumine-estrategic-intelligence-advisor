import { ExecutiveText } from '../ui/executive-typography';
import { ExecutiveHeading } from '../ui/executive-heading';
import React from 'react';
import { createPortal } from 'react-dom';
import { Loader2, BookOpen, TrendingUp, ShieldAlert, ShieldCheck, FileText } from 'lucide-react';
import { ResponsiveContainer } from 'recharts';
import { ExecutiveTable, ExecutiveTableHeader, ExecutiveTableBody, ExecutiveTableRow, ExecutiveTableHead, ExecutiveTableCell } from '../ui/executive-table';
import { ExecutiveHistoricalEvolutionCard } from '../ui/executive-historical-evolution-card';
import { ExecutiveComposedChart, ExecutiveBar, ExecutiveLine, ExecutiveChartGrid, ExecutiveChartXAxis, ExecutiveChartTooltip } from '../ui/executive-chart';
import { ExecutiveChartSemanticPalette } from '../../adapters/ui/ThemeAdapter';
import { ExecutiveEmptyState } from '../ui/executive-empty-state';
import { ExecutiveSummarySection } from '../ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../ui/executive-decision-trace';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveStrategicSemanticCards } from '../ui/executive-strategic-semantic-cards';
import { ExecutiveTechnicalLayer } from '../ui/executive-technical-layer';
import { ExecutiveMetricCard } from '../ui/executive-metric-card';
import { ExecutiveTechnicalMetricCard } from '../ui/executive-technical-metric-card';
import { ExecutiveBadge } from '../ui/executive-badge';
import { ExecutiveCallout } from '../ui/executive-callout';
import { cn, formatCurrency } from '../../lib/utils';
import { PageHeader, StatusBadge } from '../Common';
import { ImportFinancialModal } from '../modals/ImportFinancialModal';
import { DLPAActionToolbar } from './dlpa/DLPAActionToolbar';
import { DLPADataSourceStatus } from './dlpa/DLPADataSourceStatus';
import { DLPAYearFilter } from './dlpa/DLPAYearFilter';
import { ManualFinancialModal } from '../modals/ManualFinancialModal';
import { ExecutivePageTemplate } from '../ui/executive-page-template';
import { useDLPAPageViewModel, normalizeDLPARow } from './dlpa/useDLPAPageViewModel';
import { ExecutiveIntelligenceShell } from '../executive/ExecutiveIntelligenceShell';
import { ExecutiveDecisionSurface } from '../executive/ExecutiveDecisionSurface';
import { ExecutiveInsightsPanel } from '../executive/ExecutiveInsightsPanel';
import { ExecutiveAgentActionSurface } from '../executive/ExecutiveAgentActionSurface';
import { ExecutiveExperienceComposer } from '@illumine/executive-experience-composer';

export function DLPAPage({ clients, selectedClient, selectedYear }: any) {
  // Adapter: useFinancialDomain e Firestore collection('dlpa') sincronizam os saldos iniciais e distribuição de lucros
  // ViewModel: useDLPAPageViewModel e FinancialDomainViewModel gerenciam o fluxo de reservas e patrimônio líquido
  const {
    state: {
      filterYear,
      toast,
      deleting,
      showDeleteConfirm,
      showImportModal,
      showManualModal,
      showElsaPanel,
      renderingViolations,
      featureFlags,
      loading,
      hasData,
      capitalGov,
      executiveLayer,
      dlpaPayload,
      dbDataDLPA,
      chartData,
      dlpaMetrics,
      cpiStatus,
      retentionStyle,
      distributionStyle,
      preservationStyle,
      alignedMaturity,
      maturityStyle,
      lucrosPrejuizosFinal,
      semanticSource,
      lifecycleStage,
      fiduciaryOutput,
      distribution,
      preservation,
      narrative,
      executiveNarrativeInsight
    },
    actions: {
      setFilterYear,
      setShowDeleteConfirm,
      setShowImportModal,
      setShowManualModal,
      handleDeleteAll,
      refetchDLPA
    }
  } = useDLPAPageViewModel(clients, selectedClient, selectedYear);

  const composedExp = React.useMemo(() => {
    return ExecutiveExperienceComposer.compose({
      companyId: String(selectedClient || 'comp-1'),
      userId: 'user-c-level',
      pageId: 'DLPAPage',
      period: String(filterYear || selectedYear || 2026)
    });
  }, [selectedClient, filterYear, selectedYear]);

  return (
    <ExecutiveIntelligenceShell pageTitle="DLPA — Lucros e Prejuízos Acumulados" pageContext="DLPAPage">
      <ExecutiveDecisionSurface
        pageTitle="DLPA Contábil"
        opportunityTitle={composedExp.decisionView.opportunityTitle}
        opportunityDetail={composedExp.decisionView.opportunityDetail}
        agentName={composedExp.decisionView.anchorAgentName}
      />
      <ExecutiveInsightsPanel pageTitle="DLPA Contábil" />
      <ExecutiveAgentActionSurface />
      <ExecutivePageTemplate header={{
      title: "DLPA — Demonstração de Lucros e Prejuízos Acumulados",
      description: "Análise estrutural de distribuição de lucros, preservação patrimonial e maturidade de governança de capital.",
    }}>

      {/* Control Bar (Context Controls & Actions) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-4">
            {hasData && (
              <StatusBadge status="Ativo" />
            )}
            <DLPADataSourceStatus hasRealData={hasData} loading={loading} />
            {lifecycleStage === 'INITIAL_CAPITALIZATION' && (
              <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-insight-soft text-insight border border-insight/20 shadow-sm">
                Fase Inicial de Capitalização
              </span>
            )}
          </div>
          <DLPAYearFilter filterYear={filterYear} onChangeYear={setFilterYear} />
        </div>

        {hasData && (
          <DLPAActionToolbar 
            onLaunchData={() => setShowManualModal(true)} 
            onImport={() => setShowImportModal(true)} 
            onDelete={() => setShowDeleteConfirm(true)} 
          />
        )}
      </div>

      {/* Temporário: Auditoria de Propagação ELSA (Atalho: Ctrl+Shift+E) */}
      {showElsaPanel && (featureFlags.showSemanticAudit || process.env.NODE_ENV !== 'production') && (capitalGov as any)?.lifecycleAudit && (
        <div className="bg-foreground border border-border p-4 rounded-xl mb-6 flex flex-col gap-2">
          <ExecutiveHeading as="h4" className="text-white mb-2 flex items-center gap-2">
            <ShieldCheck size={14} className="text-emerald-400" /> Auditoria de Propagação ELSA (Painel Técnico)
          </ExecutiveHeading>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[10px] uppercase font-mono text-muted-foreground">
            <div>
              <span className="block text-muted-foreground mb-1">Semantic Source:</span>
              <strong className={(capitalGov as any).lifecycleAudit.semanticSource === 'ELSA' ? 'text-emerald-400' : 'text-amber-400'}>
                {(capitalGov as any).lifecycleAudit.semanticSource}
              </strong>
            </div>
            <div>
              <span className="block text-muted-foreground mb-1">Raw Governance Status:</span>
              <strong className="text-amber-400">
                {(capitalGov as any)?.diagnostics?.behavior?.governanceMaturity || 'N/A'}
              </strong>
            </div>
            <div>
              <span className="block text-muted-foreground mb-1">Resolved Governance:</span>
              <strong className="text-emerald-400">
                {(capitalGov as any)?.resolvedGovernanceStatus || 'N/A'}
              </strong>
            </div>
            <div>
              <span className="block text-muted-foreground mb-1">Raw Capital Status:</span>
              <strong className="text-amber-400">
                {preservation?.preservationStatus || 'N/A'}
              </strong>
            </div>
            <div>
              <span className="block text-muted-foreground mb-1">Resolved Capital:</span>
              <strong className="text-emerald-400">
                {(capitalGov as any)?.resolvedCapitalStatus || 'N/A'}
              </strong>
            </div>
            <div>
              <span className="block text-muted-foreground mb-1">Fallback Activated:</span>
              <strong className={(capitalGov as any).lifecycleAudit.fallbackActivated ? 'text-rose-400' : 'text-emerald-400'}>
                {(capitalGov as any).lifecycleAudit.fallbackActivated ? 'YES' : 'NO'}
              </strong>
            </div>
            <div>
              <span className="block text-muted-foreground mb-1">Fallback Reason:</span>
              <strong className="text-rose-400">
                {(capitalGov as any).lifecycleAudit.fallbackReason || 'N/A'}
              </strong>
            </div>
            <div>
              <span className="block text-muted-foreground mb-1">UI Rendering Match:</span>
              <strong className={alignedMaturity === (capitalGov as any)?.resolvedGovernanceStatus ? 'text-emerald-400' : 'text-rose-400'}>
                {alignedMaturity === (capitalGov as any)?.resolvedGovernanceStatus ? 'VALID' : 'LEGACY_FIELD_RENDERED'}
              </strong>
            </div>
          </div>
          {renderingViolations.length > 0 && (
            <div className="mt-2 pt-2 border-t border-border pt-8 mb-8">
              <span className="block text-rose-400 font-bold text-[9px] mb-1">Controlled Rendering Violations:</span>
              {renderingViolations.map((v: any, i: number) => (
                <div key={i} className="text-[9px] text-rose-300 font-mono">
                  [{v.code}] {v.message}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!loading && !hasData && (
        <div className="flex flex-col gap-6 w-full mb-12">
          <ExecutiveEmptyState
            icon={<BookOpen />}
            title="Nenhum dado disponível para este exercício"
            description={`Importe ou registre manualmente a Demonstração de Lucros e Prejuízos Acumulados para iniciar a análise institucional.`}
            actionLabel="Lançar Dados"
            onAction={() => setShowManualModal(true)}
            secondaryActionLabel="Importar Arquivo"
            onSecondaryAction={() => setShowImportModal(true)}
          />
        </div>
      )}

      {hasData && (
        <div className="space-y-10 mb-12">
          {(capitalGov as any)?.error && (
            <ExecutiveSurface variant="critical" padding="xl" radius="xl" className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-critical-soft text-critical rounded-full flex items-center justify-center mb-4">
                <ShieldAlert size={28} />
              </div>
              <ExecutiveHeading as="h3" className="text-primary mb-2">Falha na Renderização Executiva</ExecutiveHeading>
              <p className="text-sm text-executive-secondary max-w-lg mb-4">
                Houve um erro ao processar a governança de capital.
              </p>
              <div className="bg-card border border-border rounded-xl p-4 text-xs font-mono text-critical w-full max-w-2xl text-left overflow-auto">
                {(capitalGov as any).error}
              </div>
            </ExecutiveSurface>
          )}

          {/* --- CAMADA 1: NÍVEL CONSELHO (SÍNTESE SOBERANA & PARECER FIDUCIÁRIO) --- */}
          <ExecutiveSummarySection 
            className="mb-8"
            status={{ label: 'Lucros Auditados', variant: 'success' }}
            question="Qual a política de retenção e distribuição de lucros acumulados e a integridade da preservação patrimonial?"
            opinion={narrative || "O comitê fiduciário homologa a DLPA, atestando a constituição correta de reservas legais, retenção de lucros e salvaguarda do capital investido."}
            driver="Saldo inicial, lucro líquido do exercício, reservas de lucros e dividendos distribuídos."
            implication="Preservação da base patrimonial para suportar a estratégia de expansão e mitigar riscos de erosão de capital."
            action="Manter percentual mínimo de retenção alinhado à meta de alavancagem e às diretrizes estratégicas do conselho."
          >
            <ExecutiveStrategicTensions tensions={[]} />
            <ExecutiveDecisionTrace trace={[]} />
          </ExecutiveSummarySection>

          {executiveLayer && (
            <div className="space-y-10">
              
              {/* Capital Preservation Score (CPS) Header Block */}
              {executiveLayer.capitalPreservationScore && (
                <ExecutiveSurface padding="xl" radius="xl" className="mb-6 border-border bg-card shadow-sm">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    {/* Left: Title & Description */}
                    <div className="lg:col-span-8 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-1">
                        <ShieldCheck size={24} className="text-primary" />
                        <ExecutiveHeading as="h3" className="text-foreground">Capital Preservation Score (CPS)</ExecutiveHeading>
                      </div>
                      <ExecutiveText as="div" variant="bodyStandard" className="text-foreground/70 mb-6">Avalia a capacidade da organização de preservar e fortalecer o capital investido pelos sócios.</ExecutiveText>
                    </div>

                    {/* Right: Score Panel */}
                    <div className="lg:col-span-4 w-full h-full flex flex-col justify-center">
                      {(() => {
                        const cpsValue = executiveLayer.capitalPreservationScore.value || 0;
                        let tone: 'success' | 'info' | 'warning' | 'critical' | 'neutral' = 'success';
                        if (cpsValue < 40) tone = 'critical';
                        else if (cpsValue < 70) tone = 'warning';
                        else if (cpsValue < 90) tone = 'info';
                        
                        return (
                          <ExecutiveMetricCard
                            label="Score Geral"
                            value={<span className="text-4xl font-black">{cpsValue.toFixed(0)}<span className="text-xl text-muted-foreground font-semibold">/100</span></span>}
                            statusBadge={<ExecutiveBadge variant={tone}>{executiveLayer.capitalPreservationScore.classification || "Capital Erodido"}</ExecutiveBadge>}
                            tone="neutral"
                            description={
                              <span className="text-sm font-medium text-foreground/90">
                                Preservação Geral
                              </span>
                            }
                            className="h-full justify-center bg-card border border-border shadow-sm"
                          />
                        );
                      })()}
                    </div>
                  </div>
                </ExecutiveSurface>
              )}

              {/* Cards Semânticos Estratégicos */}
              {dlpaPayload && (
                <div className="mb-8">
                  <ExecutiveStrategicSemanticCards payload={dlpaPayload} selectedYear={selectedYear} />
                </div>
              )}

              {/* Inteligência de Preservação de Capital */}
              <ExecutiveSurface padding="xl" radius="xl" className="border-border bg-card shadow-sm">
                <div className="mb-6 md:mb-8">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp size={24} className="text-primary" />
                    <ExecutiveHeading as="h3" className="md:text-[22px] text-foreground">Inteligência de Preservação de Capital</ExecutiveHeading>
                  </div>
                  <ExecutiveText as="div" variant="bodyStandard" className="text-foreground/70">Indicadores sintéticos de preservação, consumo e recomposição do capital.</ExecutiveText>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6 items-stretch">
                  {/* Card 0: Índice de Síntese Fiduciária */}
                  {(() => {
                    const val = executiveLayer.fiduciarySynthesisIndicator?.value ?? 0;
                    const classification = executiveLayer.fiduciarySynthesisIndicator?.classification || 'Não Calculado';
                    let tone: 'critical' | 'warning' | 'info' | 'success' = val >= 75 ? 'success' : val >= 50 ? 'info' : val >= 30 ? 'warning' : 'critical';
                    return (
                      <ExecutiveMetricCard
                        label="Índice de Síntese Fiduciária"
                        value={`${val.toFixed(1).replace('.', ',')}`}
                        statusBadge={<ExecutiveBadge variant={tone}>{classification}</ExecutiveBadge>}
                        tone="neutral"
                        description={<span className="font-medium text-foreground/90">{executiveLayer.fiduciarySynthesisIndicator?.narrative}</span>}
                        className="h-full bg-card border border-border shadow-sm"
                      />
                    );
                  })()}

                  {/* Card 1: Índice de Preservação de Capital (CPS) */}
                  {(() => {
                    const val = executiveLayer.capitalPreservationStatus?.value ?? 0;
                    const classification = executiveLayer.capitalPreservationStatus?.classification || 'Capital Erodido';
                    let tone: 'critical' | 'warning' | 'info' | 'success' = val >= 0.90 ? 'success' : val >= 0.75 ? 'info' : val >= 0.50 ? 'warning' : 'critical';
                    return (
                      <ExecutiveMetricCard
                        label="Índice de Preservação de Capital (CPS)"
                        value={`${(val * 100).toFixed(1).replace('.', ',')}%`}
                        statusBadge={<ExecutiveBadge variant={tone}>{classification}</ExecutiveBadge>}
                        tone="neutral"
                        description={<span className="font-medium text-foreground/90">{executiveLayer.capitalPreservationStatus?.narrative}</span>}
                        className="h-full bg-card border border-border shadow-sm"
                      />
                    );
                  })()}

                  {/* Card 2: Capital Consumido */}
                  {(() => {
                    const val = executiveLayer.capitalErosionRisk?.value ?? 0;
                    const consumedAmount = executiveLayer.capitalErosionRisk?.capitalConsumedAmount ?? 0;
                    const classification = executiveLayer.capitalErosionRisk?.classification || 'Baixo';
                    let tone: 'critical' | 'warning' | 'info' | 'success' = val >= 0.50 ? 'critical' : val >= 0.25 ? 'warning' : 'success';
                    return (
                      <ExecutiveMetricCard
                        label="Capital Consumido"
                        value={formatCurrency(consumedAmount)}
                        statusBadge={<ExecutiveBadge variant={tone}>{classification}</ExecutiveBadge>}
                        tone="neutral"
                        description={<span className="font-medium text-foreground/90">{executiveLayer.capitalErosionRisk?.narrative}</span>}
                        className="h-full bg-card border border-border shadow-sm"
                      />
                    );
                  })()}

                  {/* Card 3: Recomposição Requerida */}
                  {(() => {
                    const val = executiveLayer.capitalRecoveryRequirement?.value ?? 0;
                    const requiredAmount = executiveLayer.capitalRecoveryRequirement?.capitalRecoveryRequired ?? 0;
                    const classification = executiveLayer.capitalRecoveryRequirement?.classification || 'Patrimônio Íntegro';
                    const tone = val > 0 ? 'critical' : 'success';
                    return (
                      <ExecutiveMetricCard
                        label="Recomposição"
                        value={formatCurrency(requiredAmount)}
                        statusBadge={<ExecutiveBadge variant={tone}>{classification}</ExecutiveBadge>}
                        tone="neutral"
                        description={<span className="font-medium text-foreground/90">{executiveLayer.capitalRecoveryRequirement?.narrative}</span>}
                        className="h-full bg-card border border-border shadow-sm"
                      />
                    );
                  })()}

                  {/* Card 4: Horizonte de Recuperação Patrimonial */}
                  {(() => {
                    const formatted = executiveLayer.patrimonialRecoveryHorizon?.formatted || 'Não Estimável';
                    const classification = executiveLayer.capitalRecoverability?.classification || 'Não Estimável';
                    let tone: 'critical' | 'warning' | 'info' | 'success' = classification === 'Alta' ? 'success' : classification === 'Moderada' ? 'info' : classification === 'Baixa' ? 'warning' : 'critical';
                    return (
                      <ExecutiveMetricCard
                        label="Horizonte"
                        value={formatted}
                        statusBadge={<ExecutiveBadge variant={tone}>{classification}</ExecutiveBadge>}
                        tone="neutral"
                        description={<span className="font-medium text-foreground/90">{executiveLayer.capitalRecoverability?.narrative}</span>}
                        className="h-full bg-card border border-border shadow-sm"
                      />
                    );
                  })()}
                </div>
              </ExecutiveSurface>

              {/* --- CAMADA 2: DIRETORIA & GOVERNANÇA PATRIMONIAL --- */}
              <ExecutiveSurface padding="xl" radius="xl" className="border-border bg-card shadow-sm">
                <div className="mb-6 md:mb-8">
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck size={24} className="text-primary" />
                    <ExecutiveHeading as="h3" className="md:text-[22px] text-foreground">Proteção ao Capital dos Sócios</ExecutiveHeading>
                  </div>
                  <ExecutiveText as="div" variant="bodyStandard" className="text-foreground/70">Análise de risco, dependência e salvaguarda do capital investido.</ExecutiveText>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6 items-stretch mb-6">
                  {/* Card 5: Dependência dos Sócios */}
                  {(() => {
                    const val = executiveLayer.shareholderDependencyNarrative?.value ?? 1;
                    const classification = executiveLayer.shareholderDependencyNarrative?.classification || 'Baixa';
                    let tone: 'critical' | 'warning' | 'info' | 'success' = classification === 'Crítica' || classification === 'Alta' ? 'critical' : classification === 'Moderada' ? 'warning' : 'success';
                    const formattedValue = val === Infinity ? 'Insolvência' : `${val.toFixed(2).replace('.', ',')}x`;
                    return (
                      <ExecutiveMetricCard
                        label="Dependência de Aportes"
                        value={formattedValue}
                        statusBadge={<ExecutiveBadge variant={tone}>{classification}</ExecutiveBadge>}
                        tone="neutral"
                        description={<span className="font-medium text-foreground/90">{executiveLayer.shareholderDependencyNarrative?.narrative}</span>}
                        className="h-full bg-card border border-border shadow-sm"
                      />
                    );
                  })()}
                </div>

                {executiveLayer.retention?.classification === 'Retenção Compulsória' && (
                  <div className="pt-4 border-t border-border">
                    <ExecutiveCallout
                      variant="warning"
                      title="Aviso de Governança Patrimonial: Retenção Compulsória"
                    >
                      <p className="text-sm text-executive-secondary leading-relaxed font-medium">
                        Todo lucro futuro deverá ser destinado prioritariamente à absorção dos prejuízos acumulados antes da retomada de distribuições aos sócios.
                      </p>
                    </ExecutiveCallout>
                  </div>
                )}
              </ExecutiveSurface>

              {/* Evolução Histórica & Radar de Governança */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                
                <ExecutiveHistoricalEvolutionCard 
                  title="Lucro vs Distribuição Histórica"
                  description="Evolução dos últimos 5 anos de destinação de resultados."
                  insight={executiveNarrativeInsight}
                  legendItems={[
                    { label: 'Lucro Líquido', colorKey: 'profit' },
                    { label: 'Dividendos', colorKey: 'liability' },
                    { label: 'Reserva Legal', colorKey: 'primary' }
                  ]}
                >
                  <div style={{ height: 300 }} className="w-full mt-4 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <ExecutiveComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <ExecutiveChartGrid vertical={false} />
                        <ExecutiveChartXAxis dataKey="year" dy={8} />
                        <ExecutiveChartTooltip 
                          formatter={(value: number) => formatCurrency(value)}
                          labelStyle={{ color: 'var(--color-muted-foreground)', fontWeight: 'bold' }}
                        />
                        <ExecutiveBar dataKey="LucroLíquido" name="Lucro Líquido" fill={ExecutiveChartSemanticPalette.profit} radius={[5, 5, 0, 0]} maxBarSize={40} />
                        <ExecutiveBar dataKey="Dividendos"   name="Dividendos"    fill={ExecutiveChartSemanticPalette.liability} radius={[5, 5, 0, 0]} maxBarSize={40} />
                        <ExecutiveLine type="monotone" dataKey="ReservaLegal" name="Reserva Legal" stroke={ExecutiveChartSemanticPalette.primary} strokeWidth={3}
                          dot={{ r: 4, fill: ExecutiveChartSemanticPalette.primary, strokeWidth: 2, stroke: 'var(--color-executive-primary)' }} />
                      </ExecutiveComposedChart>
                    </ResponsiveContainer>
                  </div>
                </ExecutiveHistoricalEvolutionCard>

                {/* Radar de Governança (Padronizado no Design System) */}
                <ExecutiveSurface padding="xl" radius="xl" className="bg-card border border-border shadow-sm flex flex-col">
                  <ExecutiveHeading as="h3" className="text-foreground mb-1">Radar de Governança</ExecutiveHeading>
                  <ExecutiveText as="div" variant="bodyStandard" className="text-foreground/70 mb-6">Dimensões Institucionais de Retenção e Integridade Patrimonial.</ExecutiveText>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                    {[
                      { label: 'Sustentabilidade Patrimonial', value: cpiStatus !== 'NEUTRO' ? cpiStatus : '—', badge: preservationStyle.label, tone: preservationStyle.tone },
                      { label: 'Dependência de Capitalização', value: fiduciaryOutput?.capitalSupportRatio === 'NOT_AVAILABLE' ? 'N/A' : fiduciaryOutput?.capitalSupportRatio != null ? `${(fiduciaryOutput.capitalSupportRatio * 100).toFixed(1)}%` : '—', badge: retentionStyle.label, tone: retentionStyle.tone },
                      { label: 'Capacidade Distributiva', value: distribution?.distributionRatio != null && distribution.distributionRatio > 0 ? `${(distribution.distributionRatio * 100).toFixed(1)}%` : 'Inexistente', badge: distributionStyle.label, tone: distributionStyle.tone },
                      { label: 'Integridade Patrimonial', value: preservation ? `${(preservation.equityPreservationRatio * 100).toFixed(1)}%` : '—', badge: preservationStyle.label, tone: preservationStyle.tone }
                    ].map(({ label, value, badge, tone }) => (
                      <ExecutiveTechnicalMetricCard
                        key={label}
                        label={label}
                        value={value}
                        statusLabel={badge}
                        statusTone={tone as any}
                        className="bg-surface-container/30 border-border"
                      />
                    ))}
                  </div>
                </ExecutiveSurface>

              </div>

            </div>
          )}

          {/* --- CAMADA 3: CAMADA TÉCNICA E DETALHAMENTO CONTÁBIL --- */}
          <ExecutiveTechnicalLayer
            title="Camada Técnica (Contábil) & Fundamentação Metodológica"
            subtitle="Detalhamento Analítico e Racionais Fiduciários da DLPA"
            description="Demonstração Contábil importada, mapa de movimentações do Patrimônio Líquido e memória descritiva dos algoritmos."
            className="mb-8"
          >
            {/* Tabela Detalhada DLPA */}
            <ExecutiveSurface padding="none" radius="xl" className="overflow-hidden border-border bg-card shadow-sm mb-8">
              <div className="p-6 md:px-8 border-b border-border flex items-center justify-between bg-surface-container/30">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center border border-border">
                    <FileText size={18} className="text-foreground" />
                  </div>
                  <div>
                    <ExecutiveHeading as="h4" className="text-foreground">Detalhamento DLPA — {filterYear}</ExecutiveHeading>
                    <ExecutiveText as="div" variant="caption" className="text-muted-foreground mt-1">Demonstração Contábil Importada</ExecutiveText>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase px-3 py-1 rounded-full bg-surface-container text-foreground border border-border">
                  {dbDataDLPA.length} lançamentos
                </span>
              </div>
              <div className="p-2">
                <ExecutiveTable className="w-full text-sm">
                  <ExecutiveTableHeader>
                    <ExecutiveTableRow className="border-b border-border">
                      <ExecutiveTableHead className="text-left py-5 px-8 text-xs font-bold text-muted-foreground uppercase tracking-widest">Descrição da Conta</ExecutiveTableHead>
                      <ExecutiveTableHead className="text-right py-5 px-8 text-xs font-bold text-muted-foreground uppercase tracking-widest">Valor (R$)</ExecutiveTableHead>
                      <ExecutiveTableHead className="text-right py-5 px-8 text-xs font-bold text-muted-foreground uppercase tracking-widest">Natureza</ExecutiveTableHead>
                    </ExecutiveTableRow>
                  </ExecutiveTableHeader>
                  <ExecutiveTableBody>
                    {dbDataDLPA.map((rawRow: any, i: number) => {
                      const row = normalizeDLPARow(rawRow, i);
                      return (
                        <ExecutiveTableRow 
                          key={row.id} 
                          className={cn('transition-colors', row.isTotal ? 'bg-surface-container/30/60' : '')}
                        >
                          <ExecutiveTableCell className="py-4 px-8">
                            <span className={cn('block', row.isTotal ? 'text-executive-secondary font-black text-sm' : 'text-executive-secondary font-medium pl-4 text-sm')}>
                              {row.description}
                            </span>
                          </ExecutiveTableCell>
                          <ExecutiveTableCell className={cn('py-4 px-8 text-right font-mono font-bold text-sm',
                            row.nature === 'negative' ? 'text-critical' : 'text-muted-foreground',
                            row.isTotal && 'text-muted-foreground font-black')}>
                            {formatCurrency(row.value)}
                          </ExecutiveTableCell>
                          <ExecutiveTableCell className="py-4 px-8 text-right">
                            <ExecutiveBadge variant={row.nature === 'negative' ? 'critical' : row.nature === 'positive' ? 'success' : 'neutral'}>
                              {row.nature === 'negative' ? 'Redução' : row.nature === 'positive' ? 'Adição' : 'Neutro'}
                            </ExecutiveBadge>
                          </ExecutiveTableCell>
                        </ExecutiveTableRow>
                      );
                    })}
                    {dlpaMetrics && (
                      <ExecutiveTableRow className="bg-surface-high/30 hover:bg-surface-high/50 transition-colors">
                        <ExecutiveTableCell className="py-6 px-8 text-sm font-bold uppercase tracking-widest">
                          {lucrosPrejuizosFinal < 0 ? "Prejuízo Acumulado" : "Saldo de Lucros Acumulados"}
                        </ExecutiveTableCell>
                        <ExecutiveTableCell className={cn('py-6 px-8 text-right font-mono font-bold text-lg',
                          lucrosPrejuizosFinal >= 0 ? 'text-success' : 'text-critical')}>
                          {formatCurrency(lucrosPrejuizosFinal)}
                        </ExecutiveTableCell>
                        <ExecutiveTableCell className="py-6 px-8 text-right">
                          <ExecutiveBadge variant="neutral">Calculado</ExecutiveBadge>
                        </ExecutiveTableCell>
                      </ExecutiveTableRow>
                    )}
                  </ExecutiveTableBody>
                </ExecutiveTable>
              </div>
            </ExecutiveSurface>

            {/* Fundamentação e Racionais Metodológicos ELSA */}
            <div className="grid grid-cols-1 gap-6">
              {/* Racional 1: Preservação de Capital */}
              {(executiveLayer?.capitalPreservationStatus?.rationale || executiveLayer?.capitalErosionRisk?.rationale || executiveLayer?.capitalRecoveryRequirement?.rationale) && (
                <div className="p-4 bg-surface-container/30 border border-border rounded-xl">
                  <ExecutiveHeading as="h4" className="text-primary mb-3">Fundamentação de Preservação</ExecutiveHeading>
                  <div className="space-y-2">
                    {executiveLayer?.capitalPreservationStatus?.rationale && <ExecutiveText as="div" variant="bodyStandard" className="text-foreground/80">{executiveLayer.capitalPreservationStatus.rationale}</ExecutiveText>}
                    {executiveLayer?.capitalErosionRisk?.rationale && <ExecutiveText as="div" variant="bodyStandard" className="text-foreground/80">{executiveLayer.capitalErosionRisk.rationale}</ExecutiveText>}
                    {executiveLayer?.capitalRecoveryRequirement?.rationale && <ExecutiveText as="div" variant="bodyStandard" className="text-foreground/80">{executiveLayer.capitalRecoveryRequirement.rationale}</ExecutiveText>}
                  </div>
                </div>
              )}

              {/* Racional 2: Salvaguarda Patrimonial */}
              {(executiveLayer?.shareholderDependencyNarrative?.rationale || executiveLayer?.governanceInterpretation?.shareholderCapitalProtection) && (
                <div className="p-4 bg-surface-container/30 border border-border rounded-xl">
                  <ExecutiveHeading as="h4" className="text-primary mb-3">Salvaguarda Patrimonial</ExecutiveHeading>
                  <div className="space-y-2">
                    {executiveLayer?.governanceInterpretation?.shareholderCapitalProtection && <ExecutiveText as="div" variant="bodyStandard" className="text-foreground/80">{executiveLayer.governanceInterpretation.shareholderCapitalProtection}</ExecutiveText>}
                    {executiveLayer?.shareholderDependencyNarrative?.rationale && <ExecutiveText as="div" variant="bodyStandard" className="text-foreground/80">{executiveLayer.shareholderDependencyNarrative.rationale}</ExecutiveText>}
                  </div>
                </div>
              )}

              {/* Racional 3: Recuperação Patrimonial */}
              {(executiveLayer?.governanceInterpretation?.recoveryThesis || executiveLayer?.patrimonialRecoveryHorizon?.rationale) && (
                <div className="p-4 bg-surface-container/30 border border-border rounded-xl">
                  <ExecutiveHeading as="h4" className="text-primary mb-3">Tese de Recuperação Patrimonial</ExecutiveHeading>
                  <div className="space-y-2">
                    {executiveLayer?.governanceInterpretation?.recoveryThesis && <ExecutiveText as="div" variant="bodyStandard" className="text-foreground/80">{executiveLayer.governanceInterpretation.recoveryThesis}</ExecutiveText>}
                    {executiveLayer?.patrimonialRecoveryHorizon?.rationale && <ExecutiveText as="div" variant="bodyStandard" className="text-foreground/80">{executiveLayer.patrimonialRecoveryHorizon.rationale}</ExecutiveText>}
                  </div>
                </div>
              )}
            </div>
          </ExecutiveTechnicalLayer>
        </div>
      )}

      {/* Modals */}
      {showImportModal && (
        <ImportFinancialModal
          type="DLPA"
          clientId={selectedClient}
          year={filterYear}
          clients={clients || []}
          onClose={() => setShowImportModal(false)}
          onSuccess={() => { setShowImportModal(false); refetchDLPA(); }}
        />
      )}
      {showManualModal && (
        <ManualFinancialModal
          type="DLPA"
          clientId={selectedClient}
          year={filterYear}
          onClose={() => setShowManualModal(false)}
          onSuccess={() => { setShowManualModal(false); refetchDLPA(); }}
        />
      )}
    </ExecutivePageTemplate>
    </ExecutiveIntelligenceShell>
  );
}
