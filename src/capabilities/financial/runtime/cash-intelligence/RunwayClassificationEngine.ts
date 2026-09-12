export type FiduciaryRunwayClassification = 'CONFORTAVEL' | 'ADEQUADO' | 'ATENCAO' | 'CRITICO' | 'EMERGENCIAL';

export class RunwayClassificationEngine {
  /**
   * Classifica o runway fiduciário conforme as regras do DEEFF v1.0.
   */
  public static classify(runwayMonths: number): FiduciaryRunwayClassification {
    if (runwayMonths >= 12) return 'CONFORTAVEL';
    if (runwayMonths >= 6) return 'ADEQUADO';
    if (runwayMonths >= 3) return 'ATENCAO';
    if (runwayMonths >= 1) return 'CRITICO';
    return 'EMERGENCIAL';
  }

  public static getLabel(classification: FiduciaryRunwayClassification): string {
    const labels = {
      CONFORTAVEL: 'Confortável',
      ADEQUADO: 'Adequado',
      ATENCAO: 'Atenção',
      CRITICO: 'Crítico',
      EMERGENCIAL: 'Emergencial'
    };
    return labels[classification];
  }
}
