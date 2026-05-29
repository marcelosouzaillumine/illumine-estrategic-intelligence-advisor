// src/core/runtime/publication-governance/NarrativeConsistencyEngine.ts
//
// Narrative Consistency Engine
// Hard-flags narrative and strategic contradictions between advisory recommendations and actual runtime risk levels.

export class NarrativeConsistencyEngine {
  /**
   * Scans generated narratives and checks for structural, strategic, or diagnostic contradictions.
   */
  public static validateNarrativeCoherence(
    report: any,
    validationResult: any,
    advisoryNarrative: any
  ): { isValid: boolean; contradictions: string[] } {
    const contradictions: string[] = [];

    const recs = advisoryNarrative?.recommendations ?? {};
    const recommendedPath = recs.recommendedPath ?? 'Controlled Growth';
    const isGrowthOrExpansion = recommendedPath === 'Controlled Growth' || recommendedPath === 'Aggressive Expansion' || recommendedPath === 'Debt-Financed Growth';

    const valSeverity = validationResult?.severity ?? 'SAFE';
    const reportLevel = report.severity?.level ?? 'ESTÁVEL';

    // 1. Optimistic recommendation under CRITICAL or UNSUSTAINABLE severity
    const isCriticalOrUns = valSeverity === 'UNSUSTAINABLE' || valSeverity === 'CONSTITUTIONAL_VIOLATION' || valSeverity === 'CRITICAL' || reportLevel === 'CRÍTICA' || reportLevel === 'ESTRESSADO';
    if (isGrowthOrExpansion && isCriticalOrUns) {
      contradictions.push(
        `CONTRADIÇÃO NARRATIVA: Recomendação de crescimento/expansão (${recommendedPath}) sob severidade crítica ou insustentável.`
      );
    }

    // 2. Growth recommendation under treasury rupture risk
    const hasTreasuryRupture = report.treasuryIntelligenceReport?.severity === 'TREASURY_RUPTURE_RISK' || report.cashSustainabilityReport?.continuityRisk?.hasRuptureRisk === true;
    if (isGrowthOrExpansion && hasTreasuryRupture) {
      contradictions.push(
        `CONTRADIÇÃO NARRATIVA: Recomendação de crescimento/expansão (${recommendedPath}) sob risco iminente de ruptura de tesouraria.`
      );
    }

    // 3. Stable narrative under fail-closed state
    const isFailClosed = validationResult?.violations?.some((v: string) => v.toLowerCase().includes('fail-closed')) || false;
    const narrativeText = Object.values(advisoryNarrative?.sections ?? {}).join(' ').toLowerCase();
    if (isFailClosed && (narrativeText.includes('saudável') || narrativeText.includes('excelente') || narrativeText.includes('estável'))) {
      contradictions.push(
        'CONTRADIÇÃO NARRATIVA: O diagnóstico cita condições estáveis/saudáveis mesmo sob estado fiduciário de Fail-Closed.'
      );
    }

    // 4. Simulation recommendation without assumption disclosure
    const hasAssumptionsDisclosed = narrativeText.includes('premissa') || narrativeText.includes('assumptions') || narrativeText.includes('projeções');
    if (recommendedPath && !hasAssumptionsDisclosed) {
      contradictions.push(
        'CONTRADIÇÃO NARRATIVA: Recomendação estratégica baseada em simulação sem a devida divulgação das premissas limitadoras.'
      );
    }

    // 5. Predictive warning suppressed in executive summary
    const hasWarnings = report.cashSustainabilityReport?.fiduciaryNarrative?.fiduciaryWarnings?.length > 0 || (validationResult?.warnings?.length ?? 0) > 0;
    const summaryText = (advisoryNarrative?.sections?.currentStructuralCondition ?? '').toLowerCase();
    if (hasWarnings && !summaryText.includes('alerta') && !summaryText.includes('aviso') && !summaryText.includes('atenção') && !summaryText.includes('warning')) {
      contradictions.push(
        'CONTRADIÇÃO NARRATIVA: Alertas preditivos ativos foram suprimidos no sumário da condição estrutural do parecer.'
      );
    }

    return {
      isValid: contradictions.length === 0,
      contradictions
    };
  }
}
