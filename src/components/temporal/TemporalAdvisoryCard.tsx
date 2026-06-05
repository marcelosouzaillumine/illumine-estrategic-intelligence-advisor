import React from 'react';
import { PredictiveRecurrenceState, ResponsivenessMetrics, TemporalEscalationState, TemporalConfidenceState } from '../../services/FiduciaryRuntimeAdapter';

interface AdvisoryCardProps {
  advisoryPosture: string;
  recurrence: PredictiveRecurrenceState;
  responsiveness: ResponsivenessMetrics;
  escalation: TemporalEscalationState;
  confidence: TemporalConfidenceState;
  lineageHash: string;
}

export const TemporalAdvisoryCard: React.FC<AdvisoryCardProps> = ({
  advisoryPosture,
  recurrence,
  responsiveness,
  escalation,
  confidence,
  lineageHash
}) => {
  return (
    <div className="temporal-advisory-card p-5 bg-slate-900 border border-slate-700 rounded-lg shadow-md mb-4 text-slate-100">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-50">{advisoryPosture}</h3>
          <div className="flex gap-2 mt-1">
            <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-600 font-mono">
              Confidence: {confidence.level}
            </span>
            <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-600 font-mono">
              Lineage: {lineageHash.substring(0, 8)}
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className={`text-xs font-bold px-2 py-1 rounded uppercase
            ${escalation.currentLevel === 'BOARD_INTERVENTION' ? 'bg-red-900 text-red-100' : 
              escalation.currentLevel === 'CFO_INTERVENTION' ? 'bg-orange-900 text-orange-100' :
              'bg-blue-900 text-blue-100'}`}>
            {escalation.currentLevel.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-700">
        <div>
          <div className="text-xs text-slate-400 uppercase tracking-wide">Recurrence Severity</div>
          <div className="font-semibold">{recurrence.recurrenceSeverity.replace(/_/g, ' ')}</div>
          {recurrence.recurrenceFrequency > 0 && (
            <div className="text-xs text-slate-500 mt-1">{recurrence.recurrenceFrequency} proven cycles</div>
          )}
        </div>
        
        <div>
          <div className="text-xs text-slate-400 uppercase tracking-wide">Execution Rate</div>
          <div className="font-semibold">{responsiveness.advisoryExecutionRate}%</div>
          {responsiveness.governanceReactionTime > 0 ? (
            <div className="text-xs text-slate-500 mt-1">Avg response: {responsiveness.governanceReactionTime} days</div>
          ) : (
            <div className="text-xs text-slate-500 mt-1">No execution evidence</div>
          )}
        </div>
      </div>
    </div>
  );
};
