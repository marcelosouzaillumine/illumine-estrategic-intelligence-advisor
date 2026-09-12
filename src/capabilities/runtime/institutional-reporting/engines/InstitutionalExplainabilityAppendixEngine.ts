// src/core/runtime/institutional-reporting/engines/InstitutionalExplainabilityAppendixEngine.ts

import { ExecutiveIntelligenceReport } from '../../executive-intelligence-runtime';
import { ExplainabilityAppendix } from '../institutional-reporting-types';

export class InstitutionalExplainabilityAppendixEngine {
  
  public static generate(report: ExecutiveIntelligenceReport): ExplainabilityAppendix {
    
    const strategic = report.strategicIntelligence!;
    const gov = report.operationalGovernance!;
    
    const rationaleMap: Record<string, string> = {
      'STRATEGIC_POSTURE': `Driven by ${strategic.posture} inference engine based on historical efficiency and survival mode signals.`,
      'STRATEGIC_TRAJECTORY': strategic.explainability.trajectoryRationale,
      'EXPANSION_SUSTAINABILITY': strategic.explainability.sustainabilityExplanation,
      'EXECUTION_INTEGRITY': (gov.executionIntegrity as unknown as { inferenceBasis?: string }).inferenceBasis || 'N/A'
    };

    const confidenceDecomposition: Record<string, string> = {
      'POSTURE_CONFIDENCE': strategic.vectors[0]?.vectorConfidence || 'UNVERIFIABLE',
      'EXECUTION_CONFIDENCE': String(gov?.executionIntegrity?.confidenceScore || gov?.executionIntegrity?.capabilityConfidence || 'UNKNOWN')
    };

    return {
      rationaleMap,
      confidenceDecomposition
    };
  }

}
