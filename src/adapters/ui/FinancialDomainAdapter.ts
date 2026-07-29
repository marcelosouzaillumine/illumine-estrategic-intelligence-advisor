import { useMemo } from 'react';
import { useAnnualFinancialData } from '../../hooks/useFinancialData';
import { FinancialDomainViewModel, DFCItem, DLPAItem } from '../../viewmodels/FinancialDomainViewModel';

export interface UseFinancialDomainParams {
  selectedClient: string;
  selectedYear: number;
  selectedMonth?: number;
}

export function useFinancialDomain({ selectedClient, selectedYear, selectedMonth }: UseFinancialDomainParams) {
  const { dbData, loading } = useAnnualFinancialData(selectedClient, selectedYear, 'DFC');

  const dfcItems = useMemo<DFCItem[]>(() => {
    if (!dbData) return [];
    return dbData
      .filter((d: any) => d.type === 'DFC' || d.type === 'CashFlow')
      .map((d: any, idx: number) => ({
        id: d.id || `dfc_${idx}`,
        categoria: d.conta || d.category || 'Geral',
        tipo: (d.tipo || 'operacional') as 'operacional' | 'investimento' | 'financiamento',
        valor: d.val || d.valor || d.value || 0,
        mes: d.month || d.mes || 1,
        ano: d.year || d.ano || selectedYear
      }));
  }, [dbData, selectedYear]);

  const dfcTotals = useMemo(() => {
    return FinancialDomainViewModel.calculateDFCTotals(dfcItems);
  }, [dfcItems]);

  const dlpaItems = useMemo<DLPAItem[]>(() => {
    if (!dbData) return [];
    return dbData
      .filter((d: any) => d.type === 'DLPA')
      .map((d: any, idx: number) => ({
        id: d.id || `dlpa_${idx}`,
        descricao: d.descricao || d.conta || 'Retenção de Lucros',
        saldoInicial: d.saldoInicial || 0,
        lucroLiquido: d.lucroLiquido || 0,
        dividendos: d.dividendos || 0,
        reservas: d.reservas || 0,
        saldoFinal: d.saldoFinal || 0
      }));
  }, [dbData]);

  const dlpaSummary = useMemo(() => {
    return FinancialDomainViewModel.calculateDLPASummary(dlpaItems);
  }, [dlpaItems]);

  return {
    loading,
    dbData,
    dfcItems,
    dfcTotals,
    dlpaItems,
    dlpaSummary,
    filterData: (data: any[]) => FinancialDomainViewModel.filterFinancialDataByPeriod(data, selectedYear, selectedMonth)
  };
}
