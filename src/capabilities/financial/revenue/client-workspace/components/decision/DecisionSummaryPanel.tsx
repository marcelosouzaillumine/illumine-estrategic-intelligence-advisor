import React from 'react';

export const DecisionSummaryPanel: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div>
      <h3 className="text-2xl font-semibold mb-6 text-white">Strategic Commitment</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h4 className="text-sm uppercase tracking-widest text-slate-500 font-bold mb-2">Scope & Responsibilities</h4>
          <p className="text-slate-300">Resumo claro do que será entregue e o papel da contratante.</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h4 className="text-sm uppercase tracking-widest text-slate-500 font-bold mb-2">Investment & Timeline</h4>
          <p className="text-slate-300">Mapeamento financeiro e de milestones previamente acordado.</p>
        </div>
      </div>
      
      {/* Questions & Clarifications */}
      <div className="mt-8 bg-blue-900/20 border border-blue-900/50 p-6 rounded-xl">
        <h4 className="text-blue-400 font-bold mb-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span> Questions & Clarifications
        </h4>
        <p className="text-slate-400 text-sm mb-4">Tem alguma dúvida sobre os termos acima? Envie uma nota ao seu Advisor antes de tomar a decisão.</p>
        <textarea className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500" placeholder="Digite sua dúvida..." rows={2}></textarea>
        <button className="mt-2 text-sm text-blue-400 hover:text-blue-300 font-semibold">Send Message</button>
      </div>
    </div>
  );
};
