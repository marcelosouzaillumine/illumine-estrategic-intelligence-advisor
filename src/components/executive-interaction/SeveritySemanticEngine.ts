import { ExecutiveSeverityLevel, ExecutiveEscalationLevel } from '../../core/runtime/executive-interaction/types';

interface SeverityStyle {
  bgColor: string;
  textColor: string;
  borderColor: string;
  accentColor: string;
  iconBg: string;
  accessibilityLabel: string;
}

interface EscalationStyle {
  bannerBg: string;
  textColor: string;
  borderColor: string;
  animationClass: string;
  accessibilityLabel: string;
}

export const SeveritySemanticEngine = {
  getSeverityStyle(level: ExecutiveSeverityLevel): SeverityStyle {
    switch (level) {
      case 'INFO':
        return {
          bgColor: 'bg-blue-500/5',
          textColor: 'text-blue-400',
          borderColor: 'border-blue-500/20',
          accentColor: 'text-blue-500',
          iconBg: 'bg-blue-500/10',
          accessibilityLabel: 'Informação Geral de Governança'
        };
      case 'ATTENTION':
        return {
          bgColor: 'bg-indigo-500/5',
          textColor: 'text-indigo-400',
          borderColor: 'border-indigo-500/20',
          accentColor: 'text-indigo-500',
          iconBg: 'bg-indigo-500/10',
          accessibilityLabel: 'Atenção Necessária'
        };
      case 'WARNING':
        return {
          bgColor: 'bg-amber-500/5',
          textColor: 'text-amber-400',
          borderColor: 'border-amber-500/20',
          accentColor: 'text-amber-500',
          iconBg: 'bg-amber-500/10',
          accessibilityLabel: 'Aviso de Governança'
        };
      case 'CRITICAL':
        return {
          bgColor: 'bg-red-500/5',
          textColor: 'text-red-400',
          borderColor: 'border-red-500/20',
          accentColor: 'text-red-500',
          iconBg: 'bg-red-500/10',
          accessibilityLabel: 'Estado Crítico de Risco'
        };
      case 'LOCKED':
        return {
          bgColor: 'bg-slate-900/40',
          textColor: 'text-slate-400',
          borderColor: 'border-slate-800',
          accentColor: 'text-slate-600',
          iconBg: 'bg-slate-950',
          accessibilityLabel: 'Recurso Fiduciário Bloqueado'
        };
      default:
        return {
          bgColor: 'bg-slate-900/10',
          textColor: 'text-slate-400',
          borderColor: 'border-slate-800',
          accentColor: 'text-slate-500',
          iconBg: 'bg-slate-900/20',
          accessibilityLabel: 'Nível Não Mapeado'
        };
    }
  },

  getEscalationStyle(level: ExecutiveEscalationLevel): EscalationStyle {
    switch (level) {
      case 'NORMAL':
        return {
          bannerBg: 'bg-slate-900/20',
          textColor: 'text-slate-400',
          borderColor: 'border-slate-800',
          animationClass: '',
          accessibilityLabel: 'Operação de Governança Normal'
        };
      case 'SUPERVISION_REQUIRED':
        return {
          bannerBg: 'bg-yellow-500/5',
          textColor: 'text-yellow-400',
          borderColor: 'border-yellow-500/20',
          animationClass: 'animate-pulse',
          accessibilityLabel: 'Supervisão Necessária Solicitada pelo Runtime'
        };
      case 'EXECUTIVE_ATTENTION':
        return {
          bannerBg: 'bg-amber-500/5',
          textColor: 'text-amber-400',
          borderColor: 'border-amber-500/20',
          animationClass: 'animate-pulse',
          accessibilityLabel: 'Atenção Executiva Requerida'
        };
      case 'BOARD_CRITICAL':
        return {
          bannerBg: 'bg-red-500/10',
          textColor: 'text-red-400',
          borderColor: 'border-red-500/30',
          animationClass: 'animate-executive-pulse border-red-500/40',
          accessibilityLabel: 'Ação Crítica de Conselho Convocada'
        };
      default:
        return {
          bannerBg: 'bg-slate-900/20',
          textColor: 'text-slate-400',
          borderColor: 'border-slate-800',
          animationClass: '',
          accessibilityLabel: 'Nível Indefinido'
        };
    }
  }
};
