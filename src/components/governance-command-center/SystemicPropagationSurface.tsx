import React from 'react';
import { useCommandCenter } from '../../context/governance-command-center/GovernanceCommandCenterProvider';

export const SystemicPropagationSurface: React.FC = () => {
  const { escalationTopology, propagationStatus } = useCommandCenter();

  if (!escalationTopology) {
    return (
      <div className="p-5 bg-slate-950/70 border border-slate-800 rounded-xl text-center text-slate-500 font-mono text-xs">
        CARREGANDO MAPA DE PROPAGAÇÃO SISTÊMICA...
      </div>
    );
  }

  const { state } = escalationTopology;

  return (
    <div className="p-5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-4">
      <div className="flex justify-between items-center border-b border-slate-850 pb-2">
        <h4 className="text-slate-400 font-semibold tracking-wider uppercase text-xs font-mono">
          Systemic Exposure & Contagion Flow
        </h4>
        <span className="text-[10px] font-mono text-slate-500 uppercase">
          PROPAGATION STATE: {propagationStatus}
        </span>
      </div>

      <div className="p-4 bg-slate-900/35 border border-slate-850 rounded-xl space-y-3 font-mono text-xs text-slate-400">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-slate-200">Controladora [Matriz]</span>
          <span className="text-slate-500">➔ (Liquidez / Caixa)</span>
          <span className="text-rose-450 font-bold">Varejo & Operações</span>
          <span className="text-slate-500">➔ (Suprimentos)</span>
          <span className="text-slate-200">Subsidiárias Críticas</span>
        </div>

        <p className="text-[11px] leading-relaxed font-sans mt-2">
          {state === 'SYSTEMIC_CONTAGION'
            ? 'O contágio atingiu nível sistêmico. Bloqueios de liquidez na matriz afetam diretamente os repasses para fornecedores nas subsidiárias, gerando interrupção operacional.'
            : state === 'CRITICAL_CHAIN'
            ? 'A cadeia de contágio está ativa. Fornecedores de varejo estão reportando atrasos decorrentes das diretrizes de preservação de capital na controladora.'
            : 'As cadeias de contágio intercompany permanecem estáveis e contidas nos limites toleráveis do inquilino.'}
        </p>
      </div>
    </div>
  );
};
