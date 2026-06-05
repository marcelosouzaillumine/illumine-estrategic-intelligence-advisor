import React from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { RealDataValidationEngine } from '../../services/FiduciaryRuntimeAdapter';

export function RuntimeIntegrityStatus({ tenantId }: { tenantId: string }) {
  const state = RealDataValidationEngine.getValidationState(tenantId);
  if (!state) return null;

  const { integrity } = state;

  return (
    <div className="bg-surface-container border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        {integrity.status === 'COMPLIANT' ? <CheckCircle2 className="text-emerald-500" /> : <AlertTriangle className="text-rose-500" />}
        <h3 className="text-sm font-semibold text-foreground">Runtime Integrity (Golden Dataset)</h3>
      </div>
      <div className="grid grid-cols-3 gap-3 text-center text-xs">
        <div className={`p-2 rounded border ${integrity.bpConsistency ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-rose-500/10 border-rose-500/30 text-rose-500'}`}>
          <span className="font-bold block mb-1">BP Math</span>
          {integrity.bpConsistency ? 'VALID' : 'INVALID'}
        </div>
        <div className={`p-2 rounded border ${integrity.dreConsistency ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-rose-500/10 border-rose-500/30 text-rose-500'}`}>
          <span className="font-bold block mb-1">DRE Math</span>
          {integrity.dreConsistency ? 'VALID' : 'INVALID'}
        </div>
        <div className={`p-2 rounded border ${integrity.dfcConsistency ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-rose-500/10 border-rose-500/30 text-rose-500'}`}>
          <span className="font-bold block mb-1">DFC Math</span>
          {integrity.dfcConsistency ? 'VALID' : 'INVALID'}
        </div>
      </div>
    </div>
  );
}
