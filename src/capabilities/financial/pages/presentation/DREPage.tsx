import { ExecutiveText } from '../../../../components/ui/executive-typography';
import { ExecutiveHeading } from '../../../../components/ui/executive-heading';
import React, { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, Loader2, Upload, Trash2, Plus, BarChart3, Database } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import { SandboxWarningOverlay } from '../../../../components/executive-interaction/SandboxWarningOverlay';
import { PageHeader, StatusBadge } from '../../../../components/Common';
import { ExecutiveBadge } from '../../../../components/ui/executive-badge';
import { ExecutivePageTemplate } from '../../../../components/ui/executive-page-template';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { ExecutiveAccordion } from '../../../../components/ui/executive-accordion';
import { ExecutiveEmptyState } from '../../../../components/ui/executive-empty-state';
import { ExecutiveSummarySection } from '../../../../components/ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../../../../components/ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../../../../components/ui/executive-decision-trace';
import { ImportFinancialModal } from '../../../../components/modals/ImportFinancialModal';
import { ManualFinancialModal } from '../../../../components/modals/ManualFinancialModal';
import { DREEconomicBreakdownSection } from '../../../../components/pages/dre/DREEconomicBreakdownSection';
import { DREBoardDecisionSupportSection } from '../../../../components/pages/dre/DREBoardDecisionSupportSection';
import { DREExecutiveAdvisorySection } from '../../../../components/pages/dre/DREExecutiveAdvisorySection';
import { DRETechnicalLayerSection } from '../../../../components/pages/dre/DRETechnicalLayerSection';
import { useDREPageViewModel } from '../../../../components/pages/dre/useDREPageViewModel';
import { ExecutiveIntelligenceShell } from '../../../../components/executive/ExecutiveIntelligenceShell';
import { ExecutiveVerdictCard } from '../../../../components/ui/ExecutiveVerdictCard';
import { ExecutiveSummaryCard } from '../../../../components/ui/ExecutiveSummaryCard';
import { ExecutiveBrief } from '../../../../components/executive-architecture/ExecutiveBrief';
import { InstitutionalDecisionOS } from '../../../../../packages/shell/executive-intelligence-layer/src/orchestration/InstitutionalDecisionOS';
import { ExecutiveBriefPresenter } from '../../../../viewmodels/ExecutiveBriefPresenter';
import { ExecutiveDashboardRenderer } from '../../../../components/ui/ExecutiveDashboardRenderer';

