import React from 'react';
import { Target, AlertTriangle, ShieldAlert, Activity, FileKey, ShieldBan } from 'lucide-react';
import { ExecutiveSnapshotSection } from '../../core/runtime/institutional-reporting/institutional-reporting-types';
import { useLanguage } from '../../contexts/LanguageContext';
import { RestrictionBanner } from './RestrictionBanner';
import { AccountingIntegrityPanel } from './AccountingIntegrityPanel';

export function ExecutiveSnapshotSurface({ data }: { data: ExecutiveSnapshotSection }) {
  const { t } = useLanguage();
  const isRestricted = data.isRestricted;

  // STRICT PASSIVITY: Se há restrição, a cor NUNCA pode ser verde/emerald
  const getSafeColor = (baseColor: string, restrictedColor: string = 'text-zinc-500', restrictedBg: string = 'bg-zinc-900/40 border-zinc-800/80') => {
    return isRestricted ? { text: restrictedColor, bg: restrictedBg } : { text: baseColor, bg: 'bg-zinc-900/40 border-zinc-800/80' };
  };

  return (
    <div className={`border p-6 rounded-lg font-mono ${isRestricted ? 'bg-zinc-950 border-amber-900/50' : 'bg-zinc-950 border-zinc-800'}`}>
      <div className="flex justify-between items-start mb-6 border-b border-zinc-800 pb-2">
        <h2 className="text-zinc-400 text-[10px] font-bold tracking-widest uppercase flex items-center gap-2">
          <Target size={14} /> {t('snapshot.title')}
        </h2>
        {data.lineageHash && (
          <div className="flex items-center gap-1 text-[9px] text-zinc-600 font-bold uppercase tracking-widest">
            <FileKey size={10} /> {data.lineageHash}
          </div>
        )}
      </div>
      
      <div className="space-y-6">
        
        {isRestricted && (
          <RestrictionBanner 
            restrictions={data.fiduciaryRestrictions || []}
            restrictionReason={data.restrictionReason}
            restrictionSeverity={data.restrictionSeverity}
            recoveryNarrativeBlocked={data.recoveryNarrativeBlocked}
            confidence={data.trajectoryConfidence}
          />
        )}

        {data.accountingIntegrityStatus === 'FAILED' && (
          <AccountingIntegrityPanel 
            reconciliationStatus="FAILED" 
            fiduciaryWarning={t('snapshot.blocked_accounting_desc')}
          />
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-zinc-900/40 border border-zinc-800/80 p-4 rounded">
            <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block mb-2">{t('snapshot.period_score')}</span>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-bold ${getSafeColor('text-zinc-200', 'text-zinc-500').text}`}>{data.periodScore ?? 'N/A'}</span>
            </div>
            {isRestricted && <span className="text-[9px] text-amber-500/70 block mt-1">{t('snapshot.interpretation_blocked')}</span>}
          </div>
          <div className="bg-zinc-900/40 border border-zinc-800/80 p-4 rounded">
            <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block mb-2">{t('snapshot.longitudinal_score')}</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-zinc-200">{data.longitudinalScore === 'NOT_AVAILABLE' ? 'N/A' : data.longitudinalScore}</span>
            </div>
            <span className="text-[9px] text-zinc-400 block mt-1">{data.longitudinalTrajectory?.replace(/_/g, ' ')}</span>
          </div>
          <div className="bg-zinc-900/40 border border-zinc-800/80 p-4 rounded">
            <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block mb-2">{t('snapshot.stability_index')}</span>
            <span className={`text-sm font-bold uppercase tracking-widest ${data.stabilityIndexClassification === 'STRUCTURALLY_STABLE' && !isRestricted ? 'text-emerald-400' : 'text-zinc-300'}`}>
              {data.stabilityIndexClassification?.replace(/_/g, ' ') || 'N/A'}
            </span>
            <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block mt-2">{t('snapshot.continuity_risk')}</span>
            <span className={`text-[10px] font-bold ${data.continuityRiskLevel === 'CRITICAL' ? 'text-rose-500' : 'text-zinc-400'}`}>{data.continuityRiskLevel || 'N/A'}</span>
          </div>
          <div className="bg-zinc-900/40 border border-zinc-800/80 p-4 rounded">
            <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block mb-2">{t('snapshot.early_warning')}</span>
            <span className={`text-sm font-bold uppercase tracking-widest ${data.earlyWarningLevel === 'STABLE_MONITORING' && !isRestricted ? 'text-emerald-400' : 'text-zinc-300'}`}>
              {data.earlyWarningLevel?.replace(/_/g, ' ') || 'N/A'}
            </span>
          </div>
        </div>

        <div>
          <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block mb-2">{t('snapshot.semantic_thesis')}</span>
          <p className="text-zinc-300 text-sm italic border-l-2 border-zinc-700 pl-3 py-1">
            "{data.unifiedThesisStatement}"
          </p>
        </div>

        <div>
          <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block mb-2">{t('snapshot.executive_summary')}</span>
          <p className="text-zinc-200 text-base leading-relaxed bg-zinc-900/50 p-4 rounded border border-zinc-800/80">
            {data.executiveSummary}
          </p>
        </div>

        {data.rationale && (
          <div>
            <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block mb-2 flex items-center gap-1"><Activity size={10} /> {t('snapshot.rationale')}</span>
            <p className="text-zinc-400 text-xs leading-relaxed bg-zinc-950 p-3 rounded border border-zinc-800/50">
              {data.rationale}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-zinc-800/50">
          <div className={`p-3 rounded border ${data.activeSurvivalMode ? 'bg-rose-950/20 border-rose-900/50' : 'bg-zinc-900/40 border-zinc-800/80'}`}>
            <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block mb-1">{t('snapshot.survival_mode')}</span>
            {/* Override green if restricted */}
            <span className={`text-xs font-bold uppercase tracking-widest ${data.activeSurvivalMode ? 'text-rose-400' : getSafeColor('text-emerald-400').text}`}>
              {data.activeSurvivalMode ? t('snapshot.active') : t('snapshot.inactive')}
            </span>
          </div>

          <div className="p-3 rounded border bg-zinc-900/40 border-zinc-800/80">
            <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block mb-1">{t('snapshot.structural_pressure')}</span>
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-300">
              {data.structuralPressureLevel}
            </span>
          </div>

          <div className={`p-3 rounded border ${data.fiduciaryRestrictionsActive > 0 ? 'bg-orange-950/20 border-orange-900/50' : 'bg-zinc-900/40 border-zinc-800/80'}`}>
            <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block mb-1">{t('snapshot.active_restrictions')}</span>
            <div className="flex items-center gap-2">
              {data.fiduciaryRestrictionsActive > 0 && <AlertTriangle size={12} className="text-orange-500" />}
              <span className={`text-xs font-bold uppercase tracking-widest ${data.fiduciaryRestrictionsActive > 0 ? 'text-orange-400' : 'text-zinc-300'}`}>
                {data.fiduciaryRestrictionsActive} {t('snapshot.detected')}
              </span>
            </div>
          </div>
        </div>
        
        {data.evidenceTrail && data.evidenceTrail.length > 0 && (
          <div className="pt-2">
            <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block mb-2">{t('snapshot.evidence_trail')}</span>
            <ul className="space-y-1">
              {data.evidenceTrail.map((ev, i) => (
                <li key={i} className="text-[10px] text-zinc-500 border-l border-zinc-800 pl-2">{ev}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
