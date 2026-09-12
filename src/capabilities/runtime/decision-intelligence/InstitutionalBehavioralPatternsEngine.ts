import { 
  InstitutionalBehavioralPatternsInput, 
  InstitutionalBehavioralPatternsOutput, 
  InstitutionalBehavioralPatternType,
  GovernanceMaturitySignal
} from './InstitutionalBehavioralTypes';

export class InstitutionalBehavioralPatternsEngine {
  
  public static evaluate(input: InstitutionalBehavioralPatternsInput): InstitutionalBehavioralPatternsOutput {
    const { memoryOutput, causalityOutput, longitudinalCash, reconciliation } = input;

    // 1. Fail-Closed: Accounting Integrity
    if (reconciliation.reconciliationStatus === 'FAILED') {
      return this.createBlockedOutput('Contabilidade bloqueada: a avaliação de padrões institucionais requer reconciliação íntegra.');
    }

    // 2. Fail-Closed: Insufficient Decision Evidence
    if (memoryOutput.institutionalLearningSignal === 'NOT_AVAILABLE' || causalityOutput.confidence === 'CAUSALITY_NOT_ESTABLISHED') {
      return this.createInsufficientEvidenceOutput();
    }

    const dominantPatterns = new Set<InstitutionalBehavioralPatternType>();
    const secondaryPatterns = new Set<InstitutionalBehavioralPatternType>();
    const evidence: string[] = [];
    let baseScore = 50;

    const hasCapitalizationLiquidity = causalityOutput.causalChains.some(c => c.chainType === 'CAPITALIZATION_TO_ARTIFICIAL_LIQUIDITY');
    const hasWorkingCapitalStress = causalityOutput.causalChains.some(c => c.chainType === 'CUSTOMER_CREDIT_TO_WORKING_CAPITAL_STRESS' || c.chainType === 'INVENTORY_EXPANSION_TO_CASH_PRESSURE');
    const hasCapexWithoutReturn = causalityOutput.causalChains.some(c => c.chainType === 'CAPEX_WITHOUT_OPERATIONAL_RETURN');
    const hasCorrectiveRecovery = causalityOutput.causalChains.some(c => c.chainType === 'CORRECTIVE_ACTION_TO_RECOVERY');
    
    // Regras Determinísticas
    
    // CAPITAL_DEPENDENCY_BEHAVIOR
    if (hasCapitalizationLiquidity && (longitudinalCash.trajectoryClassification === 'CHRONIC_DEPENDENCY' || longitudinalCash.trajectoryClassification === 'ARTIFICIAL_TURNAROUND')) {
      dominantPatterns.add('CAPITAL_DEPENDENCY_BEHAVIOR');
      evidence.push('Evidência de dependência recorrente de capital externo mantendo caixa operacional deficitário.');
      baseScore += 30; // Risco sobe
    }

    // RECURRENT_WORKING_CAPITAL_STRESS
    if (hasWorkingCapitalStress && memoryOutput.recurringDecisionPatterns.some(p => p === 'INVENTORY_EXPANSION' || p === 'CUSTOMER_CREDIT_EXPANSION')) {
      dominantPatterns.add('RECURRENT_WORKING_CAPITAL_STRESS');
      evidence.push('A instituição apresenta padrão recorrente de estresse de capital de giro vinculado a decisões comerciais e de estoque.');
      baseScore += 25;
    }

    // CHRONIC_OVEREXPANSION
    if ((hasCapexWithoutReturn || hasWorkingCapitalStress) && memoryOutput.destructiveDecisionRecurrence) {
      dominantPatterns.add('CHRONIC_OVEREXPANSION');
      evidence.push('Padrão recorrente de expansão sem conversão proporcional de caixa.');
      baseScore += 35;
    }

    // ARTIFICIAL_SCALING
    if (dominantPatterns.has('CAPITAL_DEPENDENCY_BEHAVIOR') && dominantPatterns.has('CHRONIC_OVEREXPANSION')) {
      dominantPatterns.add('ARTIFICIAL_SCALING');
      evidence.push('Escala de receita financiada por liquidez artificial sem sustentação operacional.');
      baseScore += 40;
    }

    // REACTIVE_MANAGEMENT
    if (hasCorrectiveRecovery && memoryOutput.destructiveDecisionRecurrence && longitudinalCash.trajectoryClassification !== 'REAL_RECOVERY') {
      dominantPatterns.add('REACTIVE_MANAGEMENT');
      evidence.push('A gestão apresenta sinais de resposta corretiva apenas após deterioração fiduciária relevante.');
      baseScore += 15;
    }

    // TREASURY_NEGLECT
    if (longitudinalCash.trajectoryClassification === 'PROGRESSIVE_DETERIORATION' && !hasCorrectiveRecovery) {
      dominantPatterns.add('TREASURY_NEGLECT');
      evidence.push('Ausência de decisões corretivas registradas em meio à deterioração progressiva de runway.');
      baseScore += 40;
    }

    // GOVERNANCE_MATURITY_EVOLUTION
    if (hasCorrectiveRecovery && !memoryOutput.destructiveDecisionRecurrence && longitudinalCash.trajectoryClassification === 'REAL_RECOVERY') {
      dominantPatterns.add('GOVERNANCE_MATURITY_EVOLUTION');
      evidence.push('Evidência de aprendizado institucional e redução de padrões destrutivos.');
      baseScore -= 30; // Risco cai
    }

    // STRATEGIC_DISCIPLINE
    if (!hasWorkingCapitalStress && !hasCapitalizationLiquidity && longitudinalCash.trajectoryClassification === 'STABLE_SUSTAINABILITY' && memoryOutput.institutionalLearningSignal !== 'NEGATIVE') {
      dominantPatterns.add('STRATEGIC_DISCIPLINE');
      evidence.push('Coerência demonstrada entre decisão estratégica e preservação de capacidade financeira.');
      baseScore -= 40;
    }

    // DISCIPLINED_EXECUTION
    if (hasCorrectiveRecovery && longitudinalCash.trajectoryClassification === 'STABLE_SUSTAINABILITY') {
      dominantPatterns.add('DISCIPLINED_EXECUTION');
      evidence.push('Alta capacidade corretiva com preservação estrutural da liquidez.');
      baseScore -= 40;
    }

    // VOLATILE_DECISION_PATTERN
    if (dominantPatterns.has('REACTIVE_MANAGEMENT') && hasCorrectiveRecovery && memoryOutput.destructiveDecisionRecurrence) {
      dominantPatterns.add('VOLATILE_DECISION_PATTERN');
      evidence.push('Trajetória fiduciária alternando entre deterioração decisória e alívio corretivo temporário.');
      baseScore += 20;
    }

    // Define Dominant Pattern se múltiplos estiverem presentes (pela ordem de risco estrutural)
    const riskHierarchy: InstitutionalBehavioralPatternType[] = [
      'ARTIFICIAL_SCALING', 'TREASURY_NEGLECT', 'CAPITAL_DEPENDENCY_BEHAVIOR', 'CHRONIC_OVEREXPANSION', 
      'RECURRENT_WORKING_CAPITAL_STRESS', 'VOLATILE_DECISION_PATTERN', 'REACTIVE_MANAGEMENT',
      'GOVERNANCE_MATURITY_EVOLUTION', 'STRATEGIC_DISCIPLINE', 'DISCIPLINED_EXECUTION'
    ];

    let finalDominant: InstitutionalBehavioralPatternType | null = null;
    for (const h of riskHierarchy) {
      if (dominantPatterns.has(h)) {
        finalDominant = h;
        break;
      }
    }

    if (!finalDominant) {
      // Se não cruzou nenhuma regra forte de padrão específico
      return this.createInsufficientEvidenceOutput();
    }

    dominantPatterns.delete(finalDominant);
    dominantPatterns.forEach(p => secondaryPatterns.add(p));

    // Cap do Score
    let finalScore = Math.max(0, Math.min(100, baseScore));

    // Maturity Signal
    let maturitySignal: GovernanceMaturitySignal = 'STABLE';
    if (finalScore >= 80) maturitySignal = 'DETERIORATING';
    else if (finalScore >= 60) maturitySignal = 'FRAGILE';
    else if (finalScore >= 40) maturitySignal = 'REACTIVE';
    else if (finalDominant === 'GOVERNANCE_MATURITY_EVOLUTION') maturitySignal = 'MATURING';
    else if (finalScore <= 30) maturitySignal = 'STABLE';

    const narrative = `O Governance Runtime identificou como padrão dominante a classificação ${finalDominant}. ${evidence.join(' ')}`;

    return {
      dominantBehavioralPattern: finalDominant,
      secondaryBehavioralPatterns: Array.from(secondaryPatterns),
      behavioralRiskScore: finalScore,
      governanceMaturitySignal: maturitySignal,
      behavioralEvidence: evidence,
      repeatedPatterns: memoryOutput.recurringDecisionPatterns,
      correctiveSignals: memoryOutput.correctiveDecisionEvidence,
      fiduciaryWarnings: memoryOutput.decisionMemoryWarnings.concat(causalityOutput.fiduciaryWarnings),
      confidence: causalityOutput.confidence.includes('HIGH') ? 'HIGH' : 'MODERATE',
      narrativeBehavioralAssessment: narrative
    };
  }

