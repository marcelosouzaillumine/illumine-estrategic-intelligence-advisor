// src/components/institutional-continuity/InstitutionalContinuityMockFactory.ts

export const InstitutionalContinuityMockFactory = {
  createHealthyBaseline() {
    return {
      survivalReport: {
        activeSurvivalMode: 'NORMAL',
        survivalNarrative: 'A organização opera com folga de liquidez e sem pressões de sobrevivência ativas.',
        survivalTriggersActive: [],
        blockedActions: []
      },
      recoveryReport: {
        activeRecoveryStage: 'FULL_REAUTHORIZATION',
        recoveryNarrative: 'Operação plenamente recuperada. Restrições removidas.',
        institutionalRecoveryConfidence: 'HIGH'
      },
      regressionReport: {
        regressionDetected: false,
        regressionNarrative: 'Não há sinais de regressão institucional.',
        activeRegressionTriggers: []
      },
      resilienceReport: {
        resilienceClassification: 'ANTIFRAGILE',
        antifragilityValidated: true,
        confidenceLevel: 'HIGH',
        resilienceScore: 95,
        antifragilityScore: 85,
        vulnerabilityReductionScore: 90,
        institutionalLearningScore: 88,
        shockAbsorptionScore: 92,
        resilienceNarrative: 'Organização comprovadamente antifrágil: fortaleceu tesouraria, governança e liquidez como resposta direta a crises anteriores.',
        blockedConclusions: [],
        allowedConclusions: ['Antifragilidade Estrutural', 'Resiliência Plena', 'Maturidade Governamental']
      },
      fiduciaryOutput: {
        consolidatedSeverity: 'NORMAL',
        blockedConclusions: [],
        treasuryProtectionLevel: 'STRONG',
        institutionalContinuityRisk: 'LOW',
        activeFiduciaryLocks: []
      },
      longitudinalRuntimeHistory: [
        { fco: -100, survivalModeActive: true, treasurySeverity: 'CRITICAL', cycleId: 'Q1' },
        { fco: 50, survivalModeActive: false, treasurySeverity: 'STABLE', cycleId: 'Q2' },
        { fco: 150, survivalModeActive: false, treasurySeverity: 'STABLE', cycleId: 'Q3' },
        { fco: 200, survivalModeActive: false, treasurySeverity: 'STABLE', cycleId: 'Q4' }
      ],
      auditTrail: [
        '[IRAE] Antifragility validated due to past crisis survival and treasury strengthening.',
        '[ISHE] Survival mode deactivated.'
      ],
      failClosedTriggered: false
    };
  },

  createFragileState() {
    return {
      survivalReport: {
        activeSurvivalMode: 'SURVIVAL_MODE',
        survivalNarrative: '[ALERTA CRÍTICO] A organização ativou protocolos de sobrevivência devido à erosão contínua de caixa operacional.',
        survivalTriggersActive: ['FCO_NEGATIVO_CRITICO', 'RUNWAY_CURTO'],
        blockedActions: ['DIVIDEND_BLOCKED', 'AGGRESSIVE_CAPEX_BLOCKED', 'EXPANSION_LOCK']
      },
      recoveryReport: {
        activeRecoveryStage: 'NONE',
        recoveryNarrative: 'A operação não preenche requisitos mínimos para iniciar recuperação.',
        institutionalRecoveryConfidence: 'LOW'
      },
      regressionReport: {
        regressionDetected: true,
        regressionNarrative: 'Detecção de regressão sistêmica na estabilidade operacional.',
        activeRegressionTriggers: ['OPERATIONAL_EROSION']
      },
      resilienceReport: {
        resilienceClassification: 'INSTITUTIONALLY_FRAGILE',
        antifragilityValidated: false,
        confidenceLevel: 'HIGH',
        resilienceScore: 25,
        antifragilityScore: 0,
        vulnerabilityReductionScore: 20,
        institutionalLearningScore: 30,
        shockAbsorptionScore: 10,
        resilienceNarrative: 'Organização apresenta fragilidade estrutural, com alta dependência de medidas de sobrevivência e baixa absorção de choques.',
        blockedConclusions: ['Resiliência', 'Antifragilidade', 'Estabilidade Consolidada'],
        allowedConclusions: ['Fragilidade Operacional', 'Dependência de Sobrevivência']
      },
      fiduciaryOutput: {
        consolidatedSeverity: 'CRÍTICA',
        blockedConclusions: [],
        treasuryProtectionLevel: 'ERODED',
        institutionalContinuityRisk: 'HIGH',
        activeFiduciaryLocks: ['DIVIDEND_BLOCKED', 'AGGRESSIVE_CAPEX_BLOCKED', 'SHAREHOLDER_EXTRACTION_BLOCKED']
      },
      longitudinalRuntimeHistory: [
        { fco: 100, survivalModeActive: false, treasurySeverity: 'STABLE', cycleId: 'Q1' },
        { fco: -50, survivalModeActive: true, treasurySeverity: 'STRESSED', cycleId: 'Q2' },
        { fco: -120, survivalModeActive: true, treasurySeverity: 'CRITICAL', cycleId: 'Q3' }
      ],
      auditTrail: [
        '[ISHE] Survival mode activated due to short runway.',
        '[RRG] Regression detected in Q2.'
      ],
      failClosedTriggered: false
    };
  },

  createFailClosedState() {
    return {
      survivalReport: {
        activeSurvivalMode: 'UNKNOWN',
        survivalNarrative: 'Avaliação suspensa por ausência fiduciária.',
        survivalTriggersActive: [],
        blockedActions: ['ALL_NON_ESSENTIAL_FROZEN']
      },
      recoveryReport: {
        activeRecoveryStage: 'UNKNOWN',
        recoveryNarrative: 'Recuperação suspensa devido à falha de validação.',
        institutionalRecoveryConfidence: 'LOW'
      },
      regressionReport: {
        regressionDetected: true,
        regressionNarrative: 'Regressão de segurança ativada por falha determinística.',
        activeRegressionTriggers: ['FAIL_CLOSED_FALLBACK']
      },
      resilienceReport: {
        resilienceClassification: 'STRUCTURALLY_STABLE',
        antifragilityValidated: false,
        confidenceLevel: 'LOW',
        resilienceScore: 0,
        antifragilityScore: 0,
        vulnerabilityReductionScore: 0,
        institutionalLearningScore: 0,
        shockAbsorptionScore: 0,
        resilienceNarrative: 'Avaliação de resiliência não confiável. Inferência bloqueada.',
        blockedConclusions: ['Antifragilidade', 'Resiliência Comprovada'],
        allowedConclusions: []
      },
      fiduciaryOutput: {
        consolidatedSeverity: 'CRÍTICA',
        blockedConclusions: ['Any positive assessment'],
        treasuryProtectionLevel: 'UNKNOWN',
        institutionalContinuityRisk: 'HIGH',
        activeFiduciaryLocks: ['FAIL_CLOSED_LOCK']
      },
      longitudinalRuntimeHistory: [],
      auditTrail: [
        '[SYSTEM] Fail-closed mechanism triggered due to missing data or hash mismatch.'
      ],
      failClosedTriggered: true
    };
  }
};
