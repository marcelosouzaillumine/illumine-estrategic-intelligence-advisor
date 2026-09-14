// src/core/runtime/governance/fiduciary-enforcement/GlobalFiduciaryDistributionEnforcementEngine.ts
//
// Ref: Governance / EFOS — Global Fiduciary Distribution Enforcement Layer
//

import { DLPAFiduciaryOutput } from '../dlpa/DLPAFiduciaryInterpretationEngine';

export interface FiduciaryEnforcementOutput {
  enforcementTriggered: boolean;
  capexEnforcementTriggered: boolean;
  blockedActions: string[];
  removedRecommendations: string[];
  governanceRestrictions: string[];
  fiduciarySeverityLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  institutionalProtectionMode: string;
  causalReasons: string[];
  narrativeOverrides: string[];
  auditTrail: string[];
  lineageHash: string;
}

export class GlobalFiduciaryDistributionEnforcementEngine {
  constructor(...args: any[]) {}
  [key: string]: any;
  static [key: string]: any;
  public static evaluate(
    fiduciaryOutput: DLPAFiduciaryOutput | undefined
  ): FiduciaryEnforcementOutput {
    const auditTrail: string[] = ['Iniciando avaliação do motor global de aplicação fiduciária (GlobalFiduciaryDistributionEnforcementEngine).'];
    const blockedActions: string[] = [];
    const causalReasons: string[] = [];
    const governanceRestrictions: string[] = [];
    const narrativeOverrides: string[] = [];

    // 1. Incompletude / Fallback Fail-Closed
    if (!fiduciaryOutput) {
      auditTrail.push('Aviso: fiduciaryOutput ausente. Ativando modo fail-closed global.');
      return {
        enforcementTriggered: true,
        capexEnforcementTriggered: true,
        blockedActions: ['DIVIDEND', 'DISTRIBUTION', 'PARTNER_EXTRACTION', 'AGGRESSIVE_EXPANSION_FROM_CASH', 'OWNER_WITHDRAWAL', 'AGGRESSIVE_CAPEX_FROM_STRESSED_CASH'],
        removedRecommendations: [],
        governanceRestrictions: ['FiduciaryOutput ausente. Bloqueio distributivo total aplicado.'],
        fiduciarySeverityLevel: 'CRITICAL',
        institutionalProtectionMode: 'FIDUCIARY_PROTECTION_MODE',
        causalReasons: ['INSUFICIÊNCIA_DADOS_FIDUCIÁRIOS'],
        narrativeOverrides: [],
        auditTrail,
        lineageHash: 'ENF_FAIL_CLOSED_MISSING'
      };
    }

    // Check completeness & confidence degradation
    const isPartialContext = 
      fiduciaryOutput.contextCompleteness === 'PARTIAL' || 
      fiduciaryOutput.contextCompleteness === 'MISSING' ||
      fiduciaryOutput.confidenceLevel === 'LOW' ||
      fiduciaryOutput.confidenceLevel === 'RESTRICTED';

    if (isPartialContext) {
      auditTrail.push('Contexto parcial ou confiança degradada detectada. Ativando modo fail-closed.');
      governanceRestrictions.push('Contexto financeiro incompleto ou baixa confiança.');
    }

    // 2. Evaluation of Distribution Blocking Conditions
    const isDistributionIneligible = fiduciaryOutput.distributionEligibility?.eligible === false;
    
    const isForcedOrStressedRetention = [
      'FORCED_RETENTION',
      'EMERGENCY_RETENTION',
      'EMERGENCY_CAPITAL_PRESERVATION',
      'UNSUSTAINABLE_PRESERVATION',
      'RETENTION_NOT_ELIGIBLE'
    ].includes(fiduciaryOutput.retentionClassification);

    const isPatrimonialErosionActive = [
      'SEVERELY_ERODED',
      'CAPITAL_COLLAPSE_RISK',
      'FRAGILIZADA'
    ].includes(fiduciaryOutput.patrimonialIntegrityStatus);

    const isWeakCapitalProtection = [
      'WEAK_CAPITAL_PROTECTION',
      'INSTITUTIONAL_SURVIVAL_MODE',
      'CAPITAL_UNDER_COLLAPSE'
    ].includes(fiduciaryOutput.capitalProtectionStatus) || fiduciaryOutput.institutionalStage === 'SURVIVAL_STAGE_CAPITAL_STRUCTURE';

    const isPreservationRatioUnreliable = fiduciaryOutput.preservationRatioReliability !== 'RELIABLE';
    const isLowConfidence = fiduciaryOutput.confidenceLevel === 'LOW';

    const enforcementTriggered = 
      isPartialContext ||
      isDistributionIneligible ||
      isForcedOrStressedRetention ||
      isPatrimonialErosionActive ||
      isWeakCapitalProtection ||
      isPreservationRatioUnreliable ||
      isLowConfidence;

    // 3. Evaluation of Capex Blocking Conditions
    // Capex excessivo bloqueado apenas se FCO negativo, PL severamente erodido, risco de continuidade, etc.
    const isCapexEnforcementTriggered =
      isPartialContext ||
      isPatrimonialErosionActive ||
      isWeakCapitalProtection ||
      isDistributionIneligible || // if distribution ineligible due to cash flow / PL
      (fiduciaryOutput.fiduciaryWarnings || []).some(w => w.toLowerCase().includes('caixa') || w.toLowerCase().includes('erosão'));

    if (enforcementTriggered) {
      auditTrail.push('Gatilhos fiduciários ativados. Aplicando bloqueios distributivos.');
      blockedActions.push('DIVIDEND', 'DISTRIBUTION', 'PARTNER_EXTRACTION', 'OWNER_WITHDRAWAL', 'AGGRESSIVE_EXPANSION_FROM_CASH');
      governanceRestrictions.push('Bloqueio integral de distribuições societárias e dividendos.');
      
      if (isDistributionIneligible) causalReasons.push('INELEGIBILIDADE_DISTRIBUTIVA');
      if (isForcedOrStressedRetention) causalReasons.push('RETENÇÃO_OBRIGATÓRIA_ESTRESSE');
      if (isPatrimonialErosionActive) causalReasons.push('EROSÃO_PATRIMONIAL_ATIVA');
      if (isWeakCapitalProtection) causalReasons.push('PROTEÇÃO_CAPITAL_FRÁGIL');
      if (isPreservationRatioUnreliable) causalReasons.push('RAZÃO_PRESERVAÇÃO_INCONFIÁVEL');
    }

    if (isCapexEnforcementTriggered) {
      auditTrail.push('Condições de estresse de Capex ativadas. Bloqueando Capex agressivo sem funding.');
      blockedActions.push('AGGRESSIVE_CAPEX_FROM_STRESSED_CASH');
      governanceRestrictions.push('Bloqueio preventivo de Capex agressivo não-fundado.');
      causalReasons.push('ESTRESSE_CAPEX_OPERACIONAL');
    }

    // Resolve Severity level
    let fiduciarySeverityLevel: FiduciaryEnforcementOutput['fiduciarySeverityLevel'] = 'LOW';
    const isLongitudinalFragility = fiduciaryOutput.causalDrivers?.includes('FRAGILIDADE_LONGITUDINAL_ESTRUTURAL');

    if (fiduciaryOutput.patrimonialIntegrityStatus === 'CAPITAL_COLLAPSE_RISK' || isWeakCapitalProtection || isLongitudinalFragility) {
      fiduciarySeverityLevel = 'CRITICAL';
    } else if (isPatrimonialErosionActive || isForcedOrStressedRetention) {
      fiduciarySeverityLevel = 'HIGH';
    } else if (enforcementTriggered) {
      fiduciarySeverityLevel = 'MODERATE';
    }

    const institutionalProtectionMode = enforcementTriggered
      ? 'FIDUCIARY_PROTECTION_MODE'
      : 'STANDARD_GOVERNANCE_MODE';

    // Compute Lineage Hash
    const rawLineage = `${fiduciaryOutput.lineageHash}_${enforcementTriggered}_${isCapexEnforcementTriggered}_${fiduciarySeverityLevel}`;
    let hash = 0;
    for (let i = 0; i < rawLineage.length; i++) {
      hash = (hash << 5) - hash + rawLineage.charCodeAt(i);
      hash = hash & hash;
    }
    const lineageHash = `ENF_FID_${Math.abs(hash).toString(16).toUpperCase()}`;

    return {
      enforcementTriggered,
      capexEnforcementTriggered: isCapexEnforcementTriggered,
      blockedActions,
      removedRecommendations: [],
      governanceRestrictions,
      fiduciarySeverityLevel,
      institutionalProtectionMode,
      causalReasons,
      narrativeOverrides,
      auditTrail,
      lineageHash
    };
  }

