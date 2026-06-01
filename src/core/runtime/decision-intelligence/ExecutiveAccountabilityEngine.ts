import { 
  ExecutiveAccountabilityInput, 
  ExecutiveAccountabilityOutput, 
  AccountabilityStatus 
} from './ExecutiveAccountabilityTypes';

export class ExecutiveAccountabilityEngine {
  public static evaluate(input: ExecutiveAccountabilityInput): ExecutiveAccountabilityOutput {
    const { 
      memoryOutput, 
      causalityOutput, 
      behavioralPatterns, 
      driftOutput, 
      longitudinalCash, 
      reconciliation,
      fiduciaryTimeline
    } = input;

    // Fail-Closed: Accounting Integrity
    if (reconciliation.reconciliationStatus === 'FAILED') {
      return this.createBlockedOutput();
    }

    if (fiduciaryTimeline.timelineIntegrityStatus === 'BROKEN' || fiduciaryTimeline.timelineIntegrityStatus === 'INSUFFICIENT_HISTORY') {
      return this.createBlockedOutput();
    }

    // Fail-Closed: Insufficient Evidence
    if (memoryOutput.institutionalLearningSignal === 'NOT_AVAILABLE' || behavioralPatterns.dominantBehavioralPattern === 'INSUFFICIENT_DECISION_EVIDENCE') {
      return this.createInsufficientEvidenceOutput();
    }

    let baseScore = 50;
    const evidenceTrail: string[] = [];
    let status: AccountabilityStatus | null = null;
    const warnings: string[] = [];

    const hasCorrectiveDecisions = memoryOutput.correctiveDecisionEvidence;
    const isRunwayStable = longitudinalCash.trajectoryClassification === 'STABLE_SUSTAINABILITY' || longitudinalCash.trajectoryClassification === 'REAL_RECOVERY';
    const isDeteriorating = longitudinalCash.trajectoryClassification === 'PROGRESSIVE_DETERIORATION';
    const hasDestructiveRecurrence = memoryOutput.destructiveDecisionRecurrence;
    const hasCapitalDependency = causalityOutput.causalChains.some(c => c.chainType === 'CAPITALIZATION_TO_ARTIFICIAL_LIQUIDITY');
    const hasDrift = driftOutput.driftDetected && driftOutput.driftSeverity !== 'LOW' && driftOutput.driftSeverity !== 'NONE';
    const isReactive = behavioralPatterns.dominantBehavioralPattern === 'REACTIVE_MANAGEMENT';
    const isVolatile = behavioralPatterns.dominantBehavioralPattern === 'VOLATILE_DECISION_PATTERN';

    // RECURRENT_STRUCTURAL_FAILURE
    if (hasDestructiveRecurrence && isDeteriorating && !hasCorrectiveDecisions) {
      status = 'RECURRENT_STRUCTURAL_FAILURE';
      baseScore -= 30;
      evidenceTrail.push('Repetição contínua de padrões destrutivos sem evidência de aprendizado.');
    }

    // NON_CORRECTIVE_MANAGEMENT_PATTERN
    else if (!hasCorrectiveDecisions && isDeteriorating) {
      status = 'NON_CORRECTIVE_MANAGEMENT_PATTERN';
      baseScore -= 20;
      evidenceTrail.push('Ausência de decisões corretivas diante de deterioração operacional contínua.');
    }

    // CHRONIC_REACTION_DELAY
    else if (hasCapitalDependency && isDeteriorating && hasCorrectiveDecisions) {
      status = 'CHRONIC_REACTION_DELAY';
      baseScore -= 10;
      evidenceTrail.push('Respostas tardias frequentemente dependentes de injeção de capital externo.');
    }

    // HIGH_EXECUTIVE_DISCIPLINE
    else if (isRunwayStable && hasCorrectiveDecisions && !hasDestructiveRecurrence && !hasCapitalDependency) {
      status = 'HIGH_EXECUTIVE_DISCIPLINE';
      baseScore += 40;
      evidenceTrail.push('Rápida estabilização e melhoria orgânica de pista financeira.');
    }

    // IMPROVING_GOVERNANCE_DISCIPLINE
    else if (isRunwayStable && !hasDestructiveRecurrence && hasCorrectiveDecisions && !hasDrift) {
      status = 'IMPROVING_GOVERNANCE_DISCIPLINE';
      baseScore += 30;
      evidenceTrail.push('Redução da reincidência destrutiva e eficácia nas correções.');
    }

    // STABILIZING_RESPONSE
    else if (isRunwayStable && hasCorrectiveDecisions) {
      status = 'STABILIZING_RESPONSE';
      baseScore += 25;
      evidenceTrail.push('Resposta institucional capaz de estancar deterioração inicial.');
    }

    // REACTIVE_CORRECTION
    else if (isReactive && hasCorrectiveDecisions) {
      status = 'REACTIVE_CORRECTION';
      baseScore += 5;
      evidenceTrail.push('Ação corretiva aplicada, porém apenas após deterioração fiduciária relevante.');
    }

    // EXECUTION_VOLATILITY
    else if (isVolatile || (hasCorrectiveDecisions && hasDestructiveRecurrence)) {
      status = 'EXECUTION_VOLATILITY';
      baseScore -= 5;
      evidenceTrail.push('Alternância entre medidas corretivas e reincidência de consumo insustentável de caixa.');
    }

    if (!status) {
      status = 'INSUFFICIENT_ACCOUNTABILITY_EVIDENCE';
      evidenceTrail.push('Padrões de reação institucionais inconclusivos baseados no histórico.');
    }

    if (hasDrift) {
      baseScore -= 15;
      warnings.push('Drift narrativo prejudica a confiabilidade da prestação de contas executiva.');
    }

    const accountabilityScore = Math.max(0, Math.min(100, baseScore));

    let reactionSpeedAssessment = 'MODERADA';
    if (status === 'HIGH_EXECUTIVE_DISCIPLINE') reactionSpeedAssessment = 'RÁPIDA_E_EFICAZ';
    else if (status === 'CHRONIC_REACTION_DELAY' || status === 'REACTIVE_CORRECTION') reactionSpeedAssessment = 'TARDIA';
    else if (status === 'NON_CORRECTIVE_MANAGEMENT_PATTERN') reactionSpeedAssessment = 'INEXISTENTE';

    const narrative = `A análise de Executive Accountability Intelligence classificou a capacidade de reação institucional como ${status}. ${evidenceTrail.join(' ')}`;

    return {
      accountabilityScore,
      accountabilityStatus: status,
      reactionSpeedAssessment,
      correctiveDisciplineAssessment: hasCorrectiveDecisions && !hasDestructiveRecurrence ? 'CONSOLIDADA' : (hasCorrectiveDecisions ? 'VOLÁTIL' : 'FRÁGIL'),
      crisisResponseQuality: isRunwayStable ? 'ESTABILIZADORA' : 'INSUFICIENTE',
      institutionalLearningAssessment: hasDestructiveRecurrence ? 'BAIXA_ABSORÇÃO_DE_APRENDIZADO' : 'EVIDÊNCIA_DE_APRENDIZADO',
      recurrenceSeverity: hasDestructiveRecurrence ? 'ALTA_REINCIDÊNCIA' : 'BAIXA_REINCIDÊNCIA',
      executiveConsistencySignal: hasDrift ? 'INCONSISTENTE' : 'COERENTE',
      stabilizationCapability: isRunwayStable ? 'DEMONSTRADA' : 'NÃO_COMPROVADA',
      accountabilityWarnings: warnings,
      evidenceTrail,
      confidence: 'HIGH',
      narrativeAccountabilityAssessment: narrative
    };
  }

