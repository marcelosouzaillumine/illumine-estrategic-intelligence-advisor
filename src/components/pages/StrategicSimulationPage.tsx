import React from 'react';
import { Landmark } from 'lucide-react';
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
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in bg-background min-h-screen">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <Landmark className="text-primary" />
            Strategic Simulation & Decision Intelligence
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Simulador Institucional: Projete consequências sistêmicas, compare cenários e analise trade-offs fiduciários antes da execução.
          </p>
        </div>
      </div>

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
