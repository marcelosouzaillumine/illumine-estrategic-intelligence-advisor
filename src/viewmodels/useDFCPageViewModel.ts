import { useState, useMemo, useCallback } from 'react';
import { useDFCPageAdapter } from '../adapters/ui/useDFCPageAdapter';

export interface UseDFCPageViewModelProps {
  clientId?: string;
  selectedClient?: string;
  selectedYear?: number;
  [key: string]: any;
}

export function useDFCPageViewModel(props: UseDFCPageViewModelProps) {
  const clientId = props.clientId || props.selectedClient || '';
  const initialYear = props.selectedYear || new Date().getFullYear();

  const [filterYear, setFilterYear] = useState<number>(initialYear);
  const [showManualModal, setShowManualModal] = useState<boolean>(false);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [toast, setToast] = useState<{ type: string; message: string } | null>(null);

  const showToast = useCallback((type: string, message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const {
    dbData,
    loading,
    error,
    refetchDFC,
    deleting,
    showDeleteConfirm,
    setShowDeleteConfirm,
    handleDelete
  } = useDFCPageAdapter(clientId, filterYear, showToast);

  const hasDfcData = useMemo(() => {
    return Array.isArray(dbData) && dbData.length > 0;
  }, [dbData]);

  const dfcTotals = useMemo(() => {
    if (!hasDfcData) {
      return { fco: 0, fci: 0, fcf: 0, netVariation: 0 };
    }

    let fco = 0;
    let fci = 0;
    let fcf = 0;

    dbData.forEach((item: any) => {
      const val = Number(item.val ?? item.valor ?? item.value ?? 0);
      const rawGroup = String(item.tipo ?? item.grupo ?? item.category ?? '').toLowerCase();

      if (rawGroup.includes('operacional') || rawGroup.includes('operational') || rawGroup.includes('fco')) {
        fco += val;
      } else if (rawGroup.includes('investimento') || rawGroup.includes('investment') || rawGroup.includes('fci') || rawGroup.includes('capex')) {
        fci += val;
      } else if (rawGroup.includes('financiamento') || rawGroup.includes('financing') || rawGroup.includes('fcf')) {
        fcf += val;
      } else {
        fco += val;
      }
    });

    return {
      fco,
      fci,
      fcf,
      netVariation: fco + fci + fcf
    };
  }, [dbData, hasDfcData]);

  const tableRows = useMemo(() => {
    if (!hasDfcData) return [];

    return dbData.map((item: any, idx: number) => {
      const val = Number(item.val ?? item.valor ?? item.value ?? 0);
      const rawGroup = String(item.tipo ?? item.grupo ?? item.category ?? '').toLowerCase();
      let typeLabel = 'Operacional';

      if (rawGroup.includes('investimento') || rawGroup.includes('investment') || rawGroup.includes('fci') || rawGroup.includes('capex')) {
        typeLabel = 'Investimento';
      } else if (rawGroup.includes('financiamento') || rawGroup.includes('financing') || rawGroup.includes('fcf')) {
        typeLabel = 'Financiamento';
      }

      return {
        id: item.id || `dfc_${idx}`,
        code: item.code || item.codigo || `${idx + 1}.01`,
        line: item.conta || item.description || item.line || 'Linha DFC',
        type: typeLabel,
        value: val
      };
    });
  }, [dbData, hasDfcData]);

  const executiveSummaryNarrative = useMemo(() => {
    if (!hasDfcData) {
      return `Sem lançamentos de fluxo de caixa registrados para o exercício de ${filterYear}. O cadastro da DFC permitirá calcular os fluxos operacionais, de investimento e de financiamento.`;
    }
    if (dfcTotals.fco >= 0) {
      return `A geração de caixa operacional no exercício de ${filterYear} apresentou saldo positivo de R$ ${dfcTotals.fco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}, demonstrando capacidade de sustentação das atividades correntes.`;
    }
    return `O fluxo de caixa operacional no exercício de ${filterYear} apresentou consumo líquido de R$ ${Math.abs(dfcTotals.fco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}, exigindo atenção à gestão de capital de giro e fontes de liquidez.`;
  }, [hasDfcData, dfcTotals.fco, filterYear]);

  return {
    state: {
      filterYear,
      loading,
      hasDfcData,
      deleting,
      showDeleteConfirm,
      showManualModal,
      showImportModal,
      toast,
      error
    },
    computed: {
      netOperatingCashFlow: dfcTotals.fco,
      fci: dfcTotals.fci,
      fcf: dfcTotals.fcf,
      netVariation: dfcTotals.netVariation,
      tableRows,
      dfcTotals,
      executiveSummaryNarrative
    },
    actions: {
      setFilterYear,
      setShowDeleteConfirm,
      setShowManualModal,
      setShowImportModal,
      setToast,
      handleDelete,
      refetchDFC
    }
  };
}
