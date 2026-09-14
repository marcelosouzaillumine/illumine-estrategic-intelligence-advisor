import React from 'react';
import { ShieldAlert, TrendingDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { InstitutionalShowcase } from './InstitutionalShowcase';

import { TemporalExecutiveScoreboard } from '../../../../temporal/TemporalExecutiveScoreboard';
import { TemporalEarlyWarningBanner } from '../../../../temporal/TemporalEarlyWarningBanner';
import { TemporalCausalityOutput } from '../../../../../capabilities/runtime/institutional-memory/types';

export function GovernanceShowcase() {
  const { t } = useTranslation('showcases/governance');

  const mockTemporalData: TemporalCausalityOutput = {
    temporalGovernanceScore: {
      temporalGovernanceScore: 82,
      governanceTrajectory: 'IMPROVING',
      institutionalStabilityIndex: 0.85,
      recurrenceSeverityWeight: 0.2,
      responsivenessWeight: 0.3,
      fatigueWeight: 0.2,
      deteriorationWeight: 0.1,
      resilienceWeight: 0.2
    },
    earlyWarnings: [
      {
        warningType: 'RUNWAY_COLLAPSE_TENDENCY',
        description: t('warning'),
        recurrenceCycles: 2,
        lineageHash: 'ew123456',
        auditReference: 'AUD-992'
      }
    ],
    deteriorationState: {
      deteriorationScore: 12,
      deteriorationVelocity: 0.5,
      deteriorationSeverity: 'LOW',
      deteriorationPersistence: 1,
      institutionalRiskLevel: 'STABLE'
    },
    responsivenessMetrics: {
      responsivenessScore: 88,
      governanceReactionTime: 5,
      advisoryExecutionRate: 92,
      executionDisciplineIndex: 0.9,
      workflowCompletionSpeed: 0.8
    },
    fatigueState: {
      fatigueScore: 25,
      fatigueTrend: 'STABLE',
      governanceExhaustionLevel: 'LOW',
      operationalPressureLevel: 'NORMAL'
    },
    predictiveRecurrence: {
      recurrenceScore: 15,
      recurrenceFrequency: 1,
      recurrenceSeverity: 'LOW',
      recurrenceConfidence: 'HIGH',
      recurrenceLineage: ['ew123456']
    },
    escalationState: {
      currentLevel: 'MONITOR',
      escalationEvidence: [],
      recurrenceLineage: [],
      severityProgression: ['MONITOR'],
      auditReference: 'AUD-992'
    },
    causalChain: {
      chainId: 'chain-1',
      links: ['link-1', 'link-2']
    },
    lineageHash: 'xpto-hash-gov-999',
    correlationId: 'corr-999',
    tenantId: 'tenant-atlas',
    entityScope: 'Grupo Atlas Participações',
    temporalEvidence: [],
    confidenceState: {
      level: 'HIGH',
      justification: t('justification')
    },
    auditReference: 'AUD-992'
  };

  return (
    <InstitutionalShowcase title="Governance Observability (Grupo Atlas Participações)" className="max-w-6xl mx-auto">
      <div className="flex flex-col gap-6 w-full text-zinc-100 font-mono">
        
        <div className="grid grid-cols-1 gap-6">
          <TemporalEarlyWarningBanner warnings={mockTemporalData.earlyWarnings} />
          
          <TemporalExecutiveScoreboard temporalData={mockTemporalData} />
          
          {/* Adicionando um bloco fake de "Decision Trace" para visual proof */}
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
            <h3 className="text-lg font-bold tracking-tight mb-4 text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              {t('ui.trace_title')}
            </h3>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-black/50 border border-zinc-800 rounded-lg">
                <div>
                  <div className="text-sm text-zinc-300 font-medium">{t('ui.approval')}</div>
                  <div className="text-xs text-zinc-500 mt-1">{t('ui.conflict')}</div>
                </div>
                <div className="mt-4 md:mt-0 px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs rounded-full uppercase tracking-widest font-bold">
                  {t('ui.intervention')}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </InstitutionalShowcase>
  );
}
