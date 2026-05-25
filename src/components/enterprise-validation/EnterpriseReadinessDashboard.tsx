import React from 'react';
import { Rocket } from 'lucide-react';
import { RealDataValidationEngine } from '../../core/runtime/enterprise-validation/RealDataValidationEngine';

export function EnterpriseReadinessDashboard({ tenantId }: { tenantId: string }) {
  const state = RealDataValidationEngine.getValidationState(tenantId);
  if (!state) return null;

  const { readiness } = state;

  return (
    <div className="bg-surface-container border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Rocket className="text-indigo-500" />
        <h3 className="text-lg font-semibold text-foreground">Go-To-Market Readiness</h3>
      </div>
      
      <div className="flex justify-between items-center bg-background border border-border/50 p-6 rounded mb-6">
        <div>
          <span className="text-sm text-muted-foreground block mb-1">Overall Score</span>
          <span className="text-4xl font-bold text-primary">{readiness.overallScore}/100</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1">Status</span>
          <span className="px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded font-bold">{readiness.status}</span>
        </div>
      </div>
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between"><span>Data Validation</span> <span className="font-bold">{readiness.dataPillarScore}%</span></div>
        <div className="flex justify-between"><span>UX Hardening</span> <span className="font-bold">{readiness.uxPillarScore}%</span></div>
        <div className="flex justify-between"><span>Pilot Infrastructure</span> <span className="font-bold">{readiness.pilotPillarScore}%</span></div>
        <div className="flex justify-between"><span>Playbooks</span> <span className="font-bold">{readiness.playbookPillarScore}%</span></div>
        <div className="flex justify-between"><span>Commercial</span> <span className="font-bold">{readiness.commercialPillarScore}%</span></div>
      </div>
    </div>
  );
}
