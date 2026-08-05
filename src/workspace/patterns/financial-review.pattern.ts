import { WorkspacePatternDefinition } from '../types';

export const FinancialReviewPattern: WorkspacePatternDefinition = {
  id: 'financial-review-pattern',
  name: 'Financial Review',
  description: 'Padrão executivo para análise de performance financeira e operacionais.',
  layout: {
    id: 'financial-review-layout',
    type: 'grid',
    slots: [
      {
        id: 'metrics-row',
        area: 'top',
        order: 1,
        widgets: [
          {
            id: 'revenue-metric-inst',
            widgetId: 'metric-widget',
            config: { title: 'Receita Líquida', format: 'currency', color: 'primary', trend: 'up' },
            dataBinding: { source1: 'financial.revenue.net' },
            interactionMode: 'readonly',
            refreshPolicy: 'never',
            priority: 1
          },
          {
            id: 'ebitda-metric-inst',
            widgetId: 'metric-widget',
            config: { title: 'EBITDA', format: 'currency', color: 'success', trend: 'up' },
            dataBinding: { source1: 'financial.ebitda' },
            interactionMode: 'readonly',
            refreshPolicy: 'never',
            priority: 2
          },
          {
            id: 'margin-metric-inst',
            widgetId: 'metric-widget',
            config: { title: 'Margem EBITDA', format: 'percent', color: 'warning', trend: 'down' },
            dataBinding: { source1: 'financial.margin.ebitda' },
            interactionMode: 'readonly',
            refreshPolicy: 'never',
            priority: 3
          }
        ]
      },
      {
        id: 'narrative-panel',
        area: 'center',
        order: 2,
        widgets: [
          {
            id: 'financial-narrative-inst',
            widgetId: 'executive-narrative-widget',
            config: { title: 'Briefing Executivo' },
            dataBinding: { narrative: 'financial.narrative.quarter' },
            interactionMode: 'readonly',
            refreshPolicy: 'never',
            priority: 1
          }
        ]
      },
      {
        id: 'decision-panel',
        area: 'right',
        order: 3,
        widgets: [
          {
            id: 'pricing-decision-inst',
            widgetId: 'decision-card-widget', // we need to register this
            config: { title: 'Ajuste de Precificação' },
            dataBinding: { decision: 'decisions.pricing.q3' },
            interactionMode: 'interactive',
            refreshPolicy: 'never',
            priority: 1
          }
        ]
      }
    ]
  }
};
