import React from 'react';
import { AlertOctagon } from 'lucide-react';
import { useExecutiveInteraction } from '../../context/executive-interaction/ExecutiveInteractionProvider';

export const MissingDependencyAlert: React.FC = () => {
  const { confidenceDisclosure } = useExecutiveInteraction();
  const { missingDependencies } = confidenceDisclosure;

  if (!missingDependencies || missingDependencies.length === 0) {
    return null;
  }

  return (
    <div className="p-5 bg-red-500/5 border border-red-500/25 rounded-xl flex items-start gap-4">
      <div className="p-2 bg-red-500/10 rounded-lg text-red-400 border border-red-500/15">
        <AlertOctagon className="w-5 h-5 animate-pulse" />
      </div>
      <div className="space-y-1">
        <h4 className="text-xs font-black text-red-400 uppercase tracking-widest">Dependências do Runtime Indisponíveis</h4>
        <p className="text-xs text-slate-400 leading-relaxed">
          Os seguintes datasets fiduciários estão ausentes ou corrompidos, impedindo o processamento completo:
        </p>
        <ul className="list-disc list-inside text-xs font-mono text-red-300 mt-2 space-y-1">
          {missingDependencies.map((dep, idx) => (
            <li key={idx}>{dep}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
