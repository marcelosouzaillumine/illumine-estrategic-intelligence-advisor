import React from 'react';
import { usePilotOperations } from '../../../../context/pilot-operations/PilotOperationsProvider';
import { Brain, ShieldAlert, Check } from 'lucide-react';
// src/components/pilot-operations/CognitiveLoadIndicator.tsx


export const CognitiveLoadIndicator: React.FC = () => {
  const { cognitiveLoadSignals, pilotStatus } = usePilotOperations();

  const loadStatusColors = {
    NORMAL: 'text-emerald-500 bg-success-soft0/10 border-emerald-500/25',
    HIGH: 'text-amber-500 bg-warning-soft0/10 border-amber-500/25',
    CRITICAL: 'text-rose-500 bg-critical-soft0/10 border-rose-500/25 animate-pulse'
  };

  const isFailClosed = pilotStatus === 'FAIL_CLOSED';

  return (
    <div className="card-premium p-6 space-y-4 relative overflow-hidden group hover:border-secondary/20 transition-all duration-300">
      <div className="flex justify-between items-center border-b border-border/40 pb-3">
        <span className="text-[10px] font-mono font-bold tracking-widest text-secondary uppercase block">COGNITIVE LOAD SIGNALS</span>
        <div className={`px-2.5 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider ${loadStatusColors[isFailClosed ? 'NORMAL' : cognitiveLoadSignals.status]}`}>
          {isFailClosed ? 'RESTRICTED' : cognitiveLoadSignals.status}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
            <Brain size={18} />
          </div>
          <div>
            <h4 className="text-xl font-bold font-mono tracking-tight text-foreground">
              {isFailClosed ? 'N/A' : `${cognitiveLoadSignals.interactionVelocity} Ops`}
            </h4>
            <p className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider mt-0.5">Interaction Velocity</p>
          </div>
        </div>

        {/* Diagnostic assessment */}
        <div className="p-3 bg-surface-container/60 border border-border/60 rounded-xl">
          {isFailClosed ? (
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Métricas cognitivas suspensas devido ao estado de isolamento.
            </p>
          ) : cognitiveLoadSignals.status === 'CRITICAL' ? (
            <div className="space-y-1 text-rose-500">
              <span className="text-[9px] font-mono font-black uppercase tracking-widest flex items-center gap-1">
                <ShieldAlert size={10} /> Friction Detected
              </span>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Executivo exibindo ritmo de navegação anormal ({cognitiveLoadSignals.overloadsCount} picos). Risco de incompreensão ou looping cognitivo.
              </p>
            </div>
          ) : cognitiveLoadSignals.status === 'HIGH' ? (
            <div className="space-y-1 text-amber-500">
              <span className="text-[9px] font-mono font-black uppercase tracking-widest flex items-center gap-1">
                <ShieldAlert size={10} /> Moderate Tension
              </span>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Velocidade de clique elevada. Monitoramento recomendado sobre leitura de cenários.
              </p>
            </div>
          ) : (
            <div className="space-y-1 text-emerald-500">
              <span className="text-[9px] font-mono font-black uppercase tracking-widest flex items-center gap-1">
                <Check size={10} /> Stable Interaction
              </span>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Navegação tranquila e leitura progressiva. Curva de adoção saudável verificada.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
