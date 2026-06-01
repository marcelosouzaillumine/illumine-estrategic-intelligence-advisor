import { 
  GovernanceDriftDetectionInput, 
  GovernanceDriftDetectionOutput, 
  GovernanceDriftType, 
  DriftCorrection,
  DriftSeverity
} from './GovernanceDriftTypes';

export class GovernanceDriftDetectionEngine {
  public static evaluate(input: GovernanceDriftDetectionInput): GovernanceDriftDetectionOutput {
    const { 
      executiveNarrative, 
      reconciliation, 
      longitudinalCash, 
      behavioralPatterns, 
      causalityOutput 
    } = input;

    // Fail-Closed: Accounting Integrity
    if (reconciliation.reconciliationStatus === 'FAILED') {
      return this.createBlockedOutput();
    }

    if (!executiveNarrative || executiveNarrative.trim() === '') {
      return this.createNoNarrativeOutput();
    }

    const narrativeLower = executiveNarrative.toLowerCase();
    const driftTypes = new Set<GovernanceDriftType>();
    const conflictingClaims: string[] = [];
    const fiduciaryReality: string[] = [];
    const evidenceTrail: string[] = [];
    const recommendedNarrativeCorrections: DriftCorrection[] = [];
    const blockedOptimisticClaims: string[] = [];
    const affectedDomains = new Set<string>();
    
    let baseRiskScore = 0;

    // Rule 1: OPTIMISTIC_LIQUIDITY_DRIFT
    const liquidityClaims = ['liquidez forte', 'caixa saudável', 'tesouraria robusta', 'posição de caixa confortável', 'liquidez sólida'];
    const hasLiquidityClaim = liquidityClaims.some(claim => narrativeLower.includes(claim));
    
    const isLiquidityPoor = 
      causalityOutput.fcoImpactAssessment === 'IMPACTO_NEGATIVO_OBSERVADO' ||
      causalityOutput.liquidityQualityImpact === 'LIQUIDEZ_ARTIFICIAL_VINCULADA' ||
      longitudinalCash.recoveryNarrativeBlocked;

    if (hasLiquidityClaim && isLiquidityPoor) {
      driftTypes.add('OPTIMISTIC_LIQUIDITY_DRIFT');
      conflictingClaims.push('Alegação de liquidez/caixa saudável.');
      fiduciaryReality.push('FCO negativo, liquidez artificial ou runway crítico detectados.');
      evidenceTrail.push('A narrativa executiva não está aderente às evidências fiduciárias de liquidez.');
      blockedOptimisticClaims.push('liquidez forte / caixa saudável');
      affectedDomains.add('LIQUIDEZ');
      recommendedNarrativeCorrections.push({
        originalClaim: 'liquidez forte / caixa saudável',
        recommendedSubstitution: 'posição de caixa mantida por capital externo com desafio operacional contínuo'
      });
      baseRiskScore += 30;
    }

    // Rule 2: SUSTAINABLE_GROWTH_DRIFT
    const growthClaims = ['crescimento sustentável', 'expansão saudável', 'escala consolidada'];
    const hasGrowthClaim = growthClaims.some(claim => narrativeLower.includes(claim));

    const isGrowthUnsustainable = 
      behavioralPatterns.dominantBehavioralPattern === 'ARTIFICIAL_SCALING' ||
      behavioralPatterns.dominantBehavioralPattern === 'CHRONIC_OVEREXPANSION' ||
      behavioralPatterns.secondaryBehavioralPatterns.includes('CHRONIC_OVEREXPANSION') ||
      causalityOutput.causalChains.some(c => c.chainType === 'CUSTOMER_CREDIT_TO_WORKING_CAPITAL_STRESS');

    if (hasGrowthClaim && isGrowthUnsustainable) {
      driftTypes.add('SUSTAINABLE_GROWTH_DRIFT');
      conflictingClaims.push('Alegação de crescimento/expansão sustentável.');
      fiduciaryReality.push('Expansão associada à queima de FCO, dependência de capital ou retenção no capital de giro.');
      evidenceTrail.push('Há desalinhamento entre a comunicação de crescimento e a trajetória de caixa.');
      blockedOptimisticClaims.push('crescimento sustentável / expansão saudável');
      affectedDomains.add('CRESCIMENTO');
      recommendedNarrativeCorrections.push({
        originalClaim: 'crescimento sustentável',
        recommendedSubstitution: 'crescimento dependente de capital externo com pressão de capital de giro'
      });
      baseRiskScore += 35;
    }

    // Rule 3: ARTIFICIAL_TURNAROUND_DRIFT
    const turnaroundClaims = ['recuperação estrutural', 'turnaround', 'reversão de cenário', 'virada de caixa'];
    const hasTurnaroundClaim = turnaroundClaims.some(claim => narrativeLower.includes(claim));

    const isArtificialTurnaround = 
      longitudinalCash.trajectoryClassification === 'ARTIFICIAL_TURNAROUND' ||
      behavioralPatterns.dominantBehavioralPattern === 'CAPITAL_DEPENDENCY_BEHAVIOR';

    if (hasTurnaroundClaim && isArtificialTurnaround) {
      driftTypes.add('ARTIFICIAL_TURNAROUND_DRIFT');
      conflictingClaims.push('Alegação de turnaround ou recuperação estrutural.');
      fiduciaryReality.push('Melhora de caixa impulsionada primariamente por eventos não-operacionais (Liquidez Artificial).');
      evidenceTrail.push('O termo recuperação estrutural deve ser substituído por alívio temporário financiado externamente.');
      blockedOptimisticClaims.push('recuperação estrutural / turnaround');
      affectedDomains.add('RECUPERACAO');
      recommendedNarrativeCorrections.push({
        originalClaim: 'recuperação estrutural / turnaround',
        recommendedSubstitution: 'alívio de liquidez ancorado em eventos de capitalização não-recorrentes'
      });
      baseRiskScore += 40;
    }

    // Rule 4: GOVERNANCE_MATURITY_DRIFT
    const governanceClaims = ['maturidade de governança', 'gestão disciplinada', 'disciplina de capital', 'gestão de risco eficiente'];
    const hasGovernanceClaim = governanceClaims.some(claim => narrativeLower.includes(claim));

    const hasGovernanceIssue = 
      behavioralPatterns.dominantBehavioralPattern === 'TREASURY_NEGLECT' ||
      behavioralPatterns.dominantBehavioralPattern === 'REACTIVE_MANAGEMENT' ||
      behavioralPatterns.governanceMaturitySignal === 'DETERIORATING';

    if (hasGovernanceClaim && hasGovernanceIssue) {
      driftTypes.add('GOVERNANCE_MATURITY_DRIFT');
      conflictingClaims.push('Alegação de maturidade de governança ou disciplina.');
      fiduciaryReality.push('Padrão de gestão reativa, negligência de tesouraria ou governança em deterioração.');
      evidenceTrail.push('A narrativa de maturidade não se sustenta frente ao padrão reativo/destrutivo de alocação.');
      blockedOptimisticClaims.push('maturidade de governança / disciplina de capital');
      affectedDomains.add('GOVERNANCA');
      recommendedNarrativeCorrections.push({
        originalClaim: 'maturidade de governança',
        recommendedSubstitution: 'gestão em fase de ajuste reativo e necessidade de consolidação de governança'
      });
      baseRiskScore += 30;
    }

    // Rule 5: RISK_UNDERSTATEMENT_DRIFT
    const riskUnderstatementClaims = ['risco mitigado', 'risco controlado', 'cenário seguro'];
    const hasRiskUnderstatement = riskUnderstatementClaims.some(claim => narrativeLower.includes(claim));

    const riskScore = behavioralPatterns.behavioralRiskScore;
    const isRiskScoreHigh = typeof riskScore === 'number' && (riskScore as number) >= 60;

    const hasRealRisk = 
      causalityOutput.continuityRiskImpact === 'RISCO_DIRETO_VINCULADO' ||
      isRiskScoreHigh;

    if (hasRiskUnderstatement && hasRealRisk) {
      driftTypes.add('RISK_UNDERSTATEMENT_DRIFT');
      conflictingClaims.push('Suavização ou mitigação declarada de riscos.');
      fiduciaryReality.push('Presença de risco fiduciário crítico ou score comportamental de alto risco associado a continuidade.');
      evidenceTrail.push('A avaliação fiduciária aponta subdimensionamento narrativo do risco sistêmico atual.');
      blockedOptimisticClaims.push('risco mitigado / cenário seguro');
      affectedDomains.add('RISCO');
      recommendedNarrativeCorrections.push({
        originalClaim: 'risco mitigado / risco controlado',
        recommendedSubstitution: 'cenário de alto risco sob monitoramento fiduciário'
      });
      baseRiskScore += 40;
    }

    // If no drift
    if (driftTypes.size === 0) {
      return this.createNoDriftOutput();
    }

    const narrativeRiskScore = Math.min(100, baseRiskScore);
    
    let driftSeverity: DriftSeverity = 'LOW';
    if (narrativeRiskScore >= 81) driftSeverity = 'CRITICAL';
    else if (narrativeRiskScore >= 61) driftSeverity = 'HIGH';
    else if (narrativeRiskScore >= 41) driftSeverity = 'MODERATE';
    else if (narrativeRiskScore >= 21) driftSeverity = 'LOW';

    const fiduciaryWarnings = ['Alerta Fiduciário: Narrativa executiva não possui lastro na materialidade contábil/causal.'];

    return {
      driftDetected: true,
      driftSeverity,
      driftTypes: Array.from(driftTypes),
      conflictingClaims,
      fiduciaryReality,
      affectedDomains: Array.from(affectedDomains),
      narrativeRiskScore,
      evidenceTrail,
      recommendedNarrativeCorrections,
      blockedOptimisticClaims,
      confidence: 'HIGH',
      fiduciaryWarnings
    };
  }

