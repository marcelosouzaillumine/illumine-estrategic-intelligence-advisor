import React from 'react';
import { SimulationIntegrityState } from '../../services/FiduciaryRuntimeAdapter';
import { useLanguage } from '../../contexts/LanguageContext';

interface ForecastIntegrityBadgeProps {
  state: SimulationIntegrityState;
}

export const ForecastIntegrityBadge: React.FC<ForecastIntegrityBadgeProps> = ({ state }) => {
  const { t } = useLanguage();
  let badgeStyles = 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
  let label = t('scenario.integrity.verified');
  let dotColor = 'bg-emerald-500';

  if (state === 'DEGRADED') {
    badgeStyles = 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    label = t('scenario.integrity.degraded');
    dotColor = 'bg-amber-500';
  } else if (state === 'FAIL_CLOSED') {
    badgeStyles = 'bg-rose-500/10 text-rose-500 border-rose-500/20 animate-pulse';
    label = t('scenario.integrity.failClosed');
    dotColor = 'bg-rose-500';
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-mono tracking-widest font-bold ${badgeStyles}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {label}
    </div>
  );
};
