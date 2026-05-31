// src/core/runtime/institutional-reporting/engines/OperationalGovernanceReportingEngine.ts

import { ExecutiveIntelligenceReport } from '../../executive-intelligence-runtime';
import { OperationalGovernanceSection } from '../institutional-reporting-types';

export class OperationalGovernanceReportingEngine {
  
  public static generate(report: ExecutiveIntelligenceReport): OperationalGovernanceSection {
    
    const gov = report.operationalGovernance!;
    
    return {
      executionStatus: gov.executionIntegrity.status,
      operationalFrictions: gov.frictions.map(s => s.description),
      continuityStrain: gov.continuity.status
    };
  }

}
