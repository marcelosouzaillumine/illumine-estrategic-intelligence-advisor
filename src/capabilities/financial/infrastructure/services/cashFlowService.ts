import { PayableEntry, ReceivableEntry, PositionEntry, EconomicAssumption, IndicatorValue, FirestoreDocument, PreComputedData } from "../../../../types/contracts";
import { persistenceContainer } from '../../../../infrastructure/container/persistenceContainer';
import { auth } from '../../../../lib/firebase';
import { DATA } from '../../../../data';

import { DataAccessContext } from '../../../../core/security/data-access-context';
import { GovernedRepositoryWrapper } from '../../../../core/security/governed-repository';

export async function generateCashFlow(context: DataAccessContext, clientId: string) {
  if (!clientId) throw new Error('Client ID is required');
  const cleanId = clientId.trim();

  // O clientId aqui é tratado como legacyTenantId/entityId transitório.
  // O wrapper garante a governança fiduciária antes da leitura.
  
  const { payables, receivables, positions } = await GovernedRepositoryWrapper.execute(context, async () => {
    return await persistenceContainer.cashFlow.getOperationalData(cleanId);
  });


  let finalPayables = [...payables];
  let finalReceivables = [...receivables];
  let finalPositions = [...positions];

  const hasRealData = payables.length > 0 || receivables.length > 0 || positions.length > 0;

  if (!hasRealData) {
    console.log("No real-time operational data found in Firestore. Returning empty cash flow projection.");
    // Removes the mock cash flow generator as per Master Architecture rules
  }

  // Get exchange rates from DATA
  const exchangeSecao = (DATA as unknown as PreComputedData).premissas?.economicas?.find((s: EconomicAssumption) => s.categoria.includes('Câmbio'));
  const usdRate = parseFloat(exchangeSecao?.indicadores?.find((i: IndicatorValue) => i.nome.includes('Dólar'))?.valor.replace('R$ ', '').replace(',', '.') || '4.9809');
  const eurRate = parseFloat(exchangeSecao?.indicadores?.find((i: IndicatorValue) => i.nome.includes('Euro'))?.valor.replace('R$ ', '').replace(',', '.') || '5.772');
  
  const exchangeRates: Record<string, number> = {
    'BRL': 1,
    'USD': usdRate,
    'EUR': eurRate
  };

  // 2. Initial Balance (Sum of current balances in financial positions converted to BRL)
  const saldoInicialTotal = finalPositions.reduce((acc: number, p: PositionEntry) => {
    const rate = exchangeRates[p.moeda as keyof typeof exchangeRates] || 1;
    return acc + ((Number(p.saldoAtual) || 0) * rate);
  }, 0);

  // 3. Prepare Daily Projections (120 days)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split('T')[0];
  
  const projections: FirestoreDocument[] = [];
  let currentSaldo = saldoInicialTotal;

  // We'll project for 360 days (1 year)
  for (let i = 0; i < 360; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];

    // Entradas: Only items due on this specific date
    const dayEntradas = finalReceivables
      .filter((r: ReceivableEntry) => r.vencimento === dateStr && r.status !== 'Pago')
      .reduce((acc: number, r: ReceivableEntry) => acc + (Number(r.valorAberto ?? r.valor) || 0), 0);

    // Saídas: Only items due on this specific date
    const daySaidas = finalPayables
      .filter((p: PayableEntry) => p.vencimento === dateStr && p.status !== 'Pago')
      .reduce((acc: number, p: PositionEntry) => acc + (Number(p.valorAberto ?? p.valor) || 0), 0);

    const saldoInicialDia = currentSaldo;
    const saldoFinalDia = saldoInicialDia + dayEntradas - daySaidas;

    projections.push({
      "Data": dateStr,
      "Saldo Inicial": saldoInicialDia,
      "Entradas": dayEntradas,
      "Saídas": daySaidas,
      "Saldo Final": saldoFinalDia
    });

    currentSaldo = saldoFinalDia;
  }

  // 4. Detailed lists for the tabs (excluding paid items)
  const contasReceber = finalReceivables
    .filter((r: ReceivableEntry) => {
      if (r.status === 'Pago') return false;
      const entity = String(r.cliente || r.entidade || '').toLowerCase();
      return entity !== 'total' && !entity.includes('total:');
    })
    .map((r: ReceivableEntry) => ({
      Vencimento: r.vencimento || '',
      Cliente: r.cliente || r.entidade || 'Desconhecido',
      Valor: Number(r.valorAberto ?? r.valor) || 0,
      Status: r.status === 'Pago' || r.status === 'Recebido' ? 'Recebido' : (r.vencimento && r.vencimento < todayStr ? 'Vencido' : (r.status || 'A vencer'))
    }))
    .sort((a, b) => (a.Vencimento || '').localeCompare(b.Vencimento || ''));

  const contasPagar = finalPayables
    .filter((p: PayableEntry) => {
      if (p.status === 'Pago') return false;
      const entity = String(p.fornecedor || p.entidade || '').toLowerCase();
      return entity !== 'total' && !entity.includes('total:');
    })
    .map((p: PayableEntry) => ({
      Vencimento: p.vencimento || '',
      Fornecedor: p.fornecedor || p.entidade || 'Desconhecido',
      Valor: Number(p.valorAberto ?? p.valor) || 0,
      Status: p.status === 'Pago' ? 'Pago' : (p.vencimento && p.vencimento < todayStr ? 'Vencido' : (p.status || 'A vencer')),
      Observação: p.categoria || ''
    }))
    .sort((a, b) => (a.Vencimento || '').localeCompare(b.Vencimento || ''));

  const passivoVencido = finalPayables
    .filter((p: PayableEntry) => {
        return p.status !== 'Pago' && p.vencimento && p.vencimento < todayStr;
    })
    .map((p: PayableEntry) => ({
      Credor: p.fornecedor || p.entidade || 'Desconhecido',
      Tipo: p.categoria || 'Operacional',
      Vencimento: p.vencimento || '',
      Valor: Number(p.valorAberto ?? p.valor) || 0
    }))
    .sort((a, b) => (a.Vencimento || '').localeCompare(b.Vencimento || ''));

  const inadimplencia = finalReceivables
    .filter((r: ReceivableEntry) => {
        return r.status !== 'Pago' && r.status !== 'Recebido' && r.vencimento && r.vencimento < todayStr;
    })
    .map((r: ReceivableEntry) => ({
      Cliente: r.cliente || r.entidade || 'Desconhecido',
      Vencimento: r.vencimento || '',
      Valor: Number(r.valorAberto ?? r.valor) || 0,
      Status: 'Vencido'
    }))
    .sort((a, b) => (a.Vencimento || '').localeCompare(b.Vencimento || ''));

  // 5. KPIs & CFO Metrics (Basic aggregations only, no predictive logic)
  const totalSaidasProjetadas = projections.reduce((acc, p) => acc + (Number(p.Saídas) || 0), 0);
  
  // CFO Strategic Metrics
  const saldosFinais = projections.map(p => Number(p["Saldo Final"]) || 0);
  const menorSaldo = Math.min(...saldosFinais);
  const dataMenorSaldo = projections.find(p => (Number(p["Saldo Final"]) || 0) === menorSaldo)?.Data || '';
  
  // Advanced CFO KPIs
  const receivables30d = projections.slice(0, 30).reduce((acc, p) => acc + (Number(p.Entradas) || 0), 0);
  const payables30d = projections.slice(0, 30).reduce((acc, p) => acc + (Number(p.Saídas) || 0), 0);
  const lcr = payables30d > 0 ? (saldoInicialTotal + receivables30d) / payables30d : 2;

  const totalReceber = contasReceber.reduce((acc, r) => acc + (Number(r.Valor) || 0), 0);
  const totalPagar = contasPagar.reduce((acc, p) => acc + (Number(p.Valor) || 0), 0);

  const kpis = [
    { "Indicador": "Burn rate médio diário", "Fórmula / Valor": "Requer Runtime Institucional", "Status": "Info" },
    { "Indicador": "Dias de caixa (Runway)", "Fórmula / Valor": "Requer Runtime Institucional", "Status": "Pendente" },
    { "Indicador": "Ponto de Caixa Mínimo", "Fórmula / Valor": menorSaldo, "Data": dataMenorSaldo, "Status": menorSaldo < 0 ? "Risco" : "OK" },
    { "Indicador": "Índice de Cobertura (LCR)", "Fórmula / Valor": lcr.toFixed(2), "Status": !hasRealData ? "Pendente" : (lcr < 1 ? "Crítico" : "Saudável") },
    { "Indicador": "Necessidade de Cap. Giro", "Fórmula / Valor": totalPagar - totalReceber, "Status": "Strategic" },
    { "Indicador": "Dias até Ruptura", "Fórmula / Valor": "Requer Runtime Institucional", "Status": "Seguro" }
  ];

  // 6. Save to Firestore/PostgreSQL via Adapter
  const cashFlowData = {
    clientId: cleanId,
    ownerId: auth.currentUser?.uid,
    Fluxo_Diario: projections,
    Contas_Receber: contasReceber,
    Contas_Pagar: contasPagar,
    Passivo_Vencido: passivoVencido,
    Inadimplencia: inadimplencia,
    KPIs: kpis,
    updatedAt: new Date().toISOString()
  };

  const writeContext: DataAccessContext = {
    ...context,
    requestedAction: 'CREATE_SNAPSHOT', // Considering this an internal system snapshot of the cash flow
    auditRequirement: true
  };

  await GovernedRepositoryWrapper.execute(writeContext, async () => {
    await persistenceContainer.cashFlow.saveCashFlow(cleanId, auth.currentUser?.uid, cashFlowData);
  });

  return cashFlowData;
}

export async function getFinancialEntries(context: DataAccessContext, clientId: string) {
  if (!clientId) throw new Error('Client ID is required');
  const cleanId = clientId.trim();

  return GovernedRepositoryWrapper.execute(context, async () => {
    const entries = await persistenceContainer.cashFlow.getFinancialEntries(cleanId);
    return entries.filter((d: FirestoreDocument) => d.status !== 'archived' && d.status !== 'pending' && d.status !== 'rejected');
  });
}

export async function getBudgets(context: DataAccessContext, clientId: string) {
  if (!clientId) throw new Error('Client ID is required');
  const cleanId = clientId.trim();

  return GovernedRepositoryWrapper.execute(context, async () => {
    const budgets = await persistenceContainer.cashFlow.getBudgets(cleanId);
    return budgets;
  });
}
