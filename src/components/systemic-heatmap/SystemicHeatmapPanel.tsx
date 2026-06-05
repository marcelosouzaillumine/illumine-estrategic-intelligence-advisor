import React from 'react';
import { SystemicRiskProfile } from '../../services/FiduciaryRuntimeAdapter';
import { SystemicHeatmapComplianceGuard } from './SystemicHeatmapComplianceGuard';
import { SystemicConfidenceState } from './SystemicConfidenceState';
import { SystemicStressGrid } from './SystemicStressGrid';
import { PropagatedRiskList } from './PropagatedRiskList';
import { ContagionLineageViewer } from './ContagionLineageViewer';
import { CriticalDependencyChainsPanel } from './CriticalDependencyChainsPanel';
import { AffectedEntitiesPanel } from './AffectedEntitiesPanel';
import { StressPropagationWarningsPanel } from './StressPropagationWarningsPanel';

export function SystemicHeatmapPanel({ output }: { output?: SystemicRiskProfile }) {
  return (
    <SystemicHeatmapComplianceGuard output={output}>
      {output && (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold text-foreground">Heatmap de Contágio Sistêmico</h2>
            <p className="text-sm text-muted-foreground">Visão matriz de riscos de propagação e dependências (Read-Only).</p>
            <div className="mt-2">
              <SystemicConfidenceState level={output['systemicConfidence']} />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-8 space-y-8">
              <SystemicStressGrid stressMap={output.systemicStressMap} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <PropagatedRiskList risks={output.propagatedRisks} />
                <CriticalDependencyChainsPanel chains={output.criticalDependencyChains} />
              </div>
            </div>

            <div className="col-span-12 lg:col-span-4 space-y-6">
              <AffectedEntitiesPanel entities={output.affectedEntities} />
              <StressPropagationWarningsPanel warnings={output.stressPropagationWarnings} />
              <ContagionLineageViewer lineage={output.contagionLineage} />
            </div>
          </div>
        </div>
      )}
    </SystemicHeatmapComplianceGuard>
  );
}
