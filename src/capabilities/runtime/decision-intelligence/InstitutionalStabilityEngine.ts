import { 
  InstitutionalStabilityInput, 
  InstitutionalStabilityIndexOutput, 
  StabilityClassification, 
  ContinuityRiskLevel, 
  ResilienceAssessment 
} from './InstitutionalStabilityTypes';

export class InstitutionalStabilityEngine {
  public static evaluate(input: InstitutionalStabilityInput): InstitutionalStabilityIndexOutput {
    const { 
      reconciliation, 
      longitudinalCash, 
      fiduciaryTimeline, 
      behavioralPatterns, 
      causalityOutput, 
      driftOutput, 
      accountabilityOutput 
    } = input;

    // Fail-Closed: Accounting Integrity
    if (reconciliation.reconciliationStatus === 'FAILED') {
      return this.createBlockedOutput();
    }

    if (fiduciaryTimeline.timelineIntegrityStatus === 'BROKEN' || fiduciaryTimeline.timelineIntegrityStatus === 'INSUFFICIENT_HISTORY') {
      return this.createBlockedOutput();
    }

    if (accountabilityOutput.accountabilityStatus === 'INSUFFICIENT_ACCOUNTABILITY_EVIDENCE') {
      return this.createInsufficientEvidenceOutput();
    }

    const stabilizingFactors: string[] = [];
    const destabilizingFactors: string[] = [];
    const dominantStabilityDrivers: string[] = [];
    const structuralFragilityFlags: string[] = [];
    const fiduciaryWarnings: string[] = [];
    const evidenceTrail: string[] = [];

    let score = 100;

    // --- Deductions ---
    const isLiquidityArtificial = causalityOutput.liquidityQualityImpact === 'LIQUIDEZ_ARTIFICIAL_VINCULADA';
    if (isLiquidityArtificial) {
      score -= 30;
      destabilizingFactors.push('Liquidez mantida artificialmente via injeção externa.');
      structuralFragilityFlags.push('ARTIFICIAL_LIQUIDITY');
    }

    const isRunwayCritical = causalityOutput.runwayImpactAssessment === 'IMPACTO_NEGATIVO_OBSERVADO'; // Simulating runway pressure
    if (isRunwayCritical) {
      score -= 25;
      destabilizingFactors.push('Runway fiduciário encontra-se em nível crítico.');
      structuralFragilityFlags.push('CRITICAL_RUNWAY');
    }

    const isFCONegative = causalityOutput.fcoImpactAssessment === 'IMPACTO_NEGATIVO_OBSERVADO';
    if (isFCONegative) {
      score -= 25;
      destabilizingFactors.push('Geração operacional de caixa (FCO) sucessivamente deteriorada.');
      structuralFragilityFlags.push('NEGATIVE_FCO');
    }

    const hasCapitalDependency = causalityOutput.causalChains.some(c => c.chainType === 'CAPITALIZATION_TO_ARTIFICIAL_LIQUIDITY');
    if (hasCapitalDependency) {
      score -= 25;
      destabilizingFactors.push('Dependência contínua de refinanciamento ou capital externo para continuidade.');
      structuralFragilityFlags.push('EXTERNAL_DEPENDENCY');
    }

    const driftSeverity = driftOutput.driftSeverity;
    if (driftSeverity === 'CRITICAL') score -= 20;
    else if (driftSeverity === 'HIGH') score -= 15;
    
    if (driftSeverity === 'CRITICAL' || driftSeverity === 'HIGH') {
      destabilizingFactors.push(`Drift Narrativo classificado como ${driftSeverity}.`);
    }

    const behavioralScore = typeof behavioralPatterns.behavioralRiskScore === 'number' ? behavioralPatterns.behavioralRiskScore : 0;
    if (behavioralScore >= 60) {
      score -= 20;
      destabilizingFactors.push('Risco comportamental e viés destrutivo elevados.');
      structuralFragilityFlags.push('HIGH_BEHAVIORAL_RISK');
    }

    const accountabilityScore = typeof accountabilityOutput.accountabilityScore === 'number' ? accountabilityOutput.accountabilityScore : 0;
    if (accountabilityScore < 50) {
      score -= 20;
      destabilizingFactors.push('Accountability fiduciária e capacidade corretiva demonstradas como frágeis.');
      structuralFragilityFlags.push('FRAGILE_ACCOUNTABILITY');
    }

    // Working capital stress check
    const hasWorkingCapitalStress = behavioralPatterns.dominantBehavioralPattern === 'RECURRENT_WORKING_CAPITAL_STRESS' || causalityOutput.causalChains.some(c => c.chainType === 'CUSTOMER_CREDIT_TO_WORKING_CAPITAL_STRESS');
    if (hasWorkingCapitalStress) {
      score -= 15;
      destabilizingFactors.push('Capital de giro sob pressão estrutural restritiva.');
      structuralFragilityFlags.push('WORKING_CAPITAL_STRESS');
    }

    // --- Ceilings (Tetos de Score) ---
    const trajectory = longitudinalCash.trajectoryClassification;
    const pattern = behavioralPatterns.dominantBehavioralPattern;
    const accStatus = accountabilityOutput.accountabilityStatus;

    if (trajectory === 'ARTIFICIAL_TURNAROUND') {
      score = Math.min(score, 35);
      fiduciaryWarnings.push('Score limitado a 35 devido a Trajetória de Turnaround Artificial.');
    }
    if (trajectory === 'CHRONIC_DEPENDENCY') {
      score = Math.min(score, 40);
      fiduciaryWarnings.push('Score limitado a 40 devido a Dependência Crônica de Caixa.');
    }
    if (trajectory === 'PROGRESSIVE_DETERIORATION') {
      score = Math.min(score, 30);
      fiduciaryWarnings.push('Score limitado a 30 devido a Deterioração Progressiva do Caixa.');
    }
    if (trajectory === 'STRUCTURAL_CASH_COLLAPSE') {
      score = Math.min(score, 15);
      fiduciaryWarnings.push('Score limitado a 15 devido a Colapso Estrutural de Caixa.');
    }

    if (pattern === 'TREASURY_NEGLECT') {
      score = Math.min(score, 35);
      fiduciaryWarnings.push('Score limitado a 35 devido a Negligência de Tesouraria detectada.');
    }

    if (accStatus === 'RECURRENT_STRUCTURAL_FAILURE') {
      score = Math.min(score, 25);
      fiduciaryWarnings.push('Score limitado a 25 devido a Falha Estrutural Recorrente na prestação de contas.');
    }
    if (accStatus === 'NON_CORRECTIVE_MANAGEMENT_PATTERN') {
      score = Math.min(score, 20);
      fiduciaryWarnings.push('Score limitado a 20 devido a Padrão de Gestão Não-Corretivo.');
    }
    if (driftSeverity === 'CRITICAL') {
      score = Math.min(score, 40);
      fiduciaryWarnings.push('Score limitado a 40 devido a Desalinhamento Narrativo Crítico.');
    }

    score = Math.max(0, score); // Ensure min is 0

    // --- Classification ---
    let classification: StabilityClassification = 'INSUFFICIENT_STABILITY_EVIDENCE';
    
    if (score >= 80 && trajectory === 'STABLE_SUSTAINABILITY' && !isLiquidityArtificial && accountabilityScore >= 70 && behavioralScore <= 30) {
      classification = 'STRUCTURALLY_STABLE';
      stabilizingFactors.push('Geração orgânica de caixa suporta integralmente as operações e crescimento.');
      dominantStabilityDrivers.push('FCO positivo recorrente e runway consolidado.');
      evidenceTrail.push('A instituição comprova resiliência operacional contínua e forte capacidade corretiva sem uso vicioso de terceiros.');
    } else if (trajectory === 'ARTIFICIAL_TURNAROUND' || (isLiquidityArtificial && trajectory !== 'PROGRESSIVE_DETERIORATION' && trajectory !== 'STRUCTURAL_CASH_COLLAPSE')) {
      classification = 'APPARENT_STABILITY';
      evidenceTrail.push('A estabilidade é aparente e depende de suporte externo (liquidez artificial).');
      dominantStabilityDrivers.push('Injeções de capital/dívida que mascaram deficiências do FCO.');
    } else if (score >= 50 && !isLiquidityArtificial && hasWorkingCapitalStress) {
      classification = 'FRAGILE_STABILITY';
      evidenceTrail.push('A instituição apresenta fragilidade estrutural de caixa oriunda do capital de giro.');
      dominantStabilityDrivers.push('Caixa orgânico, porém sob estresse de giro limitando a capacidade de choque.');
    } else if (score >= 40) {
      classification = 'STABLE_BUT_MONITORED';
      evidenceTrail.push('Posição estável, mas vulnerabilidades estruturais (FCO ou Drift) exigem observação.');
      dominantStabilityDrivers.push('Manutenção de runway em ciclo imediato, apesar da pressão.');
    } else if (score > 25 && score < 40) {
      classification = 'UNSTABLE';
      evidenceTrail.push('Inviabilidade operacional primária latente compensada parcial ou temporariamente.');
    } else if (score > 15 && score <= 25) {
      classification = 'CRITICAL_INSTABILITY';
      evidenceTrail.push('Deterioração de liquidez, falha na prestação de contas corretiva e/ou narrativa irreal.');
    } else if (score <= 15) {
      classification = 'COLLAPSE_RISK';
      evidenceTrail.push('Sinais severos de interrupção operacional e queima estrutural insolúvel via operação matriz.');
    }

    // --- Resilience and Continuity ---
    let resilienceAssessment: ResilienceAssessment = 'LOW_RESILIENCE';
    if (classification === 'STRUCTURALLY_STABLE') resilienceAssessment = 'HIGH_RESILIENCE';
    else if (classification === 'FRAGILE_STABILITY' || classification === 'STABLE_BUT_MONITORED') resilienceAssessment = 'MODERATE_RESILIENCE';
    else if (classification === 'APPARENT_STABILITY') resilienceAssessment = 'FRAGILE_RESILIENCE';
    else if (classification === 'COLLAPSE_RISK') resilienceAssessment = 'NO_EVIDENCE_OF_RESILIENCE';

    let continuityRiskLevel: ContinuityRiskLevel = 'HIGH';
    if (score >= 75) continuityRiskLevel = 'LOW';
    else if (score >= 50) continuityRiskLevel = 'MODERATE';
    else if (score < 25) continuityRiskLevel = 'CRITICAL';

    if (classification === 'FRAGILE_STABILITY' && continuityRiskLevel === 'LOW') {
      continuityRiskLevel = 'MODERATE';
    }

    const narrative = classification === 'APPARENT_STABILITY' 
      ? 'A estabilidade observada no período não é sustentada pela trajetória longitudinal, caracterizando uma falsa robustez dependente de eventos externos.'
      : `O Governance Runtime classifica a estabilidade atual como ${classification}. ${evidenceTrail[0] || ''}`;

    return {
      stabilityScore: score,
      stabilityClassification: classification,
      stabilityConfidence: 'HIGH',
      dominantStabilityDrivers,
      destabilizingFactors,
      stabilizingFactors,
      structuralFragilityFlags,
      continuityRiskLevel,
      resilienceAssessment,
      institutionalMaturitySignal: behavioralPatterns.governanceMaturitySignal,
      evidenceTrail,
      fiduciaryWarnings,
      narrativeStabilityAssessment: narrative
    };
  }

