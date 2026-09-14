import React from 'react';
import { AlertTriangle, ArrowDown, ArrowUp, Shield, Clock, XOctagon } from 'lucide-react';

interface TimelineEvent {
  timestamp: string;
  type: 'RECOVERY_TRANSITION' | 'REGRESSION_TRIGGER' | 'VETO_ACTIVATION' | 'RESTRICTION_REACTIVATION' | 'SURVIVAL_ACTIVATION' | 'AUDIT_EVENT';
  label: string;
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  detail?: string;
}

interface RecoveryRegressionTimelineProps {
  events: TimelineEvent[];
  regressionDetected: boolean;
  activeRecoveryStage: string;
  regressionNarrative: string;
  auditTrail: string[];
}

export function RecoveryRegressionTimeline({
  events,
  regressionDetected,
  activeRecoveryStage,
  regressionNarrative,
  auditTrail
}: RecoveryRegressionTimelineProps) {

  const severityColor: Record<string, string> = {
    LOW: 'border-zinc-700 bg-zinc-900',
    MODERATE: 'border-yellow-800 bg-yellow-950',
    HIGH: 'border-orange-800 bg-orange-950',
    CRITICAL: 'border-red-800 bg-red-950'
  };

  const severityDotColor: Record<string, string> = {
    LOW: 'bg-zinc-500',
    MODERATE: 'bg-yellow-500',
    HIGH: 'bg-orange-500',
    CRITICAL: 'bg-red-500'
  };

  const typeIcon: Record<string, React.ReactNode> = {
    RECOVERY_TRANSITION: <ArrowUp size={14} className="text-blue-400" />,
    REGRESSION_TRIGGER: <ArrowDown size={14} className="text-red-400" />,
    VETO_ACTIVATION: <XOctagon size={14} className="text-red-500" />,
    RESTRICTION_REACTIVATION: <Shield size={14} className="text-orange-400" />,
    SURVIVAL_ACTIVATION: <AlertTriangle size={14} className="text-red-400" />,
    AUDIT_EVENT: <Clock size={14} className="text-zinc-400" />
  };

  // Build events from auditTrail if no explicit events provided
  const displayEvents: TimelineEvent[] = events.length > 0 ? events : auditTrail.map((entry, idx) => {
    let type: TimelineEvent['type'] = 'AUDIT_EVENT';
    let severity: TimelineEvent['severity'] = 'LOW';

    if (entry.includes('[ISHE]') || entry.includes('Survival')) {
      type = 'SURVIVAL_ACTIVATION';
      severity = 'CRITICAL';
    } else if (entry.includes('[RRG]') || entry.includes('Regression')) {
      type = 'REGRESSION_TRIGGER';
      severity = 'HIGH';
    } else if (entry.includes('[IRRE]') || entry.includes('Recovery')) {
      type = 'RECOVERY_TRANSITION';
      severity = 'MODERATE';
    } else if (entry.includes('[IRAE]')) {
      type = 'AUDIT_EVENT';
      severity = 'MODERATE';
    }

    return {
      timestamp: `Event ${idx + 1}`,
      type,
      label: entry,
      severity
    };
  });

  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg w-full font-mono flex flex-col">
      <h3 className="text-zinc-400 text-xs font-semibold tracking-wider uppercase mb-2 flex items-center gap-2">
        Recovery & Regression Timeline
      </h3>

      {regressionDetected && (
        <div className="mb-4 p-3 bg-red-950/60 border border-red-900/50 rounded flex items-start gap-3">
          <AlertTriangle size={16} className="text-red-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest">Regression Detected</p>
            <p className="text-red-300/80 text-xs mt-1 leading-relaxed">{regressionNarrative}</p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 mb-4">
        <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Active Stage:</span>
        <span className="text-xs text-zinc-300 font-bold">{activeRecoveryStage}</span>
      </div>

      <div className="relative flex-1 overflow-y-auto max-h-80 pr-2">
        {/* Vertical Line */}
        <div className="absolute left-[7px] top-0 bottom-0 w-px bg-zinc-800"></div>

        <div className="space-y-3">
          {displayEvents.map((event, idx) => (
            <div key={idx} className={`flex items-start gap-3 pl-6 relative`}>
              {/* Dot */}
              <div className={`absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full border-2 border-zinc-950 ${severityDotColor[event.severity]} z-10 flex items-center justify-center`}>
              </div>
              
              <div className={`flex-1 p-3 rounded border ${severityColor[event.severity]}`}>
                <div className="flex items-center gap-2 mb-1">
                  {typeIcon[event.type]}
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest">{event.timestamp}</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">{event.label}</p>
                {event.detail && (
                  <p className="text-[10px] text-zinc-500 mt-1">{event.detail}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {displayEvents.length === 0 && (
          <div className="text-zinc-600 text-xs text-center py-8">No lifecycle events recorded.</div>
        )}
      </div>
    </div>
  );
}
