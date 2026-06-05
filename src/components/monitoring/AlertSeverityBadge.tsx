import React from 'react';
import { MonitoringSeverity } from '../../services/FiduciaryRuntimeAdapter';
import { AlertCircle, AlertTriangle, Info, OctagonAlert } from 'lucide-react';

export function AlertSeverityBadge({ severity }: { severity: MonitoringSeverity }) {
  switch (severity) {
    case 'CRITICAL':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20 uppercase">
          <OctagonAlert size={10} /> CRITICAL
        </span>
      );
    case 'HIGH':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/10 text-orange-500 border border-orange-500/20 uppercase">
          <AlertCircle size={10} /> HIGH
        </span>
      );
    case 'WARNING':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase">
          <AlertTriangle size={10} /> WARNING
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20 uppercase">
          <Info size={10} /> INFO
        </span>
      );
  }
}
