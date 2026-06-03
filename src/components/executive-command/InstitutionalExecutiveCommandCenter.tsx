// src/components/executive-command/InstitutionalExecutiveCommandCenter.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { ShieldCheck, Activity, Loader2 } from 'lucide-react';
import { useAnnualFinancialData, useAllFinancialData } from '../../hooks/useFinancialData';
import { executiveRuntime } from '../../core/runtime/executive-intelligence-runtime';
import { InstitutionalExecutiveCommandOutput } from '../../core/runtime/executive-command/executive-command-types';
import { useLanguage } from '../../contexts/LanguageContext';

// Child components
import { ExecutiveDirectivePanel } from './ExecutiveDirectivePanel';
import { GovernanceRestrictionOverlay } from './GovernanceRestrictionOverlay';
import { StrategicAlignmentSurface } from './StrategicAlignmentSurface';
import { ExecutiveDriftRadar } from './ExecutiveDriftRadar';
import { InstitutionalPrioritySurface } from './InstitutionalPrioritySurface';
import { CommandExplainabilityDrawer } from './CommandExplainabilityDrawer';

interface CommandCenterProps {
  clientId?: string;
  selectedYear?: number;
}

export function InstitutionalExecutiveCommandCenter({ clientId, selectedYear }: CommandCenterProps) {
  const { t } = useLanguage();
  const filterYear = selectedYear || new Date().getFullYear();

  const { dbData: dbDataDRE, docIds: docIdsDRE, loading: loadingDRE } = useAnnualFinancialData(clientId || '', filterYear, 'DRE');
  const { dbData: dbDataBP, loading: loadingBP } = useAnnualFinancialData(clientId || '', filterYear, 'BP');
  const { dbData: allHistoryData, loading: loadingHistory } = useAllFinancialData(clientId || '');

  const loading = loadingDRE || loadingBP || loadingHistory;

  const report = useMemo(() => {
    if (loading || !clientId) return null;
    const input = {
      clientProfile: { id: clientId },
      dreData: dbDataDRE,
      bpData: dbDataBP,
      rawFinancialData: { filterYear, allHistoryData },
      historicalCyclesCount: docIdsDRE.length,
      isMockData: dbDataDRE.length === 0,
      historicalSeries: allHistoryData
    };
    return executiveRuntime.generateExecutiveReport(input);
  }, [clientId, filterYear, dbDataDRE, dbDataBP, allHistoryData, docIdsDRE.length, loading]);

  if (!clientId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] space-y-8 bg-zinc-950 border border-zinc-800 rounded-3xl p-20 text-center w-full text-zinc-100 font-mono">
        <div className="w-24 h-24 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 shadow-xl relative animate-pulse">
          <Activity size={48} />
        </div>
        <div className="text-center space-y-4 w-full max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold tracking-tight">{t('cmd.title')}</h2>
          <p className="text-zinc-500 text-xs tracking-wider uppercase">
            {t('cmd.select_org')}
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center font-mono bg-zinc-950 text-zinc-100">
        <div className="flex flex-col items-center gap-4 text-zinc-500">
          <Loader2 className="animate-spin" size={32} />
          <p className="text-xs uppercase tracking-widest">{t('cmd.processing')}</p>
        </div>
      </div>
    );
  }

  const executiveCommand = (report as any)?.executiveCommand as InstitutionalExecutiveCommandOutput | undefined;

  if (!executiveCommand) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-zinc-900 border border-zinc-800 rounded-3xl p-20 text-center shadow-sm font-mono">
        <ShieldCheck size={48} className="text-zinc-600 mb-6" />
        <h3 className="text-xl font-bold text-zinc-100 mb-2">{t('cmd.unavailable')}</h3>
        <p className="text-zinc-500 max-w-md mb-8 text-xs">
          {t('cmd.unavailable_desc')}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full text-zinc-100 pb-12 bg-zinc-950 p-6 rounded-3xl border border-zinc-800 font-mono">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-zinc-400 mb-1">
            <ShieldCheck size={16} />
            <span className="text-[10px] uppercase font-bold tracking-widest font-mono">{t('cmd.board_room')}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{t('cmd.header_title')}</h1>
          <p className="text-xs text-zinc-500 font-mono mt-1 uppercase tracking-widest">{t('cmd.header_subtitle')}</p>
        </div>
        
        {executiveCommand.commandThesis.lineageHash && (
          <div className="text-[10px] text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <span>{t('cmd.hash')}</span>
            <span className="font-bold text-zinc-300">{executiveCommand.commandThesis.lineageHash.substring(0, 16)}...</span>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Top Section */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          <InstitutionalPrioritySurface 
            orchestration={executiveCommand.strategicOrchestration}
            thesis={executiveCommand.commandThesis}
          />
          <ExecutiveDirectivePanel directives={executiveCommand.activeDirectives} />
        </div>

        <div className="xl:col-span-4 flex flex-col gap-6">
          <StrategicAlignmentSurface alignment={executiveCommand.institutionalAlignment} />
          <GovernanceRestrictionOverlay tracking={executiveCommand.governanceTracking} />
        </div>

        {/* Bottom Section */}
        <div className="xl:col-span-6 flex flex-col gap-6">
          <ExecutiveDriftRadar driftEvents={executiveCommand.driftEvents} />
        </div>

        <div className="xl:col-span-6 flex flex-col gap-6">
          <CommandExplainabilityDrawer explainability={executiveCommand.explainability} />
        </div>

      </div>
    </div>
  );
}
