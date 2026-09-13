import React from 'react';
import { PageHeader } from '../../../../components/Common';
import { ShieldCheck, RefreshCw } from 'lucide-react';
import { usePilotOperations } from '../../../../context/pilot-operations/PilotOperationsProvider';
import { PilotOperationalHealthCard } from '../../../../components/pilot-operations/PilotOperationalHealthCard';
import { CognitiveLoadIndicator } from '../../../../components/pilot-operations/CognitiveLoadIndicator';
import { RuntimeStabilitySurface } from '../../../../components/pilot-operations/RuntimeStabilitySurface';
import { ExecutiveOnboardingSurface } from '../../../../components/pilot-operations/ExecutiveOnboardingSurface';
import { PilotValidationDashboard } from '../../../../components/pilot-operations/PilotValidationDashboard';
import { ExecutiveAdoptionTimeline } from '../../../../components/pilot-operations/ExecutiveAdoptionTimeline';
import { GovernanceReadabilityPanel } from '../../../../components/pilot-operations/GovernanceReadabilityPanel';
import { PilotFeedbackSurface } from '../../../../components/pilot-operations/PilotFeedbackSurface';
import { GovernanceWorkflowGuide } from '../../../../components/pilot-operations/GovernanceWorkflowGuide';
// src/components/pilot-operations/PilotOperationsCenter.tsx


// Import sub-components

export const PilotOperationsCenter: React.FC = () => {
  const { logTelemetry, pilotStatus } = usePilotOperations();

  const handleManualRefresh = () => {
    logTelemetry('MANUAL_SUPERVISION_REFRESH');
  };

  const isFailClosed = pilotStatus === 'FAIL_CLOSED';

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 space-y-12 pb-32 animate-executive-fade text-foreground">
      {/* Fail-Closed Banner Indicator */}
      {isFailClosed && (
        <div className="bg-rose-950/40 border border-rose-600/40 text-rose-500 p-4 rounded-xl flex items-center justify-between shadow-lg backdrop-blur-sm animate-pulse -mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-critical-soft0/20 flex items-center justify-center font-bold text-rose-500 text-sm">!</div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider">FAIL-CLOSED ACTIVE</p>
              <p className="text-[10px] text-rose-400 mt-0.5">Integridade regulatória comprometida. Ações e métricas estão bloqueadas.</p>
            </div>
          </div>
          <span className="text-[9px] font-mono font-bold tracking-widest bg-critical-soft0/10 border border-rose-500/20 px-2 py-0.5 rounded text-rose-500">
            SECURE DEGRADATION
          </span>
        </div>
      )}

      {/* Page Header */}
      <PageHeader
        title="Pilot Operations Center"
        subtitle="Supervisão operacional de pilotos institucionais, integridade de runtime e prontidão de go-live."
        icon={ShieldCheck}
        transparent
        actions={
          <button
            onClick={handleManualRefresh}
            className="px-4 py-2 hover:bg-surface-container bg-card border border-border text-[9px] font-mono font-black uppercase tracking-widest rounded-button flex items-center gap-1.5 text-muted-foreground hover:text-secondary transition-all"
            title="Sincronizar Telemetria"
          >
            <RefreshCw size={12} className="animate-spin-slow" />
            Recarregar Telemetria
          </button>
        }
      />

      {/* Top Cards: Health, Cognitive Load, and Stability */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <PilotOperationalHealthCard />
        <CognitiveLoadIndicator />
        <RuntimeStabilitySurface />
      </div>

      {/* Main Grid: Checklist & Auditing (Left) vs Adoption & Feedback (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-8">
          <ExecutiveOnboardingSurface />
          <PilotValidationDashboard />
          <ExecutiveAdoptionTimeline />
        </div>

        {/* Right Column (1/3 width) */}
        <div className="space-y-8">
          <GovernanceReadabilityPanel />
          <PilotFeedbackSurface />
          <GovernanceWorkflowGuide />
        </div>

      </div>
    </div>
  );
};
