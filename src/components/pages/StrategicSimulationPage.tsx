import React from 'react';
import { Landmark } from 'lucide-react';
import { PageHeader } from '../Common';
import { StrategicSimulationFeed } from '../strategic-simulation/StrategicSimulationFeed';
import { DecisionImpactPanel } from '../strategic-simulation/DecisionImpactPanel';
import { GovernanceTradeoffPanel } from '../strategic-simulation/GovernanceTradeoffPanel';
import { ScenarioComparisonViewer } from '../strategic-simulation/ScenarioComparisonViewer';
import { StrategicStressCascadePanel } from '../strategic-simulation/StrategicStressCascadePanel';
import { InstitutionalResiliencePanel } from '../strategic-simulation/InstitutionalResiliencePanel';
import { DecisionEvidenceViewer } from '../strategic-simulation/DecisionEvidenceViewer';
import { StrategicSimulationTimeline } from '../strategic-simulation/StrategicSimulationTimeline';

export function StrategicSimulationPage() {
  const tenantId = 'TENANT-HQ'; // Mock MVP Tenant

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 space-y-12 pb-32 animate-executive-fade">
      <PageHeader
        title="Strategic Simulation & Decision Intelligence"
        subtitle="Simulador Institucional: Projete consequências sistêmicas, compare cenários e analise trade-offs fiduciários antes da execução."
        icon={Landmark}
        transparent
      />

      <StrategicSimulationFeed tenantId={tenantId} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DecisionImpactPanel tenantId={tenantId} />
            <InstitutionalResiliencePanel tenantId={tenantId} />
          </div>

          <GovernanceTradeoffPanel tenantId={tenantId} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StrategicStressCascadePanel tenantId={tenantId} />
            <ScenarioComparisonViewer tenantId={tenantId} />
          </div>
        </div>

        <div className="space-y-6">
          <DecisionEvidenceViewer tenantId={tenantId} />
          <StrategicSimulationTimeline tenantId={tenantId} />
        </div>
      </div>
    </div>
  );
}
