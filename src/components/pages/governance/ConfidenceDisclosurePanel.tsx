// src/components/pages/governance/ConfidenceDisclosurePanel.tsx

import React from 'react';
import { ShieldCheck, HelpCircle, AlertCircle, AlertTriangle } from 'lucide-react';
import { EXECUTIVE_SEVERITY_THEME } from './ExecutiveSeverityTheme';
import { useLanguage } from '../../../contexts/LanguageContext';

interface ConfidenceDisclosurePanelProps {
  confidence: 'HIGH' | 'MODERATE' | 'LOW' | 'BLOCKED' | undefined;
  rationaleMap?: Record<string, string>;
  confidenceDecomposition?: Record<string, string>;
}

export function ConfidenceDisclosurePanel({ confidence, rationaleMap, confidenceDecomposition }: ConfidenceDisclosurePanelProps) {
  const { t } = useLanguage();

  const mappedConfidence: 'HEALTHY' | 'ATTENTION' | 'WARNING' | 'CRITICAL' | 'FAIL_CLOSED' = (() => {
    switch (confidence) {
      case 'HIGH':
        return 'HEALTHY';
      case 'MODERATE':
        return 'ATTENTION';
      case 'LOW':
        return 'WARNING';
      case 'BLOCKED':
      default:
        return 'FAIL_CLOSED';
    }
  })();

  const theme = EXECUTIVE_SEVERITY_THEME[mappedConfidence];

  const confidenceLabel = (() => {
    switch (confidence) {
      case 'HIGH':
        return 'HIGH_CONFIDENCE';
      case 'MODERATE':
        return 'MEDIUM_CONFIDENCE';
      case 'LOW':
        return 'LOW_CONFIDENCE';
      case 'BLOCKED':
      default:
        return 'FAIL_CLOSED';
    }
  })();

  const icon = (() => {
    switch (confidence) {
      case 'HIGH':
        return <ShieldCheck className={`w-5 h-5 ${theme.iconColor}`} />;
      case 'MODERATE':
        return <HelpCircle className={`w-5 h-5 ${theme.iconColor}`} />;
      case 'LOW':
        return <AlertTriangle className={`w-5 h-5 ${theme.iconColor}`} />;
      case 'BLOCKED':
      default:
        return <AlertCircle className={`w-5 h-5 ${theme.iconColor}`} />;
    }
  })();

  return (
    <div className={`p-6 rounded-[32px] border ${theme.border} ${theme.bg} ${theme.glow} space-y-4 shadow-xs`}>
      <div className="flex items-center justify-between border-b border-border dark:border-white/5 pb-3">
        <div className="flex items-center gap-3">
          {icon}
          <h3 className={`text-xs font-black uppercase tracking-widest ${theme.text}`}>
            {t('snapshot.confidence_level') || 'Nível de Confiança da Análise'}
          </h3>
        </div>
        <span className={`text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${theme.badge}`}>
          {confidenceLabel}
        </span>
      </div>

      {confidenceDecomposition && Object.keys(confidenceDecomposition).length > 0 && (
        <div className="space-y-3">
          <span className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground dark:text-zinc-500 mb-1">
            Fatores de Decomposição
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(confidenceDecomposition).map(([factor, desc], idx) => (
              <div key={idx} className="p-3.5 bg-slate-50/50 dark:bg-zinc-950/40 border border-border dark:border-zinc-900 rounded-xl flex flex-col gap-1 shadow-xs">
                <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground dark:text-zinc-400">
                  {factor.replace(/_/g, ' ')}
                </span>
                <p className="text-[11px] font-medium text-muted-foreground dark:text-zinc-400 leading-snug">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {rationaleMap && Object.keys(rationaleMap).length > 0 && (
        <div className="space-y-2.5 pt-2 border-t border-border dark:border-white/5">
          <span className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground dark:text-zinc-500">
            Justificativas Executivas
          </span>
          <div className="space-y-2">
            {Object.entries(rationaleMap).map(([key, value], idx) => (
              <div key={idx} className="text-xs font-semibold text-muted-foreground dark:text-zinc-300 leading-relaxed pl-3 border-l-2 border-border dark:border-zinc-800">
                <span className="text-muted-foreground dark:text-zinc-500 font-mono text-[10px] uppercase block mb-0.5">{key}:</span>
                {value}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
