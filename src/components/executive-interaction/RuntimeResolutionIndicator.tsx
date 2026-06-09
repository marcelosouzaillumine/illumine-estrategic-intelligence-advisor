import React from 'react';
import { ShieldCheck, ShieldAlert, History } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface RuntimeResolutionIndicatorProps {
  lineageHash?: string;
  confidenceLabel?: string;
  lineageIntegrity?: boolean;
  className?: string;
}

export const RuntimeResolutionIndicator: React.FC<RuntimeResolutionIndicatorProps> = ({
  lineageHash,
  confidenceLabel,
  lineageIntegrity = true,
  className = ''
}) => {
  const { t } = useLanguage();
  const finalConfidence = confidenceLabel || t('overlays.high_confidence') || 'Alta';
  
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
        <span className="text-muted-foreground flex items-center gap-1 pt-px border-l border-border/10 pl-3">
          <History className="w-3 h-3" />
          Hash: {lineageHash.substring(0, 8)}
        </span>
      )}

      <span className="text-muted-foreground border-l border-border/10 pl-3">
        Confiança: <strong className="text-muted-foreground">{finalConfidence}</strong>
      </span>
    </div>
  );
};
