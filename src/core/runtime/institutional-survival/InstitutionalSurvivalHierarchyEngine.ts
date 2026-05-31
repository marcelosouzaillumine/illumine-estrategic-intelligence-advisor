// src/core/runtime/institutional-survival/InstitutionalSurvivalHierarchyEngine.ts

import { SurvivalEvaluationInput, InstitutionalSurvivalOutput, ActiveSurvivalMode } from './SurvivalTypes';
import { SurvivalPriorityClassificationEngine } from './SurvivalPriorityClassificationEngine';
import { InstitutionalConflictArbitrationEngine } from './InstitutionalConflictArbitrationEngine';

export class InstitutionalSurvivalHierarchyEngine {
  public static evaluate(input: SurvivalEvaluationInput): InstitutionalSurvivalOutput {
    const auditTrail: string[] = ['Iniciando avaliação do motor de sobrevivência institucional (InstitutionalSurvivalHierarchyEngine).'];
    
    // 1. Fail-Closed check for missing required runtimes
    const isMissingRuntimes = !input.fiduciaryOutput || !input.treasuryRuntime || !input.cashIntelligenceRuntime;
    
    const isLowConfidence = 
      input.fiduciaryOutput?.confidenceLevel === 'LOW' ||
      input.treasuryRuntime?.confidenceLevel === 'LOW' ||
      input.cashIntelligenceRuntime?.confidenceLevel === 'LOW' ||
      input.patrimonialIntelligenceRuntime?.confidenceLevel === 'LOW';

    const isLineageIncomplete = 
      !input.fiduciaryOutput?.lineageHash ||
      !input.treasuryRuntime?.treasuryLineageHash ||
      !input.cashIntelligenceRuntime?.lineageHash;

    if (isMissingRuntimes || isLowConfidence || isLineageIncomplete) {
      auditTrail.push(`Modo fail-closed ativado. Insumos ausentes: ${isMissingRuntimes}, Confiança baixa: ${isLowConfidence}, Lineage incompleto: ${isLineageIncomplete}`);
      return {
        activeSurvivalMode: 'SURVIVAL_MODE',
        currentHierarchyLevel: 1,
        blockedHierarchyLevels: [
          'LEVEL_2_STRUCTURAL_STABILIZATION',
          'LEVEL_3_RESILIENCE_REINFORCEMENT',
          'LEVEL_4_SUSTAINABLE_EXPANSION',
          'LEVEL_5_SHAREHOLDER_OPTIMIZATION'
        ],
        allowedInstitutionalPriorities: ['CASH_PRESERVATION', 'COST_CONTAINMENT', 'TREASURY_STABILIZATION', 'OPERATIONAL_RECOVERY', 'LIABILITY_PROTECTION'],
        forbiddenInstitutionalPriorities: ['EXPANSION', 'AGGRESSIVE_HIRING', 'SHAREHOLDER_RETURN', 'DIVIDEND', 'OWNER_WITHDRAWAL', 'AGGRESSIVE_CAPEX'],
        institutionalConstraints: ['Required runtimes missing or degraded. Fail-closed survival protection active.'],
        arbitrationDecisions: ['All decisions overridden: Survival prioritization active.'],
        treasuryProtectionLevel: 'CRITICAL',
        institutionalContinuityRisk: 'CRITICAL',
        causalDrivers: ['MISSING_OR_DEGRADED_RUNTIMES'],
        survivalNarrative: 'Modo de sobrevivência emergencial ativo devido a dados incompletos ou indisponibilidade de runtimes.',
        failClosedTriggered: true,
        auditTrail,
        lineageHash: 'ISHE_FAIL_CLOSED_ACTIVE',
        confidenceLevel: 'LOW'
      };
    }

    const fidOut = input.fiduciaryOutput;
    const treasury = input.treasuryRuntime;
    const cashInt = input.cashIntelligenceRuntime;
    const historicalCycles = input.historicalCycles || [];
    const memoryProfile = input.memoryProfile || {};
    const fco = input.fco ?? 0;
    const availableCash = input.availableCash ?? 0;

    // 2. Evaluation of Survival Activation Conditions
    const negativeFCO = fco < 0;
    const runwayCritico = cashInt.continuityRisk?.projectedRunwayMonths < 3;
    const plEroded = fidOut.patrimonialIntegrityStatus === 'SEVERELY_ERODED' || fidOut.patrimonialIntegrityStatus === 'CAPITAL_COLLAPSE_RISK';
    const cashOperationalCritical = cashInt.liquidityClassification?.classification === 'CONTINUITY_RISK' || availableCash <= 0 || cashInt.continuityRisk?.runwayStability === 'COLLAPSING';
    
    // Critical liabilities coverage
    const shortTermDebt = input.patrimonialIntelligenceRuntime?.bpData?.passivoCirculante || 0;
    const passivosCriticosSemCobertura = shortTermDebt > availableCash && availableCash < 1000; // custom coverage check
    
    // Recurring losses & structural fragility
    const recurringLosses = historicalCycles.filter((c: any) => c.netIncome <= 0).length >= 2;
    const persistentStructuralFragility = fidOut.causalDrivers?.includes('FRAGILIDADE_LONGITUDINAL_ESTRUTURAL') || memoryProfile?.persistentStructuralFragility === true;
    
    const treasuryCollapseRisk = treasury.severity === 'TREASURY_RUPTURE_RISK' || treasury.severity === 'UNSUSTAINABLE';
    const capitalProtectionWeak = fidOut.capitalProtectionStatus === 'WEAK_CAPITAL_PROTECTION' || fidOut.capitalProtectionStatus === 'CAPITAL_UNDER_COLLAPSE';
    
    // Check if fiduciary enforcement is active
    const fiduciaryEnforcementTriggered = fidOut.blockedConclusions?.length > 0 || (fidOut.distributionEligibility?.eligible === false);

    let isSurvivalTriggered =
      negativeFCO ||
      runwayCritico ||
      plEroded ||
      cashOperationalCritical ||
      passivosCriticosSemCobertura ||
      recurringLosses ||
      persistentStructuralFragility ||
      treasuryCollapseRisk ||
      capitalProtectionWeak ||
      fiduciaryEnforcementTriggered;

    // IRAE Integration: Resilience tolerance override
    if (input.resilienceReport && isSurvivalTriggered) {
      const resilience = input.resilienceReport.resilienceClassification;
      if (resilience === 'ANTIFRAGILE' || resilience === 'ADAPTIVE') {
        // Antifragile organizations tolerate minor shocks (like a single negative FCO or fiduciary enforcement trigger that isn't a collapse)
        // They do NOT tolerate critical collapses like runway < 3, treasury collapse, or severely eroded PL.
        const criticalCollapseActive = runwayCritico || plEroded || cashOperationalCritical || treasuryCollapseRisk;
        
        if (!criticalCollapseActive && negativeFCO) {
          isSurvivalTriggered = false; // Override minor shock
          auditTrail.push(`[ISHE] Tolerância adaptativa (IRAE): Sobrevivência seria ativada por fatores menores, mas organização é ${resilience}. Modo sobrevivência evitado.`);
        }
      }
    }

    if (isSurvivalTriggered) {
      auditTrail.push(`Gatilhos de sobrevivência ativados. FCO negativo: ${negativeFCO}, Runway crítico: ${runwayCritico}, PL erodido: ${plEroded}, Caixa crítico: ${cashOperationalCritical}`);
    }

    // 3. Classify Active Mode & Hierarchical Levels
    let classification = SurvivalPriorityClassificationEngine.classify(input, isSurvivalTriggered);
    auditTrail.push(`Modo de sobrevivência inicialmente classificado como: ${classification.mode} (Nível ${classification.level})`);

    // 3.5. IRRE Veto (Institutional Recovery & Reauthorization Engine)
    if (input.recoveryReport && input.recoveryReport.recoveryAuthorized === false && classification.mode !== 'SURVIVAL_MODE') {
      auditTrail.push(`Veto do IRRE ativado: Tentativa de saída do modo de sobrevivência bloqueada. Status de reautorização: ${input.recoveryReport.activeRecoveryStage}`);
      classification.mode = 'SURVIVAL_MODE';
      classification.level = 1;
      classification.blockedLevels = [
        'LEVEL_2_STRUCTURAL_STABILIZATION',
        'LEVEL_3_RESILIENCE_REINFORCEMENT',
        'LEVEL_4_SUSTAINABLE_EXPANSION',
        'LEVEL_5_SHAREHOLDER_OPTIMIZATION'
      ];
    }

    // 3.6. RRG Veto (Recovery Regression Guard Engine)
    if (input.regressionReport?.survivalModeReactivated === true && classification.mode !== 'SURVIVAL_MODE') {
      auditTrail.push('Veto do RRG ativado: Regressão severa detectada. Operação forçada de volta ao SURVIVAL_MODE.');
      classification.mode = 'SURVIVAL_MODE';
      classification.level = 1;
      classification.blockedLevels = [
        'LEVEL_2_STRUCTURAL_STABILIZATION',
        'LEVEL_3_RESILIENCE_REINFORCEMENT',
        'LEVEL_4_SUSTAINABLE_EXPANSION',
        'LEVEL_5_SHAREHOLDER_OPTIMIZATION'
      ];
    }


    // 4. Resolve conflicts via arbitration
    const arbitration = InstitutionalConflictArbitrationEngine.arbitrate(input);
    auditTrail.push('Decisões de arbitragem de conflitos aplicadas.');

    // 5. Determine Severity and Protection Levels
    let treasuryProtectionLevel: InstitutionalSurvivalOutput['treasuryProtectionLevel'] = 'NORMAL';
    let institutionalContinuityRisk: InstitutionalSurvivalOutput['institutionalContinuityRisk'] = 'LOW';

    if (classification.mode === 'SURVIVAL_MODE') {
      treasuryProtectionLevel = 'CRITICAL';
      institutionalContinuityRisk = 'CRITICAL';
    } else if (classification.mode === 'STABILIZATION_MODE') {
      treasuryProtectionLevel = 'HIGH';
      institutionalContinuityRisk = 'HIGH';
    } else if (classification.mode === 'RESILIENCE_MODE') {
      treasuryProtectionLevel = 'ELEVATED';
      institutionalContinuityRisk = 'MODERATE';
    }

    // 6. Longitudinal Memory Enforcement
    let confidenceLevel: 'LOW' | 'MODERATE' | 'HIGH' = 'HIGH';
    
    const hasErosionHistory = historicalCycles.some((c: any) => c.endingEquity < c.startingEquity);
    const hasTreasuryHistory = memoryProfile?.fatigueScore > 40;
    const hasForcedRetentionHistory = fidOut.retentionClassification === 'FORCED_RETENTION' || fidOut.retentionClassification === 'EMERGENCY_RETENTION';
    const hasSurvivalHistory = historicalCycles.filter((c: any) => c.netIncome <= 0).length >= 2;

    if (hasErosionHistory && hasTreasuryHistory && hasForcedRetentionHistory && hasSurvivalHistory) {
      confidenceLevel = 'LOW'; // degrade confidence level under extreme longitudinal fragility
      auditTrail.push('Aviso fiduciário: Fragilidade longitudinal recorrente detectada. Degradando a confiança de recuperação institucional para LOW.');
    } else if (hasErosionHistory || hasTreasuryHistory || hasSurvivalHistory) {
      confidenceLevel = 'MODERATE';
    }

    // Build Causal Drivers
    const causalDrivers: string[] = [];
    if (negativeFCO) causalDrivers.push('FCO_NEGATIVO');
    if (runwayCritico) causalDrivers.push('RUNWAY_COLAPSO');
    if (plEroded) causalDrivers.push('EROSÃO_PATRIMONIAL_CRÍTICA');
    if (cashOperationalCritical) causalDrivers.push('CAIXA_OPERACIONAL_CRÍTICO');
    if (recurringLosses) causalDrivers.push('PREJUÍZOS_RECORRENTES');
    if (persistentStructuralFragility) causalDrivers.push('FRAGILIDADE_ESTRUTURAL_LONGITUDINAL');
    if (treasuryCollapseRisk) causalDrivers.push('RISCO_COLAPSO_TESOURARIA');

    // Build Narrative
    let survivalNarrative = '';
    if (classification.mode === 'SURVIVAL_MODE') {
      survivalNarrative = 'A operação encontra-se em estágio crítico de sobrevivência imediata. Todas as alocações devem priorizar a manutenção operacional básica e a preservação de caixa.';
    } else if (classification.mode === 'STABILIZATION_MODE') {
      survivalNarrative = 'Estágio de estabilização estrutural ativo. Foco em recuperação operacional, redução de volatilidade de tesouraria e contenção de danos.';
    } else if (classification.mode === 'RESILIENCE_MODE') {
      survivalNarrative = 'Reforço de resiliência ativo. Acumulação prudente de reservas financeiras e aumento do runway de liquidez.';
    } else if (classification.mode === 'CONTROLLED_GROWTH_MODE') {
      survivalNarrative = 'Expansão controlada permitida. Alocações táticas para crescimento orgânico sem comprometer a estabilidade de capital.';
    } else {
      survivalNarrative = 'Otimização de retorno autorizada. Estrutura de capital resiliente e geração operacional consolidada suportam distribuições equilibradas.';
    }

    // Compute Lineage Hash
    const rawLineage = `${fidOut.lineageHash}_${treasury.treasuryLineageHash}_${cashInt.lineageHash}_${classification.mode}`;
    let hash = 0;
    for (let i = 0; i < rawLineage.length; i++) {
      hash = (hash << 5) - hash + rawLineage.charCodeAt(i);
      hash = hash & hash;
    }
    const lineageHash = `ISHE_SURV_${Math.abs(hash).toString(16).toUpperCase()}`;

    // Apply fail-closed fallback if confidence degraded to LOW
    if (confidenceLevel === 'LOW') {
      return {
        activeSurvivalMode: 'SURVIVAL_MODE',
        currentHierarchyLevel: 1,
        blockedHierarchyLevels: [
          'LEVEL_2_STRUCTURAL_STABILIZATION',
          'LEVEL_3_RESILIENCE_REINFORCEMENT',
          'LEVEL_4_SUSTAINABLE_EXPANSION',
          'LEVEL_5_SHAREHOLDER_OPTIMIZATION'
        ],
        allowedInstitutionalPriorities: ['CASH_PRESERVATION', 'COST_CONTAINMENT', 'TREASURY_STABILIZATION', 'OPERATIONAL_RECOVERY', 'LIABILITY_PROTECTION'],
        forbiddenInstitutionalPriorities: ['EXPANSION', 'AGGRESSIVE_HIRING', 'SHAREHOLDER_RETURN', 'DIVIDEND', 'OWNER_WITHDRAWAL', 'AGGRESSIVE_CAPEX'],
        institutionalConstraints: ['Longitudinal fragility triggers automatic low recovery confidence. Fail-closed active.'],
        arbitrationDecisions: ['All decisions overridden: Survival prioritization active due to low confidence.'],
        treasuryProtectionLevel: 'CRITICAL',
        institutionalContinuityRisk: 'CRITICAL',
        causalDrivers: ['LONGITUDINAL_FRAGILITY_COLLAPSE'],
        survivalNarrative: 'Modo de sobrevivência emergencial ativo imposto pela baixa confiança fiduciária de recuperação longitudinal.',
        failClosedTriggered: true,
        auditTrail,
        lineageHash: 'ISHE_FAIL_CLOSED_CONFIDENCE',
        confidenceLevel: 'LOW'
      };
    }

    return {
      activeSurvivalMode: classification.mode,
      currentHierarchyLevel: classification.level,
      blockedHierarchyLevels: classification.blockedLevels,
      allowedInstitutionalPriorities: arbitration.allowedPriorities,
      forbiddenInstitutionalPriorities: arbitration.forbiddenPriorities,
      institutionalConstraints: arbitration.constraints,
      arbitrationDecisions: arbitration.decisions,
      treasuryProtectionLevel,
      institutionalContinuityRisk,
      causalDrivers,
      survivalNarrative,
      failClosedTriggered: false,
      auditTrail,
      lineageHash,
      confidenceLevel
    };
  }
}
