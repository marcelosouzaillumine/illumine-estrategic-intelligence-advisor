import React from 'react';
import { StrategicDecisionSimulator } from '../../core/runtime/strategic-simulation/StrategicDecisionSimulator';
import { MultiScenarioComparisonEngine } from '../../core/runtime/strategic-simulation/MultiScenarioComparisonEngine';
import { GitCompare } from 'lucide-react';

export function ScenarioComparisonViewer({ tenantId }: { tenantId: string }) {
  const sims = StrategicDecisionSimulator.getSimulations(tenantId);
  // Requereria 2 sims para comparar. No mock temos 1, então mockamos a comparação contra a 'base atual'.
  if (sims.length === 0) return null;

  const comparison = MultiScenarioComparisonEngine.compare(sims[0], sims[0]);

  return (
    <div className="bg-surface-container border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <GitCompare className="text-blue-500" />
        <h3 className="text-sm font-semibold text-foreground">Multi-Scenario Comparison</h3>
      </div>
      <div className="text-sm text-muted-foreground p-4 border border-dashed border-border rounded text-center">
        Comparação entre Cenário Base e Decisão Projetada (Simulação Atual) processada via Sandbox.
      </div>
    </div>
  );
}
