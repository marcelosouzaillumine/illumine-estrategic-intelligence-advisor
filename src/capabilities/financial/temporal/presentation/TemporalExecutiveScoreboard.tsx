import React from 'react';
import { TemporalCausalityOutput } from '../../../../services/FiduciaryRuntimeAdapter';

interface ScoreboardProps {
  temporalData: TemporalCausalityOutput;
}

export const TemporalExecutiveScoreboard: React.FC<ScoreboardProps> = ({ temporalData }) => {
  const {
    temporalGovernanceScore,
    deteriorationState,
    fatigueState,
    responsivenessMetrics,
    predictiveRecurrence,
    lineageHash,
    confidenceState,
    auditReference
  } = temporalData;

  return (
    <div className="temporal-scoreboard p-6 bg-gray-900 border border-border rounded-lg shadow-xl text-white">
      <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
        <h2 className="text-xl font-bold tracking-tight">Temporal Governance Scoreboard</h2>
        <div className="text-xs text-muted-foreground font-mono text-right">
          <div>Ref: {auditReference}</div>
          <div>Lineage: {lineageHash.substring(0, 12)}...</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="score-panel p-4 bg-gray-800 rounded-md">
          <div className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Temporal Governance</div>
          <div className="text-4xl font-bold">{temporalGovernanceScore.temporalGovernanceScore}</div>
          <div className="text-sm mt-2 font-mono text-blue-400">
            Trajectory: {temporalGovernanceScore.governanceTrajectory}
          </div>
          <div className="text-sm mt-1 font-mono text-muted-foreground">
            Stability: {temporalGovernanceScore.institutionalStabilityIndex}
          </div>
        </div>

        <div className="score-panel p-4 bg-gray-800 rounded-md">
          <div className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Deterioration & Fatigue</div>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <div className="text-2xl font-bold text-red-400">{deteriorationState.deteriorationScore}</div>
              <div className="text-xs text-muted-foreground">Deterioration</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-400">{fatigueState.fatigueScore}</div>
              <div className="text-xs text-muted-foreground">Fatigue</div>
            </div>
          </div>
        </div>

        <div className="score-panel p-4 bg-gray-800 rounded-md">
          <div className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Responsiveness & Recurrence</div>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <div className="text-2xl font-bold text-green-400">{responsivenessMetrics.responsivenessScore}</div>
              <div className="text-xs text-muted-foreground">Responsiveness</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">{predictiveRecurrence.recurrenceScore}</div>
              <div className="text-xs text-muted-foreground">Recurrence</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-xs text-muted-foreground flex justify-between border-t border-border pt-4">
        <div>Confidence: <span className="font-mono text-muted-foreground">{confidenceState.level}</span></div>
        <div className="italic">{confidenceState.justification}</div>
      </div>
    </div>
  );
};
