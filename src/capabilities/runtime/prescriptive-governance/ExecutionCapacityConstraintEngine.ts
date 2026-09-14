import { InstitutionalCapacity } from './PrescriptiveTypes';
import { InstitutionalSnapshot } from '../predictive-governance/PredictiveTypes';

export class ExecutionCapacityConstraintEngine {
  static evaluateCapacity(snapshots: InstitutionalSnapshot[]): InstitutionalCapacity {
    if (!snapshots || snapshots.length === 0) {
      return {
        capacityScore: 0,
        financialCapacity: 'CONSTRAINED',
        operationalCapacity: 'AT_CAPACITY',
        governanceCapacity: 'FRAGILE',
        maxConcurrentInterventions: 1,
        confidenceLevel: 'INSUFFICIENT_HISTORY',
        confidenceReason: 'No historical data available to assess execution capacity.'
      };
    }

    const latest = snapshots[snapshots.length - 1];

    let financialScore = latest.bpHealth + latest.dfcHealth + latest.dreHealth;
    let governanceScore = latest.governanceScore + latest.cescfScore;

    let financialCapacity: 'STRONG' | 'CONSTRAINED' | 'CRITICAL' = 'CONSTRAINED';
    if (financialScore > 220) financialCapacity = 'STRONG';
    else if (financialScore < 120) financialCapacity = 'CRITICAL';

    let governanceCapacity: 'MATURE' | 'DEVELOPING' | 'FRAGILE' = 'DEVELOPING';
    if (governanceScore > 160) governanceCapacity = 'MATURE';
    else if (governanceScore < 100) governanceCapacity = 'FRAGILE';

    let operationalCapacity: 'ELASTIC' | 'AT_CAPACITY' | 'OVERLOADED' = 'AT_CAPACITY';
    if (latest.esgMaturity > 75) operationalCapacity = 'ELASTIC';
    else if (latest.esgMaturity < 40) operationalCapacity = 'OVERLOADED';

    let maxInterventions = 3;
    if (financialCapacity === 'STRONG' && governanceCapacity === 'MATURE' && operationalCapacity === 'ELASTIC') {
      maxInterventions = 5;
    } else if (financialCapacity === 'CRITICAL' || governanceCapacity === 'FRAGILE' || operationalCapacity === 'OVERLOADED') {
      maxInterventions = 1;
    }

    const capacityScore = Math.min(100, Math.round(((financialScore / 3) + (governanceScore / 2) + latest.esgMaturity) / 3));

    const confidenceLevel = snapshots.length >= 4 ? 'HIGH' : snapshots.length >= 2 ? 'MODERATE' : 'LOW';

    return {
      capacityScore,
      financialCapacity,
      operationalCapacity,
      governanceCapacity,
      maxConcurrentInterventions: maxInterventions,
      confidenceLevel,
      confidenceReason: `Assessment based on ${snapshots.length} historical cycles of financial, governance, and operational data.`
    };
  }
}
