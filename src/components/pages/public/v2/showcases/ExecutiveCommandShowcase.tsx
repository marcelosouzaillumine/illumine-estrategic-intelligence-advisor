import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { InstitutionalShowcase } from './InstitutionalShowcase';

import { InstitutionalPrioritySurface } from '../../../../executive-command/InstitutionalPrioritySurface';
import { ExecutiveDirectivePanel } from '../../../../executive-command/ExecutiveDirectivePanel';
import { StrategicAlignmentSurface } from '../../../../executive-command/StrategicAlignmentSurface';
import { GovernanceRestrictionOverlay } from '../../../../executive-command/GovernanceRestrictionOverlay';
import { ExecutiveDriftRadar } from '../../../../executive-command/ExecutiveDriftRadar';
import { CommandExplainabilityDrawer } from '../../../../executive-command/CommandExplainabilityDrawer';

import { InstitutionalExecutiveCommandOutput } from '../../../../../workspace/runtime/executive-command/executive-command-types';

export function ExecutiveCommandShowcase() {
  const { t } = useTranslation('showcases/executive-command');

  const mockCommand: InstitutionalExecutiveCommandOutput = {
    commandThesis: {
      thesisStatement: t('commandThesis.thesisStatement'),
      structuralPosture: "DEFENSIVE",
      confidenceLevel: "HIGH",
      lineageHash: "abc123def456ghi789jkl012mno345pq"
    },
    strategicOrchestration: {
      primaryFocus: t('commandThesis.primaryFocus'),
      immediateActionsRetained: Array.isArray(t('commandThesis.actions', { returnObjects: true })) 
        ? t('commandThesis.actions', { returnObjects: true }) as string[]
        : [],
      orchestrationNarrative: t('commandThesis.orchestrationNarrative')
    },
    activeDirectives: [
      {
        id: "dir-1",
        category: "CAPITAL_PRESERVATION",
        title: t('directives.0.title'),
        statement: t('directives.0.statement'),
        severity: "CRITICAL",
        causalDrivers: ["Custo de Dívida", "Margem EBITDA"],
        lineageHash: "xpt123456",
        createdAt: new Date().toISOString(),
        status: "PENDING_REVIEW"
      },
      {
        id: "dir-2",
        category: "LIQUIDITY_STABILIZATION",
        title: t('directives.1.title'),
        statement: t('directives.1.statement'),
        severity: "ELEVATED",
        causalDrivers: ["Fluxo de Caixa Livre"],
        lineageHash: "xpt987654",
        createdAt: new Date().toISOString(),
        status: "ACKNOWLEDGED"
      }
    ],
    institutionalAlignment: {
      overallAlignmentScore: 68,
      treasuryAlignment: "CRITICAL_TENSION",
      growthAlignment: "DIVERGENT",
      continuityAlignment: "ALIGNED",
      alignmentNarrative: t('alignment.narrative')
    },
    governanceTracking: {
      pendingDirectivesCount: 3,
      resolvedDirectivesCount: 12,
      recurringDriftCount: 1,
      executionRate: 80
    },
    driftEvents: [
      {
        id: "drift-1",
        description: t('drift.description'),
        severity: "HIGH",
        conflictingDirective: "Diretriz de Congelamento de Captação",
        observedMetric: "Aumento de Dívida Curto Prazo",
        timestamp: new Date().toISOString(),
        lineageHash: "drift12345"
      }
    ],
    explainability: {
      rationale: t('explainability.rationale'),
      dominantEngine: "Liquidity Risk Predictor",
      supportingLineageHashes: ["abc123def456ghi789jkl012mno345pq"],
      governanceConstraintsApplied: ["Politica de Endividamento Máximo (3.5x)"]
    }
  };

  return (
    <InstitutionalShowcase title="Executive Command Center (Grupo Atlas Participações)" className="max-w-7xl mx-auto">
      <div className="flex flex-col gap-6 w-full text-zinc-100 font-mono">
        
        {/* Header Mock */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-zinc-400 mb-1">
              <ShieldCheck size={16} />
              <span className="text-[10px] uppercase font-bold tracking-widest font-mono">{t('ui.tag')}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-amber-500">{t('ui.title')}</h1>
            <p className="text-xs text-zinc-500 font-mono mt-1 uppercase tracking-widest">{t('ui.subtitle')}</p>
          </div>
          <div className="text-[10px] text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <span>{t('ui.hash_label')}</span>
            <span className="font-bold text-zinc-300">abc123def456...</span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-8 flex flex-col gap-6">
            <InstitutionalPrioritySurface 
              orchestration={mockCommand.strategicOrchestration}
              thesis={mockCommand.commandThesis}
            />
            <ExecutiveDirectivePanel directives={mockCommand.activeDirectives} />
          </div>

          <div className="xl:col-span-4 flex flex-col gap-6">
            <StrategicAlignmentSurface alignment={mockCommand.institutionalAlignment} />
            <GovernanceRestrictionOverlay tracking={mockCommand.governanceTracking} />
          </div>
        </div>
        
      </div>
    </InstitutionalShowcase>
  );
}
