import { useMemo } from 'react';
import { useAnnualFinancialData, useAllFinancialData } from '../../../hooks/useFinancialData';
import { buildBPHierarchy } from '../../../lib/bpEngine';
import { calculateDreCascade, generateInitialDreState } from '../../../lib/dreCascade';
// src/components/pages/governance/BoardPackDataLoader.ts


export function useBoardPackDataLoader(clientId: string, filterYear: number, clients?: any[]) {
  const { dbData: financialEntries, loading: loadingBP, refetch: refetchBP } = useAnnualFinancialData(clientId, filterYear, 'BP');
  const { dbData: dreDbData, loading: loadingDRE } = useAnnualFinancialData(clientId, filterYear, 'DRE');
  const { dbData: dlpaDbData, loading: loadingDLPA } = useAnnualFinancialData(clientId, filterYear, 'DLPA');
  const { dbData: cashFlowDbData, loading: loadingDFC } = useAnnualFinancialData(clientId, filterYear, 'DFC');
  const { dbData: allHistoryData, loading: loadingHistory, historicalFinancialSeries } = useAllFinancialData(clientId);

  const loading = loadingBP || loadingDRE || loadingDLPA || loadingDFC || loadingHistory;

  const payload = useMemo(() => {
    if (loading || !clientId) return null;
    if (financialEntries.length === 0 && dreDbData.length === 0) return null;

    // 1. Compute BP Summary
    const aggregated: any = {};
    financialEntries.forEach((d: any) => {
      const type = (d.tipo || d.type || '').trim().toLowerCase();
      const category = (d.conta || d.category || '').trim();
      const key = `${type}_${category.toLowerCase()}`;
      
      if (!aggregated[key]) {
        aggregated[key] = { 
          ...d, 
          val: (d.val ?? d.valor ?? d.value ?? 0),
          conta: category,
          level: d.level ?? 1
        };
      } else {
        if (aggregated[key].val === 0 && (d.val ?? d.valor ?? d.value ?? 0) !== 0) {
           aggregated[key].val = (d.val ?? d.valor ?? d.value ?? 0);
        }
      }
    });
    const arr = Object.values(aggregated) as any[];
    arr.sort((a, b) => (a.ordem || 0) - (b.ordem || 0));
    const { summary: bpSummary } = buildBPHierarchy(arr);

    // 2. Parse values helper
    const parseMetricStr = (val: any) => {
      if (typeof val === 'number') return val;
      if (!val) return 0;
      let s = String(val).replace(/[^\d.,-]/g, '');
      if (s.includes(',') && s.includes('.')) {
        if (s.lastIndexOf(',') > s.lastIndexOf('.')) {
          s = s.replace(/\./g, '').replace(',', '.');
        } else {
          s = s.replace(/,/g, '');
        }
      } else if (s.includes(',')) {
        s = s.replace(',', '.');
      }
      return parseFloat(s) || 0;
    };

    // 3. Compute DRE Cascade (EBITDA & Lucro Líquido)
    const mappedRows = dreDbData
      .filter((r: any) => r.dreTipo !== 'SINTETICA')
      .map((r: any) => {
        if (r.parentId) return r;
        const cat = (r.category || r.conta || '').toLowerCase();
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
      ...mappedRows.map((r: any) => {
        const val = parseMetricStr(r.value || r.val);
        return { ...r, val, value: val };
      })
    ];

    const cascadeResult = calculateDreCascade(allRows);
    const ebitda = cascadeResult.find(r => r.id === 'EBITDA')?.computedValue || 0;
    const lucroLiquido = cascadeResult.find(r => r.id === 'LUCRO_LIQ')?.computedValue || 0;

    // 4. History and context details
    const historyByYear: Record<number, any[]> = {};
    const years = [filterYear, filterYear - 1, filterYear - 2, filterYear - 3, filterYear - 4, filterYear - 5];
    years.forEach(y => {
      const yearEntries = allHistoryData.filter((d: any) => d.year === y && (d.type === 'Balanço Patrimonial' || d.type === 'BP'));
      historyByYear[y] = yearEntries;
    });

    const getHistoricalValue = (y: number, accountName: string) => {
      const yearRows = historyByYear[y] || [];
      const search = accountName.toLowerCase();
      const match = yearRows.find((r: any) => {
        const conta = (r.category || r.conta || '').toLowerCase();
        const cleanConta = conta.replace(/^[0-9.]+\s*[-]\s*/, '').trim();
        return cleanConta === search || conta.includes(search);
      });
      return match?.value || match?.val || 0;
    };

    const prevPl = getHistoricalValue(filterYear - 1, 'patrimônio líquido') || getHistoricalValue(filterYear - 1, 'pl') || 0;
    const clientObj = clients?.find((c: any) => c.id === clientId) || { id: clientId };
    const industry = clientObj?.segmentoAtuacao || clientObj?.segmento || clientObj?.industry || 'Geral';
    const prevEbitda = getHistoricalValue(filterYear - 1, 'ebitda') || getHistoricalValue(filterYear - 1, 'lajida') || 0;
    const prevCaixa = getHistoricalValue(filterYear - 1, 'caixa') || getHistoricalValue(filterYear - 1, 'disponibilidades') || 0;

    const calculatedCycles = Object.keys(historyByYear).filter(year => {
      const data = historyByYear[Number(year)];
      return data && data.length > 0;
    }).length || 1;

    return {
      clientProfile: clientObj,
      rawFinancialData: {
        bpSummary,
        ebitda,
        lucroLiquido,
        industry,
        prevPl,
        prevEbitda,
        prevCaixa,
        dreDataLength: dreDbData.length,
        historicalCyclesCount: calculatedCycles
      },
      historicalSeries: historicalFinancialSeries?.series || [],
      bpData: financialEntries,
      dreData: dreDbData,
      dlpaData: dlpaDbData,
      cashFlowData: cashFlowDbData,
      historicalCyclesCount: calculatedCycles,
      isMockData: financialEntries.length === 0
    };
  }, [clientId, filterYear, financialEntries, dreDbData, dlpaDbData, cashFlowDbData, allHistoryData, historicalFinancialSeries, clients, loading]);

  return { payload, loading, refetchBP };
}
