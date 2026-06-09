import React from 'react';
import { ExecutiveNarrative } from '../../../services/FiduciaryRuntimeAdapter';

interface CausalDrilldownPanelProps {
  narrative: ExecutiveNarrative;
}

export const CausalDrilldownPanel: React.FC<CausalDrilldownPanelProps> = ({ narrative }) => {
  if (!narrative.lineage || narrative.lineage.length === 0) {
    return (
      <div className="p-4 bg-primary border border-slate-800 rounded">
        <p className="text-muted-foreground font-mono text-sm">DRILLDOWN_UNAVAILABLE: No lineage detected in narrative.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-primary border border-slate-800 rounded-lg">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        Causal Drilldown
      </h3>
      <div className="space-y-4">
        {narrative.causalityOrder.map((node, index) => (
          <div key={node} className="flex flex-col">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-muted-foreground text-sm font-mono">
                {index + 1}
              </div>
              <div className="flex-1 p-3 bg-surface/50 rounded border border-slate-700/50">
                <p className="font-mono text-sm text-muted-foreground">{node}</p>
                {/* Find violations in this node context */}
                {narrative.violations.filter(v => v.sourceContext === node).map(v => (
                  <div key={v.violationId} className="mt-2 text-sm text-red-400">
                    ⚠️ {v.severity}: {v.message}
                  </div>
                ))}
              </div>
            </div>
            {index < narrative.causalityOrder.length - 1 && (
              <div className="w-0.5 h-6 bg-surface ml-4 my-1"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
