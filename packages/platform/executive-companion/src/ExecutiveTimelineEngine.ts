import { ExecutiveTimelineContract } from '@illumine/executive-contracts';

export class ExecutiveTimelineEngine {
  public static buildTimeline(companyId: string): ExecutiveTimelineContract {
    return {
      timelineId: `tml-${companyId}-${Date.now()}`,
      companyId,
      events: [
        {
          eventId: 'evt-01',
          dateIso: '2025-01-15',
          title: 'Implantação da Illumine OS™ & Diagnóstico Inicial',
          impactDescription: 'Mapeamento de 148 indicadores e identificação de alavancas de liquidez.',
          category: 'GOVERNANCE',
          responsiblePersonName: 'Conselho Executivo',
          valueGeneratedFormatted: 'Base Canônica Instalada',
          keyLearningText: 'Dados centralizados reduzem o tempo de análise em 80%.'
        },
        {
          eventId: 'evt-02',
          dateIso: '2025-04-10',
          title: 'Primeira Linha de Governança & Conselho Fiduciário',
          impactDescription: 'Instalação do Conselho de Administração com deliberações auditáveis.',
          category: 'GOVERNANCE',
          responsiblePersonName: 'CEO & Conselho',
          valueGeneratedFormatted: 'Governança Certificada',
          keyLearningText: 'Decisões aprovadas no conselho possuem 95% de taxa de execução.'
        },
        {
          eventId: 'evt-03',
          dateIso: '2025-08-20',
          title: 'Primeiro ROI Comprovado & Preservação de Caixa',
          impactDescription: 'Renegociação de contratos SG&A e otimização de ciclo financeiro.',
          category: 'ROI',
          responsiblePersonName: 'CFO & Advisor',
          valueGeneratedFormatted: 'R$ 4.800.000,00',
          keyLearningText: 'Redução gradual de insumos preserva mais caixa do que cortes abruptos.'
        }
      ],
      totalEventsCount: 3
    };
  }
}
