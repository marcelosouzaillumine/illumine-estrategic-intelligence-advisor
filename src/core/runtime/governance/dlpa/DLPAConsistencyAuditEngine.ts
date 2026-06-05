export class DLPAConsistencyAuditEngine {
  public static validate(report: any): { valid: boolean; violations: string[] } {
    const violations: string[] = [];

    const horizon = report.executiveLayer?.patrimonialRecoveryHorizon || report.patrimonialRecoveryHorizon || {};
    const recoverability = report.executiveLayer?.capitalRecoverability || report.capitalRecoverability || {};
    const cps = report.executiveLayer?.capitalPreservationScore || report.capitalPreservationScore || {};
    const radarStatus = report.resolvedCapitalStatus || report.semantic?.resolvedCapitalStatus || '';
    
    // Capital preserved ratio (preservation ratio relative to capital social)
    const preservationRatio = report.preservation?.equityPreservationRatio 
      || report.executiveLayer?.capitalPreservationStatus?.value
      || 1.0;
    const capitalPreservedPercent = preservationRatio * 100;

    const recoveryThesis = report.executiveLayer?.governanceInterpretation?.recoveryThesis || '';
    
    // Distribution capacity can come from various paths
    const distributionCapacity = report.executiveLayer?.capitalRecoveryRequirement?.classification 
      || report.distribution?.distributionPressure 
      || report.distributionCapacity 
      || '';

    // 1. Horizonte compatível com Recuperabilidade
    const horizonAvailable = horizon.available !== false && horizon.classification !== 'Não Estimável' && horizon.formatted !== 'Não Estimável';
    const recAvailable = recoverability.available !== false && recoverability.classification !== 'Não Estimável';

    if (!horizonAvailable && recAvailable) {
      violations.push('DLPA_NARRATIVE_INCONSISTENCY: Horizon is not available but recoverability is estimable');
    }
    if (horizonAvailable && !recAvailable) {
      violations.push('DLPA_NARRATIVE_INCONSISTENCY: Horizon is available but recoverability is not estimable');
    }

    // 2. Recuperabilidade compatível com CPS
    const hasCpsHorizonScoreOf25 = cps.components?.horizonScore === 25;
    if (!recAvailable && !hasCpsHorizonScoreOf25) {
      violations.push('DLPA_NARRATIVE_INCONSISTENCY: Recoverability is "Não Estimável" but CPS horizon score is not 25');
    }

    // 3. CPS compatível com fórmula exibida (rationale)
    if (cps.components && cps.rationale) {
      const expectedPart = `Horizonte (${cps.components.horizonScore} pts × 15%)`;
      if (!cps.rationale.includes(expectedPart)) {
        violations.push(`DLPA_NARRATIVE_INCONSISTENCY: CPS rationale does not reflect actual horizon score used: ${cps.rationale}`);
      }
    }

    // 4. Radar compatível com Capital Preservado
    // >= 100%: Capital Expandido
    // 75%-99%: Capital Preservado
    // 50%-74%: Capital em Recomposição
    // < 50%: Capital Fragilizado
    if (capitalPreservedPercent < 75 && (radarStatus === 'Base de Capital em Expansão' || radarStatus === 'Base de Capital Consolidada')) {
      violations.push(`DLPA_NARRATIVE_INCONSISTENCY: Capital is under 75% but radar status is expansion/consolidation: ${radarStatus}`);
    }

    // 5. Recovery Thesis compatível com Capacidade Distributiva
    const isRestricted = distributionCapacity.includes('Bloqueada') || distributionCapacity.includes('Condicionada') || distributionCapacity.includes('Restrita');
    if (isRestricted && recoveryThesis && !recoveryThesis.includes('retenção integral')) {
      violations.push('DLPA_NARRATIVE_INCONSISTENCY: Distribution is restricted/blocked but recovery thesis does not mention retention');
    }

    return {
      valid: violations.length === 0,
      violations
    };
  }
}
