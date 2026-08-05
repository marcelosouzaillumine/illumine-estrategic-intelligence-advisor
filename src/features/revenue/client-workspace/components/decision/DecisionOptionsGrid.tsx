import React from 'react';

interface DecisionOptionsGridProps {
  onAccept: () => void;
}

export const DecisionOptionsGrid: React.FC<DecisionOptionsGridProps> = ({ onAccept }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-6 text-white text-center">Decision Options</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="flex flex-col items-center justify-center p-6 bg-slate-800 border border-slate-700 rounded-xl hover:border-slate-500 hover:bg-slate-700 transition-colors">
          <span className="text-lg font-bold text-white mb-1">Request Meeting</span>
          <span className="text-xs text-slate-400 text-center">Preciso de um alinhamento adicional</span>
        </button>
        
        <button className="flex flex-col items-center justify-center p-6 bg-slate-800 border border-slate-700 rounded-xl hover:border-slate-500 hover:bg-slate-700 transition-colors">
          <span className="text-lg font-bold text-white mb-1">Request Adjustments</span>
          <span className="text-xs text-slate-400 text-center">Propor alteração de escopo ou prazo</span>
        </button>
        
        <button 
          onClick={onAccept}
          className="flex flex-col items-center justify-center p-6 bg-green-900/30 border border-green-700 rounded-xl hover:border-green-500 hover:bg-green-800/40 transition-colors"
        >
          <span className="text-lg font-bold text-green-400 mb-1">Accept Proposal</span>
          <span className="text-xs text-green-500/70 text-center">Avançar para assinatura digital</span>
        </button>
      </div>
    </div>
  );
};
