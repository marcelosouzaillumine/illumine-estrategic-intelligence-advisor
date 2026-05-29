// src/core/runtime/cashflow/CashFlowOperationalEngine.ts
import { CashFlowOperationalMetrics, CashFlowPatternType } from './cashflow-types';

export function calculateOperationalMetrics(dfcData: any): CashFlowOperationalMetrics | null {
  if (!dfcData) return null;
  const dataArray = Array.isArray(dfcData) ? dfcData : Object.values(dfcData);
  if (dataArray.length === 0) return null;

  let operatingCashFlow = 0;
  let investingCashFlow = 0;
  let financingCashFlow = 0;

  // Assuming dfcData has fields like { grupo: 'Atividades Operacionais', val: 1000 }
  dataArray.forEach(item => {
    const groupName = (item.grupo || '').toLowerCase();
    const val = Number(item.val) || 0;
    
    if (groupName.includes('operaciona')) {
      operatingCashFlow += val;
    } else if (groupName.includes('investimento')) {
      investingCashFlow += val;
    } else if (groupName.includes('financiamento')) {
      financingCashFlow += val;
    }
  });

  const netCashFlow = operatingCashFlow + investingCashFlow + financingCashFlow;

  let pattern: CashFlowPatternType = 'INDISPONIVEL';

  if (operatingCashFlow > 0 && netCashFlow > 0) {
    pattern = 'OPERACIONAL_SUSTENTAVEL';
  } else if (operatingCashFlow < 0 && netCashFlow < 0) {
    pattern = 'OPERACIONAL_DEFICITARIO';
  } else if (operatingCashFlow < 0 && financingCashFlow > 0) {
    pattern = 'DEPENDENTE_TERCEIROS';
  } else if (operatingCashFlow > 0 && investingCashFlow < 0 && netCashFlow < 0) {
    pattern = 'INVESTIMENTO_AGRESSIVO';
  } else if (investingCashFlow > 0 && operatingCashFlow < 0) {
    pattern = 'DESINVESTIMENTO';
  } else if (operatingCashFlow <= 0 && financingCashFlow <= 0) {
    pattern = 'LIQUIDEZ_CRISE';
  }

  return {
    operatingCashFlow,
    investingCashFlow,
    financingCashFlow,
    netCashFlow,
    pattern
  };
}
