import React from 'react';
import { Siren } from 'lucide-react';
import { EarlyWarningFeed } from '../early-warning/EarlyWarningFeed';
import { PredictiveRiskPanel } from '../early-warning/PredictiveRiskPanel';
import { GovernanceTrendPanel } from '../early-warning/GovernanceTrendPanel';
import { BenchmarkDeviationPanel } from '../early-warning/BenchmarkDeviationPanel';
import { ScenarioDeteriorationPanel } from '../early-warning/ScenarioDeteriorationPanel';
import { GraphPatternAlertPanel } from '../early-warning/GraphPatternAlertPanel';
import { WarningEvidenceViewer } from '../early-warning/WarningEvidenceViewer';
import { EarlyWarningTimeline } from '../early-warning/EarlyWarningTimeline';

export function EarlyWarningPage() {
  const tenantId = 'TENANT-HQ'; // Mock MVP Tenant

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in bg-background min-h-screen">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <Siren className="text-rose-500" />
            Predictive Governance & Early Warning
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Detecção antecipada de deterioração baseada em evidências do Knowledge Graph, Benchmarking e Workflows.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <EarlyWarningFeed tenantId={tenantId} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GovernanceTrendPanel tenantId={tenantId} />
            <PredictiveRiskPanel tenantId={tenantId} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BenchmarkDeviationPanel tenantId={tenantId} />
            <ScenarioDeteriorationPanel tenantId={tenantId} />
          </div>

          <GraphPatternAlertPanel tenantId={tenantId} />
        </div>

        <div className="space-y-6">
          <WarningEvidenceViewer tenantId={tenantId} />
          <EarlyWarningTimeline tenantId={tenantId} />
        </div>
      </div>
    </div>
  );
}
