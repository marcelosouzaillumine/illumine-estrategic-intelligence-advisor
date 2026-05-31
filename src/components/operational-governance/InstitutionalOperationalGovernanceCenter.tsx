// src/components/operational-governance/InstitutionalOperationalGovernanceCenter.tsx

import React from 'react';
import { InstitutionalOperationalGovernanceOutput } from '../../core/runtime/operational-governance/operational-governance-types';
import { ExecutionIntegrityPanel } from './ExecutionIntegrityPanel';
import { OperationalFrictionMap } from './OperationalFrictionMap';
import { OperationalContinuitySurface } from './OperationalContinuitySurface';
import { InstitutionalDependencyRadar } from './InstitutionalDependencyRadar';
import { StrategicExecutionAlignmentPanel } from './StrategicExecutionAlignmentPanel';
import { OperationalExplainabilityDrawer } from './OperationalExplainabilityDrawer';
import { ShieldCheck, Lock } from 'lucide-react';

interface InstitutionalOperationalGovernanceCenterProps {
  operationalGovernance: InstitutionalOperationalGovernanceOutput;
}

export function InstitutionalOperationalGovernanceCenter({ operationalGovernance }: InstitutionalOperationalGovernanceCenterProps) {
  
  return (
    <div className="space-y-6">
      {/* HEADER SOVERANO */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-3">
            <ShieldCheck className="text-emerald-500" />
            Institutional Operational Governance
          </h2>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
            Infraestrutura soberana de acompanhamento fiduciário da integridade de execução e continuidade operacional da tese institucional.
          </p>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 px-3 py-1.5 rounded-full">
            <Lock size={12} className="text-zinc-400" />
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
              Sovereign Execution Layer
            </span>
          </div>
          <span className="text-[9px] text-zinc-600 font-mono mt-2 uppercase tracking-widest">
            {operationalGovernance.explainability.operationalLineage}
          </span>
        </div>
      </div>

      {/* TOP ROW: Integrity & Continuity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExecutionIntegrityPanel integrity={operationalGovernance.executionIntegrity} />
        <OperationalContinuitySurface continuity={operationalGovernance.continuity} />
      </div>

      {/* MIDDLE ROW: Friction Map & Strategic Alignment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OperationalFrictionMap frictions={operationalGovernance.frictions} />
        <StrategicExecutionAlignmentPanel 
          alignment={operationalGovernance.strategicAlignment} 
          thesis={operationalGovernance.thesis} 
        />
      </div>

      {/* BOTTOM ROW: Dependencies & Explainability */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 h-full">
          <InstitutionalDependencyRadar dependencies={operationalGovernance.dependencies} />
        </div>
        <div className="lg:col-span-2 h-full">
          <OperationalExplainabilityDrawer explainability={operationalGovernance.explainability} />
        </div>
      </div>

    </div>
  );
}
