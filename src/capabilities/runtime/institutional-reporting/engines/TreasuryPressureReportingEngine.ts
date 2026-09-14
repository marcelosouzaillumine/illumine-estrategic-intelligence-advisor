// src/core/runtime/institutional-reporting/engines/TreasuryPressureReportingEngine.ts

import { ExecutiveIntelligenceReport } from '../../../../core/runtime/executive-intelligence-runtime';
import { TreasurySection } from '../institutional-reporting-types';

export class TreasuryPressureReportingEngine {
  
  public static generate(report: ExecutiveIntelligenceReport): TreasurySection {
    
    const treasury = report.treasuryIntelligenceReport;
    const opPressure = report.operatingPressureReport;
    
    return {
      treasuryStressStatus: treasury?.severity || 'UNKNOWN',
      liquidityCompressionLevel: opPressure?.overallPressureLevel || 'UNKNOWN',
      fundingFragility: opPressure?.fundingFragility?.fundingDependency || 'UNKNOWN',
      runwaySustainability: treasury?.severity !== 'CRITICAL' && treasury?.severity !== 'HIGH'
    };
  }

}
