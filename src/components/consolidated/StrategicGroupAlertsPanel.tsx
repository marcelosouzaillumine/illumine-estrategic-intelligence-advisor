import React from 'react';
import { AlertCircle } from 'lucide-react';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveHeading } from '../ui/executive-heading';
import { ExecutiveText } from '../ui/executive-typography';

export function StrategicGroupAlertsPanel({ alerts }: { alerts: string[] }) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <ExecutiveSurface className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle size={16} className="text-amber-600 dark:text-amber-400 shrink-0" />
        <ExecutiveHeading as="h3" variant="submoduleTitle" className="uppercase tracking-widest">
          Alertas Estratégicos Ativos
        </ExecutiveHeading>
      </div>
      <div className="space-y-3">
        {alerts.map((alert, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex gap-3 items-start">
            <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
            <ExecutiveText variant="bodyStandard" className="font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
              {alert}
            </ExecutiveText>
          </div>
        ))}
      </div>
    </ExecutiveSurface>
  );
}

