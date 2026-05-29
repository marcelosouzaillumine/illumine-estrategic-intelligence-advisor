// src/core/runtime/scenario-intelligence/ScenarioConstraintEngine.ts
import { ScenarioInput, ScenarioConstraintValidation } from './scenario-types';

export class ScenarioConstraintEngine {
  /**
   * Avalia os limites fiduciários de variação permitidos.
   * Evita extrapolações absurdas (ex: aumentar lucro em 1000% sem base).
   */
  public static validate(inputs: ScenarioInput[], contextData: any): ScenarioConstraintValidation {
    for (const input of inputs) {
      const { variable, variationPercentage } = input;
      
      // Limites institucionais (Histerese Fiduciária)
      let maxAllowed = 100; // default 100%
      let minAllowed = -100; // default -100%

      switch (variable) {
        case 'INVENTORY_VOLUME':
        case 'CAPEX_VOLUME':
          maxAllowed = 50; // Não permitir simular estoques dobrando abruptamente
          break;
        case 'REVENUE_VOLUME':
          maxAllowed = 30; // Receita não cresce realisticamente mais que 30% em simulações curtas sem trigger explícito
          minAllowed = -50;
          break;
        case 'EBITDA_MARGIN':
          maxAllowed = 15; // Margem não pula mais que 15% 
          minAllowed = -30;
          break;
        case 'SUPPLIER_PAYMENT_DAYS':
        case 'CUSTOMER_RECEIPT_DAYS':
          maxAllowed = 60; // Max 60 dias de variação
          break;
        case 'CAPITAL_RETENTION':
          maxAllowed = 100;
          minAllowed = 0; // Não reter negativamente (distribuição)
          break;
      }

      if (variationPercentage > maxAllowed || variationPercentage < minAllowed) {
        return {
          status: 'BLOCKED_BY_EXTRAPOLATION',
          reason: `Variação de ${variationPercentage}% excede o limite fiduciário de ${maxAllowed}% para a variável ${variable}.`,
          blockedVariable: variable,
          attemptedVariation: variationPercentage,
          allowedMaxVariation: maxAllowed
        };
      }

      // Validação Econômica Estrita
      if (variable === 'CAPITAL_RETENTION' && variationPercentage > 0 && contextData?.netIncome <= 0) {
        return {
          status: 'BLOCKED_BY_ECONOMIC_LAW',
          reason: 'Não é possível simular retenção de capital adicional em contexto de prejuízo líquido (Erosão de Patrimônio).',
          blockedVariable: variable,
          attemptedVariation: variationPercentage
        };
      }

      // Simular crescimento explosivo sem funding/caixa
      if (variable === 'REVENUE_VOLUME' && variationPercentage > 20 && contextData?.availableCash <= 0 && contextData?.fundingInflows <= 0) {
        return {
          status: 'BLOCKED_BY_ECONOMIC_LAW',
          reason: 'Simulação de hipercrescimento bloqueada: Ausência de funding ou caixa disponível para financiar capital de giro.',
          blockedVariable: variable,
          attemptedVariation: variationPercentage
        };
      }
    }

    return { status: 'VALID' };
  }
}
