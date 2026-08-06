

import React, { useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, Loader2, Upload, Trash2, Plus, BookOpen, Database, TrendingUp, TrendingDown, Info, BarChart3, PieChart as PieChartIcon, AlertCircle, Activity, Target, AlertTriangle, Lightbulb, Zap, ShieldCheck, Gem, Crosshair, Layers, PiggyBank, ShieldAlert, ChevronDown, ChevronUp } from 'lucide-react';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveHeading } from '../ui/executive-heading';
import { ExecutiveAccordion } from '../ui/executive-accordion';
import { ExecutiveText } from '../ui/executive-typography';
import { ExecutiveEmptyState } from '../ui/executive-empty-state';
import { cn, formatCurrency, formatValue } from '../../lib/utils';
import { StatusBadge, PageHeader } from '../Common';
import { BalanceSheetDataSourceStatus } from './balance-sheet/BalanceSheetDataSourceStatus';
import { BalanceSheetYearFilter } from './balance-sheet/BalanceSheetYearFilter';
import { BalanceSheetActionToolbar } from './balance-sheet/BalanceSheetActionToolbar';


import { BalanceSheetCapitalEfficiencySection } from './balance-sheet/BalanceSheetCapitalEfficiencySection';
import { BalanceSheetLiquiditySection } from './balance-sheet/BalanceSheetLiquiditySection';
import { BalanceSheetWorkingCapitalSection } from './balance-sheet/BalanceSheetWorkingCapitalSection';
import { BalanceSheetAssetQualitySection } from './balance-sheet/BalanceSheetAssetQualitySection';
import { BalanceSheetCapitalStructureSection } from './balance-sheet/BalanceSheetCapitalStructureSection';
import { BalanceSheetInstitutionalContextSection } from './balance-sheet/BalanceSheetInstitutionalContextSection';
import { BalanceSheetTechnicalLayerSection } from './balance-sheet/BalanceSheetTechnicalLayerSection';
import { BalanceSheetAuditLayerSection } from './balance-sheet/BalanceSheetAuditLayerSection';
import { BalanceSheetWaterfallChartSection } from './balance-sheet/BalanceSheetWaterfallChartSection';
import { ExecutiveStrategicTensions } from '../ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../ui/executive-decision-trace';
import { BalanceSheetEvolutionAnalysisSection } from './balance-sheet/BalanceSheetEvolutionAnalysisSection';
import { BalanceSheetCompositionChartsSection } from './balance-sheet/BalanceSheetCompositionChartsSection';
import { ExecutiveExposureCard } from '../ui/executive-exposure-card';
import { BalanceSheetExecutiveSynthesisSection } from './balance-sheet/BalanceSheetExecutiveSynthesisSection';
import { ExecutivePageTemplate } from '../ui/executive-page-template';
import { ExecutiveSummarySection } from '../ui/executive-summary-section';
import { BalanceSheetStructuralTablesSection } from './balance-sheet/BalanceSheetStructuralTablesSection';
import { BalanceSheetCapitalPreservationSection } from './balance-sheet/BalanceSheetCapitalPreservationSection';
import { ImportFinancialModal } from '../modals/ImportFinancialModal';
import { ManualFinancialModal } from '../modals/ManualFinancialModal';
import { ExecutiveLocaleEnforcer } from '../../core/enforcement/ExecutiveLocaleEnforcer';
import { ExecutiveIntelligenceShell } from '../executive/ExecutiveIntelligenceShell';

import { SandboxWarningOverlay } from '../executive-interaction/SandboxWarningOverlay';
import { BPStrategicDiagnosisAdapter } from './balance-sheet/adapters/BPStrategicDiagnosisAdapter';
import { useExecutivePage } from '../../hooks/useExecutivePage';
import { useBalanceSheetPageViewModel } from '../../capabilities/financial/presentation/view-models/useBalanceSheetPageViewModel';
import { ExecutiveProductRenderer } from '../../core/experience/runtime/ExecutiveProductRenderer';
import { FinancialPositionProduct } from '../../core/experience/products/FinancialPositionProduct';
import { ExecutiveExperienceContext } from '../../core/experience/runtime/ExecutiveExperienceContext';
import { registerBalanceSheetComponents } from '../../core/experience/registry/BalanceSheetComponentRegistration';

// Register components for the runtime (runs once)
registerBalanceSheetComponents();

