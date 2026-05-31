// src/components/institutional-reporting/InstitutionalBoardPackCenter.tsx

import React from 'react';
import { FileText, AlertTriangle } from 'lucide-react';
import { InstitutionalBoardPackOutput } from '../../core/runtime/institutional-reporting/institutional-reporting-types';

import { ExecutiveSnapshotSurface } from './ExecutiveSnapshotSurface';
import { GovernanceReportingSurface } from './GovernanceReportingSurface';
import { StrategicDirectionSurface } from './StrategicDirectionSurface';
import { TreasuryPressureSurface } from './TreasuryPressureSurface';
import { ContinuityReportingSurface } from './ContinuityReportingSurface';
import { OperationalGovernanceSurface } from './OperationalGovernanceSurface';
import { ExecutiveDirectiveSurface } from './ExecutiveDirectiveSurface';
import { ExplainabilityAppendixDrawer } from './ExplainabilityAppendixDrawer';
import { LineageAppendixDrawer } from './LineageAppendixDrawer';
import { BoardPackExportPanel } from './BoardPackExportPanel';

export function InstitutionalBoardPackCenter({ boardPack }: { boardPack: InstitutionalBoardPackOutput }) {
  
  if (boardPack.status === 'FAILED') {
    return (
      <div className="p-8 bg-rose-950/20 border border-rose-900/50 rounded-lg flex flex-col items-center justify-center text-center">
        <AlertTriangle size={48} className="text-rose-500 mb-4" />
        <h2 className="text-rose-400 font-bold uppercase tracking-widest text-lg mb-2">Fiduciary Report Generation Failed</h2>
        <p className="text-rose-300/80 font-mono text-sm max-w-lg">
          {boardPack.disclosures[0]?.statement || 'Unknown fiduciary error prevented report generation.'}
        </p>
      </div>
    );
  }

  const isRestricted = boardPack.status === 'RESTRICTED';

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <FileText className="text-blue-500" />
            Institutional Board Pack
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-zinc-400 text-sm font-mono">{isRestricted ? 'Restricted Institutional Report' : 'Sovereign Executive Reporting Layer'}</span>
            <span className="text-[10px] bg-zinc-900 text-zinc-500 px-2 py-0.5 rounded uppercase tracking-widest font-bold">
              Cycle: {boardPack.metadata.cycleReference}
            </span>
          </div>
        </div>
      </div>

      {boardPack.disclosures.length > 0 && (
        <div className="bg-orange-950/20 border border-orange-900/50 p-4 rounded-lg font-mono">
          <h3 className="text-[10px] text-orange-500 uppercase font-bold tracking-widest mb-3 flex items-center gap-2">
            <AlertTriangle size={14} /> Fiduciary Disclosures
          </h3>
          <ul className="space-y-2">
            {boardPack.disclosures.map((d, i) => (
              <li key={i} className={`text-xs font-bold tracking-widest uppercase ${d.severity === 'CRITICAL' ? 'text-rose-400' : d.severity === 'WARNING' ? 'text-orange-400' : 'text-blue-400'}`}>
                • {d.statement}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          <ExecutiveSnapshotSurface data={boardPack.executiveSnapshot} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StrategicDirectionSurface data={boardPack.strategicDirection} />
        <TreasuryPressureSurface data={boardPack.treasuryReport} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ContinuityReportingSurface data={boardPack.continuityReport} />
        <OperationalGovernanceSurface data={boardPack.operationalGovernance} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GovernanceReportingSurface data={boardPack.governanceReport} />
        <ExecutiveDirectiveSurface data={boardPack.executiveDirectives} />
      </div>

      <div className="border-t border-zinc-800 pt-6 mt-8">
        <h3 className="text-zinc-500 font-bold tracking-widest uppercase text-xs mb-6 text-center">Fiduciary Appendices</h3>
        <div className="grid grid-cols-1 gap-6">
          <ExplainabilityAppendixDrawer data={boardPack.explainabilityAppendix} />
          <LineageAppendixDrawer data={boardPack.lineageAppendix} />
          <BoardPackExportPanel metadata={boardPack.metadata} />
        </div>
      </div>

    </div>
  );
}
