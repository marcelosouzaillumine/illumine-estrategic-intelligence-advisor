import React from 'react';
import { useCommandCenter } from '../../../../context/governance-command-center/GovernanceCommandCenterProvider';
import { CommandIntegrityBadge } from './CommandIntegrityBadge';
import { ExecutiveCommandNavigator } from './ExecutiveCommandNavigator';
import { GovernanceIncidentQueue } from './GovernanceIncidentQueue';
import { ExecutiveIncidentRadar } from './ExecutiveIncidentRadar';
import { RuntimeHealthPanel } from './RuntimeHealthPanel';
import { EscalationTopologyMap } from './EscalationTopologyMap';
import { SystemicPropagationSurface } from './SystemicPropagationSurface';
import { MultiTenantOperationsGrid } from './MultiTenantOperationsGrid';
import { GovernanceSupervisionTimeline } from './GovernanceSupervisionTimeline';
import { IncidentLifecyclePanel } from './IncidentLifecyclePanel';
import { IncidentLineageViewer } from './IncidentLineageViewer';
import { RuntimeIntegritySurface } from './RuntimeIntegritySurface';
import { GovernanceAuditCorrelationPanel } from './GovernanceAuditCorrelationPanel';

export const GovernanceCommandCenterSurface: React.FC = () => {
  const { commandIntegrity, supervisionMode, operationalStress } = useCommandCenter();

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner / Status Overview */}
      <div className="flex justify-between items-center bg-slate-950/60 border border-border p-5 rounded-2xl flex-wrap gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold font-mono text-primary uppercase tracking-wide">
              Governance Command Center
            </h1>
            <CommandIntegrityBadge state={commandIntegrity} />
          </div>
          <p className="text-muted-foreground text-xs font-sans">
            Supervisão e monitoramento fiduciário em tempo real de ativos do runtime.
          </p>
        </div>

        <div className="flex gap-6 font-mono text-xs text-right">
          <div className="space-y-0.5">
            <span className="text-muted-foreground uppercase block text-[9px]">SUPERVISION MODE</span>
            <span className="text-cyan-400 font-bold">{supervisionMode} MODE</span>
          </div>
          <div className="space-y-0.5 border-l border-border pl-6">
            <span className="text-muted-foreground uppercase block text-[9px]">OPERATIONAL STRESS</span>
            <span className={`font-bold ${operationalStress > 60 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {operationalStress}% Index
            </span>
          </div>
        </div>
      </div>

      {/* Navegação de Escopo */}
      <ExecutiveCommandNavigator />

      {/* Grid Central de Operações */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna 1: Fila de Supervisão de Incidentes (Mais larga) */}
        <div className="lg:col-span-1 space-y-8">
          <GovernanceIncidentQueue />
          <GovernanceSupervisionTimeline />
        </div>

        {/* Coluna 2: Telemetria, Radar de Severidade e Propagação */}
        <div className="lg:col-span-1 space-y-8">
          <RuntimeHealthPanel />
          <ExecutiveIncidentRadar />
          <EscalationTopologyMap />
          <SystemicPropagationSurface />
        </div>

        {/* Coluna 3: Ciclo de Vida, Console de Logs e Audit Correlation */}
        <div className="lg:col-span-1 space-y-8">
          <IncidentLifecyclePanel />
          <IncidentLineageViewer />
          <RuntimeIntegritySurface />
          <GovernanceAuditCorrelationPanel />
        </div>
      </div>

      {/* Painel Multi-Tenant - Exclusivo para Assessores Corporativos */}
      <MultiTenantOperationsGrid />
    </div>
  );
};
