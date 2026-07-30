import { AdvisorLegacyContract } from '@illumine/executive-contracts';

export class AdvisorLegacyEngine {
  public static buildAdvisorLegacy(advisorName: string): AdvisorLegacyContract {
    const orgs = 18;
    const days = 90;
    const cash = 'R$ 12,4 milhões';

    return {
      legacyId: `adv-leg-${Date.now()}`,
      activeOrganizationsCount: orgs,
      daysInAdvisoryPeriod: days,
      totalCashPreservedValueFormatted: cash,
      legacyNarrativeText: `Você acompanha ${orgs} organizações. Nos últimos ${days} dias suas recomendações ajudaram seus clientes a preservar aproximadamente ${cash} em caixa. Esse é o impacto que sua atuação gera.`
    };
  }
}
