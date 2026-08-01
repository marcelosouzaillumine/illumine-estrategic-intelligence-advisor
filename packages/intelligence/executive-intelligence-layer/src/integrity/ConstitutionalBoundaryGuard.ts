import { TechnicalAssessment } from '../contracts/TechnicalAssessment';

/**
 * Runtime Constitutional Validator.
 * Impede a violação constitucional da Illumine, garantindo que nenhum
 * especialista técnico tente enviar uma deliberação, aprovação ou 
 * recomendação estratégica (Decision Boundary).
 */
export class ConstitutionalBoundaryGuard {
  
  private static FORBIDDEN_PROPERTIES = [
    'decision',
    'recommendation',
    'approval',
    'executionPlan',
    'strategy',
    'actionPlan',
    'priority',
    'nextStep'
  ];

  public static validateAssessmentIntegrity(assessment: TechnicalAssessment): void {
    const violations: string[] = [];

    this.FORBIDDEN_PROPERTIES.forEach(prop => {
      if ((assessment as any)[prop] !== undefined) {
        violations.push(prop);
      }
    });

    if (violations.length > 0) {
      // Falha drástica no runtime para impedir propagação de IA decisora.
      throw new Error(
        `CONSTITUTIONAL_VIOLATION: \n` +
        `Module: ${assessment.domain}Analyzer\n` +
        `Violation: Forbidden decision properties detected: ${violations.join(', ')}\n` +
        `Blocked Pipeline: true`
      );
    }
  }
}
