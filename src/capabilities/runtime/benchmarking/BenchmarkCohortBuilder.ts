import { BenchmarkCohort, AnonymizedInstitutionalProfile } from './BenchmarkTypes';
import { BenchmarkAnonymizationEngine } from './BenchmarkAnonymizationEngine';
import { BenchmarkAuditLogger } from './BenchmarkAuditLogger';

export class BenchmarkCohortBuilder {
  /**
   * Constrói uma Cohort comparativa e gera a Assinatura da Cohort (Cohort Signature).
   * A assinatura não é reversível.
   */
  static buildCohort(
    sector: string, 
    revenueBand: string, 
    rawTenantsInNetwork: any[]
  ): BenchmarkCohort {
    
    const profiles: AnonymizedInstitutionalProfile[] = rawTenantsInNetwork
      .filter(t => t.sector === sector && BenchmarkAnonymizationEngine['classifyRevenue'](t.revenue || 0) === revenueBand)
      .map(t => BenchmarkAnonymizationEngine.anonymizeProfile(t));

    const cohortSignature = `COHORT-${sector}-${revenueBand}-${Date.now()}`.toUpperCase();

    const cohort: BenchmarkCohort = {
      cohortSignature,
      size: profiles.length,
      sector,
      revenueBand,
      profiles
    };

    BenchmarkAuditLogger.logEvent('COHORT_CREATED', cohortSignature, `Coorte gerada com ${profiles.length} perfis anonimizados.`);

    return cohort;
  }
}