  private static createBlockedOutput(): InstitutionalStabilityIndexOutput {
    return {
      stabilityScore: 'NOT_AVAILABLE',
      stabilityClassification: 'BLOCKED_BY_ACCOUNTING_INTEGRITY',
      stabilityConfidence: 'BLOCKED',
      dominantStabilityDrivers: [],
      destabilizingFactors: ['Base contábil invalidada/restringida.'],
      stabilizingFactors: [],
      structuralFragilityFlags: ['ACCOUNTING_COMPROMISED'],
      continuityRiskLevel: 'BLOCKED',
      resilienceAssessment: 'BLOCKED',
      institutionalMaturitySignal: 'BLOCKED',
      evidenceTrail: ['A avaliação de estabilidade foi interrompida devido à falha severa na integridade das demonstrações subjacentes.'],
      fiduciaryWarnings: ['Nenhuma estabilidade pode ser inferida sobre base contábil contaminada.'],
      narrativeStabilityAssessment: 'A estabilidade institucional não pode ser verificada pois não há lastro em contabilidade fiduciária íntegra.',
      blockedReason: 'ACCOUNTING_INTEGRITY_FAIL_CLOSED'
    };
  }

  private static createInsufficientEvidenceOutput(): InstitutionalStabilityIndexOutput {
    return {
      stabilityScore: 'NOT_AVAILABLE',
      stabilityClassification: 'INSUFFICIENT_STABILITY_EVIDENCE',
      stabilityConfidence: 'LOW',
      dominantStabilityDrivers: [],
      destabilizingFactors: [],
      stabilizingFactors: [],
      structuralFragilityFlags: [],
      continuityRiskLevel: 'MODERATE',
      resilienceAssessment: 'NO_EVIDENCE_OF_RESILIENCE',
      institutionalMaturitySignal: 'NOT_AVAILABLE',
      evidenceTrail: ['Histórico de dados ou decisões insuficientes para gerar score de estabilidade contínua.'],
      fiduciaryWarnings: ['Score retido preventivamente para evitar "falsos-positivos" de estabilidade.'],
      narrativeStabilityAssessment: 'Não há dados históricos transversais suficientes para classificar a instituição com segurança sob o prisma de estabilidade estrutural.',
      blockedReason: 'INSUFFICIENT_LONGITUDINAL_OR_CAUSAL_HISTORY'
    };
  }
}
