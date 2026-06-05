export class CapitalPreservationScoreEngine {
  static evaluate(
    preservationRatio: number,
    dependencyValue: number,
    distributionClassification: string,
    horizonFormattedOrObj: any,
    horizonValueInput?: number | null,
    endingEquity: number = 1.0,
    analysisYear?: number
  ) {
    let horizonFormatted = '';
    let horizonValue: number | null = null;
    let horizonAvailable = true;
    let horizonClassification = '';

    if (horizonFormattedOrObj && typeof horizonFormattedOrObj === 'object') {
      horizonFormatted = horizonFormattedOrObj.formatted || '';
      horizonValue = horizonFormattedOrObj.value ?? null;
      horizonAvailable = horizonFormattedOrObj.available !== false;
      horizonClassification = horizonFormattedOrObj.classification || '';
    } else {
      horizonFormatted = String(horizonFormattedOrObj || '');
      horizonValue = horizonValueInput ?? null;
      horizonAvailable = horizonFormatted !== 'Não Estimável' && horizonValue !== null;
      horizonClassification = horizonFormatted;
    }

    // 1. Capital Remanescente Score (45% weight)
    const remanescenteScore = Math.max(0, Math.min(100, preservationRatio * 100));

    // 2. Dependência dos Sócios Score (30% weight)
    let dependencyScore = 0;
    if (dependencyValue === Infinity || endingEquity <= 0) {
      dependencyScore = 0;
    } else if (dependencyValue <= 1.2) {
      dependencyScore = 100;
    } else if (dependencyValue <= 1.5) {
      dependencyScore = 70;
    } else if (dependencyValue <= 2.0) {
      dependencyScore = 40;
    } else {
      dependencyScore = 20;
    }

    // 3. Capacidade Distributiva Score (10% weight)
    let distributionScore = 25;
    if (distributionClassification === 'Livre') {
      distributionScore = 100;
    } else if (distributionClassification === 'Condicionada') {
      distributionScore = 75;
    } else if (distributionClassification === 'Restrita') {
      distributionScore = 50;
    } else if (distributionClassification === 'Bloqueada') {
      distributionScore = 25;
    }

    // 4. Horizonte de Recuperação Score (15% weight)
    let horizonScore = 50;
    const isHorizonNotEstimable = !horizonAvailable || horizonClassification === 'Não Estimável' || horizonFormatted === 'Não Estimável' || horizonValue === null;

    if (isHorizonNotEstimable) {
      horizonScore = 25;
    } else if (horizonValue === 0) {
      horizonScore = 100;
    } else if (horizonValue < 2) {
      horizonScore = 90;
    } else if (horizonValue < 5) {
      horizonScore = 70;
    } else if (horizonValue < 10) {
      horizonScore = 40;
    } else {
      horizonScore = 15;
    }

    // Calculate weighted score
    let score = Math.round(
      remanescenteScore * 0.45 +
      dependencyScore * 0.30 +
      distributionScore * 0.10 +
      horizonScore * 0.15
    );

    // Apply fiduciary clamp for insolvency (PL <= 0)
    if (endingEquity <= 0) {
      score = Math.min(20, score);
    }

    // Classify score
    let classification = 'Capital Erodido';
    if (score >= 90) {
      classification = 'Capital Preservado';
    } else if (score >= 75) {
      classification = 'Capital Estável';
    } else if (score >= 50) {
      classification = 'Capital Fragilizado';
    } else if (score >= 25) {
      classification = 'Capital em Recuperação';
    }

    const horizonDetails = '';

    const rationale = `Ponderação: Remanescente (${remanescenteScore.toFixed(0)} pts × 45%) + Dependência (${dependencyScore} pts × 30%) + Distribuição (${distributionScore} pts × 10%) + Horizonte (${horizonScore} pts × 15%).`;

    return {
      value: score,
      score: score,
      classification,
      rationale,
      components: {
        remanescenteScore,
        dependencyScore,
        distributionScore,
        horizonScore
      }
    };
  }
}
