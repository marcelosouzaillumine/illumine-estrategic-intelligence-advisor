// src/components/strategic-intelligence/InstitutionalStrategicIntelligenceCenter.tsx

import React from 'react';
import { Network } from 'lucide-react';
import { InstitutionalStrategicIntelligenceOutput } from '../../services/FiduciaryRuntimeAdapter';

import { StrategicPosturePanel } from './StrategicPosturePanel';
import { InstitutionalVectorMap } from './InstitutionalVectorMap';
import { StrategicContradictionSurface } from './StrategicContradictionSurface';
import { ExpansionSustainabilityPanel } from './ExpansionSustainabilityPanel';
import { TrajectoryContinuityTimeline } from './TrajectoryContinuityTimeline';
import { CapitalStrategyAlignmentSurface } from './CapitalStrategyAlignmentSurface';
import { StrategicExplainabilityDrawer } from './StrategicExplainabilityDrawer';
import { StrategicRestrictionOverlay } from './StrategicRestrictionOverlay';
import { InstitutionalDirectionHeatmap } from './InstitutionalDirectionHeatmap';

interface InstitutionalStrategicIntelligenceCenterProps {
  data: InstitutionalStrategicIntelligenceOutput;
}

export function InstitutionalStrategicIntelligenceCenter({ data }: InstitutionalStrategicIntelligenceCenterProps) {
  
  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Network className="text-blue-500" />
            Institutional Strategic Intelligence
          </h2>
          <p className="text-zinc-400 text-sm mt-1">Sovereign Directional Coherence Layer</p>
        </div>
      </div>

      <StrategicRestrictionOverlay strategicOutput={data} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <StrategicPosturePanel posture={data.posture} />
        </div>
        <div className="lg:col-span-1">
          <TrajectoryContinuityTimeline status={data.trajectory} />
        </div>
        <div className="lg:col-span-1">
          <InstitutionalVectorMap vector={data.vectors[0]} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpansionSustainabilityPanel sustainability={data.expansionSustainability} />
        <CapitalStrategyAlignmentSurface alignment={data.capitalAlignment} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <InstitutionalDirectionHeatmap strategicOutput={data} />
        </div>
        <div className="lg:col-span-1">
          <StrategicContradictionSurface contradictions={data.contradictions} />
        </div>
      </div>

      <StrategicExplainabilityDrawer explainability={data.explainability} />

    </div>
  );
}
