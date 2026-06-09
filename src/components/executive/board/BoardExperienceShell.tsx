import React, { useState } from 'react';
import { ExecutiveNarrative } from '../../../services/FiduciaryRuntimeAdapter';
import { BoardModeGuard } from '../../../services/FiduciaryRuntimeAdapter';
import { BoardFlowStep } from '../../../services/FiduciaryRuntimeAdapter';
import { sanitizeExecutivePayload } from '../../../core/presentation/emergency-executive-sanitizer';
import { RuntimeDisclosureBanner } from './RuntimeDisclosureBanner';
import { BoardNarrativeNavigator } from './BoardNarrativeNavigator';
import { CausalDrilldownPanel } from './CausalDrilldownPanel';
import { ExecutiveEvidenceExplorer } from './ExecutiveEvidenceExplorer';
import { InstitutionalTimelineViewer } from './InstitutionalTimelineViewer';

interface BoardExperienceShellProps {
  narrative: ExecutiveNarrative;
  sessionId: string;
}

export const BoardExperienceShell: React.FC<BoardExperienceShellProps> = ({ narrative, sessionId }) => {
  const [currentStep, setCurrentStep] = useState<BoardFlowStep>('SUMMARY');
  const [guardError, setGuardError] = useState<string | null>(null);

  // Fail-closed enforcement on render
  try {
    BoardModeGuard.assertSafeRendering(narrative, sessionId);
  } catch (err: any) {
    if (guardError !== err.message) {
      setGuardError(err.message);
    }
  }

  if (guardError) {
    return (
      <div className="w-full h-screen bg-background flex flex-col items-center justify-center p-8">
        <div className="max-w-2xl w-full bg-red-950/50 border border-red-500/50 p-8 rounded-lg shadow-2xl">
          <h1 className="text-red-500 text-2xl font-bold mb-4 uppercase tracking-wider">Institutional Guard Block</h1>
          <p className="text-red-200 font-mono mb-6">{guardError}</p>
          <div className="p-4 bg-black/50 rounded text-sm text-muted-foreground">
            Render pipeline aborted. Graceful degradation is disabled in Board Mode to prevent fiduciary misalignment.
          </div>
        </div>
      </div>
    );
  }

  const hasEvidence = narrative.evidenceChain && narrative.evidenceChain.length > 0;
  const hasLineage = narrative.lineage && narrative.lineage.length > 0;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      {/* Mandatory Disclosure Banner */}
      <RuntimeDisclosureBanner narrative={narrative} />

      {/* Navigation */}
      <BoardNarrativeNavigator
        sessionId={sessionId}
        hasEvidence={hasEvidence}
        hasLineage={hasLineage}
        onStepChange={setCurrentStep}
      />

      {/* Content Area */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="text-3xl font-light text-white tracking-tight">{narrative.title}</h2>
            <div className="px-3 py-1 bg-surface rounded-full text-sm font-mono text-muted-foreground">
              Session: {sessionId}
            </div>
          </div>

          {currentStep === 'SUMMARY' && (
            <div className="p-6 bg-primary border border-border rounded-lg shadow-sm text-lg text-muted-foreground leading-relaxed">
              {narrative.summary}
            </div>
          )}

          {currentStep === 'STRUCTURAL_TENSIONS' && (
            <div className="grid gap-4">
              {narrative.violations.map(v => {
                const safeV = sanitizeExecutivePayload(v);
                return (
                  <div key={safeV.violationId} className={`p-4 border rounded-lg ${v.severity === 'CRITICAL' ? 'bg-red-900/20 border-red-500/30' : 'bg-amber-900/20 border-amber-500/30'}`}>
                    <span className={`text-sm font-bold uppercase ${v.severity === 'CRITICAL' ? 'text-red-400' : 'text-amber-400'}`}>{safeV.severity as string}</span>
                    <p className="mt-1 text-muted-foreground">{safeV.message as string}</p>
                    <p className="mt-2 text-sm font-mono text-muted-foreground">Context: {safeV.sourceContext as string}</p>
                  </div>
                );
              })}
            </div>
          )}

          {currentStep === 'EVIDENCE_CHAIN' && (
            <ExecutiveEvidenceExplorer narrative={narrative} />
          )}

          {currentStep === 'DRILLDOWN' && (
            <CausalDrilldownPanel narrative={narrative} />
          )}

          {currentStep === 'TIMELINE' && (
            <InstitutionalTimelineViewer narrative={narrative} />
          )}

          {(currentStep === 'ROOT_CAUSE' || currentStep === 'PROPAGATION' || currentStep === 'INSTITUTIONAL_RISKS' || currentStep === 'RECOMMENDATIONS') && (
            <div className="p-8 text-center text-muted-foreground italic">
              [Content dynamically rendered from runtime causal models: {currentStep}]
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
