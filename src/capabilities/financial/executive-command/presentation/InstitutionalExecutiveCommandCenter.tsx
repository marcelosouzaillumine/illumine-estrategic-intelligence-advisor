// src/components/executive-command/InstitutionalExecutiveCommandCenter.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { ShieldCheck, Activity, Loader2 } from 'lucide-react';
import { useAnnualFinancialData, useAllFinancialData } from '../../../../hooks/useFinancialData';
import { executiveRuntime } from '../../../../services/FiduciaryRuntimeAdapter';
import { InstitutionalExecutiveCommandOutput } from '../../../../services/FiduciaryRuntimeAdapter';
import { useLanguage } from '../../../../contexts/LanguageContext';

// Canonical UI Components
import { ExecutivePageTemplate } from '../../../../components/ui/executive-page-template';
import { ExecutiveEmptyState } from '../../../../components/ui/executive-empty-state';
import { ExecutivePlaceholder } from '../../../../components/ui/executive-placeholder';
import { ExecutiveBadge } from '../../../../components/ui/executive-badge';

// Child components
import { ExecutiveDirectivePanel } from '../../../../components/executive-command/ExecutiveDirectivePanel';
import { GovernanceRestrictionOverlay } from '../../../../components/executive-command/GovernanceRestrictionOverlay';
import { StrategicAlignmentSurface } from '../../../../components/executive-command/StrategicAlignmentSurface';
import { ExecutiveDriftRadar } from '../../../../components/executive-command/ExecutiveDriftRadar';
import { InstitutionalPrioritySurface } from '../../../../components/executive-command/InstitutionalPrioritySurface';
import { CommandExplainabilityDrawer } from '../../../../components/executive-command/CommandExplainabilityDrawer';

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
      <div className="w-full flex items-center justify-center min-h-[600px]">
        <ExecutiveEmptyState
          icon={<Activity />}
          title={t('cmd.title')}
          description={t('cmd.select_org')}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center min-h-[600px]">
        <ExecutivePlaceholder
          icon={Loader2}
          title={t('cmd.processing')}
          className="animate-pulse"
        />
      </div>
    );
  }

  const executiveCommand = (report as any)?.executiveCommand as InstitutionalExecutiveCommandOutput | undefined;

  if (!executiveCommand) {
    return (
      <div className="w-full flex items-center justify-center min-h-[600px]">
        <ExecutiveEmptyState
          icon={<ShieldCheck />}
          title={t('cmd.unavailable')}
          description={t('cmd.unavailable_desc')}
        />
      </div>
    );
  }

  return (
    <ExecutivePageTemplate
      header={{
        title: t('cmd.header_title'),
        subtitle: t('cmd.header_subtitle'),
        icon: ShieldCheck,
        badge: t('cmd.board_room'),
        actions: executiveCommand.commandThesis.lineageHash ? (
          <ExecutiveBadge variant="neutral">
            {t('cmd.hash')}: {executiveCommand.commandThesis.lineageHash.substring(0, 16)}...
          </ExecutiveBadge>
        ) : undefined
      }}
    >
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
    </ExecutivePageTemplate>
  );
}
