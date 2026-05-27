import React from 'react';
import { useExecutiveInteraction } from '../../context/executive-interaction/ExecutiveInteractionProvider';
import { ShieldAlert, CheckCircle2, Loader2, Database, ShieldCheck, History } from 'lucide-react';

export const ExecutiveLoadingSurface: React.FC = () => {
  const { loadingSemantics, interactionState } = useExecutiveInteraction();

  if (interactionState !== 'LOADING' && loadingSemantics.phase === 'ready') {
    return null;
  }

  const { phase, message, progress, completedChecks } = loadingSemantics;

  const phases = [
    { key: 'validating', label: 'Validação de Contexto', icon: ShieldAlert },
    { key: 'dependencies', label: 'Verificação de Dependências', icon: Database },
    { key: 'confidence', label: 'Cálculo de Confiança', icon: CheckCircle2 },
    { key: 'lineage', label: 'Integridade de Lineage', icon: History },
    { key: 'sync', label: 'Sincronização de Governança', icon: ShieldCheck }
  ];

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-md z-[9999] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="max-w-md w-full card-premium p-8 space-y-8 border-border/20 shadow-2xl">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mx-auto border border-secondary/20 shadow-inner">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-200 uppercase tracking-wider">Verificando Assinatura do Runtime</h3>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-mono">Fiduciary Verification Protocol Active</p>
          </div>
        </div>

        {/* Progresso Geral */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-mono text-slate-400">
            <span>{message}</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-border/10">
            <div 
              className="bg-secondary h-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Fases do Runtime */}
        <div className="space-y-3 pt-4 border-t border-border/10">
          {phases.map((p, idx) => {
            const isCompleted = completedChecks.includes(p.key);
            const isActive = phase === p.key;
            const Icon = p.icon;

            return (
              <div 
                key={p.key} 
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                  isActive 
                    ? 'bg-secondary/5 border-secondary/35 text-secondary' 
                    : isCompleted 
                      ? 'bg-slate-950/20 border-border/5 text-slate-400 opacity-60' 
                      : 'bg-transparent border-transparent text-slate-500 opacity-40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wider">{p.label}</span>
                </div>
                <div className="text-[10px] font-mono uppercase tracking-widest font-bold">
                  {isCompleted ? 'OK' : isActive ? 'PROCESSANDO...' : 'PENDENTE'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
