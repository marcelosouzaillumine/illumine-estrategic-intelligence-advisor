import React from 'react';

import { ExecutiveAdvisoryReport } from '../../lib/executive-advisory-engine';
import { Target, AlertTriangle } from 'lucide-react';

interface Props {
  baseAdvisory: ExecutiveAdvisoryReport;
  projectedOutput: any;
}

export function AdvisoryDeltaPanel({ baseAdvisory, projectedOutput }: Props) {
  const projectedAdvisory = projectedOutput.advisory;

  // Simple diff logic
  const newRisks = projectedAdvisory.dominantRisks.filter(r => !baseAdvisory.dominantRisks.includes(r));
  const newActions = projectedAdvisory.actionMatrix.filter(
    pa => !baseAdvisory.actionMatrix.some(ba => ba.acao === pa.acao)
  );

  return (
    <div className="bg-slate-900 border border-border rounded-2xl p-6 shadow-sm text-white h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-black uppercase tracking-widest text-primary">Advisory Delta</h2>
        <span className="text-xs font-bold px-2 py-1 bg-white/10 rounded-md border border-white/10">
          Trust: {projectedAdvisory.confidenceLevel}
        </span>
      </div>

      <div className="flex-1 space-y-6">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Novo Diagnóstico Institucional</h3>
          <p className="text-sm text-muted-foreground italic border-l-2 border-primary pl-3">
            "{projectedAdvisory.institutionalDiagnosis}"
          </p>
        </div>

        {newRisks.length > 0 && (
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-rose-500 flex items-center gap-1 mb-2">
              <AlertTriangle size={12}/> Novos Riscos Dominantes
            </h3>
            <ul className="space-y-1">
              {newRisks.map((risk, i) => (
                <li key={i} className="text-xs text-rose-200 bg-rose-950/30 px-2 py-1 rounded border border-rose-900/50">
                  • {risk}
                </li>
              ))}
            </ul>
          </div>
        )}

        {newActions.length > 0 && (
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-1 mb-2">
              <Target size={12}/> Novas Ações Inseridas
            </h3>
            <ul className="space-y-1">
              {newActions.map((action, i) => (
                <li key={i} className="text-xs text-emerald-200 bg-emerald-950/30 px-2 py-1 rounded border border-emerald-900/50">
                  • {action.acao}
                </li>
              ))}
            </ul>
          </div>
        )}

        {newRisks.length === 0 && newActions.length === 0 && (
          <div className="text-sm text-muted-foreground flex items-center justify-center h-20 border border-dashed border-border rounded-lg">
            Nenhuma divergência crítica identificada no advisory.
          </div>
        )}
      </div>
    </div>
  );
}
