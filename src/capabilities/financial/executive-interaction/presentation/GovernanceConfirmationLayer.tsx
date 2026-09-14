import React, { useState } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';

interface GovernanceConfirmationLayerProps {
  actionLabel: string;
  implications: string;
  onConfirm: () => Promise<void> | void;
  onCancel?: () => void;
}

export const GovernanceConfirmationLayer: React.FC<GovernanceConfirmationLayerProps> = ({
  actionLabel,
  implications,
  onConfirm,
  onCancel
}) => {
  const { translateLabel: t } = useLanguage();
  const [isChecked, setIsChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!isChecked || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onConfirm();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-slate-950/40 border border-border/10 rounded-xl space-y-5">
      <div className="flex gap-3 text-amber-400">
        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-black uppercase tracking-widest">{t("overlays.critical_action_confirmation")}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">{implications}</p>
        </div>
      </div>

      <label className="flex items-start gap-3 cursor-pointer group pt-2 border-t border-border/5">
        <input 
          type="checkbox"
          checked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
          className="mt-0.5 rounded border-border bg-slate-900 text-secondary focus:ring-0 focus:ring-offset-0 w-4 h-4 cursor-pointer"
        />
        <span className="text-xs text-muted-foreground select-none group-hover:text-muted-foreground transition-colors leading-relaxed">
          Declaro estar ciente de que esta deliberação será auditada de forma irreversível nos registros de governança da instituição.
        </span>
      </label>

      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <button 
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-muted-foreground hover:bg-slate-900/40 transition-colors"
          >
            Cancelar
          </button>
        )}
        <button 
          onClick={handleConfirm}
          disabled={!isChecked || isSubmitting}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
            isChecked && !isSubmitting
              ? 'bg-warning-soft0 text-black hover:bg-amber-600'
              : 'bg-slate-900 text-muted-foreground border border-border/5 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? t('overlays.confirming') || 'Confirmando...' : actionLabel}
        </button>
      </div>
    </div>
  );
};
