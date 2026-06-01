// src/components/institutional-reporting/InstitutionalBoardPackCenter.tsx

import React from 'react';
import { FileText, AlertTriangle, Fingerprint, Activity, ShieldCheck, FileKey } from 'lucide-react';
import { InstitutionalBoardPackOutput } from '../../core/runtime/institutional-reporting/institutional-reporting-types';
import { useLanguage } from '../../contexts/LanguageContext';

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
import { FiduciaryTimelineSurface } from './FiduciaryTimelineSurface';
import { QuarantineModeSurface } from './QuarantineModeSurface';

export function InstitutionalBoardPackCenter({ boardPack }: { boardPack: InstitutionalBoardPackOutput }) {
  const { t } = useLanguage();

  if (boardPack.status === 'FAILED') {
    return (
      <div className="p-8 bg-rose-950/20 border border-rose-900/50 rounded-lg flex flex-col items-center justify-center text-center">
        <AlertTriangle size={48} className="text-rose-500 mb-4" />
        <h2 className="text-rose-400 font-bold uppercase tracking-widest text-lg mb-2">{t('boardpack.generation_failed')}</h2>
        <p className="text-rose-300/80 font-mono text-sm max-w-lg">
          {boardPack.disclosureSet?.[0]?.message || t('boardpack.unknown_error')}
        </p>
      </div>
    );
  }

  const isQuarantined = boardPack.status === 'RESTRICTED';
  const quarantineReason = boardPack.executiveSnapshot?.restrictionReason || t('snapshot.quarantine_mode_desc');
  const isAccountingBroken = boardPack.executiveSnapshot?.accountingIntegrityStatus === 'FAILED';

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* BoardPack Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg flex flex-col">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold flex items-center gap-2 mb-2"><FileKey size={12}/> Lineage Hash</span>
          <span className="text-xs text-zinc-300 font-mono truncate" title={boardPack.metadata.boardPackLineageHash}>{boardPack.metadata.boardPackLineageHash || 'N/A'}</span>
        </div>
        <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg flex flex-col">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold flex items-center gap-2 mb-2"><Fingerprint size={12}/> {t('snapshot.audit_trail')}</span>
          <span className="text-xs font-bold text-zinc-300">{boardPack.metadata.tenantId}</span>
        </div>
        <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg flex flex-col">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold flex items-center gap-2 mb-2"><ShieldCheck size={12}/> {t('snapshot.confidence_level')}</span>
          <span className={`text-xs font-bold uppercase ${boardPack.executiveSnapshot?.trajectoryConfidence === 'HIGH' ? 'text-blue-400' : 'text-amber-400'}`}>{boardPack.executiveSnapshot?.trajectoryConfidence || 'N/A'}</span>
        </div>
        <div className={`bg-zinc-950 border p-4 rounded-lg flex flex-col ${boardPack.fiduciaryRestrictions && boardPack.fiduciaryRestrictions.length > 0 ? 'border-amber-900/50 bg-amber-950/20' : 'border-zinc-800'}`}>
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold flex items-center gap-2 mb-2"><AlertTriangle size={12}/> {t('snapshot.active_restrictions')}</span>
          <span className={`text-xs font-bold uppercase ${boardPack.fiduciaryRestrictions && boardPack.fiduciaryRestrictions.length > 0 ? 'text-amber-500' : 'text-zinc-300'}`}>{boardPack.fiduciaryRestrictions?.length || 0} {t('snapshot.detected')}</span>
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <FileText className="text-blue-500" />
            {t('boardpack.title')}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-zinc-400 text-sm font-mono">{isQuarantined ? t('boardpack.restricted_report') : t('boardpack.sovereign_layer')}</span>
            <span className="text-[10px] bg-zinc-900 text-zinc-500 px-2 py-0.5 rounded uppercase tracking-widest font-bold">
              {t('boardpack.cycle')}: {boardPack.metadata.cycleReference}
            </span>
          </div>
        </div>
      </div>

      {boardPack.disclosureSet && boardPack.disclosureSet.length > 0 && (
        <div className="bg-orange-950/20 border border-orange-900/50 p-4 rounded-lg font-mono">
          <h3 className="text-[10px] text-orange-500 uppercase font-bold tracking-widest mb-3 flex items-center gap-2">
            <AlertTriangle size={14} /> {t('boardpack.disclosures')}
          </h3>
          <ul className="space-y-2">
            {boardPack.disclosureSet.map((d, i) => (
              <li key={i} className={`text-xs font-bold tracking-widest uppercase ${d.severity === 'CRITICAL' || d.severity === 'RESTRICTED' ? 'text-rose-400' : d.severity === 'HIGH' || d.severity === 'ELEVATED' ? 'text-orange-400' : 'text-blue-400'}`}>
                • {d.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          {isQuarantined ? (
            <QuarantineModeSurface 
              reason={quarantineReason} 
              accountingIntegrityStatus={boardPack.executiveSnapshot?.accountingIntegrityStatus}
              evidenceTrail={boardPack.executiveSnapshot?.evidenceTrail}
              onViewRawData={() => window.scrollTo(0, document.body.scrollHeight)} 
            />
          ) : (
            <ExecutiveSnapshotSurface data={boardPack.executiveSnapshot} />
          )}
        </div>
      </div>

      {!isQuarantined && boardPack.fiduciaryTimeline && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3">
            <FiduciaryTimelineSurface timeline={boardPack.fiduciaryTimeline} />
          </div>
        </div>
      )}

      {!isQuarantined && (
        <>
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
        </>
      )}
      
      {isQuarantined && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 opacity-60">
          {/* Apenas as abas brutos e de treasury (fatos) */}
          <TreasuryPressureSurface data={boardPack.treasuryReport} />
          <OperationalGovernanceSurface data={boardPack.operationalGovernance} />
        </div>
      )}

      <div className="border-t border-zinc-800 pt-6 mt-8">
        <h3 className="text-zinc-500 font-bold tracking-widest uppercase text-xs mb-6 text-center">{t('boardpack.appendices')}</h3>
        <div className="grid grid-cols-1 gap-6">
          <ExplainabilityAppendixDrawer data={boardPack.explainabilityAppendix} />
          <LineageAppendixDrawer data={boardPack.lineageAppendix} />
          <BoardPackExportPanel metadata={boardPack.metadata} />
        </div>
      </div>

    </div>
  );
}
