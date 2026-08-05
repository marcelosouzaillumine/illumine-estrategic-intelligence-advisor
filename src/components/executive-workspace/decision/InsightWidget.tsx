import React from 'react';
import { BaseWidgetProps, WidgetDefinition } from '../../../workspace/types';
import { CAPABILITIES } from '../../../domain/authorization/Capabilities';
import { ExecutiveCard } from '../foundation/ExecutiveCard';
import { Lightbulb } from 'lucide-react';

export function InsightWidget({ instance, data }: BaseWidgetProps) {
  const title = instance.config.title || 'Insight';
  const insightText = data?.source1?.insight || 'Nenhum insight gerado para este contexto.';
  
  return (
    <ExecutiveCard className="p-5 h-full flex flex-col gap-2 border-primary/20 bg-primary/5">
      <div className="flex items-center gap-2 text-primary">
        <Lightbulb className="w-5 h-5" />
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-foreground mt-2">{insightText}</p>
    </ExecutiveCard>
  );
}

export const INSIGHT_WIDGET_DEF_V2: WidgetDefinition = {
  id: 'insight-widget',
  titleKey: 'widgets.insight.title',
  descriptionKey: 'widgets.insight.description',
  category: 'insight',
  version: '2.0.0',
  supportedOffices: ['*'],
  supportedCapabilities: [CAPABILITIES.EXECUTIVE_WORKSPACE_VIEW],
  supportedLayouts: ['grid', 'stack'],
  requiredDataSources: ['*'],
  requiredPermissions: [CAPABILITIES.EXECUTIVE_WORKSPACE_VIEW],
  component: InsightWidget
};
