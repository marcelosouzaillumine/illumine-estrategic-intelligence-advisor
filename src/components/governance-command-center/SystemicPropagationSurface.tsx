import React from 'react';
import { useCommandCenter } from '../../context/governance-command-center/GovernanceCommandCenterProvider';

export const SystemicPropagationSurface: React.FC = () => {
  const { escalationTopology, propagationStatus } = useCommandCenter();

  if (!escalationTopology) {
    return (
      <div className="p-5 bg-slate-950/70 border border-border rounded-xl text-center text-muted-foreground font-mono text-xs">
        CARREGANDO MAPA DE PROPAGAÇÃO SISTÊMICA...
      </div>
    );
  }

  const { state } = escalationTopology;

  return (
    <div className="p-5 bg-slate-950/70 border border-border rounded-xl space-y-4">
      <div className="flex justify-between items-center border-b border-border pb-2">
        <h4 className="text-muted-foreground font-semibold tracking-wider uppercase text-xs font-mono">
          Systemic Exposure & Contagion Flow
        </h4>
        <span className="text-[10px] font-mono text-muted-foreground uppercase">
          PROPAGATION STATE: {propagationStatus}
        </span>
      </div>

      <div className="p-4 bg-slate-900/35 border border-border rounded-xl space-y-3 font-mono text-xs text-muted-foreground">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-muted-foreground">Controladora [Matriz]</span>
          <span className="text-muted-foreground">➔ (Liquidez / Caixa)</span>
          <span className="text-rose-450 font-bold">Varejo & Operações</span>
          <span className="text-muted-foreground">➔ (Suprimentos)</span>
          <span className="text-muted-foreground">Subsidiárias Críticas</span>
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
