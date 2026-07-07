import React from 'react';
import { createPortal } from 'react-dom';
import { Loader2, BookOpen, TrendingUp, ShieldAlert, ShieldCheck, FileText } from 'lucide-react';
import { ResponsiveContainer } from 'recharts';

import { ExecutiveTable, ExecutiveTableHeader, ExecutiveTableBody, ExecutiveTableRow, ExecutiveTableHead, ExecutiveTableCell } from '../ui/executive-table';
import { ExecutiveHistoricalEvolutionCard } from '../ui/executive-historical-evolution-card';
import { ExecutiveComposedChart, ExecutiveBar, ExecutiveLine, ExecutiveChartGrid, ExecutiveChartXAxis, ExecutiveChartTooltip } from '../ui/executive-chart';
import { ExecutiveChartSemanticPalette } from '../../core/theme/ExecutiveChartSemanticPalette';
import { ExecutiveEmptyState } from '../ui/executive-empty-state';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveStrategicSemanticCards } from '../ui/executive-strategic-semantic-cards';
import { ExecutiveTechnicalLayer } from '../ui/executive-technical-layer';
import { ExecutiveMetricCard } from '../ui/executive-metric-card';
import { ExecutiveTechnicalMetricCard } from '../ui/executive-technical-metric-card';
import { ExecutiveBadge } from '../ui/executive-badge';

import { cn, formatCurrency } from '../../lib/utils';
import { PageHeader, StatusBadge } from '../Common';
import { ImportFinancialModal } from '../modals/ImportFinancialModal';
import { DLPAActionToolbar } from './dlpa/DLPAActionToolbar';
import { DLPADataSourceStatus } from './dlpa/DLPADataSourceStatus';
import { DLPAYearFilter } from './dlpa/DLPAYearFilter';
import { ManualFinancialModal } from '../modals/ManualFinancialModal';

import { useDLPAPageViewModel, normalizeDLPARow } from './dlpa/useDLPAPageViewModel';

