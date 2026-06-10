// src/components/pilot-operations/PilotOperationalHealthCard.tsx

import React from 'react';
import { usePilotOperations } from '../../context/pilot-operations/PilotOperationsProvider';
import { ShieldCheck, AlertTriangle, Play, RotateCcw, Power } from 'lucide-react';
import { PilotTenantStatus } from '../../services/FiduciaryRuntimeAdapter';

export const PilotOperationalHealthCard: React.FC = () => {
  const { pilotStatus, operationalHealth, updatePilotStatus, resetPilot } = usePilotOperations();

  const healthColors = {
    HEALTHY: 'text-emerald-500 bg-success-soft0/10 border-emerald-500/25',
    PARTIAL: 'text-amber-500 bg-warning-soft0/10 border-amber-500/25',
    DEGRADED: 'text-rose-500 bg-critical-soft0/10 border-rose-500/25',
    FAIL_CLOSED: 'text-rose-600 bg-rose-950/20 border-rose-600/30 animate-pulse'
  };

  const statusOptions: { value: PilotTenantStatus; label: string }[] = [
    { value: 'ONBOARDING', label: 'Onboarding' },
    { value: 'ACTIVE', label: 'Active Pilot' },
    { value: 'DEGRADED', label: 'Degraded State' },
    { value: 'SUPERVISION_REQUIRED', label: 'Supervision Required' },
    { value: 'FAIL_CLOSED', label: 'Fail Closed' },
    { value: 'ARCHIVED', label: 'Archived' }
  ];

  return (
    <div className="card-premium p-6 space-y-5 relative overflow-hidden group hover:border-secondary/20 transition-all duration-300">
      <div className="flex justify-between items-center border-b border-border/40 pb-3">
        <span className="text-[10px] font-mono font-bold tracking-widest text-secondary uppercase block">PILOT ENVIRONMENT STATUS</span>
        <div className={`px-2.5 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider ${healthColors[operationalHealth]}`}>
          {operationalHealth.replace('_', ' ')}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-2xl font-bold font-mono tracking-tight text-foreground">
            {pilotStatus.replace('_', ' ')}
          </h4>
          <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
            {pilotStatus === 'FAIL_CLOSED' 
              ? 'ALERTA DE SEGURANÇA: O ambiente foi forçado ao isolamento fiduciário. Métricas e formulários estão bloqueados.'
              : 'O status indica o atual estágio operacional do inquilino assistido.'}
          </p>
        </div>

        {/* Change status actions */}
        <div className="space-y-2">
          <span className="text-[9px] font-mono font-black text-muted-foreground uppercase tracking-widest block">SUPERVISION CONTROLS</span>
          <div className="grid grid-cols-2 gap-2">
            <select
              value={pilotStatus}
              onChange={(e) => updatePilotStatus(e.target.value as PilotTenantStatus)}
              className="px-2.5 py-1.5 bg-background border border-border text-foreground rounded-lg font-mono text-[10px] font-bold tracking-wider outline-none cursor-pointer"
            >
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value} className="bg-card text-foreground">{opt.label}</option>
              ))}
            </select>

            <button
              onClick={resetPilot}
              className="py-1.5 px-3 bg-surface-container hover:bg-surface-container-high border border-border text-[9px] font-mono font-black uppercase tracking-widest rounded-lg flex items-center justify-center gap-1.5 text-muted-foreground hover:text-secondary transition-colors"
            >
              <RotateCcw size={10} />
              Reset Pilot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
