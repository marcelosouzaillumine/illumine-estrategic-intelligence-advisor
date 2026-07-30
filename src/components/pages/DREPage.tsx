import { ExecutiveText } from '../ui/executive-typography';
import { ExecutiveHeading } from '../ui/executive-heading';
import React from 'react';
import { createPortal } from 'react-dom';
import { Calendar, Loader2, Upload, Trash2, Plus, BarChart3, Database } from 'lucide-react';
import { cn } from '../../lib/utils';
import { SandboxWarningOverlay } from '../executive-interaction/SandboxWarningOverlay';
import { PageHeader, StatusBadge } from '../Common';
import { ExecutiveBadge } from '../ui/executive-badge';
import { ExecutivePageTemplate } from '../ui/executive-page-template';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveAccordion } from '../ui/executive-accordion';
import { ExecutiveEmptyState } from '../ui/executive-empty-state';
import { ExecutiveSummarySection } from '../ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../ui/executive-decision-trace';
import { ImportFinancialModal } from '../modals/ImportFinancialModal';
import { ManualFinancialModal } from '../modals/ManualFinancialModal';
import { DREEconomicBreakdownSection } from './dre/DREEconomicBreakdownSection';
import { DREBoardDecisionSupportSection } from './dre/DREBoardDecisionSupportSection';
import { DREExecutiveAdvisorySection } from './dre/DREExecutiveAdvisorySection';
import { DRETechnicalLayerSection } from './dre/DRETechnicalLayerSection';
import { useDREPageViewModel } from './dre/useDREPageViewModel';
import { ExecutiveIntelligenceShell } from '../executive/ExecutiveIntelligenceShell';
import { ExecutiveDecisionIntelligenceMount } from '../executive/ExecutiveDecisionIntelligenceMount';

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
    <ExecutiveIntelligenceShell pageTitle="Demonstração do Resultado (DRE)" pageContext="DREPage">
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

        {/* 2. CENTRO DE DECISÃO EXECUTIVA & INTELIGÊNCIA ATIVA (Avalia os dados do contexto definido acima) */}
        <ExecutiveDecisionIntelligenceMount
          pageId="DREPage"
          companyId={String(selectedClient || 'comp-1')}
          period={String(filterYear || selectedYear || 2026)}
          financialData={executiveReport?.canonicalState?.kpis}
        />
      {(executiveReport?.isSandbox || executiveReport?.isDemonstrative) && (
        <SandboxWarningOverlay type={executiveReport.isSandbox ? 'sandbox' : 'demonstrative'} />
      )}

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
          {/* --- CAMADA 1: NÍVEL CONSELHO (SÍNTESE SOBERANA DA DRE) --- */}
          <ExecutiveSummarySection 
            className="mb-8"
            status={{ label: 'DRE Auditada', variant: 'success' }}
            question="Qual a eficiência operacional e a margem de contribuição do exercício?"
            opinion="O comitê fiduciário homologa a DRE, destacando a evolução da margem EBITDA, controle de custos e rentabilidade líquida."
            driver="Receita bruta, deduções fiscais, CPV, despesas operacionais e resultado financeiro."
            implication="Geração de valor operacional sustentável para suportar o plano de crescimento e reinvestimento."
            action="Otimizar estrutura de custos variáveis e despesas operacionais para expandir a margem operacional."
          >
            <ExecutiveStrategicTensions tensions={[]} />
            <ExecutiveDecisionTrace trace={[]} />
          </ExecutiveSummarySection>

          {/* --- CAMADA 2: DIRETORIA & DRE ESTRUTURAL --- */}
          {isSectionVisible('DRE_ADVISORY') && dreViewModel?.policy?.executiveDiagnosis && (
            <DREExecutiveAdvisorySection 
              viewModel={dreViewModel.policy.executiveDiagnosis}
              selectedYear={selectedYear}
            />
          )}

          <DREEconomicBreakdownSection
            isVisibleStructure={isSectionVisible('DRE_ESTRUTURA_ECONOMICA')}
            isVisibleBurnRate={isSectionVisible('DRE_CONSUMO_ECONOMICO')}
            isVisibleBreakEven={isSectionVisible('DRE_BREAK_EVEN')}
            viewModel={dreViewModel}
          />

          {isSectionVisible('DRE_DECISION_SUPPORT') && dreViewModel?.policy?.boardQuestions && (
            <DREBoardDecisionSupportSection viewModel={{
              ...dreViewModel.policy.boardQuestions,
              overallStatus: dreViewModel.policy.economicPositioning,
              confidenceScore: dreViewModel.policy.confidenceScore
            }} />
          )}

          {/* --- CAMADA 3: CAMADA TÉCNICA E DETALHAMENTO CONTÁBIL --- */}
          {isSectionVisible('DRE_TECHNICAL_LAYER') && dreViewModel?.technicalLayer?.rows && dreViewModel.technicalLayer.rows.length > 0 && (
            <div className="mt-12 mb-8 border-t border-border pt-8">
              <DRETechnicalLayerSection viewModel={dreViewModel.technicalLayer} />
            </div>
          )}
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
