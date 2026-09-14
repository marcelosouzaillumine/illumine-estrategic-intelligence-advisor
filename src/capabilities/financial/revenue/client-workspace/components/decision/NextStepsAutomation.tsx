import React from 'react';

export const NextStepsAutomation: React.FC = () => {
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/50">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
      </div>
      
      <h3 className="text-3xl font-bold text-white mb-2">Decisão Registrada</h3>
      <p className="text-green-400 mb-8 font-medium">O Acceptance Certificate foi gerado e enviado ao seu e-mail.</p>
      
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 max-w-md mx-auto text-left">
        <h4 className="text-lg font-bold text-white mb-4">Próximos Passos</h4>
        <ul className="space-y-4">
          <li className="flex gap-3">
            <span className="text-blue-500 font-bold">1.</span>
            <span className="text-slate-300">O Onboarding estratégico será agendado em até 24h.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-blue-500 font-bold">2.</span>
            <span className="text-slate-300">O seu Advisor responsável entrará em contato para alinhar acessos.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-blue-500 font-bold">3.</span>
            <span className="text-slate-300">Você já pode acessar o Tenant Inicial com sua identidade atual.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
