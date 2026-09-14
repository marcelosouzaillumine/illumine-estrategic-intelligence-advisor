import React from 'react';
import { GitBranch } from 'lucide-react';
import { GoldenDatasetProfile, IntercompanyComplexitySimulator } from '../../../../services/FiduciaryRuntimeAdapter';

interface Props { tenantId: string; dataset: GoldenDatasetProfile }

export function InstitutionalComplexityViewer({ tenantId, dataset }: Props) {
  const intercompany = IntercompanyComplexitySimulator.simulate(tenantId, dataset);

  return (
    <div className="bg-surface-container border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <GitBranch className="text-emerald-500" />
        <h3 className="text-sm font-semibold text-foreground">Intercompany Complexity</h3>
        <span className="ml-auto text-xs font-bold text-amber-500">{intercompany.complexityRating}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 bg-background border border-border/50 rounded text-center">
          <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Exposição Total</div>
          <div className="text-lg font-bold text-primary">
            R$ {(intercompany.totalExposure / 1000000).toFixed(1)}M
          </div>
        </div>
        <div className="p-3 bg-background border border-border/50 rounded text-center">
          <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Links de Risco</div>
          <div className="text-lg font-bold text-rose-500">{intercompany.riskLinks.length}</div>
        </div>
      </div>

      <div className="space-y-2">
        {dataset.intercompanyLinks.map((link, i) => (
          <div key={i} className="flex justify-between items-center text-xs p-2 bg-background border border-border/50 rounded">
            <span className="text-muted-foreground">{link.from} → {link.to}</span>
            <div className="flex gap-2 items-center">
              <span className="text-[10px] bg-border/50 px-1.5 rounded font-mono">{link.type}</span>
              <span className="font-bold text-foreground">R$ {(link.value / 1000000).toFixed(1)}M</span>
            </div>
          </div>
        ))}
        {dataset.intercompanyLinks.length === 0 && (
          <span className="text-xs text-muted-foreground">Sem vínculos intercompany neste dataset.</span>
        )}
      </div>
    </div>
  );
}
