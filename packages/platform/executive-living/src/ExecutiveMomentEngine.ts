import { ExecutiveMomentContract } from '@illumine/executive-contracts';

export class ExecutiveMomentEngine {
  public static detectMoments(companyId: string, isRealDataAvailable: boolean = false): ExecutiveMomentContract[] {
    return [
      {
        momentId: 'mom-01',
        title: 'Instalação do Primeiro Conselho Fiduciário',
        milestoneDescription: 'Formalização das sessões de governança com deliberações auditáveis.',
        significanceText: 'Estabelecimento da maturidade de governança corporativa enterprise.',
        impactSummaryText: 'Transparência para acionistas e rastreabilidade fiduciária.',
        keyLearningText: 'Decisões formalizadas no Conselho possuem 95% de taxa de conclusão.',
        recommendedNextObjectiveText: 'Expandir o comitê de auditoria interna.',
        achievedDateIso: '2025-04-10',
        isSimulatedBenchmark: !isRealDataAvailable
      },
      {
        momentId: 'mom-02',
        title: '100 Decisões Executivas Registradas',
        milestoneDescription: 'Atingida a marca histórica de 100 deliberações rastreáveis na plataforma.',
        significanceText: 'Consolidação da memória institucional e eliminação do esquecimento organizacional.',
        impactSummaryText: 'Base sólida de aprendizado corporativo e sabedoria acumulada.',
        keyLearningText: 'A documentação de razões decisórias aumenta a previsibilidade de resultados.',
        recommendedNextObjectiveText: 'Atingir 300 decisões registradas.',
        achievedDateIso: '2025-11-20',
        isSimulatedBenchmark: !isRealDataAvailable
      }
    ];
  }
}