export function BalanceSheetPage(props: any) {
  const { state, computed, actions } = useBalanceSheetPageViewModel(props);
  const { clients, selectedClient, selectedYear } = props;
  
  const { filterYear, densityLevel, toast, deleting, showDeleteConfirm, showImportModal, showManualModal, showCamada2, showCamada3, showFullStressTests, userRole, isGenerating, engineError } = state;
  const { profile, financialEntries, dreDbData, dlpaDbData, cashFlowDbData, allHistoryData, loadingBP, rows, bpSummary, ebitda, lucroLiquido, executiveViewModel, financialAnalyticsViewModel, loadingHistory, historicalFinancialSeries, t, hasBalanceSheetData, executiveReport, patrimonialIntelligenceReport, strategicTensions, financialIndicators,
ativoTotal, passivoTotal, plValue, ac, anc, pc, pnc, isBalanced, divergence, cx, est, clientes, fornecedores, passivosFinanceiros, capitalSocial, valorPrejuizo, valAltaConversibilidade, valMediaConversibilidade, valBaixaConversibilidade, valConversibilidadeRestrita, creditosSocios, chartData, historyByYear, comparativeAnalysis, ativoData, passivoData, COLORS, resilienciaGlobal, maturidade } = computed;
  const { setFilterYear, setDensityLevel, setToast, setDeleting, setShowDeleteConfirm, setShowImportModal, setShowManualModal, setShowCamada2, setShowCamada3, setShowFullStressTests, refetchBP, handleDelete, translateLabel, showToast, isSectionVisible, setIsGenerating, setEngineError } = actions;

  // --- TELEMETRY ---
  const renderCount = useRef(0);
  const startTime = useRef(performance.now());
  renderCount.current += 1;
  
  useEffect(() => {
    console.log(`[TELEMETRY] BalanceSheetPage render #${renderCount.current} at ${performance.now() - startTime.current}ms`);
  });
  // -----------------

  const activeClientObj = clients?.find((c: any) => c.id === selectedClient);
  const activeClientName = activeClientObj?.nomeFantasia || activeClientObj?.razaoSocial || activeClientObj?.nome || 'Empresa Ativa';

  useExecutivePage({
    domain: 'Financial',
    module: 'Balance Sheet',
    capability: 'Patrimonial Analysis',
    title: 'Balanço Patrimonial',
    description: 'Análise da posição financeira, estrutura de capital e solvência patrimonial.',
    breadcrumbs: ['Financial', 'Balance Sheet'],
    companyId: activeClientObj?.id,
    period: filterYear.toString(),
    filters: { year: filterYear, densityLevel }
  });

  const bpExecutiveAnalysisContext = executiveReport ? {
    analysisYear: filterYear,
    generatedAt: new Date().toISOString(),
    moduleContext: 'BP' as any,
    activeFiduciaryRestrictions: [],
    fiduciaryClassification: patrimonialIntelligenceReport?.patrimonialClassification || 'SAUDÁVEL',
    mathematicalClassification: 'STABLE',
    globalScore: resilienciaGlobal,
    primaryIndicators: {},
    technicalDrivers: BPStrategicDiagnosisAdapter.mapDrivers(financialIndicators, bpSummary),
    contextualAlerts: []
  } : undefined;

  const experienceContext: ExecutiveExperienceContext = useMemo(() => ({
    productId: 'financial.position',
    tenantId: String(selectedClient || 'comp-1'),
    intelligence: {
      financialPosition: {
        bpSummary,
        executiveViewModel,
        financialAnalyticsViewModel,
        patrimonialIntelligenceReport,
        strategicTensions,
        bpExecutiveAnalysisContext,
        filterYear
      }
    },
    evidence: { sources: [] },
    viewState: { period: filterYear.toString() }
  }), [selectedClient, filterYear, bpSummary, executiveViewModel, financialAnalyticsViewModel, patrimonialIntelligenceReport, strategicTensions, bpExecutiveAnalysisContext]);

  const bpFinancialMetrics = useMemo(() => {
    return {
      ativoTotal: ativoTotal || 0,
      passivoTotal: passivoTotal || 0,
      patrimonioLiquido: plValue || 0,
      liquidezCorrente: pc > 0 ? (ac / pc) : 0,
      ebitda: ebitda || 0,
      lucroLiquido: lucroLiquido || 0,
      ...((executiveReport?.canonicalState as any)?.kpis || {})

    };
  }, [ativoTotal, passivoTotal, plValue, pc, ac, ebitda, lucroLiquido, executiveReport]);

  return (
    <ExecutiveIntelligenceShell 
      pageTitle="Balanço Patrimonial" 
      pageContext="BalanceSheetPage"
      companyName={clients?.find((c: any) => c.id === selectedClient)?.fantasia || clients?.find((c: any) => c.id === selectedClient)?.razao || 'Selecionar Corporação'}
      selectedYear={selectedYear}
    >
      <ExecutivePageTemplate header={{
        title: "Balanço Patrimonial",
        description: "Análise da posição financeira, estrutura de capital e solvência patrimonial.",
        icon: BookOpen,
      }}>
        {/* Barra de Controle de Contexto e Ações (Define o escopo que alimenta a inteligência) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-center gap-4">
              {hasBalanceSheetData && (
                <StatusBadge status={executiveReport?.isSandbox || executiveReport?.isDemonstrative ? 'SANDBOX' : (executiveReport?.canonicalState?.status || 'Ativo')} />
              )}
              <BalanceSheetDataSourceStatus hasRealData={hasBalanceSheetData} loading={loadingBP} />
            </div>
            <BalanceSheetYearFilter filterYear={filterYear} onChangeYear={setFilterYear} />
          </div>

          {hasBalanceSheetData && (
            <BalanceSheetActionToolbar onLaunchData={() => setShowManualModal(true)} onImport={() => setShowImportModal(true)} onDelete={() => setShowDeleteConfirm(true)} />
          )}
        </div>

      {!hasBalanceSheetData ? (
        <div className="mb-12">
          <ExecutiveEmptyState
            title="Inteligência Patrimonial"
            description="Ainda não existem dados patrimoniais suficientes para gerar inteligência executiva deste exercício. O lançamento do Balanço Patrimonial permitirá calcular liquidez, solvência, estrutura de capital, capacidade de absorção de perdas e demais indicadores."
            actionLabel="Lançar Dados do Balanço"
            onAction={() => setShowManualModal(true)}
            secondaryActionLabel="Importar"
            onSecondaryAction={() => setShowImportModal(true)}
          />
        </div>
      ) : hasBalanceSheetData && !executiveReport && isGenerating ? (
        <ExecutiveSurface variant="default" elevation="sm" className="flex flex-col items-center justify-center p-12 mb-12">
          <Loader2 size={32} className="animate-spin text-secondary mb-4" />
          <ExecutiveHeading as="h3" variant="moduleTitle" className="mb-2 text-center">Processando Análise</ExecutiveHeading>
          <ExecutiveText as="div" variant="bodyStandard" className="text-center max-w-md">Gerando inteligência patrimonial e síntese executiva fiduciária para o exercício de {filterYear}...</ExecutiveText>
        </ExecutiveSurface>
      ) : hasBalanceSheetData && !executiveReport && engineError ? (
        <div className="mb-12">
          <ExecutiveEmptyState
            title="Falha na Geração Executiva"
            description={`Os dados contábeis de ${filterYear} existem, mas a inteligência executiva encontrou um erro: ${engineError}`}
            actionLabel="Tentar Novamente (Gerar Análise)"
            onAction={() => setFilterYear(filterYear)}
          />
        </div>
      ) : (
        <>

          {(executiveReport?.isSandbox || executiveReport?.isDemonstrative) && (
            <SandboxWarningOverlay type={executiveReport.isSandbox ? 'sandbox' : 'demonstrative'} />
          )}
          <div className="space-y-6 mb-12">
            {executiveViewModel && patrimonialIntelligenceReport && (
              <ExecutiveProductRenderer 
                product={FinancialPositionProduct} 
                context={experienceContext} 
              />
            )}
          </div>
        </>
      )}

      {/* Modals */}
      {showImportModal && typeof document !== 'undefined' && createPortal(
        <ImportFinancialModal
          type="Balanço Patrimonial"
          clientId={selectedClient}
          year={filterYear}
          clients={clients}
          onClose={() => setShowImportModal(false)}
          onSuccess={() => {
            setShowImportModal(false);
            refetchBP();
            
            showToast('success', 'Dados importados com sucesso!');
          }}
        />,
        document.body
      )}

      {showManualModal && typeof document !== 'undefined' && createPortal(
        <ManualFinancialModal
          type="Balanço Patrimonial"
          clientId={selectedClient}
          year={filterYear}
          onClose={() => setShowManualModal(false)}
          onSuccess={() => {
            setShowManualModal(false);
            refetchBP();
            
            showToast('success', 'Dados salvos com sucesso!');
          }}
        />,
        document.body
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <ExecutiveSurface 
            variant="default" 
            elevation="lg" 
            padding="none" 
            className="rounded-[32px] p-8 w-full max-w-md min-w-[300px] md:min-w-[400px] shrink-0"
          >
            <ExecutiveHeading as="h3" variant="moduleTitle" className="mb-2">Excluir Dados?</ExecutiveHeading>
            <ExecutiveText as="div" variant="bodyStandard" className="mb-8">
              Esta ação removerá todos os registros do Balanço Patrimonial para o ano <strong>{filterYear}</strong> deste cliente. Esta ação não pode ser desfeita.
            </ExecutiveText>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 hover:bg-surface-container/30 rounded-2xl transition-all"
              >
                <ExecutiveText as="span" variant="label">Cancelar</ExecutiveText>
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 bg-critical text-white rounded-2xl shadow-md hover:bg-critical/90 transition-all"
              >
                <ExecutiveText as="span" variant="label" className="text-white">{deleting ? 'Excluindo...' : 'Sim, Excluir'}</ExecutiveText>
              </button>
            </div>
          </ExecutiveSurface>
        </div>,
        document.body
      )}

      {/* Toast */}
      {toast && typeof document !== 'undefined' && createPortal(
        <div className={cn(
          'fixed bottom-8 right-8 px-5 md:px-8 py-2.5 md:py-4 rounded-2xl shadow-2xl z-[100] animate-in fade-in slide-in-from-bottom-4 transition-all',
          toast.type === 'success' ? 'bg-success text-white' : 'bg-critical text-white'
        )}>
          <ExecutiveText as="div" variant="microLabel" className="text-white">{toast.message}</ExecutiveText>
        </div>,
        document.body
      )}
    </ExecutivePageTemplate>
    </ExecutiveIntelligenceShell>
  );
}


