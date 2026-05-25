import { ScenarioParameter, ScenarioType } from './scenario-types';

export function cloneAndMutateRawData(rawData: any, type: ScenarioType, parameters: ScenarioParameter): any {
  // Safe deep clone
  const projectedData = JSON.parse(JSON.stringify(rawData));

  // Default parameters based on ScenarioType if not fully provided
  const p = { ...parameters };

  // Apply shocks to DRE
  if (projectedData.dreData && Array.isArray(projectedData.dreData)) {
    projectedData.dreData.forEach((row: any) => {
      const cat = (row.category || '').toLowerCase();
      
      // Revenue Shock
      if (p.revenueShock && (row.type === 'receita' || cat.includes('receita'))) {
        row.value = (row.value || 0) * p.revenueShock;
      }
      
      // Margin Shock (affects COGS / Custos)
      if (p.marginShock && (row.type === 'custo' || cat.includes('custo'))) {
        // If margin drops by multiplying by 0.8, it means costs go up.
        // Actually marginShock of 0.8 means margin becomes 80% of what it was? 
        // Let's treat marginShock as a multiplier on costs. 
        // If margin drops, costs go up -> multiplier > 1.
        // If marginShock is meant to be a direct multiplier, we use it directly.
        row.value = (row.value || 0) * p.marginShock;
      }

      // Opex Expansion
      if (p.opexExpansion && (row.type === 'despesa' || cat.includes('despesa'))) {
        row.value = (row.value || 0) * p.opexExpansion;
      }
      
      // Headcount addition (add to fixed costs/opex)
      if (p.headcountAddition && (cat.includes('pessoal') || cat.includes('salário'))) {
        row.value = (row.value || 0) + p.headcountAddition;
      }
    });
  }

  // Apply shocks to Balance Sheet
  if (projectedData.bpData && Array.isArray(projectedData.bpData)) {
    let totalAddedAssets = 0;
    let totalAddedLiabilities = 0;

    projectedData.bpData.forEach((row: any) => {
      const cat = (row.category || '').toLowerCase();

      // Receivables Days Extension (Shift Cash to Receivables)
      if (p.receivablesDaysExtension && (cat.includes('cliente') || cat.includes('receber'))) {
        const impact = (row.value || 0) * (p.receivablesDaysExtension / 30); // Rough proxy
        row.value = (row.value || 0) + impact;
        totalAddedAssets += impact; // Need to balance this by dropping cash
      }

      // Payables Days Extension (Shift Cash out of Payables -> wait, more payables means MORE cash retained)
      if (p.payablesDaysExtension && (cat.includes('fornecedor') || cat.includes('pagar'))) {
        const impact = (row.value || 0) * (p.payablesDaysExtension / 30);
        row.value = (row.value || 0) + impact;
        totalAddedLiabilities += impact; // Need to balance by increasing cash
      }

      // Debt Injection
      if (p.debtInjection && (cat.includes('empréstimo') || cat.includes('financiamento'))) {
        row.value = (row.value || 0) + p.debtInjection;
        totalAddedLiabilities += p.debtInjection;
      }

      // Equity Injection
      if (p.capitalInjection && (cat.includes('capital') || cat.includes('social'))) {
        row.value = (row.value || 0) + p.capitalInjection;
        totalAddedLiabilities += p.capitalInjection; // PL is on liability side mathematically for balancing
      }
    });

    // Rebalance via Cash
    const netCashImpact = totalAddedLiabilities - totalAddedAssets;
    
    let cashRow = projectedData.bpData.find((r: any) => (r.category || '').toLowerCase().includes('caixa'));
    if (!cashRow) {
      cashRow = { category: 'Caixa e Equivalentes (Simulado)', type: 'ativo', value: 0 };
      projectedData.bpData.push(cashRow);
    }
    cashRow.value = Math.max(0, (cashRow.value || 0) + netCashImpact);
  }

  // Apply shocks to Cash Flow (if present)
  if (projectedData.cashFlowData && Array.isArray(projectedData.cashFlowData)) {
    projectedData.cashFlowData.forEach((row: any) => {
      const cat = (row.category || '').toLowerCase();
      // Adjust operating inflows/outflows based on revenue/opex shocks
      if (p.revenueShock && cat.includes('recebimento')) row.value = (row.value || 0) * p.revenueShock;
      if (p.opexExpansion && cat.includes('pagamento')) row.value = (row.value || 0) * p.opexExpansion;
    });
  }

  return projectedData;
}