export function DLPAPage({ clients, selectedClient, selectedYear }: any) {
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

  return (
    <div className="max-w-[1440px] mx-auto space-y-10 pb-32 animate-executive-fade">
      {/* Toast */}
      {toast && typeof document !== 'undefined' && createPortal(
        <div className={cn(
          'fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-bold text-white animate-executive-fade',
          toast.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'
        )}>
          {toast.message}
        </div>,
        document.body
      )}

      {showDeleteConfirm && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-card rounded-2xl p-8 shadow-2xl" style={{ width: '100%', maxWidth: '24rem' }}>
            <ShieldAlert size={32} className="text-critical mb-4" />
            <h3 className="text-lg font-black text-primary mb-2">Confirmar Exclusão</h3>
            <p className="text-sm text-executive-secondary mb-6 leading-relaxed">
              Todos os registros DLPA de <strong>{filterYear}</strong> serão excluídos permanentemente.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-4 py-2 border border-border rounded-xl text-sm font-medium text-executive-secondary hover:bg-surface-container/30">Cancelar</button>
              <button onClick={handleDeleteAll} disabled={deleting} className="flex-1 px-4 py-2 bg-critical-soft0 text-white rounded-xl text-sm font-bold hover:bg-rose-600 disabled:opacity-60">
                {deleting ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Excluir'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      <PageHeader
        title="DLPA — Demonstração de Lucros e Prejuízos Acumulados"
        subtitle="Análise estrutural de distribuição de lucros, preservação patrimonial e maturidade de governança de capital."
        icon={BookOpen}
        color="executive"
      />

      {lifecycleStage === 'INITIAL_CAPITALIZATION' && (
        <div className="flex justify-start -mt-6 -mb-6">
          <span className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-insight-soft text-insight border border-insight/20 shadow-sm">
            Fase Inicial de Capitalização
          </span>
        </div>
      )}

      {/* Temporário: Auditoria de Propagação ELSA (Atalho: Ctrl+Shift+E) */}
      {showElsaPanel && (featureFlags.showSemanticAudit || process.env.NODE_ENV !== 'production') && (capitalGov as any)?.lifecycleAudit && (
        <div className="bg-foreground border border-border p-4 rounded-xl mb-6 flex flex-col gap-2">
          <h4 className="text-xs font-black uppercase text-white mb-2 flex items-center gap-2">
            <ShieldCheck size={14} className="text-emerald-400" /> Auditoria de Propagação ELSA (Painel Técnico)
          </h4>
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
            <div className="mt-2 pt-2 border-t border-border">
              <span className="block text-rose-400 font-bold text-[9px] mb-1">Controlled Rendering Violations:</span>
              {renderingViolations.map((v, i) => (
                <div key={i} className="text-[9px] text-rose-300 font-mono">
                  [{v.code}] {v.message}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-4">
            {hasData && (
              <StatusBadge status="Ativo" />
            )}
            <DLPADataSourceStatus hasRealData={hasData} loading={loading} />
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
        <div className="space-y-6 mb-12">
          {(capitalGov as any)?.error && (
            <ExecutiveSurface variant="critical" padding="xl" radius="xl" className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-critical-soft text-critical rounded-full flex items-center justify-center mb-4">
                <ShieldAlert size={28} />
              </div>
              <h3 className="text-lg font-black text-primary mb-2">Falha na Renderização Executiva</h3>
              <p className="text-sm text-executive-secondary max-w-lg mb-4">
                Houve um erro ao processar a governança de capital.
              </p>
              <div className="bg-card border border-border rounded-xl p-4 text-xs font-mono text-critical w-full max-w-2xl text-left overflow-auto">
                {(capitalGov as any).error}
              </div>
            </ExecutiveSurface>
          )}
          
          {/* --- 2. EXECUTIVE LAYER UI --- */}
          {executiveLayer && (
            <div className="space-y-6">
              
              {/* Capital Preservation Score (CPS) Header Block */}
              {executiveLayer.capitalPreservationScore && (
                <ExecutiveSurface padding="xl" radius="xl" className="mb-6 border-border">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    {/* Left: Title & Weights */}
                    <div className="lg:col-span-8 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-1">
                        <ShieldCheck size={24} className="text-primary" />
                        <h3 className="text-xl font-semibold tracking-tight text-foreground">Capital Preservation Score (CPS)</h3>
                      </div>
                      <p className="text-foreground/70 text-sm font-medium mb-6">Avalia a capacidade da organização de preservar e fortalecer o capital investido pelos sócios.</p>
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
                            statusBadge={<span>{executiveLayer.capitalPreservationScore.classification || "Capital Erodido"}</span>}
                            tone={tone}
                            description={
                              <span className="text-sm font-medium text-foreground/90">
                                Preservação Geral
                              </span>
                            }
                            className="h-full justify-center"
                          />
                        );
                      })()}
                    </div>
                  </div>
                </ExecutiveSurface>
              )}

              {dlpaPayload && (
                <div className="mb-12">
                  <ExecutiveStrategicSemanticCards payload={dlpaPayload} selectedYear={selectedYear} />
                </div>
              )}

              {/* 3. Inteligência de Preservação de Capital */}
              <ExecutiveSurface padding="xl" radius="xl" className="border-border mt-8">
                <div className="mb-6 md:mb-8">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp size={24} className="text-primary" />
                    <h3 className="text-xl md:text-[22px] font-semibold text-foreground">Inteligência de Preservação de Capital</h3>
                  </div>
                  <p className="text-sm text-foreground/70 font-medium">Indicadores sintéticos de preservação, consumo e recomposição do capital.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6 items-stretch mb-8">
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
                        tone={tone}
                        description={<span className="font-medium text-foreground/90">{executiveLayer.fiduciarySynthesisIndicator?.narrative}</span>}
                        className="h-full bg-surface-container/30"
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
                        tone={tone}
                        description={<span className="font-medium text-foreground/90">{executiveLayer.capitalPreservationStatus?.narrative}</span>}
                        className="h-full bg-surface-container/30"
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
                        tone={tone}
                        description={<span className="font-medium text-foreground/90">{executiveLayer.capitalErosionRisk?.narrative}</span>}
                        className="h-full bg-surface-container/30"
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
                        tone={tone}
                        description={<span className="font-medium text-foreground/90">{executiveLayer.capitalRecoveryRequirement?.narrative}</span>}
                        className="h-full bg-surface-container/30"
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
                        tone={tone}
                        description={<span className="font-medium text-foreground/90">{executiveLayer.capitalRecoverability?.narrative}</span>}
                        className="h-full bg-surface-container/30"
                      />
                    );
                  })()}
                </div>
              </ExecutiveSurface>

              {/* 4. Proteção ao Capital dos Sócios */}
              <ExecutiveSurface padding="xl" radius="xl" className="border-border mt-8">
                <div className="mb-6 md:mb-8">
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck size={24} className="text-primary" />
                    <h3 className="text-xl md:text-[22px] font-semibold text-foreground">Proteção ao Capital dos Sócios</h3>
                  </div>
                  <p className="text-sm text-foreground/70 font-medium">Análise de risco, dependência e salvaguarda do capital investido.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6 items-stretch mb-8">
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
                        tone={tone}
                        description={<span className="font-medium text-foreground/90">{executiveLayer.shareholderDependencyNarrative?.narrative}</span>}
                        className="h-full bg-surface-container/30"
                      />
                    );
                  })()}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6 border-t border-border">
                  <div className="flex flex-col gap-4">
                  </div>

                  <div className="flex flex-col gap-4">
                    {executiveLayer.retention?.classification === 'Retenção Compulsória' && (
                      <div className="animate-executive-fade p-5 bg-amber-50 dark:bg-amber-500/10 border border-amber-200/60 dark:border-amber-500/20 rounded-2xl flex items-start gap-4 shadow-sm mt-2">
                        <ShieldAlert className="text-amber-500 shrink-0" size={24} />
                        <div>
                          <h4 className="text-amber-700 dark:text-amber-500 font-bold mb-1">Aviso de Governança Patrimonial: Retenção Compulsória</h4>
                          <p className="text-sm text-amber-600/90 dark:text-amber-500/90 leading-relaxed">
                            Todo lucro futuro deverá ser destinado prioritariamente à absorção dos prejuízos acumulados antes da retomada de distribuições aos sócios.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </ExecutiveSurface>
            </div>
          )}

          {/* --- 9. CAMADA TÉCNICA (CONTÁBIL) --- */}
          <ExecutiveTechnicalLayer
            title="Camada Técnica (Contábil)"
            subtitle="Detalhamento Analítico da DLPA"
            description="Gráficos, Mapa de Governança e tabela completa de movimentações do Patrimônio Líquido."
            className="mb-8"
          >
              {/* --- 3. GRÁFICOS & MAPA DE GOVERNANÇA (Originalmente 1. Lucro vs Distribuição e 2. Radar) --- */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                
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

                {/* Radar de Governança Integrado */}
                <ExecutiveSurface padding="xl" radius="xl" className="bg-foreground text-white shadow-2xl relative overflow-hidden flex flex-col">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />

                  <h3 className="text-xl font-black text-white mb-2 relative z-10">Radar de Governança</h3>
                  <p className="text-sm text-white/70 font-medium leading-relaxed mb-8 relative z-10">Dimensões Institucionais de Retenção de Capital.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 relative z-10">
                    {[
                      { label: 'Sustentabilidade Patrimonial', value: cpiStatus !== 'NEUTRO' ? cpiStatus : '—', badge: preservationStyle.label, tone: preservationStyle.tone },
                      { label: 'Dependência de Capitalização', value: fiduciaryOutput?.capitalSupportRatio === 'NOT_AVAILABLE' ? 'N/A' : fiduciaryOutput?.capitalSupportRatio != null ? `${(fiduciaryOutput.capitalSupportRatio * 100).toFixed(1)}%` : '—', badge: retentionStyle.label, tone: retentionStyle.tone },
                      { label: 'Capacidade Distributiva', value: distribution?.distributionRatio != null && distribution.distributionRatio > 0 ? `${(distribution.distributionRatio * 100).toFixed(1)}%` : 'Inexistente', badge: distributionStyle.label, tone: distributionStyle.tone },
                      { label: 'Integridade Patrimonial', value: preservation ? `${(preservation.equityPreservationRatio * 100).toFixed(1)}%` : '—', badge: preservationStyle.label, tone: preservationStyle.tone }
                    ].map(({ label, value, badge, tone }) => {
                      
                      return (
                        <div key={label} className="[&_*]:!text-white [&_.bg-surface-container\\/50]:!bg-white/10 [&_.border-border]:!border-white/10">
                          <ExecutiveTechnicalMetricCard
                            label={label}
                            value={value}
                            statusLabel={badge}
                            statusTone={tone as any}
                            className="bg-card/5 border-white/10 backdrop-blur-md hover:bg-card/10 transition-colors"
                          />
                        </div>
                      );
                    })}
                  </div>
                </ExecutiveSurface>

              </div>

              {/* --- 4. TABELA DETALHADA --- */}
              <ExecutiveSurface padding="none" radius="xl" className="overflow-hidden border-border">
                <div className="p-6 md:px-8 border-b border-border flex items-center justify-between bg-surface-container/30">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center border border-border">
                      <FileText size={18} className="text-foreground" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-foreground uppercase tracking-widest">Detalhamento DLPA — {filterYear}</h4>
                      <p className="text-muted-foreground text-xs mt-1">Demonstração Contábil Importada</p>
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
          </ExecutiveTechnicalLayer>
          {/* --- CAMADA TÉCNICA (Nova Regra Arquitetural) --- */}
          <ExecutiveTechnicalLayer
            title="Camada Técnica e Metodologia"
            subtitle="Fundamentação e Racional Fiduciário"
            description="Toda fundamentação de cálculo, proxy, memória de cálculo e explicação metodológica para a DLPA."
          >
            <div className="grid grid-cols-1 gap-6">
              {/* Racional 1: Preservação de Capital */}
              {(executiveLayer.capitalPreservationStatus?.rationale || executiveLayer.capitalErosionRisk?.rationale || executiveLayer.capitalRecoveryRequirement?.rationale) && (
                <div className="p-4 bg-surface-container/30 border border-border rounded-xl">
                  <h4 className="text-sm font-bold text-primary mb-3">Fundamentação de Preservação</h4>
                  <div className="space-y-2">
                    {executiveLayer.capitalPreservationStatus?.rationale && <p className="text-sm text-foreground/80">{executiveLayer.capitalPreservationStatus?.rationale}</p>}
                    {executiveLayer.capitalErosionRisk?.rationale && <p className="text-sm text-foreground/80">{executiveLayer.capitalErosionRisk?.rationale}</p>}
                    {executiveLayer.capitalRecoveryRequirement?.rationale && <p className="text-sm text-foreground/80">{executiveLayer.capitalRecoveryRequirement?.rationale}</p>}
                  </div>
                </div>
              )}

              {/* Racional 2: Salvaguarda Patrimonial */}
              {(executiveLayer.shareholderDependencyNarrative?.rationale || executiveLayer.governanceInterpretation?.shareholderCapitalProtection) && (
                <div className="p-4 bg-surface-container/30 border border-border rounded-xl">
                  <h4 className="text-sm font-bold text-primary mb-3">Salvaguarda Patrimonial</h4>
                  <div className="space-y-2">
                    {executiveLayer.governanceInterpretation?.shareholderCapitalProtection && <p className="text-sm text-foreground/80">{executiveLayer.governanceInterpretation?.shareholderCapitalProtection}</p>}
                    {executiveLayer.shareholderDependencyNarrative?.rationale && <p className="text-sm text-foreground/80">{executiveLayer.shareholderDependencyNarrative?.rationale}</p>}
                  </div>
                </div>
              )}

              {/* Racional 3: Recuperação Patrimonial */}
              {(executiveLayer.governanceInterpretation?.recoveryThesis || executiveLayer.patrimonialRecoveryHorizon?.rationale) && (
                <div className="p-4 bg-surface-container/30 border border-border rounded-xl">
                  <h4 className="text-sm font-bold text-primary mb-3">Tese de Recuperação Patrimonial</h4>
                  <div className="space-y-2">
                    {executiveLayer.governanceInterpretation?.recoveryThesis && <p className="text-sm text-foreground/80">{executiveLayer.governanceInterpretation?.recoveryThesis}</p>}
                    {executiveLayer.patrimonialRecoveryHorizon?.rationale && <p className="text-sm text-foreground/80">{executiveLayer.patrimonialRecoveryHorizon?.rationale}</p>}
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
    </div>
  );
}
