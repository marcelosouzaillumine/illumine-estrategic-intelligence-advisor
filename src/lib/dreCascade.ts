import { DreAccount, DRE_OFFICIAL_STRUCTURE } from '../constants/dreStructure';

// Helper para garantir conversão correta de números salvos como string (ex: "1.200,50")
const parseNumeric = (val: any): number => {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  const cleaned = String(val).replace(/[R$\s]/g, '').replace(/\./g, '').replace(',', '.');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

export function calculateDreCascade(rows: any[]) {
  const result = [...rows].map(r => ({ ...r, computedValue: parseNumeric(r.value) || parseNumeric(r.val) || parseNumeric(r.valor) || 0 }));
  
  const getChildrenSum = (parentId: string) => {
    return result
      .filter(r => r.parentId === parentId)
      .reduce((sum, r) => sum + (parseNumeric(r.value) || parseNumeric(r.val) || parseNumeric(r.valor) || 0), 0);
  };

  // Helper to get a calculated value by ID
  const getVal = (id: string) => {
    const row = result.find(r => r.id === id);
    return row ? (row.computedValue !== undefined ? row.computedValue : row.value) : 0;
  };
  
  const getAbsVal = (id: string) => {
    return Math.abs(getVal(id) || 0);
  };

  // Helper to set a computed value
  const setVal = (id: string, val: number) => {
    const idx = result.findIndex(r => r.id === id);
    if (idx !== -1) {
      result[idx].computedValue = val;
    }
  };

  // 1. Calculate all SINTETICA accounts that use SUM(children)
  DRE_OFFICIAL_STRUCTURE.filter(a => a.tipo === 'SINTETICA').forEach(account => {
    setVal(account.id, getChildrenSum(account.id));
  });

  // 2. Calculate the RESULTADO_CALCULADO accounts strictly based on their formulas
  // ROL = ROB - DED
  setVal('ROL', getVal('ROB') - getAbsVal('DED'));
  
  // LUCRO_BRUTO = ROL - CUSTOS
  setVal('LUCRO_BRUTO', getVal('ROL') - getAbsVal('CUSTOS'));
  
  // EBITDA = LUCRO_BRUTO - DESP_OPER
  setVal('EBITDA', getVal('LUCRO_BRUTO') - getAbsVal('DESP_OPER'));
  
  // EBIT = EBITDA - DEP_AMORT
  setVal('EBIT', getVal('EBITDA') - getAbsVal('DEP_AMORT'));
  
  // RAIR_CSLL = EBIT + RESULT_FIN + OUTRAS_REC_DESP
  // Nota: Resultado financeiro e outras receitas já carregam seu sinal positivo ou negativo.
  setVal('RAIR_CSLL', getVal('EBIT') + getVal('RESULT_FIN') + getVal('OUTRAS_REC_DESP'));
  
  // LUCRO_LIQ = RAIR_CSLL - PROV_IR_CSLL
  setVal('LUCRO_LIQ', getVal('RAIR_CSLL') - getAbsVal('PROV_IR_CSLL'));

  return result;
}

export function generateInitialDreState() {
  return DRE_OFFICIAL_STRUCTURE.map(account => ({
    id: account.id,
    category: account.nome,
    value: 0,
    type: 'despesas', // generic default
    level: 1,
    dreTipo: account.tipo,
    natureza: account.natureza,
    parentId: account.parentId,
    aceitaLancamento: account.aceitaLancamento,
    calculaAutomaticamente: account.calculaAutomaticamente,
    formula: account.formula,
    ordem: account.ordem
  }));
}
