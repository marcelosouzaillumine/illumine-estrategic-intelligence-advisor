import { useState, useEffect } from 'react';
import { query, collection, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { buildBPHierarchy } from '../lib/bpEngine';
import { 
  matchFinancialKey, 
  isDocTypeBP, 
  isDocTypeDRE, 
  isDocTypeDFC, 
  isDocTypeDLPA 
} from '../utils/financialKeyNormalizer';

export interface RealKPIs {
  margemLiquida: number;
  netProfit: number;
  ebitda: number;
  roa: number;
  liquidezCorrente: number;
  revenue: number;
  ebitdaMargin: number;
  saldoCaixa: number;
  totalAssets: number;
  totalLiabilities: number;
  [key: string]: number;
}

export function useRealIndicatorData(clientId: string, month: number, year: number) {
  const [kpis, setKpis] = useState<RealKPIs>({
    margemLiquida: 0,
    netProfit: 0,
    ebitda: 0,
    roa: 0,
    liquidezCorrente: 0,
    revenue: 0,
    ebitdaMargin: 0,
    saldoCaixa: 0,
    totalAssets: 0,
    totalLiabilities: 0,
  });
  
  useEffect(() => {
    if (!clientId) return;

    // Define standard mappings for heuristic fallback
    const standardMappings: Record<string, string[]> = {
      revenue: [
        'Receita Líquida', 
        'Receita Operacional Bruta', 
        'Faturamento', 
        'Receita de Vendas',
        'Receita Operacional Líquida',
        'Receita Operacional Liquida'
      ],
      ebitda: [
        'EBITDA', 
        'LAJIDA'
      ],
      netProfit: [
        'Lucro Líquido', 
        'Resultado Líquido',
        'Lucro Líquido do Exercício',
        'Lucro Liquido do Exercício',
        'Lucro Liquido do Exercicio',
        'Resultado do Exercício',
        'Resultado do Exercicio',
        'Lucro/Prejuízo do Exercício',
        'Lucro ou Prejuízo do Exercício',
        'Prejuízo do Exercício',
        'Prejuizo do Exercicio',
        'Prejuízo Líquido do Exercício',
        'Prejuizo Liquido do Exercicio'
      ],
      liquidezCorrente: [
        'Liquidez Corrente'
      ],
      saldoCaixa: [
        'Saldo em Caixa', 
        'Caixa e Equivalentes', 
        'Disponibilidades', 
        'Bancos', 
        'Conta Corrente',
        'Caixa e Equivalentes de Caixa',
        'Bens Numerários',
        'Bens Numerarios',
        'Depósitos Bancários',
        'Depositos Bancarios',
        'Aplicações',
        'Aplicacoes'
      ],
      totalAssets: [
        'Ativo', 
        'Ativo Total', 
        'Total de Ativos'
      ],
      totalLiabilities: [
        'Passivo', 
        'Passivo Total', 
        'Total de Passivos', 
        'Total do Passivo'
      ],
      equity: [
        'Patrimônio Líquido', 
        'PL', 
        'Patrimônio',
        'Patrimonio Liquido'
      ],
    };

    const rates = { USD: 5.10, EUR: 5.50, BRL: 1 };

    // Set up all queries
    const qAcc = query(collection(db, 'account_plans'), where('clientId', '==', clientId));
    const entriesConstraints = [
      where('clientId', '==', clientId),
      where('year', '==', year)
    ];
    // Removed month from query constraint to allow fetching annual data (without month).
    const qEntries = query(collection(db, 'financial_entries'), ...entriesConstraints);
    const qAssets = query(collection(db, 'assets'), where('clientId', '==', clientId));
    const qCashFlows = query(collection(db, 'cash_flows'), where('clientId', '==', clientId));
    const qPositions = query(collection(db, 'financial_positions'), where('clientId', '==', clientId));
    const qPayables = query(collection(db, 'payables'), where('clientId', '==', clientId));
    const qReceivables = query(collection(db, 'receivables'), where('clientId', '==', clientId));

    // State for local aggregation
    let mappedAccounts: any[] = [];
    let allEntries: any[] = [];
    let currentAssets: any[] = [];
    let currentCashFlows: any[] = [];
    let currentPositions: any[] = [];
    let currentPayables: any[] = [];
    let currentReceivables: any[] = [];

    const calculateAll = () => {
      const calculated: RealKPIs = {
        margemLiquida: 0, netProfit: 0, ebitda: 0, roa: 0, liquidezCorrente: 0, revenue: 0, ebitdaMargin: 0, saldoCaixa: 0, totalAssets: 0, totalLiabilities: 0
      };

      // A. Process via manual mappings
      mappedAccounts.forEach((acc: any) => {
        const sum = allEntries
          .filter((e: any) => e.category === acc.name)
          .reduce((s: number, e: any) => s + (Number(e.value) || 0), 0);
        
        if (!calculated[acc.kpiMapping]) calculated[acc.kpiMapping] = 0;
        calculated[acc.kpiMapping] += sum;
      });

      // Align manual mappings to internal keys
      if (calculated.receita_liquida) calculated.revenue = calculated.receita_liquida;
      if (calculated.lucro_liquido) calculated.netProfit = calculated.lucro_liquido;
      if (calculated.disponibilidades) calculated.saldoCaixa = calculated.disponibilidades;
      if (calculated.ativo_circulante) calculated.totalAssets = calculated.ativo_circulante;
      if (calculated.passivo_circulante) calculated.totalLiabilities = calculated.passivo_circulante;

      // B. Process via standard names heuristic with normalized matching and context checks
      Object.entries(standardMappings).forEach(([kpi, names]) => {
        if (calculated[kpi] === 0) {
          const sum = allEntries
            .filter((e: any) => {
              const docType = e.docType || '';
              // 3. Separar aliases por demonstração
              if (kpi === 'revenue' || kpi === 'ebitda') {
                if (!isDocTypeDRE(docType)) return false;
              } else if (kpi === 'netProfit') {
                if (!isDocTypeDRE(docType) && !isDocTypeDLPA(docType)) return false;
              } else if (kpi === 'saldoCaixa') {
                if (!isDocTypeBP(docType) && !isDocTypeDFC(docType)) return false;
              } else if (['totalAssets', 'totalLiabilities', 'equity', 'liquidezCorrente'].includes(kpi)) {
                if (!isDocTypeBP(docType)) return false;
              }

              // Also enforce row type check for BP to prevent false positives:
              if (isDocTypeBP(docType)) {
                const rowType = (e.type || '').toLowerCase();
                if (kpi === 'totalAssets' && rowType !== 'ativo') return false;
                if (kpi === 'totalLiabilities' && rowType !== 'passivo') return false;
                if (kpi === 'equity' && !['patrimônio líquido', 'pl', 'patrimonio liquido'].includes(rowType)) return false;
              }

              return matchFinancialKey(e.category || e.conta || '', names);
            })
            .reduce((s: number, e: any) => s + (Number(e.value || e.valor || e.val) || 0), 0);
          calculated[kpi] = sum;
        }
      });

      // Cálculo de EBITDA e NetProfit movido para OrchestrationEngine.

      // C. Strategic Financial Position (Current balances)
      let bankSum = currentPositions.reduce((s, p) => s + ((Number(p.saldoAtual) || 0) * (rates[p.moeda as keyof typeof rates] || 1)), 0);
      let assetsSum = currentAssets.reduce((s, a) => s + (Number(a.value) || Number(a.currentValue) || 0), 0);
      let receivablesSum = currentReceivables
        .filter(r => r.status !== 'Recebido' && r.status !== 'Cancelado')
        .reduce((s, r) => s + (Number(r.valor) || Number(r.Valor) || 0), 0);
      
      let cashFlowSum = 0;
      let overdueLiabilities = 0;

      if (currentCashFlows.length > 0) {
        const flowDoc = currentCashFlows[0];
        const flow = flowDoc.Fluxo_Diario || [];
        if (flow.length > 0) cashFlowSum = Number(flow[flow.length - 1]['Saldo Final']) || 0;
        
        // Overdue liabilities from cash flow doc
        const passivo = flowDoc.Passivo_Vencido || [];
        overdueLiabilities = passivo.reduce((s: number, p: any) => s + (Number(p.Valor) || 0), 0);
      }

      // Current Payables (not yet paid)
      const payablesSum = currentPayables
        .filter(p => p.status !== 'Pago' && p.status !== 'Finalizado')
        .reduce((s, p) => s + (Number(p.valor) || Number(p.Valor) || 0), 0);

      // BP Engine Processing (Reliable asset extraction from manual entries)
      const bpEntries = allEntries.filter((e: any) => {
        const docType = e.docType || '';
        if (!isDocTypeBP(docType)) return false;
        return e.type === 'ativo' || e.type === 'passivo' || e.type === 'patrimônio líquido' || e.type === 'pl';
      });
      const bpSummary = bpEntries.length > 0 ? buildBPHierarchy(bpEntries).summary : null;

      // Final Indicators
      const dynamicBankSum = bankSum > 0 ? bankSum : (assetsSum + cashFlowSum);
      calculated.saldoCaixa = dynamicBankSum > 0 ? dynamicBankSum : (bpSummary?.caixaEquivalentes || calculated.saldoCaixa);
      
      // GESTÃO DE ATIVOS: Gestão de Ativos (Investimentos) + Saldo Atual de Caixa (Bancos) + Contas a receber (A vencer e Vencidos)
      const dynamicAssets = assetsSum + bankSum + receivablesSum;
      calculated.totalAssets = dynamicAssets > 0 ? dynamicAssets : (bpSummary?.ativoTotal || calculated.totalAssets);
      
      // GESTÃO DE PASSIVOS: Contas a Pagar + Passivo Vencido
      const dynamicLiabilities = payablesSum + overdueLiabilities;
      calculated.totalLiabilities = dynamicLiabilities > 0 ? dynamicLiabilities : (bpSummary?.passivoTotal || calculated.totalLiabilities);

      // D. Derived Metrics
      if (calculated.revenue > 0) {
        calculated.margemLiquida = (calculated.netProfit / calculated.revenue) * 100;
        calculated.ebitdaMargin = (calculated.ebitda / calculated.revenue) * 100;
      }

      setKpis(calculated);
    };

    // Set up all listeners
    const unsubs = [
      onSnapshot(qAcc, snap => { mappedAccounts = snap.docs.map(d => d.data()).filter(d => d.kpiMapping); calculateAll(); }),
      onSnapshot(qEntries, snap => {
        allEntries = [];
        snap.docs.forEach(doc => {
          const data = doc.data();
          if (data.status === 'archived' || data.status === 'rejected') return;
          if (month > 0 && data.month !== undefined && data.month !== 0 && data.month !== month) return;
          if (Array.isArray(data.data)) {
            data.data.forEach((entry: any) => {
              allEntries.push({
                ...entry,
                docType: data.type
              });
            });
          } else if (data.category && data.value !== undefined) {
            allEntries.push({
              ...data,
              docType: data.type
            });
          }
        });
        calculateAll();
      }),
      onSnapshot(qAssets, snap => { currentAssets = snap.docs.map(d => d.data()); calculateAll(); }),
      onSnapshot(qCashFlows, snap => { currentCashFlows = snap.docs.map(d => d.data()); calculateAll(); }),
      onSnapshot(qPositions, snap => { currentPositions = snap.docs.map(d => d.data()); calculateAll(); }),
      onSnapshot(qPayables, snap => { currentPayables = snap.docs.map(d => d.data()); calculateAll(); }),
      onSnapshot(qReceivables, snap => { currentReceivables = snap.docs.map(d => d.data()); calculateAll(); }),
    ];

    return () => unsubs.forEach(unsub => unsub());
  }, [clientId, year, month]);

  return { kpis };
}
