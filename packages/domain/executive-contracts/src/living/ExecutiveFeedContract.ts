import { ExecutiveSignalContract } from './ExecutiveSignalContract';

export interface ExecutiveFeedItemContract {
  readonly itemId: string;
  readonly timestampIso: string;
  readonly timeFormatted: string; // e.g. "08:14"
  readonly title: string;
  readonly summaryText: string;
  readonly category: 'GOVERNANCE' | 'FINANCIAL' | 'ADVISORY' | 'REVENUE' | 'COMPLIANCE';
  readonly signal?: ExecutiveSignalContract;
  readonly explanationText: string;
}

export interface ExecutiveFeedContract {
  readonly feedId: string;
  readonly companyId: string;
  readonly items: readonly ExecutiveFeedItemContract[];
  readonly totalItemsCount: number;
  readonly generatedAt: string;
}
