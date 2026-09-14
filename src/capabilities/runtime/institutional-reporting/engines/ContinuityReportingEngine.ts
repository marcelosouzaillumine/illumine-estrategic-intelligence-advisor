// src/core/runtime/institutional-reporting/engines/ContinuityReportingEngine.ts

import { ExecutiveIntelligenceReport } from '../../../../core/runtime/executive-intelligence-runtime';
import { ContinuitySection } from '../institutional-reporting-types';

export class ContinuityReportingEngine {
  
  public static generate(report: ExecutiveIntelligenceReport): ContinuitySection {
    
    const resilience = report.resilienceReport;
    const survival = report.survivalReport;
    
    const survivalOverlays: string[] = [];
    if (survival?.activeSurvivalMode === 'SURVIVAL_MODE') {
      survivalOverlays.push(...survival.forbiddenInstitutionalPriorities.map(p => `FORBIDDEN_${p}`));
      survivalOverlays.push(...[]);
    }

    return {
      resilienceStatus: resilience?.resilienceClassification || 'UNKNOWN',
      antifragilityScore: resilience?.antifragilityScore || 0,
      survivalOverlays
    };
  }

}
