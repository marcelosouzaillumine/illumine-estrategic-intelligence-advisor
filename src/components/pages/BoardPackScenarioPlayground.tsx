import React, { useState, useMemo } from 'react';
import { Target, Activity } from 'lucide-react';
import { InstitutionalBoardPackCenter } from '../institutional-reporting/InstitutionalBoardPackCenter';
import { MockBoardPackScenarios } from '../../core/runtime/validation/MockBoardPackScenarios';

type ScenarioType = 
  | 'HEALTHY' 
  | 'RESTRICTIVE' 
  | 'QUARANTINE' 
  | 'INSUFFICIENT' 
  | 'NEG_FCO_POS_FCF' 
  | 'ARTIFICIAL' 
  | 'SUSTAINABLE';

export function BoardPackScenarioPlayground() {
  const [activeScenario, setActiveScenario] = useState<ScenarioType>('HEALTHY');

  const boardPack = useMemo(() => {
    switch (activeScenario) {
      case 'HEALTHY': return MockBoardPackScenarios.getHealthyCompany();
      case 'RESTRICTIVE': return MockBoardPackScenarios.getRestrictiveTrajectory();
      case 'QUARANTINE': return MockBoardPackScenarios.getAccountingQuarantine();
      case 'INSUFFICIENT': return MockBoardPackScenarios.getInsufficientHistory();
      case 'NEG_FCO_POS_FCF': return MockBoardPackScenarios.getNegativeFcoPositiveFcf();
      case 'ARTIFICIAL': return MockBoardPackScenarios.getArtificialTurnaround();
      case 'SUSTAINABLE': return MockBoardPackScenarios.getSustainableGrowth();
    }
  }, [activeScenario]);

  return (
    <div className="p-8 bg-zinc-950 min-h-screen text-zinc-200">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Activity className="text-blue-500" />
              Sovereign Board Pack Playground
            </h1>
            <p className="text-zinc-400 mt-2 font-mono text-sm">
              Auditoria visual de 7 estados fiduciários. O Runtime é quem decide os estados e a UI reage passivamente.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pb-4">
          <button 
            onClick={() => setActiveScenario('HEALTHY')}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-widest font-bold border rounded transition-colors ${activeScenario === 'HEALTHY' ? 'bg-blue-600 text-white border-blue-500' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800'}`}
          >
            Healthy Company
          </button>
          <button 
            onClick={() => setActiveScenario('RESTRICTIVE')}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-widest font-bold border rounded transition-colors ${activeScenario === 'RESTRICTIVE' ? 'bg-amber-600 text-white border-amber-500' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800'}`}
          >
            Restrictive Trajectory
          </button>
          <button 
            onClick={() => setActiveScenario('QUARANTINE')}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-widest font-bold border rounded transition-colors ${activeScenario === 'QUARANTINE' ? 'bg-rose-600 text-white border-rose-500' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800'}`}
          >
            Accounting Quarantine
          </button>
          <button 
            onClick={() => setActiveScenario('INSUFFICIENT')}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-widest font-bold border rounded transition-colors ${activeScenario === 'INSUFFICIENT' ? 'bg-orange-600 text-white border-orange-500' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800'}`}
          >
            Insufficient History
          </button>
          <button 
            onClick={() => setActiveScenario('NEG_FCO_POS_FCF')}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-widest font-bold border rounded transition-colors ${activeScenario === 'NEG_FCO_POS_FCF' ? 'bg-purple-600 text-white border-purple-500' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800'}`}
          >
            Negative FCO + Positive FCF
          </button>
          <button 
            onClick={() => setActiveScenario('ARTIFICIAL')}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-widest font-bold border rounded transition-colors ${activeScenario === 'ARTIFICIAL' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800'}`}
          >
            Artificial Turnaround
          </button>
          <button 
            onClick={() => setActiveScenario('SUSTAINABLE')}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-widest font-bold border rounded transition-colors ${activeScenario === 'SUSTAINABLE' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800'}`}
          >
            Sustainable Real Growth
          </button>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-6">
          <InstitutionalBoardPackCenter boardPack={boardPack} />
        </div>

      </div>
    </div>
  );
}
