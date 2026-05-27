import React from 'react';
import { Info, AlertTriangle, ShieldAlert, Lock, AlertOctagon } from 'lucide-react';
import { ExecutiveSeverityLevel } from '../../core/runtime/executive-interaction/types';
import { SeveritySemanticEngine } from './SeveritySemanticEngine';

interface ExecutiveSeverityBadgeProps {
  level: ExecutiveSeverityLevel;
  className?: string;
}

export const ExecutiveSeverityBadge: React.FC<ExecutiveSeverityBadgeProps> = ({ level, className = '' }) => {
  const styles = SeveritySemanticEngine.getSeverityStyle(level);
  
  const getIcon = () => {
    switch (level) {
      case 'INFO':
        return <Info className="w-3.5 h-3.5" />;
      case 'ATTENTION':
        return <AlertTriangle className="w-3.5 h-3.5" />;
      case 'WARNING':
        return <AlertOctagon className="w-3.5 h-3.5" />;
      case 'CRITICAL':
        return <ShieldAlert className="w-3.5 h-3.5" />;
      case 'LOCKED':
        return <Lock className="w-3.5 h-3.5" />;
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border ${styles.bgColor} ${styles.textColor} ${styles.borderColor} ${className}`}
      aria-label={styles.accessibilityLabel}
      title={styles.accessibilityLabel}
    >
      {getIcon()}
      {level}
    </span>
  );
};
