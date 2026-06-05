import React, { useState } from 'react';
import { Network } from 'lucide-react';
import { PageHeader } from '../Common';
import { SystemicHeatmapPanel } from '../systemic-heatmap/SystemicHeatmapPanel';
import { SystemicRiskProfile } from '../../services/FiduciaryRuntimeAdapter';

export function SystemicHeatmapPage() {
  // Em uma implementação real, esse estado viria do orquestrador ou de um context
  // Para mock, injetamos um vazio ou testamos a UI.
  const [output] = useState<SystemicRiskProfile | undefined>(undefined);

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 space-y-12 pb-32 animate-executive-fade">
      <PageHeader
        title="Systemic Heatmap"
        subtitle="Visualização passiva do mapa de contágio sistêmico gerado pelo Consolidated Runtime."
        icon={Network}
        transparent
      />

      <SystemicHeatmapPanel output={output} />
    </div>
  );
}
