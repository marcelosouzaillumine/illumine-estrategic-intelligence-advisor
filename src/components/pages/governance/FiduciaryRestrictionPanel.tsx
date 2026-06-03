// src/components/pages/governance/FiduciaryRestrictionPanel.tsx

import React from 'react';
import { AlertOctagon, ShieldAlert, KeyRound, Lock } from 'lucide-react';
import { FiduciaryRestriction, ReportGenerationStatus } from '../../../core/runtime/institutional-reporting/institutional-reporting-types';
import { EXECUTIVE_SEVERITY_THEME } from './ExecutiveSeverityTheme';
import { useLanguage } from '../../../contexts/LanguageContext';

interface FiduciaryRestrictionPanelProps {
  restrictions: FiduciaryRestriction[];
  status: ReportGenerationStatus;
  quarantineReason?: string;
}

export function FiduciaryRestrictionPanel({ restrictions, status, quarantineReason }: FiduciaryRestrictionPanelProps) {
  const { t } = useLanguage();

  const isRestricted = status === 'RESTRICTED' || status === 'CONSTITUTIONAL_QUARANTINE' || status === 'FAILED';
  
  if (!isRestricted && (!restrictions || restrictions.length === 0)) {
    return (
      <div className={`p-6 rounded-2xl border ${EXECUTIVE_SEVERITY_THEME.HEALTHY.border} ${EXECUTIVE_SEVERITY_THEME.HEALTHY.bg} ${EXECUTIVE_SEVERITY_THEME.HEALTHY.glow} flex items-center gap-4`}>
        <div className={`p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400`}>
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400">{t('snapshot.no_restrictions') || 'Nenhuma Restrição Ativa'}</h4>
          <p className="text-[10px] text-emerald-300/70 mt-1 uppercase tracking-widest">{t('snapshot.governance_intact') || 'Linhagem e regras de integridade 100% validadas.'}</p>
        </div>
      </div>
    );
  }

  const theme = status === 'FAILED' || status === 'CONSTITUTIONAL_QUARANTINE'
    ? EXECUTIVE_SEVERITY_THEME.FAIL_CLOSED
    : EXECUTIVE_SEVERITY_THEME.WARNING;

  return (
    <div className={`p-6 rounded-[32px] border ${theme.border} ${theme.bg} ${theme.glow} space-y-4 shadow-xs`}>
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-white/5 pb-3">
        <AlertOctagon className={`w-5 h-5 ${theme.iconColor}`} />
        <h3 className={`text-xs font-black uppercase tracking-widest ${theme.text}`}>
          {status === 'CONSTITUTIONAL_QUARANTINE' 
            ? (t('snapshot.constitutional_quarantine') || 'Quarentena Constitucional Ativa') 
            : (t('snapshot.active_restrictions') || 'Restrições Fiduciárias Ativas')}
        </h3>
      </div>

      {quarantineReason && (
        <div className="p-4 rounded-xl bg-red-50/50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/30 font-mono text-[10px] text-red-800 dark:text-red-300">
          <span className="font-bold block uppercase tracking-wider mb-1">Motivo de Quarentena:</span>
          <span>{quarantineReason}</span>
        </div>
      )}

      <div className="space-y-3">
        {restrictions.map((restriction, idx) => (
          <div key={idx} className="p-4 bg-slate-50/50 dark:bg-zinc-950/50 border border-slate-200 dark:border-zinc-800/80 rounded-xl flex items-start gap-3 transition-colors hover:border-slate-300 dark:hover:border-zinc-800 shadow-xs">
            <div className="p-2 bg-slate-100 dark:bg-zinc-900 rounded-lg text-slate-500 dark:text-zinc-500 shrink-0 mt-0.5">
              {restriction.restrictionType === 'FAIL_CLOSED' ? <Lock className="w-3.5 h-3.5 text-red-650 dark:text-red-400" /> : <KeyRound className="w-3.5 h-3.5" />}
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                {restriction.restrictionType.replace(/_/g, ' ')}
              </span>
              <p className="text-xs font-semibold text-slate-700 dark:text-zinc-300 leading-snug">
                {restriction.description}
              </p>
              {restriction.affectedRuntimes && restriction.affectedRuntimes.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1.5">
                  {restriction.affectedRuntimes.map((runtime, rIdx) => (
                    <span key={rIdx} className="text-[8px] font-bold font-mono uppercase tracking-widest px-2 py-0.5 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-550 dark:text-zinc-550 rounded">
                      {runtime}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
