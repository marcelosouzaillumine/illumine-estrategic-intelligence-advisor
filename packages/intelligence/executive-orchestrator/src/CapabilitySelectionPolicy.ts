import { AgentDomainContext } from '@illumine/executive-contracts';

export class CapabilitySelectionPolicy {
  public static selectCapabilities(context: AgentDomainContext): string[] {
    const selected: string[] = ['executive-advisor'];

    if (context.agendaItem.intent.type === 'REDUCE_DEBT' || context.agendaItem.intent.type === 'IMPROVE_MARGIN') {
      selected.push('financial-intelligence', 'risk-intelligence');
    }
    if (context.agendaItem.intent.type === 'ACQUISITION_MA' || context.agendaItem.intent.type === 'EXPAND_MARKET') {
      selected.push('strategic-analysis', 'financial-intelligence', 'governance-intelligence');
    }
    if (context.agendaItem.intent.type === 'OPERATIONAL_EFFICIENCY') {
      selected.push('operational-intelligence', 'risk-intelligence');
    }

    return Array.from(new Set(selected));
  }
}
