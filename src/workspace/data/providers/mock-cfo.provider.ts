import { ExecutiveContext } from '../../context/executive-context.types';
import { 
  CfoIntelligenceProvider, 
  CfoPerformanceData, 
  CfoCashIntelligenceData, 
  CfoPlanningData,
  CfoWorkingCapitalData
} from '../types/cfo-intelligence.types';

/**
 * Deterministic Mock Provider for CFO Intelligence.
 * Returns slightly different data based on the context (e.g. month) to simulate a real engine.
 */
export class MockCfoProvider implements CfoIntelligenceProvider {
  
  async getPerformance(context: ExecutiveContext): Promise<CfoPerformanceData> {
    await new Promise(resolve => setTimeout(resolve, 600));

    // Make the data slightly deterministic based on the month
    const modifier = (context.period.month || 1) / 12;
    const baseRevenue = 1000000;
    const mockMetadata = {
      id: `snapshot-cfo-mock-tenant-${context.period.year}-${String(context.period.month).padStart(2, '0')}`,
      tenantId: 'cfo-mock-tenant',
      periodId: `${context.period.year}-${String(context.period.month).padStart(2, '0')}`,
      generatedAt: new Date().toISOString(),
      generatedBy: 'system:mock-engine',
      lastUpdatedAt: new Date().toISOString(),
      dataQuality: 'high' as const,
      confidenceScore: 92,
      version: 'v1',
      schemaVersion: '1.0.0',
      engineVersion: '1.0.0',
      providerVersion: '1.0.0',
      sourceVersion: '1.0.0',
      pipelineVersion: '1.0.0',
      calibrationVersion: '1.0.0',
      validationVersion: '1.0.0',
      snapshotHash: 'mock-hash',
      processingTime: 100,
      tenantSchemaVersion: '1.0.0',
      source: 'mock-engine',
      status: 'READY' as const
    };

    return {
      metadata: mockMetadata,
      revenue: {
        value: baseRevenue + (baseRevenue * modifier),
        trend: modifier > 0.5 ? 'up' : 'down',
        percentageChange: Number((modifier * 10).toFixed(1))
      },
      ebitda: {
        value: 280000 + (100000 * modifier),
        margin: 24 + (modifier * 5),
        trend: modifier > 0.5 ? 'up' : 'down'
      },
      cashFlow: {
        value: 120000 + (50000 * modifier),
        trend: 'neutral'
      },
      insights: [
        {
          id: 'insight-perf-1',
          title: 'Compressão de margem operacional',
          severity: 'warning',
          narrative: 'A margem operacional apresentou deterioração neste trimestre.',
          evidence: [
            'Margem caiu 3,2% em relação ao trimestre anterior',
            'Custos variáveis operacionais aumentaram 8%'
          ],
          impact: 'Risco de redução estimada de R$ 420 mil EBITDA anual se a tendência continuar.',
          recommendation: 'Revisar estrutura de custos fixos e contratos críticos de fornecedores.',
          confidence: 85,
          action: {
            label: 'Ver Análise de Custos',
            url: '/executive/workspace/cfo-office/profitability'
          }
        },
        {
          id: 'insight-perf-2',
          title: 'Crescimento de Receita B2B',
          severity: 'info',
          narrative: 'Crescimento de receita orgânica acima da projeção base no segmento corporativo.',
          evidence: [
            'Volume de vendas no canal direto subiu 12%',
            'Ticket médio aumentou 4,5%'
          ],
          impact: 'Aumento consistente do market share no segmento B2B enterprise.',
          recommendation: 'Acelerar investimentos em canais de aquisição de clientes deste segmento.',
          confidence: 92
        }
      ]
    };
  }

  async getCashIntelligence(context: ExecutiveContext): Promise<CfoCashIntelligenceData> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const mockMetadata = {
      id: `snapshot-cfo-mock-tenant-${context.period.year}-${String(context.period.month).padStart(2, '0')}`,
      tenantId: 'cfo-mock-tenant',
      periodId: `${context.period.year}-${String(context.period.month).padStart(2, '0')}`,
      generatedAt: new Date().toISOString(),
      generatedBy: 'system:mock-engine',
      lastUpdatedAt: new Date().toISOString(),
      dataQuality: 'high' as const,
      confidenceScore: 95,
      version: 'v1',
      schemaVersion: '1.0.0',
      engineVersion: '1.0.0',
      providerVersion: '1.0.0',
      sourceVersion: '1.0.0',
      pipelineVersion: '1.0.0',
      calibrationVersion: '1.0.0',
      validationVersion: '1.0.0',
      snapshotHash: 'mock-hash',
      processingTime: 100,
      tenantSchemaVersion: '1.0.0',
      source: 'mock-engine',
      status: 'READY' as const
    };

