import React from 'react';

import { Network } from 'lucide-react';

interface Props {
  output: any;
}

export function RiskPropagationMap({ output }: Props) {
  
  // Mapeia causal flags emitidas pelo engine
  const opSignals = output.operationalOutput.ebitdaQuality.causalFlags || [];
  const cashSignals = output.cashFlowOutput.cashQuality.causalFlags || [];
  const runwaySignals = output.cashFlowOutput.runway.causalFlags || [];
  const advisorySignals = output.advisory.dominantRisks || [];

  // Constrói um array linear simulando o caminho da propagação
  const propagationPath = [
    ...opSignals.map(s => ({ step: 'Operação', signal: s })),
    ...cashSignals.map(s => ({ step: 'Caixa', signal: s })),
    ...runwaySignals.map(s => ({ step: 'Runway', signal: s })),
    ...advisorySignals.slice(0, 2).map(s => ({ step: 'Advisory (Síntese)', signal: s }))
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mt-8">
      <div className="flex items-center gap-2 mb-6 text-slate-800">
        <Network size={18} className="text-indigo-500" />
        <h2 className="text-sm font-black uppercase tracking-widest">Mapa de Propagação de Risco</h2>
      </div>

      {propagationPath.length === 0 ? (
        <div className="text-sm text-slate-500 italic p-4 bg-slate-50 rounded-lg border border-dashed border-slate-200 text-center">
          Nenhuma propagação de risco detectada neste cenário.
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          {propagationPath.map((item, i) => (
            <React.Fragment key={i}>
              <div className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs">
                <span className="block text-[9px] font-black uppercase text-slate-400 mb-1">{item.step}</span>
                <span className="font-bold text-slate-700">{item.signal}</span>
              </div>
              {i < propagationPath.length - 1 && (
                <div className="text-slate-300">→</div>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
