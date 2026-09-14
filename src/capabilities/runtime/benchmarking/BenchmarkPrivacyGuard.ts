import { BenchmarkCohort, BenchmarkPrivacyViolation } from './BenchmarkTypes';

export class BenchmarkPrivacyGuard {
  // Decisão 1: Threshold Mínimo de Privacidade para o MVP = 5
  static readonly MIN_COHORT_SIZE = 5;

  /**
   * Avalia se uma Cohort possui tamanho suficiente para proteger a identidade
   * dos participantes (k-anonymity simulado).
   */
  static inspectCohort(cohort: BenchmarkCohort): BenchmarkPrivacyViolation | null {
    if (cohort.size < this.MIN_COHORT_SIZE) {
      return {
        violationId: `PRIV-${Date.now()}`,
        rule: 'K_ANONYMITY_THRESHOLD_NOT_MET',
        message: `Tamanho do cohort (${cohort.size}) é inferior ao mínimo permitido (${this.MIN_COHORT_SIZE}). Risco de reidentificação.`,
        blockedAt: new Date().toISOString()
      };
    }

    return null; // Aprovado
  }

  /**
   * Varredura extra: Garante que os dados passados para a UI não contêm campos proibidos.
   */
  static inspectPayloadForLeakage(payload: any): boolean {
    const stringified = JSON.stringify(payload);
    if (stringified.includes('tenantId') || stringified.includes('workspaceId')) {
      return true; // Vazamento detectado!
    }
    return false; // Seguro
  }
}
