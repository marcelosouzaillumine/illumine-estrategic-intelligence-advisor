import React from 'react';
import { AgentActionMapping } from '@illumine/executive-page-intelligence';
import { Play } from 'lucide-react';

export interface ExecutiveAgentActionMenuProps {
  mappings: AgentActionMapping[];
  onSelectAction?: (agentId: string, actionName: string) => void;
}

export const ExecutiveAgentActionMenu: React.FC<ExecutiveAgentActionMenuProps> = ({
  mappings,
  onSelectAction
}) => {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-sm">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
        Superfície de Interação dos Agentes Executivos
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {mappings.map((item) => (
          <div key={item.agentId} className="rounded-lg bg-slate-950 p-3 border border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-200">{item.domainName} Agent</span>
              <span className="text-[10px] font-mono text-slate-500">{item.agentId}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {item.supportedActions.map((action) => (
                <button
                  key={action}
                  onClick={() => onSelectAction && onSelectAction(item.agentId, action)}
                  className="flex items-center gap-1 rounded bg-slate-800/90 px-2 py-1 text-[11px] text-slate-300 hover:bg-blue-600 hover:text-white transition-colors"
                >
                  <Play className="h-2.5 w-2.5" />
                  <span>{action}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
