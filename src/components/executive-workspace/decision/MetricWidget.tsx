import React from 'react';
import { BaseWidgetProps, WidgetDefinition } from '../../../workspace/types';
import { CAPABILITIES } from '../../../domain/authorization/Capabilities';
import { ExecutiveCard } from '../foundation/ExecutiveCard';

export function MetricWidget({ instance, data }: BaseWidgetProps) {
  const title = instance.config.title || 'Metric';
  const format = instance.config.format || 'text'; // e.g. currency, percentage
  const color = instance.config.color || 'primary';
  const trend = instance.config.trend || 'neutral';
  
  const val = data?.source1?.data || '---';

  const colorClasses: Record<string, string> = {
    primary: 'text-primary',
    success: 'text-green-500',
    destructive: 'text-destructive',
    warning: 'text-amber-500'
  };

  return (
    <ExecutiveCard className="p-6 h-full flex flex-col justify-center items-center text-center">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-2">
        {title}
      </h3>
      <div className={`text-4xl font-bold tracking-tighter ${colorClasses[color] || 'text-foreground'}`}>
        {val}
      </div>
    </ExecutiveCard>
  );
}

export const METRIC_WIDGET_DEF_V2: WidgetDefinition = {
  id: 'metric-widget',
  titleKey: 'widgets.metric.title',
  descriptionKey: 'widgets.metric.description',
  category: 'metric',
  version: '2.0.0',
  supportedOffices: ['*'],
  supportedCapabilities: [CAPABILITIES.EXECUTIVE_WORKSPACE_VIEW],
  supportedLayouts: ['grid', 'stack'],
  requiredDataSources: ['*'],
  requiredPermissions: [CAPABILITIES.EXECUTIVE_WORKSPACE_VIEW],
  component: MetricWidget
};
