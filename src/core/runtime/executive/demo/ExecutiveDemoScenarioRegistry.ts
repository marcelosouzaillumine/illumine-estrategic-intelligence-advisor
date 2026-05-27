export interface TimelineEvent {
  phase: string;
  status: string;
  details: string;
}

export interface DemoScenario {
  scenarioId: string;
  scenarioVersion: string;
  title: string;
  description: string;
  tenantScope: string;
  topologyProfile: string;
  narrativeMode: string;
  runtimeSnapshotId: string;
  lineageIntegrityHash: string;
  evidenceIntegrityHash: string;
  disclosureRequirements: string[];
  activeViolations: Array<{
    violationId: string;
    severity: 'WARNING' | 'CRITICAL';
    message: string;
    sourceContext: string;
  }>;
  confidenceState: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNVERIFIED';
  timelineEvents: TimelineEvent[];
  recommendations: string[];
}

const REGISTRY: Record<string, DemoScenario> = {
  TURNAROUND: {
    scenarioId: 'TURNAROUND',
    scenarioVersion: '1.0.0',
    title: 'Strategic Turnaround Plan',
    description: 'Corporate turnaround demo with high data reliability.',
    tenantScope: 'demo-tenant-turnaround',
    topologyProfile: 'SINGLE_ENTITY',
    narrativeMode: 'Turnaround',
    runtimeSnapshotId: 'snap-turnaround-01',
    lineageIntegrityHash: 'lin-hash-turnaround-999',
    evidenceIntegrityHash: 'ev-hash-turnaround-999',
    disclosureRequirements: ['fiduciary-terms', 'data-provenance-ack'],
    activeViolations: [
      {
        violationId: 'V-01',
        severity: 'WARNING',
        message: 'Elevated leverage in short-term debt cycle',
        sourceContext: 'Treasury'
      }
    ],
    confidenceState: 'HIGH',
    timelineEvents: [
      { phase: 'Month 1', status: 'Stable', details: 'Core liquidity reserves initialized' },
      { phase: 'Month 2', status: 'Warning', details: 'Elevated leverage in short-term debt cycle' },
      { phase: 'Month 3', status: 'Stabilized', details: 'Turnaround parameters approved' }
    ],
    recommendations: [
      'Initialize short-term debt refinancing with target suppliers.',
      'Optimize working capital cycle by adjusting accounts receivable terms.',
      'Deploy corporate treasury buffer to stabilize cash flow index.'
    ]
  },
  ACCELERATED_GROWTH: {
    scenarioId: 'ACCELERATED_GROWTH',
    scenarioVersion: '1.0.0',
    title: 'Accelerated Growth Simulation',
    description: 'Expansion profile with medium confidence context.',
    tenantScope: 'demo-tenant-growth',
    topologyProfile: 'SINGLE_ENTITY',
    narrativeMode: 'Expansion',
    runtimeSnapshotId: 'snap-growth-01',
    lineageIntegrityHash: 'lin-hash-growth-888',
    evidenceIntegrityHash: 'ev-hash-growth-888',
    disclosureRequirements: ['growth-assumptions', 'fiduciary-terms'],
    activeViolations: [],
    confidenceState: 'MEDIUM',
    timelineEvents: [
      { phase: 'Month 1', status: 'Normal', details: 'Initial growth projection cycle' },
      { phase: 'Month 2', status: 'Normal', details: 'Working capital requirements aligned' }
    ],
    recommendations: [
      'Deploy working capital allocation to scale-stage operational assets.',
      'Establish capital structure milestones to support equity expansion.'
    ]
  },
  SYSTEMIC_CONTAGION: {
    scenarioId: 'SYSTEMIC_CONTAGION',
    scenarioVersion: '1.0.0',
    title: 'Systemic Stress Contagion',
    description: 'Holding multi-entity default and stress propagation.',
    tenantScope: 'demo-tenant-contagion',
    topologyProfile: 'MULTI_ENTITY',
    narrativeMode: 'Distress',
    runtimeSnapshotId: 'snap-contagion-01',
    lineageIntegrityHash: 'lin-hash-contagion-777',
    evidenceIntegrityHash: 'ev-hash-contagion-777',
    disclosureRequirements: ['contagion-disclaimer', 'fiduciary-terms'],
    activeViolations: [
      {
        violationId: 'V-02',
        severity: 'CRITICAL',
        message: 'Systemic contagion propagation to holding company',
        sourceContext: 'Holding-Finances'
      }
    ],
    confidenceState: 'LOW',
    timelineEvents: [
      { phase: 'Month 1', status: 'Stable', details: 'Sub-company liquidity initial state' },
      { phase: 'Month 2', status: 'Warning', details: 'Deterioration of sub-entity solvency indices' },
      { phase: 'Month 3', status: 'Contagion', details: 'Stress propagation to holding balances' }
    ],
    recommendations: [
      'Enforce intercompany elimination protocol on default exposures.',
      'Trigger structural liquidity injections from parent entity.'
    ]
  },
  CASH_COLLAPSE: {
    scenarioId: 'CASH_COLLAPSE',
    scenarioVersion: '1.0.0',
    title: 'Cash Runway Collapse',
    description: 'Severe cash flow deterioration.',
    tenantScope: 'demo-tenant-collapse',
    topologyProfile: 'SINGLE_ENTITY',
    narrativeMode: 'Distress',
    runtimeSnapshotId: 'snap-collapse-01',
    lineageIntegrityHash: 'lin-hash-collapse-666',
    evidenceIntegrityHash: 'ev-hash-collapse-666',
    disclosureRequirements: ['insolvency-warning', 'fiduciary-terms'],
    activeViolations: [
      {
        violationId: 'V-03',
        severity: 'CRITICAL',
        message: 'Runway drops below 30 days under current trend',
        sourceContext: 'Cash-Flow'
      }
    ],
    confidenceState: 'LOW',
    timelineEvents: [
      { phase: 'Month 1', status: 'Warning', details: 'Working capital buffer depletion starts' },
      { phase: 'Month 2', status: 'Critical', details: 'Runway falls below 30-day structural threshold' }
    ],
    recommendations: [
      'Emergency debt restructuring of short-term payables.',
      'Freeze all non-essential operational capital expenditures.'
    ]
  }
};

export class ExecutiveDemoScenarioRegistry {
  public static getScenario(scenarioId: string): DemoScenario | null {
    const scenario = REGISTRY[scenarioId];
    if (!scenario) return null;
    // Return frozen copy to enforce immutability
    return Object.freeze(JSON.parse(JSON.stringify(scenario)));
  }

  public static getAllScenarios(): DemoScenario[] {
    return Object.keys(REGISTRY).map(key => this.getScenario(key)!);
  }
}
