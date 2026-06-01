import React from 'react';
import { ShieldBan, CheckCircle2, Activity, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export interface AccountingIntegrityPanelProps {
  reconciliationStatus: 'PASSED' | 'FAILED' | 'WARNING';
  failedAxes?: string[];
  diffAmount?: number;
  toleranceApplied?: number;
  affectedStatements?: string[];
  fiduciaryWarning?: string;
  recommendedCorrection?: string;
  auditTrail?: string[];
}

export const AccountingIntegrityPanel: React.FC<AccountingIntegrityPanelProps> = ({
  reconciliationStatus,
  failedAxes = [],
  diffAmount,
  toleranceApplied,
  affectedStatements = [],
  fiduciaryWarning,
  recommendedCorrection,
  auditTrail = []
}) => {
  const { t } = useLanguage();

  const isFailed = reconciliationStatus === 'FAILED';
  const isWarning = reconciliationStatus === 'WARNING';
  
  const StatusIcon = isFailed ? ShieldBan : isWarning ? ShieldAlert : CheckCircle2;
  const containerClass = isFailed 
    ? 'bg-rose-950/20 border-rose-900/50' 
    : isWarning 
      ? 'bg-amber-950/20 border-amber-900/50' 
      : 'bg-emerald-950/20 border-emerald-900/50';

  const textClass = isFailed ? 'text-rose-500' : isWarning ? 'text-amber-500' : 'text-emerald-500';

  return (
    <div className={`p-6 rounded-lg border font-mono ${containerClass}`}>
      <div className="flex items-center gap-3 mb-4 border-b border-current/10 pb-3">
        <StatusIcon className={`w-6 h-6 ${textClass}`} />
        <h2 className={`text-sm font-bold uppercase tracking-widest ${textClass}`}>
          {t('snapshot.accounting_integrity') || 'Integridade Contábil Soberana'}
        </h2>
        <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
          isFailed ? 'bg-rose-900/40 text-rose-300' : isWarning ? 'bg-amber-900/40 text-amber-300' : 'bg-emerald-900/40 text-emerald-300'
        }`}>
          {reconciliationStatus}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest opacity-60 block mb-1">
              {t('snapshot.fiduciary_warning') || 'Aviso Fiduciário'}
            </span>
            <p className={`text-sm font-bold ${textClass}`}>
              {fiduciaryWarning || (isFailed ? 'Base Contábil Rejeitada' : 'Base Contábil Validada')}
            </p>
          </div>

          {(failedAxes.length > 0 || affectedStatements.length > 0) && (
            <div className="grid grid-cols-2 gap-4">
              {failedAxes.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest opacity-60 block mb-1">
                    {t('snapshot.failed_axes') || 'Eixos Falhos'}
                  </span>
                  <ul className="text-xs opacity-80 space-y-1">
                    {failedAxes.map((axis, i) => <li key={i}>• {axis}</li>)}
                  </ul>
                </div>
              )}
              {affectedStatements.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest opacity-60 block mb-1">
                    {t('snapshot.affected_statements') || 'Demonstrativos'}
                  </span>
                  <ul className="text-xs opacity-80 space-y-1">
                    {affectedStatements.map((stmt, i) => <li key={i}>• {stmt}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}

          {(diffAmount !== undefined || toleranceApplied !== undefined) && (
            <div className="flex items-center gap-6 bg-black/20 p-3 rounded">
              {diffAmount !== undefined && (
                <div>
                  <span className="text-[9px] uppercase font-bold tracking-widest opacity-50 block">Divergência Detectada</span>
                  <span className="text-sm font-mono">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(diffAmount)}</span>
                </div>
              )}
              {toleranceApplied !== undefined && (
                <div>
                  <span className="text-[9px] uppercase font-bold tracking-widest opacity-50 block">Tolerância Aplicada</span>
                  <span className="text-sm font-mono">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(toleranceApplied)}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4">
          {recommendedCorrection && (
            <div className="bg-black/20 p-3 rounded border border-current/10">
              <span className="text-[10px] uppercase font-bold tracking-widest opacity-60 block mb-1 flex items-center gap-1">
                <Activity size={12} /> {t('snapshot.recommended_correction') || 'Correção Recomendada'}
              </span>
              <p className="text-xs opacity-90">{recommendedCorrection}</p>
            </div>
          )}

          {auditTrail.length > 0 && (
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest opacity-60 block mb-1">
                {t('snapshot.audit_trail') || 'Trilha de Auditoria'}
              </span>
              <div className="h-24 overflow-y-auto bg-black/30 p-2 rounded text-[10px] space-y-1 opacity-70">
                {auditTrail.map((log, i) => (
                  <div key={i} className="border-l-2 border-current/30 pl-2 py-0.5">{log}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
