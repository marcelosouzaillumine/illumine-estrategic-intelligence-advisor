import React from 'react';
import { DemoScenario, DemoSessionState } from '../../../services/FiduciaryRuntimeAdapter';

interface ExecutiveDisclosurePanelProps {
  scenario: DemoScenario;
  session: DemoSessionState;
}

export const ExecutiveDisclosurePanel: React.FC<ExecutiveDisclosurePanelProps> = ({ scenario, session }) => {
  return (
    <div className="w-full bg-slate-900 border border-border rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h3 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
          Fiduciary Governance Disclosure
        </h3>
        <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-500/20 text-xs font-mono rounded">
          Active Trace Verified
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs font-mono">
        <div>
          <span className="text-muted-foreground block">Runtime Ref</span>
          <span className="text-muted-foreground">{scenario.runtimeSnapshotId}</span>
        </div>
        <div>
          <span className="text-muted-foreground block">Confidence Level</span>
          <span className={`font-bold ${
            scenario.confidenceState === 'HIGH'
              ? 'text-emerald-400'
              : scenario.confidenceState === 'MEDIUM'
              ? 'text-amber-400'
              : 'text-red-400'
          }`}>
            {scenario.confidenceState}
          </span>
        </div>
        <div>
          <span className="text-muted-foreground block">Disclosure Status</span>
          <span className="text-muted-foreground font-bold">{session.disclosureState}</span>
        </div>
        <div>
          <span className="text-muted-foreground block">Lineage Integrity</span>
          <span className="text-muted-foreground truncate block max-w-[200px]" title={scenario.lineageIntegrityHash}>
            {scenario.lineageIntegrityHash}
          </span>
        </div>
        <div>
          <span className="text-muted-foreground block">Evidence Integrity</span>
          <span className="text-muted-foreground truncate block max-w-[200px]" title={scenario.evidenceIntegrityHash}>
            {scenario.evidenceIntegrityHash}
          </span>
        </div>
        <div>
          <span className="text-muted-foreground block">Active Violations</span>
          <span className={`font-bold ${scenario.activeViolations.length > 0 ? 'text-red-400' : 'text-muted-foreground'}`}>
            {scenario.activeViolations.length} Detected
          </span>
        </div>
      </div>

      {scenario.activeViolations.length > 0 && (
        <div className="mt-4 p-3 bg-red-950/20 border border-red-500/20 rounded space-y-2">
          <div className="text-xs font-bold text-red-400 uppercase tracking-wider">
            Critical Systemic Warnings
          </div>
          {scenario.activeViolations.map((v) => (
            <div key={v.violationId} className="text-xs text-muted-foreground font-mono">
              [{v.severity}] {v.message} ({v.sourceContext})
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
