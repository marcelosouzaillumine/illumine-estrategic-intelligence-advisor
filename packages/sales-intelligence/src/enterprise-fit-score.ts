export interface EnterpriseFitResult {
  companyName: string;
  fitScore: number; // 0 a 100
  qualificationStatus: 'QUALIFIED_FOUNDING_PARTNER' | 'NURTURE' | 'UNQUALIFIED';
  keyDrivers: string[];
}

export class EnterpriseFitScoreEngine {
  public static evaluateFit(companyName: string, annualRevenueBrl: number): EnterpriseFitResult {
    const isQualified = annualRevenueBrl >= 20000000;
    return {
      companyName,
      fitScore: isQualified ? 94 : 65,
      qualificationStatus: isQualified ? 'QUALIFIED_FOUNDING_PARTNER' : 'NURTURE',
      keyDrivers: [
        'Faturamento anual compatível com o perfil Enterprise',
        'Complexidade de governança multi-divisão',
        'Necessidade de simulação preditiva de capital de giro'
      ]
    };
  }
}
