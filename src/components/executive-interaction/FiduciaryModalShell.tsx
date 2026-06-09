import React, { useEffect } from 'react';
import { X, ShieldAlert, History, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ExecutiveModalPriority } from '../../services/FiduciaryRuntimeAdapter';

interface FiduciaryModalShellProps {
  isOpen: boolean;
  title: string;
  priority: ExecutiveModalPriority;
  lineageHash?: string;
  onClose: () => void;
  onConfirm?: () => Promise<void> | void;
  children: React.ReactNode;
}

export const FiduciaryModalShell: React.FC<FiduciaryModalShellProps> = ({
  isOpen,
  title,
  priority,
  lineageHash,
  onClose,
  onConfirm,
  children
}) => {
  const { translateLabel: t } = useLanguage();
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isFiduciary = priority === 'FIDUCIARY';
  const isHigh = priority === 'HIGH' || isFiduciary;

  // Block close clickouts for FIDUCIARY modals
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      if (!isFiduciary) {
        onClose();
      }
    }
  };

  const getPriorityClasses = () => {
    switch (priority) {
      case 'FIDUCIARY':
        return 'border-red-500/30 shadow-red-950/20';
      case 'HIGH':
        return 'border-amber-500/30 shadow-amber-950/10';
      case 'MEDIUM':
        return 'border-primary shadow-indigo-950/5';
      case 'LOW':
      default:
        return 'border-border/10';
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-[10000] flex items-center justify-center p-4 backdrop-blur-md transition-all duration-300 ${
        isFiduciary ? 'bg-slate-950/90' : 'bg-background/80'
      }`}
      onClick={handleBackdropClick}
    >
      <div 
        className={`w-full max-w-lg card-premium p-8 flex flex-col justify-between overflow-hidden relative border ${getPriorityClasses()} max-h-[90vh]`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex justify-between items-start pb-4 border-b border-border/10">
          <div className="space-y-1">
            {isFiduciary && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xl text-[9px] font-black uppercase tracking-widest bg-red-500/10 text-red-400 border border-red-500/20">
                <ShieldAlert className="w-3.5 h-3.5" />
                Implicação Fiduciária Mandatória
              </span>
            )}
            <h3 id="modal-title" className="text-base md:text-lg font-bold text-muted-foreground uppercase tracking-wider">{title}</h3>
          </div>
          
          {!isFiduciary && (
            <button 
              onClick={onClose} 
              className="p-1 rounded-lg text-muted-foreground hover:text-muted-foreground hover:bg-slate-900/40 transition-colors"
              aria-label={t('overlays.close') || 'Close'}
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-6 space-y-4 text-sm text-muted-foreground leading-relaxed font-medium">
          {isFiduciary && (
            <div className="p-4 bg-red-500/5 border border-red-500/25 rounded-xl text-red-400 text-xs flex gap-3">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <div>
                <span className="font-bold uppercase tracking-wider block">{t("overlays.audit_legal_notice")}</span>
                Esta deliberação fiduciária é registrada no audit trail com criptografia irreversível. Ação irrevogável.
              </div>
            </div>
          )}
          {children}
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-border/10 flex flex-col gap-4">
          {lineageHash && (
            <div className="text-[10px] font-mono text-muted-foreground flex items-center gap-1.5">
              <History className="w-3.5 h-3.5" />
              Audit Trail Hash: {lineageHash}
            </div>
          )}
          
          <div className="flex justify-end gap-3">
            {!isFiduciary && (
              <button 
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-muted-foreground bg-transparent border border-border/10 hover:bg-slate-900/50 transition-colors"
              >
                Cancelar
              </button>
            )}
            {onConfirm && (
              <button 
                onClick={async () => {
                  await onConfirm();
                  onClose();
                }}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                  isFiduciary 
                    ? 'bg-red-500 text-white hover:bg-red-650' 
                    : isHigh 
                      ? 'bg-amber-500 text-black hover:bg-amber-600' 
                      : 'bg-accent text-white hover:bg-accent'
                }`}
              >
                Confirmar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
