import { ExecutiveFeedContract, ExecutiveFeedItemContract } from '@illumine/executive-contracts';
import { ExecutiveSignalContract } from '@illumine/executive-contracts';

export class ExecutiveFeedEngine {
  public static buildFeed(companyId: string, signals: ExecutiveSignalContract[]): ExecutiveFeedContract {
    const items: ExecutiveFeedItemContract[] = [
      {
        itemId: 'feed-01',
        timestampIso: new Date().toISOString(),
        timeFormatted: '08:14',
        title: 'Caixa Operacional Estabilizado',
        summaryText: 'Liquidez com cobertura de 42 dias garantida.',
        category: 'FINANCIAL',
        explanationText: 'Monitoramento automatizado EDIF v1.0.'
      },
      {
        itemId: 'feed-02',
        timestampIso: new Date().toISOString(),
        timeFormatted: '09:20',
        title: 'Alerta de Risco: Cliente Alpha',
        summaryText: 'Recebível vencido necessita de renegociação.',
        category: 'COMPLIANCE',
        signal: signals.find((s) => s.severity === 'IMPORTANT'),
        explanationText: 'Classificado como Importante por impactar giro de caixa.'
      },
      {
        itemId: 'feed-03',
        timestampIso: new Date().toISOString(),
        timeFormatted: '10:35',
        title: 'Crescimento de Receita Recorrente +8.5%',
        summaryText: 'Expansão de contratos no modelo ERL v1.0.',
        category: 'REVENUE',
        signal: signals.find((s) => s.severity === 'OPPORTUNITY'),
        explanationText: 'Oportunidade de consolidação de margem.'
      },
      {
        itemId: 'feed-04',
        timestampIso: new Date().toISOString(),
        timeFormatted: '14:10',
        title: 'Homologação do Plano Estratégico',
        summaryText: 'Conselho Fiduciário aprovou expansão anual.',
        category: 'GOVERNANCE',
        signal: signals.find((s) => s.severity === 'CELEBRATION'),
        explanationText: 'Marco de celebração de governança corporativa.'
      }
    ];

    return {
      feedId: `feed-sys-${companyId}-${Date.now()}`,
      companyId,
      items,
      totalItemsCount: items.length,
      generatedAt: new Date().toISOString()
    };
  }
}
