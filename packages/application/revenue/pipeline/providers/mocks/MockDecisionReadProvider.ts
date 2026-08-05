import { IDecisionReadProvider } from '../IDecisionReadProvider';
import { TimelineReadModel } from '../../read-models/TimelineReadModel';
export class MockDecisionReadProvider implements IDecisionReadProvider {
  async getDecisionTimeline(leadId: string): Promise<TimelineReadModel[]> {
    return [
      { id: 't1', stage: 'Technical Review', date: 'Oct 12', status: 'completed' },
      { id: 't2', stage: 'Board Approval', date: 'Oct 20', status: 'current' }
    ];
  }
}