import { NormalizedDREPayload } from './DREExecutiveDataMapper';

export interface RevenueEconomicStructureOutput {
  base100: number;
  costPer100Revenue: number;
  adminExpensePer100Revenue: number;
  ebitdaPer100Revenue: number;
  profitPer100Revenue: number;
  narrativa: string;
}

export class RevenueEconomicStructureEngine {
  public static evaluate(input: NormalizedDREPayload): RevenueEconomicStructureOutput {
    if (!input.netRevenue.value || input.netRevenue.value <= 0) {
      return {
        base100: 100,
        costPer100Revenue: 0,
        adminExpensePer100Revenue: 0,
        ebitdaPer100Revenue: 0,
        profitPer100Revenue: 0,
        narrativa: 'Dados insuficientes para análise executiva desta seção.'
      };
    }

    const fator = 100 / input.netRevenue.value;
    
    const costPer100Revenue = Math.abs(input.cogs.value) * fator;
    const adminExpensePer100Revenue = Math.abs(input.adminExpenses.value) * fator;
    const ebitdaPer100Revenue = input.ebitda.value * fator;
    const profitPer100Revenue = input.netProfit.value * fator;

    const formatCurrencyStr = (val: number) => `R$ ${Math.abs(val).toFixed(2).replace('.', ',')}`;

    let narrativa = `Para cada R$ 100 vendidos:\n`;
    narrativa += `${formatCurrencyStr(costPer100Revenue)} foram consumidos pelo custo dos produtos vendidos.\n`;
    narrativa += `${formatCurrencyStr(adminExpensePer100Revenue)} foram consumidos pela estrutura administrativa.\n`;
    narrativa += `${formatCurrencyStr(ebitdaPer100Revenue)} foram ${ebitdaPer100Revenue >= 0 ? 'gerados' : 'destruídos'} operacionalmente.\n`;
    narrativa += `${formatCurrencyStr(profitPer100Revenue)} foram ${profitPer100Revenue >= 0 ? 'gerados' : 'destruídos'} no resultado final.`;

    return {
      base100: 100,
      costPer100Revenue,
      adminExpensePer100Revenue,
      ebitdaPer100Revenue,
      profitPer100Revenue,
      narrativa
    };
  }
}
