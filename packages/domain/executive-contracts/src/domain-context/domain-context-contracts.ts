import { Identifier } from '@illumine/core-primitives';

export type ExecutiveIntentType =
  | 'REDUCE_DEBT'
  | 'EXPAND_MARKET'
  | 'ACQUISITION_MA'
  | 'IMPROVE_MARGIN'
  | 'INTERNATIONALIZE'
  | 'SUCCESSION_PLAN'
  | 'IPO_PREPARATION'
  | 'OPERATIONAL_EFFICIENCY';

export interface ExecutiveIntent {
  readonly intentId: Identifier;
  readonly type: ExecutiveIntentType;
  readonly description: string;
  readonly targetKpiCodes: string[];
  readonly priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

export interface BoardAgendaItem {
  readonly agendaItemId: Identifier;
  readonly title: string;
  readonly topic: string;
  readonly intent: ExecutiveIntent;
}

export interface AgentDomainContext {
  readonly tenantId: Identifier;
  readonly companyName: string;
  readonly period: string;
  readonly agendaItem: BoardAgendaItem;
  readonly rawDomainData: Record<string, unknown>;
}
