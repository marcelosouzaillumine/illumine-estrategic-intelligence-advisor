import { IntelligenceTraceability, EvidenceLevel } from '../../contracts/IntelligenceTraceability';

import { ExecutiveFormattingService } from '../formatting/ExecutiveFormattingService';

export class IntelligenceTraceabilityEngine {
  /**
   * Synthesizes the traceability chain for a given exposure, extracting ONLY data
   * that is explicitly present in the provided normalized balance sheet.
   * No fabrication of accounts or values is allowed.
   */
  static synthesize(exposure: any, currentSheet: any): IntelligenceTraceability {
    const period = { fiscalYear: currentSheet.year || currentSheet.period?.year };
    
    let account: any = undefined;
    let calculation: any = undefined;
    let evidenceLevel: EvidenceLevel = 'aggregated'; // Default to aggregated if we can't derive it

    // Map exposures to actual accounts in the NormalizedBalanceSheet if they exist
    // Rule: We only map if the data is explicitly in the currentSheet.
    
    if (exposure.id === 'inventory_concentration_monitor') {
      const inventory = currentSheet.assets?.inventory;
      const totalAssets = currentSheet.assets?.total;
      
      if (inventory !== undefined && totalAssets !== undefined) {
        evidenceLevel = 'derived';
        account = {
          name: 'Estoques',
          value: inventory,
          formattedValue: ExecutiveFormattingService.formatCurrency(inventory)
        };
        calculation = {
          formula: 'Estoques ÷ Ativo Total',
          inputs: [
            `Estoques: ${ExecutiveFormattingService.formatCurrency(inventory)}`,
            `Ativo Total: ${ExecutiveFormattingService.formatCurrency(totalAssets)}`
          ]
        };
      }
    } else if (exposure.id === 'excess_liquidity_eval') {
      const cash = currentSheet.assets?.cashAndEquivalents;
      const totalAssets = currentSheet.assets?.total;

      if (cash !== undefined && totalAssets !== undefined) {
        evidenceLevel = 'derived';
        account = {
          name: 'Caixa e Equivalentes',
          value: cash,
          formattedValue: ExecutiveFormattingService.formatCurrency(cash)
        };
        calculation = {
          formula: 'Caixa ÷ Ativo Total',
          inputs: [
            `Caixa: ${ExecutiveFormattingService.formatCurrency(cash)}`,
            `Ativo Total: ${ExecutiveFormattingService.formatCurrency(totalAssets)}`
          ]
        };
      }
    }

    return {
      sourceId: exposure.id,
      sourceType: 'balance_sheet',
      account,
      metric: {
        id: exposure.id,
        name: exposure.metric || 'Indicador',
        value: exposure.value,
        formattedValue: typeof exposure.value === 'number' 
          ? ExecutiveFormattingService.formatPercentage(exposure.value)
          : String(exposure.value),
        unit: 'percentage'
      },
      period,
      calculation,
      evidenceLevel
    };
  }
}