    return {
      metadata: mockMetadata,
      freeCashFlow: {
        value: 850000,
        trend: 'up'
      },
      liquidity: {
        risk: 'low',
        runwayDays: 145
      },
      forecast: {
        monthly: {
          'Mês 1': { inflows: 120000, outflows: -95000, netCash: 25000 },
          'Mês 2': { inflows: 130000, outflows: -110000, netCash: 20000 },
          'Mês 3': { inflows: 145000, outflows: -105000, netCash: 40000 }
        }
      },
      insights: [
        {
          id: 'insight-cash-1',
          title: 'Estabilidade de Caixa',
          severity: 'success',
          narrative: 'A posição de caixa atual suporta integralmente as obrigações de ciclo imediato.',
          evidence: [
            'Runway atual de 145 dias',
            'Inadimplência de recebíveis caiu para 2.1%'
          ],
          impact: 'Garante flexibilidade para antecipação de bônus ou distribuição de dividendos.',
          recommendation: 'Manter a política atual de recebimentos.',
          confidence: 95
        }
      ]
    };
  }

  async getPlanning(context: ExecutiveContext): Promise<CfoPlanningData> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const mockMetadata = {
      id: `snapshot-cfo-mock-tenant-${context.period.year}-${String(context.period.month).padStart(2, '0')}`,
      tenantId: 'cfo-mock-tenant',
      periodId: `${context.period.year}-${String(context.period.month).padStart(2, '0')}`,
      generatedAt: new Date().toISOString(),
      generatedBy: 'system:mock-engine',
      lastUpdatedAt: new Date().toISOString(),
      dataQuality: 'high' as const,
      confidenceScore: 88,
      version: 'v1',
      schemaVersion: '1.0.0',
      engineVersion: '1.0.0',
      providerVersion: '1.0.0',
      sourceVersion: '1.0.0',
      pipelineVersion: '1.0.0',
      calibrationVersion: '1.0.0',
      validationVersion: '1.0.0',
      snapshotHash: 'mock-hash',
      processingTime: 100,
      tenantSchemaVersion: '1.0.0',
      source: 'mock-engine',
      status: 'READY' as const
    };

    return {
      metadata: mockMetadata,
      budgetVariance: {
        value: -250000,
        percentage: -2.4
      },
      forecastVsTarget: {
        percentage: 0.98
      },
      scenarios: {
        'Jan': { actual: 100, budget: 110, forecast: 110 },
        'Fev': { actual: 115, budget: 110, forecast: 115 },
        'Mar': { actual: 105, budget: 110, forecast: 110 },
        'Abr': { actual: 120, budget: 115, forecast: 120 },
      },
      insights: [
        {
          id: 'insight-plan-1',
          title: 'Desvio Orçamentário',
          severity: 'warning',
          narrative: 'Identificamos um desvio orçamentário negativo no consolidado.',
          evidence: [
            'Capex estourou em 5% no último mês'
          ],
          impact: 'Atraso no payback de novos projetos.',
          recommendation: 'Realocar budget de marketing para absorver excesso.',
          confidence: 88
        }
      ]
    };
  }

  async getWorkingCapital(context: ExecutiveContext): Promise<CfoWorkingCapitalData> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const mockMetadata = {
      id: `snapshot-cfo-mock-tenant-${context.period.year}-${String(context.period.month).padStart(2, '0')}`,
      tenantId: 'cfo-mock-tenant',
      periodId: `${context.period.year}-${String(context.period.month).padStart(2, '0')}`,
      generatedAt: new Date().toISOString(),
      generatedBy: 'system:mock-engine',
      lastUpdatedAt: new Date().toISOString(),
      dataQuality: 'high' as const,
      confidenceScore: 88,
      version: 'v1',
      schemaVersion: '1.0.0',
      engineVersion: '1.0.0',
      providerVersion: '1.0.0',
      sourceVersion: '1.0.0',
      pipelineVersion: '1.0.0',
      calibrationVersion: '1.0.0',
      validationVersion: '1.0.0',
      snapshotHash: 'mock-hash',
      processingTime: 100,
      tenantSchemaVersion: '1.0.0',
      source: 'mock-engine',
      status: 'READY' as const
    };

    return {
      metadata: mockMetadata,
      receivables: {
        totalOutstanding: 1200000,
        overdueAmount: 85000,
        averageCollectionDays: 45
      },
      payables: {
        totalOutstanding: 850000,
        averagePaymentDays: 60
      },
      cashConversionCycle: {
        dso: 45,
        dio: 30,
        dpo: 60,
        cycleDays: 15
      },
      agingRisk: {
        severity: 'low',
        exposure: 85000
      },
      insights: [
        {
          id: 'insight-wc-1',
          title: 'Eficiência no Contas a Pagar',
          severity: 'success',
          narrative: 'O ciclo médio de pagamento (DPO) aumentou em 5 dias, melhorando o ciclo de caixa.',
          evidence: [
            'DPO passou de 55 para 60 dias'
          ],
          impact: 'Aumento do capital de giro líquido em R$ 120 mil.',
          recommendation: 'Manter a política de renegociação vigente.',
          confidence: 90
        }
      ]
    };
  }
}
