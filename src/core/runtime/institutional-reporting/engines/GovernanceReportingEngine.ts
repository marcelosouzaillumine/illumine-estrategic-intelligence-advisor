// src/core/runtime/institutional-reporting/engines/GovernanceReportingEngine.ts

import { ExecutiveIntelligenceReport } from '../../executive-intelligence-runtime';
import { GovernanceReportingSection } from '../institutional-reporting-types';

export class GovernanceReportingEngine {
  
  public static generate(report: ExecutiveIntelligenceReport): GovernanceReportingSection {
    
    const gov = report.operationalGovernance!;
    
    // Assembles active locks from continuity and survival
    const activeGovernanceLocks: string[] = [];
    if (report.survivalReport?.activeSurvivalMode === 'SURVIVAL_MODE') {
      activeGovernanceLocks.push('SURVIVAL_RESTRICTION_LOCK');
    }
    
    // Add execution integrity
    const executionIntegrity = gov.executionIntegrity.status;

    // A simple governance score based on the absence of frictions
    const governanceScore = 100 - ((gov.frictions?.length || 0) * 10);

    return {
      complianceStatus: ((report.institutionalContext as unknown as { historicalCyclesCount?: number }).historicalCyclesCount || 2) >= 2 ? 'COMPLIANT' : 'RESTRICTED_MODE',
      activeGovernanceLocks,
      executionIntegrity,
      governanceScore: Math.max(0, governanceScore)
    };
  }

}