  /**
   * Sanitizes narratives by overriding optimistic phrases with sober expressions when enforcement is active.
   */
  public static sanitizeNarrative(text: string, enforcementTriggered: boolean): string {
    if (!text || !enforcementTriggered) return text;

    let sanitized = text;

    const replacements: { pattern: RegExp; replacement: string }[] = [
      // English replacements
      { pattern: /healthy retention/gi, replacement: 'institutional preservation mode' },
      { pattern: /conservative distribution/gi, replacement: 'restricted distributive capacity' },
      { pattern: /strong capital governance/gi, replacement: 'patrimonial fragility' },
      { pattern: /balanced payout/gi, replacement: 'capital protection priority' },
      { pattern: /healthy shareholder return/gi, replacement: 'operational sustainability enforcement' },

      // Portuguese replacements
      { pattern: /retenção saudável/gi, replacement: 'modo de preservação institucional' },
      { pattern: /distribuição conservadora/gi, replacement: 'capacidade distributiva restrita' },
      { pattern: /forte governança de capital/gi, replacement: 'fragilidade patrimonial' },
      { pattern: /payout equilibrado/gi, replacement: 'prioridade de proteção de capital' },
      { pattern: /retorno saudável aos acionistas/gi, replacement: 'execução de sustentabilidade operacional' }
    ];

    replacements.forEach(({ pattern, replacement }) => {
      sanitized = sanitized.replace(pattern, replacement);
    });

    return sanitized;
  }
}
