import { EnterpriseIntelligenceProvider } from '../enterprise-intelligence.provider';
import { EnterpriseInsight } from '../../models/enterprise-insight.types';
import { EnterpriseGraph } from '../../core/graph/EnterpriseGraph';
import { GraphBuilder } from '../../orchestration/builders/graph.builder';

export class MockEnterpriseIntelligenceProvider implements EnterpriseIntelligenceProvider {
  
  async loadEnterpriseGraph(): Promise<EnterpriseGraph> {
    const builder = new GraphBuilder();

    // Context & Offices
    builder.buildNode('ceo', 'CEO Office', 'OFFICE');
    builder.buildNode('cfo', 'CFO Office', 'OFFICE');
    builder.buildNode('coo', 'COO Office', 'OFFICE');
    builder.buildNode('people', 'People Office', 'OFFICE');
    builder.buildNode('risk', 'Risk & Compliance', 'OFFICE');

    // Metrics / Concepts
    builder.buildNode('met-margin', 'EBITDA Margin', 'METRIC');
    builder.buildNode('met-efficiency', 'Operational Efficiency', 'METRIC');
    builder.buildNode('met-turnover', 'Logistics Turnover', 'METRIC');
    builder.buildNode('risk-vendor', 'Vendor X Dependency', 'BUSINESS_CONTEXT');

    // Causal Links
    builder.buildEdge('risk-vendor', 'met-efficiency', 'INFLUENCES', 0.9, 0.8);
    builder.buildEdge('met-turnover', 'met-efficiency', 'CAUSES', 0.85, 0.7);
    builder.buildEdge('met-efficiency', 'met-margin', 'INFLUENCES', 0.95, 0.9);

    return builder.getGraph();
  }

  async getPriorityInsights(): Promise<EnterpriseInsight[]> {
    return [
      {
        id: 'ent-insight-001',
        title: 'A margem EBITDA caiu 4.5% no trimestre',
        narrative: 'A compressão de margem está diretamente ligada à perda de eficiência operacional no CD Principal, agravada por alto turnover e dependência de um fornecedor crítico em atraso.',
        sourceOffice: 'cfo',
        affectedOffices: ['coo', 'people', 'risk', 'commercial'],
        evidence: [
          { id: 'ev1', metricId: 'met-margin', metricName: 'EBITDA Margin', value: '-4.5%', trend: 'down', timestamp: new Date().toISOString() },
          { id: 'ev2', metricId: 'met-efficiency', metricName: 'Operational Efficiency', value: '-12%', trend: 'down', timestamp: new Date().toISOString() }
        ],
        causalHypothesis: [
          {
            id: 'hyp-1',
            description: 'Logistics Turnover is causing Operational Efficiency drop',
            sourceNodeId: 'met-turnover',
            targetNodeId: 'met-efficiency',
            confidenceScore: 0.85
          }
        ],
        businessImpact: {
          severity: 'critical',
          description: 'Alta probabilidade de deterioração do resultado trimestral.',
          affectedMetrics: ['met-margin', 'met-efficiency']
        },
        recommendedActions: [
          {
            id: 'rec-1',
            action: 'Revisar política comercial e capacidade operacional emergencial.',
            expectedOutcome: 'Estancar perda de eficiência.',
            targetOffice: 'ceo',
            priority: 'critical'
          }
        ],
        confidenceScore: 0.89,
        lifecycle: 'ANALYZING',
        detectedAt: new Date().toISOString(),
        lastUpdatedAt: new Date().toISOString()
      }
    ];
  }

  async registerInsight(insight: EnterpriseInsight): Promise<void> {
    console.log('[MockProvider] Insight Registered:', insight.title);
  }
}
