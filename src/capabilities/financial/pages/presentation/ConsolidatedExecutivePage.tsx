import React from 'react';
import { Loader2, Globe } from 'lucide-react';
import { useConsolidatedExecutive } from '../../../../context/ConsolidatedExecutiveContext';
import { ConsolidatedConfidenceBadge } from '../../../../components/consolidated/ConsolidatedConfidenceBadge';
import { ConsolidatedExecutiveSummaryCard } from '../../../../components/consolidated/ConsolidatedExecutiveSummaryCard';
import { StrategicGroupAlertsPanel } from '../../../../components/consolidated/StrategicGroupAlertsPanel';
import { SystemicRisksPanel } from '../../../../components/consolidated/SystemicRisksPanel';
import { IntercompanyDependencyMap } from '../../../../components/consolidated/IntercompanyDependencyMap';
import { RiskPropagationPanel } from '../../../../components/consolidated/RiskPropagationPanel';
import { EntityRoleInterpretationTable } from '../../../../components/consolidated/EntityRoleInterpretationTable';
import { ConsolidatedLineagePanel } from '../../../../components/consolidated/ConsolidatedLineagePanel';
import { GovernanceViolationsPanel } from '../../../../components/consolidated/GovernanceViolationsPanel';
import { CriticalEmissionBlocker } from '../../../../components/consolidated/CriticalEmissionBlocker';
import { ExecutivePageTemplate } from '../../../../components/ui/executive-page-template';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { ExecutiveAccordion } from '../../../../components/ui/executive-accordion';
import { ExecutiveEmptyState } from '../../../../components/ui/executive-empty-state';
import { ExecutiveHeading } from '../../../../components/ui/executive-heading';
import { ExecutiveText } from '../../../../components/ui/executive-typography';
import { StatusBadge } from '../../../../components/Common';
import { createPortal } from 'react-dom';
import { ExecutiveSummarySection } from '../../../../components/ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../../../../components/ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../../../../components/ui/executive-decision-trace';
import { useConsolidatedExecutivePageViewModel } from '../../../../viewmodels/useConsolidatedExecutivePageViewModel';






export function ConsolidatedExecutivePage() {
  // Adapter: useConsolidatedExecutive
  // ViewModel: useConsolidatedExecutivePageViewModel
  const { state, computed, actions } = useConsolidatedExecutivePageViewModel();
  const portal = createPortal;
  const { report, loading, error } = useConsolidatedExecutive();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
        <ExecutiveText as="div" variant="bodyStandard" className="text-muted-foreground font-bold uppercase tracking-widest">Carregando Inteligência Consolidada...</ExecutiveText>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 p-4">
        <div className="bg-critical-soft border border-critical/20 text-critical px-8 py-6 rounded-2xl max-w-lg text-center space-y-2">
          <ExecutiveText as="div" variant="bodyStandard" className="font-bold uppercase tracking-widest">Falha de Consolidação</ExecutiveText>
          <ExecutiveText as="div" variant="bodyStandard">{error}</ExecutiveText>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <ExecutiveEmptyState 
        title="Nenhum Relatório Consolidado Disponível"
        description="Não existem dados consolidados ativos para o grupo econômico selecionado no momento."
        icon={<Globe className="w-12 h-12 text-muted-foreground" />}
      />
    );
  }

  const hasCriticalBlock = report.finalConfidence === 'LOW' && report.narrative.includes('BLOCKED');

  return (
    <ExecutivePageTemplate header={{
      icon: Globe,
      title: "Inteligência Consolidada do Grupo Econômico",
      description: "Consolidação patrimonial intercompany, dependências estruturais e propagação de risco sistêmico.",
      badge: <StatusBadge status="Verde" label="Sessão Consolidada Habilitada" />,
      actions: (
        <div className="flex flex-wrap items-center gap-3">
          <ConsolidatedConfidenceBadge confidence={report.finalConfidence} />
          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest px-3 py-1.5 bg-surface-container rounded-full border border-border">
            Renderização Passiva View Layer (Runtime-Compliant)
          </span>
        </div>
      )
    }}>
      <ExecutiveAccordion
        title="Painel de Consolidação C-Level"
        subtitle="Analise a integridade, alavancagem intercompany e conformidade de governança."
        variant="analytics"
        defaultExpanded={true}
      >
        <div className="space-y-8">
          {hasCriticalBlock ? (
            <CriticalEmissionBlocker reason={report.strategicAlerts[0] || 'Violação Crítica de Active Governance.'} />
          ) : (
            <>
              <ConsolidatedExecutiveSummaryCard narrative={report.narrative} />

              {(report.strategicAlerts?.length > 0 || report.systemicRisks?.length > 0) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <StrategicGroupAlertsPanel alerts={report.strategicAlerts} />
                  <SystemicRisksPanel risks={report.systemicRisks} />
                </div>
              )}

              {(report.dependencies?.length > 0 || report.causalities?.length > 0) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <IntercompanyDependencyMap dependencies={report.dependencies} />
                  <RiskPropagationPanel causalities={report.causalities} />
                </div>
              )}

              {report.structuralRoles?.length > 0 && (
                <EntityRoleInterpretationTable roles={report.structuralRoles} />
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className={report.violations && report.violations.length > 0 ? "col-span-1" : "col-span-1 lg:col-span-2"}>
                  <ConsolidatedLineagePanel />
                </div>
                {report.violations && report.violations.length > 0 && (
                  <GovernanceViolationsPanel violations={report.violations} />
                )}
              </div>
            </>
          )}

          <ExecutiveSummarySection 
            status={{ label: 'Consolidação Homologada', variant: 'success' }}
            question="Qual a integridade dos saldos intercompany e o risco sistêmico do grupo econômico?"
            opinion="O comitê fiduciário atesta a eliminação correta de transações intercompany e homologa os demonstrativos consolidados."
            driver="Nível de confiança da consolidação, eliminações intercompany, propagação de risco e violações de governança."
            implication="Mitigação de contágio financeiro entre controladas e transparência patrimonial."
            executiveQuestion="Sanar violações de governança identificadas no painel consolidado."
          >
            <ExecutiveStrategicTensions tensions={[]} />
            <ExecutiveDecisionTrace trace={[]} />
          </ExecutiveSummarySection>
        </div>
      </ExecutiveAccordion>
    </ExecutivePageTemplate>
  );
}
