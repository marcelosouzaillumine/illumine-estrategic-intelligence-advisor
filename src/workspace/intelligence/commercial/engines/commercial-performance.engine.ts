import { CommercialPerformanceData } from '../../../data/types/commercial-intelligence.types';
import { ExecutiveContext } from '../../../context/executive-context.types';

export class CommercialPerformanceEngine {
  async evaluate(context: ExecutiveContext): Promise<Omit<CommercialPerformanceData, 'metadata'>> {
    const actual = 8500000;
    const target = 10000000;
    
    return {
      revenue: {
        actual,
        target,
        yoyGrowth: 0.15
      },
      metrics: {
        averageTicket: 45000,
        marginPerCustomer: 0.35,
        recurringRevenueRatio: 0.65
      },
      insights: [
        {
          id: 'comm-perf-1',
          title: 'Desvio de Meta de Receita',
          severity: 'warning',
          narrative: 'A receita do trimestre está crescendo 15% YoY, mas ainda 15% abaixo da meta.',
          evidence: ['Fechamento Q3 em R$ 8.5M vs meta R$ 10M'],
          impact: 'Risco no budget consolidado anual.',
          recommendation: 'Acelerar fechamentos de deals em Late Stage (Pipeline).'
        }
      ]
    };
  }
}
