import { 
  EarlyWarningIntelligenceInput, 
  EarlyWarningIntelligenceOutput, 
  EarlyWarningLevel 
} from './EarlyWarningTypes';

export class EarlyWarningEngine {
  public static evaluate(input: EarlyWarningIntelligenceInput): EarlyWarningIntelligenceOutput {
    const { 
      stabilityOutput, 
      longitudinalCash, 
      fiduciaryTimeline, 
      memoryOutput, 
      causalityOutput, 
      behavioralPatterns, 
      driftOutput, 
      accountabilityOutput, 
      reconciliation 
    } = input;

    // 1. Fail-Closed: Accounting Integrity
    if (reconciliation.reconciliationStatus === 'FAILED') {
      return this.createBlockedOutput();
    }

    if (fiduciaryTimeline.timelineIntegrityStatus === 'BROKEN' || fiduciaryTimeline.timelineIntegrityStatus === 'INSUFFICIENT_HISTORY') {
      return this.createBlockedOutput();
    }

    // Fail-Closed: Insufficient History (less than 3 cycles)
    if (input.cashCycles && input.cashCycles.length < 3) {
      return this.createInsufficientEvidenceOutput();
    }

    let riskScore = 0; // 0 = lowest risk, 100 = critical threat
    const detectedThreats: string[] = [];
    const emergingPatterns: string[] = [];
    const anticipatoryAlerts: string[] = [];
    const fiduciaryStressSignals: string[] = [];
    const evidenceTrail: string[] = [];
    const fiduciaryWarnings: string[] = [];
    
    // Extracted signals
    const runwayPressure = causalityOutput.runwayImpactAssessment === 'IMPACTO_NEGATIVO_OBSERVADO';
    const isFCONegative = causalityOutput.fcoImpactAssessment === 'IMPACTO_NEGATIVO_OBSERVADO';
    const hasWorkingCapitalStress = behavioralPatterns.dominantBehavioralPattern === 'RECURRENT_WORKING_CAPITAL_STRESS' || causalityOutput.causalChains.some(c => c.chainType === 'CUSTOMER_CREDIT_TO_WORKING_CAPITAL_STRESS');
    const isLiquidityArtificial = causalityOutput.liquidityQualityImpact === 'LIQUIDEZ_ARTIFICIAL_VINCULADA';
    const hasCapitalDependency = causalityOutput.causalChains.some(c => c.chainType === 'CAPITALIZATION_TO_ARTIFICIAL_LIQUIDITY');
    const hasDestructiveRecurrence = memoryOutput.destructiveDecisionRecurrence;
    const isTrajectoryDeteriorating = longitudinalCash.trajectoryClassification === 'PROGRESSIVE_DETERIORATION';
    const isAccountabilityFragile = typeof accountabilityOutput.accountabilityScore === 'number' && accountabilityOutput.accountabilityScore < 50;
    const isDriftHigh = driftOutput.driftSeverity === 'HIGH' || driftOutput.driftSeverity === 'CRITICAL';
    const isStabilityCritical = stabilityOutput.stabilityClassification === 'CRITICAL_INSTABILITY' || stabilityOutput.stabilityClassification === 'COLLAPSE_RISK';

    // --- Score Calculation (Additive Risk) ---
    if (runwayPressure) {
      riskScore += 20;
      detectedThreats.push('Aceleração do consumo de Runway fiduciário detectada.');
      fiduciaryStressSignals.push('RUNWAY_SHORTENING');
    }

    if (isFCONegative) {
      riskScore += 20;
      detectedThreats.push('Geração operacional (FCO) em tendência de queima.');
      fiduciaryStressSignals.push('FCO_BURN');
    }

    if (hasWorkingCapitalStress) {
      riskScore += 15;
      emergingPatterns.push('Pressão crescente no capital de giro antecipando estrangulamento de liquidez.');
      fiduciaryStressSignals.push('WORKING_CAPITAL_PRESSURE');
    }

    if (isLiquidityArtificial || hasCapitalDependency) {
      riskScore += 20;
      emergingPatterns.push('Dependência estrutural de capitalização/financiamento externo para continuidade.');
      fiduciaryStressSignals.push('EXTERNAL_DEPENDENCY');
    }

    if (hasDestructiveRecurrence) {
      riskScore += 15;
      detectedThreats.push('Probabilidade alta de reincidência de decisões destrutivas no caixa.');
      fiduciaryStressSignals.push('DESTRUCTIVE_RECURRENCE');
    }

    if (isTrajectoryDeteriorating) {
      riskScore += 15;
      detectedThreats.push('Aceleração objetiva de deterioração longitudinal.');
      fiduciaryStressSignals.push('DETERIORATION_ACCELERATION');
    }

    if (isAccountabilityFragile) {
      riskScore += 10;
      anticipatoryAlerts.push('Accountability frágil: ausência de resposta institucional tempestiva.');
      fiduciaryStressSignals.push('WEAK_ACCOUNTABILITY');
    }

    if (isDriftHigh) {
      riskScore += 10;
      anticipatoryAlerts.push('Desalinhamento narrativo acoberta riscos subjacentes emergentes.');
      fiduciaryStressSignals.push('NARRATIVE_DRIFT_MASKING');
    }

    if (isStabilityCritical) {
      riskScore += 20; // This will likely cap the score
      detectedThreats.push('Risco sistêmico de continuidade imediata.');
    }

    // Ceilings / Bounds
    riskScore = Math.min(100, Math.max(0, riskScore));

    // --- Classification ---
    let level: EarlyWarningLevel = 'INSUFFICIENT_PREDICTIVE_EVIDENCE';

    // Top-down classification
    if (riskScore >= 81 || (isStabilityCritical && runwayPressure && isFCONegative && !memoryOutput.correctiveDecisionEvidence)) {
      level = 'CRITICAL_CONTINUITY_THREAT';
      evidenceTrail.push('Múltiplas pressões estruturais (Runway, FCO, Liquidez, Accountability) colapsaram simultaneamente.');
      anticipatoryAlerts.push('ATENÇÃO: Sistema antecipa ruptura operacional em curtíssimo prazo na ausência de evento extremo corretivo/capitalização.');
    } else if (riskScore >= 70 && isFCONegative && runwayPressure && isTrajectoryDeteriorating && !memoryOutput.correctiveDecisionEvidence) {
      level = 'OPERATIONAL_COLLAPSE_RISK';
      evidenceTrail.push('A falta de ação corretiva combinada à deterioração progressiva acelera o risco operacional.');
      anticipatoryAlerts.push('O FCO estruturalmente negativo se converte em risco de continuidade tangível.');
    } else if (riskScore >= 65 && hasDestructiveRecurrence && hasCapitalDependency) {
      level = 'RECURSIVE_CAPITALIZATION_RISK';
      evidenceTrail.push('Padrão crônico de dependência em capital externo retroalimenta decisões de over-expansion ou stress.');
    } else if (riskScore >= 60 && isTrajectoryDeteriorating) {
      level = 'STRUCTURAL_DETERIORATION_ACCELERATION';
      evidenceTrail.push('Aceleração na velocidade de queima de caixa com encurtamento do runway longitudinal.');
    } else if (riskScore >= 50 && (runwayPressure || isLiquidityArtificial || hasWorkingCapitalStress)) {
      level = 'PRE_DISTRESS_STATE';
      evidenceTrail.push('Apesar da estabilidade aparente de caixa, múltiplos sinais de pressão formam convergência para um cenário de stress.');
    } else if (riskScore >= 40 && hasCapitalDependency) {
      level = 'EMERGING_LIQUIDITY_DEPENDENCY';
      evidenceTrail.push('Crescente dependência de financiamentos não-operacionais sustentando artificialmente os finais dos ciclos.');
    } else if (riskScore >= 30 && hasWorkingCapitalStress) {
      level = 'EMERGING_WORKING_CAPITAL_PRESSURE';
      evidenceTrail.push('Represamento de caixa na operação (estoques/recebíveis) gerando degradação emergente.');
    } else if (riskScore >= 21) {
      level = 'EARLY_STRUCTURAL_STRESS';
      evidenceTrail.push('Sinais incipientes de pressão em geração de caixa ou dependência leve.');
    } else if (riskScore <= 20) {
      level = 'STABLE_MONITORING';
      evidenceTrail.push('Nenhum padrão emergente de destruição detectado. As margens fiduciárias operam sem pressão anormal.');
    }

    // --- Dynamic Properties ---
    let projectedContinuityRisk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (riskScore >= 80) projectedContinuityRisk = 'CRITICAL';
    else if (riskScore >= 60) projectedContinuityRisk = 'HIGH';
    else if (riskScore >= 40) projectedContinuityRisk = 'MODERATE';

    let projectedRunwayPressure: 'STABLE' | 'INCREASING' | 'CRITICAL' = 'STABLE';
    if (runwayPressure && isTrajectoryDeteriorating) projectedRunwayPressure = 'CRITICAL';
    else if (runwayPressure || hasWorkingCapitalStress) projectedRunwayPressure = 'INCREASING';

    let recurrenceProbability: 'LOW' | 'MODERATE' | 'HIGH' = 'LOW';
    if (hasDestructiveRecurrence || isDriftHigh) recurrenceProbability = 'HIGH';
    else if (isAccountabilityFragile) recurrenceProbability = 'MODERATE';

    let deteriorationVelocity: 'STABLE' | 'ACCELERATING' | 'SLOWING_DOWN' = 'STABLE';
    if (isTrajectoryDeteriorating && runwayPressure) deteriorationVelocity = 'ACCELERATING';
    else if (memoryOutput.correctiveDecisionEvidence && !isTrajectoryDeteriorating) deteriorationVelocity = 'SLOWING_DOWN';

    let stabilizationProbability: 'HIGH' | 'MODERATE' | 'LOW' = 'HIGH';
    if (riskScore >= 70) stabilizationProbability = 'LOW';
    else if (riskScore >= 40 || !memoryOutput.correctiveDecisionEvidence) stabilizationProbability = 'MODERATE';

    const narrativeMap: Record<EarlyWarningLevel, string> = {
      'STABLE_MONITORING': 'A instituição apresenta projeção de continuidade sem sinais emergentes de deterioração.',
      'EARLY_STRUCTURAL_STRESS': 'Há sinais emergentes de deterioração estrutural inicial (Early Stress).',
      'EMERGING_WORKING_CAPITAL_PRESSURE': 'O modelo detecta pressão crescente em capital de giro que ameaça futuras posições de liquidez.',
      'EMERGING_LIQUIDITY_DEPENDENCY': 'O modelo detecta risco crescente de dependência de capital externo para rolagem ou manutenção do runway.',
      'PRE_DISTRESS_STATE': 'Convergência de múltiplos sinais antecipatórios apontando para uma transição a estado de stress fiduciário.',
      'STRUCTURAL_DETERIORATION_ACCELERATION': 'A aceleração da deterioração no runway aponta para uma redução rápida do tempo útil da operação.',
      'RECURSIVE_CAPITALIZATION_RISK': 'O padrão atual sugere aumento progressivo da pressão de liquidez, mantida sob risco crônico de dependência externa contínua.',
      'OPERATIONAL_COLLAPSE_RISK': 'O FCO negativo e a falta de correção aceleram o risco projetado para limites operacionais críticos.',
      'HIGH_RECURRENCE_PROBABILITY': 'A alta probabilidade de reincidência destrutiva expõe o caixa a riscos contínuos no curto-prazo.',
      'CRITICAL_CONTINUITY_THREAT': 'O sistema antecipa risco substancial à continuidade fiduciária da instituição (Continuous Monitoring Requerido).',
      'INSUFFICIENT_PREDICTIVE_EVIDENCE': 'Sinais insuficientes para formar uma análise preditiva sólida.',
      'BLOCKED_BY_ACCOUNTING_INTEGRITY': 'Avaliação antecipatória bloqueada.'
    };

    return {
      earlyWarningLevel: level,
      earlyWarningScore: riskScore,
      detectedThreats,
      emergingPatterns,
      projectedContinuityRisk,
      projectedRunwayPressure,
      recurrenceProbability,
      deteriorationVelocity,
      stabilizationProbability,
      fiduciaryStressSignals,
      anticipatoryAlerts,
      evidenceTrail,
      fiduciaryWarnings,
      narrativeEarlyWarningAssessment: narrativeMap[level],
      confidence: 'HIGH'
    };
  }

