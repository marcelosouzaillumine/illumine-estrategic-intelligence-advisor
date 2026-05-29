import { buildBPHierarchy } from '../../lib/bpEngine';
import { calculateDreCascade, generateInitialDreState } from '../../lib/dreCascade';

export function getComputedBPSummary(dbBp: any[]) {
  if (!dbBp || dbBp.length === 0) return null;
  return buildBPHierarchy(dbBp).summary;
}

export function getComputedDreMetrics(dbDre: any[]) {
  if (!dbDre || dbDre.length === 0) return { ebitda: 0, lucroLiquido: 0 };

  const mappedRows = dbDre
    .filter((r: any) => r.dreTipo !== 'SINTETICA') // skip synthetic totals
    .map((r: any) => {
      if (r.parentId) return r; // already mapped
      const cat = (r.category || r.conta || '').toLowerCase();
      // Skip calculated totals
      if (
        cat.includes('receita líquida') || cat.includes('receita operacional líquida') ||
        cat.includes('lucro bruto') || cat === 'ebitda' || cat === 'ebit' ||
        cat.includes('resultado operacional líquido') || cat.includes('lajida') ||
        cat.includes('lucro líquido') || cat.includes('lair') || cat.includes('resultado antes')
      ) return null;

      let parentId = '';
      if (cat.includes('receita operacional bruta') || cat === 'receita bruta' || cat.includes('faturamento') ||
          (cat.includes('receita') && !cat.includes('líquida') && !cat.includes('financeir') && !cat.includes('outras'))) {
        parentId = 'ROB';
      } else if (cat.includes('deduç') || cat.includes('imposto sobre') || cat.includes('abatimento') || cat.includes('devoluç') || cat.includes('cancelamento')) {
        parentId = 'DED';
      } else if (cat.includes('custo') || cat.includes('cmv') || cat.includes('cpv') || cat.includes('csv') || cat.includes('csp')) {
        parentId = 'CUSTOS';
      } else if (cat.includes('deprecia') || cat.includes('amortiza')) {
        parentId = 'DEP_AMORT';
      } else if (cat.includes('financeir') || cat.includes('juros') || cat.includes('encargo')) {
        parentId = 'RESULT_FIN';
      } else if (cat.includes('provisão') || cat.includes('irpj') || cat.includes('csll') || cat.includes('imposto de renda') || cat.includes('contribuição social')) {
        parentId = 'PROV_IR_CSLL';
      } else if (cat.includes('outras receitas') || cat.includes('outra receita') || cat.includes('outras despesas operacionais') || cat.includes('outras receitas e despesas')) {
        parentId = 'OUTRAS_REC_DESP';
      } else {
        parentId = 'DESP_OPER';
      }
      return { ...r, parentId, value: r.val || r.valor || r.value || 0 };
    })
    .filter(Boolean);

  const allRows = [
    ...generateInitialDreState(),
    ...mappedRows
  ];

  const cascadeResult = calculateDreCascade(allRows);
  const directEbitda = cascadeResult.find((r: any) => r.id === 'EBITDA')?.computedValue || 0;
  const directLucro = cascadeResult.find((r: any) => r.id === 'LUCRO_LIQ')?.computedValue || 0;
  
  return { ebitda: directEbitda, lucroLiquido: directLucro };
}
