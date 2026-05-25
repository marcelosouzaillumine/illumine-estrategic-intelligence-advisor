import { ExecutiveJourney } from './UXGovernanceTypes';

export class ExecutiveJourneyMapper {
  static mapJourney(role: 'CFO' | 'CONTROLLER' | 'BOARD_MEMBER' | 'ADVISOR'): ExecutiveJourney {
    return {
      journeyId: 'JRN-' + Date.now(),
      role,
      steps: ['Login', 'Dashboard View', 'Early Warning Check', 'Approval Workflow'],
      frictionPoints: ['Too many clicks to approve'],
      complexityScore: 0.4
    };
  }
}
