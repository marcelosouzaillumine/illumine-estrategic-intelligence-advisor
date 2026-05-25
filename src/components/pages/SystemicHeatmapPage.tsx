import React, { useState } from 'react';
import { Network } from 'lucide-react';
import { SystemicHeatmapPanel } from '../systemic-heatmap/SystemicHeatmapPanel';
import { SystemicRiskProfile } from '../../core/runtime/consolidated/stress/stress-types';

export function SystemicHeatmapPage() {
  // Em uma implementação real, esse estado viria do orquestrador ou de um context
  // Para mock, injetamos um vazio ou testamos a UI.
  const [output] = useState<SystemicRiskProfile | undefined>(undefined);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in bg-background min-h-screen">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <Network className="text-primary" />
            Systemic Heatmap
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Visualização passiva do mapa de contágio sistêmico gerado pelo Consolidated Runtime.
          </p>
        </div>
      </div>

      <div className="pt-4">
        <SystemicHeatmapPanel output={output} />
      </div>
    </div>
  );
}
