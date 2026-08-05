import { ValidationIssue } from '../contracts/IntelligenceAssuranceResult';

export class ConfidenceEngine {
  public static calculate(
    dataIntegrityStatus: string,
    dataIntegrityIssues: ValidationIssue[],
    logicIssues: ValidationIssue[],
    narrativeIssues: ValidationIssue[]
  ): { score: number; level: 'HIGH' | 'MEDIUM' | 'LOW'; factors: string[] } {
    let score = 100;
    const factors: string[] = [];

    // Base assumption: if mathematical validation is passed, we have a strong base.
    if (dataIntegrityStatus === 'VALID') {
      factors.push('Equação patrimonial validada e consistente');
    } else if (dataIntegrityStatus === 'WARNING') {
      score -= 20;
      factors.push('Avisos na validação estrutural do balanço');
    } else {
      score -= 50;
      factors.push('Inconsistência matemática grave nos dados base');
    }

    // Logic Deductions
    const criticalLogic = logicIssues.filter(i => i.severity === 'CRITICAL').length;
    const warningLogic = logicIssues.filter(i => i.severity === 'WARNING').length;

    if (criticalLogic > 0) {
      score -= 30;
      factors.push('Regras contábeis apresentaram falhas críticas');
    } else if (warningLogic > 0) {
      score -= 10;
      factors.push('Indicadores em limites de monitoramento contábil');
    } else {
      factors.push('Regras contábeis validadas');
    }

    // Narrative Deductions
    const criticalNarrative = narrativeIssues.filter(i => i.severity === 'CRITICAL').length;
    const warningNarrative = narrativeIssues.filter(i => i.severity === 'WARNING').length;

    if (criticalNarrative > 0) {
      score -= 30;
      factors.push('Conflito detectado entre indicadores e a narrativa gerada');
    } else if (warningNarrative > 0) {
      score -= 15;
      factors.push('Linguagem executiva ajustada por regras de governança');
    } else {
      factors.push('Narrativa executiva aderente e coerente');
    }

    score = Math.max(0, score);

    let level: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
    if (score >= 90) level = 'HIGH';
    else if (score >= 70) level = 'MEDIUM';

    return { score, level, factors };
  }
}
