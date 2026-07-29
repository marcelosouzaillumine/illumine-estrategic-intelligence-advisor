import { Identifier } from '@illumine/core-primitives';
import { ExecutiveInsight } from '@illumine/executive-insight-engine';

export interface ExecutiveInboxItem {
  readonly itemId: Identifier;
  readonly insight: ExecutiveInsight;
  readonly status: 'NEW' | 'REVIEWED' | 'DISMISSED';
}

export class AutonomousAdvisoryCenter {
  private readonly inbox: ExecutiveInboxItem[] = [];

  public addInsightToInbox(insight: ExecutiveInsight): void {
    this.inbox.push({
      itemId: `inbox-${insight.insightId}`,
      insight,
      status: 'NEW'
    });
  }

  public getInboxItems(): readonly ExecutiveInboxItem[] {
    return this.inbox;
  }
}
