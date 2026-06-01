import { InstitutionalContinuityAssessment, CashConfidenceLevel, RunwayStability } from './CashIntelligenceTypes';

export class InstitutionalContinuityEngine {
  /**
   * Avalia a continuidade institucional (Survival Horizon) e o risco de ruptura.
   */
  public static evaluate(
    fco: number,
    fci: number,
    fcf: number,
    availableCash: number,
    netIncome: number,
    thirdPartyFunding: number,
    equityFunding: number,
    historicalCyclesCount: number
  ): InstitutionalContinuityAssessment {
    // 1. Cálculo do Runway Preditivo (Normalized Cash Burn)
    // O burn operacional normalizado deve excluir aportes, venda extraordinária de ativos e refinanciamento.
    // FCO negativo representa queima operacional core. FCI negativo representa Capex de investimento.
    const operationalBurn = (fco < 0 ? Math.abs(fco) : 0) + (fci < 0 ? Math.abs(fci) : 0);
    const normalizedMonthlyCashBurn = operationalBurn / 12;

    let projectedRunwayMonths = 99.0; // Padrão estável/ilimitado
    if (normalizedMonthlyCashBurn > 0) {
      projectedRunwayMonths = Math.round((availableCash / normalizedMonthlyCashBurn) * 10) / 10;
    }

    let runwayClassification: 'HEALTHY' | 'PRESSURED' | 'CRITICAL' | 'SURVIVAL_MODE' = 'HEALTHY';
    if (projectedRunwayMonths >= 6) runwayClassification = 'HEALTHY';
    else if (projectedRunwayMonths >= 3) runwayClassification = 'PRESSURED';
    else if (projectedRunwayMonths >= 1) runwayClassification = 'CRITICAL';
    else runwayClassification = 'SURVIVAL_MODE';

    // 2. Fatores de Distorção do Runway (exclusão de itens não operacionais da liquidez)
    const runwayDistortionFactors: string[] = [];
    if (fcf > 0) {
      runwayDistortionFactors.push('Financing injections or debt rollover');
    }
    if (equityFunding > 0) {
      runwayDistortionFactors.push('Shareholder capital contributions');
    }
    if (fci > 0) {
      runwayDistortionFactors.push('Disposals of non-current assets');
    }

    // 3. Estabilidade do Runway (Foco na continuidade operacional)
    let runwayStability: RunwayStability = 'STABLE';
    if (fco > 0) {
      if (historicalCyclesCount < 2) {
        runwayStability = 'LOW_CONFIDENCE'; // FCO positivo recente sem histórico
      } else if (equityFunding > 0 || thirdPartyFunding > 0) {
        runwayStability = 'FALSE_STABILITY'; // FCO positivo mas dependente de aporte
      } else if (fcf < 0 && Math.abs(fcf) > fco * 0.8) {
        runwayStability = 'VOLATILE'; // Drenado por dívida/distribuição
      } else if (historicalCyclesCount >= 3) {
        runwayStability = 'STABLE'; // FCO positivo consistente
      } else {
        runwayStability = 'STABLE';
      }
    } else {
      // FCO Negativo
      if (equityFunding > 0 || thirdPartyFunding > 0) {
        runwayStability = 'FALSE_STABILITY'; // Sobrevivência financiada
      } else if (projectedRunwayMonths < 6) {
        runwayStability = 'COLLAPSING';
      } else {
        runwayStability = 'VOLATILE';
      }
    }

    // 4. Confiança do Runway
    let runwayConfidence: CashConfidenceLevel = 'HIGH';
    if (historicalCyclesCount < 2) {
      runwayConfidence = 'RESTRICTED';
    } else if (runwayDistortionFactors.length > 0) {
      runwayConfidence = 'MODERATE';
    }

    // 5. Dependência de Liquidez
    const liquidityDependency = fco < 0 && fcf > 0;

    // 6. Drivers de Risco de Continuidade
    const continuityRiskDrivers: string[] = [];
    if (fco < 0) {
      continuityRiskDrivers.push('recurring_negative_fco');
    }
    if (liquidityDependency) {
      continuityRiskDrivers.push('capital_dependency');
    }
    if (projectedRunwayMonths < 12 && normalizedMonthlyCashBurn > 0) {
      continuityRiskDrivers.push('short_runway');
    }
    if (netIncome < 0) {
      continuityRiskDrivers.push('patrimonial_deterioration');
    }
    if (fco > 0 && fcf < 0 && Math.abs(fcf) > fco * 0.5) {
      continuityRiskDrivers.push('liquidity_instability');
    }

    // Novos drivers solicitados
    if (fco < 0 && fcf > Math.abs(fco)) {
      continuityRiskDrivers.push('artificial_liquidity_support');
    }
    if (fco > 0 && historicalCyclesCount < 2) {
      continuityRiskDrivers.push('unstable_operational_generation');
    }
    if (fco < 0 && (fci > 0 || equityFunding > 0)) {
      continuityRiskDrivers.push('one_off_cash_dependence');
    }

    // 7. Risco de Continuidade e Alerta de Ruptura
    let continuityRisk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
    let hasRuptureRisk = false;

    if (projectedRunwayMonths < 6 && normalizedMonthlyCashBurn > 0) {
      continuityRisk = 'CRITICAL';
      hasRuptureRisk = true;
    } else if (projectedRunwayMonths < 12 && normalizedMonthlyCashBurn > 0) {
      continuityRisk = 'HIGH';
      hasRuptureRisk = true;
    } else if (fco < 0) {
      continuityRisk = 'MODERATE';
      hasRuptureRisk = false;
    }

    // 8. Recomendações
    const recommendedActions: string[] = [];
    if (hasRuptureRisk || continuityRisk === 'CRITICAL') {
      recommendedActions.push(
        'Suspender preventivamente novos Capex operacionais.',
        'Reduzir imediatamente custos fixos operacionais de estrutura.',
        'Negociar renegociação imediata de passivos circulantes e linhas de crédito.'
      );
    } else if (continuityRisk === 'MODERATE') {
      recommendedActions.push(
        'Implementar comitê semanal de fluxo de caixa para controle diário.',
        'Revisar ciclo financeiro de recebíveis e estocagem.'
      );
    } else {
      recommendedActions.push(
        'Manter diretrizes vigentes e alocação de caixa sob governança operacional.',
        'Avaliar aportes estratégicos ou investimentos estruturais.'
      );
    }

    return {
      continuityRisk,
      hasRuptureRisk,
      projectedRunwayMonths,
      runwayClassification,
      runwayConfidence,
      runwayDistortionFactors,
      runwayStability,
      liquidityDependency,
      continuityRiskDrivers,
      recommendedActions
    };
  }
}
