import React from 'react';
import { AlertCircle, HelpCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface InstitutionalUnavailableStateProps {
  title?: string;
  description?: string;
  errorCode?: string;
}

export const InstitutionalUnavailableState: React.FC<InstitutionalUnavailableStateProps> = ({
  title,
  description,
  errorCode = 'SEC-RUNTIME-UNAVAILABLE'
}) => {
  const { t } = useLanguage();
  const displayTitle = title || t('modal.unavailable_title');
  const displayDescription = description || t('modal.unavailable_desc');
  return (
    <div className="card-premium p-12 text-center max-w-xl mx-auto space-y-6 border-red-500/10">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center mx-auto border border-red-500/20 shadow-inner">
        <AlertCircle className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h4 className="text-base font-bold text-slate-200 uppercase tracking-wider">{displayTitle}</h4>
        <p className="text-[10px] text-red-400 uppercase tracking-widest font-mono font-bold">{t('modal.unavailable_subtitle')}</p>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed font-medium">
        {displayDescription}
      </p>

      <div className="pt-4 border-t border-border/10 flex justify-between items-center text-[10px] font-mono text-slate-500">
        <span>{t('modal.code')} {errorCode}</span>
        <span className="flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5" /> {t('modal.contact_admin')}
        </span>
      </div>
    </div>
  );
};
