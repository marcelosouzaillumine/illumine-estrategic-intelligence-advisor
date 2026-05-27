import { ExecutiveIntelligenceReport } from '../runtime/executive-intelligence-runtime';

export class InstitutionalReportFormatter {
  /**
   * Formats the report into a structured Markdown document.
   * Strictly passive: no local calculations.
   */
  public static toMarkdown(report: ExecutiveIntelligenceReport): string {
    if (!report) {
      throw new Error('[Report Formatter] Relatório de entrada inválido.');
    }

    const { context, scores, severity, advisory, compliance, runtimeMetadata } = report;

    return `
# RELATÓRIO DE INTELIGÊNCIA EXECUTIVA INSTITUCIONAL
**Data de Emissão**: ${new Date().toLocaleDateString('pt-BR')}
**Nível de Confiança**: ${compliance.confidenceLevel}
**Linhagem do Dataset**: ${(runtimeMetadata?.lineage as any)?.datasetHash || 'N/A'}

---

## 1. Contexto Empresarial
- **Segmento**: ${context.segment}
- **Modelo de Negócio**: ${context.businessModel}
- **Intensidade de Capital**: ${context.capitalIntensity}
- **Estágio Operacional**: ${context.stage}

## 2. Diagnóstico de Saúde Contábil
- **Score Composto**: ${scores.composite} / 100
- **Score Financeiro (Liquidez)**: ${scores.financial} / 100
- **Score Estrutural (Autonomia)**: ${scores.structural} / 100
- **Status Geral de Severidade**: ${severity.level}
- **Justificativa**: ${severity.justification}

## 3. Análise Causal e Propagação
- **Evento Principal**: ${report.causality?.event || 'N/A'}
- **Causa Raiz Identificada**: ${report.causality?.rootCause || 'N/A'}
- **Impacto Estratégico**: ${report.causality?.strategicImpact || 'N/A'}

## 4. Plano de Ação & Recomendações
**Foco Prioritário**: ${advisory.priorityFocus}

### Ações Recomendadas:
${advisory.actionMatrix.map(action => `- ${action}`).join('\n')}

---
*Gerado eletronicamente pela Plataforma Illumine. Trilha de auditoria preservada.*
    `.trim();
  }

  /**
   * Formats the report key metrics into a CSV string.
   * Strictly passive: no local calculations.
   */
  public static toCSV(report: ExecutiveIntelligenceReport): string {
    if (!report) {
      throw new Error('[Report Formatter] Relatório de entrada inválido.');
    }

    const { scores, severity, compliance } = report;

    const headers = ['Métrica', 'Valor'];
    const rows = [
      ['Composite Score', scores.composite],
      ['Financial Score', scores.financial],
      ['Operational Score', scores.operational],
      ['Governance Score', scores.governance],
      ['Structural Score', scores.structural],
      ['Severity Level', severity.level],
      ['Confidence Level', compliance.confidenceLevel]
    ];

    const lines = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ];

    return lines.join('\n');
  }
}
