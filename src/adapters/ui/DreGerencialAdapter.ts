import { useMemo } from 'react';
import { useAllFinancialData } from '../../hooks/useFinancialData';
import { DreGerencialViewModel } from '../../viewmodels/DreGerencialViewModel';

export interface UseDreGerencialParams {
  selectedClient: string;
  selectedYear: number;
  selectedMonth: number;
  periodType: 'mensal' | 'anual';
  filterFilial: string;
  filterUnidade: string;
  filterCentroCusto: string;
}

export function useDreGerencial({
  selectedClient,
  selectedYear,
  selectedMonth,
  periodType,
  filterFilial,
  filterUnidade,
  filterCentroCusto
}: UseDreGerencialParams) {
  
  const { dbData, loading } = useAllFinancialData(selectedClient);

  const viewModel = useMemo(() => {
    return new DreGerencialViewModel(
      dbData,
      selectedYear,
      selectedMonth,
      periodType,
      filterFilial,
      filterUnidade,
      filterCentroCusto
    );
  }, [dbData, selectedYear, selectedMonth, periodType, filterFilial, filterUnidade, filterCentroCusto]);

  const { valuesByPeriod, periods } = useMemo(() => {
    if (loading) {
      return {
        valuesByPeriod: {} as Record<string, Record<string, number>>,
        periods: { historical: [], current: { year: selectedYear, label: '' } }
      };
    }
    return viewModel.getProcessedData();
  }, [viewModel, loading, selectedYear]);

  const dimensions = useMemo(() => {
    const filiais = new Set<string>(['Todas']);
    const unidades = new Set<string>(['Todas']);
    const centros = new Set<string>(['Todos']);

    dbData.forEach((d: any) => {
      if (d.filial) filiais.add(d.filial);
      if (d.unidade) unidades.add(d.unidade);
      if (d.centro_custo || d.centroCusto) centros.add(d.centro_custo || d.centroCusto);
    });

    return {
      filiais: Array.from(filiais),
      unidades: Array.from(unidades),
      centros: Array.from(centros)
    };
  }, [dbData]);

  return {
    loading,
    periods,
    valuesByPeriod,
    dimensions,
    getVerticalAnalysis: (rl: number, val: number) => viewModel.getVerticalAnalysis(rl, val),
    getHorizontalAnalysis: (prevVal: number, currentVal: number) => viewModel.getHorizontalAnalysis(prevVal, currentVal)
  };
}
