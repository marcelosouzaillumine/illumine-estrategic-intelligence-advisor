import React from 'react';
import { DemoScenario, ExecutiveDemoScenarioRegistry } from '../../../services/FiduciaryRuntimeAdapter';

interface ExecutiveScenarioSelectorProps {
  activeScenarioId: string | null;
  onSelectScenario: (scenarioId: string) => void;
}

export const ExecutiveScenarioSelector: React.FC<ExecutiveScenarioSelectorProps> = ({
  activeScenarioId,
  onSelectScenario
}) => {
  const scenarios = ExecutiveDemoScenarioRegistry.getAllScenarios();

  const isCorrupted = (sc: DemoScenario) => {
    return !sc.scenarioId || !sc.lineageIntegrityHash || !sc.evidenceIntegrityHash || !sc.runtimeSnapshotId;
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
      <h3 className="text-sm font-semibold tracking-wider text-slate-400 uppercase">
        Homologated Board Scenario Catalog
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scenarios.map((sc) => {
          const active = sc.scenarioId === activeScenarioId;
          const corrupted = isCorrupted(sc);

          return (
            <button
              key={sc.scenarioId}
              disabled={corrupted}
              onClick={() => onSelectScenario(sc.scenarioId)}
              className={`p-4 rounded-lg border text-left transition-all duration-200 flex flex-col justify-between ${
                corrupted
                  ? 'bg-slate-950 border-red-950 text-red-500 opacity-50 cursor-not-allowed'
                  : active
                  ? 'bg-blue-950/40 border-blue-500 text-blue-200'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">{sc.title}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded">
                    v{sc.scenarioVersion}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{sc.description}</p>
              </div>

              <div className="mt-4 flex items-center justify-between text-[10px] font-mono text-slate-500 w-full">
                <span>Ref: {sc.runtimeSnapshotId}</span>
                {corrupted ? (
                  <span className="text-red-500 font-bold uppercase">CORRUPTED (BLOCKED)</span>
                ) : (
                  <span className={sc.confidenceState === 'HIGH' ? 'text-emerald-400' : 'text-amber-400'}>
                    Confidence: {sc.confidenceState}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
