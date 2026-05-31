// src/demo-runtime/DemoContinuityCockpitPage.tsx

import React from 'react';
import { ShieldCheck, Loader2, Sparkles } from 'lucide-react';
import { useDemoScenario } from './DemoScenarioProvider';
import { InstitutionalLifecycleSurface } from '../components/institutional-continuity/InstitutionalLifecycleSurface';
import { FiduciaryContinuityPanel } from '../components/institutional-continuity/FiduciaryContinuityPanel';
import { RecoveryRegressionTimeline } from '../components/institutional-continuity/RecoveryRegressionTimeline';
import { ResilienceAntifragilityRadar } from '../components/institutional-continuity/ResilienceAntifragilityRadar';
import { FiduciaryRestrictionOverlay } from '../components/institutional-continuity/FiduciaryRestrictionOverlay';
import { InstitutionalTrajectoryGraph } from '../components/institutional-continuity/InstitutionalTrajectoryGraph';
import { ExecutiveContinuityNarrativePanel } from '../components/institutional-continuity/ExecutiveContinuityNarrativePanel';

export function DemoContinuityCockpitPage() {
  const { data, viewMode, setViewMode, loading } = useDemoScenario();

  if (loading || !data) {
    return (
      <div className="flex h-[80vh] items-center justify-center font-mono bg-zinc-950 text-zinc-100">
        <div className="flex flex-col items-center gap-4 text-zinc-500">
          <Loader2 className="animate-spin" size={32} />
          <p className="text-xs uppercase tracking-widest">Loading Fiduciary Sandbox...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full text-zinc-100 pb-12 bg-zinc-950 p-6 rounded-3xl border border-zinc-800">
      
      {/* Sovereign Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-zinc-400 mb-1">
            <ShieldCheck size={16} />
            <span className="text-[10px] uppercase font-bold tracking-widest font-mono">EFOS Sandbox & Simulations</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Institutional Continuity Cockpit (Demo Mode)</h1>
          <p className="text-xs text-zinc-500 font-mono mt-1 uppercase tracking-widest">Sovereign Fiduciary Lifecycle Visualization Layer</p>
        </div>

        {/* Development Controls (Mock Toggle) */}
        <div className="flex bg-zinc-900 border border-zinc-800 rounded overflow-hidden font-mono">
          <button 
            onClick={() => setViewMode('healthy')}
            className={`px-3 py-1.5 text-[10px] uppercase font-bold tracking-widest transition-colors ${viewMode === 'healthy' ? 'bg-zinc-800 text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Healthy (Antifragile)
          </button>
          <div className="w-px bg-zinc-800"></div>
          <button 
            onClick={() => setViewMode('fragile')}
            className={`px-3 py-1.5 text-[10px] uppercase font-bold tracking-widest transition-colors ${viewMode === 'fragile' ? 'bg-zinc-800 text-orange-400' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Fragile (Survival)
          </button>
          <div className="w-px bg-zinc-800"></div>
          <button 
            onClick={() => setViewMode('fail-closed')}
            className={`px-3 py-1.5 text-[10px] uppercase font-bold tracking-widest transition-colors ${viewMode === 'fail-closed' ? 'bg-zinc-800 text-red-400' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Fail-Closed
          </button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Top Row: Lifecycle (Full width) */}
        <div className="xl:col-span-12">
          <InstitutionalLifecycleSurface 
            activeSurvivalMode={data.survivalReport.activeSurvivalMode}
            activeRecoveryStage={data.recoveryReport.activeRecoveryStage}
            regressionDetected={data.regressionReport.regressionDetected}
            resilienceClassification={data.resilienceReport.resilienceClassification}
            antifragilityValidated={data.resilienceReport.antifragilityValidated}
            confidenceLevel={data.resilienceReport.confidenceLevel}
          />
        </div>

        {/* Middle Row Left: Fiduciary State & Restriction */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          <FiduciaryContinuityPanel 
            activeSurvivalMode={data.survivalReport.activeSurvivalMode}
            activeRecoveryStage={data.recoveryReport.activeRecoveryStage}
            regressionDetected={data.regressionReport.regressionDetected}
            resilienceClassification={data.resilienceReport.resilienceClassification}
            antifragilityValidated={data.resilienceReport.antifragilityValidated}
            institutionalRecoveryConfidence={data.recoveryReport.institutionalRecoveryConfidence}
            treasuryProtectionLevel={data.fiduciaryOutput.treasuryProtectionLevel}
            institutionalContinuityRisk={data.fiduciaryOutput.institutionalContinuityRisk}
            confidenceLevel={data.resilienceReport.confidenceLevel}
          />
          <FiduciaryRestrictionOverlay 
            activeFiduciaryLocks={data.fiduciaryOutput.activeFiduciaryLocks}
            blockedActions={data.survivalReport.blockedActions}
            survivalTriggersActive={data.survivalReport.survivalTriggersActive}
            consolidatedSeverity={data.fiduciaryOutput.consolidatedSeverity}
            failClosedTriggered={data.failClosedTriggered}
          />
        </div>

        {/* Middle Row Center: Radar & Trajectory */}
        <div className="xl:col-span-5 flex flex-col gap-6">
          <ResilienceAntifragilityRadar 
            resilienceScore={data.resilienceReport.resilienceScore}
            antifragilityScore={data.resilienceReport.antifragilityScore}
            vulnerabilityReductionScore={data.resilienceReport.vulnerabilityReductionScore}
            institutionalLearningScore={data.resilienceReport.institutionalLearningScore}
            shockAbsorptionScore={data.resilienceReport.shockAbsorptionScore}
            resilienceClassification={data.resilienceReport.resilienceClassification}
            antifragilityValidated={data.resilienceReport.antifragilityValidated}
            confidenceLevel={data.resilienceReport.confidenceLevel}
            blockedConclusions={data.resilienceReport.blockedConclusions}
            allowedConclusions={data.resilienceReport.allowedConclusions}
          />
          <InstitutionalTrajectoryGraph 
            longitudinalRuntimeHistory={data.longitudinalRuntimeHistory}
            confidenceLevel={data.resilienceReport.confidenceLevel}
          />
        </div>

        {/* Middle Row Right: Timeline & Narrative */}
        <div className="xl:col-span-3 flex flex-col gap-6">
          <RecoveryRegressionTimeline 
            events={[]} 
            auditTrail={data.auditTrail}
            regressionDetected={data.regressionReport.regressionDetected}
            activeRecoveryStage={data.recoveryReport.activeRecoveryStage}
            regressionNarrative={data.regressionReport.regressionNarrative}
          />
          <ExecutiveContinuityNarrativePanel 
            survivalNarrative={data.survivalReport.survivalNarrative}
            recoveryNarrative={data.recoveryReport.recoveryNarrative}
            regressionNarrative={data.regressionReport.regressionNarrative}
            resilienceNarrative={data.resilienceReport.resilienceNarrative}
            confidenceLevel={data.resilienceReport.confidenceLevel}
            failClosedTriggered={data.failClosedTriggered}
          />
        </div>

      </div>
    </div>
  );
}
