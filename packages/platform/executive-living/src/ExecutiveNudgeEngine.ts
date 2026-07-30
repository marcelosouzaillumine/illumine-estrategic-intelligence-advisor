import { ExecutiveNudgeContract } from '@illumine/executive-contracts';

export class ExecutiveNudgeEngine {
  public static generateDiscreetNudges(companyId: string): ExecutiveNudgeContract[] {
    // Máximo 3 Nudges discretos por dia
    return [
      {
        nudgeId: 'ndg-01',
        reasonText: 'Você possui uma deliberação estratégica do Conselho aguardando aprovação final.',
        expectedBenefitText: 'Garantia de conformidade no cronograma trimestral.',
        suggestedActionText: 'Revisar Ata de Homologação do Conselho',
        impactLevel: 'HIGH',
        priorityRank: 1
      },
      {
        nudgeId: 'ndg-02',
        reasonText: 'Hoje é um momento propício para calibrar a projeção de fluxo de caixa quinzenal.',
        expectedBenefitText: 'Mitigação antecipada de variações em SG&A.',
        suggestedActionText: 'Executar Simulação de Liquidez',
        impactLevel: 'MODERATE',
        priorityRank: 2
      },
      {
        nudgeId: 'ndg-03',
        reasonText: 'Existem 2 clientes na carteira advisory sem interação cadastrada há 15 dias.',
        expectedBenefitText: 'Manutenção do Relationship Health Score acima de 95.',
        suggestedActionText: 'Agendar Contato de Acompanhamento',
        impactLevel: 'MODERATE',
        priorityRank: 3
      }
    ];
  }
}
