import { CanonicalMetricResult } from './MetricCanonicalizationEngine';

export interface CanonicalDivergenceIssue {
  metric: string;
  sourceModule: string;
  severity: 'CRITICAL' | 'WARNING';
  description: string;
}

export interface CanonicalDivergenceAuditResult {
  status: 'PASS' | 'WARNING' | 'BLOCKED_FOR_OPTIMISTIC_THESIS';
  issues: CanonicalDivergenceIssue[];
  executiveMessage: string | null;
}

export class CanonicalDivergenceAuditEngine {
  /**
   * Audits divergences between EFOS and canonical source modules.
   * Can block optimistic thesis if critical metrics are divergent.
   */
  public static audit(metrics: Record<string, CanonicalMetricResult>): CanonicalDivergenceAuditResult {
    const issues: CanonicalDivergenceIssue[] = [];
    
    let hasCritical = false;
    let hasWarning = false;

    // Core critical metrics
    const criticalKeys = ['EBITDA', 'LucroLiquido', 'FCO', 'PatrimonioLiquido', 'CaixaFinal'];

    for (const [key, result] of Object.entries(metrics)) {
      if (result.status === 'MISSING') {
        issues.push({
          metric: result.canonicalMetric,
          sourceModule: result.sourceModule,
          severity: 'WARNING',
          description: `Métrica ausente do módulo canônico fonte (${result.sourceModule}).`
        });
        hasWarning = true;
      } else if (result.status === 'DIVERGENT') {
        const isCritical = criticalKeys.includes(key);
        issues.push({
          metric: result.canonicalMetric,
          sourceModule: result.sourceModule,
          severity: isCritical ? 'CRITICAL' : 'WARNING',
          description: `Divergência identificada: Valor canônico (${result.sourceModule}) = ${result.canonicalValue}, Valor reportado/recalculado = ${result.reportedValue}.`
        });

        if (isCritical) {
          hasCritical = true;
        } else {
          hasWarning = true;
        }
      }
    }

    let status: 'PASS' | 'WARNING' | 'BLOCKED_FOR_OPTIMISTIC_THESIS' = 'PASS';
    let executiveMessage: string | null = null;

    if (hasCritical) {
      status = 'BLOCKED_FOR_OPTIMISTIC_THESIS';
      executiveMessage = "A consolidação executiva otimista foi limitada porque uma ou mais métricas críticas apresentaram divergência em relação ao módulo financeiro de origem.";
    } else if (hasWarning) {
      status = 'WARNING';
      executiveMessage = "A consolidação executiva identificou divergências não críticas de nomenclatura ou métricas acessórias. A análise estrutural não foi comprometida.";
    }

    return {
      status,
      issues,
      executiveMessage
    };
  }
}
