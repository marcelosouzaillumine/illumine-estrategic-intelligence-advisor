import React from 'react';
import { ShieldCheck, ShieldAlert, History } from 'lucide-react';

interface RuntimeResolutionIndicatorProps {
  lineageHash?: string;
  confidenceLabel?: string;
  lineageIntegrity?: boolean;
  className?: string;
}

export const RuntimeResolutionIndicator: React.FC<RuntimeResolutionIndicatorProps> = ({
  lineageHash,
  confidenceLabel = 'Alta',
  lineageIntegrity = true,
  className = ''
}) => {
  return (
    <div className={`inline-flex items-center gap-3 bg-slate-950/40 border border-border/10 rounded-xl px-4 py-2 text-[10px] font-mono uppercase tracking-widest ${className}`}>
      {lineageIntegrity ? (
        <span className="flex items-center gap-1 text-emerald-400 font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          Fiduciário
        </span>
      ) : (
        <span className="flex items-center gap-1 text-red-400 font-bold animate-pulse">
          <ShieldAlert className="w-3.5 h-3.5" />
          Desprotegido
        </span>
      )}
      
      {lineageHash && (
        <span className="text-slate-500 flex items-center gap-1 pt-px border-l border-border/10 pl-3">
          <History className="w-3 h-3" />
          Hash: {lineageHash.substring(0, 8)}
        </span>
      )}

      <span className="text-slate-500 border-l border-border/10 pl-3">
        Confiança: <strong className="text-slate-350">{confidenceLabel}</strong>
      </span>
    </div>
  );
};
