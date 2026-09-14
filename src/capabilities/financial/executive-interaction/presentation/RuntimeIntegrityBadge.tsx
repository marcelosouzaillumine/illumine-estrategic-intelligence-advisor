import React from 'react';
import { ShieldCheck, ShieldAlert, History } from 'lucide-react';
import { useExecutiveInteraction } from '../../../../context/executive-interaction/ExecutiveInteractionProvider';

export const RuntimeIntegrityBadge: React.FC = () => {
  const { confidenceDisclosure } = useExecutiveInteraction();
  const { lineageIntegrity } = confidenceDisclosure;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
      lineageIntegrity 
        ? 'bg-success-soft0/10 text-emerald-400 border-emerald-500/20' 
        : 'bg-red-500/10 text-red-400 border-red-500/20 animate-pulse'
    }`}>
      {lineageIntegrity ? (
        <>
          <ShieldCheck className="w-3.5 h-3.5" />
          Integridade Confirmada
        </>
      ) : (
        <>
          <ShieldAlert className="w-3.5 h-3.5" />
          Falha de Lineage
        </>
      )}
    </div>
  );
};
