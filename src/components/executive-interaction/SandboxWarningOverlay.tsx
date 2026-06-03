import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { cn } from '../../lib/utils';

interface SandboxWarningOverlayProps {
  className?: string;
  type?: 'demonstrative' | 'sandbox' | 'insufficient_evidence';
  message?: string;
}

export function SandboxWarningOverlay({ className, type = 'demonstrative', message }: SandboxWarningOverlayProps) {
  const { translateLabel: t } = useLanguage();

  return (
    <div className={cn("absolute inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden", className)}>
      {/* Heavy blurred backdrop for deep Sandbox mode */}
      {type === 'sandbox' && (
        <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px]" />
      )}
      
      {/* Warning banner floating */}
      <div className="pointer-events-auto bg-amber-500/10 border border-amber-500/20 shadow-2xl shadow-amber-500/5 backdrop-blur-md px-6 py-4 rounded-2xl flex items-start gap-4 max-w-lg transform -rotate-1 hover:rotate-0 transition-transform duration-300">
        <div className="bg-amber-500/20 p-2 rounded-xl text-amber-500 shrink-0">
          {type === 'insufficient_evidence' ? <Info size={24} /> : <ShieldAlert size={24} />}
        </div>
        <div>
          <h3 className="text-sm font-black text-amber-500 uppercase tracking-widest mb-1">
            {type === 'sandbox' ? t('overlays.sandbox.title') : 
             type === 'insufficient_evidence' ? t('overlays.insufficient.title') : 
             t('overlays.demonstrative.title')}
          </h3>
          <p className="text-xs font-medium text-amber-500/80 leading-relaxed">
            {message || (
              type === 'sandbox' ? t('overlays.sandbox.desc') : 
              type === 'insufficient_evidence' ? t('overlays.insufficient.desc') : 
              t('overlays.demonstrative.desc')
            )}
          </p>
        </div>
      </div>

      {/* Watermark across the background */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] overflow-hidden mix-blend-overlay">
        <span className="text-[120px] font-black uppercase tracking-[0.5em] text-amber-500 -rotate-12 whitespace-nowrap select-none">
          {type === 'sandbox' ? 'SANDBOX' : 'DEMO MODE'}
        </span>
      </div>
    </div>
  );
}
