import React from 'react';
import { useExecutiveInteraction } from '../../context/executive-interaction/ExecutiveInteractionProvider';
import { ShieldAlert, AlertOctagon, Lock } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const InstitutionalBlockingDialog: React.FC = () => {
  const { interactionState } = useExecutiveInteraction();
  const { t } = useLanguage();

  if (interactionState !== 'BLOCKED' && interactionState !== 'FAIL_CLOSED') {
    return null;
  }

  const isFailClosed = interactionState === 'FAIL_CLOSED';

  return (
    <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-lg z-[99999] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="max-w-md w-full card-premium p-8 text-center space-y-6 border-red-500/20 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center mx-auto border border-red-500/20 shadow-inner">
          {isFailClosed ? (
            <ShieldAlert className="w-8 h-8 animate-pulse" />
          ) : (
            <Lock className="w-8 h-8" />
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-bold text-slate-200 uppercase tracking-wider">
            {isFailClosed ? t('modal.blocked_title_fail') : t('modal.blocked_title_restricted')}
          </h3>
          <p className="text-xs text-red-400 uppercase tracking-widest font-mono">
            {isFailClosed ? t('modal.blocked_subtitle_fail') : t('modal.blocked_subtitle_restricted')}
          </p>
        </div>

        <p className="text-sm text-slate-400 leading-relaxed font-medium">
          {isFailClosed ? t('modal.blocked_desc_fail') : t('modal.blocked_desc_restricted')}
        </p>

        <div className="pt-4 border-t border-border/10">
          <span className="text-[10px] text-slate-500 font-mono">
            {t('modal.security_status_code')} {interactionState}
          </span>
        </div>
      </div>
    </div>
  );
};
