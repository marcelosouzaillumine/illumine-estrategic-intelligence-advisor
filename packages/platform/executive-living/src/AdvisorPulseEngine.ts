export class AdvisorPulseEngine {
  public static generateAdvisorPulse(advisorName: string) {
    return {
      advisorName,
      activePortfolioCount: 18,
      criticalClientsCount: 1,
      clientsAwaitingInteractionCount: 5,
      potentialRevenueImpactFormatted: 'R$ 12,4 milhões',
      recommendedAgenda: [
        'Atendimento Prioritário ao Hospital ABC (Risco de Inadimplência)',
        'Revisão de Margem do Cliente Beta',
        'Homologação de Proposta de Expansão no Cliente Gama'
      ],
      estimatedTimeFormatted: '2h40',
      portfolioHealthRankPercent: 94
    };
  }
}