export function DREPage({ clients, selectedClient, selectedYear }: any) {
  const { state, computed, actions } = useDREPageViewModel(clients, selectedClient, selectedYear);

  const {
    filterYear,
    toast,
    deleting,
    showDeleteConfirm,
    showImportModal,
    showManualModal,
    loading,
    loadingHistory,
    hasDreData,
    executiveReport,
    dreViewModel,
    assessment,
  } = state;

  const { isSectionVisible } = computed;

  const activeClientObj = clients?.find((c: any) => c.id === selectedClient);
  const activeClientName = activeClientObj?.nomeFantasia || activeClientObj?.razaoSocial || activeClientObj?.nome || 'Empresa Ativa';


  return (
    <ExecutiveIntelligenceShell pageTitle="Demonstração do Resultado (DRE)" pageContext="DREPage" companyName={activeClientName}>
      <ExecutivePageTemplate header={{
        title: "Demonstração do Resultado (DRE)",
        description: "Análise de performance operacional, lucratividade e rentabilidade do exercício contábil.",
      }}>
        {/* 1. BARRA DE CONTROLE DE CONTEXTO E AÇÕES (Define o escopo/ano que alimenta toda a inteligência da página) */}
        <ExecutiveSurface className="flex items-center justify-between gap-4 flex-wrap mb-6 bg-card border border-border shadow-sm">
          <div className="flex items-center gap-3">
            <ExecutiveBadge variant={hasDreData ? 'success' : 'neutral'}>
              {hasDreData ? 'Dados Reais' : 'Amostra'}
            </ExecutiveBadge>

            <div className="flex bg-card border border-border p-1 rounded-md shadow-sm items-center">
              <Calendar size={12} className="ml-2 text-muted-foreground" />
              <select
                onChange={(e) => actions.setFilterYear(Number(e.target.value))}
                value={filterYear}
                className="bg-transparent px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest outline-none cursor-pointer text-foreground"
              >
                {Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i).map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          {hasDreData && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => actions.setShowManualModal(true)}
                className="px-4 py-2.5 bg-surface-container hover:bg-success hover:text-white text-success border border-border rounded-md transition-all flex items-center gap-2"
              >
                <Plus size={14} />
                <ExecutiveText variant="microLabel" className="text-inherit">Lançar Dados</ExecutiveText>
              </button>
              <button
                onClick={() => actions.setShowImportModal(true)}
                className="px-4 py-2.5 bg-surface-container hover:bg-secondary hover:text-white text-secondary border border-border rounded-md transition-all flex items-center gap-2"
              >
                <Upload size={14} />
                <ExecutiveText variant="microLabel" className="text-inherit">Importar</ExecutiveText>
              </button>
              <button
                onClick={() => actions.setShowDeleteConfirm(true)}
                className="px-4 py-2.5 bg-surface-container hover:bg-critical hover:text-white text-critical border border-border rounded-md transition-all flex items-center gap-2"
              >
                <Trash2 size={14} />
                <ExecutiveText variant="microLabel" className="text-inherit">Excluir</ExecutiveText>
              </button>
            </div>
          )}
        </ExecutiveSurface>

      {!hasDreData ? (
        <div className="mb-12">
          <ExecutiveEmptyState
            title="Demonstração do Resultado"
            description="Ainda não existem dados de resultado suficientes para gerar inteligência executiva deste exercício. O lançamento da DRE permitirá analisar receitas, margens, eficiência operacional e lucro líquido."
            actionLabel="Lançar Dados da DRE"
            onAction={() => actions.setShowManualModal(true)}
            secondaryActionLabel="Importar"
            onSecondaryAction={() => actions.setShowImportModal(true)}
          />
        </div>
      ) : (
        <div className="space-y-10 mb-12">
          {assessment && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
              <ExecutiveVerdictCard assessment={assessment} />
              <ExecutiveSummaryCard assessment={assessment} />
            </div>
          )}

          <DREEconomicBreakdownSection
            isVisibleStructure={isSectionVisible('DRE_ESTRUTURA_ECONOMICA')}
            isVisibleBurnRate={isSectionVisible('DRE_CONSUMO_ECONOMICO')}
            isVisibleBreakEven={isSectionVisible('DRE_BREAK_EVEN')}
            viewModel={dreViewModel}
          />


        </div>
      )}

      {showImportModal && (
        <ImportFinancialModal
          type="DRE"
          clientId={selectedClient}
          year={filterYear}
          clients={clients}
          onClose={() => actions.setShowImportModal(false)}
          onSuccess={() => {
            actions.setShowImportModal(false);
            actions.refetchDRE();
            actions.showToastMsg('success', 'Dados importados com sucesso!');
          }}
        />
      )}

      {showManualModal && (
        <ManualFinancialModal
          type="DRE"
          clientId={selectedClient}
          year={filterYear}
          onClose={() => actions.setShowManualModal(false)}
          onSuccess={() => {
            actions.setShowManualModal(false);
            actions.refetchDRE();
            actions.showToastMsg('success', 'Dados salvos com sucesso!');
          }}
        />
      )}

      {showDeleteConfirm && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-card rounded-[32px] p-8 w-full max-w-md min-w-[300px] md:min-w-[400px] shadow-2xl shrink-0 border border-border">
            <ExecutiveHeading as="h3" className="text-primary mb-2">Excluir Dados?</ExecutiveHeading>
            <p className="text-sm text-executive-secondary mb-8 font-medium">
              Esta ação removerá todos os registros da DRE para o ano <strong>{filterYear}</strong> deste cliente. Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => actions.setShowDeleteConfirm(false)}
                className="flex-1 py-3 text-sm font-bold text-executive-secondary hover:bg-surface-container/30 rounded-2xl transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={actions.handleDelete}
                className="flex-1 py-3 bg-critical-soft0 text-white text-sm font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-rose-500/20 hover:scale-105 transition-all"
              >
                {deleting ? 'Excluindo...' : 'Sim, Excluir'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {toast && typeof document !== 'undefined' && createPortal(
        <div className={cn(
          'fixed bottom-8 right-8 px-5 md:px-8 py-2.5 md:py-4 rounded-2xl shadow-2xl z-[100] animate-in fade-in slide-in-from-bottom-4 transition-all',
          toast.type === 'success' ? 'bg-success-soft0 text-white' : 'bg-critical-soft0 text-white'
        )}>
          <ExecutiveText as="div" variant="caption">{toast.message}</ExecutiveText>
        </div>,
        document.body
      )}
    </ExecutivePageTemplate>
    </ExecutiveIntelligenceShell>
  );
}
