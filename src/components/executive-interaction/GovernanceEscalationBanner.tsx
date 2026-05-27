import React from 'react';
import { useExecutiveInteraction } from '../../context/executive-interaction/ExecutiveInteractionProvider';
import { SeveritySemanticEngine } from './SeveritySemanticEngine';
import { ShieldAlert, AlertTriangle, AlertOctagon } from 'lucide-react';

export const GovernanceEscalationBanner: React.FC = () => {
  const { escalationLevel } = useExecutiveInteraction();

  if (escalationLevel === 'NORMAL') {
    return null;
  }

  const styles = SeveritySemanticEngine.getEscalationStyle(escalationLevel);

  const getIcon = () => {
    switch (escalationLevel) {
      case 'SUPERVISION_REQUIRED':
        return <AlertOctagon className="w-5 h-5 text-yellow-500" />;
      case 'EXECUTIVE_ATTENTION':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'BOARD_CRITICAL':
        return <ShieldAlert className="w-5 h-5 text-red-500 animate-bounce" />;
      default:
        return null;
    }
  };

  const getMessage = () => {
    switch (escalationLevel) {
      case 'SUPERVISION_REQUIRED':
        return 'Alerta: Supervisão fiduciária requerida para esta sessão de trabalho.';
      case 'EXECUTIVE_ATTENTION':
        return 'Importante: Esta pauta requer atenção imediata do comitê executivo.';
      case 'BOARD_CRITICAL':
        return 'Crítico: Convocada intervenção e revisão mandatória pelo Conselho de Administração.';
      default:
        return '';
    }
  };

  return (
    <div
      className={`w-full p-4 border rounded-xl flex items-center justify-between gap-4 transition-all duration-300 ${styles.bannerBg} ${styles.borderColor} ${styles.textColor} ${styles.animationClass}`}
      role="alert"
      aria-label={styles.accessibilityLabel}
    >
      <div className="flex items-center gap-3">
        {getIcon()}
        <div>
          <p className="text-xs font-black uppercase tracking-wider">Escala de Risco: {escalationLevel.replace('_', ' ')}</p>
          <p className="text-sm font-medium mt-0.5 opacity-90">{getMessage()}</p>
        </div>
      </div>
      <div className="text-[10px] uppercase font-mono tracking-widest px-2.5 py-1 bg-slate-950/40 rounded border border-border/10">
        Escalation Level: {escalationLevel}
      </div>
    </div>
  );
};
