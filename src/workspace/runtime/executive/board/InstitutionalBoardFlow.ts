export type BoardFlowStep = 
  | 'SUMMARY'
  | 'STRUCTURAL_TENSIONS'
  | 'ROOT_CAUSE'
  | 'PROPAGATION'
  | 'INSTITUTIONAL_RISKS'
  | 'EVIDENCE_CHAIN'
  | 'TIMELINE'
  | 'DRILLDOWN'
  | 'RECOMMENDATIONS';

export class InstitutionalBoardFlow {
  private static allowedTransitions: Record<BoardFlowStep, BoardFlowStep[]> = {
    'SUMMARY': ['STRUCTURAL_TENSIONS', 'TIMELINE'],
    'STRUCTURAL_TENSIONS': ['ROOT_CAUSE', 'EVIDENCE_CHAIN'],
    'ROOT_CAUSE': ['PROPAGATION', 'RECOMMENDATIONS'],
    'PROPAGATION': ['INSTITUTIONAL_RISKS', 'DRILLDOWN'],
    'INSTITUTIONAL_RISKS': ['RECOMMENDATIONS', 'TIMELINE'],
    'EVIDENCE_CHAIN': ['STRUCTURAL_TENSIONS', 'ROOT_CAUSE'],
    'TIMELINE': ['SUMMARY', 'STRUCTURAL_TENSIONS'],
    'DRILLDOWN': ['PROPAGATION'],
    'RECOMMENDATIONS': ['SUMMARY']
  };

  static assertValidTransition(current: BoardFlowStep, next: BoardFlowStep, hasEvidence: boolean, hasLineage: boolean) {
    const allowed = this.allowedTransitions[current] || [];
    
    if (!allowed.includes(next)) {
      throw new Error(`FLOW_VIOLATION: Cannot transition from ${current} to ${next}.`);
    }

    if (next === 'RECOMMENDATIONS' && current === 'SUMMARY') {
      throw new Error('FLOW_VIOLATION: Cannot skip from Summary to Recommendations without Root Cause analysis.');
    }

    if ((next === 'ROOT_CAUSE' || next === 'PROPAGATION') && !hasEvidence) {
      throw new Error('FLOW_VIOLATION: Cannot navigate to causality without Evidence Chain.');
    }

    if ((next === 'PROPAGATION' || next === 'DRILLDOWN') && !hasLineage) {
      throw new Error('FLOW_VIOLATION: Cannot navigate to propagation or drilldown without Lineage.');
    }
  }
}
