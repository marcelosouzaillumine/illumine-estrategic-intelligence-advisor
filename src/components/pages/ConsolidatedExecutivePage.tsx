import React from 'react';
import { Loader2, Globe2 } from 'lucide-react';
import { PageHeader } from '../Common';
import { useConsolidatedExecutive } from '../../context/ConsolidatedExecutiveContext';

import { ConsolidatedConfidenceBadge } from '../consolidated/ConsolidatedConfidenceBadge';
import { ConsolidatedExecutiveSummaryCard } from '../consolidated/ConsolidatedExecutiveSummaryCard';
import { StrategicGroupAlertsPanel } from '../consolidated/StrategicGroupAlertsPanel';
import { SystemicRisksPanel } from '../consolidated/SystemicRisksPanel';
import { IntercompanyDependencyMap } from '../consolidated/IntercompanyDependencyMap';
import { RiskPropagationPanel } from '../consolidated/RiskPropagationPanel';
import { EntityRoleInterpretationTable } from '../consolidated/EntityRoleInterpretationTable';
import { ConsolidatedLineagePanel } from '../consolidated/ConsolidatedLineagePanel';
import { GovernanceViolationsPanel } from '../consolidated/GovernanceViolationsPanel';
import { CriticalEmissionBlocker } from '../consolidated/CriticalEmissionBlocker';

export function ConsolidatedExecutivePage() {
  const { report, loading, error } = useConsolidatedExecutive();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="w-8 h-8 text-secondary animate-spin mb-4" />
        <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">Carregando Inteligência Consolidada...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-rose-500">
        <p className="text-sm font-bold">{error}</p>
      </div>
    );
  }

  if (!report) return null;

  const hasCriticalBlock = report.finalConfidence === 'LOW' && report.narrative.includes('BLOCKED');

  return (
    <div className="max-w-[1440px] mx-auto space-y-10 pb-32 animate-executive-fade">
      <PageHeader 
        title="Inteligência Consolidada do Grupo Econômico" 
        subtitle={`Visão Sistêmica e Advisory Institucional para: ${report.groupId}`}
        icon={Globe2}
        color="executive"
      />

      {hasCriticalBlock ? (
        <CriticalEmissionBlocker reason={report.strategicAlerts[0] || 'Violação Crítica de Active Governance.'} />
      ) : (
        <>
          <div className="flex items-center gap-4 mb-6">
            <ConsolidatedConfidenceBadge confidence={report.finalConfidence} />
            <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
              Renderização Passiva View Layer (Runtime-Compliant)
            </div>
          </div>

          <ConsolidatedExecutiveSummaryCard narrative={report.narrative} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
            <StrategicGroupAlertsPanel alerts={report.strategicAlerts} />
            <SystemicRisksPanel risks={report.systemicRisks} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <IntercompanyDependencyMap dependencies={report.dependencies} />
            <RiskPropagationPanel causalities={report.causalities} />
          </div>

          <div className="mt-8">
            <EntityRoleInterpretationTable roles={report.structuralRoles} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <ConsolidatedLineagePanel />
            <GovernanceViolationsPanel violations={report.violations} />
          </div>
        </>
      )}
    </div>
  );
}
