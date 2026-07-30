import React from 'react';
import { ExecutivePageTemplate } from '../ui/executive-page-template';
import { ExecutiveEmptyState } from '../ui/executive-empty-state';
import { ExecutiveBadge } from '../ui/executive-badge';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveHeading } from '../ui/executive-heading';
import { ExecutiveText } from '../ui/executive-typography';
import { DFCDataSourceStatus } from './dfc/DFCDataSourceStatus';
import { DFCYearFilter } from './dfc/DFCYearFilter';
import { DFCActionToolbar } from './dfc/DFCActionToolbar';
import { CashPositionSummary } from './dfc/CashPositionSummary';
import { OperationalCashFlowChart } from './dfc/OperationalCashFlowChart';
import { DFCDetailTable } from './dfc/DFCDetailTable';
import { ManualFinancialModal } from '../modals/ManualFinancialModal';
import { ImportFinancialModal } from '../modals/ImportFinancialModal';
import { useDFCPageViewModel } from '../../viewmodels/useDFCPageViewModel';
import { ExecutiveIntelligenceShell } from '../executive/ExecutiveIntelligenceShell';
import { ExecutiveDecisionIntelligenceMount } from '../executive/ExecutiveDecisionIntelligenceMount';

export interface DFCPageProps {
  clientId?: string;
  clients?: any;
  selectedClient?: any;
  selectedYear?: any;
  [key: string]: any;
}

export function DFCPage(props: DFCPageProps) {
  const activeClientId = props.clientId || props.selectedClient || '';
  const initialYear = props.selectedYear || new Date().getFullYear();

  const { state, computed, actions } = useDFCPageViewModel({
    clientId: activeClientId,
    selectedYear: initialYear
  });

  const {
    filterYear,
    loading,
    hasDfcData,
    deleting,
    showDeleteConfirm,
    showManualModal,
    showImportModal
  } = state;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const clientList = props.clients || [];
  const activeClientObj = clientList.find((c: any) => c.id === activeClientId);
  const activeClientName = activeClientObj?.nomeFantasia || activeClientObj?.razaoSocial || activeClientObj?.nome || 'Empresa Ativa';

  const dfcMetrics = {
    fco: computed.netOperatingCashFlow || 0,
    fci: computed.fci || 0,
    fcf: computed.fcf || 0,
    variacaoLiquida: computed.netVariation || 0
  };

  return (
    <ExecutiveIntelligenceShell pageTitle="Demonstração dos Fluxos de Caixa (DFC)" pageContext="DFCPage" companyName={activeClientName}>
      <ExecutivePageTemplate
        header={{
        title: 'Demonstrativo de Fluxo de Caixa (DFC)',
        subtitle: 'Análise da geração operacional de caixa, atividades de investimento e fluxo de financiamento.',
        badge: 'EAA - DEMONSTRATIVO DE FLUXO DE CAIXA'
      }}
    >
      {/* Barra de Controle Temporal e Ações (Padrão do Balanço Patrimonial e DRE) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-4">
            {hasDfcData && <ExecutiveBadge variant="success">Ativo</ExecutiveBadge>}
            <DFCDataSourceStatus hasRealData={hasDfcData} loading={loading} />
          </div>
          <DFCYearFilter filterYear={filterYear} onChangeYear={actions.setFilterYear} />
        </div>

        {hasDfcData && (
          <DFCActionToolbar
            onLaunchData={() => actions.setShowManualModal(true)}
            onImport={() => actions.setShowImportModal(true)}
            onDelete={() => actions.setShowDeleteConfirm(true)}
          />
        )}
      </div>

      {/* Padrão de Tela para Anos sem Lançamentos (Padrão Balanço Patrimonial) */}
      {!hasDfcData ? (
        <div className="mb-12">
          <ExecutiveEmptyState
            title="Demonstrativo de Fluxo de Caixa"
            description={`Ainda não existem dados de fluxo de caixa suficientes para gerar inteligência executiva do exercício de ${filterYear}. O lançamento do Demonstrativo de Fluxo de Caixa (DFC) permitirá calcular o Fluxo Operacional (FCO), Fluxo de Investimento (FCI), Fluxo de Financiamento (FCF) e a capacidade de conversão de faturamento em liquidez.`}
            actionLabel="Lançar Dados da DFC"
            onAction={() => actions.setShowManualModal(true)}
            secondaryActionLabel="Importar"
            onSecondaryAction={() => actions.setShowImportModal(true)}
          />
        </div>
      ) : (
        <div className="space-y-6 mb-12">
          <ExecutiveDecisionIntelligenceMount
            pageId="DFCPage"
            companyId={String(activeClientId || 'comp-1')}
            companyName={activeClientName}
            period={String(filterYear || initialYear || 2026)}
            financialData={dfcMetrics}
          />
          {/* Síntese de Caixa (Conselho & C-Suite) */}
          <CashPositionSummary
            netOperatingCashFlow={computed.netOperatingCashFlow}
            fci={computed.fci}
            fcf={computed.fcf}
            netVariation={computed.netVariation}
            narrativaExecutiva={computed.executiveSummaryNarrative}
            formatCurrency={formatCurrency}
          />

          {/* Análise Causal & Categorias (Diretoria Financeira) */}
          <OperationalCashFlowChart
            fco={computed.netOperatingCashFlow}
            fci={computed.fci}
            fcf={computed.fcf}
            formatCurrency={formatCurrency}
          />

          {/* Detalhamento das Linhas Contábeis (Auditoria & Controladoria) */}
          <DFCDetailTable
            rows={computed.tableRows}
            formatCurrency={formatCurrency}
          />
        </div>
      )}

      {/* Modal de Lançamento Manual */}
      {showManualModal && (
        <ManualFinancialModal
          onClose={() => actions.setShowManualModal(false)}
          clientId={activeClientId}
          year={filterYear}
          type="DFC"
          onSuccess={() => {
            actions.setShowManualModal(false);
            actions.refetchDFC();
          }}
        />
      )}

      {/* Modal de Importação de Arquivo */}
      {showImportModal && (
        <ImportFinancialModal
          onClose={() => actions.setShowImportModal(false)}
          clientId={activeClientId}
          year={filterYear}
          clients={props.clients || []}
          type="DFC"
          onSuccess={() => {
            actions.setShowImportModal(false);
            actions.refetchDFC();
          }}
        />
      )}

      {/* Confirmação de Exclusão */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <ExecutiveSurface variant="default" elevation="lg" className="p-6 max-w-md w-full shadow-2xl">
            <ExecutiveHeading as="h3" className="text-moduleTitle mb-2">
              Excluir registros de DFC?
            </ExecutiveHeading>
            <ExecutiveText variant="bodyStandard" className="mb-6 block">
              Tem certeza que deseja excluir todos os registros da DFC do ano {filterYear}? Esta ação não pode ser desfeita.
            </ExecutiveText>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => actions.setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-muted"
                disabled={deleting}
              >
                Cancelar
              </button>
              <button
                onClick={actions.handleDelete}
                className="px-4 py-2 text-sm font-medium bg-destructive text-destructive-foreground rounded-md hover:opacity-90 flex items-center gap-2"
                disabled={deleting}
              >
                {deleting ? 'Excluindo...' : 'Confirmar Exclusão'}
              </button>
            </div>
          </ExecutiveSurface>
        </div>
      )}
    </ExecutivePageTemplate>
    </ExecutiveIntelligenceShell>
  );
}