  private static createBlockedOutput(): GovernanceDriftDetectionOutput {
    return {
      driftDetected: true,
      driftSeverity: 'CRITICAL',
      driftTypes: ['ACCOUNTING_INTEGRITY_BLOCKED'],
      conflictingClaims: ['Qualquer conclusão positiva na ausência de lastro íntegro.'],
      fiduciaryReality: ['Demonstrações financeiras com divergências sistêmicas; base não confiável.'],
      affectedDomains: ['ACCOUNTING', 'GOVERNANCE'],
      narrativeRiskScore: 100,
      evidenceTrail: ['A engine exige saneamento da base contábil antes de aferir consistência da narrativa.'],
      recommendedNarrativeCorrections: [{
        originalClaim: '(Qualquer afirmação fiduciária)',
        recommendedSubstitution: 'As demonstrações financeiras necessitam de saneamento estrutural e reconciliação (Status: FAILED/RESTRICTED).'
      }],
      blockedOptimisticClaims: ['*'],
      confidence: 'BLOCKED',
      fiduciaryWarnings: ['AVISO CRÍTICO: Quarentena Contábil Ativa. A narrativa executiva não possui lastro fidedigno para avaliação fiduciária.']
    };
  }

  private static createNoNarrativeOutput(): GovernanceDriftDetectionOutput {
    return {
      driftDetected: false,
      driftSeverity: 'NONE',
      driftTypes: ['NO_DRIFT'],
      conflictingClaims: [],
      fiduciaryReality: [],
      affectedDomains: [],
      narrativeRiskScore: 0,
      evidenceTrail: ['Nenhuma narrativa submetida para auditoria.'],
      recommendedNarrativeCorrections: [],
      blockedOptimisticClaims: [],
      confidence: 'MODERATE',
      fiduciaryWarnings: []
    };
  }

  private static createNoDriftOutput(): GovernanceDriftDetectionOutput {
    return {
      driftDetected: false,
      driftSeverity: 'NONE',
      driftTypes: ['NO_DRIFT'],
      conflictingClaims: [],
      fiduciaryReality: ['Os dados suportam a narrativa descrita.'],
      affectedDomains: [],
      narrativeRiskScore: 0, // aderente
      evidenceTrail: ['Nenhum desalinhamento fiduciário material detectado no discurso institucional.'],
      recommendedNarrativeCorrections: [],
      blockedOptimisticClaims: [],
      confidence: 'HIGH',
      fiduciaryWarnings: []
    };
  }
}
