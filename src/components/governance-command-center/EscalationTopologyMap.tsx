import React from 'react';
import { useCommandCenter } from '../../context/governance-command-center/GovernanceCommandCenterProvider';

export const EscalationTopologyMap: React.FC = () => {
  const { escalationTopology } = useCommandCenter();

  if (!escalationTopology) {
    return (
      <div className="p-5 bg-slate-950/70 border border-slate-800 rounded-xl text-center text-slate-500 font-mono text-xs">
        CARREGANDO TOPOLOGIA DE ESCALAÇÃO...
      </div>
    );
  }

  const { state, contagionRiskLevel, criticalPropagationChain } = escalationTopology;

  let stateColor = 'text-emerald-400';
  let stateBg = 'bg-emerald-950/20 border-emerald-500/20';

  if (state === 'SYSTEMIC_CONTAGION') {
    stateColor = 'text-rose-400';
    stateBg = 'bg-rose-950/20 border-rose-500/20';
  } else if (state === 'CRITICAL_CHAIN') {
    stateColor = 'text-red-400';
    stateBg = 'bg-red-950/20 border-red-500/20';
  } else if (state === 'PROPAGATING') {
    stateColor = 'text-amber-400';
    stateBg = 'bg-amber-950/20 border-amber-500/20';
  }

  return (
    <div className="p-5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-4">
      <div className="flex justify-between items-center border-b border-slate-850 pb-2">
        <h4 className="text-slate-400 font-semibold tracking-wider uppercase text-xs font-mono">
          Escalation Topology Map
        </h4>
        <span className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase ${stateBg} ${stateColor}`}>
          {state.replace('_', ' ')}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Grafo Topológico Simulado via CSS */}
        <div className="p-4 bg-slate-900/30 border border-slate-850 rounded-xl flex flex-col justify-center space-y-3 min-h-[140px]">
          <span className="text-[9px] font-mono text-slate-500 uppercase block">ACTIVE CONTAGION CHAINS</span>
          <div className="space-y-2">
            {criticalPropagationChain.map((node, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                <span className="text-slate-400">Node:</span>
                <span className="text-slate-200 font-bold">{node}</span>
              </div>
            ))}
            {criticalPropagationChain.length === 0 && (
              <div className="text-xs text-slate-500 font-mono">Nenhuma cadeia ativa de contágio no momento.</div>
            )}
          </div>
        </div>

        {/* Nível de Risco de Contágio */}
        <div className="p-4 bg-slate-900/30 border border-slate-850 rounded-xl flex flex-col justify-between space-y-3">
          <div>
            <span className="text-[9px] font-mono text-slate-500 uppercase block">CONTAGION RISK LEVEL</span>
            <div className="text-2xl font-bold font-mono text-slate-200 mt-1">{contagionRiskLevel}%</div>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${contagionRiskLevel > 70 ? 'bg-rose-500' : contagionRiskLevel > 40 ? 'bg-amber-500' : 'bg-emerald-500'}`}
              style={{ width: `${contagionRiskLevel}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 leading-normal">
            {contagionRiskLevel > 70
              ? 'Risco sistêmico crítico. Múltiplos incidentes interligados propagando contágio.'
              : contagionRiskLevel > 40
              ? 'Risco moderado. Cadeia de dependência contábil sob observação.'
              : 'Fluxo estável de contenção fiduciária ativa.'}
          </p>
        </div>
      </div>
    </div>
  );
};
