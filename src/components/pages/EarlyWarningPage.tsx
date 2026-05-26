import React from 'react';
import { Siren } from 'lucide-react';
import { PageHeader } from '../Common';
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
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 space-y-12 pb-32 animate-executive-fade">
      <PageHeader
        title="Predictive Governance & Early Warning"
        subtitle="Detecção antecipada de deterioração baseada em evidências do Knowledge Graph, Benchmarking e Workflows."
        icon={Siren}
        transparent
      />

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
