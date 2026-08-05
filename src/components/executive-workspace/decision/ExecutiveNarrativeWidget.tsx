import React from 'react';
import { BaseWidgetProps } from '../../../workspace/types';
import { ExecutiveCard } from '../foundation/ExecutiveCard';
import { NarrativeProvider } from './NarrativeProvider';
import { NarrativeRenderer } from './NarrativeRenderer';
import { Sparkles } from 'lucide-react';

export function ExecutiveNarrativeWidget({ instance, data }: BaseWidgetProps) {
  // In a real scenario, blocks come from data or an AI engine.
  // We'll mock it for the demo if it's not present.
  
  const title = instance.config.title || 'Executive Summary';
  
  const blocks = data?.narrative?.blocks || [
    { type: 'highlight', content: 'Receita cresceu 8,2% no trimestre impulsionada por novos contratos.' },
    { type: 'warning', content: 'Entretanto, a margem operacional caiu 2,1%.' },
    { type: 'paragraph', content: 'O principal fator foi o aumento do CMV nas operações do sul.' },
    { type: 'highlight', content: 'Recomenda-se revisar a política de compras.' }
  ];

  return (
    <ExecutiveCard className="p-5 h-full">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
      </div>
      
      <NarrativeProvider blocks={blocks}>
        <NarrativeRenderer />
      </NarrativeProvider>
    </ExecutiveCard>
  );
}

import { WidgetDefinition } from '../../../workspace/types';
import { CAPABILITIES } from '../../../domain/authorization/Capabilities';

export const EXECUTIVE_NARRATIVE_WIDGET_DEF: WidgetDefinition = {
  id: 'executive-narrative-widget',
  titleKey: 'widgets.narrative.title',
  descriptionKey: 'widgets.narrative.description',
  category: 'narrative',
  version: '1.0.0',
  supportedOffices: ['*'],
  supportedCapabilities: [CAPABILITIES.EXECUTIVE_WORKSPACE_VIEW],
  supportedLayouts: ['grid', 'stack'],
  requiredDataSources: ['*'],
  requiredPermissions: [CAPABILITIES.EXECUTIVE_WORKSPACE_VIEW],
  component: ExecutiveNarrativeWidget
};
