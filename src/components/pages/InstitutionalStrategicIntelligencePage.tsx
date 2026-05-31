// src/components/pages/InstitutionalStrategicIntelligencePage.tsx

import React from 'react';
import { InstitutionalStrategicIntelligenceCenter } from '../strategic-intelligence/InstitutionalStrategicIntelligenceCenter';
import { InstitutionalExecutiveCommandRuntime } from '../../core/runtime/executive-command/InstitutionalExecutiveCommandRuntime';
import { InstitutionalOperationalGovernanceRuntime } from '../../core/runtime/operational-governance/InstitutionalOperationalGovernanceRuntime';
import { InstitutionalStrategicIntelligenceRuntime } from '../../core/runtime/strategic-intelligence/InstitutionalStrategicIntelligenceRuntime';

// Dummy wrapper to simulate the ExecutiveIntelligenceReport that feeds the page
export function InstitutionalStrategicIntelligencePage({ clients, selectedClient, selectedMonth, selectedYear }: any) {
  
  // No mundo real, a página inteira é despachada a partir do ExecutiveIntelligenceRuntime unificado.
  // Como estamos testando o painel de forma isolada (sandbox visual), geramos um fake dummy aqui.
  
  const dummyReport: any = {
    metadata: { lineageHash: 'STR-7729-A1B2', historicalCyclesCount: 5 },
    institutionalContext: { tenantId: 'sandbox', currentCycle: '2026-05' },
    capitalStructure: { fundingDependenceLevel: 'MODERATE', rolloverRisk: 'LOW' },
    metrics: {
      financialMetrics: { ocf: 450, revenue: 15000 },
      scaleEfficiency: { recGrowth: 0.12, ebitdaGrowth: 0.15 }
    },
    resilienceReport: { status: 'SAFE' },
    treasuryIntelligenceReport: { stressStatus: 'STABLE' },
    operatingPressureReport: { structuralPressureSeverity: 'MODERATE' },
    executiveCommand: { activeDirectives: [] },
    operationalGovernance: {
      executionIntegrity: { status: 'EXECUTION_STABLE' }
    }
  };

  const strategicOutput = InstitutionalStrategicIntelligenceRuntime.evaluate(dummyReport);

  return (
    <div className="p-6">
      <InstitutionalStrategicIntelligenceCenter data={strategicOutput} />
    </div>
  );
}
