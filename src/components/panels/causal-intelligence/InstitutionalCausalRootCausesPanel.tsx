import React from 'react';
import { AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';
import { CausalFactor, CausalSeverity } from '../../../core/runtime/causal-intelligence/types';
import { useLanguage } from '../../../contexts/LanguageContext';

interface RootCausesPanelProps {
  rootCauses?: CausalFactor[];
}

export const InstitutionalCausalRootCausesPanel: React.FC<RootCausesPanelProps> = ({ rootCauses = [] }) => {
  const { t } = useLanguage();
  const getSeverityStyles = (severity: CausalSeverity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'HIGH':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'MODERATE':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2 mb-3">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t('causal.root_causes')}</h4>
        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full border bg-purple-50 text-purple-700 border-purple-200">
          {t('causal.fiduciary')}
        </span>
      </div>

      <div className="space-y-4">
        {rootCauses.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-500 italic">
            {t('causal.no_causes')}
          </div>
        ) : (
          rootCauses.map((factor, idx) => (
            <div key={idx} className="border border-slate-100 rounded-2xl p-4 space-y-3 hover:border-slate-300 transition-all">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <h5 className="text-xs font-bold text-slate-900">{factor.label}</h5>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded border ${getSeverityStyles(factor.severity)}`}>
                      {factor.severity}
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase">
                      {t('causal.confidence')} {(factor.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                {factor.isDefinitive ? (
                  <span className="flex items-center gap-1 text-[9px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-black uppercase border border-emerald-200">
                    <ShieldCheck size={10} /> {t('causal.confirmed')}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[9px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-black uppercase border border-amber-200">
                    <HelpCircle size={10} /> {t('causal.probable')}
                  </span>
                )}
              </div>

              <p className="text-xs font-medium text-slate-600 leading-relaxed">
                {factor.rationale}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
