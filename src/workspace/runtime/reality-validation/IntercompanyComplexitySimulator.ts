import { GoldenDatasetProfile, IntercompanyLink } from './RealityValidationTypes';
import { RealityValidationAuditLogger } from './RealityValidationAuditLogger';

export class IntercompanyComplexitySimulator {
  static simulate(tenantId: string, dataset: GoldenDatasetProfile): {
    totalExposure: number;
    riskLinks: IntercompanyLink[];
    complexityRating: string;
  } {
    const totalExposure = dataset.intercompanyLinks.reduce((sum, l) => sum + l.value, 0);
    const riskLinks = dataset.intercompanyLinks.filter(l => l.type === 'GUARANTEE' || l.type === 'LOAN');

    RealityValidationAuditLogger.logEvent(tenantId, 'INTERCOMPANY_RESOLVED',
      'Intercompany simulado: R$ ' + totalExposure.toLocaleString('pt-BR') + ' em exposição cruzada.');

    return {
      totalExposure,
      riskLinks,
      complexityRating: riskLinks.length >= 2 ? 'ALTA' : 'MODERADA'
    };
  }
}
