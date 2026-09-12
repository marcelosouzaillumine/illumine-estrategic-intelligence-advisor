// src/core/runtime/advisory-narrative/advisory-narrative-types.ts
//
// Advisory Narrative & Board Communication Types

import { SurvivabilityScores } from '../../core/runtime/decision-intelligence/decision-types';
import { FatigueMetrics, BehaviorProfile } from '../../core/runtime/behavioral-intelligence/behavioral-types';
import { ScenarioCategory } from '../../core/runtime/strategic-simulation/simulation-types';

export type AdvisoryAudience =
  | 'BOARD'
  | 'EXECUTIVE'
  | 'ADVISORY'
  | 'REPORTING'
  | 'COMMITTEE';

export type AdvisorySeverity =
  | 'STABLE'
  | 'ATTENTION'
  | 'HIGH_RISK'
  | 'CRITICAL'
  | 'UNSUSTAINABLE'
  | 'COLLAPSE_TRAJECTORY';

export interface ExecutiveAdvisoryNarrative {
  title: string;
  timestamp: string;
  audience: AdvisoryAudience;
  severity: AdvisorySeverity;
  lineageHash: string;
  correlationId: string;
  
  // Mandatory 10-Section Structure
  sections: {
    institutionalContext: string;       // 1. Institutional Context
    currentStructuralCondition: string; // 2. Current Structural Condition
    survivabilityStatus: string;        // 3. Survivability Status
    governanceStability: string;       // 4. Governance Stability
    strategicTradeoffs: string;         // 5. Strategic Tradeoffs
    predictiveSignals: string;          // 6. Predictive Signals
    recommendedStrategicPaths: string;  // 7. Recommended Strategic Paths
    institutionalRisks: string;         // 8. Institutional Risks
    confidenceLimitations: string;      // 9. Confidence & Limitations
    fiduciaryDisclosure: string;        // 10. Fiduciary Disclosure
  };

  // Structured recommendations data
  recommendations: {
    recommendedPath: ScenarioCategory;
    alternatives: ScenarioCategory[];
    justification: string;
  };
}
