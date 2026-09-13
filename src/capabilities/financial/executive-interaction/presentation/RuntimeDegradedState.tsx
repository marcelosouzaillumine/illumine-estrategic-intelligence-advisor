import React from 'react';
import { AlertTriangle, Database } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';

interface RuntimeDegradedStateProps {
  title?: string;
  description?: string;
}

export const RuntimeDegradedState: React.FC<RuntimeDegradedStateProps> = ({
  title,
  description
}) => {
  const { t } = useLanguage();
  const displayTitle = title || t('overlays.degraded_mode') || 'Operação em Modo Degradado';
  const displayDescription = description || t('overlays.degraded_mode_desc') || 'Parte dos módulos analíticos ou históricos está indisponível neste momento. Os resultados atuais refletem apenas dados estruturais correntes, com score de confiança reduzido.';
  return (
    <div className="p-6 bg-warning-soft0/5 border border-amber-500/25 rounded-xl flex items-start gap-4">
      <div className="p-2.5 bg-warning-soft0/10 rounded-xl text-amber-400 border border-amber-500/15">
        <AlertTriangle className="w-5 h-5 animate-pulse" />
      </div>
      <div className="space-y-1">
        <h4 className="text-xs font-black text-amber-450 uppercase tracking-widest">{displayTitle}</h4>
        <p className="text-xs text-muted-foreground leading-relaxed font-medium mt-1">{displayDescription}</p>
        <div className="pt-3 flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
          <Database className="w-3.5 h-3.5" />
          Módulos Offline: [CausalHistoryAdapter, BenchmarkScoringModule]
        </div>
      </div>
    </div>
  );
};