  private static createBlockedOutput(reason: string): InstitutionalBehavioralPatternsOutput {
    return {
      dominantBehavioralPattern: 'BLOCKED_BY_ACCOUNTING_INTEGRITY',
      secondaryBehavioralPatterns: [],
      behavioralRiskScore: 'NOT_AVAILABLE',
      governanceMaturitySignal: 'BLOCKED',
      behavioralEvidence: [],
      repeatedPatterns: [],
      correctiveSignals: false,
      fiduciaryWarnings: ['Módulo comportamental bloqueado.'],
      confidence: 'BLOCKED',
      narrativeBehavioralAssessment: reason,
      blockedReason: reason
    };
  }

  private static createInsufficientEvidenceOutput(): InstitutionalBehavioralPatternsOutput {
    return {
      dominantBehavioralPattern: 'INSUFFICIENT_DECISION_EVIDENCE',
      secondaryBehavioralPatterns: [],
      behavioralRiskScore: 'NOT_AVAILABLE',
      governanceMaturitySignal: 'INSUFFICIENT_EVIDENCE',
      behavioralEvidence: [],
      repeatedPatterns: [],
      correctiveSignals: false,
      fiduciaryWarnings: [],
      confidence: 'LOW',
      narrativeBehavioralAssessment: 'Evidência causal ou memória de decisões insuficiente para classificar padrão institucional estruturado.',
      blockedReason: 'Falta de amostragem decisória ou ausência de causalidade fiduciária provada.'
    };
  }
}
