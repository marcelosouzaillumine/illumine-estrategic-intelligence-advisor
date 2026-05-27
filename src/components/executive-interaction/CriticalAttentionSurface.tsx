import React from 'react';
import { ExecutiveSeverityLevel } from '../../core/runtime/executive-interaction/types';
import { SeveritySemanticEngine } from './SeveritySemanticEngine';
import { ShieldAlert, AlertTriangle, Info, Lock } from 'lucide-react';

interface CriticalAttentionSurfaceProps {
  title: string;
  description: string;
  severity: ExecutiveSeverityLevel;
  children?: React.ReactNode;
}

export const CriticalAttentionSurface: React.FC<CriticalAttentionSurfaceProps> = ({
  title,
  description,
  severity,
  children
}) => {
  const styles = SeveritySemanticEngine.getSeverityStyle(severity);

  const getIcon = () => {
    switch (severity) {
      case 'INFO':
        return <Info className="w-5 h-5 text-blue-400" />;
      case 'ATTENTION':
      case 'WARNING':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'CRITICAL':
        return <ShieldAlert className="w-5 h-5 text-red-400" />;
      case 'LOCKED':
        return <Lock className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div
      className={`p-6 border rounded-xl flex flex-col md:flex-row md:items-start justify-between gap-6 transition-all duration-300 ${styles.bgColor} ${styles.borderColor}`}
      aria-label={styles.accessibilityLabel}
    >
      <div className="flex items-start gap-4">
        <div className={`p-2.5 rounded-xl border border-border/5 ${styles.iconBg} ${styles.textColor}`}>
          {getIcon()}
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">{title}</h4>
          <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
        </div>
      </div>
      {children && (
        <div className="flex-shrink-0 flex items-center justify-end">
          {children}
        </div>
      )}
    </div>
  );
};
