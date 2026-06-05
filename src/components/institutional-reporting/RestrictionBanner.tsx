import React from 'react';
import { ShieldAlert, AlertTriangle, ShieldBan } from 'lucide-react';
import { FiduciaryRestriction } from '../../services/FiduciaryRuntimeAdapter';
import { useLanguage } from '../../contexts/LanguageContext';

export interface RestrictionBannerProps {
  restrictions: FiduciaryRestriction[];
  restrictionReason?: string;
  restrictionSeverity?: 'INFO' | 'WARNING' | 'HIGH' | 'CRITICAL' | 'BLOCKED';
  recoveryNarrativeBlocked?: boolean;
  confidence?: 'HIGH' | 'MODERATE' | 'LOW' | 'BLOCKED';
}

export const RestrictionBanner: React.FC<RestrictionBannerProps> = ({
  restrictions,
  restrictionReason,
  restrictionSeverity = 'INFO',
  recoveryNarrativeBlocked,
  confidence
}) => {
  const { t } = useLanguage();

  if (restrictions.length === 0 && !restrictionReason) return null;

  const severityStyles = {
    INFO: 'bg-blue-950/20 border-blue-900/50 text-blue-500',
    WARNING: 'bg-amber-950/20 border-amber-900/50 text-amber-500',
    HIGH: 'bg-orange-950/20 border-orange-900/50 text-orange-500',
    CRITICAL: 'bg-rose-950/20 border-rose-900/50 text-rose-500',
    BLOCKED: 'bg-zinc-950 border-red-900/80 text-red-500'
  };

  const Icon = restrictionSeverity === 'BLOCKED' ? ShieldBan : restrictionSeverity === 'CRITICAL' ? ShieldAlert : AlertTriangle;

  return (
    <div className={`p-4 rounded-lg border font-mono mb-6 flex items-start gap-4 ${severityStyles[restrictionSeverity]}`}>
      <Icon className="w-6 h-6 mt-1 flex-shrink-0" />
      <div className="flex-1">
        <h3 className="text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
          {t('snapshot.active_fiduciary_restriction') || 'Restrição Fiduciária Ativa'}
          {restrictionSeverity === 'BLOCKED' && <span className="px-2 py-0.5 bg-red-900/40 text-red-400 rounded text-[9px]">BLOCK</span>}
        </h3>
        
        {restrictionReason && (
          <p className="text-sm opacity-90 mb-3 border-l-2 border-current pl-3 py-1">
            {restrictionReason}
          </p>
        )}

        <div className="grid grid-cols-2 gap-4 text-[10px] uppercase font-bold tracking-widest opacity-80 mt-2">
          <div>
            {t('snapshot.recovery_narrative') || 'Narrativa de Recuperação'}: 
            <span className={recoveryNarrativeBlocked ? 'text-rose-400 ml-2' : 'text-emerald-400 ml-2'}>
              {recoveryNarrativeBlocked ? 'BLOCKED' : 'ALLOWED'}
            </span>
          </div>
          <div>
            {t('snapshot.trajectory_confidence') || 'Confiança na Trajetória'}: 
            <span className="ml-2">{confidence || 'UNKNOWN'}</span>
          </div>
        </div>

        {restrictions.length > 0 && (
          <div className="mt-4 pt-3 border-t border-current/20">
            <span className="text-[9px] uppercase tracking-widest opacity-70 mb-2 block">{t('snapshot.restriction_details') || 'Detalhes da Restrição'}</span>
            <ul className="space-y-2">
              {restrictions.map((r, idx) => (
                <li key={idx} className="text-xs opacity-80 flex items-start gap-2">
                  <span className="mt-1 opacity-50">•</span>
                  <span>{r.description} <span className="opacity-50 ml-1">({r.restrictionType})</span></span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
