export class ExecutiveDiagnosisComposer {
  /**
   * Applies mandatory executive terminology replacements to the provided text.
   */
  public static sanitize(text: string): string {
    if (!text) return '';

    let sanitized = text;

    // Substituições obrigatórias
    // 1. "Primeiro Ano Operacional" -> "Primeiro ciclo financeiro disponível"
    sanitized = sanitized.replace(/Primeiro Ano Operacional/g, 'Primeiro ciclo financeiro disponível');
    sanitized = sanitized.replace(/primeiro ano operacional/gi, 'primeiro ciclo financeiro disponível');

    // 2. "Confiabilidade: Confiabilidade Moderada" -> "Confiabilidade Moderada"
    sanitized = sanitized.replace(/Confiabilidade:\s*Confiabilidade Moderada/g, 'Confiabilidade Moderada');
    sanitized = sanitized.replace(/Confiabilidade:\s*Confiabilidade/gi, 'Confiabilidade');

    // 3. "Asfixia iminente" -> "Pressão relevante de liquidez"
    sanitized = sanitized.replace(/Asfixia iminente/g, 'Pressão relevante de liquidez');
    sanitized = sanitized.replace(/asfixia iminente/gi, 'pressão relevante de liquidez');

    return sanitized;
  }

  /**
   * Composes a hardened version of the advisory report strings.
   */
  public static hardenReportStrings(report: any): any {
    if (!report) return report;

    // Sanitize causality narratives
    if (report.causality) {
      report.causality.event = this.sanitize(report.causality.event);
      report.causality.rootCause = this.sanitize(report.causality.rootCause);
      report.causality.financialPropagation = this.sanitize(report.causality.financialPropagation);
      report.causality.absorptionCapacity = this.sanitize(report.causality.absorptionCapacity);
      report.causality.strategicImpact = this.sanitize(report.causality.strategicImpact);
      if (Array.isArray(report.causality.insights)) {
        report.causality.insights = report.causality.insights.map((insight: any) => ({
          ...insight,
          text: this.sanitize(insight.text)
        }));
      }
    }

    // Sanitize advisory
    if (report.advisory) {
      report.advisory.executiveSummary = this.sanitize(report.advisory.executiveSummary);
      report.advisory.priorityFocus = this.sanitize(report.advisory.priorityFocus);
      if (Array.isArray(report.advisory.actionMatrix)) {
        report.advisory.actionMatrix = report.advisory.actionMatrix.map((action: any) => {
          if (typeof action === 'string') {
            return this.sanitize(action);
          }
          if (action && typeof action === 'object') {
            return {
              ...action,
              title: this.sanitize(action.title || ''),
              fiduciaryEvidence: this.sanitize(action.fiduciaryEvidence || '')
            };
          }
          return action;
        });
      }
    }

    // Sanitize severity
    if (report.severity) {
      report.severity.justification = this.sanitize(report.severity.justification);
    }

    // Sanitize context fields
    if (report.context) {
      report.context.stage = this.sanitize(report.context.stage);
      report.context.businessModel = this.sanitize(report.context.businessModel);
    }

    return report;
  }
}
