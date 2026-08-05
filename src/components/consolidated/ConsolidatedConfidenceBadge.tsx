import React from 'react';
import { RuntimeConfidence } from '../../runtime/types';
import { ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ExecutiveText } from '../ui/executive-typography';
import { useLanguage } from '../../contexts/LanguageContext';

export function ConsolidatedConfidenceBadge({ confidence }: { confidence: RuntimeConfidence }) {
  const { t } = useLanguage();
  const isHigh = confidence === 'HIGH';
  const isMedium = confidence === 'MEDIUM';
  
  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-1.5 rounded-full border w-fit",
      isHigh ? "bg-success-soft text-emerald-700 dark:text-emerald-400 border-emerald-500/20" :
      isMedium ? "bg-warning-soft text-amber-700 dark:text-amber-400 border-amber-500/20" :
      "bg-critical-soft text-rose-700 dark:text-rose-400 border-rose-500/20"
    )}>
      {isHigh && <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />}
      {isMedium && <AlertTriangle size={14} className="text-amber-600 dark:text-amber-400 shrink-0" />}
      {!isHigh && !isMedium && <ShieldAlert size={14} className="text-rose-600 dark:text-rose-400 shrink-0" />}
      <ExecutiveText variant="caption" className="font-bold uppercase tracking-widest text-current">
        {t('executive:confidenceLevel')}: {t(`executive:confidence.${confidence.toLowerCase()}`)}
      </ExecutiveText>
    </div>
  );
}

