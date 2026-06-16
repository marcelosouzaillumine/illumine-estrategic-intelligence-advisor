import React from 'react';
import { ShieldAlert, FileText, Lock } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface QuarantineModeSurfaceProps {
  reason: string;
  isAccountingFailure: boolean;
  onViewRawData?: () => void;
  mode?: 'STANDARD_QUARANTINE' | 'CONSTITUTIONAL_QUARANTINE';
}

export const QuarantineModeSurface: React.FC<QuarantineModeSurfaceProps> = ({ 
  reason, 
  isAccountingFailure, 
  onViewRawData,
  mode = 'STANDARD_QUARANTINE'
}) => {
  const { t } = useLanguage();
  const isConstitutional = mode === 'CONSTITUTIONAL_QUARANTINE';
  const title = isConstitutional ? 'Quarentena Constitucional Ativa' : 'Quarentena Fiduciária Ativa';
  const subtitle = isConstitutional 
    ? 'O ambiente foi colocado em quarentena constitucional devido à violação das diretrizes fiduciárias soberanas.'
    : 'A renderização do Executive Snapshot e de abas de interpretação foi bloqueada pelo Governance Runtime devido a uma falha crítica de integridade estrutural.';

  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center bg-zinc-950 border border-red-900/50 rounded-xl p-8 font-mono relative overflow-hidden">
      
      {/* Background warning pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
        backgroundImage: 'repeating-linear-gradient(45deg, var(--color-state-critical) 0, var(--color-state-critical) 10px, transparent 10px, transparent 20px)'
      }}></div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-xl w-full">
        <div className="w-16 h-16 bg-red-950/50 rounded-full flex items-center justify-center mb-6 border border-red-900/50">
          <ShieldAlert className="w-8 h-8 text-red-500" />
        </div>
        
        <h2 className="text-xl font-bold text-red-500 uppercase tracking-widest mb-2">
          {title}
        </h2>
        
        <p className="text-red-400/80 mb-6 text-sm">
          {subtitle}
        </p>

        <div className="bg-red-950/30 border border-red-900/30 rounded-lg p-4 mb-8 w-full text-left">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-4 h-4 text-red-500" />
            <span className="text-xs font-bold text-red-400 uppercase tracking-widest">
              {t('snapshot.lock_reason') || 'Motivo do Bloqueio'}
            </span>
          </div>
          <p className="text-zinc-300 text-sm pl-6 border-l-2 border-red-900/50">
            {reason}
          </p>
          
          {isAccountingFailure && (
            <div className="mt-4 pt-4 border-t border-red-900/20 text-xs text-red-400/70 pl-6">
              {t('snapshot.accounting_integrity_failed') || 'Bloqueado por Inconsistência Contábil Estrutural'}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={onViewRawData}
            className="flex items-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-lg text-sm font-bold text-zinc-300 transition-colors uppercase tracking-widest"
          >
            <FileText className="w-4 h-4" />
            {t('boardpack.view_raw_data') || 'Acessar Dados Brutos'}
          </button>
        </div>
      </div>
    </div>
  );
};
