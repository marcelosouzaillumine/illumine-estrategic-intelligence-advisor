import React, { useEffect } from 'react';
import { BaseWidgetProps, WidgetDefinition } from '../../../workspace/types';
import { CAPABILITIES } from '../../../domain/authorization/Capabilities';
import { widgetRegistry } from './WidgetRegistry';

// 1. The component itself
export function MetricWidget({ instance, data }: BaseWidgetProps) {
  // Simple rendering of the mock data
  const title = instance.config.title || 'Metric';
  const val = data?.source1?.data || 'No data';

  return (
    <div className="flex flex-col p-6 w-full h-full justify-center items-center relative group">
      <h3 className="text-sm font-semibold text-white/50 tracking-widest uppercase mb-2">{title}</h3>
      <div className="text-4xl font-bold tracking-tighter text-white">
        {val}
      </div>
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-xl" />
    </div>
  );
}

// 2. The definition
export const METRIC_WIDGET_DEF: WidgetDefinition = {
  id: 'metric-widget',
  titleKey: 'widgets.metric.title',
  descriptionKey: 'widgets.metric.description',
  category: 'metric',
  version: '1.0.0',
  supportedOffices: ['cfo-office', 'ceo-office'], // just examples
  supportedCapabilities: [CAPABILITIES.EXECUTIVE_WORKSPACE_VIEW],
  supportedLayouts: ['grid', 'stack'],
  requiredDataSources: ['*'], // could be dynamic
  requiredPermissions: [CAPABILITIES.EXECUTIVE_WORKSPACE_VIEW],
  component: MetricWidget
};

// Auto-register (in a real app you'd do this centrally)
// We'll call this in a centralized place or let the module load handle it
