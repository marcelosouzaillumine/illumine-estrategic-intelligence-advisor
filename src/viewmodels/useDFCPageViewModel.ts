import { useState, useMemo, useCallback } from 'react';
import { useDFCPageAdapter } from '../adapters/ui/useDFCPageAdapter';
import { useAnnualFinancialData } from '../hooks/useFinancialData';
import { buildBPSummaryFromRawEntries } from '../lib/buildBPSummaryFromRawEntries';
import { calculateDreCascade, generateInitialDreState } from '../lib/dreCascade';
import { DFCIndirectMethodEngine } from '../capabilities/financial/runtime/cash-intelligence/DFCIndirectMethodEngine';
import { UniversalCashIndicatorsEngine } from '../capabilities/financial/runtime/cash-intelligence/UniversalCashIndicatorsEngine';
import { DreCashEvidence, BalanceSheetCashEvidence } from '../capabilities/financial/runtime/cash-intelligence/CashEvidenceContracts';

export interface UseDFCPageViewModelProps {
  clientId?: string;
  selectedClient?: string;
  selectedYear?: number;
  [key: string]: any;
}

function getDreCascadeVal(cascadeResult: any[], id: string): number {
  return cascadeResult.find(r => r.id === id)?.computedValue || 0;
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

  // Dividendos pagos: extraído dos próprios lançamentos de financiamento do DFC
  // (real, não estimado) — usado como insumo do método indireto abaixo.
  const dividendosPagos = useMemo(() => {
    if (!hasDfcData) return 0;
    return dbData
      .filter((item: any) => {
        const cat = String(item.conta ?? item.category ?? '').toLowerCase();
        return cat.includes('dividendo') || cat.includes('lucro distribu');
      })
      .reduce((s: number, item: any) => s + Math.abs(Number(item.val ?? item.valor ?? item.value ?? 0)), 0);
  }, [dbData, hasDfcData]);

  // ── Método indireto real: exige BP do período atual E do anterior (para as
  // variações patrimoniais) mais a DRE do período. ──────────────────────────
  const { dbData: bpCurrentRaw } = useAnnualFinancialData(clientId, filterYear, 'BP');
  const { dbData: bpPriorRaw } = useAnnualFinancialData(clientId, filterYear - 1, 'BP');
  const { dbData: dreRaw } = useAnnualFinancialData(clientId, filterYear, 'DRE');

  const bpCurrent = useMemo(() => buildBPSummaryFromRawEntries(bpCurrentRaw), [bpCurrentRaw]);
  const bpPrior = useMemo(() => buildBPSummaryFromRawEntries(bpPriorRaw), [bpPriorRaw]);

  const dreCascadeResult = useMemo(() => {
    if (!dreRaw || dreRaw.length === 0) return null;
    const mappedRows = dreRaw
      .filter((r: any) => r.dreTipo !== 'SINTETICA' && r.parentId)
      .map((r: any) => ({ ...r, value: r.val ?? r.valor ?? r.value ?? 0 }));
    const allRows = [...generateInitialDreState(), ...mappedRows];
    return calculateDreCascade(allRows);
  }, [dreRaw]);

  // Indica se há dados suficientes (dois períodos de BP + DRE) para o método
  // indireto; sem isso, os totais caem para a classificação simples por
  // lançamento (honesto, em vez de fabricar variações patrimoniais).
  const hasIndirectMethodData = !!bpCurrent && !!bpPrior && !!dreCascadeResult;

  const indirectMethodResult = useMemo(() => {
    if (!hasIndirectMethodData) return null;

    const dre: DreCashEvidence = {
      netIncome: getDreCascadeVal(dreCascadeResult!, 'LUCRO_LIQ'),
      netIncomeSourceAccount: 'LUCRO_LIQ',
      depreciationAndAmortization: Math.abs(getDreCascadeVal(dreCascadeResult!, 'DEP_AMORT')),
      netRevenue: getDreCascadeVal(dreCascadeResult!, 'ROL'),
      ebitda: getDreCascadeVal(dreCascadeResult!, 'EBITDA'),
      financialExpenses: Math.abs(getDreCascadeVal(dreCascadeResult!, 'RESULT_FIN')),
      taxes: Math.abs(getDreCascadeVal(dreCascadeResult!, 'PROV_IR_CSLL'))
    };

    const bp: BalanceSheetCashEvidence = {
      ativoTotal: bpCurrent!.ativoTotal,
      ativoCirculante: bpCurrent!.ativoCirculante,
      passivoCirculante: bpCurrent!.passivoCirculante,
      patrimonioLiquido: bpCurrent!.patrimonioLiquido,
      caixaEEquivalentesAnterior: bpPrior!.caixaEquivalentes,
      caixaEEquivalentesAtual: bpCurrent!.caixaEquivalentes,
      varClientes: (bpPrior!.clientes || 0) - (bpCurrent!.clientes || 0),
      varEstoque: (bpPrior!.estoques || 0) - (bpCurrent!.estoques || 0),
      varFornecedores: (bpCurrent!.fornecedores || 0) - (bpPrior!.fornecedores || 0),
      varImobilizadoIntangivel: (bpCurrent!.ativoPermanente || 0) - (bpPrior!.ativoPermanente || 0),
      varDividasBancarias: (bpCurrent!.passivosFinanceiros || 0) - (bpPrior!.passivosFinanceiros || 0),
      varCapitalSocial: (bpCurrent!.capitalSocial || 0) - (bpPrior!.capitalSocial || 0),
      dividendosPagos,
      creditosSociosCirculantes: bpCurrent!.creditosSocios || 0,
      creditosSociosTotais: bpCurrent!.creditosSocios || 0,
      // BPSummary não distingue passivos de sócios de créditos a sócios —
      // só o segundo é rastreado; o primeiro fica honestamente em 0 em vez
      // de reaproveitar o mesmo número para os dois lados da conta.
      varPassivosSocios: 0,
      varCreditosSocios: (bpCurrent!.creditosSocios || 0) - (bpPrior!.creditosSocios || 0)
    };

    return DFCIndirectMethodEngine.evaluate(dre, bp);
  }, [hasIndirectMethodData, dreCascadeResult, bpCurrent, bpPrior, dividendosPagos]);

  // Fallback: classificação simples por lançamento, usada só quando não há
  // os dois períodos de BP para o método indireto (ex.: primeiro ano do
  // cliente na plataforma).
  const simpleTotals = useMemo(() => {
    if (!hasDfcData) return { fco: 0, fci: 0, fcf: 0, netVariation: 0 };
    let fco = 0, fci = 0, fcf = 0;
    dbData.forEach((item: any) => {
      const val = Number(item.val ?? item.valor ?? item.value ?? 0);
      const rawGroup = String(item.tipo ?? item.grupo ?? item.category ?? '').toLowerCase();
      if (rawGroup.includes('operacional') || rawGroup.includes('operational') || rawGroup.includes('fco')) fco += val;
      else if (rawGroup.includes('investimento') || rawGroup.includes('investment') || rawGroup.includes('fci') || rawGroup.includes('capex')) fci += val;
      else if (rawGroup.includes('financiamento') || rawGroup.includes('financing') || rawGroup.includes('fcf')) fcf += val;
      else fco += val;
    });
    return { fco, fci, fcf, netVariation: fco + fci + fcf };
  }, [dbData, hasDfcData]);

  const dfcTotals = useMemo(() => {
    if (indirectMethodResult) {
      return {
        fco: indirectMethodResult.fco,
        fci: indirectMethodResult.fci,
        fcf: indirectMethodResult.fcf,
        netVariation: indirectMethodResult.variacaoCaixa,
        method: 'INDIRECT' as const
      };
    }
    return { ...simpleTotals, method: 'SIMPLE_LEDGER_SUM' as const };
  }, [indirectMethodResult, simpleTotals]);

  // 7 indicadores fiduciários reais (UniversalCashIndicatorsEngine) — só
  // quando o método indireto está disponível, já que dependem de EBITDA,
  // fornecedores e variação de estoque reais, não da soma simples.
  const cashIndicators = useMemo(() => {
    if (!indirectMethodResult || !bpCurrent || !dreCascadeResult) return null;
    const ebitda = getDreCascadeVal(dreCascadeResult, 'EBITDA');
    const varEstoque = (bpCurrent.estoques || 0) - (bpPrior?.estoques || 0);
    return UniversalCashIndicatorsEngine.evaluate(
      indirectMethodResult.fco,
      indirectMethodResult.fcf,
      ebitda,
      Math.max(indirectMethodResult.fcf, 0),
      bpCurrent.fornecedores || 0,
      bpCurrent.passivoCirculante || 0,
      varEstoque,
      bpCurrent.creditosSocios ?? null,
      bpCurrent.patrimonioLiquido || 0,
      12,
      bpCurrent.caixaEquivalentes || 0
    );
  }, [indirectMethodResult, bpCurrent, bpPrior, dreCascadeResult]);

  const executiveSummaryNarrative = useMemo(() => {
    if (!hasDfcData) {
      return `Sem lançamentos de fluxo de caixa registrados para o exercício de ${filterYear}. O cadastro da DFC permitirá calcular os fluxos operacionais, de investimento e de financiamento.`;
    }
    const methodNote = dfcTotals.method === 'INDIRECT'
      ? ''
      : ' (soma direta dos lançamentos — balanço do ano anterior indisponível para o método indireto)';
    if (dfcTotals.fco >= 0) {
      return `A geração de caixa operacional no exercício de ${filterYear} apresentou saldo positivo de R$ ${dfcTotals.fco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}${methodNote}, demonstrando capacidade de sustentação das atividades correntes.`;
    }
    return `O fluxo de caixa operacional no exercício de ${filterYear} apresentou consumo líquido de R$ ${Math.abs(dfcTotals.fco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}${methodNote}, exigindo atenção à gestão de capital de giro e fontes de liquidez.`;
  }, [hasDfcData, dfcTotals, filterYear]);

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
      method: dfcTotals.method,
      tableRows,
      dfcTotals,
      cashIndicators,
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