  private static createBlockedOutput(): ExecutiveAccountabilityOutput {
    return {
      accountabilityScore: 'NOT_AVAILABLE',
      accountabilityStatus: 'BLOCKED_BY_ACCOUNTING_INTEGRITY',
      reactionSpeedAssessment: 'BLOCKED',
      correctiveDisciplineAssessment: 'BLOCKED',
      crisisResponseQuality: 'BLOCKED',
      institutionalLearningAssessment: 'BLOCKED',
      recurrenceSeverity: 'BLOCKED',
      executiveConsistencySignal: 'BLOCKED',
      stabilizationCapability: 'BLOCKED',
      accountabilityWarnings: ['Engine bloqueada por falta de integridade contábil ou linha do tempo fiduciária quebrada.'],
      evidenceTrail: [],
      confidence: 'BLOCKED',
      narrativeAccountabilityAssessment: 'Avaliação da resposta executiva bloqueada devido a inconsistências contábeis de base.',
      blockedReason: 'ACCOUNTING_INTEGRITY_FAIL_CLOSED'
    };
  }

  private static createInsufficientEvidenceOutput(): ExecutiveAccountabilityOutput {
    return {
      accountabilityScore: 'NOT_AVAILABLE',
      accountabilityStatus: 'INSUFFICIENT_ACCOUNTABILITY_EVIDENCE',
      reactionSpeedAssessment: 'INCONCLUSIVA',
      correctiveDisciplineAssessment: 'INCONCLUSIVA',
      crisisResponseQuality: 'INCONCLUSIVA',
      institutionalLearningAssessment: 'INCONCLUSIVA',
      recurrenceSeverity: 'INCONCLUSIVA',
      executiveConsistencySignal: 'INCONCLUSIVA',
      stabilizationCapability: 'INCONCLUSIVA',
      accountabilityWarnings: [],
      evidenceTrail: ['Histórico fiduciário insuficiente para medir disciplina corretiva.'],
      confidence: 'LOW',
      narrativeAccountabilityAssessment: 'A base de dados atual não possui memória decisória suficiente para avaliar o padrão de reação executiva.',
      blockedReason: 'INSUFFICIENT_DECISION_MEMORY'
    };
  }
}
