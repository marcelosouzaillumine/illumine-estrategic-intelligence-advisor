import { 
  LegacyOperationalSustainabilityAssessment,
  FiduciaryOperationalSustainabilityAssessment
} from './CashIntelligenceTypes';

export class OperationalSustainabilityRuntime {
  /**
   * Determina a sustentabilidade operacional real e a consistência da geração de caixa.
   * Retorna os dois formatos (legacy e fiduciary) para migração segura.
   */
  public static evaluate(
    fco: number,
    fcf: number,
    netIncome: number,
    workingCapitalVariation: number,
    historicalCyclesCount: number
  ): { 
    legacy: LegacyOperationalSustainabilityAssessment; 
    fiduciary: FiduciaryOperationalSustainabilityAssessment 
  } {
    // --- Lógica Base ---
    
    // 1. Capacidade de Autofinanciamento
    let selfFinancingCapacity: 'HIGH' | 'MODERATE' | 'LOW' | 'NONE' = 'NONE';
    if (fco > 0 && netIncome > 0) {
      selfFinancingCapacity = 'HIGH';
    } else if (fco > 0) {
      selfFinancingCapacity = 'MODERATE';
    } else if (netIncome > 0) {
      selfFinancingCapacity = 'LOW';
    } else {
      selfFinancingCapacity = 'NONE';
    }

    // 2. Consistência do Caixa Operacional
    let operationalCashConsistency: 'HIGH_CONSISTENCY' | 'MODERATE_CONSISTENCY' | 'VOLATILE' | 'INSUFFICIENT_HISTORY' = 'INSUFFICIENT_HISTORY';
    if (historicalCyclesCount < 2) {
      operationalCashConsistency = 'INSUFFICIENT_HISTORY';
    } else if (fco < 0) {
      operationalCashConsistency = 'VOLATILE';
    } else if (fco > 0 && selfFinancingCapacity === 'HIGH') {
      operationalCashConsistency = 'HIGH_CONSISTENCY';
    } else {
      operationalCashConsistency = 'MODERATE_CONSISTENCY';
    }

    // 3. Índice de Fragilidade Operacional (0 a 100)
    let operationalFragilityIndex = 0;
    if (fco < 0) {
      operationalFragilityIndex += 40;
    }
    if (netIncome < 0) {
      operationalFragilityIndex += 20;
    }
    if (workingCapitalVariation > 0) {
      // Dreno de capital de giro
      operationalFragilityIndex += 20;
    }
    if (fco < 0 && fcf > Math.abs(fco)) {
      // Liquidez artificial
      operationalFragilityIndex += 20;
    }
    operationalFragilityIndex = Math.min(operationalFragilityIndex, 100);

    // 4. Tendência de Dependência
    let dependencyTrend: 'STRENGTHENING' | 'STABLE' | 'DEGRADATING' | 'CRITICAL' = 'STABLE';
    if (fco < 0 && fcf < 0) {
      dependencyTrend = 'CRITICAL';
    } else if (fco < 0 && fcf > 0) {
      dependencyTrend = 'DEGRADATING';
    } else if (fco > 0 && fcf <= 0) {
      dependencyTrend = 'STRENGTHENING';
    } else {
      dependencyTrend = 'STABLE';
    }

    // 5. Score de Resiliência
    const resilienceScore = 100 - operationalFragilityIndex;

    // 6. Consistência Longitudinal
    let longitudinalConsistency = '';
    if (resilienceScore >= 80) {
      longitudinalConsistency = 'Excelente consistência longitudinal com geração de caixa saudável e baixo risco operacional.';
    } else if (resilienceScore >= 50) {
      longitudinalConsistency = 'Consistência operacional moderada. Geração de caixa positiva, mas sensível a variações de capital de giro ou margem.';
    } else {
      longitudinalConsistency = 'Deterioração de caixa detectada. A operação apresenta fragilidade estrutural e consumo de caixa consistente.';
    }

    const isSustained = fco > 0 && resilienceScore >= 50;

    // --- Mapeamento Legacy ---
    const legacy: LegacyOperationalSustainabilityAssessment = {
      isSustained,
      selfFinancingCapacity,
      operationalCashConsistency,
      operationalFragilityIndex,
      dependencyTrend,
      resilienceScore,
      longitudinalConsistency
    };

    // --- Mapeamento Fiduciary Novo ---
    let fiduciaryClassification: 'OPERATIONALLY_SUSTAINABLE' | 'OPERATIONALLY_PRESSURED' | 'DEPENDENT_ON_EXTERNAL_CAPITAL' | 'STRUCTURAL_CASH_COLLAPSE' = 'OPERATIONALLY_SUSTAINABLE';
    
    if (fco < 0 && fcf < 0) {
      fiduciaryClassification = 'STRUCTURAL_CASH_COLLAPSE';
    } else if (fco < 0 && fcf > 0) {
      fiduciaryClassification = 'DEPENDENT_ON_EXTERNAL_CAPITAL';
    } else if (fco > 0 && resilienceScore < 50) {
      fiduciaryClassification = 'OPERATIONALLY_PRESSURED';
    } else if (fco > 0 && fcf > 0 && fcf > fco * 0.5) {
      fiduciaryClassification = 'OPERATIONALLY_PRESSURED';
    } else {
      fiduciaryClassification = 'OPERATIONALLY_SUSTAINABLE';
    }

    const fiduciary: FiduciaryOperationalSustainabilityAssessment = {
      classification: fiduciaryClassification,
      resilienceScore,
      operationalFragilityIndex,
      longitudinalConsistency
    };

    return { legacy, fiduciary };
  }
}
