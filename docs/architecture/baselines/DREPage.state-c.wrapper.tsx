import React from 'react';
import { createPortal } from 'react-dom';
import { Calendar, Loader2, Upload, Trash2, Plus, BarChart3, Database } from 'lucide-react';
import { cn } from '../../lib/utils';
import { SandboxWarningOverlay } from '../executive-interaction/SandboxWarningOverlay';
import { PageHeader } from '../Common';
import { ExecutiveEmptyState } from '../ui/executive-empty-state';
import { ImportFinancialModal } from '../modals/ImportFinancialModal';
import { ManualFinancialModal } from '../modals/ManualFinancialModal';
import { DREEconomicBreakdownSection } from './dre/DREEconomicBreakdownSection';
import { DREBoardDecisionSupportSection } from './dre/DREBoardDecisionSupportSection';
import { DREExecutiveAdvisorySection } from './dre/DREExecutiveAdvisorySection';
import { DRERecommendationSection } from './dre/DRERecommendationSection';
import { DRETechnicalLayerSection } from './dre/DRETechnicalLayerSection';
import { useDREPageViewModel } from './dre/useDREPageViewModel';
import { ExecutiveSummarySection } from '../executive-architecture/executive-summary-section';

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
    dreViewModel
  } = state;

  const { isSectionVisible } = computed;

  return (
    <div className="max-w-[1440px] mx-auto space-y-10 pb-32 animate-executive-fade">
      {(executiveReport?.isSandbox || executiveReport?.isDemonstrative) && (
        <SandboxWarningOverlay type={executiveReport.isSandbox ? 'sandbox' : 'demonstrative'} />
      )}
      <PageHeader 
        title="Demonstração do Resultado (DRE)" 
        subtitle="Análise de performance operacional, lucratividade e rentabilidade do exercício contábil."
        icon={BarChart3}
        color="executive"
      />

      <div className="flex items-center justify-between gap-4 flex-wrap bg-surface-container/60 p-4 rounded-md border border-border backdrop-blur-sm shadow-sm -mt-6 mb-10">
        <div className="flex items-center gap-3">
          <div className="bg-card border border-border/50 shadow-sm rounded-md px-4 py-2 flex items-center gap-3 shadow-sm">
            {(loading || loadingHistory) && <Loader2 size={14} className="animate-spin text-secondary" />}
            <Database size={14} className={hasDreData ? 'text-success' : 'text-muted-foreground/30'} />
            <span className={cn('text-[10px] font-medium uppercase tracking-[0.2em]', hasDreData ? 'text-success' : 'text-muted-foreground')}>
              {hasDreData ? 'Dados Reais' : 'Amostra'}
            </span>
          </div>

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
              className="px-4 py-3 bg-surface-container hover:bg-success hover:text-white text-success border border-border rounded-md text-[10px] font-medium uppercase tracking-widest transition-all flex items-center gap-2"
            >
              <Plus size={14} /> Lançar Dados
            </button>
            <button
              onClick={() => actions.setShowImportModal(true)}
              className="px-4 py-3 bg-surface-container hover:bg-secondary hover:text-white text-secondary border border-border rounded-md text-[10px] font-medium uppercase tracking-widest transition-all flex items-center gap-2"
            >
              <Upload size={14} /> Importar
            </button>
            <button
              onClick={() => actions.setShowDeleteConfirm(true)}
              className="px-4 py-3 bg-surface-container hover:bg-destructive hover:text-white text-destructive border border-border rounded-md text-[10px] font-medium uppercase tracking-widest transition-all flex items-center gap-2"
            >
              <Trash2 size={14} /> Excluir
            </button>
          </div>
        )}
      </div>

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
        <>
          {/* Visão Consultiva Executiva (Separando Summary de Recommendation) */}
          {isSectionVisible('DRE_ADVISORY') && dreViewModel?.policy?.executiveDiagnosis && (
            <div className="mb-10 mt-10 flex flex-col w-full">
              <ExecutiveSummarySection aria-label="Síntese Executiva DRE">
                <DREExecutiveAdvisorySection 
                  viewModel={dreViewModel.policy.executiveDiagnosis} 
                  selectedYear={state.filterYear} 
                />
              </ExecutiveSummarySection>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                <div className="hidden lg:block" />
                <DRERecommendationSection 
                  viewModel={dreViewModel.policy.executiveDiagnosis} 
                  selectedYear={state.filterYear}
                />
              </div>
            </div>
          )}

          {/* 3 & 4. ESTRUTURA ECONÔMICA E CONSUMO */}
          <DREEconomicBreakdownSection
            isVisibleStructure={isSectionVisible('DRE_ESTRUTURA_ECONOMICA')}
            isVisibleBurnRate={isSectionVisible('DRE_CONSUMO_ECONOMICO')}
            isVisibleBreakEven={isSectionVisible('DRE_BREAK_EVEN')}
            viewModel={dreViewModel}
          />

          {/* 5. BOARD DECISION SUPPORT FRAMEWORK (PAINÉIS DIMENSIONAIS) */}
          {isSectionVisible('DRE_DECISION_SUPPORT') && dreViewModel?.policy?.boardQuestions && (
            <DREBoardDecisionSupportSection viewModel={{
              ...dreViewModel.policy.boardQuestions,
              overallStatus: dreViewModel.policy.economicPositioning,
              confidenceScore: dreViewModel.policy.confidenceScore
            }} />
          )}

          {/* 7. CAMADA TÉCNICA (COLAPSADA) */}
          {isSectionVisible('DRE_TECHNICAL_LAYER') && dreViewModel?.technicalLayer?.rows && dreViewModel.technicalLayer.rows.length > 0 && (
            <div className="mb-10">
              <DRETechnicalLayerSection viewModel={dreViewModel.technicalLayer} />
            </div>
          )}
        </>
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
          <div className="bg-card rounded-[32px] p-8 w-full max-w-md min-w-[300px] md:min-w-[400px] shadow-2xl shrink-0">
            <h3 className="text-xl font-black text-primary mb-2">Excluir Dados?</h3>
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
          <p className="text-xs font-black uppercase tracking-widest">{toast.message}</p>
        </div>,
        document.body
      )}
    </div>
  );
}
