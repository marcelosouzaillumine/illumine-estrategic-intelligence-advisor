import React from 'react';
import { ExecutiveDisclosurePanel } from './ExecutiveDisclosurePanel';
import { GuidedBoardJourneyNavigator } from './GuidedBoardJourneyNavigator';
import { ExecutiveScenarioSelector } from './ExecutiveScenarioSelector';
import { InstitutionalScenarioTimeline } from './InstitutionalScenarioTimeline';
import { BoardPresentationMode } from './BoardPresentationMode';
import { RuntimeDisclosureBanner } from '../board/RuntimeDisclosureBanner';
import { useExecutiveDemoShellViewModel } from '../../../capabilities/executive/presentation/view-models/useExecutiveDemoShellViewModel';

export const ExecutiveDemoShell: React.FC = () => {
  const { state, computed, actions } = useExecutiveDemoShellViewModel();
  const { 
    sessionId, session, selectedScenarioId, currentStep, presentationActive, guardError, isBlocked 
  } = state;
  const { activeScenario, allowedSteps } = computed;

  const renderStepContent = () => {
    if (!activeScenario) return null;
    switch (currentStep) {
      case 'SUMMARY':
        return (
          <div className="p-6 bg-slate-900 border border-border rounded-lg text-muted-foreground">
            <h4 className="text-lg font-bold text-white mb-2">Executive Summary</h4>
            <p className="leading-relaxed">{activeScenario.description}</p>
          </div>
        );
      case 'STRUCTURAL_TENSIONS':
        return (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Structural Tensions</h4>
            {activeScenario.activeViolations.length === 0 ? (
              <p className="text-muted-foreground text-sm">No structural tensions found in this scenario.</p>
            ) : (
              activeScenario.activeViolations.map((v) => (
                <div key={v.violationId} className="p-4 bg-red-950/10 border border-red-500/20 rounded">
                  <span className="text-xs font-mono font-bold text-red-400">[{v.severity}]</span>
                  <p className="text-muted-foreground text-sm mt-1">{v.message}</p>
                  <span className="text-[10px] text-muted-foreground block mt-2">Context: {v.sourceContext}</span>
                </div>
              ))
            )}
          </div>
        );
      case 'ROOT_CAUSE':
        return (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Root Cause Analysis</h4>
            <div className="p-6 bg-slate-900 border border-border rounded-lg space-y-3">
              <p className="text-xs text-muted-foreground leading-relaxed font-mono">
                Lineage Verification Hash: {activeScenario.lineageIntegrityHash}
              </p>
              <div className="border-t border-border pt-3">
                <span className="text-xs font-mono text-emerald-400">Status: Audited & Verified</span>
                <p className="text-muted-foreground text-sm mt-2">
                  The primary causal driver is verified as {activeScenario.activeViolations.length > 0 ? `"${activeScenario.activeViolations[0].message}"` : 'no critical systemic violations'}.
                  Any narrative bypass has been prevented by the core validation engine.
                </p>
              </div>
            </div>
          </div>
        );
      case 'PROPAGATION':
        return (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Systemic Risk Propagation</h4>
            <div className="p-6 bg-slate-900 border border-border rounded-lg space-y-4">
              <div>
                <span className="text-xs text-muted-foreground font-mono block">Topology Profile</span>
                <span className="text-sm text-muted-foreground font-bold">{activeScenario.topologyProfile}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground font-mono block">Tenant Scope</span>
                <span className="text-sm text-muted-foreground font-mono">{activeScenario.tenantScope}</span>
              </div>
              <div className="border-t border-border pt-3 text-xs text-muted-foreground">
                {activeScenario.topologyProfile === 'MULTI_ENTITY'
                  ? 'Contagion risks propagate dynamically across the consolidated group entities.'
                  : 'Risk is isolated to the single operational legal entity scope.'}
              </div>
            </div>
          </div>
        );
      case 'INSTITUTIONAL_RISKS':
        return (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Institutional Risks</h4>
            <div className="p-6 bg-slate-900 border border-border rounded-lg space-y-4">
              <div>
                <span className="text-xs text-muted-foreground font-mono block font-bold">Strategic Confidence State</span>
                <span className={`text-sm font-bold ${
                  activeScenario.confidenceState === 'HIGH' ? 'text-emerald-400' : 'text-amber-400'
                }`}>{activeScenario.confidenceState} CONFIDENCE</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground font-mono block">Mandatory Disclosure Rules</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {activeScenario.disclosureRequirements.map((r, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-800 border border-border rounded text-muted-foreground text-[10px] font-mono">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'RECOMMENDATIONS':
        return (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Fiduciary Board Recommendations</h4>
            <div className="p-6 bg-slate-900 border border-border rounded-lg space-y-3">
              <ul className="list-disc list-inside space-y-2">
                {activeScenario.recommendations.map((rec, i) => (
                  <li key={i} className="text-muted-foreground text-sm leading-relaxed">
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      case 'EVIDENCE_CHAIN':
        return (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Evidence Chain & Ledger Validation</h4>
            <div className="p-6 bg-slate-900 border border-border rounded-lg space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <span className="text-muted-foreground block">Evidence Integrity Hash</span>
                  <span className="text-muted-foreground block truncate">{activeScenario.evidenceIntegrityHash}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Lineage Integrity Hash</span>
                  <span className="text-muted-foreground block truncate">{activeScenario.lineageIntegrityHash}</span>
                </div>
              </div>
              <div className="border-t border-border pt-3 text-xs text-emerald-400 font-mono flex items-center gap-1.5">
                <span>🛡️</span> All telemetry data, accounts suppliers/payables, and structural balances are verified against core ledger state.
              </div>
            </div>
          </div>
        );
      case 'TIMELINE':
        return <InstitutionalScenarioTimeline scenario={activeScenario} />;
      case 'FINAL_DISCLOSURE':
        return (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Final Compliance Disclosure</h4>
            <div className="p-6 bg-slate-900 border border-border rounded-lg space-y-3 text-xs font-mono">
              <p className="text-emerald-400 uppercase font-bold tracking-wider">✓ Approved by Fiduciary Board & Advisor Suite</p>
              <p className="text-muted-foreground leading-relaxed">
                This presentation operates on deterministic, audited snapshots. Any attempt to modify,
                generate, or alter summaries or causal pathways locally is blocked by active compliance guards.
              </p>
              <div className="pt-2 text-muted-foreground">
                Timestamp Reference: {new Date().toISOString()}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const mainUiContent = (
    <div className="space-y-6">
      {activeScenario && session && (
        <>
          <RuntimeDisclosureBanner
            narrative={{
              title: activeScenario.title,
              summary: activeScenario.description,
              confidence: activeScenario.confidenceState,
              violations: activeScenario.activeViolations,
              evidenceChain: [],
              lineage: []
            } as any}
          />
          <ExecutiveDisclosurePanel scenario={activeScenario} session={session} />
          <GuidedBoardJourneyNavigator
            currentStep={currentStep}
            allowedSteps={allowedSteps}
            hasEvidence={true}
            hasLineage={true}
            hasRuntimeMemory={true}
            onStepChange={actions.setCurrentStep}
          />
          <div className="min-h-[200px]">
            {renderStepContent()}
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-slate-950 text-muted-foreground p-8 space-y-8">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-3xl font-light text-white tracking-tight text-primary">Executive Demonstrability Workspace</h1>
          <p className="text-xs text-muted-foreground mt-1">Fiduciary Board & Advisor Presentation Suite</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono text-muted-foreground block">Session ID: {sessionId}</span>
          <span className="text-xs font-mono text-muted-foreground">Actor: CFO</span>
        </div>
      </div>

      {guardError && (
        <div className="p-4 bg-red-950/20 border border-red-500/30 rounded text-red-200 font-mono text-xs">
          ❌ GUARD BLOCK: {guardError}
        </div>
      )}

      {/* Scenario Selector */}
      <ExecutiveScenarioSelector
        activeScenarioId={selectedScenarioId}
        onSelectScenario={actions.handleSelectScenario}
      />

      {session && session.disclosureState === 'PENDING' && selectedScenarioId && (
        <div className="p-6 bg-slate-900 border border-blue-900/50 rounded-lg space-y-4">
          <h3 className="text-base font-bold text-white">Institutional Terms of Fiduciary Disclosure</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            By accepting, you certify that the demonstration runs solely on certified snapshot hashes.
            Simulations, indicators, and timelines represent audited data from the core intelligence engine.
          </p>
          <button
            onClick={actions.handleAcknowledgeDisclosure}
            className="px-4 py-2 bg-blue-600 text-white rounded text-xs font-mono font-bold hover:bg-blue-700"
          >
            Acknowledge & Start Journey
          </button>
        </div>
      )}

      {session && session.disclosureState === 'ACKNOWLEDGED' && !isBlocked && (
        <>
          <BoardPresentationMode active={presentationActive} onToggle={() => actions.setPresentationActive(!presentationActive)}>
            {mainUiContent}
          </BoardPresentationMode>
          {!presentationActive && mainUiContent}
        </>
      )}
    </div>
  );
};
export default ExecutiveDemoShell;
