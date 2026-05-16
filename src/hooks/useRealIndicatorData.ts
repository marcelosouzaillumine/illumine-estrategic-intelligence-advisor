import { useState, useEffect } from 'react';
import { query, collection, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface RealKPIs {
  margemLiquida: number;
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
      revenue: ['Receita Líquida', 'Receita Operacional Bruta', 'Faturamento', 'Receita de Vendas'],
      ebitda: ['EBITDA', 'LAJIDA'],
      margemLiquida: ['Lucro Líquido', 'Resultado Líquido'],
      liquidezCorrente: ['Liquidez Corrente'],
      saldoCaixa: ['Saldo em Caixa', 'Caixa e Equivalentes', 'Disponibilidades', 'Bancos', 'Conta Corrente'],
    };

    const rates = { USD: 5.10, EUR: 5.50, BRL: 1 };

    // Set up all queries
    const qAcc = query(collection(db, 'account_plans'), where('clientId', '==', clientId));
    const qEntries = query(collection(db, 'financial_entries'), where('clientId', '==', clientId), where('year', '==', year), where('month', '==', month));
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
        margemLiquida: 0, ebitda: 0, roa: 0, liquidezCorrente: 0, revenue: 0, ebitdaMargin: 0, saldoCaixa: 0, totalAssets: 0, totalLiabilities: 0
      };

      // A. Process via manual mappings
      mappedAccounts.forEach((acc: any) => {
        const sum = allEntries
          .filter((e: any) => e.category === acc.name)
          .reduce((s: number, e: any) => s + (Number(e.value) || 0), 0);
        
        if (!calculated[acc.kpiMapping]) calculated[acc.kpiMapping] = 0;
        calculated[acc.kpiMapping] += sum;
      });

      // B. Process via standard names heuristic
      Object.entries(standardMappings).forEach(([kpi, names]) => {
        if (calculated[kpi] === 0) {
          const sum = allEntries
            .filter((e: any) => names.includes(e.category))
            .reduce((s: number, e: any) => s + (Number(e.value) || 0), 0);
          calculated[kpi] = sum;
        }
      });

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

      // Final Indicators
      calculated.saldoCaixa = bankSum > 0 ? bankSum : (assetsSum + cashFlowSum);
      
      // GESTÃO DE ATIVOS: Gestão de Ativos (Investimentos) + Saldo Atual de Caixa (Bancos) + Contas a receber (A vencer e Vencidos)
      calculated.totalAssets = assetsSum + bankSum + receivablesSum;
      
      // GESTÃO DE PASSIVOS: Contas a Pagar + Passivo Vencido
      calculated.totalLiabilities = payablesSum + overdueLiabilities;

      // D. Derived Metrics
      if (calculated.revenue > 0) {
        calculated.margemLiquida = (calculated.margemLiquida / calculated.revenue) * 100;
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
          if (Array.isArray(data.data)) allEntries.push(...data.data);
          else if (data.category && data.value !== undefined) allEntries.push(data);
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
