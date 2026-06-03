// src/components/pages/InstitutionalBoardPackPage.tsx

import React from 'react';
import { InstitutionalBoardPackCenter } from '../institutional-reporting/InstitutionalBoardPackCenter';
import { InstitutionalBoardPackRuntime } from '../../core/runtime/institutional-reporting/InstitutionalBoardPackRuntime';

// Dummy wrapper para simular a injeção do ExecutiveIntelligenceReport
export function InstitutionalBoardPackPage({ clients, selectedClient, selectedMonth, selectedYear }: any) {
  
  // Fake Report Simulation to test the pure UI Board Pack Renderer
  const dummyReport: any = {
    metadata: { lineageHash: 'BD-PACK-TEST-HASH', historicalCyclesCount: 4, auditTrail: ['EXEC-001', 'STR-002'] },
    institutionalContext: { tenantId: 'sandbox', currentCycle: '2026-05' },
    capitalStructure: { fundingDependenceLevel: 'MODERATE' },
    metrics: {
      financialMetrics: { ocf: 450, revenue: 15000 },
      scaleEfficiency: { recGrowth: 0.12, ebitdaGrowth: 0.15 }
    },
    resilienceReport: { status: 'SAFE', antifragilityScore: 85, metadata: { lineageHash: 'RES-HASH' } },
    treasuryIntelligenceReport: { stressStatus: 'STABLE', metadata: { lineageHash: 'TRS-HASH' } },
    operatingPressureReport: { structuralPressureSeverity: 'LOW' },
    survivalReport: { activeSurvivalMode: null, forbiddenInstitutionalPriorities: [], activeFiduciaryLocks: [] },
    strategicIntelligence: {
      posture: 'EXPANSION_POSTURE',
      vectors: [{ direction: 'RECURRENT_GROWTH', vectorConfidence: 'HIGH' }],
      trajectory: 'TRAJECTORY_STABLE',
      expansionSustainability: { isSustainable: true },
      contradictions: [],
      explainability: {
        strategicLineage: 'STR-HASH-123',
        trajectoryRationale: 'Stable recurrent growth with high ocf generation.',
        sustainabilityExplanation: 'Expansion is strictly funded by operational cash flow.'
      },
      thesis: { unifiedThesisStatement: 'Sustainable structural growth directed by strong operational cash flow.' }
    },
    executiveCommand: { activeDirectives: [{ action: 'MAINTAIN', type: 'GOVERNANCE', description: 'Maintain current structural expansion safely.' }] },
    operationalGovernance: {
      executionIntegrity: { status: 'EXECUTION_STABLE', confidence: 'HIGH', rationale: 'No critical operational frictions detected.' },
      operationalFriction: { frictions: [] },
      operationalContinuity: { status: 'SUSTAINED_CONTINUITY' },
      auditTrail: ['GOV-HASH-456']
    }
  };

  const boardPack = InstitutionalBoardPackRuntime.generate(dummyReport);

  return (
    <div className="p-6">
      <InstitutionalBoardPackCenter boardPack={boardPack} />
    </div>
  );
}