  private static createBlockedOutput(): EarlyWarningIntelligenceOutput {
    return {
      earlyWarningLevel: 'BLOCKED_BY_ACCOUNTING_INTEGRITY',
      earlyWarningScore: 'NOT_AVAILABLE',
      detectedThreats: ['Integridade contábil comprometida na base.'],
      emergingPatterns: [],
      projectedContinuityRisk: 'BLOCKED',
      projectedRunwayPressure: 'BLOCKED',
      recurrenceProbability: 'BLOCKED',
      deteriorationVelocity: 'BLOCKED',
      stabilizationProbability: 'BLOCKED',
      fiduciaryStressSignals: ['ACCOUNTING_RESTRICTION_ACTIVE'],
      anticipatoryAlerts: ['Alerta Preditivo Desativado: A engine requer FCO/Runway reconciliados para garantir previsibilidade sem heurísticas perigosas.'],
      evidenceTrail: ['A avaliação de sinais antecipatórios foi bloqueada preventivamente pela malha contábil.'],
      fiduciaryWarnings: ['Não é possível predizer segurança fiduciária sobre uma base histórica não aderente.'],
      narrativeEarlyWarningAssessment: 'As métricas de Early Warning estão retidas devido a violações de accounting integrity no período atual.',
      confidence: 'BLOCKED',
      blockedReason: 'ACCOUNTING_INTEGRITY_FAIL_CLOSED'
    };
  }

  private static createInsufficientEvidenceOutput(): EarlyWarningIntelligenceOutput {
    return {
      earlyWarningLevel: 'INSUFFICIENT_PREDICTIVE_EVIDENCE',
      earlyWarningScore: 'NOT_AVAILABLE',
      detectedThreats: [],
      emergingPatterns: [],
      projectedContinuityRisk: 'MODERATE',
      projectedRunwayPressure: 'STABLE',
      recurrenceProbability: 'MODERATE',
      deteriorationVelocity: 'STABLE',
      stabilizationProbability: 'MODERATE',
      fiduciaryStressSignals: [],
      anticipatoryAlerts: ['Histórico insuficiente (< 3 ciclos) para inferir tração ou velocidade de deterioração.'],
      evidenceTrail: ['Histórico menor que o limiar mínimo longitudinal requerido para modelos antecipatórios.'],
      fiduciaryWarnings: [],
      narrativeEarlyWarningAssessment: 'Não há profundidade longitudinal suficiente para antecipar a tendência de estabilidade ou crise.',
      confidence: 'LOW',
      blockedReason: 'INSUFFICIENT_LONGITUDINAL_CYCLES'
    };
  }
}
