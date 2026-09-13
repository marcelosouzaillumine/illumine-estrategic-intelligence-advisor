// src/components/war-gaming/InstitutionalWarRoomPage.tsx

import React, { useState } from 'react';
import { CrisisInput, WarGameResult } from '../../../../services/FiduciaryRuntimeAdapter';
import { WarGameAdapter } from '../../../../services/FiduciaryRuntimeAdapter';

// Subcomponents (mocks for structural composition)
import { CrisisScenarioPanel } from './CrisisScenarioPanel';
import { TreasurySurvivalMap } from './TreasurySurvivalMap';
import { CollapsePropagationGraph } from './CollapsePropagationGraph';
import { StrategicResponseComparator } from './StrategicResponseComparator';
import { CrisisExplainabilityDrawer } from './CrisisExplainabilityDrawer';
import { LiquidityStressTimeline } from './LiquidityStressTimeline';
import { InstitutionalPressureHeatmap } from './InstitutionalPressureHeatmap';

interface InstitutionalWarRoomPageProps {
  rawData?: any;
  clientId?: string;
  selectedYear?: number;
  selectedMonth?: number;
}

export function InstitutionalWarRoomPage({ rawData }: InstitutionalWarRoomPageProps) {
  const [activeScenario, setActiveScenario] = useState<WarGameResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSimulate = (inputs: CrisisInput[]) => {
    try {
      setError(null);
      const result = WarGameAdapter.executeSimulatedCrisis(
        `SCEN-${Date.now()}`,
        inputs,
        rawData
      );
      setActiveScenario(result);
    } catch (e: any) {
      setError(e.message);
      setActiveScenario(null);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <header className="flex justify-between items-end border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-black text-primary tracking-tight">Institutional War Room</h1>
     <p className="text-sm font-medium text-executive-secondary mt-2">
            Simulação estrutural de crise e deterioração institucional sob governança fiduciária.
          </p>
        </div>
      </header>

      {error && (
        <div className="bg-critical-soft border-l-4 border-rose-500 p-4 rounded-r-lg">
          <p className="text-rose-700 font-bold text-sm uppercase tracking-wider">Bloqueio Fiduciário</p>
          <p className="text-rose-600 text-xs mt-1">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <CrisisScenarioPanel onSimulate={handleSimulate} />
          {activeScenario && <InstitutionalPressureHeatmap thesis={activeScenario.thesis} />}
        </div>
        
        <div className="lg:col-span-2 space-y-8">
          {activeScenario ? (
            <>
              <TreasurySurvivalMap treasury={activeScenario.treasurySurvival} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <LiquidityStressTimeline treasury={activeScenario.treasurySurvival} />
                <CollapsePropagationGraph propagation={activeScenario.propagation} />
              </div>
              <StrategicResponseComparator result={activeScenario} />
              <CrisisExplainabilityDrawer profile={activeScenario.explainability} />
            </>
          ) : (
            <div className="bg-slate-50 border border-border rounded-2xl flex flex-col items-center justify-center h-96 p-8 text-center">
              <span className="text-muted-foreground font-black text-xl mb-4">NENHUMA CRISE ATIVA</span>
       <p className="text-executive-secondary text-sm">
                Configure os parâmetros de estresse no painel lateral para iniciar a simulação estrutural de sobrevivência.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
