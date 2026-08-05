import React from 'react';
import { BaseWidgetProps, WidgetDefinition } from '../../../workspace/types';
import { CAPABILITIES } from '../../../domain/authorization/Capabilities';
import { DecisionCard } from './DecisionCard';

export function DecisionCardWidget({ instance, data }: BaseWidgetProps) {
  const title = instance.config.title || 'Decision';
  
  const decision = data?.decision || {
    status: 'neutral',
    context: 'Contexto não fornecido.',
    evidence: [],
    impact: 'Sem impacto mapeado.',
    confidence: 'low',
    urgency: 'long-term',
    priority: 'low',
    origin: 'Sistema',
    owner: 'Não atribuído',
    recommendation: 'Aguardando dados.',
    action: 'Nenhuma ação'
  };

  return (
    <div className="h-full w-full">
      <DecisionCard title={title} decision={decision} />
    </div>
  );
}

export const DECISION_CARD_WIDGET_DEF: WidgetDefinition = {
  id: 'decision-card-widget',
  titleKey: 'widgets.decision.title',
  descriptionKey: 'widgets.decision.description',
  category: 'recommendation',
  version: '1.0.0',
  supportedOffices: ['*'],
  supportedCapabilities: [CAPABILITIES.EXECUTIVE_WORKSPACE_VIEW],
  supportedLayouts: ['grid', 'stack'],
  requiredDataSources: ['*'],
  requiredPermissions: [CAPABILITIES.EXECUTIVE_WORKSPACE_VIEW],
  component: DecisionCardWidget
};
