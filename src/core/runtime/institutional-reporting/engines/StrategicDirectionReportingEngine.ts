// src/core/runtime/institutional-reporting/engines/StrategicDirectionReportingEngine.ts

import { ExecutiveIntelligenceReport } from '../../executive-intelligence-runtime';
import { StrategicDirectionSection } from '../institutional-reporting-types';

export class StrategicDirectionReportingEngine {
  
  public static generate(report: ExecutiveIntelligenceReport): StrategicDirectionSection {
    
    const strategic = report.strategicIntelligence!;
    
    return {
      strategicPosture: strategic.posture,
      primaryVector: strategic.vectors[0]?.direction || 'UNVERIFIABLE',
      trajectoryContinuity: strategic.trajectory,
      expansionSustainability: strategic.expansionSustainability.isSustainable,
      strategicContradictions: strategic.contradictions.map(c => c.description)
    };
  }

}
