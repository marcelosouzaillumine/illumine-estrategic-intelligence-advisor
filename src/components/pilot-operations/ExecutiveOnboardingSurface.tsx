// src/components/pilot-operations/ExecutiveOnboardingSurface.tsx

import React from 'react';
import { usePilotOperations } from '../../context/pilot-operations/PilotOperationsProvider';
import { CheckCircle2, Lock, ShieldAlert, Sparkles, Milestone } from 'lucide-react';
import { ONBOARDING_STEPS } from '../../services/FiduciaryRuntimeAdapter';

export const ExecutiveOnboardingSurface: React.FC = () => {
  const { onboardingState, onboardingProgress, completeOnboardingStep, pilotStatus } = usePilotOperations();

  const isFailClosed = pilotStatus === 'FAIL_CLOSED';

  // Determine current pending step
  const completedSteps = onboardingState.completedSteps;
  
  return (
    <div className="card-premium p-8 space-y-6 relative overflow-hidden group hover:border-secondary/20 transition-all duration-300">
      <div className="flex justify-between items-center border-b border-border/40 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-secondary/10 flex items-center justify-center text-secondary">
            <Milestone size={16} />
          </div>
          <div>
            <h3 className="text-base font-medium text-foreground tracking-tight">Onboarding Fiduciário do Executivo</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">Jornada de homologação e treinamento para C-Levels e Conselho.</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold font-mono tracking-tight">{onboardingProgress}%</span>
          <span className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider block">CONCLUÍDO</span>
        </div>
      </div>

      {isFailClosed && (
        <div className="p-4 bg-critical-soft0/10 border border-rose-500/25 rounded-xl text-rose-500 flex items-start gap-2.5">
          <ShieldAlert size={16} className="shrink-0 mt-0.5" />
          <div className="text-[10px] leading-relaxed">
            <p className="font-bold uppercase tracking-wider mb-0.5">PROGRESSÃO DE ONBOARDING BLOQUEADA</p>
            <p className="text-rose-500/80">O fluxo de onboarding está desabilitado temporariamente devido ao estado FAIL_CLOSED do tenant.</p>
          </div>
        </div>
      )}

      {/* Steps List */}
      <div className="space-y-4">
        {ONBOARDING_STEPS.map((step, idx) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrentActive = !isCompleted && (idx === 0 || completedSteps.includes(ONBOARDING_STEPS[idx - 1].id));
          const isLocked = !isCompleted && !isCurrentActive;

          return (
            <div
              key={step.id}
              className={`p-4 border rounded-xl flex items-center justify-between gap-4 transition-all ${
                isCompleted ? 'border-success/20 bg-success/5 text-success/80' :
                isCurrentActive ? 'border-secondary bg-secondary/5 text-secondary' : 'border-border/60 bg-surface-container/20 text-muted-foreground opacity-50'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-background border border-current rounded uppercase tracking-wider">
                    STEP 0{idx + 1}
                  </span>
                  <span className="text-xs font-bold text-foreground">
                    {step.label}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="shrink-0">
                {isCompleted ? (
                  <div className="p-1 text-success"><CheckCircle2 size={18} /></div>
                ) : isCurrentActive ? (
                  <button
                    disabled={isFailClosed}
                    onClick={() => completeOnboardingStep(step.id)}
                    className="px-3 py-1.5 bg-secondary text-secondary-foreground hover:bg-secondary/95 disabled:opacity-50 disabled:cursor-not-allowed text-[9px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center gap-1 shadow-sm"
                  >
                    <Sparkles size={10} />
                    Validar Passo
                  </button>
                ) : (
                  <div className="p-2 text-muted-foreground/45"><Lock size={14} /></div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
