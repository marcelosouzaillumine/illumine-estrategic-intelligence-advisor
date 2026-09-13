import React from 'react';
import { Database, TrendingUp } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';

interface InsufficientEvidenceStateProps {
  title?: string;
  description?: string;
}

export const InsufficientEvidenceState: React.FC<InsufficientEvidenceStateProps> = ({
  title,
  description
}) => {
  const { t } = useLanguage();
  const displayTitle = title || t('overlays.insufficient_data_history') || 'Histórico de Dados Insuficiente';
  const displayDescription = description || 'O motor analítico requer ao menos 3 meses de lançamentos contábeis e transações homologadas para computar tendências causais e score de exposição de risco.';
  return (
    <div className="card-premium p-10 text-center max-w-xl mx-auto space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-primary text-primary flex items-center justify-center mx-auto border border-primary shadow-inner">
        <Database className="w-8 h-8" />
      </div>

      <div className="space-y-1">
        <h4 className="text-base font-bold text-muted-foreground uppercase tracking-wider">{displayTitle}</h4>
        <p className="text-[10px] text-insight uppercase tracking-widest font-mono font-bold">{t("overlays.awaiting_transactional_volume")}</p>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed font-medium">
        {displayDescription}
      </p>

      <div className="pt-4 border-t border-border/10 flex justify-center gap-6 text-[10px] text-muted-foreground font-mono">
        <span className="flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5" /> Requisito: Mínimo 3 Meses
        </span>
      </div>
    </div>
  );
};
