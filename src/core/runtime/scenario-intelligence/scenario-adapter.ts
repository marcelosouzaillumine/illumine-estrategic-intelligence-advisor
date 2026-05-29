// src/core/runtime/scenario-intelligence/scenario-adapter.ts
import { ScenarioInput, ScenarioVariable } from './scenario-types';

export class ScenarioAdapter {
  public static adaptFormInputs(formState: Record<string, number>): ScenarioInput[] {
    const inputs: ScenarioInput[] = [];

    const map: Record<string, ScenarioVariable> = {
      'estoque': 'INVENTORY_VOLUME',
      'receita': 'REVENUE_VOLUME',
      'ebitda': 'EBITDA_MARGIN',
      'prazoPgm': 'SUPPLIER_PAYMENT_DAYS',
      'prazoRec': 'CUSTOMER_RECEIPT_DAYS',
      'capex': 'CAPEX_VOLUME'
    };

    for (const [key, value] of Object.entries(formState)) {
      if (value !== 0 && map[key]) {
        inputs.push({
          variable: map[key],
          variationPercentage: value
        });
      }
    }

    return inputs;
  }
}
