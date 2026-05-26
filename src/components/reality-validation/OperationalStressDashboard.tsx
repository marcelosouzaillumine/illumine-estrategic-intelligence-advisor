import React from 'react';
import { Zap, AlertOctagon } from 'lucide-react';
import { GoldenDatasetProfile } from '../../core/runtime/reality-validation/RealityValidationTypes';
import { OperationalStressDatasetBuilder } from '../../core/runtime/reality-validation/OperationalStressDatasetBuilder';

interface Props { tenantId: string; dataset: GoldenDatasetProfile }

export function OperationalStressDashboard({ tenantId, dataset }: Props) {
  const stress = OperationalStressDatasetBuilder.buildStressProfile(tenantId, dataset);

  const levelColor = {
    CRITICAL: 'text-rose-500',
    HIGH: 'text-amber-500',
    MEDIUM: 'text-yellow-500',
    LOW: 'text-emerald-500'
  }[stress.stressLevel];

  return (
    <div className="bg-surface-container border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="text-amber-500" />
        <h3 className="text-sm font-semibold text-foreground">Operational Stress Profile</h3>
        <span className={`ml-auto text-xs font-bold ${levelColor}`}>{stress.stressLevel}</span>
      </div>

      <div className="p-3 bg-background border border-amber-500/30 rounded mb-4">
        <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Primary Stressor</div>
        <div className="text-sm text-foreground">{stress.primaryStressor}</div>
      </div>

      <div>
        <div className="text-[10px] text-muted-foreground uppercase font-bold mb-2">Entidades Críticas</div>
        <div className="space-y-1">
          {stress.criticalEntities.map((e, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <AlertOctagon size={12} className="text-rose-500 flex-shrink-0" />
              <span className="text-foreground">{e}</span>
            </div>
          ))}
          {stress.criticalEntities.length === 0 && (
            <span className="text-xs text-muted-foreground">Nenhuma entidade em estado crítico.</span>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border/50 space-y-1">
        <div className="text-[10px] text-muted-foreground uppercase font-bold mb-2">Governance Events</div>
        {dataset.governanceEvents.map((e, i) => (
          <div key={i} className="text-xs text-muted-foreground flex gap-2">
            <span className="text-primary">›</span>
            {e}
          </div>
        ))}
      </div>
    </div>
  );
}
