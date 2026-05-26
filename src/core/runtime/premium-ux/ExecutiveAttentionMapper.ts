import { AttentionMapEntry } from './PremiumUXTypes';

export class ExecutiveAttentionMapper {
  static mapForCFO(): AttentionMapEntry[] {
    return [
      { section: 'Early Warning Alerts', priorityWeight: 0.95, cognitiveLoad: 0.30, actionable: true },
      { section: 'Institutional Pulse', priorityWeight: 0.88, cognitiveLoad: 0.35, actionable: false },
      { section: 'Pending Workflow Approvals', priorityWeight: 0.90, cognitiveLoad: 0.25, actionable: true },
      { section: 'Strategic Simulation Results', priorityWeight: 0.72, cognitiveLoad: 0.60, actionable: false },
      { section: 'Benchmarking Summary', priorityWeight: 0.55, cognitiveLoad: 0.45, actionable: false },
      { section: 'Knowledge Graph Links', priorityWeight: 0.30, cognitiveLoad: 0.80, actionable: false }
    ];
  }

  static mapForBoard(): AttentionMapEntry[] {
    return [
      { section: 'Executive Summary', priorityWeight: 0.99, cognitiveLoad: 0.15, actionable: false },
      { section: 'Risk Level Indicators', priorityWeight: 0.95, cognitiveLoad: 0.20, actionable: false },
      { section: 'Governance Actions Required', priorityWeight: 0.92, cognitiveLoad: 0.25, actionable: true },
      { section: 'Financial Health Score', priorityWeight: 0.88, cognitiveLoad: 0.20, actionable: false },
      { section: 'Operational Projections', priorityWeight: 0.65, cognitiveLoad: 0.40, actionable: false }
    ];
  }
}
