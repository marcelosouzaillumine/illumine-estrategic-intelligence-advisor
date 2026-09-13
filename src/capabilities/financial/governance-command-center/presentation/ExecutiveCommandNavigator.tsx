import React from 'react';
import { useCommandCenter } from '../../../../context/governance-command-center/GovernanceCommandCenterProvider';
import { GovernanceSupervisionMode } from '../../../../services/FiduciaryRuntimeAdapter';

export const ExecutiveCommandNavigator: React.FC = () => {
  const { supervisionMode, switchSupervisionMode } = useCommandCenter();

  const modes: Array<{ value: GovernanceSupervisionMode; label: string; desc: string }> = [
    { value: 'EXECUTIVE', label: 'Executive Cockpit', desc: 'Visão geral da operação diária.' },
    { value: 'CFO', label: 'CFO Supervision', desc: 'Foco em liquidez, funding e caixa.' },
    { value: 'BOARD', label: 'Board Oversight', desc: 'Decisões societárias e riscos sistêmicos.' },
    { value: 'ADVISORY', label: 'Advisory Panel', desc: 'Análise de recomendações históricas.' }
  ];

  return (
    <div className="p-5 bg-slate-950/70 border border-border rounded-xl space-y-4">
      <div className="flex justify-between items-center border-b border-border pb-2">
        <h4 className="text-muted-foreground font-semibold tracking-wider uppercase text-xs font-mono">
          Supervision Command Scope
        </h4>
        <span className="text-[10px] font-mono text-muted-foreground uppercase">
          ROLE SWITCHER
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {modes.map((m) => {
          const isActive = supervisionMode === m.value;
          return (
            <button
              key={m.value}
              onClick={() => switchSupervisionMode(m.value)}
              className={`p-3 border rounded-xl text-left transition-all hover:border-border active:scale-[0.98] flex flex-col gap-1 ${
                isActive
                  ? 'border-cyan-500 bg-cyan-950/20 text-cyan-400'
                  : 'border-border bg-slate-900/40 text-muted-foreground hover:text-muted-foreground'
              }`}
            >
              <span className="text-xs font-mono font-bold">{m.label}</span>
              <span className="text-[9px] opacity-80 leading-normal font-sans">{m.desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
